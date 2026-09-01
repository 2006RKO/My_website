/* =========================================================
   CHAPCY — MYCHATREGISTER.JS
   WORLDWIDE PHONE REGISTRATION
   CONTINUE → OTP VERIFICATION → SUCCESS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const form = document.getElementById("registerForm");

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
       COUNTRY DATA
    ===================================================== */

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
        ["🇪🇬", "Egypt", "+20"],
        ["🇲🇿", "Mozambique", "+258"],
        ["🇿🇲", "Zambia", "+260"],
        ["🇿🇼", "Zimbabwe", "+263"],

        ["🇺🇸", "United States", "+1"],
        ["🇨🇦", "Canada", "+1"],
        ["🇬🇧", "United Kingdom", "+44"],
        ["🇫🇷", "France", "+33"],
        ["🇩🇪", "Germany", "+49"],
        ["🇮🇹", "Italy", "+39"],
        ["🇪🇸", "Spain", "+34"],
        ["🇳🇱", "Netherlands", "+31"],
        ["🇧🇪", "Belgium", "+32"],
        ["🇨🇭", "Switzerland", "+41"],

        ["🇮🇳", "India", "+91"],
        ["🇨🇳", "China", "+86"],
        ["🇯🇵", "Japan", "+81"],
        ["🇰🇷", "South Korea", "+82"],
        ["🇮🇩", "Indonesia", "+62"],
        ["🇲🇾", "Malaysia", "+60"],
        ["🇵🇭", "Philippines", "+63"],
        ["🇸🇬", "Singapore", "+65"],
        ["🇹🇭", "Thailand", "+66"],

        ["🇦🇪", "United Arab Emirates", "+971"],
        ["🇸🇦", "Saudi Arabia", "+966"],
        ["🇶🇦", "Qatar", "+974"],
        ["🇰🇼", "Kuwait", "+965"],
        ["🇴🇲", "Oman", "+968"],
        ["🇹🇷", "Turkey", "+90"],

        ["🇦🇺", "Australia", "+61"],
        ["🇳🇿", "New Zealand", "+64"],

        ["🇧🇷", "Brazil", "+55"],
        ["🇦🇷", "Argentina", "+54"],
        ["🇨🇱", "Chile", "+56"],
        ["🇨🇴", "Colombia", "+57"],
        ["🇲🇽", "Mexico", "+52"],

        ["🇷🇺", "Russia", "+7"],
        ["🇺🇦", "Ukraine", "+380"],
        ["🇵🇱", "Poland", "+48"],
        ["🇸🇪", "Sweden", "+46"],
        ["🇳🇴", "Norway", "+47"],
        ["🇩🇰", "Denmark", "+45"],
        ["🇫🇮", "Finland", "+358"],

        ["🇵🇰", "Pakistan", "+92"],
        ["🇧🇩", "Bangladesh", "+880"],
        ["🇳🇵", "Nepal", "+977"],
        ["🇱🇰", "Sri Lanka", "+94"],

        ["🇸🇴", "Somalia", "+252"],
        ["🇸🇩", "Sudan", "+249"],
        ["🇸🇸", "South Sudan", "+211"],
        ["🇪🇷", "Eritrea", "+291"],
        ["🇩🇯", "Djibouti", "+253"],

        ["🇨🇩", "DR Congo", "+243"],
        ["🇨🇬", "Congo", "+242"],
        ["🇨🇲", "Cameroon", "+237"],
        ["🇸🇳", "Senegal", "+221"],
        ["🇨🇮", "Côte d'Ivoire", "+225"],
        ["🇲🇬", "Madagascar", "+261"],
        ["🇲🇼", "Malawi", "+265"],
        ["🇳🇦", "Namibia", "+264"],
        ["🇧🇼", "Botswana", "+267"],
        ["🇱🇸", "Lesotho", "+266"],
        ["🇸🇿", "Eswatini", "+268"],

        ["🇦🇫", "Afghanistan", "+93"],
        ["🇦🇱", "Albania", "+355"],
        ["🇩🇿", "Algeria", "+213"],
        ["🇦🇩", "Andorra", "+376"],
        ["🇦🇴", "Angola", "+244"],
        ["🇦🇲", "Armenia", "+374"],
        ["🇦🇹", "Austria", "+43"],
        ["🇦🇿", "Azerbaijan", "+994"],

        ["🇧🇭", "Bahrain", "+973"],
        ["🇧🇧", "Barbados", "+1246"],
        ["🇧🇾", "Belarus", "+375"],
        ["🇧🇿", "Belize", "+501"],
        ["🇧🇯", "Benin", "+229"],
        ["🇧🇹", "Bhutan", "+975"],
        ["🇧🇴", "Bolivia", "+591"],
        ["🇧🇦", "Bosnia and Herzegovina", "+387"],
        ["🇧🇷", "Brazil", "+55"],
        ["🇧🇳", "Brunei", "+673"],
        ["🇧🇬", "Bulgaria", "+359"],
        ["🇧🇫", "Burkina Faso", "+226"],

        ["🇨🇻", "Cabo Verde", "+238"],
        ["🇰🇭", "Cambodia", "+855"],
        ["🇨🇫", "Central African Republic", "+236"],
        ["🇹🇩", "Chad", "+235"],
        ["🇨🇷", "Costa Rica", "+506"],
        ["🇭🇷", "Croatia", "+385"],
        ["🇨🇾", "Cyprus", "+357"],
        ["🇨🇿", "Czech Republic", "+420"],

        ["🇬🇷", "Greece", "+30"],
        ["🇬🇪", "Georgia", "+995"],
        ["🇬🇹", "Guatemala", "+502"],
        ["🇬🇳", "Guinea", "+224"],
        ["🇬🇾", "Guyana", "+592"],

        ["🇭🇹", "Haiti", "+509"],
        ["🇭🇳", "Honduras", "+504"],
        ["🇭🇺", "Hungary", "+36"],

        ["🇮🇪", "Ireland", "+353"],
        ["🇮🇱", "Israel", "+972"],
        ["🇮🇸", "Iceland", "+354"],
        ["🇮🇷", "Iran", "+98"],
        ["🇮🇶", "Iraq", "+964"],

        ["🇯🇲", "Jamaica", "+1876"],
        ["🇯🇴", "Jordan", "+962"],

        ["🇰🇿", "Kazakhstan", "+7"],
        ["🇰🇬", "Kyrgyzstan", "+996"],
        ["🇰🇼", "Kuwait", "+965"],

        ["🇱🇧", "Lebanon", "+961"],
        ["🇱🇷", "Liberia", "+231"],
        ["🇱🇾", "Libya", "+218"],
        ["🇱🇹", "Lithuania", "+370"],
        ["🇱🇺", "Luxembourg", "+352"],

        ["🇲🇱", "Mali", "+223"],
        ["🇲🇹", "Malta", "+356"],
        ["🇲🇷", "Mauritania", "+222"],
        ["🇲🇺", "Mauritius", "+230"],
        ["🇲🇦", "Morocco", "+212"],
        ["🇲🇲", "Myanmar", "+95"],

        ["🇳🇦", "Namibia", "+264"],
        ["🇳🇪", "Niger", "+227"],
        ["🇳🇮", "Nicaragua", "+505"],
        ["🇳🇴", "Norway", "+47"],

        ["🇵🇦", "Panama", "+507"],
        ["🇵🇾", "Paraguay", "+595"],
        ["🇵🇪", "Peru", "+51"],
        ["🇵🇹", "Portugal", "+351"],

        ["🇷🇴", "Romania", "+40"],
        ["🇷🇸", "Serbia", "+381"],

        ["🇸🇬", "Singapore", "+65"],
        ["🇸🇰", "Slovakia", "+421"],
        ["🇸🇮", "Slovenia", "+386"],
        ["🇪🇸", "Spain", "+34"],
        ["🇱🇰", "Sri Lanka", "+94"],
        ["🇸🇷", "Suriname", "+597"],
        ["🇸🇾", "Syria", "+963"],

        ["🇹🇼", "Taiwan", "+886"],
        ["🇹🇯", "Tajikistan", "+992"],
        ["🇹🇱", "Timor-Leste", "+670"],
        ["🇹🇳", "Tunisia", "+216"],
        ["🇹🇲", "Turkmenistan", "+993"],

        ["🇺🇾", "Uruguay", "+598"],
        ["🇺🇿", "Uzbekistan", "+998"],

        ["🇻🇪", "Venezuela", "+58"],
        ["🇻🇳", "Vietnam", "+84"],

        ["🇾🇪", "Yemen", "+967"]

    ];


    /* =====================================================
       SELECTED COUNTRY
    ===================================================== */

    let selectedCountry = {
        flag: "🇹🇿",
        name: "Tanzania",
        code: "+255"
    };


    /* =====================================================
       COUNTRY LIST
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


        countryFlag.textContent =
            country[0];

        countryCode.textContent =
            country[2];


        closeCountryModal();


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

        if (countrySearch) {

            countrySearch.value = "";

            setTimeout(() => {

                countrySearch.focus();

            }, 150);

        }

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
       PHONE INPUT
    ===================================================== */

    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            () => {

                let value =
                    phoneInput.value
                        .replace(/\D/g, "")
                        .substring(0, 15);


                const groups =
                    value.match(/.{1,3}/g);


                phoneInput.value =
                    groups
                        ? groups.join(" ")
                        : "";


                hidePhoneError();

            }
        );

    }


    /* =====================================================
       PHONE HELPERS
    ===================================================== */

    function getCleanPhone() {

        return phoneInput
            ? phoneInput.value
                .replace(/\D/g, "")
            : "";

    }


    function getFullPhone() {

        return (
            selectedCountry.code +
            getCleanPhone()
        );

    }


    /* =====================================================
       PHONE VALIDATION
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


    function showPhoneError(message) {

        if (!phoneError) return;

        const text =
            phoneError.querySelector("span");


        if (text) {

            text.textContent =
                message;

        }


        phoneError.classList.add("show");

        phoneInput.classList.add(
            "input-error"
        );

    }


    function hidePhoneError() {

        if (!phoneError) return;

        phoneError.classList.remove("show");

        phoneInput.classList.remove(
            "input-error"
        );

    }


    /* =====================================================
       BUTTON LOADING
    ===================================================== */

    function startLoading() {

        continueBtn.disabled = true;

        if (continueText)
            continueText.style.display = "none";

        if (continueArrow)
            continueArrow.style.display = "none";

        if (continueLoader)
            continueLoader.classList.add("show");

        continueBtn.classList.add("loading");

    }


    function stopLoading() {

        continueBtn.disabled = false;

        if (continueText)
            continueText.style.display = "";

        if (continueArrow)
            continueArrow.style.display = "";

        if (continueLoader)
            continueLoader.classList.remove("show");

        continueBtn.classList.remove("loading");

    }


    /* =====================================================
       FORMAT PHONE
    ===================================================== */

    function formatInternationalNumber() {

        return (
            selectedCountry.code +
            " " +
            getCleanPhone()
        );

    }


    /* =====================================================
       OPEN OTP SECTION
    ===================================================== */

    function openVerification() {

        if (verificationNumber) {

            verificationNumber.textContent =
                formatInternationalNumber();

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


        /* Clear OTP */

        otpInputs.forEach(input => {

            input.value = "";

        });


        /* Focus first OTP */

        setTimeout(() => {

            if (otpInputs[0]) {

                otpInputs[0].focus();

            }

            if (verificationSection) {

                verificationSection.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        }, 250);

    }


    /* =====================================================
       CONTINUE
       PHONE → OTP
    ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                if (!validatePhone()) {

                    phoneInput.focus();

                    return;

                }


                startLoading();


                /*
                 * Demo processing
                 */

                setTimeout(() => {

                    stopLoading();

                    openVerification();

                }, 1200);

            }
        );

    }


    /* =====================================================
       OTP INPUT SYSTEM
    ===================================================== */

    otpInputs.forEach(
        (input, index) => {


            input.addEventListener(
                "input",
                event => {

                    const value =
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
                        event.key ===
                            "Backspace" &&
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


                    const nextIndex =
                        Math.min(
                            pasted.length,
                            otpInputs.length - 1
                        );


                    if (
                        otpInputs[nextIndex]
                    ) {

                        otpInputs[
                            nextIndex
                        ].focus();

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
            .map(input => input.value)
            .join("");

    }


    /* =====================================================
       VERIFY OTP
    ===================================================== */

    if (verifyBtn) {

        verifyBtn.addEventListener(
            "click",
            () => {

                const otp =
                    getOTP();


                if (otp.length !== 6) {

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


                    return;

                }


                verifyBtn.disabled =
                    true;


                verifyBtn.classList.add(
                    "verifying"
                );


                verifyBtn.innerHTML = `
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    Verifying...
                `;


                /*
                 * DEMO OTP
                 *
                 * For now any 6 digits
                 * will pass.
                 *
                 * Firebase OTP will replace
                 * this later.
                 */

                setTimeout(() => {

                    showSuccess();

                }, 1500);

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


        localStorage.setItem(
            "chapcyPhoneVerified",
            "true"
        );


        localStorage.setItem(
            "chapcyCurrentPhone",
            getFullPhone()
        );


        localStorage.setItem(
            "chapcyCountry",
            JSON.stringify(
                selectedCountry
            )
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

                if (resendCooldown)
                    return;


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

                            clearInterval(timer);

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
       SUCCESS → MY CHAT.HTML
    ===================================================== */

    if (enterChapcyBtn) {

        enterChapcyBtn.addEventListener(
            "click",
            () => {

                enterChapcyBtn.classList.add(
                    "entering"
                );


                setTimeout(() => {

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
       PHONE FOCUS
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


    console.log(
        "🌍 CHAPCY Registration System Ready"
    );

});
