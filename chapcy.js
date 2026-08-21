/* =========================================================
   CHAPCY V9 — 3D GROUP SLIDESHOW
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const track = document.getElementById("sliderTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(
    track.querySelectorAll(".group-card")
  );

  if (!cards.length) return;

  let currentIndex = 0;

  let autoplay;

  const gap = 24;

  /* =======================================================
     GET CARD WIDTH
     ======================================================= */

  function getCardWidth() {

    const cardWidth =
      cards[0].getBoundingClientRect().width;

    const currentGap =
      window.innerWidth <= 600 ? 14 : gap;

    return cardWidth + currentGap;
  }


  /* =======================================================
     UPDATE SLIDE
     ======================================================= */

  function updateSlider(animate = true) {

    const wrapper =
      track.parentElement;

    const wrapperWidth =
      wrapper.getBoundingClientRect().width;

    const cardWidth =
      cards[0].getBoundingClientRect().width;

    const currentGap =
      window.innerWidth <= 600 ? 14 : gap;

    const fullWidth =
      cardWidth + currentGap;

    /*
      Center the active card
    */

    const centerOffset =
      (wrapperWidth - cardWidth) / 2;

    const move =
      centerOffset -
      (currentIndex * fullWidth);

    track.style.transition =
      animate
        ? "transform .75s cubic-bezier(.22,.61,.36,1)"
        : "none";

    track.style.transform =
      `translate3d(${move}px,0,0)`;


    /* ACTIVE CARD */

    cards.forEach((card, index) => {

      card.classList.toggle(
        "active",
        index === currentIndex
      );

    });

  }


  /* =======================================================
     NEXT
     ======================================================= */

  function nextSlide() {

    currentIndex++;

    if (currentIndex >= cards.length) {
      currentIndex = 0;
    }

    updateSlider();

    restartAutoplay();
  }


  /* =======================================================
     PREVIOUS
     ======================================================= */

  function previousSlide() {

    currentIndex--;

    if (currentIndex < 0) {
      currentIndex = cards.length - 1;
    }

    updateSlider();

    restartAutoplay();
  }


  /* =======================================================
     BUTTONS
     ======================================================= */

  nextBtn.addEventListener(
    "click",
    nextSlide
  );

  prevBtn.addEventListener(
    "click",
    previousSlide
  );


  /* =======================================================
     AUTO PLAY
     ======================================================= */

  function startAutoplay() {

    clearInterval(autoplay);

    autoplay = setInterval(() => {

      currentIndex++;

      if (currentIndex >= cards.length) {
        currentIndex = 0;
      }

      updateSlider();

    }, 4000);

  }


  function restartAutoplay() {

    clearInterval(autoplay);

    startAutoplay();

  }


  /* =======================================================
     PAUSE WHEN MOUSE IS OVER SLIDER
     ======================================================= */

  const slider =
    document.querySelector(".group-slider");

  slider.addEventListener(
    "mouseenter",
    () => {
      clearInterval(autoplay);
    }
  );

  slider.addEventListener(
    "mouseleave",
    () => {
      startAutoplay();
    }
  );


  /* =======================================================
     TOUCH / SWIPE
     ======================================================= */

  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener(
    "touchstart",
    (e) => {

      touchStartX =
        e.touches[0].clientX;

      clearInterval(autoplay);

    },
    { passive:true }
  );


  slider.addEventListener(
    "touchmove",
    (e) => {

      touchEndX =
        e.touches[0].clientX;

    },
    { passive:true }
  );


  slider.addEventListener(
    "touchend",
    () => {

      const distance =
        touchStartX - touchEndX;

      const minimumSwipe = 50;

      if (Math.abs(distance) > minimumSwipe) {

        if (distance > 0) {
          nextSlide();
        } else {
          previousSlide();
        }

      }

      startAutoplay();

    }
  );


  /* =======================================================
     KEYBOARD
     ======================================================= */

  document.addEventListener(
    "keydown",
    (e) => {

      if (e.key === "ArrowRight") {
        nextSlide();
      }

      if (e.key === "ArrowLeft") {
        previousSlide();
      }

    }
  );


  /* =======================================================
     RESIZE
     ======================================================= */

  let resizeTimer;

  window.addEventListener(
    "resize",
    () => {

      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {

        updateSlider(false);

      }, 150);

    }
  );


  /* =======================================================
     INITIALIZE
     ======================================================= */

  updateSlider(false);

  startAutoplay();

});
