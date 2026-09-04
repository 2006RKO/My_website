/* =========================================================
        CHAPCY EFOOTBALL LIVE CHAT V1
        FIREBASE + REALTIME CHAT
========================================================= */

"use strict";


/* =========================================================
        FIREBASE CONFIG — YOUR CONFIG
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyDIID2LpzjLiqaLeJKgp-Vd7tNIyN-M1k",
    authDomain: "rko-website-design-2f792.firebaseapp.com",
    databaseURL: "https://rko-website-design-2f792-default-rtdb.firebaseio.com",
    projectId: "rko-website-design-2f792",
    storageBucket: "rko-website-design-2f792.firebasestorage.app",
    messagingSenderId: "782567629866",
    appId: "1:782567629866:web:d6d80d454d0653ea8b4f53",
    measurementId: "G-KQ1EKYE7E7"
};


/* =========================================================
        FIREBASE INITIALIZE
========================================================= */

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const auth = firebase.auth();


/* =========================================================
        ROOM
========================================================= */

const ROOM_ID = "efootball_global";

let currentUser = null;

let typingTimer = null;


/* =========================================================
        DOM
========================================================= */

const messageForm =
    document.querySelector("#messageForm");

const messageInput =
    document.querySelector("#messageInput");

const messagesContainer =
    document.querySelector("#messagesContainer");

const typingIndicator =
    document.querySelector("#typingIndicator");

const playerList =
    document.querySelector("#playerList");


/* =========================================================
        UTILITY
========================================================= */

function escapeHTML(text){

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================================================
        USER
========================================================= */

function createGuestUser(){

    const randomNumber =
        Math.floor(
            1000 + Math.random() * 9000
        );

    return {

        uid:
            "guest_" +
            Date.now(),

        name:
            "Player " +
            randomNumber,

        avatar:
            "P",

        online:true

    };
}


/* =========================================================
        AUTH
========================================================= */

auth.onAuthStateChanged(async user => {

    if(user){

        currentUser = {

            uid:user.uid,

            name:
                user.displayName ||
                "CHAPCY Player",

            avatar:
                user.displayName
                ?
                user.displayName
                    .charAt(0)
                    .toUpperCase()
                :
                "P"

        };

    }else{

        currentUser =
            createGuestUser();

    }

    await setUserOnline();

    loadMessages();

    loadOnlineUsers();

});


/* =========================================================
        ONLINE USER
========================================================= */

async function setUserOnline(){

    if(!currentUser) return;


    const userRef =
        db.ref(
            "rooms/" +
            ROOM_ID +
            "/users/" +
            currentUser.uid
        );


    await userRef.set({

        uid:
            currentUser.uid,

        name:
            currentUser.name,

        avatar:
            currentUser.avatar,

        online:true,

        joinedAt:
            firebase.database.ServerValue.TIMESTAMP

    });


    userRef.onDisconnect().update({

        online:false,

        lastSeen:
            firebase.database.ServerValue.TIMESTAMP

    });

}


/* =========================================================
        SEND MESSAGE
========================================================= */

if(messageForm){

    messageForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const text =
                messageInput.value.trim();

            if(!text) return;

            await sendMessage(text);

            messageInput.value = "";

            stopTyping();

        }
    );

}


async function sendMessage(text){

    if(!currentUser) return;


    const messagesRef =
        db.ref(
            "rooms/" +
            ROOM_ID +
            "/messages"
        );


    const messageRef =
        messagesRef.push();


    await messageRef.set({

        uid:
            currentUser.uid,

        name:
            currentUser.name,

        avatar:
            currentUser.avatar,

        text:
            text,

        timestamp:
            firebase.database.ServerValue.TIMESTAMP

    });

}


/* =========================================================
        LOAD LIVE MESSAGES
========================================================= */

function loadMessages(){

    const messagesRef =
        db.ref(
            "rooms/" +
            ROOM_ID +
            "/messages"
        );


    messagesRef
        .limitToLast(100)
        .on(
            "child_added",
            snapshot => {

                const message =
                    snapshot.val();

                renderMessage(
                    snapshot.key,
                    message
                );

            }
        );

}


/* =========================================================
        RENDER MESSAGE
========================================================= */

function renderMessage(id,message){

    if(!messagesContainer)
        return;


    const existing =
        document.querySelector(
            `[data-message-id="${id}"]`
        );


    if(existing)
        return;


    const wrapper =
        document.createElement("div");


    wrapper.className =
        "message";


    wrapper.dataset.messageId =
        id;


    const initial =
        escapeHTML(
            message.avatar ||
            message.name
                .charAt(0)
                .toUpperCase()
        );


    const name =
        escapeHTML(
            message.name ||
            "Player"
        );


    const text =
        escapeHTML(
            message.text ||
            ""
        );


    const time =
        formatTime(
            message.timestamp
        );


    wrapper.innerHTML = `

        <div class="message-avatar">

            <span>
                ${initial}
            </span>

        </div>


        <div class="message-content">

            <div class="message-meta">

                <strong>
                    ${name}
                </strong>

                <time>
                    ${time}
                </time>

            </div>


            <div class="message-bubble">

                <p>
                    ${text}
                </p>

            </div>


            <div class="message-reactions">

                <button
                    type="button"
                    onclick="reactToMessage('${id}','🔥')"
                >
                    🔥
                </button>

                <button
                    type="button"
                    onclick="reactToMessage('${id}','⚽')"
                >
                    ⚽
                </button>

                <button
                    type="button"
                    onclick="reactToMessage('${id}','❤️')"
                >
                    ❤️
                </button>

            </div>

        </div>

    `;


    messagesContainer.appendChild(
        wrapper
    );


    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;

}


/* =========================================================
        FORMAT TIME
========================================================= */

function formatTime(timestamp){

    if(!timestamp)
        return "now";


    const date =
        new Date(timestamp);


    return date.toLocaleTimeString(
        [],
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );

}


/* =========================================================
        TYPING INDICATOR
========================================================= */

if(messageInput){

    messageInput.addEventListener(
        "input",
        () => {

            if(!currentUser)
                return;


            startTyping();


            clearTimeout(
                typingTimer
            );


            typingTimer =
                setTimeout(
                    stopTyping,
                    1500
                );

        }
    );

}


function startTyping(){

    db.ref(
        "rooms/" +
        ROOM_ID +
        "/typing/" +
        currentUser.uid
    ).set({

        name:
            currentUser.name,

        typing:true

    });

}


function stopTyping(){

    if(!currentUser)
        return;


    db.ref(
        "rooms/" +
        ROOM_ID +
        "/typing/" +
        currentUser.uid
    ).remove();

}


/* =========================================================
        LIVE TYPING LISTENER
========================================================= */

db.ref(
    "rooms/" +
    ROOM_ID +
    "/typing"
).on(
    "value",
    snapshot => {

        if(!typingIndicator)
            return;


        let typingUsers = [];


        snapshot.forEach(
            child => {

                const data =
                    child.val();


                if(
                    currentUser &&
                    child.key !==
                    currentUser.uid
                ){

                    typingUsers.push(
                        data.name
                    );

                }

            }
        );


        if(
            typingUsers.length === 0
        ){

            typingIndicator.style.display =
                "none";

            return;

        }


        typingIndicator.style.display =
            "flex";


        if(
            typingUsers.length === 1
        ){

            typingIndicator.innerHTML = `

                <div class="typing-avatar">
                    ${typingUsers[0]
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <span>
                    ${escapeHTML(
                        typingUsers[0]
                    )}
                    is typing
                </span>

                <div class="typing-dots">

                    <i></i>
                    <i></i>
                    <i></i>

                </div>

            `;

        }else{

            typingIndicator.innerHTML = `

                <span>
                    ${typingUsers.length}
                    players are typing
                </span>

                <div class="typing-dots">

                    <i></i>
                    <i></i>
                    <i></i>

                </div>

            `;

        }

    }
);


/* =========================================================
        ONLINE USERS
========================================================= */

function loadOnlineUsers(){

    const usersRef =
        db.ref(
            "rooms/" +
            ROOM_ID +
            "/users"
        );


    usersRef.on(
        "value",
        snapshot => {

            if(!playerList)
                return;


            playerList.innerHTML = "";


            snapshot.forEach(
                child => {

                    const user =
                        child.val();


                    if(
                        user.online !== true
                    )
                        return;


                    renderPlayer(
                        user
                    );

                }
            );

        }
    );

}


/* =========================================================
        RENDER PLAYER
========================================================= */

function renderPlayer(user){

    const player =
        document.createElement("div");


    player.className =
        "player";


    const initial =
        escapeHTML(
            user.avatar ||
            user.name
                .charAt(0)
                .toUpperCase()
        );


    player.innerHTML = `

        <div class="player-avatar">

            ${initial}

            <span
                class="avatar-online"
            ></span>

        </div>


        <div class="player-info">

            <strong>
                ${escapeHTML(
                    user.name
                )}
            </strong>

            <small>
                <span class="player-level">
                    eFootball
                </span>
                • Online
            </small>

        </div>

    `;


    playerList.appendChild(
        player
    );

}


/* =========================================================
        MESSAGE REACTION
========================================================= */

async function reactToMessage(
    messageId,
    emoji
){

    if(!currentUser)
        return;


    const reactionRef =
        db.ref(
            "rooms/" +
            ROOM_ID +
            "/messages/" +
            messageId +
            "/reactions/" +
            currentUser.uid
        );


    await reactionRef.set({

        emoji:
            emoji,

        name:
            currentUser.name

    });

}


/* =========================================================
        EMOJI PANEL
========================================================= */

const emojiButton =
    document.querySelector(
        "#emojiButton"
    );

const emojiPanel =
    document.querySelector(
        "#emojiPanel"
    );


if(emojiButton && emojiPanel){

    emojiButton.addEventListener(
        "click",
        () => {

            emojiPanel.classList.toggle(
                "show"
            );

        }
    );

}


document.addEventListener(
    "click",
    event => {

        if(
            emojiPanel &&
            emojiButton &&
            !emojiPanel.contains(event.target) &&
            !emojiButton.contains(event.target)
        ){

            emojiPanel.classList.remove(
                "show"
            );

        }

    }
);


window.addEmoji =
function(emoji){

    if(!messageInput)
        return;


    messageInput.value += emoji;

    messageInput.focus();

};


/* =========================================================
        MOBILE SIDEBAR
========================================================= */

const menuButton =
    document.querySelector(
        "#mobileMenuButton"
    );

const leftSidebar =
    document.querySelector(
        ".left-sidebar"
    );

const overlay =
    document.querySelector(
        ".mobile-overlay"
    );

const closeSidebar =
    document.querySelector(
        ".close-sidebar"
    );


function openSidebar(){

    if(leftSidebar)
        leftSidebar.classList.add(
            "open"
        );


    if(overlay)
        overlay.classList.add(
            "show"
        );

}


function closeSideBar(){

    if(leftSidebar)
        leftSidebar.classList.remove(
            "open"
        );


    if(overlay)
        overlay.classList.remove(
            "show"
        );

}


if(menuButton){

    menuButton.addEventListener(
        "click",
        openSidebar
    );

}


if(closeSidebar){

    closeSidebar.addEventListener(
        "click",
        closeSideBar
    );

}


if(overlay){

    overlay.addEventListener(
        "click",
        closeSideBar
    );

}


/* =========================================================
        VIDEO CAMERA
========================================================= */

let localStream = null;


async function startCamera(){

    try{

        localStream =
            await navigator.mediaDevices
                .getUserMedia({

                    video:true,

                    audio:true

                });


        const video =
            document.querySelector(
                "#localVideo"
            );


        if(video){

            video.srcObject =
                localStream;

        }


        showToast(
            "Camera & microphone connected"
        );


    }catch(error){

        console.error(
            "Camera error:",
            error
        );


        showToast(
            "Camera permission denied"
        );

    }

}


function stopCamera(){

    if(!localStream)
        return;


    localStream
        .getTracks()
        .forEach(
            track => track.stop()
        );


    localStream = null;

}


/* =========================================================
        MICROPHONE
========================================================= */

function toggleMicrophone(){

    if(!localStream)
        return;


    const audioTracks =
        localStream.getAudioTracks();


    audioTracks.forEach(
        track => {

            track.enabled =
                !track.enabled;

        }
    );

}


/* =========================================================
        CAMERA TOGGLE
========================================================= */

function toggleCamera(){

    if(!localStream)
        return;


    const videoTracks =
        localStream.getVideoTracks();


    videoTracks.forEach(
        track => {

            track.enabled =
                !track.enabled;

        }
    );

}


/* =========================================================
        TOAST
========================================================= */

function showToast(message){

    let toast =
        document.querySelector(
            ".toast"
        );


    if(!toast){

        toast =
            document.createElement(
                "div"
            );


        toast.className =
            "toast";


        document.body.appendChild(
            toast
        );

    }


    toast.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        <span>
            ${escapeHTML(message)}
        </span>

    `;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =========================================================
        LEAVE VIDEO
========================================================= */

function leaveVideo(){

    stopCamera();

    showToast(
        "You left the video chat"
    );

}


/* =========================================================
        CLEANUP
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        stopTyping();

        stopCamera();

    }
);


/* =========================================================
        GLOBAL FUNCTIONS
========================================================= */

window.sendMessage =
    sendMessage;

window.reactToMessage =
    reactToMessage;

window.startCamera =
    startCamera;

window.stopCamera =
    stopCamera;

window.toggleCamera =
    toggleCamera;

window.toggleMicrophone =
    toggleMicrophone;

window.leaveVideo =
    leaveVideo;

window.closeSideBar =
    closeSideBar;


/* =========================================================
        READY
========================================================= */

console.log(
    "🔥 CHAPCY eFootball Live Chat initialized"
);

console.log(
    "🔥 Firebase Realtime Database connected"
);
