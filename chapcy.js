/*==========================================
      CHAPCY WORLDWIDE LIVE CHAT
            JAVASCRIPT PART 1
==========================================*/

/* ==========================
      GROUP SLIDESHOW
========================== */

const slides = document.querySelectorAll(".group-slide");
const dots = document.querySelectorAll(".dot");

let currentSlide = 0;
let slideInterval;

/* Show Slide */

function showSlide(index){

    slides.forEach((slide)=>{
        slide.classList.remove("active");
    });

    dots.forEach((dot)=>{
        dot.classList.remove("active");
    });

    if(slides[index]){
        slides[index].classList.add("active");
    }

    if(dots[index]){
        dots[index].classList.add("active");
    }

}

/* Next Slide */

function nextSlide(){

    currentSlide++;

    if(currentSlide >= slides.length){
        currentSlide = 0;
    }

    showSlide(currentSlide);

}

/* Previous Slide */

function previousSlide(){

    currentSlide--;

    if(currentSlide < 0){
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);

}

/* Auto Slide */

function startSlider(){

    slideInterval = setInterval(nextSlide,4500);

}

/* Stop Slider */

function stopSlider(){

    clearInterval(slideInterval);

}

/* Click Dots */

dots.forEach((dot,index)=>{

    dot.addEventListener("click",()=>{

        currentSlide = index;

        showSlide(currentSlide);

        stopSlider();

        startSlider();

    });

});

/* Pause on Hover */

const slideshow = document.querySelector(".slideshow");

if(slideshow){

    slideshow.addEventListener("mouseenter",stopSlider);

    slideshow.addEventListener("mouseleave",startSlider);

}

/* Start */

if(slides.length > 0){

    showSlide(currentSlide);

    startSlider();

}
/*==========================================
        CHAPCY JAVASCRIPT PART 2
      STATS AUTO CAROUSEL
==========================================*/

const stats = document.querySelector(".stats");

let statsDirection = 1;
let statsInterval;

/* Move Right */

function moveRight(){

    if(!stats) return;

    stats.scrollBy({
        left:320,
        behavior:"smooth"
    });

}

/* Move Left */

function moveLeft(){

    if(!stats) return;

    stats.scrollBy({
        left:-320,
        behavior:"smooth"
    });

}

/* Auto Scroll */

function startStats(){

    statsInterval = setInterval(()=>{

        if(!stats) return;

        if(statsDirection === 1){

            stats.scrollBy({
                left:320,
                behavior:"smooth"
            });

            if(stats.scrollLeft + stats.clientWidth >= stats.scrollWidth - 10){

                statsDirection = -1;

            }

        }else{

            stats.scrollBy({
                left:-320,
                behavior:"smooth"
            });

            if(stats.scrollLeft <= 10){

                statsDirection = 1;

            }

        }

    },4500);

}

/* Stop Auto Scroll */

function stopStats(){

    clearInterval(statsInterval);

}

/* Pause on Hover */

if(stats){

    stats.addEventListener("mouseenter",stopStats);

    stats.addEventListener("mouseleave",startStats);

}

/* Touch Support */

let startX = 0;

if(stats){

    stats.addEventListener("touchstart",(e)=>{

        startX = e.touches[0].clientX;

    });

    stats.addEventListener("touchend",(e)=>{

        let endX = e.changedTouches[0].clientX;

        if(startX - endX > 50){

            moveRight();

        }

        if(endX - startX > 50){

            moveLeft();

        }

    });

}

/* Start */

startStats();
/*==========================================
      CHAPCY JAVASCRIPT PART 3
      PREMIUM ANIMATIONS
==========================================*/


/* ==========================
   PAGE FADE IN
========================== */

window.addEventListener("load",()=>{

    document.body.style.opacity="1";

});

document.body.style.opacity="0";
document.body.style.transition="opacity .8s ease";


/* ==========================
   LOADING SCREEN
========================== */

const loader=document.querySelector(".loader");

window.addEventListener("load",()=>{

    if(loader){

        loader.style.opacity="0";

        setTimeout(()=>{

            loader.style.display="none";

        },700);

    }

});


/* ==========================
   COUNT UP ANIMATION
========================== */

const counters=document.querySelectorAll(".stat-box h3");

const speed=80;

counters.forEach(counter=>{

    const update=()=>{

        const target=parseInt(counter.innerText.replace(/,/g,""));

        const current=parseInt(counter.dataset.count)||0;

        const increment=Math.ceil(target/speed);

        if(current<target){

            const value=current+increment;

            counter.dataset.count=value;

            counter.innerText=value.toLocaleString()+"+";

            requestAnimationFrame(update);

        }else{

            counter.innerText=target.toLocaleString()+"+";

        }

    };

    update();

});


/* ==========================
   SCROLL REVEAL
========================== */

const revealItems=document.querySelectorAll(

".card,.hero-card,.group-slide,.stat-box"

);

const observer=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.opacity="1";

            entry.target.style.transform="translateY(0)";

        }

    });

},{
    threshold:.2
});

revealItems.forEach(item=>{

    item.style.opacity="0";

    item.style.transform="translateY(50px)";

    item.style.transition=".8s";

    observer.observe(item);

});


/* ==========================
   RIPPLE BUTTON EFFECT
========================== */

document.querySelectorAll(".btn,.join-btn").forEach(button=>{

button.addEventListener("click",function(e){

const ripple=document.createElement("span");

const size=Math.max(this.clientWidth,this.clientHeight);

const rect=this.getBoundingClientRect();

ripple.style.width=size+"px";

ripple.style.height=size+"px";

ripple.style.left=(e.clientX-rect.left-size/2)+"px";

ripple.style.top=(e.clientY-rect.top-size/2)+"px";

ripple.className="ripple";

this.appendChild(ripple);

setTimeout(()=>{

ripple.remove();

},700);

});

});


/* ==========================
   ACTIVE HEADER ON SCROLL
========================== */

const header=document.querySelector(".header");

window.addEventListener("scroll",()=>{

if(window.scrollY>40){

header.style.background="rgba(5,10,25,.95)";
header.style.boxShadow="0 5px 25px rgba(0,0,0,.5)";

}else{

header.style.background="rgba(8,15,35,.82)";
header.style.boxShadow="none";

}

});
