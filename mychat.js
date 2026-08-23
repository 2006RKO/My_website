/* =====================================================
   CHAPCY MY CHAT JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* =================================================
       ELEMENTS
    ================================================= */

    const chatItems = document.querySelectorAll(".chat-item");

    const chatSidebar =
        document.getElementById("chatSidebar");

    const conversation =
        document.getElementById("conversation");

    const backChats =
        document.getElementById("backChats");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const messageInput =
        document.getElementById("messageInput");

    const sendMessage =
        document.getElementById("sendMessage");

    const messages =
        document.getElementById("messages");

    const conversationName =
        document.getElementById("conversationName");

    const conversationAvatar =
        document.getElementById("conversationAvatar");

    const conversationStatus =
        document.getElementById("conversationStatus");

    const chatSearch =
        document.getElementById("chatSearch");

    const clearSearch =
        document.getElementById("clearSearch");

    const filters =
        document.querySelectorAll(".filter");

    const newChatBtn =
        document.getElementById("newChatBtn");

    const newChatModal =
        document.getElementById("newChatModal");

    const closeNewChat =
        document.getElementById("closeNewChat");

    const profileButton =
        document.getElementById("profileButton");

    const settingsPanel =
        document.getElementById("settingsPanel");

    const closeSettings =
        document.getElementById("closeSettings");

    const settingsOverlay =
        document.getElementById("settingsOverlay");

    const themeToggle =
        document.getElementById("themeToggle");

    const themeText =
        document.getElementById("themeText");

    const toast =
        document.getElementById("toast");



    /* =================================================
       CHAT DATABASE — TEMPORARY FRONTEND
    ================================================= */

    const chatData = {

        sarah: {
            name: "Sarah",
            avatar: "https://i.pravatar.cc/150?img=47",
            status: "online"
        },

        john: {
            name: "John",
            avatar: "https://i.pravatar.cc/150?img=12",
            status: "last seen today"
        },

        developers: {
            name: "CHAPCY Developers",
            avatar: "",
            status: "8 members online"
        },

        amina: {
            name: "Amina",
            avatar: "https://i.pravatar.cc/150?img=32",
            status: "online"
        },

        sports: {
            name: "Sports Community",
            avatar: "",
            status: "124 members online"
        }

    };


    /* =================================================
       OPEN CHAT
    ================================================= */

    chatItems.forEach(item => {

        item.addEventListener("click", () => {

            const chatId =
                item.dataset.chat;

            const data =
                chatData[chatId];

            if (!data) return;


            /* ACTIVE */

            chatItems.forEach(chat => {
                chat.classList.remove("active");
            });

            item.classList.add("active");


            /* HEADER */

            conversationName.textContent =
                data.name;

            conversationStatus.textContent =
                data.status;


            if (data.avatar) {

                conversationAvatar.src =
                    data.avatar;

                conversationAvatar.style.display =
                    "block";

            } else {

                conversationAvatar.style.display =
                    "none";
            }


            /* MOBILE */

            if (window.innerWidth <= 700) {

                chatSidebar.classList.add("hidden");

                conversation.classList.add("open");

            }


            /* REMOVE UNREAD */

            const unread =
                item.querySelector(".unread");

            if (unread) {

                unread.remove();

                item.dataset.unread = "0";
            }

        });

    });


    /* =================================================
       BACK TO CHAT LIST
    ================================================= */

    backChats.addEventListener("click", () => {

        conversation.classList.remove("open");

        chatSidebar.classList.remove("hidden");

    });


    /* =================================================
       MOBILE MENU
    ================================================= */

    mobileMenu.addEventListener("click", () => {

        chatSidebar.classList.toggle("hidden");

    });


    /* =================================================
       SEND MESSAGE
    ================================================= */

    function sendNewMessage() {

        const text =
            messageInput.value.trim();

        if (!text) return;


        const message =
            document.createElement("div");

        message.className =
            "message sent";

        message.innerHTML = `

            <div class="message-bubble">

                <p>
                    ${escapeHTML(text)}
                </p>

                <span class="message-time">

                    ${getCurrentTime()}

                    <i class="fa-solid fa-check"></i>

                </span>

            </div>

        `;


        messages.appendChild(message);


        messageInput.value = "";


        scrollMessages();


        showToast("Message sent");


        /* SIMULATE DELIVERY */

        setTimeout(() => {

            const check =
                message.querySelector(
                    ".message-time i"
                );

            if (check) {

                check.className =
                    "fa-solid fa-check-double";

                check.style.color =
                    "#72ddff";
            }

        }, 700);

    }


    sendMessage.addEventListener(
        "click",
        sendNewMessage
    );


    messageInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendNewMessage();
            }

        }
    );


    /* =================================================
       SEARCH
    ================================================= */

    chatSearch.addEventListener(
        "input",
        () => {

            const query =
                chatSearch.value
                    .trim()
                    .toLowerCase();


            clearSearch.style.display =
                query ? "block" : "none";


            chatItems.forEach(item => {

                const name =
                    item.dataset.name
                        .toLowerCase();

                item.style.display =
                    name.includes(query)
                        ? "flex"
                        : "none";

            });

        }
    );


    clearSearch.addEventListener(
        "click",
        () => {

            chatSearch.value = "";

            clearSearch.style.display =
                "none";

            chatItems.forEach(item => {
                item.style.display = "flex";
            });

            chatSearch.focus();

        }
    );


    /* =================================================
       FILTERS
    ================================================= */

    filters.forEach(filter => {

        filter.addEventListener(
            "click",
            () => {

                filters.forEach(btn => {
                    btn.classList.remove("active");
                });

                filter.classList.add("active");


                const type =
                    filter.dataset.filter;


                chatItems.forEach(item => {

                    const unread =
                        Number(
                            item.dataset.unread || 0
                        );

                    const group =
                        item.dataset.type === "group";


                    if (type === "all") {

                        item.style.display =
                            "flex";

                    }

                    else if (type === "unread") {

                        item.style.display =
                            unread > 0
                                ? "flex"
                                : "none";

                    }

                    else if (type === "groups") {

                        item.style.display =
                            group
                                ? "flex"
                                : "none";
                    }

                });

            }
        );

    });


    /* =================================================
       NEW CHAT
    ================================================= */

    newChatBtn.addEventListener(
        "click",
        () => {

            newChatModal.classList.add("open");

        }
    );


    closeNewChat.addEventListener(
        "click",
        () => {

            newChatModal.classList.remove("open");

        }
    );


    newChatModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                newChatModal
            ) {

                newChatModal.classList.remove(
                    "open"
                );

            }

        }
    );


    /* =================================================
       SETTINGS
    ================================================= */

    profileButton.addEventListener(
        "click",
        () => {

            settingsPanel.classList.add(
                "open"
            );

            settingsOverlay.classList.add(
                "open"
            );

        }
    );


    closeSettings.addEventListener(
        "click",
        closeSettingsPanel
    );


    settingsOverlay.addEventListener(
        "click",
        closeSettingsPanel
    );


    function closeSettingsPanel() {

        settingsPanel.classList.remove(
            "open"
        );

        settingsOverlay.classList.remove(
            "open"
        );

    }


    /* =================================================
       THEME
    ================================================= */

    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light"
            );


            const light =
                document.body.classList.contains(
                    "light"
                );


            themeText.textContent =
                light
                    ? "Light"
                    : "Dark";


            localStorage.setItem(
                "chapcyTheme",
                light
                    ? "light"
                    : "dark"
            );

        }
    );


    /* LOAD THEME */

    const savedTheme =
        localStorage.getItem(
            "chapcyTheme"
        );

    if (savedTheme === "light") {

        document.body.classList.add(
            "light"
        );

        themeText.textContent =
            "Light";
    }


    /* =================================================
       NOTIFICATION
    ================================================= */

    const notificationBtn =
        document.getElementById(
            "notificationBtn"
        );

    notificationBtn.addEventListener(
        "click",
        () => {

            showToast(
                "You have 3 new notifications"
            );

        }
    );


    /* =================================================
       EMOJI
    ================================================= */

    const emojiBtn =
        document.getElementById(
            "emojiBtn"
        );

    emojiBtn.addEventListener(
        "click",
        () => {

            messageInput.value += " 😊";

            messageInput.focus();

        }
    );


    /* =================================================
       ATTACHMENT
    ================================================= */

    const attachmentBtn =
        document.getElementById(
            "attachmentBtn"
        );

    attachmentBtn.addEventListener(
        "click",
        () => {

            showToast(
                "Attachment picker ready"
            );

        }
    );


    /* =================================================
       HELPERS
    ================================================= */

    function getCurrentTime() {

        const date =
            new Date();

        return date.toLocaleTimeString(
            [],
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

    }


    function scrollMessages() {

        messages.scrollTo({

            top:
                messages.scrollHeight,

            behavior:
                "smooth"

        });

    }


    function showToast(text) {

        const toastText =
            toast.querySelector("span");

        toastText.textContent =
            text;

        toast.classList.add("show");

        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);

    }


    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text;

        return div.innerHTML;

    }


    /* =================================================
       RESPONSIVE RESET
    ================================================= */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 700) {

                chatSidebar.classList.remove(
                    "hidden"
                );

                conversation.classList.remove(
                    "open"
                );

            }

        }
    );


});
