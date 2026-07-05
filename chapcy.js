/*=========================================
        CHAPCY PREMIUM JAVASCRIPT
=========================================*/


/* ==========================
      GROUP SLIDESHOW
========================== */

const slides = document.querySelectorAll(".group-slide");
const dots = document.querySelectorAll(".dot");

let currentSlide = 0;
let autoSlide;


/* Show Current Slide */

function showSlide(index){

    slides.forEach((slide)=>{
        slide.classList.remove("active");
    });

    dots.forEach((dot)=>{
        dot.classList.remove("active");
    });

    slides[index].classList.add("active");

    if(dots[index]){
        dots[index].classList.add("active");
    }

}


/* Next */

function nextSlide(){

    currentSlide++;

    if(currentSlide >= slides.length){

        currentSlide = 0;

    }

    showSlide(currentSlide);

}


/* Previous */

function previousSlide(){

    currentSlide--;

    if(currentSlide < 0){

        currentSlide = slides.length-1;

    }

    showSlide(currentSlide);

}


/* Auto Slide */

function startSlide(){

    autoSlide = setInterval(nextSlide,4000);

}


/* Stop */

function stopSlide(){

    clearInterval(autoSlide);

}


/* Start */

showSlide(currentSlide);

startSlide();


/* Pause on Hover */

const slideshow = document.querySelector(".slideshow");

if(slideshow){

slideshow.addEventListener("mouseenter",stopSlide);

slideshow.addEventListener("mouseleave",startSlide);

}


/* Dots */

dots.forEach((dot,index)=>{

dot.addEventListener("click",()=>{

currentSlide=index;

showSlide(currentSlide);

stopSlide();

startSlide();

});

});


/* ==========================
      STATS SCROLL
========================== */

const stats=document.querySelector(".stats");

function moveRight(){

if(stats){

stats.scrollBy({

left:300,

behavior:"smooth"

});

}

}

function moveLeft(){

if(stats){

stats.scrollBy({

left:-300,

behavior:"smooth"

});

}

}


/* Auto Scroll */

if(stats){

setInterval(()=>{

stats.scrollBy({

left:250,

behavior:"smooth"

});

if(stats.scrollLeft>=stats.scrollWidth-stats.clientWidth){

stats.scrollTo({

left:0,

behavior:"smooth"

});

}

},5000);

}


/* ==========================
      HEADER EFFECT
========================== */

const header=document.querySelector(".header");

window.addEventListener("scroll",()=>{

if(window.scrollY>50){

header.style.background="rgba(5,10,30,.95)";

header.style.boxShadow="0 10px 25px rgba(0,0,0,.4)";

}else{

header.style.background="rgba(5,10,30,.75)";

header.style.boxShadow="none";

}

});


/* ==========================
      BUTTON RIPPLE
========================== */

document.querySelectorAll(".btn,.join-btn").forEach(button=>{

button.addEventListener("click",function(e){

const ripple=document.createElement("span");

const rect=this.getBoundingClientRect();

const size=Math.max(rect.width,rect.height);

ripple.style.width=size+"px";

ripple.style.height=size+"px";

ripple.style.left=(e.clientX-rect.left-size/2)+"px";

ripple.style.top=(e.clientY-rect.top-size/2)+"px";

ripple.classList.add("ripple");

this.appendChild(ripple);

setTimeout(()=>{

ripple.remove();

},700);

});

});


/* ==========================
      FADE IN
========================== */

window.onload=()=>{

document.body.style.opacity="1";

};

document.body.style.opacity="0";

document.body.style.transition="opacity .8s ease";


/* ==========================
      SCROLL REVEAL
========================== */

const reveal=document.querySelectorAll(".hero-card,.global-card,.tv-card,.group-slide,.stat-box");

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";

}

});

});

reveal.forEach(item=>{

item.style.opacity="0";

item.style.transform="translateY(40px)";

item.style.transition=".7s";

observer.observe(item);

});
