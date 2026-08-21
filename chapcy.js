/* =========================================================
        CHAPCY V21 ULTRA INFINITE GROUP SLIDER
        AUTO 2.5 SEC
        RIGHT → LEFT
        INFINITE LOOP
        MOBILE + DESKTOP
        TOUCH SWIPE
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const wrapper = document.querySelector(".slider-wrapper");
    const track = document.getElementById("sliderTrack");

    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if (!wrapper || !track) {
        console.error("CHAPCY: Slider elements missing.");
        return;
    }


    /* =====================================================
                    GET ORIGINAL CARDS
    ===================================================== */

    let originalCards =
        Array.from(
            track.querySelectorAll(".group-card")
        );

    const total = originalCards.length;

    if (total === 0) {
        console.error("CHAPCY: No group cards found.");
        return;
    }


    /* =====================================================
                  CREATE INFINITE CLONES
    ===================================================== */

    const before = document.createDocumentFragment();
    const after = document.createDocumentFragment();


    originalCards.forEach(card => {

        const cloneBefore =
            card.cloneNode(true);

        cloneBefore.classList.add(
            "carousel-clone"
        );

        before.appendChild(
            cloneBefore
        );


        const cloneAfter =
            card.cloneNode(true);

        cloneAfter.classList.add(
            "carousel-clone"
        );

        after.appendChild(
            cloneAfter
        );

    });


    track.insertBefore(
        before,
        track.firstChild
    );


    track.appendChild(
        after
    );


    /* =====================================================
                     ALL CARDS
    ===================================================== */

    let cards =
        Array.from(
            track.querySelectorAll(".group-card")
        );


    /*
       SET:

       BEFORE
       0 → total-1

       ORIGINAL
       total → total*2-1

       AFTER
       total*2 → total*3-1
    */


    let currentIndex = total;


    let timer = null;

    let moving = false;


    /* =====================================================
                    UPDATE CARDS
    ===================================================== */

    function refreshCards() {

        cards =
            Array.from(
                track.querySelectorAll(".group-card")
            );

    }


    /* =====================================================
                  GET REAL CARD POSITION
    ===================================================== */

    function getPosition(index) {

        const card = cards[index];

        if (!card) return 0;

        const wrapperRect =
            wrapper.getBoundingClientRect();

        const cardRect =
            card.getBoundingClientRect();

        /*
           card.offsetLeft gives
           actual position inside track.
        */

        const cardLeft =
            card.offsetLeft;

        const center =
            wrapperRect.width / 2;

        const cardCenter =
            cardLeft +
            (card.offsetWidth / 2);

        return center - cardCenter;

    }


    /* =====================================================
                       MOVE SLIDE
    ===================================================== */

    function moveSlide(
        index,
        animate = true
    ) {

        refreshCards();

        const card = cards[index];

        if (!card) return;


        const x =
            getPosition(index);


        track.style.transition =
            animate
                ? "transform .7s cubic-bezier(.22,.61,.36,1)"
                : "none";


        track.style.transform =
            `translate3d(${x}px,0,0)`;


        /*
           ACTIVE CARD
        */

        cards.forEach(card => {

            card.classList.remove(
                "active"
            );

        });


        card.classList.add(
            "active"
        );

    }


    /* =====================================================
                       NEXT SLIDE
    ===================================================== */

    function nextSlide() {

        if (moving) return;

        moving = true;


        currentIndex++;


        moveSlide(
            currentIndex,
            true
        );


        setTimeout(() => {

            /*
               Tukiingia AFTER SET
               tunarudi ORIGINAL SET.
            */

            if (
                currentIndex >=
                total * 2
            ) {

                currentIndex =
                    total;

                moveSlide(
                    currentIndex,
                    false
                );

            }


            moving = false;

        }, 750);

    }


    /* =====================================================
                    PREVIOUS SLIDE
    ===================================================== */

    function previousSlide() {

        if (moving) return;

        moving = true;


        currentIndex--;


        moveSlide(
            currentIndex,
            true
        );


        setTimeout(() => {

            /*
               Tukienda BEFORE SET
               tunarudi mwisho wa
               ORIGINAL SET.
            */

            if (
                currentIndex <
                total
            ) {

                currentIndex =
                    total * 2 - 1;

                moveSlide(
                    currentIndex,
                    false
                );

            }


            moving = false;

        }, 750);

    }


    /* =====================================================
                     AUTO SLIDER
                     2.5 SECONDS
    ===================================================== */

    function startAuto() {

        stopAuto();


        timer =
            setInterval(() => {

                nextSlide();

            }, 2500);

    }


    function stopAuto() {

        if (timer) {

            clearInterval(timer);

            timer = null;

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

    let startX = 0;
    let endX = 0;


    wrapper.addEventListener(
        "touchstart",
        e => {

            startX =
                e.touches[0].clientX;

            stopAuto();

        },
        {
            passive:true
        }
    );


    wrapper.addEventListener(
        "touchend",
        e => {

            endX =
                e.changedTouches[0].clientX;


            const distance =
                startX - endX;


            if (Math.abs(distance) > 50) {

                if (distance > 0) {

                    nextSlide();

                } else {

                    previousSlide();

                }

            }


            startAuto();

        },
        {
            passive:true
        }
    );


    /* =====================================================
                        MOUSE DRAG
    ===================================================== */

    let mouseStart = 0;
    let dragging = false;


    wrapper.addEventListener(
        "mousedown",
        e => {

            dragging = true;

            mouseStart =
                e.clientX;

            stopAuto();

        }
    );


    wrapper.addEventListener(
        "mouseup",
        e => {

            if (!dragging) return;

            dragging = false;


            const distance =
                mouseStart -
                e.clientX;


            if (Math.abs(distance) > 50) {

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

            if (dragging) {

                dragging = false;

                startAuto();

            }

        }
    );


    /* =====================================================
                    STOP IMAGE DRAG
    ===================================================== */

    track
        .querySelectorAll("img")
        .forEach(img => {

            img.addEventListener(
                "dragstart",
                e => {

                    e.preventDefault();

                }
            );

        });


    /* =====================================================
                      WINDOW RESIZE
    ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(() => {

                    moveSlide(
                        currentIndex,
                        false
                    );

                }, 200);

        }
    );


    /* =====================================================
                     INITIAL POSITION
    ===================================================== */

    requestAnimationFrame(() => {

        moveSlide(
            currentIndex,
            false
        );


        startAuto();

    });


    /* =====================================================
                       DEBUG
    ===================================================== */

    console.log(
        "CHAPCY V21 Infinite Slider Ready",
        total,
        "groups"
    );

});
