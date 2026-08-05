document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("sliderTrack");
  const cards = Array.from(document.querySelectorAll(".group-card"));
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let current = 0;
  let timer;

  function updateSlider() {
    cards.forEach((card, index) => {
      card.classList.remove("active", "left", "right");

      if (index === current) {
        card.classList.add("active");
      }

      const leftIndex = (current - 1 + cards.length) % cards.length;
      const rightIndex = (current + 1) % cards.length;

      if (index === leftIndex) card.classList.add("left");
      if (index === rightIndex) card.classList.add("right");
    });

    const activeCard = cards[current];
    if (activeCard) {
      const offset =
        activeCard.offsetLeft -
        track.parentElement.offsetWidth / 2 +
        activeCard.offsetWidth / 2;

      track.style.transform = `translateX(${-offset}px)`;
    }
  }

  function goNext() {
    current = (current + 1) % cards.length;
    updateSlider();
  }

  function goPrev() {
    current = (current - 1 + cards.length) % cards.length;
    updateSlider();
  }

  function startAutoSlide() {
    stopAutoSlide();
    timer = setInterval(goNext, 2500);
  }

  function stopAutoSlide() {
    if (timer) clearInterval(timer);
  }

  nextBtn.addEventListener("click", () => {
    goNext();
    startAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    goPrev();
    startAutoSlide();
  });

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      current = index;
      updateSlider();
      startAutoSlide();
    });
  });

  updateSlider();
  startAutoSlide();
});
