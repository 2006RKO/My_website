const bubbleContainer = document.querySelector(".bubble");

function createBubble(){

    const bubble = document.createElement("img");

    bubble.src = "file_00000000a59871f4b637e576e04f574d.png";

    bubble.style.left = Math.random() * 100 + "%";

    const size = Math.random() * 50 + 30;
    bubble.style.width = size + "px";

    const duration = Math.random() * 5 + 5;
    bubble.style.animationDuration = duration + "s";

    bubbleContainer.appendChild(bubble);


    setTimeout(()=>{
        bubble.remove();
    }, duration * 1000);

}


setInterval(createBubble,300);


for(let i=0;i<20;i++){
    setTimeout(createBubble,i*200);
}
