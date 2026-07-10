/*====================================================
           CHAPCY V12 ULTRA SLIDER
                  PART 1
====================================================*/

"use strict";

document.addEventListener("DOMContentLoaded", () => {

/*========================
      GET ELEMENTS
========================*/

const slider = document.getElementById("groupSlider");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const dots = document.querySelectorAll(".dot");

if (!slider) {
    console.log("CHAPCY V12 Slider Not Found");
    return;
}

/*========================
      ORIGINAL CARDS
========================*/

let cards = [...slider.children];

/*========================
      CREATE CLONES
========================*/

cards.forEach(card => {

    const clone = card.cloneNode(true);

    clone.classList.add("clone");

    slider.appendChild(clone);

});

/*========================
      REFRESH CARDS
========================*/

cards = [...slider.children];

/*========================
      VARIABLES
========================*/

let currentIndex = 0;

let autoSlide = null;

let isDragging = false;

let startX = 0;

let scrollLeft = 0;

const GAP = 25;

/*========================
      CARD WIDTH
========================*/

function cardWidth(){

    return cards[0].offsetWidth + GAP;

}

/*========================
      UPDATE DOTS
========================*/

function updateDots(){

    if(!dots.length) return;

    dots.forEach(dot=>dot.classList.remove("active"));

    dots[currentIndex % (cards.length/2)]
        ?.classList.add("active");

}

});
 /*====================================================
           CHAPCY V12 ULTRA SLIDER
                  PART 2
====================================================*/

/*========================
        GO TO SLIDE
========================*/

function goToSlide(index, smooth = true){

    currentIndex = index;

    slider.scrollTo({

        left: cardWidth() * currentIndex,

        behavior: smooth ? "smooth" : "instant"

    });

    updateDots();

}

/*========================
        NEXT SLIDE
========================*/

function nextSlide(){

    currentIndex++;

    goToSlide(currentIndex);

}

/*========================
      PREVIOUS SLIDE
========================*/

function prevSlide(){

    currentIndex--;

    if(currentIndex < 0){

        currentIndex = (cards.length / 2) - 1;

        goToSlide(currentIndex, false);

    }else{

        goToSlide(currentIndex);

    }

}

/*========================
     INFINITE LOOP
========================*/

slider.addEventListener("scroll", () => {

    const half = cards.length / 2;

    if(currentIndex >= half){

        currentIndex = 0;

        setTimeout(() => {

            goToSlide(currentIndex, false);

        }, 350);

    }

});

/*========================
      BUTTON EVENTS
========================*/

if(nextBtn){

    nextBtn.addEventListener("click", () => {

        nextSlide();

    });

}

if(prevBtn){

    prevBtn.addEventListener("click", () => {

        prevSlide();

    });

}
/*====================================================
           CHAPCY V12 ULTRA SLIDER
                  PART 3
====================================================*/


/*========================
        AUTO PLAY
========================*/

let autoPlay;

function startAutoPlay(){

    autoPlay = setInterval(()=>{

        nextSlide();

    },4000);

}


function stopAutoPlay(){

    clearInterval(autoPlay);

}



/*========================
   PAUSE WHEN HOVER
========================*/

slider.addEventListener("mouseenter",()=>{

    stopAutoPlay();

});


slider.addEventListener("mouseleave",()=>{

    startAutoPlay();

});



/*========================
   TOUCH CONTROL
========================*/

let startX = 0;
let endX = 0;


slider.addEventListener("touchstart",(e)=>{

    stopAutoPlay();

    startX = e.touches[0].clientX;

});



slider.addEventListener("touchmove",(e)=>{

    endX = e.touches[0].clientX;

});



slider.addEventListener("touchend",()=>{


    let distance = startX - endX;


    if(distance > 50){

        nextSlide();

    }


    if(distance < -50){

        prevSlide();

    }


    startAutoPlay();


});



/*========================
     MOUSE DRAG SLIDER
========================*/

let isDragging = false;
let dragStart = 0;


slider.addEventListener("mousedown",(e)=>{

    isDragging = true;

    dragStart = e.pageX;

    stopAutoPlay();

});



slider.addEventListener("mouseup",(e)=>{

    if(!isDragging) return;


    let distance = dragStart - e.pageX;


    if(distance > 50){

        nextSlide();

    }


    if(distance < -50){

        prevSlide();

    }


    isDragging = false;

    startAutoPlay();

});



slider.addEventListener("mouseleave",()=>{

    isDragging = false;

});



/*========================
      START SLIDER
========================*/

startAutoPlay();
/*====================================================
           CHAPCY V12 ULTRA SLIDER
                  PART 4
====================================================*/


/*========================
      ACTIVE CARD EFFECT
========================*/

function updateActiveCard(){

    const sliderCenter = slider.scrollLeft + 
                         (slider.offsetWidth / 2);


    cards.forEach(card=>{


        const cardCenter = card.offsetLeft + 
                           (card.offsetWidth / 2);


        const distance = Math.abs(
            sliderCenter - cardCenter
        );


        if(distance < card.offsetWidth / 2){


            card.classList.add("active");


        }else{


            card.classList.remove("active");


        }


    });

}



/*========================
     SCROLL UPDATE
========================*/

slider.addEventListener("scroll",()=>{

    updateActiveCard();

});



/*========================
     INITIAL ACTIVE
========================*/

setTimeout(()=>{

    updateActiveCard();

},500);



/*========================
    CENTER ACTIVE CARD
========================*/

function centerActiveCard(){


    const activeCard = document.querySelector(".active");


    if(activeCard){


        const position =
        activeCard.offsetLeft -
        (slider.offsetWidth / 2) +
        (activeCard.offsetWidth / 2);



        slider.scrollTo({

            left:position,

            behavior:"smooth"

        });


    }

}



/*========================
      CLICK CARD FOCUS
========================*/

cards.forEach(card=>{


    card.addEventListener("click",()=>{


        cards.forEach(c=>{

            c.classList.remove("active");

        });


        card.classList.add("active");


        centerActiveCard();


    });


});
