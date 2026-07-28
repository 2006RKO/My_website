"use strict";

/*=========================================
          CHAPCY AUTH V18
=========================================*/

const authContainer = document.querySelector(".auth-container");
const switchBtn = document.getElementById("switchBtn");

const panelTitle = document.getElementById("panelTitle");
const panelText = document.getElementById("panelText");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

let registerMode = false;

/*=========================================
        LOGIN ↔ REGISTER ANIMATION
=========================================*/

switchBtn.addEventListener("click", () => {

    registerMode = !registerMode;

    authContainer.classList.toggle("active");

    if (registerMode) {

        panelTitle.textContent = "Welcome!";
        panelText.textContent = "Already have an account?";
        switchBtn.textContent = "LOGIN";

    } else {

        panelTitle.textContent = "Welcome Back";
        panelText.textContent = "Don't have an account?";
        switchBtn.textContent = "CREATE ACCOUNT";

    }

});

/*=========================================
        SHOW / HIDE PASSWORD
=========================================*/

document.querySelectorAll(".toggle-password").forEach(icon => {

    icon.addEventListener("click", () => {

        const input = icon.previousElementSibling;

        if (!input) return;

        if (input.type === "password") {

            input.type = "text";
            icon.innerHTML = "🙈";

        } else {

            input.type = "password";
            icon.innerHTML = "👁";

        }

    });

});

/*=========================================
          LOGIN BUTTON
=========================================*/

loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const btn = loginForm.querySelector(".login-btn");

    btn.disabled = true;
    btn.textContent = "Signing In...";

    setTimeout(() => {

        btn.disabled = false;
        btn.textContent = "LOGIN";

        // Firebase Login itawekwa hapa

    }, 1500);

});

/*=========================================
          REGISTER BUTTON
=========================================*/

registerForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const btn = registerForm.querySelector(".register-btn");

    btn.disabled = true;
    btn.textContent = "Creating...";

    setTimeout(() => {

        btn.disabled = false;
        btn.textContent = "CREATE ACCOUNT";

        // Firebase Register itawekwa hapa

    }, 1500);

});

/*=========================================
           PAGE FADE
=========================================*/

window.addEventListener("load", () => {

    document.body.style.opacity = "0";

    setTimeout(() => {

        document.body.style.transition = "opacity .8s ease";
        document.body.style.opacity = "1";

    }, 100);

});
