/* =====================================================
        CHAPCY.JS
        BUBBLES + USER PROFILE
===================================================== */


/* =====================================================
        BUBBLE SYSTEM
===================================================== */

const bubbleContainer = document.querySelector(".bubble");


function createBubble(fromTop = true) {

    if (!bubbleContainer) return;


    const bubble = document.createElement("img");


    /* Bubble Image */

    bubble.src =
        "file_00000000a59871f4b637e576e04f574d.png";


    /* Random Position */

    bubble.style.left =
        Math.random() * 100 + "%";


    /* Random Size */

    bubble.style.width =
        Math.random() * 70 + 70 + "px";


    /* Random Speed */

    const duration =
        Math.random() * 4 + 8;


    bubble.style.animationDuration =
        duration + "s";


    /* Bubble Direction */

    if (fromTop) {

        bubble.classList.add("top-bubble");

    } else {

        bubble.classList.add("bottom-bubble");

    }


    /* Bubble Ikiguswa */

    bubble.addEventListener(
        "pointerdown",
        () => {

            bubble.style.transition =
                "0.25s ease";

            bubble.style.transform +=
                " scale(1.5)";

            bubble.style.opacity =
                "0";


            setTimeout(() => {

                bubble.remove();

            }, 250);

        }
    );


    /* Ongeza Bubble Kwenye Page */

    bubbleContainer.appendChild(bubble);


    /* Ondoa Baada Ya Animation */

    bubble.addEventListener(
        "animationend",
        () => {

            bubble.remove();

        }
    );

}


/* =====================================================
        CREATE BUBBLE BATCH
===================================================== */

function createBubble(fromTop = true) {

    if (!bubbleContainer) return;


    const bubble = document.createElement("img");


    bubble.src =
        "file_00000000a59871f4b637e576e04f574d.png";


    /* Position random */

    bubble.style.left =
        Math.random() * 100 + "%";


    /* BUBBLE NDOGO */

    bubble.style.width =
        Math.random() * 30 + 35 + "px";


    /* KUSHUKA KWA POLEPOLE */

    const duration =
        Math.random() * 4 + 8;


    bubble.style.animationDuration =
        duration + "s";


    if (fromTop) {

        bubble.classList.add("top-bubble");

    } else {

        bubble.classList.add("bottom-bubble");

    }


    bubble.addEventListener(
        "pointerdown",
        () => {

            bubble.style.transition =
                "0.25s ease";

            bubble.style.transform +=
                " scale(1.5)";

            bubble.style.opacity =
                "0";


            setTimeout(() => {

                bubble.remove();

            }, 250);

        }
    );


    bubbleContainer.appendChild(bubble);


    bubble.addEventListener(
        "animationend",
        () => {

            bubble.remove();

        }
    );

}

/* =====================================================
        BUBBLE LOOP
===================================================== */

function startLoop() {


    /* Bubbles Kutoka Juu */

    createBatch(true);


    /* Baada Ya Sekunde 5 Kutoka Chini */

    setTimeout(
        () => {

            createBatch(false);

        },

        5000

    );


    /* Rudia Kila Sekunde 10 */

    setTimeout(
        startLoop,

        10000

    );

}


startLoop();




/* =====================================================
        USER PROFILE MENU
===================================================== */


/* Fungua Profile */

function toggleProfile() {


    const profileMenu =
        document.getElementById(
            "profileMenu"
        );


    if (!profileMenu) return;


    profileMenu.classList.toggle(
        "show"
    );

}


/* Funga Profile Ukibonyeza Nje */

document.addEventListener(
    "click",
    (event) => {


        const profile =
            document.querySelector(
                ".user-profile"
            );


        const profileMenu =
            document.getElementById(
                "profileMenu"
            );


        if (

            profile &&

            profileMenu &&

            !profile.contains(event.target)

        ) {

            profileMenu.classList.remove(
                "show"
            );

        }

    }
);


/* =====================================================
        LOGOUT
===================================================== */

const logoutButton =
    document.querySelector(
        ".logout-btn"
    );


if (logoutButton) {


    logoutButton.addEventListener(
        "click",
        () => {


            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmLogout) {

                window.location.href =
                    "index.html";

            }

        }
    );

}
