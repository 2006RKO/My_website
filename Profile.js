/* =========================================================
CHAPCY V50
COMPLETE PROFILE SYSTEM
Firebase Auth + Firestore
========================================================= */

"use strict";

/* =========================================================
FIREBASE IMPORTS
========================================================= */

import {
initializeApp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
getAuth,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
getFirestore,
doc,
getDoc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

/* =========================================================
FIREBASE CONFIG
========================================================= */

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

/* =========================================================
INITIALIZE FIREBASE
========================================================= */

const app =
initializeApp(firebaseConfig);

const auth =
getAuth(app);

const db =
getFirestore(app);

/* =========================================================
ELEMENTS
========================================================= */

const backBtn =
document.getElementById("backBtn");

const profileForm =
document.getElementById("profileForm");

const profileImage =
document.getElementById("profileImage");

const changePhotoBtn =
document.getElementById("changePhotoBtn");

const profilePhotoInput =
document.getElementById("profilePhotoInput");

const profileDisplayName =
document.getElementById("profileDisplayName");

const profileUsername =
document.getElementById("profileUsername");

const fullName =
document.getElementById("fullName");

const username =
document.getElementById("username");

const bio =
document.getElementById("bio");

const bioCounter =
document.getElementById("bioCounter");

const phone =
document.getElementById("phone");

const email =
document.getElementById("email");

const saveProfileBtn =
document.getElementById("saveProfileBtn");

const saveText =
document.getElementById("saveText");

const saveLoader =
document.getElementById("saveLoader");

const profileMessage =
document.getElementById("profileMessage");

/* =========================================================
VARIABLES
========================================================= */

let currentUser = null;

let selectedPhoto = null;

/* =========================================================
DEFAULT PROFILE IMAGE
========================================================= */

const defaultAvatar =
"file_00000000b0d8820a998b33ad9cf233cb.png";

/* =========================================================
MESSAGE
========================================================= */

function showMessage(
message,
type = "info"
) {

if (!profileMessage) return;


profileMessage.textContent =
    message;


profileMessage.className =
    `profile-message ${type}`;

}

/* =========================================================
CLEAR MESSAGE
========================================================= */

function clearMessage() {

if (!profileMessage) return;


profileMessage.textContent =
    "";


profileMessage.className =
    "profile-message";

}

/* =========================================================
BIO COUNTER
========================================================= */

function updateBioCounter() {

if (!bio || !bioCounter) return;


const length =
    bio.value.length;


bioCounter.textContent =
    `${length}/150`;


/* CHANGE COLOR WHEN NEAR LIMIT */

if (length >= 135) {

    bioCounter.style.color =
        "#f59e0b";

} else {

    bioCounter.style.color =
        "";

}


if (length >= 150) {

    bioCounter.style.color =
        "#ef4444";

}

}

/* =========================================================
BIO EVENT
========================================================= */

if (bio) {

bio.addEventListener(
    "input",
    updateBioCounter
);

}

/* =========================================================
PHOTO BUTTON
========================================================= */

if (
changePhotoBtn &&
profilePhotoInput
) {

changePhotoBtn.addEventListener(
    "click",
    () => {

        profilePhotoInput.click();

    }
);

}

/* =========================================================
PHOTO SELECT
========================================================= */

if (profilePhotoInput) {

profilePhotoInput.addEventListener(
    "change",
    event => {

        const file =
            event.target.files?.[0];


        if (!file) return;


        /* CHECK FILE TYPE */

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            showMessage(
                "Please select a valid image.",
                "error"
            );

            profilePhotoInput.value =
                "";

            return;

        }


        /* CHECK FILE SIZE */

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            showMessage(
                "Image must be smaller than 5MB.",
                "error"
            );

            profilePhotoInput.value =
                "";

            return;

        }


        selectedPhoto =
            file;


        /* CREATE PREVIEW */

        const reader =
            new FileReader();


        reader.onload =
            () => {

                profileImage.src =
                    reader.result;

            };


        reader.readAsDataURL(
            file
        );


        showMessage(
            "Profile picture selected. Save your profile to apply it.",
            "info"
        );

    }
);

}

/* =========================================================
COMPRESS IMAGE
========================================================= */

function compressImage(
file,
maxWidth = 700,
quality = 0.80
) {

return new Promise(
    (resolve, reject) => {

        const reader =
            new FileReader();


        reader.onload =
            event => {

                const image =
                    new Image();


                image.onload =
                    () => {

                        let width =
                            image.width;

                        let height =
                            image.height;


                        /* RESIZE */

                        if (
                            width >
                            maxWidth
                        ) {

                            height =
                                height *
                                (
                                    maxWidth /
                                    width
                                );

                            width =
                                maxWidth;

                        }


                        const canvas =
                            document.createElement(
                                "canvas"
                            );


                        canvas.width =
                            width;

                        canvas.height =
                            height;


                        const ctx =
                            canvas.getContext(
                                "2d"
                            );


                        ctx.drawImage(
                            image,
                            0,
                            0,
                            width,
                            height
                        );


                        canvas.toBlob(
                            blob => {

                                if (!blob) {

                                    reject(
                                        new Error(
                                            "Image compression failed."
                                        )
                                    );

                                    return;

                                }


                                resolve(
                                    blob
                                );

                            },
                            "image/jpeg",
                            quality
                        );

                    };


                image.onerror =
                    () => {

                        reject(
                            new Error(
                                "Unable to read image."
                            )
                        );

                    };


                image.src =
                    event.target.result;

            };


        reader.onerror =
            () => {

                reject(
                    new Error(
                        "Unable to load image."
                    )
                );

            };


        reader.readAsDataURL(
            file
        );

    }
);

}

/* =========================================================
BLOB → BASE64
========================================================= */

function blobToBase64(blob) {

return new Promise(
    (resolve, reject) => {

        const reader =
            new FileReader();


        reader.onloadend =
            () => {

                resolve(
                    reader.result
                );

            };


        reader.onerror =
            reject;


        reader.readAsDataURL(
            blob
        );

    }
);

}

/* =========================================================
CLEAN USERNAME
========================================================= */

function cleanUsername(
value
) {

return value
    .trim()
    .replace(
        /^@+/,
        ""
    )
    .replace(
        /\s+/g,
        ""
    )
    .replace(
        /[^a-zA-Z0-9._-]/g,
        ""
    )
    .toLowerCase();

}

/* =========================================================
UPDATE PROFILE PREVIEW
========================================================= */

function updateProfilePreview() {

const name =
    fullName?.value.trim() ||
    "CHAPCY User";


const user =
    cleanUsername(
        username?.value || ""
    ) ||
    "username";


if (profileDisplayName) {

    profileDisplayName.textContent =
        name;

}


if (profileUsername) {

    profileUsername.textContent =
        `@${user}`;

}

}

/* =========================================================
LIVE NAME
========================================================= */

if (fullName) {

fullName.addEventListener(
    "input",
    updateProfilePreview
);

}

/* =========================================================
LIVE USERNAME
========================================================= */

if (username) {

username.addEventListener(
    "input",
    updateProfilePreview
);

}

/* =========================================================
SAVE LOADING
========================================================= */

function setSaving(
state
) {

if (!saveProfileBtn)
    return;


saveProfileBtn.disabled =
    state;


if (state) {

    if (saveText)
        saveText.hidden = true;


    if (saveLoader)
        saveLoader.hidden = false;


    saveProfileBtn.style.opacity =
        "0.7";


    saveProfileBtn.style.cursor =
        "wait";

} else {

    if (saveText)
        saveText.hidden = false;


    if (saveLoader)
        saveLoader.hidden = true;


    saveProfileBtn.style.opacity =
        "1";


    saveProfileBtn.style.cursor =
        "";

}

}

/* =========================================================
LOAD PROFILE FROM FIRESTORE
========================================================= */

async function loadProfile(
user
) {

try {

    /* EMAIL FROM AUTH */

    if (email) {

        email.value =
            user.email || "";

    }


    /* FIRESTORE */

    const profileRef =
        doc(
            db,
            "users",
            user.uid
        );


    const snapshot =
        await getDoc(
            profileRef
        );


    if (snapshot.exists()) {

        const data =
            snapshot.data();


        /* FULL NAME */

        if (fullName) {

            fullName.value =
                data.fullName ||
                data.displayName ||
                user.displayName ||
                "";

        }


        /* USERNAME */

        if (username) {

            username.value =
                data.username ||
                "";

        }


        /* BIO */

        if (bio) {

            bio.value =
                data.bio ||
                "";

        }


        /* PHONE */

        if (phone) {

            phone.value =
                data.phone ||
                "";

        }


        /* PROFILE IMAGE */

        if (
            data.photoURL &&
            profileImage
        ) {

            profileImage.src =
                data.photoURL;

        }


    } else {

        /* FIRST TIME USER */

        if (fullName) {

            fullName.value =
                user.displayName ||
                "";

        }


        if (email) {

            email.value =
                user.email ||
                "";

        }

    }


    updateProfilePreview();

    updateBioCounter();


} catch (error) {

    console.error(
        "CHAPCY Profile Load Error:",
        error
    );


    showMessage(
        "Unable to load your profile.",
        "error"
    );

}

}

/* =========================================================
SAVE PROFILE
========================================================= */

if (profileForm) {

profileForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        clearMessage();


        /* AUTH CHECK */

        if (!currentUser) {

            showMessage(
                "Please login to edit your profile.",
                "error"
            );

            return;

        }


        /* GET VALUES */

        const name =
            fullName.value.trim();


        const cleanUser =
            cleanUsername(
                username.value
            );


        const userBio =
            bio.value.trim();


        const userPhone =
            phone.value.trim();


        /* =================================================
                       VALIDATION
        ================================================== */

        if (!name) {

            showMessage(
                "Please enter your full name.",
                "error"
            );

            fullName.focus();

            return;

        }


        if (!cleanUser) {

            showMessage(
                "Please enter a username.",
                "error"
            );

            username.focus();

            return;

        }


        if (
            cleanUser.length < 3
        ) {

            showMessage(
                "Username must contain at least 3 characters.",
                "error"
            );

            username.focus();

            return;

        }


        if (
            userBio.length > 150
        ) {

            showMessage(
                "Your bio is too long.",
                "error"
            );

            return;

        }


        setSaving(true);


        try {

            let photoURL =
                profileImage?.src ||
                defaultAvatar;


            /* =================================================
                     PROCESS PHOTO
            ================================================== */

            if (selectedPhoto) {

                showMessage(
                    "Preparing your profile picture...",
                    "info"
                );


                const compressed =
                    await compressImage(
                        selectedPhoto,
                        700,
                        0.80
                    );


                photoURL =
                    await blobToBase64(
                        compressed
                    );

            }


            /* =================================================
                     PROFILE OBJECT
            ================================================== */

            const profileData = {

                uid:
                    currentUser.uid,

                fullName:
                    name,

                displayName:
                    name,

                username:
                    cleanUser,

                bio:
                    userBio,

                phone:
                    userPhone,

                email:
                    currentUser.email ||
                    "",

                photoURL:
                    photoURL,

                updatedAt:
                    serverTimestamp()

            };


            /* =================================================
                     SAVE TO FIRESTORE
            ================================================== */

            await setDoc(
                doc(
                    db,
                    "users",
                    currentUser.uid
                ),
                profileData,
                {
                    merge: true
                }
            );


            /* UPDATE INPUT */

            username.value =
                cleanUser;


            /* UPDATE PREVIEW */

            updateProfilePreview();


            /* RESET PHOTO */

            selectedPhoto =
                null;


            if (profilePhotoInput) {

                profilePhotoInput.value =
                    "";

            }


            /* SUCCESS */

            showMessage(
                "✓ Profile saved successfully!",
                "success"
            );


            /* AUTO CLEAR */

            setTimeout(
                () => {

                    clearMessage();

                },
                4000
            );


        } catch (error) {

            console.error(
                "CHAPCY Profile Save Error:",
                error
            );


            let message =
                "Unable to save your profile.";


            /* FIRESTORE ERROR */

            if (
                error.code ===
                "permission-denied"
            ) {

                message =
                    "Firebase permission denied. Check your Firestore rules.";

            }


            if (
                error.code ===
                "unavailable"
            ) {

                message =
                    "Firebase is temporarily unavailable. Check your internet.";

            }


            showMessage(
                message,
                "error"
            );


        } finally {

            setSaving(false);

        }

    }
);

}

/* =========================================================
BACK BUTTON
========================================================= */

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
                "index.html";

        }

    }
);

}

/* =========================================================
AUTH STATE
========================================================= */

onAuthStateChanged(
auth,
async user => {

    if (user) {

        currentUser =
            user;


        console.log(
            "CHAPCY User:",
            user.uid
        );


        await loadProfile(
            user
        );


    } else {

        currentUser =
            null;


        console.log(
            "No CHAPCY user logged in."
        );


        if (email) {

            email.value =
                "";

        }


        showMessage(
            "You must be logged in to edit your profile.",
            "error"
        );

    }

}

);

/* =========================================================
INITIAL UI
========================================================= */

updateBioCounter();

updateProfilePreview();

/* =========================================================
CHAPCY V50 READY
========================================================= */

console.log(
"🚀 CHAPCY V50 Profile System Ready"
);
