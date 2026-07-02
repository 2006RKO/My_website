const picker = document.querySelector("emoji-picker");

const input = document.getElementById("messageInput");

picker.addEventListener("emoji-click",(event)=>{

input.value += event.detail.unicode;

input.focus();

});
