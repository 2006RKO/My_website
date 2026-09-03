/* =========================================================
   CHAPCY — FIREBASE PHONE AUTH
   Mychatregister.js
   ========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
    getAuth,
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
   FIREBASE INITIALIZATION
========================================================= */

const chapcyApp = initializeApp(firebaseConfig);
const chapcyAuth = getAuth(chapcyApp);


/* =========================================================
   AUTH VARIABLES
========================================================= */

let confirmationResult = null;
let recaptchaVerifier = null;
let sendingOTP = false;


/* =========================================================
   COUNTRIES
========================================================= */

/*
   WEKA COUNTRIES ARRAY YAKO KAMILI HAPA.

   MFANO:
*/

const countries = [
    ["🇹🇿", "Tanzania", "+255"],
    ["🇰🇪", "Kenya", "+254"],
    ["🇺🇬", "Uganda", "+256"],
    ["🇷🇼", "Rwanda", "+250"],
    ["🇧🇮", "Burundi", "+257"],
    ["🇿🇦", "South Africa", "+27"],
    ["🇺🇸", "United States", "+1"],
    ["🇬🇧", "United Kingdom", "+44"],
    ["🇨🇦", "Canada", "+1"],
    ["🇦🇺", "Australia", "+61"],
    ["🇩🇪", "Germany", "+49"],
    ["🇫🇷", "France", "+33"],
    ["🇮🇹", "Italy", "+39"],
    ["🇪🇸", "Spain", "+34"],
    ["🇳🇱", "Netherlands", "+31"],
    ["🇳🇴", "Norway", "+47"],
    ["🇸🇪", "Sweden", "+46"],
    ["🇨🇭", "Switzerland", "+41"],
    ["🇮🇳", "India", "+91"],
    ["🇨🇳", "China", "+86"],
    ["🇯🇵", "Japan", "+81"],
    ["🇰🇷", "South Korea", "+82"],
    ["🇦🇪", "United Arab Emirates", "+971"],
    ["🇸🇦", "Saudi Arabia", "+966"],
    ["🇳🇬", "Nigeria", "+234"],
    ["🇬🇭", "Ghana", "+233"],
    ["🇿🇲", "Zambia", "+260"],
    ["🇿🇼", "Zimbabwe", "+263"],
    ["🇲🇼", "Malawi", "+265"],
    ["🇲🇿", "Mozambique", "+258"],
    ["🇪🇹", "Ethiopia", "+251"],
    ["🇪🇬", "Egypt", "+20"],
    ["🇧🇷", "Brazil", "+55"],
    ["🇲🇽", "Mexico", "+52"]
];


/* =========================================================
   DEFAULT COUNTRY
========================================================= */

let selectedCountry = {
    flag: "🇹🇿",
    name: "Tanzania",
    code: "+255"
};


/* =========================================================
   DOM
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


/* =========================================================
   ESCAPE HTML
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
   UPDATE COUNTRY UI
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

        const item =
            document.createElement("button");

        item.type = "button";

        item.className =
            "country-item";

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

        item.addEventListener(
            "click",
            () => {

                selectCountry({
                    flag,
                    name,
                    code
                });

            }
        );

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

    clearPhoneError();

    phoneInput?.focus();
}


/* =========================================================
   OPEN COUNTRY PICKER
========================================================= */

function openCountryPicker() {

    if (!countryOverlay) return;

    countryOverlay.classList.add("active");

    countryModal?.classList.add("active");

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

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeCountryPicker();
        }
    }
);


/* =========================================================
   COUNTRY SEARCH
========================================================= */

countrySearch?.addEventListener(
    "input",
    () => {

        const search =
            countrySearch.value
                .trim()
                .toLowerCase();

        const filtered =
            countries.filter(country => {

                const name =
                    String(country[1])
                        .toLowerCase();

                const code =
                    String(country[2])
                        .toLowerCase();

                return (
                    name.includes(search) ||
                    code.includes(search)
                );
            });

        renderCountries(filtered);
    }
);


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


    if (phone.startsWith("+")) {

        return phone;
    }


    const countryCode =
        selectedCountry.code.replace(
            "+",
            ""
        );


    if (phone.startsWith(countryCode)) {

        return "+" + phone;
    }


    if (phone.startsWith("0")) {

        phone = phone.substring(1);

        return (
            selectedCountry.code +
            phone
        );
    }


    return (
        selectedCountry.code +
        phone
    );
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
   ERROR
========================================================= */

function showPhoneError(message) {

    if (!phoneError) {

        alert(message);

        return;
    }

    phoneError.textContent =
        message;

    phoneError.style.display =
        "block";
}


function clearPhoneError() {

    if (!phoneError) return;

    phoneError.textContent = "";

    phoneError.style.display =
        "none";
}


/* =========================================================
   LOADING
========================================================= */

function setLoading(loading) {

    if (!continueBtn) return;

    continueBtn.disabled =
        loading;


    if (buttonText) {

        buttonText.style.display =
            loading ? "none" : "";
    }


    if (buttonLoader) {

        buttonLoader.style.display =
            loading
                ? "inline-flex"
                : "none";
    }
}


/* =========================================================
   CREATE RECAPTCHA
========================================================= */

async function createRecaptcha() {

    if (recaptchaVerifier) {

        return recaptchaVerifier;
    }


    const container =
        document.getElementById(
            "recaptcha-container"
        );

    if (!container) {

        throw new Error(
            "recaptcha-container is missing from Mychatregister.html"
        );
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

    /*
       Prevent double click / double SMS
    */

    if (sendingOTP) {

        return;
    }


    clearPhoneError();


    const internationalPhone =
        getInternationalPhone();


    console.log(
        "CHAPCY phone:",
        internationalPhone
    );


    const validation =
        validatePhoneNumber(
            internationalPhone
        );


    if (validation) {

        showPhoneError(
            validation
        );

        return;
    }


    sendingOTP = true;

    setLoading(true);


    try {

        console.log(
            "Creating reCAPTCHA..."
        );


        const verifier =
            await createRecaptcha();


        console.log(
            "Sending Firebase OTP..."
        );


        confirmationResult =
            await signInWithPhoneNumber(
                chapcyAuth,
                internationalPhone,
                verifier
            );


        console.log(
            "OTP SENT SUCCESSFULLY"
        );


        /*
           SAVE PHONE
        */

        sessionStorage.setItem(
            "chapcyPendingPhone",
            internationalPhone
        );


        sessionStorage.setItem(
            "chapcyPhone",
            internationalPhone
        );


        /*
           IMPORTANT:
           Save Firebase verification ID.
        */

        sessionStorage.setItem(
            "chapcyVerificationId",
            confirmationResult.verificationId
        );


        /*
           SAVE COUNTRY
        */

        sessionStorage.setItem(
            "chapcyCountryName",
            selectedCountry.name
        );


        sessionStorage.setItem(
            "chapcyCountry",
            JSON.stringify(
                selectedCountry
            )
        );


        localStorage.setItem(
            "chapcyPendingCountry",
            JSON.stringify(
                selectedCountry
            )
        );


        /*
           MOVE TO OTP PAGE
        */

        window.location.href =
            "Mychatotp.html";

    }

    catch (error) {

        console.error(
            "CHAPCY FIREBASE ERROR:",
            error
        );


        let message =
            "Failed to send verification code.";


        switch (error.code) {

            case "auth/invalid-phone-number":

                message =
                    "Invalid phone number.";

                break;


            case "auth/too-many-requests":

                message =
                    "Too many attempts. Please try again later.";

                break;


            case "auth/quota-exceeded":

                message =
                    "SMS limit has been exceeded.";

                break;


            case "auth/captcha-check-failed":

                message =
                    "Security verification failed. Please refresh the page.";

                break;


            case "auth/network-request-failed":

                message =
                    "Network error. Check your internet connection.";

                break;


            case "auth/operation-not-allowed":

                message =
                    "Phone authentication is not enabled in Firebase.";

                break;


            case "auth/app-not-authorized":

                message =
                    "This website is not authorized in Firebase.";

                break;


            default:

                if (error.message) {

                    console.error(
                        error.message
                    );
                }

                break;
        }


        showPhoneError(
            message
        );


        /*
           Reset reCAPTCHA
        */

        if (recaptchaVerifier) {

            try {

                recaptchaVerifier.clear();

            } catch (e) {

                console.warn(e);
            }

            recaptchaVerifier = null;
        }

    }

    finally {

        sendingOTP = false;

        setLoading(false);
    }
}


/* =========================================================
   FORM SUBMIT
========================================================= */

/*
   MUHIMU:
   Tunatumia submit event PEKEE.
   Usiongeze click listener nyingine kwenye Continue.
*/

registerForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        sendOTP();

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

            registerForm?.requestSubmit();
        }
    }
);


/* =========================================================
   RESTORE COUNTRY
========================================================= */

function restoreRegisteredState() {

    const savedCountry =
        localStorage.getItem(
            "chapcyPendingCountry"
        );


    if (!savedCountry) return;


    try {

        const country =
            JSON.parse(
                savedCountry
            );


        if (
            country &&
            country.code
        ) {

            selectedCountry =
                country;

            updateCountryUI();
        }

    }

    catch (error) {

        console.warn(
            "Could not restore country:",
            error
        );
    }
}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeRegistration() {

    console.log(
        "CHAPCY Registration initialized."
    );


    updateCountryUI();

    renderCountries();

    restoreRegisteredState();

}


/* =========================================================
   DEBUG API
========================================================= */

window.ChapcyRegistration = {

    getSelectedCountry() {

        return selectedCountry;
    },

    getPhone() {

        return getInternationalPhone();
    },

    sendOTP,

    openCountryPicker,

    closeCountryPicker

};


/* =========================================================
   START
========================================================= */

initializeRegistration();
