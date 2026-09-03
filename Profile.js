/* =====================================================
   CHAPCY PROFILE
   REAL FIREBASE PROFILE SYSTEM
===================================================== */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";


import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


import {
    getDatabase,
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-storage.js";


/* =====================================================
   FIREBASE CONFIG
===================================================== */

const firebaseConfig = {

    apiKey:
        "AIzaSyDIID2LpzjLiqaLeLJKgp-Vd7tNIyN-M1k",

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


/* =====================================================
   INITIALIZE FIREBASE
===================================================== */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app);

const storage = getStorage(app);


/* =====================================================
   ELEMENTS
===================================================== */

const profileForm =
    document.getElementById("profileForm");

const fullNameInput =
    document.getElementById("fullName");

const usernameInput =
    document.getElementById("username");

const bioInput =
    document.getElementById("bio");

const phoneInput =
    document.getElementById("phone");

const emailInput =
    document.getElementById("email");

const profileImage =
    document.getElementById("profileImage");

const profileDisplayName =
    document.getElementById("profileDisplayName");

const profileUsername =
    document.getElementById("profileUsername");

const changePhotoBtn =
    document.getElementById("changePhotoBtn");

const profilePhotoInput =
    document.getElementById("profilePhotoInput");

const bioCounter =
    document.getElementById("bioCounter");

const profileMessage =
    document.getElementById("profileMessage");

const saveProfileBtn =
    document.getElementById("saveProfileBtn");

const saveText =
    document.getElementById("saveText");

const saveLoader =
    document.getElementById("saveLoader");

const backBtn =
    document.getElementById("backBtn");


/* =====================================================
   VARIABLES
===================================================== */

let currentUser = null;

let selectedPhoto = null;

let currentPhotoURL = "";


/* =====================================================
   BACK BUTTON
===================================================== */

backBtn.addEventListener("click", () => {

    window.location.href = "Index.html";

});


/* =====================================================
   BIO COUNTER
===================================================== */

bioInput.addEventListener("input", () => {

    bioCounter.textContent =
        `${bioInput.value.length}/150`;

});


/* =====================================================
   PHOTO BUTTON
===================================================== */

changePhotoBtn.addEventListener("click", () => {

    profilePhotoInput.click();

});


/* =====================================================
   PHOTO SELECT
===================================================== */

profilePhotoInput.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];

        if (!file) return;


        if (!file.type.startsWith("image/")) {

            showMessage(
                "Please select an image.",
                "error"
            );

            return;

        }


        if (file.size > 5 * 1024 * 1024) {

            showMessage(
                "Image must be less than 5MB.",
                "error"
            );

            return;

        }


        selectedPhoto = file;


        const previewURL =
            URL.createObjectURL(file);


        profileImage.src =
            previewURL;

    }
);


/* =====================================================
   AUTH STATE
===================================================== */

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            showMessage(
                "Please login to edit your profile.",
                "error"
            );

            setTimeout(() => {

                window.location.href =
                    "Mychatregister.html";

            }, 1800);

            return;

        }


        currentUser = user;


        emailInput.value =
            user.email || "";


        await loadProfile(user.uid);

    }
);


/* =====================================================
   LOAD PROFILE
===================================================== */

async function loadProfile(uid) {

    try {

        const userRef =
            ref(db, `users/${uid}`);

        const snapshot =
            await get(userRef);


        if (!snapshot.exists()) {

            profileDisplayName.textContent =
                "CHAPCY User";

            profileUsername.textContent =
                "@username";

            return;

        }


        const data =
            snapshot.val();


        fullNameInput.value =
            data.fullName || data.name || "";


        usernameInput.value =
            data.username || "";


        bioInput.value =
            data.bio || "";


        phoneInput.value =
            data.phone || "";


        currentPhotoURL =
            data.photoURL ||
            data.profileImage ||
            "";


        if (currentPhotoURL) {

            profileImage.src =
                currentPhotoURL;

        }


        updateProfilePreview();

        updateBioCounter();

    } catch(error) {

        console.error(
            "PROFILE LOAD ERROR:",
            error
        );


        showMessage(
            "Unable to load your profile.",
            "error"
        );

    }

}


/* =====================================================
   PROFILE PREVIEW
===================================================== */

function updateProfilePreview() {

    const name =
        fullNameInput.value.trim();


    const username =
        usernameInput.value.trim();


    profileDisplayName.textContent =
        name || "CHAPCY User";


    profileUsername.textContent =
        username
            ? `@${username.replace(/^@/, "")}`
            : "@username";

}


fullNameInput.addEventListener(
    "input",
    updateProfilePreview
);


usernameInput.addEventListener(
    "input",
    updateProfilePreview
);


/* =====================================================
   BIO COUNTER
===================================================== */

function updateBioCounter() {

    bioCounter.textContent =
        `${bioInput.value.length}/150`;

}


/* =====================================================
   SAVE PROFILE
===================================================== */

profileForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!currentUser) {

            showMessage(
                "You are not logged in.",
                "error"
            );

            return;

        }


        const fullName =
            fullNameInput.value.trim();


        const username =
            usernameInput.value
                .trim()
                .replace(/^@/, "")
                .toLowerCase();


        const bio =
            bioInput.value.trim();


        const phone =
            phoneInput.value.trim();


        if (!fullName) {

            showMessage(
                "Enter your full name.",
                "error"
            );

            return;

        }


        if (!username) {

            showMessage(
                "Enter your username.",
                "error"
            );

            return;

        }


        if (!/^[a-zA-Z0-9._]+$/.test(username)) {

            showMessage(
                "Username can only contain letters, numbers, dots and underscores.",
                "error"
            );

            return;

        }


        setSaving(true);


        try {

            let photoURL =
                currentPhotoURL;


            /* =========================================
               UPLOAD NEW PHOTO
            ========================================= */

            if (selectedPhoto) {

                const fileExtension =
                    selectedPhoto.name
                        .split(".")
                        .pop();


                const imagePath =
                    `profilePhotos/${currentUser.uid}/profile.${fileExtension}`;


                const imageRef =
                    storageRef(
                        storage,
                        imagePath
                    );


                await uploadBytes(
                    imageRef,
                    selectedPhoto
                );


                photoURL =
                    await getDownloadURL(
                        imageRef
                    );

            }


            /* =========================================
               SAVE TO REALTIME DATABASE
            ========================================= */

            const userRef =
                ref(
                    db,
                    `users/${currentUser.uid}`
                );


            await update(
                userRef,
                {

                    fullName:
                        fullName,

                    name:
                        fullName,

                    username:
                        username,

                    bio:
                        bio,

                    phone:
                        phone,

                    email:
                        currentUser.email || "",

                    photoURL:
                        photoURL,

                    updatedAt:
                        Date.now()

                }
            );


            currentPhotoURL =
                photoURL;


            selectedPhoto =
                null;


            updateProfilePreview();


            showMessage(
                "✓ Profile updated successfully!",
                "success"
            );


            /* =========================================
               UPDATE LOCAL HEADER IMAGE
            ========================================= */

            localStorage.setItem(
                "chapcyProfilePhoto",
                photoURL
            );


        } catch(error) {

            console.error(
                "PROFILE SAVE ERROR:",
                error
            );


            let message =
                "Failed to save profile.";


            if (
                error.code ===
                "storage/unauthorized"
            ) {

                message =
                    "You don't have permission to upload this photo.";

            }


            if (
                error.code ===
                "storage/quota-exceeded"
            ) {

                message =
                    "Storage quota exceeded.";

            }


            showMessage(
                message,
                "error"
            );

        }


        setSaving(false);

    }
);


/* =====================================================
   SAVE STATE
===================================================== */

function setSaving(isSaving) {

    saveProfileBtn.disabled =
        isSaving;


    if (isSaving) {

        saveText.hidden =
            true;

        saveLoader.hidden =
            false;

    } else {

        saveText.hidden =
            false;

        saveLoader.hidden =
            true;

    }

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    message,
    type
) {

    profileMessage.textContent =
        message;

    profileMessage.className =
        `profile-message ${type}`;


    setTimeout(() => {

        profileMessage.textContent =
            "";

        profileMessage.className =
            "profile-message";

    }, 4000);

    }
