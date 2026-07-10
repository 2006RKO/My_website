//================ GROUP SLIDER ================

const slider = document.getElementById("groupSlider");

const cards = document.querySelectorAll(".group-card");

const dots = document.querySelectorAll(".dot");

const prev = document.querySelector(".prev");

const next = document.querySelector(".next");

let index = 0;

const cardWidth = 345;


//================ UPDATE ================

function updateSlider(){

slider.style.transform =
`translateX(-${index * cardWidth}px)`;


cards.forEach(card=>{

card.classList.remove("active-card");

});

cards[index].classList.add("active-card");


dots.forEach(dot=>{

dot.classList.remove("active");

});

if(dots[index % dots.length]){

dots[index % dots.length].classList.add("active");

}

}


//================ NEXT ================

function nextSlide(){

index++;

if(index>=cards.length){

index=0;

}

updateSlider();

}


//================ PREVIOUS ================

function prevSlide(){

index--;

if(index<0){

index=cards.length-1;

}

updateSlider();

}


//================ BUTTONS ================

next.addEventListener("click",nextSlide);

prev.addEventListener("click",prevSlide);


//================ AUTO SLIDE ================

setInterval(nextSlide,3500);


//================ DOTS ================

dots.forEach((dot,i)=>{

dot.addEventListener("click",()=>{

index=i;

updateSlider();

});

});


//================ START ================

updateSlider();
