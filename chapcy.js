/* =========================================================
   CHAPCY V10
   3D GROUP SLIDESHOW
   FIXED CENTER + LAST CARDS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const track = document.getElementById("sliderTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const slider = document.querySelector(".group-slider");

    if (!track || !prevBtn || !nextBtn || !slider) {
        console.warn("CHAPCY Slider: Required elements not found.");
        return;
    }

    const wrapper = slider.querySelector(".slider-wrapper");

    if (!wrapper) {
        console.warn("CHAPCY Slider: .slider-wrapper not found.");
        return;
    }


    /* =====================================================
       CARDS
       ===================================================== */

    const cards = Array.from(
        track.querySelectorAll(".group-card")
    );

    if (!cards.length) {
        console.warn("CHAPCY Slider: No group cards found.");
        return;
    }


    /* =====================================================
       SETTINGS
       ===================================================== */

    let currentIndex = 0;

    let autoplay = null;

    let isAnimating = false;

    const AUTO_PLAY_TIME = 4000;


    /* =====================================================
       GET REAL CARD POSITION
       ===================================================== */

    function getCardCenter(card) {

        /*
         * offsetLeft / offsetWidth are NOT affected
         * by CSS transform:scale()
         *
         * This is the important fix.
         */

        return (
            card.offsetLeft +
            (card.offsetWidth / 2)
        );

    }


    /* =====================================================
       UPDATE SLIDER
       ===================================================== */

    function updateSlider(animate = true) {

        if (!cards.length) return;

        const wrapperWidth =
            wrapper.clientWidth;

        const activeCard =
            cards[currentIndex];

        if (!activeCard) return;


        /* ================================================
           FIND EXACT CENTER OF ACTIVE CARD
           ================================================ */

        const cardCenter =
            getCardCenter(activeCard);


        const wrapperCenter =
            wrapperWidth / 2;


        /*
         * Move track so the selected card
         * is EXACTLY in the middle.
         */

        const translateX =
            wrapperCenter -
            cardCenter;


        /* ================================================
           TRANSITION
           ================================================ */

        if (animate) {

            track.style.transition =
                "transform .75s cubic-bezier(.22,.61,.36,1)";

        } else {

            track.style.transition =
                "none";

        }


        /* ================================================
           MOVE TRACK
           ================================================ */

        track.style.transform =
            `translate3d(${translateX}px, 0, 0)`;


        /* ================================================
           ACTIVE CARD
           ================================================ */

        cards.forEach((card, index) => {

            card.classList.toggle(
                "active",
                index === currentIndex
            );

        });

    }


    /* =====================================================
       NEXT
       ===================================================== */

    function nextSlide() {

        if (isAnimating) return;

        currentIndex++;

        if (currentIndex >= cards.length) {

            currentIndex = 0;

        }

        updateSlider(true);

    }


    /* =====================================================
       PREVIOUS
       ===================================================== */

    function previousSlide() {

        if (isAnimating) return;

        currentIndex--;

        if (currentIndex < 0) {

            currentIndex =
                cards.length - 1;

        }

        updateSlider(true);

    }


    /* =====================================================
       BUTTONS
       ===================================================== */

    nextBtn.addEventListener(
        "click",
        () => {

            nextSlide();

            restartAutoplay();

        }
    );


    prevBtn.addEventListener(
        "click",
        () => {

            previousSlide();

            restartAutoplay();

        }
    );


    /* =====================================================
       AUTOPLAY
       ===================================================== */

    function startAutoplay() {

        stopAutoplay();

        autoplay = setInterval(() => {

            if (!isAnimating) {

                nextSlide();

            }

        }, AUTO_PLAY_TIME);

    }


    function stopAutoplay() {

        if (autoplay !== null) {

            clearInterval(autoplay);

            autoplay = null;

        }

    }


    function restartAutoplay() {

        stopAutoplay();

        startAutoplay();

    }


    /* =====================================================
       MOUSE PAUSE
       ===================================================== */

    slider.addEventListener(
        "mouseenter",
        () => {

            stopAutoplay();

        }
    );


    slider.addEventListener(
        "mouseleave",
        () => {

            if (!isAnimating) {

                startAutoplay();

            }

        }
    );


    /* =====================================================
       TOUCH SWIPE
       ===================================================== */

    let touchStartX = 0;
    let touchStartY = 0;

    let touchEndX = 0;
    let touchEndY = 0;


    slider.addEventListener(
        "touchstart",
        (event) => {

            if (!event.touches.length) return;

            touchStartX =
                event.touches[0].clientX;

            touchStartY =
                event.touches[0].clientY;

            touchEndX = touchStartX;
            touchEndY = touchStartY;

            stopAutoplay();

        },
        {
            passive: true
        }
    );


    slider.addEventListener(
        "touchmove",
        (event) => {

            if (!event.touches.length) return;

            touchEndX =
                event.touches[0].clientX;

            touchEndY =
                event.touches[0].clientY;

        },
        {
            passive: true
        }
    );


    slider.addEventListener(
        "touchend",
        () => {

            const horizontalDistance =
                touchStartX - touchEndX;

            const verticalDistance =
                touchStartY - touchEndY;


            const swipeDistance = 50;


            if (
                Math.abs(horizontalDistance) >
                Math.abs(verticalDistance)
            ) {

                if (
                    Math.abs(horizontalDistance) >
                    swipeDistance
                ) {

                    if (horizontalDistance > 0) {

                        nextSlide();

                    } else {

                        previousSlide();

                    }

                }

            }


            touchStartX = 0;
            touchStartY = 0;

            touchEndX = 0;
            touchEndY = 0;


            startAutoplay();

        }
    );


    /* =====================================================
       KEYBOARD
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            const activeElement =
                document.activeElement;

            const typing =
                activeElement &&
                (
                    activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA" ||
                    activeElement.tagName === "SELECT"
                );


            if (typing) return;


            if (event.key === "ArrowRight") {

                nextSlide();

                restartAutoplay();

            }


            if (event.key === "ArrowLeft") {

                previousSlide();

                restartAutoplay();

            }

        }
    );


    /* =====================================================
       CARD CLICK
       ===================================================== */

    cards.forEach((card, index) => {

        card.addEventListener(
            "click",
            (event) => {

                if (
                    event.target.closest(".join-btn") ||
                    event.target.closest(".payment-btn")
                ) {

                    return;

                }


                if (isAnimating) return;


                /*
                 * If another card was clicked,
                 * first bring it to center.
                 */

                if (currentIndex !== index) {

                    currentIndex = index;

                    updateSlider(true);

                    restartAutoplay();

                    return;

                }


                /* =========================================
                   OPEN GROUP
                   ========================================= */

                isAnimating = true;

                stopAutoplay();


                currentIndex = index;

                updateSlider(true);


                setTimeout(() => {

                    sessionStorage.setItem(
                        "chapcySelectedGroup",
                        String(index)
                    );


                    sessionStorage.setItem(
                        "chapcySlideIndex",
                        String(index)
                    );


                    sessionStorage.setItem(
                        "chapcyLeavingGroup",
                        "true"
                    );


                    card.classList.add(
                        "card-enter"
                    );

                }, 700);


                setTimeout(() => {

                    const destination =
                        card.dataset.url ||
                        getGroupURL(card);


                    window.location.href =
                        destination;

                }, 2200);

            }
        );

    });


    /* =====================================================
       FIND GROUP URL
       ===================================================== */

    function getGroupURL(card) {

        const titleElement =
            card.querySelector("h3");

        if (!titleElement) {

            return "group-details.html";

        }


        let title =
            titleElement.textContent
                .trim()
                .toLowerCase();


        title =
            title
                .replace(/[^\w\s-]/gi, "")
                .trim();


        title =
            title.replace(/\s+/g, "-");


        return `${title}.html`;

    }


    /* =====================================================
       RETURN FROM GROUP
       ===================================================== */

    function handleReturnAnimation() {

        const returning =
            sessionStorage.getItem(
                "chapcyLeavingGroup"
            );


        if (returning !== "true") {

            return;

        }


        const savedIndex =
            parseInt(
                sessionStorage.getItem(
                    "chapcySlideIndex"
                ),
                10
            );


        if (
            Number.isNaN(savedIndex) ||
            savedIndex < 0 ||
            savedIndex >= cards.length
        ) {

            sessionStorage.removeItem(
                "chapcyLeavingGroup"
            );

            isAnimating = false;

            startAutoplay();

            return;

        }


        currentIndex =
            savedIndex;


        /*
         * Put correct card in center immediately.
         */

        updateSlider(false);


        const selectedCard =
            cards[currentIndex];


        if (!selectedCard) {

            isAnimating = false;

            startAutoplay();

            return;

        }


        /*
         * Keep active state.
         */

        selectedCard.classList.remove(
            "card-enter"
        );

        selectedCard.classList.remove(
            "card-exit"
        );


        void selectedCard.offsetWidth;


        selectedCard.classList.add(
            "card-exit"
        );


        setTimeout(() => {

            selectedCard.classList.remove(
                "card-exit"
            );


            updateSlider(true);


            isAnimating = false;


            sessionStorage.removeItem(
                "chapcyLeavingGroup"
            );


            startAutoplay();

        }, 1550);

    }


    /* =====================================================
       PAGE SHOW
       ===================================================== */

    window.addEventListener(
        "pageshow",
        () => {

            setTimeout(() => {

                handleReturnAnimation();

            }, 100);

        }
    );


    /* =====================================================
       RESIZE
       ===================================================== */

    let resizeTimer = null;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);


            resizeTimer = setTimeout(() => {

                updateSlider(false);

            }, 150);

        }
    );


    /* =====================================================
       PREVENT IMAGE DRAG
       ===================================================== */

    cards.forEach((card) => {

        const image =
            card.querySelector("img");

        if (image) {

            image.addEventListener(
                "dragstart",
                (event) => {

                    event.preventDefault();

                }
            );

        }

    });


    /* =====================================================
       INITIALIZE
       ===================================================== */

    updateSlider(false);


    const returning =
        sessionStorage.getItem(
            "chapcyLeavingGroup"
        );


    if (returning !== "true") {

        startAutoplay();

    }

});
