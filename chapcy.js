const bubbleContainer = document.querySelector(".bubble");

function createBubble(fromTop = true) {

    const bubble = document.createElement("img");

    bubble.src = "file_00000000a59871f4b637e576e04f574d.png";

    // Position random
    bubble.style.left = Math.random() * 100 + "%";

    // Size random (90px - 180px)
    bubble.style.width = (Math.random() * 80 + 80) + "px";

    // Speed random
    const duration = Math.random() * 2 + 4;
    bubble.style.animationDuration = duration + "s";

    if (fromTop) {
        bubble.classList.add("top-bubble");
    } else {
        bubble.classList.add("bottom-bubble");
    }

    // Bubble pop ikiguswa
    bubble.addEventListener("pointerdown", () => {

        bubble.style.transition = "0.25s ease";
        bubble.style.transform += " scale(1.5)";
        bubble.style.opacity = "0";

        setTimeout(() => {
            bubble.remove();
        }, 250);

    });

    bubbleContainer.appendChild(bubble);

    // Ondoa baada ya animation kuisha
    bubble.addEventListener("animationend", () => {
        bubble.remove();
    });

}

function createBatch(fromTop) {

    for (let i = 0; i < 15; i++) {

        setTimeout(() => {
            createBubble(fromTop);
        }, i * 200);

    }

}

function startLoop() {

    // 15 kutoka juu
    createBatch(true);

    // Baada ya sekunde 5, 15 kutoka chini
    setTimeout(() => {
        createBatch(false);
    }, 5000);

    // Rudia kila sekunde 10
    setTimeout(startLoop, 10000);

}

startLoop();
