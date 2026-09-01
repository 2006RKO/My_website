/* =========================================================
   CHAPCY REGISTER.JS
   WORLDWIDE PHONE REGISTRATION
   PREMIUM ANIMATION + COUNTRY SYSTEM
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const form = document.getElementById("registerForm");

    const countrySelector =
        document.getElementById("countrySelector");

    /* HTML yako inatumia countryModal */
    const countryDropdown =
        document.getElementById("countryModal");

    const countryOverlay =
        document.getElementById("countryOverlay");

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


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (!form) {
        console.error("CHAPCY: registerForm not found.");
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
       COUNTRY MODAL HELPERS
    ===================================================== */

    function openCountryModal() {

        if (!countryDropdown) return;

        countryDropdown.classList.add("show");

        if (countryOverlay) {
            countryOverlay.classList.add("show");
        }

        document.body.classList.add("country-open");

        setTimeout(() => {

            if (countrySearch) {
                countrySearch.focus();
            }

        }, 100);

    }


    function closeCountryModal() {

        if (!countryDropdown) return;

        countryDropdown.classList.remove("show");

        if (countryOverlay) {
            countryOverlay.classList.remove("show");
        }

        document.body.classList.remove("country-open");

    }


    /* =====================================================
       BUILD COUNTRY LIST
    ===================================================== */

    function renderCountries(search = "") {

        if (!countryList) return;

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


            item.addEventListener("click", () => {

                selectCountry(country);

            });


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


        if (countryFlag) {
            countryFlag.textContent =
                country[0];
        }


        if (countryCode) {
            countryCode.textContent =
                country[2];
        }


        closeCountryModal();


        if (countrySearch) {
            countrySearch.value = "";
        }


        renderCountries();


        if (phoneInput) {
            phoneInput.focus();
        }


        if (countrySelector) {

            countrySelector.classList.add(
                "country-selected"
            );


            setTimeout(() => {

                countrySelector.classList.remove(
                    "country-selected"
                );

            }, 600);

        }

    }


    /* =====================================================
       COUNTRY EVENTS
    ===================================================== */

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
            closeCountryModal
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

    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            () => {

                let value =
                    phoneInput.value
                        .replace(/\D/g, "");


                value =
                    value.substring(0, 15);


                const formatted =
                    value.match(/.{1,3}/g);


                phoneInput.value =
                    formatted
                        ? formatted.join(" ")
                        : "";


                hidePhoneError();

            }
        );

    }


    /* =====================================================
       PHONE FUNCTIONS
    ===================================================== */

    function getCleanPhone() {

        if (!phoneInput) return "";

        return phoneInput.value
            .replace(/\D/g, "");

    }


    function getFullPhone() {

        return (
            selectedCountry.code +
            getCleanPhone()
        );

    }


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


    function showPhoneError(message) {

        if (!phoneError) return;

        const text =
            phoneError.querySelector("span");


        if (text) {
            text.textContent = message;
        }


        phoneError.classList.add("show");


        if (phoneInput) {

            phoneInput.classList.add(
                "input-error"
            );

        }

    }


    function hidePhoneError() {

        if (!phoneError) return;

        phoneError.classList.remove("show");


        if (phoneInput) {

            phoneInput.classList.remove(
                "input-error"
            );

        }

    }


    /* =====================================================
       LOCAL REGISTRATION STORAGE
    ===================================================== */

    function getRegisteredUsers() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "chapcyRegisteredUsers"
                )
            ) || [];

        } catch (error) {

            console.warn(
                "CHAPCY: Could not read registered users.",
                error
            );

            return [];

        }

    }


    function saveRegistration(phone) {

        const users =
            getRegisteredUsers();


        const exists =
            users.some(
                user =>
                    user.phone === phone
            );


        if (!exists) {

            users.push({

                phone: phone,

                country:
                    selectedCountry.name,

                countryCode:
                    selectedCountry.code,

                flag:
                    selectedCountry.flag,

                registeredAt:
                    new Date().toISOString(),

                verified: false

            });


            localStorage.setItem(
                "chapcyRegisteredUsers",
                JSON.stringify(users)
            );

        }

    }


    /* =====================================================
       MARK USER VERIFIED
    ===================================================== */

    function markCurrentUserVerified(phone) {

        const users =
            getRegisteredUsers();


        const updatedUsers =
            users.map(user => {

                if (user.phone === phone) {

                    return {
                        ...user,
                        verified: true,
                        verifiedAt:
                            new Date().toISOString()
                    };

                }

                return user;

            });


        localStorage.setItem(
            "chapcyRegisteredUsers",
            JSON.stringify(updatedUsers)
        );

    }


    /* =====================================================
       CONTINUE LOADING
    ===================================================== */

    function startLoading() {

        if (continueBtn) {
            continueBtn.disabled = true;

            continueBtn.classList.add(
                "loading"
            );
        }


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

    }


    function stopLoading() {

        if (continueBtn) {

            continueBtn.disabled = false;

            continueBtn.classList.remove(
                "loading"
            );

        }


        if (continueText) {
            continueText.style.display = "";
        }


        if (continueArrow) {
            continueArrow.style.display = "";
        }


        if (continueLoader) {

            continueLoader.classList.remove(
                "show"
            );

        }

    }


    /* =====================================================
       OPEN VERIFICATION
    ===================================================== */

    function openVerification(fullPhone) {

        if (verificationNumber) {

            verificationNumber.textContent =
                formatInternationalNumber(
                    fullPhone
                );

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


        if (verificationSection) {

            verificationSection.classList.add(
                "show"
            );

        }


        clearOTP();


        setTimeout(() => {

            if (verificationSection) {

                verificationSection.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        }, 200);

    }


    /* =====================================================
       FORMAT PHONE
    ===================================================== */

    function formatInternationalNumber(number) {

        const clean =
            String(number)
                .replace(/\D/g, "");


        return (
            selectedCountry.code +
            " " +
            getCleanPhone()
        );

    }


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (!validatePhone()) {

                if (phoneInput) {
                    phoneInput.focus();
                }

                return;

            }


            const fullPhone =
                getFullPhone();


            saveRegistration(fullPhone);


            startLoading();


            /*
             * DEMO PROCESSING
             *
             * Firebase Phone Authentication
             * will replace this later.
             */

            setTimeout(() => {

                stopLoading();

                openVerification(
                    fullPhone
                );

            }, 1800);

        }
    );


    /* =====================================================
       OTP SYSTEM
    ===================================================== */

    const otpInputs =
        Array.from(
            document.querySelectorAll(
                ".otp-input"
            )
        );


    function clearOTP() {

        otpInputs.forEach(
            input => {
                input.value = "";
                input.classList.remove(
                    "otp-error"
                );
            }
        );


        if (otpInputs[0]) {
            otpInputs[0].focus();
        }

    }


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


                    if (
                        value &&
                        index <
                        otpInputs.length - 1
                    ) {

                        otpInputs[
                            index + 1
                        ].focus();

                    }

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

                        otpInputs[
                            index - 1
                        ].focus();

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

        }, 700);

    }


    /* =====================================================
       VERIFY BUTTON
    ===================================================== */

    if (verifyBtn) {

        verifyBtn.addEventListener(
            "click",
            () => {

                const otp =
                    getOTP();


                if (otp.length !== 6) {

                    showOTPError();

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


                /*
                 * DEMO VERIFICATION
                 *
                 * Any 6 digits currently pass.
                 * This will later be replaced by
                 * Firebase Phone Authentication.
                 */

                setTimeout(() => {

                    showSuccess();

                }, 1800);

            }
        );

    }


    /* =====================================================
       SUCCESS
    ===================================================== */

    function showSuccess() {

        if (verificationSection) {

            verificationSection.classList.remove(
                "show"
            );

        }


        if (successSection) {

            successSection.classList.add(
                "show"
            );

        }


        const currentPhone =
            getFullPhone();


        markCurrentUserVerified(
            currentPhone
        );


        localStorage.setItem(
            "chapcyPhoneVerified",
            "true"
        );


        localStorage.setItem(
            "chapcyCurrentPhone",
            currentPhone
        );


        createCelebration();


        setTimeout(() => {

            if (successSection) {

                successSection.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

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
            i < 40;
            i++
        ) {

            const particle =
                document.createElement("span");


            particle.className =
                "celebration-particle";


            particle.style.setProperty(
                "--x",
                `${(Math.random() - 0.5) * 500}px`
            );


            particle.style.setProperty(
                "--y",
                `${(Math.random() - 0.5) * 500}px`
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

        }, 2500);

    }


    /* =====================================================
       RESEND
    ===================================================== */

    let resendCooldown = false;


    if (resendBtn) {

        resendBtn.addEventListener(
            "click",
            () => {

                if (resendCooldown) return;


                resendCooldown = true;


                let seconds = 30;


                resendBtn.disabled =
                    true;


                resendBtn.textContent =
                    `Resend (${seconds})`;


                const timer =
                    setInterval(() => {

                        seconds--;


                        resendBtn.textContent =
                            `Resend (${seconds})`;


                        if (seconds <= 0) {

                            clearInterval(
                                timer
                            );


                            resendCooldown =
                                false;


                            resendBtn.disabled =
                                false;


                            resendBtn.textContent =
                                "Resend";

                        }

                    }, 1000);

            }
        );

    }


    /* =====================================================
       ENTER CHAPCY
    ===================================================== */

    if (enterChapcyBtn) {

        enterChapcyBtn.addEventListener(
            "click",
            () => {

                enterChapcyBtn.classList.add(
                    "entering"
                );


                setTimeout(() => {

                    /*
                     * YOUR MAIN PAGE
                     */

                    window.location.href =
                        "My Chat.html";

                }, 900);

            }
        );

    }


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

    if (phoneInput) {

        phoneInput.addEventListener(
            "focus",
            () => {

                const wrapper =
                    document.querySelector(
                        ".phone-input-wrapper"
                    );


                if (wrapper) {

                    wrapper.classList.add(
                        "phone-focused"
                    );

                }

            }
        );


        phoneInput.addEventListener(
            "blur",
            () => {

                const wrapper =
                    document.querySelector(
                        ".phone-input-wrapper"
                    );


                if (wrapper) {

                    wrapper.classList.remove(
                        "phone-focused"
                    );

                }

            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    renderCountries();


    if (countryFlag) {

        countryFlag.textContent =
            selectedCountry.flag;

    }


    if (countryCode) {

        countryCode.textContent =
            selectedCountry.code;

    }


    document.body.classList.add(
        "chapcy-page-ready"
    );


    /* =====================================================
       PREVENT DOUBLE SUBMIT
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            if (continueBtn) {

                continueBtn.disabled =
                    false;

            }

        }
    );


    /* =====================================================
       READY
    ===================================================== */

    console.log(
        "🌍 CHAPCY Registration System Ready"
    );

});
