/* =========================================================
   CHAPCY MY CHAT — JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const searchInput = document.querySelector(
        ".chat-search input"
    );

    const chatItems = document.querySelectorAll(
        ".chat-item"
    );

    const navItems = document.querySelectorAll(
        ".bottom-nav-item"
    );

    const newChatBtn = document.querySelector(
        ".new-chat-btn"
    );

    const profile = document.querySelector(
        ".chat-profile"
    );

    const headerButtons = document.querySelectorAll(
        ".header-btn"
    );


    /* =====================================================
       SEARCH CHATS
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const search =
                searchInput.value
                .trim()
                .toLowerCase();

            let visibleChats = 0;

            chatItems.forEach(chat => {

                const name =
                    chat.querySelector(".chat-name")
                    ?.textContent
                    .toLowerCase() || "";

                const message =
                    chat.querySelector(".chat-message")
                    ?.textContent
                    .toLowerCase() || "";

                if (
                    name.includes(search) ||
                    message.includes(search)
                ) {

                    chat.style.display = "flex";

                    visibleChats++;

                } else {

                    chat.style.display = "none";

                }

            });


            /* EMPTY SEARCH */

            const empty =
                document.querySelector(".chat-empty");

            if (empty) {

                empty.style.display =
                    visibleChats === 0
                    ? "block"
                    : "none";
            }

        });

    }


    /* =====================================================
       OPEN CHAT
    ===================================================== */

    chatItems.forEach(chat => {

        chat.addEventListener("click", () => {

            const name =
                chat.querySelector(".chat-name")
                ?.textContent
                .trim();

            if (!name) return;


            /*
             * HAPA BAADAYE TUTAWEKA:
             * chat.html?user=...
             */

            console.log(
                "Opening chat:",
                name
            );


            /*
             * TEMPORARY
             *
             * Ukiwa tayari na chat.html,
             * unaweza kutumia:
             *
             * window.location.href =
             * `chat.html?user=${encodeURIComponent(name)}`;
             */

        });

    });


    /* =====================================================
       BOTTOM NAVIGATION
    ===================================================== */

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            navItems.forEach(nav => {
                nav.classList.remove("active");
            });

            item.classList.add("active");


            const label =
                item.querySelector("span")
                ?.textContent
                .trim()
                .toLowerCase();

            console.log(
                "Navigation:",
                label
            );


            /*
             * HAPA TUTAUNGANISHA:
             *
             * Chats     -> mychat.html
             * Calls     -> calls.html
             * Status    -> status.html
             * Profile   -> profile.html
             */

        });

    });


    /* =====================================================
       NEW CHAT
    ===================================================== */

    if (newChatBtn) {

        newChatBtn.addEventListener(
            "click",
            () => {

                console.log(
                    "New chat clicked"
                );


                /*
                 * BAADAYE:
                 *
                 * open contacts
                 * request contacts permission
                 * search users
                 */

                showMessage(
                    "New Chat",
                    "Contact selection itaongezwa hapa."
                );

            }
        );

    }


    /* =====================================================
       PROFILE
    ===================================================== */

    if (profile) {

        profile.addEventListener(
            "click",
            () => {

                console.log(
                    "Profile clicked"
                );

                /*
                 * BAADAYE:
                 *
                 * window.location.href =
                 * "profile.html";
                 */

            }
        );

    }


    /* =====================================================
       HEADER BUTTONS
    ===================================================== */

    headerButtons.forEach((button, index) => {

        button.addEventListener(
            "click",
            () => {

                /*
                 * BUTTON 1
                 * Search / menu
                 */

                if (index === 0) {

                    if (searchInput) {

                        searchInput.focus();

                        searchInput.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }

                }


                /*
                 * BUTTON 2
                 * Settings / more
                 */

                if (index === 1) {

                    showMessage(
                        "CHAPCY",
                        "Settings menu itaongezwa hapa."
                    );

                }

            }
        );

    });


    /* =====================================================
       REMOVE UNREAD BADGE WHEN CHAT OPENS
    ===================================================== */

    chatItems.forEach(chat => {

        chat.addEventListener(
            "click",
            () => {

                const unread =
                    chat.querySelector(
                        ".chat-unread"
                    );

                if (unread) {

                    unread.remove();

                }

            }
        );

    });


    /* =====================================================
       SIMPLE MESSAGE POPUP
    ===================================================== */

    function showMessage(title, message) {

        const old =
            document.querySelector(
                ".chapcy-toast"
            );

        if (old) {
            old.remove();
        }


        const toast =
            document.createElement("div");

        toast.className =
            "chapcy-toast";


        toast.innerHTML = `
            <strong>${title}</strong>
            <span>${message}</span>
        `;


        document.body.appendChild(toast);


        setTimeout(() => {

            toast.classList.add("show");

        }, 10);


        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {
                toast.remove();
            }, 300);

        }, 2500);

    }


    /* =====================================================
       ADD TOAST STYLE
    ===================================================== */

    const toastStyle =
        document.createElement("style");

    toastStyle.textContent = `

        .chapcy-toast{

            position:fixed;

            left:50%;

            bottom:92px;

            transform:
                translate(-50%,20px);

            width:
                min(90%,360px);

            padding:14px 17px;

            display:flex;

            flex-direction:column;

            gap:3px;

            border-radius:16px;

            background:
                rgba(8,10,35,.92);

            border:
                1px solid
                rgba(0,220,255,.25);

            backdrop-filter:
                blur(18px);

            -webkit-backdrop-filter:
                blur(18px);

            box-shadow:
                0 15px 40px
                rgba(0,0,0,.5),

                0 0 25px
                rgba(0,200,255,.12);

            opacity:0;

            transition:
                .3s ease;

            z-index:9999;
        }


        .chapcy-toast.show{

            opacity:1;

            transform:
                translate(-50%,0);

        }


        .chapcy-toast strong{

            color:#00d9ff;

            font-size:13px;

        }


        .chapcy-toast span{

            color:
                rgba(255,255,255,.65);

            font-size:11px;

        }

    `;

    document.head.appendChild(
        toastStyle
    );


    /* =====================================================
       KEYBOARD SUPPORT
    ===================================================== */

    chatItems.forEach(chat => {

        chat.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    chat.click();

                }

            }
        );

    });


    /* =====================================================
       CONSOLE
    ===================================================== */

    console.log(
        "CHAPCY MyChat loaded successfully 🚀"
    );

});
