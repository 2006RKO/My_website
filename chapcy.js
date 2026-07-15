const bubbleContainer = document.querySelector(".bubble");

function createBubble(fromTop = true) {

    const bubble = document.createElement("img");

    bubble.src = "file_00000000a59871f4b637e576e04f574d.png";

    // Position random
    bubble.style.left = Math.random() * 100 + "%";

    // Size random (90px - 180px)
    bubble.style.width = (Math.random() * 70 + 70) + "px";

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


document.addEventListener("DOMContentLoaded", function () {

    const box = document.createElement("div");

    box.style.position = "absolute";
    box.style.top = "340px";
    box.style.left = "50%";
    box.style.transform = "translateX(-50%)";
    box.style.width = "95%";
    box.style.maxWidth = "950px";
    box.style.minHeight = "420px";
    box.style.background = "rgba(15,20,60,0.85)";
    box.style.backdropFilter = "blur(18px)";
    box.style.border = "2px solid rgba(255,255,255,.15)";
    box.style.borderRadius = "35px";
    box.style.boxShadow = "0 0 30px rgba(0,170,255,.5)";
    box.style.padding = "35px";
    box.style.zIndex = "99999";
    box.style.color = "#fff";
    box.style.fontFamily = "Arial, sans-serif";

    document.body.appendChild(box);

});
