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
