 /*====================================================
              CHAPCY V11 ULTRA JAVASCRIPT
                    PART 1
====================================================*/

"use strict";


/*========================
        INITIALIZE
========================*/

document.addEventListener("DOMContentLoaded",()=>{


/*========================
      GET ELEMENTS
========================*/


const slider = document.getElementById("groupSlider");

const cards = document.querySelectorAll(".group-card");

const nextBtn = document.querySelector(".next-btn");

const prevBtn = document.querySelector(".prev-btn");

const dots = document.querySelectorAll(".dot");



/*========================
        CHECK SLIDER
========================*/

if(!slider){

    console.log("CHAPCY Slider not found");

    return;

}



/*========================
       VARIABLES
========================*/


let currentIndex = 0;

let autoSlide;

let isDragging = false;

let startX = 0;

let scrollStart = 0;



/*========================
       CARD WIDTH
========================*/


const getCardWidth = ()=>{

    if(cards.length > 0){

        return cards[0].offsetWidth + 30;

    }

    return 0;

};



/*========================
       EXPORT DATA
========================*/


window.CHAPCY = {

    slider,

    cards,

    dots,

    nextBtn,

    prevBtn,

    currentIndex,

    getCardWidth,

    startAuto:null

};



});
 /*====================================================
              CHAPCY V11 ULTRA JAVASCRIPT
                    PART 2
====================================================*/


/*========================
      SLIDE FUNCTION
========================*/


function goToSlide(index){

    if(index < 0){

        index = cards.length - 1;

    }


    if(index >= cards.length){

        index = 0;

    }


    currentIndex = index;


    slider.scrollTo({

        left: getCardWidth() * currentIndex,

        behavior:"smooth"

    });


    updateDots();

}



/*========================
        NEXT BUTTON
========================*/


if(nextBtn){

nextBtn.addEventListener("click",()=>{


    goToSlide(currentIndex + 1);


});

}



/*========================
        PREVIOUS BUTTON
========================*/


if(prevBtn){

prevBtn.addEventListener("click",()=>{


    goToSlide(currentIndex - 1);


});

}



/*========================
      UPDATE DOTS
========================*/


function updateDots(){


    dots.forEach((dot,index)=>{


        dot.classList.remove("active");


        if(index === currentIndex){

            dot.classList.add("active");

        }


    });


}
 /*====================================================
              CHAPCY V11 ULTRA JAVASCRIPT
                    PART 3
====================================================*/


/*========================
        AUTO SLIDE
========================*/


function startAutoSlide(){


    autoSlide = setInterval(()=>{


        goToSlide(currentIndex + 1);


    },4000);


}



/*========================
        STOP SLIDE
========================*/


function stopAutoSlide(){


    clearInterval(autoSlide);


}



/*========================
       START SLIDER
========================*/


startAutoSlide();



/*========================
   PAUSE ON HOVER / TOUCH
========================*/


slider.addEventListener("mouseenter",()=>{


    stopAutoSlide();


});



slider.addEventListener("mouseleave",()=>{


    startAutoSlide();


});



slider.addEventListener("touchstart",()=>{


    stopAutoSlide();


});



slider.addEventListener("touchend",()=>{


    startAutoSlide();


});
/*====================================================
              CHAPCY V11 ULTRA JAVASCRIPT
                    PART 4
====================================================*/


/*========================
        DOT CONTROL
========================*/


dots.forEach((dot,index)=>{


    dot.addEventListener("click",()=>{


        stopAutoSlide();


        goToSlide(index);


        startAutoSlide();


    });


});



/*========================
   UPDATE SLIDE WHEN SCROLL
========================*/


slider.addEventListener("scroll",()=>{


    let position = slider.scrollLeft;


    let index = Math.round(
        position / getCardWidth()
    );


    if(index !== currentIndex){


        currentIndex = index;


        updateDots();


    }


});



/*========================
      INITIAL DOT
========================*/


updateDots();
 /*====================================================
              CHAPCY V11 ULTRA JAVASCRIPT
                    PART 5
====================================================*/


/*========================
        TOUCH SWIPE
========================*/


slider.addEventListener("touchstart",(e)=>{


    isDragging = true;


    startX = e.touches[0].clientX;


    scrollStart = slider.scrollLeft;


    stopAutoSlide();


});



slider.addEventListener("touchmove",(e)=>{


    if(!isDragging) return;


    let moveX = e.touches[0].clientX;


    let distance = startX - moveX;


    slider.scrollLeft = scrollStart + distance;



});



slider.addEventListener("touchend",()=>{


    isDragging = false;


    let index = Math.round(
        slider.scrollLeft / getCardWidth()
    );


    goToSlide(index);


    startAutoSlide();


});



/*========================
       MOUSE DRAG
========================*/


slider.addEventListener("mousedown",(e)=>{


    isDragging = true;


    startX = e.pageX;


    scrollStart = slider.scrollLeft;


    stopAutoSlide();


    slider.style.cursor="grabbing";


});



slider.addEventListener("mousemove",(e)=>{


    if(!isDragging) return;


    e.preventDefault();


    let distance = startX - e.pageX;


    slider.scrollLeft = scrollStart + distance;


});



slider.addEventListener("mouseup",()=>{


    isDragging=false;


    slider.style.cursor="grab";


    let index=Math.round(
        slider.scrollLeft / getCardWidth()
    );


    goToSlide(index);


    startAutoSlide();


});



slider.addEventListener("mouseleave",()=>{


    if(isDragging){


        isDragging=false;


        slider.style.cursor="grab";


    }


});
 /*====================================================
              CHAPCY V11 ULTRA JAVASCRIPT
                    PART 6
====================================================*/


/*========================
      KEYBOARD CONTROL
========================*/


document.addEventListener("keydown",(e)=>{


    if(e.key === "ArrowRight"){


        stopAutoSlide();


        goToSlide(currentIndex + 1);


        startAutoSlide();


    }



    if(e.key === "ArrowLeft"){


        stopAutoSlide();


        goToSlide(currentIndex - 1);


        startAutoSlide();


    }


});



/*========================
       WINDOW RESIZE
========================*/


window.addEventListener("resize",()=>{


    setTimeout(()=>{


        goToSlide(currentIndex);


    },300);


});



/*========================
      VISIBILITY CONTROL
========================*/


document.addEventListener("visibilitychange",()=>{


    if(document.hidden){


        stopAutoSlide();


    }else{


        startAutoSlide();


    }


});



/*========================
      CURSOR STYLE
========================*/


slider.style.cursor="grab";



/*========================
       FINAL START
========================*/


goToSlide(0);


console.log(
"🔥 CHAPCY V11 ULTRA SLIDER READY 🔥"
);
