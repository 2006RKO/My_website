/*=========================================
        CHAPCY V11 ULTRA PREMIUM
              JAVASCRIPT
              PART 1
=========================================*/

"use strict";


/*==============================
        INITIALIZE
==============================*/

document.addEventListener("DOMContentLoaded",()=>{

    initializePage();

    initializeHeader();

    initializeButtons();

});



/*==============================
        PAGE FADE
==============================*/

function initializePage(){

    document.body.style.opacity="0";

    document.body.style.transition=
    "opacity .8s ease";


    requestAnimationFrame(()=>{

        document.body.style.opacity="1";

    });

}




/*==============================
        HEADER EFFECT
==============================*/

function initializeHeader(){

const header =
document.querySelector(".header");


if(!header) return;



window.addEventListener("scroll",()=>{


if(window.scrollY > 50){


header.style.background=
"rgba(5,10,30,.95)";


header.style.backdropFilter=
"blur(25px)";


header.style.boxShadow=
"0 15px 40px rgba(0,0,0,.45)";


}else{


header.style.background=
"rgba(5,10,30,.55)";


header.style.boxShadow="none";


}



});


}




/*==============================
        PREMIUM BUTTON EFFECT
==============================*/


function initializeButtons(){


document.querySelectorAll(
".btn,.join-btn,.follow-btn"
)
.forEach(button=>{


button.addEventListener(
"mouseenter",
()=>{


button.style.transform=
"translateY(-5px) scale(1.04)";


});





button.addEventListener(
"mouseleave",
()=>{


button.style.transform="";


});



});



}





/*==============================
        SMOOTH NAVIGATION
==============================*/


document.querySelectorAll(
'a[href^="#"]'
)
.forEach(link=>{


link.addEventListener(
"click",
function(e){


const target =
document.querySelector(
this.getAttribute("href")
);



if(target){


e.preventDefault();



target.scrollIntoView({

behavior:"smooth"

});


}



});


});
 /*=========================================
        CHAPCY V11 ULTRA PREMIUM
              JAVASCRIPT
              PART 2
        GROUP SLIDER SYSTEM
=========================================*/


/*==============================
        GROUP SLIDER
==============================*/


const groupSlider =
document.getElementById("groupSlider");


let autoSlide = null;

let isDragging = false;

let startX = 0;

let scrollPosition = 0;



function startSlider(){


if(!groupSlider) return;


stopSlider();



autoSlide = setInterval(()=>{


const card =
groupSlider.querySelector(".group-card");



if(!card) return;



const move =
card.offsetWidth + 25;



groupSlider.scrollBy({

left:move,

behavior:"smooth"

});





if(
groupSlider.scrollLeft +
groupSlider.clientWidth
>=
groupSlider.scrollWidth - 10
){


setTimeout(()=>{


groupSlider.scrollTo({

left:0,

behavior:"smooth"

});


},600);


}



},3500);



}




function stopSlider(){


if(autoSlide){


clearInterval(autoSlide);


autoSlide=null;


}


}





if(groupSlider){


startSlider();



groupSlider.addEventListener(
"mouseenter",
()=>{

stopSlider();

});




groupSlider.addEventListener(
"mouseleave",
()=>{


startSlider();


});




groupSlider.addEventListener(
"touchstart",
()=>{


stopSlider();


});





groupSlider.addEventListener(
"touchend",
()=>{


startSlider();


});



}







/*==============================
        MOUSE DRAG SLIDER
==============================*/


if(groupSlider){



groupSlider.addEventListener(
"mousedown",
(e)=>{


isDragging=true;


startX =
e.pageX -
groupSlider.offsetLeft;


scrollPosition =
groupSlider.scrollLeft;



groupSlider.style.cursor=
"grabbing";



});





groupSlider.addEventListener(
"mouseup",
()=>{


isDragging=false;


groupSlider.style.cursor=
"grab";


});





groupSlider.addEventListener(
"mouseleave",
()=>{


isDragging=false;


groupSlider.style.cursor=
"grab";


});





groupSlider.addEventListener(
"mousemove",
(e)=>{


if(!isDragging) return;



e.preventDefault();



const x =
e.pageX -
groupSlider.offsetLeft;



const walk =
(x-startX)*2;



groupSlider.scrollLeft =
scrollPosition - walk;



});


}







/*==============================
        MOBILE SWIPE
==============================*/


if(groupSlider){



groupSlider.addEventListener(
"touchstart",
(e)=>{


startX =
e.touches[0].pageX;


scrollPosition =
groupSlider.scrollLeft;



});





groupSlider.addEventListener(
"touchmove",
(e)=>{


const x =
e.touches[0].pageX;



const walk =
(x-startX)*2;



groupSlider.scrollLeft =
scrollPosition - walk;



});



}
/*=========================================
        CHAPCY V11 ULTRA PREMIUM
              JAVASCRIPT
              PART 3
        SEARCH SYSTEM
=========================================*/


/*==============================
        GROUP SEARCH
==============================*/


const searchInput =
document.querySelector(".search-box input");



function initializeSearch(){


if(!searchInput) return;



searchInput.addEventListener(
"keyup",
()=>{


const value =
searchInput.value
.toLowerCase()
.trim();



const cards =
document.querySelectorAll(
".group-card"
);





cards.forEach(card=>{


const title =
card.querySelector("h3")
?.textContent
.toLowerCase()
|| "";



const description =
card.querySelector("p")
?.textContent
.toLowerCase()
|| "";





if(
title.includes(value)
||
description.includes(value)

){


card.style.display="block";



setTimeout(()=>{

card.style.opacity="1";

card.style.transform=
"scale(1)";


},50);



}

else{


card.style.opacity="0";

card.style.transform=
"scale(.8)";



setTimeout(()=>{


card.style.display="none";


},300);



}




});



});



}





initializeSearch();







/*==============================
        CLEAR SEARCH
==============================*/


function clearSearch(){


if(!searchInput) return;



searchInput.value="";



document
.querySelectorAll(".group-card")
.forEach(card=>{


card.style.display="block";


card.style.opacity="1";


card.style.transform=
"scale(1)";



});


}







/*==============================
        ESC BUTTON
==============================*/


document.addEventListener(
"keydown",
(e)=>{


if(e.key==="Escape"){


clearSearch();


}


});







/*==============================
        SEARCH FOCUS EFFECT
==============================*/


if(searchInput){



searchInput.addEventListener(
"focus",
()=>{


searchInput.style.transform=
"scale(1.03)";

searchInput.style.boxShadow=
"0 0 30px rgba(0,217,255,.5)";


});







searchInput.addEventListener(
"blur",
()=>{


searchInput.style.transform=
"scale(1)";

searchInput.style.boxShadow=
"none";


});



}





/*==============================
        SEARCH ENTER
==============================*/


if(searchInput){



searchInput.addEventListener(
"keypress",
(e)=>{


if(e.key==="Enter"){


console.log(
"Searching:",
searchInput.value
);


}


});


}
/*=========================================
        CHAPCY V11 ULTRA PREMIUM
              JAVASCRIPT
              PART 4
      SCROLL + COUNTER ANIMATION
=========================================*/


/*==============================
        SCROLL REVEAL
==============================*/


const revealElements =
document.querySelectorAll(
".hero,.global-card,.group-card,.stat-box,.tv-card,.stories-section,.online-card,.footer"
);



const revealObserver =
new IntersectionObserver(
(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


entry.target.style.opacity="1";


entry.target.style.transform=
"translateY(0)";



entry.target.style.transition=
"all .8s ease";



revealObserver.unobserve(
entry.target
);


}



});


},
{
threshold:0.15
}
);





revealElements.forEach(item=>{


item.style.opacity="0";


item.style.transform=
"translateY(60px)";



revealObserver.observe(item);



});









/*==============================
        NUMBER COUNTER
==============================*/


const counters =
document.querySelectorAll(
".stat-box h3"
);




const counterObserver =
new IntersectionObserver(
(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


startCounter(
entry.target
);



counterObserver.unobserve(
entry.target
);



}



});


},
{
threshold:.5
}
);





counters.forEach(counter=>{


counterObserver.observe(counter);


});







function startCounter(element){



const original =
element.textContent;



const number =
parseInt(
original.replace(/\D/g,"")
);



if(isNaN(number)) return;



let current=0;



const speed =
Math.max(
20,
number/100
);





const timer =
setInterval(()=>{



current += speed;



if(current>=number){


current=number;


clearInterval(timer);


}





if(original.includes("M")){


element.textContent=
current.toFixed(0)+"M+";


}

else if(original.includes("+")){


element.textContent=
current.toFixed(0)+"+";


}

else{


element.textContent=
current.toFixed(0);


}



},20);



}









/*==============================
        CARD HOVER EFFECT
==============================*/


document
.querySelectorAll(
".group-card,.online-card,.post-card"
)
.forEach(card=>{



card.addEventListener(
"mouseenter",
()=>{


card.style.transform=
"translateY(-12px) scale(1.03)";



card.style.boxShadow=
"0 20px 45px rgba(0,217,255,.25)";



});







card.addEventListener(
"mouseleave",
()=>{


card.style.transform=
"translateY(0) scale(1)";



card.style.boxShadow=
"none";



});



});









/*==============================
        IMAGE ZOOM EFFECT
==============================*/


document
.querySelectorAll(
".group-card img,.online-card img"
)
.forEach(image=>{



image.addEventListener(
"mouseenter",
()=>{


image.style.transform=
"scale(1.08)";


image.style.transition=
".5s";


});







image.addEventListener(
"mouseleave",
()=>{


image.style.transform=
"scale(1)";


});



});
/*=========================================
        CHAPCY V11 ULTRA PREMIUM
              JAVASCRIPT
              PART 5
      PREMIUM VISUAL EFFECTS
=========================================*/


/*==============================
        BUTTON RIPPLE EFFECT
==============================*/


document
.querySelectorAll(
".btn,.join-btn,.follow-btn"
)
.forEach(button=>{


button.style.position="relative";

button.style.overflow="hidden";



button.addEventListener(
"click",
function(e){



const ripple =
document.createElement("span");



const rect =
this.getBoundingClientRect();



const size =
Math.max(
rect.width,
rect.height
);



ripple.style.width =
size+"px";


ripple.style.height =
size+"px";


ripple.style.position =
"absolute";


ripple.style.borderRadius =
"50%";


ripple.style.background =
"rgba(255,255,255,.35)";



ripple.style.left =
(e.clientX-rect.left-size/2)+"px";


ripple.style.top =
(e.clientY-rect.top-size/2)+"px";


ripple.style.transform =
"scale(0)";


ripple.style.animation =
"chapcyRipple .7s linear";



this.appendChild(ripple);



setTimeout(()=>{

ripple.remove();

},700);



});

});









/*==============================
        BACKGROUND PARALLAX
==============================*/


const backgroundVideo =
document.querySelector(
".bg-video"
);



window.addEventListener(
"scroll",
()=>{


if(backgroundVideo){



backgroundVideo.style.transform =
"translateY("+
window.scrollY * 0.15+
"px)";



}



});









/*==============================
        MOUSE GLOW EFFECT
==============================*/


document
.querySelectorAll(
".group-card,.online-card"
)
.forEach(card=>{



card.addEventListener(
"mousemove",
(e)=>{



const rect =
card.getBoundingClientRect();



const x =
e.clientX - rect.left;



const y =
e.clientY - rect.top;



card.style.background =
`
radial-gradient(
circle at ${x}px ${y}px,
rgba(0,217,255,.25),
rgba(10,18,45,.95)
)
`;



});







card.addEventListener(
"mouseleave",
()=>{


card.style.background =
"";


});



});









/*==============================
        LAZY IMAGE LOAD
==============================*/


document
.querySelectorAll("img")
.forEach(img=>{


img.loading="lazy";


});









/*==============================
        BACK TO TOP BUTTON
==============================*/


const topButton =
document.createElement("button");



topButton.className =
"top-button";



topButton.innerHTML =
`
<i class="fas fa-arrow-up"></i>
`;



document.body.appendChild(
topButton
);





topButton.style.opacity="0";

topButton.style.pointerEvents="none";







topButton.onclick = ()=>{


window.scrollTo({

top:0,

behavior:"smooth"

});


};







window.addEventListener(
"scroll",
()=>{


if(window.scrollY > 500){



topButton.style.opacity="1";


topButton.style.pointerEvents=
"auto";



}

else{



topButton.style.opacity="0";


topButton.style.pointerEvents=
"none";



}



});









/*==============================
        PAGE READY
==============================*/


window.addEventListener(
"load",
()=>{


console.log(
"✅ CHAPCY V11 PREMIUM Loaded"
);



});
/*=========================================
        CHAPCY V11 ULTRA PREMIUM
              JAVASCRIPT
              PART 6
      STORIES + USERS + FEED
=========================================*/



/*==============================
        STORIES EFFECT
==============================*/


const stories =
document.querySelectorAll(".story");



stories.forEach(story=>{


story.addEventListener(
"click",
()=>{


story.style.transform=
"scale(1.15)";



story.style.filter=
"brightness(1.3)";



setTimeout(()=>{


story.style.transform=
"scale(1)";


story.style.filter=
"brightness(1)";


},400);



});


});









/*==============================
        ONLINE USER CARD
==============================*/


const onlineCards =
document.querySelectorAll(
".online-card"
);



onlineCards.forEach(card=>{



card.addEventListener(
"mouseenter",
()=>{


card.style.transform=
"translateY(-10px) scale(1.04)";


});






card.addEventListener(
"mouseleave",
()=>{


card.style.transform=
"translateY(0) scale(1)";


});



});









/*==============================
        FOLLOW SYSTEM
==============================*/


const followButtons =
document.querySelectorAll(
".follow-btn"
);



followButtons.forEach(button=>{



button.addEventListener(
"click",
(e)=>{


e.preventDefault();



if(button.innerText==="Follow"){


button.innerHTML=
"✓ Following";



button.style.background=
"linear-gradient(135deg,#00ff95,#00d9ff)";



}

else{


button.innerHTML=
"Follow";



button.style.background=
"";


}



});


});









/*==============================
        FEED LIKE SYSTEM
==============================*/


const actionButtons =
document.querySelectorAll(
".action-btn"
);



actionButtons.forEach(button=>{



button.addEventListener(
"click",
()=>{



if(button.innerHTML.includes("Like")){


button.innerHTML=
"❤️ Liked";



button.style.color=
"#ff3d8d";


}

else if(
button.innerHTML.includes("Liked")
){


button.innerHTML=
"❤️ Like";


button.style.color=
"";


}



});



});









/*==============================
        COMMENT BOX
==============================*/


const commentButtons =
document.querySelectorAll(
".comment-box button"
);



commentButtons.forEach(button=>{


button.addEventListener(
"click",
()=>{


const input =
button.parentElement
.querySelector("input");



if(input.value.trim() !== ""){



const comment =
document.createElement("p");



comment.className=
"user-comment";



comment.innerHTML=
"💬 "+input.value;



button.parentElement
.parentElement
.appendChild(comment);



input.value="";



}



});


});









/*==============================
        ONLINE STATUS ANIMATION
==============================*/


const status =
document.querySelectorAll(
".status"
);



status.forEach(item=>{


setInterval(()=>{


item.style.boxShadow=
"0 0 25px #00ff95";



setTimeout(()=>{


item.style.boxShadow=
"none";


},700);



},2000);



});
/*=========================================
        CHAPCY V11 ULTRA PREMIUM
              JAVASCRIPT
              PART 7
      CHAT + VOICE + NOTIFICATIONS
=========================================*/



/*==============================
        CHAT SEND MESSAGE
==============================*/


const sendButton =
document.querySelector(".send-btn");


const chatInput =
document.querySelector(".chat-input input");


const messages =
document.querySelector(".messages");





function sendMessage(){


if(!chatInput || !messages)
return;



const text =
chatInput.value.trim();



if(text==="") return;




const message =
document.createElement("div");



message.className=
"message sent";



message.innerHTML=
`
${text}

<span class="message-time">
Now
</span>
`;



messages.appendChild(message);



chatInput.value="";



messages.scrollTop =
messages.scrollHeight;



showTyping();



}







if(sendButton){


sendButton.addEventListener(
"click",
sendMessage
);


}





if(chatInput){


chatInput.addEventListener(
"keypress",
(e)=>{


if(e.key==="Enter"){


sendMessage();


}



});


}









/*==============================
        TYPING INDICATOR
==============================*/


function showTyping(){



if(!messages) return;



const typing =
document.createElement("div");



typing.className=
"typing";



typing.innerHTML=
"CHAPCY user is typing...";



messages.appendChild(typing);





setTimeout(()=>{


typing.remove();



receiveMessage();



},2000);



}









/*==============================
        AUTO REPLY
==============================*/


function receiveMessage(){



if(!messages) return;



const reply =
document.createElement("div");



reply.className=
"message received";



reply.innerHTML=
`
Welcome to CHAPCY 🌍

<span class="message-time">
Now
</span>
`;



messages.appendChild(reply);



messages.scrollTop =
messages.scrollHeight;



}









/*==============================
        VOICE BUTTON
==============================*/


document
.querySelectorAll(".live-btn")
.forEach(button=>{



if(button.innerHTML.includes("🎤")){


button.addEventListener(
"click",
()=>{


button.innerHTML="🔴 Listening";



setTimeout(()=>{


button.innerHTML="🎤";


},2000);



});


}



});









/*==============================
        VIDEO CALL
==============================*/


document
.querySelectorAll(".live-btn")
.forEach(button=>{



if(button.innerHTML.includes("📞")){


button.addEventListener(
"click",
()=>{


alert(
"📞 Connecting CHAPCY Video Call..."
);



});


}



});









/*==============================
        NOTIFICATION BADGE
==============================*/


const bell =
document.querySelector(
".fa-bell"
);



if(bell){



const badge =
document.createElement("span");



badge.className=
"notification-number";



badge.innerHTML="3";



bell.style.position=
"relative";



bell.appendChild(badge);





bell.addEventListener(
"click",
()=>{


badge.innerHTML="";


alert(
"No new notifications"
);



});


}









/*==============================
        MESSAGE SOUND STYLE
==============================*/


function messageAlert(){


if(navigator.vibrate){


navigator.vibrate(100);


}


        }
/*=========================================
        CHAPCY V11 ULTRA PREMIUM
              JAVASCRIPT
              PART 8
      PROFILE + SETTINGS SYSTEM
=========================================*/



/*==============================
        PROFILE FOLLOWERS
==============================*/


const profileButtons =
document.querySelectorAll(
".profile-btn"
);



profileButtons.forEach(button=>{


button.addEventListener(
"click",
()=>{


if(button.innerText.includes("Follow")){


button.innerHTML=
"✓ Following";



button.style.background=
"linear-gradient(135deg,#00ff95,#00d9ff)";



}

else if(
button.innerText.includes("Following")
){


button.innerHTML=
"Follow";


button.style.background="";


}



});


});









/*==============================
        PROFILE IMAGE EFFECT
==============================*/


document
.querySelectorAll(
".profile-img"
)
.forEach(image=>{



image.addEventListener(
"click",
()=>{


image.classList.toggle(
"profile-active"
);



});


});









/*==============================
        DARK MODE SYSTEM
==============================*/


const darkMode =
document.querySelector(
".switch input"
);



if(darkMode){



darkMode.addEventListener(
"change",
()=>{


document.body.classList.toggle(
"dark-mode"
);



localStorage.setItem(

"chapcyDark",

document.body.classList.contains(
"dark-mode"
)

);



});



}









/*==============================
        SAVE DARK MODE
==============================*/


if(
localStorage.getItem(
"chapcyDark"
)==="true"
){


document.body.classList.add(
"dark-mode"
);



if(darkMode){

darkMode.checked=true;

}


}









/*==============================
        USER MEMORY
==============================*/


let chapcyUser =
localStorage.getItem(
"chapcyUser"
);



if(!chapcyUser){



chapcyUser =
prompt(
"Welcome to CHAPCY 🌍 Enter your name:"
);



if(chapcyUser){



localStorage.setItem(
"chapcyUser",
chapcyUser
);



}



}









/*==============================
        DISPLAY USER NAME
==============================*/


const userNames =
document.querySelectorAll(
".username,.profile-info h1"
);



userNames.forEach(name=>{


if(chapcyUser){


name.innerHTML =
chapcyUser;


}



});









/*==============================
        SETTINGS SAVE
==============================*/


const settingsCards =
document.querySelectorAll(
".settings-card"
);



settingsCards.forEach(card=>{



card.addEventListener(
"click",
()=>{


card.style.transform=
"scale(1.03)";



setTimeout(()=>{


card.style.transform=
"scale(1)";



},300);



});


});









/*==============================
        REMEMBER VISITS
==============================*/


let visits =
localStorage.getItem(
"chapcyVisits"
);



visits =
visits ? Number(visits)+1 : 1;



localStorage.setItem(
"chapcyVisits",
visits
);



console.log(
"CHAPCY visits:",
visits
);









/*==============================
        LOGOUT FUNCTION
==============================*/


function chapcyLogout(){



localStorage.removeItem(
"chapcyUser"
);



location.reload();



}
