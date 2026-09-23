```javascript
// ======================================================
// CHAPCY V27 — FEEDBACK SYSTEM
// Firebase + XAMPP + MySQL
// 1 feedback every 3 days
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


// ======================================================
// FIREBASE CONFIG
// ======================================================

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


// ======================================================
// INITIALIZE FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);


// ======================================================
// PHP ENDPOINT
// ======================================================

const PHP_ENDPOINT =
    "http://localhost/chapcy/save-feedback.php";


// ======================================================
// ELEMENTS
// ======================================================

const feedbackForm =
    document.getElementById("feedbackForm");

const feedbackMessage =
    document.getElementById("feedbackMessage");

const counter =
    document.getElementById("counter");

const sendFeedback =
    document.getElementById("sendFeedback");

const feedbackCard =
    document.getElementById("feedbackCard");

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


// ======================================================
// USER DATA
// ======================================================

let currentUser = null;

let currentUserData = {
    name: "CHAPCY User",
    phone: ""
};

let isSubmitting = false;
let countdownTimer = null;


// ======================================================
// CHARACTER COUNTER
// ======================================================

function updateCounter() {

    if (!feedbackMessage || !counter) return;

    const length = feedbackMessage.value.length;

    counter.textContent = `${length} / 1000`;
}

feedbackMessage?.addEventListener(
    "input",
    updateCounter
);

updateCounter();


// ======================================================
// NOTIFICATION
// ======================================================

function showNotification() {

    if (!successNotification) return;

    successNotification.style.display = "flex";

    setTimeout(() => {
        successNotification.style.display = "none";
    }, 5000);
}


function hideNotification() {

    if (!successNotification) return;

    successNotification.style.display = "none";
}


closeNotification?.addEventListener(
    "click",
    hideNotification
);


// ======================================================
// FORMAT COUNTDOWN
// ======================================================

function formatRemaining(seconds) {

    seconds = Math.max(0, Math.floor(seconds));

    const days =
        Math.floor(seconds / 86400);

    seconds %= 86400;

    const hours =
        Math.floor(seconds / 3600);

    seconds %= 3600;

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        seconds % 60;

    return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
}


// ======================================================
// SHOW LOCKED SCREEN
// ======================================================

function showLockedScreen(seconds) {

    if (feedbackCard) {
        feedbackCard.style.display = "none";
    }

    if (successScreen) {
        successScreen.style.display = "none";
    }

    if (feedbackLocked) {
        feedbackLocked.style.display = "block";
    }

    updateCountdown(seconds);

    if (countdownTimer) {
        clearInterval(countdownTimer);
    }

    countdownTimer = setInterval(() => {

        seconds--;

        updateCountdown(seconds);

        if (seconds <= 0) {

            clearInterval(countdownTimer);

            countdownTimer = null;

            unlockFeedback();
        }

    }, 1000);
}


// ======================================================
// UPDATE COUNTDOWN
// ======================================================

function updateCountdown(seconds) {

    if (!countdown) return;

    countdown.textContent =
        formatRemaining(seconds);
}


// ======================================================
// UNLOCK FEEDBACK
// ======================================================

function unlockFeedback() {

    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }

    if (feedbackLocked) {
        feedbackLocked.style.display = "none";
    }

    if (feedbackCard) {
        feedbackCard.style.display = "block";
    }
}


// ======================================================
// LOAD USER DATA FROM FIREBASE
// ======================================================

async function loadUserData(user) {

    try {

        const userRef =
            ref(db, `users/${user.uid}`);

        const snapshot =
            await get(userRef);

        if (snapshot.exists()) {

            const data = snapshot.val();

            currentUserData.name =
                data.name ||
                data.displayName ||
                "CHAPCY User";

            currentUserData.phone =
                data.phone ||
                data.phoneNumber ||
                user.phoneNumber ||
                "";

        } else {

            currentUserData.name =
                user.displayName ||
                "CHAPCY User";

            currentUserData.phone =
                user.phoneNumber ||
                "";
        }

    } catch (error) {

        console.error(
            "Unable to load user data:",
            error
        );

        currentUserData.name =
            user.displayName ||
            "CHAPCY User";

        currentUserData.phone =
            user.phoneNumber ||
            "";
    }
}


// ======================================================
// AUTH STATE
// ======================================================

onAuthStateChanged(
    auth,
    async (user) => {

        currentUser = user;

        if (!user) {

            console.warn(
                "CHAPCY Feedback: user is not logged in."
            );

            if (sendFeedback) {
                sendFeedback.disabled = true;
            }

            if (feedbackMessage) {
                feedbackMessage.disabled = true;
                feedbackMessage.placeholder =
                    "Please login to send feedback...";
            }

            return;
        }


        await loadUserData(user);


        if (sendFeedback) {
            sendFeedback.disabled = false;
        }

        if (feedbackMessage) {
            feedbackMessage.disabled = false;
            feedbackMessage.placeholder =
                "Write your suggestion here...";
        }

        console.log(
            "Feedback user:",
            currentUserData.name
        );
    }
);


// ======================================================
// SEND DATA TO PHP
// ======================================================

async function sendToPHP(message) {

    if (!currentUser) {
        throw new Error(
            "Please login before sending feedback."
        );
    }


    const response = await fetch(
        PHP_ENDPOINT,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8"
            },

            body: new URLSearchParams({

                firebase_uid:
                    currentUser.uid,

                name:
                    currentUserData.name,

                phone:
                    currentUserData.phone,

                message:
                    message
            })
        }
    );


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
            "Server returned an invalid response."
        );
    }


    return data;
}


// ======================================================
// SUCCESS ANIMATION
// ======================================================

function startSuccessAnimation() {

    if (feedbackCard) {
        feedbackCard.style.display = "none";
    }

    if (feedbackLocked) {
        feedbackLocked.style.display = "none";
    }

    if (!successScreen) return;

    successScreen.style.display = "block";


    // Restart progress animation
    const progress =
        successScreen.querySelector(
            ".progress span"
        );

    if (progress) {

        progress.style.animation = "none";

        void progress.offsetWidth;

        progress.style.animation =
            "progress 10s linear forwards";
    }


    // Show notification
    setTimeout(() => {

        showNotification();

    }, 700);


    // Redirect after 10 seconds
    setTimeout(() => {

        window.location.href =
            "chapcy.html";

    }, 10000);
}


// ======================================================
// SUBMIT FEEDBACK
// ======================================================

feedbackForm?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (isSubmitting) return;


        // Check login
        if (!currentUser) {

            alert(
                "Please login to your CHAPCY account first."
            );

            return;
        }


        const message =
            feedbackMessage.value.trim();


        // Empty message
        if (!message) {

            alert(
                "Please write your feedback first."
            );

            feedbackMessage.focus();

            return;
        }


        // Maximum length
        if (message.length > 1000) {

            alert(
                "Your feedback cannot exceed 1000 characters."
            );

            return;
        }


        isSubmitting = true;


        if (sendFeedback) {
            sendFeedback.classList.add("loading");
            sendFeedback.disabled = true;
        }


        try {

            const result =
                await sendToPHP(message);


            // ==========================================
            // SERVER LOCK
            // ==========================================

            if (
                result.locked === true ||
                result.success === false &&
                result.remaining_seconds
            ) {

                const seconds =
                    Number(
                        result.remaining_seconds || 0
                    );

                showLockedScreen(seconds);

                if (result.message) {
                    console.log(result.message);
                }

                return;
            }


            // ==========================================
            // SUCCESS
            // ==========================================

            if (result.success === true) {

                feedbackMessage.value = "";

                updateCounter();

                startSuccessAnimation();

                return;
            }


            // ==========================================
            // UNKNOWN RESPONSE
            // ==========================================

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
                "Something went wrong. Please try again."
            );

        } finally {

            isSubmitting = false;

            if (sendFeedback) {

                sendFeedback.classList.remove(
                    "loading"
                );

                sendFeedback.disabled =
                    !currentUser;
            }
        }
    }
);


// ======================================================
// CLEANUP
// ======================================================

window.addEventListener(
    "beforeunload",
    () => {

        if (countdownTimer) {
            clearInterval(countdownTimer);
        }
    }
);


// ======================================================
// STARTUP
// ======================================================

console.log(
    "CHAPCY V27 Feedback System Loaded 🚀"
);
```
