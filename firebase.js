// ==========================================
// CHAPCY FIREBASE CONFIG
// ==========================================

import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import { getDatabase } from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyDIID2LpzjLiqaLeLJKgp-Vd7tNIyN-M1k",

    authDomain:
        "rko-website-design-2f792.firebaseapp.com",

    databaseURL:
        "https://rko-website-design-2f792-default-rtdb.firebaseio.com",

    projectId:
        "rko-website-design-2f792",

    storageBucket:
        "rko-website-design-2f792.firebasestorage.app",

    messagingSenderId:
        "782567629866",

    appId:
        "1:782567629866:web:d6d80d454d0653ea8b4f53",

    measurementId:
        "G-KQ1EKYE7E7"

};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app =
    initializeApp(firebaseConfig);


// ==========================================
// AUTH
// ==========================================

const auth =
    getAuth(app);


// ==========================================
// REALTIME DATABASE
// ==========================================

const db =
    getDatabase(app);


// ==========================================
// EXPORT
// ==========================================

export {
    auth,
    db
};
