/*=========================================
        CHAPCY V10 ULTRA JAVASCRIPT
              PART 1
=========================================*/

"use strict";

/*==============================
      INITIALIZE
==============================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeHeader();

    initializePage();

    initializeButtons();

});

/*==============================
      PAGE FADE
==============================*/

function initializePage(){

    document.body.style.opacity = "0";
    document.body.style.transition = "opacity .8s ease";

    requestAnimationFrame(() => {

        document.body.style.opacity = "1";

    });

}

/*==============================
      HEADER EFFECT
==============================*/

function initializeHeader(){

    const header = document.querySelector(".header");

    if(!header) return;

    window.addEventListener("scroll",()=>{

        if(window.scrollY > 40){

            header.style.background="rgba(5,10,30,.95)";
            header.style.backdropFilter="blur(25px)";
            header.style.boxShadow="0 12px 35px rgba(0,0,0,.35)";

        }else{

            header.style.background="rgba(5,10,30,.55)";
            header.style.boxShadow="none";

        }

    });

}

/*==============================
      PREMIUM BUTTON CLICK
==============================*/

function initializeButtons(){

document.querySelectorAll(".btn,.join-btn").forEach(btn=>{

btn.addEventListener("mouseenter",()=>{

btn.style.transform="translateY(-4px) scale(1.03)";

});

btn.addEventListener("mouseleave",()=>{

btn.style.transform="";

});

});

}

/*==============================
      SMOOTH SCROLL
==============================*/

document.querySelectorAll('a[href^="#"]').forEach(link=>{

link.addEventListener("click",function(e){

const target=document.querySelector(this.getAttribute("href"));

if(target){

e.preventDefault();

target.scrollIntoView({

behavior:"smooth"

});

}

});

});

/*=========================================
        CHAPCY V10 ULTRA JAVASCRIPT
              PART 2
=========================================*/

/*==============================
      PREMIUM GROUP SLIDER
==============================*/

const slider = document.getElementById("groupSlider");

let autoSlide = null;
let isDragging = false;
let startX = 0;
let scrollLeft = 0;

function startSlider(){

    if(!slider) return;

    stopSlider();

    autoSlide = setInterval(()=>{

        const card = slider.querySelector(".group-card");

        if(!card) return;

        const distance = card.offsetWidth + 30;

        slider.scrollBy({

            left:distance,

            behavior:"smooth"

        });

        if(slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 20){

            setTimeout(()=>{

                slider.scrollTo({

                    left:0,

                    behavior:"smooth"

                });

            },500);

        }

    },3500);

}

function stopSlider(){

    clearInterval(autoSlide);

}

if(slider){

    startSlider();

    slider.addEventListener("mouseenter",stopSlider);

    slider.addEventListener("mouseleave",startSlider);

    slider.addEventListener("touchstart",stopSlider);

    slider.addEventListener("touchend",startSlider);

}

/*==============================
      TOUCH SWIPE
==============================*/

if(slider){

slider.addEventListener("mousedown",(e)=>{

isDragging=true;

startX=e.pageX-slider.offsetLeft;

scrollLeft=slider.scrollLeft;

stopSlider();

});

slider.addEventListener("mouseleave",()=>{

isDragging=false;

startSlider();

});

slider.addEventListener("mouseup",()=>{

isDragging=false;

startSlider();

});

slider.addEventListener("mousemove",(e)=>{

if(!isDragging) return;

e.preventDefault();

const x=e.pageX-slider.offsetLeft;

const walk=(x-startX)*2;

slider.scrollLeft=scrollLeft-walk;

});

/* MOBILE */

slider.addEventListener("touchstart",(e)=>{

startX=e.touches[0].pageX;

scrollLeft=slider.scrollLeft;

});

slider.addEventListener("touchmove",(e)=>{

const x=e.touches[0].pageX;

const walk=(x-startX)*2;

slider.scrollLeft=scrollLeft-walk;

});

                            }
/*=========================================
        CHAPCY V10 ULTRA JAVASCRIPT
              PART 3
=========================================*/

/*==============================
      GROUP SEARCH
==============================*/

const searchInput = document.getElementById("groupSearch");

if(searchInput){

searchInput.addEventListener("keyup",function(){

const value = this.value.toLowerCase().trim();

const cards = document.querySelectorAll(".group-card");

cards.forEach(card=>{

const title = card.querySelector("h3").textContent.toLowerCase();

const text = card.querySelector("p").textContent.toLowerCase();

if(title.includes(value) || text.includes(value)){

card.style.display="block";

card.style.opacity="1";
card.style.transform="scale(1)";

}else{

card.style.display="none";

}

});

});

}

/*==============================
      CLEAR SEARCH
==============================*/

function clearSearch(){

if(!searchInput) return;

searchInput.value="";

document.querySelectorAll(".group-card").forEach(card=>{

card.style.display="block";
card.style.opacity="1";
card.style.transform="scale(1)";

});

}

/*==============================
      ESC KEY
==============================*/

document.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

clearSearch();

}

});

/*==============================
      SEARCH ANIMATION
==============================*/

if(searchInput){

searchInput.addEventListener("focus",()=>{

searchInput.style.transform="scale(1.02)";

});

searchInput.addEventListener("blur",()=>{

searchInput.style.transform="scale(1)";

});

}
 /*=========================================
        CHAPCY V10 ULTRA JAVASCRIPT
              PART 4
=========================================*/

/*==============================
      SCROLL REVEAL
==============================*/

const revealElements = document.querySelectorAll(
".hero,.global-card,.group-card,.stat-box,.tv-card,.footer"
);

const revealObserver = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";
entry.target.style.transform="translateY(0)";
entry.target.style.transition="all .8s ease";

}

});

},{
threshold:0.15
});

revealElements.forEach(item=>{

item.style.opacity="0";
item.style.transform="translateY(60px)";

revealObserver.observe(item);

});

/*==============================
      ANIMATED COUNTERS
==============================*/

const counters = document.querySelectorAll(".stat-box h3");

const counterObserver = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

animateCounter(entry.target);

counterObserver.unobserve(entry.target);

}

});

},{
threshold:.5
});

counters.forEach(counter=>{

counterObserver.observe(counter);

});

function animateCounter(counter){

const text = counter.textContent;

let target = parseInt(text.replace(/\D/g,""));

if(isNaN(target)) return;

let current = 0;

const speed = Math.max(15, Math.floor(target/100));

const timer = setInterval(()=>{

current += speed;

if(current >= target){

current = target;
clearInterval(timer);

}

if(text.includes("M")){

counter.textContent = current + "M+";

}else if(text.includes("+")){

counter.textContent = current + "+";

}else{

counter.textContent = current;

}

},20);

}

/*==============================
      GROUP CARD HOVER
==============================*/

document.querySelectorAll(".group-card").forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.transform="translateY(-12px) scale(1.04)";

});

card.addEventListener("mouseleave",()=>{

card.style.transform="translateY(0) scale(1)";

});

});

/*==============================
      IMAGE ZOOM
==============================*/

document.querySelectorAll(".group-card img").forEach(img=>{

img.addEventListener("mouseenter",()=>{

img.style.transform="scale(1.08)";
img.style.transition=".5s";

});

img.addEventListener("mouseleave",()=>{

img.style.transform="scale(1)";

});

});
/*=========================================
        CHAPCY V10 ULTRA JAVASCRIPT
              PART 5
=========================================*/

/*==============================
      PREMIUM RIPPLE EFFECT
==============================*/

document.querySelectorAll(".btn,.join-btn").forEach(button=>{

button.style.position="relative";
button.style.overflow="hidden";

button.addEventListener("click",function(e){

const ripple=document.createElement("span");

const rect=this.getBoundingClientRect();

const size=Math.max(rect.width,rect.height);

ripple.style.width=size+"px";
ripple.style.height=size+"px";

ripple.style.position="absolute";
ripple.style.borderRadius="50%";
ripple.style.background="rgba(255,255,255,.45)";

ripple.style.left=(e.clientX-rect.left-size/2)+"px";
ripple.style.top=(e.clientY-rect.top-size/2)+"px";

ripple.style.transform="scale(0)";
ripple.style.animation="chapcyRipple .7s linear";

this.appendChild(ripple);

setTimeout(()=>{

ripple.remove();

},700);

});

});

/*==============================
      PARALLAX BACKGROUND
==============================*/

const bg=document.querySelector(".bg-video");

window.addEventListener("scroll",()=>{

if(bg){

bg.style.transform="translateY("+(window.pageYOffset*0.15)+"px)";

}

});

/*==============================
      MOUSE GLOW
==============================*/

document.querySelectorAll(".group-card").forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;
const y=e.clientY-rect.top;

card.style.background=
`radial-gradient(circle at ${x}px ${y}px,
rgba(56,189,248,.22),
rgba(20,30,60,.95) 65%)`;

});

card.addEventListener("mouseleave",()=>{

card.style.background=
"linear-gradient(145deg, rgba(20,30,60,.92), rgba(10,18,45,.82))";

});

});

/*==============================
      LAZY IMAGE LOADING
==============================*/

document.querySelectorAll("img").forEach(img=>{

img.loading="lazy";

});

/*==============================
      BACK TO TOP
==============================*/

const topButton=document.createElement("button");

topButton.innerHTML='<i class="fas fa-arrow-up"></i>';

topButton.className="top-button";

document.body.appendChild(topButton);

topButton.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

window.addEventListener("scroll",()=>{

if(window.scrollY>500){

topButton.style.opacity="1";
topButton.style.pointerEvents="auto";

}else{

topButton.style.opacity="0";
topButton.style.pointerEvents="none";

}

});

/*==============================
      PAGE LOADED
==============================*/

window.addEventListener("load",()=>{

console.log("✅ CHAPCY V10 Loaded Successfully");

});
