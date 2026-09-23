// =====================================
// FOOD LIVE CHAT - DESIGN PREVIEW
// NO LOGIN / NO PHONE VERIFICATION
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
// DEMO USER
// =====================================

if (profileName) {
    profileName.textContent = "CHAPCY User";
}

if (profileLetter) {
    profileLetter.textContent = "C";
}


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
// LOGOUT BUTTON
// =====================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            alert(
                "Login system will be connected later."
            );

        }
    );

}


// =====================================
// SEND MESSAGE - PREVIEW ONLY
// =====================================

if (composer) {

    composer.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const text =
                messageInput.value.trim();

            if (!text) {
                return;
            }


            const messageElement =
                document.createElement("article");

            messageElement.className =
                "chat-message own";


            // AVATAR

            const avatar =
                document.createElement("div");

            avatar.className =
                "message-avatar";

            avatar.textContent = "C";


            // CONTENT

            const content =
                document.createElement("div");

            content.className =
                "message-content";


            // META

            const meta =
                document.createElement("div");

            meta.className =
                "message-meta";


            const name =
                document.createElement("strong");

            name.textContent =
                "CHAPCY User";


            const time =
                document.createElement("span");

            time.textContent =
                new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                });


            meta.appendChild(name);
            meta.appendChild(time);


            // BUBBLE

            const bubble =
                document.createElement("div");

            bubble.className =
                "message-bubble";

            bubble.textContent =
                text;


            content.appendChild(meta);

            content.appendChild(bubble);

            messageElement.appendChild(avatar);

            messageElement.appendChild(content);

            messagesBox.appendChild(
                messageElement
            );


            emptyChat?.remove();


            messageInput.value = "";

            messageInput.focus();


            messagesBox.scrollTop =
                messagesBox.scrollHeight;

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
// NAVIGATION
// =====================================

document
    .querySelectorAll("[data-food-page]")
    .forEach((item) => {

        item.addEventListener(
            "click",
            (event) => {

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
