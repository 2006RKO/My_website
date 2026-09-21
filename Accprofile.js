/* =========================================================
   CHAPCY PROFILE
   FIREBASE READY
========================================================= */


/* =========================================================
   PROFILE ELEMENTS
========================================================= */

const profilePhoto =
    document.getElementById("profilePhoto");

const profileDisplayName =
    document.getElementById("profileDisplayName");

const profileUsername =
    document.getElementById("profileUsername");

const profileBio =
    document.getElementById("profileBio");

const profileLocation =
    document.getElementById("profileLocation");

const followersCount =
    document.getElementById("followersCount");

const friendsCount =
    document.getElementById("friendsCount");

const profilePoints =
    document.getElementById("profilePoints");

const pointsBalance =
    document.getElementById("pointsBalance");

const walletBalance =
    document.getElementById("walletBalance");

const walletAmount =
    document.getElementById("walletAmount");

const userVideos =
    document.getElementById("userVideos");

const contentLoading =
    document.getElementById("contentLoading");

const contentEmpty =
    document.getElementById("contentEmpty");

const contentTitle =
    document.getElementById("contentTitle");

const contentSubtitle =
    document.getElementById("contentSubtitle");


/* =========================================================
   LOCAL FALLBACK DATA
   Firebase ikija data hii itabadilishwa
========================================================= */

const defaultProfile = {

    uid: "",

    displayName: "CHAPCY User",

    username: "chapcyuser",

    bio: "Welcome to my CHAPCY profile.",

    photoURL:
        "file_00000000b0d8820a998b33ad9cf233cb.png",

    location: "Tanzania",

    followers: 0,

    friends: 0,

    points: 0,

    wallet: 0,

    verified: false

};


/* =========================================================
   FORMAT NUMBERS
========================================================= */

function formatNumber(value) {

    const number = Number(value || 0);

    if (number >= 1000000) {

        return (
            (number / 1000000)
                .toFixed(1)
                .replace(".0", "") +
            "M"
        );

    }

    if (number >= 1000) {

        return (
            (number / 1000)
                .toFixed(1)
                .replace(".0", "") +
            "K"
        );

    }

    return number.toLocaleString();

}


/* =========================================================
   FORMAT WALLET
========================================================= */

function formatMoney(value) {

    const amount = Number(value || 0);

    return "TZS " + amount.toLocaleString();

}


/* =========================================================
   DISPLAY PROFILE
========================================================= */

function renderProfile(data) {

    const profile = {
        ...defaultProfile,
        ...data
    };


    if (profilePhoto) {

        profilePhoto.src =
            profile.photoURL ||
            defaultProfile.photoURL;

    }


    if (profileDisplayName) {

        profileDisplayName.textContent =
            profile.displayName ||
            "CHAPCY User";

    }


    if (profileUsername) {

        profileUsername.textContent =
            "@" +
            (
                profile.username ||
                "chapcyuser"
            );

    }


    if (profileBio) {

        profileBio.textContent =
            profile.bio ||
            "Welcome to my CHAPCY profile.";

    }


    if (profileLocation) {

        profileLocation.innerHTML =
            `<i class="fa-solid fa-location-dot"></i>
             ${escapeHTML(profile.location || "Tanzania")}`;

    }


    if (followersCount) {

        followersCount.textContent =
            formatNumber(profile.followers);

    }


    if (friendsCount) {

        friendsCount.textContent =
            formatNumber(profile.friends);

    }


    if (profilePoints) {

        profilePoints.textContent =
            formatNumber(profile.points);

    }


    if (pointsBalance) {

        pointsBalance.textContent =
            formatNumber(profile.points);

    }


    if (walletBalance) {

        walletBalance.textContent =
            formatMoney(profile.wallet);

    }


    if (walletAmount) {

        walletAmount.textContent =
            formatMoney(profile.wallet);

    }


    const verifiedBadge =
        document.getElementById("verifiedBadge");

    if (verifiedBadge) {

        verifiedBadge.hidden =
            !Boolean(profile.verified);

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   VIDEO CARD
========================================================= */

function createVideoCard(video) {

    const card =
        document.createElement("article");

    card.className = "video-card";

    const thumbnail =
        video.thumbnail ||
        "file_00000000b3448243aebfedfba8912525.png";

    const title =
        video.title ||
        "CHAPCY Video";

    const duration =
        video.duration ||
        "0:00";

    const views =
        Number(video.views || 0);


    card.innerHTML = `

        <div class="video-preview">

            <img
                src="${escapeHTML(thumbnail)}"
                alt="${escapeHTML(title)}"
                loading="lazy"
            >

            <span class="video-play">

                <i class="fa-solid fa-play"></i>

            </span>

            <span class="video-duration">

                ${escapeHTML(duration)}

            </span>

            <span class="video-views">

                <i class="fa-solid fa-play"></i>

                ${formatNumber(views)}

            </span>

        </div>


        <div class="video-info">

            <span>
                ${escapeHTML(title)}
            </span>

            <i class="fa-solid fa-ellipsis-vertical"></i>

        </div>

    `;


    card.addEventListener(
        "click",
        () => {

            if (video.url) {

                window.location.href =
                    video.url;

            }

            else if (video.id) {

                window.location.href =
                    `Video.html?id=${encodeURIComponent(video.id)}`;

            }

        }
    );


    return card;

}


/* =========================================================
   RENDER VIDEOS
========================================================= */

function renderVideos(videos = []) {

    if (!userVideos) return;


    userVideos.innerHTML = "";


    if (!videos.length) {

        if (contentEmpty) {

            contentEmpty.hidden = false;

        }

        return;

    }


    if (contentEmpty) {

        contentEmpty.hidden = true;

    }


    videos.forEach(
        video => {

            userVideos.appendChild(
                createVideoCard(video)
            );

        }
    );

}


/* =========================================================
   LOADING STATE
========================================================= */

function setLoading(loading) {

    if (!contentLoading) return;

    contentLoading.style.display =
        loading ? "flex" : "none";

}


/* =========================================================
   PROFILE TABS
========================================================= */

const profileTabs =
    document.querySelectorAll(".profile-tab");


profileTabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            profileTabs.forEach(
                item =>
                    item.classList.remove("active")
            );


            tab.classList.add("active");


            const type =
                tab.dataset.tab;


            if (type === "videos") {

                contentTitle.textContent =
                    "Your Videos";

                contentSubtitle.textContent =
                    "Videos posted on CHAPCY";

                loadVideos();

            }


            if (type === "posts") {

                contentTitle.textContent =
                    "Your Posts";

                contentSubtitle.textContent =
                    "Posts shared on CHAPCY";

                loadPosts();

            }


            if (type === "liked") {

                contentTitle.textContent =
                    "Liked";

                contentSubtitle.textContent =
                    "Content you liked on CHAPCY";

                loadLiked();

            }

        }
    );

});


/* =========================================================
   TEMPORARY CONTENT LOADERS
   Firebase itatumia hizi functions
========================================================= */

async function loadVideos() {

    setLoading(true);

    if (contentEmpty) {
        contentEmpty.hidden = true;
    }

    try {

        /*
         * FIREBASE:
         *
         * users/{uid}/videos
         *
         * Example:
         *
         * const snapshot =
         * await get(query(
         *   ref(db, "videos"),
         *   orderByChild("uid"),
         *   equalTo(uid)
         * ));
         */


        /*
         * Temporary empty result.
         * Firebase ikishaunganishwa
         * hapa ndipo data itaingia.
         */

        renderVideos([]);

    }

    catch (error) {

        console.error(
            "CHAPCY video loading error:",
            error
        );

        renderVideos([]);

    }

    finally {

        setLoading(false);

    }

}


async function loadPosts() {

    setLoading(false);

    if (userVideos) {

        userVideos.innerHTML = "";

    }

    if (contentEmpty) {

        contentEmpty.hidden = false;

        contentEmpty.querySelector("h3").textContent =
            "No posts yet";

        contentEmpty.querySelector("p").textContent =
            "Your CHAPCY posts will appear here.";

    }

}


async function loadLiked() {

    setLoading(false);

    if (userVideos) {

        userVideos.innerHTML = "";

    }

    if (contentEmpty) {

        contentEmpty.hidden = false;

        contentEmpty.querySelector("h3").textContent =
            "Nothing liked yet";

        contentEmpty.querySelector("p").textContent =
            "Videos and posts you like will appear here.";

    }

}


/* =========================================================
   EDIT PROFILE
========================================================= */

const editProfileBtn =
    document.getElementById("editProfileBtn");


if (editProfileBtn) {

    editProfileBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "EditProfile.html";

        }
    );

}


/* =========================================================
   SETTINGS
========================================================= */

const settingsBtn =
    document.getElementById(
        "profileSettingsBtn"
    );


if (settingsBtn) {

    settingsBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "Settings.html";

        }
    );

}


/* =========================================================
   CREATE CONTENT
========================================================= */

const createContentBtn =
    document.getElementById(
        "createContentBtn"
    );


if (createContentBtn) {

    createContentBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "Create.html";

        }
    );

}


/* =========================================================
   FIREBASE CONNECTION POINT
========================================================= */

/*
 * IMPORTANT:
 *
 * Hapa ndipo tutaiunganisha na Firebase yako.
 *
 * Recommended database structure:
 *
 * users/
 *   UID/
 *     displayName
 *     username
 *     bio
 *     photoURL
 *     location
 *     followers
 *     friends
 *     points
 *     wallet
 *     verified
 *
 *
 * videos/
 *   VIDEO_ID/
 *     uid
 *     title
 *     videoURL
 *     thumbnail
 *     duration
 *     views
 *     createdAt
 *
 *
 * followers/
 *   UID/
 *     OTHER_UID: true
 *
 *
 * friends/
 *   UID/
 *     OTHER_UID: true
 *
 *
 * pointTransactions/
 *   UID/
 *     TRANSACTION_ID/
 *       amount
 *       type
 *       reason
 *       createdAt
 *
 *
 * walletTransactions/
 *   UID/
 *     TRANSACTION_ID/
 *       amount
 *       type
 *       status
 *       createdAt
 */


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        setLoading(true);

        /*
         * Until Firebase is connected,
         * display the safe default profile.
         */

        renderProfile(defaultProfile);

        await loadVideos();

    }
);
