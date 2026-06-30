import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyDIID2LpzjLiqaLeLJKgp-Vd7tNIyN-M1k",
  authDomain: "rko-website-design-2f792.firebaseapp.com",
  projectId: "rko-website-design-2f792",
  storageBucket: "rko-website-design-2f792.firebasestorage.app",
  messagingSenderId: "782567629866",
  appId: "1:782567629866:web:2aa401ae2c256b778b4f53"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// REGISTER
window.registerUser = function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Registration Successful!");
      window.location.href = "chapcy.html";
    })
    .catch((error) => {
      alert(error.message);
    });
};

// LOGIN
window.loginUser = function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login Successful!");
      window.location.href = "chapcy.html";
    })
    .catch((error) => {
      alert(error.message);
    });
};
Update redirect after login
