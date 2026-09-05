// ==========================================
// CHAPCY REALTIME CHAT
// ==========================================

import {
    auth,
    db
}
from "./firebase.js";


import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


import {
    ref,
    push,
    set,
    onChildAdded,
    serverTimestamp,
    onValue,
    onDisconnect
}
from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


// ==========================================
// ELEMENTS
// ==========================================

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


// ==========================================
// STATE
// ==========================================

let currentUser = null;

let currentProfile = null;

let messagesListenerStarted = false;


// ==========================================
// MOBILE MENU
// ==========================================

menuBtn?.addEventListener(
    "click",
    () => {

        sideNav.classList.add("open");

        mobileOverlay.classList.add("show");

    }
);


mobileOverlay?.addEventListener(
    "click",
    closeMenu
);


function closeMenu(){

    sideNav.classList.remove("open");

    mobileOverlay.classList.remove("show");

}


// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(
    auth,
    async user => {

        if(!user){

            window.location.href =
                "login.html";

            return;

        }


        currentUser = user;


        // ----------------------------------
        // GET USER PROFILE
        // ----------------------------------

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
                    currentProfile.username ||
                    user.displayName ||
                    user.email?.split("@")[0] ||
                    "User";


                profileName.textContent =
                    username;


                profileLetter.textContent =
                    username
                    .charAt(0)
                    .toUpperCase();

            }
        );


        setupPresence();

        startMessages();

    }
);


// ==========================================
// ONLINE PRESENCE
// ==========================================

function setupPresence(){

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
                currentProfile?.username ||
                currentUser.displayName ||
                currentUser.email?.split("@")[0] ||
                "User";


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

}


// ==========================================
// LOAD REALTIME MESSAGES
// ==========================================

function startMessages(){

    if(messagesListenerStarted){

        return;

    }


    messagesListenerStarted = true;


    const messagesRef =
        ref(
            db,
            "rooms/general/messages"
        );


    onChildAdded(
        messagesRef,
        snapshot => {

            const message =
                snapshot.val();


            if(!message){

                return;

            }


            renderMessage(
                message
            );

        }
    );

}


// ==========================================
// SEND MESSAGE
// ==========================================

composer.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if(!currentUser){

            return;

        }


        const text =
            messageInput.value.trim();


        if(!text){

            return;

        }


        const username =
            currentProfile?.username ||
            currentUser.displayName ||
            currentUser.email?.split("@")[0] ||
            "User";


        try{

            const messagesRef =
                ref(
                    db,
                    "rooms/general/messages"
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


            messageInput.value = "";

            messageInput.focus();

        }

        catch(error){

            console.error(
                "Message error:",
                error
            );

            alert(
                "Message failed to send."
            );

        }

    }
);


// ==========================================
// RENDER MESSAGE
// ==========================================

function renderMessage(message){

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


    // ======================================
    // AVATAR
    // ======================================

    if(!mine){

        const avatar =
            document.createElement("div");


        avatar.className =
            "message-avatar";


        avatar.textContent =
            (
                message.username ||
                "U"
            )
            .charAt(0)
            .toUpperCase();


        wrapper.appendChild(
            avatar
        );

    }


    // ======================================
    // CONTENT
    // ======================================

    const content =
        document.createElement("div");


    content.className =
        "message-content";


    // HEADER

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


    // TEXT

    const text =
        document.createElement("p");


    text.className =
        "message-text";


    /*
      textContent badala ya innerHTML
      inalinda chat dhidi ya HTML injection.
    */

    text.textContent =
        message.text || "";


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


    // ======================================
    // AUTO SCROLL
    // ======================================

    requestAnimationFrame(
        () => {

            messagesBox.scrollTop =
                messagesBox.scrollHeight;

        }
    );

}


// ==========================================
// TIME
// ==========================================

function formatTime(timestamp){

    if(!timestamp){

        return "...";

    }


    const date =
        new Date(timestamp);


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


// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener(
    "click",
    async () => {

        await signOut(auth);

        window.location.href =
            "login.html";

    }
);
