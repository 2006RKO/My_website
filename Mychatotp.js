/* =========================================================
   CHAPCY — MYCHAT OTP
   Firebase Phone Authentication
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
   DOM ELEMENTS
   ========================================================= */

const phoneNumberEl =
    document.getElementById("phoneNumber");

const changeNumberBtn =
    document.getElementById("changeNumber");

const otpInputs =
    document.querySelectorAll(".otp-input");

const verifyBtn =
    document.getElementById("verifyBtn");

const resendBtn =
    document.getElementById("resendBtn");

const resendTimer =
    document.getElementById("resendTimer");

const otpError =
    document.getElementById("otpError");

const otpCard =
    document.querySelector(".otp-card");

const successSection =
    document.getElementById("successSection");

const enterChapcyBtn =
    document.getElementById("enterChapcy");

const recaptchaContainer =
    document.getElementById("recaptcha-container");


/* =========================================================
   SESSION STORAGE
   ========================================================= */

let phoneNumber =
    sessionStorage.getItem(
        "chapcyPendingPhone"
    );

let verificationId =
    sessionStorage.getItem(
        "chapcyVerificationId"
    );

let countryName =
    sessionStorage.getItem(
        "chapcyCountryName"
    ) || "Tanzania";

let countryCode =
    sessionStorage.getItem(
        "chapcyCountryCode"
    ) || "+255";

let countryFlag =
    sessionStorage.getItem(
        "chapcyCountryFlag"
    ) || "🇹🇿";


/* =========================================================
   CHECK OTP SESSION
   ========================================================= */

if (
    !phoneNumber ||
    !verificationId
) {

    console.warn(
        "CHAPCY: OTP session missing."
    );

    window.location.href =
        "Mychatregister.html";
}


/* =========================================================
   DISPLAY PHONE NUMBER
   ========================================================= */

if (
    phoneNumberEl &&
    phoneNumber
) {

    phoneNumberEl.textContent =
        phoneNumber;

}


/* =========================================================
   OTP INPUT
   ========================================================= */

otpInputs.forEach(
    (input, index) => {

        /* ---------------------------------------------
           INPUT
        --------------------------------------------- */

        input.addEventListener(
            "input",
            (event) => {

                let value =
                    event.target.value
                        .replace(/\D/g, "");

                value =
                    value.substring(0, 1);

                event.target.value =
                    value;


                if (value) {

                    input.classList.add(
                        "filled"
                    );

                    if (
                        index <
                        otpInputs.length - 1
                    ) {

                        otpInputs[
                            index + 1
                        ].focus();

                    }

                } else {

                    input.classList.remove(
                        "filled"
                    );

                }


                hideError();

            }
        );


        /* ---------------------------------------------
           BACKSPACE
        --------------------------------------------- */

        input.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "Backspace" &&
                    !input.value &&
                    index > 0
                ) {

                    otpInputs[
                        index - 1
                    ].focus();

                }

            }
        );


        /* ---------------------------------------------
           ARROW LEFT
        --------------------------------------------- */

        input.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "ArrowLeft" &&
                    index > 0
                ) {

                    otpInputs[
                        index - 1
                    ].focus();

                }

            }
        );


        /* ---------------------------------------------
           ARROW RIGHT
        --------------------------------------------- */

        input.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "ArrowRight" &&
                    index <
                    otpInputs.length - 1
                ) {

                    otpInputs[
                        index + 1
                    ].focus();

                }

            }
        );


        /* ---------------------------------------------
           PASTE OTP
        --------------------------------------------- */

        input.addEventListener(
            "paste",
            (event) => {

                event.preventDefault();

                const pasted =
                    event.clipboardData
                        .getData("text")
                        .replace(/\D/g, "")
                        .substring(0, 6);


                pasted
                    .split("")
                    .forEach(
                        (digit, i) => {

                            if (
                                otpInputs[i]
                            ) {

                                otpInputs[i]
                                    .value =
                                    digit;

                                otpInputs[i]
                                    .classList
                                    .add(
                                        "filled"
                                    );

                            }

                        }
                    );


                if (
                    pasted.length === 6
                ) {

                    otpInputs[5]
                        .focus();

                }

            }
        );

    }
);


/* =========================================================
   GET OTP CODE
   ========================================================= */

function getOTPCode() {

    let code = "";

    otpInputs.forEach(
        (input) => {

            code +=
                input.value;

        }
    );

    return code;

}


/* =========================================================
   VERIFY OTP
   ========================================================= */

async function verifyOTP() {

    const code =
        getOTPCode();


    hideError();


    /* ---------------------------------------------
       VALIDATE
    --------------------------------------------- */

    if (
        code.length !== 6
    ) {

        showError(
            "Please enter the complete 6-digit code."
        );

        return;

    }


    /* ---------------------------------------------
       LOADING
    --------------------------------------------- */

    setVerifyLoading(true);


    try {

        if (!verificationId) {

            throw new Error(
                "Verification session expired."
            );

        }


        /* -----------------------------------------
           CREATE PHONE CREDENTIAL
        ----------------------------------------- */

        const credential =
            PhoneAuthProvider.credential(
                verificationId,
                code
            );


        /* -----------------------------------------
           SIGN IN WITH PHONE
        ----------------------------------------- */

        const result =
            await signInWithCredential(
                auth,
                credential
            );


        const user =
            result.user;


        console.log(
            "CHAPCY USER:",
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
           SAVE USER
        ----------------------------------------- */

        localStorage.setItem(
            "chapcyUser",
            JSON.stringify(
                userData
            )
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


        /* -----------------------------------------
           VERIFIED
        ----------------------------------------- */

        sessionStorage.setItem(
            "chapcyOTPVerified",
            "true"
        );


        /* -----------------------------------------
           REMOVE PENDING DATA
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

        showSuccess();

    }

    catch (error) {

        console.error(
            "CHAPCY OTP ERROR:",
            error
        );


        let message =
            "Invalid verification code. Please try again.";


        if (
            error.code ===
            "auth/invalid-verification-code"
        ) {

            message =
                "The verification code is incorrect.";

        }


        if (
            error.code ===
            "auth/code-expired"
        ) {

            message =
                "This verification code has expired. Please request a new one.";

        }


        if (
            error.code ===
            "auth/session-expired"
        ) {

            message =
                "Your verification session has expired. Please register again.";

        }


        if (
            error.code ===
            "auth/too-many-requests"
        ) {

            message =
                "Too many attempts. Please wait and try again.";

        }


        showError(
            message
        );

    }

    finally {

        setVerifyLoading(
            false
        );

    }

}


/* =========================================================
   VERIFY BUTTON
   ========================================================= */

if (verifyBtn) {

    verifyBtn.addEventListener(
        "click",
        verifyOTP
    );

}


/* =========================================================
   AUTO VERIFY
   ========================================================= */

otpInputs.forEach(
    (input) => {

        input.addEventListener(
            "input",
            () => {

                if (
                    getOTPCode()
                        .length === 6
                ) {

                    setTimeout(
                        () => {

                            verifyOTP();

                        },
                        300
                    );

                }

            }
        );

    }
);


/* =========================================================
   RESEND VARIABLES
   ========================================================= */

let resendSeconds = 60;

let resendInterval = null;

let resendRecaptcha = null;


/* =========================================================
   RESEND OTP
   ========================================================= */

async function resendOTP() {

    if (
        resendSeconds > 0
    ) {

        return;

    }


    hideError();

    setResendLoading(
        true
    );


    try {

        /* -----------------------------------------
           CLEAR OLD RECAPTCHA
        ----------------------------------------- */

        if (
            resendRecaptcha
        ) {

            try {

                resendRecaptcha.clear();

            } catch (error) {

                console.log(
                    "reCAPTCHA clear:",
                    error
                );

            }

            resendRecaptcha =
                null;

        }


        /* -----------------------------------------
           CREATE NEW RECAPTCHA
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
           SEND NEW OTP
        ----------------------------------------- */

        const confirmationResult =
            await signInWithPhoneNumber(
                auth,
                phoneNumber,
                resendRecaptcha
            );


        /* -----------------------------------------
           UPDATE VERIFICATION ID
        ----------------------------------------- */

        verificationId =
            confirmationResult
                .verificationId;


        sessionStorage.setItem(
            "chapcyVerificationId",
            verificationId
        );


        /* -----------------------------------------
           CLEAR INPUTS
        ----------------------------------------- */

        otpInputs.forEach(
            (input) => {

                input.value = "";

                input.classList.remove(
                    "filled"
                );

            }
        );


        /* -----------------------------------------
           FOCUS FIRST INPUT
        ----------------------------------------- */

        if (
            otpInputs.length
        ) {

            otpInputs[0]
                .focus();

        }


        /* -----------------------------------------
           START TIMER
        ----------------------------------------- */

        startResendTimer();


        showTemporaryMessage(
            "A new verification code has been sent."
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


        showError(
            message
        );

    }

    finally {

        setResendLoading(
            false
        );

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
   RESEND TIMER
   ========================================================= */

function startResendTimer() {

    resendSeconds =
        60;


    updateTimer();


    clearInterval(
        resendInterval
    );


    resendInterval =
        setInterval(
            () => {

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

                    if (
                        resendBtn
                    ) {

                        resendBtn.disabled =
                            false;

                    }

                }

            },
            1000
        );

}


/* =========================================================
   UPDATE TIMER UI
   ========================================================= */

function updateTimer() {

    if (
        resendTimer
    ) {

        if (
            resendSeconds > 0
        ) {

            resendTimer.textContent =
                `Resend code in ${resendSeconds}s`;

        } else {

            resendTimer.textContent =
                "You can resend the code now.";

        }

    }


    if (
        resendBtn
    ) {

        resendBtn.disabled =
            resendSeconds > 0;

    }

}


/* =========================================================
   START TIMER
   ========================================================= */

startResendTimer();


/* =========================================================
   CHANGE PHONE NUMBER
   ========================================================= */

if (
    changeNumberBtn
) {

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
   SHOW SUCCESS
   ========================================================= */

function showSuccess() {

    if (
        otpCard
    ) {

        otpCard.style.display =
            "none";

    }


    if (
        successSection
    ) {

        successSection.classList.add(
            "show"
        );

        successSection.style.display =
            "block";

    }

}


/* =========================================================
   ENTER CHAPCY
   ========================================================= */

if (
    enterChapcyBtn
) {

    enterChapcyBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "Mychat.html";

        }
    );

}


/* =========================================================
   SHOW ERROR
   ========================================================= */

function showError(
    message
) {

    if (
        !otpError
    ) {

        return;

    }


    otpError.textContent =
        message;

    otpError.classList.add(
        "show"
    );

}


/* =========================================================
   HIDE ERROR
   ========================================================= */

function hideError() {

    if (
        !otpError
    ) {

        return;

    }


    otpError.textContent =
        "";

    otpError.classList.remove(
        "show"
    );

}


/* =========================================================
   TEMPORARY MESSAGE
   ========================================================= */

function showTemporaryMessage(
    message
) {

    if (
        !otpError
    ) {

        return;

    }


    otpError.textContent =
        message;

    otpError.classList.add(
        "show"
    );


    setTimeout(
        () => {

            hideError();

        },
        3500
    );

}


/* =========================================================
   VERIFY BUTTON LOADING
   ========================================================= */

function setVerifyLoading(
    loading
) {

    if (
        !verifyBtn
    ) {

        return;

    }


    verifyBtn.disabled =
        loading;


    const content =
        verifyBtn.querySelector(
            ".verify-button-content"
        );

    const loader =
        verifyBtn.querySelector(
            ".button-loader"
        );


    if (
        content
    ) {

        content.style.display =
            loading
                ? "none"
                : "flex";

    }


    if (
        loader
    ) {

        loader.style.display =
            loading
                ? "block"
                : "none";

    }

}


/* =========================================================
   RESEND BUTTON LOADING
   ========================================================= */

function setResendLoading(
    loading
) {

    if (
        !resendBtn
    ) {

        return;

    }


    resendBtn.disabled =
        loading ||
        resendSeconds > 0;

}


/* =========================================================
   ENTER KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Enter" &&
            getOTPCode().length === 6
        ) {

            verifyOTP();

        }

    }
);


/* =========================================================
   INITIAL FOCUS
   ========================================================= */

setTimeout(
    () => {

        if (
            otpInputs.length > 0
        ) {

            otpInputs[0]
                .focus();

        }

    },
    500
);


/* =========================================================
   DEBUG INFO
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
