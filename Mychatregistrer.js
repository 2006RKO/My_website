/* =========================================================
   CHAPCY REGISTER.JS
   WORLDWIDE PHONE REGISTRATION
   FIREBASE PHONE AUTH + SMS OTP
   PREMIUM UI + COUNTRY SYSTEM
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       FIREBASE CHECK
    ===================================================== */

    if (typeof firebase === "undefined") {
        console.error("Firebase SDK haijapakiwa.");
        alert("Firebase haijapakiwa. Hakikisha Firebase scripts zipo kwenye HTML.");
        return;
    }


    /* =====================================================
       FIREBASE CONFIG
    ===================================================== */

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


    /* =====================================================
       INITIALIZE FIREBASE
    ===================================================== */

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const auth = firebase.auth();


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const form =
        document.getElementById("registerForm");

    const countrySelector =
        document.getElementById("countrySelector");

    const countryOverlay =
        document.getElementById("countryOverlay");

    const countryModal =
        document.getElementById("countryModal");

    const closeCountry =
        document.getElementById("closeCountry");

    const countryList =
        document.getElementById("countryList");

    const countrySearch =
        document.getElementById("countrySearch");

    const countryFlag =
        document.getElementById("countryFlag");

    const countryCode =
        document.getElementById("countryCode");

    const phoneInput =
        document.getElementById("phoneNumber");

    const phoneError =
        document.getElementById("phoneError");

    const detectedCountry =
        document.getElementById("detectedCountry");

    const continueBtn =
        document.getElementById("continueBtn");

    const continueText =
        document.querySelector(".continue-text");

    const continueArrow =
        document.querySelector(".continue-arrow");

    const continueLoader =
        document.getElementById("continueLoader");

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

    const otpInputs =
        Array.from(
            document.querySelectorAll(".otp-input")
        );


    /* =====================================================
       CHECK IMPORTANT ELEMENTS
    ===================================================== */

    if (!form ||
        !countrySelector ||
        !countryList ||
        !countrySearch ||
        !phoneInput ||
        !continueBtn ||
        !verificationSection ||
        !verifyBtn ||
        !resendBtn ||
        !successSection ||
        !enterChapcyBtn) {

        console.error(
            "CHAPCY: Baadhi ya HTML elements hazipatikani."
        );

        return;
    }


    /* =====================================================
       WORLD COUNTRIES
    ===================================================== */

    const countries = [

        ["🇦🇫","Afghanistan","+93"],
        ["🇦🇱","Albania","+355"],
        ["🇩🇿","Algeria","+213"],
        ["🇦🇩","Andorra","+376"],
        ["🇦🇴","Angola","+244"],
        ["🇦🇬","Antigua and Barbuda","+1268"],
        ["🇦🇷","Argentina","+54"],
        ["🇦🇲","Armenia","+374"],
        ["🇦🇺","Australia","+61"],
        ["🇦🇹","Austria","+43"],
        ["🇦🇿","Azerbaijan","+994"],

        ["🇧🇸","Bahamas","+1242"],
        ["🇧🇭","Bahrain","+973"],
        ["🇧🇩","Bangladesh","+880"],
        ["🇧🇧","Barbados","+1246"],
        ["🇧🇾","Belarus","+375"],
        ["🇧🇪","Belgium","+32"],
        ["🇧🇿","Belize","+501"],
        ["🇧🇯","Benin","+229"],
        ["🇧🇹","Bhutan","+975"],
        ["🇧🇴","Bolivia","+591"],
        ["🇧🇦","Bosnia and Herzegovina","+387"],
        ["🇧🇼","Botswana","+267"],
        ["🇧🇷","Brazil","+55"],
        ["🇧🇳","Brunei","+673"],
        ["🇧🇬","Bulgaria","+359"],
        ["🇧🇫","Burkina Faso","+226"],
        ["🇧🇮","Burundi","+257"],

        ["🇨🇻","Cabo Verde","+238"],
        ["🇰🇭","Cambodia","+855"],
        ["🇨🇲","Cameroon","+237"],
        ["🇨🇦","Canada","+1"],
        ["🇨🇫","Central African Republic","+236"],
        ["🇹🇩","Chad","+235"],
        ["🇨🇱","Chile","+56"],
        ["🇨🇳","China","+86"],
        ["🇨🇴","Colombia","+57"],
        ["🇰🇲","Comoros","+269"],
        ["🇨🇬","Congo","+242"],
        ["🇨🇩","DR Congo","+243"],
        ["🇨🇷","Costa Rica","+506"],
        ["🇨🇮","Côte d'Ivoire","+225"],
        ["🇭🇷","Croatia","+385"],
        ["🇨🇺","Cuba","+53"],
        ["🇨🇾","Cyprus","+357"],
        ["🇨🇿","Czech Republic","+420"],

        ["🇩🇰","Denmark","+45"],
        ["🇩🇯","Djibouti","+253"],
        ["🇩🇲","Dominica","+1767"],
        ["🇩🇴","Dominican Republic","+1809"],

        ["🇪🇨","Ecuador","+593"],
        ["🇪🇬","Egypt","+20"],
        ["🇸🇻","El Salvador","+503"],
        ["🇬🇶","Equatorial Guinea","+240"],
        ["🇪🇷","Eritrea","+291"],
        ["🇪🇪","Estonia","+372"],
        ["🇸🇿","Eswatini","+268"],
        ["🇪🇹","Ethiopia","+251"],

        ["🇫🇯","Fiji","+679"],
        ["🇫🇮","Finland","+358"],
        ["🇫🇷","France","+33"],

        ["🇬🇦","Gabon","+241"],
        ["🇬🇲","Gambia","+220"],
        ["🇬🇪","Georgia","+995"],
        ["🇩🇪","Germany","+49"],
        ["🇬🇭","Ghana","+233"],
        ["🇬🇷","Greece","+30"],
        ["🇬🇩","Grenada","+1473"],
        ["🇬🇹","Guatemala","+502"],
        ["🇬🇳","Guinea","+224"],
        ["🇬🇼","Guinea-Bissau","+245"],
        ["🇬🇾","Guyana","+592"],

        ["🇭🇹","Haiti","+509"],
        ["🇭🇳","Honduras","+504"],
        ["🇭🇺","Hungary","+36"],

        ["🇮🇸","Iceland","+354"],
        ["🇮🇳","India","+91"],
        ["🇮🇩","Indonesia","+62"],
        ["🇮🇷","Iran","+98"],
        ["🇮🇶","Iraq","+964"],
        ["🇮🇪","Ireland","+353"],
        ["🇮🇱","Israel","+972"],
        ["🇮🇹","Italy","+39"],

        ["🇯🇲","Jamaica","+1876"],
        ["🇯🇵","Japan","+81"],
        ["🇯🇴","Jordan","+962"],

        ["🇰🇿","Kazakhstan","+7"],
        ["🇰🇪","Kenya","+254"],
        ["🇰🇮","Kiribati","+686"],
        ["🇰🇼","Kuwait","+965"],
        ["🇰🇬","Kyrgyzstan","+996"],

        ["🇱🇦","Laos","+856"],
        ["🇱🇻","Latvia","+371"],
        ["🇱🇧","Lebanon","+961"],
        ["🇱🇸","Lesotho","+266"],
        ["🇱🇷","Liberia","+231"],
        ["🇱🇾","Libya","+218"],
        ["🇱🇮","Liechtenstein","+423"],
        ["🇱🇹","Lithuania","+370"],
        ["🇱🇺","Luxembourg","+352"],

        ["🇲🇬","Madagascar","+261"],
        ["🇲🇼","Malawi","+265"],
        ["🇲🇾","Malaysia","+60"],
        ["🇲🇻","Maldives","+960"],
        ["🇲🇱","Mali","+223"],
        ["🇲🇹","Malta","+356"],
        ["🇲🇭","Marshall Islands","+692"],
        ["🇲🇷","Mauritania","+222"],
        ["🇲🇺","Mauritius","+230"],
        ["🇲🇽","Mexico","+52"],
        ["🇫🇲","Micronesia","+691"],
        ["🇲🇩","Moldova","+373"],
        ["🇲🇨","Monaco","+377"],
        ["🇲🇳","Mongolia","+976"],
        ["🇲🇪","Montenegro","+382"],
        ["🇲🇦","Morocco","+212"],
        ["🇲🇿","Mozambique","+258"],
        ["🇲🇲","Myanmar","+95"],

        ["🇳🇦","Namibia","+264"],
        ["🇳🇷","Nauru","+674"],
        ["🇳🇵","Nepal","+977"],
        ["🇳🇱","Netherlands","+31"],
        ["🇳🇿","New Zealand","+64"],
        ["🇳🇮","Nicaragua","+505"],
        ["🇳🇪","Niger","+227"],
        ["🇳🇬","Nigeria","+234"],
        ["🇰🇵","North Korea","+850"],
        ["🇲🇰","North Macedonia","+389"],
        ["🇳🇴","Norway","+47"],

        ["🇴🇲","Oman","+968"],

        ["🇵🇰","Pakistan","+92"],
        ["🇵🇼","Palau","+680"],
        ["🇵🇸","Palestine","+970"],
        ["🇵🇦","Panama","+507"],
        ["🇵🇬","Papua New Guinea","+675"],
        ["🇵🇾","Paraguay","+595"],
        ["🇵🇪","Peru","+51"],
        ["🇵🇭","Philippines","+63"],
        ["🇵🇱","Poland","+48"],
        ["🇵🇹","Portugal","+351"],

        ["🇶🇦","Qatar","+974"],

        ["🇷🇴","Romania","+40"],
        ["🇷🇺","Russia","+7"],
        ["🇷🇼","Rwanda","+250"],

        ["🇰🇳","Saint Kitts and Nevis","+1869"],
        ["🇱🇨","Saint Lucia","+1758"],
        ["🇻🇨","Saint Vincent and the Grenadines","+1784"],
        ["🇼🇸","Samoa","+685"],
        ["🇸🇲","San Marino","+378"],
        ["🇸🇹","São Tomé and Príncipe","+239"],
        ["🇸🇦","Saudi Arabia","+966"],
        ["🇸🇳","Senegal","+221"],
        ["🇷🇸","Serbia","+381"],
        ["🇸🇨","Seychelles","+248"],
        ["🇸🇱","Sierra Leone","+232"],
        ["🇸🇬","Singapore","+65"],
        ["🇸🇰","Slovakia","+421"],
        ["🇸🇮","Slovenia","+386"],
        ["🇸🇧","Solomon Islands","+677"],
        ["🇸🇴","Somalia","+252"],
        ["🇿🇦","South Africa","+27"],
        ["🇰🇷","South Korea","+82"],
        ["🇸🇸","South Sudan","+211"],
        ["🇪🇸","Spain","+34"],
        ["🇱🇰","Sri Lanka","+94"],
        ["🇸🇩","Sudan","+249"],
        ["🇸🇷","Suriname","+597"],
        ["🇸🇪","Sweden","+46"],
        ["🇨🇭","Switzerland","+41"],
        ["🇸🇾","Syria","+963"],

        ["🇹🇼","Taiwan","+886"],
        ["🇹🇯","Tajikistan","+992"],
        ["🇹🇿","Tanzania","+255"],
        ["🇹🇭","Thailand","+66"],
        ["🇹🇱","Timor-Leste","+670"],
        ["🇹🇬","Togo","+228"],
        ["🇹🇴","Tonga","+676"],
        ["🇹🇹","Trinidad and Tobago","+1868"],
        ["🇹🇳","Tunisia","+216"],
        ["🇹🇷","Turkey","+90"],
        ["🇹🇲","Turkmenistan","+993"],
        ["🇹🇻","Tuvalu","+688"],

        ["🇺🇬","Uganda","+256"],
        ["🇺🇦","Ukraine","+380"],
        ["🇦🇪","United Arab Emirates","+971"],
        ["🇬🇧","United Kingdom","+44"],
        ["🇺🇸","United States","+1"],
        ["🇺🇾","Uruguay","+598"],
        ["🇺🇿","Uzbekistan","+998"],

        ["🇻🇺","Vanuatu","+678"],
        ["🇻🇦","Vatican City","+39"],
        ["🇻🇪","Venezuela","+58"],
        ["🇻🇳","Vietnam","+84"],

        ["🇾🇪","Yemen","+967"],

        ["🇿🇲","Zambia","+260"],
        ["🇿🇼","Zimbabwe","+263"]

    ];


    /* =====================================================
       CURRENT COUNTRY
    ===================================================== */

    let selectedCountry = {
        flag: "🇹🇿",
        name: "Tanzania",
        code: "+255"
    };


    /* =====================================================
       FIREBASE OTP STATE
    ===================================================== */

    let confirmationResult = null;
    let recaptchaVerifier = null;
    let resendCooldown = false;


    /* =====================================================
       UPDATE COUNTRY UI
    ===================================================== */

    function updateCountryUI() {

        countryFlag.textContent =
            selectedCountry.flag;

        countryCode.textContent =
            selectedCountry.code;

        if (detectedCountry) {

            detectedCountry.innerHTML = `
                <i class="fa-solid fa-earth-africa"></i>
                <span>
                    Country: ${selectedCountry.name}
                </span>
            `;

        }

    }


    /* =====================================================
       COUNTRY LIST
    ===================================================== */

    function renderCountries(search = "") {

        countryList.innerHTML = "";

        const keyword =
            search.toLowerCase().trim();

        const filtered =
            countries.filter(country => {

                return (
                    country[1]
                        .toLowerCase()
                        .includes(keyword)
                    ||
                    country[2]
                        .includes(keyword)
                );

            });


        if (!filtered.length) {

            countryList.innerHTML = `
                <div class="no-country">
                    <i class="fa-solid fa-earth-africa"></i>
                    <span>Country not found</span>
                </div>
            `;

            return;

        }


        filtered.forEach(country => {

            const item =
                document.createElement("button");

            item.type = "button";

            item.className =
                "country-item";


            item.innerHTML = `

                <span class="country-item-flag">
                    ${country[0]}
                </span>

                <span class="country-item-name">
                    ${country[1]}
                </span>

                <span class="country-item-code">
                    ${country[2]}
                </span>

            `;


            item.addEventListener(
                "click",
                () => {

                    selectCountry(country);

                }
            );


            countryList.appendChild(item);

        });

    }


    /* =====================================================
       SELECT COUNTRY
    ===================================================== */

    function selectCountry(country) {

        selectedCountry = {

            flag: country[0],
            name: country[1],
            code: country[2]

        };


        updateCountryUI();


        closeCountryModal();


        countrySearch.value = "";

        renderCountries();


        phoneInput.focus();


        countrySelector.classList.add(
            "country-selected"
        );


        setTimeout(() => {

            countrySelector.classList.remove(
                "country-selected"
            );

        }, 600);

    }


    /* =====================================================
       OPEN COUNTRY MODAL
    ===================================================== */

    function openCountryModal() {

        if (countryModal) {

            countryModal.classList.add("show");

        }

        if (countryOverlay) {

            countryOverlay.classList.add("show");

        }

        countrySearch.value = "";

        renderCountries();

        setTimeout(() => {

            countrySearch.focus();

        }, 150);

    }


    /* =====================================================
       CLOSE COUNTRY MODAL
    ===================================================== */

    function closeCountryModal() {

        if (countryModal) {

            countryModal.classList.remove("show");

        }

        if (countryOverlay) {

            countryOverlay.classList.remove("show");

        }

    }


    /* =====================================================
       COUNTRY EVENTS
    ===================================================== */

    countrySelector.addEventListener(
        "click",
        openCountryModal
    );


    if (closeCountry) {

        closeCountry.addEventListener(
            "click",
            closeCountryModal
        );

    }


    if (countryOverlay) {

        countryOverlay.addEventListener(
            "click",
            closeCountryModal
        );

    }


    countrySearch.addEventListener(
        "input",
        () => {

            renderCountries(
                countrySearch.value
            );

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeCountryModal();

            }

        }
    );


    /* =====================================================
       PHONE FORMATTING
    ===================================================== */

    phoneInput.addEventListener(
        "input",
        () => {

            let value =
                phoneInput.value
                    .replace(/\D/g, "");


            value =
                value.substring(0, 15);


            const groups =
                value.match(/.{1,3}/g);


            phoneInput.value =
                groups
                    ? groups.join(" ")
                    : "";


            hidePhoneError();

        }
    );


    /* =====================================================
       CLEAN PHONE
    ===================================================== */

    function getCleanPhone() {

        return phoneInput.value
            .replace(/\D/g, "");

    }


    /* =====================================================
       FULL PHONE E.164
    ===================================================== */

    function getFullPhone() {

        return (
            selectedCountry.code +
            getCleanPhone()
        );

    }


    /* =====================================================
       VALIDATE PHONE
    ===================================================== */

    function validatePhone() {

        const phone =
            getCleanPhone();


        if (!phone.length) {

            showPhoneError(
                "Please enter your phone number."
            );

            return false;

        }


        if (phone.length < 6) {

            showPhoneError(
                "Phone number is too short."
            );

            return false;

        }


        if (phone.length > 15) {

            showPhoneError(
                "Phone number is too long."
            );

            return false;

        }


        return true;

    }


    /* =====================================================
       PHONE ERROR
    ===================================================== */

    function showPhoneError(message) {

        if (!phoneError) return;


        const text =
            phoneError.querySelector("span");


        if (text) {

            text.textContent = message;

        }


        phoneError.classList.add("show");


        phoneInput.classList.add(
            "input-error"
        );

    }


    function hidePhoneError() {

        if (!phoneError) return;


        phoneError.classList.remove(
            "show"
        );


        phoneInput.classList.remove(
            "input-error"
        );

    }


    /* =====================================================
       LOCAL STORAGE
    ===================================================== */

    function getRegisteredUsers() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "chapcyRegisteredUsers"
                )
            ) || [];

        } catch {

            return [];

        }

    }


    /* =====================================================
       SAVE REGISTRATION
    ===================================================== */

    function saveRegistration(phone, user = null) {

        const users =
            getRegisteredUsers();


        const index =
            users.findIndex(
                item =>
                    item.phone === phone
            );


        const data = {

            phone: phone,

            country:
                selectedCountry.name,

            countryCode:
                selectedCountry.code,

            flag:
                selectedCountry.flag,

            uid:
                user
                    ? user.uid
                    : null,

            registeredAt:
                new Date().toISOString()

        };


        if (index >= 0) {

            users[index] = {
                ...users[index],
                ...data
            };

        } else {

            users.push(data);

        }


        localStorage.setItem(
            "chapcyRegisteredUsers",
            JSON.stringify(users)
        );

    }


    /* =====================================================
       CONTINUE LOADING
    ===================================================== */

    function startLoading() {

        continueBtn.disabled = true;


        if (continueText) {

            continueText.style.display =
                "none";

        }


        if (continueArrow) {

            continueArrow.style.display =
                "none";

        }


        if (continueLoader) {

            continueLoader.classList.add(
                "show"
            );

        }


        continueBtn.classList.add(
            "loading"
        );

    }


    function stopLoading() {

        continueBtn.disabled = false;


        if (continueText) {

            continueText.style.display =
                "";

        }


        if (continueArrow) {

            continueArrow.style.display =
                "";

        }


        if (continueLoader) {

            continueLoader.classList.remove(
                "show"
            );

        }


        continueBtn.classList.remove(
            "loading"
        );

    }


    /* =====================================================
       RECAPTCHA
    ===================================================== */

    async function setupRecaptcha() {

        if (recaptchaVerifier) {

            return recaptchaVerifier;

        }


        const container =
            document.getElementById(
                "recaptcha-container"
            );


        if (!container) {

            throw new Error(
                "recaptcha-container haipo kwenye HTML."
            );

        }


        recaptchaVerifier =
            new firebase.auth.RecaptchaVerifier(
                "recaptcha-container",
                {
                    size: "invisible",

                    callback: () => {

                        console.log(
                            "CHAPCY reCAPTCHA verified"
                        );

                    },

                    "expired-callback": () => {

                        console.log(
                            "CHAPCY reCAPTCHA expired"
                        );

                    }
                }
            );


        await recaptchaVerifier.render();


        return recaptchaVerifier;

    }


    /* =====================================================
       RESET RECAPTCHA
    ===================================================== */

    function resetRecaptcha() {

        try {

            if (recaptchaVerifier) {

                recaptchaVerifier.clear();

                recaptchaVerifier = null;

            }

        } catch (error) {

            console.log(
                "reCAPTCHA reset:",
                error
            );

        }

    }


    /* =====================================================
       OPEN VERIFICATION
    ===================================================== */

    function openVerification(fullPhone) {

        if (verificationNumber) {

            verificationNumber.textContent =
                fullPhone;

        }


        const registerCard =
            document.querySelector(
                ".register-card"
            );

        const brand =
            document.querySelector(
                ".brand-section"
            );

        const security =
            document.querySelector(
                ".security-note"
            );


        if (registerCard) {

            registerCard.classList.add(
                "register-hidden"
            );

        }


        if (brand) {

            brand.classList.add(
                "brand-hidden"
            );

        }


        if (security) {

            security.classList.add(
                "security-hidden"
            );

        }


        verificationSection.classList.add(
            "show"
        );


        setTimeout(() => {

            verificationSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 200);

    }


    /* =====================================================
       CONTINUE → FIREBASE SEND OTP
    ===================================================== */

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (!validatePhone()) {

                phoneInput.focus();

                return;

            }


            const fullPhone =
                getFullPhone();


            startLoading();


            try {

                console.log(
                    "CHAPCY: Sending OTP to",
                    fullPhone
                );


                const verifier =
                    await setupRecaptcha();


                confirmationResult =
                    await auth.signInWithPhoneNumber(
                        fullPhone,
                        verifier
                    );


                console.log(
                    "CHAPCY: OTP sent successfully"
                );


                localStorage.setItem(
                    "chapcyPendingPhone",
                    fullPhone
                );


                localStorage.setItem(
                    "chapcyPendingCountry",
                    selectedCountry.name
                );


                stopLoading();


                openVerification(
                    fullPhone
                );


                if (otpInputs.length > 0) {

                    setTimeout(() => {

                        otpInputs[0].focus();

                    }, 500);

                }

            } catch (error) {

                console.error(
                    "CHAPCY Firebase error:",
                    error
                );


                stopLoading();


                let message =
                    "Unable to send verification code.";


                switch (error.code) {

                    case "auth/invalid-phone-number":

                        message =
                            "Invalid phone number. Check your country code and number.";

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
                            "Security verification failed. Please try again.";

                        break;


                    case "auth/operation-not-allowed":

                        message =
                            "Phone Authentication is not enabled in Firebase.";

                        break;


                    case "auth/app-not-authorized":

                        message =
                            "This website is not authorized in Firebase.";

                        break;


                    case "auth/invalid-app-credential":

                        message =
                            "Firebase security verification failed. Check your authorized domain.";

                        break;


                    default:

                        if (error.message) {

                            message =
                                error.message;

                        }

                }


                showPhoneError(message);


                resetRecaptcha();

            }

        }
    );


    /* =====================================================
       OTP INPUT SYSTEM
    ===================================================== */

    otpInputs.forEach(
        (input, index) => {

            input.addEventListener(
                "input",
                event => {

                    let value =
                        event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 1);


                    event.target.value =
                        value;


                    input.classList.remove(
                        "otp-error"
                    );


                    if (
                        value &&
                        index <
                        otpInputs.length - 1
                    ) {

                        otpInputs[index + 1]
                            .focus();

                    }

                }
            );


            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Backspace" &&
                        !input.value &&
                        index > 0
                    ) {

                        otpInputs[index - 1]
                            .focus();

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
                        .slice(
                            0,
                            otpInputs.length
                        );


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

                                }

                            }
                        );


                    const last =
                        Math.min(
                            pasted.length,
                            otpInputs.length
                        ) - 1;


                    if (last >= 0) {

                        otpInputs[last]
                            .focus();

                    }

                }
            );

        }
    );


    /* =====================================================
       GET OTP
    ===================================================== */

    function getOTP() {

        return otpInputs
            .map(
                input =>
                    input.value
            )
            .join("");

    }


    /* =====================================================
       OTP ERROR
    ===================================================== */

    function showOTPError() {

        otpInputs.forEach(
            input => {

                input.classList.add(
                    "otp-error"
                );

            }
        );


        setTimeout(() => {

            otpInputs.forEach(
                input => {

                    input.classList.remove(
                        "otp-error"
                    );

                }
            );

        }, 800);

    }


    /* =====================================================
       VERIFY OTP WITH FIREBASE
    ===================================================== */

    verifyBtn.addEventListener(
        "click",
        async () => {

            const otp =
                getOTP();


            if (otp.length !== 6) {

                showOTPError();

                return;

            }


            if (!confirmationResult) {

                alert(
                    "Verification session expired. Please request a new code."
                );

                return;

            }


            verifyBtn.disabled = true;


            verifyBtn.classList.add(
                "verifying"
            );


            verifyBtn.innerHTML = `
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                Verifying...
            `;


            try {

                console.log(
                    "CHAPCY: Verifying OTP"
                );


                const result =
                    await confirmationResult.confirm(
                        otp
                    );


                const user =
                    result.user;


                console.log(
                    "CHAPCY Firebase User:",
                    user
                );


                const phone =
                    user.phoneNumber;


                const uid =
                    user.uid;


                /* ---------------------------------
                   SAVE USER SESSION
                --------------------------------- */

                localStorage.setItem(
                    "chapcyPhoneVerified",
                    "true"
                );


                localStorage.setItem(
                    "chapcyCurrentPhone",
                    phone
                );


                localStorage.setItem(
                    "chapcyUID",
                    uid
                );


                localStorage.setItem(
                    "chapcyUserCountry",
                    selectedCountry.name
                );


                /* ---------------------------------
                   SAVE REGISTRATION
                --------------------------------- */

                saveRegistration(
                    phone,
                    user
                );


                /* ---------------------------------
                   SUCCESS
                --------------------------------- */

                showSuccess();

            } catch (error) {

                console.error(
                    "CHAPCY OTP Error:",
                    error
                );


                verifyBtn.disabled = false;


                verifyBtn.classList.remove(
                    "verifying"
                );


                verifyBtn.innerHTML = `
                    Verify
                    <i class="fa-solid fa-check"></i>
                `;


                let message =
                    "Incorrect verification code.";


                if (
                    error.code ===
                    "auth/invalid-verification-code"
                ) {

                    message =
                        "Incorrect OTP. Please check the code and try again.";

                }


                if (
                    error.code ===
                    "auth/code-expired"
                ) {

                    message =
                        "This OTP has expired. Please request a new code.";

                }


                if (
                    error.code ===
                    "auth/session-expired"
                ) {

                    message =
                        "Verification session expired. Please request a new code.";

                }


                alert(message);


                showOTPError();

            }

        }
    );


    /* =====================================================
       SUCCESS
    ===================================================== */

    function showSuccess() {

        verificationSection.classList.remove(
            "show"
        );


        successSection.classList.add(
            "show"
        );


        createCelebration();


        setTimeout(() => {

            successSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 150);

    }


    /* =====================================================
       CELEBRATION
    ===================================================== */

    function createCelebration() {

        const container =
            document.createElement("div");


        container.className =
            "celebration-container";


        for (
            let i = 0;
            i < 50;
            i++
        ) {

            const particle =
                document.createElement("span");


            particle.className =
                "celebration-particle";


            particle.style.setProperty(
                "--x",
                `${(Math.random() - 0.5) * 600}px`
            );


            particle.style.setProperty(
                "--y",
                `${(Math.random() - 0.5) * 600}px`
            );


            particle.style.setProperty(
                "--delay",
                `${Math.random() * 0.5}s`
            );


            container.appendChild(
                particle
            );

        }


        document.body.appendChild(
            container
        );


        setTimeout(() => {

            container.remove();

        }, 3000);

    }


    /* =====================================================
       RESEND OTP
    ===================================================== */

    resendBtn.addEventListener(
        "click",
        async () => {

            if (resendCooldown) {

                return;

            }


            const fullPhone =
                localStorage.getItem(
                    "chapcyPendingPhone"
                );


            if (!fullPhone) {

                alert(
                    "Phone number not found. Please start again."
                );

                return;

            }


            resendCooldown = true;

            resendBtn.disabled = true;


            try {

                resetRecaptcha();


                const verifier =
                    await setupRecaptcha();


                confirmationResult =
                    await auth.signInWithPhoneNumber(
                        fullPhone,
                        verifier
                    );


                console.log(
                    "CHAPCY: New OTP sent"
                );


                let seconds = 30;


                resendBtn.textContent =
                    `Resend (${seconds})`;


                const timer =
                    setInterval(() => {

                        seconds--;


                        resendBtn.textContent =
                            `Resend (${seconds})`;


                        if (
                            seconds <= 0
                        ) {

                            clearInterval(timer);


                            resendCooldown =
                                false;


                            resendBtn.disabled =
                                false;


                            resendBtn.textContent =
                                "Resend";

                        }

                    }, 1000);

            } catch (error) {

                console.error(
                    "Resend OTP error:",
                    error
                );


                resendCooldown =
                    false;


                resendBtn.disabled =
                    false;


                resendBtn.textContent =
                    "Resend";


                alert(
                    "Unable to resend OTP. Please try again."
                );


                resetRecaptcha();

            }

        }
    );


    /* =====================================================
       ENTER CHAPCY
    ===================================================== */

    enterChapcyBtn.addEventListener(
        "click",
        () => {

            enterChapcyBtn.classList.add(
                "entering"
            );


            setTimeout(() => {

                /*
                 * MAIN CHAT PAGE
                 */

                window.location.href =
                    "My chat.html";

            }, 900);

        }
    );


    /* =====================================================
       LOGO INTERACTION
    ===================================================== */

    const logo =
        document.querySelector(
            ".chapcy-logo"
        );


    if (logo) {

        logo.addEventListener(
            "click",
            () => {

                logo.classList.add(
                    "logo-burst"
                );


                setTimeout(() => {

                    logo.classList.remove(
                        "logo-burst"
                    );

                }, 800);

            }
        );

    }


    /* =====================================================
       PHONE FOCUS EFFECT
    ===================================================== */

    const phoneWrapper =
        document.querySelector(
            ".phone-input-wrapper"
        );


    phoneInput.addEventListener(
        "focus",
        () => {

            if (phoneWrapper) {

                phoneWrapper.classList.add(
                    "phone-focused"
                );

            }

        }
    );


    phoneInput.addEventListener(
        "blur",
        () => {

            if (phoneWrapper) {

                phoneWrapper.classList.remove(
                    "phone-focused"
                );

            }

        }
    );


    /* =====================================================
       AUTO DETECT +255
    ===================================================== */

    updateCountryUI();


    /* =====================================================
       INITIAL COUNTRY LIST
    ===================================================== */

    renderCountries();


    /* =====================================================
       PAGE READY
    ===================================================== */

    document.body.classList.add(
        "chapcy-page-ready"
    );


    /* =====================================================
       BEFORE UNLOAD
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            continueBtn.disabled =
                false;

        }
    );


    /* =====================================================
       FIREBASE AUTH STATE
    ===================================================== */

    auth.onAuthStateChanged(
        user => {

            if (user) {

                console.log(
                    "CHAPCY Firebase Auth:",
                    user.phoneNumber
                );

            } else {

                console.log(
                    "CHAPCY Firebase Auth: No user"
                );

            }

        }
    );


    /* =====================================================
       READY
    ===================================================== */

    console.log(
        "🌍 CHAPCY Registration + Firebase OTP Ready"
    );

});
