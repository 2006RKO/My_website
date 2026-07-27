import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getDatabase
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIID2LpzjLiqaLeLJKgp-Vd7tNIyN-M1k",
  authDomain: "rko-website-design-2f792.firebaseapp.com",
  databaseURL: "https://rko-website-design-2f792-default-rtdb.firebaseio.com",
  projectId: "rko-website-design-2f792",
  storageBucket: "rko-website-design-2f792.firebasestorage.app",
  messagingSenderId: "782567629866",
  appId: "1:782567629866:web:2aa401ae2c256b778b4f53"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { db };

// REGISTER
window.registerUser = function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      document.getElementById("loadingScreen").style.display = "flex";

      setTimeout(() => {
        window.location.href = "chapcy.html";
      }, 2000);

    })
    .catch((error) => {
      alert(error.message);
    });

};

window.loginUser = function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      document.getElementById("loadingScreen").style.display = "flex";

      setTimeout(() => {
        window.location.href = "chapcy.html";
      }, 2000);

    })
    .catch((error) => {
      alert(error.message);
    });

};
