/*=========================================
      CHAPCY AUTO SLIDER FIX
      2.5 SECONDS
=========================================*/

const track = document.querySelector(".slider-track");
const cards = document.querySelectorAll(".group-card");

let index = 0;


function autoMove(){

    index++;


    if(index >= cards.length){
        index = 0;
    }


    const cardWidth = cards[0].offsetWidth + 30;


    track.scrollTo({

        left:index * cardWidth,

        behavior:"smooth"

    });


}



setInterval(autoMove,2500);


    const activeCard = cards[current];


    if(activeCard){

        slider.scrollTo({

            left:
            activeCard.offsetLeft -
            slider.offsetWidth / 2 +
            activeCard.offsetWidth / 2,


            behavior:"smooth"

        });

    }

}




function autoSlide(){


    current++;


    if(current >= cards.length){

        current = 0;

    }


    updateSlider();


}




// START

updateSlider();


// MOVE EVERY 2.5 SEC

setInterval(
    autoSlide,
    2500
);
const cards = document.querySelectorAll(".group-card");

let current = 0;


function moveSlider(){

    cards.forEach(card=>{
        card.classList.remove("active","left","right");
    });


    cards[current].classList.add("active");


    let left = (current - 1 + cards.length) % cards.length;
    let right = (current + 1) % cards.length;


    cards[left].classList.add("left");
    cards[right].classList.add("right");


    current++;

    if(current >= cards.length){
        current = 0;
    }

}


moveSlider();


setInterval(moveSlider,2500);
