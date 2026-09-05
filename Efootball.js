// ======================================================
//                 CHAPCY REALTIME CHAT
//                     APP.JS
// ======================================================

"use strict";


// ======================================================
// FIREBASE
// ======================================================

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
    onValue,
    onChildAdded,
    onChildChanged,
    onDisconnect,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


// ======================================================
// DOM ELEMENTS
// ======================================================

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


// Optional online counter
const onlineCount =
    document.getElementById("onlineCount");


// ======================================================
// STATE
// ======================================================

let currentUser = null;

let currentProfile = null;

let messagesListenerStarted = false;

let presenceListenerStarted = false;


// ======================================================
// MOBILE MENU
// ======================================================

menuBtn?.addEventListener(
    "click",
    openMenu
);


mobileOverlay?.addEventListener(
    "click",
    closeMenu
);


function openMenu(){

    sideNav?.classList.add("open");

    mobileOverlay?.classList.add("show");

}


function closeMenu(){

    sideNav?.classList.remove("open");

    mobileOverlay?.classList.remove("show");

}


// ======================================================
// AUTH STATE
// ======================================================

onAuthStateChanged(
    auth,
    user => {

        // ------------------------------------------
        // USER NOT LOGGED IN
        // ------------------------------------------

        if(!user){

            currentUser = null;

            window.location.href =
                "login.html";

            return;

        }


        // ------------------------------------------
        // USER LOGGED IN
        // ------------------------------------------

        currentUser =
            user;


        loadUserProfile();

        setupPresence();

        startMessages();

    }
);


// ======================================================
// LOAD USER PROFILE
// ======================================================

function loadUserProfile(){

    if(!currentUser){

        return;

    }


    const userRef =
        ref(
            db,
            "users/" +
            currentUser.uid
        );


    onValue(
        userRef,
        snapshot => {

            currentProfile =
                snapshot.val() || {};


            const username =
                getCurrentUsername();


            // --------------------------------------
            // PROFILE NAME
            // --------------------------------------

            if(profileName){

                profileName.textContent =
                    username;

            }


            // --------------------------------------
            // PROFILE LETTER
            // --------------------------------------

            if(profileLetter){

                profileLetter.textContent =
                    username
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


// ======================================================
// GET CURRENT USERNAME
// ======================================================

function getCurrentUsername(){

    if(
        currentProfile?.username &&
        currentProfile.username.trim()
    ){

        return currentProfile.username.trim();

    }


    if(
        currentProfile?.name &&
        currentProfile.name.trim()
    ){

        return currentProfile.name.trim();

    }


    if(
        currentUser?.displayName &&
        currentUser.displayName.trim()
    ){

        return currentUser.displayName.trim();

    }


    if(currentUser?.email){

        return currentUser.email
            .split("@")[0];

    }


    return "User";

}


// ======================================================
// ONLINE PRESENCE
// ======================================================

function setupPresence(){

    if(
        !currentUser ||
        presenceListenerStarted
    ){

        return;

    }


    presenceListenerStarted =
        true;


    const uid =
        currentUser.uid;


    const presenceRef =
        ref(
            db,
            "presence/" + uid
        );


    const connectedRef =
        ref(
            db,
            ".info/connected"
        );


    onValue(
        connectedRef,
        snapshot => {

            const connected =
                snapshot.val();


            if(connected !== true){

                return;

            }


            // --------------------------------------
            // REMOVE PRESENCE WHEN USER LEAVES
            // --------------------------------------

            onDisconnect(
                presenceRef
            ).remove();


            // --------------------------------------
            // SET USER ONLINE
            // --------------------------------------

            set(
                presenceRef,
                {

                    uid:
                        uid,

                    username:
                        getCurrentUsername(),

                    online:
                        true,

                    lastSeen:
                        serverTimestamp()

                }
            );

        },
        error => {

            console.error(
                "Presence error:",
                error
            );

        }
    );

}


// ======================================================
// REALTIME ONLINE USERS
// ======================================================

const presenceRoot =
    ref(
        db,
        "presence"
    );


onValue(
    presenceRoot,
    snapshot => {

        if(!onlineCount){

            return;

        }


        const users =
            snapshot.val() || {};


        let count =
            0;


        Object.values(users)
            .forEach(user => {

                if(
                    user &&
                    user.online === true
                ){

                    count++;

                }

            });


        onlineCount.textContent =
            count;

    },
    error => {

        console.error(
            "Online count error:",
            error
        );

    }
);


// ======================================================
// LOAD REALTIME MESSAGES
// ======================================================

function startMessages(){

    if(
        messagesListenerStarted ||
        !messagesBox
    ){

        return;

    }


    messagesListenerStarted =
        true;


    // IMPORTANT:
    // Your Firebase database uses:
    //
    // messages/
    //
    // NOT:
    // rooms/general/messages

    const messagesRef =
        ref(
            db,
            "messages"
        );


    // ----------------------------------------------
    // EXISTING + NEW MESSAGES
    // ----------------------------------------------

    onChildAdded(
        messagesRef,
        snapshot => {

            const message =
                snapshot.val();


            if(!message){

                return;

            }


            renderMessage(
                message,
                snapshot.key
            );

        },
        error => {

            console.error(
                "Message listener error:",
                error
            );

        }
    );


    // ----------------------------------------------
    // UPDATE MESSAGE
    // ----------------------------------------------

    onChildChanged(
        messagesRef,
        snapshot => {

            const message =
                snapshot.val();


            if(!message){

                return;

            }


            updateMessage(
                message,
                snapshot.key
            );

        },
        error => {

            console.error(
                "Message update error:",
                error
            );

        }
    );

}


// ======================================================
// SEND MESSAGE
// ======================================================

composer?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        // ------------------------------------------
        // CHECK LOGIN
        // ------------------------------------------

        if(!currentUser){

            return;

        }


        // ------------------------------------------
        // GET TEXT
        // ------------------------------------------

        const text =
            messageInput?.value
            ?.trim();


        if(!text){

            return;

        }


        // ------------------------------------------
        // USERNAME
        // ------------------------------------------

        const username =
            getCurrentUsername();


        try{

            // --------------------------------------
            // REAL FIREBASE PATH
            // --------------------------------------

            const messagesRef =
                ref(
                    db,
                    "messages"
                );


            // --------------------------------------
            // CREATE MESSAGE ID
            // --------------------------------------

            const newMessage =
                push(
                    messagesRef
                );


            // --------------------------------------
            // SAVE MESSAGE
            // --------------------------------------

            await set(
                newMessage,
                {

                    uid:
                        currentUser.uid,

                    name:
                        username,

                    text:
                        text,

                    time:
                        serverTimestamp()

                }
            );


            // --------------------------------------
            // CLEAR INPUT
            // --------------------------------------

            messageInput.value =
                "";


            messageInput.focus();

        }
        catch(error){

            console.error(
                "================================"
            );

            console.error(
                "CHAPCY FIREBASE MESSAGE ERROR"
            );

            console.error(
                "Code:",
                error.code
            );

            console.error(
                "Message:",
                error.message
            );

            console.error(
                "Full error:",
                error
            );

            console.error(
                "================================"
            );


            alert(
                "Firebase Error\n\n" +
                error.code +
                "\n\n" +
                error.message
            );

        }

    }
);


// ======================================================
// RENDER MESSAGE
// ======================================================

function renderMessage(
    message,
    messageId
){

    if(!messagesBox){

        return;

    }


    // ----------------------------------------------
    // PREVENT DUPLICATES
    // ----------------------------------------------

    if(
        messageId &&
        document.querySelector(
            `[data-message-id="${messageId}"]`
        )
    ){

        return;

    }


    const wrapper =
        document.createElement(
            "article"
        );


    // ----------------------------------------------
    // MESSAGE ID
    // ----------------------------------------------

    wrapper.dataset.messageId =
        messageId || "";


    // ----------------------------------------------
    // CHECK MY MESSAGE
    // ----------------------------------------------

    const mine =
        message.uid &&
        currentUser &&
        message.uid ===
        currentUser.uid;


    wrapper.className =
        "chat-message" +
        (
            mine
            ? " mine"
            : ""
        );


    // =================================================
    // AVATAR FOR OTHER USERS
    // =================================================

    if(!mine){

        const avatar =
            document.createElement(
                "div"
            );


        avatar.className =
            "message-avatar";


        const username =
            message.name ||
            message.username ||
            "User";


        avatar.textContent =
            username
            .charAt(0)
            .toUpperCase();


        wrapper.appendChild(
            avatar
        );

    }


    // =================================================
    // MESSAGE CONTENT
    // =================================================

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "message-content";


    // =================================================
    // HEADER
    // =================================================

    const head =
        document.createElement(
            "div"
        );


    head.className =
        "message-head";


    // ----------------------------------------------
    // NAME
    // ----------------------------------------------

    const name =
        document.createElement(
            "span"
        );


    name.className =
        "message-name";


    name.textContent =
        message.name ||
        message.username ||
        "User";


    // ----------------------------------------------
    // TIME
    // ----------------------------------------------

    const time =
        document.createElement(
            "time"
        );


    time.className =
        "message-time";


    time.dataset.time =
        "true";


    time.textContent =
        formatTime(
            message.time
        );


    head.appendChild(
        name
    );


    head.appendChild(
        time
    );


    // =================================================
    // MESSAGE TEXT
    // =================================================

    const text =
        document.createElement(
            "p"
        );


    text.className =
        "message-text";


    // SECURITY:
    // textContent prevents HTML injection.

    text.textContent =
        message.text ||
        "";


    // =================================================
    // BUILD MESSAGE
    // =================================================

    content.appendChild(
        head
    );


    content.appendChild(
        text
    );


    wrapper.appendChild(
        content
    );


    messagesBox.appendChild(
        wrapper
    );


    // =================================================
    // BUBBLE ANIMATION
    // =================================================

    requestAnimationFrame(
        () => {

            wrapper.classList.add(
                "show"
            );

        }
    );


    // =================================================
    // AUTO SCROLL
    // =================================================

    scrollMessages();

}


// ======================================================
// UPDATE MESSAGE
// ======================================================

function updateMessage(
    message,
    messageId
){

    if(!messageId){

        return;

    }


    const wrapper =
        document.querySelector(
            `[data-message-id="${messageId}"]`
        );


    if(!wrapper){

        // Message wasn't rendered yet.
        renderMessage(
            message,
            messageId
        );

        return;

    }


    // ----------------------------------------------
    // UPDATE TIME
    // ----------------------------------------------

    const time =
        wrapper.querySelector(
            ".message-time"
        );


    if(time){

        time.textContent =
            formatTime(
                message.time
            );

    }


    // ----------------------------------------------
    // UPDATE TEXT
    // ----------------------------------------------

    const text =
        wrapper.querySelector(
            ".message-text"
        );


    if(text){

        text.textContent =
            message.text ||
            "";

    }

}


// ======================================================
// FORMAT FIREBASE TIME
// ======================================================

function formatTime(value){

    // ----------------------------------------------
    // NO TIME YET
    // ----------------------------------------------

    if(
        value === null ||
        value === undefined
    ){

        return "...";

    }


    // ----------------------------------------------
    // OLD DATABASE TIME
    //
    // Example:
    // "5:57:30 PM"
    // ----------------------------------------------

    if(
        typeof value ===
        "string"
    ){

        return value;

    }


    // ----------------------------------------------
    // FIREBASE SERVER TIMESTAMP
    // ----------------------------------------------

    if(
        typeof value ===
        "number"
    ){

        const date =
            new Date(value);


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


    return "...";

}


// ======================================================
// AUTO SCROLL
// ======================================================

function scrollMessages(){

    if(!messagesBox){

        return;

    }


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


// ======================================================
// LOGOUT
// ======================================================

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


                await set(
                    presenceRef,
                    null
                );

            }


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
