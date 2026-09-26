/* =========================================================
   CHAPCY V21 — REGISTER.JS
   PHP + MYSQL VERSION
   FIREBASE REMOVED
========================================================= */

"use strict";


/* =========================================================
   BOOK FLIP
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const book = document.querySelector(".book");
    const openRegister = document.getElementById("openRegister");
    const openLogin = document.getElementById("openLogin");

    if (openRegister && book) {
        openRegister.addEventListener("click", (e) => {
            e.preventDefault();
            book.classList.remove("open-login");
            book.classList.add("open-register");
        });
    }

    if (openLogin && book) {
        openLogin.addEventListener("click", (e) => {
            e.preventDefault();
            book.classList.remove("open-register");
            book.classList.add("open-login");
        });
    }

});


/* =========================================================
   RIPPLE EFFECT
========================================================= */

document.addEventListener("click", function (e) {

    const button = e.target.closest("button, .btn, .ripple");

    if (!button) return;

    const ripple = document.createElement("span");

    ripple.className = "ripple-effect";

    const rect = button.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height);

    ripple.style.width = size + "px";
    ripple.style.height = size + "px";

    ripple.style.left =
        (e.clientX - rect.left - size / 2) + "px";

    ripple.style.top =
        (e.clientY - rect.top - size / 2) + "px";

    button.style.position = "relative";
    button.style.overflow = "hidden";

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 700);

});


/* =========================================================
   FLOATING PARTICLES
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const container =
        document.querySelector(".particles") ||
        document.querySelector(".background");

    if (!container) return;

    for (let i = 0; i < 35; i++) {

        const particle =
            document.createElement("span");

        particle.className = "floating-particle";

        particle.style.left =
            Math.random() * 100 + "%";

        particle.style.animationDelay =
            Math.random() * 8 + "s";

        particle.style.animationDuration =
            (5 + Math.random() * 8) + "s";

        particle.style.opacity =
            (0.2 + Math.random() * 0.8).toFixed(2);

        const size =
            2 + Math.random() * 5;

        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";

        container.appendChild(particle);
    }

});


/* =========================================================
   BUTTON GLOW
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const buttons =
        document.querySelectorAll(
            "button, .btn, .submit-btn"
        );

    buttons.forEach(button => {

        button.addEventListener("mouseenter", () => {
            button.classList.add("glow-active");
        });

        button.addEventListener("mouseleave", () => {
            button.classList.remove("glow-active");
        });

    });

});


/* =========================================================
   DYNAMIC KEYFRAMES
========================================================= */

(function createAnimations() {

    const style =
        document.createElement("style");

    style.innerHTML = `

        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: chapcyRipple 0.7s ease-out;
            pointer-events: none;
            background: rgba(0, 255, 255, 0.35);
        }

        @keyframes chapcyRipple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .floating-particle {
            position: absolute;
            bottom: -20px;
            border-radius: 50%;
            background: rgba(0, 255, 255, 0.7);
            box-shadow:
                0 0 8px rgba(0, 255, 255, 0.8),
                0 0 18px rgba(150, 0, 255, 0.5);
            pointer-events: none;
            animation:
                chapcyFloat linear infinite;
        }

        @keyframes chapcyFloat {

            0% {
                transform:
                    translateY(0)
                    translateX(0);
            }

            25% {
                transform:
                    translateY(-25vh)
                    translateX(20px);
            }

            50% {
                transform:
                    translateY(-50vh)
                    translateX(-20px);
            }

            75% {
                transform:
                    translateY(-75vh)
                    translateX(25px);
            }

            100% {
                transform:
                    translateY(-110vh)
                    translateX(-10px);
                opacity: 0;
            }

        }

        .glow-active {
            transform: translateY(-2px);
            filter:
                brightness(1.15)
                drop-shadow(
                    0 0 12px
                    rgba(0,255,255,.6)
                );
        }

    `;

    document.head.appendChild(style);

})();


/* =========================================================
   PAGE LOAD ANIMATION
========================================================= */

window.addEventListener("load", () => {

    document.body.classList.add("chapcy-loaded");

});


/* =========================================================
   REGISTER
   PHP + MYSQL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const registerForm =
        document.getElementById("registerForm");

    if (!registerForm) return;


    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        /* -------------------------------------------------
           GET INPUTS
        ------------------------------------------------- */

        const inputs =
            registerForm.querySelectorAll("input");

        const nameInput =
            registerForm.querySelector(
                'input[type="text"]'
            );

        const emailInput =
            registerForm.querySelector(
                'input[type="email"]'
            );

        const passwordInputs =
            registerForm.querySelectorAll(
                'input[type="password"]'
            );


        const name =
            nameInput
                ? nameInput.value.trim()
                : "";

        const email =
            emailInput
                ? emailInput.value.trim()
                : "";

        const password =
            passwordInputs[0]
                ? passwordInputs[0].value
                : "";

        const confirmPassword =
            passwordInputs[1]
                ? passwordInputs[1].value
                : "";


        /* -------------------------------------------------
           VALIDATION
        ------------------------------------------------- */

        if (!name) {
            alert("Please enter your full name.");
            return;
        }

        if (!email) {
            alert("Please enter your email address.");
            return;
        }

        if (!password) {
            alert("Please create a password.");
            return;
        }

        if (password.length < 6) {
            alert(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }


        /* -------------------------------------------------
           BUTTON
        ------------------------------------------------- */

        const submitButton =
            registerForm.querySelector(
                'button[type="submit"]'
            );

        const originalText =
            submitButton
                ? submitButton.textContent
                : "";


        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent =
                "Creating Account...";
        }


        /* -------------------------------------------------
           SEND TO REGISTER.PHP
        ------------------------------------------------- */

        try {

            const formData = new URLSearchParams();

            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append(
                "confirm_password",
                confirmPassword
            );


            const response =
                await fetch("register.php", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body: formData.toString(),

                    credentials: "same-origin",

                    cache: "no-store"

                });


            /* -------------------------------------------------
               CHECK HTTP RESPONSE
            ------------------------------------------------- */

            if (!response.ok) {

                throw new Error(
                    "Server error: " +
                    response.status
                );

            }


            /* -------------------------------------------------
               READ JSON
            ------------------------------------------------- */

            const data =
                await response.json();


            console.log(
                "CHAPCY REGISTER RESPONSE:",
                data
            );


            /* -------------------------------------------------
               SUCCESS
            ------------------------------------------------- */

            if (data.success) {

                alert(
                    data.message ||
                    "Welcome to CHAPCY 🚀"
                );


                window.location.href =
                    "chapcy.html";

                return;

            }


            /* -------------------------------------------------
               SERVER ERROR
            ------------------------------------------------- */

            alert(
                data.message ||
                "Registration failed."
            );


        } catch (error) {

            console.error(
                "CHAPCY REGISTER ERROR:",
                error
            );


            alert(
                "Unable to connect to CHAPCY server.\n\n" +
                "Make sure Apache and MySQL are running " +
                "and register.php is inside:\n" +
                "C:\\xampp\\htdocs\\CHAPCY\\"
            );


        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    originalText ||
                    "Create Account";

            }

        }

    });

});


/* =========================================================
   LOGIN
   PHP SESSION + MYSQL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("loginForm");

    if (!loginForm) return;


    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        /* -------------------------------------------------
           GET LOGIN INPUTS
        ------------------------------------------------- */

        const emailInput =
            loginForm.querySelector(
                'input[type="email"]'
            );

        const passwordInput =
            loginForm.querySelector(
                'input[type="password"]'
            );


        const email =
            emailInput
                ? emailInput.value.trim()
                : "";

        const password =
            passwordInput
                ? passwordInput.value
                : "";


        /* -------------------------------------------------
           VALIDATION
        ------------------------------------------------- */

        if (!email) {

            alert(
                "Please enter your email address."
            );

            return;
        }


        if (!password) {

            alert(
                "Please enter your password."
            );

            return;
        }


        /* -------------------------------------------------
           BUTTON
        ------------------------------------------------- */

        const submitButton =
            loginForm.querySelector(
                'button[type="submit"]'
            );

        const originalText =
            submitButton
                ? submitButton.textContent
                : "";


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent =
                "Logging in...";

        }


        /* -------------------------------------------------
           SEND TO LOGIN.PHP
        ------------------------------------------------- */

        try {

            const formData =
                new URLSearchParams();

            formData.append(
                "email",
                email
            );

            formData.append(
                "password",
                password
            );


            const response =
                await fetch("login.php", {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/x-www-form-urlencoded"

                    },

                    body:
                        formData.toString(),

                    credentials:
                        "same-origin",

                    cache:
                        "no-store"

                });


            /* -------------------------------------------------
               CHECK HTTP RESPONSE
            ------------------------------------------------- */

            if (!response.ok) {

                throw new Error(
                    "Server error: " +
                    response.status
                );

            }


            /* -------------------------------------------------
               READ JSON
            ------------------------------------------------- */

            const data =
                await response.json();


            console.log(
                "CHAPCY LOGIN RESPONSE:",
                data
            );


            /* -------------------------------------------------
               SUCCESS
            ------------------------------------------------- */

            if (data.success) {

                alert(
                    data.message ||
                    "Welcome Back CHAPCY 🌍"
                );


                window.location.href =
                    "chapcy.html";

                return;

            }


            /* -------------------------------------------------
               LOGIN ERROR
            ------------------------------------------------- */

            alert(
                data.message ||
                "Login failed."
            );


        } catch (error) {

            console.error(
                "CHAPCY LOGIN ERROR:",
                error
            );


            alert(
                "Unable to connect to CHAPCY server.\n\n" +
                "Make sure Apache and MySQL are running " +
                "and login.php is inside:\n" +
                "C:\\xampp\\htdocs\\CHAPCY\\"
            );


        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    originalText ||
                    "Login";

            }

        }

    });

});


/* =========================================================
   CHAPCY READY
========================================================= */

console.log(
    "CHAPCY REGISTER JS — PHP + MYSQL READY 🚀"
);

console.log(
    "Firebase has been completely removed."
);
