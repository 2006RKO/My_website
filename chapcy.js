"use strict";

document.addEventListener("DOMContentLoaded", () => {

const slider = document.getElementById("groupSlider");
const cards = document.querySelectorAll(".group-card");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const dots = document.querySelectorAll(".dot");

if(!slider || cards.length===0) return;

let current = 0;
let autoSlide;

const gap = 25;

function cardWidth(){
    return cards[0].offsetWidth + gap;
}

function updateDots(){

    dots.forEach((dot,index)=>{

        dot.classList.toggle("active",index===current);

    });

}

function goToSlide(index){

    if(index<0){
        index=cards.length-1;
    }

    if(index>=cards.length){
        index=0;
    }

    current=index;

    slider.scrollTo({
        left:cardWidth()*current,
        behavior:"smooth"
    });

    updateDots();

}

function nextSlide(){
    goToSlide(current+1);
}

function prevSlide(){
    goToSlide(current-1);
}

nextBtn.addEventListener("click",nextSlide);
prevBtn.addEventListener("click",prevSlide);

dots.forEach((dot,index)=>{

    dot.addEventListener("click",()=>{

        stopAuto();
        goToSlide(index);
        startAuto();

    });

});

function startAuto(){

    stopAuto();

    autoSlide=setInterval(()=>{

        nextSlide();

    },4000);

}

function stopAuto(){

    clearInterval(autoSlide);

}

slider.addEventListener("mouseenter",stopAuto);
slider.addEventListener("mouseleave",startAuto);

slider.addEventListener("touchstart",stopAuto);
slider.addEventListener("touchend",startAuto);

let startX=0;
let endX=0;

slider.addEventListener("touchstart",(e)=>{

    startX=e.changedTouches[0].clientX;

});

slider.addEventListener("touchend",(e)=>{

    endX=e.changedTouches[0].clientX;

    if(startX-endX>50){

        nextSlide();

    }

    if(endX-startX>50){

        prevSlide();

    }

});

document.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowRight"){

        nextSlide();

    }

    if(e.key==="ArrowLeft"){

        prevSlide();

    }

});

window.addEventListener("resize",()=>{

    goToSlide(current);

});

goToSlide(0);

startAuto();

});
