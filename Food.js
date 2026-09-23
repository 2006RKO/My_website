/* =========================================================
   CHAPCY FOOD LIVE CHAT
   Firebase Realtime Database + XAMPP / MySQL
========================================================= */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyDIID2LpzjLiLeLJKgp-Vd7tNIyN-M1k",
  authDomain: "rko-website-design-2f792.firebaseapp.com",
  databaseURL: "https://rko-website-design-2f792-default-rtdb.firebaseio.com",
  projectId: "rko-website-design-2f792",
  storageBucket: "rko-website-design-2f792.firebasestorage.app",
  messagingSenderId: "782567629866",
  appId: "1:782567629866:web:d6d80d454d0653ea8b4f53",
  measurementId: "G-KQ1EKYE7E7"
};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);


/* =========================================================
   FOOD ROOM
========================================================= */

const ROOM_ID = "food";

const messagesRef = ref(
  db,
  `rooms/${ROOM_ID}/messages`
);


/* =========================================================
   XAMPP / PHP
   WEKA FILE HII NDANI YA htdocs/chapcy/
========================================================= */

const PHP_URL =
  "http://localhost/chapcy/save-food-message.php";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const chatMessages =
  document.getElementById("chatMessages");

const messageForm =
  document.getElementById("messageForm");

const messageInput =
  document.getElementById("messageInput");

const sendBtn =
  document.getElementById("sendBtn");

const emojiBtn =
  document.getElementById("emojiBtn");

const emojiPanel =
  document.getElementById("emojiPanel");

const searchInput =
  document.getElementById("searchInput");

const currentUserName =
  document.getElementById("currentUserName");

const currentUserAvatar =
  document.getElementById("currentUserAvatar");

const logoutBtn =
  document.getElementById("logoutBtn");

const menuBtn =
  document.querySelector(".menu-btn");

const sidebar =
  document.querySelector(".sidebar");

const sidebarOverlay =
  document.querySelector(".sidebar-overlay");


/* =========================================================
   FOOD EMOJIS
========================================================= */

const FOOD_EMOJIS = [
  "🍔","🍕","🌭","🍟","🌮","🌯",
  "🥪","🍗","🍖","🥩","🍤","🍣",
  "🍜","🍝","🍛","🍚","🍲","🥗",
  "🥘","🍳","🥚","🧀","🥖","🥐",
  "🥞","🧇","🍞","🍰","🎂","🧁",
  "🍪","🍩","🍫","🍭","🍬","🍓",
  "🍎","🍌","🍉","🍇","🥭","🍍",
  "🥑","🥕","🌽","🥔","🍅","🥒",
  "🥬","🧅","🧄","🌶️","☕","🧃",
  "🥤","🧋","🍵","🥛","🍹",
  "😋","😍","🔥","❤️","👏",
  "👍","🙏","😂","🤤","💯"
];


/* =========================================================
   USER DATA
========================================================= */

let currentUser = null;

let fallbackUser = null;


/* =========================================================
   LOCAL STORAGE FALLBACK
========================================================= */

function getLocalUser() {

  try {

    const saved =
      localStorage.getItem("chapcyUser");

    if (!saved) return null;

    return JSON.parse(saved);

  } catch (error) {

    console.error(
      "Local user error:",
      error
    );

    return null;
  }
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   GET USER NAME
========================================================= */

function getUserName(firebaseUser) {

  if (firebaseUser?.displayName) {
    return firebaseUser.displayName;
  }

  const local =
    getLocalUser();

  if (local?.name) {
    return local.name;
  }

  if (local?.displayName) {
    return local.displayName;
  }

  return "CHAPCY User";
}


/* =========================================================
   GET USER PHONE
========================================================= */

function getUserPhone(firebaseUser) {

  if (firebaseUser?.phoneNumber) {
    return firebaseUser.phoneNumber;
  }

  const local =
    getLocalUser();

  return (
    local?.phone ||
    local?.phoneNumber ||
    ""
  );
}


/* =========================================================
   SET USER UI
========================================================= */

function updateUserUI(user) {

  const name =
    getUserName(user);

  const initial =
    name.trim().charAt(0).toUpperCase() || "C";


  if (currentUserName) {
    currentUserName.textContent = name;
  }


  if (currentUserAvatar) {

    if (
      user?.photoURL
    ) {

      currentUserAvatar.src =
        user.photoURL;

    } else {

      currentUserAvatar.alt =
        name;

      currentUserAvatar.setAttribute(
        "data-initial",
        initial
      );
    }
  }
}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
  auth,
  (user) => {

    if (user) {

      currentUser = user;

      updateUserUI(user);

      console.log(
        "CHAPCY Food Firebase user:",
        user.uid
      );

      return;
    }


    /* -----------------------------------------------------
       FALLBACK LOCAL USER
    ----------------------------------------------------- */

    fallbackUser =
      getLocalUser();


    if (fallbackUser) {

      currentUser = null;

      updateUserUI(
        fallbackUser
      );

      console.log(
        "CHAPCY Food local user:",
        fallbackUser
      );

      return;
    }


    /* -----------------------------------------------------
       NO USER
    ----------------------------------------------------- */

    window.location.href =
      "Mychatregister.html";
  }
);


/* =========================================================
   GET ACTIVE USER UID
========================================================= */

function getUserUID() {

  if (currentUser?.uid) {
    return currentUser.uid;
  }

  const local =
    getLocalUser();

  return (
    local?.uid ||
    local?.firebase_uid ||
    "local-user"
  );
}


/* =========================================================
   CREATE MESSAGE ELEMENT
========================================================= */

function createMessageElement(
  message,
  messageId
) {

  const wrapper =
    document.createElement("div");

  const messageUID =
    message.uid || "";

  const myUID =
    getUserUID();


  const isMine =
    messageUID === myUID;


  wrapper.className =
    `message ${isMine ? "message-own" : "message-other"}`;


  wrapper.dataset.messageId =
    messageId;


  const name =
    escapeHTML(
      message.name || "CHAPCY User"
    );


  const text =
    escapeHTML(
      message.text || ""
    );


  const time =
    formatTime(
      message.timestamp
    );


  wrapper.innerHTML = `
    <div class="message-content">

      ${
        !isMine
          ? `
            <div class="message-name">
              ${name}
            </div>
          `
          : ""
      }

      <div class="message-bubble">
        ${text}
      </div>

      <div class="message-time">
        ${time}
      </div>

    </div>
  `;


  return wrapper;
}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(timestamp) {

  if (!timestamp) {
    return "now";
  }


  let date;


  if (
    typeof timestamp === "number"
  ) {

    date =
      new Date(timestamp);

  } else {

    date =
      new Date(
        Number(timestamp)
      );
  }


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "now";
  }


  return date.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}


/* =========================================================
   SHOW MESSAGE
========================================================= */

function showMessage(
  message,
  messageId
) {

  if (!chatMessages) {
    console.error(
      "chatMessages not found"
    );

    return;
  }


  /* Prevent duplicates */

  if (
    chatMessages.querySelector(
      `[data-message-id="${messageId}"]`
    )
  ) {
    return;
  }


  /* Remove empty state */

  const emptyState =
    chatMessages.querySelector(
      ".empty-state"
    );

  if (emptyState) {
    emptyState.remove();
  }


  const element =
    createMessageElement(
      message,
      messageId
    );


  chatMessages.appendChild(
    element
  );


  scrollToBottom();
}


/* =========================================================
   SCROLL CHAT
========================================================= */

function scrollToBottom() {

  if (!chatMessages) return;

  requestAnimationFrame(() => {

    chatMessages.scrollTop =
      chatMessages.scrollHeight;

  });
}


/* =========================================================
   FIREBASE REALTIME LISTENER
========================================================= */

onChildAdded(
  messagesRef,
  (snapshot) => {

    const message =
      snapshot.val();

    if (!message) return;

    showMessage(
      message,
      snapshot.key
    );
  }
);


/* =========================================================
   SEND MESSAGE TO FIREBASE
========================================================= */

async function sendMessage() {

  if (!messageInput) return;


  const text =
    messageInput.value.trim();


  if (!text) {
    return;
  }


  const name =
    getUserName(
      currentUser ||
      fallbackUser
    );


  const phone =
    getUserPhone(
      currentUser ||
      fallbackUser
    );


  const uid =
    getUserUID();


  /* Disable button */

  if (sendBtn) {
    sendBtn.disabled = true;
  }


  try {

    /* -----------------------------------------------
       FIREBASE LIVE MESSAGE
    ------------------------------------------------ */

    await push(
      messagesRef,
      {
        uid: uid,

        name: name,

        phone: phone,

        text: text,

        room: ROOM_ID,

        type: "text",

        timestamp:
          serverTimestamp()
      }
    );


    /* -----------------------------------------------
       XAMPP / MYSQL COPY
    ------------------------------------------------ */

    saveMessageToXAMPP({
      uid,
      name,
      phone,
      room: ROOM_ID,
      message: text
    });


    /* Clear input */

    messageInput.value = "";

    messageInput.focus();


  } catch (error) {

    console.error(
      "Firebase send error:",
      error
    );


    alert(
      "Ujumbe haujatumwa. Angalia internet au Firebase."
    );

  } finally {

    if (sendBtn) {
      sendBtn.disabled = false;
    }
  }
}


/* =========================================================
   SAVE MESSAGE TO XAMPP
========================================================= */

async function saveMessageToXAMPP(data) {

  try {

    const formData =
      new FormData();


    formData.append(
      "uid",
      data.uid || ""
    );

    formData.append(
      "name",
      data.name || ""
    );

    formData.append(
      "phone",
      data.phone || ""
    );

    formData.append(
      "room",
      data.room || "food"
    );

    formData.append(
      "message",
      data.message || ""
    );


    const response =
      await fetch(
        PHP_URL,
        {
          method: "POST",
          body: formData
        }
      );


    const result =
      await response.json();


    if (!result.success) {

      console.warn(
        "XAMPP save failed:",
        result.message
      );

      return;
    }


    console.log(
      "XAMPP saved:",
      result
    );


  } catch (error) {

    /*
      Firebase bado itaendelea kufanya kazi
      hata kama XAMPP haipo.
    */

    console.warn(
      "XAMPP connection unavailable:",
      error
    );
  }
}


/* =========================================================
   FORM SUBMIT
========================================================= */

if (messageForm) {

  messageForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      sendMessage();

    }
  );
}


/* =========================================================
   ENTER TO SEND
========================================================= */

if (messageInput) {

  messageInput.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        sendMessage();
      }

    }
  );
}


/* =========================================================
   EMOJI PANEL
========================================================= */

function buildEmojiPanel() {

  if (!emojiPanel) return;


  emojiPanel.innerHTML = "";


  FOOD_EMOJIS.forEach(
    (emoji) => {

      const button =
        document.createElement("button");


      button.type =
        "button";


      button.className =
        "emoji-item";


      button.textContent =
        emoji;


      button.addEventListener(
        "click",
        () => {

          if (!messageInput) {
            return;
          }


          const start =
            messageInput.selectionStart ??
            messageInput.value.length;


          const end =
            messageInput.selectionEnd ??
            messageInput.value.length;


          const before =
            messageInput.value.substring(
              0,
              start
            );


          const after =
            messageInput.value.substring(
              end
            );


          messageInput.value =
            before +
            emoji +
            after;


          messageInput.focus();


          messageInput.selectionStart =
            messageInput.selectionEnd =
              start +
              emoji.length;
        }
      );


      emojiPanel.appendChild(
        button
      );
    }
  );
}


buildEmojiPanel();


if (emojiBtn && emojiPanel) {

  emojiBtn.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      emojiPanel.classList.toggle(
        "show"
      );
    }
  );


  document.addEventListener(
    "click",
    (event) => {

      if (
        !emojiPanel.contains(event.target) &&
        !emojiBtn.contains(event.target)
      ) {

        emojiPanel.classList.remove(
          "show"
        );
      }

    }
  );
}


/* =========================================================
   SEARCH MESSAGES
========================================================= */

if (searchInput) {

  searchInput.addEventListener(
    "input",
    () => {

      const query =
        searchInput.value
          .trim()
          .toLowerCase();


      const messages =
        document.querySelectorAll(
          ".message"
        );


      messages.forEach(
        (message) => {

          const content =
            message.textContent
              .toLowerCase();


          if (
            !query ||
            content.includes(query)
          ) {

            message.style.display =
              "";

          } else {

            message.style.display =
              "none";
          }

        }
      );
    }
  );
}


/* =========================================================
   MOBILE MENU
========================================================= */

if (menuBtn && sidebar) {

  menuBtn.addEventListener(
    "click",
    () => {

      sidebar.classList.toggle(
        "open"
      );

      if (sidebarOverlay) {

        sidebarOverlay.classList.toggle(
          "show"
        );
      }
    }
  );
}


if (sidebarOverlay) {

  sidebarOverlay.addEventListener(
    "click",
    () => {

      sidebar.classList.remove(
        "open"
      );

      sidebarOverlay.classList.remove(
        "show"
      );

    }
  );
}


/* =========================================================
   ROOM NAVIGATION
========================================================= */

const foodNavigation = {

  discover:
    "FoodExplore.html",

  rooms:
    "FoodRooms.html",

  people:
    "FoodPeople.html",

  mentions:
    "Mentions.html",

  messages:
    "Message.html",

  settings:
    "Settings.html"

};


document
  .querySelectorAll(
    "[data-food-page]"
  )
  .forEach(
    (element) => {

      element.addEventListener(
        "click",
        () => {

          const page =
            element.dataset.foodPage;

          if (
            page &&
            foodNavigation[page]
          ) {

            window.location.href =
              foodNavigation[page];
          }

        }
      );

    }
  );


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    async () => {

      try {

        await signOut(auth);

      } catch (error) {

        console.error(
          "Firebase logout error:",
          error
        );

      } finally {

        localStorage.removeItem(
          "chapcyUser"
        );

        localStorage.removeItem(
          "chapcyRegisteredUsers"
        );

        window.location.href =
          "Mychatregister.html";
      }

    }
  );
}


/* =========================================================
   OPEN FOOD ROOM INFO
========================================================= */

const roomInfoBtn =
  document.getElementById(
    "roomInfoBtn"
  );

const roomInfoPanel =
  document.getElementById(
    "roomInfoPanel"
  );

const roomInfoClose =
  document.getElementById(
    "roomInfoClose"
  );


if (
  roomInfoBtn &&
  roomInfoPanel
) {

  roomInfoBtn.addEventListener(
    "click",
    () => {

      roomInfoPanel.classList.add(
        "show"
      );

    }
  );
}


if (
  roomInfoClose &&
  roomInfoPanel
) {

  roomInfoClose.addEventListener(
    "click",
    () => {

      roomInfoPanel.classList.remove(
        "show"
      );

    }
  );
}


/* =========================================================
   ONLINE STATUS
========================================================= */

const onlineStatus =
  document.getElementById(
    "onlineStatus"
  );


if (onlineStatus) {

  onlineStatus.textContent =
    "Food room online";
}


/* =========================================================
   STARTUP
========================================================= */

console.log(
  "🍔 CHAPCY Food Live Chat initialized"
);

console.log(
  "Firebase room:",
  `rooms/${ROOM_ID}/messages`
);

console.log(
  "XAMPP endpoint:",
  PHP_URL
);
