import { db } from "./firebase.js";

import {
  ref,
  push,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const chatRef = ref(db, "messages");

// Kutuma message
window.sendMessage = function () {

    const username = document.getElementById("username").value.trim();
    const message = document.getElementById("message").value.trim();

    if (username === "" || message === "") {
        alert("Please enter your name and message.");
        return;
    }

    push(chatRef, {
        name: username,
        text: message,
        time: new Date().toLocaleTimeString()
    });

    document.getElementById("message").value = "";
};

// Kupokea messages live
onChildAdded(chatRef, (snapshot) => {

    const msg = snapshot.val();

    document.getElementById("messages").innerHTML += `
        <div class="message">
            <strong>${msg.name}</strong><br>
            ${msg.text}<br>
            <small>${msg.time}</small>
        </div>
    `;

    const box = document.getElementById("messages");
    box.scrollTop = box.scrollHeight;

});
