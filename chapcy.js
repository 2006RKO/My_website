/*=========================================
        CHAPCY PREMIUM JAVASCRIPT
=========================================*/

/*=========================
      GROUPS CAROUSEL
==========================*/

const slider = document.querySelector(".slider-track");
const dots = document.querySelectorAll(".dot");

let current = 0;
const cardWidth = 305; // upana wa card + gap

function updateDots() {
    dots.forEach(dot => dot.classList.remove("active"));

    if (dots.length > 0) {
        dots[current % dots.length].classList.add("active");
    }
}

function nextSlide() {
    if (!slider) return;

    current++;

    slider.scrollTo({
        left: current * cardWidth,
        behavior: "smooth"
    });

    if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 20) {
        current = 0;

        setTimeout(() => {
            slider.scrollTo({
                left: 0,
                behavior: "smooth"
            });
        }, 500);
    }

    updateDots();
}

function previousSlide() {
    if (!slider) return;

    current--;

    if (current < 0) {
        current = 0;
    }

    slider.scrollTo({
        left: current * cardWidth,
        behavior: "smooth"
    });

    updateDots();
}

/* Auto Slide */

if (slider) {

    setInterval(nextSlide, 4000);

}

/*=========================
      STATS SCROLL
==========================*/

const stats = document.querySelector(".stats");

function moveRight() {

    if (stats) {

        stats.scrollBy({
            left: 300,
            behavior: "smooth"
        });

    }

}

function moveLeft() {

    if (stats) {

        stats.scrollBy({
            left: -300,
            behavior: "smooth"
        });

    }

}

if (stats) {

    setInterval(() => {

        stats.scrollBy({
            left: 250,
            behavior: "smooth"
        });

        if (stats.scrollLeft >= stats.scrollWidth - stats.clientWidth) {

            stats.scrollTo({
                left: 0,
                behavior: "smooth"
            });

        }

    }, 5000);

}

/*=========================
      HEADER EFFECT
==========================*/

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 50) {

        header.style.background = "rgba(5,10,30,.95)";
        header.style.boxShadow = "0 10px 25px rgba(0,0,0,.4)";

    } else {

        header.style.background = "rgba(5,10,30,.75)";
        header.style.boxShadow = "none";

    }

});

/*=========================
      RIPPLE
==========================*/

document.querySelectorAll(".btn,.join-btn").forEach(button => {

    button.addEventListener("click", function(e) {

        const ripple = document.createElement("span");

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.width = size + "px";
        ripple.style.height = size + "px";
        ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
        ripple.style.top = (e.clientY - rect.top - size / 2) + "px";

        ripple.classList.add("ripple");

        this.appendChild(ripple);

        setTimeout(() => {

            ripple.remove();

        }, 700);

    });

});

/*=========================
      FADE IN
==========================*/

window.onload = () => {

    document.body.style.opacity = "1";

};

document.body.style.opacity = "0";
document.body.style.transition = "opacity .8s ease";

/*=========================
      SCROLL REVEAL
==========================*/

const reveal = document.querySelectorAll(
".hero-card,.global-card,.tv-card,.group-card,.stat-box"
);

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

        }

    });

});

reveal.forEach(item => {

    item.style.opacity = "0";
    item.style.transform = "translateY(40px)";
    item.style.transition = ".7s";

    observer.observe(item);

});
