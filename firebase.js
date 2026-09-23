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
// FOOD ROOM
// =====================================

const foodMessagesRef = query(
    ref(db, "rooms/food/messages"),
    orderByChild("createdAt")
);


// =====================================
// CURRENT USER
// =====================================

let currentUser = null;


// =====================================
// AUTH
// =====================================

onAuthStateChanged(auth, (user) => {

    currentUser = user || null;

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

        console.log("Food user:", name);

    } else {

        currentUser = null;

        if (profileName) {
            profileName.textContent = "CHAPCY User";
        }

        if (profileLetter) {
            profileLetter.textContent = "C";
        }

        console.log("Food: hakuna user aliye-login.");

    }

});


// =====================================
// MOBILE MENU
// =====================================

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        sideNav?.classList.add("open");
        mobileOverlay?.classList.add("show");

    });

}


if (mobileOverlay) {

    mobileOverlay.addEventListener(
        "click",
        closeMobileMenu
    );

}


function closeMobileMenu() {

    sideNav?.classList.remove("open");
    mobileOverlay?.classList.remove("show");

}


// =====================================
// LOGOUT
// =====================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                console.log("Food logout");

                window.location.href = "index.html";

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

                alert(
                    "Logout failed. Try again."
                );

            }

        }
    );

}


// =====================================
// USER NAME
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
// INITIAL
// =====================================

function getInitial(name) {

    return (
        name?.trim()?.charAt(0)?.toUpperCase() ||
        "C"
    );

}


// =====================================
// FORMAT TIME
// =====================================

function formatTime(timestamp) {

    if (!timestamp) {
        return "now";
    }

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
        return "now";
    }

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

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
        "chat-message" +
        (isOwn ? " own" : "");


    // =================================
    // AVATAR
    // =================================

    const avatar =
        document.createElement("div");

    avatar.className =
        "message-avatar";

    avatar.textContent =
        getInitial(userName);


    // =================================
    // CONTENT
    // =================================

    const content =
        document.createElement("div");

    content.className =
        "message-content";


    // =================================
    // META
    // =================================

    const meta =
        document.createElement("div");

    meta.className =
        "message-meta";


    const name =
        document.createElement("strong");

    name.textContent =
        userName;


    const time =
        document.createElement("span");

    time.textContent =
        formatTime(message.createdAt);


    meta.appendChild(name);
    meta.appendChild(time);


    // =================================
    // BUBBLE
    // =================================

    const bubble =
        document.createElement("div");

    bubble.className =
        "message-bubble";

    bubble.textContent =
        message.text;


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
// RECEIVE FOOD MESSAGES
// =====================================

onChildAdded(
    foodMessagesRef,
    (snapshot) => {

        const message =
            snapshot.val();

        createMessage(message);

    },
    (error) => {

        console.error(
            "Firebase Food read error:",
            error
        );

    }
);


// =====================================
// SAVE MESSAGE TO XAMPP
// =====================================

async function saveToXampp(messageData) {

    try {

        const response = await fetch(
            "http://localhost/chapcy/save-food-message.php",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body: new URLSearchParams({
                    uid: messageData.userId,
                    name: messageData.userName,
                    phone: messageData.phone || "",
                    room: "food",
                    message: messageData.text
                })
            }
        );


        const result =
            await response.json();

        console.log(
            "XAMPP response:",
            result
        );

        return result;

    } catch (error) {

        console.warn(
            "XAMPP haijaunganishwa:",
            error
        );

        return null;

    }

}


// =====================================
// SEND FOOD MESSAGE
// =====================================

if (composer) {

    composer.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const text =
                messageInput.value.trim();


            if (!text) {
                return;
            }


            sendBtn.disabled = true;


            try {

                const userName =
                    getUserName();


                const userId =
                    currentUser?.uid ||
                    "guest";


                const phone =
                    currentUser?.phoneNumber ||
                    "";


                // =========================
                // FIREBASE
                // =========================

                const newMessageRef =
                    push(
                        ref(
                            db,
                            "rooms/food/messages"
                        )
                    );


                const messageData = {

                    text: text,

                    userId: userId,

                    userName: userName,

                    phone: phone,

                    room: "food",

                    createdAt:
                        serverTimestamp()

                };


                await set(
                    newMessageRef,
                    messageData
                );


                // =========================
                // XAMPP / MYSQL
                // =========================

                await saveToXampp({
                    text: text,
                    userId: userId,
                    userName: userName,
                    phone: phone
                });


                messageInput.value = "";


                emojiPanel?.classList.remove(
                    "show"
                );


                messageInput.focus();


            } catch (error) {

                console.error(
                    "Food message send error:",
                    error
                );

                alert(
                    "Message failed to send. Check Firebase Database rules."
                );

            } finally {

                sendBtn.disabled = false;

            }

        }
    );

}


// =====================================
// EMOJI
// =====================================

if (emojiBtn) {

    emojiBtn.addEventListener(
        "click",
        () => {

            emojiPanel?.classList.toggle(
                "show"
            );

        }
    );

}


document
    .querySelectorAll(
        ".emoji-panel button"
    )
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                messageInput.value +=
                    button.textContent;

                messageInput.focus();

            }
        );

    });


// =====================================
// ADD BUTTON
// =====================================

const addBtn =
    document.getElementById("addBtn");

if (addBtn) {

    addBtn.addEventListener(
        "click",
        () => {

            emojiPanel?.classList.toggle(
                "show"
            );

        }
    );

}


// =====================================
// SEARCH
// =====================================

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        () => {

            searchBox?.classList.toggle(
                "show"
            );


            if (
                searchBox?.classList.contains(
                    "show"
                )
            ) {

                searchInput?.focus();

            } else {

                if (searchInput) {
                    searchInput.value = "";
                }

                filterMessages("");

            }

        }
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            filterMessages(
                searchInput.value.toLowerCase()
            );

        }
    );

}


function filterMessages(searchText) {

    const allMessages =
        messagesBox.querySelectorAll(
            ".chat-message"
        );


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
// ROOM INFO
// =====================================

if (roomInfoBtn) {

    roomInfoBtn.addEventListener(
        "click",
        () => {

            roomInfoPanel?.classList.toggle(
                "show"
            );

        }
    );

}


// =====================================
// ENTER TO SEND
// =====================================

if (messageInput) {

    messageInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                composer?.requestSubmit();

            }

        }
    );

}


// =====================================
// FOOD NAVIGATION
// =====================================

document
    .querySelectorAll("[data-food-page]")
    .forEach((item) => {

        item.addEventListener(
            "click",
            () => {

                const page =
                    item.dataset.foodPage;

                const pages = {

                    home: "Food.html",

                    discover:
                        "FoodExplore.html",

                    rooms:
                        "FoodRooms.html",

                    people:
                        "FoodPeople.html",

                    mentions:
                        "Mentions.html",

                    messages:
                        "Message.html",

                    settings:
                        "Settings.html"

                };


                if (pages[page]) {

                    window.location.href =
                        pages[page];

                }

            }
        );

    });
