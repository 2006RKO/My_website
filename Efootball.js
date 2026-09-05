// ============================================================
//                 CHAPCY V50 PREMIUM CHAT
//              REALTIME FIREBASE CHAT ENGINE
// ============================================================

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
    update,
    remove,
    onChildAdded,
    onValue,
    serverTimestamp,
    onDisconnect
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


// ============================================================
// ELEMENTS
// ============================================================

const messagesBox =
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


// Optional premium elements
const onlineUsers =
    document.getElementById("onlineUsers");

const typingIndicator =
    document.getElementById("typingIndicator");

const typingText =
    document.getElementById("typingText");

const sendBtn =
    document.getElementById("sendBtn");

const emojiBtn =
    document.getElementById("emojiBtn");

const emojiPicker =
    document.getElementById("emojiPicker");

const searchInput =
    document.getElementById("chatSearch");


// ============================================================
// STATE
// ============================================================

let currentUser = null;
let currentProfile = {};
let messagesListenerStarted = false;
let typingTimeout = null;
let typingActive = false;

const renderedMessages = new Set();


// ============================================================
// CONFIG
// ============================================================

const ROOM_ID = "general";

const MESSAGE_LIMIT = 200;

const EMOJIS = [
    "😀","😂","😍","🥰","😎","🔥","❤️","💯",
    "🤣","😊","😉","😇","😘","🤩","😱","😭",
    "😡","🤔","🙌","👏","👍","👎","🙏","💪",
    "🎉","✨","🚀","🌍","💜","💙","💚","⭐"
];


// ============================================================
// HELPER
// ============================================================

function getUsername(){

    return (
        currentProfile?.username ||
        currentUser?.displayName ||
        currentUser?.email?.split("@")[0] ||
        "User"
    );

}


function getInitial(name){

    return (
        name ||
        "U"
    )
    .trim()
    .charAt(0)
    .toUpperCase();

}


// ============================================================
// MOBILE MENU
// ============================================================

menuBtn?.addEventListener(
    "click",
    () => {

        sideNav?.classList.add("open");

        mobileOverlay?.classList.add("show");

    }
);


mobileOverlay?.addEventListener(
    "click",
    closeMenu
);


function closeMenu(){

    sideNav?.classList.remove("open");

    mobileOverlay?.classList.remove("show");

}


// ============================================================
// AUTHENTICATION
// ============================================================

onAuthStateChanged(
    auth,
    async user => {

        if(!user){

            window.location.href =
                "login.html";

            return;

        }


        currentUser = user;


        // --------------------------------------------
        // USER PROFILE
        // --------------------------------------------

        const userRef =
            ref(
                db,
                "users/" + user.uid
            );


        onValue(
            userRef,
            snapshot => {

                currentProfile =
                    snapshot.val() || {};

                const username =
                    getUsername();


                if(profileName){

                    profileName.textContent =
                        username;

                }


                if(profileLetter){

                    profileLetter.textContent =
                        getInitial(username);

                }

            }
        );


        // --------------------------------------------
        // START PREMIUM SYSTEMS
        // --------------------------------------------

        setupPresence();

        setupTyping();

        setupEmojiPicker();

        setupSearch();

        startMessages();

    }
);


// ============================================================
// ONLINE PRESENCE
// ============================================================

function setupPresence(){

    if(!currentUser){

        return;

    }


    const presenceRef =
        ref(
            db,
            "presence/" +
            currentUser.uid
        );


    const connectedRef =
        ref(
            db,
            ".info/connected"
        );


    onValue(
        connectedRef,
        snapshot => {

            if(
                snapshot.val() !== true
            ){

                return;

            }


            const username =
                getUsername();


            // Remove presence automatically
            // when connection disappears.

            onDisconnect(
                presenceRef
            ).remove();


            set(
                presenceRef,
                {

                    uid:
                        currentUser.uid,

                    username:
                        username,

                    online:
                        true,

                    lastSeen:
                        serverTimestamp()

                }
            );

        }
    );


    // --------------------------------------------
    // LIVE ONLINE COUNT
    // --------------------------------------------

    const presenceRoot =
        ref(
            db,
            "presence"
        );


    onValue(
        presenceRoot,
        snapshot => {

            let count = 0;


            snapshot.forEach(
                child => {

                    const user =
                        child.val();


                    if(
                        user?.online === true
                    ){

                        count++;

                    }

                }
            );


            if(onlineUsers){

                onlineUsers.textContent =
                    count;

            }

        }
    );

}


// ============================================================
// REALTIME MESSAGES
// ============================================================

function startMessages(){

    if(messagesListenerStarted){

        return;

    }


    messagesListenerStarted =
        true;


    const messagesRef =
        ref(
            db,
            `rooms/${ROOM_ID}/messages`
        );


    onChildAdded(
        messagesRef,
        snapshot => {

            const message =
                snapshot.val();


            if(!message){

                return;

            }


            // Prevent duplicate rendering

            if(
                renderedMessages.has(
                    snapshot.key
                )
            ){

                return;

            }


            renderedMessages.add(
                snapshot.key
            );


            renderMessage(
                message,
                snapshot.key
            );

        }
    );

}


// ============================================================
// SEND MESSAGE
// ============================================================

composer?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if(!currentUser){

            return;

        }


        const text =
            messageInput?.value.trim();


        if(!text){

            return;

        }


        if(text.length > 2000){

            alert(
                "Message is too long."
            );

            return;

        }


        const username =
            getUsername();


        try{

            const messagesRef =
                ref(
                    db,
                    `rooms/${ROOM_ID}/messages`
                );


            const newMessage =
                push(messagesRef);


            await set(
                newMessage,
                {

                    uid:
                        currentUser.uid,

                    username:
                        username,

                    text:
                        text,

                    createdAt:
                        serverTimestamp()

                }
            );


            messageInput.value =
                "";


            stopTyping();


            messageInput.focus();

        }

        catch(error){

            console.error(
                "CHAPCY message error:",
                error
            );


            alert(
                "Message failed to send."
            );

        }

    }
);


// ============================================================
// ENTER TO SEND
// SHIFT + ENTER = NEW LINE
// ============================================================

messageInput?.addEventListener(
    "keydown",
    event => {

        if(
            event.key === "Enter" &&
            !event.shiftKey
        ){

            event.preventDefault();

            composer?.requestSubmit();

        }

    }
);


// ============================================================
// TYPING SYSTEM
// ============================================================

function setupTyping(){

    if(!messageInput || !currentUser){

        return;

    }


    messageInput.addEventListener(
        "input",
        () => {

            if(
                messageInput.value.trim()
            ){

                startTyping();

            }
            else{

                stopTyping();

            }

        }
    );

}


function startTyping(){

    if(!currentUser){

        return;

    }


    typingActive =
        true;


    const typingRef =
        ref(
            db,
            `rooms/${ROOM_ID}/typing/${currentUser.uid}`
        );


    set(
        typingRef,
        {

            uid:
                currentUser.uid,

            username:
                getUsername(),

            typing:
                true,

            updatedAt:
                serverTimestamp()

        }
    );


    clearTimeout(
        typingTimeout
    );


    typingTimeout =
        setTimeout(
            stopTyping,
            2500
        );

}


function stopTyping(){

    if(
        !currentUser ||
        !typingActive
    ){

        return;

    }


    typingActive =
        false;


    const typingRef =
        ref(
            db,
            `rooms/${ROOM_ID}/typing/${currentUser.uid}`
        );


    remove(
        typingRef
    );

}


function watchTyping(){

    const typingRoot =
        ref(
            db,
            `rooms/${ROOM_ID}/typing`
        );


    onValue(
        typingRoot,
        snapshot => {

            const people = [];


            snapshot.forEach(
                child => {

                    const person =
                        child.val();


                    if(
                        person &&
                        person.uid !== currentUser?.uid &&
                        person.typing === true
                    ){

                        people.push(
                            person.username
                        );

                    }

                }
            );


            if(!typingIndicator){

                return;

            }


            if(!people.length){

                typingIndicator
                    .classList.remove("show");

                return;

            }


            typingIndicator
                .classList.add("show");


            if(typingText){

                if(people.length === 1){

                    typingText.textContent =
                        `${people[0]} is typing...`;

                }
                else if(people.length === 2){

                    typingText.textContent =
                        `${people[0]} and ${people[1]} are typing...`;

                }
                else{

                    typingText.textContent =
                        `${people.length} people are typing...`;

                }

            }

        }
    );

}


// Start typing watcher after auth

onAuthStateChanged(
    auth,
    user => {

        if(user){

            setTimeout(
                watchTyping,
                500
            );

        }

    }
);


// ============================================================
// RENDER MESSAGE
// ============================================================

function renderMessage(
    message,
    messageId
){

    if(!messagesBox){

        return;

    }


    const wrapper =
        document.createElement("article");


    const mine =
        message.uid ===
        currentUser?.uid;


    wrapper.className =
        "chat-message" +
        (
            mine
            ? " mine"
            : ""
        );


    wrapper.dataset.messageId =
        messageId || "";


    // ========================================================
    // AVATAR
    // ========================================================

    if(!mine){

        const avatar =
            document.createElement("div");


        avatar.className =
            "message-avatar";


        avatar.textContent =
            getInitial(
                message.username
            );


        wrapper.appendChild(
            avatar
        );

    }


    // ========================================================
    // CONTENT
    // ========================================================

    const content =
        document.createElement("div");


    content.className =
        "message-content";


    // ========================================================
    // HEADER
    // ========================================================

    const head =
        document.createElement("div");


    head.className =
        "message-head";


    const name =
        document.createElement("span");


    name.className =
        "message-name";


    name.textContent =
        message.username ||
        "User";


    const time =
        document.createElement("time");


    time.className =
        "message-time";


    time.textContent =
        formatTime(
            message.createdAt
        );


    head.appendChild(
        name
    );


    head.appendChild(
        time
    );


    // ========================================================
    // MESSAGE TEXT
    // ========================================================

    const text =
        document.createElement("p");


    text.className =
        "message-text";


    // SECURITY:
    // textContent prevents HTML injection.

    text.textContent =
        message.text ||
        "";


    // ========================================================
    // MESSAGE FOOTER
    // ========================================================

    const footer =
        document.createElement("div");


    footer.className =
        "message-footer";


    // React button

    const reactBtn =
        document.createElement("button");


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


    // Copy button

    const copyBtn =
        document.createElement("button");


    copyBtn.type =
        "button";


    copyBtn.className =
        "message-action";


    copyBtn.innerHTML =
        "⧉";


    copyBtn.title =
        "Copy";


    copyBtn.addEventListener(
        "click",
        async () => {

            try{

                await navigator.clipboard.writeText(
                    message.text || ""
                );


                copyBtn.innerHTML =
                    "✓";


                setTimeout(
                    () => {

                        copyBtn.innerHTML =
                            "⧉";

                    },
                    1200
                );

            }
            catch(error){

                console.error(
                    error
                );

            }

        }
    );


    footer.appendChild(
        reactBtn
    );


    footer.appendChild(
        copyBtn
    );


    // ========================================================
    // DELETE BUTTON — OWN MESSAGES ONLY
    // ========================================================

    if(mine && messageId){

        const deleteBtn =
            document.createElement("button");


        deleteBtn.type =
            "button";


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


                if(!confirmed){

                    return;

                }


                try{

                    const messageRef =
                        ref(
                            db,
                            `rooms/${ROOM_ID}/messages/${messageId}`
                        );


                    await remove(
                        messageRef
                    );


                    wrapper.remove();

                }
                catch(error){

                    console.error(
                        "Delete error:",
                        error
                    );

                }

            }
        );


        footer.appendChild(
            deleteBtn
        );

    }


    // ========================================================
    // BUILD MESSAGE
    // ========================================================

    content.appendChild(
        head
    );


    content.appendChild(
        text
    );


    content.appendChild(
        footer
    );


    wrapper.appendChild(
        content
    );


    messagesBox.appendChild(
        wrapper
    );


    // ========================================================
    // PREMIUM ENTRY ANIMATION
    // ========================================================

    requestAnimationFrame(
        () => {

            wrapper.classList.add(
                "message-visible"
            );

        }
    );


    // ========================================================
    // AUTO SCROLL
    // ========================================================

    requestAnimationFrame(
        () => {

            messagesBox.scrollTo({

                top:
                    messagesBox.scrollHeight,

                behavior:
                    "smooth"

            });

        }
    );

}


// ============================================================
// EMOJI PICKER
// ============================================================

function setupEmojiPicker(){

    if(!emojiBtn){

        return;

    }


    emojiBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            if(!emojiPicker){

                return;

            }


            emojiPicker.classList.toggle(
                "show"
            );


            if(
                emojiPicker.dataset.ready !==
                "true"
            ){

                buildEmojiPicker();

            }

        }
    );


    document.addEventListener(
        "click",
        event => {

            if(
                emojiPicker &&
                !emojiPicker.contains(event.target) &&
                event.target !== emojiBtn
            ){

                emojiPicker.classList.remove(
                    "show"
                );

            }

        }
    );

}


function buildEmojiPicker(){

    if(!emojiPicker){

        return;

    }


    emojiPicker.innerHTML =
        "";


    EMOJIS.forEach(
        emoji => {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.className =
                "emoji-item";


            button.textContent =
                emoji;


            button.addEventListener(
                "click",
                () => {

                    const start =
                        messageInput.selectionStart ||
                        0;


                    const end =
                        messageInput.selectionEnd ||
                        0;


                    const value =
                        messageInput.value;


                    messageInput.value =
                        value.slice(
                            0,
                            start
                        ) +
                        emoji +
                        value.slice(
                            end
                        );


                    const newPosition =
                        start +
                        emoji.length;


                    messageInput.focus();


                    messageInput.setSelectionRange(
                        newPosition,
                        newPosition
                    );

                }
            );


            emojiPicker.appendChild(
                button
            );

        }
    );


    emojiPicker.dataset.ready =
        "true";

}


// ============================================================
// CHAT SEARCH
// ============================================================

function setupSearch(){

    if(!searchInput){

        return;

    }


    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const messages =
                messagesBox?.querySelectorAll(
                    ".chat-message"
                );


            messages?.forEach(
                message => {

                    const text =
                        message.textContent
                            .toLowerCase();


                    message.style.display =
                        !query ||
                        text.includes(query)
                        ? ""
                        : "none";

                }
            );

        }
    );

}


// ============================================================
// TIME FORMAT
// ============================================================

function formatTime(timestamp){

    if(!timestamp){

        return "...";

    }


    const date =
        new Date(timestamp);


    if(
        Number.isNaN(
            date.getTime()
        )
    ){

        return "...";

    }


    return date.toLocaleTimeString(
        [],
        {

            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    );

}


// ============================================================
// LOGOUT
// ============================================================

logoutBtn?.addEventListener(
    "click",
    async () => {

        try{

            if(currentUser){

                const presenceRef =
                    ref(
                        db,
                        "presence/" +
                        currentUser.uid
                    );


                await remove(
                    presenceRef
                );

            }


            stopTyping();


            await signOut(
                auth
            );


            window.location.href =
                "login.html";

        }

        catch(error){

            console.error(
                "Logout error:",
                error
            );

        }

    }
);


// ============================================================
// CLEANUP
// ============================================================

window.addEventListener(
    "beforeunload",
    () => {

        stopTyping();

    }
);


// ============================================================
// CHAPCY V50 READY
// ============================================================

console.log(
    "%c CHAPCY V50 PREMIUM CHAT ",
    "background:#7437ff;color:white;font-size:16px;font-weight:bold;padding:8px 14px;border-radius:8px;"
);

console.log(
    "Realtime chat engine loaded successfully."
);
