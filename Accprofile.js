/* =========================================================
   CHAPCY PROFILE
   FIREBASE READY
   Authentication + Realtime Database + Storage

   Compatible with:
   Profile.html
   profile.css
========================================================= */


/* =========================================================
   FIREBASE IMPORTS
========================================================= */

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    updateProfile
} from
    "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    getDatabase,
    ref,
    get,
    set,
    update,
    onValue
} from
    "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from
    "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";


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
   GLOBAL STATE
========================================================= */

let currentUser = null;
let currentProfile = null;
let selectedPhotoFile = null;


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

const profileHero = $("profileHero");

const profileImage = $("profileImage");
const profileOnline = $("profileOnline");

const profileName = $("profileName");
const profileUsername = $("profileUsername");
const chapcyUserId = $("chapcyUserId");

const profileBio = $("profileBio");

const followersCount = $("followersCount");
const friendsCount = $("friendsCount");
const profilePoints = $("profilePoints");

const walletBalance = $("walletBalance");

const editProfileModal = $("editProfileModal");

const editProfileForm = $("editProfileForm");

const editProfileImage = $("editProfileImage");
const profilePhotoInput = $("profilePhotoInput");

const editDisplayName = $("editDisplayName");
const editUsername = $("editUsername");
const editBio = $("editBio");

const bioCounter = $("bioCounter");

const userVideosGrid = $("userVideosGrid");
const emptyVideos = $("emptyVideos");

const toast = $("profileToast");
const toastMessage = $("toastMessage");


/* =========================================================
   DEFAULT PROFILE IMAGE
========================================================= */

const DEFAULT_PROFILE_IMAGE =
    "file_00000000b0d8820a998b33ad9cf233cb.png";


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.chapcyToastTimer);

    window.chapcyToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(value) {

    const number = Number(value || 0);

    return number.toLocaleString("en-US");
}


/* =========================================================
   CREATE CHAPCY ID
========================================================= */

function createChapcyId(uid) {

    if (!uid) return "CPY-000000";

    const clean = uid
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase();

    return "CPY-" + clean.slice(-8);
}


/* =========================================================
   GET CURRENT USER PROFILE
========================================================= */

async function loadCurrentProfile(user) {

    if (!user) return;

    currentUser = user;

    const userRef = ref(db, `users/${user.uid}`);

    try {

        const snapshot = await get(userRef);

        let data = {};

        if (snapshot.exists()) {
            data = snapshot.val() || {};
        }

        currentProfile = {
            ...data
        };

        /*
          If user doesn't exist in RTDB yet,
          create a safe basic profile.
        */

        if (!snapshot.exists()) {

            const newProfile = {

                uid: user.uid,

                displayName:
                    user.displayName ||
                    "CHAPCY User",

                username:
                    data.username ||
                    "chapcyuser",

                photoURL:
                    user.photoURL ||
                    DEFAULT_PROFILE_IMAGE,

                bio:
                    "Welcome to my CHAPCY profile.",

                chapcyId:
                    createChapcyId(user.uid),

                followersCount: 0,

                friendsCount: 0,

                /*
                  These values are created as
                  initial placeholders only.
                  Money/points should later be
                  controlled by trusted backend logic.
                */

                chapcyPoints: 0,

                walletBalance: 0,

                online: true,

                createdAt: Date.now()
            };

            await set(userRef, newProfile);

            currentProfile = newProfile;
        }

        renderProfile(currentProfile);

        listenToProfile(user.uid);

    } catch (error) {

        console.error(
            "CHAPCY profile loading error:",
            error
        );

        showToast("Unable to load profile");
    }
}


/* =========================================================
   LISTEN TO REALTIME PROFILE
========================================================= */

function listenToProfile(uid) {

    const userRef = ref(db, `users/${uid}`);

    onValue(userRef, (snapshot) => {

        if (!snapshot.exists()) return;

        currentProfile = snapshot.val() || {};

        renderProfile(currentProfile);

    }, (error) => {

        console.error(
            "Profile realtime listener:",
            error
        );

    });
}


/* =========================================================
   RENDER PROFILE
========================================================= */

function renderProfile(data) {

    if (!data) return;


    /* -----------------------------------------
       USER ID
    ----------------------------------------- */

    if (profileHero) {

        profileHero.dataset.userId =
            data.uid ||
            currentUser?.uid ||
            "";
    }


    /* -----------------------------------------
       NAME
    ----------------------------------------- */

    const name =
        data.displayName ||
        data.name ||
        currentUser?.displayName ||
        "CHAPCY User";

    if (profileName) {
        profileName.textContent = name;
    }


    /* -----------------------------------------
       USERNAME
    ----------------------------------------- */

    let username =
        data.username ||
        "chapcyuser";

    username = username
        .replace(/^@/, "");

    if (profileUsername) {

        profileUsername.textContent =
            "@" + username;
    }


    /* -----------------------------------------
       PROFILE PHOTO
    ----------------------------------------- */

    const photo =
        data.photoURL ||
        currentUser?.photoURL ||
        DEFAULT_PROFILE_IMAGE;

    if (profileImage) {
        profileImage.src = photo;
    }

    if (editProfileImage) {
        editProfileImage.src = photo;
    }


    /* -----------------------------------------
       BIO
    ----------------------------------------- */

    if (profileBio) {

        profileBio.textContent =
            data.bio ||
            "Welcome to my CHAPCY profile.";
    }


    /* -----------------------------------------
       CHAPCY ID
    ----------------------------------------- */

    const id =
        data.chapcyId ||
        createChapcyId(
            data.uid ||
            currentUser?.uid
        );

    if (chapcyUserId) {
        chapcyUserId.textContent = id;
    }


    /* -----------------------------------------
       FOLLOWERS
    ----------------------------------------- */

    if (followersCount) {

        followersCount.textContent =
            formatNumber(
                data.followersCount || 0
            );
    }


    /* -----------------------------------------
       FRIENDS
    ----------------------------------------- */

    if (friendsCount) {

        friendsCount.textContent =
            formatNumber(
                data.friendsCount || 0
            );
    }


    /* -----------------------------------------
       CHAPCY POINTS
    ----------------------------------------- */

    if (profilePoints) {

        profilePoints.textContent =
            formatNumber(
                data.chapcyPoints || 0
            );
    }


    /* -----------------------------------------
       WALLET
    ----------------------------------------- */

    if (walletBalance) {

        walletBalance.textContent =
            formatNumber(
                data.walletBalance || 0
            );
    }


    /* -----------------------------------------
       ONLINE
    ----------------------------------------- */

    updateOnlineStatus(
        data.online === true
    );


    /* -----------------------------------------
       EDIT FORM
    ----------------------------------------- */

    if (editDisplayName) {

        editDisplayName.value =
            name;
    }

    if (editUsername) {

        editUsername.value =
            username;
    }

    if (editBio) {

        editBio.value =
            data.bio || "";

        updateBioCounter();
    }


    /* -----------------------------------------
       VIDEOS
    ----------------------------------------- */

    renderVideos(
        data.videos || {}
    );
}


/* =========================================================
   ONLINE STATUS
========================================================= */

function updateOnlineStatus(isOnline) {

    if (!profileOnline) return;

    if (isOnline) {

        profileOnline.classList.add("online");

        profileOnline.setAttribute(
            "aria-label",
            "Online"
        );

    } else {

        profileOnline.classList.remove("online");

        profileOnline.setAttribute(
            "aria-label",
            "Offline"
        );
    }
}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(auth, async (user) => {

    if (user) {

        console.log(
            "CHAPCY logged in:",
            user.uid
        );

        await loadCurrentProfile(user);

    } else {

        console.log(
            "No CHAPCY user logged in"
        );

        /*
          Redirect to your existing login/register page.
          Change this filename if your actual login page
          has a different name.
        */

        window.location.href =
            "register.html";
    }
});


/* =========================================================
   BACK BUTTON
========================================================= */

const backBtn = $("backBtn");

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            if (window.history.length > 1) {

                window.history.back();

            } else {

                window.location.href =
                    "CHAPCY.html";
            }
        }
    );
}


/* =========================================================
   COPY CHAPCY ID
========================================================= */

const copyChapcyId = $("copyChapcyId");

if (copyChapcyId) {

    copyChapcyId.addEventListener(
        "click",
        async () => {

            const id =
                chapcyUserId?.textContent?.trim();

            if (!id) return;

            try {

                await navigator.clipboard.writeText(id);

                showToast(
                    "CHAPCY ID copied"
                );

            } catch (error) {

                console.error(error);

                showToast(
                    "Copy failed"
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

            if (!currentUser) return;

            const username =
                currentProfile?.username ||
                currentUser.uid;

            const profileURL =
                `${window.location.origin}${window.location.pathname}?user=${encodeURIComponent(username)}`;

            const shareData = {

                title:
                    `${currentProfile?.displayName || "CHAPCY User"} — CHAPCY`,

                text:
                    `Check out this profile on CHAPCY.`,

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

                /*
                  User cancelled native share.
                  No error toast needed.
                */

                console.log(
                    "Share cancelled"
                );
            }
        }
    );
}


/* =========================================================
   EDIT PROFILE MODAL
========================================================= */

const editProfileBtn =
    $("editProfileBtn");

const closeEditProfile =
    $("closeEditProfile");

function openEditProfile() {

    if (!editProfileModal) return;

    editProfileModal.classList.add("show");

    editProfileModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}

function closeEditProfileModal() {

    if (!editProfileModal) return;

    editProfileModal.classList.remove(
        "show"
    );

    editProfileModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";
}

if (editProfileBtn) {

    editProfileBtn.addEventListener(
        "click",
        openEditProfile
    );
}

if (closeEditProfile) {

    closeEditProfile.addEventListener(
        "click",
        closeEditProfileModal
    );
}


/* =========================================================
   MODAL BACKDROP CLOSE
========================================================= */

const modalBackdrop =
    document.querySelector(
        ".modal-backdrop"
    );

if (modalBackdrop) {

    modalBackdrop.addEventListener(
        "click",
        closeEditProfileModal
    );
}


/* =========================================================
   PROFILE PHOTO SELECT
========================================================= */

if (profilePhotoInput) {

    profilePhotoInput.addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files?.[0];

            if (!file) return;


            /* Check image */

            if (!file.type.startsWith("image/")) {

                showToast(
                    "Please select an image"
                );

                return;
            }


            /* Maximum 5MB */

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


            /* Preview */

            const previewURL =
                URL.createObjectURL(file);

            if (editProfileImage) {

                editProfileImage.src =
                    previewURL;
            }
        }
    );
}


/* =========================================================
   UPLOAD PROFILE PHOTO
========================================================= */

async function uploadProfilePhoto(
    file,
    uid
) {

    if (!file || !uid) {
        return null;
    }

    const fileExtension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();

    const filePath =
        `profilePhotos/${uid}/profile.${fileExtension}`;

    const imageRef =
        storageRef(
            storage,
            filePath
        );

    await uploadBytes(
        imageRef,
        file,
        {
            contentType: file.type
        }
    );

    const downloadURL =
        await getDownloadURL(
            imageRef
        );

    return downloadURL;
}


/* =========================================================
   EDIT PROFILE FORM
========================================================= */

if (editProfileForm) {

    editProfileForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (!currentUser) {

                showToast(
                    "You are not logged in"
                );

                return;
            }


            const displayName =
                editDisplayName
                    ?.value
                    .trim() ||
                "CHAPCY User";


            const username =
                editUsername
                    ?.value
                    .trim()
                    .replace(/^@/, "")
                    .toLowerCase();


            const bio =
                editBio
                    ?.value
                    .trim() ||
                "";


            if (!username) {

                showToast(
                    "Username is required"
                );

                return;
            }


            if (
                !/^[a-z0-9._]+$/.test(
                    username
                )
            ) {

                showToast(
                    "Username can use letters, numbers, . and _"
                );

                return;
            }


            if (bio.length > 160) {

                showToast(
                    "Bio is too long"
                );

                return;
            }


            const saveButton =
                $("saveProfileBtn");

            const originalButtonHTML =
                saveButton?.innerHTML;


            try {

                if (saveButton) {

                    saveButton.disabled =
                        true;

                    saveButton.innerHTML =
                        `<i class="fa-solid fa-spinner fa-spin"></i>
                         Saving...`;
                }


                /* -----------------------------------------
                   PHOTO
                ----------------------------------------- */

                let photoURL =
                    currentProfile?.photoURL ||
                    currentUser.photoURL ||
                    DEFAULT_PROFILE_IMAGE;


                if (selectedPhotoFile) {

                    showToast(
                        "Uploading photo..."
                    );

                    const uploadedURL =
                        await uploadProfilePhoto(
                            selectedPhotoFile,
                            currentUser.uid
                        );

                    if (uploadedURL) {

                        photoURL =
                            uploadedURL;
                    }
                }


                /* -----------------------------------------
                   UPDATE AUTH PROFILE
                ----------------------------------------- */

                await updateProfile(
                    currentUser,
                    {
                        displayName,
                        photoURL
                    }
                );


                /* -----------------------------------------
                   UPDATE REALTIME DATABASE
                ----------------------------------------- */

                const userRef =
                    ref(
                        db,
                        `users/${currentUser.uid}`
                    );


                await update(
                    userRef,
                    {
                        uid:
                            currentUser.uid,

                        displayName,

                        username,

                        photoURL,

                        bio,

                        chapcyId:
                            currentProfile?.chapcyId ||
                            createChapcyId(
                                currentUser.uid
                            )
                    }
                );


                selectedPhotoFile =
                    null;


                showToast(
                    "Profile updated successfully"
                );


                closeEditProfileModal();


            } catch (error) {

                console.error(
                    "Profile save error:",
                    error
                );

                showToast(
                    firebaseErrorMessage(
                        error
                    )
                );


            } finally {

                if (saveButton) {

                    saveButton.disabled =
                        false;

                    saveButton.innerHTML =
                        originalButtonHTML ||
                        `<i class="fa-solid fa-check"></i>
                         Save Changes`;
                }
            }
        }
    );
}


/* =========================================================
   BIO COUNTER
========================================================= */

function updateBioCounter() {

    if (!editBio || !bioCounter) return;

    const length =
        editBio.value.length;

    bioCounter.textContent =
        `${length} / 160`;
}

if (editBio) {

    editBio.addEventListener(
        "input",
        updateBioCounter
    );
}


/* =========================================================
   EDIT COVER
========================================================= */

const editCoverBtn =
    $("editCoverBtn");

if (editCoverBtn) {

    editCoverBtn.addEventListener(
        "click",
        () => {

            showToast(
                "Cover photo coming soon"
            );
        }
    );
}


/* =========================================================
   PROFILE PHOTO QUICK EDIT
========================================================= */

const editPhotoBtn =
    $("editPhotoBtn");

if (editPhotoBtn) {

    editPhotoBtn.addEventListener(
        "click",
        () => {

            openEditProfile();

            setTimeout(() => {

                profilePhotoInput?.click();

            }, 200);
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
                "Profile options coming soon"
            );
        }
    );
}


/* =========================================================
   WALLET
========================================================= */

const addMoneyBtn =
    $("addMoneyBtn");

const withdrawBtn =
    $("withdrawBtn");


if (addMoneyBtn) {

    addMoneyBtn.addEventListener(
        "click",
        () => {

            showToast(
                "Add Money will connect to CHAPCY Wallet"
            );
        }
    );
}


if (withdrawBtn) {

    withdrawBtn.addEventListener(
        "click",
        () => {

            showToast(
                "Withdraw will connect to CHAPCY Wallet"
            );
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
                "Wallet options coming soon"
            );
        }
    );
}


/* =========================================================
   PROFILE TABS
========================================================= */

const profileTabs =
    document.querySelectorAll(
        ".profile-tab"
    );

const profileTabContents =
    document.querySelectorAll(
        ".profile-tab-content"
    );


profileTabs.forEach((tab) => {

    tab.addEventListener(
        "click",
        () => {

            const selectedTab =
                tab.dataset.tab;


            profileTabs.forEach(
                (item) => {

                    item.classList.remove(
                        "active"
                    );
                }
            );


            profileTabContents.forEach(
                (content) => {

                    content.classList.remove(
                        "active"
                    );
                }
            );


            tab.classList.add(
                "active"
            );


            const content =
                document.getElementById(
                    `${selectedTab}Tab`
                );


            if (content) {

                content.classList.add(
                    "active"
                );
            }
        }
    );

});


/* =========================================================
   RENDER VIDEOS
========================================================= */

function renderVideos(videos) {

    if (!userVideosGrid) return;


    userVideosGrid.innerHTML = "";


    let videoList = [];


    if (
        Array.isArray(videos)
    ) {

        videoList =
            videos.map(
                (video, index) => ({
                    id: index,
                    ...video
                })
            );

    } else {

        videoList =
            Object.entries(videos)
                .map(
                    ([id, video]) => ({
                        id,
                        ...(video || {})
                    })
                );
    }


    if (!videoList.length) {

        if (emptyVideos) {

            emptyVideos.style.display =
                "flex";
        }

        return;
    }


    if (emptyVideos) {

        emptyVideos.style.display =
            "none";
    }


    videoList.forEach(
        (video) => {

            const card =
                createVideoCard(
                    video
                );

            userVideosGrid.appendChild(
                card
            );
        }
    );
}


/* =========================================================
   CREATE VIDEO CARD
========================================================= */

function createVideoCard(video) {

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "video-card";


    const thumbnail =
        video.thumbnail ||
        video.cover ||
        video.thumbnailURL;


    if (thumbnail) {

        const img =
            document.createElement(
                "img"
            );

        img.src =
            thumbnail;

        img.alt =
            video.title ||
            "CHAPCY Video";

        img.loading =
            "lazy";

        card.appendChild(
            img
        );

    } else if (video.videoURL) {

        const videoElement =
            document.createElement(
                "video"
            );

        videoElement.src =
            video.videoURL;

        videoElement.muted =
            true;

        videoElement.preload =
            "metadata";

        videoElement.playsInline =
            true;

        card.appendChild(
            videoElement
        );

    } else {

        const placeholder =
            document.createElement(
                "div"
            );

        placeholder.style.cssText =
            `
            width:100%;
            height:100%;
            display:grid;
            place-items:center;
            background:
            linear-gradient(
                145deg,
                #081329,
                #18082a
            );
            color:#00eaff;
            font-size:24px;
            `;

        placeholder.innerHTML =
            `<i class="fa-solid fa-video"></i>`;

        card.appendChild(
            placeholder
        );
    }


    const info =
        document.createElement(
            "div"
        );

    info.className =
        "video-info";


    const title =
        document.createElement(
            "span"
        );

    title.textContent =
        video.title ||
        "";


    const views =
        document.createElement(
            "span"
        );

    views.innerHTML =
        `<i class="fa-solid fa-eye"></i>
         ${formatNumber(video.views || 0)}`;


    info.appendChild(
        title
    );

    info.appendChild(
        views
    );


    card.appendChild(
        info
    );


    if (video.videoURL) {

        card.addEventListener(
            "click",
            () => {

                window.location.href =
                    video.videoURL;
            }
        );
    }


    return card;
}


/* =========================================================
   CREATE VIDEO BUTTON
========================================================= */

const createVideoBtn =
    $("createVideoBtn");

if (createVideoBtn) {

    createVideoBtn.addEventListener(
        "click",
        () => {

            /*
              Change this to your actual
              CHAPCY video creation page.
            */

            window.location.href =
                "Chapcytv.html";
        }
    );
}


/* =========================================================
   FIREBASE ERROR MESSAGES
========================================================= */

function firebaseErrorMessage(
    error
) {

    const code =
        error?.code || "";


    switch (code) {

        case "storage/unauthorized":
            return "You don't have permission to upload this photo.";

        case "storage/canceled":
            return "Photo upload cancelled.";

        case "storage/quota-exceeded":
            return "Storage limit reached.";

        case "auth/requires-recent-login":
            return "Please login again before changing your profile.";

        case "database/permission-denied":
            return "Firebase permission denied.";

        default:
            return "Something went wrong. Please try again.";
    }
}


/* =========================================================
   DEBUG
========================================================= */

console.log(
    "%cCHAPCY PROFILE READY",
    `
    color:#00eaff;
    font-size:18px;
    font-weight:bold;
    `
);pppp
