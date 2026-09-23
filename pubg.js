```javascript
// ============================================================
// CHAPCY PUBG LIVE CHAT
// Firebase Realtime Database + XAMPP/MySQL
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    push,
    onChildAdded,
    serverTimestamp,
    set,
    onDisconnect
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyDIID2LpzjLiLeLJKgp-Vd7tNIyN-M1k",
    authDomain: "rko-website-design-2f792.firebaseapp.com",
    databaseURL: "https://rko-website-design-2f792-default-rtdb.firebaseio.com",
    projectId: "rko-website-design-2f792",
    storageBucket: "rko-website-design-2f792.firebasestorage.app",
    messagingSenderId: "782567629866",
    appId: "1:782567629866:web:d6d80d454d0653ea8b4f53",
    measurementId: "G-KQ1EKYE7E7"
};


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


// ============================================================
// SETTINGS
// ============================================================

const ROOM_NAME = "pubg";

const FIREBASE_MESSAGES_PATH = `rooms/${ROOM_NAME}/messages`;

const PHP_ENDPOINT =
    "http://localhost/chapcy/save-pubg-message.php";


// ============================================================
// DOM
// ============================================================

const messagesBox =
    document.getElementById("messages");

const emptyChat =
    document.getElementById("emptyChat");

const typing =
    document.getElementById("typing");

const composer =
    document.getElementById("composer");

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

const emojiBtn =
    document.getElementById("emojiBtn");

const emojiPanel =
    document.getElementById("emojiPanel");

const addBtn =
    document.getElementById("addBtn");

const searchBtn =
    document.getElementById("searchBtn");

const searchBox =
    document.getElementById("searchBox");

const roomInfoBtn =
    document.getElementById("roomInfoBtn");

const roomInfoPanel =
    document.getElementById("roomInfoPanel");

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

const mobileOverlay =
    document.getElementById("mobileOverlay");

const logoutBtn =
    document.getElementById("logoutBtn");


// ============================================================
// CURRENT USER
// ============================================================

let currentUser = null;


// ============================================================
// AUTH STATE
// ============================================================

onAuthStateChanged(auth, (user) => {

    currentUser = user;

    if (user) {

        console.log(
            "PUBG USER LOGGED IN:",
            user.uid
        );

        setupPresence(user);

    } else {

        console.log(
            "PUBG CHAT: No Firebase user logged in."
        );

    }

});


// ============================================================
// PRESENCE
// ============================================================

function setupPresence(user) {

    const userPresenceRef =
        ref(db, `presence/${user.uid}`);

    set(userPresenceRef, {
        online: true,
        room: ROOM_NAME,
        lastSeen: serverTimestamp()
    })
    .catch(error => {
        console.error(
            "Presence error:",
            error
        );
    });

    onDisconnect(userPresenceRef)
        .set({
            online: false,
            room: ROOM_NAME,
            lastSeen: serverTimestamp()
        })
        .catch(error => {
            console.error(
                "Presence disconnect error:",
                error
            );
        });
}


// ============================================================
// LOAD REALTIME MESSAGES
// ============================================================

const messagesRef =
    ref(db, FIREBASE_MESSAGES_PATH);

onChildAdded(messagesRef, (snapshot) => {

    const data = snapshot.val();

    if (!data) return;

    renderMessage(data);

});


// ============================================================
// RENDER MESSAGE
// ============================================================

function renderMessage(data) {

    if (!messagesBox) return;

    if (emptyChat) {
        emptyChat.style.display = "none";
    }

    const row =
        document.createElement("div");

    row.className = "message-row";

    const bubble =
        document.createElement("div");

    bubble.className = "message-bubble";


    // Own message
    if (
        currentUser &&
        data.uid === currentUser.uid
    ) {

        row.classList.add("own");

    }


    const name =
        document.createElement("div");

    name.className = "message-name";

    name.textContent =
        data.name || "CHAPCY User";


    const text =
        document.createElement("div");

    text.className = "message-text";

    text.textContent =
        data.message || "";


    const time =
        document.createElement("div");

    time.className = "message-time";

    time.textContent =
        formatTime(data.createdAt);


    bubble.appendChild(name);
    bubble.appendChild(text);
    bubble.appendChild(time);

    row.appendChild(bubble);

    messagesBox.appendChild(row);

    scrollToBottom();
}


// ============================================================
// FORMAT TIME
// ============================================================

function formatTime(timestamp) {

    let date;

    if (
        timestamp &&
        typeof timestamp === "number"
    ) {

        date = new Date(timestamp);

    } else {

        date = new Date();

    }

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

}


// ============================================================
// SEND MESSAGE
// ============================================================

if (composer) {

    composer.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            await sendMessage();

        }
    );

}


// ============================================================
// SEND FUNCTION
// ============================================================

async function sendMessage() {

    const message =
        messageInput.value.trim();

    if (!message) return;


    // Prevent double click
    sendBtn.disabled = true;


    try {

        // ----------------------------------------------------
        // CHECK LOGIN
        // ----------------------------------------------------

        if (!currentUser) {

            alert(
                "Tafadhali login kwanza ili utume ujumbe."
            );

            sendBtn.disabled = false;

            return;
        }


        // ----------------------------------------------------
        // USER DETAILS
        // ----------------------------------------------------

        const name =
            currentUser.displayName ||
            currentUser.email ||
            currentUser.phoneNumber ||
            "CHAPCY User";

        const phone =
            currentUser.phoneNumber || "";


        // ----------------------------------------------------
        // FIREBASE
        // ----------------------------------------------------

        const newMessageRef =
            push(messagesRef);


        await set(newMessageRef, {

            uid: currentUser.uid,

            name: name,

            phone: phone,

            room: ROOM_NAME,

            message: message,

            createdAt: serverTimestamp()

        });


        // ----------------------------------------------------
        // SAVE TO XAMPP / MYSQL
        // ----------------------------------------------------

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

                        body: JSON.stringify({

                            firebase_uid:
                                currentUser.uid,

                            name: name,

                            phone: phone,

                            room: ROOM_NAME,

                            message: message

                        })
                    }
                );


            const result =
                await response.json();

            console.log(
                "XAMPP RESPONSE:",
                result
            );


            if (!result.success) {

                console.warn(
                    "Message saved to Firebase but not MySQL:",
                    result.message
                );

            }

        } catch (phpError) {

            console.warn(
                "XAMPP connection failed:",
                phpError
            );

        }


        // ----------------------------------------------------
        // CLEAR INPUT
        // ----------------------------------------------------

        messageInput.value = "";

        messageInput.focus();

        scrollToBottom();

    } catch (error) {

        console.error(
            "PUBG SEND ERROR:",
            error
        );

        alert(
            "Ujumbe haukutumwa. Angalia Firebase Rules au connection."
        );

    } finally {

        sendBtn.disabled = false;

    }

}


// ============================================================
// ENTER TO SEND
// ============================================================

if (messageInput) {

    messageInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                composer.requestSubmit();

            }

        }
    );

}


// ============================================================
// EMOJI
// ============================================================

if (emojiBtn && emojiPanel) {

    emojiBtn.addEventListener(
        "click",
        () => {

            emojiPanel.classList.toggle(
                "show"
            );

        }
    );


    const emojiButtons =
        emojiPanel.querySelectorAll(
            "button"
        );


    emojiButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const emoji =
                    button.textContent;

                messageInput.value += emoji;

                messageInput.focus();

            }
        );

    });

}


// ============================================================
// CLOSE EMOJI WHEN CLICKING OUTSIDE
// ============================================================

document.addEventListener(
    "click",
    (event) => {

        if (
            emojiPanel &&
            emojiBtn &&
            !emojiPanel.contains(event.target) &&
            !emojiBtn.contains(event.target)
        ) {

            emojiPanel.classList.remove(
                "show"
            );

        }

    }
);


// ============================================================
// SEARCH
// ============================================================

if (searchBtn && searchBox) {

    searchBtn.addEventListener(
        "click",
        () => {

            searchBox.classList.toggle(
                "show"
            );

            if (
                searchBox.classList.contains(
                    "show"
                )
            ) {

                const input =
                    searchBox.querySelector(
                        "input"
                    );

                if (input) {
                    input.focus();
                }

            }

        }
    );


    const searchInput =
        searchBox.querySelector("input");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                const messageRows =
                    messagesBox.querySelectorAll(
                        ".message-row"
                    );


                messageRows.forEach(row => {

                    const text =
                        row.textContent
                            .toLowerCase();


                    if (
                        !query ||
                        text.includes(query)
                    ) {

                        row.style.display =
                            "";

                    } else {

                        row.style.display =
                            "none";

                    }

                });

            }
        );

    }

}


// ============================================================
// ROOM INFO
// ============================================================

if (roomInfoBtn && roomInfoPanel) {

    roomInfoBtn.addEventListener(
        "click",
        () => {

            roomInfoPanel.classList.toggle(
                "show"
            );

        }
    );

}


// ============================================================
// ADD BUTTON
// ============================================================

if (addBtn) {

    addBtn.addEventListener(
        "click",
        () => {

            alert(
                "📎 Attachments feature will be added soon."
            );

        }
    );

}


// ============================================================
// MOBILE MENU
// ============================================================

function openMobileMenu() {

    if (sidebar) {
        sidebar.classList.add("open");
    }

    if (mobileOverlay) {
        mobileOverlay.classList.add("show");
    }

}


function closeMobileMenu() {

    if (sidebar) {
        sidebar.classList.remove("open");
    }

    if (mobileOverlay) {
        mobileOverlay.classList.remove("show");
    }

}


if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        openMobileMenu
    );

}


if (mobileOverlay) {

    mobileOverlay.addEventListener(
        "click",
        closeMobileMenu
    );

}


// ============================================================
// CLOSE SIDEBAR WHEN CLICKING NAV LINK
// ============================================================

if (sidebar) {

    const navLinks =
        sidebar.querySelectorAll(
            "a"
        );

    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                closeMobileMenu();

            }
        );

    });

}


// ============================================================
// LOGOUT
// ============================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                window.location.href =
                    "login.html";

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

                alert(
                    "Logout imeshindikana."
                );

            }

        }
    );

}


// ============================================================
// SCROLL TO BOTTOM
// ============================================================

function scrollToBottom() {

    if (!messagesBox) return;

    setTimeout(() => {

        messagesBox.scrollTop =
            messagesBox.scrollHeight;

    }, 50);

}


// ============================================================
// INITIAL
// ============================================================

console.log(
    "🔥 CHAPCY PUBG LIVE CHAT JS STARTED"
);

console.log(
    "📡 Firebase Room:",
    FIREBASE_MESSAGES_PATH
);

console.log(
    "🗄️ XAMPP Endpoint:",
    PHP_ENDPOINT
);
```
