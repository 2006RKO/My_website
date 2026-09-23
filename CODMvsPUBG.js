/* =========================================================
   CHAPCY — CODM LIVE CHAT
   CODMvsPUBG.js

   Firebase Realtime Database
   + XAMPP / PHP
   + MySQL

   Firebase room:
   rooms/codm/messages
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    push,
    set,
    onValue,
    onChildAdded,
    serverTimestamp,
    onDisconnect
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

    apiKey: "AIzaSyDIID2LpzjLiLeLJKgp-Vd7tNIyN-M1k",

    authDomain:
        "rko-website-design-2f792.firebaseapp.com",

    databaseURL:
        "https://rko-website-design-2f792-default-rtdb.firebaseio.com",

    projectId:
        "rko-website-design-2f792",

    storageBucket:
        "rko-website-design-2f792.firebasestorage.app",

    messagingSenderId:
        "782567629866",

    appId:
        "1:782567629866:web:d6d80d454d0653ea8b4f53",

    measurementId:
        "G-KQ1EKYE7E7"
};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app);


/* =========================================================
   CONFIG
========================================================= */

const ROOM_NAME = "codm";

const PHP_ENDPOINT =
    "http://localhost/chapcy/save-codm-message.php";


/* =========================================================
   DOM
========================================================= */

const sideNav =
    document.getElementById("sideNav");

const mobileOverlay =
    document.getElementById("mobileOverlay");

const menuBtn =
    document.getElementById("menuBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const profileName =
    document.getElementById("profileName");

const profileLetter =
    document.getElementById("profileLetter");

const composer =
    document.getElementById("composer");

const messageInput =
    document.getElementById("messageInput");

const messages =
    document.getElementById("messages");

const emptyChat =
    document.getElementById("emptyChat");

const emojiBtn =
    document.getElementById("emojiBtn");

const emojiPanel =
    document.getElementById("emojiPanel");

const searchBtn =
    document.getElementById("searchBtn");

const searchBox =
    document.getElementById("searchBox");

const searchInput =
    document.getElementById("searchInput");

const roomInfoBtn =
    document.getElementById("roomInfoBtn");

const roomInfoPanel =
    document.getElementById("roomInfoPanel");

const addBtn =
    document.getElementById("addBtn");


/* =========================================================
   USER DATA
========================================================= */

let currentUser = null;

let currentUserName = "CHAPCY Gamer";

let loadedMessageIds = new Set();


/* =========================================================
   MOBILE MENU
========================================================= */

function openMenu() {

    sideNav?.classList.add("open");

    mobileOverlay?.classList.add("show");
}

function closeMenu() {

    sideNav?.classList.remove("open");

    mobileOverlay?.classList.remove("show");
}

menuBtn?.addEventListener(
    "click",
    openMenu
);

mobileOverlay?.addEventListener(
    "click",
    closeMenu
);


/* =========================================================
   CLOSE MENU WHEN NAV LINK CLICKED
========================================================= */

document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (
                    window.innerWidth <= 760
                ) {
                    closeMenu();
                }

            }
        );

    });


/* =========================================================
   AUTH
========================================================= */

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            currentUser = null;

            currentUserName =
                "CHAPCY Gamer";

            if (profileName) {
                profileName.textContent =
                    "Guest";
            }

            if (profileLetter) {
                profileLetter.textContent =
                    "?";
            }

            /*
             * Do NOT redirect automatically.
             *
             * This allows the page design
             * to remain visible.
             */

            return;
        }


        currentUser = user;


        /* USERNAME */

        currentUserName =
            user.displayName ||
            user.email ||
            user.phoneNumber ||
            "CHAPCY Gamer";


        if (profileName) {

            profileName.textContent =
                currentUserName;

        }


        if (profileLetter) {

            profileLetter.textContent =
                currentUserName
                    .charAt(0)
                    .toUpperCase();

        }


        /* PRESENCE */

        setupPresence(user.uid);

    }
);


/* =========================================================
   PRESENCE
========================================================= */

function setupPresence(uid) {

    const connectedRef =
        ref(db, ".info/connected");

    const userStatusRef =
        ref(
            db,
            `presence/${uid}`
        );


    onValue(
        connectedRef,
        snapshot => {

            if (
                snapshot.val() !== true
            ) {
                return;
            }


            onDisconnect(
                userStatusRef
            )
                .set({
                    state: "offline",
                    last_changed:
                        serverTimestamp()
                });


            set(
                userStatusRef,
                {
                    state: "online",
                    last_changed:
                        serverTimestamp()
                }
            );

        }
    );

}


/* =========================================================
   LOAD LIVE CHAT
========================================================= */

const messagesRef =
    ref(
        db,
        `rooms/${ROOM_NAME}/messages`
    );


onChildAdded(
    messagesRef,
    snapshot => {

        const data =
            snapshot.val();

        if (!data) {
            return;
        }


        if (
            loadedMessageIds.has(
                snapshot.key
            )
        ) {
            return;
        }


        loadedMessageIds.add(
            snapshot.key
        );


        renderMessage(
            data,
            snapshot.key
        );

    }
);


/* =========================================================
   SEND MESSAGE
========================================================= */

composer?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const text =
            messageInput
                ?.value
                ?.trim();


        if (!text) {
            return;
        }


        if (text.length > 2000) {

            alert(
                "Message is too long."
            );

            return;
        }


        /*
         * If Firebase Auth is not available,
         * allow the interface to remain usable.
         */

        const uid =
            currentUser?.uid ||
            "guest-" +
            Date.now();


        const name =
            currentUserName ||
            "CHAPCY Gamer";


        const messageData = {

            uid: uid,

            name: name,

            message: text,

            room: ROOM_NAME,

            createdAt:
                serverTimestamp()

        };


        try {

            /* FIREBASE */

            const newMessage =
                push(messagesRef);


            await set(
                newMessage,
                messageData
            );


            /* XAMPP / MYSQL */

            await saveToPHP({
                firebase_uid: uid,
                name: name,
                phone:
                    currentUser?.phoneNumber ||
                    "",
                room: ROOM_NAME,
                message: text
            });


            messageInput.value = "";

            messageInput.focus();


        } catch (error) {

            console.error(
                "Send message error:",
                error
            );


            alert(
                "Message failed to send. Check Firebase or XAMPP."
            );

        }

    }
);


/* =========================================================
   SAVE MESSAGE TO PHP / MYSQL
========================================================= */

async function saveToPHP(data) {

    try {

        const response =
            await fetch(
                PHP_ENDPOINT,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );


        if (!response.ok) {

            throw new Error(
                "PHP server returned " +
                response.status
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            console.warn(
                "MySQL save:",
                result.message
            );

        }


    } catch (error) {

        /*
         * Firebase message has already
         * been saved. PHP/MySQL failure
         * should not remove the Firebase
         * message.
         */

        console.warn(
            "XAMPP/MySQL unavailable:",
            error
        );

    }

}


/* =========================================================
   RENDER MESSAGE
========================================================= */

function renderMessage(
    data,
    messageId
) {

    if (!messages) {
        return;
    }


    if (emptyChat) {

        emptyChat.style.display =
            "none";

    }


    const message =
        document.createElement(
            "div"
        );

    message.className =
        "message";


    message.dataset.messageId =
        messageId;


    /* AVATAR */

    const avatar =
        document.createElement(
            "div"
        );

    avatar.className =
        "message-avatar";


    const name =
        data.name ||
        "CHAPCY Gamer";


    avatar.textContent =
        name
            .charAt(0)
            .toUpperCase();


    /* CONTENT */

    const content =
        document.createElement(
            "div"
        );

    content.className =
        "message-content";


    /* META */

    const meta =
        document.createElement(
            "div"
        );

    meta.className =
        "message-meta";


    const nameElement =
        document.createElement(
            "span"
        );

    nameElement.className =
        "message-name";

    nameElement.textContent =
        name;


    const time =
        document.createElement(
            "span"
        );

    time.className =
        "message-time";

    time.textContent =
        formatMessageTime(
            data.createdAt
        );


    meta.appendChild(
        nameElement
    );

    meta.appendChild(
        time
    );


    /* TEXT */

    const text =
        document.createElement(
            "div"
        );

    text.className =
        "message-text";

    text.textContent =
        data.message || "";


    content.appendChild(
        meta
    );

    content.appendChild(
        text
    );


    message.appendChild(
        avatar
    );

    message.appendChild(
        content
    );


    messages.appendChild(
        message
    );


    scrollToBottom();

}


/* =========================================================
   MESSAGE TIME
========================================================= */

function formatMessageTime(
    timestamp
) {

    if (
        !timestamp ||
        typeof timestamp !== "number"
    ) {
        return "now";
    }


    const date =
        new Date(timestamp);


    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   SCROLL
========================================================= */

function scrollToBottom() {

    if (!messages) {
        return;
    }

    messages.scrollTop =
        messages.scrollHeight;

}


/* =========================================================
   EMOJI
========================================================= */

emojiBtn?.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        emojiPanel?.classList.toggle(
            "show"
        );

    }
);


document
    .querySelectorAll(
        "#emojiPanel button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const emoji =
                    button.textContent;

                const start =
                    messageInput.selectionStart;

                const end =
                    messageInput.selectionEnd;

                const value =
                    messageInput.value;


                messageInput.value =
                    value.substring(
                        0,
                        start
                    ) +
                    emoji +
                    value.substring(
                        end
                    );


                messageInput.focus();


                messageInput.selectionStart =
                    start +
                    emoji.length;

                messageInput.selectionEnd =
                    start +
                    emoji.length;

            }
        );

    });


/* =========================================================
   CLOSE EMOJI PANEL
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            emojiPanel &&
            !emojiPanel.contains(
                event.target
            ) &&
            event.target !== emojiBtn
        ) {

            emojiPanel.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================================
   SEARCH BUTTON
========================================================= */

searchBtn?.addEventListener(
    "click",
    () => {

        searchBox?.classList.toggle(
            "show"
        );


        if (
            searchBox?.classList.contains(
                "show"
            )
        ) {

            searchInput?.focus();

        } else {

            clearSearch();

        }

    }
);


/* =========================================================
   SEARCH MESSAGES
========================================================= */

searchInput?.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        const allMessages =
            document.querySelectorAll(
                ".message"
            );


        allMessages.forEach(
            message => {

                const text =
                    message.textContent
                        .toLowerCase();


                if (
                    !query ||
                    text.includes(query)
                ) {

                    message.style.display =
                        "";

                } else {

                    message.style.display =
                        "none";

                }

            }
        );

    }
);


function clearSearch() {

    if (searchInput) {
        searchInput.value = "";
    }


    document
        .querySelectorAll(
            ".message"
        )
        .forEach(
            message => {

                message.style.display =
                    "";

            }
        );

}


/* =========================================================
   ROOM INFO
========================================================= */

roomInfoBtn?.addEventListener(
    "click",
    () => {

        roomInfoPanel?.classList.toggle(
            "show"
        );

    }
);


/* =========================================================
   ADD BUTTON
========================================================= */

addBtn?.addEventListener(
    "click",
    () => {

        alert(
            "More CODM chat features will be added here."
        );

    }
);


/* =========================================================
   ENTER TO SEND
========================================================= */

messageInput?.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            composer?.requestSubmit();

        }

    }
);


/* =========================================================
   LOGOUT
========================================================= */

logoutBtn?.addEventListener(
    "click",
    async () => {

        const confirmed =
            confirm(
                "Logout from CHAPCY?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await signOut(auth);

            closeMenu();

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

            alert(
                "Logout failed."
            );

        }

    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeMenu();

            emojiPanel?.classList.remove(
                "show"
            );

            roomInfoPanel?.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 760
        ) {

            closeMenu();

        }

    }
);


/* =========================================================
   START
========================================================= */

console.log(
    "CHAPCY CODM Live Chat loaded."
);

console.log(
    "Firebase room:",
    `rooms/${ROOM_NAME}/messages`
);

console.log(
    "PHP endpoint:",
    PHP_ENDPOINT
);
```
