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




                            
                    
