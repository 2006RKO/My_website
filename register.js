/*=========================================
          CHAPCY BOOK FLIP JS
               PART 3A
=========================================*/

console.log("CHAPCY REGISTER JS STARTED");

/*=========================
        ELEMENTS
=========================*/

const book = document.querySelector(".book");

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

const backRegister = document.getElementById("backRegister");
const backLogin = document.getElementById("backLogin");

const registerPanel = document.getElementById("registerPanel");
const loginPanel = document.getElementById("loginPanel");

const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");

/*=========================
     OPEN REGISTER
=========================*/

function openRegister(){

    book.classList.remove("open-login");

    book.classList.add("open-register");

    registerPanel.classList.add("active");

    loginPanel.classList.remove("active");

}

/*=========================
      OPEN LOGIN
=========================*/

function openLogin(){

    book.classList.remove("open-register");

    book.classList.add("open-login");

    loginPanel.classList.add("active");

    registerPanel.classList.remove("active");

}

/*=========================
        CLOSE BOOK
=========================*/

function closeBook(){

    book.classList.remove("open-register");

    book.classList.remove("open-login");

    registerPanel.classList.remove("active");

    loginPanel.classList.remove("active");

}

/*=========================
        EVENTS
=========================*/

registerBtn.addEventListener("click", openRegister);

loginBtn.addEventListener("click", openLogin);

backRegister.addEventListener("click", closeBook);

backLogin.addEventListener("click", closeBook);

/*=========================
    SWITCH PANELS
=========================*/

showLogin.addEventListener("click", function(e){

    e.preventDefault();

    openLogin();

});

showRegister.addEventListener("click", function(e){

    e.preventDefault();

    openRegister();

});
/*=========================================
        CHAPCY BOOK FLIP JS
              PART 3B
=========================================*/

/*=========================
      RIPPLE EFFECT
=========================*/

document.querySelectorAll("button").forEach(button=>{

    button.addEventListener("click",function(e){

        const ripple=document.createElement("span");

        const rect=this.getBoundingClientRect();

        const size=Math.max(rect.width,rect.height);

        ripple.style.position="absolute";
        ripple.style.width=size+"px";
        ripple.style.height=size+"px";

        ripple.style.left=(e.clientX-rect.left-size/2)+"px";
        ripple.style.top=(e.clientY-rect.top-size/2)+"px";

        ripple.style.borderRadius="50%";
        ripple.style.background="rgba(255,255,255,.35)";
        ripple.style.transform="scale(0)";
        ripple.style.pointerEvents="none";
        ripple.style.animation="ripple .6s linear";

        this.style.position="relative";
        this.style.overflow="hidden";

        this.appendChild(ripple);

        setTimeout(()=>{

            ripple.remove();

        },600);

    });

});

/*=========================
     FLOATING PARTICLES
=========================*/

const particles=document.querySelector(".particles");

function createParticle(){

    if(!particles) return;

    const dot=document.createElement("span");

    dot.style.position="absolute";

    const size=Math.random()*6+3;

    dot.style.width=size+"px";
    dot.style.height=size+"px";

    dot.style.left=Math.random()*100+"%";

    dot.style.bottom="-20px";

    dot.style.background="white";

    dot.style.opacity=Math.random();

    dot.style.borderRadius="50%";

    dot.style.pointerEvents="none";

    dot.style.animation=`floatParticle ${6+Math.random()*5}s linear`;

    particles.appendChild(dot);

    setTimeout(()=>{

        dot.remove();

    },11000);

}

setInterval(createParticle,400);

/*=========================
    BUTTON GLOW EFFECT
=========================*/

setInterval(()=>{

    if(book.classList.contains("open-register") ||
       book.classList.contains("open-login")){

        book.style.filter="drop-shadow(0 0 25px #00cfff)";

        setTimeout(()=>{

            book.style.filter="";

        },700);

    }

},3000);

/*=========================
     DYNAMIC KEYFRAMES
=========================*/

const style=document.createElement("style");

style.innerHTML=`

@keyframes ripple{

to{

transform:scale(4);

opacity:0;

}

}

@keyframes floatParticle{

0%{

transform:translateY(0);

opacity:0;

}

15%{

opacity:1;

}

100%{

transform:translateY(-110vh);

opacity:0;

}

}

`;

document.head.appendChild(style);

/*=========================
      PAGE LOADED
=========================*/

window.addEventListener("load",()=>{

    book.style.opacity="0";

    book.style.transform="translateY(50px)";

    setTimeout(()=>{

        book.style.transition=".8s ease";

        book.style.opacity="1";

        book.style.transform="translateY(0)";

    },150);

});
const firebaseConfig = {
  apiKey: "WEKA_API_KEY",
  authDomain: "PROJECT.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
/*=========================================
        CHAPCY FIREBASE AUTH
              PART 3C
=========================================*/


const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");



/*=========================
        REGISTER
=========================*/


registerForm.addEventListener("submit", (e)=>{

    e.preventDefault();


    const email =
    registerForm.querySelector('input[type="email"]').value;


    const password =
    registerForm.querySelectorAll('input[type="password"]')[0].value;


    firebase.auth()
    .createUserWithEmailAndPassword(email,password)

    .then((userCredential)=>{


        const user = userCredential.user;


        // SAVE USER DATA

        return firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .set({

            email:email,

            xp:0,

            coins:0,

            level:1,

            friends:0,

            joined:
            new Date()

        });


    })


    .then(()=>{


        alert("Welcome to CHAPCY 🚀");


        window.location.href="chapcy.html";


    })


    .catch(error=>{


        alert(error.message);


    });


});





/*=========================
          LOGIN
=========================*/


loginForm.addEventListener("submit",(e)=>{


    e.preventDefault();


    const email =
    loginForm.querySelector('input[type="email"]').value;


    const password =
    loginForm.querySelector('input[type="password"]').value;



    firebase.auth()

    .signInWithEmailAndPassword(email,password)

    .then(()=>{


        alert("Welcome Back CHAPCY 🌍");


        window.location.href="chapcy.html";


    })


    .catch(error=>{


        alert(error.message);


    });


});
