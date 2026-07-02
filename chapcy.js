/* ==========================
   GROUP SLIDESHOW
========================== */

const slides = document.querySelectorAll(".group-slide");
const dots = document.querySelectorAll(".dot");

let currentSlide = 0;

function showSlide(index){

    slides.forEach(slide=>{
        slide.classList.remove("active");
    });

    dots.forEach(dot=>{
        dot.classList.remove("active");
    });

    slides[index].classList.add("active");
    dots[index].classList.add("active");
}

function nextSlide(){

    currentSlide++;

    if(currentSlide >= slides.length){
        currentSlide = 0;
    }

    showSlide(currentSlide);

}

showSlide(currentSlide);

setInterval(nextSlide,3000);


/* ==========================
   STATS BUTTONS
========================== */

const stats = document.querySelector(".stats");

function moveLeft(){

    stats.scrollBy({
        left:-300,
        behavior:"smooth"
    });

}

function moveRight(){

    stats.scrollBy({
        left:300,
        behavior:"smooth"
    });

}


/* ==========================
   AUTO STATS CAROUSEL
========================== */

let direction = 1;

setInterval(()=>{

    if(direction === 1){

        stats.scrollBy({
            left:300,
            behavior:"smooth"
        });

        if(stats.scrollLeft + stats.clientWidth >= stats.scrollWidth-5){

            direction = -1;

        }

    }else{

        stats.scrollBy({
            left:-300,
            behavior:"smooth"
        });

        if(stats.scrollLeft <=5){

            direction = 1;

        }

    }

},4000);


/* ==========================
   HERO FLOAT EFFECT
========================== */

const heroImage = document.querySelector(".hero-right img");

if(heroImage){

heroImage.addEventListener("mouseenter",()=>{

heroImage.style.transform="scale(1.04)";

});

heroImage.addEventListener("mouseleave",()=>{

heroImage.style.transform="scale(1)";

});

}


/* ==========================
   SMOOTH BUTTON EFFECT
========================== */

const buttons = document.querySelectorAll(".btn,.join-btn");

buttons.forEach(btn=>{

btn.addEventListener("mouseenter",()=>{

btn.style.transform="translateY(-4px)";

});

btn.addEventListener("mouseleave",()=>{

btn.style.transform="translateY(0)";

});

});
