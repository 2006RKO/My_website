/*=========================================
          CHAPCY JS PART 1
           BUBBLE SYSTEM
=========================================*/

"use strict";

/* BUBBLE CONTAINER */
const bubbleContainer = document.querySelector(".bubble");

/* CREATE BUBBLE */
function createBubble(fromTop = true){

    if(!bubbleContainer) return;

    const bubble = document.createElement("img");

    bubble.src = "file_00000000a59871f4b637e576e04f574d.png";

    /* RANDOM POSITION */
    bubble.style.left = Math.random() * 100 + "%";

    /* RANDOM SIZE */
    const size = Math.random() * 35 + 35;
    bubble.style.width = size + "px";

    /* RANDOM SPEED */
    const duration = Math.random() * 4 + 8;
    bubble.style.animationDuration = duration + "s";

    /* DIRECTION */
    if(fromTop){

        bubble.classList.add("top-bubble");

    }else{

        bubble.classList.add("bottom-bubble");

    }

    /* POP EFFECT */
    bubble.addEventListener("pointerdown",()=>{

        bubble.style.transition="0.25s ease";
        bubble.style.transform+=" scale(1.6)";
        bubble.style.opacity="0";

        setTimeout(()=>{

            bubble.remove();

        },250);

    });

    /* REMOVE AFTER ANIMATION */
    bubble.addEventListener("animationend",()=>{

        bubble.remove();

    });

    bubbleContainer.appendChild(bubble);

}

/* CREATE LOOP */
function bubbleLoop(){

    createBubble(true);

    setTimeout(()=>{

        createBubble(false);

    },5000);

}

/* START */
bubbleLoop();

/* REPEAT EVERY 10 SECONDS */
setInterval(bubbleLoop,10000);
/*=========================================
          CHAPCY JS PART 2
            USER PROFILE
=========================================*/

/* GET ELEMENTS */

const profileBtn = document.querySelector(".profile-btn");
const profileMenu = document.getElementById("profileMenu");

/* OPEN / CLOSE PROFILE */

function toggleProfile(){

    if(!profileMenu) return;

    profileMenu.classList.toggle("show");

}

if(profileBtn && profileMenu){

    profileBtn.addEventListener("click",(e)=>{

        e.stopPropagation();

        toggleProfile();

    });

}

/* CLOSE WHEN CLICK OUTSIDE */

document.addEventListener("click",(e)=>{

    if(
        profileMenu &&
        profileBtn &&
        !profileMenu.contains(e.target) &&
        !profileBtn.contains(e.target)
    ){

        profileMenu.classList.remove("show");

    }

});

/* ESC KEY CLOSE */

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        profileMenu.classList.remove("show");

    }

});

/* USER STATS */

const stats={

    chats:0,
    friends:0,
    groups:0,
    likes:0,
    followers:0,
    following:0

};

/* UPDATE VALUE */

function setValue(id,value){

    const element=document.getElementById(id);

    if(element){

        element.textContent=value;

    }

}

/* UPDATE ALL */

function updateProfileStats(){

    setValue("chatCount",stats.chats);
    setValue("friendCount",stats.friends);
    setValue("groupCount",stats.groups);
    setValue("likeCount",stats.likes);
    setValue("followersCount",stats.followers);
    setValue("followingCount",stats.following);

}

updateProfileStats();

/* USER INFO */

const profileName=document.querySelector(".profile-name");
const profileEmail=document.querySelector(".profile-email");
const profileStatus=document.querySelector(".status");

if(profileName){

    profileName.textContent=
    localStorage.getItem("chapcy_name") || "Guest";

}

if(profileEmail){

    profileEmail.textContent=
    localStorage.getItem("chapcy_email") || "guest@chapcy.com";

}

if(profileStatus){

    profileStatus.textContent="🟢 Online";

}

/* SAVE USER */

function saveUser(name,email){

    localStorage.setItem("chapcy_name",name);

    localStorage.setItem("chapcy_email",email);

}
/*=========================================
          CHAPCY JS PART 3
     AVATAR • LOGOUT • PREMIUM
=========================================*/

/* AVATAR */

const avatar = document.getElementById("profileAvatar");
const avatarInput = document.getElementById("avatarInput");

if (avatar && avatarInput) {

    /* CLICK AVATAR */
    avatar.addEventListener("click", () => {
        avatarInput.click();
    });

    /* CHANGE PHOTO */
    avatarInput.addEventListener("change", (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {

            avatar.innerHTML =
            `<img src="${reader.result}" class="avatar-image">`;

            localStorage.setItem(
                "chapcy_avatar",
                reader.result
            );

        };

        reader.readAsDataURL(file);

    });

    /* LOAD SAVED PHOTO */
    const savedAvatar =
    localStorage.getItem("chapcy_avatar");

    if (savedAvatar) {

        avatar.innerHTML =
        `<img src="${savedAvatar}" class="avatar-image">`;

    }

}

/* PREMIUM BUTTON */

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

        const lastReward =
        localStorage.getItem("reward");

        if (lastReward === today) {

            alert("🎁 Reward already claimed today.");

            return;

        }

        localStorage.setItem("reward", today);

        alert("🎉 Reward Claimed Successfully!");

    });

}

/* LOGOUT */

const logoutBtn =
document.querySelector(".logout-btn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        const confirmLogout =
        confirm("Logout from CHAPCY?");

        if (!confirmLogout) return;

        localStorage.removeItem("chapcy_name");
        localStorage.removeItem("chapcy_email");
        localStorage.removeItem("chapcy_avatar");
        localStorage.removeItem("reward");

        location.reload();

    });

             }
/*=========================================
          CHAPCY JS PART 4
        GROUP COVERFLOW
=========================================*/

const track = document.querySelector(".slider-track");
const cards = document.querySelectorAll(".group-card");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

if(track && cards.length){

let current = 0;

function updateSlider(){

    cards.forEach(card=>card.classList.remove("active"));

    cards[current].classList.add("active");

    cards[current].scrollIntoView({
        behavior:"smooth",
        inline:"center",
        block:"nearest"
    });

}

function nextSlide(){

    current++;

    if(current>=cards.length){

        current=0;

    }

    updateSlider();

}

function prevSlide(){

    current--;

    if(current<0){

        current=cards.length-1;

    }

    updateSlider();

}

/* BUTTONS */

nextBtn.addEventListener("click",()=>{

    nextSlide();

});

prevBtn.addEventListener("click",()=>{

    prevSlide();

});

/* AUTO SLIDE */

let auto=setInterval(nextSlide,3500);

/* STOP AUTO WHEN TOUCH */

track.addEventListener("touchstart",()=>{

    clearInterval(auto);

});

track.addEventListener("touchend",()=>{

    auto=setInterval(nextSlide,3500);

});

/* SWIPE */

let startX=0;

track.addEventListener("touchstart",(e)=>{

    startX=e.touches[0].clientX;

});

track.addEventListener("touchend",(e)=>{

    let endX=e.changedTouches[0].clientX;

    if(startX-endX>50){

        nextSlide();

    }

    if(endX-startX>50){

        prevSlide();

    }

});

/* MOUSE */

track.addEventListener("mouseenter",()=>{

    clearInterval(auto);

});

track.addEventListener("mouseleave",()=>{

    auto=setInterval(nextSlide,3500);

});

/* START */

updateSlider();

          }
/*=========================================
     CHAPCY SIDEBAR
=========================================*/

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

/* OPEN */
function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
}

/* CLOSE */
function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}

/* BUTTON */
if (menuBtn) {
    menuBtn.addEventListener("click", openSidebar);
}

/* OVERLAY */
if (overlay) {
    overlay.addEventListener("click", closeSidebar);
}

/* ESC */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeSidebar();
    }
});

/*=============================
      SWIPE OPEN / CLOSE
=============================*/

let startX = 0;
let endX = 0;

/* Touch Start */
document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

/* Touch End */
document.addEventListener("touchend", (e) => {

    endX = e.changedTouches[0].clientX;

    /* Swipe kutoka kushoto kwenda kulia */
    if (startX < 30 && endX - startX > 80) {
        openSidebar();
    }

    /* Swipe kufunga */
    if (sidebar.classList.contains("active") &&
        startX > 180 &&
        startX - endX > 80) {
        closeSidebar();
    }

});
const storyInput = document.getElementById("storyInput");

storyInput.addEventListener("change", () => {

    const file = storyInput.files[0];

    if (!file) return;

    alert("Story selected: " + file.name);

    // Baadaye hapa tutapakia kwenye Firebase Storage.

});

/*=========================================
        CHAPCY REWARD SYSTEM
=========================================*/

const xpReward = document.getElementById("xpReward");
const xpText = document.getElementById("xpText");

function showXP(points){

    xpText.innerHTML = "+" + points + " XP";

    xpReward.classList.add("show");

    setTimeout(()=>{

        xpReward.classList.remove("show");

    },3000);

}

/* Daily Login */

window.addEventListener("load",()=>{

    setTimeout(()=>{

        showXP(15);

    },1000);

});

/* Floating Likes */

function floatingLike(){

    const like=document.createElement("div");

    like.className="like-float";

    like.innerHTML="❤️";

    like.style.left=Math.random()*window.innerWidth+"px";

    like.style.top=(window.innerHeight-120)+"px";

    document.body.appendChild(like);

    setTimeout(()=>{

        like.remove();

    },2500);

}

/* Demo */

setInterval(()=>{

    floatingLike();

},4000);
