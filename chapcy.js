import { db } from "./firebase.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();
import {
  ref,
  push,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const chatRef = ref(db, "messages");

// Kutuma message
const user = auth.currentUser;

if (!user) {
    alert("Please login first.");
    return;
}

const username = user.email;

    const username = document.getElementById("username").value.trim();
    const message = document.getElementById("message").value.trim();

    if (username === ""{
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
const stats = document.querySelector(".stats");

function moveLeft(){
    stats.scrollBy({
        left:-320,
        behavior:"smooth"
    });
}

function moveRight(){
    stats.scrollBy({
        left:320,
        behavior:"smooth"
    });
}
const slides = document.querySelectorAll(".group-slide");

let current = 0;

function autoSlide(){

    slides.forEach(slide=>{
        slide.classList.remove("active");
    });

    slides[current].classList.add("active");

    current++;

    if(current >= slides.length){
        current = 0;
    }
}

autoSlide();

setInterval(autoSlide,3000);
