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
// REALTIME MESSAGES
// ======================================================

function startMessages(){

    if(
        messagesListenerStarted ||
        !messagesBox
    ){
        return;
    }

    messagesListenerStarted = true;

    const messagesRef =
        ref(db, "messages");

    onValue(
        messagesRef,
        snapshot => {

            messagesBox.innerHTML = "";

            if(!snapshot.exists()){
                return;
            }

            snapshot.forEach(
                childSnapshot => {

                    const message =
                        childSnapshot.val();

                    if(!message){
                        return;
                    }

                    renderMessage(
                        message,
                        childSnapshot.key
                    );

                }
            );

            requestAnimationFrame(() => {

                messagesBox.scrollTop =
                    messagesBox.scrollHeight;

            });

        },
        error => {

            console.error(
                "CHAPCY MESSAGE ERROR:",
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

        if(!currentUser){
            return;
        }

        const text =
            messageInput?.value?.trim();

        if(!text){
            return;
        }

        const username =
            getCurrentUsername();

        try{

            const messagesRef =
                ref(db, "messages");

            const newMessage =
                push(messagesRef);

            await set(
                newMessage,
                {
                    uid: currentUser.uid,
                    name: username,
                    text: text,
                    time: serverTimestamp()
                }
            );

            messageInput.value = "";

            messageInput.focus();

        }
        catch(error){

            console.error(
                "CHAPCY MESSAGE ERROR:",
                error
            );

            alert(
                "Message haijatumwa:\n\n" +
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

    const wrapper =
        document.createElement("article");

    wrapper.className =
        "chat-message";

    if(
        currentUser &&
        message.uid === currentUser.uid
    ){
        wrapper.classList.add("mine");
    }

    wrapper.dataset.messageId =
        messageId || "";

    const content =
        document.createElement("div");

    content.className =
        "message-content";

    const head =
        document.createElement("div");

    head.className =
        "message-head";

    const name =
        document.createElement("span");

    name.className =
        "message-name";

    name.textContent =
        message.name || "User";

    const time =
        document.createElement("time");

    time.className =
        "message-time";

    time.textContent =
        formatTime(message.time);

    const text =
        document.createElement("p");

    text.className =
        "message-text";

    text.textContent =
        message.text || "";

    head.appendChild(name);
    head.appendChild(time);

    content.appendChild(head);
    content.appendChild(text);

    wrapper.appendChild(content);

    messagesBox.appendChild(wrapper);

    requestAnimationFrame(() => {
        wrapper.classList.add("show");
    });

}


// ======================================================
// FORMAT TIME
// ======================================================

function formatTime(value){

    if(
        value === null ||
        value === undefined
    ){
        return "...";
    }

    if(typeof value === "string"){
        return value;
    }

    if(typeof value === "number"){

        return new Date(value)
            .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

    }

    return "...";
}
                    
