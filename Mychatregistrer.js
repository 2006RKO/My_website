/* =========================================================
   CHAPCY REGISTER.JS
   WORLDWIDE PHONE REGISTRATION
   PREMIUM ANIMATION + COUNTRY SYSTEM
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const form =
        document.getElementById("registerForm");

    const countrySelector =
        document.getElementById("countrySelector");

    const countryDropdown =
        document.getElementById("countryDropdown");

    const countryOverlay =
        document.getElementById("countryOverlay");

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
       BUILD COUNTRY LIST
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

            item.className = "country-item";


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


        countryFlag.textContent =
            country[0];

        countryCode.textContent =
            country[2];


        countryDropdown.classList.remove("show");

        countryOverlay.classList.remove("show");


        countrySearch.value = "";


        renderCountries();


        phoneInput.focus();


        /* animation */

        countrySelector.classList.add("country-selected");

        setTimeout(() => {

            countrySelector.classList.remove(
                "country-selected"
            );

        }, 600);

    }


    /* =====================================================
       OPEN COUNTRY DROPDOWN
    ===================================================== */

    countrySelector.addEventListener("click", () => {

        countryDropdown.classList.toggle("show");

        countryOverlay.classList.toggle(
            "show",
            countryDropdown.classList.contains("show")
        );


        if (
            countryDropdown.classList.contains("show")
        ) {

            countrySearch.focus();

        }

    });


    /* =====================================================
       CLOSE DROPDOWN
    ===================================================== */

    countryOverlay.addEventListener("click", () => {

        countryDropdown.classList.remove("show");

        countryOverlay.classList.remove("show");

    });


    /* =====================================================
       SEARCH COUNTRY
    ===================================================== */

    countrySearch.addEventListener("input", () => {

        renderCountries(
            countrySearch.value
        );

    });


    /* =====================================================
       ESC CLOSE
    ===================================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            countryDropdown.classList.remove("show");

            countryOverlay.classList.remove("show");

        }

    });


    /* =====================================================
       PHONE FORMATTING
    ===================================================== */

    phoneInput.addEventListener("input", () => {

        let value =
            phoneInput.value.replace(/\D/g, "");


        /*
         * Limit local number.
         */

        value =
            value.substring(0, 15);


        /*
         * Pretty spacing
         */

        let formatted =
            value.match(/.{1,3}/g);


        phoneInput.value =
            formatted
                ? formatted.join(" ")
                : "";


        hidePhoneError();

    });


    /* =====================================================
       PHONE VALIDATION
    ===================================================== */

    function getCleanPhone() {

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


        /*
         * Basic worldwide validation.
         * Country-specific validation can later
         * be upgraded using libphonenumber.
         */

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

        phoneInput.classList.add("input-error");

    }


    function hidePhoneError() {

        if (!phoneError) return;

        phoneError.classList.remove("show");

        phoneInput.classList.remove(
            "input-error"
        );

    }


    /* =====================================================
       REGISTER STORAGE
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


    function saveRegistration(phone) {

        const users =
            getRegisteredUsers();


        /*
         * Prevent duplicate registration.
         */

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
                    new Date().toISOString()

            });


            localStorage.setItem(
                "chapcyRegisteredUsers",
                JSON.stringify(users)
            );

        }

    }


    /* =====================================================
       CONTINUE BUTTON ANIMATION
    ===================================================== */

    function startLoading() {

        continueBtn.disabled = true;

        continueText.style.display = "none";

        continueArrow.style.display = "none";

        continueLoader.classList.add("show");

        continueBtn.classList.add(
            "loading"
        );

    }


    function stopLoading() {

        continueBtn.disabled = false;

        continueText.style.display = "";

        continueArrow.style.display = "";

        continueLoader.classList.remove("show");

        continueBtn.classList.remove(
            "loading"
        );

    }


    /* =====================================================
       OPEN VERIFICATION
    ===================================================== */

    function openVerification(fullPhone) {

        verificationNumber.textContent =
            formatInternationalNumber(
                fullPhone
            );


        /*
         * Hide registration card
         */

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


        /*
         * Show verification
         */

        verificationSection.classList.add(
            "show"
        );


        /*
         * Scroll to verification
         */

        setTimeout(() => {

            verificationSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 200);

    }


    /* =====================================================
       FORMAT INTERNATIONAL NUMBER
    ===================================================== */

    function formatInternationalNumber(number) {

        const code =
            selectedCountry.code;

        const local =
            getCleanPhone();


        return `${code} ${local}`;

    }


    /* =====================================================
       REGISTER SUBMIT
    ===================================================== */

    form.addEventListener("submit", event => {

        event.preventDefault();


        if (!validatePhone()) {

            phoneInput.focus();

            return;

        }


        const fullPhone =
            getFullPhone();


        /*
         * Save locally.
         */

        saveRegistration(fullPhone);


        /*
         * Button animation.
         */

        startLoading();


        /*
         * Simulated secure processing.
         */

        setTimeout(() => {

            stopLoading();

            openVerification(
                fullPhone
            );

        }, 1800);

    });


    /* =====================================================
       OTP SYSTEM
    ===================================================== */

    const otpInputs =
        Array.from(
            document.querySelectorAll(
                ".otp-input"
            )
        );


    otpInputs.forEach((input, index) => {


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

                    otpInputs[index + 1]
                        .focus();

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


                pasted.split("").forEach(
                    (digit, i) => {

                        if (
                            otpInputs[i]
                        ) {

                            otpInputs[i]
                                .value = digit;

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

    });


    /* =====================================================
       GET OTP
    ===================================================== */

    function getOTP() {

        return otpInputs
            .map(input => input.value)
            .join("");

    }


    /* =====================================================
       VERIFY BUTTON
    ===================================================== */

    verifyBtn.addEventListener(
        "click",
        () => {

            const otp =
                getOTP();


            if (otp.length !== 6) {

                otpInputs.forEach(input => {

                    input.classList.add(
                        "otp-error"
                    );

                });


                setTimeout(() => {

                    otpInputs.forEach(input => {

                        input.classList.remove(
                            "otp-error"
                        );

                    });

                }, 700);


                return;

            }


            /*
             * Loading animation
             */

            verifyBtn.disabled = true;

            verifyBtn.classList.add(
                "verifying"
            );

            verifyBtn.innerHTML = `
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                Verifying...
            `;


            /*
             * Demo verification.
             *
             * Later this part will connect
             * to Firebase Phone Authentication.
             */

            setTimeout(() => {

                showSuccess();

            }, 1800);

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


        /*
         * Mark user as verified.
         */

        localStorage.setItem(
            "chapcyPhoneVerified",
            "true"
        );


        localStorage.setItem(
            "chapcyCurrentPhone",
            getFullPhone()
        );


        /*
         * Celebration particles
         */

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


    resendBtn.addEventListener(
        "click",
        () => {

            if (resendCooldown) return;


            resendCooldown = true;

            let seconds = 30;


            resendBtn.disabled = true;

            resendBtn.textContent =
                `Resend (${seconds})`;


            const timer =
                setInterval(() => {

                    seconds--;


                    resendBtn.textContent =
                        `Resend (${seconds})`;


                    if (seconds <= 0) {

                        clearInterval(timer);

                        resendCooldown = false;

                        resendBtn.disabled =
                            false;

                        resendBtn.textContent =
                            "Resend";

                    }

                }, 1000);

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


            /*
             * Change this filename if your
             * main CHAPCY page has another name.
             */

            setTimeout(() => {

                window.location.href =
                    "index.html";

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


    /* =====================================================
       INITIALIZE COUNTRIES
    ===================================================== */

    renderCountries();


    /* =====================================================
       INITIAL PHONE STATE
    ===================================================== */

    countryFlag.textContent =
        selectedCountry.flag;

    countryCode.textContent =
        selectedCountry.code;


    /* =====================================================
       PAGE READY ANIMATION
    ===================================================== */

    document.body.classList.add(
        "chapcy-page-ready"
    );


    /* =====================================================
       PREVENT DOUBLE SUBMIT
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            continueBtn.disabled = false;

        }
    );


    console.log(
        "🌍 CHAPCY Registration System Ready"
    );

});
