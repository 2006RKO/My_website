const bubbleContainer = document.querySelector(".bubble");

function createBubble(fromTop = true) {

    const bubble = document.createElement("img");
    bubble.src = "file_00000000a59871f4b637e576e04f574d.png";

    bubble.style.left = Math.random() * 100 + "%";
    bubble.style.width = (Math.random() * 90 + 90) + "px";

    const duration = Math.random() * 4 + 8;
    bubble.style.animationDuration = duration + "s";

    if (fromTop) {
        bubble.classList.add("top-bubble");
    } else {
        bubble.classList.add("bottom-bubble");
    }

    bubbleContainer.appendChild(bubble);

    bubble.addEventListener("animationend", () => {
        bubble.remove();
    });
}

function createBatch(fromTop) {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createBubble(fromTop), i * 200);
    }
}

function startLoop() {

    // 15 kutoka juu
    createBatch(true);

    // baada ya sekunde 10, 15 kutoka chini
    setTimeout(() => {
        createBatch(false);
    }, 10000);

    // rudia tena baada ya sekunde 20
    setTimeout(startLoop, 20000);
}

startLoop();
