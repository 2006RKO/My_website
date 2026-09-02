/* =========================================================
   CHAPCY WORLDWIDE REGISTRATION JS
   Firebase Phone OTP — Modular SDK
   ========================================================= */

"use strict";

/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let selectedCountry = {
    name: "Tanzania",
    flag: "🇹🇿",
    code: "+255"
};

let confirmationResult = null;
let recaptchaVerifier = null;
let currentPhone = "";
let resendTimer = null;
let resendSeconds = 30;


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const registerForm = document.getElementById("registerForm");

const countrySelector = document.getElementById("countrySelector");
const countryFlag = document.getElementById("countryFlag");
const countryCode = document.getElementById("countryCode");

const phoneNumber = document.getElementById("phoneNumber");
const detectedCountry = document.getElementById("detectedCountry");
const phoneError = document.getElementById("phoneError");

const continueBtn = document.getElementById("continueBtn");
const continueText = document.getElementById("continueText");
const continueArrow = document.getElementById("continueArrow");
const continueLoader = document.getElementById("continueLoader");

const verificationSection =
    document.getElementById("verificationSection");

const verificationNumber =
    document.getElementById("verificationNumber");

const verifyBtn =
    document.getElementById("verifyBtn");

const resendBtn =
    document.getElementById("resendBtn");

const successSection =
    document.getElementById("successSection");

const enterChapcyBtn =
    document.getElementById("enterChapcyBtn");

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


/* =========================================================
   COUNTRY DATA
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

    ["🇬🇧", "United Kingdom", "+44"],
    ["🇺🇸", "United States", "+1"],
    ["🇨🇦", "Canada", "+1"],
    ["🇦🇺", "Australia", "+61"],
    ["🇳🇿", "New Zealand", "+64"],

    ["🇮🇳", "India", "+91"],
    ["🇵🇰", "Pakistan", "+92"],
    ["🇧🇩", "Bangladesh", "+880"],
    ["🇦🇪", "United Arab Emirates", "+971"],
    ["🇸🇦", "Saudi Arabia", "+966"],
    ["🇶🇦", "Qatar", "+974"],
    ["🇰🇼", "Kuwait", "+965"],
    ["🇴🇲", "Oman", "+968"],
    ["🇧🇭", "Bahrain", "+973"],

    ["🇨🇳", "China", "+86"],
    ["🇯🇵", "Japan", "+81"],
    ["🇰🇷", "South Korea", "+82"],
    ["🇸🇬", "Singapore", "+65"],
    ["🇲🇾", "Malaysia", "+60"],
    ["🇮🇩", "Indonesia", "+62"],
    ["🇹🇭", "Thailand", "+66"],
    ["🇵🇭", "Philippines", "+63"],
    ["🇻🇳", "Vietnam", "+84"],

    ["🇩🇪", "Germany", "+49"],
    ["🇫🇷", "France", "+33"],
    ["🇮🇹", "Italy", "+39"],
    ["🇪🇸", "Spain", "+34"],
    ["🇵🇹", "Portugal", "+351"],
    ["🇳🇱", "Netherlands", "+31"],
    ["🇧🇪", "Belgium", "+32"],
    ["🇨🇭", "Switzerland", "+41"],
    ["🇸🇪", "Sweden", "+46"],
    ["🇳🇴", "Norway", "+47"],
    ["🇩🇰", "Denmark", "+45"],
    ["🇫🇮", "Finland", "+358"],
    ["🇮🇪", "Ireland", "+353"],
    ["🇵🇱", "Poland", "+48"],
    ["🇬🇷", "Greece", "+30"],

    ["🇧🇷", "Brazil", "+55"],
    ["🇲🇽", "Mexico", "+52"],
    ["🇦🇷", "Argentina", "+54"],
    ["🇨🇱", "Chile", "+56"],
    ["🇨🇴", "Colombia", "+57"],
    ["🇵🇪", "Peru", "+51"],

    ["🇿🇼", "Zimbabwe", "+263"],
    ["🇿🇲", "Zambia", "+260"],
    ["🇲🇼", "Malawi", "+265"],
    ["🇲🇿", "Mozambique", "+258"],
    ["🇧🇼", "Botswana", "+267"],
    ["🇳🇦", "Namibia", "+264"],
    ["🇱🇸", "Lesotho", "+266"],
    ["🇸🇿", "Eswatini", "+268"],
    ["🇸🇨", "Seychelles", "+248"],
    ["🇲🇺", "Mauritius", "+230"],
    ["🇲🇬", "Madagascar", "+261"]
];


/* =========================================================
   FIREBASE READY CHECK
   ========================================================= */

function waitForFirebase(callback) {

    if (
        window.chapcyAuth &&
        window.ChapcyRecaptchaVerifier &&
        window.signInWithPhoneNumber
    ) {
        callback();
        return;
    }

    setTimeout(() => {
        waitForFirebase(callback);
    }, 100);
}


/* =========================================================
   CREATE RECAPTCHA CONTAINER IF MISSING
   ========================================================= */

function ensureRecaptchaContainer() {

    let container =
        document.getElementById("recaptcha-container");

    if (!container) {

        container = document.createElement("div");

        container.id = "recaptcha-container";

        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.width = "1px";
        container.style.height = "1px";
        container.style.overflow = "hidden";

        document.body.appendChild(container);
    }

    return container;
}


/* =========================================================
   SETUP RECAPTCHA
   ========================================================= */

async function setupRecaptcha() {

    waitForFirebase(() => {});

    const container = ensureRecaptchaContainer();

    try {

        if (recaptchaVerifier) {

            try {
                recaptchaVerifier.clear();
            } catch (e) {}

            recaptchaVerifier = null;
        }

        recaptchaVerifier =
            new window.ChapcyRecaptchaVerifier(
                window.chapcyAuth,
                container,
                {
                    size: "invisible",

                    callback: () => {
                        console.log("✅ reCAPTCHA verified");
                    },

                    "expired-callback": () => {
                        console.log("⚠️ reCAPTCHA expired");
                    }
                }
            );

        await recaptchaVerifier.render();

        return recaptchaVerifier;

    } catch (error) {

        console.error(
            "reCAPTCHA error:",
            error
        );

        throw error;
    }
}


/* =========================================================
   COUNTRY LIST
   ========================================================= */

function renderCountries(search = "") {

    if (!countryList) return;

    countryList.innerHTML = "";

    const keyword =
        search.toLowerCase().trim();

    const filtered =
        countries.filter(country => {

            const flag = country[0];
            const name = country[1];
            const code = country[2];

            return (
                name.toLowerCase().includes(keyword) ||
                code.includes(keyword) ||
                flag.includes(keyword)
            );
        });

    filtered.forEach(country => {

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

            selectedCountry = {
                flag,
                name,
                code
            };

            updateCountryUI();

            closeCountryModal();

            validatePhone();
        });

        countryList.appendChild(item);
    });
}


/* =========================================================
   COUNTRY UI
   ========================================================= */

function updateCountryUI() {

    if (countryFlag)
        countryFlag.textContent =
            selectedCountry.flag;

    if (countryCode)
        countryCode.textContent =
            selectedCountry.code;

    if (detectedCountry)
        detectedCountry.textContent =
            `${selectedCountry.flag} ${selectedCountry.name}`;
}


/* =========================================================
   COUNTRY MODAL
   ========================================================= */

function openCountryModal() {

    if (!countryOverlay) return;

    countryOverlay.classList.add("active");

    renderCountries();

    setTimeout(() => {

        if (countrySearch) {
            countrySearch.focus();
        }

    }, 150);
}


function closeCountryModal() {

    if (!countryOverlay) return;

    countryOverlay.classList.remove("active");
}


/* =========================================================
   PHONE CLEANING
   ========================================================= */

function getCleanPhone() {

    if (!phoneNumber) return "";

    return phoneNumber.value
        .replace(/\D/g, "");
}


/* =========================================================
   FORMAT PHONE NUMBER
   ========================================================= */

function formatPhoneNumber() {

    if (!phoneNumber) return;

    let digits =
        phoneNumber.value
            .replace(/\D/g, "");

    /*
       Remove leading zero.

       Example:
       0712345678
       becomes
       712345678
    */

    if (digits.startsWith("0")) {
        digits = digits.substring(1);
    }

    /*
       Limit local phone digits.
    */

    digits =
        digits.substring(0, 15);

    /*
       Display in groups.
       Example:
       712 345 678
    */

    const groups =
        digits.match(/.{1,3}/g);

    phoneNumber.value =
        groups ? groups.join(" ") : "";

    validatePhone();
}


/* =========================================================
   BUILD FULL E.164 PHONE
   ========================================================= */

function getFullPhoneNumber() {

    let local =
        getCleanPhone();

    local =
        local.replace(/^0+/, "");

    if (!local) {
        return "";
    }

    return `${selectedCountry.code}${local}`;
}


/* =========================================================
   PHONE VALIDATION
   ========================================================= */

function validatePhone() {

    const digits =
        getCleanPhone();

    if (!digits) {

        hidePhoneError();

        if (continueBtn)
            continueBtn.disabled = true;

        return false;
    }

    /*
       Basic worldwide validation.
    */

    if (digits.length < 8) {

        showPhoneError(
            "Please enter a valid phone number."
        );

        if (continueBtn)
            continueBtn.disabled = true;

        return false;
    }

    if (digits.length > 15) {

        showPhoneError(
            "Phone number is too long."
        );

        if (continueBtn)
            continueBtn.disabled = true;

        return false;
    }

    hidePhoneError();

    if (continueBtn)
        continueBtn.disabled = false;

    return true;
}


/* =========================================================
   PHONE ERROR
   ========================================================= */

function showPhoneError(message) {

    if (!phoneError) return;

    phoneError.textContent = message;

    phoneError.style.display = "block";
}


function hidePhoneError() {

    if (!phoneError) return;

    phoneError.textContent = "";

    phoneError.style.display = "none";
}


/* =========================================================
   LOADER
   ========================================================= */

function setContinueLoading(loading) {

    if (!continueBtn) return;

    continueBtn.disabled = loading;

    if (continueLoader) {

        continueLoader.style.display =
            loading ? "inline-flex" : "none";
    }

    if (continueText) {

        continueText.textContent =
            loading
                ? "Sending code..."
                : "Continue";
    }

    if (continueArrow) {

        continueArrow.style.display =
            loading ? "none" : "inline";
    }
}


/* =========================================================
   VERIFICATION SECTION
   ========================================================= */

function openVerification(fullPhone) {

    currentPhone = fullPhone;

    if (verificationNumber) {

        verificationNumber.textContent =
            fullPhone;
    }

    const registerCard =
        document.querySelector(".register-card");

    const brandSection =
        document.querySelector(".brand-section");

    const securityNote =
        document.querySelector(".security-note");

    if (registerCard)
        registerCard.style.display = "none";

    if (brandSection)
        brandSection.style.display = "none";

    if (securityNote)
        securityNote.style.display = "none";

    if (verificationSection) {

        verificationSection.style.display =
            "block";

        verificationSection.classList.add("active");
    }

    focusFirstOTP();

    startResendTimer();
}


/* =========================================================
   OTP INPUTS
   ========================================================= */

function getOTPInputs() {

    return Array.from(
        document.querySelectorAll(".otp-input")
    );
}


function focusFirstOTP() {

    const inputs =
        getOTPInputs();

    if (inputs.length > 0) {

        setTimeout(() => {
            inputs[0].focus();
        }, 200);
    }
}


function setupOTPInputs() {

    const inputs =
        getOTPInputs();

    inputs.forEach((input, index) => {

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
            event => {

                const value =
                    event.target.value
                        .replace(/\D/g, "");

                event.target.value =
                    value;

                if (
                    value &&
                    index < inputs.length - 1
                ) {

                    inputs[index + 1].focus();
                }

                updateVerifyButton();
            }
        );


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Backspace" &&
                    !input.value &&
                    index > 0
                ) {

                    inputs[index - 1].focus();
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
                    .substring(0, 6);

                pasted
                    .split("")
                    .forEach((digit, i) => {

                        if (inputs[i]) {
                            inputs[i].value =
                                digit;
                        }
                    });

                if (inputs[pasted.length - 1]) {

                    inputs[
                        pasted.length - 1
                    ].focus();

                } else if (inputs[0]) {

                    inputs[0].focus();
                }

                updateVerifyButton();
            }
        );
    });
}


/* =========================================================
   GET OTP
   ========================================================= */

function getOTP() {

    return getOTPInputs()
        .map(input => input.value)
        .join("");
}


/* =========================================================
   VERIFY BUTTON
   ========================================================= */

function updateVerifyButton() {

    const otp =
        getOTP();

    if (!verifyBtn) return;

    verifyBtn.disabled =
        otp.length !== 6;
}


/* =========================================================
   CLEAR OTP
   ========================================================= */

function clearOTP() {

    getOTPInputs()
        .forEach(input => {

            input.value = "";
        });

    updateVerifyButton();

    focusFirstOTP();
}


/* =========================================================
   VERIFY OTP
   ========================================================= */

async function verifyOTP() {

    const otp =
        getOTP();

    if (otp.length !== 6) {

        alert(
            "Please enter the 6-digit verification code."
        );

        return;
    }

    if (!confirmationResult) {

        alert(
            "Verification session expired. Please request a new code."
        );

        return;
    }

    if (verifyBtn) {

        verifyBtn.disabled = true;

        verifyBtn.dataset.originalText =
            verifyBtn.textContent;

        verifyBtn.textContent =
            "Verifying...";
    }

    try {

        const result =
            await confirmationResult.confirm(
                otp
            );

        const user =
            result.user;

        /*
           Save registration information.
        */

        localStorage.setItem(
            "chapcyPhoneVerified",
            "true"
        );

        localStorage.setItem(
            "chapcyCurrentPhone",
            currentPhone
        );

        localStorage.setItem(
            "chapcyUID",
            user.uid
        );

        localStorage.setItem(
            "chapcyUserCountry",
            selectedCountry.name
        );

        localStorage.setItem(
            "chapcyRegistrationComplete",
            "true"
        );

        saveRegisteredUser(
            currentPhone,
            user.uid
        );

        showSuccess();

    } catch (error) {

        console.error(
            "OTP verification failed:",
            error
        );

        let message =
            "Invalid verification code.";

        if (
            error.code ===
            "auth/invalid-verification-code"
        ) {

            message =
                "The verification code is incorrect.";

        } else if (
            error.code ===
            "auth/code-expired"
        ) {

            message =
                "This verification code has expired. Please request a new one.";
        }

        alert(message);

        if (verifyBtn) {

            verifyBtn.disabled = false;

            verifyBtn.textContent =
                verifyBtn.dataset.originalText ||
                "Verify";
        }
    }
}


/* =========================================================
   SEND OTP
   ========================================================= */

async function sendOTP(fullPhone) {

    waitForFirebase(() => {});

    if (
        !window.chapcyAuth ||
        !window.ChapcyRecaptchaVerifier ||
        !window.signInWithPhoneNumber
    ) {

        throw new Error(
            "Firebase Authentication is not ready."
        );
    }

    const verifier =
        await setupRecaptcha();

    try {

        confirmationResult =
            await window.signInWithPhoneNumber(
                window.chapcyAuth,
                fullPhone,
                verifier
            );

        console.log(
            "✅ SMS verification code sent."
        );

        return true;

    } catch (error) {

        console.error(
            "SMS sending failed:",
            error
        );

        try {

            if (recaptchaVerifier) {
                recaptchaVerifier.clear();
            }

        } catch (e) {}

        recaptchaVerifier = null;

        throw error;
    }
}


/* =========================================================
   CONTINUE REGISTRATION
   ========================================================= */

async function handleContinue(event) {

    if (event) {
        event.preventDefault();
    }

    if (!validatePhone()) {
        return;
    }

    const fullPhone =
        getFullPhoneNumber();

    if (!fullPhone) {

        showPhoneError(
            "Please enter your phone number."
        );

        return;
    }

    setContinueLoading(true);

    try {

        console.log(
            "📱 Sending OTP to:",
            fullPhone
        );

        await sendOTP(fullPhone);

        /*
           Save pending registration.
        */

        localStorage.setItem(
            "chapcyPendingPhone",
            fullPhone
        );

        localStorage.setItem(
            "chapcyPendingCountry",
            JSON.stringify(selectedCountry)
        );

        openVerification(
            fullPhone
        );

    } catch (error) {

        console.error(
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
                    "SMS quota has been exceeded. Please try again later.";

                break;

            case "auth/captcha-check-failed":

                message =
                    "reCAPTCHA verification failed. Please try again.";

                break;

            case "auth/operation-not-allowed":

                message =
                    "Phone Authentication is not enabled in Firebase.";

                break;

            case "auth/app-not-authorized":

                message =
                    "This website is not authorized in Firebase Authentication.";

                break;

            default:

                if (error.message) {
                    message =
                        error.message;
                }
        }

        alert(message);

    } finally {

        setContinueLoading(false);
    }
}


/* =========================================================
   RESEND TIMER
   ========================================================= */

function startResendTimer() {

    if (!resendBtn) return;

    clearInterval(resendTimer);

    resendSeconds = 30;

    resendBtn.disabled = true;

    updateResendText();

    resendTimer =
        setInterval(() => {

            resendSeconds--;

            updateResendText();

            if (resendSeconds <= 0) {

                clearInterval(resendTimer);

                resendBtn.disabled =
                    false;

                resendBtn.textContent =
                    "Resend Code";
            }

        }, 1000);
}


function updateResendText() {

    if (!resendBtn) return;

    resendBtn.textContent =
        `Resend Code (${resendSeconds}s)`;
}


/* =========================================================
   RESEND OTP
   ========================================================= */

async function resendOTP() {

    if (!currentPhone) {

        alert(
            "Phone number not found."
        );

        return;
    }

    if (resendBtn) {

        resendBtn.disabled = true;

        resendBtn.textContent =
            "Sending...";
    }

    try {

        await sendOTP(
            currentPhone
        );

        clearOTP();

        startResendTimer();

        console.log(
            "✅ New OTP sent."
        );

    } catch (error) {

        console.error(
            error
        );

        alert(
            "Unable to resend the code. Please try again."
        );

        if (resendBtn) {

            resendBtn.disabled =
                false;

            resendBtn.textContent =
                "Resend Code";
        }
    }
}


/* =========================================================
   SAVE REGISTERED USER
   ========================================================= */

function saveRegisteredUser(
    phone,
    uid
) {

    let users = [];

    try {

        users =
            JSON.parse(
                localStorage.getItem(
                    "chapcyRegisteredUsers"
                )
            ) || [];

    } catch (error) {

        users = [];
    }

    const exists =
        users.some(
            user =>
                user.phone === phone
        );

    if (!exists) {

        users.push({

            phone: phone,

            uid: uid,

            country:
                selectedCountry.name,

            flag:
                selectedCountry.flag,

            registeredAt:
                new Date().toISOString()
        });

        localStorage.setItem(
            "chapcyRegisteredUsers",
            JSON.stringify(users)
        );
    }
}


/* =========================================================
   SUCCESS SCREEN
   ========================================================= */

function showSuccess() {

    if (verificationSection) {

        verificationSection.style.display =
            "none";
    }

    if (successSection) {

        successSection.style.display =
            "block";

        successSection.classList.add(
            "active"
        );
    }

    /*
       Small success vibration if supported.
    */

    if (
        navigator.vibrate
    ) {

        navigator.vibrate(
            [100, 50, 100]
        );
    }
}


/* =========================================================
   ENTER CHAPCY
   ========================================================= */

function enterChapcy() {

    /*
       IMPORTANT:
       Your actual file is Mychat.html
    */

    window.location.href =
        "Mychat.html";
}


/* =========================================================
   COUNTRY EVENTS
   ========================================================= */

if (countrySelector) {

    countrySelector.addEventListener(
        "click",
        openCountryModal
    );
}


if (closeCountry) {

    closeCountry.addEventListener(
        "click",
        closeCountryModal
    );
}


if (countryOverlay) {

    countryOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                countryOverlay
            ) {

                closeCountryModal();
            }
        }
    );
}


if (countrySearch) {

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
   PHONE EVENTS
   ========================================================= */

if (phoneNumber) {

    phoneNumber.addEventListener(
        "input",
        formatPhoneNumber
    );

    phoneNumber.addEventListener(
        "blur",
        validatePhone
    );
}


/* =========================================================
   REGISTER FORM
   ========================================================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        handleContinue
    );
}


if (continueBtn) {

    continueBtn.addEventListener(
        "click",
        handleContinue
    );
}


/* =========================================================
   VERIFY EVENTS
   ========================================================= */

if (verifyBtn) {

    verifyBtn.addEventListener(
        "click",
        verifyOTP
    );
}


if (resendBtn) {

    resendBtn.addEventListener(
        "click",
        resendOTP
    );
}


if (enterChapcyBtn) {

    enterChapcyBtn.addEventListener(
        "click",
        enterChapcy
    );
}


/* =========================================================
   INITIALIZE OTP
   ========================================================= */

setupOTPInputs();


/* =========================================================
   INITIAL COUNTRY
   ========================================================= */

updateCountryUI();

renderCountries();


/* =========================================================
   FIREBASE STATUS
   ========================================================= */

waitForFirebase(() => {

    console.log(
        "🔥 CHAPCY Firebase Authentication Ready"
    );

});


/* =========================================================
   RESTORE PENDING COUNTRY
   ========================================================= */

try {

    const savedCountry =
        localStorage.getItem(
            "chapcyPendingCountry"
        );

    if (savedCountry) {

        const parsed =
            JSON.parse(savedCountry);

        if (
            parsed &&
            parsed.name &&
            parsed.code &&
            parsed.flag
        ) {

            selectedCountry =
                parsed;

            updateCountryUI();
        }
    }

} catch (error) {

    console.warn(
        "Could not restore country.",
        error
    );
}


/* =========================================================
   FINAL START
   ========================================================= */

console.log(
    "🚀 CHAPCY Registration JS Loaded"
);
