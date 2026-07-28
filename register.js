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
      CHANGE PAGE
=========================*/

function showPage(page){

    document.querySelectorAll(".page").forEach(p=>{

        p.classList.remove("active");

    });

    setTimeout(()=>{

        page.classList.add("active");

    },150);

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

    showPage(welcomePage);

});

backLogin.addEventListener("click",()=>{

    showPage(welcomePage);

});

/*=========================
     CARD RIPPLE EFFECT
=========================*/

document.querySelectorAll(".card").forEach(card=>{

    card.addEventListener("click",function(e){

        const ripple=document.createElement("span");

        const rect=this.getBoundingClientRect();

        const size=Math.max(rect.width,rect.height);

        ripple.style.width=size+"px";
        ripple.style.height=size+"px";

        ripple.style.left=(e.clientX-rect.left-size/2)+"px";
        ripple.style.top=(e.clientY-rect.top-size/2)+"px";

        ripple.style.position="absolute";
        ripple.style.borderRadius="50%";
        ripple.style.background="rgba(255,255,255,.35)";
        ripple.style.transform="scale(0)";
        ripple.style.animation="ripple .6s linear";
        ripple.style.pointerEvents="none";

        this.style.position="relative";
        this.style.overflow="hidden";

        this.appendChild(ripple);

        setTimeout(()=>{

            ripple.remove();

        },600);

    });

});

/*=========================
     PAGE LOAD EFFECT
=========================*/

window.addEventListener("load",()=>{

    welcomePage.classList.add("active");

});

/*=========================
    FLOATING PARTICLES
=========================*/

const particles=document.querySelector(".particles");

function createParticle(){

    const dot=document.createElement("span");

    dot.style.position="absolute";

    dot.style.width=Math.random()*5+3+"px";
    dot.style.height=dot.style.width;

    dot.style.borderRadius="50%";

    dot.style.background="rgba(255,255,255,.7)";

    dot.style.left=Math.random()*100+"%";

    dot.style.bottom="-20px";

    dot.style.opacity=Math.random();

    dot.style.pointerEvents="none";

    dot.style.animation=`floatUp ${6+Math.random()*5}s linear`;

    particles.appendChild(dot);

    setTimeout(()=>{

        dot.remove();

    },11000);

}

setInterval(createParticle,500);

/*=========================
     CREATE KEYFRAMES
=========================*/

const style=document.createElement("style");

style.innerHTML=`

@keyframes ripple{

to{

transform:scale(4);

opacity:0;

}

}

@keyframes floatUp{

0%{

transform:translateY(0);

opacity:0;

}

20%{

opacity:1;

}

100%{

transform:translateY(-110vh);

opacity:0;

}

}

`;

document.head.appendChild(style);
