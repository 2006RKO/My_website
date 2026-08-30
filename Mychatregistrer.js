/* =========================================================
   CHAPCY WORLDWIDE REGISTER JS
   PHONE + COUNTRY + OTP + ANIMATIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const registerForm =
        document.getElementById("registerForm");

    const countrySelector =
        document.getElementById("countrySelector");

    const countryDropdown =
        document.getElementById("countryDropdown");

    const countrySearch =
        document.getElementById("countrySearch");

    const countryList =
        document.getElementById("countryList");

    const countryFlag =
        document.getElementById("countryFlag");

    const countryCode =
        document.getElementById("countryCode");

    const phoneNumber =
        document.getElementById("phoneNumber");

    const phoneError =
        document.getElementById("phoneError");

    const continueBtn =
        document.getElementById("continueBtn");

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

    const countryOverlay =
        document.getElementById("countryOverlay");

    const otpInputs =
        document.querySelectorAll(".otp-input");


    /* =====================================================
       WORLD COUNTRIES
    ===================================================== */

    const countries = [

        ["🇦🇫", "Afghanistan", "+93"],
        ["🇦🇱", "Albania", "+355"],
        ["🇩🇿", "Algeria", "+213"],
        ["🇦🇩", "Andorra", "+376"],
        ["🇦🇴", "Angola", "+244"],
        ["🇦🇬", "Antigua and Barbuda", "+1"],
        ["🇦🇷", "Argentina", "+54"],
        ["🇦🇲", "Armenia", "+374"],
        ["🇦🇺", "Australia", "+61"],
        ["🇦🇹", "Austria", "+43"],
        ["🇦🇿", "Azerbaijan", "+994"],

        ["🇧🇸", "Bahamas", "+1"],
        ["🇧🇭", "Bahrain", "+973"],
        ["🇧🇩", "Bangladesh", "+880"],
        ["🇧🇧", "Barbados", "+1"],
        ["🇧🇾", "Belarus", "+375"],
        ["🇧🇪", "Belgium", "+32"],
        ["🇧🇿", "Belize", "+501"],
        ["🇧🇯", "Benin", "+229"],
        ["🇧🇹", "Bhutan", "+975"],
        ["🇧🇴", "Bolivia", "+591"],
        ["🇧🇦", "Bosnia and Herzegovina", "+387"],
        ["🇧🇼", "Botswana", "+267"],
        ["🇧🇷", "Brazil", "+55"],
        ["🇧🇳", "Brunei", "+673"],
        ["🇧🇬", "Bulgaria", "+359"],
        ["🇧🇫", "Burkina Faso", "+226"],
        ["🇧🇮", "Burundi", "+257"],

        ["🇨🇻", "Cabo Verde", "+238"],
        ["🇰🇭", "Cambodia", "+855"],
        ["🇨🇲", "Cameroon", "+237"],
        ["🇨🇦", "Canada", "+1"],
        ["🇨🇫", "Central African Republic", "+236"],
        ["🇹🇩", "Chad", "+235"],
        ["🇨🇱", "Chile", "+56"],
        ["🇨🇳", "China", "+86"],
        ["🇨🇴", "Colombia", "+57"],
        ["🇰🇲", "Comoros", "+269"],
        ["🇨🇬", "Congo", "+242"],
        ["🇨🇩", "DR Congo", "+243"],
        ["🇨🇷", "Costa Rica", "+506"],
        ["🇭🇷", "Croatia", "+385"],
        ["🇨🇺", "Cuba", "+53"],
        ["🇨🇾", "Cyprus", "+357"],
        ["🇨🇿", "Czech Republic", "+420"],

        ["🇩🇰", "Denmark", "+45"],
        ["🇩🇯", "Djibouti", "+253"],
        ["🇩🇲", "Dominica", "+1"],
        ["🇩🇴", "Dominican Republic", "+1"],

        ["🇪🇨", "Ecuador", "+593"],
        ["🇪🇬", "Egypt", "+20"],
        ["🇸🇻", "El Salvador", "+503"],
        ["🇬🇶", "Equatorial Guinea", "+240"],
        ["🇪🇷", "Eritrea", "+291"],
        ["🇪🇪", "Estonia", "+372"],
        ["🇸🇿", "Eswatini", "+268"],
        ["🇪🇹", "Ethiopia", "+251"],

        ["🇫🇯", "Fiji", "+679"],
        ["🇫🇮", "Finland", "+358"],
        ["🇫🇷", "France", "+33"],

        ["🇬🇦", "Gabon", "+241"],
        ["🇬🇲", "Gambia", "+220"],
        ["🇬🇪", "Georgia", "+995"],
        ["🇩🇪", "Germany", "+49"],
        ["🇬🇭", "Ghana", "+233"],
        ["🇬🇷", "Greece", "+30"],
        ["🇬🇩", "Grenada", "+1"],
        ["🇬🇹", "Guatemala", "+502"],
        ["🇬🇳", "Guinea", "+224"],
        ["🇬🇼", "Guinea-Bissau", "+245"],
        ["🇬🇾", "Guyana", "+592"],

        ["🇭🇹", "Haiti", "+509"],
        ["🇭🇳", "Honduras", "+504"],
        ["🇭🇺", "Hungary", "+36"],

        ["🇮🇸", "Iceland", "+354"],
        ["🇮🇳", "India", "+91"],
        ["🇮🇩", "Indonesia", "+62"],
        ["🇮🇷", "Iran", "+98"],
        ["🇮🇶", "Iraq", "+964"],
        ["🇮🇪", "Ireland", "+353"],
        ["🇮🇱", "Israel", "+972"],
        ["🇮🇹", "Italy", "+39"],

        ["🇯🇲", "Jamaica", "+1"],
        ["🇯🇵", "Japan", "+81"],
        ["🇯🇴", "Jordan", "+962"],

        ["🇰🇿", "Kazakhstan", "+7"],
        ["🇰🇪", "Kenya", "+254"],
        ["🇰🇮", "Kiribati", "+686"],
        ["🇰🇵", "North Korea", "+850"],
        ["🇰🇷", "South Korea", "+82"],
        ["🇰🇼", "Kuwait", "+965"],
        ["🇰🇬", "Kyrgyzstan", "+996"],

        ["🇱🇦", "Laos", "+856"],
        ["🇱🇻", "Latvia", "+371"],
        ["🇱🇧", "Lebanon", "+961"],
        ["🇱🇸", "Lesotho", "+266"],
        ["🇱🇷", "Liberia", "+231"],
        ["🇱🇾", "Libya", "+218"],
        ["🇱🇮", "Liechtenstein", "+423"],
        ["🇱🇹", "Lithuania", "+370"],
        ["🇱🇺", "Luxembourg", "+352"],

        ["🇲🇬", "Madagascar", "+261"],
        ["🇲🇼", "Malawi", "+265"],
        ["🇲🇾", "Malaysia", "+60"],
        ["🇲🇻", "Maldives", "+960"],
        ["🇲🇱", "Mali", "+223"],
        ["🇲🇹", "Malta", "+356"],
        ["🇲🇭", "Marshall Islands", "+692"],
        ["🇲🇷", "Mauritania", "+222"],
        ["🇲🇺", "Mauritius", "+230"],
        ["🇲🇽", "Mexico", "+52"],
        ["🇫🇲", "Micronesia", "+691"],
        ["🇲🇩", "Moldova", "+373"],
        ["🇲🇨", "Monaco", "+377"],
        ["🇲🇳", "Mongolia", "+976"],
        ["🇲🇪", "Montenegro", "+382"],
        ["🇲🇦", "Morocco", "+212"],
        ["🇲🇿", "Mozambique", "+258"],
        ["🇲🇲", "Myanmar", "+95"],

        ["🇳🇦", "Namibia", "+264"],
        ["🇳🇷", "Nauru", "+674"],
        ["🇳🇵", "Nepal", "+977"],
        ["🇳🇱", "Netherlands", "+31"],
        ["🇳🇿", "New Zealand", "+64"],
        ["🇳🇮", "Nicaragua", "+505"],
        ["🇳🇪", "Niger", "+227"],
        ["🇳🇬", "Nigeria", "+234"],
        ["🇲🇰", "North Macedonia", "+389"],
        ["🇳🇴", "Norway", "+47"],

        ["🇴🇲", "Oman", "+968"],

        ["🇵🇰", "Pakistan", "+92"],
        ["🇵🇼", "Palau", "+680"],
        ["🇵🇦", "Panama", "+507"],
        ["🇵🇬", "Papua New Guinea", "+675"],
        ["🇵🇾", "Paraguay", "+595"],
        ["🇵🇪", "Peru", "+51"],
        ["🇵🇭", "Philippines", "+63"],
        ["🇵🇱", "Poland", "+48"],
        ["🇵🇹", "Portugal", "+351"],

        ["🇶🇦", "Qatar", "+974"],

        ["🇷🇴", "Romania", "+40"],
        ["🇷🇺", "Russia", "+7"],
        ["🇷🇼", "Rwanda", "+250"],

        ["🇰🇳", "Saint Kitts and Nevis", "+1"],
        ["🇱🇨", "Saint Lucia", "+1"],
        ["🇻🇨", "Saint Vincent and the Grenadines", "+1"],
        ["🇼🇸", "Samoa", "+685"],
        ["🇸🇲", "San Marino", "+378"],
        ["🇸🇹", "Sao Tome and Principe", "+239"],
        ["🇸🇦", "Saudi Arabia", "+966"],
        ["🇸🇳", "Senegal", "+221"],
        ["🇷🇸", "Serbia", "+381"],
        ["🇸🇨", "Seychelles", "+248"],
        ["🇸🇱", "Sierra Leone", "+232"],
        ["🇸🇬", "Singapore", "+65"],
        ["🇸🇰", "Slovakia", "+421"],
        ["🇸🇮", "Slovenia", "+386"],
        ["🇸🇧", "Solomon Islands", "+677"],
        ["🇸🇴", "Somalia", "+252"],
        ["🇿🇦", "South Africa", "+27"],
        ["🇸🇸", "South Sudan", "+211"],
        ["🇪🇸", "Spain", "+34"],
        ["🇱🇰", "Sri Lanka", "+94"],
        ["🇸🇩", "Sudan", "+249"],
        ["🇸🇷", "Suriname", "+597"],
        ["🇸🇪", "Sweden", "+46"],
        ["🇨🇭", "Switzerland", "+41"],
        ["🇸🇾", "Syria", "+963"],

        ["🇹🇼", "Taiwan", "+886"],
        ["🇹🇯", "Tajikistan", "+992"],
        ["🇹🇿", "Tanzania", "+255"],
        ["🇹🇭", "Thailand", "+66"],
        ["🇹🇱", "Timor-Leste", "+670"],
        ["🇹🇬", "Togo", "+228"],
        ["🇹🇴", "Tonga", "+676"],
        ["🇹🇹", "Trinidad and Tobago", "+1"],
        ["🇹🇳", "Tunisia", "+216"],
        ["🇹🇷", "Turkey", "+90"],
        ["🇹🇲", "Turkmenistan", "+993"],
        ["🇹🇻", "Tuvalu", "+688"],

        ["🇺🇬", "Uganda", "+256"],
        ["🇺🇦", "Ukraine", "+380"],
        ["🇦🇪", "United Arab Emirates", "+971"],
        ["🇬🇧", "United Kingdom", "+44"],
        ["🇺🇸", "United States", "+1"],
        ["🇺🇾", "Uruguay", "+598"],
        ["🇺🇿", "Uzbekistan", "+998"],

        ["🇻🇺", "Vanuatu", "+678"],
        ["🇻🇦", "Vatican City", "+39"],
        ["🇻🇪", "Venezuela", "+58"],
        ["🇻🇳", "Vietnam", "+84"],

        ["🇾🇪", "Yemen", "+967"],

        ["🇿🇲", "Zambia", "+260"],
        ["🇿🇼", "Zimbabwe", "+263"]

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
       OTP
    ===================================================== */

    let generatedOTP = "";



    /* =====================================================
       RENDER COUNTRIES
    ===================================================== */

    function renderCountries(list = countries) {

        countryList.innerHTML = "";

        if (!list.length) {

            countryList.innerHTML = `
                <div class="no-country">
                    <i class="fa-solid fa-earth-africa"></i>
                    <p>No country found</p>
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

                selectCountry(
                    flag,
                    name,
                    code
                );

            });


            countryList.appendChild(item);

        });

    }



    /* =====================================================
       SELECT COUNTRY
    ===================================================== */

    function selectCountry(flag, name, code) {

        selectedCountry = {
            flag,
            name,
            code
        };


        countryFlag.textContent =
            flag;

        countryCode.textContent =
            code;


        phoneNumber.value = "";


        closeCountryDropdown();


        phoneNumber.focus();


        showPhoneSuccess();

    }



    /* =====================================================
       OPEN COUNTRY DROPDOWN
    ===================================================== */

    function openCountryDropdown() {

        countryDropdown.classList.add("open");

        countryOverlay.classList.add("open");

        document.body.classList.add(
            "country-open"
        );


        countrySearch.value = "";

        renderCountries();

        setTimeout(() => {

            countrySearch.focus();

        }, 150);

    }



    /* =====================================================
       CLOSE COUNTRY DROPDOWN
    ===================================================== */

    function closeCountryDropdown() {

        countryDropdown.classList.remove("open");

        countryOverlay.classList.remove("open");

        document.body.classList.remove(
            "country-open"
        );

    }



    /* =====================================================
       COUNTRY BUTTON
    ===================================================== */

    countrySelector.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            if (
                countryDropdown.classList.contains("open")
            ) {

                closeCountryDropdown();

            } else {

                openCountryDropdown();

            }

        }
    );



    /* =====================================================
       OVERLAY CLOSE
    ===================================================== */

    countryOverlay.addEventListener(
        "click",
        closeCountryDropdown
    );



    /* =====================================================
       SEARCH COUNTRIES
    ===================================================== */

    countrySearch.addEventListener(
        "input",
        () => {

            const query =
                countrySearch.value
                    .trim()
                    .toLowerCase();


            const filtered =
                countries.filter(country => {

                    const name =
                        country[1].toLowerCase();

                    const code =
                        country[2];

                    return (
                        name.includes(query) ||
                        code.includes(query)
                    );

                });


            renderCountries(filtered);

        }
    );



    /* =====================================================
       CLOSE WHEN CLICK OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        event => {

            if (
                countryDropdown.classList.contains("open") &&
                !countryDropdown.contains(event.target) &&
                !countrySelector.contains(event.target)
            ) {

                closeCountryDropdown();

            }

        }
    );



    /* =====================================================
       PHONE INPUT
    ===================================================== */

    phoneNumber.addEventListener(
        "input",
        () => {

            /* Numbers only */

            let value =
                phoneNumber.value.replace(/\D/g, "");


            /*
             * Limit to 15 digits
             */

            value =
                value.substring(0, 15);


            phoneNumber.value =
                value;


            if (value.length > 0) {

                validatePhone(false);

            } else {

                hidePhoneError();

            }

        }
    );



    /* =====================================================
       PHONE VALIDATION
    ===================================================== */

    function validatePhone(showError = true) {

        const number =
            phoneNumber.value.replace(/\D/g, "");


        /*
         * Basic international validation.
         * Country code is handled separately.
         */

        if (
            number.length >= 6 &&
            number.length <= 15
        ) {

            showPhoneSuccess();

            return true;

        }


        if (showError) {

            showPhoneError();

        }


        return false;

    }



    /* =====================================================
       PHONE ERROR
    ===================================================== */

    function showPhoneError() {

        phoneError.classList.add("show");

        phoneNumber.classList.add("invalid");

        phoneNumber.classList.remove("valid");

    }



    /* =====================================================
       PHONE SUCCESS
    ===================================================== */

    function showPhoneSuccess() {

        phoneError.classList.remove("show");

        phoneNumber.classList.remove("invalid");

        if (
            phoneNumber.value.length >= 6
        ) {

            phoneNumber.classList.add(
                "valid"
            );

        }

    }



    /* =====================================================
       HIDE ERROR
    ===================================================== */

    function hidePhoneError() {

        phoneError.classList.remove("show");

        phoneNumber.classList.remove(
            "invalid",
            "valid"
        );

    }



    /* =====================================================
       GENERATE OTP
    ===================================================== */

    function generateOTP() {

        generatedOTP =
            Math.floor(
                100000 +
                Math.random() * 900000
            ).toString();


        console.log(
            "CHAPCY TEST OTP:",
            generatedOTP
        );


        return generatedOTP;

    }



    /* =====================================================
       FORMAT PHONE
    ===================================================== */

    function getFullPhoneNumber() {

        const number =
            phoneNumber.value.replace(
                /\D/g,
                ""
            );


        return (
            selectedCountry.code +
            number
        );

    }



    /* =====================================================
       REGISTER SUBMIT
    ===================================================== */

    registerForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (
                !validatePhone(true)
            ) {

                phoneNumber.focus();

                return;

            }


            const fullNumber =
                getFullPhoneNumber();


            /*
             * Loading animation
             */

            continueBtn.classList.add(
                "loading"
            );

            continueLoader.classList.add(
                "show"
            );


            continueBtn.disabled = true;


            /*
             * Generate OTP
             */

            generateOTP();


            /*
             * Save temporary registration
             */

            localStorage.setItem(
                "chapcyRegistrationPhone",
                fullNumber
            );

            localStorage.setItem(
                "chapcyRegistrationCountry",
                selectedCountry.name
            );


            /*
             * Simulate verification request
             */

            setTimeout(() => {

                continueBtn.classList.remove(
                    "loading"
                );

                continueLoader.classList.remove(
                    "show"
                );

                continueBtn.disabled = false;


                showVerification(
                    fullNumber
                );

            }, 1400);

        }
    );



    /* =====================================================
       SHOW VERIFICATION
    ===================================================== */

    function showVerification(number) {

        /*
         * Hide register card
         */

        const registerCard =
            document.querySelector(
                ".register-card"
            );

        const securityNote =
            document.querySelector(
                ".security-note"
            );

        if (registerCard) {

            registerCard.classList.add(
                "hide-register"
            );

        }


        if (securityNote) {

            securityNote.classList.add(
                "hide-register"
            );

        }


        /*
         * Number
         */

        verificationNumber.textContent =
            number;


        /*
         * Show verification
         */

        verificationSection.classList.add(
            "show"
        );


        /*
         * Reset OTP
         */

        otpInputs.forEach(input => {

            input.value = "";

        });


        setTimeout(() => {

            if (otpInputs[0]) {

                otpInputs[0].focus();

            }

        }, 500);

    }



    /* =====================================================
       OTP INPUT
    ===================================================== */

    otpInputs.forEach(
        (input, index) => {

            input.addEventListener(
                "input",
                event => {

                    let value =
                        event.target.value
                            .replace(/\D/g, "");

                    event.target.value =
                        value.slice(0, 1);


                    if (
                        value &&
                        index <
                        otpInputs.length - 1
                    ) {

                        otpInputs[index + 1].focus();

                    }


                    updateOTPState();

                }
            );


            /*
             * Backspace
             */

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


            /*
             * Paste OTP
             */

            input.addEventListener(
                "paste",
                event => {

                    event.preventDefault();


                    const pasted =
                        event.clipboardData
                            .getData("text")
                            .replace(/\D/g, "")
                            .slice(0, 6);


                    pasted
                        .split("")
                        .forEach(
                            (digit, i) => {

                                if (
                                    otpInputs[i]
                                ) {

                                    otpInputs[i].value =
                                        digit;

                                }

                            }
                        );


                    const nextEmpty =
                        Array.from(
                            otpInputs
                        ).find(
                            item =>
                                !item.value
                        );


                    if (nextEmpty) {

                        nextEmpty.focus();

                    } else {

                        otpInputs[
                            otpInputs.length - 1
                        ].focus();

                    }


                    updateOTPState();

                }
            );

        }
    );



    /* =====================================================
       GET ENTERED OTP
    ===================================================== */

    function getEnteredOTP() {

        return Array.from(
            otpInputs
        )
        .map(input => input.value)
        .join("");

    }



    /* =====================================================
       OTP STATE
    ===================================================== */

    function updateOTPState() {

        const otp =
            getEnteredOTP();


        if (
            otp.length === 6
        ) {

            verifyBtn.classList.add(
                "ready"
            );

        } else {

            verifyBtn.classList.remove(
                "ready"
            );

        }

    }



    /* =====================================================
       VERIFY OTP
    ===================================================== */

    verifyBtn.addEventListener(
        "click",
        () => {

            const enteredOTP =
                getEnteredOTP();


            if (
                enteredOTP.length !== 6
            ) {

                showOTPMessage(
                    "Please enter all 6 digits."
                );

                return;

            }


            /*
             * TEST MODE
             *
             * In real Firebase setup,
             * this section will use
             * Firebase Phone Auth.
             */

            if (
                enteredOTP !== generatedOTP
            ) {

                showOTPMessage(
                    "Incorrect verification code."
                );


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
             * Correct OTP
             */

            verifyBtn.classList.add(
                "loading"
            );

            verifyBtn.disabled = true;


            setTimeout(() => {

                completeVerification();

            }, 1000);

        }
    );



    /* =====================================================
       OTP MESSAGE
    ===================================================== */

    function showOTPMessage(message) {

        let messageBox =
            document.getElementById(
                "otpMessage"
            );


        if (!messageBox) {

            messageBox =
                document.createElement("div");

            messageBox.id =
                "otpMessage";

            messageBox.className =
                "otp-message";


            verificationSection.appendChild(
                messageBox
            );

        }


        messageBox.textContent =
            message;


        messageBox.classList.add(
            "show"
        );


        setTimeout(() => {

            messageBox.classList.remove(
                "show"
            );

        }, 2500);

    }



    /* =====================================================
       COMPLETE VERIFICATION
    ===================================================== */

    function completeVerification() {

        localStorage.setItem(
            "chapcyVerified",
            "true"
        );


        localStorage.setItem(
            "chapcyPhone",
            getFullPhoneNumber()
        );


        verificationSection.classList.remove(
            "show"
        );


        setTimeout(() => {

            successSection.classList.add(
                "show"
            );

        }, 300);

    }



    /* =====================================================
       RESEND OTP
    ===================================================== */

    let resendCooldown = 0;

    resendBtn.addEventListener(
        "click",
        () => {

            if (
                resendCooldown > 0
            ) {

                return;

            }


            generateOTP();


            showOTPMessage(
                "A new verification code has been generated."
            );


            resendCooldown = 30;


            const originalText =
                "Resend";


            const timer =
                setInterval(() => {

                    resendBtn.textContent =
                        `Resend (${resendCooldown})`;

                    resendCooldown--;


                    if (
                        resendCooldown < 0
                    ) {

                        clearInterval(timer);

                        resendBtn.textContent =
                            originalText;

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

            /*
             * Change this to your real
             * CHAPCY chat/home page.
             */

            window.location.href =
                "index.html";

        }
    );



    /* =====================================================
       KEYBOARD COUNTRY SEARCH
    ===================================================== */

    countrySearch.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeCountryDropdown();

            }

        }
    );



    /* =====================================================
       INITIALIZE
    ===================================================== */

    renderCountries();


    /*
     * Tanzania default
     */

    selectCountry(
        "🇹🇿",
        "Tanzania",
        "+255"
    );


    /*
     * Don't keep dropdown open
     */

    closeCountryDropdown();


    console.log(
        "🌍 CHAPCY Registration System Ready"
    );

});
