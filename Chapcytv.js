/* =========================================================
   CHAPCY TV — REAL FIREBASE VERSION
   TikTok-style vertical video feed
   ========================================================= */

import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    addDoc,
    serverTimestamp,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    auth,
    db
} from "./chapcy-tv-firebase.js";


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let currentUser = null;
let videos = [];
let currentVideoIndex = 0;
let unsubscribeVideos = null;

const videoFeed = document.getElementById("videoFeed");


/* =========================================================
   AUTHENTICATION
   ========================================================= */

onAuthStateChanged(auth, async (user) => {

    currentUser = user || null;

    console.log(
        currentUser
            ? "CHAPCY TV logged in as:"
            : "CHAPCY TV visitor mode",
        currentUser?.uid
    );

    loadVideos();
});


/* =========================================================
   LOAD REAL VIDEOS FROM FIRESTORE
   ========================================================= */

function loadVideos() {

    if (!videoFeed) {
        console.error("videoFeed element not found.");
        return;
    }

    if (unsubscribeVideos) {
        unsubscribeVideos();
    }

    const videosRef = collection(db, "chapcyVideos");

    const videosQuery = query(
        videosRef,
        orderBy("createdAt", "desc")
    );

    unsubscribeVideos = onSnapshot(
        videosQuery,
        (snapshot) => {

            videos = [];

            snapshot.forEach((item) => {

                const data = item.data();

                videos.push({
                    id: item.id,
                    ...data
                });

            });

            renderVideos();
        },

        (error) => {

            console.error(
                "Failed to load CHAPCY TV videos:",
                error
            );

            videoFeed.innerHTML = `
                <div class="tv-error">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <h3>Unable to load videos</h3>
                    <p>${escapeHTML(error.message)}</p>
                    <button onclick="location.reload()">
                        Retry
                    </button>
                </div>
            `;
        }
    );
}


/* =========================================================
   RENDER VIDEOS
   ========================================================= */

function renderVideos() {

    if (!videoFeed) return;

    videoFeed.innerHTML = "";

    if (videos.length === 0) {

        videoFeed.innerHTML = `
            <div class="tv-empty">
                <i class="fa-solid fa-video"></i>

                <h2>No CHAPCY TV videos yet</h2>

                <p>
                    Be the first person to upload a video.
                </p>
            </div>
        `;

        return;
    }

    videos.forEach((video, index) => {

        const card = createVideoCard(video, index);

        videoFeed.appendChild(card);

    });

    setupVideoObservers();

    setupVideoEvents();
}


/* =========================================================
   CREATE VIDEO CARD
   ========================================================= */

function createVideoCard(video, index) {

    const article = document.createElement("article");

    article.className = "tv-video";

    article.dataset.videoId = video.id;

    const username =
        video.username ||
        "CHAPCY User";

    const photoURL =
        video.photoURL ||
        "https://ui-avatars.com/api/?name=CHAPCY+User";

    const caption =
        video.caption ||
        "";

    const likes =
        Number(video.likes || 0);

    const comments =
        Number(video.comments || 0);

    const shares =
        Number(video.shares || 0);

    const views =
        Number(video.views || 0);

    article.innerHTML = `

        <!-- VIDEO -->

        <video
            class="tv-video-player"
            src="${safeURL(video.videoURL)}"
            loop
            playsinline
            preload="metadata"
        ></video>


        <!-- TOP BAR -->

        <div class="tv-top-bar">

            <button
                class="tv-back"
                type="button"
                onclick="goBack()"
            >
                <i class="fa-solid fa-arrow-left"></i>
            </button>

            <div class="tv-logo">
                📺 CHAPCY TV
            </div>

            <button
                class="tv-search"
                type="button"
                onclick="openSearch()"
            >
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>

        </div>


        <!-- GRADIENT OVERLAY -->

        <div class="tv-gradient"></div>


        <!-- VIDEO INFO -->

        <div class="tv-info">

            <div class="tv-user">

                <img
                    src="${safeURL(photoURL)}"
                    alt="${escapeHTML(username)}"
                    class="tv-avatar"
                >

                <div class="tv-user-details">

                    <strong>
                        @${escapeHTML(username)}
                    </strong>

                    ${
                        currentUser &&
                        video.userId === currentUser.uid
                            ? `
                                <span class="tv-owner">
                                    You
                                </span>
                              `
                            : `
                                <button
                                    class="follow-btn"
                                    data-user-id="${escapeHTML(video.userId || "")}"
                                    data-video-id="${video.id}"
                                    type="button"
                                >
                                    Follow
                                </button>
                              `
                    }

                </div>

            </div>


            <div class="tv-caption">

                ${escapeHTML(caption)}

            </div>


            <div class="tv-music">

                <i class="fa-solid fa-music"></i>

                <span>
                    CHAPCY Original Sound
                </span>

            </div>

        </div>


        <!-- ACTIONS -->

        <div class="tv-actions">

            <!-- LIKE -->

            <button
                class="tv-action like-btn"
                data-video-id="${video.id}"
                type="button"
            >

                <i class="fa-solid fa-heart"></i>

                <span class="like-count">
                    ${formatNumber(likes)}
                </span>

            </button>


            <!-- COMMENT -->

            <button
                class="tv-action comment-btn"
                data-video-id="${video.id}"
                type="button"
            >

                <i class="fa-solid fa-comment"></i>

                <span>
                    ${formatNumber(comments)}
                </span>

            </button>


            <!-- SHARE -->

            <button
                class="tv-action share-btn"
                data-video-id="${video.id}"
                type="button"
            >

                <i class="fa-solid fa-share"></i>

                <span>
                    ${formatNumber(shares)}
                </span>

            </button>


            <!-- SAVE -->

            <button
                class="tv-action save-btn"
                data-video-id="${video.id}"
                type="button"
            >

                <i class="fa-solid fa-bookmark"></i>

            </button>


            <!-- MUTE -->

            <button
                class="tv-action mute-btn"
                type="button"
            >

                <i class="fa-solid fa-volume-xmark"></i>

            </button>


            <!-- VIEWS -->

            <div class="tv-views">

                <i class="fa-solid fa-eye"></i>

                <span>
                    ${formatNumber(views)}
                </span>

            </div>

        </div>


        <!-- PROGRESS -->

        <div class="tv-progress">

            <div class="tv-progress-bar"></div>

        </div>


        <!-- DOUBLE TAP HEART -->

        <div class="double-heart">

            <i class="fa-solid fa-heart"></i>

        </div>


        <!-- LOADING -->

        <div class="tv-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

        </div>

    `;

    return article;
}


/* =========================================================
   VIDEO OBSERVER
   ========================================================= */

function setupVideoObservers() {

    const allVideos =
        document.querySelectorAll(".tv-video-player");

    if (!allVideos.length) return;

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    const video =
                        entry.target;

                    const card =
                        video.closest(".tv-video");

                    if (entry.isIntersecting) {

                        pauseAllExcept(video);

                        video.muted = true;

                        video.play()
                            .then(() => {

                                card
                                    ?.classList
                                    .remove("video-loading");

                            })
                            .catch(() => {

                                card
                                    ?.classList
                                    .add("video-loading");

                            });

                        registerView(
                            card?.dataset.videoId
                        );

                    } else {

                        video.pause();

                    }

                });

            },

            {
                threshold: 0.75
            }
        );


    allVideos.forEach((video) => {

        observer.observe(video);

    });
}


/* =========================================================
   PAUSE OTHER VIDEOS
   ========================================================= */

function pauseAllExcept(activeVideo) {

    document
        .querySelectorAll(".tv-video-player")
        .forEach((video) => {

            if (video !== activeVideo) {

                video.pause();

            }

        });
}


/* =========================================================
   VIDEO EVENTS
   ========================================================= */

function setupVideoEvents() {

    document
        .querySelectorAll(".tv-video-player")
        .forEach((video) => {

            /* -------------------------------
               TIME UPDATE
            -------------------------------- */

            video.addEventListener(
                "timeupdate",
                () => {

                    const card =
                        video.closest(".tv-video");

                    const progress =
                        card?.querySelector(
                            ".tv-progress-bar"
                        );

                    if (!progress) return;

                    if (video.duration) {

                        const percentage =
                            (
                                video.currentTime /
                                video.duration
                            ) * 100;

                        progress.style.width =
                            `${percentage}%`;
                    }

                }
            );


            /* -------------------------------
               DOUBLE TAP
            -------------------------------- */

            let lastTap = 0;

            video.addEventListener(
                "click",
                async () => {

                    const now =
                        Date.now();

                    if (
                        now - lastTap <
                        300
                    ) {

                        const card =
                            video.closest(
                                ".tv-video"
                            );

                        if (!card) return;

                        showDoubleHeart(card);

                        await likeVideo(
                            card.dataset.videoId
                        );
                    }

                    lastTap = now;

                }
            );


            /* -------------------------------
               LOADING
            -------------------------------- */

            video.addEventListener(
                "waiting",
                () => {

                    video
                        .closest(".tv-video")
                        ?.classList
                        .add("video-loading");

                }
            );


            video.addEventListener(
                "canplay",
                () => {

                    video
                        .closest(".tv-video")
                        ?.classList
                        .remove("video-loading");

                }
            );

        });


    /* =====================================================
       LIKE BUTTON
       ===================================================== */

    document
        .querySelectorAll(".like-btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                async (event) => {

                    event.stopPropagation();

                    const videoId =
                        button.dataset.videoId;

                    await likeVideo(videoId);

                }
            );

        });


    /* =====================================================
       COMMENT BUTTON
       ===================================================== */

    document
        .querySelectorAll(".comment-btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    openComments(
                        button.dataset.videoId
                    );

                }
            );

        });


    /* =====================================================
       SHARE BUTTON
       ===================================================== */

    document
        .querySelectorAll(".share-btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                async (event) => {

                    event.stopPropagation();

                    await shareVideo(
                        button.dataset.videoId
                    );

                }
            );

        });


    /* =====================================================
       SAVE BUTTON
       ===================================================== */

    document
        .querySelectorAll(".save-btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                async (event) => {

                    event.stopPropagation();

                    await saveVideo(
                        button.dataset.videoId,
                        button
                    );

                }
            );

        });


    /* =====================================================
       MUTE BUTTON
       ===================================================== */

    document
        .querySelectorAll(".mute-btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    toggleMute(
                        button
                    );

                }
            );

        });


    /* =====================================================
       FOLLOW BUTTON
       ===================================================== */

    document
        .querySelectorAll(".follow-btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                async (event) => {

                    event.stopPropagation();

                    await followUser(
                        button.dataset.userId,
                        button
                    );

                }
            );

        });

}


/* =========================================================
   LIKE VIDEO
   ========================================================= */

async function likeVideo(videoId) {

    if (!currentUser) {

        showMessage(
            "Please login to like videos."
        );

        return;
    }

    if (!videoId) return;

    try {

        const likeRef = doc(
            db,
            "chapcyVideos",
            videoId,
            "likes",
            currentUser.uid
        );

        const likeSnapshot =
            await getDoc(likeRef);

        const videoRef =
            doc(
                db,
                "chapcyVideos",
                videoId
            );

        const button =
            document.querySelector(
                `.like-btn[data-video-id="${videoId}"]`
            );

        const icon =
            button?.querySelector("i");

        if (likeSnapshot.exists()) {

            await deleteDoc(likeRef);

            await updateDoc(
                videoRef,
                {
                    likes: increment(-1)
                }
            );

            icon?.classList.remove(
                "liked"
            );

        } else {

            await setDoc(
                likeRef,
                {
                    userId:
                        currentUser.uid,

                    createdAt:
                        serverTimestamp()
                }
            );

            await updateDoc(
                videoRef,
                {
                    likes: increment(1)
                }
            );

            icon?.classList.add(
                "liked"
            );

        }

    } catch (error) {

        console.error(
            "Like error:",
            error
        );

        showMessage(
            "Unable to update like."
        );
    }
}


/* =========================================================
   REGISTER VIEW
   ========================================================= */

const viewedVideos = new Set();

async function registerView(videoId) {

    if (!videoId) return;

    if (viewedVideos.has(videoId)) {
        return;
    }

    viewedVideos.add(videoId);

    try {

        const videoRef =
            doc(
                db,
                "chapcyVideos",
                videoId
            );

        await updateDoc(
            videoRef,
            {
                views: increment(1)
            }
        );

    } catch (error) {

        console.warn(
            "View update failed:",
            error
        );
    }
}


/* =========================================================
   FOLLOW USER
   ========================================================= */

async function followUser(
    targetUserId,
    button
) {

    if (!currentUser) {

        showMessage(
            "Please login to follow users."
        );

        return;
    }

    if (!targetUserId) {

        showMessage(
            "This user cannot be followed."
        );

        return;
    }

    if (
        targetUserId ===
        currentUser.uid
    ) {

        return;
    }

    try {

        const followId =
            `${currentUser.uid}_${targetUserId}`;

        const followRef =
            doc(
                db,
                "follows",
                followId
            );

        const existing =
            await getDoc(followRef);

        if (existing.exists()) {

            await deleteDoc(
                followRef
            );

            button.textContent =
                "Follow";

            button.classList.remove(
                "following"
            );

        } else {

            await setDoc(
                followRef,
                {
                    followerId:
                        currentUser.uid,

                    followingId:
                        targetUserId,

                    createdAt:
                        serverTimestamp()
                }
            );

            button.textContent =
                "Following";

            button.classList.add(
                "following"
            );
        }

    } catch (error) {

        console.error(
            "Follow error:",
            error
        );

        showMessage(
            "Unable to update follow."
        );
    }
}


/* =========================================================
   SAVE VIDEO
   ========================================================= */

async function saveVideo(
    videoId,
    button
) {

    if (!currentUser) {

        showMessage(
            "Please login to save videos."
        );

        return;
    }

    try {

        const saveRef =
            doc(
                db,
                "users",
                currentUser.uid,
                "savedVideos",
                videoId
            );

        const existing =
            await getDoc(saveRef);

        if (existing.exists()) {

            await deleteDoc(
                saveRef
            );

            button.classList.remove(
                "saved"
            );

            showMessage(
                "Removed from saved videos."
            );

        } else {

            await setDoc(
                saveRef,
                {
                    videoId,
                    savedAt:
                        serverTimestamp()
                }
            );

            button.classList.add(
                "saved"
            );

            showMessage(
                "Video saved."
            );
        }

    } catch (error) {

        console.error(
            "Save error:",
            error
        );

        showMessage(
            "Unable to save video."
        );
    }
}


/* =========================================================
   SHARE VIDEO
   ========================================================= */

async function shareVideo(videoId) {

    const video =
        videos.find(
            item => item.id === videoId
        );

    if (!video) return;

    const shareURL =
        `${window.location.origin}${window.location.pathname}?video=${encodeURIComponent(videoId)}`;

    const shareData = {

        title:
            "CHAPCY TV",

        text:
            video.caption ||
            "Watch this video on CHAPCY TV.",

        url:
            shareURL

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
                shareURL
            );

            showMessage(
                "Video link copied."
            );

        }

        const videoRef =
            doc(
                db,
                "chapcyVideos",
                videoId
            );

        await updateDoc(
            videoRef,
            {
                shares:
                    increment(1)
            }
        );

    } catch (error) {

        if (
            error.name !==
            "AbortError"
        ) {

            console.error(
                "Share error:",
                error
            );
        }
    }
}


/* =========================================================
   COMMENTS
   ========================================================= */

async function openComments(videoId) {

    const oldPanel =
        document.querySelector(
            ".comments-panel"
        );

    oldPanel?.remove();


    const panel =
        document.createElement("div");

    panel.className =
        "comments-panel";

    panel.innerHTML = `

        <div class="comments-backdrop"></div>

        <div class="comments-box">

            <div class="comments-header">

                <h3>
                    Comments
                </h3>

                <button
                    class="close-comments"
                    type="button"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>

            </div>


            <div
                class="comments-list"
                id="commentsList"
            >

                <div class="comments-loading">

                    <i class="fa-solid fa-spinner fa-spin"></i>

                    Loading comments...

                </div>

            </div>


            ${
                currentUser
                    ? `
                        <form
                            class="comment-form"
                            id="commentForm"
                        >

                            <input
                                type="text"
                                id="commentInput"
                                placeholder="Add a comment..."
                                maxlength="500"
                                autocomplete="off"
                                required
                            >

                            <button
                                type="submit"
                            >
                                <i class="fa-solid fa-paper-plane"></i>
                            </button>

                        </form>
                    `
                    : `
                        <div class="login-comment">

                            Login to comment.

                        </div>
                    `
            }

        </div>
    `;


    document.body.appendChild(
        panel
    );


    panel
        .querySelector(
            ".comments-backdrop"
        )
        ?.addEventListener(
            "click",
            () => panel.remove()
        );


    panel
        .querySelector(
            ".close-comments"
        )
        ?.addEventListener(
            "click",
            () => panel.remove()
        );


    await loadComments(
        videoId
    );


    const form =
        panel.querySelector(
            "#commentForm"
        );

    form?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const input =
                panel.querySelector(
                    "#commentInput"
                );

            const text =
                input?.value.trim();

            if (!text) return;

            await addComment(
                videoId,
                text,
                input
            );

        }
    );
}


/* =========================================================
   LOAD COMMENTS
   ========================================================= */

async function loadComments(videoId) {

    const list =
        document.querySelector(
            "#commentsList"
        );

    if (!list) return;

    try {

        const commentsRef =
            collection(
                db,
                "chapcyVideos",
                videoId,
                "comments"
            );

        const commentsQuery =
            query(
                commentsRef,
                orderBy(
                    "createdAt",
                    "desc"
                )
            );

        onSnapshot(
            commentsQuery,
            (snapshot) => {

                list.innerHTML = "";

                if (
                    snapshot.empty
                ) {

                    list.innerHTML = `
                        <div class="no-comments">
                            No comments yet.
                            Be the first!
                        </div>
                    `;

                    return;
                }

                snapshot.forEach(
                    (item) => {

                        const comment =
                            item.data();

                        const div =
                            document.createElement(
                                "div"
                            );

                        div.className =
                            "comment-item";

                        div.innerHTML = `

                            <img
                                src="${safeURL(
                                    comment.photoURL ||
                                    "https://ui-avatars.com/api/?name=User"
                                )}"
                                class="comment-avatar"
                            >

                            <div class="comment-content">

                                <strong>
                                    ${escapeHTML(
                                        comment.username ||
                                        "User"
                                    )}
                                </strong>

                                <p>
                                    ${escapeHTML(
                                        comment.text ||
                                        ""
                                    )}
                                </p>

                            </div>

                        `;

                        list.appendChild(
                            div
                        );

                    }
                );

            },

            (error) => {

                console.error(
                    "Comment listener error:",
                    error
                );

                list.innerHTML = `
                    <div class="comments-error">
                        Unable to load comments.
                    </div>
                `;
            }
        );

    } catch (error) {

        console.error(
            "Comment error:",
            error
        );
    }
}


/* =========================================================
   ADD COMMENT
   ========================================================= */

async function addComment(
    videoId,
    text,
    input
) {

    if (!currentUser) {

        showMessage(
            "Please login first."
        );

        return;
    }

    try {

        const commentsRef =
            collection(
                db,
                "chapcyVideos",
                videoId,
                "comments"
            );

        await addDoc(
            commentsRef,
            {

                userId:
                    currentUser.uid,

                username:
                    currentUser.displayName ||
                    currentUser.email?.split("@")[0] ||
                    "CHAPCY User",

                photoURL:
                    currentUser.photoURL ||
                    "",

                text:
                    text,

                createdAt:
                    serverTimestamp()

            }
        );


        const videoRef =
            doc(
                db,
                "chapcyVideos",
                videoId
            );

        await updateDoc(
            videoRef,
            {
                comments:
                    increment(1)
            }
        );


        if (input) {
            input.value = "";
        }

    } catch (error) {

        console.error(
            "Add comment error:",
            error
        );

        showMessage(
            "Unable to post comment."
        );
    }
}


/* =========================================================
   MUTE / UNMUTE
   ========================================================= */

function toggleMute(button) {

    const card =
        button.closest(
            ".tv-video"
        );

    const video =
        card?.querySelector(
            ".tv-video-player"
        );

    if (!video) return;

    video.muted =
        !video.muted;

    const icon =
        button.querySelector("i");

    if (video.muted) {

        icon.className =
            "fa-solid fa-volume-xmark";

    } else {

        icon.className =
            "fa-solid fa-volume-high";

    }
}


/* =========================================================
   DOUBLE HEART ANIMATION
   ========================================================= */

function showDoubleHeart(card) {

    const heart =
        card.querySelector(
            ".double-heart"
        );

    if (!heart) return;

    heart.classList.remove(
        "show"
    );

    void heart.offsetWidth;

    heart.classList.add(
        "show"
    );

    setTimeout(() => {

        heart.classList.remove(
            "show"
        );

    }, 900);
}


/* =========================================================
   BACK BUTTON
   ========================================================= */

window.goBack = function () {

    if (
        window.history.length >
        1
    ) {

        window.history.back();

    } else {

        window.location.href =
            "Index.html";

    }
};


/* =========================================================
   SEARCH
   ========================================================= */

window.openSearch = function () {

    const existing =
        document.querySelector(
            ".tv-search-panel"
        );

    if (existing) {

        existing.remove();

        return;
    }


    const panel =
        document.createElement(
            "div"
        );

    panel.className =
        "tv-search-panel";

    panel.innerHTML = `

        <div class="search-inner">

            <input
                type="search"
                id="tvSearchInput"
                placeholder="Search CHAPCY TV..."
                autocomplete="off"
            >

            <button
                type="button"
                id="closeSearchBtn"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

        </div>

        <div
            class="search-results"
            id="searchResults"
        ></div>

    `;


    document.body.appendChild(
        panel
    );


    const input =
        panel.querySelector(
            "#tvSearchInput"
        );

    input?.focus();


    input?.addEventListener(
        "input",
        () => {

            searchVideos(
                input.value
            );

        }
    );


    panel
        .querySelector(
            "#closeSearchBtn"
        )
        ?.addEventListener(
            "click",
            () => panel.remove()
        );
};


/* =========================================================
   SEARCH VIDEOS
   ========================================================= */

function searchVideos(text) {

    const results =
        document.querySelector(
            "#searchResults"
        );

    if (!results) return;

    const search =
        text.trim().toLowerCase();

    if (!search) {

        results.innerHTML = "";

        return;
    }

    const matches =
        videos.filter(
            video => {

                const caption =
                    (
                        video.caption ||
                        ""
                    ).toLowerCase();

                const username =
                    (
                        video.username ||
                        ""
                    ).toLowerCase();

                return (
                    caption.includes(search) ||
                    username.includes(search)
                );
            }
        );


    if (!matches.length) {

        results.innerHTML = `
            <div class="search-empty">
                No videos found.
            </div>
        `;

        return;
    }


    results.innerHTML =
        matches
            .map(
                video => `

                    <button
                        class="search-video-result"
                        data-id="${video.id}"
                        type="button"
                    >

                        <i class="fa-solid fa-play"></i>

                        <span>

                            @${escapeHTML(
                                video.username ||
                                "User"
                            )}

                            <small>
                                ${escapeHTML(
                                    video.caption ||
                                    "CHAPCY TV video"
                                )}
                            </small>

                        </span>

                    </button>

                `
            )
            .join("");


    results
        .querySelectorAll(
            ".search-video-result"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.id;

                        const target =
                            document.querySelector(
                                `[data-video-id="${id}"]`
                            );

                        target?.scrollIntoView({
                            behavior: "smooth"
                        });

                        document
                            .querySelector(
                                ".tv-search-panel"
                            )
                            ?.remove();

                    }
                );

            }
        );
}


/* =========================================================
   TOAST MESSAGE
   ========================================================= */

function showMessage(message) {

    let toast =
        document.querySelector(
            ".tv-toast"
        );

    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.className =
            "tv-toast";

        document.body.appendChild(
            toast
        );
    }

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toast._timeout
    );

    toast._timeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );
}


/* =========================================================
   FORMAT NUMBERS
   ========================================================= */

function formatNumber(number) {

    const value =
        Number(number || 0);

    if (value >= 1000000) {

        return (
            value / 1000000
        ).toFixed(1) + "M";

    }

    if (value >= 1000) {

        return (
            value / 1000
        ).toFixed(1) + "K";

    }

    return value.toString();
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   SAFE URL
   ========================================================= */

function safeURL(url) {

    if (!url) return "";

    try {

        const parsed =
            new URL(
                url,
                window.location.href
            );

        if (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        ) {

            return parsed.href;
        }

    } catch (error) {

        console.warn(
            "Invalid URL:",
            url
        );

    }

    return "";
}


/* =========================================================
   OPEN VIDEO FROM URL
   Example:
   chapcy tv.html?video=VIDEO_ID
   ========================================================= */

function openVideoFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const videoId =
        params.get("video");

    if (!videoId) return;

    setTimeout(() => {

        const target =
            document.querySelector(
                `[data-video-id="${videoId}"]`
            );

        target?.scrollIntoView({
            behavior: "smooth"
        });

    }, 1000);
}


/* =========================================================
   START
   ========================================================= */

window.addEventListener(
    "load",
    () => {

        openVideoFromURL();

    }
);


/* =========================================================
   CLEANUP
   ========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        if (unsubscribeVideos) {

            unsubscribeVideos();

        }

    }
);


/* =========================================================
   DEBUG
   ========================================================= */

console.log(
    "📺 CHAPCY TV Firebase JS loaded successfully."
);
