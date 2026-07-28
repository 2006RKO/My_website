"use strict";

/*=========================================
        CHAPCY AUTH V18
=========================================*/

const switchBtn = document.getElementById("switchBtn");
const switchPanel = document.getElementById("switchPanel");

const panelTitle = document.getElementById("panelTitle");
const panelText = document.getElementById("panelText");

const loginContainer = document.querySelector(".login-container");
const registerContainer = document.querySelector(".register-container");

let registerMode = false;

/*=========================================
        SWITCH LOGIN / REGISTER
=========================================*/

switchBtn.addEventListener("click", () => {

    registerMode = !registerMode;

    if(registerMode){

        switchPanel.style.left = "0";

        loginContainer.style.opacity = "0";
        loginContainer.style.pointerEvents = "none";
        loginContainer.style.transform = "translateX(80px)";

        registerContainer.style.opacity = "1";
        registerContainer.style.pointerEvents = "auto";
        registerContainer.style.transform = "translateX(0)";

        panelTitle.textContent = "Welcome!";
        panelText.textContent = "Already have an account?";
        switchBtn.textContent = "LOGIN";

    }else{

        switchPanel.style.left = "50%";

        loginContainer.style.opacity = "1";
        loginContainer.style.pointerEvents = "auto";
        loginContainer.style.transform = "translateX(0)";

        registerContainer.style.opacity = "0";
        registerContainer.style.pointerEvents = "none";
        registerContainer.style.transform = "translateX(-80px)";

        panelTitle.textContent = "Welcome Back";
        panelText.textContent = "Don't have an account?";
        switchBtn.textContent = "CREATE ACCOUNT";

    }

});

/*=========================================
        INITIAL STATE
=========================================*/

loginContainer.style.opacity = "1";
loginContainer.style.pointerEvents = "auto";

registerContainer.style.opacity = "0";
registerContainer.style.pointerEvents = "none";
registerContainer.style.transform = "translateX(-80px)";

loginContainer.style.transition = ".8s";
registerContainer.style.transition = ".8s";
switchPanel.style.transition = ".9s cubic-bezier(.68,-0.55,.27,1.55)";

/*=========================================
        MOBILE SUPPORT
=========================================*/

function updateMobile(){

    if(window.innerWidth <= 900){

        if(registerMode){

            switchPanel.style.top = "0";
        }else{

            switchPanel.style.top = "50%";
        }

    }else{

        switchPanel.style.top = "0";

        if(registerMode){

            switchPanel.style.left = "0";

        }else{

            switchPanel.style.left = "50%";

        }

    }

}

window.addEventListener("resize", updateMobile);

updateMobile();
