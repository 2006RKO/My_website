/*=========================================
      CHAPCY V22 ULTRA
         JAVASCRIPT PART 5
=========================================*/

"use strict";

/*=========================
      ELEMENTS
=========================*/

const chatArea = document.querySelector(".chat-messages");

const input = document.querySelector(".chat-input input");

const sendBtn = document.querySelector(".send");

const typing = document.querySelector(".typing-text");

const emojiBtns = document.querySelectorAll(".emoji-panel span");


/*=========================
      AUTO SCROLL
=========================*/

function scrollBottom(){

    chatArea.scrollTop = chatArea.scrollHeight;

}


/*=========================
      CREATE MESSAGE
=========================*/

function sendMessage(){

    const text = input.value.trim();

    if(text==="") return;

    const message = document.createElement("div");

    message.className="message me";

    message.innerHTML=`

        <div class="bubble">

            ${text}

            <div class="reactions">

                <span>❤️</span>

                <span>👍</span>

                <span>🔥</span>

            </div>

        </div>

    `;

    chatArea.appendChild(message);

    input.value="";

    scrollBottom();

    autoReply();

}


/*=========================
      SEND EVENTS
=========================*/

sendBtn.onclick=sendMessage;

input.addEventListener("keypress",e=>{

    if(e.key==="Enter"){

        sendMessage();

    }

});


/*=========================
     EMOJI SUPPORT
=========================*/

emojiBtns.forEach(btn=>{

    btn.onclick=()=>{

        input.value+=btn.textContent;

        input.focus();

    }

});


/*=========================
    TYPING INDICATOR
=========================*/

let typingTimer;

input.addEventListener("input",()=>{

    typing.style.display="block";

    clearTimeout(typingTimer);

    typingTimer=setTimeout(()=>{

        typing.style.display="none";

    },1000);

});


/*=========================
      AUTO REPLY
=========================*/

function autoReply(){

    typing.style.display="block";

    setTimeout(()=>{

        typing.style.display="none";

        const reply=document.createElement("div");

        reply.className="message";

        reply.innerHTML=`

            <img src="avatar1.png" class="avatar">

            <div class="bubble">

                Thanks for your message 👋

                <div class="reactions">

                    <span>❤️</span>

                    <span>😂</span>

                    <span>🔥</span>

                </div>

            </div>

        `;

        chatArea.appendChild(reply);

        scrollBottom();

    },1800);

}


/*=========================
     REACTION CLICK
=========================*/

document.addEventListener("click",e=>{

    if(e.target.parentElement?.classList.contains("reactions")){

        e.target.style.background="#00d9ff";

        e.target.style.color="#000";

    }

});


/*=========================
      START
=========================*/

scrollBottom();
