// =====================================
// CHAPCY FOOD LIVE CHAT
// PHP + MYSQL VERSION
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

const addBtn = document.getElementById("addBtn");


// =====================================
// CURRENT USER
// =====================================

let currentUser = null;
let isLoadingMessages = false;


// =====================================
// LOAD CURRENT USER
// =====================================

async function loadCurrentUser() {

    try {

        const response = await fetch(
            "get_points.php",
            {
                method: "GET",
                credentials: "same-origin",
                cache: "no-store"
            }
        );

        if (!response.ok) {

            throw new Error(
                "Unable to load user: " +
                response.status
            );

        }

        const data = await response.json();

        if (!data.success || !data.user) {

            throw new Error(
                data.message ||
                "User unavailable"
            );

        }

        currentUser = data.user;

        const name =
            currentUser.name ||
            "CHAPCY User";


        if (profileName) {

            profileName.textContent =
                name;

        }


        if (profileLetter) {

            profileLetter.textContent =
                name
                    .trim()
                    .charAt(0)
                    .toUpperCase() || "C";

        }


        console.log(
            "FOOD USER LOADED:",
            name
        );

    } catch (error) {

        console.error(
            "FOOD USER ERROR:",
            error
        );


        if (profileName) {

            profileName.textContent =
                "CHAPCY User";

        }


        if (profileLetter) {

            profileLetter.textContent =
                "C";

        }

    }

}


// =====================================
// USER NAME
// =====================================

function getUserName() {

    return (
        currentUser?.name ||
        "CHAPCY User"
    );

}


// =====================================
// INITIAL
// =====================================

function getInitial(name) {

    return (
        name
            ?.trim()
            ?.charAt(0)
            ?.toUpperCase() ||
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


    const date =
        new Date(
            String(timestamp)
                .replace(" ", "T")
        );


    if (isNaN(date.getTime())) {

        return "now";

    }


    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// =====================================
// CREATE MESSAGE
// =====================================

function createMessage(message) {

    if (
        !message ||
        !message.text
    ) {

        return null;

    }


    const userName =
        message.userName ||
        "CHAPCY User";


    const isOwn =
        currentUser &&
        message.userId ===
        currentUser.user_id;


    const messageElement =
        document.createElement(
            "article"
        );


    messageElement.className =
        "chat-message" +
        (isOwn ? " own" : "");


    // =================================
    // AVATAR
    // =================================

    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "message-avatar";


    avatar.textContent =
        getInitial(userName);


    // =================================
    // CONTENT
    // =================================

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "message-content";


    // =================================
    // META
    // =================================

    const meta =
        document.createElement(
            "div"
        );


    meta.className =
        "message-meta";


    const name =
        document.createElement(
            "strong"
        );


    name.textContent =
        userName;


    const time =
        document.createElement(
            "span"
        );


    time.textContent =
        formatTime(
            message.createdAt
        );


    meta.appendChild(name);
    meta.appendChild(time);


    // =================================
    // MESSAGE BUBBLE
    // =================================

    const bubble =
        document.createElement(
            "div"
        );


    bubble.className =
        "message-bubble";


    bubble.textContent =
        message.text;


    // =================================
    // BUILD
    // =================================

    content.appendChild(meta);
    content.appendChild(bubble);

    messageElement.appendChild(avatar);
    messageElement.appendChild(content);


    if (messagesBox) {

        messagesBox.appendChild(
            messageElement
        );

    }


    return messageElement;

}


// =====================================
// LOAD FOOD MESSAGES
// =====================================

async function loadFoodMessages() {

    if (!messagesBox) {

        return;

    }


    if (isLoadingMessages) {

        return;

    }


    isLoadingMessages = true;


    try {

        const response =
            await fetch(
                "get_food_messages.php",
                {
                    method: "GET",
                    credentials: "same-origin",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Food messages server error: " +
                response.status
            );

        }


        const responseText =
            await response.text();


        let data;


        try {

            data =
                JSON.parse(
                    responseText
                );

        } catch (error) {

            console.error(
                "FOOD GET RAW RESPONSE:",
                responseText
            );

            throw new Error(
                "Invalid server response. HTTP " +
                response.status
            );

        }


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load messages"
            );

        }


        // =================================
        // REMOVE OLD MESSAGES
        // =================================

        messagesBox
            .querySelectorAll(
                ".chat-message"
            )
            .forEach(
                message =>
                    message.remove()
            );


        const messages =
            Array.isArray(
                data.messages
            )
                ? data.messages
                : [];


        // =================================
        // EMPTY CHAT
        // =================================

        if (
            messages.length === 0
        ) {

            if (emptyChat) {

                emptyChat.style.display =
                    "";

                if (
                    !messagesBox.contains(
                        emptyChat
                    )
                ) {

                    messagesBox.appendChild(
                        emptyChat
                    );

                }

            }


            console.log(
                "FOOD CHAT: No messages yet."
            );


            return;

        }


        // =================================
        // REMOVE EMPTY MESSAGE
        // =================================

        if (emptyChat) {

            emptyChat.remove();

        }


        // =================================
        // DISPLAY MESSAGES
        // =================================

        messages.forEach(
            message => {

                createMessage(
                    message
                );

            }
        );


        // =================================
        // SCROLL DOWN
        // =================================

        messagesBox.scrollTop =
            messagesBox.scrollHeight;


        console.log(
            "FOOD MESSAGES LOADED:",
            messages.length
        );


    } catch (error) {

        console.error(
            "FOOD MESSAGES ERROR:",
            error
        );

    } finally {

        isLoadingMessages = false;

    }

}


// =====================================
// SEND MESSAGE TO MYSQL
// =====================================

async function sendFoodMessage(text) {

    const cleanText =
        String(text || "").trim();


    if (!cleanText) {

        throw new Error(
            "Message cannot be empty."
        );

    }


    try {

        const response =
            await fetch(
                "save-food-messages.php",
                {
                    method: "POST",

                    credentials:
                        "same-origin",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded; charset=UTF-8"
                    },

                    body:
                        new URLSearchParams({
                            message:
                                cleanText,

                            phone:
                                ""
                        })

                }
            );


        // =================================
        // READ SERVER RESPONSE
        // =================================

        const responseText =
            await response.text();


        console.log(
            "FOOD SERVER RESPONSE:",
            responseText
        );


        let data;


        try {

            data =
                JSON.parse(
                    responseText
                );

        } catch (error) {

            console.error(
                "FOOD SERVER RAW RESPONSE:",
                responseText
            );


            throw new Error(
                "Invalid server response. HTTP " +
                response.status
            );

        }


        // =================================
        // CHECK SERVER
        // =================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Message failed to send."
            );

        }


        console.log(
            "FOOD MESSAGE SAVED:",
            data
        );


        return data;


    } catch (error) {

        console.error(
            "FOOD SEND ERROR:",
            error
        );


        throw error;

    }

}


// =====================================
// MOBILE MENU
// =====================================

if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        () => {

            sideNav?.classList.add(
                "open"
            );

            mobileOverlay?.classList.add(
                "show"
            );

        }
    );

}


// =====================================
// CLOSE MOBILE MENU
// =====================================

if (mobileOverlay) {

    mobileOverlay.addEventListener(
        "click",
        closeMobileMenu
    );

}


function closeMobileMenu() {

    sideNav?.classList.remove(
        "open"
    );

    mobileOverlay?.classList.remove(
        "show"
    );

}


// =====================================
// LOGOUT
// =====================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                logoutBtn.disabled =
                    true;


                const response =
                    await fetch(
                        "logout.php",
                        {
                            method: "POST",
                            credentials:
                                "same-origin"
                        }
                    );


                console.log(
                    "FOOD LOGOUT STATUS:",
                    response.status
                );


            } catch (error) {

                console.error(
                    "FOOD LOGOUT ERROR:",
                    error
                );


            } finally {

                window.location.href =
                    "register.html";

            }

        }
    );

}


// =====================================
// SEND MESSAGE FORM
// =====================================

if (composer) {

    composer.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const text =
                messageInput?.value.trim();


            if (!text) {

                return;

            }


            if (sendBtn) {

                sendBtn.disabled =
                    true;

            }


            try {

                await sendFoodMessage(
                    text
                );


                // =========================
                // CLEAR INPUT
                // =========================

                if (messageInput) {

                    messageInput.value =
                        "";

                }


                emojiPanel?.classList.remove(
                    "show"
                );


                // =========================
                // LOAD FROM MYSQL
                // =========================

                await loadFoodMessages();


                messageInput?.focus();


            } catch (error) {

                alert(
                    error.message ||
                    "Message failed to send."
                );


            } finally {

                if (sendBtn) {

                    sendBtn.disabled =
                        false;

                }

            }

        }
    );

}


// =====================================
// EMOJI BUTTON
// =====================================

if (emojiBtn) {

    emojiBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            emojiPanel?.classList.toggle(
                "show"
            );

        }
    );

}


// =====================================
// EMOJI BUTTONS
// =====================================

document
    .querySelectorAll(
        ".emoji-panel button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    if (!messageInput) {

                        return;

                    }


                    messageInput.value +=
                        button.textContent;


                    messageInput.focus();

                }
            );

        }
    );


// =====================================
// ADD BUTTON
// =====================================

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
// CLOSE EMOJI OUTSIDE
// =====================================

document.addEventListener(
    "click",
    event => {

        if (
            emojiPanel &&
            !emojiPanel.contains(
                event.target
            ) &&
            event.target !== emojiBtn &&
            event.target !== addBtn
        ) {

            emojiPanel.classList.remove(
                "show"
            );

        }

    }
);


// =====================================
// SEARCH BUTTON
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

                    searchInput.value =
                        "";

                }


                filterMessages("");

            }

        }
    );

}


// =====================================
// SEARCH INPUT
// =====================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            filterMessages(
                searchInput.value
                    .toLowerCase()
                    .trim()
            );

        }
    );

}


// =====================================
// FILTER MESSAGES
// =====================================

function filterMessages(searchText) {

    if (!messagesBox) {

        return;

    }


    const allMessages =
        messagesBox.querySelectorAll(
            ".chat-message"
        );


    allMessages.forEach(
        message => {

            const text =
                message.textContent
                    .toLowerCase();


            message.style.display =
                text.includes(
                    searchText
                )
                    ? ""
                    : "none";

        }
    );

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
        event => {

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
// NAVIGATION
// =====================================

document
    .querySelectorAll(
        "[data-food-page]"
    )
    .forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    const page =
                        item.dataset.foodPage;


                    const pages = {

                        home:
                            "Food.html",

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

        }
    );


// =====================================
// INITIALIZE FOOD CHAT
// =====================================

async function initFoodChat() {

    console.log(
        "CHAPCY FOOD MYSQL CHAT STARTED 🚀"
    );


    await loadCurrentUser();

    await loadFoodMessages();


    // =================================
    // AUTO REFRESH EVERY 3 SECONDS
    // =================================

    setInterval(
        loadFoodMessages,
        3000
    );

}


// =====================================
// START FOOD CHAT
// =====================================

initFoodChat();