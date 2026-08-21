/* =========================================================
             CHAPCY V5 ULTRA INFINITE SLIDER
             2.5 SEC AUTO • CENTER ACTIVE CARD
             MOBILE + DESKTOP • TOUCH SWIPE
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const wrapper = document.querySelector(".slider-wrapper");
    const track = document.getElementById("sliderTrack");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if (!wrapper || !track) {
        console.error("CHAPCY Slider: Elements not found.");
        return;
    }


    /* =====================================================
                       ORIGINAL CARDS
    ===================================================== */

    const originalCards = Array.from(
        track.querySelectorAll(".group-card")
    );

    const totalCards = originalCards.length;

    if (!totalCards) return;


    /* =====================================================
                     REMOVE OLD CLONES
    ===================================================== */

    track.querySelectorAll(".carousel-clone").forEach(card => {
        card.remove();
    });


    /* =====================================================
                  CREATE 3 SETS OF CARDS
    ===================================================== */

    /*
       SET 1 = copies before
       SET 2 = original cards
       SET 3 = copies after

       This gives us an infinite carousel.
    */

    const beforeFragment =
        document.createDocumentFragment();

    const afterFragment =
        document.createDocumentFragment();


    originalCards.forEach(card => {

        const beforeClone =
            card.cloneNode(true);

        beforeClone.classList.add(
            "carousel-clone"
        );

        beforeFragment.appendChild(
            beforeClone
        );


        const afterClone =
            card.cloneNode(true);

        afterClone.classList.add(
            "carousel-clone"
        );

        afterFragment.appendChild(
            afterClone
        );

    });


    track.insertBefore(
        beforeFragment,
        track.firstChild
    );


    track.appendChild(
        afterFragment
    );


    /* =====================================================
                        ALL CARDS
    ===================================================== */

    let cards =
        Array.from(
            track.querySelectorAll(".group-card")
        );


    /*
       Start from the ORIGINAL set.

       Example:

       0 - 10     = previous copies
       11 - 21    = original
       22 - 32    = next copies

       So first active card = 11
    */

    let currentIndex = totalCards;


    let isAnimating = false;

    let autoTimer = null;


    /* =====================================================
                     GET CARD STEP
    ===================================================== */

    function getStep() {

        const card = cards[0];

        if (!card) return 0;


        const cardWidth =
            card.getBoundingClientRect().width;


        const trackStyle =
            window.getComputedStyle(track);


        const gap =
            parseFloat(trackStyle.gap) || 0;


        return cardWidth + gap;
    }


    /* =====================================================
                    CENTER ACTIVE CARD
    ===================================================== */

    function moveToCard(
        index,
        animate = true
    ) {

        cards =
            Array.from(
                track.querySelectorAll(".group-card")
            );


        const card = cards[index];

        if (!card) return;


        const wrapperWidth =
            wrapper.getBoundingClientRect().width;


        const cardWidth =
            card.getBoundingClientRect().width;


        const step =
            getStep();


        /*
           Position ya card ndani ya track
        */

        const cardPosition =
            index * step;


        /*
           Center card ndani ya wrapper
        */

        const targetX =
            (wrapperWidth / 2)
            -
            (cardPosition + cardWidth / 2);


        track.style.transition =
            animate
                ? "transform .7s cubic-bezier(.22,.61,.36,1)"
                : "none";


        track.style.transform =
            `translate3d(${targetX}px, 0, 0)`;


        /*
           Remove active from all
        */

        cards.forEach(cardItem => {

            cardItem.classList.remove(
                "active"
            );

        });


        /*
           Add active to center card
        */

        card.classList.add(
            "active"
        );

    }


    /* =====================================================
                        NEXT SLIDE
    ===================================================== */

    function nextSlide() {

        if (isAnimating) return;

        isAnimating = true;


        currentIndex++;


        moveToCard(
            currentIndex,
            true
        );


        setTimeout(() => {

            /*
               Tukifika mwisho wa
               original set + clone set

               tunarudi katikati
               bila user kuona jump.
            */

            if (
                currentIndex >=
                totalCards * 2
            ) {

                currentIndex =
                    totalCards;


                moveToCard(
                    currentIndex,
                    false
                );

            }


            isAnimating = false;

        }, 720);

    }


    /* =====================================================
                       PREVIOUS SLIDE
    ===================================================== */

    function previousSlide() {

        if (isAnimating) return;

        isAnimating = true;


        currentIndex--;


        moveToCard(
            currentIndex,
            true
        );


        setTimeout(() => {

            /*
               Tukifika mwanzo wa
               middle set,

               tunarudi kwenye set
               ya pili bila jump.
            */

            if (
                currentIndex <
                totalCards
            ) {

                currentIndex =
                    totalCards * 2 - 1;


                moveToCard(
                    currentIndex,
                    false
                );

            }


            isAnimating = false;

        }, 720);

    }


    /* =====================================================
                        AUTO SLIDER
                        EVERY 2.5 SEC
    ===================================================== */

    function startAutoSlide() {

        stopAutoSlide();


        autoTimer =
            setInterval(() => {

                nextSlide();

            }, 2500);

    }


    function stopAutoSlide() {

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

                stopAutoSlide();

                nextSlide();

                startAutoSlide();

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

                stopAutoSlide();

                previousSlide();

                startAutoSlide();

            }
        );

    }


    /* =====================================================
                         TOUCH SWIPE
    ===================================================== */

    let touchStartX = 0;
    let touchEndX = 0;


    wrapper.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.touches[0].clientX;

            stopAutoSlide();

        },
        {
            passive: true
        }
    );


    wrapper.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event.changedTouches[0].clientX;


            const distance =
                touchStartX -
                touchEndX;


            /*
               Swipe left
            */

            if (distance > 50) {

                nextSlide();

            }


            /*
               Swipe right
            */

            else if (distance < -50) {

                previousSlide();

            }


            startAutoSlide();

        },
        {
            passive: true
        }
    );


    /* =====================================================
                         MOUSE DRAG
    ===================================================== */

    let mouseStartX = 0;
    let mouseDown = false;


    wrapper.addEventListener(
        "mousedown",
        event => {

            mouseDown = true;

            mouseStartX =
                event.clientX;

            stopAutoSlide();

        }
    );


    wrapper.addEventListener(
        "mouseup",
        event => {

            if (!mouseDown) return;


            mouseDown = false;


            const distance =
                mouseStartX -
                event.clientX;


            if (distance > 50) {

                nextSlide();

            }

            else if (distance < -50) {

                previousSlide();

            }


            startAutoSlide();

        }
    );


    wrapper.addEventListener(
        "mouseleave",
        () => {

            if (!mouseDown) return;


            mouseDown = false;

            startAutoSlide();

        }
    );


    /* =====================================================
                     PREVENT IMAGE DRAG
    ===================================================== */

    track
        .querySelectorAll("img")
        .forEach(image => {

            image.addEventListener(
                "dragstart",
                event => {

                    event.preventDefault();

                }
            );

        });


    /* =====================================================
                       WINDOW RESIZE
    ===================================================== */

    let resizeTimeout;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimeout
            );


            resizeTimeout =
                setTimeout(() => {

                    moveToCard(
                        currentIndex,
                        false
                    );

                }, 150);

        }
    );


    /* =====================================================
                     INITIALIZE
    ===================================================== */

    /*
       Muhimu sana:

       Card ya kwanza inawekwa
       katikati mara page inapofunguka.
    */

    requestAnimationFrame(() => {

        moveToCard(
            currentIndex,
            false
        );


        startAutoSlide();

    });


    /* =====================================================
                      DEBUG MESSAGE
    ===================================================== */

    console.log(
        "CHAPCY V5 Slider Loaded:",
        totalCards,
        "groups"
    );

});
