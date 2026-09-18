/* =========================================================
   CHAPCY AD HUB
   ONE CONTAINER • REAL FIREBASE CONTENT ONLY
   DROP + TV + REWARDS
========================================================= */

import { db, auth } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    initializeApp,
    getApps
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore,
    collection,
    query,
    orderBy,
    limit,
    onSnapshot,
    doc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   ELEMENTS
========================================================= */

const hub = document.getElementById("chapcyAdHub");
const content = document.getElementById("adHubContent");
const prevBtn = document.getElementById("adHubPrev");
const nextBtn = document.getElementById("adHubNext");
const dots = document.getElementById("adHubDots");
const openBtn = document.getElementById("adHubOpenBtn");

if (!hub || !content) {
    console.warn("CHAPCY Ad Hub: container haijapatikana.");
}


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyDIID2LpzjLiqaLeJKgp-Vd7tNIyN-M1k",
    authDomain: "rko-website-design-2f792.firebaseapp.com",
    databaseURL: "https://rko-website-design-2f792-default-rtdb.firebaseio.com",
    projectId: "rko-website-design-2f792",
    storageBucket: "rko-website-design-2f792.firebasestorage.app",
    messagingSenderId: "782567629866",
    appId: "1:782567629866:web:d6d80d454d0653ea8b4f53",
    measurementId: "G-KQ1EKYE7E7"
};


/* =========================================================
   FIRESTORE APP FOR CHAPCY TV + REWARDS
========================================================= */

let hubApp = getApps().find(
    app => app.name === "CHAPCY_AD_HUB"
);

if (!hubApp) {
    hubApp = initializeApp(
        firebaseConfig,
        "CHAPCY_AD_HUB"
    );
}

const firestore = getFirestore(hubApp);


/* =========================================================
   STATE
========================================================= */

const state = {
    drop: [],
    tv: [],
    rewards: [],

    items: [],

    currentIndex: 0,

    timer: null,

    rewardUnsubscribe: null,

    started: false
};


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function safeNumber(value) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : null;
}


function timestampToNumber(value) {

    if (!value) return 0;

    if (typeof value === "number") {
        return value;
    }

    if (value?.seconds) {
        return value.seconds * 1000;
    }

    if (value?.toMillis) {
        return value.toMillis();
    }

    if (value instanceof Date) {
        return value.getTime();
    }

    const parsed = new Date(value).getTime();

    return Number.isFinite(parsed)
        ? parsed
        : 0;
}


function formatNumber(value) {

    const number = safeNumber(value);

    if (number === null) {
        return "";
    }

    return number.toLocaleString();
}


function formatPrice(value) {

    const number = safeNumber(value);

    if (number === null) {
        return "";
    }

    return `TSh ${number.toLocaleString()}`;
}


function getImage(item) {

    return (
        item?.image ||
        item?.imageUrl ||
        item?.photoURL ||
        item?.thumbnail ||
        ""
    );
}


function stopVideos() {

    document
        .querySelectorAll(".ad-hub-video")
        .forEach(video => {

            try {
                video.pause();
                video.currentTime = 0;
            } catch (error) {
                // Ignore video cleanup errors
            }

        });
}


function startAutoplay() {

    stopAutoplay();

    if (state.items.length <= 1) {
        return;
    }

    state.timer = setInterval(() => {

        nextSlide();

    }, 6000);
}


function stopAutoplay() {

    if (state.timer) {

        clearInterval(state.timer);

        state.timer = null;
    }
}


/* =========================================================
   BUILD COMBINED FEED
========================================================= */

function rebuildFeed() {

    const combined = [
        ...state.drop,
        ...state.tv,
        ...state.rewards
    ];

    combined.sort(
        (a, b) =>
            timestampToNumber(b.createdAt) -
            timestampToNumber(a.createdAt)
    );

    state.items = combined;

    if (
        state.currentIndex >= state.items.length
    ) {
        state.currentIndex = 0;
    }

    render();

    startAutoplay();
}


/* =========================================================
   DROP — REAL PRODUCTS
========================================================= */

function listenToDrop() {

    const productsRef = ref(
        db,
        "products"
    );

    onValue(
        productsRef,
        snapshot => {

            const products = [];

            snapshot.forEach(child => {

                const product = child.val();

                if (!product) {
                    return;
                }

                /*
                    Product ikiwa active=false
                    haitakiwi kuonekana.
                */

                if (product.active === false) {
                    return;
                }

                /*
                    Bila jina au product information
                    hatuitengenezi card fake.
                */

                if (
                    !product.name &&
                    !product.image &&
                    !product.imageUrl
                ) {
                    return;
                }

                products.push({

                    id: child.key,

                    type: "drop",

                    title:
                        product.name ||
                        "",

                    description:
                        product.description ||
                        "",

                    image:
                        product.image ||
                        product.imageUrl ||
                        "",

                    price:
                        product.price,

                    oldPrice:
                        product.oldPrice,

                    sellerName:
                        product.sellerName ||
                        "",

                    sellerId:
                        product.sellerId ||
                        "",

                    category:
                        product.category ||
                        "",

                    stock:
                        product.stock,

                    createdAt:
                        product.createdAt ||
                        0,

                    href:
                        "Chapcydrop.html"
                });

            });

            products.sort(
                (a, b) =>
                    timestampToNumber(b.createdAt) -
                    timestampToNumber(a.createdAt)
            );

            /*
                Tunachukua bidhaa chache tu
                kwa sababu ni advertisement hub.
            */

            state.drop = products.slice(0, 8);

            rebuildFeed();

        },
        error => {

            console.error(
                "CHAPCY DROP listener error:",
                error
            );

        }
    );
}


/* =========================================================
   TV — REAL FIRESTORE VIDEOS
========================================================= */

function listenToTV() {

    const videosCollection = collection(
        firestore,
        "chapcyVideos"
    );

    const videosQuery = query(
        videosCollection,
        orderBy("createdAt", "desc"),
        limit(8)
    );

    onSnapshot(
        videosQuery,
        snapshot => {

            const videos = [];

            snapshot.forEach(videoDoc => {

                const video = videoDoc.data();

                if (!video) {
                    return;
                }

                if (!video.videoURL) {
                    return;
                }

                videos.push({

                    id:
                        videoDoc.id,

                    type:
                        "tv",

                    title:
                        video.caption ||
                        "",

                    description:
                        video.caption ||
                        "",

                    video:
                        video.videoURL,

                    creator:
                        video.username ||
                        "",

                    creatorPhoto:
                        video.photoURL ||
                        "",

                    views:
                        video.views,

                    likes:
                        video.likes,

                    comments:
                        video.comments,

                    shares:
                        video.shares,

                    createdAt:
                        video.createdAt ||
                        0,

                    href:
                        "Chapcytv.html"

                });

            });

            state.tv = videos;

            rebuildFeed();

        },
        error => {

            console.warn(
                "TV ordered query failed. Trying fallback...",
                error
            );

            listenToTVFallback();

        }
    );
}


/* =========================================================
   TV FALLBACK
========================================================= */

function listenToTVFallback() {

    const videosCollection = collection(
        firestore,
        "chapcyVideos"
    );

    const fallbackQuery = query(
        videosCollection,
        limit(8)
    );

    onSnapshot(
        fallbackQuery,
        snapshot => {

            const videos = [];

            snapshot.forEach(videoDoc => {

                const video = videoDoc.data();

                if (!video) {
                    return;
                }

                if (!video.videoURL) {
                    return;
                }

                videos.push({

                    id:
                        videoDoc.id,

                    type:
                        "tv",

                    title:
                        video.caption ||
                        "",

                    description:
                        video.caption ||
                        "",

                    video:
                        video.videoURL,

                    creator:
                        video.username ||
                        "",

                    creatorPhoto:
                        video.photoURL ||
                        "",

                    views:
                        video.views,

                    likes:
                        video.likes,

                    comments:
                        video.comments,

                    shares:
                        video.shares,

                    createdAt:
                        video.createdAt ||
                        0,

                    href:
                        "Chapcytv.html"

                });

            });

            videos.sort(
                (a, b) =>
                    timestampToNumber(b.createdAt) -
                    timestampToNumber(a.createdAt)
            );

            state.tv = videos;

            rebuildFeed();

        },
        error => {

            console.error(
                "CHAPCY TV fallback error:",
                error
            );

            state.tv = [];

            rebuildFeed();

        }
    );
}


/* =========================================================
   REWARDS — REAL USER DATA ONLY
========================================================= */

function listenToRewards() {

    if (state.rewardUnsubscribe) {

        state.rewardUnsubscribe();

        state.rewardUnsubscribe = null;
    }

    onAuthStateChanged(
        auth,
        user => {

            if (!user) {

                state.rewards = [];

                rebuildFeed();

                return;
            }

            const userRef = doc(
                firestore,
                "users",
                user.uid
            );

            state.rewardUnsubscribe =
                onSnapshot(
                    userRef,
                    snapshot => {

                        if (!snapshot.exists()) {

                            state.rewards = [];

                            rebuildFeed();

                            return;
                        }

                        const data =
                            snapshot.data() || {};

                        /*
                            Hatuonyeshi reward card
                            kama hakuna reward data halisi.
                        */

                        const hasRewardData =
                            data.points !== undefined ||
                            data.earnedPoints !== undefined ||
                            data.xp !== undefined ||
                            data.level !== undefined ||
                            data.streak !== undefined;

                        if (!hasRewardData) {

                            state.rewards = [];

                            rebuildFeed();

                            return;
                        }

                        state.rewards = [{

                            id:
                                `reward-${user.uid}`,

                            type:
                                "rewards",

                            title:
                                "CHAPCY Rewards",

                            description:
                                "",

                            points:
                                data.points,

                            earnedPoints:
                                data.earnedPoints,

                            xp:
                                data.xp,

                            level:
                                data.level,

                            streak:
                                data.streak,

                            createdAt:
                                data.updatedAt ||
                                0,

                            href:
                                "Reward.html"

                        }];

                        rebuildFeed();

                    },
                    error => {

                        console.error(
                            "Rewards listener error:",
                            error
                        );

                        state.rewards = [];

                        rebuildFeed();

                    }
                );

        }
    );
}


/* =========================================================
   RENDER
========================================================= */

function render() {

    if (!content) {
        return;
    }

    stopVideos();

    content.innerHTML = "";

    if (!state.items.length) {

        renderEmpty();

        if (dots) {
            dots.innerHTML = "";
        }

        if (openBtn) {
            openBtn.hidden = true;
        }

        return;
    }

    state.items.forEach(
        (item, index) => {

            const slide =
                createSlide(
                    item,
                    index
                );

            content.appendChild(slide);

        }
    );

    renderDots();

    updateSlidePosition();

    updateOpenButton();
}


/* =========================================================
   CREATE SLIDE
========================================================= */

function createSlide(item, index) {

    const slide =
        document.createElement("article");

    slide.className =
        "ad-hub-slide";

    if (
        index === state.currentIndex
    ) {

        slide.classList.add("active");
    }

    const type =
        item.type;

    const typeLabel =
        type === "drop"
            ? "CHAPCY DROP"
            : type === "tv"
                ? "CHAPCY TV"
                : "CHAPCY REWARDS";

    const typeClass =
        type === "drop"
            ? "drop"
            : type === "tv"
                ? "tv"
                : "rewards";


    /* =====================================================
       MEDIA
    ===================================================== */

    let mediaHTML = "";


    if (
        type === "tv" &&
        item.video
    ) {

        mediaHTML = `
            <div class="ad-hub-media">
                <video
                    class="ad-hub-video"
                    src="${escapeHTML(item.video)}"
                    muted
                    playsinline
                    preload="metadata"
                ></video>

                <div class="ad-hub-live">
                    <span class="ad-hub-live-dot"></span>
                    CHAPCY TV
                </div>
            </div>
        `;

    } else if (
        type === "drop" &&
        getImage(item)
    ) {

        mediaHTML = `
            <div class="ad-hub-media">
                <img
                    src="${escapeHTML(getImage(item))}"
                    alt="${escapeHTML(item.title)}"
                    loading="lazy"
                />
            </div>
        `;

    } else if (
        type === "rewards"
    ) {

        mediaHTML = `
            <div class="ad-hub-media">
                <div class="ad-hub-reward-visual">
                    <div class="ad-hub-reward-icon">
                        <i class="fa-solid fa-trophy"></i>
                    </div>
                </div>
            </div>
        `;

    } else {

        mediaHTML = `
            <div class="ad-hub-media">
                <div class="ad-hub-media-empty">
                    <i class="fa-solid fa-layer-group"></i>
                </div>
            </div>
        `;
    }


    /* =====================================================
       INFO
    ===================================================== */

    let infoHTML = "";


    /* ---------------- DROP ---------------- */

    if (type === "drop") {

        const meta = [];

        if (item.sellerName) {

            meta.push(`
                <span class="ad-hub-meta-item">
                    <i class="fa-solid fa-store"></i>
                    ${escapeHTML(item.sellerName)}
                </span>
            `);
        }

        if (item.category) {

            meta.push(`
                <span class="ad-hub-meta-item">
                    <i class="fa-solid fa-tag"></i>
                    ${escapeHTML(item.category)}
                </span>
            `);
        }

        if (
            item.stock !== undefined &&
            item.stock !== null
        ) {

            meta.push(`
                <span class="ad-hub-meta-item">
                    <i class="fa-solid fa-box"></i>
                    ${escapeHTML(item.stock)}
                </span>
            `);
        }

        const priceHTML =
            item.price !== undefined &&
            item.price !== null
                ? `
                    <div class="ad-hub-price">
                        ${formatPrice(item.price)}
                    </div>
                `
                : "";

        infoHTML = `
            <div class="ad-hub-info">

                <div class="ad-hub-eyebrow">
                    <span class="ad-hub-type ${typeClass}">
                        ${typeLabel}
                    </span>
                </div>

                <h2 class="ad-hub-title">
                    ${escapeHTML(item.title)}
                </h2>

                ${
                    item.description
                        ? `
                            <p class="ad-hub-description">
                                ${escapeHTML(item.description)}
                            </p>
                        `
                        : ""
                }

                ${
                    meta.length
                        ? `
                            <div class="ad-hub-meta">
                                ${meta.join("")}
                            </div>
                        `
                        : ""
                }

                ${priceHTML}

            </div>
        `;
    }


    /* ---------------- TV ---------------- */

    else if (type === "tv") {

        const meta = [];

        if (
            item.views !== undefined &&
            item.views !== null
        ) {

            meta.push(`
                <span class="ad-hub-meta-item">
                    <i class="fa-solid fa-eye"></i>
                    ${formatNumber(item.views)}
                </span>
            `);
        }

        if (
            item.likes !== undefined &&
            item.likes !== null
        ) {

            meta.push(`
                <span class="ad-hub-meta-item">
                    <i class="fa-solid fa-heart"></i>
                    ${formatNumber(item.likes)}
                </span>
            `);
        }

        if (
            item.comments !== undefined &&
            item.comments !== null
        ) {

            meta.push(`
                <span class="ad-hub-meta-item">
                    <i class="fa-solid fa-comment"></i>
                    ${formatNumber(item.comments)}
                </span>
            `);
        }


        let creatorHTML = "";

        if (
            item.creator ||
            item.creatorPhoto
        ) {

            creatorHTML = `
                <div class="ad-hub-user">

                    ${
                        item.creatorPhoto
                            ? `
                                <img
                                    class="ad-hub-user-image"
                                    src="${escapeHTML(item.creatorPhoto)}"
                                    alt=""
                                />
                            `
                            : `
                                <div class="ad-hub-user-image">
                                    <i class="fa-solid fa-user"></i>
                                </div>
                            `
                    }

                    ${
                        item.creator
                            ? `
                                <span class="ad-hub-user-name">
                                    ${escapeHTML(item.creator)}
                                </span>
                            `
                            : ""
                    }

                </div>
            `;
        }


        infoHTML = `
            <div class="ad-hub-info">

                <div class="ad-hub-eyebrow">
                    <span class="ad-hub-type ${typeClass}">
                        ${typeLabel}
                    </span>
                </div>

                ${
                    item.title
                        ? `
                            <h2 class="ad-hub-title">
                                ${escapeHTML(item.title)}
                            </h2>
                        `
                        : ""
                }

                ${
                    item.description &&
                    item.description !== item.title
                        ? `
                            <p class="ad-hub-description">
                                ${escapeHTML(item.description)}
                            </p>
                        `
                        : ""
                }

                ${creatorHTML}

                ${
                    meta.length
                        ? `
                            <div class="ad-hub-meta">
                                ${meta.join("")}
                            </div>
                        `
                        : ""
                }

            </div>
        `;
    }


    /* ---------------- REWARDS ---------------- */

    else {

        const rewardMeta = [];

        if (
            item.points !== undefined &&
            item.points !== null
        ) {

            rewardMeta.push(`
                <span class="ad-hub-meta-item">
                    <i class="fa-solid fa-star"></i>
                    ${formatNumber(item.points)} points
                </span>
            `);
        }

        if (
            item.xp !== undefined &&
            item.xp !== null
        ) {

            rewardMeta.push(`
                <span class="ad-hub-meta-item">
                    <i class="fa-solid fa-bolt"></i>
                    ${formatNumber(item.xp)} XP
                </span>
            `);
        }

        if (
            item.level !== undefined &&
            item.level !== null
        ) {

            rewardMeta.push(`
                <span class="ad-hub-meta-item">
                    <i class="fa-solid fa-medal"></i>
                    ${escapeHTML(item.level)}
                </span>
            `);
        }

        if (
            item.streak !== undefined &&
            item.streak !== null
        ) {

            rewardMeta.push(`
                <span class="ad-hub-meta-item">
                    <i class="fa-solid fa-fire"></i>
                    ${formatNumber(item.streak)}
                </span>
            `);
        }


        infoHTML = `
            <div class="ad-hub-info">

                <div class="ad-hub-eyebrow">
                    <span class="ad-hub-type ${typeClass}">
                        ${typeLabel}
                    </span>
                </div>

                <h2 class="ad-hub-title">
                    ${escapeHTML(item.title)}
                </h2>

                <p class="ad-hub-description">
                    Your CHAPCY rewards
                </p>

                ${
                    rewardMeta.length
                        ? `
                            <div class="ad-hub-meta">
                                ${rewardMeta.join("")}
                            </div>
                        `
                        : ""
                }

            </div>
        `;
    }


    slide.innerHTML = `
        ${mediaHTML}
        ${infoHTML}
    `;


    return slide;
}


/* =========================================================
   EMPTY STATE
========================================================= */

function renderEmpty() {

    content.innerHTML = `
        <div class="ad-hub-empty">

            <div class="ad-hub-empty-icon">
                <i class="fa-solid fa-layer-group"></i>
            </div>

            <h3>
                No content available right now
            </h3>

            <p>
                New CHAPCY content will appear here.
            </p>

        </div>
    `;
}


/* =========================================================
   DOTS
========================================================= */

function renderDots() {

    if (!dots) {
        return;
    }

    dots.innerHTML = "";

    if (state.items.length <= 1) {
        return;
    }

    state.items.forEach(
        (_, index) => {

            const dot =
                document.createElement("button");

            dot.type = "button";

            dot.className =
                "ad-hub-dot";

            if (
                index === state.currentIndex
            ) {

                dot.classList.add("active");
            }

            dot.setAttribute(
                "aria-label",
                `Advertisement ${index + 1}`
            );

            dot.addEventListener(
                "click",
                () => {

                    goToSlide(index);

                }
            );

            dots.appendChild(dot);

        }
    );
}


/* =========================================================
   SLIDE POSITION
========================================================= */

function updateSlidePosition() {

    const slides =
        document.querySelectorAll(
            ".ad-hub-slide"
        );

    slides.forEach(
        (slide, index) => {

            slide.classList.toggle(
                "active",
                index === state.currentIndex
            );

        }
    );


    const dotElements =
        document.querySelectorAll(
            ".ad-hub-dot"
        );

    dotElements.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index === state.currentIndex
            );

        }
    );


    stopVideos();


    const activeSlide =
        slides[state.currentIndex];

    if (!activeSlide) {
        return;
    }


    const video =
        activeSlide.querySelector(
            ".ad-hub-video"
        );

    if (video) {

        video.play().catch(
            () => {
                // Browser may block autoplay.
            }
        );
    }
}


/* =========================================================
   OPEN BUTTON
========================================================= */

function updateOpenButton() {

    if (!openBtn) {
        return;
    }

    const item =
        state.items[state.currentIndex];

    if (
        !item ||
        !item.href
    ) {

        openBtn.hidden = true;

        return;
    }

    openBtn.hidden = false;

    openBtn.onclick = () => {

        window.location.href =
            item.href;

    };
}


/* =========================================================
   NAVIGATION
========================================================= */

function goToSlide(index) {

    if (!state.items.length) {
        return;
    }

    if (index < 0) {

        index =
            state.items.length - 1;
    }

    if (
        index >= state.items.length
    ) {

        index = 0;
    }

    state.currentIndex = index;

    updateSlidePosition();

    renderDots();

    updateOpenButton();

    startAutoplay();
}


function nextSlide() {

    if (state.items.length <= 1) {
        return;
    }

    goToSlide(
        state.currentIndex + 1
    );
}


function previousSlide() {

    if (state.items.length <= 1) {
        return;
    }

    goToSlide(
        state.currentIndex - 1
    );
}


/* =========================================================
   BUTTON EVENTS
========================================================= */

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        nextSlide
    );
}


if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        previousSlide
    );
}


/* =========================================================
   MOUSE / TOUCH PAUSE
========================================================= */

if (hub) {

    hub.addEventListener(
        "mouseenter",
        stopAutoplay
    );

    hub.addEventListener(
        "mouseleave",
        startAutoplay
    );

    hub.addEventListener(
        "touchstart",
        stopAutoplay,
        {
            passive: true
        }
    );

    hub.addEventListener(
        "touchend",
        () => {

            setTimeout(
                startAutoplay,
                1200
            );

        },
        {
            passive: true
        }
    );
}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (!hub) {
            return;
        }

        const rect =
            hub.getBoundingClientRect();

        const visible =
            rect.top <
                window.innerHeight &&
            rect.bottom > 0;

        if (!visible) {
            return;
        }

        if (event.key === "ArrowRight") {
            nextSlide();
        }

        if (event.key === "ArrowLeft") {
            previousSlide();
        }

    }
);


/* =========================================================
   START
========================================================= */

function startHub() {

    if (state.started) {
        return;
    }

    state.started = true;

    listenToDrop();

    listenToTV();

    listenToRewards();
}


startHub();


/* =========================================================
   CLEANUP
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        stopAutoplay();

        stopVideos();

        if (state.rewardUnsubscribe) {

            state.rewardUnsubscribe();
        }

    }
);
