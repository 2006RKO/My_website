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
   CHAPCY CONTACT PAGE
===================================================== */

const contactPage =
    document.getElementById("contactPage");

const contactBackBtn =
    document.getElementById("contactBackBtn");

const mariaContact =
    document.getElementById("mariaContact");


/* =====================================================
   OPEN CONTACT PAGE / REGISTER
===================================================== */

if (addContactBtn) {

    addContactBtn.addEventListener("click", () => {

        buttonPress(addContactBtn);

        const registered =
            localStorage.getItem("chapcyRegistered");

        if (registered === "true") {

            /* USER ALREADY REGISTERED */

            if (contactPage) {

                contactPage.style.display = "flex";

                document.body.style.overflow = "hidden";

            }

        } else {

            /* FIRST TIME USER */

            window.location.href = "register.html";

        }

    });

}


/* =====================================================
   BACK FROM CONTACT PAGE
===================================================== */

if (contactBackBtn && contactPage) {

    contactBackBtn.addEventListener("click", () => {

        contactPage.style.display = "none";

        document.body.style.overflow = "";

    });

}


/* =====================================================
   MARIA CONTACT
===================================================== */

if (mariaContact) {

    mariaContact.addEventListener("click", () => {

        console.log("Maria selected");

        /*
         * Hapa ndipo tutaunganisha
         * Private Chat Page.
         */

    });

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
   CHAPCY INTRO — TYPING EFFECT
===================================================== */

const introTagline =
    document.getElementById("introTagline");

if (introTagline) {

    const typingLines = [
        "Connect.",
        "Connect. Chat.",
        "Connect. Chat. Belong."
    ];

    let lineIndex = 0;

    function typeLine(text, callback) {

        introTagline.textContent = "";

        let charIndex = 0;

        const typing = setInterval(() => {

            introTagline.textContent +=
                text.charAt(charIndex);

            charIndex++;

            if (charIndex >= text.length) {

                clearInterval(typing);

                setTimeout(() => {

                    if (callback) {
                        callback();
                    }

                }, 450);
            }

        }, 70);
    }


    function startTyping() {

        if (lineIndex >= typingLines.length) {
            return;
        }

        typeLine(
            typingLines[lineIndex],
            () => {

                lineIndex++;

                startTyping();

            }
        );
    }


    /* Anza typing baada ya logo kuonekana */

    setTimeout(() => {

        startTyping();

    }, 1700);

}


/* =====================================================
   INTRO CLEANUP
===================================================== */

const chapcyIntro =
    document.getElementById("chapcyIntro");

if (chapcyIntro) {

    setTimeout(() => {

        chapcyIntro.style.pointerEvents = "none";

    }, 3900);

}
    /* =====================================================
       HEADER READY
    ===================================================== */

    console.log(
        "CHAPCY TRUE HEADER initialized successfully."
    );

});
