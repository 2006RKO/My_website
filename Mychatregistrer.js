/* =========================================================
   CHAPCY WORLDWIDE PHONE REGISTRATION
   Firebase Phone Authentication
   FLOW:

   Mychatregister.html
        ↓
   Continue
        ↓
   Firebase sends OTP
        ↓
   Mychatotp.html
        ↓
   Verify OTP
        ↓
   CHAPCY
========================================================= */


/* =========================================================
   WORLDWIDE COUNTRIES
========================================================= */

const countries = [

    ["🇹🇿", "Tanzania", "+255"],
    ["🇰🇪", "Kenya", "+254"],
    ["🇺🇬", "Uganda", "+256"],
    ["🇷🇼", "Rwanda", "+250"],
    ["🇧🇮", "Burundi", "+257"],
    ["🇨🇩", "DR Congo", "+243"],
    ["🇨🇬", "Congo", "+242"],
    ["🇿🇲", "Zambia", "+260"],
    ["🇿🇼", "Zimbabwe", "+263"],
    ["🇲🇼", "Malawi", "+265"],
    ["🇲🇿", "Mozambique", "+258"],
    ["🇿🇦", "South Africa", "+27"],
    ["🇳🇦", "Namibia", "+264"],
    ["🇧🇼", "Botswana", "+267"],
    ["🇸🇿", "Eswatini", "+268"],
    ["🇱🇸", "Lesotho", "+266"],
    ["🇦🇴", "Angola", "+244"],
    ["🇳🇬", "Nigeria", "+234"],
    ["🇬🇭", "Ghana", "+233"],
    ["🇨🇮", "Ivory Coast", "+225"],
    ["🇸🇳", "Senegal", "+221"],
    ["🇺🇬", "Uganda", "+256"],
    ["🇪🇹", "Ethiopia", "+251"],
    ["🇸🇴", "Somalia", "+252"],
    ["🇸🇩", "Sudan", "+249"],
    ["🇸🇸", "South Sudan", "+211"],
    ["🇪🇬", "Egypt", "+20"],
    ["🇩🇿", "Algeria", "+213"],
    ["🇲🇦", "Morocco", "+212"],
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

    ["🇮🇳", "India", "+91"],
    ["🇵🇰", "Pakistan", "+92"],
    ["🇧🇩", "Bangladesh", "+880"],
    ["🇱🇰", "Sri Lanka", "+94"],
    ["🇳🇵", "Nepal", "+977"],
    ["🇦🇫", "Afghanistan", "+93"],
    ["🇮🇷", "Iran", "+98"],
    ["🇮🇶", "Iraq", "+964"],
    ["🇸🇦", "Saudi Arabia", "+966"],
    ["🇦🇪", "United Arab Emirates", "+971"],
    ["🇶🇦", "Qatar", "+974"],
    ["🇰🇼", "Kuwait", "+965"],
    ["🇧🇭", "Bahrain", "+973"],
    ["🇴🇲", "Oman", "+968"],
    ["🇮🇱", "Israel", "+972"],
    ["🇯🇴", "Jordan", "+962"],
    ["🇱🇧", "Lebanon", "+961"],

    ["🇨🇳", "China", "+86"],
    ["🇯🇵", "Japan", "+81"],
    ["🇰🇷", "South Korea", "+82"],
    ["🇮🇩", "Indonesia", "+62"],
    ["🇲🇾", "Malaysia", "+60"],
    ["🇸🇬", "Singapore", "+65"],
    ["🇹🇭", "Thailand", "+66"],
    ["🇵🇭", "Philippines", "+63"],
    ["🇻🇳", "Vietnam", "+84"],
    ["🇵🇬", "Papua New Guinea", "+675"],
    ["🇦🇺", "Australia", "+61"],
    ["🇳🇿", "New Zealand", "+64"],

    ["🇫🇯", "Fiji", "+679"],
    ["🇸🇧", "Solomon Islands", "+677"],
    ["🇻🇺", "Vanuatu", "+678"],
    ["🇼🇸", "Samoa", "+685"],
    ["🇹🇴", "Tonga", "+676"],
    ["🇰🇮", "Kiribati", "+686"],
    ["🇳🇷", "Nauru", "+674"],
    ["🇵🇼", "Palau", "+680"],

    ["🇪🇷", "Eritrea", "+291"],
    ["🇩🇯", "Djibouti", "+253"],
    ["🇬🇦", "Gabon", "+241"],
    ["🇬🇲", "Gambia", "+220"],
    ["🇬🇳", "Guinea", "+224"],
    ["🇱🇷", "Liberia", "+231"],
    ["🇸🇱", "Sierra Leone", "+232"],
    ["🇹🇬", "Togo", "+228"],
    ["🇧🇯", "Benin", "+229"],
    ["🇧🇫", "Burkina Faso", "+226"],
    ["🇲🇱", "Mali", "+223"],
    ["🇳🇪", "Niger", "+227"],
    ["🇹🇩", "Chad", "+235"],
    ["🇨🇫", "Central African Republic", "+236"],
    ["🇨🇲", "Cameroon", "+237"],
    ["🇬🇶", "Equatorial Guinea", "+240"],
    ["🇸🇹", "São Tomé and Príncipe", "+239"],
    ["🇨🇻", "Cape Verde", "+238"],
    ["🇲🇷", "Mauritania", "+222"],

    ["🇮🇸", "Iceland", "+354"],
    ["🇱🇺", "Luxembourg", "+352"],
    ["🇲🇹", "Malta", "+356"],
    ["🇨🇾", "Cyprus", "+357"],
    ["🇪🇪", "Estonia", "+372"],
    ["🇱🇻", "Latvia", "+371"],
    ["🇱🇹", "Lithuania", "+370"],
    ["🇷🇴", "Romania", "+40"],
    ["🇧🇬", "Bulgaria", "+359"],
    ["🇭🇺", "Hungary", "+36"],
    ["🇨🇿", "Czech Republic", "+420"],
    ["🇸🇰", "Slovakia", "+421"],
    ["🇸🇮", "Slovenia", "+386"],
    ["🇭🇷", "Croatia", "+385"],
    ["🇷🇸", "Serbia", "+381"],
    ["🇧🇦", "Bosnia and Herzegovina", "+387"],
    ["🇲🇪", "Montenegro", "+382"],
    ["🇦🇱", "Albania", "+355"],
    ["🇲🇰", "North Macedonia", "+389"],

    ["🇯🇲", "Jamaica", "+1"],
    ["🇧🇸", "Bahamas", "+1"],
    ["🇧🇧", "Barbados", "+1"],
    ["🇹🇹", "Trinidad and Tobago", "+1"],
    ["🇧🇿", "Belize", "+501"],
    ["🇨🇷", "Costa Rica", "+506"],
    ["🇵🇦", "Panama", "+507"],
    ["🇬🇹", "Guatemala", "+502"],
    ["🇭🇳", "Honduras", "+504"],
    ["🇸🇻", "El Salvador", "+503"],
    ["🇳🇮", "Nicaragua", "+505"],

    ["🇵🇾", "Paraguay", "+595"],
    ["🇺🇾", "Uruguay", "+598"],
    ["🇧🇴", "Bolivia", "+591"],
    ["🇪🇨", "Ecuador", "+593"],
    ["🇻🇪", "Venezuela", "+58"],
    ["🇬🇾", "Guyana", "+592"],
    ["🇸🇷", "Suriname", "+597"],

    ["🇲🇺", "Mauritius", "+230"],
    ["🇸🇨", "Seychelles", "+248"],
    ["🇰🇲", "Comoros", "+269"],
    ["🇲🇬", "Madagascar", "+261"],
    ["🇷🇪", "Réunion", "+262"],
    ["🇲🇺", "Mauritius", "+230"],

    ["🇵🇸", "Palestine", "+970"],
    ["🇾🇪", "Yemen", "+967"],
    ["🇸🇾", "Syria", "+963"],
    ["🇦🇿", "Azerbaijan", "+994"],
    ["🇦🇲", "Armenia", "+374"],
    ["🇬🇪", "Georgia", "+995"],
    ["🇰🇿", "Kazakhstan", "+7"],
    ["🇺🇿", "Uzbekistan", "+998"],
    ["🇹🇲", "Turkmenistan", "+993"],
    ["🇰🇬", "Kyrgyzstan", "+996"],
    ["🇹🇯", "Tajikistan", "+992"],
    ["🇲🇳", "Mongolia", "+976"]
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
    document.getElementById("phoneNumber");

const detectedCountry =
    document.getElementById("detectedCountry");

const continueBtn =
    document.getElementById("continueBtn");

const buttonText =
    continueBtn
        ? continueBtn.querySelector(".button-text")
        : null;

const buttonLoader =
    continueBtn
        ? continueBtn.querySelector(".button-loader")
        : null;

const errorMessage =
    document.getElementById("phoneError");

const verificationSection =
    document.getElementById("verificationSection");

const successSection =
    document.getElementById("successSection");


/* =========================================================
   FIREBASE VARIABLES
========================================================= */

let chapcyAuth = null;

let RecaptchaVerifier = null;

let signInWithPhoneNumber = null;

let confirmationResult = null;

let recaptchaVerifier = null;


/* =========================================================
   WAIT FOR FIREBASE
========================================================= */

function waitForFirebase() {

    return new Promise((resolve, reject) => {

        let attempts = 0;

        const timer = setInterval(() => {

            attempts++;

            if (
                window.chapcyAuth &&
                window.ChapcyRecaptchaVerifier &&
                window.signInWithPhoneNumber
            ) {

                chapcyAuth =
                    window.chapcyAuth;

                RecaptchaVerifier =
                    window.ChapcyRecaptchaVerifier;

                signInWithPhoneNumber =
                    window.signInWithPhoneNumber;

                clearInterval(timer);

                resolve();

            }

            if (attempts > 100) {

                clearInterval(timer);

                reject(
                    new Error(
                        "Firebase haijapakia."
                    )
                );

            }

        }, 100);

    });

}


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

    if (!countrySelector) return;

    const flag =
        countrySelector.querySelector(".selected-flag");

    const code =
        countrySelector.querySelector(".selected-code");

    const name =
        countrySelector.querySelector(".selected-country-name");

    if (flag) {

        flag.textContent =
            selectedCountry.flag;

    }

    if (code) {

        code.textContent =
            selectedCountry.code;

    }

    if (name) {

        name.textContent =
            selectedCountry.name;

    }


    /* Country detected text */

    if (detectedCountry) {

        const countryText =
            detectedCountry.querySelector("span");

        if (countryText) {

            countryText.textContent =
                selectedCountry.name;

        }

    }

}


/* =========================================================
   RENDER COUNTRIES
========================================================= */

function renderCountries(list = countries) {

    if (!countryList) return;

    countryList.innerHTML = "";

    if (!list.length) {

        countryList.innerHTML = `
            <div class="no-countries">
                <i class="fa-solid fa-earth-americas"></i>
                <p>No country found</p>
            </div>
        `;

        return;
    }


    list.forEach(country => {

        const [
            flag,
            name,
            code
        ] = country;

        const item =
            document.createElement("button");

        item.type = "button";

        item.className =
            "country-item";


        if (
            name === selectedCountry.name &&
            code === selectedCountry.code
        ) {

            item.classList.add("selected");

        }


        item.innerHTML = `

            <span class="flag">
                ${escapeHTML(flag)}
            </span>

            <span class="country-info">

                <strong>
                    ${escapeHTML(name)}
                </strong>

                <small>
                    ${escapeHTML(code)}
                </small>

            </span>

            <span class="dial-code">
                ${escapeHTML(code)}
            </span>

            <i class="fa-solid fa-check country-check"></i>

        `;


        item.addEventListener(
            "click",
            () => {

                selectCountry(
                    flag,
                    name,
                    code
                );

            }
        );


        countryList.appendChild(item);

    });

}


/* =========================================================
   SELECT COUNTRY
========================================================= */

function selectCountry(
    flag,
    name,
    code
) {

    selectedCountry = {

        flag: flag,

        name: name,

        code: code

    };


    updateCountryUI();

    renderCountries();

    closeCountryPicker();

    if (phoneInput) {

        phoneInput.focus();

    }

}


/* =========================================================
   OPEN COUNTRY PICKER
========================================================= */

function openCountryPicker() {

    if (countryOverlay) {

        countryOverlay.classList.add("active");

    }

    if (countryModal) {

        countryModal.classList.add("active");

    }

    if (countrySearch) {

        countrySearch.value = "";

    }

    renderCountries();

    setTimeout(() => {

        if (countrySearch) {

            countrySearch.focus();

        }

    }, 150);

}


/* =========================================================
   CLOSE COUNTRY PICKER
========================================================= */

function closeCountryPicker() {

    if (countryOverlay) {

        countryOverlay.classList.remove("active");

    }

    if (countryModal) {

        countryModal.classList.remove("active");

    }

}


/* =========================================================
   COUNTRY SELECTOR CLICK
========================================================= */

if (countrySelector) {

    countrySelector.addEventListener(
        "click",
        openCountryPicker
    );

}


/* =========================================================
   CLOSE BUTTON
========================================================= */

if (closeCountryModal) {

    closeCountryModal.addEventListener(
        "click",
        closeCountryPicker
    );

}


/* =========================================================
   OVERLAY CLICK
========================================================= */

if (countryOverlay) {

    countryOverlay.addEventListener(
        "click",
        closeCountryPicker
    );

}


/* =========================================================
   ESCAPE KEY
========================================================= */

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

if (countrySearch) {

    countrySearch.addEventListener(
        "input",
        () => {

            const query =
                countrySearch.value
                    .trim()
                    .toLowerCase();


            const filtered =
                countries.filter(country => {

                    const flag =
                        country[0]
                            .toLowerCase();

                    const name =
                        country[1]
                            .toLowerCase();

                    const code =
                        country[2]
                            .toLowerCase();


                    return (
                        flag.includes(query) ||
                        name.includes(query) ||
                        code.includes(query)
                    );

                });


            renderCountries(filtered);

        }
    );

}


/* =========================================================
   PHONE NUMBER CLEANER
========================================================= */

function cleanPhoneNumber(value) {

    return String(value || "")
        .replace(/\D/g, "");

}


/* =========================================================
   FORMAT INTERNATIONAL PHONE
========================================================= */

function getInternationalPhone() {

    if (!phoneInput) {

        return null;

    }


    let number =
        cleanPhoneNumber(
            phoneInput.value
        );


    if (!number) {

        return null;

    }


    /*
       User akiandika:
       712345678

       Tunafanya:
       +255712345678
    */

    if (
        number.startsWith("0")
    ) {

        number =
            number.substring(1);

    }


    /*
       Kama user ameandika country
       code already, avoid duplicate.
    */

    const countryDigits =
        selectedCountry.code
            .replace("+", "");


    if (
        number.startsWith(countryDigits)
    ) {

        return "+" + number;

    }


    return (
        selectedCountry.code +
        number
    );

}


/* =========================================================
   PHONE VALIDATION
========================================================= */

function validatePhoneNumber() {

    clearPhoneError();


    const internationalPhone =
        getInternationalPhone();


    if (!internationalPhone) {

        showPhoneError(
            "Please enter your phone number."
        );

        return false;

    }


    const digits =
        internationalPhone
            .replace(/\D/g, "");


    /*
       Basic international length check.
       Firebase ndiyo itafanya validation
       ya mwisho.
    */

    if (
        digits.length < 8 ||
        digits.length > 15
    ) {

        showPhoneError(
            "Please enter a valid phone number."
        );

        return false;

    }


    return true;

}


/* =========================================================
   ERROR FUNCTIONS
========================================================= */

function showPhoneError(message) {

    if (!errorMessage) {

        alert(message);

        return;

    }


    errorMessage.textContent =
        message;

    errorMessage.classList.add(
        "show"
    );

}


function clearPhoneError() {

    if (!errorMessage) return;

    errorMessage.textContent = "";

    errorMessage.classList.remove(
        "show"
    );

}


/* =========================================================
   BUTTON LOADING
========================================================= */

function setLoading(isLoading) {

    if (!continueBtn) return;


    continueBtn.disabled =
        isLoading;


    if (buttonText) {

        buttonText.style.display =
            isLoading
                ? "none"
                : "";

    }


    if (buttonLoader) {

        buttonLoader.style.display =
            isLoading
                ? "inline-flex"
                : "none";

    }


    if (isLoading) {

        continueBtn.classList.add(
            "loading"
        );

    } else {

        continueBtn.classList.remove(
            "loading"
        );

    }

}


/* =========================================================
   CREATE RECAPTCHA
========================================================= */

async function createRecaptcha() {

    if (!chapcyAuth) {

        throw new Error(
            "Firebase Auth haijawa tayari."
        );

    }


    /*
       Remove old verifier if exists.
    */

    if (recaptchaVerifier) {

        try {

            recaptchaVerifier.clear();

        } catch (error) {

            console.warn(
                "Old reCAPTCHA clear error:",
                error
            );

        }

        recaptchaVerifier =
            null;

    }


    /*
       Firebase requires an element
       with this ID.
    */

    const container =
        document.getElementById(
            "recaptcha-container"
        );


    if (!container) {

        throw new Error(
            "recaptcha-container haipo kwenye HTML."
        );

    }


    container.innerHTML = "";


    recaptchaVerifier =
        new RecaptchaVerifier(
            chapcyAuth,
            "recaptcha-container",
            {

                size: "invisible",

                callback: () => {

                    console.log(
                        "reCAPTCHA verified."
                    );

                },

                "expired-callback": () => {

                    console.log(
                        "reCAPTCHA expired."
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


    if (!validatePhoneNumber()) {

        return;

    }


    const internationalPhone =
        getInternationalPhone();


    try {

        setLoading(true);


        /*
           Wait for Firebase globals.
        */

        await waitForFirebase();


        /*
           Create fresh reCAPTCHA.
        */

        const verifier =
            await createRecaptcha();


        console.log(
            "Sending OTP to:",
            internationalPhone
        );


        /*
           SEND SMS
        */

        confirmationResult =
            await signInWithPhoneNumber(
                chapcyAuth,
                internationalPhone,
                verifier
            );


        console.log(
            "OTP sent successfully."
        );


        /* =================================================
           IMPORTANT

           ConfirmationResult cannot be stored directly
           in sessionStorage.

           We only store verificationId.
        ================================================= */


        sessionStorage.setItem(
            "chapcyPendingPhone",
            internationalPhone
        );


        sessionStorage.setItem(
            "chapcyVerificationId",
            confirmationResult.verificationId
        );


        sessionStorage.setItem(
            "chapcyCountryName",
            selectedCountry.name
        );


        sessionStorage.setItem(
            "chapcyCountryCode",
            selectedCountry.code
        );


        sessionStorage.setItem(
            "chapcyCountryFlag",
            selectedCountry.flag
        );


        /*
           Optional:
           clear old OTP/session data.
        */

        sessionStorage.removeItem(
            "chapcyOTPVerified"
        );


        /*
           GO TO OTP PAGE
        */

        window.location.href =
            "Mychatotp.html";

    }

    catch (error) {

        console.error(
            "Firebase Phone Auth Error:",
            error
        );


        let message =
            "Failed to send verification code.";


        if (
            error &&
            error.code
        ) {

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
                        "SMS verification limit has been reached.";

                    break;


                case "auth/operation-not-allowed":

                    message =
                        "Phone authentication is not enabled in Firebase.";

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
                        "This website is not authorized in Firebase.";

                    break;


                default:

                    message =
                        error.message ||
                        message;

            }

        }


        showPhoneError(message);


        /*
           Clean verifier after failure.
        */

        if (recaptchaVerifier) {

            try {

                recaptchaVerifier.clear();

            } catch (e) {}

            recaptchaVerifier =
                null;

        }

    }

    finally {

        setLoading(false);

    }

}


/* =========================================================
   FORM SUBMIT
========================================================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            sendOTP();

        }
    );

}


/* =========================================================
   CONTINUE BUTTON
========================================================= */

if (
    continueBtn &&
    !registerForm
) {

    continueBtn.addEventListener(
        "click",
        sendOTP
    );

}


/* =========================================================
   PHONE INPUT

   Allow only numbers.
========================================================= */

if (phoneInput) {

    phoneInput.addEventListener(
        "input",
        () => {

            phoneInput.value =
                phoneInput.value.replace(
                    /\D/g,
                    ""
                );

            clearPhoneError();

        }
    );

}


/* =========================================================
   ENTER KEY ON PHONE INPUT
========================================================= */

if (phoneInput) {

    phoneInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                sendOTP();

            }

        }
    );

}


/* =========================================================
   SHOW VERIFICATION SECTION
   ---------------------------------------------------------
   This function is kept only for compatibility.
   We now use Mychatotp.html instead.
========================================================= */

function showVerificationSection() {

    /*
       DO NOT show OTP on this page.

       OTP now lives in:
       Mychatotp.html
    */

    window.location.href =
        "Mychatotp.html";

}


/* =========================================================
   HIDE VERIFICATION SECTION
========================================================= */

function hideVerificationSection() {

    if (!verificationSection) return;

    verificationSection.style.display =
        "none";

}


/* =========================================================
   HIDE SUCCESS SECTION
========================================================= */

function hideSuccessSection() {

    if (!successSection) return;

    successSection.style.display =
        "none";

}


/* =========================================================
   OLD VERIFY OTP COMPATIBILITY

   OTP verification is now handled by
   Mychatotp.html.

   This function is kept so old HTML buttons
   won't cause an undefined-function error.
========================================================= */

async function verifyOTP() {

    window.location.href =
        "Mychatotp.html";

}


/* =========================================================
   OLD RESEND OTP COMPATIBILITY
========================================================= */

async function resendOTP() {

    /*
       Resend is now handled inside
       Mychatotp.html.
    */

    window.location.href =
        "Mychatotp.html";

}


/* =========================================================
   ENTER CHAPCY
========================================================= */

function enterChapcy() {

    /*
       Change this if your chat page
       has a different filename.
    */

    window.location.href =
        "Mychat.html";

}


/* =========================================================
   RESTORE COUNTRY
========================================================= */

function restoreRegisteredState() {

    try {

        const savedCountry =
            localStorage.getItem(
                "chapcyPendingCountry"
            );


        if (savedCountry) {

            const parsed =
                JSON.parse(
                    savedCountry
                );


            if (
                parsed &&
                parsed.name &&
                parsed.code
            ) {

                selectedCountry = {

                    flag:
                        parsed.flag ||
                        "🌍",

                    name:
                        parsed.name,

                    code:
                        parsed.code

                };

            }

        }

    }

    catch (error) {

        console.warn(
            "Could not restore country:",
            error
        );

    }


    updateCountryUI();

}


/* =========================================================
   CHECK EXISTING REGISTRATION
========================================================= */

function checkExistingRegistration() {

    const registered =
        localStorage.getItem(
            "chapcyRegistered"
        );


    /*
       Usimrudishe automatically kama
       bado anataka ku-register tena.

       Hapa tunaacha registration page
       ifanye kazi normally.
    */

    if (
        registered === "true"
    ) {

        console.log(
            "CHAPCY account already registered."
        );

    }

}


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "CHAPCY Registration initialized."
        );


        /*
           Restore country.
        */

        restoreRegisteredState();


        /*
           Render country list.
        */

        renderCountries();


        /*
           Check registration.
        */

        checkExistingRegistration();


        /*
           Firebase will be loaded by
           module script.
        */

        try {

            await waitForFirebase();

            console.log(
                "CHAPCY Firebase Auth ready."
            );

        }

        catch (error) {

            console.error(
                "Firebase initialization error:",
                error
            );

        }

    }
);


/* =========================================================
   DEBUG HELPERS
========================================================= */

window.ChapcyRegistration = {

    getSelectedCountry: () =>
        selectedCountry,

    getPhone: () =>
        getInternationalPhone(),

    openCountries:
        openCountryPicker,

    closeCountries:
        closeCountryPicker,

    sendOTP:
        sendOTP

};


/* =========================================================
   END
========================================================= */
