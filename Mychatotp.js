/* =========================================================
   CHAPCY — MYCHAT OTP
   Firebase Phone Authentication
   XAMPP + PHP + MySQL READY
   ========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
    getAuth,
    PhoneAuthProvider,
    signInWithCredential,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


/* =========================================================
   FIREBASE CONFIG
   ========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyDIID2LpzjLiqaLeLJKgp-Vd7tNIyN-M1k",
    authDomain: "rko-website-design-2f792.firebaseapp.com",
    databaseURL: "https://rko-website-design-2f792-default-rtdb.firebaseio.com",
    projectId: "rko-website-design-2f792",
    storageBucket: "rko-website-design-2f792.firebasestorage.app",
    messagingSenderId: "782567629866",
    appId: "1:782567629866:web:d6d80d454d0653ea8b4f53",
    measurementId: "G-KQ1EKYE7E7"
};


/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


/* =========================================================
   DOM
   ========================================================= */

const otpCard =
    document.getElementById("otpCard");

const otpSuccess =
    document.getElementById("otpSuccess");

const otpPhoneNumber =
    document.getElementById("otpPhoneNumber");

const changeNumberBtn =
    document.getElementById("changeNumberBtn");

const otpForm =
    document.getElementById("otpForm");

const otpInputs =
    document.querySelectorAll(".otp-input");

const otpError =
    document.getElementById("otpError");

const otpErrorText =
    document.getElementById("otpErrorText");

const verifyBtn =
    document.getElementById("verifyBtn");

const verifyText =
    document.getElementById("verifyText");

const verifyArrow =
    document.getElementById("verifyArrow");

const verifyLoader =
    document.getElementById("verifyLoader");

const resendBtn =
    document.getElementById("resendBtn");

const timer =
    document.getElementById("timer");

const verifiedPhone =
    document.getElementById("verifiedPhone");

const enterChapcyBtn =
    document.getElementById("enterChapcyBtn");

const backBtn =
    document.getElementById("backBtn");

const recaptchaContainer =
    document.getElementById("recaptcha-container");


/* =========================================================
   SESSION DATA
   ========================================================= */

let phoneNumber =
    sessionStorage.getItem("chapcyPendingPhone");

let verificationId =
    sessionStorage.getItem("chapcyVerificationId");

let countryName =
    sessionStorage.getItem("chapcyCountryName") ||
    "Tanzania";

let countryCode =
    sessionStorage.getItem("chapcyCountryCode") ||
    "+255";

let countryFlag =
    sessionStorage.getItem("chapcyCountryFlag") ||
    "🇹🇿";


/* =========================================================
   CHECK SESSION
   ========================================================= */

if (!phoneNumber || !verificationId) {

    console.warn(
        "CHAPCY: OTP session missing."
    );

    window.location.href =
        "Mychatregister.html";

}


/* =========================================================
   DISPLAY PHONE
   ========================================================= */

if (otpPhoneNumber && phoneNumber) {

    otpPhoneNumber.textContent =
        phoneNumber;

}


/* =========================================================
   ERROR
   ========================================================= */

function showError(message) {

    if (!otpError) return;

    if (otpErrorText) {

        otpErrorText.textContent =
            message;

    } else {

        otpError.textContent =
            message;

    }

    otpError.hidden = false;
    otpError.classList.add("show");

}


function hideError() {

    if (!otpError) return;

    if (otpErrorText) {
        otpErrorText.textContent = "";
    }

    otpError.classList.remove("show");
    otpError.hidden = true;

}


/* =========================================================
   OTP INPUT
   ========================================================= */

otpInputs.forEach((input, index) => {

    input.addEventListener("input", event => {

        let value =
            event.target.value
                .replace(/\D/g, "")
                .slice(0, 1);

        event.target.value =
            value;

        if (value) {

            input.classList.add("filled");

            if (
                index <
                otpInputs.length - 1
            ) {

                otpInputs[index + 1].focus();

            }

        } else {

            input.classList.remove("filled");

        }

        hideError();

        /* AUTO VERIFY */

        if (
            getOTPCode().length === 6
        ) {

            setTimeout(() => {
                verifyOTP();
            }, 250);

        }

    });


    input.addEventListener("keydown", event => {

        if (
            event.key === "Backspace" &&
            !input.value &&
            index > 0
        ) {

            otpInputs[index - 1].focus();

        }


        if (
            event.key === "ArrowLeft" &&
            index > 0
        ) {

            otpInputs[index - 1].focus();

        }


        if (
            event.key === "ArrowRight" &&
            index <
            otpInputs.length - 1
        ) {

            otpInputs[index + 1].focus();

        }

    });


    /* PASTE OTP */

    input.addEventListener("paste", event => {

        event.preventDefault();

        const pasted =
            event.clipboardData
                .getData("text")
                .replace(/\D/g, "")
                .slice(0, 6);

        pasted.split("").forEach(
            (digit, i) => {

                if (otpInputs[i]) {

                    otpInputs[i].value =
                        digit;

                    otpInputs[i]
                        .classList
                        .add("filled");

                }

            }
        );

        if (pasted.length === 6) {

            otpInputs[5].focus();

            setTimeout(() => {
                verifyOTP();
            }, 250);

        }

    });

});


/* =========================================================
   GET OTP
   ========================================================= */

function getOTPCode() {

    return Array.from(otpInputs)
        .map(input => input.value)
        .join("");

}


/* =========================================================
   VERIFY LOADING
   ========================================================= */

function setVerifyLoading(loading) {

    if (!verifyBtn) return;

    verifyBtn.disabled =
        loading;

    if (verifyText) {

        verifyText.style.display =
            loading ? "none" : "inline";

    }

    if (verifyArrow) {

        verifyArrow.style.display =
            loading ? "none" : "inline";

    }

    if (verifyLoader) {

        verifyLoader.style.display =
            loading ? "inline-flex" : "none";

    }

}


/* =========================================================
   VERIFY OTP
   ========================================================= */

async function verifyOTP() {

    if (
        verifyBtn &&
        verifyBtn.disabled
    ) {
        return;
    }

    const code =
        getOTPCode();

    hideError();


    if (code.length !== 6) {

        showError(
            "Please enter the complete 6-digit verification code."
        );

        return;

    }


    if (!verificationId) {

        showError(
            "Your verification session has expired. Please request a new code."
        );

        return;

    }


    setVerifyLoading(true);


    try {

        /* -----------------------------------------
           CREATE FIREBASE CREDENTIAL
        ----------------------------------------- */

        const credential =
            PhoneAuthProvider.credential(
                verificationId,
                code
            );


        /* -----------------------------------------
           VERIFY PHONE
        ----------------------------------------- */

        const result =
            await signInWithCredential(
                auth,
                credential
            );


        const user =
            result.user;


        console.log(
            "CHAPCY Firebase user:",
            user
        );


        /* -----------------------------------------
           USER DATA
        ----------------------------------------- */

        const userData = {

            uid:
                user.uid,

            phoneNumber:
                user.phoneNumber ||
                phoneNumber,

            country:
                countryName,

            countryCode:
                countryCode,

            countryFlag:
                countryFlag,

            registered:
                true,

            registeredAt:
                new Date().toISOString()

        };


        /* -----------------------------------------
           LOCAL STORAGE
        ----------------------------------------- */

        localStorage.setItem(
            "chapcyUser",
            JSON.stringify(userData)
        );

        localStorage.setItem(
            "chapcyRegistered",
            "true"
        );

        localStorage.setItem(
            "chapcyPhone",
            user.phoneNumber ||
            phoneNumber
        );

        localStorage.setItem(
            "chapcyUID",
            user.uid
        );

        localStorage.setItem(
            "chapcyCountry",
            countryName
        );


        /* =================================================
           SEND VERIFIED USER TO XAMPP / PHP / MYSQL
           ================================================= */

        await saveUserToDatabase(userData);


        /* -----------------------------------------
           OTP VERIFIED
        ----------------------------------------- */

        sessionStorage.setItem(
            "chapcyOTPVerified",
            "true"
        );


        /* -----------------------------------------
           CLEAN SESSION
        ----------------------------------------- */

        sessionStorage.removeItem(
            "chapcyVerificationId"
        );

        sessionStorage.removeItem(
            "chapcyPendingPhone"
        );


        /* -----------------------------------------
           SHOW SUCCESS
        ----------------------------------------- */

        showSuccess(
            user.phoneNumber ||
            phoneNumber
        );

    }

    catch (error) {

        console.error(
            "CHAPCY OTP ERROR:",
            error
        );

        let message =
            "Unable to verify the code. Please try again.";


        switch (error.code) {

            case "auth/invalid-verification-code":

                message =
                    "The verification code is incorrect.";

                break;


            case "auth/code-expired":

                message =
                    "This verification code has expired. Please request a new code.";

                break;


            case "auth/session-expired":

                message =
                    "Your verification session has expired. Please request a new code.";

                break;


            case "auth/too-many-requests":

                message =
                    "Too many verification attempts. Please wait and try again.";

                break;


            default:

                if (
                    error.message &&
                    error.message.includes(
                        "Failed to fetch"
                    )
                ) {

                    message =
                        "Unable to connect to the CHAPCY server.";

                }

                break;

        }


        showError(message);

    }

    finally {

        setVerifyLoading(false);

    }

}


/* =========================================================
   VERIFY FORM
   ========================================================= */

if (otpForm) {

    otpForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            verifyOTP();

        }
    );

}


if (verifyBtn) {

    verifyBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();

            verifyOTP();

        }
    );

}


/* =========================================================
   SAVE USER TO XAMPP / MYSQL
   ========================================================= */

async function saveUserToDatabase(userData) {

    /*
       IMPORTANT:

       Change this URL if your XAMPP folder
       has a different name.

       Example:
       http://localhost/YOUR_FOLDER/verify-user.php
    */

    const PHP_URL =
        "http://localhost/chapcy/verify-user.php";


    const formData =
        new FormData();

    formData.append(
        "uid",
        userData.uid
    );

    formData.append(
        "phone",
        userData.phoneNumber
    );

    formData.append(
        "country",
        userData.country
    );

    formData.append(
        "country_code",
        userData.countryCode
    );

    formData.append(
        "country_flag",
        userData.countryFlag
    );


    const response =
        await fetch(
            PHP_URL,
            {
                method: "POST",
                body: formData
            }
        );


    const responseText =
        await response.text();


    console.log(
        "PHP RESPONSE:",
        responseText
    );


    let data;

    try {

        data =
            JSON.parse(responseText);

    }

    catch (error) {

        console.error(
            "PHP returned invalid JSON:",
            responseText
        );

        throw new Error(
            "PHP server returned an invalid response."
        );

    }


    if (!data.success) {

        throw new Error(
            data.message ||
            "Unable to save user."
        );

    }


    return data;

}


/* =========================================================
   SUCCESS
   ========================================================= */

function showSuccess(phone) {

    if (otpCard) {

        otpCard.style.display =
            "none";

    }


    if (otpSuccess) {

        otpSuccess.hidden =
            false;

        otpSuccess.style.display =
            "block";

        otpSuccess.classList.add(
            "show"
        );

    }


    if (verifiedPhone) {

        verifiedPhone.textContent =
            phone;

    }

}


/* =========================================================
   ENTER CHAPCY
   ========================================================= */

if (enterChapcyBtn) {

    enterChapcyBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "Mychat.html";

        }
    );

}


/* =========================================================
   CHANGE PHONE NUMBER
   ========================================================= */

if (changeNumberBtn) {

    changeNumberBtn.addEventListener(
        "click",
        () => {

            sessionStorage.removeItem(
                "chapcyPendingPhone"
            );

            sessionStorage.removeItem(
                "chapcyVerificationId"
            );

            sessionStorage.removeItem(
                "chapcyCountryName"
            );

            sessionStorage.removeItem(
                "chapcyCountryCode"
            );

            sessionStorage.removeItem(
                "chapcyCountryFlag"
            );

            sessionStorage.removeItem(
                "chapcyOTPVerified"
            );


            window.location.href =
                "Mychatregister.html";

        }
    );

}


/* =========================================================
   BACK BUTTON
   ========================================================= */

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "Mychatregister.html";

        }
    );

}


/* =========================================================
   RESEND
   ========================================================= */

let resendSeconds = 60;

let resendInterval = null;

let resendRecaptcha = null;


function startResendTimer() {

    resendSeconds = 60;

    updateTimer();

    clearInterval(
        resendInterval
    );


    resendInterval =
        setInterval(() => {

            resendSeconds--;

            updateTimer();


            if (
                resendSeconds <= 0
            ) {

                clearInterval(
                    resendInterval
                );

                resendInterval =
                    null;

            }

        }, 1000);

}


function updateTimer() {

    if (!timer) return;


    if (resendSeconds > 0) {

        timer.textContent =
            `Resend code in ${resendSeconds}s`;

    } else {

        timer.textContent =
            "You can resend the code now.";

    }


    if (resendBtn) {

        resendBtn.disabled =
            resendSeconds > 0;

    }

}


/* =========================================================
   RESEND OTP
   ========================================================= */

async function resendOTP() {

    if (
        resendSeconds > 0 ||
        !phoneNumber
    ) {

        return;

    }


    hideError();


    if (resendBtn) {

        resendBtn.disabled =
            true;

    }


    try {

        /* -----------------------------------------
           CLEAR OLD RECAPTCHA
        ----------------------------------------- */

        if (resendRecaptcha) {

            try {

                resendRecaptcha.clear();

            } catch (error) {

                console.warn(
                    "reCAPTCHA clear error:",
                    error
                );

            }

            resendRecaptcha =
                null;

        }


        /* -----------------------------------------
           CREATE RECAPTCHA
        ----------------------------------------- */

        resendRecaptcha =
            new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible",

                    callback: () => {

                        console.log(
                            "CHAPCY reCAPTCHA solved."
                        );

                    },

                    "expired-callback": () => {

                        console.log(
                            "CHAPCY reCAPTCHA expired."
                        );

                    }
                }
            );


        /* -----------------------------------------
           SEND NEW CODE
        ----------------------------------------- */

        const confirmationResult =
            await signInWithPhoneNumber(
                auth,
                phoneNumber,
                resendRecaptcha
            );


        verificationId =
            confirmationResult.verificationId;


        sessionStorage.setItem(
            "chapcyVerificationId",
            verificationId
        );


        /* -----------------------------------------
           CLEAR OTP
        ----------------------------------------- */

        otpInputs.forEach(input => {

            input.value = "";

            input.classList.remove(
                "filled"
            );

        });


        if (otpInputs.length) {

            otpInputs[0].focus();

        }


        startResendTimer();


        showError(
            "A new verification code has been sent."
        );


        setTimeout(
            hideError,
            3500
        );

    }

    catch (error) {

        console.error(
            "CHAPCY RESEND ERROR:",
            error
        );


        let message =
            "Unable to resend the code. Please try again.";


        if (
            error.code ===
            "auth/too-many-requests"
        ) {

            message =
                "Too many requests. Please wait before trying again.";

        }


        showError(message);

        if (resendBtn) {

            resendBtn.disabled =
                false;

        }

    }

}


/* =========================================================
   RESEND BUTTON
   ========================================================= */

if (resendBtn) {

    resendBtn.addEventListener(
        "click",
        resendOTP
    );

}


/* =========================================================
   ENTER KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            getOTPCode().length === 6
        ) {

            verifyOTP();

        }

    }
);


/* =========================================================
   INITIAL FOCUS
   ========================================================= */

setTimeout(() => {

    if (
        otpInputs.length > 0
    ) {

        otpInputs[0].focus();

    }

}, 500);


/* =========================================================
   START TIMER
   ========================================================= */

startResendTimer();


/* =========================================================
   DEBUG
   ========================================================= */

console.log(
    "===================================="
);

console.log(
    "CHAPCY OTP SYSTEM READY"
);

console.log(
    "Phone:",
    phoneNumber
);

console.log(
    "Country:",
    countryFlag,
    countryName,
    countryCode
);

console.log(
    "Verification ID:",
    verificationId
);

console.log(
    "===================================="
);
