/* =========================================================
   CHAPCY MYCHAT — TRUE HEADER JS
   Includes:
   - Menu
   - Profile
   - Add Contact (+)
   - Search
   - Notifications
   - More
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const menuBtn =
        document.getElementById("menuBtn");

    const profileBtn =
        document.getElementById("profileBtn");

    const addContactBtn =
        document.getElementById("addContactBtn");

    const searchBtn =
        document.getElementById("searchBtn");

    const notificationBtn =
        document.getElementById("notificationBtn");

    const moreBtn =
        document.getElementById("moreBtn");


    /* =====================================================
       SMALL BUTTON ANIMATION
    ===================================================== */

    function buttonPress(button) {

        if (!button) return;

        button.classList.add("pressed");

        setTimeout(() => {
            button.classList.remove("pressed");
        }, 180);
    }


    /* =====================================================
       MENU
    ===================================================== */

    if (menuBtn) {

        menuBtn.addEventListener("click", () => {

            buttonPress(menuBtn);

            console.log("CHAPCY Menu opened");

            /*
             * Tutakuja kuweka:
             * - Settings
             * - Account
             * - Privacy
             * - Contacts
             * - Appearance
             */

        });

    }


    /* =====================================================
       PROFILE
    ===================================================== */

    if (profileBtn) {

        profileBtn.addEventListener("click", () => {

            buttonPress(profileBtn);

            console.log("Opening CHAPCY profile");

            /*
             * Baadaye:
             * profile.html
             */

        });

    }


    /* =====================================================
       ADD CONTACT — REAL ANDROID CONTACT BRIDGE
    ===================================================== */

    if (addContactBtn) {

        addContactBtn.addEventListener("click", () => {

            buttonPress(addContactBtn);


            /*
             * ---------------------------------------------
             * ANDROID APP
             * ---------------------------------------------
             *
             * Kama Android WebView bridge ipo,
             * Android itafungua Contacts halisi.
             */

            if (
                window.Android &&
                typeof window.Android.openContacts === "function"
            ) {

                window.Android.openContacts();

                return;
            }


            /*
             * ---------------------------------------------
             * ANDROID CONTACT PICKER
             * ---------------------------------------------
             *
             * Hii ni fallback kwa WebView/browser
             * zinazounga Contact Picker API.
             */

            if (
                "contacts" in navigator &&
                "ContactsManager" in window
            ) {

                openDeviceContacts();

                return;
            }


            /*
             * ---------------------------------------------
             * FALLBACK
             * ---------------------------------------------
             */

            showContactMessage();

        });

    }


    /* =====================================================
       CONTACT PICKER
    ===================================================== */

    async function openDeviceContacts() {

        try {

            const props = [
                "name",
                "tel",
                "email"
            ];

            const opts = {
                multiple: true
            };


            const contacts =
                await navigator.contacts.select(
                    props,
                    opts
                );


            if (!contacts || contacts.length === 0) {

                console.log(
                    "No contact selected."
                );

                return;
            }


            console.log(
                "Selected contacts:",
                contacts
            );


            /*
             * Hapa ndipo contacts zinaweza
             * kutumwa kwenye backend ya CHAPCY.
             */

            contacts.forEach(contact => {

                console.log(
                    "Name:",
                    contact.name
                );

                console.log(
                    "Phone:",
                    contact.tel
                );

                console.log(
                    "Email:",
                    contact.email
                );

            });


            /*
             * Baadaye tunaweza kufanya:
             *
             * saveContactsToChapcy(contacts)
             *
             * na kuonyesha:
             *
             * "Found 8 CHAPCY users"
             */

        }

        catch (error) {

            console.error(
                "Contact picker error:",
                error
            );

        }

    }


    /* =====================================================
       FALLBACK MESSAGE
    ===================================================== */

    function showContactMessage() {

        const message =
            document.createElement("div");

        message.className =
            "chapcy-contact-message";


        message.innerHTML = `
            <div class="contact-message-icon">
                <i class="fa-solid fa-address-book"></i>
            </div>

            <div class="contact-message-text">
                <strong>Add Contact</strong>
                <span>
                    Contacts za simu zitatumika
                    hapa kwenye CHAPCY.
                </span>
            </div>

            <button
                type="button"
                class="contact-message-close"
                aria-label="Close"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;


        document.body.appendChild(message);


        requestAnimationFrame(() => {

            message.classList.add("show");

        });


        const closeBtn =
            message.querySelector(
                ".contact-message-close"
            );


        if (closeBtn) {

            closeBtn.addEventListener(
                "click",
                () => {

                    message.classList.remove(
                        "show"
                    );

                    setTimeout(() => {

                        message.remove();

                    }, 250);

                }
            );

        }


        setTimeout(() => {

            if (
                document.body.contains(message)
            ) {

                message.classList.remove(
                    "show"
                );

                setTimeout(() => {

                    if (
                        document.body.contains(
                            message
                        )
                    ) {
                        message.remove();
                    }

                }, 250);

            }

        }, 4000);

    }


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchBtn) {

        searchBtn.addEventListener("click", () => {

            buttonPress(searchBtn);

            openSearch();

        });

    }


    function openSearch() {

        console.log(
            "CHAPCY Search opened"
        );

        /*
         * Baadaye tunaweza kuonyesha
         * search bar ya:
         *
         * Name
         * CHAPCY ID
         * Phone number
         */

    }


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            () => {

                buttonPress(
                    notificationBtn
                );

                console.log(
                    "Notifications opened"
                );

            }
        );

    }


    /* =====================================================
       MORE
    ===================================================== */

    if (moreBtn) {

        moreBtn.addEventListener("click", () => {

            buttonPress(moreBtn);

            openMoreMenu();

        });

    }


    function openMoreMenu() {

        console.log(
            "More menu opened"
        );

        /*
         * Tutakuja kuweka:
         *
         * New Group
         * Settings
         * Privacy
         * Linked Devices
         * Help
         */

    }


    /* =====================================================
       GLOBAL ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                console.log(
                    "CHAPCY header action cancelled"
                );

            }

        }
    );


    /* =====================================================
       HEADER READY
    ===================================================== */

    console.log(
        "CHAPCY TRUE HEADER initialized successfully."
    );

});
