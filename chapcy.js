/* =========================================================
              CHAPCY V5 INFINITE CARD SLIDER
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


    if(!wrapper || !track) return;


    /* =====================================================
                    ORIGINAL CARDS
    ===================================================== */

    const originalCards =
        Array.from(
            track.querySelectorAll(".group-card")
        );


    const total =
        originalCards.length;


    if(total === 0) return;


    /* =====================================================
                  CREATE INFINITE COPIES
    ===================================================== */

    const before =
        document.createDocumentFragment();

    const after =
        document.createDocumentFragment();


    originalCards.forEach(card => {

        const beforeClone =
            card.cloneNode(true);

        beforeClone.classList.add(
            "carousel-clone"
        );

        before.appendChild(
            beforeClone
        );


        const afterClone =
            card.cloneNode(true);

        afterClone.classList.add(
            "carousel-clone"
        );

        after.appendChild(
            afterClone
        );

    });


    track.insertBefore(
        before,
        track.firstChild
    );


    track.appendChild(after);


    /* =====================================================
                    STATE
    ===================================================== */

    let currentIndex =
        total;

    let moving =
        false;

    let autoPlay;


    /* =====================================================
                  CARD SIZE
    ===================================================== */

    function getCardStep(){

        const card =
            track.querySelector(".group-card");

        if(!card) return 0;


        const trackStyle =
            window.getComputedStyle(
                track
            );


        const gap =
            parseFloat(
                trackStyle.gap
            ) || 0;


        return card.offsetWidth + gap;
    }


    /* =====================================================
                    CENTER CARD
    ===================================================== */

    function updateSlider(
        smooth = true
    ){

        const cards =
            track.querySelectorAll(
                ".group-card"
            );


        const card =
            cards[currentIndex];


        if(!card) return;


        const step =
            getCardStep();


        const wrapperWidth =
            wrapper.clientWidth;


        const cardWidth =
            card.offsetWidth;


        const cardCenter =
            currentIndex * step
            +
            cardWidth / 2;


        const translateX =
            wrapperWidth / 2
            -
            cardCenter;


        track.style.transition =
            smooth
                ? "transform .72s cubic-bezier(.22,.61,.36,1)"
                : "none";


        track.style.transform =
            `translate3d(${translateX}px,0,0)`;


        cards.forEach(
            item => {

                item.classList.remove(
                    "active"
                );

            }
        );


        card.classList.add(
            "active"
        );

    }


    /* =====================================================
                    NEXT
    ===================================================== */

    function nextSlide(){

        if(moving) return;

        moving = true;


        currentIndex++;


        updateSlider(true);


        setTimeout(() => {

            /*
             * Tukiingia set ya mwisho,
             * rudi kwenye set ya katikati
             */

            if(currentIndex >= total * 2){

                currentIndex =
                    total;

                updateSlider(false);

            }


            moving = false;

        },750);

    }


    /* =====================================================
                    PREVIOUS
    ===================================================== */

    function previousSlide(){

        if(moving) return;

        moving = true;


        currentIndex--;


        updateSlider(true);


        setTimeout(() => {

            if(currentIndex < total){

                currentIndex =
                    total * 2 - 1;

                updateSlider(false);

            }


            moving = false;

        },750);

    }


    /* =====================================================
                    AUTO PLAY
                    EVERY 2.5 SEC
    ===================================================== */

    function startAuto(){

        stopAuto();


        autoPlay =
            setInterval(
                () => {

                    nextSlide();

                },
                2500
            );

    }


    function stopAuto(){

        if(autoPlay){

            clearInterval(
                autoPlay
            );

            autoPlay = null;

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
                    TOUCH SWIPE
    ===================================================== */

    let touchStartX = 0;
    let touchEndX = 0;


    wrapper.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.touches[0].clientX;

            stopAuto();

        },
        {passive:true}
    );


    wrapper.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event.changedTouches[0].clientX;


            const distance =
                touchStartX - touchEndX;


            if(distance > 50){

                nextSlide();

            }
            else if(distance < -50){

                previousSlide();

            }
            else{

                updateSlider(true);

            }


            startAuto();

        },
        {passive:true}
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

            stopAuto();

        }
    );


    wrapper.addEventListener(
        "mouseup",
        event => {

            if(!mouseDown) return;


            mouseDown = false;


            const distance =
                mouseStartX -
                event.clientX;


            if(distance > 50){

                nextSlide();

            }
            else if(distance < -50){

                previousSlide();

            }
            else{

                updateSlider(true);

            }


            startAuto();

        }
    );


    wrapper.addEventListener(
        "mouseleave",
        () => {

            if(mouseDown){

                mouseDown = false;

                updateSlider(true);

                startAuto();

            }

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

                        updateSlider(false);

                    },
                    150
                );

        }
    );


    /* =====================================================
                    DISABLE IMAGE DRAG
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
                    INITIAL POSITION
    ===================================================== */

    requestAnimationFrame(() => {

        updateSlider(false);

        startAuto();

    });

});
