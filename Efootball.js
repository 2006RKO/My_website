/* =========================================================
   CHAPCY V50 PREMIUM CHAT.JS
   Realtime Chat + Emoji Picker + Typing + Presence
   Firebase Modular SDK
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
    onChildAdded,
    onChildRemoved,
    onValue,
    onDisconnect,
    serverTimestamp,
    query,
    limitToLast
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


/* =========================================================
   CONFIG
========================================================= */

const ROOM_ID = "general";

const messagesRef = ref(
    db,
    `rooms/${ROOM_ID}/messages`
);

const presenceRef = ref(db, "presence");

const typingRef = ref(
    db,
    `rooms/${ROOM_ID}/typing`
);


/* =========================================================
   DOM
========================================================= */

const messagesEl = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const composer = document.getElementById("composer");

const profileName = document.getElementById("profileName");
const profileLetter = document.getElementById("profileLetter");

const logoutBtn = document.getElementById("logoutBtn");

const sideNav = document.getElementById("sideNav");
const mobileOverlay = document.getElementById("mobileOverlay");
const menuBtn = document.getElementById("menuBtn");

const onlineUsers = document.getElementById("onlineUsers");

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

let renderedMessages = new Set();

let typingTimer = null;

let unsubscribeMessages = null;
let unsubscribePresence = null;
let unsubscribeTyping = null;


/* =========================================================
   PREMIUM EMOJIS
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
    "👈","✍️","💅","🔥","✨","⭐","🌟","💯",
    "🎉","🎊","🚀","💎","👑","🏆","🥇","🎯"
];


/* =========================================================
   CREATE EMOJI PICKER
========================================================= */

function createEmojiPicker() {

    if (!composer) return;

    let emojiBtn =
        document.getElementById("emojiBtn");

    let emojiPicker =
        document.getElementById("emojiPicker");


    /* Create emoji button if missing */
    if (!emojiBtn) {

        emojiBtn = document.createElement("button");

        emojiBtn.type = "button";
        emojiBtn.id = "emojiBtn";
        emojiBtn.className = "emoji-btn";
        emojiBtn.setAttribute(
            "aria-label",
            "Open emoji picker"
        );

        emojiBtn.innerHTML = "😊";

        const sendBtn =
            composer.querySelector(
                "#sendBtn, .send-btn, button[type='submit']"
            );

        if (sendBtn) {
            composer.insertBefore(
                emojiBtn,
                sendBtn
            );
        } else {
            composer.appendChild(emojiBtn);
        }
    }


    /* Create picker if missing */
    if (!emojiPicker) {

        emojiPicker =
            document.createElement("div");

        emojiPicker.id = "emojiPicker";
        emojiPicker.className = "emojiPicker";

        composer.appendChild(emojiPicker);
    }


    /* Prevent duplicate emojis */
    if (emojiPicker.children.length === 0) {

        EMOJIS.forEach(emoji => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className = "emoji-item";

            button.textContent = emoji;

            button.addEventListener(
                "click",
                () => {

                    insertEmoji(emoji);

                    emojiPicker.classList.remove(
                        "show"
                    );
                }
            );

            emojiPicker.appendChild(button);
        });
    }


    /* Toggle */
    emojiBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            emojiPicker.classList.toggle(
                "show"
            );
        }
    );


    /* Close outside */
    document.addEventListener(
        "click",
        event => {

            if (
                !emojiPicker.contains(event.target) &&
                event.target !== emojiBtn
            ) {
                emojiPicker.classList.remove(
                    "show"
                );
            }
        }
    );
}


/* =========================================================
   INSERT EMOJI
========================================================= */

function insertEmoji(emoji) {

    if (!messageInput) return;

    const start =
        messageInput.selectionStart ?? 0;

    const end =
        messageInput.selectionEnd ?? 0;

    const value =
        messageInput.value;

    messageInput.value =
        value.substring(0, start) +
        emoji +
        value.substring(end);

    messageInput.focus();

    const cursor =
        start + emoji.length;

    messageInput.setSelectionRange(
        cursor,
        cursor
    );

    updateTyping();
}


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

        await loadUserProfile(user);

        createEmojiPicker();

        setupPresence();

        setupMessages();

        setupTyping();

        setupSearch();

        setupMobileMenu();

        setupLogout();

        console.log(
            "🚀 CHAPCY V50 PREMIUM CHAT READY"
        );
    }
);


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadUserProfile(user) {

    const userRef =
        ref(db, `users/${user.uid}`);

    onValue(
        userRef,
        snapshot => {

            const data =
                snapshot.val() || {};

            currentUserData = data;

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
   PRESENCE
========================================================= */

function setupPresence() {

    if (!currentUser) return;

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

            if (snapshot.val() !== true)
                return;


            onDisconnect(
                myPresenceRef
            )
            .remove()
            .catch(console.error);


            set(
                myPresenceRef,
                {
                    online: true,
                    uid: currentUser.uid,
                    name:
                        currentUserData?.fullName ||
                        currentUserData?.name ||
                        currentUser.displayName ||
                        "CHAPCY User",
                    lastSeen:
                        serverTimestamp()
                }
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

    if (!messagesEl) return;

    messagesEl.innerHTML = "";

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

                if (!message) return;

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

            if (element) {

                element.classList.add(
                    "message-removing"
                );

                setTimeout(
                    () => element.remove(),
                    250
                );
            }
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

    if (!messagesEl) return;

    if (
        renderedMessages.has(messageId)
    ) {
        return;
    }

    renderedMessages.add(messageId);


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


    const messageEl =
        document.createElement("div");


    messageEl.className =
        `chat-message ${
            isMine ? "mine" : ""
        } message-visible`;


    messageEl.dataset.messageId =
        messageId;


    /* Avatar */
    const avatarEl =
        document.createElement("div");

    avatarEl.className =
        "message-avatar";

    avatarEl.textContent =
        avatar;


    /* Content */
    const contentEl =
        document.createElement("div");

    contentEl.className =
        "message-content";


    /* Header */
    const headEl =
        document.createElement("div");

    headEl.className =
        "message-head";


    const nameEl =
        document.createElement("span");

    nameEl.className =
        "message-name";

    nameEl.textContent =
        isMine
            ? "You"
            : name;


    const timeEl =
        document.createElement("span");

    timeEl.className =
        "message-time";

    timeEl.textContent =
        time;


    headEl.append(
        nameEl,
        timeEl
    );


    /* Text */
    const textEl =
        document.createElement("div");

    textEl.className =
        "message-text";

    textEl.textContent =
        text;


    /* Footer */
    const footerEl =
        document.createElement("div");

    footerEl.className =
        "message-footer";


    /* Reaction */
    const reactBtn =
        document.createElement("button");

    reactBtn.type = "button";

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


    /* Copy */
    const copyBtn =
        document.createElement("button");

    copyBtn.type = "button";

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

            } catch (error) {

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


    /* Delete own message */
    if (isMine) {

        const deleteBtn =
            document.createElement("button");

        deleteBtn.type = "button";

        deleteBtn.className =
            "message-action delete";

        deleteBtn.innerHTML =
            "🗑";

        deleteBtn.title =
            "Delete";


        deleteBtn.addEventListener(
            "click",
            async () => {

                const confirmed =
                    confirm(
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

                } catch (error) {

                    console.error(
                        "Delete failed:",
                        error
                    );
                }
            }
        );


        footerEl.append(
            deleteBtn
        );
    }


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


    messageInput.value = "";


    stopTyping();


    try {

        const newMessage =
            push(messagesRef);


        await set(
            newMessage,
            {
                uid:
                    currentUser.uid,

                name:
                    currentUserData?.fullName ||
                    currentUserData?.name ||
                    currentUser.displayName ||
                    currentUser.email?.split("@")[0] ||
                    "CHAPCY User",

                text:
                    text,

                timestamp:
                    serverTimestamp(),

                createdAt:
                    Date.now()
            }
        );

    } catch (error) {

        console.error(
            "Send message failed:",
            error
        );

        messageInput.value =
            text;
    }
}


/* =========================================================
   COMPOSER EVENTS
========================================================= */

if (composer) {

    composer.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            sendMessage();
        }
    );
}


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
                    .forEach(uid => {

                        if (
                            uid === currentUser.uid
                        ) return;


                        if (
                            users[uid]?.typing
                        ) {

                            names.push(
                                users[uid].name ||
                                "Someone"
                            );
                        }
                    });


                if (!typingIndicator)
                    return;


                if (names.length === 0) {

                    typingIndicator.classList.remove(
                        "show"
                    );

                    return;
                }


                typingIndicator.classList.add(
                    "show"
                );


                if (names.length === 1) {

                    if (typingText) {

                        typingText.textContent =
                            `${names[0]} is typing...`;
                    }

                } else {

                    if (typingText) {

                        typingText.textContent =
                            `${names.length} people are typing...`;
                    }
                }
            }
        );
}


function updateTyping() {

    if (!currentUser)
        return;


    const userTypingRef =
        ref(
            db,
            `rooms/${ROOM_ID}/typing/${currentUser.uid}`
        );


    const value =
        messageInput?.value.trim();


    if (value) {

        set(
            userTypingRef,
            {
                typing: true,
                name:
                    currentUserData?.fullName ||
                    currentUserData?.name ||
                    currentUser.displayName ||
                    "Someone"
            }
        ).catch(console.error);


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
    ).catch(() => {});
}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    if (!chatSearch)
        return;


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
                .forEach(message => {

                    const text =
                        message.textContent
                            .toLowerCase();


                    message.style.display =
                        !search ||
                        text.includes(search)
                            ? ""
                            : "none";
                });
        }
    );
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    if (menuBtn) {

        menuBtn.addEventListener(
            "click",
            () => {

                sideNav?.classList.add(
                    "open"
                );

                mobileOverlay?.classList.add(
                    "show"
                );
            }
        );
    }


    mobileOverlay?.addEventListener(
        "click",
        closeMobileMenu
    );


    document
        .querySelectorAll(
            "#sideNav a"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );
        });
}


function closeMobileMenu() {

    sideNav?.classList.remove(
        "open"
    );

    mobileOverlay?.classList.remove(
        "show"
    );
}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    if (!logoutBtn)
        return;


    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                if (currentUser) {

                    await remove(
                        ref(
                            db,
                            `presence/${currentUser.uid}`
                        )
                    );

                    await stopTyping();
                }


                await signOut(auth);

                window.location.href =
                    "login.html";

            } catch (error) {

                console.error(
                    "Logout failed:",
                    error
                );
            }
        }
    );
}


/* =========================================================
   HELPERS
========================================================= */

function formatTime(timestamp) {

    if (!timestamp)
        return "now";


    const date =
        new Date(timestamp);


    if (Number.isNaN(
        date.getTime()
    )) {

        return "now";
    }


    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


function scrollToBottom() {

    if (!messagesEl)
        return;


    requestAnimationFrame(
        () => {

            messagesEl.scrollTo({
                top:
                    messagesEl.scrollHeight,
                behavior:
                    "smooth"
            });
        }
    );
}


/* =========================================================
   CLEANUP
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        stopTyping();

        if (currentUser) {

            remove(
                ref(
                    db,
                    `presence/${currentUser.uid}`
                )
            ).catch(() => {});
        }


        if (unsubscribeMessages)
            unsubscribeMessages();

        if (unsubscribePresence)
            unsubscribePresence();

        if (unsubscribeTyping)
            unsubscribeTyping();
    }
);

2. "chat.css"

Hii ndiyo CSS inayofanya emoji picker ionekane kweli, pamoja na glass/neon message UI na animations.

:::writing{variant="standard" id="74106" title="CHAPCY V50 Premium chat.css"}

/* =========================================================
   CHAPCY V50 PREMIUM CHAT.CSS
========================================================= */

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

:root{
    --bg:#02040d;
    --panel:#060918;
    --panel2:#080c20;

    --purple:#7437ff;
    --purple2:#a84dff;

    --cyan:#00eaff;
    --blue:#278cff;

    --text:#f7f8ff;
    --muted:#8991ad;

    --line:rgba(140,100,255,.18);

    --glass:rgba(7,10,28,.78);
}


/* =========================================================
   BODY
========================================================= */

html,
body{
    width:100%;
    height:100%;
}

body{
    font-family:
        "Poppins",
        system-ui,
        sans-serif;

    background:
        radial-gradient(
            circle at 15% 20%,
            rgba(116,55,255,.16),
            transparent 30%
        ),
        radial-gradient(
            circle at 85% 80%,
            rgba(0,234,255,.10),
            transparent 28%
        ),
        var(--bg);

    color:var(--text);

    overflow:hidden;
}


/* =========================================================
   CHAT CONTAINER
========================================================= */

.chat-container{
    position:relative;

    width:100%;
    height:100vh;

    display:flex;
    flex-direction:column;

    overflow:hidden;

    background:
        linear-gradient(
            120deg,
            rgba(116,55,255,.03),
            rgba(0,234,255,.025),
            rgba(168,77,255,.03)
        );
}


/* =========================================================
   ANIMATED GLOW
========================================================= */

.chat-container::before{
    content:"";

    position:absolute;

    width:420px;
    height:420px;

    left:-180px;
    top:-180px;

    background:
        radial-gradient(
            circle,
            rgba(116,55,255,.20),
            transparent 68%
        );

    filter:blur(20px);

    animation:
        floatingGlow 9s ease-in-out infinite alternate;

    pointer-events:none;
}

.chat-container::after{
    content:"";

    position:absolute;

    width:380px;
    height:380px;

    right:-180px;
    bottom:-180px;

    background:
        radial-gradient(
            circle,
            rgba(0,234,255,.13),
            transparent 68%
        );

    filter:blur(25px);

    animation:
        floatingGlow 11s ease-in-out infinite alternate-reverse;

    pointer-events:none;
}


@keyframes floatingGlow{

    0%{
        transform:
            translate3d(0,0,0)
            scale(1);
    }

    100%{
        transform:
            translate3d(80px,50px,0)
            scale(1.25);
    }
}


/* =========================================================
   CHAT HEADER
========================================================= */

.chat-header{
    position:relative;
    z-index:50;

    min-height:70px;

    display:flex;
    align-items:center;

    padding:
        10px
        16px;

    background:
        rgba(4,7,20,.78);

    backdrop-filter:
        blur(22px);

    -webkit-backdrop-filter:
        blur(22px);

    border-bottom:
        1px solid var(--line);

    box-shadow:
        0 10px 35px
        rgba(0,0,0,.25);
}


/* =========================================================
   PROFILE
========================================================= */

.profile{
    display:flex;
    align-items:center;

    gap:10px;
}

.profile-letter,
#profileLetter{
    width:42px;
    height:42px;

    display:flex;
    align-items:center;
    justify-content:center;

    border-radius:50%;

    font-weight:700;

    color:white;

    background:
        linear-gradient(
            135deg,
            var(--purple),
            var(--cyan)
        );

    box-shadow:
        0 0 18px
        rgba(116,55,255,.38);
}


#profileName{
    font-size:14px;
    font-weight:600;
}


/* =========================================================
   ONLINE USERS
========================================================= */

.online-users{
    margin-left:auto;

    display:flex;
    align-items:center;

    gap:6px;

    padding:
        7px
        11px;

    border-radius:20px;

    background:
        rgba(0,234,255,.06);

    border:
        1px solid
        rgba(0,234,255,.16);

    color:#bdfaff;

    font-size:12px;
}

.online-users::before{
    content:"";

    width:7px;
    height:7px;

    border-radius:50%;

    background:#20ff9b;

    box-shadow:
        0 0 12px
        #20ff9b;

    animation:
        onlinePulse 1.5s infinite;
}


@keyframes onlinePulse{

    0%,100%{
        opacity:1;
        transform:scale(1);
    }

    50%{
        opacity:.45;
        transform:scale(.75);
    }
}


/* =========================================================
   MESSAGES AREA
========================================================= */

#messages{
    position:relative;
    z-index:5;

    flex:1;

    min-height:0;

    overflow-y:auto;

    padding:
        20px
        16px
        120px;

    scroll-behavior:smooth;
}


/* scrollbar */

#messages::-webkit-scrollbar{
    width:5px;
}

#messages::-webkit-scrollbar-track{
    background:transparent;
}

#messages::-webkit-scrollbar-thumb{
    background:
        linear-gradient(
            var(--purple),
            var(--cyan)
        );

    border-radius:20px;
}


/* =========================================================
   MESSAGE
========================================================= */

.chat-message{
    display:flex;

    align-items:flex-end;

    gap:9px;

    width:100%;

    margin-bottom:14px;

    opacity:0;

    transform:
        translateY(16px)
        scale(.98);
}

.chat-message.mine{
    flex-direction:row-reverse;
}


.message-enter{
    opacity:1;

    transform:
        translateY(0)
        scale(1);

    transition:
        opacity .35s ease,
        transform .35s cubic-bezier(
            .2,
            .8,
            .2,
            1
        );
}


/* =========================================================
   AVATAR
========================================================= */

.message-avatar{
    flex:0 0 auto;

    width:34px;
    height:34px;

    display:flex;
    align-items:center;
    justify-content:center;

    border-radius:50%;

    color:white;

    font-size:12px;
    font-weight:700;

    background:
        linear-gradient(
            135deg,
            #5d2dff,
            #00dff5
        );

    box-shadow:
        0 0 14px
        rgba(0,210,255,.18);
}


/* =========================================================
   MESSAGE CONTENT
========================================================= */

.message-content{
    max-width:min(
        76%,
        620px
    );

    padding:
        10px
        12px;

    border-radius:17px;

    background:
        rgba(10,14,36,.82);

    border:
        1px solid
        rgba(150,110,255,.14);

    backdrop-filter:
        blur(16px);

    -webkit-backdrop-filter:
        blur(16px);

    box-shadow:
        0 8px 25px
        rgba(0,0,0,.18);
}


.chat-message.mine
.message-content{

    background:
        linear-gradient(
            135deg,
            rgba(116,55,255,.24),
            rgba(0,200,255,.08)
        );

    border:
        1px solid
        rgba(116,55,255,.30);

    box-shadow:
        0 0 25px
        rgba(116,55,255,.10);
}


/* =========================================================
   MESSAGE HEADER
========================================================= */

.message-head{
    display:flex;

    align-items:center;

    gap:8px;

    margin-bottom:4px;
}


.message-name{
    font-size:11px;

    font-weight:700;

    color:
        #cfc7ff;
}


.message-time{
    font-size:9px;

    color:
        var(--muted);
}


/* =========================================================
   MESSAGE TEXT
========================================================= */

.message-text{
    color:
        var(--text);

    font-size:13px;

    line-height:1.55;

    white-space:pre-wrap;

    overflow-wrap:anywhere;
}


/* =========================================================
   MESSAGE FOOTER
========================================================= */

.message-footer{
    display:flex;

    align-items:center;

    gap:5px;

    margin-top:6px;
}


.message-action{
    border:0;

    width:25px;
    height:25px;

    display:flex;
    align-items:center;
    justify-content:center;

    border-radius:8px;

    cursor:pointer;

    background:
        rgba(255,255,255,.045);

    color:#aeb7d4;

    font-size:12px;

    transition:
        .2s ease;
}


.message-action:hover{
    transform:
        translateY(-2px)
        scale(1.06);

    color:white;

    background:
        rgba(116,55,255,.20);

    box-shadow:
        0 0 12px
        rgba(116,55,255,.18);
}


.message-action.active{
    color:#ff4d8d;

    background:
        rgba(255,60,130,.10);

    transform:
        scale(1.1);
}


.message-action.delete:hover{
    color:#ff5d72;

    background:
        rgba(255,50,80,.10);
}


/* =========================================================
   COMPOSER
========================================================= */

#composer,
.composer{
    position:absolute;

    left:12px;
    right:12px;
    bottom:12px;

    z-index:100;

    display:flex;

    align-items:flex-end;

    gap:7px;

    padding:8px;

    border-radius:20px;

    background:
        rgba(6,9,27,.86);

    border:
        1px solid
        rgba(135,90,255,.22);

    backdrop-filter:
        blur(25px);

    -webkit-backdrop-filter:
        blur(25px);

    box-shadow:
        0 10px 40px
        rgba(0,0,0,.42),
        0 0 30px
        rgba(116,55,255,.08);
}


/* =========================================================
   MESSAGE INPUT
========================================================= */

#messageInput{
    flex:1;

    min-width:0;

    min-height:42px;
    max-height:130px;

    resize:none;

    border:0;
    outline:0;

    padding:
        11px
        12px;

    border-radius:14px;

    background:
        rgba(255,255,255,.035);

    color:white;

    font-family:inherit;

    font-size:13px;

    transition:
        .25s ease;
}


#messageInput::placeholder{
    color:
        #68718e;
}


#messageInput:focus{
    background:
        rgba(116,55,255,.06);

    box-shadow:
        inset 0 0 0 1px
        rgba(116,55,255,.16);
}


/* =========================================================
   EMOJI BUTTON
========================================================= */

.emoji-btn{
    flex:0 0 43px;

    width:43px;
    height:43px;

    border:0;

    border-radius:14px;

    cursor:pointer;

    font-size:22px;

    background:
        linear-gradient(
            135deg,
            rgba(116,55,255,.15),
            rgba(0,234,255,.08)
        );

    border:
        1px solid
        rgba(140,90,255,.18);

    transition:
        .25s ease;
}


.emoji-btn:hover{
    transform:
        translateY(-2px)
        scale(1.05);

    border-color:
        rgba(0,234,255,.35);

    box-shadow:
        0 0 18px
        rgba(0,234,255,.12);
}


/* =========================================================
   EMOJI PICKER
========================================================= */

.emojiPicker{
    position:absolute;

    left:8px;
    bottom:64px;

    width:
        min(
            310px,
            calc(100vw - 32px)
        );

    max-height:270px;

    display:none;

    grid-template-columns:
        repeat(8, 1fr);

    gap:4px;

    padding:10px;

    overflow-y:auto;

    border-radius:18px;

    background:
        rgba(7,10,29,.97);

    border:
        1px solid
        rgba(140,90,255,.28);

    backdrop-filter:
        blur(25px);

    -webkit-backdrop-filter:
        blur(25px);

    box-shadow:
        0 15px 50px
        rgba(0,0,0,.55),
        0 0 35px
        rgba(116,55,255,.18);

    z-index:9999;

    animation:
        emojiOpen .22s ease;
}


.emojiPicker.show{
    display:grid;
}


@keyframes emojiOpen{

    from{
        opacity:0;

        transform:
            translateY(10px)
            scale(.94);
    }

    to{
        opacity:1;

        transform:
            translateY(0)
            scale(1);
    }
}


.emojiPicker::-webkit-scrollbar{
    width:4px;
}

.emojiPicker::-webkit-scrollbar-thumb{
    background:
        linear-gradient(
            var(--purple),
            var(--cyan)
        );

    border-radius:20px;
}


/* =========================================================
   EMOJI ITEM
========================================================= */

.emoji-item{
    width:100%;

    aspect-ratio:1;

    display:flex;
    align-items:center;
    justify-content:center;

    border:0;

    border-radius:10px;

    background:
        transparent;

    cursor:pointer;

    font-size:22px;

    transition:
        transform .16s ease,
        background .16s ease;
}


.emoji-item:hover{
    background:
        rgba(116,55,255,.16);

    transform:
        scale(1.22);
}


.emoji-item:active{
    transform:
        scale(.88);
}


/* =========================================================
   SEND BUTTON
========================================================= */

.send-btn,
#sendBtn{
    flex:0 0 44px;

    width:44px;
    height:44px;

    border:0;

    border-radius:14px;

    cursor:pointer;

    color:white;

    font-size:17px;

    background:
        linear-gradient(
            135deg,
            var(--purple),
            var(--purple2),
            var(--cyan)
        );

    background-size:
        200% 200%;

    box-shadow:
        0 0 20px
        rgba(116,55,255,.28);

    animation:
        sendGradient 5s ease infinite;

    transition:
        .22s ease;
}


.send-btn:hover,
#sendBtn:hover{
    transform:
        translateY(-2px)
        scale(1.04);

    box-shadow:
        0 0 28px
        rgba(116,55,255,.45);
}


@keyframes sendGradient{

    0%{
        background-position:
            0% 50%;
    }

    50%{
        background-position:
            100% 50%;
    }

    100%{
        background-position:
            0% 50%;
    }
}


/* =========================================================
   TYPING INDICATOR
========================================================= */

#typingIndicator{
    position:absolute;

    left:20px;
    bottom:76px;

    z-index:90;

    display:flex;
    align-items:center;

    gap:7px;

    padding:
        6px
        10px;

    border-radius:12px;

    background:
        rgba(7,10,28,.80);

    border:
        1px solid
        rgba(116,55,255,.14);

    color:
        #8e97b5;

    font-size:10px;

    opacity:0;

    transform:
        translateY(6px);

    pointer-events:none;

    transition:
        .25s ease;
}


#typingIndicator.show{
    opacity:1;

    transform:
        translateY(0);
}


#typingIndicator::before{
    content:"";

    width:6px;
    height:6px;

    border-radius:50%;

    background:
        var(--cyan);

    box-shadow:
        8px 0 var(--purple),
        16px 0 var(--cyan);

    animation:
        typingDots 1s infinite;
}


@keyframes typingDots{

    0%,100%{
        opacity:.35;
        transform:scale(.8);
    }

    50%{
        opacity:1;
        transform:scale(1);
    }
}


/* =========================================================
   SEARCH
========================================================= */

#chatSearch{
    width:160px;

    padding:
        8px
        11px;

    border-radius:12px;

    border:
        1px solid
        var(--line);

    outline:0;

    background:
        rgba(255,255,255,.035);

    color:white;

    font-family:inherit;

    font-size:11px;
}


/* =========================================================
   MOBILE NAV
========================================================= */

#mobileOverlay{
    position:fixed;

    inset:0;

    z-index:200;

    background:
        rgba(0,0,0,.55);

    opacity:0;

    visibility:hidden;

    transition:
        .3s ease;
}


#mobileOverlay.show{
    opacity:1;

    visibility:visible;
}


#sideNav{
    position:fixed;

    top:0;
    left:0;

    width:280px;
    height:100vh;

    z-index:300;

    padding:80px 16px 20px;

    background:
        rgba(5,8,25,.95);

    backdrop-filter:
        blur(25px);

    border-right:
        1px solid
        rgba(116,55,255,.20);

    transform:
        translateX(-105%);

    transition:
        transform .35s
        cubic-bezier(
            .22,
            1,
            .36,
            1
        );
}


#sideNav.open{
    transform:
        translateX(0);
}


/* =========================================================
   MESSAGE REMOVE
========================================================= */

.message-removing{
    opacity:0 !important;

    transform:
        translateX(20px)
        scale(.92) !important;

    transition:
        .25s ease;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media(
    max-width:600px
){

    #messages{
        padding:
            15px
            10px
            110px;
    }


    .message-content{
        max-width:82%;
    }


    .message-text{
        font-size:12px;
    }


    #composer,
    .composer{
        left:8px;
        right:8px;
        bottom:8px;

        border-radius:17px;
    }


    .emojiPicker{
        left:0;

        width:
            min(
                300px,
                calc(100vw - 20px)
            );

        grid-template-columns:
            repeat(7,1fr);

        bottom:62px;
    }


    .emoji-item{
        font-size:20px;
    }


    #typingIndicator{
        left:12px;
        bottom:72px;
    }
}


/* =========================================================
   VERY SMALL DEVICES
========================================================= */

@media(
    max-width:380px
){

    .emojiPicker{
        width:
            calc(100vw - 16px);
    }

    .message-content{
        max-width:86%;
    }

    #profileName{
        max-width:110px;

        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
}

Muhimu kwenye HTML

Hutakiwi kuandika emoji zote. JS hapo juu inatengeneza picker yenyewe. Lakini hakikisha HTML yako ina "composer" na input:

<form id="composer" class="composer">

    <input
        id="messageInput"
        type="text"
        placeholder="Type a message..."
        autocomplete="off"
    >

    <button
        id="sendBtn"
        class="send-btn"
        type="submit"
    >
        ➤
    </button>

</form>

Na JS iwe mwisho wa "body":

<script type="module" src="./chat.js"></script>

Usiongeze "emojiBtn" au "emojiPicker" kwenye HTML kama hutaki—JS yangu itazi-create yenyewe. Hii inafanya emoji picker iwe rahisi na haiingiliani na Firebase messages. Firebase "onChildAdded()" pia imekusudiwa kusikiliza watoto wapya na initial data ya location ya messages.

Baada ya kuweka hizi mbili, ukibonyeza 😊 utaona panel ya emoji yenye animation + glassmorphism + neon purple/cyan, na emoji unayochagua itaingia moja kwa moja kwenye "messageInput".
