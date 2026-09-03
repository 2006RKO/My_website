/* =========================================================
   CHAPCY — FIREBASE PHONE AUTH
   ========================================================= */

import { initializeApp } 
    from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber
} 
    from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


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

const chapcyApp = initializeApp(firebaseConfig);
const chapcyAuth = getAuth(chapcyApp);


/* =========================================================
   GLOBAL AUTH VARIABLES
   ========================================================= */

let confirmationResult = null;
let recaptchaVerifier = null;


/* =========================================================
   COUNTRY DATA
   ========================================================= */

/*
   WEKA countries ARRAY YAKO HAPA.
   Usibadilishe array yako.
*/


let selectedCountry = {
    flag: "🇹🇿",
    name: "Tanzania",
    code: "+255"
};


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const registerForm =
    document.getElementById("registerForm");

const countrySelector =
    document.getElementById("countrySelector");

const countryOverlay =
    document.getElementById("countryOverlay");

const countryModal =
    document.getElementById("countryModal");

const closeCountryModal =
    document.getElementById("closeCountryModal");

const countrySearch =
    document.getElementById("countrySearch");

const countryList =
    document.getElementById("countryList");

const phoneInput =
    document.getElementById("phoneInput");

const detectedCountry =
    document.getElementById("detectedCountry");

const continueBtn =
    document.getElementById("continueBtn");

const buttonText =
    continueBtn?.querySelector(".button-text");

const buttonLoader =
    continueBtn?.querySelector(".button-loader");

const phoneError =
    document.getElementById("phoneError");

const verificationSection =
    document.getElementById("verificationSection");

const successSection =
    document.getElementById("successSection");


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   COUNTRY UI
   ========================================================= */

function updateCountryUI() {

    if (countrySelector) {

        countrySelector.innerHTML = `
            <span class="country-flag">
                ${selectedCountry.flag}
            </span>

            <span class="country-name">
                ${escapeHTML(selectedCountry.name)}
            </span>

            <span class="country-code">
                ${selectedCountry.code}
            </span>
        `;
    }

    if (detectedCountry) {

        detectedCountry.textContent =
            `${selectedCountry.flag} ${selectedCountry.name} ${selectedCountry.code}`;
    }
}


/* =========================================================
   RENDER COUNTRIES
   ========================================================= */

function renderCountries(list = countries) {

    if (!countryList) return;

    countryList.innerHTML = "";

    list.forEach(country => {

        const flag = country[0];
        const name = country[1];
        const code = country[2];

        const item = document.createElement("button");

        item.type = "button";
        item.className = "country-item";

        item.innerHTML = `
            <span class="country-item-flag">
                ${escapeHTML(flag)}
            </span>

            <span class="country-item-name">
                ${escapeHTML(name)}
            </span>

            <span class="country-item-code">
                ${escapeHTML(code)}
            </span>
        `;

        item.addEventListener("click", () => {

            selectCountry({
                flag,
                name,
                code
            });

        });

        countryList.appendChild(item);
    });
}


/* =========================================================
   SELECT COUNTRY
   ========================================================= */

function selectCountry(country) {

    selectedCountry = country;

    updateCountryUI();

    closeCountryPicker();

    if (phoneInput) {

        phoneInput.focus();
    }

    clearPhoneError();
}


/* =========================================================
   OPEN COUNTRY PICKER
   ========================================================= */

function openCountryPicker() {

    if (!countryOverlay || !countryModal) return;

    countryOverlay.classList.add("active");
    countryModal.classList.add("active");

    if (countrySearch) {

        countrySearch.value = "";

        setTimeout(() => {
            countrySearch.focus();
        }, 100);
    }

    renderCountries();
}


/* =========================================================
   CLOSE COUNTRY PICKER
   ========================================================= */

function closeCountryPicker() {

    countryOverlay?.classList.remove("active");
    countryModal?.classList.remove("active");
}


/* =========================================================
   COUNTRY EVENTS
   ========================================================= */

countrySelector?.addEventListener(
    "click",
    openCountryPicker
);

closeCountryModal?.addEventListener(
    "click",
    closeCountryPicker
);

countryOverlay?.addEventListener(
    "click",
    closeCountryPicker
);

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeCountryPicker();
    }
});


/* =========================================================
   COUNTRY SEARCH
   ========================================================= */

countrySearch?.addEventListener("input", () => {

    const search =
        countrySearch.value
            .trim()
            .toLowerCase();

    const filtered = countries.filter(country => {

        const name =
            String(country[1]).toLowerCase();

        const code =
            String(country[2]).toLowerCase();

        return (
            name.includes(search) ||
            code.includes(search)
        );
    });

    renderCountries(filtered);
});


/* =========================================================
   CLEAN PHONE
   ========================================================= */

function cleanPhoneNumber(phone) {

    return String(phone || "")
        .replace(/[^\d+]/g, "")
        .trim();
}


/* =========================================================
   INTERNATIONAL PHONE
   ========================================================= */

function getInternationalPhone() {

    let phone =
        cleanPhoneNumber(
            phoneInput?.value || ""
        );

    if (!phone) return "";

    /*
       Kama user ameandika +255...
    */

    if (phone.startsWith("+")) {

        return phone;
    }

    /*
       Kama ameandika 255...
    */

    if (
        phone.startsWith(
            selectedCountry.code.replace("+", "")
        )
    ) {

        return "+" + phone;
    }

    /*
       Kama ameandika 07...
       Tanzania mfano:
       0712345678
       => +255712345678
    */

    if (phone.startsWith("0")) {

        phone =
            phone.substring(1);

        return selectedCountry.code + phone;
    }

    /*
       Kama ameandika namba bila 0
       mfano 712345678
    */

    return selectedCountry.code + phone;
}


/* =========================================================
   VALIDATE PHONE
   ========================================================= */

function validatePhoneNumber(phone) {

    if (!phone) {

        return "Please enter your phone number.";
    }

    if (!/^\+\d{8,15}$/.test(phone)) {

        return "Please enter a valid phone number.";
    }

    return "";
}


/* =========================================================
   PHONE ERROR
   ========================================================= */

function showPhoneError(message) {

    if (!phoneError) return;

    phoneError.textContent = message;
    phoneError.style.display = "block";
}


function clearPhoneError() {

    if (!phoneError) return;

    phoneError.textContent = "";
    phoneError.style.display = "none";
}


/* =========================================================
   LOADING
   ========================================================= */

function setLoading(loading) {

    if (!continueBtn) return;

    continueBtn.disabled = loading;

    if (buttonText) {

        buttonText.style.display =
            loading ? "none" : "";
    }

    if (buttonLoader) {

        buttonLoader.style.display =
            loading ? "inline-flex" : "none";
    }
}


/* =========================================================
   CREATE RECAPTCHA
   ========================================================= */

async function createRecaptcha() {

    /*
       Kama tayari ipo, itumie tena.
    */

    if (recaptchaVerifier) {

        return recaptchaVerifier;
    }

    recaptchaVerifier =
        new RecaptchaVerifier(
            chapcyAuth,
            "recaptcha-container",
            {
                size: "invisible",

                callback: () => {

                    console.log(
                        "CHAPCY reCAPTCHA verified."
                    );
                },

                "expired-callback": () => {

                    console.log(
                        "CHAPCY reCAPTCHA expired."
                    );
                }
            }
        );

    await recaptchaVerifier.render();

    return recaptchaVerifier;
}


/* =========================================================
   SEND OTP
   ========================================================= */

async function sendOTP() {

    clearPhoneError();

    const internationalPhone =
        getInternationalPhone();

    const validation =
        validatePhoneNumber(
            internationalPhone
        );

    if (validation) {

        showPhoneError(validation);

        return false;
    }

    setLoading(true);

    try {

        console.log(
            "Sending OTP to:",
            internationalPhone
        );

        const verifier =
            await createRecaptcha();


        confirmationResult =
            await signInWithPhoneNumber(
                chapcyAuth,
                internationalPhone,
                verifier
            );


        /*
           Save temporary registration data.
        */

        sessionStorage.setItem(
            "chapcyPhone",
            internationalPhone
        );

        sessionStorage.setItem(
            "chapcyCountry",
            JSON.stringify(selectedCountry)
        );


        localStorage.setItem(
            "chapcyPendingCountry",
            JSON.stringify(selectedCountry)
        );


        /*
           IMPORTANT:
           ConfirmationResult haiwezi kuhifadhiwa
           moja kwa moja kwenye sessionStorage.
        */

        sessionStorage.setItem(
            "chapcyVerificationStarted",
            "true"
        );


        console.log(
            "OTP sent successfully."
        );


        /*
           Fungua OTP page.
        */

        window.location.href =
            "Mychatotp.html";

        return true;

    } catch (error) {

        console.error(
            "Firebase OTP Error:",
            error
        );

        let message =
            "Failed to send verification code.";

        if (
            error.code ===
            "auth/invalid-phone-number"
        ) {

            message =
                "Invalid phone number.";
        }

        else if (
            error.code ===
            "auth/too-many-requests"
        ) {

            message =
                "Too many attempts. Please try again later.";
        }

        else if (
            error.code ===
            "auth/quota-exceeded"
        ) {

            message =
                "SMS limit has been exceeded.";
        }

        else if (
            error.code ===
            "auth/captcha-check-failed"
        ) {

            message =
                "Security verification failed. Please refresh and try again.";
        }

        else if (
            error.code ===
            "auth/network-request-failed"
        ) {

            message =
                "Network error. Please check your internet connection.";
        }

        else if (error.message) {

            console.error(
                error.message
            );
        }

        showPhoneError(message);

        /*
           Reset reCAPTCHA.
        */

        if (recaptchaVerifier) {

            try {

                recaptchaVerifier.clear();

            } catch (e) {

                console.warn(e);
            }

            recaptchaVerifier = null;
        }

        setLoading(false);

        return false;
    }
}


/* =========================================================
   REGISTER FORM
   ========================================================= */

registerForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        await sendOTP();
    }
);


/* =========================================================
   CONTINUE BUTTON
   ========================================================= */

continueBtn?.addEventListener(
    "click",
    async event => {

        event.preventDefault();

        await sendOTP();
    }
);


/* =========================================================
   PHONE INPUT
   ========================================================= */

phoneInput?.addEventListener(
    "input",
    () => {

        phoneInput.value =
            phoneInput.value.replace(
                /[^\d+]/g,
                ""
            );

        clearPhoneError();
    }
);


/* =========================================================
   ENTER KEY
   ========================================================= */

phoneInput?.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            sendOTP();
        }
    }
);


/* =========================================================
   COMPATIBILITY FUNCTIONS
   ========================================================= */

function showVerificationSection() {

    if (verificationSection) {

        verificationSection.style.display =
            "block";
    }
}


function hideVerificationSection() {

    if (verificationSection) {

        verificationSection.style.display =
            "none";
    }
}


function hideSuccessSection() {

    if (successSection) {

        successSection.style.display =
            "none";
    }
}


/* =========================================================
   VERIFY OTP
   ========================================================= */

async function verifyOTP(code) {

    if (!confirmationResult) {

        console.error(
            "No confirmation result available."
        );

        return false;
    }

    try {

        const result =
            await confirmationResult.confirm(
                code
            );

        console.log(
            "Phone verified:",
            result.user.uid
        );


        localStorage.setItem(
            "chapcyRegistered",
            "true"
        );

        localStorage.setItem(
            "chapcyPhone",
            result.user.phoneNumber || ""
        );


        sessionStorage.setItem(
            "chapcyUserUID",
            result.user.uid
        );


        return true;

    } catch (error) {

        console.error(
            "OTP verification error:",
            error
        );

        return false;
    }
}


/* =========================================================
   RESEND OTP
   ========================================================= */

async function resendOTP() {

    /*
       Clear old reCAPTCHA.
    */

    if (recaptchaVerifier) {

        try {

            recaptchaVerifier.clear();

        } catch (e) {

            console.warn(e);
        }

        recaptchaVerifier = null;
    }

    /*
       Get saved phone.
    */

    const phone =
        sessionStorage.getItem(
            "chapcyPhone"
        );

    if (!phone) {

        console.error(
            "No saved phone number."
        );

        return false;
    }

    try {

        const verifier =
            await createRecaptcha();


        confirmationResult =
            await signInWithPhoneNumber(
                chapcyAuth,
                phone,
                verifier
            );


        console.log(
            "OTP resent successfully."
        );

        return true;

    } catch (error) {

        console.error(
            "Resend OTP error:",
            error
        );

        return false;
    }
}


/* =========================================================
   ENTER CHAPCY
   ========================================================= */

function enterChapcy() {

    localStorage.setItem(
        "chapcyRegistered",
        "true"
    );

    window.location.href =
        "Mychat.html";
}


/* =========================================================
   RESTORE REGISTERED STATE
   ========================================================= */

function restoreRegisteredState() {

    const savedCountry =
        localStorage.getItem(
            "chapcyPendingCountry"
        );

    if (!savedCountry) return;

    try {

        const country =
            JSON.parse(savedCountry);

        if (
            country &&
            country.code
        ) {

            selectedCountry = country;

            updateCountryUI();
        }

    } catch (error) {

        console.warn(
            "Could not restore country:",
            error
        );
    }
}


/* =========================================================
   CHECK EXISTING REGISTRATION
   ========================================================= */

function checkExistingRegistration() {

    const registered =
        localStorage.getItem(
            "chapcyRegistered"
        );

    if (registered === "true") {

        console.log(
            "CHAPCY registration already exists."
        );
    }
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeRegistration() {

    console.log(
        "CHAPCY Registration initialized."
    );

    updateCountryUI();

    renderCountries();

    restoreRegisteredState();

    checkExistingRegistration();

    hideVerificationSection();

    hideSuccessSection();
}


/* =========================================================
   DEBUG / PUBLIC API
   ========================================================= */

window.ChapcyRegistration = {

    getSelectedCountry() {

        return selectedCountry;
    },

    getPhone() {

        return getInternationalPhone();
    },

    sendOTP,

    verifyOTP,

    resendOTP,

    enterChapcy,

    openCountryPicker,

    closeCountryPicker
};


/* =========================================================
   START
   ========================================================= */

initializeRegistration();
