/*=========================================
          CHAPCY REGISTER JS
=========================================*/

"use strict";

/*=========================
      ELEMENTS
=========================*/

const welcomePage = document.getElementById("welcomePage");
const registerPage = document.getElementById("registerPage");
const loginPage = document.getElementById("loginPage");

const registerCard = document.getElementById("registerCard");
const loginCard = document.getElementById("loginCard");

const backRegister = document.getElementById("backRegister");
const backLogin = document.getElementById("backLogin");

/*=========================
      INITIAL STATE
=========================*/

registerPage.style.display = "none";
loginPage.style.display = "none";

/*=========================
      SHOW PAGE
=========================*/

function showPage(page){

    welcomePage.style.display = "none";
    registerPage.style.display = "none";
    loginPage.style.display = "none";

    page.style.display = "block";

    page.style.opacity = "0";
    page.style.transform = "translateX(40px)";

    setTimeout(() => {

        page.style.transition = "0.4s ease";
        page.style.opacity = "1";
        page.style.transform = "translateX(0)";

    },20);

}

/*=========================
      SHOW WELCOME
=========================*/

function showWelcome(){

    registerPage.style.display = "none";
    loginPage.style.display = "none";

    welcomePage.style.display = "block";

    welcomePage.style.opacity = "0";
    welcomePage.style.transform = "translateX(-40px)";

    setTimeout(()=>{

        welcomePage.style.transition = "0.4s ease";
        welcomePage.style.opacity = "1";
        welcomePage.style.transform = "translateX(0)";

    },20);

}

/*=========================
      EVENTS
=========================*/

registerCard.addEventListener("click",()=>{

    showPage(registerPage);

});

loginCard.addEventListener("click",()=>{

    showPage(loginPage);

});

backRegister.addEventListener("click",()=>{

    showWelcome();

});

backLogin.addEventListener("click",()=>{

    showWelcome();

});

/*=========================
      CARD HOVER EFFECT
=========================*/

const cards = document.querySelectorAll(".choice-card");

cards.forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform = "translateY(-8px) scale(1.02)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform = "";

    });

});

/*=========================
      PAGE FADE IN
=========================*/

window.addEventListener("load",()=>{

    welcomePage.style.opacity = "0";
    welcomePage.style.transform = "scale(.95)";

    setTimeout(()=>{

        welcomePage.style.transition = "0.5s ease";
        welcomePage.style.opacity = "1";
        welcomePage.style.transform = "scale(1)";

    },100);

});
