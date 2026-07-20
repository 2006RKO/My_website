/*=========================================
          CHAPCY JS PART 1
           BUBBLE SYSTEM
=========================================*/

"use strict";

const bubbleContainer = document.querySelector(".bubble");

/* CREATE BUBBLE */

function createBubble(fromTop = true){

    if(!bubbleContainer) return;

    const bubble = document.createElement("img");

    bubble.src = "file_00000000a59871f4b637e576e04f574d.png";

    bubble.style.left = Math.random() * 100 + "%";

    const size = Math.random() * 35 + 35;
    bubble.style.width = size + "px";

    const duration = Math.random() * 4 + 8;
    bubble.style.animationDuration = duration + "s";

    if(fromTop){

        bubble.classList.add("top-bubble");

    }else{

        bubble.classList.add("bottom-bubble");

    }

    /* POP */

    bubble.addEventListener("pointerdown",()=>{

        bubble.style.transition=".25s";

        bubble.style.transform+=" scale(1.6)";

        bubble.style.opacity="0";

        setTimeout(()=>{

            bubble.remove();

        },250);

    });

    bubble.addEventListener("animationend",()=>{

        bubble.remove();

    });

    bubbleContainer.appendChild(bubble);

}

/* LOOP */

function bubbleLoop(){

    createBubble(true);

    setTimeout(()=>{

        createBubble(false);

    },5000);

}

bubbleLoop();

setInterval(bubbleLoop,10000);
/*=========================================
          CHAPCY JS PART 2
            USER PROFILE
=========================================*/

const profileBtn = document.querySelector(".profile-btn");
const profileMenu = document.getElementById("profileMenu");

/* OPEN / CLOSE PROFILE */

if(profileBtn && profileMenu){

    profileBtn.addEventListener("click",(e)=>{

        e.stopPropagation();

        profileMenu.classList.toggle("show");

    });

    document.addEventListener("click",(e)=>{

        if(
            !profileMenu.contains(e.target) &&
            !profileBtn.contains(e.target)
        ){

            profileMenu.classList.remove("show");

        }

    });

}

/* USER DATA */

const stats={

    chats:0,
    friends:0,
    groups:0,
    likes:0,
    followers:0,
    following:0

};

/* UPDATE STATS */

function setValue(id,value){

    const el=document.getElementById(id);

    if(el){

        el.textContent=value;

    }

}

function updateProfileStats(){

    setValue("chatCount",stats.chats);
    setValue("friendCount",stats.friends);
    setValue("groupCount",stats.groups);
    setValue("likeCount",stats.likes);
    setValue("followersCount",stats.followers);
    setValue("followingCount",stats.following);

}

updateProfileStats();

/* USER NAME */

const nameBox=document.querySelector(".profile-name");
const emailBox=document.querySelector(".profile-email");
const status=document.querySelector(".status");

if(nameBox){

    nameBox.textContent=
    localStorage.getItem("chapcy_name") || "Guest";

}

if(emailBox){

    emailBox.textContent=
    localStorage.getItem("chapcy_email") || "guest@chapcy.com";

}

if(status){

    status.textContent="🟢 Online";

                }
/*=========================================
          CHAPCY JS PART 3
     AVATAR • LOGOUT • PREMIUM
=========================================*/

/* AVATAR */

const avatar = document.getElementById("profileAvatar");
const avatarInput = document.getElementById("avatarInput");

if (avatar && avatarInput) {

    avatar.addEventListener("click", () => {
        avatarInput.click();
    });

    avatarInput.addEventListener("change", (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function () {

            avatar.innerHTML =
            `<img src="${reader.result}" class="avatar-image">`;

            localStorage.setItem(
                "chapcy_avatar",
                reader.result
            );

        };

        reader.readAsDataURL(file);

    });

    const savedAvatar =
    localStorage.getItem("chapcy_avatar");

    if (savedAvatar) {

        avatar.innerHTML =
        `<img src="${savedAvatar}" class="avatar-image">`;

    }

}

/* LOGOUT */

const logoutBtn =
document.querySelector(".logout-btn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        if (confirm("Logout from CHAPCY?")) {

            localStorage.removeItem("chapcy_name");
            localStorage.removeItem("chapcy_email");
            localStorage.removeItem("chapcy_avatar");

            location.reload();

        }

    });

}

/* PREMIUM */

const premiumBtn =
document.querySelector(".premium-btn");

if (premiumBtn) {

    premiumBtn.addEventListener("click", () => {

        alert("🚀 CHAPCY Premium Coming Soon");

    });

}

/* DAILY REWARD */

const rewardBtn =
document.querySelector(".reward-btn");

if (rewardBtn) {

    rewardBtn.addEventListener("click", () => {

        const today =
        new Date().toDateString();

        const reward =
        localStorage.getItem("reward");

        if (reward === today) {

            alert("🎁 Reward already claimed today.");

        } else {

            localStorage.setItem("reward", today);

            alert("🎉 Reward Claimed Successfully!");

        }

    });

}
/*=========================================
          CHAPCY JS PART 4
          COVERFLOW SLIDER
=========================================*/

const track = document.querySelector(".slider-track");
const cards = document.querySelectorAll(".group-card");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const dots = document.querySelectorAll(".dot");

if (track && cards.length > 0) {

    let current = 0;

    function updateSlider() {

        cards.forEach((card, index) => {

            card.classList.remove("active");

            if (index === current) {

                card.classList.add("active");

                card.style.transform = "scale(1)";
                card.style.opacity = "1";
                card.style.zIndex = "10";

            } else if (
                index === current - 1 ||
                (current === 0 && index === cards.length - 1)
            ) {

                card.style.transform =
                    "translateX(-35px) scale(.85)";

                card.style.opacity = ".6";
                card.style.zIndex = "5";

            } else if (
                index === current + 1 ||
                (current === cards.length - 1 && index === 0)
            ) {

                card.style.transform =
                    "translateX(35px) scale(.85)";

                card.style.opacity = ".6";
                card.style.zIndex = "5";

            } else {

                card.style.transform = "scale(.7)";
                card.style.opacity = "0";
                card.style.zIndex = "1";

            }

        });

        dots.forEach(dot => dot.classList.remove("active"));

        if (dots[current]) {
            dots[current].classList.add("active");
        }

        cards[current].scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest"
        });

    }

    /* NEXT */

    if (next) {

        next.addEventListener("click", () => {

            current++;

            if (current >= cards.length) {

                current = 0;

            }

            updateSlider();

        });

    }

    /* PREVIOUS */

    if (prev) {

        prev.addEventListener("click", () => {

            current--;

            if (current < 0) {

                current = cards.length - 1;

            }

            updateSlider();

        });

    }

    /* DOTS */

    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            current = index;

            updateSlider();

        });

    });

    /* AUTO SLIDE */

    let auto = setInterval(() => {

        current++;

        if (current >= cards.length) {

            current = 0;

        }

        updateSlider();

    }, 4000);

    /* PAUSE */

    track.addEventListener("mouseenter", () => {

        clearInterval(auto);

    });

    track.addEventListener("mouseleave", () => {

        auto = setInterval(() => {

            current++;

            if (current >= cards.length) {

                current = 0;

            }

            updateSlider();

        }, 4000);

    });

    /* SWIPE */

    let startX = 0;

    track.addEventListener("touchstart", e => {

        startX = e.touches[0].clientX;

    });

    track.addEventListener("touchend", e => {

        const endX = e.changedTouches[0].clientX;

        if (startX - endX > 50) {

            current = (current + 1) % cards.length;

            updateSlider();

        }

        if (endX - startX > 50) {

            current = (current - 1 + cards.length) % cards.length;

            updateSlider();

        }

    });

    updateSlider();

}
