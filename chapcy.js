const bubbleContainer = document.querySelector(".bubble");

function createBubble() {

    const bubble = document.createElement("img");

    bubble.src = "file_00000000a59871f4b637e576e04f574d.png";

    bubble.style.left = Math.random() * 100 + "%";

    const size = Math.random() * 90 + 60;
    bubble.style.width = size + "px";

    const duration = Math.random() * 6 + 8;
    bubble.style.animationDuration = duration + "s";

    bubble.style.animationDelay = "0s";

    bubbleContainer.appendChild(bubble);

    setTimeout(() => {
        bubble.remove();
    }, duration * 1000);

}

setInterval(createBubble, 500);

// Tengeneza baadhi zianze tayari zikiwa kwenye screen
for(let i = 0; i < 20; i++){
    setTimeout(createBubble, i * 250);
}dot.onclick=()=>{

current=index;

updateSlider();

}

});

//================ TOUCH SWIPE ================

let startX=0;

slider.addEventListener("touchstart",(e)=>{

startX=e.touches[0].clientX;

});

slider.addEventListener("touchend",(e)=>{

let endX=e.changedTouches[0].clientX;

if(startX-endX>50){

nextSlide();

}

if(endX-startX>50){

prevSlide();

}

});

//================ START =================

updateSlider();
