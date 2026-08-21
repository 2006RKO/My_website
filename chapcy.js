/* =========================================================
             CHAPCY V5 PREMIUM INFINITE SLIDER
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const wrapper =
        document.querySelector(".slider-wrapper");

    const track =
        document.getElementById("sliderTrack");

    const nextBtn =
        document.getElementById("nextBtn");

    const prevBtn =
        document.getElementById("prevBtn");

    const xpReward =
        document.getElementById("xpReward");


    if(!wrapper || !track) return;


    /* =====================================================
                    ORIGINAL CARDS
    ===================================================== */

    const originals =
        Array.from(
            track.querySelectorAll(".group-card")
        );

    const total =
        originals.length;

    if(total === 0) return;


    /* =====================================================
              CREATE 3 SETS FOR INFINITE LOOP

       BEFORE + ORIGINAL + AFTER

       1 2 3 4 ... 11
       1 2 3 4 ... 11
       1 2 3 4 ... 11
    ===================================================== */

    const before =
        document.createDocumentFragment();

    const after =
        document.createDocumentFragment();


    originals.forEach(card => {

        const cloneBefore =
            card.cloneNode(true);

        cloneBefore.classList.add(
            "slider-clone"
        );

        before.appendChild(
            cloneBefore
        );


        const cloneAfter =
            card.cloneNode(true);

        cloneAfter.classList.add(
            "slider-clone"
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
                    VARIABLES
    ===================================================== */

    let currentIndex =
        total;

    let autoTimer =
        null;

    let animating =
        false;

    let startX = 0;

    let currentX = 0;

    let dragging = false;

    let startPosition = 0;


    /* =====================================================
                    CARD WIDTH
    ===================================================== */

    function cardWidth(){

        const card =
            track.querySelector(".group-card");

        if(!card) return 0;


        const style =
            window.getComputedStyle(track);

        const gap =
            parseFloat(style.gap) || 0;


        return card.offsetWidth + gap;
    }


    /* =====================================================
              CENTER ACTIVE CARD
    ===================================================== */

    function centerCurrent(
        animated = true
    ){

        const card =
            track.querySelector(".group-card");

        if(!card) return;


        const width =
            cardWidth();

        const wrapperWidth =
            wrapper.clientWidth;


        /*
           Center ya active card.
        */

        const cardCenter =
            currentIndex * width
            +
            card.offsetWidth / 2;


        const target =
            wrapperWidth / 2
            -
            cardCenter;


        track.style.transition =
            animated
                ? "transform .72s cubic-bezier(.22,.61,.36,1)"
                : "none";


        track.style.transform =
            `translate3d(${target}px,0,0)`;


        updateActive();

    }


    /* =====================================================
                  ACTIVE CARD
    ===================================================== */

    function updateActive(){

        const cards =
            track.querySelectorAll(
                ".group-card"
            );


        cards.forEach(
            card => {

                card.classList.remove(
                    "active"
                );

            }
        );


        const active =
            cards[currentIndex];

        if(active){

            active.classList.add(
                "active"
            );

        }

    }


    /* =====================================================
                    INITIALIZE
    ===================================================== */

    requestAnimationFrame(() => {

        centerCurrent(false);

    });


    /* =====================================================
                    NEXT
    ===================================================== */

    function nextSlide(){

        if(animating) return;

        animating = true;


        currentIndex++;


        centerCurrent(true);


        /*
          Baada ya ORIGINAL SET,
          tunarudi kwenye clone position.
        */

        setTimeout(() => {

            if(currentIndex >= total * 2){

                currentIndex =
                    total;

                centerCurrent(false);

            }

            animating = false;

        }, 760);

    }


    /* =====================================================
                    PREVIOUS
    ===================================================== */

    function previousSlide(){

        if(animating) return;

        animating = true;


        currentIndex--;


        centerCurrent(true);


        setTimeout(() => {

            if(currentIndex < total){

                currentIndex =
                    total * 2 - 1;

                centerCurrent(false);

            }

            animating = false;

        }, 760);

    }


    /* =====================================================
                    AUTO PLAY
                    2.5 SECONDS
    ===================================================== */

    function startAuto(){

        stopAuto();


        autoTimer =
            setInterval(
                () => {

                    nextSlide();

                },
                2500
            );

    }


    function stopAuto(){

        if(autoTimer){

            clearInterval(
                autoTimer
            );

            autoTimer = null;

        }

    }


    /* =====================================================
                    NEXT BUTTON
    ===================================================== */

    if(nextBtn){

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

    if(prevBtn){

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
                    TOUCH START
    ===================================================== */

    wrapper.addEventListener(
        "touchstart",
        event => {

            if(animating) return;


            dragging = true;


            startX =
                event.touches[0].clientX;

            currentX =
                startX;


            const transform =
                getComputedStyle(
                    track
                ).transform;


            if(transform !== "none"){

                const matrix =
                    new DOMMatrix(
                        transform
                    );

                startPosition =
                    matrix.m41;

            }else{

                startPosition = 0;

            }


            track.style.transition =
                "none";


            stopAuto();

        },
        {
            passive:true
        }
    );


    /* =====================================================
                    TOUCH MOVE
    ===================================================== */

    wrapper.addEventListener(
        "touchmove",
        event => {

            if(!dragging) return;


            currentX =
                event.touches[0].clientX;


            const distance =
                currentX - startX;


            track.style.transform =
                `translate3d(${startPosition + distance}px,0,0)`;

        },
        {
            passive:true
        }
    );


    /* =====================================================
                    TOUCH END
    ===================================================== */

    wrapper.addEventListener(
        "touchend",
        () => {

            if(!dragging) return;


            dragging = false;


            const distance =
                startX - currentX;


            if(distance > 50){

                nextSlide();

            }
            else if(distance < -50){

                previousSlide();

            }
            else{

                centerCurrent(true);

            }


            startAuto();

        }
    );


    /* =====================================================
                    MOUSE DRAG
    ===================================================== */

    wrapper.addEventListener(
        "mousedown",
        event => {

            if(animating) return;


            dragging = true;

            startX =
                event.clientX;

            currentX =
                startX;


            const transform =
                getComputedStyle(
                    track
                ).transform;


            if(transform !== "none"){

                const matrix =
                    new DOMMatrix(
                        transform
                    );

                startPosition =
                    matrix.m41;

            }else{

                startPosition = 0;

            }


            track.style.transition =
                "none";


            stopAuto();

        }
    );


    wrapper.addEventListener(
        "mousemove",
        event => {

            if(!dragging) return;


            currentX =
                event.clientX;


            const distance =
                currentX - startX;


            track.style.transform =
                `translate3d(${startPosition + distance}px,0,0)`;

        }
    );


    wrapper.addEventListener(
        "mouseup",
        () => {

            if(!dragging) return;


            dragging = false;


            const distance =
                startX - currentX;


            if(distance > 50){

                nextSlide();

            }
            else if(distance < -50){

                previousSlide();

            }
            else{

                centerCurrent(true);

            }


            startAuto();

        }
    );


    wrapper.addEventListener(
        "mouseleave",
        () => {

            if(!dragging) return;


            dragging = false;


            centerCurrent(true);

            startAuto();

        }
    );


    /* =====================================================
                    RESIZE
    ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    () => {

                        centerCurrent(false);

                    },
                    150
                );

        }
    );


    /* =====================================================
                    XP REWARD
    ===================================================== */

    function showXP(){

        if(!xpReward) return;


        xpReward.classList.add(
            "show"
        );


        setTimeout(
            () => {

                xpReward.classList.remove(
                    "show"
                );

            },
            1300
        );

    }


    /* =====================================================
                    JOIN BUTTONS
    ===================================================== */

    document
        .querySelectorAll(".join-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showXP();

                }
            );

        });


    /* =====================================================
                    PREVENT IMAGE DRAG
    ===================================================== */

    track
        .querySelectorAll("img")
        .forEach(img => {

            img.addEventListener(
                "dragstart",
                event => {

                    event.preventDefault();

                }
            );

        });


    /* =====================================================
                    START
    ===================================================== */

    startAuto();

});
