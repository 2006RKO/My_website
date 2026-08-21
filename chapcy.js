/* =========================================================
   CHAPCY V9 COMPLETE
   3D GROUP SLIDESHOW + CARD TRANSITIONS
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


    /* =====================================================
       GET ALL CARDS
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

    const DESKTOP_GAP = 24;

    const MOBILE_GAP = 14;


    /* =====================================================
       GET CURRENT GAP
       ===================================================== */

    function getGap() {

        return window.innerWidth <= 700
            ? MOBILE_GAP
            : DESKTOP_GAP;

    }


    /* =====================================================
       CENTER ACTIVE CARD
       ===================================================== */

    function updateSlider(animate = true) {

        if (!cards.length) return;

        const wrapper =
            slider.querySelector(".slider-wrapper");

        if (!wrapper) return;

        const wrapperWidth =
            wrapper.getBoundingClientRect().width;

        const cardWidth =
            cards[0].getBoundingClientRect().width;

        const gap = getGap();

        const cardStep =
            cardWidth + gap;

        /*
         * Position active card
         * exactly in the center.
         */

        const centerPosition =
            (wrapperWidth - cardWidth) / 2;

        const translateX =
            centerPosition -
            (currentIndex * cardStep);


        /* Animation */

        if (animate) {

            track.style.transition =
                "transform .75s cubic-bezier(.22,.61,.36,1)";

        } else {

            track.style.transition =
                "none";

        }


        track.style.transform =
            `translate3d(${translateX}px, 0, 0)`;


        /* =================================================
           ACTIVE CARD
           ================================================= */

        cards.forEach((card, index) => {

            card.classList.toggle(
                "active",
                index === currentIndex
            );

        });

    }


    /* =====================================================
       NEXT SLIDE
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
       PREVIOUS SLIDE
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
       BUTTON EVENTS
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

                currentIndex++;

                if (currentIndex >= cards.length) {

                    currentIndex = 0;

                }

                updateSlider(true);

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
       PAUSE WHEN MOUSE ENTERS
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

    let touchEndX = 0;

    let touchStartY = 0;

    let touchEndY = 0;


    slider.addEventListener(
        "touchstart",
        (event) => {

            if (!event.touches.length) return;

            touchStartX =
                event.touches[0].clientX;

            touchStartY =
                event.touches[0].clientY;

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


            /*
             * Only treat it as a swipe if
             * horizontal movement is greater
             * than vertical movement.
             */

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
            touchEndX = 0;
            touchStartY = 0;
            touchEndY = 0;


            startAutoplay();

        }
    );


    /* =====================================================
       KEYBOARD CONTROLS
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            /*
             * Don't control slider while
             * typing in an input.
             */

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

                /*
                 * Don't trigger card animation
                 * when Join Group or Payment
                 * button is clicked.
                 */

                if (
                    event.target.closest(".join-btn") ||
                    event.target.closest(".payment-btn")
                ) {

                    return;

                }


                if (isAnimating) return;


                isAnimating = true;

                stopAutoplay();


                /* =========================================
                   MAKE CLICKED CARD CENTER
                   ========================================= */

                currentIndex = index;

                updateSlider(true);


                /*
                 * Wait for the card to reach
                 * the center position.
                 */

                setTimeout(() => {

                    /*
                     * Save selected group.
                     */

                    sessionStorage.setItem(
                        "chapcySelectedGroup",
                        String(index)
                    );


                    /*
                     * Save current slide.
                     */

                    sessionStorage.setItem(
                        "chapcySlideIndex",
                        String(index)
                    );


                    /*
                     * Save that we are leaving
                     * the slideshow.
                     */

                    sessionStorage.setItem(
                        "chapcyLeavingGroup",
                        "true"
                    );


                    /*
                     * Add ENTER animation.
                     */

                    card.classList.add(
                        "card-enter"
                    );


                }, 700);


                /*
                 * Wait for the 3-rotation animation
                 * to finish.
                 */

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


        /*
         * Remove emojis and symbols.
         */

        title =
            title
                .replace(/[^\w\s-]/gi, "")
                .trim();


        /*
         * Convert spaces to -
         */

        title =
            title.replace(/\s+/g, "-");


        /*
         * Examples:
         *
         * Sporty Group
         * -> sporty-group.html
         *
         * Music Group
         * -> music-group.html
         */

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


        /*
         * Get previous slide index.
         */

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

            startAutoplay();

            return;

        }


        /*
         * Restore slide.
         */

        currentIndex =
            savedIndex;


        /*
         * Put card in center
         * without animation first.
         */

        updateSlider(false);


        const selectedCard =
            cards[currentIndex];


        if (!selectedCard) {

            startAutoplay();

            return;

        }


        /*
         * Remove any old classes.
         */

        selectedCard.classList.remove(
            "active"
        );

        selectedCard.classList.remove(
            "card-enter"
        );

        selectedCard.classList.remove(
            "card-exit"
        );


        /*
         * Force browser reflow.
         * This makes the reverse animation
         * start correctly.
         */

        void selectedCard.offsetWidth;


        /*
         * Add reverse animation.
         */

        selectedCard.classList.add(
            "card-exit"
        );


        /*
         * After animation finishes,
         * return to normal slideshow.
         */

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

            /*
             * Small delay gives the browser
             * time to restore the page.
             */

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
       PREVENT IMAGE DRAGGING
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


    /*
     * Check if we came back
     * from a group page.
     */

    const returning =
        sessionStorage.getItem(
            "chapcyLeavingGroup"
        );


    if (returning !== "true") {

        startAutoplay();

    }

});
