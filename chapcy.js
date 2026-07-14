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
let activeBubble = null;

document.addEventListener("pointerdown", (e) => {
    if (e.target.parentElement?.classList.contains("bubble")) {
        activeBubble = e.target;

        // Simamisha animation wakati unavuta
        activeBubble.style.animationPlayState = "paused";
    }
});

document.addEventListener("pointermove", (e) => {
    if (!activeBubble) return;

    activeBubble.style.left = (e.clientX - activeBubble.offsetWidth / 2) + "px";
    activeBubble.style.top = (e.clientY - activeBubble.offsetHeight / 2) + "px";
});

document.addEventListener("pointerup", () => {
    if (activeBubble) {
        // Endelea na animation
        activeBubble.style.animationPlayState = "running";
        activeBubble = null;
    }
});
