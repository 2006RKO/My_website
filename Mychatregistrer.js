/* =========================================================
   CHAPCY — MYCHAT REGISTER
   Firebase Phone OTP Registration
   Matches Mychatregister.html
========================================================= */

import { initializeApp }
    from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

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
   INITIALIZE FIREBASE
========================================================= */

const chapcyApp = initializeApp(firebaseConfig);
const chapcyAuth = getAuth(chapcyApp);


/* =========================================================
   ELEMENTS
========================================================= */

const registerForm =
    document.getElementById("registerForm");

const phoneNumberInput =
    document.getElementById("phoneNumber");

const countrySelector =
    document.getElementById("countrySelector");

const countryFlag =
    document.getElementById("countryFlag");

const countryCode =
    document.getElementById("countryCode");

const detectedCountry =
    document.getElementById("detectedCountry");

const phoneError =
    document.getElementById("phoneError");

const continueBtn =
    document.getElementById("continueBtn");

const continueText =
    document.querySelector(".continue-text");

const continueArrow =
    document.querySelector(".continue-arrow");

const continueLoader =
    document.getElementById("continueLoader");

const countryOverlay =
    document.getElementById("countryOverlay");

const countryModal =
    document.getElementById("countryModal");

const closeCountry =
    document.getElementById("closeCountry");

const countrySearch =
    document.getElementById("countrySearch");

const countryList =
    document.getElementById("countryList");

const recaptchaContainer =
    document.getElementById("recaptcha-container");


/* =========================================================
   COUNTRIES
========================================================= */

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
   CURRENT COUNTRY
========================================================= */

let selectedCountry = countries[0];

let recaptchaVerifier = null;

let confirmationResult = null;

let sendingOTP = false;


/* =========================================================
   INITIALIZE PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    renderCountries(countries);

    selectCountry(countries[0]);

    setupCountryModal();

    setupPhoneInput();

    setupRegistration();

    console.log("🌍 CHAPCY Registration Ready");

});


/* =========================================================
   RENDER COUNTRIES
========================================================= */

function renderCountries(list) {

    if (!countryList) return;

    countryList.innerHTML = "";

    if (list.length === 0) {

        countryList.innerHTML = `
            <div class="no-country">
                No country found
            </div>
        `;

        return;
    }


    list.forEach(country => {

        const [flag, name, code] = country;

        const item =
            document.createElement("button");

        item.type = "button";

        item.className = "country-item";

        item.innerHTML = `

            <span class="country-item-flag">
                ${flag}
            </span>

            <span class="country-item-name">
                ${name}
            </span>

            <span class="country-item-code">
                ${code}
            </span>

        `;


        item.addEventListener("click", () => {

            selectCountry(country);

            closeCountryModal();

        });


        countryList.appendChild(item);

    });

}


/* =========================================================
   SELECT COUNTRY
========================================================= */

function selectCountry(country) {

    selectedCountry = country;

    const [flag, name, code] = country;


    if (countryFlag) {
        countryFlag.textContent = flag;
    }


    if (countryCode) {
        countryCode.textContent = code;
    }


    if (detectedCountry) {

        detectedCountry.innerHTML = `

            <i class="fa-solid fa-earth-africa"></i>

            <span>
                Country: ${name}
            </span>

        `;

    }


    if (phoneNumberInput) {

        phoneNumberInput.placeholder =
            getPlaceholder(code);

    }

}


/* =========================================================
   PHONE PLACEHOLDER
========================================================= */

function getPlaceholder(code) {

    const placeholders = {

        "+255": "712 345 678",
        "+254": "712 345 678",
        "+256": "712 345 678",
        "+250": "788 123 456",
        "+257": "79 123 456",
        "+27": "71 123 4567",
        "+1": "555 123 4567",
        "+44": "7123 456789",
        "+91": "98765 43210"

    };

    return placeholders[code] || "Phone number";

}


/* =========================================================
   COUNTRY MODAL
========================================================= */

function setupCountryModal() {

    countrySelector?.addEventListener(
        "click",
        openCountryModal
    );


    closeCountry?.addEventListener(
        "click",
        closeCountryModal
    );


    countryOverlay?.addEventListener(
        "click",
        closeCountryModal
    );


    countrySearch?.addEventListener(
        "input",
        () => {

            const search =
                countrySearch.value
                    .trim()
                    .toLowerCase();


            if (!search) {

                renderCountries(countries);

                return;

            }


            const filtered =
                countries.filter(country => {

                    const name =
                        country[1].toLowerCase();

                    const code =
                        country[2].toLowerCase();

                    return (
                        name.includes(search) ||
                        code.includes(search)
                    );

                });


            renderCountries(filtered);

        }
    );

}


/* =========================================================
   OPEN COUNTRY MODAL
========================================================= */

function openCountryModal() {

    countryOverlay?.classList.add("active");

    countryModal?.classList.add("active");

    document.body.classList.add("country-open");

    if (countrySearch) {

        countrySearch.value = "";

        renderCountries(countries);

        setTimeout(() => {

            countrySearch.focus();

        }, 100);

    }

}


/* =========================================================
   CLOSE COUNTRY MODAL
========================================================= */

function closeCountryModal() {

    countryOverlay?.classList.remove("active");

    countryModal?.classList.remove("active");

    document.body.classList.remove("country-open");

}


/* =========================================================
   PHONE INPUT
========================================================= */

function setupPhoneInput() {

    phoneNumberInput?.addEventListener(
        "input",
        () => {

            phoneNumberInput.value =
                phoneNumberInput.value.replace(
                    /[^\d\s()-]/g,
                    ""
                );

            hidePhoneError();

        }
    );


    phoneNumberInput?.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                registerForm?.requestSubmit();

            }

        }
    );

}


/* =========================================================
   REGISTRATION
========================================================= */

function setupRegistration() {

    if (!registerForm) {

        console.error(
            "❌ registerForm not found"
        );

        return;

    }


    registerForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            if (sendingOTP) return;


            const rawNumber =
                phoneNumberInput?.value.trim();


            if (!rawNumber) {

                showPhoneError(
                    "Please enter your phone number."
                );

                phoneNumberInput?.focus();

                return;

            }


            const fullPhone =
                buildFullPhoneNumber(rawNumber);


            if (!isValidPhone(fullPhone)) {

                showPhoneError(
                    "Please enter a valid phone number."
                );

                phoneNumberInput?.focus();

                return;

            }


            await sendOTP(fullPhone);

        }
    );

}


/* =========================================================
   BUILD FULL PHONE NUMBER
========================================================= */

function buildFullPhoneNumber(number) {

    let clean =
        number.replace(/\D/g, "");


    const countryCodeValue =
        selectedCountry[2];


    /*
       If user entered the country code
       already, don't add it twice.
    */

    if (
        clean.startsWith(
            countryCodeValue.replace("+", "")
        )
    ) {

        return "+" + clean;

    }


    /*
       Tanzania example:
       0712 345 678
       becomes
       +255712345678
    */

    if (clean.startsWith("0")) {

        clean =
            clean.substring(1);

    }


    return (
        countryCodeValue +
        clean
    );

}


/* =========================================================
   VALIDATE PHONE
========================================================= */

function isValidPhone(phone) {

    /*
       E.164 style validation.
       Firebase Phone Auth expects:
       +255712345678
    */

    return /^\+[1-9]\d{7,14}$/.test(phone);

}


/* =========================================================
   SEND OTP
========================================================= */

async function sendOTP(phone) {

    sendingOTP = true;

    setContinueLoading(true);

    hidePhoneError();


    try {

        console.log(
            "📱 Sending OTP to:",
            phone
        );


        /*
           Create invisible reCAPTCHA
        */

        if (!recaptchaVerifier) {

            recaptchaVerifier =
                new RecaptchaVerifier(
                    chapcyAuth,
                    "recaptcha-container",
                    {
                        size: "invisible",

                        callback: () => {

                            console.log(
                                "✅ reCAPTCHA solved"
                            );

                        },

                        "expired-callback": () => {

                            console.warn(
                                "⚠️ reCAPTCHA expired"
                            );

                        }

                    }
                );

            await recaptchaVerifier.render();

        }


        /*
           Firebase sends SMS OTP
        */

        confirmationResult =
            await signInWithPhoneNumber(
                chapcyAuth,
                phone,
                recaptchaVerifier
            );


        /*
           Save verification ID.
           This is needed on Mychatotp.html.
        */

        sessionStorage.setItem(
            "chapcyVerificationId",
            confirmationResult.verificationId
        );


        sessionStorage.setItem(
            "chapcyPhone",
            phone
        );


        sessionStorage.setItem(
            "chapcyPendingPhone",
            phone
        );


        sessionStorage.setItem(
            "chapcyCountryName",
            selectedCountry[1]
        );


        sessionStorage.setItem(
            "chapcyCountry",
            selectedCountry[2]
        );


        console.log(
            "✅ OTP sent successfully"
        );


        /*
           Go to OTP page
        */

        window.location.href =
            "Mychatotp.html";


    } catch (error) {

        console.error(
            "❌ Firebase OTP Error:",
            error
        );


        let message =
            "Unable to send verification code.";


        switch (error.code) {

            case "auth/invalid-phone-number":

                message =
                    "The phone number is invalid.";

                break;


            case "auth/too-many-requests":

                message =
                    "Too many attempts. Please try again later.";

                break;


            case "auth/quota-exceeded":

                message =
                    "SMS limit reached. Please try again later.";

                break;


            case "auth/captcha-check-failed":

                message =
                    "Security verification failed. Please refresh the page.";

                break;


            case "auth/operation-not-allowed":

                message =
                    "Phone Authentication is not enabled in Firebase.";

                break;


            case "auth/app-not-authorized":

                message =
                    "This website is not authorized in Firebase.";

                break;


            case "auth/network-request-failed":

                message =
                    "Network error. Please check your internet connection.";

                break;


            default:

                if (error.message) {

                    message =
                        error.message;

                }

        }


        showPhoneError(message);


        /*
           Reset reCAPTCHA so another attempt
           can be made.
        */

        resetRecaptcha();

    }


    sendingOTP = false;

    setContinueLoading(false);

}


/* =========================================================
   RESET RECAPTCHA
========================================================= */

function resetRecaptcha() {

    if (recaptchaVerifier) {

        try {

            recaptchaVerifier.clear();

        } catch (error) {

            console.warn(
                "reCAPTCHA clear error:",
                error
            );

        }

        recaptchaVerifier = null;

    }

}


/* =========================================================
   CONTINUE LOADING
========================================================= */

function setContinueLoading(loading) {

    if (!continueBtn) return;


    continueBtn.disabled =
        loading;


    if (loading) {

        if (continueText) {

            continueText.textContent =
                "Sending...";

        }


        if (continueArrow) {

            continueArrow.style.display =
                "none";

        }


        if (continueLoader) {

            continueLoader.style.display =
                "inline-flex";

        }

    } else {

        if (continueText) {

            continueText.textContent =
                "Continue";

        }


        if (continueArrow) {

            continueArrow.style.display =
                "inline-flex";

        }


        if (continueLoader) {

            continueLoader.style.display =
                "none";

        }

    }

}


/* =========================================================
   SHOW PHONE ERROR
========================================================= */

function showPhoneError(message) {

    if (!phoneError) return;


    const text =
        phoneError.querySelector("span");


    if (text) {

        text.textContent =
            message;

    }


    phoneError.classList.add("show");

}


/* =========================================================
   HIDE PHONE ERROR
========================================================= */

function hidePhoneError() {

    phoneError?.classList.remove("show");

}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeCountryModal();

        }

    }
);


/* =========================================================
   DEBUG
========================================================= */

console.log(
    "🔥 CHAPCY Firebase initialized successfully"
);

console.log(
    "📱 Phone registration system ready"
);
