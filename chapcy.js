/*=========================================
        CHAPCY V100 AUTO SLIDER
        AUTO MOVE 2.5 SECONDS
=========================================*/


const slider = document.querySelector(".slider-track");
const cards = document.querySelectorAll(".group-card");


let current = 0;



function updateSlider(){

    cards.forEach((card,index)=>{

        card.classList.remove(
            "active",
            "left",
            "right"
        );


        if(index === current){

            card.classList.add("active");

        }

        else if(
            index === (current - 1 + cards.length) % cards.length
        ){

            card.classList.add("left");

        }

        else if(
            index === (current + 1) % cards.length
        ){

            card.classList.add("right");

        }


    });



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
