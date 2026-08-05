/*=========================================
      CHAPCY V100 AUTO SLIDER
      2.5 SECONDS
=========================================*/

const track = document.querySelector(".slider-track");
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


        if(index === (current - 1 + cards.length) % cards.length){

            card.classList.add("left");

        }


        if(index === (current + 1) % cards.length){

            card.classList.add("right");

        }


    });


    const active = cards[current];


    if(active){

        track.scrollTo({

            left:
            active.offsetLeft -
            track.offsetWidth / 2 +
            active.offsetWidth / 2,

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



updateSlider();


setInterval(autoSlide,2500);
