"use strict";

/*=========================================
      CHAPCY AUTH V18
=========================================*/

const authContainer = document.getElementById("authContainer");
const switchBtn = document.getElementById("switchBtn");

const sliderTitle = document.getElementById("sliderTitle");
const sliderText = document.getElementById("sliderText");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

/*=========================================
      LOGIN ↔ REGISTER
=========================================*/

let registerMode = false;

switchBtn.addEventListener("click", () => {

    registerMode = !registerMode;

    authContainer.classList.toggle("active");

    if(registerMode){

        sliderTitle.textContent = "Welcome Back";

        sliderText.textContent =
        "Already have an account? Login now.";

        switchBtn.textContent = "LOGIN";

    }else{

        sliderTitle.textContent = "New Here?";

        sliderText.textContent =
        "Create your account and start chatting worldwide.";

        switchBtn.textContent = "CREATE ACCOUNT";

    }

});

/*=========================================
      SHOW / HIDE PASSWORD
=========================================*/

document.querySelectorAll(".toggle-password").forEach(icon=>{

    icon.addEventListener("click",()=>{

        const input = icon.previousElementSibling;

        if(input.type==="password"){

            input.type="text";

            icon.textContent="🙈";

        }else{

            input.type="password";

            icon.textContent="👁";

        }

    });

});

/*=========================================
      LOGIN BUTTON
=========================================*/

loginForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    const btn = loginForm.querySelector(".primary-btn");

    btn.disabled = true;

    btn.textContent = "Signing In...";

    setTimeout(()=>{

        btn.disabled = false;

        btn.textContent = "LOGIN";

        // Firebase Login itawekwa hapa

    },1800);

});

/*=========================================
      REGISTER BUTTON
=========================================*/

registerForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    const btn = registerForm.querySelector(".primary-btn");

    btn.disabled = true;

    btn.textContent = "Creating...";

    setTimeout(()=>{

        btn.disabled = false;

        btn.textContent = "CREATE ACCOUNT";

        // Firebase Register itawekwa hapa

    },1800);

});

/*=========================================
      SMALL FADE EFFECT
=========================================*/

window.addEventListener("load",()=>{

    document.body.style.opacity="0";

    setTimeout(()=>{

        document.body.style.transition=".8s";

        document.body.style.opacity="1";

    },100);

});
