/* =========================================================
   CHAPCY — ACC PROFILE JS
   Firebase + Profile + Edit + Wallet + Tabs
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
   FIREBASE START
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


/* =========================================================
   DEFAULT PROFILE IMAGE
   ========================================================= */

const DEFAULT_PROFILE_IMAGE =
  "file_00000000b0d8820a998b33ad9cf233cb.png";


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function $(id) {
  return document.getElementById(id);
}


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


function setInput(id, value) {

  const element = $(id);

  if (element) {
    element.value = value ?? "";
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
   FORMAT NUMBER
   ========================================================= */

function formatNumber(value) {

  return Number(value || 0).toLocaleString();
}


/* =========================================================
   FORMAT MONEY
   ========================================================= */

function formatMoney(value) {

  return Number(value || 0).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }
  );
}


/* =========================================================
   CHAPCY ID
   ========================================================= */

function generateChapcyId(uid) {

  if (!uid) {
    return "CPY-00000000";
  }

  const clean = String(uid)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();

  return "CPY-" + clean.slice(-8);
}


/* =========================================================
   CREATE DEFAULT PROFILE
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
      DEFAULT_PROFILE_IMAGE,

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
   LOAD PROFILE
   ========================================================= */

async function loadProfile(user) {

  currentUser = user;

  const userRef =
    ref(db, `users/${user.uid}`);

  try {

    const snapshot =
      await get(userRef);


    if (!snapshot.exists()) {

      const profile =
        createDefaultProfile(user);

      await set(
        userRef,
        profile
      );

      currentProfile =
        profile;

    } else {

      currentProfile =
        snapshot.val();

      if (!currentProfile.chapcyId) {

        currentProfile.chapcyId =
          generateChapcyId(user.uid);

        await update(
          userRef,
          {
            chapcyId:
              currentProfile.chapcyId
          }
        );
      }
    }


    renderProfile(
      currentProfile
    );


    /* REALTIME LISTENER */

    onValue(
      userRef,
      (snapshot) => {

        if (!snapshot.exists()) {
          return;
        }

        currentProfile =
          snapshot.val();

        renderProfile(
          currentProfile
        );

      }
    );


  } catch (error) {

    console.error(
      "CHAPCY profile error:",
      error
    );

    showToast(
      "Unable to load profile"
    );
  }
}


/* =========================================================
   RENDER PROFILE
   ========================================================= */

function renderProfile(profile) {

  if (!profile) {
    return;
  }


  /* PHOTO */

  const photo =
    profile.photoURL ||
    DEFAULT_PROFILE_IMAGE;

  setImage(
    "profileImage",
    photo
  );

  setImage(
    "editProfileImage",
    photo
  );


  /* NAME */

  setText(
    "profileName",
    profile.displayName ||
    "CHAPCY User"
  );


  /* USERNAME */

  let username =
    profile.username ||
    "chapcyuser";

  username =
    username.replace(/^@/, "");

  setText(
    "profileUsername",
    "@" + username
  );


  /* CHAPCY ID */

  setText(
    "chapcyUserId",
    profile.chapcyId ||
    generateChapcyId(profile.uid)
  );


  /* BIO */

  setText(
    "profileBio",
    profile.bio ||
    "Welcome to my CHAPCY profile."
  );


  /* STATS */

  setText(
    "followersCount",
    formatNumber(
      profile.followersCount
    )
  );

  setText(
    "friendsCount",
    formatNumber(
      profile.friendsCount
    )
  );

  setText(
    "profilePoints",
    formatNumber(
      profile.chapcyPoints
    )
  );


  /* WALLET */

  setText(
    "walletBalance",
    formatMoney(
      profile.walletBalance
    )
  );


  /* ONLINE */

  const online =
    $("profileOnline");

  if (online) {

    if (profile.online === true) {

      online.classList.add(
        "active"
      );

      online.setAttribute(
        "aria-label",
        "Online"
      );

    } else {

      online.classList.remove(
        "active"
      );

      online.setAttribute(
        "aria-label",
        "Offline"
      );
    }
  }


  /* EDIT FORM */

  setInput(
    "editDisplayName",
    profile.displayName || ""
  );

  setInput(
    "editUsername",
    profile.username || ""
  );

  setInput(
    "editBio",
    profile.bio || ""
  );


  updateBioCounter(
    profile.bio || ""
  );


  /* VIDEOS */

  renderVideos(
    profile.videos || {}
  );
}


/* =========================================================
   BACK BUTTON
   ========================================================= */

const backBtn =
  $("backBtn");

if (backBtn) {

  backBtn.addEventListener(
    "click",
    () => {

      if (
        window.history.length > 1
      ) {

        window.history.back();

      } else {

        window.location.href =
          "CHAPCY.html";
      }

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
    (event) => {

      event.preventDefault();

      showToast(
        "CHAPCY Profile Menu"
      );

    }
  );
}


/* =========================================================
   COVER CAMERA
   ========================================================= */

const editCoverBtn =
  $("editCoverBtn");

if (editCoverBtn) {

  editCoverBtn.addEventListener(
    "click",
    () => {

      showToast(
        "Cover photo will be available soon"
      );

    }
  );
}


/* =========================================================
   EDIT PROFILE
   ========================================================= */

function openEditProfile() {

  const modal =
    $("editProfileModal");

  if (!modal) {

    console.error(
      "editProfileModal not found"
    );

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
      DEFAULT_PROFILE_IMAGE
    );
  }


  modal.classList.add(
    "show"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

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
   CLOSE EDIT PROFILE
   ========================================================= */

function closeEditProfile() {

  const modal =
    $("editProfileModal");

  if (!modal) {
    return;
  }

  modal.classList.remove(
    "show"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

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
   MODAL BACKDROP
   ========================================================= */

const modal =
  $("editProfileModal");

if (modal) {

  modal.addEventListener(
    "click",
    (event) => {

      if (
        event.target === modal ||
        event.target.classList.contains(
          "modal-backdrop"
        )
      ) {

        closeEditProfile();

      }

    }
  );
}


/* =========================================================
   PROFILE PHOTO BUTTON
   ========================================================= */

const editPhotoBtn =
  $("editPhotoBtn");

const profilePhotoInput =
  $("profilePhotoInput");


if (editPhotoBtn) {

  editPhotoBtn.addEventListener(
    "click",
    () => {

      openEditProfile();

      setTimeout(() => {

        if (profilePhotoInput) {
          profilePhotoInput.click();
        }

      }, 200);

    }
  );
}


/* =========================================================
   PHOTO INPUT
   ========================================================= */

if (profilePhotoInput) {

  profilePhotoInput.addEventListener(
    "change",
    (event) => {

      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }


      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        showToast(
          "Please select an image"
        );

        return;
      }


      if (
        file.size >
        5 * 1024 * 1024
      ) {

        showToast(
          "Image must be below 5MB"
        );

        return;
      }


      selectedPhotoFile =
        file;


      const preview =
        URL.createObjectURL(
          file
        );


      setImage(
        "editProfileImage",
        preview
      );

    }
  );
}


/* =========================================================
   BIO COUNTER
   ========================================================= */

const editBio =
  $("editBio");

function updateBioCounter(value) {

  const counter =
    $("bioCounter");

  if (!counter) {
    return;
  }

  counter.textContent =
    `${String(value || "").length} / 160`;
}


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


      const saveBtn =
        $("saveProfileBtn");


      if (saveBtn) {

        saveBtn.disabled =
          true;

        saveBtn.innerHTML =
          `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

      }


      try {

        /* NAME */

        const displayName =
          $("editDisplayName")
            ?.value
            ?.trim() ||
          "CHAPCY User";


        /* USERNAME */

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


        /* BIO */

        const bio =
          $("editBio")
            ?.value
            ?.trim() ||
          "";


        /* PHOTO */

        let photoURL =
          currentProfile?.photoURL ||
          currentUser.photoURL ||
          DEFAULT_PROFILE_IMAGE;


        if (selectedPhotoFile) {

          const extension =
            selectedPhotoFile.name
              .split(".")
              .pop()
              .toLowerCase();


          const photoRef =
            storageRef(
              storage,
              `profilePhotos/${currentUser.uid}/profile.${extension}`
            );


          await uploadBytes(
            photoRef,
            selectedPhotoFile
          );


          photoURL =
            await getDownloadURL(
              photoRef
            );
        }


        /* UPDATE FIREBASE AUTH */

        await updateProfile(
          currentUser,
          {
            displayName,
            photoURL
          }
        );


        /* UPDATE DATABASE */

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

            updatedAt:
              Date.now()

          }
        );


        /* LOCAL */

        currentProfile = {

          ...currentProfile,

          displayName,

          username,

          bio,

          photoURL,

          uid:
            currentUser.uid

        };


        renderProfile(
          currentProfile
        );


        selectedPhotoFile =
          null;


        if (profilePhotoInput) {
          profilePhotoInput.value =
            "";
        }


        closeEditProfile();


        showToast(
          "Profile updated successfully"
        );


      } catch (error) {

        console.error(
          "SAVE PROFILE ERROR:",
          error
        );

        showToast(
          error?.message ||
          "Unable to save profile"
        );


      } finally {

        if (saveBtn) {

          saveBtn.disabled =
            false;

          saveBtn.innerHTML =
            `<i class="fa-solid fa-check"></i> Save Changes`;

        }

      }

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
        $("chapcyUserId")
          ?.textContent
          ?.trim();


      if (!id) {
        return;
      }


      try {

        await navigator.clipboard.writeText(
          id
        );

        showToast(
          "CHAPCY ID copied"
        );


      } catch (error) {

        console.error(error);

        showToast(
          "Unable to copy ID"
        );

      }

    }
  );
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

      const username =
        currentProfile?.username ||
        "chapcyuser";


      const profileURL =
        `${window.location.origin}${window.location.pathname}?user=${encodeURIComponent(username)}`;


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

          showToast(
            "Unable to share profile"
          );

        }

      }

    }
  );
}


/* =========================================================
   WALLET MORE
   ========================================================= */

const walletMoreBtn =
  $("walletMoreBtn");


if (walletMoreBtn) {

  walletMoreBtn.addEventListener(
    "click",
    () => {

      showToast(
        "Wallet options"
      );

    }
  );
}


/* =========================================================
   ADD MONEY
   ========================================================= */

const addMoneyBtn =
  $("addMoneyBtn");


if (addMoneyBtn) {

  addMoneyBtn.addEventListener(
    "click",
    () => {

      showToast(
        "Add Money is ready for payment integration"
      );

    }
  );
}


/* =========================================================
   WITHDRAW
   ========================================================= */

const withdrawBtn =
  $("withdrawBtn");


if (withdrawBtn) {

  withdrawBtn.addEventListener(
    "click",
    () => {

      showToast(
        "Withdraw is ready for payment integration"
      );

    }
  );
}


/* =========================================================
   PROFILE TABS
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

        const tab =
          button.dataset.tab;


        /* ACTIVE BUTTON */

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


        /* CONTENT */

        document
          .querySelectorAll(
            ".profile-tab-content"
          )
          .forEach(
            (content) => {

              content.classList.remove(
                "active"
              );

            }
          );


        const selectedTab =
          $(`${tab}Tab`);


        if (selectedTab) {

          selectedTab.classList.add(
            "active"
          );

        }


        /* VIDEOS */

        if (tab === "videos") {

          renderVideos(
            currentProfile?.videos ||
            {}
          );

        }

      }
    );

  }
);


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


  grid.innerHTML =
    "";


  let list = [];


  if (Array.isArray(videos)) {

    list = videos;

  } else if (
    videos &&
    typeof videos === "object"
  ) {

    list =
      Object.entries(videos)
        .map(
          ([id, video]) => ({
            ...(video || {}),
            id
          })
        );

  }


  if (!list.length) {

    if (empty) {

      empty.style.display =
        "block";

    }

    return;
  }


  if (empty) {

    empty.style.display =
      "none";

  }


  list.forEach(
    (video) => {

      const card =
        document.createElement(
          "article"
        );


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

            ${formatNumber(
              video.views
            )}

          </span>

        </div>

      `;


      card.addEventListener(
        "click",
        () => {

          if (video.url) {

            window.location.href =
              video.url;

          } else {

            window.location.href =
              `Chapcytv.html?video=${encodeURIComponent(video.id || "")}`;

          }

        }
      );


      grid.appendChild(
        card
      );

    }
  );
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
   FIREBASE AUTH
   ========================================================= */

onAuthStateChanged(
  auth,
  async (user) => {

    if (user) {

      console.log(
        "CHAPCY USER:",
        user.uid
      );

      await loadProfile(
        user
      );

    } else {

      /*
       * MUHIMU:
       * USIMPELEKE USER REGISTER.HTML
       * HII NDIYO ILIKUWA INAFANYA PAGE IPOTEE.
       */

      console.log(
        "No Firebase user logged in"
      );

      showToast(
        "Please login to use your CHAPCY profile"
      );

    }

  }
);


/* =========================================================
   GLOBAL DEBUG
   ========================================================= */

window.CHAPCY_PROFILE = {

  getUser() {
    return currentUser;
  },

  getProfile() {
    return currentProfile;
  },

  openEditProfile,

  closeEditProfile,

  reloadProfile() {

    if (currentUser) {

      return loadProfile(
        currentUser
      );

    }

  }

};


console.log(
  "🔥 CHAPCY Accprofile.js loaded successfully"
);
