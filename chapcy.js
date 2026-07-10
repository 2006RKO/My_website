//================ CHAPCY PREMIUM SLIDER ================

const slider = document.getElementById("groupSlider");
const cards = document.querySelectorAll(".group-card");
const dots = document.querySelectorAll(".dot");

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let current = 0;

function getCardWidth() {
    return cards[0].offsetWidth + 25;
}

function updateSlider() {

    slider.style.transform =
        `translateX(-${current * getCardWidth()}px)`;

    cards.forEach(card => {
        card.classList.remove("active-card");
    });

    cards[current].classList.add("active-card");

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    if (dots[current]) {
        dots[current].classList.add("active");
    }

}

function nextSlide() {

    current++;

    if (current >= cards.length) {

        current = 0;

    }

    updateSlider();

}

function prevSlide() {

    current--;

    if (current < 0) {

        current = cards.length - 1;

    }

    updateSlider();

}

nextBtn.onclick = nextSlide;

prevBtn.onclick = prevSlide;

//================ AUTO SLIDER ================

setInterval(nextSlide,3000);

//================ DOTS =================

dots.forEach((dot,index)=>{

dot.onclick=()=>{

current=index;

updateSlider();

}

});

//================ TOUCH SWIPE ================

let startX=0;

slider.addEventListener("touchstart",(e)=>{

startX=e.touches[0].clientX;

});

slider.addEventListener("touchend",(e)=>{

let endX=e.changedTouches[0].clientX;

if(startX-endX>50){

nextSlide();

}

if(endX-startX>50){

prevSlide();

}

});

//================ START =================

updateSlider();
