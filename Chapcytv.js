/* =========================================================
   CHAPCY TV — REAL FIREBASE VERSION
   TikTok Style Worldwide Video Feed
========================================================= */

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    query,
    orderBy,
    limit,
    serverTimestamp,
    increment,
    runTransaction
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-storage.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

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


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentUser = null;

let videos = [];

let currentVideoIndex = 0;

let activeVideo = null;

let observer = null;

let muted = true;

let searchTimeout = null;

let lastTap = 0;

let selectedCommentVideo = null;


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = selector => document.querySelector(selector);

const feed =
    $("#videoFeed") ||
    $(".video-feed");

const loadingScreen =
    $("#loadingScreen") ||
    $(".loading-screen");

const searchPanel =
    $("#searchPanel") ||
    $(".search-panel");

const searchInput =
    $("#searchInput") ||
    $(".search-box input");

const searchResults =
    $("#searchResults") ||
    $(".search-results");

const commentsModal =
    $("#commentsModal") ||
    $(".comments-modal");

const commentsList =
    $("#commentsList") ||
    $(".comments-list");

const commentInput =
    $("#commentInput") ||
    $(".comment-input-area input");

const commentSend =
    $("#commentSendBtn") ||
    $(".comment-input-area button");

const uploadButton =
    $("#uploadBtn") ||
    $(".upload-floating-btn");

const searchButton =
    $("#searchBtn") ||
    '[data-action="search"]';

const closeSearchButton =
    $("#closeSearchBtn") ||
    '[data-action="close-search"]';

const backButton =
    $("#backBtn") ||
    '[data-action="back"]';


/* =========================================================
   START APP
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setupEvents();

    createPremiumLoader();

    waitForFirebaseUser();

});


/* =========================================================
   FIREBASE AUTH
========================================================= */

function waitForFirebaseUser(){

    onAuthStateChanged(auth, async user => {

        if(user){

            currentUser = user;

            console.log(
                "CHAPCY user:",
                user.uid
            );

            await loadVideos();

        }else{

            /*
               Kama user haja-login,
               anonymous auth itajaribu kufanya kazi.
            */

            try{

                await signInAnonymously(auth);

            }catch(error){

                console.warn(
                    "Anonymous login failed:",
                    error
                );

                await loadVideos();
            }
        }

    });

}


/* =========================================================
   LOAD REAL VIDEOS
========================================================= */

async function loadVideos(){

    showLoading(true);

    try{

        const videosRef =
            collection(db, "chapcyVideos");

        const q =
            query(
                videosRef,
                orderBy(
                    "createdAt",
                    "desc"
                ),
                limit(50)
            );

        const snapshot =
            await getDocs(q);

        videos = [];

        snapshot.forEach(item => {

            videos.push({
                id: item.id,
                ...item.data()
            });

        });

        console.log(
            "CHAPCY TV videos:",
            videos.length
        );

        renderVideos();

    }catch(error){

        console.error(
            "Video loading error:",
            error
        );

        /*
           Kama collection haina createdAt
           au index bado haijatengenezwa,
           jaribu bila orderBy.
        */

        try{

            const fallback =
                await getDocs(
                    query(
                        collection(
                            db,
                            "chapcyVideos"
                        ),
                        limit(50)
                    )
                );

            videos = [];

            fallback.forEach(item => {

                videos.push({
                    id: item.id,
                    ...item.data()
                });

            });

            renderVideos();

        }catch(secondError){

            console.error(
                secondError
            );

            showEmptyFeed(
                "Unable to load CHAPCY TV videos."
            );

        }

    }

}


/* =========================================================
   RENDER VIDEOS
========================================================= */

function renderVideos(list = videos){

    if(!feed) return;

    feed.innerHTML = "";

    if(!list.length){

        showEmptyFeed(
            "No CHAPCY TV videos yet."
        );

        showLoading(false);

        return;
    }

    list.forEach((video, index) => {

        const card =
            createVideoCard(
                video,
                index
            );

        feed.appendChild(card);

    });

    setupVideoObserver();

    showLoading(false);

}


/* =========================================================
   CREATE VIDEO CARD
========================================================= */

function createVideoCard(video, index){

    const card =
        document.createElement("article");

    card.className =
        "video-card";

    card.dataset.videoId =
        video.id;

    card.dataset.index =
        index;


    const videoURL =
        escapeHTML(
            video.videoURL ||
            video.url ||
            ""
        );

    const username =
        escapeHTML(
            video.username ||
            video.displayName ||
            "CHAPCY User"
        );

    const caption =
        escapeHTML(
            video.caption ||
            ""
        );

    const photoURL =
        escapeHTML(
            video.photoURL ||
            video.profileImage ||
            "https://ui-avatars.com/api/?name=CHAPCY&background=030712&color=00ffff"
        );

    const likes =
        Number(
            video.likes || 0
        );

    const comments =
        Number(
            video.comments || 0
        );

    const shares =
        Number(
            video.shares || 0
        );


    card.innerHTML = `

        <video
            class="chapcy-video"
            src="${videoURL}"
            playsinline
            loop
            preload="metadata"
            muted
        ></video>


        <div class="video-overlay"></div>


        <!-- MUTE -->

        <button
            class="mute-btn"
            data-action="mute"
            title="Mute / Unmute"
        >
            <i class="fa-solid fa-volume-xmark"></i>
        </button>


        <!-- BIG HEART -->

        <div class="big-heart">
            <i class="fa-solid fa-heart"></i>
        </div>


        <!-- VIDEO INFO -->

        <div class="video-info">

            <div class="creator-row">

                <img
                    class="creator-avatar"
                    src="${photoURL}"
                    alt="${username}"
                    onerror="this.src='https://ui-avatars.com/api/?name=User'"
                >

                <div class="creator-name">
                    @${username}
                </div>

                <button
                    class="follow-btn"
                    data-action="follow"
                    data-user-id="${escapeHTML(video.userId || "")}"
                >
                    Follow
                </button>

            </div>


            <div class="video-caption">
                ${caption}
            </div>


            <div class="video-time">
                ${formatDate(video.createdAt)}
            </div>

        </div>


        <!-- ACTIONS -->

        <div class="video-actions">


            <!-- LIKE -->

            <div class="action-item">

                <button
                    class="action-btn like-btn"
                    data-action="like"
                    title="Like"
                >
                    <i class="fa-solid fa-heart"></i>
                </button>

                <span class="action-count like-count">
                    ${formatNumber(likes)}
                </span>

            </div>


            <!-- COMMENTS -->

            <div class="action-item">

                <button
                    class="action-btn"
                    data-action="comment"
                    title="Comments"
                >
                    <i class="fa-solid fa-comment"></i>
                </button>

                <span class="action-count comment-count">
                    ${formatNumber(comments)}
                </span>

            </div>


            <!-- SHARE -->

            <div class="action-item">

                <button
                    class="action-btn"
                    data-action="share"
                    title="Share"
                >
                    <i class="fa-solid fa-share"></i>
                </button>

                <span class="action-count share-count">
                    ${formatNumber(shares)}
                </span>

            </div>


            <!-- SAVE -->

            <div class="action-item">

                <button
                    class="action-btn save-btn"
                    data-action="save"
                    title="Save"
                >
                    <i class="fa-solid fa-bookmark"></i>
                </button>

                <span class="action-count">
                    Save
                </span>

            </div>

        </div>


        <!-- PROGRESS -->

        <div class="video-progress">

            <div
                class="video-progress-bar"
            ></div>

        </div>

    `;


    setupCardEvents(
        card,
        video
    );


    return card;
}


/* =========================================================
   VIDEO CARD EVENTS
========================================================= */

function setupCardEvents(card, video){

    const videoElement =
        card.querySelector(
            ".chapcy-video"
        );


    /* -----------------------------
       VIDEO CLICK
    ----------------------------- */

    videoElement.addEventListener(
        "click",
        () => {

            const now =
                Date.now();

            if(
                now -
                lastTap <
                350
            ){

                likeVideo(
                    video.id,
                    card
                );

                showBigHeart(
                    card
                );

            }

            lastTap = now;

        }
    );


    /* -----------------------------
       MUTE
    ----------------------------- */

    const mute =
        card.querySelector(
            '[data-action="mute"]'
        );

    mute.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            toggleMute(
                videoElement,
                mute
            );

        }
    );


    /* -----------------------------
       LIKE
    ----------------------------- */

    const like =
        card.querySelector(
            '[data-action="like"]'
        );

    like.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            likeVideo(
                video.id,
                card
            );

        }
    );


    /* -----------------------------
       COMMENTS
    ----------------------------- */

    const comment =
        card.querySelector(
            '[data-action="comment"]'
        );

    comment.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openComments(
                video,
                card
            );

        }
    );


    /* -----------------------------
       SHARE
    ----------------------------- */

    const share =
        card.querySelector(
            '[data-action="share"]'
        );

    share.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            shareVideo(
                video,
                card
            );

        }
    );


    /* -----------------------------
       SAVE
    ----------------------------- */

    const save =
        card.querySelector(
            '[data-action="save"]'
        );

    save.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            saveVideo(
                video.id,
                save
            );

        }
    );


    /* -----------------------------
       FOLLOW
    ----------------------------- */

    const follow =
        card.querySelector(
            '[data-action="follow"]'
        );

    follow.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            followUser(
                video.userId,
                follow
            );

        }
    );


    /* -----------------------------
       PROGRESS
    ----------------------------- */

    videoElement.addEventListener(
        "timeupdate",
        () => {

            if(
                !videoElement.duration
            ) return;

            const percentage =
                (
                    videoElement.currentTime /
                    videoElement.duration
                ) * 100;

            const bar =
                card.querySelector(
                    ".video-progress-bar"
                );

            if(bar){

                bar.style.width =
                    percentage + "%";

            }

        }
    );


    /* -----------------------------
       VIDEO ERROR
    ----------------------------- */

    videoElement.addEventListener(
        "error",
        () => {

            console.warn(
                "Video could not load:",
                video.videoURL
            );

        }
    );

}


/* =========================================================
   AUTOPLAY OBSERVER
========================================================= */

function setupVideoObserver(){

    if(observer){

        observer.disconnect();

    }


    const options = {

        root:
            feed,

        threshold:
            0.75

    };


    observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        const video =
                            entry.target.querySelector(
                                ".chapcy-video"
                            );


                        if(
                            entry.isIntersecting
                        ){

                            activeVideo =
                                video;

                            currentVideoIndex =
                                Number(
                                    entry.target.dataset.index
                                );

                            video.muted =
                                muted;

                            video.play()
                                .catch(
                                    () => {}
                                );

                            countView(
                                entry.target.dataset.videoId
                            );

                        }else{

                            video.pause();

                        }

                    }
                );

            },
            options
        );


    document
        .querySelectorAll(
            ".video-card"
        )
        .forEach(card => {

            observer.observe(card);

        });

}


/* =========================================================
   COUNT VIEW
========================================================= */

async function countView(videoId){

    if(!videoId) return;

    try{

        const videoRef =
            doc(
                db,
                "chapcyVideos",
                videoId
            );

        await updateDoc(
            videoRef,
            {
                views:
                    increment(1)
            }
        );

    }catch(error){

        console.warn(
            "View count failed:",
            error
        );

    }

}


/* =========================================================
   LIKE VIDEO
========================================================= */

async function likeVideo(
    videoId,
    card
){

    if(!currentUser){

        alert(
            "Please login first."
        );

        return;

    }


    const likeRef =
        doc(
            db,
            "chapcyVideos",
            videoId,
            "likes",
            currentUser.uid
        );


    const videoRef =
        doc(
            db,
            "chapcyVideos",
            videoId
        );


    try{

        await runTransaction(
            db,
            async transaction => {

                const likeSnap =
                    await transaction.get(
                        likeRef
                    );

                if(
                    likeSnap.exists()
                ){

                    transaction.delete(
                        likeRef
                    );

                    transaction.update(
                        videoRef,
                        {
                            likes:
                                increment(-1)
                        }
                    );

                }else{

                    transaction.set(
                        likeRef,
                        {
                            userId:
                                currentUser.uid,

                            createdAt:
                                serverTimestamp()
                        }
                    );

                    transaction.update(
                        videoRef,
                        {
                            likes:
                                increment(1)
                        }
                    );

                }

            }
        );


        const newSnap =
            await getDoc(
                videoRef
            );

        if(
            newSnap.exists()
        ){

            const newData =
                newSnap.data();

            const count =
                card.querySelector(
                    ".like-count"
                );

            if(count){

                count.textContent =
                    formatNumber(
                        newData.likes || 0
                    );

            }

        }


        const likeButton =
            card.querySelector(
                ".like-btn"
            );


        const state =
            await getDoc(
                likeRef
            );


        if(
            state.exists()
        ){

            likeButton.classList.add(
                "liked"
            );

        }else{

            likeButton.classList.remove(
                "liked"
            );

        }

    }catch(error){

        console.error(
            "Like error:",
            error
        );

    }

}


/* =========================================================
   CHECK USER LIKE
========================================================= */

async function checkLike(
    videoId,
    card
){

    if(!currentUser) return;

    try{

        const likeRef =
            doc(
                db,
                "chapcyVideos",
                videoId,
                "likes",
                currentUser.uid
            );

        const snap =
            await getDoc(
                likeRef
            );

        const button =
            card.querySelector(
                ".like-btn"
            );

        if(
            snap.exists()
        ){

            button.classList.add(
                "liked"
            );

        }

    }catch(error){

        console.warn(error);

    }

}


/* =========================================================
   COMMENTS
========================================================= */

async function openComments(
    video,
    card
){

    selectedCommentVideo =
        video;


    if(!commentsModal){

        createCommentsModal();

    }


    commentsModal.classList.add(
        "active"
    );


    await loadComments(
        video.id
    );

}


/* =========================================================
   LOAD COMMENTS
========================================================= */

async function loadComments(
    videoId
){

    if(!commentsList) return;


    commentsList.innerHTML = `

        <div class="empty-comments">
            Loading comments...
        </div>

    `;


    try{

        const commentsRef =
            collection(
                db,
                "chapcyVideos",
                videoId,
                "comments"
            );


        const snapshot =
            await getDocs(
                commentsRef
            );


        commentsList.innerHTML = "";


        if(snapshot.empty){

            commentsList.innerHTML = `

                <div class="empty-comments">
                    No comments yet.<br>
                    Be the first to comment 💬
                </div>

            `;

            return;

        }


        const commentData = [];


        snapshot.forEach(item => {

            commentData.push({
                id: item.id,
                ...item.data()
            });

        });


        commentData.sort(
            (a,b) => {

                const aTime =
                    a.createdAt?.seconds || 0;

                const bTime =
                    b.createdAt?.seconds || 0;

                return aTime - bTime;

            }
        );


        commentData.forEach(
            comment => {

                renderComment(
                    comment
                );

            }
        );


        commentsList.scrollTop =
            commentsList.scrollHeight;


    }catch(error){

        console.error(
            "Comments error:",
            error
        );

        commentsList.innerHTML = `

            <div class="empty-comments">
                Unable to load comments.
            </div>

        `;

    }

}


/* =========================================================
   RENDER COMMENT
========================================================= */

function renderComment(comment){

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "comment";


    const avatar =
        escapeHTML(
            comment.photoURL ||
            "https://ui-avatars.com/api/?name=User"
        );


    const username =
        escapeHTML(
            comment.username ||
            "User"
        );


    const text =
        escapeHTML(
            comment.text ||
            ""
        );


    item.innerHTML = `

        <img
            class="comment-avatar"
            src="${avatar}"
            alt="${username}"
        >

        <div class="comment-body">

            <div class="comment-user">
                @${username}
            </div>

            <div class="comment-text">
                ${text}
            </div>

        </div>

    `;


    commentsList.appendChild(
        item
    );

}


/* =========================================================
   SEND COMMENT
========================================================= */

async function sendComment(){

    if(!selectedCommentVideo){

        return;

    }


    if(!currentUser){

        alert(
            "Please login first."
        );

        return;

    }


    const text =
        commentInput?.value.trim();


    if(!text){

        return;

    }


    try{

        const commentRef =
            collection(
                db,
                "chapcyVideos",
                selectedCommentVideo.id,
                "comments"
            );


        await addDoc(
            commentRef,
            {

                userId:
                    currentUser.uid,

                username:
                    currentUser.displayName ||
                    "CHAPCY User",

                photoURL:
                    currentUser.photoURL ||
                    "https://ui-avatars.com/api/?name=User",

                text:
                    text,

                createdAt:
                    serverTimestamp()

            }
        );


        await updateDoc(
            doc(
                db,
                "chapcyVideos",
                selectedCommentVideo.id
            ),
            {

                comments:
                    increment(1)

            }
        );


        commentInput.value = "";


        await loadComments(
            selectedCommentVideo.id
        );


    }catch(error){

        console.error(
            "Comment error:",
            error
        );

        alert(
            "Comment failed."
        );

    }

}


/* =========================================================
   SHARE VIDEO
========================================================= */

async function shareVideo(
    video,
    card
){

    const url =
        window.location.origin +
        window.location.pathname +
        "?video=" +
        encodeURIComponent(
            video.id
        );


    try{

        if(
            navigator.share
        ){

            await navigator.share({

                title:
                    "CHAPCY TV",

                text:
                    video.caption ||
                    "Watch this on CHAPCY TV",

                url:
                    url

            });

        }else{

            await navigator.clipboard.writeText(
                url
            );

            showToast(
                "Video link copied 🔗"
            );

        }


        await updateDoc(
            doc(
                db,
                "chapcyVideos",
                video.id
            ),
            {

                shares:
                    increment(1)

            }
        );


        const shareCount =
            card.querySelector(
                ".share-count"
            );


        const current =
            parseInt(
                shareCount.textContent
            ) || 0;


        shareCount.textContent =
            formatNumber(
                current + 1
            );


    }catch(error){

        console.warn(
            "Share cancelled/failed:",
            error
        );

    }

}


/* =========================================================
   SAVE VIDEO
========================================================= */

async function saveVideo(
    videoId,
    button
){

    if(!currentUser){

        alert(
            "Please login first."
        );

        return;

    }


    const saveRef =
        doc(
            db,
            "users",
            currentUser.uid,
            "savedVideos",
            videoId
        );


    try{

        const snap =
            await getDoc(
                saveRef
            );


        if(
            snap.exists()
        ){

            await deleteDoc(
                saveRef
            );

            button.classList.remove(
                "saved"
            );

            showToast(
                "Removed from saved"
            );

        }else{

            await setDoc(
                saveRef,
                {

                    videoId:
                        videoId,

                    savedAt:
                        serverTimestamp()

                }
            );

            button.classList.add(
                "saved"
            );

            showToast(
                "Video saved 🔖"
            );

        }

    }catch(error){

        console.error(
            "Save error:",
            error
        );

    }

}


/* =========================================================
   FOLLOW USER
========================================================= */

async function followUser(
    userId,
    button
){

    if(!currentUser){

        alert(
            "Please login first."
        );

        return;

    }


    if(!userId){

        showToast(
            "Creator ID unavailable"
        );

        return;

    }


    if(
        userId === currentUser.uid
    ){

        showToast(
            "You cannot follow yourself."
        );

        return;

    }


    const followRef =
        doc(
            db,
            "users",
            currentUser.uid,
            "following",
            userId
        );


    try{

        const snap =
            await getDoc(
                followRef
            );


        if(
            snap.exists()
        ){

            await deleteDoc(
                followRef
            );

            button.textContent =
                "Follow";

            button.classList.remove(
                "following"
            );

        }else{

            await setDoc(
                followRef,
                {

                    userId:
                        userId,

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

    }catch(error){

        console.error(
            "Follow error:",
            error
        );

    }

}


/* =========================================================
   MUTE / UNMUTE
========================================================= */

function toggleMute(
    video,
    button
){

    muted =
        !muted;


    document
        .querySelectorAll(
            ".chapcy-video"
        )
        .forEach(item => {

            item.muted =
                muted;

        });


    document
        .querySelectorAll(
            ".mute-btn"
        )
        .forEach(item => {

            item.innerHTML =
                muted

                ? `<i class="fa-solid fa-volume-xmark"></i>`

                : `<i class="fa-solid fa-volume-high"></i>`;

        });

}


/* =========================================================
   DOUBLE TAP HEART
========================================================= */

function showBigHeart(card){

    const heart =
        card.querySelector(
            ".big-heart"
        );

    if(!heart) return;


    heart.classList.remove(
        "show"
    );


    void heart.offsetWidth;


    heart.classList.add(
        "show"
    );


    setTimeout(
        () => {

            heart.classList.remove(
                "show"
            );

        },
        700
    );

}


/* =========================================================
   PREMIUM LOADING
========================================================= */

function createPremiumLoader(){

    if(!loadingScreen)
        return;


    loadingScreen.innerHTML = `

        <div class="chapcy-loader">

            <div class="loader-rings">

                <div class="ring ring-one"></div>

                <div class="ring ring-two"></div>

                <div class="ring ring-three"></div>

                <div class="loader-logo">
                    <i class="fa-solid fa-play"></i>
                </div>

            </div>


            <div class="loader-brand">
                <span>CHAPCY</span> TV
            </div>


            <div class="loader-text">
                Preparing your world...
            </div>


            <div class="loader-dots">

                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>

    `;


    injectLoaderCSS();

}


/* =========================================================
   LOADER CSS
========================================================= */

function injectLoaderCSS(){

    if(
        document.getElementById(
            "chapcyLoaderStyle"
        )
    )
        return;


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "chapcyLoaderStyle";


    style.textContent = `

        .chapcy-loader{
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            text-align:center;
            animation:chapcyLoaderFade 1s ease;
        }


        .loader-rings{
            width:115px;
            height:115px;
            position:relative;
            display:flex;
            align-items:center;
            justify-content:center;
            margin-bottom:24px;
        }


        .ring{
            position:absolute;
            border-radius:50%;
            border:2px solid transparent;
        }


        .ring-one{
            width:115px;
            height:115px;
            border-top-color:#00ffff;
            border-right-color:#00ffff;
            animation:chapcyRotate 1.4s linear infinite;
            box-shadow:0 0 20px rgba(0,255,255,.45);
        }


        .ring-two{
            width:88px;
            height:88px;
            border-bottom-color:#8b5cf6;
            border-left-color:#8b5cf6;
            animation:chapcyRotateReverse 1.1s linear infinite;
            box-shadow:0 0 20px rgba(139,92,246,.45);
        }


        .ring-three{
            width:62px;
            height:62px;
            border-top-color:#fff;
            animation:chapcyRotate 1.8s linear infinite;
        }


        .loader-logo{
            width:48px;
            height:48px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            background:linear-gradient(135deg,#00ffff,#2563eb);
            color:#fff;
            font-size:20px;
            box-shadow:
                0 0 20px rgba(0,255,255,.7),
                0 0 45px rgba(37,99,235,.35);
            animation:chapcyPulse 1.4s ease-in-out infinite;
        }


        .loader-brand{
            font-size:25px;
            font-weight:800;
            letter-spacing:2px;
            text-shadow:
                0 0 12px rgba(0,255,255,.7);
        }


        .loader-brand span{
            color:#00ffff;
        }


        .loader-text{
            margin-top:7px;
            color:#999;
            font-size:13px;
            letter-spacing:.5px;
        }


        .loader-dots{
            display:flex;
            gap:6px;
            margin-top:15px;
        }


        .loader-dots span{
            width:6px;
            height:6px;
            border-radius:50%;
            background:#00ffff;
            animation:chapcyDot 1.2s infinite;
        }


        .loader-dots span:nth-child(2){
            animation-delay:.15s;
        }


        .loader-dots span:nth-child(3){
            animation-delay:.3s;
        }


        @keyframes chapcyRotate{

            to{
                transform:rotate(360deg);
            }

        }


        @keyframes chapcyRotateReverse{

            to{
                transform:rotate(-360deg);
            }

        }


        @keyframes chapcyPulse{

            0%,100%{
                transform:scale(.92);
            }

            50%{
                transform:scale(1.08);
            }

        }


        @keyframes chapcyDot{

            0%,100%{
                opacity:.25;
                transform:translateY(0);
            }

            50%{
                opacity:1;
                transform:translateY(-4px);
            }

        }


        @keyframes chapcyLoaderFade{

            from{
                opacity:0;
                transform:scale(.94);
            }

            to{
                opacity:1;
                transform:scale(1);
            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   UPLOAD SYSTEM
========================================================= */

function setupUpload(){

    createUploadModal();

}


function createUploadModal(){

    if(
        document.getElementById(
            "chapcyUploadModal"
        )
    )
        return;


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "chapcyUploadModal";


    modal.innerHTML = `

        <div class="chapcy-upload-box">

            <button
                class="upload-close"
                id="uploadClose"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>


            <div class="upload-icon">
                <i class="fa-solid fa-cloud-arrow-up"></i>
            </div>


            <h2>
                Upload to CHAPCY TV
            </h2>


            <p>
                Share your video with the world 🌍
            </p>


            <label
                class="choose-video"
                for="chapcyVideoFile"
            >
                <i class="fa-solid fa-video"></i>
                Choose Video
            </label>


            <input
                type="file"
                id="chapcyVideoFile"
                accept="video/*"
                hidden
            >


            <div
                id="selectedVideoName"
                class="selected-video-name"
            >
                No video selected
            </div>


            <textarea
                id="chapcyCaption"
                placeholder="Write a caption..."
                maxlength="500"
            ></textarea>


            <div
                id="uploadProgressContainer"
                class="upload-progress-container"
            >

                <div
                    id="uploadProgressBar"
                    class="upload-progress-bar"
                ></div>

            </div>


            <div
                id="uploadProgressText"
                class="upload-progress-text"
            >
                Ready to upload
            </div>


            <button
                id="startChapcyUpload"
                class="start-upload-btn"
            >
                <i class="fa-solid fa-paper-plane"></i>
                Upload Video
            </button>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    injectUploadCSS();


    const fileInput =
        $("#chapcyVideoFile");


    const fileName =
        $("#selectedVideoName");


    fileInput.addEventListener(
        "change",
        () => {

            const file =
                fileInput.files[0];


            if(file){

                fileName.textContent =
                    file.name;

            }

        }
    );


    $("#uploadClose")
        .addEventListener(
            "click",
            closeUpload
        );


    modal.addEventListener(
        "click",
        event => {

            if(
                event.target === modal
            ){

                closeUpload();

            }

        }
    );


    $("#startChapcyUpload")
        .addEventListener(
            "click",
            uploadVideoToFirebase
        );

}


/* =========================================================
   UPLOAD CSS
========================================================= */

function injectUploadCSS(){

    const style =
        document.createElement(
            "style"
        );


    style.textContent = `

        #chapcyUploadModal{
            position:fixed;
            inset:0;
            z-index:5000;
            background:rgba(0,0,0,.82);
            backdrop-filter:blur(18px);
            display:none;
            align-items:center;
            justify-content:center;
            padding:20px;
        }


        #chapcyUploadModal.active{
            display:flex;
            animation:uploadFade .25s ease;
        }


        .chapcy-upload-box{
            width:min(440px,100%);
            background:
                linear-gradient(
                    145deg,
                    #111827,
                    #030712
                );
            border:1px solid rgba(0,255,255,.3);
            border-radius:28px;
            padding:28px 22px;
            box-shadow:
                0 0 40px rgba(0,255,255,.12);
            position:relative;
        }


        .upload-close{
            position:absolute;
            right:15px;
            top:15px;
            width:38px;
            height:38px;
            border:none;
            border-radius:50%;
            background:#18181b;
            color:#fff;
            cursor:pointer;
            font-size:17px;
        }


        .upload-icon{
            width:70px;
            height:70px;
            margin:5px auto 15px;
            border-radius:22px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:linear-gradient(
                135deg,
                #00ffff,
                #2563eb,
                #8b5cf6
            );
            font-size:28px;
            box-shadow:
                0 0 30px rgba(0,255,255,.3);
        }


        .chapcy-upload-box h2{
            text-align:center;
            font-size:21px;
        }


        .chapcy-upload-box p{
            text-align:center;
            color:#999;
            font-size:13px;
            margin:6px 0 20px;
        }


        .choose-video{
            display:flex;
            align-items:center;
            justify-content:center;
            gap:8px;
            height:50px;
            border-radius:16px;
            border:1px dashed rgba(0,255,255,.55);
            color:#00ffff;
            cursor:pointer;
            background:rgba(0,255,255,.05);
            transition:.25s;
        }


        .choose-video:hover{
            background:rgba(0,255,255,.12);
            transform:translateY(-1px);
        }


        .selected-video-name{
            margin:10px 0;
            font-size:12px;
            color:#aaa;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }


        #chapcyCaption{
            width:100%;
            min-height:100px;
            resize:none;
            border:none;
            outline:none;
            border-radius:16px;
            padding:14px;
            background:#18181b;
            color:#fff;
            font-family:inherit;
            margin-top:5px;
        }


        .upload-progress-container{
            height:6px;
            background:#202020;
            border-radius:20px;
            overflow:hidden;
            margin-top:15px;
        }


        .upload-progress-bar{
            width:0%;
            height:100%;
            background:linear-gradient(
                90deg,
                #00ffff,
                #2563eb,
                #8b5cf6
            );
            transition:.2s;
        }


        .upload-progress-text{
            font-size:11px;
            color:#888;
            margin:7px 0;
            text-align:center;
        }


        .start-upload-btn{
            width:100%;
            height:50px;
            border:none;
            border-radius:17px;
            background:linear-gradient(
                90deg,
                #00ffff,
                #2563eb,
                #8b5cf6
            );
            color:#fff;
            font-weight:800;
            cursor:pointer;
            font-size:14px;
            margin-top:5px;
            box-shadow:
                0 0 25px rgba(0,255,255,.2);
        }


        .start-upload-btn:disabled{
            opacity:.5;
            cursor:not-allowed;
        }


        @keyframes uploadFade{

            from{
                opacity:0;
            }

            to{
                opacity:1;
            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   OPEN UPLOAD
========================================================= */

function openUpload(){

    setupUpload();

    const modal =
        $("#chapcyUploadModal");

    modal.classList.add(
        "active"
    );

}


/* =========================================================
   CLOSE UPLOAD
========================================================= */

function closeUpload(){

    const modal =
        $("#chapcyUploadModal");

    if(modal){

        modal.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   REAL FIREBASE UPLOAD
========================================================= */

async function uploadVideoToFirebase(){

    if(!currentUser){

        alert(
            "Please login before uploading."
        );

        return;

    }


    const file =
        $("#chapcyVideoFile")
            ?.files[0];


    const caption =
        $("#chapcyCaption")
            ?.value.trim() || "";


    if(!file){

        alert(
            "Please choose a video first."
        );

        return;

    }


    /* LIMIT */

    const maxSize =
        200 * 1024 * 1024;


    if(
        file.size >
        maxSize
    ){

        alert(
            "Video must be 200MB or less."
        );

        return;

    }


    if(
        !file.type.startsWith(
            "video/"
        )
    ){

        alert(
            "Please select a valid video."
        );

        return;

    }


    const uploadBtn =
        $("#startChapcyUpload");


    uploadBtn.disabled =
        true;


    try{

        const safeName =
            file.name
                .replace(
                    /[^a-zA-Z0-9._-]/g,
                    "_"
                );


        const uniqueName =
            Date.now() +
            "_" +
            safeName;


        const storagePath =
            `chapcy-tv/${currentUser.uid}/${uniqueName}`;


        const storageRef =
            ref(
                storage,
                storagePath
            );


        const uploadTask =
            uploadBytesResumable(
                storageRef,
                file,
                {
                    contentType:
                        file.type
                }
            );


        uploadTask.on(

            "state_changed",

            snapshot => {

                const progress =
                    (
                        snapshot.bytesTransferred /
                        snapshot.totalBytes
                    ) * 100;


                $("#uploadProgressBar")
                    .style.width =
                    progress + "%";


                $("#uploadProgressText")
                    .textContent =
                    `Uploading ${Math.round(progress)}%`;

            },


            error => {

                console.error(
                    "Upload error:",
                    error
                );

                uploadBtn.disabled =
                    false;

                $("#uploadProgressText")
                    .textContent =
                    "Upload failed ❌";

                alert(
                    "Video upload failed."
                );

            },


            async () => {

                try{

                    $("#uploadProgressText")
                        .textContent =
                        "Processing video...";


                    const videoURL =
                        await getDownloadURL(
                            uploadTask.snapshot.ref
                        );


                    const username =
                        currentUser.displayName ||
                        "CHAPCY User";


                    const photoURL =
                        currentUser.photoURL ||
                        "https://ui-avatars.com/api/?name=CHAPCY";


                    await addDoc(
                        collection(
                            db,
                            "chapcyVideos"
                        ),
                        {

                            userId:
                                currentUser.uid,

                            username:
                                username,

                            photoURL:
                                photoURL,

                            videoURL:
                                videoURL,

                            storagePath:
                                storagePath,

                            caption:
                                caption,

                            likes:
                                0,

                            comments:
                                0,

                            shares:
                                0,

                            views:
                                0,

                            createdAt:
                                serverTimestamp()

                        }
                    );


                    $("#uploadProgressText")
                        .textContent =
                        "Uploaded successfully 🎉";


                    showToast(
                        "Your video is now on CHAPCY TV 🎬"
                    );


                    setTimeout(
                        async () => {

                            closeUpload();

                            resetUploadForm();

                            await loadVideos();

                        },
                        1000
                    );


                }catch(error){

                    console.error(
                        "Firestore save error:",
                        error
                    );

                    alert(
                        "Video uploaded, but saving information failed."
                    );

                    uploadBtn.disabled =
                        false;

                }

            }

        );

    }catch(error){

        console.error(
            error
        );

        uploadBtn.disabled =
            false;

        alert(
            "Upload failed."
        );

    }

}


/* =========================================================
   RESET UPLOAD FORM
========================================================= */

function resetUploadForm(){

    const file =
        $("#chapcyVideoFile");

    const caption =
        $("#chapcyCaption");

    const progress =
        $("#uploadProgressBar");

    const text =
        $("#uploadProgressText");

    const name =
        $("#selectedVideoName");


    if(file)
        file.value = "";


    if(caption)
        caption.value = "";


    if(progress)
        progress.style.width =
            "0%";


    if(text)
        text.textContent =
            "Ready to upload";


    if(name)
        name.textContent =
            "No video selected";


    const button =
        $("#startChapcyUpload");


    if(button)
        button.disabled =
            false;

}


/* =========================================================
   SEARCH SYSTEM
========================================================= */

function openSearch(){

    if(!searchPanel){

        createSearchPanel();

    }


    searchPanel.classList.add(
        "active"
    );


    setTimeout(
        () => {

            searchInput?.focus();

        },
        300
    );

}


/* =========================================================
   CLOSE SEARCH
========================================================= */

function closeSearch(){

    if(searchPanel){

        searchPanel.classList.remove(
            "active"
        );

    }


    if(searchInput){

        searchInput.value =
            "";

    }


    if(searchResults){

        searchResults.innerHTML =
            "";

    }

}


/* =========================================================
   SEARCH VIDEOS
========================================================= */

function searchVideos(){

    if(!searchInput)
        return;


    const value =
        searchInput.value
            .trim()
            .toLowerCase();


    if(!value){

        searchResults.innerHTML =
            "";

        return;

    }


    clearTimeout(
        searchTimeout
    );


    searchTimeout =
        setTimeout(
            () => {

                const results =
                    videos.filter(
                        video => {

                            const username =
                                (
                                    video.username ||
                                    ""
                                )
                                .toLowerCase();


                            const caption =
                                (
                                    video.caption ||
                                    ""
                                )
                                .toLowerCase();


                            return (
                                username.includes(value) ||
                                caption.includes(value)
                            );

                        }
                    );


                renderSearchResults(
                    results
                );

            },
            150
        );

}


/* =========================================================
   SEARCH RESULTS
========================================================= */

function renderSearchResults(
    results
){

    if(!searchResults)
        return;


    searchResults.innerHTML = "";


    if(!results.length){

        searchResults.innerHTML = `

            <div class="empty-comments">
                No CHAPCY TV results found 🔎
            </div>

        `;

        return;

    }


    results.forEach(
        video => {

            const item =
                document.createElement(
                    "div"
                );


            item.style.cssText = `

                display:flex;
                align-items:center;
                gap:12px;
                padding:12px;
                margin-bottom:8px;
                border-radius:15px;
                background:#111;
                cursor:pointer;

            `;


            item.innerHTML = `

                <div
                    style="
                        width:75px;
                        height:95px;
                        border-radius:10px;
                        overflow:hidden;
                        background:#000;
                        flex-shrink:0;
                    "
                >

                    <video
                        src="${escapeHTML(video.videoURL || "")}"
                        muted
                        preload="metadata"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                        "
                    ></video>

                </div>


                <div style="min-width:0;">

                    <strong>
                        @${escapeHTML(
                            video.username ||
                            "User"
                        )}
                    </strong>

                    <p
                        style="
                            color:#aaa;
                            font-size:12px;
                            margin-top:5px;
                        "
                    >
                        ${escapeHTML(
                            video.caption ||
                            "CHAPCY TV video"
                        )}
                    </p>

                </div>

            `;


            item.addEventListener(
                "click",
                () => {

                    closeSearch();

                    const index =
                        videos.findIndex(
                            item =>
                                item.id ===
                                video.id
                        );


                    if(index >= 0){

                        renderVideos();

                        setTimeout(
                            () => {

                                const card =
                                    feed.querySelector(
                                        `[data-video-id="${video.id}"]`
                                    );

                                card?.scrollIntoView({
                                    behavior:
                                        "smooth"
                                });

                            },
                            100
                        );

                    }

                }
            );


            searchResults.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   CREATE SEARCH PANEL IF MISSING
========================================================= */

function createSearchPanel(){

    const panel =
        document.createElement(
            "div"
        );


    panel.className =
        "search-panel";


    panel.id =
        "searchPanel";


    panel.innerHTML = `

        <div class="search-box">

            <button id="closeSearchBtn">
                <i class="fa-solid fa-arrow-left"></i>
            </button>

            <input
                id="searchInput"
                type="search"
                placeholder="Search CHAPCY TV..."
                autocomplete="off"
            >

        </div>


        <div
            id="searchResults"
            class="search-results"
        ></div>

    `;


    document.body.appendChild(
        panel
    );

}


/* =========================================================
   COMMENTS MODAL FALLBACK
========================================================= */

function createCommentsModal(){

    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "comments-modal active";


    modal.id =
        "commentsModal";


    modal.innerHTML = `

        <div class="comments-container">

            <div class="comments-header">

                <strong>
                    Comments
                </strong>

                <button
                    id="closeCommentsBtn"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>

            </div>


            <div
                id="commentsList"
                class="comments-list"
            ></div>


            <div class="comment-input-area">

                <input
                    id="commentInput"
                    type="text"
                    placeholder="Write a comment..."
                >

                <button
                    id="commentSendBtn"
                >
                    <i class="fa-solid fa-paper-plane"></i>
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    modal
        .querySelector(
            "#closeCommentsBtn"
        )
        .addEventListener(
            "click",
            closeComments
        );

}


/* =========================================================
   CLOSE COMMENTS
========================================================= */

function closeComments(){

    commentsModal?.classList.remove(
        "active"
    );

    selectedCommentVideo =
        null;

}


/* =========================================================
   EMPTY FEED
========================================================= */

function showEmptyFeed(
    message
){

    if(!feed)
        return;


    feed.innerHTML = `

        <div
            style="
                height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                flex-direction:column;
                text-align:center;
                padding:30px;
                color:#aaa;
            "
        >

            <div
                style="
                    font-size:60px;
                    margin-bottom:20px;
                "
            >
                📺
            </div>

            <h2
                style="
                    color:#fff;
                    margin-bottom:8px;
                "
            >
                CHAPCY TV
            </h2>

            <p>
                ${escapeHTML(message)}
            </p>

            <button
                onclick="document.querySelector('.upload-floating-btn')?.click()"
                style="
                    margin-top:20px;
                    border:0;
                    border-radius:25px;
                    padding:12px 22px;
                    background:#00ffff;
                    color:#000;
                    font-weight:800;
                "
            >
                + Upload First Video
            </button>

        </div>

    `;

}


/* =========================================================
   LOADING
========================================================= */

function showLoading(
    show
){

    if(!loadingScreen)
        return;


    loadingScreen.style.display =
        show
        ? "flex"
        : "none";

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message
){

    let toast =
        document.getElementById(
            "chapcyToast"
        );


    if(!toast){

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "chapcyToast";


        toast.style.cssText = `

            position:fixed;
            left:50%;
            bottom:90px;
            transform:translateX(-50%) translateY(20px);
            z-index:9000;
            background:rgba(20,20,20,.92);
            color:#fff;
            border:1px solid rgba(0,255,255,.3);
            padding:11px 17px;
            border-radius:25px;
            font-size:13px;
            opacity:0;
            pointer-events:none;
            transition:.3s;
            backdrop-filter:blur(10px);
            white-space:nowrap;

        `;


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.style.opacity =
        "1";

    toast.style.transform =
        "translateX(-50%) translateY(0)";


    setTimeout(
        () => {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateX(-50%) translateY(20px)";

        },
        2500
    );

}


/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(
    number
){

    number =
        Number(number) || 0;


    if(number >= 1000000){

        return (
            number / 1000000
        ).toFixed(1) + "M";

    }


    if(number >= 1000){

        return (
            number / 1000
        ).toFixed(1) + "K";

    }


    return String(
        number
    );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    timestamp
){

    if(
        !timestamp
    ){

        return "Just now";

    }


    try{

        const date =
            timestamp.toDate
                ? timestamp.toDate()
                : new Date(timestamp);


        const diff =
            Date.now() -
            date.getTime();


        const minutes =
            Math.floor(
                diff /
                60000
            );


        if(minutes < 1)
            return "Just now";


        if(minutes < 60)
            return `${minutes}m ago`;


        const hours =
            Math.floor(
                minutes / 60
            );


        if(hours < 24)
            return `${hours}h ago`;


        const days =
            Math.floor(
                hours / 24
            );


        if(days < 7)
            return `${days}d ago`;


        return date.toLocaleDateString();

    }catch(error){

        return "Recently";

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
){

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* =========================================================
   SETUP ALL EVENTS
========================================================= */

function setupEvents(){


    /* -------------------------
       UPLOAD
    ------------------------- */

    document.addEventListener(
        "click",
        event => {

            const upload =
                event.target.closest(
                    ".upload-floating-btn"
                );


            if(upload){

                event.preventDefault();

                openUpload();

            }

        }
    );


    /* -------------------------
       SEARCH
    ------------------------- */

    document.addEventListener(
        "click",
        event => {

            const search =
                event.target.closest(
                    "#searchBtn, [data-action='search']"
                );


            if(search){

                event.preventDefault();

                openSearch();

            }

        }
    );


    /* -------------------------
       CLOSE SEARCH
    ------------------------- */

    document.addEventListener(
        "click",
        event => {

            const close =
                event.target.closest(
                    "#closeSearchBtn, [data-action='close-search']"
                );


            if(close){

                closeSearch();

            }

        }
    );


    /* -------------------------
       SEARCH INPUT
    ------------------------- */

    document.addEventListener(
        "input",
        event => {

            if(
                event.target.matches(
                    "#searchInput, .search-box input"
                )
            ){

                searchVideos();

            }

        }
    );


    /* -------------------------
       COMMENT SEND
    ------------------------- */

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "#commentSendBtn"
                );


            if(button){

                sendComment();

            }

        }
    );


    /* -------------------------
       COMMENT ENTER
    ------------------------- */

    document.addEventListener(
        "keydown",
        event => {

            if(
                event.target.matches(
                    "#commentInput, .comment-input-area input"
                ) &&
                event.key ===
                "Enter"
            ){

                event.preventDefault();

                sendComment();

            }

        }
    );


    /* -------------------------
       CLOSE COMMENTS
    ------------------------- */

    document.addEventListener(
        "click",
        event => {

            const close =
                event.target.closest(
                    "#closeCommentsBtn, [data-action='close-comments']"
                );


            if(close){

                closeComments();

            }

        }
    );


    /* -------------------------
       BACK BUTTON
    ------------------------- */

    document.addEventListener(
        "click",
        event => {

            const back =
                event.target.closest(
                    "#backBtn, [data-action='back']"
                );


            if(back){

                window.history.back();

            }

        }
    );


    /* -------------------------
       ESC KEY
    ------------------------- */

    document.addEventListener(
        "keydown",
        event => {

            if(
                event.key ===
                "Escape"
            ){

                closeSearch();

                closeComments();

                closeUpload();

            }

        }
    );

}


/* =========================================================
   INITIAL LIKE CHECK AFTER FEED
========================================================= */

const originalRenderVideos =
    renderVideos;


/* =========================================================
   EXPOSE OPTIONAL GLOBAL FUNCTIONS
========================================================= */

window.openChapcyUpload =
    openUpload;

window.closeChapcyUpload =
    closeUpload;

window.closeChapcyComments =
    closeComments;

window.chapcyTV =
    {

        loadVideos,

        upload:
            openUpload,

        search:
            openSearch

    };


console.log(
    "🔥 CHAPCY TV Firebase JS loaded successfully."
);
