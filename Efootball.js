// ==========================================
// CHAPCY V21 — FIREBASE LIVE CHAT
// ==========================================

"use strict";

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    ref,
    push,
    onChildAdded,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


// ==========================================
// ELEMENTS
// ==========================================

const messages =
    document.getElementById("messages");

const composer =
    document.getElementById("composer");

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");


// ==========================================
// DATABASE ROOM
// ==========================================

const messagesRef =
    ref(db, "chapcy/general/messages");


// ==========================================
// CURRENT USER
// ==========================================

let currentUser = null;


// ==========================================
// AUTH
// ==========================================

onAuthStateChanged(auth, (user) => {

    currentUser = user;

    const profileName =
        document.getElementById("profileName");

    const profileLetter =
        document.getElementById("profileLetter");


    if (user) {

        const name =
            user.displayName ||
            user.email?.split("@")[0] ||
            "CHAPCY User";


        if (profileName) {
            profileName.textContent = name;
        }


        if (profileLetter) {
            profileLetter.textContent =
                name.charAt(0).toUpperCase();
        }


        console.log(
            "CHAPCY logged in:",
            user.uid
        );

    } else {

        console.log(
            "CHAPCY: No user logged in"
        );

    }

});


// ==========================================
// SEND
// ==========================================

composer.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const text =
            messageInput.value.trim();


        if (!text) return;


        if (!currentUser) {

            alert(
                "Please login first."
            );

            return;

        }


        try {

            sendBtn.disabled = true;


            await push(
                messagesRef,
                {

                    uid:
                        currentUser.uid,

                    name:
                        currentUser.displayName ||
                        currentUser.email?.split("@")[0] ||
                        "CHAPCY User",

                    text:
                        text,

                    timestamp:
                        serverTimestamp()

                }
            );


            messageInput.value = "";

            messageInput.focus();


        } catch (error) {

            console.error(
                "Firebase error:",
                error
            );

            alert(
                "Failed to send message."
            );

        } finally {

            sendBtn.disabled = false;

        }

    }
);


// ==========================================
// REAL-TIME LISTENER
// ==========================================

onChildAdded(
    messagesRef,
    (snapshot) => {

        const data =
            snapshot.val();


        if (!data) return;


        createMessage(data);

    }
);


// ==========================================
// MESSAGE UI
// ==========================================

function createMessage(data) {

    const message =
        document.createElement("div");

    message.className =
        "chat-message";


    const avatar =
        document.createElement("div");

    avatar.className =
        "message-avatar";


    avatar.textContent =
        (data.name || "U")
        .charAt(0)
        .toUpperCase();


    const content =
        document.createElement("div");

    content.className =
        "message-content";


    const name =
        document.createElement("strong");

    name.className =
        "message-name";


    name.textContent =
        data.name ||
        "CHAPCY User";


    const text =
        document.createElement("p");

    text.className =
        "message-text";


    text.textContent =
        data.text || "";


    content.appendChild(name);

    content.appendChild(text);


    message.appendChild(avatar);

    message.appendChild(content);


    messages.appendChild(message);


    messages.scrollTop =
        messages.scrollHeight;

}
