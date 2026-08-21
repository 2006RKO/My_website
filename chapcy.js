/* =========================================================
        CHAPCY V21 ULTRA INFINITE SLIDER
        2.5 SEC AUTO
        RIGHT → LEFT
        TRUE INFINITE LOOP
        MOBILE + DESKTOP
        TOUCH + BUTTONS
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const wrapper = document.querySelector(".slider-wrapper");
    const track = document.getElementById("sliderTrack");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if (!wrapper || !track) {
        console.error("CHAPCY: Slider haijapatikana.");
        return;
    }


    /* =====================================================
                       ORIGINAL CARDS
    ===================================================== */

    const originalCards = [
        ...track.querySelectorAll(".group-card")
    ];

    const total = originalCards.length;

    if (total === 0) {
        console.error("CHAPCY: Hakuna group-card.");
        return;
    }


    /* =====================================================
                    CLONE CARDS
    ===================================================== */

    const beforeFragment =
        document.createDocumentFragment();

    const afterFragment =
        document.createDocumentFragment();


    originalCards.forEach(card => {

        const beforeClone =
            card.cloneNode(true);

        beforeClone.classList.add("carousel-clone");

        beforeFragment.appendChild(
            beforeClone
        );


        const afterClone =
            card.cloneNode(true);

        afterClone.classList.add("carousel-clone");

        afterFragment.appendChild(
            afterClone
        );

    });


    /* BEFORE */

    track.insertBefore(
        beforeFragment,
        track.firstChild
    );


    /* AFTER */

    track.appendChild(
        afterFragment
    );


    /* =====================================================
                         ALL CARDS
    ===================================================== */

    let cards = [
        ...track.querySelectorAll(".group-card")
    ];


    /*
       BEFORE SET
       0 → total - 1

       ORIGINAL SET
       total → total*2 - 1

       AFTER SET
       total*2 → total*3 - 1
    */

    let currentIndex = total;


    /* =====================================================
                         SETTINGS
    ===================================================== */

    const AUTO_TIME = 2500;
    const ANIMATION_TIME = 650;

    let autoTimer = null;
    let moving = false;


    /* =====================================================
                    REFRESH CARDS
    ===================================================== */

    function refreshCards() {

        cards = [
            ...track.querySelectorAll(".group-card")
        ];

    }


    /* =====================================================
                     GET CARD STEP
    ===================================================== */

    function getStep() {

        const card = cards[0];

        if (!card) return 0;

        const cardWidth =
            card.offsetWidth;

        const style =
            window.getComputedStyle(track);

        const gap =
            parseFloat(style.columnGap || style.gap) || 0;

        return cardWidth + gap;

    }


    /* =====================================================
                  GET CENTER POSITION
    ===================================================== */

    function getTranslateX(index) {

        const card = cards[index];

        if (!card) return 0;


        const step =
            getStep();


        const wrapperWidth =
            wrapper.clientWidth;


        const cardWidth =
            card.offsetWidth;


        const cardPosition =
            index * step;


        const cardCenter =
            cardPosition +
            cardWidth / 2;


        const wrapperCenter =
            wrapperWidth / 2;


        return wrapperCenter - cardCenter;

    }


    /* =====================================================
                       ACTIVE CARD
    ===================================================== */

    function updateActive() {

        cards.forEach(card => {

            card.classList.remove("active");

        });


        const activeCard =
            cards[currentIndex];


        if (activeCard) {

            activeCard.classList.add("active");

        }

    }


    /* =====================================================
                     MOVE TO CARD
    ===================================================== */

    function moveTo(
        index,
        animate = true
    ) {

        refreshCards();


        const x =
            getTranslateX(index);


        track.style.transition =
            animate
                ? `transform ${ANIMATION_TIME}ms cubic-bezier(.22,.61,.36,1)`
                : "none";


        track.style.transform =
            `translate3d(${x}px, 0, 0)`;


        updateActive();

    }


    /* =====================================================
                       NEXT SLIDE
    ===================================================== */

    function nextSlide() {

        if (moving) return;

        moving = true;


        currentIndex++;


        moveTo(
            currentIndex,
            true
        );


        setTimeout(() => {

            /*
              Tukiingia AFTER SET,
              tunarudi ORIGINAL SET.
            */

            if (
                currentIndex >=
                total * 2
            ) {

                currentIndex =
                    total;


                moveTo(
                    currentIndex,
                    false
                );

            }


            moving = false;

        }, ANIMATION_TIME + 30);

    }


    /* =====================================================
                    PREVIOUS SLIDE
    ===================================================== */

    function previousSlide() {

        if (moving) return;

        moving = true;


        currentIndex--;


        moveTo(
            currentIndex,
            true
        );


        setTimeout(() => {

            /*
              Tukiingia BEFORE SET,
              tunarudi mwisho wa ORIGINAL SET.
            */

            if (
                currentIndex <
                total
            ) {

                currentIndex =
                    total * 2 - 1;


                moveTo(
                    currentIndex,
                    false
                );

            }


            moving = false;

        }, ANIMATION_TIME + 30);

    }


    /* =====================================================
                    AUTO SLIDER
                    EVERY 2.5 SEC
    ===================================================== */

    function startAuto() {

        stopAuto();


        autoTimer =
            setInterval(() => {

                nextSlide();

            }, AUTO_TIME);

    }


    function stopAuto() {

        if (autoTimer !== null) {

            clearInterval(
                autoTimer
            );

            autoTimer = null;

        }

    }


    /* =====================================================
                       NEXT BUTTON
    ===================================================== */

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            () => {

                stopAuto();

                nextSlide();

                startAuto();

            }
        );

    }


    /* =====================================================
                      PREVIOUS BUTTON
    ===================================================== */

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            () => {

                stopAuto();

                previousSlide();

                startAuto();

            }
        );

    }


    /* =====================================================
                       TOUCH SWIPE
    ===================================================== */

    let touchStartX = 0;
    let touchStartY = 0;


    wrapper.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.touches[0].clientX;

            touchStartY =
                event.touches[0].clientY;

            stopAuto();

        },
        {
            passive: true
        }
    );


    wrapper.addEventListener(
        "touchend",
        event => {

            const endX =
                event.changedTouches[0].clientX;

            const endY =
                event.changedTouches[0].clientY;


            const distanceX =
                touchStartX - endX;

            const distanceY =
                touchStartY - endY;


            /*
              Hakikisha ni horizontal swipe
            */

            if (
                Math.abs(distanceX) >
                Math.abs(distanceY)
            ) {

                if (
                    Math.abs(distanceX) >
                    45
                ) {

                    if (distanceX > 0) {

                        nextSlide();

                    } else {

                        previousSlide();

                    }

                }

            }


            startAuto();

        },
        {
            passive: true
        }
    );


    /* =====================================================
                       MOUSE DRAG
    ===================================================== */

    let mouseStartX = 0;
    let mouseDragging = false;


    wrapper.addEventListener(
        "mousedown",
        event => {

            mouseDragging = true;

            mouseStartX =
                event.clientX;

            stopAuto();

        }
    );


    wrapper.addEventListener(
        "mouseup",
        event => {

            if (!mouseDragging) return;


            mouseDragging = false;


            const distance =
                mouseStartX -
                event.clientX;


            if (
                Math.abs(distance) >
                45
            ) {

                if (distance > 0) {

                    nextSlide();

                } else {

                    previousSlide();

                }

            }


            startAuto();

        }
    );


    wrapper.addEventListener(
        "mouseleave",
        () => {

            if (!mouseDragging) return;

            mouseDragging = false;

            startAuto();

        }
    );


    /* =====================================================
                    STOP IMAGE DRAG
    ===================================================== */

    track
        .querySelectorAll("img")
        .forEach(img => {

            img.setAttribute(
                "draggable",
                "false"
            );

            img.addEventListener(
                "dragstart",
                event => {

                    event.preventDefault();

                }
            );

        });


    /* =====================================================
                       RESIZE
    ===================================================== */

    let resizeTimer = null;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);


            resizeTimer =
                setTimeout(() => {

                    moveTo(
                        currentIndex,
                        false
                    );

                }, 150);

        }
    );


    /* =====================================================
                    INITIALIZE
    ===================================================== */

    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            moveTo(
                currentIndex,
                false
            );

            startAuto();

        });

    });


    /* =====================================================
                       DEBUG
    ===================================================== */

    console.log(
        "✅ CHAPCY V21 SLIDER READY"
    );

    console.log(
        "Groups:",
        total
    );

    console.log(
        "Auto:",
        AUTO_TIME + "ms"
    );

});
