document.addEventListener("DOMContentLoaded", function () {

    const track = document.getElementById("sliderTrack");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const wrapper = document.querySelector(".slider-wrapper");

    if (!track || !nextBtn || !prevBtn || !wrapper) {
        console.error("CHAPCY SLIDER: HTML elements hazijapatikana.");
        return;
    }

    const cards = Array.from(
        track.querySelectorAll(".group-card")
    );

    if (cards.length === 0) {
        console.error("CHAPCY SLIDER: Hakuna cards.");
        return;
    }

    let current = 0;
    let autoSlide;


    /* =========================================
       GET CARD POSITION
    ========================================= */

    function getCardStep() {

        const card = cards[0];

        const cardWidth = card.getBoundingClientRect().width;

        const trackStyle = window.getComputedStyle(track);

        const gap = parseFloat(trackStyle.gap) || 0;

        return cardWidth + gap;
    }


    /* =========================================
       MOVE SLIDER
    ========================================= */

    function showSlide(index) {

        current = index;

        if (current < 0) {
            current = cards.length - 1;
        }

        if (current >= cards.length) {
            current = 0;
        }

        const step = getCardStep();

        const wrapperWidth =
            wrapper.getBoundingClientRect().width;

        const cardWidth =
            cards[0].getBoundingClientRect().width;


        /*
         * CENTER CARD
         */

        const centerOffset =
            (wrapperWidth - cardWidth) / 2;


        const move =
            centerOffset - (current * step);


        /*
         * MOVE TRACK
         */

        track.style.transform =
            `translate3d(${move}px, 0, 0)`;


        /*
         * ACTIVE CARD
         */

        cards.forEach((card, i) => {

            if (i === current) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }

        });

    }


    /* =========================================
       NEXT
    ========================================= */

    function nextSlide() {

        showSlide(current + 1);

    }


    /* =========================================
       PREVIOUS
    ========================================= */

    function previousSlide() {

        showSlide(current - 1);

    }


    /* =========================================
       BUTTONS
    ========================================= */

    nextBtn.addEventListener("click", function () {

        nextSlide();

        restartAuto();

    });


    prevBtn.addEventListener("click", function () {

        previousSlide();

        restartAuto();

    });


    /* =========================================
       AUTO SLIDE
    ========================================= */

    function startAuto() {

        clearInterval(autoSlide);

        autoSlide = setInterval(function () {

            nextSlide();

        }, 3500);

    }


    function stopAuto() {

        clearInterval(autoSlide);

    }


    function restartAuto() {

        stopAuto();

        startAuto();

    }


    /* =========================================
       PAUSE WHEN TOUCHING
    ========================================= */

    wrapper.addEventListener(
        "mouseenter",
        stopAuto
    );


    wrapper.addEventListener(
        "mouseleave",
        startAuto
    );


    /* =========================================
       MOBILE SWIPE
    ========================================= */

    let touchStart = 0;
    let touchEnd = 0;


    wrapper.addEventListener(
        "touchstart",
        function (e) {

            touchStart =
                e.touches[0].clientX;

            stopAuto();

        },
        { passive: true }
    );


    wrapper.addEventListener(
        "touchend",
        function (e) {

            touchEnd =
                e.changedTouches[0].clientX;

            const distance =
                touchStart - touchEnd;


            if (Math.abs(distance) > 50) {

                if (distance > 0) {

                    nextSlide();

                } else {

                    previousSlide();

                }

            }

            startAuto();

        },
        { passive: true }
    );


    /* =========================================
       KEYBOARD
    ========================================= */

    document.addEventListener(
        "keydown",
        function (e) {

            if (e.key === "ArrowRight") {

                nextSlide();

                restartAuto();

            }

            if (e.key === "ArrowLeft") {

                previousSlide();

                restartAuto();

            }

        }
    );


    /* =========================================
       RESIZE
    ========================================= */

    window.addEventListener(
        "resize",
        function () {

            showSlide(current);

        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    showSlide(0);

    startAuto();


    console.log(
        "🔥 CHAPCY SLIDESHOW RUNNING:",
        cards.length,
        "cards"
    );

});
