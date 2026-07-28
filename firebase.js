import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0k-VGDQCb07z8VU1lfj4PS0nQ1SJjt-U",
  authDomain: "rko-website-design-8e1b6.firebaseapp.com",
  projectId: "rko-website-design-8e1b6",
  storageBucket: "rko-website-design-8e1b6.firebasestorage.app",
  messagingSenderId: "18344688958",
  appId: "1:18344688958:web:605719f065d65fddf1c06f",
  measurementId: "G-JYRSY3P5DC"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
