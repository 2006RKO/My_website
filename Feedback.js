```javascript
/* =========================================================
   CHAPCY V27 — FEEDBACK SYSTEM
   Firebase + PHP/MySQL
   3-Day Cooldown
   10-Second Success Animation
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyDIID2LpzjLiLeLJKgp-Vd7tNIyN-M1k",
    authDomain: "rko-website-design-2f792.firebaseapp.com",
    databaseURL: "https://rko-website-design-2f792-default-rtdb.firebaseio.com",
    projectId: "rko-website-design-2f792",
    storageBucket: "rko-website-design-2f792.firebasestorage.app",
    messagingSenderId: "782567629866",
    appId: "1:782567629866:web:d6d80d454d0653ea8b4f53",
    measurementId: "G-KQ1EKYE7E7"
};


/* =========================================================
   FIREBASE INITIALIZATION
========================================================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const database = getDatabase(app);


/* =========================================================
   PHP ENDPOINT
========================================================= */

const PHP_ENDPOINT =
    "http://localhost/chapcy/save-feedback.php";


/* =========================================================
   ELEMENTS
========================================================= */

const feedbackForm =
    document.getElementById("feedbackForm");

const feedbackMessage =
    document.getElementById("feedbackMessage");

const counter =
    document.getElementById("counter");

const sendFeedback =
    document.getElementById("sendFeedback");

const feedbackCard =
    document.querySelector(".feedback-card");

const feedbackLocked =
    document.getElementById("feedbackLocked");

const countdown =
    document.getElementById("countdown");

const successScreen =
    document.getElementById("successScreen");

const successNotification =
    document.getElementById("successNotification");

const closeNotification =
    document.getElementById("closeNotification");


/* =========================================================
   USER DATA
========================================================= */

let currentUser = null;

let currentUserData = {
    name: "CHAPCY User",
    phone: ""
};

let isSubmitting = false;

let countdownTimer = null;


/* =========================================================
   CHARACTER COUNTER
========================================================= */

function updateCounter() {

    if (!feedbackMessage || !counter) {
        return;
    }

    const length = feedbackMessage.value.length;

    counter.textContent =
        `${length} / 1000`;

}


if (feedbackMessage) {

    feedbackMessage.addEventListener(
        "input",
        updateCounter
    );

    updateCounter();
}


/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification() {

    if (!successNotification) {
        return;
    }

    successNotification.hidden = false;

}


function hideNotification() {

    if (!successNotification) {
        return;
    }

    successNotification.hidden = true;

}


if (closeNotification) {

    closeNotification.addEventListener(
        "click",
        hideNotification
    );

}


/* =========================================================
   FORMAT REMAINING TIME
========================================================= */

function formatRemaining(seconds) {

    seconds = Math.max(
        0,
        Math.floor(Number(seconds) || 0)
    );

    const days =
        Math.floor(seconds / 86400);

    const hours =
        Math.floor(
            (seconds % 86400) / 3600
        );

    const minutes =
        Math.floor(
            (seconds % 3600) / 60
        );

    const secs =
        seconds % 60;


    if (days > 0) {

        return `${days}D ${hours}H ${minutes}M`;

    }

    if (hours > 0) {

        return `${hours}H ${minutes}M ${secs}S`;

    }

    if (minutes > 0) {

        return `${minutes}M ${secs}S`;

    }

    return `${secs}S`;
}


/* =========================================================
   SHOW LOCKED SCREEN
========================================================= */

function showLockedScreen(seconds) {

    seconds = Math.max(
        0,
        Number(seconds) || 0
    );


    if (feedbackCard) {
        feedbackCard.hidden = true;
    }

    if (feedbackLocked) {
        feedbackLocked.hidden = false;
    }


    updateCountdown(seconds);


    if (countdownTimer) {
        clearInterval(countdownTimer);
    }


    countdownTimer = setInterval(() => {

        seconds--;

        if (seconds <= 0) {

            clearInterval(countdownTimer);

            countdownTimer = null;

            unlockFeedback();

            return;
        }

        updateCountdown(seconds);

    }, 1000);
}


/* =========================================================
   COUNTDOWN
========================================================= */

function updateCountdown(seconds) {

    if (!countdown) {
        return;
    }

    countdown.textContent =
        formatRemaining(seconds);
}


/* =========================================================
   UNLOCK FEEDBACK
========================================================= */

function unlockFeedback() {

    if (feedbackLocked) {
        feedbackLocked.hidden = true;
    }

    if (feedbackCard) {
        feedbackCard.hidden = false;
    }

    if (feedbackMessage) {
        feedbackMessage.disabled = false;
        feedbackMessage.value = "";
    }

    if (sendFeedback) {

        sendFeedback.disabled = false;

        sendFeedback.classList.remove(
            "loading"
        );

    }

    updateCounter();
}


/* =========================================================
   GET USER DATA FROM FIREBASE DATABASE
========================================================= */

async function loadUserData(user) {

    currentUserData = {
        name:
            user.displayName ||
            "CHAPCY User",

        phone:
            user.phoneNumber || ""
    };


    try {

        const userRef =
            ref(database, `users/${user.uid}`);

        const snapshot =
            await get(userRef);


        if (snapshot.exists()) {

            const data =
                snapshot.val() || {};


            currentUserData.name =
                data.name ||
                data.displayName ||
                user.displayName ||
                "CHAPCY User";


            currentUserData.phone =
                data.phone ||
                data.phoneNumber ||
                user.phoneNumber ||
                "";

        }

    } catch (error) {

        console.warn(
            "Could not load Firebase user profile:",
            error
        );

    }

}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            currentUser = null;

            if (sendFeedback) {
                sendFeedback.disabled = true;
            }

            if (feedbackMessage) {

                feedbackMessage.disabled = true;

                feedbackMessage.placeholder =
                    "Please login to send feedback.";

            }

            return;
        }


        currentUser = user;


        await loadUserData(user);


        if (sendFeedback) {
            sendFeedback.disabled = false;
        }

        if (feedbackMessage) {

            feedbackMessage.disabled = false;

            feedbackMessage.placeholder =
                "Write your suggestion here...";

        }

    }
);


/* =========================================================
   SEND FEEDBACK TO PHP
========================================================= */

async function sendToPHP(message) {

    if (!currentUser) {

        throw new Error(
            "Please login before sending feedback."
        );

    }


    const formData =
        new FormData();


    formData.append(
        "firebase_uid",
        currentUser.uid
    );


    formData.append(
        "name",
        currentUserData.name
    );


    formData.append(
        "phone",
        currentUserData.phone
    );


    formData.append(
        "message",
        message
    );


    const response =
        await fetch(
            PHP_ENDPOINT,
            {
                method: "POST",
                body: formData
            }
        );


    if (!response.ok) {

        throw new Error(
            `Server error: ${response.status}`
        );

    }


    const text =
        await response.text();


    let data;


    try {

        data = JSON.parse(text);

    } catch (error) {

        console.error(
            "PHP returned:",
            text
        );

        throw new Error(
            "PHP returned an invalid response."
        );

    }


    return data;
}


/* =========================================================
   SUCCESS ANIMATION
========================================================= */

function startSuccessAnimation() {

    if (!feedbackCard) {
        return;
    }


    if (successScreen) {

        successScreen.hidden = false;

    }


    /*
       Hide the form while animation runs
    */

    feedbackCard.hidden = true;


    /*
       Make sure success screen starts fresh
    */

    if (successScreen) {

        successScreen.classList.remove(
            "success-start"
        );

        void successScreen.offsetWidth;

        successScreen.classList.add(
            "success-start"
        );

    }


    /*
       Show notification
       after short visual delay
    */

    setTimeout(() => {

        showNotification();

    }, 700);


    /*
       Keep success animation for
       EXACTLY 10 seconds
    */

    setTimeout(() => {

        if (successScreen) {
            successScreen.hidden = true;
        }


        /*
           Redirect back to CHAPCY
        */

        window.location.href =
            "chapcy.html";

    }, 10000);

}


/* =========================================================
   FORM SUBMISSION
========================================================= */

if (feedbackForm) {

    feedbackForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (isSubmitting) {
                return;
            }


            /* -------------------------
               LOGIN CHECK
            ------------------------- */

            if (!currentUser) {

                alert(
                    "Please login to your CHAPCY account first."
                );

                return;
            }


            /* -------------------------
               MESSAGE
            ------------------------- */

            const message =
                feedbackMessage
                    ? feedbackMessage.value.trim()
                    : "";


            if (!message) {

                alert(
                    "Please write your feedback first."
                );

                if (feedbackMessage) {
                    feedbackMessage.focus();
                }

                return;
            }


            if (message.length > 1000) {

                alert(
                    "Your message is too long. Maximum 1000 characters."
                );

                return;
            }


            /* -------------------------
               START LOADING
            ------------------------- */

            isSubmitting = true;


            if (sendFeedback) {

                sendFeedback.disabled = true;

                sendFeedback.classList.add(
                    "loading"
                );

            }


            try {

                const result =
                    await sendToPHP(message);


                /* =====================
                   SERVER COOLDOWN
                ===================== */

                if (
                    result.locked === true
                ) {

                    showLockedScreen(
                        result.remaining_seconds
                    );

                    isSubmitting = false;

                    if (sendFeedback) {

                        sendFeedback.disabled = false;

                        sendFeedback.classList.remove(
                            "loading"
                        );

                    }

                    return;
                }


                /* =====================
                   SUCCESS
                ===================== */

                if (
                    result.success === true
                ) {

                    /*
                       Clear message
                    */

                    if (feedbackMessage) {
                        feedbackMessage.value = "";
                    }

                    updateCounter();


                    /*
                       Start V27 animation
                    */

                    startSuccessAnimation();


                    /*
                       Keep submitting locked
                    */

                    isSubmitting = true;

                    return;
                }


                /* =====================
                   SERVER ERROR
                ===================== */

                throw new Error(
                    result.message ||
                    "Unable to send feedback."
                );

            } catch (error) {

                console.error(
                    "Feedback error:",
                    error
                );


                alert(
                    error.message ||
                    "Something went wrong while sending your feedback."
                );


                isSubmitting = false;


                if (sendFeedback) {

                    sendFeedback.disabled = false;

                    sendFeedback.classList.remove(
                        "loading"
                    );

                }

            }

        }
    );

}


/* =========================================================
   PREVENT DOUBLE CLICK
========================================================= */

if (sendFeedback) {

    sendFeedback.addEventListener(
        "click",
        () => {

            if (isSubmitting) {
                return;
            }

        }
    );

}


/* =========================================================
   CLEANUP
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        if (countdownTimer) {

            clearInterval(
                countdownTimer
            );

            countdownTimer = null;

        }

    }
);


/* =========================================================
   DEBUG
========================================================= */

console.log(
    "CHAPCY V27 Feedback System Loaded 🚀"
);
```
