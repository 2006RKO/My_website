/* =========================================================
   CHAPCY — MYCHATREGISTER.JS
   WORLDWIDE PHONE REGISTRATION
   Firebase Phone Authentication
   ========================================================= */

"use strict";


/* =========================================================
   1. WORLDWIDE COUNTRIES
   ========================================================= */

const countries = [

    ["🇹🇿", "Tanzania", "+255"],
    ["🇰🇪", "Kenya", "+254"],
    ["🇺🇬", "Uganda", "+256"],
    ["🇷🇼", "Rwanda", "+250"],
    ["🇧🇮", "Burundi", "+257"],
    ["🇿🇦", "South Africa", "+27"],
    ["🇳🇬", "Nigeria", "+234"],
    ["🇬🇭", "Ghana", "+233"],
    ["🇪🇹", "Ethiopia", "+251"],
    ["🇸🇸", "South Sudan", "+211"],
    ["🇸🇩", "Sudan", "+249"],
    ["🇪🇬", "Egypt", "+20"],
    ["🇲🇦", "Morocco", "+212"],
    ["🇩🇿", "Algeria", "+213"],
    ["🇹🇳", "Tunisia", "+216"],
    ["🇱🇾", "Libya", "+218"],

    ["🇺🇸", "United States", "+1"],
    ["🇨🇦", "Canada", "+1"],
    ["🇲🇽", "Mexico", "+52"],
    ["🇧🇷", "Brazil", "+55"],
    ["🇦🇷", "Argentina", "+54"],
    ["🇨🇱", "Chile", "+56"],
    ["🇨🇴", "Colombia", "+57"],
    ["🇵🇪", "Peru", "+51"],

    ["🇬🇧", "United Kingdom", "+44"],
    ["🇮🇪", "Ireland", "+353"],
    ["🇫🇷", "France", "+33"],
    ["🇩🇪", "Germany", "+49"],
    ["🇮🇹", "Italy", "+39"],
    ["🇪🇸", "Spain", "+34"],
    ["🇵🇹", "Portugal", "+351"],
    ["🇳🇱", "Netherlands", "+31"],
    ["🇧🇪", "Belgium", "+32"],
    ["🇨🇭", "Switzerland", "+41"],
    ["🇦🇹", "Austria", "+43"],
    ["🇸🇪", "Sweden", "+46"],
    ["🇳🇴", "Norway", "+47"],
    ["🇩🇰", "Denmark", "+45"],
    ["🇫🇮", "Finland", "+358"],
    ["🇵🇱", "Poland", "+48"],
    ["🇺🇦", "Ukraine", "+380"],
    ["🇷🇺", "Russia", "+7"],
    ["🇬🇷", "Greece", "+30"],
    ["🇹🇷", "Turkey", "+90"],

    ["🇦🇪", "United Arab Emirates", "+971"],
    ["🇸🇦", "Saudi Arabia", "+966"],
    ["🇶🇦", "Qatar", "+974"],
    ["🇰🇼", "Kuwait", "+965"],
    ["🇧🇭", "Bahrain", "+973"],
    ["🇴🇲", "Oman", "+968"],
    ["🇯🇴", "Jordan", "+962"],
    ["🇮🇱", "Israel", "+972"],
    ["🇮🇶", "Iraq", "+964"],
    ["🇮🇷", "Iran", "+98"],

    ["🇮🇳", "India", "+91"],
    ["🇵🇰", "Pakistan", "+92"],
    ["🇧🇩", "Bangladesh", "+880"],
    ["🇳🇵", "Nepal", "+977"],
    ["🇱🇰", "Sri Lanka", "+94"],
    ["🇦🇫", "Afghanistan", "+93"],

    ["🇨🇳", "China", "+86"],
    ["🇯🇵", "Japan", "+81"],
    ["🇰🇷", "South Korea", "+82"],
    ["🇮🇩", "Indonesia", "+62"],
    ["🇲🇾", "Malaysia", "+60"],
    ["🇸🇬", "Singapore", "+65"],
    ["🇹🇭", "Thailand", "+66"],
    ["🇻🇳", "Vietnam", "+84"],
    ["🇵🇭", "Philippines", "+63"],
    ["🇵🇬", "Papua New Guinea", "+675"],
    ["🇦🇺", "Australia", "+61"],
    ["🇳🇿", "New Zealand", "+64"],

    ["🇫🇯", "Fiji", "+679"],
    ["🇸🇧", "Solomon Islands", "+677"],
    ["🇻🇺", "Vanuatu", "+678"],
    ["🇼🇸", "Samoa", "+685"],

    ["🇿🇲", "Zambia", "+260"],
    ["🇿🇼", "Zimbabwe", "+263"],
    ["🇲🇼", "Malawi", "+265"],
    ["🇲🇿", "Mozambique", "+258"],
    ["🇳🇦", "Namibia", "+264"],
    ["🇧🇼", "Botswana", "+267"],
    ["🇱🇸", "Lesotho", "+266"],
    ["🇸🇿", "Eswatini", "+268"],
    ["🇦🇴", "Angola", "+244"],
    ["🇨🇩", "DR Congo", "+243"],
    ["🇨🇬", "Congo", "+242"],
    ["🇨🇲", "Cameroon", "+237"],
    ["🇨🇮", "Ivory Coast", "+225"],
    ["🇸🇳", "Senegal", "+221"],
    ["🇲🇱", "Mali", "+223"],
    ["🇧🇫", "Burkina Faso", "+226"],
    ["🇳🇪", "Niger", "+227"],
    ["🇹🇩", "Chad", "+235"],
    ["🇨🇫", "Central African Republic", "+236"],
    ["🇬🇦", "Gabon", "+241"],
    ["🇬🇶", "Equatorial Guinea", "+240"],
    ["🇬🇳", "Guinea", "+224"],
    ["🇸🇱", "Sierra Leone", "+232"],
    ["🇱🇷", "Liberia", "+231"],
    ["🇬🇲", "Gambia", "+220"],
    ["🇬🇼", "Guinea-Bissau", "+245"],
    ["🇨🇻", "Cape Verde", "+238"],
    ["🇲🇷", "Mauritania", "+222"],
    ["🇹🇬", "Togo", "+228"],
    ["🇧🇯", "Benin", "+229"],
    ["🇬🇭", "Ghana", "+233"],
    ["🇸🇨", "Seychelles", "+248"],
    ["🇲🇺", "Mauritius", "+230"],
    ["🇲🇬", "Madagascar", "+261"],
    ["🇰🇲", "Comoros", "+269"],
    ["🇩🇯", "Djibouti", "+253"],
    ["🇸🇴", "Somalia", "+252"],
    ["🇪🇷", "Eritrea", "+291"],
    ["🇨🇫", "Central African Republic", "+236"],

    ["🇯🇲", "Jamaica", "+1"],
    ["🇹🇹", "Trinidad and Tobago", "+1"],
    ["🇧🇸", "Bahamas", "+1"],
    ["🇧🇧", "Barbados", "+1"],
    ["🇭🇹", "Haiti", "+509"],
    ["🇩🇴", "Dominican Republic", "+1"],
    ["🇨🇺", "Cuba", "+53"],
    ["🇵🇦", "Panama", "+507"],
    ["🇨🇷", "Costa Rica", "+506"],
    ["🇳🇮", "Nicaragua", "+505"],
    ["🇭🇳", "Honduras", "+504"],
    ["🇬🇹", "Guatemala", "+502"],

];


/* =========================================================
   2. SELECTED COUNTRY
   ========================================================= */

let selectedCountry = {
    flag: "🇹🇿",
    name: "Tanzania",
    code: "+255"
};


/* =========================================================
   3. DOM ELEMENTS
   ========================================================= */

let registerForm;
let countrySelector;
let countryFlag;
let countryCode;
let countryOverlay;
let countryModal;
let closeCountry;
let countrySearch;
let countryList;

let phoneNumber;
let detectedCountry;
let phoneError;

let continueBtn;
let continueText;
let continueArrow;
let continueLoader;

let verificationSection;
let successSection;

let otpInput;
let verifyBtn;
let resendBtn;
let enterChapcyBtn;


/* =========================================================
   4. FIREBASE VARIABLES
   ========================================================= */

let chapcyAuth = null;
let RecaptchaVerifier = null;
let signInWithPhoneNumber = null;

let confirmationResult = null;
let recaptchaVerifier = null;

let resendTimer = null;
let resendSeconds = 60;


/* =========================================================
   5. HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}


function normalizePhone(phone) {

    return String(phone || "")
        .replace(/[^\d+]/g, "")
        .trim();

}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   6. INITIALIZE DOM
   ========================================================= */

function initializeDOM() {

    registerForm = $("registerForm");

    countrySelector = $("countrySelector");
    countryFlag = $("countryFlag");
    countryCode = $("countryCode");

    countryOverlay = $("countryOverlay");
    countryModal = $("countryModal");
    closeCountry = $("closeCountry");
    countrySearch = $("countrySearch");
    countryList = $("countryList");

    phoneNumber = $("phoneNumber");
    detectedCountry = $("detectedCountry");
    phoneError = $("phoneError");

    continueBtn = $("continueBtn");

    /*
       HTML yako ina classes badala ya IDs,
       hivyo tunazitafuta kwa class pia.
    */

    continueText =
        $("continueText") ||
        document.querySelector(".continue-text");

    continueArrow =
        $("continueArrow") ||
        document.querySelector(".continue-arrow");

    continueLoader =
        $("continueLoader") ||
        document.querySelector(".continue-loader");


    verificationSection =
        $("verificationSection") ||
        $("verifySection") ||
        document.querySelector(".verification-section");


    successSection =
        $("successSection") ||
        document.querySelector(".success-section");


    otpInput =
        $("otpInput") ||
        $("otpCode") ||
        document.querySelector("#otpInput");


    verifyBtn =
        $("verifyBtn") ||
        $("verifyOTPBtn") ||
        document.querySelector(".verify-btn");


    resendBtn =
        $("resendBtn") ||
        $("resendOTPBtn") ||
        document.querySelector(".resend-btn");


    enterChapcyBtn =
        $("enterChapcy") ||
        $("enterChapcyBtn") ||
        $("goToChapcy") ||
        document.querySelector(".enter-chapcy-btn");

}


/* =========================================================
   7. COUNTRY UI
   ========================================================= */

function updateCountryUI() {

    if (countryFlag) {
        countryFlag.textContent = selectedCountry.flag;
    }

    if (countryCode) {
        countryCode.textContent = selectedCountry.code;
    }

    if (detectedCountry) {

        const text =
            detectedCountry.querySelector("span");

        if (text) {

            text.textContent =
                `Country: ${selectedCountry.name}`;

        } else {

            detectedCountry.innerHTML = `
                <i class="fa-solid fa-earth-africa"></i>
                <span>Country: ${escapeHTML(selectedCountry.name)}</span>
            `;

        }

    }

}


/* =========================================================
   8. RENDER COUNTRIES
   ========================================================= */

function renderCountries(search = "") {

    if (!countryList) return;

    const query =
        String(search)
            .toLowerCase()
            .trim();


    countryList.innerHTML = "";


    const filteredCountries =
        countries.filter(country => {

            const flag = country[0];
            const name = country[1];
            const code = country[2];

            return (
                name.toLowerCase().includes(query) ||
                code.includes(query) ||
                flag.includes(query)
            );

        });


    if (!filteredCountries.length) {

        countryList.innerHTML = `
            <div class="country-empty">
                <i class="fa-solid fa-earth-americas"></i>
                <strong>No country found</strong>
                <span>Try another country name or code.</span>
            </div>
        `;

        return;
    }


    filteredCountries.forEach(country => {

        const [flag, name, code] = country;

        const item =
            document.createElement("button");

        item.type = "button";
        item.className = "country-item";


        if (
            selectedCountry.name === name &&
            selectedCountry.code === code
        ) {

            item.classList.add("selected");

        }


        /*
           Markup hii inaendana na CSS tuliyorekebisha.
        */

        item.innerHTML = `
            <span class="flag">${escapeHTML(flag)}</span>

            <span class="country-info">
                <strong>${escapeHTML(name)}</strong>
                <small>${escapeHTML(code)}</small>
            </span>

            <span class="dial-code">
                ${escapeHTML(code)}
            </span>

            <i class="fa-solid fa-check country-check"></i>
        `;


        item.addEventListener("click", () => {

            selectedCountry = {
                flag: flag,
                name: name,
                code: code
            };


            updateCountryUI();
            closeCountryModal();


            if (phoneNumber) {

                phoneNumber.value = "";

                phoneNumber.focus();

            }

        });


        countryList.appendChild(item);

    });

}


/* =========================================================
   9. OPEN COUNTRY MODAL
   ========================================================= */

function openCountryModal() {

    if (!countryOverlay || !countryModal) return;


    renderCountries();


    countryOverlay.classList.add("active");
    countryModal.classList.add("active");


    document.body.classList.add("country-modal-open");


    if (countrySearch) {

        countrySearch.value = "";

        setTimeout(() => {

            countrySearch.focus();

        }, 150);

    }

}


/* =========================================================
   10. CLOSE COUNTRY MODAL
   ========================================================= */

function closeCountryModal() {

    if (countryOverlay) {

        countryOverlay.classList.remove("active");

    }


    if (countryModal) {

        countryModal.classList.remove("active");

    }


    document.body.classList.remove("country-modal-open");

}


/* =========================================================
   11. PHONE NUMBER FORMATTING
   ========================================================= */

function formatPhoneNumber(value) {

    let digits =
        String(value || "")
            .replace(/\D/g, "");


    /*
       Tanzania example:

       712345678
       ↓
       712 345 678
    */

    if (digits.length > 9) {

        digits = digits.substring(0, 9);

    }


    const parts = [];


    if (digits.length > 0) {

        parts.push(
            digits.substring(0, 3)
        );

    }


    if (digits.length > 3) {

        parts.push(
            digits.substring(3, 6)
        );

    }


    if (digits.length > 6) {

        parts.push(
            digits.substring(6, 9)
        );

    }


    return parts.join(" ");

}


/* =========================================================
   12. GET INTERNATIONAL PHONE
   ========================================================= */

function getInternationalPhone() {

    if (!phoneNumber) return "";


    let localNumber =
        phoneNumber.value
            .replace(/\D/g, "");


    /*
       Kama user ameandika 255712345678
       tunaondoa country code.
    */

    const codeDigits =
        selectedCountry.code.replace(/\D/g, "");


    if (
        localNumber.startsWith(codeDigits)
    ) {

        localNumber =
            localNumber.substring(
                codeDigits.length
            );

    }


    /*
       Ondoa zero ya mwanzo.

       0712345678
       ↓
       712345678
    */

    if (localNumber.startsWith("0")) {

        localNumber =
            localNumber.substring(1);

    }


    if (!localNumber) return "";


    return (
        selectedCountry.code +
        localNumber
    );

}


/* =========================================================
   13. PHONE VALIDATION
   ========================================================= */

function isValidPhoneNumber() {

    const phone =
        getInternationalPhone();


    /*
       Basic international validation.
       8–15 digits after country code.
    */

    const digits =
        phone.replace(/\D/g, "");


    return (
        digits.length >= 10 &&
        digits.length <= 15
    );

}


/* =========================================================
   14. PHONE ERROR
   ========================================================= */

function showPhoneError(message) {

    if (!phoneError) return;


    const text =
        phoneError.querySelector("span");


    if (text) {

        text.textContent = message;

    } else {

        phoneError.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>${escapeHTML(message)}</span>
        `;

    }


    phoneError.classList.add("show");

}


function hidePhoneError() {

    if (!phoneError) return;

    phoneError.classList.remove("show");

}


/* =========================================================
   15. BUTTON LOADING
   ========================================================= */

function setContinueLoading(loading) {

    if (!continueBtn) return;


    continueBtn.disabled = loading;


    if (continueText) {

        continueText.style.display =
            loading ? "none" : "";

    }


    if (continueArrow) {

        continueArrow.style.display =
            loading ? "none" : "";

    }


    if (continueLoader) {

        continueLoader.style.display =
            loading ? "inline-flex" : "none";

    }


    if (loading) {

        continueBtn.classList.add("loading");

    } else {

        continueBtn.classList.remove("loading");

    }

}


/* =========================================================
   16. WAIT FOR FIREBASE
   ========================================================= */

function waitForFirebase(callback, attempts = 0) {

    if (
        window.chapcyAuth &&
        window.ChapcyRecaptchaVerifier &&
        window.signInWithPhoneNumber
    ) {

        callback();

        return;

    }


    if (attempts >= 100) {

        console.error(
            "CHAPCY: Firebase failed to initialize."
        );

        return;

    }


    setTimeout(() => {

        waitForFirebase(
            callback,
            attempts + 1
        );

    }, 100);

}


/* =========================================================
   17. SETUP FIREBASE
   ========================================================= */

function setupFirebase() {

    waitForFirebase(() => {

        chapcyAuth =
            window.chapcyAuth;

        RecaptchaVerifier =
            window.ChapcyRecaptchaVerifier;

        signInWithPhoneNumber =
            window.signInWithPhoneNumber;


        console.log(
            "CHAPCY Firebase initialized."
        );

    });

}


/* =========================================================
   18. SETUP RECAPTCHA
   ========================================================= */

function setupRecaptcha() {

    if (!chapcyAuth || !RecaptchaVerifier) {

        console.warn(
            "CHAPCY: Firebase is not ready for reCAPTCHA."
        );

        return false;

    }


    /*
       Kama verifier ya zamani ipo,
       tunaifuta kwanza.
    */

    if (recaptchaVerifier) {

        try {

            recaptchaVerifier.clear();

        } catch (error) {

            console.warn(
                "Could not clear old reCAPTCHA.",
                error
            );

        }

        recaptchaVerifier = null;

    }


    const container =
        $("recaptcha-container");


    if (!container) {

        console.error(
            "CHAPCY: #recaptcha-container not found."
        );

        return false;

    }


    try {

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


        return true;

    } catch (error) {

        console.error(
            "CHAPCY reCAPTCHA error:",
            error
        );

        return false;

    }

}


/* =========================================================
   19. SEND OTP
   ========================================================= */

async function sendOTP() {

    hidePhoneError();


    if (!phoneNumber) return;


    if (!isValidPhoneNumber()) {

        showPhoneError(
            "Please enter a valid phone number."
        );

        phoneNumber.focus();

        return;

    }


    if (
        !chapcyAuth ||
        !signInWithPhoneNumber
    ) {

        showPhoneError(
            "Connection is not ready. Please try again."
        );

        console.error(
            "Firebase Phone Auth is not ready."
        );

        return;

    }


    const internationalPhone =
        getInternationalPhone();


    if (!internationalPhone) {

        showPhoneError(
            "Please enter your phone number."
        );

        return;

    }


    setContinueLoading(true);


    try {

        /*
           Create a new reCAPTCHA.
        */

        const captchaReady =
            setupRecaptcha();


        if (!captchaReady) {

            throw new Error(
                "reCAPTCHA could not be initialized."
            );

        }


        console.log(
            "Sending OTP to:",
            internationalPhone
        );


        confirmationResult =
            await signInWithPhoneNumber(
                chapcyAuth,
                internationalPhone,
                recaptchaVerifier
            );


        /*
           Save temporary phone info.
        */

        localStorage.setItem(
            "chapcyPendingPhone",
            internationalPhone
        );


        localStorage.setItem(
            "chapcyPendingCountry",
            JSON.stringify(selectedCountry)
        );


        /*
           Show verification screen.
        */

        showVerificationSection();


    } catch (error) {

        console.error(
            "CHAPCY OTP ERROR:",
            error
        );


        let message =
            "Unable to send verification code.";


        if (error && error.code) {

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
                        "Security verification failed. Please try again.";

                    break;


                case "auth/network-request-failed":

                    message =
                        "Network error. Check your internet connection.";

                    break;


                case "auth/app-not-authorized":

                    message =
                        "This domain is not authorized in Firebase.";

                    break;


                default:

                    message =
                        error.message ||
                        message;

            }

        }


        showPhoneError(message);


        /*
           Reset captcha after failure.
        */

        if (recaptchaVerifier) {

            try {

                recaptchaVerifier.clear();

            } catch (_) {}

            recaptchaVerifier = null;

        }

    } finally {

        setContinueLoading(false);

    }

}


/* =========================================================
   20. SHOW VERIFICATION SECTION
   ========================================================= */

function showVerificationSection() {

    if (!verificationSection) {

        console.warn(
            "Verification section not found."
        );

        return;

    }


    /*
       Hide register card.
    */

    const registerCard =
        document.querySelector(".register-card");


    if (registerCard) {

        registerCard.style.display = "none";

    }


    verificationSection.style.display =
        "block";


    verificationSection.classList.add(
        "active"
    );


    verificationSection.classList.add(
        "show"
    );


    /*
       Update phone text if element exists.
    */

    const verificationPhone =
        $("verificationPhone") ||
        $("verifyPhone") ||
        document.querySelector(".verification-phone");


    if (verificationPhone) {

        verificationPhone.textContent =
            getInternationalPhone();

    }


    /*
       Focus OTP.
    */

    if (otpInput) {

        setTimeout(() => {

            otpInput.focus();

        }, 300);

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   21. OTP INPUT FORMAT
   ========================================================= */

function setupOTPInputs() {

    /*
       Support both:
       #otpInput
       OR
       .otp-input
       OR
       six separate inputs.
    */

    const otpInputs =
        document.querySelectorAll(
            ".otp-input, [data-otp]"
        );


    if (!otpInputs.length) return;


    otpInputs.forEach((input, index) => {

        input.setAttribute(
            "inputmode",
            "numeric"
        );

        input.setAttribute(
            "maxlength",
            "1"
        );


        input.addEventListener(
            "input",
            () => {

                input.value =
                    input.value.replace(/\D/g, "");


                if (
                    input.value &&
                    otpInputs[index + 1]
                ) {

                    otpInputs[index + 1].focus();

                }

            }
        );


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Backspace" &&
                    !input.value &&
                    otpInputs[index - 1]
                ) {

                    otpInputs[index - 1].focus();

                }

            }
        );


        input.addEventListener(
            "paste",
            event => {

                event.preventDefault();


                const pasted =
                    (
                        event.clipboardData ||
                        window.clipboardData
                    )
                        .getData("text")
                        .replace(/\D/g, "")
                        .substring(0, otpInputs.length);


                pasted.split("").forEach(
                    (digit, i) => {

                        if (otpInputs[i]) {

                            otpInputs[i].value =
                                digit;

                        }

                    }
                );


                const last =
                    Math.min(
                        pasted.length,
                        otpInputs.length
                    ) - 1;


                if (
                    last >= 0 &&
                    otpInputs[last]
                ) {

                    otpInputs[last].focus();

                }

            }
        );

    });

}


/* =========================================================
   22. GET OTP CODE
   ========================================================= */

function getOTPCode() {

    /*
       First check single OTP input.
    */

    if (otpInput) {

        const value =
            otpInput.value
                .replace(/\D/g, "");

        if (value.length === 6) {

            return value;

        }

    }


    /*
       Then check six separate inputs.
    */

    const otpInputs =
        document.querySelectorAll(
            ".otp-input, [data-otp]"
        );


    if (otpInputs.length) {

        return Array.from(otpInputs)
            .map(input =>
                input.value.replace(/\D/g, "")
            )
            .join("");

    }


    /*
       Search common IDs.
    */

    const possibleInputs = [

        $("otp1"),
        $("otp2"),
        $("otp3"),
        $("otp4"),
        $("otp5"),
        $("otp6")

    ].filter(Boolean);


    if (possibleInputs.length) {

        return possibleInputs
            .map(input =>
                input.value.replace(/\D/g, "")
            )
            .join("");

    }


    return "";

}


/* =========================================================
   23. VERIFY OTP
   ========================================================= */

async function verifyOTP() {

    if (!confirmationResult) {

        showVerificationError(
            "Please request a new verification code."
        );

        return;

    }


    const code =
        getOTPCode();


    if (code.length !== 6) {

        showVerificationError(
            "Please enter the 6-digit verification code."
        );

        return;

    }


    if (verifyBtn) {

        verifyBtn.disabled = true;

    }


    try {

        const result =
            await confirmationResult.confirm(code);


        const user =
            result.user;


        /*
           Save registration information.
        */

        const phone =
            getInternationalPhone() ||
            user.phoneNumber ||
            "";


        const userData = {

            uid:
                user.uid,

            phone:
                phone,

            country:
                selectedCountry.name,

            countryCode:
                selectedCountry.code,

            countryFlag:
                selectedCountry.flag,

            registered:
                true,

            registeredAt:
                new Date().toISOString()

        };


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
            phone
        );


        localStorage.setItem(
            "chapcyUID",
            user.uid
        );


        /*
           Show success.
        */

        showSuccessSection();


    } catch (error) {

        console.error(
            "CHAPCY VERIFY ERROR:",
            error
        );


        let message =
            "Verification failed. Please check your code.";


        if (error && error.code) {

            switch (error.code) {

                case "auth/invalid-verification-code":

                    message =
                        "Incorrect verification code.";

                    break;


                case "auth/code-expired":

                    message =
                        "This verification code has expired. Request a new one.";

                    break;


                case "auth/session-expired":

                    message =
                        "Verification session expired. Please request a new code.";

                    break;


                default:

                    message =
                        error.message ||
                        message;

            }

        }


        showVerificationError(message);


    } finally {

        if (verifyBtn) {

            verifyBtn.disabled = false;

        }

    }

}


/* =========================================================
   24. VERIFICATION ERROR
   ========================================================= */

function showVerificationError(message) {

    const errorElement =
        $("verificationError") ||
        $("otpError") ||
        document.querySelector(".verification-error") ||
        document.querySelector(".otp-error");


    if (!errorElement) {

        console.warn(
            message
        );

        return;

    }


    const text =
        errorElement.querySelector("span");


    if (text) {

        text.textContent =
            message;

    } else {

        errorElement.textContent =
            message;

    }


    errorElement.classList.add(
        "show"
    );

    errorElement.classList.add(
        "active"
    );

}


/* =========================================================
   25. HIDE VERIFICATION ERROR
   ========================================================= */

function hideVerificationError() {

    const errorElement =
        $("verificationError") ||
        $("otpError") ||
        document.querySelector(".verification-error") ||
        document.querySelector(".otp-error");


    if (!errorElement) return;


    errorElement.classList.remove(
        "show"
    );

    errorElement.classList.remove(
        "active"
    );

}


/* =========================================================
   26. SUCCESS SECTION
   ========================================================= */

function showSuccessSection() {

    if (verificationSection) {

        verificationSection.style.display =
            "none";

        verificationSection.classList.remove(
            "active"
        );

        verificationSection.classList.remove(
            "show"
        );

    }


    if (successSection) {

        successSection.style.display =
            "block";

        successSection.classList.add(
            "active"
        );

        successSection.classList.add(
            "show"
        );

    }


    /*
       Update success phone.
    */

    const successPhone =
        $("successPhone") ||
        document.querySelector(".success-phone");


    if (successPhone) {

        successPhone.textContent =
            getInternationalPhone();

    }


    /*
       Update success country.
    */

    const successCountry =
        $("successCountry") ||
        document.querySelector(".success-country");


    if (successCountry) {

        successCountry.textContent =
            `${selectedCountry.flag} ${selectedCountry.name}`;

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    /*
       Small celebration.
    */

    createSuccessParticles();

}


/* =========================================================
   27. SUCCESS PARTICLES
   ========================================================= */

function createSuccessParticles() {

    const container =
        successSection ||
        document.body;


    for (let i = 0; i < 18; i++) {

        const particle =
            document.createElement("span");


        particle.className =
            "chapcy-success-particle";


        particle.textContent =
            ["✦", "✧", "•", "◆"][

                Math.floor(
                    Math.random() * 4
                )

            ];


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.top =
            `${Math.random() * 100}%`;


        particle.style.animationDelay =
            `${Math.random() * 1.5}s`;


        container.appendChild(
            particle
        );


        setTimeout(() => {

            particle.remove();

        }, 4000);

    }

}


/* =========================================================
   28. RESEND OTP
   ========================================================= */

async function resendOTP() {

    if (resendSeconds > 0) return;


    if (!chapcyAuth || !signInWithPhoneNumber) {

        showVerificationError(
            "Firebase is not ready. Please try again."
        );

        return;

    }


    const phone =
        getInternationalPhone();


    if (!phone) {

        showVerificationError(
            "Phone number is missing."
        );

        return;

    }


    if (resendBtn) {

        resendBtn.disabled = true;

    }


    hideVerificationError();


    try {

        const captchaReady =
            setupRecaptcha();


        if (!captchaReady) {

            throw new Error(
                "Could not initialize security verification."
            );

        }


        confirmationResult =
            await signInWithPhoneNumber(
                chapcyAuth,
                phone,
                recaptchaVerifier
            );


        startResendTimer();


    } catch (error) {

        console.error(
            "CHAPCY RESEND ERROR:",
            error
        );


        showVerificationError(
            error.message ||
            "Could not resend the code."
        );


        if (resendBtn) {

            resendBtn.disabled = false;

        }

    }

}


/* =========================================================
   29. RESEND TIMER
   ========================================================= */

function startResendTimer() {

    clearInterval(resendTimer);


    resendSeconds = 60;


    updateResendButton();


    resendTimer =
        setInterval(() => {

            resendSeconds--;


            updateResendButton();


            if (resendSeconds <= 0) {

                clearInterval(
                    resendTimer
                );


                resendTimer = null;

            }

        }, 1000);

}


/* =========================================================
   30. UPDATE RESEND BUTTON
   ========================================================= */

function updateResendButton() {

    if (!resendBtn) return;


    if (resendSeconds > 0) {

        resendBtn.disabled = true;


        const originalText =
            resendBtn.dataset.originalText ||
            "Resend Code";


        resendBtn.dataset.originalText =
            originalText;


        resendBtn.innerHTML = `
            <i class="fa-solid fa-rotate-right"></i>
            Resend Code (${resendSeconds}s)
        `;

    } else {

        resendBtn.disabled = false;


        resendBtn.innerHTML = `
            <i class="fa-solid fa-rotate-right"></i>
            Resend Code
        `;

    }

}


/* =========================================================
   31. ENTER CHAPCY
   ========================================================= */

function enterChapcy() {

    /*
       Try common CHAPCY pages.
    */

    const destinations = [

        "Mychat.html",
        "mychat.html",
        "chat.html",
        "index.html"

    ];


    /*
       Kama HTML yako ina data-page,
       itumie hiyo.
    */

    if (enterChapcyBtn) {

        const customPage =
            enterChapcyBtn.dataset.page;


        if (customPage) {

            window.location.href =
                customPage;

            return;

        }

    }


    /*
       Default:
       Mychat.html
    */

    window.location.href =
        "Mychat.html";

}


/* =========================================================
   32. COUNTRY SEARCH
   ========================================================= */

function setupCountrySearch() {

    if (!countrySearch) return;


    countrySearch.addEventListener(
        "input",
        () => {

            renderCountries(
                countrySearch.value
            );

        }
    );

}


/* =========================================================
   33. COUNTRY EVENTS
   ========================================================= */

function setupCountryEvents() {

    if (countrySelector) {

        countrySelector.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openCountryModal();

            }
        );

    }


    if (closeCountry) {

        closeCountry.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeCountryModal();

            }
        );

    }


    if (countryOverlay) {

        countryOverlay.addEventListener(
            "click",
            event => {

                /*
                   Only close when clicking overlay itself.
                */

                if (
                    event.target ===
                    countryOverlay
                ) {

                    closeCountryModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeCountryModal();

            }

        }
    );

}


/* =========================================================
   34. PHONE EVENTS
   ========================================================= */

function setupPhoneEvents() {

    if (!phoneNumber) return;


    phoneNumber.addEventListener(
        "input",
        () => {

            const cursor =
                phoneNumber.selectionStart;


            const oldValue =
                phoneNumber.value;


            phoneNumber.value =
                formatPhoneNumber(
                    phoneNumber.value
                );


            /*
               Hide error when user starts correcting.
            */

            if (
                phoneNumber.value !== oldValue
            ) {

                hidePhoneError();

            }


            /*
               Keep cursor reasonably positioned.
            */

            if (
                document.activeElement ===
                phoneNumber
            ) {

                try {

                    phoneNumber.setSelectionRange(
                        phoneNumber.value.length,
                        phoneNumber.value.length
                    );

                } catch (_) {}

            }

        }
    );


    phoneNumber.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                if (registerForm) {

                    registerForm.requestSubmit();

                }

            }

        }
    );


    phoneNumber.addEventListener(
        "blur",
        () => {

            if (
                phoneNumber.value &&
                !isValidPhoneNumber()
            ) {

                showPhoneError(
                    "Please enter a valid phone number."
                );

            }

        }
    );

}


/* =========================================================
   35. FORM SUBMIT
   ========================================================= */

function setupForm() {

    if (!registerForm) return;


    registerForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            sendOTP();

        }
    );

}


/* =========================================================
   36. VERIFY EVENTS
   ========================================================= */

function setupVerificationEvents() {

    if (verifyBtn) {

        verifyBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                hideVerificationError();

                verifyOTP();

            }
        );

    }


    if (resendBtn) {

        resendBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                resendOTP();

            }
        );

    }


    if (otpInput) {

        otpInput.addEventListener(
            "input",
            () => {

                otpInput.value =
                    otpInput.value
                        .replace(/\D/g, "")
                        .substring(0, 6);


                hideVerificationError();

            }
        );


        otpInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    verifyOTP();

                }

            }
        );

    }


    /*
       Support six OTP boxes.
    */

    const otpInputs =
        document.querySelectorAll(
            ".otp-input, [data-otp]"
        );


    otpInputs.forEach(input => {

        input.addEventListener(
            "input",
            () => {

                hideVerificationError();

            }
        );

    });

}


/* =========================================================
   37. SUCCESS EVENTS
   ========================================================= */

function setupSuccessEvents() {

    if (!enterChapcyBtn) return;


    enterChapcyBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();

            enterChapcy();

        }
    );

}


/* =========================================================
   38. PREVENT MODAL SCROLL
   ========================================================= */

function setupModalBehavior() {

    /*
       This is handled by CSS too,
       but this makes it more reliable.
    */

    const style =
        document.createElement("style");


    style.textContent = `

        body.country-modal-open {
            overflow: hidden !important;
        }

        .country-overlay.active {
            display: block !important;
        }

        .country-modal.active {
            display: block !important;
        }

        .country-modal {
            pointer-events: none;
            opacity: 0;
        }

        .country-modal.active {
            pointer-events: auto;
            opacity: 1;
        }

        .continue-loader {
            display: none;
        }

        .continue-btn.loading {
            pointer-events: none;
        }

        .country-item {
            cursor: pointer;
        }

        .country-item.selected {
            transform: translateX(3px);
        }

        .country-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 7px;
            padding: 35px 20px;
            text-align: center;
        }

        .country-empty i {
            font-size: 30px;
            margin-bottom: 5px;
        }

        .chapcy-success-particle {
            position: absolute;
            pointer-events: none;
            animation: chapcySuccessParticle 3s ease-out forwards;
            z-index: 20;
        }

        @keyframes chapcySuccessParticle {

            0% {
                opacity: 0;
                transform:
                    translateY(20px)
                    scale(.5)
                    rotate(0deg);
            }

            20% {
                opacity: 1;
            }

            100% {
                opacity: 0;
                transform:
                    translateY(-120px)
                    scale(1.4)
                    rotate(180deg);
            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   39. AUTO RESTORE REGISTERED USER
   ========================================================= */

function restoreRegisteredState() {

    const registered =
        localStorage.getItem(
            "chapcyRegistered"
        );


    if (
        registered !== "true"
    ) {

        return;

    }


    const savedUser =
        localStorage.getItem(
            "chapcyUser"
        );


    if (!savedUser) return;


    try {

        const user =
            JSON.parse(savedUser);


        if (
            user.country &&
            user.countryCode
        ) {

            selectedCountry = {

                flag:
                    user.countryFlag ||
                    "🌍",

                name:
                    user.country,

                code:
                    user.countryCode

            };


            updateCountryUI();

        }

    } catch (error) {

        console.warn(
            "Could not restore CHAPCY user.",
            error
        );

    }

}


/* =========================================================
   40. INITIALIZATION
   ========================================================= */

function initializeChapcyRegistration() {

    initializeDOM();


    updateCountryUI();


    setupCountryEvents();

    setupCountrySearch();

    setupPhoneEvents();

    setupForm();

    setupVerificationEvents();

    setupSuccessEvents();

    setupOTPInputs();

    setupModalBehavior();


    setupFirebase();


    restoreRegisteredState();


    /*
       Initial resend state.
    */

    if (resendBtn) {

        resendBtn.disabled = true;

        resendBtn.dataset.originalText =
            "Resend Code";

    }


    console.log(
        "🚀 CHAPCY Registration initialized successfully."
    );

}


/* =========================================================
   41. START
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeChapcyRegistration
    );

} else {

    initializeChapcyRegistration();

}
