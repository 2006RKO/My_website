const picker = document.querySelector("emoji-picker");

const input = document.getElementById("messageInput");

picker.addEventListener("emoji-click",(event)=>{

input.value += event.detail.unicode;

input.focus();

});
// Elements
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");
const picker = document.querySelector("emoji-picker");

// Emoji Picker
if (picker) {
    picker.addEventListener("emoji-click", (event) => {
        input.value += event.detail.unicode;
        input.focus();
    });
}

// Kutuma message
function sendMessage() {

    const text = input.value.trim();

    if (text === "") return;

    // Time
    const now = new Date();

    let hour = now.getHours();
    let minute = now.getMinutes();

    if (minute < 10) {
        minute = "0" + minute;
    }

    const time = hour + ":" + minute;

    // Message
    const message = document.createElement("div");

    message.classList.add("message", "sent");

    message.innerHTML = `
        <p>${text}</p>
        <small>${time}</small>
    `;

    messages.appendChild(message);

    // Scroll mwisho
    messages.scrollTop = messages.scrollHeight;

    // Safisha input
    input.value = "";
}

// Button Send
sendBtn.addEventListener("click", sendMessage);

// Enter Key
input.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
        sendMessage();
    }

});
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
// ...
/* ==========================
   GROUP SLIDESHOW
========================== */

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".slider-dots span");

let current = 0;

function showSlide(index){

    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");

    current = index;
}

// Auto slide kila sekunde 3
setInterval(() => {

    current++;

    if(current >= slides.length){
        current = 0;
    }

    showSlide(current);

}, 3000);

// Dots clickable
dots.forEach((dot,index)=>{

    dot.addEventListener("click",()=>{

        showSlide(index);

    });

});
