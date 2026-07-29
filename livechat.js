/*=========================================
        CHAPCY LIVE CHAT
             JS PART 1
=========================================*/

"use strict";

/*=========================
      ELEMENTS
=========================*/

const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

/*=========================
   AUTO RESIZE TEXTAREA
=========================*/

input.addEventListener("input", () => {

    input.style.height = "auto";

    input.style.height = input.scrollHeight + "px";

});

/*=========================
      CREATE MESSAGE
=========================*/

function createMessage(text, side = "right"){

    if(text.trim()==="") return;

    const msg = document.createElement("div");

    msg.className = `message ${side}`;

    msg.innerHTML = `

        ${side==="left"
        ?'<img src="default-avatar.png">'
        :""
        }

        <div class="bubble">

            ${side==="left"
            ?"<h4>CHAPCY User</h4>"
            :""
            }

            <p>${text}</p>

            <span class="msg-time">

                ${getTime()}

            </span>

        </div>

    `;

    messages.appendChild(msg);

    scrollBottom();

}

/*=========================
      SEND MESSAGE
=========================*/

function sendMessage(){

    const text = input.value.trim();

    if(text==="") return;

    createMessage(text,"right");

    input.value="";

    input.style.height="24px";

}

/*=========================
        EVENTS
=========================*/

sendBtn.addEventListener("click",sendMessage);

input.addEventListener("keydown",(e)=>{

    if(e.key==="Enter" && !e.shiftKey){

        e.preventDefault();

        sendMessage();

    }

});

/*=========================
      AUTO SCROLL
=========================*/

function scrollBottom(){

    messages.scrollTop = messages.scrollHeight;

}

/*=========================
        TIME
=========================*/

function getTime(){

    const now = new Date();

    return now.toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

}

/*=========================
      DEMO MESSAGE
=========================*/

setTimeout(()=>{

    createMessage(
        "👋 Welcome to CHAPCY Live Chat.",
        "left"
    );

},800);
/*=========================================
        CHAPCY LIVE CHAT
      JS PART 2 - FIREBASE
=========================================*/

import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
getDatabase,
ref,
push,
onChildAdded,
serverTimestamp
} from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

/*=========================
    FIREBASE CONFIG
=========================*/

const firebaseConfig = {

    apiKey:"YOUR_API_KEY",

    authDomain:"YOUR_PROJECT.firebaseapp.com",

    databaseURL:"YOUR_DATABASE_URL",

    projectId:"YOUR_PROJECT_ID",

    storageBucket:"YOUR_PROJECT.appspot.com",

    messagingSenderId:"YOUR_SENDER_ID",

    appId:"YOUR_APP_ID"

};

/*=========================
      INITIALIZE
=========================*/

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

/*=========================
      DATABASE PATH
=========================*/

const chatRef = ref(db,"globalChat");

/*=========================
      SEND FIREBASE
=========================*/

function sendToFirebase(message){

    push(chatRef,{

        username:"Guest",

        avatar:"default-avatar.png",

        message:message,

        time:Date.now(),

        createdAt:serverTimestamp()

    });

}

/*=========================
     OVERRIDE SEND
=========================*/

function sendMessage(){

    const text = input.value.trim();

    if(text==="") return;

    sendToFirebase(text);

    input.value="";

    input.style.height="24px";

}

/*=========================
   RECEIVE MESSAGES
=========================*/

onChildAdded(chatRef,(snapshot)=>{

    const data=snapshot.val();

    createFirebaseMessage(data);

});

/*=========================
 CREATE FIREBASE MESSAGE
=========================*/

function createFirebaseMessage(data){

    const msg=document.createElement("div");

    msg.className="message left";

    msg.innerHTML=`

        <img src="${data.avatar}">

        <div class="bubble">

            <h4>${data.username}</h4>

            <p>${data.message}</p>

            <span class="msg-time">

                ${new Date(data.time)
                .toLocaleTimeString([],{
                hour:"2-digit",
                minute:"2-digit"
                })}

            </span>

        </div>

    `;

    messages.appendChild(msg);

    scrollBottom();

}
/*=========================================
      CHAPCY LIVE CHAT
        JS PART 3
     MEDIA + TYPING UI
=========================================*/

"use strict";

/*=========================
      ELEMENTS
=========================*/

const emojiBtn = document.getElementById("emojiBtn");
const fileInput = document.getElementById("fileInput");
const imageInput = document.getElementById("imageInput");
const videoInput = document.getElementById("videoInput");
const cameraBtn = document.getElementById("cameraBtn");
const voiceBtn = document.getElementById("voiceBtn");

const typingBox = document.getElementById("typingBox");
const typingUser = document.getElementById("typingUser");

/*=========================
      AUTO FOCUS
=========================*/

window.onload = () => {

    input.focus();

};

/*=========================
      TYPING STATUS
=========================*/

let typingTimer;

input.addEventListener("input",()=>{

    typingBox.style.display="flex";

    typingUser.textContent="Typing...";

    clearTimeout(typingTimer);

    typingTimer=setTimeout(()=>{

        typingBox.style.display="none";

    },1500);

});

/*=========================
      EMOJI
=========================*/

emojiBtn.addEventListener("click",()=>{

    input.value+="😊";

    input.focus();

});

/*=========================
      FILE
=========================*/

fileInput.addEventListener("change",()=>{

    if(!fileInput.files.length) return;

    const file=fileInput.files[0];

    createMessage("📎 "+file.name,"right");

});

/*=========================
      IMAGE
=========================*/

imageInput.addEventListener("change",()=>{

    if(!imageInput.files.length) return;

    const file=imageInput.files[0];

    const url=URL.createObjectURL(file);

    const msg=document.createElement("div");

    msg.className="message right";

    msg.innerHTML=`

        <div class="bubble">

            <img src="${url}"

            style="width:220px;
            border-radius:15px;">

            <span class="msg-time">

                ${getTime()}

            </span>

        </div>

    `;

    messages.appendChild(msg);

    scrollBottom();

});

/*=========================
      VIDEO
=========================*/

videoInput.addEventListener("change",()=>{

    if(!videoInput.files.length) return;

    const file=videoInput.files[0];

    const url=URL.createObjectURL(file);

    const msg=document.createElement("div");

    msg.className="message right";

    msg.innerHTML=`

        <div class="bubble">

            <video controls
            style="width:240px;
            border-radius:15px;">

            <source src="${url}">

            </video>

            <span class="msg-time">

                ${getTime()}

            </span>

        </div>

    `;

    messages.appendChild(msg);

    scrollBottom();

});

/*=========================
      CAMERA
=========================*/

cameraBtn.addEventListener("click",()=>{

    imageInput.click();

});

/*=========================
      VOICE
=========================*/

voiceBtn.addEventListener("click",()=>{

    alert("🎤 Voice Recorder itaunganishwa kwenye Part 4.");

});
/*=========================================
      CHAPCY LIVE CHAT
   JS PART 4 - STORAGE UPLOAD
=========================================*/

import {
getStorage,
ref as storageRef,
uploadBytes,
getDownloadURL
}
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

/*=========================
      STORAGE
=========================*/

const storage = getStorage(app);

/*=========================
      UPLOAD IMAGE
=========================*/

imageInput.addEventListener("change", async ()=>{

    if(!imageInput.files.length) return;

    const file = imageInput.files[0];

    const fileRef = storageRef(
        storage,
        "images/" + Date.now() + "_" + file.name
    );

    await uploadBytes(fileRef,file);

    const url = await getDownloadURL(fileRef);

    push(chatRef,{

        username:"Guest",

        avatar:"default-avatar.png",

        type:"image",

        url:url,

        time:Date.now()

    });

});

/*=========================
      UPLOAD VIDEO
=========================*/

videoInput.addEventListener("change", async ()=>{

    if(!videoInput.files.length) return;

    const file = videoInput.files[0];

    const fileRef = storageRef(
        storage,
        "videos/" + Date.now() + "_" + file.name
    );

    await uploadBytes(fileRef,file);

    const url = await getDownloadURL(fileRef);

    push(chatRef,{

        username:"Guest",

        avatar:"default-avatar.png",

        type:"video",

        url:url,

        time:Date.now()

    });

});

/*=========================
      UPLOAD FILE
=========================*/

fileInput.addEventListener("change", async ()=>{

    if(!fileInput.files.length) return;

    const file = fileInput.files[0];

    const fileRef = storageRef(
        storage,
        "files/" + Date.now() + "_" + file.name
    );

    await uploadBytes(fileRef,file);

    const url = await getDownloadURL(fileRef);

    push(chatRef,{

        username:"Guest",

        avatar:"default-avatar.png",

        type:"file",

        fileName:file.name,

        url:url,

        time:Date.now()

    });

});

/*=========================
 RECEIVE ALL TYPES
=========================*/

onChildAdded(chatRef,(snapshot)=>{

    const data = snapshot.val();

    const msg = document.createElement("div");

    msg.className="message left";

    let body="";

    if(data.type==="image"){

        body=`
        <img src="${data.url}"
        style="width:230px;border-radius:15px;">
        `;

    }

    else if(data.type==="video"){

        body=`
        <video controls
        style="width:250px;border-radius:15px;">
        <source src="${data.url}">
        </video>
        `;

    }

    else if(data.type==="file"){

        body=`
        <a href="${data.url}"
        target="_blank">

        📎 ${data.fileName}

        </a>
        `;

    }

    else{

        body=`<p>${data.message}</p>`;

    }

    msg.innerHTML=`

        <img src="${data.avatar}">

        <div class="bubble">

            <h4>${data.username}</h4>

            ${body}

            <span class="msg-time">

            ${new Date(data.time)
            .toLocaleTimeString([],{
                hour:"2-digit",
                minute:"2-digit"
            })}

            </span>

        </div>

    `;

    messages.appendChild(msg);

    scrollBottom();

});
/*=========================================
      CHAPCY LIVE CHAT
      JS PART 5
 REALTIME CHAT FEATURES
=========================================*/

import{
ref,
set,
remove,
update,
onValue
}
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

/*=========================
      USER ID
=========================*/

const uid="user_"+Math.random()
.toString(36)
.substring(2,10);

/*=========================
      ONLINE USERS
=========================*/

const onlineRef=ref(db,
"onlineUsers/"+uid);

set(onlineRef,{

online:true,

time:Date.now()

});

window.addEventListener("beforeunload",()=>{

remove(onlineRef);

});

/*=========================
    ONLINE COUNT
=========================*/

onValue(ref(db,"onlineUsers"),

(snapshot)=>{

const total=snapshot.exists()

?Object.keys(snapshot.val()).length

:0;

document.getElementById("onlineCount")

.innerHTML=

total+" Users Online";

});

/*=========================
      TYPING
=========================*/

const typingRef=

ref(db,

"typing/"+uid);

input.addEventListener("input",()=>{

set(typingRef,true);

clearTimeout(window.typingTimer);

window.typingTimer=

setTimeout(()=>{

remove(typingRef);

},1200);

});

/*=========================
 SHOW TYPING
=========================*/

onValue(ref(db,"typing"),

(snapshot)=>{

const typing=snapshot.exists()

?Object.keys(snapshot.val()).length

:0;

if(typing>1){

typingBox.style.display="flex";

typingUser.innerHTML=

"Someone is typing...";

}else{

typingBox.style.display="none";

}

});

/*=========================
      REACTION
=========================*/

function reactMessage(id,reaction){

update(

ref(db,

"globalChat/"+id),

{

reaction:reaction

});

}

/*=========================
 DELETE MESSAGE
=========================*/

function deleteMessage(id){

remove(

ref(db,

"globalChat/"+id)

);

}

/*=========================
 EDIT MESSAGE
=========================*/

function editMessage(id,newText){

update(

ref(db,

"globalChat/"+id),

{

message:newText,

edited:true

});

}

/*=========================
 MARK AS SEEN
=========================*/

function seenMessage(id){

update(

ref(db,

"globalChat/"+id),

{

seen:true

});

}

/*=========================
 RECEIVE UPDATE
=========================*/

onChildAdded(chatRef,

(snapshot)=>{

const data=snapshot.val();

const id=snapshot.key;

const msg=document.createElement("div");

msg.className="message left";

msg.innerHTML=`

<img src="${data.avatar}">

<div class="bubble">

<h4>${data.username}</h4>

<p>${data.message||""}</p>

<div class="msg-actions">

<button onclick="reactMessage('${id}','❤️')">

❤️

</button>

<button onclick="editMessage('${id}',prompt('Edit', '${data.message}'))">

✏️

</button>

<button onclick="deleteMessage('${id}')">

🗑

</button>

</div>

<span class="msg-time">

${new Date(data.time)
.toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

})}

${data.edited?" • Edited":""}

${data.seen?" • Seen":" ✔"}

</span>

</div>

`;

messages.appendChild(msg);

seenMessage(id);

scrollBottom();

});

/*=========================
 GLOBAL FUNCTIONS
=========================*/

window.reactMessage=reactMessage;

window.editMessage=editMessage;

window.deleteMessage=deleteMessage;
