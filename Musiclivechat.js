/* =========================================================
   CHAPCY MUSIC GROUP
   MUSIC LIVE CHAT
   FIREBASE REALTIME DATABASE
========================================================= */

import {
    auth,
    db
} from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    ref,
    push,
    set,
    query,
    orderByChild,
    onChildAdded,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


/* =========================================================
   ELEMENTS
========================================================= */

const sideNav =
    document.getElementById("sideNav");

const mobileOverlay =
    document.getElementById("mobileOverlay");

const menuBtn =
    document.getElementById("menuBtn");

const profileName =
    document.getElementById("profileName");

const profileLetter =
    document.getElementById("profileLetter");

const logoutBtn =
    document.getElementById("logoutBtn");

const messages =
    document.getElementById("messages");

const emptyChat =
    document.getElementById("emptyChat");

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

const searchToggle =
    document.getElementById("searchToggle");

const searchPanel =
    document.getElementById("searchPanel");

const messageSearch =
    document.getElementById("messageSearch");

const clearSearch =
    document.getElementById("clearSearch");

const roomInfoBtn =
    document.getElementById("roomInfoBtn");

const roomInfoPanel =
    document.getElementById("roomInfoPanel");

const closeRoomInfo =
    document.getElementById("closeRoomInfo");

const typingText =
    document.getElementById("typingText");


/* =========================================================
   MUSIC FIREBASE ROOM
========================================================= */

const musicMessagesRef = query(
    ref(db, "rooms/music/messages"),
    orderByChild("createdAt")
);


/* =========================================================
   CURRENT USER
========================================================= */

let currentUser = null;


/* =========================================================
   GET USER NAME
========================================================= */

function getUserName() {

    if (!currentUser) {
        return "CHAPCY User";
    }

    return (
        currentUser.displayName ||
        currentUser.email?.split("@")[0] ||
        "CHAPCY User"
    );
}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;
    }


    currentUser = user;


    const name = getUserName();


    profileName.textContent =
        name;


    profileLetter.textContent =
        name
            .charAt(0)
            .toUpperCase();


    messageInput.focus();

});


/* =========================================================
   MOBILE MENU
========================================================= */

function openMobileMenu() {

    sideNav.classList.add("open");

    mobileOverlay.classList.add("show");

}


function closeMobileMenu() {

    sideNav.classList.remove("open");

    mobileOverlay.classList.remove("show");

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


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                window.location.href =
                    "index.html";

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}


/* =========================================================
   CREATE MESSAGE
========================================================= */

function createMessage(message) {

    if (!message) {
        return;
    }


    if (emptyChat) {

        emptyChat.style.display =
            "none";

    }


    const article =
        document.createElement("article");


    article.className =
        "chat-message";


    if (
        currentUser &&
        message.userId === currentUser.uid
    ) {

        article.classList.add("own");

    }


    /* =========================================
       AVATAR
    ========================================= */

    const avatar =
        document.createElement("div");


    avatar.className =
        "message-avatar";


    const userName =
        message.userName ||
        "CHAPCY User";


    avatar.textContent =
        userName
            .charAt(0)
            .toUpperCase();


    /* =========================================
       CONTENT
    ========================================= */

    const content =
        document.createElement("div");


    content.className =
        "message-content";


    /* =========================================
       META
    ========================================= */

    const meta =
        document.createElement("div");


    meta.className =
        "message-meta";


    const name =
        document.createElement("span");


    name.className =
        "message-name";


    name.textContent =
        userName;


    const time =
        document.createElement("span");


    time.className =
        "message-time";


    time.textContent =
        formatMessageTime(
            message.createdAt
        );


    meta.appendChild(name);

    meta.appendChild(time);


    /* =========================================
       BUBBLE
    ========================================= */

    const bubble =
        document.createElement("div");


    bubble.className =
        "message-bubble";


    /*
       textContent is intentional.
       It prevents HTML/script injection.
    */

    bubble.textContent =
        message.text || "";


    content.appendChild(meta);

    content.appendChild(bubble);


    article.appendChild(avatar);

    article.appendChild(content);


    messages.appendChild(article);


    scrollToBottom();

}


/* =========================================================
   FORMAT MESSAGE TIME
========================================================= */

function formatMessageTime(timestamp) {

    if (!timestamp) {

        return "...";

    }


    const date =
        new Date(timestamp);


    if (Number.isNaN(date.getTime())) {

        return "...";

    }


    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   SCROLL TO BOTTOM
========================================================= */

function scrollToBottom() {

    requestAnimationFrame(() => {

        messages.scrollTop =
            messages.scrollHeight;

    });

}


/* =========================================================
   RECEIVE MUSIC MESSAGES
========================================================= */

onChildAdded(
    musicMessagesRef,
    (snapshot) => {

        const message =
            snapshot.val();


        createMessage(message);

    },
    (error) => {

        console.error(
            "Music messages error:",
            error
        );

    }
);


/* =========================================================
   SEND MESSAGE
========================================================= */

async function sendMessage() {

    if (!currentUser) {

        return;

    }


    const text =
        messageInput.value.trim();


    if (!text) {

        return;

    }


    try {

        sendBtn.disabled = true;


        const newMessageRef =
            push(
                ref(
                    db,
                    "rooms/music/messages"
                )
            );


        await set(
            newMessageRef,
            {

                text: text,

                userId:
                    currentUser.uid,

                userName:
                    getUserName(),

                createdAt:
                    serverTimestamp()

            }
        );


        messageInput.value =
            "";


        messageInput.focus();


    } catch (error) {

        console.error(
            "Send music message error:",
            error
        );

        alert(
            "Message haijatumwa. Angalia Firebase connection."
        );

    } finally {

        sendBtn.disabled = false;

    }

}


/* =========================================================
   COMPOSER SUBMIT
========================================================= */

if (composer) {

    composer.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            await sendMessage();

        }
    );

}


/* =========================================================
   ENTER TO SEND
========================================================= */

if (messageInput) {

    messageInput.addEventListener(
        "keydown",
        async (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                await sendMessage();

            }

        }
    );

}


/* =========================================================
   EMOJI PANEL
========================================================= */

if (emojiBtn) {

    emojiBtn.addEventListener(
        "click",
        () => {

            emojiPanel.classList.toggle(
                "show"
            );

        }
    );

}


/* =========================================================
   EMOJI BUTTONS
========================================================= */

if (emojiPanel) {

    const emojiButtons =
        emojiPanel.querySelectorAll(
            "button"
        );


    emojiButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    messageInput.value +=
                        button.textContent;


                    messageInput.focus();

                }
            );

        }
    );

}


/* =========================================================
   SEARCH TOGGLE
========================================================= */

if (searchToggle) {

    searchToggle.addEventListener(
        "click",
        () => {

            searchPanel.classList.toggle(
                "show"
            );


            if (
                searchPanel.classList.contains(
                    "show"
                )
            ) {

                messageSearch.focus();

            }

        }
    );

}


/* =========================================================
   SEARCH MESSAGES
========================================================= */

if (messageSearch) {

    messageSearch.addEventListener(
        "input",
        () => {

            const search =
                messageSearch.value
                    .trim()
                    .toLowerCase();


            const chatMessages =
                messages.querySelectorAll(
                    ".chat-message"
                );


            chatMessages.forEach(
                (message) => {

                    const text =
                        message.textContent
                            .toLowerCase();


                    if (
                        !search ||
                        text.includes(search)
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

}


/* =========================================================
   CLEAR SEARCH
========================================================= */

if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        () => {

            messageSearch.value =
                "";


            messageSearch.dispatchEvent(
                new Event("input")
            );


            messageSearch.focus();

        }
    );

}


/* =========================================================
   ROOM INFORMATION
========================================================= */

if (roomInfoBtn) {

    roomInfoBtn.addEventListener(
        "click",
        () => {

            roomInfoPanel.classList.toggle(
                "show"
            );

        }
    );

}


if (closeRoomInfo) {

    closeRoomInfo.addEventListener(
        "click",
        () => {

            roomInfoPanel.classList.remove(
                "show"
            );

        }
    );

}


/* =========================================================
   CLOSE EMOJI WHEN CLICKING INPUT
========================================================= */

if (messageInput) {

    messageInput.addEventListener(
        "focus",
        () => {

            emojiPanel.classList.remove(
                "show"
            );

        }
    );

}


/* =========================================================
   TYPING INDICATOR
========================================================= */

let typingTimer = null;


if (messageInput) {

    messageInput.addEventListener(
        "input",
        () => {

            if (!messageInput.value.trim()) {

                typingText.textContent =
                    "";

                return;

            }


            typingText.textContent =
                "Typing...";


            clearTimeout(
                typingTimer
            );


            typingTimer =
                setTimeout(
                    () => {

                        typingText.textContent =
                            "";

                    },
                    1200
                );

        }
    );

}


/* =========================================================
   PREVENT EMPTY SUBMIT
========================================================= */

if (composer) {

    composer.addEventListener(
        "submit",
        (event) => {

            if (
                !messageInput.value.trim()
            ) {

                event.preventDefault();

            }

        }
    );

}


/* =========================================================
   FINISH
========================================================= */

console.log(
    "CHAPCY Music Group loaded successfully."
);
