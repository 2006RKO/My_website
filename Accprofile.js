/* =========================================================
   CHAPCY PROFILE JS
   Firebase Auth + Realtime Database + Storage
   ========================================================= */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getDatabase,
  ref,
  get,
  set,
  update,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";


/* =========================================================
   FIREBASE CONFIG
   ========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyDIID2LpzjLiqaLeLJKgp-Vd7tNIyN-M1k",
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
const storage = getStorage(app);


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let currentUser = null;
let currentProfile = null;
let selectedPhotoFile = null;
let profileListener = null;


/* =========================================================
   DOM HELPER
   ========================================================= */

const $ = (id) => document.getElementById(id);

function setText(id, value) {
  const element = $(id);

  if (element) {
    element.textContent = value ?? "";
  }
}

function setImage(id, url) {
  const element = $(id);

  if (element && url) {
    element.src = url;
  }
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

  const toast = $("profileToast");
  const toastMessage = $("toastMessage");

  if (!toast) {
    console.log("CHAPCY:", message);
    return;
  }

  if (toastMessage) {
    toastMessage.textContent = message;
  }

  toast.classList.add("show");

  clearTimeout(window.chapcyToastTimer);

  window.chapcyToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

window.showToast = showToast;


/* =========================================================
   GENERATE CHAPCY ID
   ========================================================= */

function generateChapcyId(uid) {

  if (!uid) {
    return "CPY-00000000";
  }

  const cleanUID = uid
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();

  return "CPY-" + cleanUID.slice(-8);
}


/* =========================================================
   DEFAULT PROFILE
   ========================================================= */

function createDefaultProfile(user) {

  return {
    uid: user.uid,

    displayName:
      user.displayName ||
      "CHAPCY User",

    username:
      user.email
        ? user.email.split("@")[0]
        : "chapcyuser",

    photoURL:
      user.photoURL ||
      "file_00000000b0d8820a998b33ad9cf233cb.png",

    bio:
      "Welcome to my CHAPCY profile.",

    chapcyId:
      generateChapcyId(user.uid),

    followersCount: 0,

    friendsCount: 0,

    chapcyPoints: 0,

    walletBalance: 0,

    online: true,

    createdAt: Date.now()
  };
}


/* =========================================================
   LOAD CURRENT PROFILE
   ========================================================= */

async function loadCurrentProfile(user) {

  currentUser = user;

  const userRef = ref(db, `users/${user.uid}`);

  try {

    const snapshot = await get(userRef);

    if (!snapshot.exists()) {

      const defaultProfile = createDefaultProfile(user);

      await set(userRef, defaultProfile);

      currentProfile = defaultProfile;

      renderProfile(defaultProfile);

    } else {

      currentProfile = snapshot.val();

      if (!currentProfile.chapcyId) {

        currentProfile.chapcyId =
          generateChapcyId(user.uid);

        await update(userRef, {
          chapcyId: currentProfile.chapcyId
        });
      }

      renderProfile(currentProfile);
    }

    listenToProfile(user.uid);

  } catch (error) {

    console.error(
      "CHAPCY profile loading error:",
      error
    );

    showToast(
      "Unable to load profile"
    );
  }
}


/* =========================================================
   REALTIME PROFILE LISTENER
   ========================================================= */

function listenToProfile(uid) {

  const userRef = ref(db, `users/${uid}`);

  if (profileListener) {
    profileListener();
    profileListener = null;
  }

  profileListener = onValue(
    userRef,
    (snapshot) => {

      if (!snapshot.exists()) {
        return;
      }

      currentProfile = snapshot.val();

      renderProfile(currentProfile);

    },
    (error) => {

      console.error(
        "Profile realtime error:",
        error
      );
    }
  );
}


/* =========================================================
   RENDER PROFILE
   ========================================================= */

function renderProfile(profile) {

  if (!profile) {
    return;
  }


  /* -----------------------------------------
     PROFILE PHOTO
     ----------------------------------------- */

  const photo =
    profile.photoURL ||
    "file_00000000b0d8820a998b33ad9cf233cb.png";

  setImage("profileImage", photo);
  setImage("editProfileImage", photo);
  setImage("headerProfileImage", photo);


  /* -----------------------------------------
     NAME
     ----------------------------------------- */

  setText(
    "profileName",
    profile.displayName || "CHAPCY User"
  );


  /* -----------------------------------------
     USERNAME
     ----------------------------------------- */

  let username =
    profile.username ||
    "chapcyuser";

  if (!username.startsWith("@")) {
    username = "@" + username;
  }

  setText(
    "profileUsername",
    username
  );


  /* -----------------------------------------
     CHAPCY ID
     ----------------------------------------- */

  setText(
    "chapcyUserId",
    profile.chapcyId ||
    generateChapcyId(profile.uid)
  );


  /* -----------------------------------------
     BIO
     ----------------------------------------- */

  setText(
    "profileBio",
    profile.bio ||
    "Welcome to my CHAPCY profile."
  );


  /* -----------------------------------------
     STATS
     ----------------------------------------- */

  setText(
    "followersCount",
    formatNumber(
      profile.followersCount || 0
    )
  );

  setText(
    "friendsCount",
    formatNumber(
      profile.friendsCount || 0
    )
  );

  setText(
    "profilePoints",
    formatNumber(
      profile.chapcyPoints || 0
    )
  );


  /* -----------------------------------------
     WALLET
     ----------------------------------------- */

  setText(
    "walletBalance",
    formatMoney(
      profile.walletBalance || 0
    )
  );


  /* -----------------------------------------
     ONLINE STATUS
     ----------------------------------------- */

  const online =
    $("profileOnline");

  if (online) {

    if (profile.online === true) {
      online.classList.add("active");
      online.style.display = "block";
    } else {
      online.classList.remove("active");
      online.style.display = "none";
    }
  }


  /* -----------------------------------------
     EDIT FORM
     ----------------------------------------- */

  setText(
    "editDisplayName",
    profile.displayName || ""
  );

  setText(
    "editUsername",
    profile.username || ""
  );

  setText(
    "editBio",
    profile.bio || ""
  );


  /* -----------------------------------------
     BIO COUNTER
     ----------------------------------------- */

  updateBioCounter(
    profile.bio || ""
  );


  /* -----------------------------------------
     VIDEOS
     ----------------------------------------- */

  renderVideos(
    profile.videos || {}
  );
}


/* =========================================================
   FORMAT NUMBER
   ========================================================= */

function formatNumber(number) {

  const value =
    Number(number) || 0;

  return value.toLocaleString();
}


/* =========================================================
   FORMAT MONEY
   ========================================================= */

function formatMoney(amount) {

  const value =
    Number(amount) || 0;

  return value.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  );
}


/* =========================================================
   COPY CHAPCY ID
   ========================================================= */

const copyChapcyId =
  $("copyChapcyId");

if (copyChapcyId) {

  copyChapcyId.addEventListener(
    "click",
    async () => {

      const id =
        $("chapcyUserId")?.textContent;

      if (!id) {
        return;
      }

      try {

        await navigator.clipboard.writeText(id);

        showToast(
          "CHAPCY ID copied"
        );

      } catch (error) {

        console.error(error);

        showToast(
          "Unable to copy CHAPCY ID"
        );
      }
    }
  );
}


/* =========================================================
   EDIT PROFILE MODAL
   ========================================================= */

function openEditProfile() {

  const modal =
    $("editProfileModal");

  if (!modal) {
    return;
  }

  if (currentProfile) {

    setInput(
      "editDisplayName",
      currentProfile.displayName || ""
    );

    setInput(
      "editUsername",
      currentProfile.username || ""
    );

    setInput(
      "editBio",
      currentProfile.bio || ""
    );

    setImage(
      "editProfileImage",
      currentProfile.photoURL ||
      "file_00000000b0d8820a998b33ad9cf233cb.png"
    );
  }

  modal.classList.add("show");

  document.body.classList.add(
    "modal-open"
  );
}

window.openEditProfile =
  openEditProfile;


/* =========================================================
   EDIT BUTTON
   ========================================================= */

const editProfileBtn =
  $("editProfileBtn");

if (editProfileBtn) {

  editProfileBtn.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      event.stopPropagation();

      openEditProfile();
    }
  );
}


/* =========================================================
   CLOSE EDIT MODAL
   ========================================================= */

function closeEditProfile() {

  const modal =
    $("editProfileModal");

  if (!modal) {
    return;
  }

  modal.classList.remove("show");

  document.body.classList.remove(
    "modal-open"
  );
}


const closeEditProfileBtn =
  $("closeEditProfile");

if (closeEditProfileBtn) {

  closeEditProfileBtn.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      closeEditProfile();
    }
  );
}


/* =========================================================
   CLOSE MODAL BY BACKDROP
   ========================================================= */

const editModal =
  $("editProfileModal");

if (editModal) {

  editModal.addEventListener(
    "click",
    (event) => {

      if (
        event.target === editModal
      ) {
        closeEditProfile();
      }
    }
  );
}


/* =========================================================
   INPUT HELPER
   ========================================================= */

function setInput(id, value) {

  const input = $(id);

  if (input) {
    input.value = value ?? "";
  }
}


/* =========================================================
   PROFILE PHOTO INPUT
   ========================================================= */

const profilePhotoInput =
  $("profilePhotoInput");

if (profilePhotoInput) {

  profilePhotoInput.addEventListener(
    "change",
    (event) => {

      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {

        showToast(
          "Please select an image"
        );

        return;
      }

      if (file.size > 5 * 1024 * 1024) {

        showToast(
          "Image must be below 5MB"
        );

        return;
      }

      selectedPhotoFile = file;

      const preview =
        URL.createObjectURL(file);

      setImage(
        "editProfileImage",
        preview
      );
    }
  );
}


/* =========================================================
   EDIT PROFILE IMAGE BUTTON
   ========================================================= */

const editPhotoBtn =
  $("editPhotoBtn");

if (editPhotoBtn) {

  editPhotoBtn.addEventListener(
    "click",
    () => {

      if (profilePhotoInput) {
        profilePhotoInput.click();
      }
    }
  );
}


/* =========================================================
   BIO COUNTER
   ========================================================= */

function updateBioCounter(value) {

  const counter =
    $("bioCounter");

  if (!counter) {
    return;
  }

  const length =
    (value || "").length;

  counter.textContent =
    `${length}/150`;
}


const editBio =
  $("editBio");

if (editBio) {

  editBio.addEventListener(
    "input",
    () => {

      updateBioCounter(
        editBio.value
      );
    }
  );
}


/* =========================================================
   SAVE PROFILE
   ========================================================= */

const editProfileForm =
  $("editProfileForm");

if (editProfileForm) {

  editProfileForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      if (!currentUser) {

        showToast(
          "Please login first"
        );

        return;
      }

      const saveButton =
        $("saveProfileBtn");

      if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent =
          "Saving...";
      }

      try {

        const displayName =
          $("editDisplayName")
            ?.value
            ?.trim() ||
          "CHAPCY User";

        let username =
          $("editUsername")
            ?.value
            ?.trim() ||
          "chapcyuser";

        username =
          username
            .replace(/^@+/, "")
            .replace(/\s+/g, "")
            .toLowerCase();

        const bio =
          $("editBio")
            ?.value
            ?.trim() ||
          "";


        /* -------------------------------------
           PHOTO UPLOAD
           ------------------------------------- */

        let photoURL =
          currentProfile?.photoURL ||
          currentUser.photoURL ||
          "file_00000000b0d8820a998b33ad9cf233cb.png";


        if (selectedPhotoFile) {

          const extension =
            getFileExtension(
              selectedPhotoFile.name
            );

          const fileRef =
            storageRef(
              storage,
              `profilePhotos/${currentUser.uid}/profile.${extension}`
            );

          await uploadBytes(
            fileRef,
            selectedPhotoFile
          );

          photoURL =
            await getDownloadURL(
              fileRef
            );
        }


        /* -------------------------------------
           UPDATE FIREBASE AUTH
           ------------------------------------- */

        await updateProfile(
          currentUser,
          {
            displayName,
            photoURL
          }
        );


        /* -------------------------------------
           UPDATE REALTIME DATABASE
           ------------------------------------- */

        const userRef =
          ref(
            db,
            `users/${currentUser.uid}`
          );

        await update(
          userRef,
          {
            displayName,
            username,
            bio,
            photoURL,
            updatedAt: Date.now()
          }
        );


        /* -------------------------------------
           LOCAL DATA
           ------------------------------------- */

        currentProfile = {
          ...currentProfile,

          displayName,
          username,
          bio,
          photoURL,
          uid: currentUser.uid
        };


        renderProfile(
          currentProfile
        );


        selectedPhotoFile = null;

        if (profilePhotoInput) {
          profilePhotoInput.value = "";
        }


        closeEditProfile();

        showToast(
          "Profile updated successfully"
        );

      } catch (error) {

        console.error(
          "Profile save error:",
          error
        );

        showToast(
          error?.message ||
          "Unable to save profile"
        );

      } finally {

        if (saveButton) {

          saveButton.disabled = false;

          saveButton.textContent =
            "Save Profile";
        }
      }
    }
  );
}


/* =========================================================
   FILE EXTENSION
   ========================================================= */

function getFileExtension(filename) {

  const parts =
    filename.split(".");

  if (parts.length < 2) {
    return "jpg";
  }

  return parts
    .pop()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") || "jpg";
}


/* =========================================================
   SHARE PROFILE
   ========================================================= */

const shareProfileBtn =
  $("shareProfileBtn");

if (shareProfileBtn) {

  shareProfileBtn.addEventListener(
    "click",
    async () => {

      if (!currentUser) {
        return;
      }

      const username =
        currentProfile?.username ||
        "chapcyuser";

      const profileURL =
        `${window.location.origin}${window.location.pathname}?user=${encodeURIComponent(
          username
        )}`;

      const shareData = {

        title:
          `${currentProfile?.displayName || "CHAPCY User"} | CHAPCY`,

        text:
          `Check out my CHAPCY profile @${username}`,

        url:
          profileURL
      };


      try {

        if (
          navigator.share
        ) {

          await navigator.share(
            shareData
          );

        } else {

          await navigator.clipboard.writeText(
            profileURL
          );

          showToast(
            "Profile link copied"
          );
        }

      } catch (error) {

        if (
          error?.name !==
          "AbortError"
        ) {

          console.error(error);

          showToast(
            "Unable to share profile"
          );
        }
      }
    }
  );
}


/* =========================================================
   WALLET — DISPLAY ONLY
   ========================================================= */

const addMoneyBtn =
  $("addMoneyBtn");

if (addMoneyBtn) {

  addMoneyBtn.addEventListener(
    "click",
    () => {

      showToast(
        "Add Money feature is ready for payment integration"
      );
    }
  );
}


const withdrawBtn =
  $("withdrawBtn");

if (withdrawBtn) {

  withdrawBtn.addEventListener(
    "click",
    () => {

      showToast(
        "Withdraw feature is ready for payment integration"
      );
    }
  );
}


/* =========================================================
   PROFILE MENU
   ========================================================= */

const profileMenuBtn =
  $("profileMenuBtn");

if (profileMenuBtn) {

  profileMenuBtn.addEventListener(
    "click",
    () => {

      showToast(
        "CHAPCY profile menu"
      );
    }
  );
}


/* =========================================================
   TABS
   ========================================================= */

const tabButtons =
  document.querySelectorAll(
    ".profile-tab"
  );

tabButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        tabButtons.forEach(
          (item) => {
            item.classList.remove(
              "active"
            );
          }
        );

        button.classList.add(
          "active"
        );

        const tab =
          button.dataset.tab;

        handleProfileTab(
          tab
        );
      }
    );
  }
);


/* =========================================================
   TAB HANDLER
   ========================================================= */

function handleProfileTab(tab) {

  if (!tab) {
    return;
  }

  if (tab === "videos") {

    if (currentProfile) {
      renderVideos(
        currentProfile.videos || {}
      );
    }

    return;
  }


  if (tab === "liked") {

    renderEmptyTab(
      "No liked videos yet"
    );

    return;
  }


  if (tab === "saved") {

    renderEmptyTab(
      "No saved videos yet"
    );

    return;
  }
}


/* =========================================================
   RENDER VIDEOS
   ========================================================= */

function renderVideos(videos) {

  const grid =
    $("userVideosGrid");

  const empty =
    $("emptyVideos");

  if (!grid) {
    return;
  }

  grid.innerHTML = "";


  let videoList = [];


  if (
    Array.isArray(videos)
  ) {

    videoList =
      videos.map(
        (video, index) => ({
          ...video,
          id: video?.id || index
        })
      );

  } else if (
    videos &&
    typeof videos === "object"
  ) {

    videoList =
      Object.entries(videos)
        .map(
          ([id, video]) => ({
            ...(video || {}),
            id
          })
        );
  }


  if (!videoList.length) {

    if (empty) {
      empty.style.display = "block";
    }

    return;
  }


  if (empty) {
    empty.style.display = "none";
  }


  videoList.forEach(
    (video) => {

      const card =
        document.createElement("article");

      card.className =
        "profile-video-card";


      const image =
        video.thumbnail ||
        video.cover ||
        video.image ||
        "file_00000000b3448243aebfedfba8912525.png";


      card.innerHTML = `
        <img
          src="${escapeHTML(image)}"
          alt="CHAPCY Video"
          loading="lazy"
        >

        <div class="profile-video-overlay">
          <span>
            <i class="fa-solid fa-play"></i>
            ${formatNumber(video.views || 0)}
          </span>
        </div>
      `;


      card.addEventListener(
        "click",
        () => {

          if (video.url) {

            window.location.href =
              video.url;

            return;
          }

          if (video.id) {

            window.location.href =
              `Chapcytv.html?video=${encodeURIComponent(
                video.id
              )}`;
          }
        }
      );


      grid.appendChild(card);
    }
  );
}


/* =========================================================
   EMPTY TAB
   ========================================================= */

function renderEmptyTab(message) {

  const grid =
    $("userVideosGrid");

  const empty =
    $("emptyVideos");

  if (grid) {
    grid.innerHTML = "";
  }

  if (empty) {

    empty.style.display =
      "block";

    const title =
      empty.querySelector(
        "h3"
      );

    if (title) {
      title.textContent =
        message;
    }
  }
}


/* =========================================================
   CREATE VIDEO
   ========================================================= */

const createVideoBtn =
  $("createVideoBtn");

if (createVideoBtn) {

  createVideoBtn.addEventListener(
    "click",
    () => {

      window.location.href =
        "Chapcytv.html";
    }
  );
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
   AUTH STATE
   IMPORTANT:
   DO NOT REDIRECT TO register.html
   ========================================================= */

onAuthStateChanged(
  auth,
  async (user) => {

    if (user) {

      console.log(
        "CHAPCY logged in:",
        user.uid
      );

      await loadCurrentProfile(
        user
      );

    } else {

      /*
       * IMPORTANT FIX:
       * The old code redirected to register.html.
       * That caused Profile.html to disappear.
       *
       * We now keep the page open.
       */

      console.log(
        "No Firebase user currently logged in."
      );

      showToast(
        "Please login to use your profile"
      );
    }
  }
);


/* =========================================================
   PAGE VISIBILITY
   ========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      !document.hidden &&
      currentUser
    ) {

      console.log(
        "CHAPCY profile active"
      );
    }
  }
);


/* =========================================================
   GLOBAL DEBUG OBJECT
   ========================================================= */

window.CHAPCY_PROFILE = {

  getUser: () =>
    currentUser,

  getProfile: () =>
    currentProfile,

  openEditProfile,

  closeEditProfile,

  reload: async () => {

    if (currentUser) {

      await loadCurrentProfile(
        currentUser
      );
    }
  }
};


console.log(
  "CHAPCY Profile JS loaded successfully."
);/* =========================================================
   CHAPCY PROFILE JS
   Firebase Auth + Realtime Database + Storage
   ========================================================= */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getDatabase,
  ref,
  get,
  set,
  update,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";


/* =========================================================
   FIREBASE CONFIG
   ========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyDIID2LpzjLiqaLeLJKgp-Vd7tNIyN-M1k",
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
const storage = getStorage(app);


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let currentUser = null;
let currentProfile = null;
let selectedPhotoFile = null;
let profileListener = null;


/* =========================================================
   DOM HELPER
   ========================================================= */

const $ = (id) => document.getElementById(id);

function setText(id, value) {
  const element = $(id);

  if (element) {
    element.textContent = value ?? "";
  }
}

function setImage(id, url) {
  const element = $(id);

  if (element && url) {
    element.src = url;
  }
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

  const toast = $("profileToast");
  const toastMessage = $("toastMessage");

  if (!toast) {
    console.log("CHAPCY:", message);
    return;
  }

  if (toastMessage) {
    toastMessage.textContent = message;
  }

  toast.classList.add("show");

  clearTimeout(window.chapcyToastTimer);

  window.chapcyToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

window.showToast = showToast;


/* =========================================================
   GENERATE CHAPCY ID
   ========================================================= */

function generateChapcyId(uid) {

  if (!uid) {
    return "CPY-00000000";
  }

  const cleanUID = uid
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();

  return "CPY-" + cleanUID.slice(-8);
}


/* =========================================================
   DEFAULT PROFILE
   ========================================================= */

function createDefaultProfile(user) {

  return {
    uid: user.uid,

    displayName:
      user.displayName ||
      "CHAPCY User",

    username:
      user.email
        ? user.email.split("@")[0]
        : "chapcyuser",

    photoURL:
      user.photoURL ||
      "file_00000000b0d8820a998b33ad9cf233cb.png",

    bio:
      "Welcome to my CHAPCY profile.",

    chapcyId:
      generateChapcyId(user.uid),

    followersCount: 0,

    friendsCount: 0,

    chapcyPoints: 0,

    walletBalance: 0,

    online: true,

    createdAt: Date.now()
  };
}


/* =========================================================
   LOAD CURRENT PROFILE
   ========================================================= */

async function loadCurrentProfile(user) {

  currentUser = user;

  const userRef = ref(db, `users/${user.uid}`);

  try {

    const snapshot = await get(userRef);

    if (!snapshot.exists()) {

      const defaultProfile = createDefaultProfile(user);

      await set(userRef, defaultProfile);

      currentProfile = defaultProfile;

      renderProfile(defaultProfile);

    } else {

      currentProfile = snapshot.val();

      if (!currentProfile.chapcyId) {

        currentProfile.chapcyId =
          generateChapcyId(user.uid);

        await update(userRef, {
          chapcyId: currentProfile.chapcyId
        });
      }

      renderProfile(currentProfile);
    }

    listenToProfile(user.uid);

  } catch (error) {

    console.error(
      "CHAPCY profile loading error:",
      error
    );

    showToast(
      "Unable to load profile"
    );
  }
}


/* =========================================================
   REALTIME PROFILE LISTENER
   ========================================================= */

function listenToProfile(uid) {

  const userRef = ref(db, `users/${uid}`);

  if (profileListener) {
    profileListener();
    profileListener = null;
  }

  profileListener = onValue(
    userRef,
    (snapshot) => {

      if (!snapshot.exists()) {
        return;
      }

      currentProfile = snapshot.val();

      renderProfile(currentProfile);

    },
    (error) => {

      console.error(
        "Profile realtime error:",
        error
      );
    }
  );
}


/* =========================================================
   RENDER PROFILE
   ========================================================= */

function renderProfile(profile) {

  if (!profile) {
    return;
  }


  /* -----------------------------------------
     PROFILE PHOTO
     ----------------------------------------- */

  const photo =
    profile.photoURL ||
    "file_00000000b0d8820a998b33ad9cf233cb.png";

  setImage("profileImage", photo);
  setImage("editProfileImage", photo);
  setImage("headerProfileImage", photo);


  /* -----------------------------------------
     NAME
     ----------------------------------------- */

  setText(
    "profileName",
    profile.displayName || "CHAPCY User"
  );


  /* -----------------------------------------
     USERNAME
     ----------------------------------------- */

  let username =
    profile.username ||
    "chapcyuser";

  if (!username.startsWith("@")) {
    username = "@" + username;
  }

  setText(
    "profileUsername",
    username
  );


  /* -----------------------------------------
     CHAPCY ID
     ----------------------------------------- */

  setText(
    "chapcyUserId",
    profile.chapcyId ||
    generateChapcyId(profile.uid)
  );


  /* -----------------------------------------
     BIO
     ----------------------------------------- */

  setText(
    "profileBio",
    profile.bio ||
    "Welcome to my CHAPCY profile."
  );


  /* -----------------------------------------
     STATS
     ----------------------------------------- */

  setText(
    "followersCount",
    formatNumber(
      profile.followersCount || 0
    )
  );

  setText(
    "friendsCount",
    formatNumber(
      profile.friendsCount || 0
    )
  );

  setText(
    "profilePoints",
    formatNumber(
      profile.chapcyPoints || 0
    )
  );


  /* -----------------------------------------
     WALLET
     ----------------------------------------- */

  setText(
    "walletBalance",
    formatMoney(
      profile.walletBalance || 0
    )
  );


  /* -----------------------------------------
     ONLINE STATUS
     ----------------------------------------- */

  const online =
    $("profileOnline");

  if (online) {

    if (profile.online === true) {
      online.classList.add("active");
      online.style.display = "block";
    } else {
      online.classList.remove("active");
      online.style.display = "none";
    }
  }


  /* -----------------------------------------
     EDIT FORM
     ----------------------------------------- */

  setText(
    "editDisplayName",
    profile.displayName || ""
  );

  setText(
    "editUsername",
    profile.username || ""
  );

  setText(
    "editBio",
    profile.bio || ""
  );


  /* -----------------------------------------
     BIO COUNTER
     ----------------------------------------- */

  updateBioCounter(
    profile.bio || ""
  );


  /* -----------------------------------------
     VIDEOS
     ----------------------------------------- */

  renderVideos(
    profile.videos || {}
  );
}


/* =========================================================
   FORMAT NUMBER
   ========================================================= */

function formatNumber(number) {

  const value =
    Number(number) || 0;

  return value.toLocaleString();
}


/* =========================================================
   FORMAT MONEY
   ========================================================= */

function formatMoney(amount) {

  const value =
    Number(amount) || 0;

  return value.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  );
}


/* =========================================================
   COPY CHAPCY ID
   ========================================================= */

const copyChapcyId =
  $("copyChapcyId");

if (copyChapcyId) {

  copyChapcyId.addEventListener(
    "click",
    async () => {

      const id =
        $("chapcyUserId")?.textContent;

      if (!id) {
        return;
      }

      try {

        await navigator.clipboard.writeText(id);

        showToast(
          "CHAPCY ID copied"
        );

      } catch (error) {

        console.error(error);

        showToast(
          "Unable to copy CHAPCY ID"
        );
      }
    }
  );
}


/* =========================================================
   EDIT PROFILE MODAL
   ========================================================= */

function openEditProfile() {

  const modal =
    $("editProfileModal");

  if (!modal) {
    return;
  }

  if (currentProfile) {

    setInput(
      "editDisplayName",
      currentProfile.displayName || ""
    );

    setInput(
      "editUsername",
      currentProfile.username || ""
    );

    setInput(
      "editBio",
      currentProfile.bio || ""
    );

    setImage(
      "editProfileImage",
      currentProfile.photoURL ||
      "file_00000000b0d8820a998b33ad9cf233cb.png"
    );
  }

  modal.classList.add("show");

  document.body.classList.add(
    "modal-open"
  );
}

window.openEditProfile =
  openEditProfile;


/* =========================================================
   EDIT BUTTON
   ========================================================= */

const editProfileBtn =
  $("editProfileBtn");

if (editProfileBtn) {

  editProfileBtn.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      event.stopPropagation();

      openEditProfile();
    }
  );
}


/* =========================================================
   CLOSE EDIT MODAL
   ========================================================= */

function closeEditProfile() {

  const modal =
    $("editProfileModal");

  if (!modal) {
    return;
  }

  modal.classList.remove("show");

  document.body.classList.remove(
    "modal-open"
  );
}


const closeEditProfileBtn =
  $("closeEditProfile");

if (closeEditProfileBtn) {

  closeEditProfileBtn.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      closeEditProfile();
    }
  );
}


/* =========================================================
   CLOSE MODAL BY BACKDROP
   ========================================================= */

const editModal =
  $("editProfileModal");

if (editModal) {

  editModal.addEventListener(
    "click",
    (event) => {

      if (
        event.target === editModal
      ) {
        closeEditProfile();
      }
    }
  );
}


/* =========================================================
   INPUT HELPER
   ========================================================= */

function setInput(id, value) {

  const input = $(id);

  if (input) {
    input.value = value ?? "";
  }
}


/* =========================================================
   PROFILE PHOTO INPUT
   ========================================================= */

const profilePhotoInput =
  $("profilePhotoInput");

if (profilePhotoInput) {

  profilePhotoInput.addEventListener(
    "change",
    (event) => {

      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {

        showToast(
          "Please select an image"
        );

        return;
      }

      if (file.size > 5 * 1024 * 1024) {

        showToast(
          "Image must be below 5MB"
        );

        return;
      }

      selectedPhotoFile = file;

      const preview =
        URL.createObjectURL(file);

      setImage(
        "editProfileImage",
        preview
      );
    }
  );
}


/* =========================================================
   EDIT PROFILE IMAGE BUTTON
   ========================================================= */

const editPhotoBtn =
  $("editPhotoBtn");

if (editPhotoBtn) {

  editPhotoBtn.addEventListener(
    "click",
    () => {

      if (profilePhotoInput) {
        profilePhotoInput.click();
      }
    }
  );
}


/* =========================================================
   BIO COUNTER
   ========================================================= */

function updateBioCounter(value) {

  const counter =
    $("bioCounter");

  if (!counter) {
    return;
  }

  const length =
    (value || "").length;

  counter.textContent =
    `${length}/150`;
}


const editBio =
  $("editBio");

if (editBio) {

  editBio.addEventListener(
    "input",
    () => {

      updateBioCounter(
        editBio.value
      );
    }
  );
}


/* =========================================================
   SAVE PROFILE
   ========================================================= */

const editProfileForm =
  $("editProfileForm");

if (editProfileForm) {

  editProfileForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      if (!currentUser) {

        showToast(
          "Please login first"
        );

        return;
      }

      const saveButton =
        $("saveProfileBtn");

      if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent =
          "Saving...";
      }

      try {

        const displayName =
          $("editDisplayName")
            ?.value
            ?.trim() ||
          "CHAPCY User";

        let username =
          $("editUsername")
            ?.value
            ?.trim() ||
          "chapcyuser";

        username =
          username
            .replace(/^@+/, "")
            .replace(/\s+/g, "")
            .toLowerCase();

        const bio =
          $("editBio")
            ?.value
            ?.trim() ||
          "";


        /* -------------------------------------
           PHOTO UPLOAD
           ------------------------------------- */

        let photoURL =
          currentProfile?.photoURL ||
          currentUser.photoURL ||
          "file_00000000b0d8820a998b33ad9cf233cb.png";


        if (selectedPhotoFile) {

          const extension =
            getFileExtension(
              selectedPhotoFile.name
            );

          const fileRef =
            storageRef(
              storage,
              `profilePhotos/${currentUser.uid}/profile.${extension}`
            );

          await uploadBytes(
            fileRef,
            selectedPhotoFile
          );

          photoURL =
            await getDownloadURL(
              fileRef
            );
        }


        /* -------------------------------------
           UPDATE FIREBASE AUTH
           ------------------------------------- */

        await updateProfile(
          currentUser,
          {
            displayName,
            photoURL
          }
        );


        /* -------------------------------------
           UPDATE REALTIME DATABASE
           ------------------------------------- */

        const userRef =
          ref(
            db,
            `users/${currentUser.uid}`
          );

        await update(
          userRef,
          {
            displayName,
            username,
            bio,
            photoURL,
            updatedAt: Date.now()
          }
        );


        /* -------------------------------------
           LOCAL DATA
           ------------------------------------- */

        currentProfile = {
          ...currentProfile,

          displayName,
          username,
          bio,
          photoURL,
          uid: currentUser.uid
        };


        renderProfile(
          currentProfile
        );


        selectedPhotoFile = null;

        if (profilePhotoInput) {
          profilePhotoInput.value = "";
        }


        closeEditProfile();

        showToast(
          "Profile updated successfully"
        );

      } catch (error) {

        console.error(
          "Profile save error:",
          error
        );

        showToast(
          error?.message ||
          "Unable to save profile"
        );

      } finally {

        if (saveButton) {

          saveButton.disabled = false;

          saveButton.textContent =
            "Save Profile";
        }
      }
    }
  );
}


/* =========================================================
   FILE EXTENSION
   ========================================================= */

function getFileExtension(filename) {

  const parts =
    filename.split(".");

  if (parts.length < 2) {
    return "jpg";
  }

  return parts
    .pop()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") || "jpg";
}


/* =========================================================
   SHARE PROFILE
   ========================================================= */

const shareProfileBtn =
  $("shareProfileBtn");

if (shareProfileBtn) {

  shareProfileBtn.addEventListener(
    "click",
    async () => {

      if (!currentUser) {
        return;
      }

      const username =
        currentProfile?.username ||
        "chapcyuser";

      const profileURL =
        `${window.location.origin}${window.location.pathname}?user=${encodeURIComponent(
          username
        )}`;

      const shareData = {

        title:
          `${currentProfile?.displayName || "CHAPCY User"} | CHAPCY`,

        text:
          `Check out my CHAPCY profile @${username}`,

        url:
          profileURL
      };


      try {

        if (
          navigator.share
        ) {

          await navigator.share(
            shareData
          );

        } else {

          await navigator.clipboard.writeText(
            profileURL
          );

          showToast(
            "Profile link copied"
          );
        }

      } catch (error) {

        if (
          error?.name !==
          "AbortError"
        ) {

          console.error(error);

          showToast(
            "Unable to share profile"
          );
        }
      }
    }
  );
}


/* =========================================================
   WALLET — DISPLAY ONLY
   ========================================================= */

const addMoneyBtn =
  $("addMoneyBtn");

if (addMoneyBtn) {

  addMoneyBtn.addEventListener(
    "click",
    () => {

      showToast(
        "Add Money feature is ready for payment integration"
      );
    }
  );
}


const withdrawBtn =
  $("withdrawBtn");

if (withdrawBtn) {

  withdrawBtn.addEventListener(
    "click",
    () => {

      showToast(
        "Withdraw feature is ready for payment integration"
      );
    }
  );
}


/* =========================================================
   PROFILE MENU
   ========================================================= */

const profileMenuBtn =
  $("profileMenuBtn");

if (profileMenuBtn) {

  profileMenuBtn.addEventListener(
    "click",
    () => {

      showToast(
        "CHAPCY profile menu"
      );
    }
  );
}


/* =========================================================
   TABS
   ========================================================= */

const tabButtons =
  document.querySelectorAll(
    ".profile-tab"
  );

tabButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        tabButtons.forEach(
          (item) => {
            item.classList.remove(
              "active"
            );
          }
        );

        button.classList.add(
          "active"
        );

        const tab =
          button.dataset.tab;

        handleProfileTab(
          tab
        );
      }
    );
  }
);


/* =========================================================
   TAB HANDLER
   ========================================================= */

function handleProfileTab(tab) {

  if (!tab) {
    return;
  }

  if (tab === "videos") {

    if (currentProfile) {
      renderVideos(
        currentProfile.videos || {}
      );
    }

    return;
  }


  if (tab === "liked") {

    renderEmptyTab(
      "No liked videos yet"
    );

    return;
  }


  if (tab === "saved") {

    renderEmptyTab(
      "No saved videos yet"
    );

    return;
  }
}


/* =========================================================
   RENDER VIDEOS
   ========================================================= */

function renderVideos(videos) {

  const grid =
    $("userVideosGrid");

  const empty =
    $("emptyVideos");

  if (!grid) {
    return;
  }

  grid.innerHTML = "";


  let videoList = [];


  if (
    Array.isArray(videos)
  ) {

    videoList =
      videos.map(
        (video, index) => ({
          ...video,
          id: video?.id || index
        })
      );

  } else if (
    videos &&
    typeof videos === "object"
  ) {

    videoList =
      Object.entries(videos)
        .map(
          ([id, video]) => ({
            ...(video || {}),
            id
          })
        );
  }


  if (!videoList.length) {

    if (empty) {
      empty.style.display = "block";
    }

    return;
  }


  if (empty) {
    empty.style.display = "none";
  }


  videoList.forEach(
    (video) => {

      const card =
        document.createElement("article");

      card.className =
        "profile-video-card";


      const image =
        video.thumbnail ||
        video.cover ||
        video.image ||
        "file_00000000b3448243aebfedfba8912525.png";


      card.innerHTML = `
        <img
          src="${escapeHTML(image)}"
          alt="CHAPCY Video"
          loading="lazy"
        >

        <div class="profile-video-overlay">
          <span>
            <i class="fa-solid fa-play"></i>
            ${formatNumber(video.views || 0)}
          </span>
        </div>
      `;


      card.addEventListener(
        "click",
        () => {

          if (video.url) {

            window.location.href =
              video.url;

            return;
          }

          if (video.id) {

            window.location.href =
              `Chapcytv.html?video=${encodeURIComponent(
                video.id
              )}`;
          }
        }
      );


      grid.appendChild(card);
    }
  );
}


/* =========================================================
   EMPTY TAB
   ========================================================= */

function renderEmptyTab(message) {

  const grid =
    $("userVideosGrid");

  const empty =
    $("emptyVideos");

  if (grid) {
    grid.innerHTML = "";
  }

  if (empty) {

    empty.style.display =
      "block";

    const title =
      empty.querySelector(
        "h3"
      );

    if (title) {
      title.textContent =
        message;
    }
  }
}


/* =========================================================
   CREATE VIDEO
   ========================================================= */

const createVideoBtn =
  $("createVideoBtn");

if (createVideoBtn) {

  createVideoBtn.addEventListener(
    "click",
    () => {

      window.location.href =
        "Chapcytv.html";
    }
  );
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
   AUTH STATE
   IMPORTANT:
   DO NOT REDIRECT TO register.html
   ========================================================= */

onAuthStateChanged(
  auth,
  async (user) => {

    if (user) {

      console.log(
        "CHAPCY logged in:",
        user.uid
      );

      await loadCurrentProfile(
        user
      );

    } else {

      /*
       * IMPORTANT FIX:
       * The old code redirected to register.html.
       * That caused Profile.html to disappear.
       *
       * We now keep the page open.
       */

      console.log(
        "No Firebase user currently logged in."
      );

      showToast(
        "Please login to use your profile"
      );
    }
  }
);


/* =========================================================
   PAGE VISIBILITY
   ========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      !document.hidden &&
      currentUser
    ) {

      console.log(
        "CHAPCY profile active"
      );
    }
  }
);


/* =========================================================
   GLOBAL DEBUG OBJECT
   ========================================================= */

window.CHAPCY_PROFILE = {

  getUser: () =>
    currentUser,

  getProfile: () =>
    currentProfile,

  openEditProfile,

  closeEditProfile,

  reload: async () => {

    if (currentUser) {

      await loadCurrentProfile(
        currentUser
      );
    }
  }
};


console.log(
  "CHAPCY Profile JS loaded successfully."
);
