import {
    auth,
    db
} from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    ref,
    push,
    set,
    onChildAdded,
    serverTimestamp,
    onValue,
    query,
    orderByChild
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// =====================================
// ELEMENTS
// =====================================

const sideNav = document.getElementById("sideNav");
const menuBtn = document.getElementById("menuBtn");
const mobileOverlay = document.getElementById("mobileOverlay");

const profileName = document.getElementById("profileName");
const profileLetter = document.getElementById("profileLetter");
const logoutBtn = document.getElementById("logoutBtn");

const messagesBox = document.getElementById("messages");
const emptyChat = document.getElementById("emptyChat");

const composer = document.getElementById("composer");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

const emojiBtn = document.getElementById("emojiBtn");
const emojiPanel = document.getElementById("emojiPanel");

const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");

const roomInfoBtn = document.getElementById("roomInfoBtn");
const roomInfoPanel = document.getElementById("roomInfoPanel");


// =====================================
// BETTING ROOM DATABASE PATH
// =====================================

const bettingMessagesRef = query(
    ref(db, "rooms/betting/messages"),
    orderByChild("createdAt")
);


// =====================================
// MOBILE MENU
// =====================================

menuBtn.addEventListener("click", () => {

    sideNav.classList.add("open");

    mobileOverlay.classList.add("show");

});


mobileOverlay.addEventListener("click", closeMobileMenu);


function closeMobileMenu() {

    sideNav.classList.remove("open");

    mobileOverlay.classList.remove("show");

}


// =====================================
// AUTHENTICATION
// =====================================

let currentUser = null;

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;

    }

    currentUser = user;

    const name =
        user.displayName ||
        user.email?.split("@")[0] ||
        "CHAPCY User";

    profileName.textContent = name;

    profileLetter.textContent =
        name.charAt(0).toUpperCase();

});


// =====================================
// LOGOUT
// =====================================

logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "index.html";

    } catch (error) {

        console.error("Logout error:", error);

        alert("Logout failed. Try again.");

    }

});


// =====================================
// FORMAT TIME
// =====================================

function formatTime(timestamp) {

    if (!timestamp) {
        return "now";
    }

    const date = new Date(timestamp);

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

}


// =====================================
// GET USER NAME
// =====================================

function getUserName() {

    if (!currentUser) {
        return "CHAPCY User";
    }

    return (
        currentUser.displayName ||
        currentUser.email?.split("@")[0] ||
        "CHAPCY User"
    );

}


// =====================================
// GET INITIAL
// =====================================

function getInitial(name) {

    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}


// =====================================
// CREATE MESSAGE
// =====================================

function createMessage(message) {

    if (!message || !message.text) {
        return;
    }

    const userName =
        message.userName ||
        "CHAPCY User";

    const isOwn =
        currentUser &&
        message.userId === currentUser.uid;

    const messageElement =
        document.createElement("article");

    messageElement.className =
        "chat-message" + (isOwn ? " own" : "");

    const avatar =
        document.createElement("div");

    avatar.className = "message-avatar";

    avatar.textContent =
        getInitial(userName);

    const content =
        document.createElement("div");

    content.className = "message-content";

    const meta =
        document.createElement("div");

    meta.className = "message-meta";

    const name =
        document.createElement("strong");

    name.textContent = userName;

    const time =
        document.createElement("span");

    time.textContent =
        formatTime(message.createdAt);

    meta.appendChild(name);
    meta.appendChild(time);

    const bubble =
        document.createElement("div");

    bubble.className = "message-bubble";

    bubble.textContent = message.text;

    content.appendChild(meta);
    content.appendChild(bubble);

    messageElement.appendChild(avatar);
    messageElement.appendChild(content);

    messagesBox.appendChild(messageElement);

    if (emptyChat) {
        emptyChat.remove();
    }

    messagesBox.scrollTop =
        messagesBox.scrollHeight;

}


// =====================================
// RECEIVE MESSAGES
// =====================================

onChildAdded(
    bettingMessagesRef,
    (snapshot) => {

        const message = snapshot.val();

        createMessage(message);

    },
    (error) => {

        console.error("Firebase read error:", error);

    }
);


// =====================================
// SEND MESSAGE
// =====================================

composer.addEventListener("submit", async (event) => {

    event.preventDefault();

    const text =
        messageInput.value.trim();

    if (!text) {
        return;
    }

    if (!currentUser) {

        alert("Please login first.");

        return;

    }

    sendBtn.disabled = true;

    try {

        const newMessageRef =
            push(ref(db, "rooms/betting/messages"));

        await set(newMessageRef, {

            text: text,

            userId: currentUser.uid,

            userName: getUserName(),

            createdAt: serverTimestamp()

        });

        messageInput.value = "";

        emojiPanel.classList.remove("show");

        messageInput.focus();

    } catch (error) {

        console.error("Message send error:", error);

        alert("Message failed to send. Check Firebase Database rules.");

    } finally {

        sendBtn.disabled = false;

    }

});


// =====================================
// EMOJI PANEL
// =====================================

emojiBtn.addEventListener("click", () => {

    emojiPanel.classList.toggle("show");

});


document
    .querySelectorAll(".emoji-panel button")
    .forEach((button) => {

        button.addEventListener("click", () => {

            messageInput.value += button.textContent;

            messageInput.focus();

        });

    });


// =====================================
// ADD BUTTON
// =====================================

document.getElementById("addBtn")
    .addEventListener("click", () => {

        emojiPanel.classList.toggle("show");

    });


// =====================================
// SEARCH
// =====================================

searchBtn.addEventListener("click", () => {

    searchBox.classList.toggle("show");

    if (searchBox.classList.contains("show")) {

        searchInput.focus();

    } else {

        searchInput.value = "";

        filterMessages("");

    }

});


searchInput.addEventListener("input", () => {

    filterMessages(searchInput.value.toLowerCase());

});


function filterMessages(searchText) {

    const allMessages =
        messagesBox.querySelectorAll(".chat-message");

    allMessages.forEach((message) => {

        const text =
            message.textContent.toLowerCase();

        message.style.display =
            text.includes(searchText)
                ? "flex"
                : "none";

    });

}


// =====================================
// ROOM INFORMATION
// =====================================

roomInfoBtn.addEventListener("click", () => {

    roomInfoPanel.classList.toggle("show");

});


// =====================================
// ENTER KEY
// =====================================

messageInput.addEventListener("keydown", (event) => {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        composer.requestSubmit();

    }

});
