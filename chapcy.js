/* =====================================================
        CHAPCY.JS
        BUBBLES + USER PROFILE
===================================================== */


/* =====================================================
        BUBBLE SYSTEM
===================================================== */

const bubbleContainer = document.querySelector(".bubble");


function createBubble(fromTop = true) {

    if (!bubbleContainer) return;


    const bubble = document.createElement("img");


    /* Bubble Image */

    bubble.src =
        "file_00000000a59871f4b637e576e04f574d.png";


    /* Random Position */

    bubble.style.left =
        Math.random() * 100 + "%";


    /* Random Size */

    bubble.style.width =
        Math.random() * 70 + 70 + "px";


    /* Random Speed */

    const duration =
        Math.random() * 4 + 8;


    bubble.style.animationDuration =
        duration + "s";


    /* Bubble Direction */

    if (fromTop) {

        bubble.classList.add("top-bubble");

    } else {

        bubble.classList.add("bottom-bubble");

    }


    /* Bubble Ikiguswa */

    bubble.addEventListener(
        "pointerdown",
        () => {

            bubble.style.transition =
                "0.25s ease";

            bubble.style.transform +=
                " scale(1.5)";

            bubble.style.opacity =
                "0";


            setTimeout(() => {

                bubble.remove();

            }, 250);

        }
    );


    /* Ongeza Bubble Kwenye Page */

    bubbleContainer.appendChild(bubble);


    /* Ondoa Baada Ya Animation */

    bubble.addEventListener(
        "animationend",
        () => {

            bubble.remove();

        }
    );

}


/* =====================================================
        CREATE BUBBLE BATCH
===================================================== */

function createBubble(fromTop = true) {

    if (!bubbleContainer) return;


    const bubble = document.createElement("img");


    bubble.src =
        "file_00000000a59871f4b637e576e04f574d.png";


    /* Position random */

    bubble.style.left =
        Math.random() * 100 + "%";


    /* BUBBLE NDOGO */

    bubble.style.width =
        Math.random() * 30 + 35 + "px";


    /* KUSHUKA KWA POLEPOLE */

    const duration =
        Math.random() * 4 + 8;


    bubble.style.animationDuration =
        duration + "s";


    if (fromTop) {

        bubble.classList.add("top-bubble");

    } else {

        bubble.classList.add("bottom-bubble");

    }


    bubble.addEventListener(
        "pointerdown",
        () => {

            bubble.style.transition =
                "0.25s ease";

            bubble.style.transform +=
                " scale(1.5)";

            bubble.style.opacity =
                "0";


            setTimeout(() => {

                bubble.remove();

            }, 250);

        }
    );


    bubbleContainer.appendChild(bubble);


    bubble.addEventListener(
        "animationend",
        () => {

            bubble.remove();

        }
    );

}

/* =====================================================
        BUBBLE LOOP
===================================================== */

function startLoop() {


    /* Bubbles Kutoka Juu */

    createBatch(true);


    /* Baada Ya Sekunde 5 Kutoka Chini */

    setTimeout(
        () => {

            createBatch(false);

        },

        5000

    );


    /* Rudia Kila Sekunde 10 */

    setTimeout(
        startLoop,

        10000

    );

}


startLoop();




/*=========================================
      CHAPCY V13 PROFILE
=========================================*/

"use strict";

/*=========================
      GET ELEMENTS
=========================*/

const profileBtn = document.querySelector(".profile-btn");

const profileMenu = document.getElementById("profileMenu");

/*=========================
      OPEN / CLOSE MENU
=========================*/

function toggleProfile(){

    profileMenu.classList.toggle("show");

}

profileBtn.addEventListener("click",toggleProfile);

/*=========================
      CLOSE WHEN CLICK OUTSIDE
=========================*/

document.addEventListener("click",(e)=>{

    if(
        !profileMenu.contains(e.target) &&
        !profileBtn.contains(e.target)
    ){

        profileMenu.classList.remove("show");

    }

});

/*=========================
      ESC KEY CLOSE
=========================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        profileMenu.classList.remove("show");

    }

});

/*=========================
      PROFILE STATS
=========================*/

const stats={

    chats:0,

    friends:0,

    groups:0,

    likes:0,

    followers:0,

    following:0

};

function updateProfileStats(){

    document.getElementById("chatCount").textContent=stats.chats;

    document.getElementById("friendCount").textContent=stats.friends;

    document.getElementById("groupCount").textContent=stats.groups;

    document.getElementById("likeCount").textContent=stats.likes;

    document.getElementById("followersCount").textContent=stats.followers;

    document.getElementById("followingCount").textContent=stats.following;

}

updateProfileStats();

/*=========================
      FUNCTIONS
=========================*/

function addChat(){

    stats.chats++;

    updateProfileStats();

}

function addFriend(){

    stats.friends++;

    updateProfileStats();

}

function addGroup(){

    stats.groups++;

    updateProfileStats();

}

function addLike(){

    stats.likes++;

    updateProfileStats();

}

function addFollower(){

    stats.followers++;

    updateProfileStats();

}

function addFollowing(){

    stats.following++;

    updateProfileStats();

                }
/*=========================================
      CHAPCY V13 PROFILE PART 2
=========================================*/

/*=========================
      ANIMATE COUNTERS
=========================*/

function animateCounter(id,value){

    const element=document.getElementById(id);

    let start=0;

    const speed=20;

    const timer=setInterval(()=>{

        if(start>=value){

            clearInterval(timer);

            element.textContent=value;

        }else{

            start++;

            element.textContent=start;

        }

    },speed);

}

/* UPDATE WITH ANIMATION */

function updateProfileStats(){

    animateCounter("chatCount",stats.chats);

    animateCounter("friendCount",stats.friends);

    animateCounter("groupCount",stats.groups);

    animateCounter("likeCount",stats.likes);

    animateCounter("followersCount",stats.followers);

    animateCounter("followingCount",stats.following);

}

/*=========================
      USER INFO
=========================*/

const userName=localStorage.getItem("chapcy_name") || "Guest";

const userEmail=localStorage.getItem("chapcy_email") || "guest@chapcy.com";

document.querySelector(".profile-name").textContent=userName;

document.querySelector(".profile-email").textContent=userEmail;

/*=========================
      ONLINE STATUS
=========================*/

const status=document.querySelector(".status");

status.textContent="🟢 Online";

/*=========================
      NOTIFICATION BADGE
=========================*/

let notifications=0;

const badge=document.querySelector(".badge");

if(badge){

    badge.textContent=notifications;

}

function addNotification(){

    notifications++;

    if(badge){

        badge.textContent=notifications;

    }

}

/*=========================
      DARK MODE
=========================*/

const savedTheme=localStorage.getItem("chapcy_theme");

if(savedTheme==="dark"){

    document.body.classList.add("dark");

}

function toggleDarkMode(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("chapcy_theme","dark");

    }else{

        localStorage.setItem("chapcy_theme","light");

    }

}

/*=========================
      SAVE USER
=========================*/

function saveUser(name,email){

    localStorage.setItem("chapcy_name",name);

    localStorage.setItem("chapcy_email",email);

                        }
/*=========================================
      CHAPCY V13 PROFILE PART 3
=========================================*/

/*=========================
      PROFILE PHOTO
=========================*/

const avatar =
document.getElementById("profileAvatar");

const avatarInput =
document.getElementById("avatarInput");

/* CLICK AVATAR */

if(avatar){

    avatar.addEventListener("click",()=>{

        avatarInput.click();

    });

}

/* CHANGE PHOTO */

if(avatarInput){

avatarInput.addEventListener("change",(e)=>{

    const file=e.target.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=function(){

        avatar.innerHTML=
        `<img src="${reader.result}"
        class="avatar-image">`;

        localStorage.setItem(
            "chapcy_avatar",
            reader.result
        );

    };

    reader.readAsDataURL(file);

});

}

/* LOAD PHOTO */

const savedAvatar=
localStorage.getItem("chapcy_avatar");

if(savedAvatar && avatar){

    avatar.innerHTML=
    `<img src="${savedAvatar}"
    class="avatar-image">`;

}

/*=========================
      LOGOUT
=========================*/

const logoutBtn=
document.querySelector(".logout-btn");

if(logoutBtn){

logoutBtn.addEventListener("click",()=>{

    if(confirm("Logout from CHAPCY?")){

        localStorage.removeItem("chapcy_name");
        localStorage.removeItem("chapcy_email");
        localStorage.removeItem("chapcy_avatar");

        location.reload();

    }

});

}

/*=========================
      DAILY REWARD
=========================*/

const rewardBtn=
document.querySelector(".reward-btn");

if(rewardBtn){

rewardBtn.addEventListener("click",()=>{

    const today=
    new Date().toDateString();

    const lastReward=
    localStorage.getItem("reward");

    if(lastReward===today){

        alert("Reward already claimed today.");

    }else{

        localStorage.setItem("reward",today);

        alert("🎁 Reward Claimed!");

    }

});

}

/*=========================
      PREMIUM BUTTON
=========================*/

const premiumBtn=
document.querySelector(".premium-btn");

if(premiumBtn){

premiumBtn.addEventListener("click",()=>{

    alert("CHAPCY Premium Coming Soon 🚀");

});

                }
