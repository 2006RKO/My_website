/* =========================================================
   CHAPCY V50 PREMIUM — Efootball.js

   Realtime Chat
   Firebase Authentication
   Firebase Realtime Database
   Emoji Picker
   Typing Indicator
   Online Presence
   Message Delete
   Copy Message
   Search
   Mobile Navigation
========================================================= */

import {
    auth,
    db
} from "./firebase.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


import {
    ref,
    push,
    set,
    remove,
    onValue,
    onChildAdded,
    onChildRemoved,
    onDisconnect,
    serverTimestamp,
    query,
    limitToLast
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


/* =========================================================
   CONFIG
========================================================= */

const ROOM_ID = "general";

const messagesRef =
    ref(
        db,
        `rooms/${ROOM_ID}/messages`
    );

const presenceRef =
    ref(
        db,
        "presence"
    );

const typingRef =
    ref(
        db,
        `rooms/${ROOM_ID}/typing`
    );


/* =========================================================
   DOM
========================================================= */

const messagesEl =
    document.getElementById("messages");

const messageInput =
    document.getElementById("messageInput");

const composer =
    document.getElementById("composer");


const profileName =
    document.getElementById("profileName");

const profileLetter =
    document.getElementById("profileLetter");

const logoutBtn =
    document.getElementById("logoutBtn");


const sideNav =
    document.getElementById("sideNav");

const mobileOverlay =
    document.getElementById("mobileOverlay");

const menuBtn =
    document.getElementById("menuBtn");


/*
   HTML yako ya sasa haina onlineUsers,
   typingIndicator, typingText au chatSearch.

   JS itazitumia kama zipo.
   Kama hazipo, haitatoa error.
*/

const onlineUsers =
    document.getElementById("onlineUsers");

const typingEl =
    document.getElementById("typing");

const typingIndicator =
    document.getElementById("typingIndicator");

const typingText =
    document.getElementById("typingText");

const chatSearch =
    document.getElementById("chatSearch");


/* =========================================================
   CURRENT USER
========================================================= */

let currentUser = null;

let currentUserData = null;

let typingTimer = null;

let renderedMessages =
    new Set();

let unsubscribeMessages = null;

let unsubscribePresence = null;

let unsubscribeTyping = null;

let profileUnsubscribe = null;


/* =========================================================
   EMOJIS
========================================================= */

const EMOJIS = [

    "😀","😃","😄","😁","😆","😅","😂","🤣",
    "😊","😇","🙂","🙃","😉","😌","😍","🥰",
    "😘","😗","😙","😚","😋","😛","😝","😜",
    "🤪","🤨","🧐","🤓","😎","🤩","🥳","😏",

    "😒","😞","😔","😟","😕","🙁","☹️","😣",
    "😖","😫","😩","🥺","😢","😭","😤","😠",
    "😡","🤬","🤯","😳","🥵","🥶","😱","😨",
    "😰","😥","😓","🤗","🤔","🫡","🤭","🤫",

    "🤥","😶","😐","😑","😬","🙄","😯","😦",
    "😧","😮","😲","🥱","😴","🤤","😪","😵",
    "🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕",

    "❤️","🧡","💛","💚","💙","💜","🖤","🤍",
    "🤎","💖","💗","💓","💞","💕","💘","💝",
    "💟","❣️","💔","❤️‍🔥","❤️‍🩹",

    "👍","👎","👏","🙌","🫶","🤝","🙏","💪",
    "👊","✌️","🤞","🤟","🤘","👌","🤌","👋",
    "🖐️","✋","🫱","🫲","☝️","👇","👆","👉",
    "👈","✍️","💅",

    "🔥","✨","⭐","🌟","💯",
    "🎉","🎊","🚀","💎","👑",
    "🏆","🥇","🎯","❤️","😂","😍","🥰"

];


/* =========================================================
   AUTH
========================================================= */

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        currentUser = user;


        try {

            await loadUserProfile(user);

        } catch(error) {

            console.error(
                "Profile loading error:",
                error
            );
        }


        createEmojiPicker();

        setupPresence();

        setupMessages();

        setupTyping();

        setupComposer();

        setupSearch();

        setupMobileMenu();

        setupLogout();


        console.log(
            "🚀 CHAPCY V50 PREMIUM CHAT READY"
        );
    }
);


/* =========================================================
   LOAD USER PROFILE
========================================================= */

async function loadUserProfile(user) {

    const userRef =
        ref(
            db,
            `users/${user.uid}`
        );


    profileUnsubscribe =
        onValue(
            userRef,
            snapshot => {

                const data =
                    snapshot.val() || {};


                currentUserData =
                    data;


                const name =
                    data.fullName ||
                    data.name ||
                    user.displayName ||
                    user.email?.split("@")[0] ||
                    "CHAPCY User";


                if (profileName) {

                    profileName.textContent =
                        name;
                }


                if (profileLetter) {

                    profileLetter.textContent =
                        name
                            .charAt(0)
                            .toUpperCase();
                }

            },

            error => {

                console.error(
                    "Profile error:",
                    error
                );
            }
        );
}


/* =========================================================
   USER NAME
========================================================= */

function getCurrentUserName() {

    return (
        currentUserData?.fullName ||
        currentUserData?.name ||
        currentUser?.displayName ||
        currentUser?.email?.split("@")[0] ||
        "CHAPCY User"
    );
}


/* =========================================================
   EMOJI PICKER
========================================================= */

function createEmojiPicker() {

    if (!composer)
        return;


    /*
       Tumia button iliyopo kwenye HTML:

       <button class="emoji-btn">

       Badala ya ku-create duplicate.
    */

    let emojiBtn =
        composer.querySelector(
            ".emoji-btn"
        );


    /*
       Kama haipo, create.
    */

    if (!emojiBtn) {

        emojiBtn =
            document.createElement(
                "button"
            );

        emojiBtn.type =
            "button";

        emojiBtn.className =
            "emoji-btn";

        emojiBtn.innerHTML =
            "☺";

        composer.insertBefore(
            emojiBtn,
            composer.querySelector(
                "#sendBtn, .send-btn"
            )
        );
    }


    /*
       Emoji picker
    */

    let emojiPicker =
        document.getElementById(
            "emojiPicker"
        );


    if (!emojiPicker) {

        emojiPicker =
            document.createElement(
                "div"
            );

        emojiPicker.id =
            "emojiPicker";

        emojiPicker.className =
            "emojiPicker";

        composer.appendChild(
            emojiPicker
        );
    }


    /*
       Tengeneza emojis mara moja tu.
    */

    if (
        emojiPicker.children.length === 0
    ) {

        EMOJIS.forEach(
            emoji => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";

                button.className =
                    "emoji-item";

                button.textContent =
                    emoji;


                button.addEventListener(
                    "click",
                    () => {

                        insertEmoji(
                            emoji
                        );

                        emojiPicker.classList.remove(
                            "show"
                        );
                    }
                );


                emojiPicker.appendChild(
                    button
                );
            }
        );
    }


    /*
       Zuia event listener kurudiwa
    */

    if (
        emojiBtn.dataset.ready !==
        "true"
    ) {

        emojiBtn.dataset.ready =
            "true";


        emojiBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                emojiPicker.classList.toggle(
                    "show"
                );
            }
        );
    }


    /*
       Close outside
    */

    if (
        emojiPicker.dataset.outsideReady !==
        "true"
    ) {

        emojiPicker.dataset.outsideReady =
            "true";


        document.addEventListener(
            "click",
            event => {

                if (
                    !emojiPicker.contains(
                        event.target
                    ) &&
                    event.target !== emojiBtn
                ) {

                    emojiPicker.classList.remove(
                        "show"
                    );
                }
            }
        );
    }
}


/* =========================================================
   INSERT EMOJI
========================================================= */

function insertEmoji(emoji) {

    if (!messageInput)
        return;


    const start =
        messageInput.selectionStart ??
        messageInput.value.length;


    const end =
        messageInput.selectionEnd ??
        messageInput.value.length;


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


    const cursor =
        start +
        emoji.length;


    messageInput.setSelectionRange(
        cursor,
        cursor
    );


    updateTyping();
}


/* =========================================================
   PRESENCE
========================================================= */

function setupPresence() {

    if (!currentUser)
        return;


    const myPresenceRef =
        ref(
            db,
            `presence/${currentUser.uid}`
        );


    const connectedRef =
        ref(
            db,
            ".info/connected"
        );


    onValue(
        connectedRef,
        snapshot => {

            if (
                snapshot.val() !== true
            )
                return;


            onDisconnect(
                myPresenceRef
            )
            .remove()
            .catch(
                console.error
            );


            set(
                myPresenceRef,
                {
                    online:true,

                    uid:
                        currentUser.uid,

                    name:
                        getCurrentUserName(),

                    lastSeen:
                        serverTimestamp()
                }
            )
            .catch(
                console.error
            );
        }
    );


    unsubscribePresence =
        onValue(
            presenceRef,
            snapshot => {

                let count = 0;


                snapshot.forEach(
                    child => {

                        const data =
                            child.val();


                        if (
                            data &&
                            data.online === true
                        ) {

                            count++;
                        }
                    }
                );


                if (onlineUsers) {

                    onlineUsers.textContent =
                        count;
                }
            }
        );
}


/* =========================================================
   REALTIME MESSAGES
========================================================= */

function setupMessages() {

    if (!messagesEl)
        return;


    messagesEl.innerHTML =
        "";


    renderedMessages.clear();


    const messagesQuery =
        query(
            messagesRef,
            limitToLast(100)
        );


    unsubscribeMessages =
        onChildAdded(
            messagesQuery,
            snapshot => {

                const message =
                    snapshot.val();


                if (!message)
                    return;


                renderMessage(
                    snapshot.key,
                    message
                );
            },

            error => {

                console.error(
                    "Message listener error:",
                    error
                );
            }
        );


    onChildRemoved(
        messagesQuery,
        snapshot => {

            const element =
                document.querySelector(
                    `[data-message-id="${snapshot.key}"]`
                );


            if (!element)
                return;


            element.classList.add(
                "message-removing"
            );


            setTimeout(
                () => {

                    element.remove();

                },
                250
            );
        }
    );
}


/* =========================================================
   RENDER MESSAGE
========================================================= */

function renderMessage(
    messageId,
    message
) {

    if (!messagesEl)
        return;


    if (
        renderedMessages.has(
            messageId
        )
    )
        return;


    renderedMessages.add(
        messageId
    );


    const uid =
        message.uid ||
        message.senderId ||
        "";


    const isMine =
        uid === currentUser?.uid;


    const name =
        message.name ||
        message.fullName ||
        "CHAPCY User";


    const text =
        message.text ||
        "";


    const time =
        formatTime(
            message.timestamp ||
            message.createdAt
        );


    const avatar =
        name
            .charAt(0)
            .toUpperCase();


    /*
       Message Row
    */

    const messageEl =
        document.createElement(
            "div"
        );


    messageEl.className =
        "chat-message" +
        (isMine
            ? " mine"
            : "");


    messageEl.dataset.messageId =
        messageId;


    /*
       Avatar
    */

    const avatarEl =
        document.createElement(
            "div"
        );


    avatarEl.className =
        "message-avatar";


    avatarEl.textContent =
        avatar;


    /*
       Content
    */

    const contentEl =
        document.createElement(
            "div"
        );


    contentEl.className =
        "message-content";


    /*
       Header
    */

    const headEl =
        document.createElement(
            "div"
        );


    headEl.className =
        "message-head";


    const nameEl =
        document.createElement(
            "span"
        );


    nameEl.className =
        "message-name";


    nameEl.textContent =
        isMine
            ? "You"
            : name;


    const timeEl =
        document.createElement(
            "span"
        );


    timeEl.className =
        "message-time";


    timeEl.textContent =
        time;


    headEl.append(
        nameEl,
        timeEl
    );


    /*
       Message Text
    */

    const textEl =
        document.createElement(
            "div"
        );


    textEl.className =
        "message-text";


    /*
       textContent ni salama dhidi
       ya HTML injection.
    */

    textEl.textContent =
        text;


    /*
       Footer
    */

    const footerEl =
        document.createElement(
            "div"
        );


    footerEl.className =
        "message-footer";


    /*
       LIKE
    */

    const reactBtn =
        document.createElement(
            "button"
        );


    reactBtn.type =
        "button";


    reactBtn.className =
        "message-action";


    reactBtn.innerHTML =
        "❤️";


    reactBtn.title =
        "React";


    reactBtn.addEventListener(
        "click",
        () => {

            reactBtn.classList.toggle(
                "active"
            );
        }
    );


    /*
       COPY
    */

    const copyBtn =
        document.createElement(
            "button"
        );


    copyBtn.type =
        "button";


    copyBtn.className =
        "message-action";


    copyBtn.innerHTML =
        "📋";


    copyBtn.title =
        "Copy message";


    copyBtn.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    text
                );


                copyBtn.innerHTML =
                    "✓";


                setTimeout(
                    () => {

                        copyBtn.innerHTML =
                            "📋";

                    },
                    1200
                );

            } catch(error) {

                console.error(
                    "Copy failed:",
                    error
                );
            }
        }
    );


    footerEl.append(
        reactBtn,
        copyBtn
    );


    /*
       DELETE — only own messages
    */

    if (isMine) {

        const deleteBtn =
            document.createElement(
                "button"
            );


        deleteBtn.type =
            "button";


        deleteBtn.className =
            "message-action delete";


        deleteBtn.innerHTML =
            "🗑";


        deleteBtn.title =
            "Delete message";


        deleteBtn.addEventListener(
            "click",
            async () => {

                const confirmed =
                    window.confirm(
                        "Delete this message?"
                    );


                if (!confirmed)
                    return;


                try {

                    await remove(
                        ref(
                            db,
                            `rooms/${ROOM_ID}/messages/${messageId}`
                        )
                    );

                } catch(error) {

                    console.error(
                        "Delete failed:",
                        error
                    );

                    alert(
                        "Failed to delete message."
                    );
                }
            }
        );


        footerEl.append(
            deleteBtn
        );
    }


    /*
       Build message
    */

    contentEl.append(
        headEl,
        textEl,
        footerEl
    );


    messageEl.append(
        avatarEl,
        contentEl
    );


    messagesEl.appendChild(
        messageEl
    );


    /*
       Animation
    */

    requestAnimationFrame(
        () => {

            messageEl.classList.add(
                "message-enter"
            );
        }
    );


    scrollToBottom();
}


/* =========================================================
   SEND MESSAGE
========================================================= */

async function sendMessage() {

    if (!currentUser)
        return;


    if (!messageInput)
        return;


    const text =
        messageInput.value.trim();


    if (!text)
        return;


    /*
       Maximum protection
    */

    if (text.length > 2000) {

        alert(
            "Message is too long."
        );

        return;
    }


    /*
       Save original text
       in case Firebase fails.
    */

    const originalText =
        text;


    messageInput.value =
        "";


    stopTyping();


    try {

        const newMessage =
            push(
                messagesRef
            );


        await set(
            newMessage,
            {

                uid:
                    currentUser.uid,

                name:
                    getCurrentUserName(),

                text:
                    originalText,

                timestamp:
                    serverTimestamp(),

                createdAt:
                    Date.now()
            }
        );


        scrollToBottom();

    } catch(error) {

        console.error(
            "Send message failed:",
            error
        );


        messageInput.value =
            originalText;


        alert(
            "Message failed to send."
        );
    }
}


/* =========================================================
   COMPOSER
========================================================= */

function setupComposer() {

    if (!composer)
        return;


    if (
        composer.dataset.ready ===
        "true"
    )
        return;


    composer.dataset.ready =
        "true";


    composer.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            sendMessage();
        }
    );


    if (messageInput) {

        messageInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();
                }
            }
        );


        messageInput.addEventListener(
            "input",
            updateTyping
        );
    }
}


/* =========================================================
   TYPING
========================================================= */

function setupTyping() {

    if (!currentUser)
        return;


    unsubscribeTyping =
        onValue(
            typingRef,
            snapshot => {

                const users =
                    snapshot.val() || {};


                const names = [];


                Object.keys(users)
                    .forEach(
                        uid => {

                            if (
                                uid ===
                                currentUser.uid
                            )
                                return;


                            if (
                                users[uid]?.typing
                            ) {

                                names.push(
                                    users[uid].name ||
                                    "Someone"
                                );
                            }
                        }
                    );


                /*
                   Kama HTML yako ina
                   #typingIndicator,
                   tumia hiyo.

                   Kama ina #typing tu,
                   tumia hiyo.
                */

                const target =
                    typingIndicator ||
                    typingEl;


                if (!target)
                    return;


                if (
                    names.length === 0
                ) {

                    target.classList.remove(
                        "show"
                    );

                    if (
                        typingEl &&
                        typingEl !== target
                    ) {

                        typingEl.textContent =
                            "";
                    }

                    return;
                }


                target.classList.add(
                    "show"
                );


                const text =
                    names.length === 1

                        ? `${names[0]} is typing...`

                        : `${names.length} people are typing...`;


                if (typingText) {

                    typingText.textContent =
                        text;

                } else if (typingEl) {

                    typingEl.textContent =
                        text;
                }
            }
        );
}


/* =========================================================
   UPDATE TYPING
========================================================= */

function updateTyping() {

    if (!currentUser)
        return;


    if (!messageInput)
        return;


    const userTypingRef =
        ref(
            db,
            `rooms/${ROOM_ID}/typing/${currentUser.uid}`
        );


    const value =
        messageInput.value.trim();


    if (value) {

        set(
            userTypingRef,
            {

                typing:true,

                name:
                    getCurrentUserName()
            }
        )
        .catch(
            console.error
        );


        clearTimeout(
            typingTimer
        );


        typingTimer =
            setTimeout(
                stopTyping,
                1800
            );

    } else {

        stopTyping();
    }
}


/* =========================================================
   STOP TYPING
========================================================= */

function stopTyping() {

    clearTimeout(
        typingTimer
    );


    if (!currentUser)
        return;


    remove(
        ref(
            db,
            `rooms/${ROOM_ID}/typing/${currentUser.uid}`
        )
    )
    .catch(
        () => {}
    );
}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    if (!chatSearch)
        return;


    if (
        chatSearch.dataset.ready ===
        "true"
    )
        return;


    chatSearch.dataset.ready =
        "true";


    chatSearch.addEventListener(
        "input",
        () => {

            const search =
                chatSearch.value
                    .toLowerCase()
                    .trim();


            document
                .querySelectorAll(
                    ".chat-message"
                )
                .forEach(
                    message => {

                        const text =
                            message.textContent
                                .toLowerCase();


                        message.style.display =
                            !search ||
                            text.includes(
                                search
                            )
                                ? ""
                                : "none";
                    }
                );
        }
    );
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    if (
        menuBtn &&
        menuBtn.dataset.ready !==
        "true"
    ) {

        menuBtn.dataset.ready =
            "true";


        menuBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openMobileMenu();
            }
        );
    }


    if (
        mobileOverlay &&
        mobileOverlay.dataset.ready !==
        "true"
    ) {

        mobileOverlay.dataset.ready =
            "true";


        mobileOverlay.addEventListener(
            "click",
            closeMobileMenu
        );
    }


    /*
       HTML yako inatumia:

       <button class="nav-link">

       sio <a>
    */

    document
        .querySelectorAll(
            "#sideNav .nav-link"
        )
        .forEach(
            link => {

                if (
                    link.dataset.ready ===
                    "true"
                )
                    return;


                link.dataset.ready =
                    "true";


                link.addEventListener(
                    "click",
                    () => {

                        closeMobileMenu();

                    }
                );
            }
        );
}


/* =========================================================
   OPEN MENU
========================================================= */

function openMobileMenu() {

    sideNav?.classList.add(
        "open"
    );

    mobileOverlay?.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   CLOSE MENU
========================================================= */

function closeMobileMenu() {

    sideNav?.classList.remove(
        "open"
    );

    mobileOverlay?.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    if (!logoutBtn)
        return;


    if (
        logoutBtn.dataset.ready ===
        "true"
    )
        return;


    logoutBtn.dataset.ready =
        "true";


    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                logoutBtn.disabled =
                    true;


                stopTyping();


                if (currentUser) {

                    await remove(
                        ref(
                            db,
                            `presence/${currentUser.uid}`
                        )
                    );
                }


                await signOut(
                    auth
                );


                window.location.href =
                    "login.html";

            } catch(error) {

                console.error(
                    "Logout failed:",
                    error
                );


                logoutBtn.disabled =
                    false;
            }
        }
    );
}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(
    timestamp
) {

    if (!timestamp)
        return "now";


    let value =
        timestamp;


    /*
       Firebase server timestamp
       inaweza kuja kama number.
    */

    if (
        typeof timestamp ===
        "object"
    ) {

        value =
            timestamp?.toMillis?.() ||
            timestamp?.seconds
                ? timestamp.seconds * 1000
                : Date.now();
    }


    const date =
        new Date(
            Number(value)
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "now";
    }


    return date.toLocaleTimeString(
        [],
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );
}


/* =========================================================
   SCROLL TO BOTTOM
========================================================= */

function scrollToBottom() {

    if (!messagesEl)
        return;


    requestAnimationFrame(
        () => {

            messagesEl.scrollTo(
                {
                    top:
                        messagesEl.scrollHeight,

                    behavior:
                        "smooth"
                }
            );
        }
    );
}


/* =========================================================
   CLEANUP
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        try {

            stopTyping();

            if (currentUser) {

                remove(
                    ref(
                        db,
                        `presence/${currentUser.uid}`
                    )
                )
                .catch(
                    () => {}
                );
            }


            if (
                unsubscribeMessages
            ) {

                unsubscribeMessages();
            }


            if (
                unsubscribePresence
            ) {

                unsubscribePresence();
            }


            if (
                unsubscribeTyping
            ) {

                unsubscribeTyping();
            }


            if (
                profileUnsubscribe
            ) {

                profileUnsubscribe();
            }

        } catch(error) {

            console.error(
                "Cleanup error:",
                error
            );
        }
    }
);


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

window.addEventListener(
    "error",
    event => {

        console.error(
            "CHAPCY JS Error:",
            event.error ||
            event.message
        );
    }
);


console.log(
    "⚡ CHAPCY V50 Efootball.js loaded"
);
