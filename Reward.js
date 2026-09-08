/* =========================================================
   CHAPCY REWARDS — Rewards.js
   Firebase-ready Rewards System
   ========================================================= */

"use strict";

/* =========================================================
   FIREBASE
   Rewards.html tayari imeweka:

   window.CHAPCY_FIREBASE = {
       app,
       auth,
       db
   }

   ========================================================= */

let auth = null;
let db = null;
let currentUser = null;
let currentUserData = null;


/* =========================================================
   FIRESTORE IMPORTS
   ========================================================= */

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    addDoc,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   WAIT FOR FIREBASE
   ========================================================= */

function initRewardsFirebase() {

    if (!window.CHAPCY_FIREBASE) {
        console.warn("CHAPCY Firebase has not been initialized yet.");
        return false;
    }

    auth = window.CHAPCY_FIREBASE.auth;
    db = window.CHAPCY_FIREBASE.db;

    return true;
}


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initRewardsFirebase();

    setupButtons();

    window.addEventListener(
        "chapcyUserReady",
        async (event) => {

            const user = event.detail;

            if (!user) return;

            currentUser = user;

            await loadRewards();
        }
    );

    window.addEventListener(
        "chapcyUserSignedOut",
        () => {

            currentUser = null;
            currentUserData = null;

            resetRewardsUI();

            showToast("Please login to view your rewards.");
        }
    );

    /*
       Sometimes Rewards.js loads after the auth event.
       Check the existing Firebase user as well.
    */

    setTimeout(async () => {

        if (!auth) return;

        if (auth.currentUser) {

            currentUser = auth.currentUser;

            await loadRewards();
        }

    }, 500);

});


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

function setupButtons() {

    /*
       Close modal when clicking outside
    */

    document.addEventListener("click", (event) => {

        if (
            event.target.classList &&
            event.target.classList.contains("modal")
        ) {
            closeModal(event.target.id);
        }

    });


    /*
       ESC closes modal
    */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            document
                .querySelectorAll(".modal.active")
                .forEach(modal => {

                    modal.classList.remove("active");

                });

        }

    });

}


/* =========================================================
   LOAD USER REWARDS
   ========================================================= */

async function loadRewards() {

    if (!db || !currentUser) {
        return;
    }

    try {

        const userRef = doc(
            db,
            "users",
            currentUser.uid
        );

        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {

            console.warn(
                "User document does not exist."
            );

            return;
        }

        currentUserData = snapshot.data();

        renderRewards(currentUserData);

        await loadDailyChallenges();

    } catch (error) {

        console.error(
            "Rewards loading error:",
            error
        );

        showToast(
            "Failed to load rewards."
        );

    }

}


/* =========================================================
   RENDER REWARDS
   ========================================================= */

function renderRewards(data) {

    const points =
        Number(data.points || 0);

    const earned =
        Number(data.earnedPoints || 0);

    const spent =
        Number(data.spentPoints || 0);

    const pending =
        Number(data.pendingPoints || 0);

    const xp =
        Number(data.xp || 0);

    const streak =
        Number(data.streak || 0);

    const levelData =
        calculateLevel(xp);


    /* -----------------------------
       AVAILABLE POINTS
    ----------------------------- */

    setText(
        "availablePoints",
        formatNumber(points)
    );


    /* -----------------------------
       EARNED
    ----------------------------- */

    setText(
        "earnedPoints",
        formatNumber(earned)
    );


    /* -----------------------------
       SPENT
    ----------------------------- */

    setText(
        "spentPoints",
        formatNumber(spent)
    );


    /* -----------------------------
       PENDING
    ----------------------------- */

    setText(
        "pendingPoints",
        formatNumber(pending)
    );


    /* -----------------------------
       LEVEL
    ----------------------------- */

    setText(
        "userLevel",
        levelData.name
    );


    /* -----------------------------
       XP
    ----------------------------- */

    setText(
        "userXP",
        formatNumber(xp)
    );


    /* -----------------------------
       XP PROGRESS
    ----------------------------- */

    const progress =
        calculateXPProgress(xp);

    const progressBar =
        document.querySelector(
            ".xp-progress-fill"
        );

    if (progressBar) {

        progressBar.style.width =
            `${progress.percent}%`;

    }


    const xpText =
        document.querySelector(
            ".xp-progress-text"
        );

    if (xpText) {

        xpText.textContent =
            `${formatNumber(progress.current)} / ${formatNumber(progress.required)} XP`;

    }


    /* -----------------------------
       STREAK
    ----------------------------- */

    setText(
        "streakCount",
        streak
    );


    /*
       Referral code
    */

    const referralCode =
        data.referralCode ||
        generateReferralCode(currentUser.uid);

    setText(
        "referralCode",
        referralCode
    );

}


/* =========================================================
   LEVEL SYSTEM
   ========================================================= */

function calculateLevel(xp) {

    xp = Number(xp || 0);

    if (xp >= 100000) {

        return {
            name: "CHAPCY Elite",
            min: 100000,
            max: Infinity
        };

    }

    if (xp >= 50000) {

        return {
            name: "Diamond",
            min: 50000,
            max: 100000
        };

    }

    if (xp >= 20000) {

        return {
            name: "Gold",
            min: 20000,
            max: 50000
        };

    }

    if (xp >= 5000) {

        return {
            name: "Silver",
            min: 5000,
            max: 20000
        };

    }

    return {
        name: "Bronze",
        min: 0,
        max: 5000
    };

}


/* =========================================================
   XP PROGRESS
   ========================================================= */

function calculateXPProgress(xp) {

    const level =
        calculateLevel(xp);

    if (level.max === Infinity) {

        return {
            current: xp - level.min,
            required: 0,
            percent: 100
        };

    }

    const current =
        xp - level.min;

    const required =
        level.max - level.min;

    const percent =
        Math.min(
            100,
            Math.max(
                0,
                (current / required) * 100
            )
        );

    return {
        current,
        required,
        percent
    };

}


/* =========================================================
   DAILY LOGIN
   ========================================================= */

async function claimDailyLogin() {

    if (!requireLogin()) return;

    try {

        const today =
            getDateKey();

        const userRef =
            doc(
                db,
                "users",
                currentUser.uid
            );

        await runTransaction(
            db,
            async (transaction) => {

                const snap =
                    await transaction.get(
                        userRef
                    );

                if (!snap.exists()) {
                    throw new Error(
                        "User account not found."
                    );
                }

                const data =
                    snap.data();

                if (
                    data.lastLoginDate === today
                ) {

                    throw new Error(
                        "Daily login already claimed."
                    );

                }

                const oldPoints =
                    Number(data.points || 0);

                const oldEarned =
                    Number(data.earnedPoints || 0);

                const oldXP =
                    Number(data.xp || 0);

                const oldStreak =
                    Number(data.streak || 0);

                const newStreak =
                    oldStreak + 1;

                const pointReward = 20;

                const xpReward = 20;

                transaction.update(
                    userRef,
                    {

                        points:
                            oldPoints +
                            pointReward,

                        earnedPoints:
                            oldEarned +
                            pointReward,

                        xp:
                            oldXP +
                            xpReward,

                        streak:
                            newStreak,

                        lastLoginDate:
                            today,

                        updatedAt:
                            serverTimestamp()

                    }
                );

                const transactionRef =
                    doc(
                        collection(
                            db,
                            "pointTransactions"
                        )
                    );

                transaction.set(
                    transactionRef,
                    {

                        userId:
                            currentUser.uid,

                        type:
                            "earn",

                        amount:
                            pointReward,

                        source:
                            "daily_login",

                        status:
                            "completed",

                        description:
                            "Daily login reward",

                        createdAt:
                            serverTimestamp()

                    }
                );

            }
        );

        showToast(
            "🎉 +20 points! Daily login claimed."
        );

        await loadRewards();

    } catch (error) {

        console.error(error);

        showToast(
            error.message ||
            "Unable to claim daily login."
        );

    }

}


/* =========================================================
   EARN POINTS
   ========================================================= */

const EARN_REWARDS = {

    watchTV: {
        points: 5,
        xp: 5,
        source: "watch_tv"
    },

    comment: {
        points: 3,
        xp: 3,
        source: "comment"
    },

    reaction: {
        points: 1,
        xp: 1,
        source: "reaction"
    },

    profile: {
        points: 50,
        xp: 50,
        source: "complete_profile"
    },

    joinGroup: {
        points: 10,
        xp: 10,
        source: "join_group"
    },

    inviteFriend: {
        points: 200,
        xp: 200,
        source: "invite_friend"
    }

};


/* =========================================================
   AWARD POINTS
   ========================================================= */

async function earnPoints(action) {

    if (!requireLogin()) return;

    const reward =
        EARN_REWARDS[action];

    if (!reward) {

        console.error(
            "Unknown reward action:",
            action
        );

        return;
    }


    /*
       Check daily limits
    */

    const allowed =
        await checkDailyLimit(
            reward.source
        );

    if (!allowed) {

        showToast(
            "⚠️ Daily limit reached for this activity."
        );

        return;
    }


    try {

        const userRef =
            doc(
                db,
                "users",
                currentUser.uid
            );

        await runTransaction(
            db,
            async transaction => {

                const snap =
                    await transaction.get(
                        userRef
                    );

                if (!snap.exists()) {

                    throw new Error(
                        "User account not found."
                    );

                }

                const data =
                    snap.data();

                const newPoints =
                    Number(data.points || 0) +
                    reward.points;

                const newEarned =
                    Number(data.earnedPoints || 0) +
                    reward.points;

                const newXP =
                    Number(data.xp || 0) +
                    reward.xp;

                transaction.update(
                    userRef,
                    {

                        points:
                            newPoints,

                        earnedPoints:
                            newEarned,

                        xp:
                            newXP,

                        updatedAt:
                            serverTimestamp()

                    }
                );

                const txRef =
                    doc(
                        collection(
                            db,
                            "pointTransactions"
                        )
                    );

                transaction.set(
                    txRef,
                    {

                        userId:
                            currentUser.uid,

                        type:
                            "earn",

                        amount:
                            reward.points,

                        xp:
                            reward.xp,

                        source:
                            reward.source,

                        status:
                            "completed",

                        createdAt:
                            serverTimestamp()

                    }
                );

            }
        );


        showToast(
            `🎉 +${reward.points} CHAPCY Points`
        );

        await loadRewards();

    } catch (error) {

        console.error(
            "Earn points error:",
            error
        );

        showToast(
            "Could not add points."
        );

    }

}


/* =========================================================
   DAILY LIMIT
   ========================================================= */

async function checkDailyLimit(source) {

    if (!currentUser) return false;

    const today =
        getDateKey();

    try {

        const q =
            query(
                collection(
                    db,
                    "pointTransactions"
                ),
                where(
                    "userId",
                    "==",
                    currentUser.uid
                ),
                where(
                    "source",
                    "==",
                    source
                ),
                where(
                    "dateKey",
                    "==",
                    today
                )
            );

        const snap =
            await getDocs(q);


        /*
           Default limits
        */

        const limits = {

            watch_tv: 10,

            comment: 10,

            reaction: 30,

            complete_profile: 1,

            join_group: 5,

            invite_friend: 10

        };

        const limit =
            limits[source] || 10;

        return snap.size < limit;

    } catch (error) {

        /*
           If dateKey has not yet been indexed,
           allow the activity for prototype mode.
        */

        console.warn(
            "Daily limit check failed:",
            error
        );

        return true;

    }

}


/* =========================================================
   DAILY CHALLENGES
   ========================================================= */

const CHALLENGES = [

    {
        id: "watch5",
        title: "Watch 5 CHAPCY TV videos",
        reward: 50,
        target: 5
    },

    {
        id: "joinGroup",
        title: "Join a CHAPCY group",
        reward: 30,
        target: 1
    },

    {
        id: "comment3",
        title: "Comment on 3 posts",
        reward: 40,
        target: 3
    }

];


async function loadDailyChallenges() {

    if (!db || !currentUser) return;

    const today =
        getDateKey();

    try {

        const challengeContainer =
            document.querySelector(
                ".challenge-list"
            );

        if (!challengeContainer) return;

        const q =
            query(
                collection(
                    db,
                    "userChallenges"
                ),
                where(
                    "userId",
                    "==",
                    currentUser.uid
                ),
                where(
                    "dateKey",
                    "==",
                    today
                )
            );

        const snap =
            await getDocs(q);

        const progressMap = {};

        snap.forEach(docSnap => {

            const data =
                docSnap.data();

            progressMap[
                data.challengeId
            ] = data;

        });


        challengeContainer
            .querySelectorAll(
                "[data-challenge]"
            )
            .forEach(card => {

                const id =
                    card.dataset.challenge;

                const progress =
                    progressMap[id];

                if (!progress) return;

                updateChallengeCard(
                    card,
                    progress
                );

            });

    } catch (error) {

        console.warn(
            "Challenge loading:",
            error
        );

    }

}


/* =========================================================
   UPDATE CHALLENGE UI
   ========================================================= */

function updateChallengeCard(
    card,
    progress
) {

    const value =
        Number(progress.progress || 0);

    const target =
        Number(progress.target || 1);

    const percent =
        Math.min(
            100,
            (value / target) * 100
        );

    const bar =
        card.querySelector(
            ".challenge-progress-fill"
        );

    if (bar) {

        bar.style.width =
            `${percent}%`;

    }

    const text =
        card.querySelector(
            ".challenge-progress-text"
        );

    if (text) {

        text.textContent =
            `${value}/${target}`;

    }

    if (progress.completed) {

        card.classList.add(
            "completed"
        );

    }

}


/* =========================================================
   REDEEM REWARDS
   ========================================================= */

const REWARDS = {

    airtime1000: {
        name: "TSh 1,000 Airtime",
        points: 2000
    },

    data1GB: {
        name: "1GB Data",
        points: 5000
    },

    shop5000: {
        name: "TSh 5,000 Shop Voucher",
        points: 10000
    },

    freeShipping: {
        name: "Free Shipping",
        points: 5000
    },

    vip30: {
        name: "30 Days CHAPCY VIP",
        points: 15000
    },

    cashback10000: {
        name: "TSh 10,000 Cashback",
        points: 20000
    }

};


/* =========================================================
   REDEEM
   ========================================================= */

async function redeemReward(rewardId) {

    if (!requireLogin()) return;

    const reward =
        REWARDS[rewardId];

    if (!reward) {

        showToast(
            "Reward not found."
        );

        return;
    }


    const confirmed =
        confirm(
            `${reward.name}\n\n` +
            `Cost: ${formatNumber(reward.points)} points\n\n` +
            `Continue?`
        );

    if (!confirmed) return;


    try {

        const userRef =
            doc(
                db,
                "users",
                currentUser.uid
            );

        const redemptionRef =
            doc(
                collection(
                    db,
                    "redemptions"
                )
            );

        await runTransaction(
            db,
            async transaction => {

                const userSnap =
                    await transaction.get(
                        userRef
                    );

                if (!userSnap.exists()) {

                    throw new Error(
                        "User account not found."
                    );

                }

                const data =
                    userSnap.data();

                const balance =
                    Number(
                        data.points || 0
                    );

                if (
                    balance <
                    reward.points
                ) {

                    throw new Error(
                        "Not enough CHAPCY Points."
                    );

                }

                transaction.update(
                    userRef,
                    {

                        points:
                            balance -
                            reward.points,

                        spentPoints:
                            Number(
                                data.spentPoints || 0
                            ) +
                            reward.points,

                        updatedAt:
                            serverTimestamp()

                    }
                );


                transaction.set(
                    redemptionRef,
                    {

                        userId:
                            currentUser.uid,

                        rewardId:
                            rewardId,

                        rewardName:
                            reward.name,

                        points:
                            reward.points,

                        status:
                            "pending",

                        createdAt:
                            serverTimestamp()

                    }
                );


                const txRef =
                    doc(
                        collection(
                            db,
                            "pointTransactions"
                        )
                    );

                transaction.set(
                    txRef,
                    {

                        userId:
                            currentUser.uid,

                        type:
                            "redeem",

                        amount:
                            -reward.points,

                        source:
                            "reward_redemption",

                        rewardId:
                            rewardId,

                        status:
                            "completed",

                        createdAt:
                            serverTimestamp()

                    }
                );

            }
        );


        closeModal("transactionModal");

        showToast(
            `🎁 ${reward.name} requested!`
        );

        await loadRewards();

    } catch (error) {

        console.error(
            "Redeem error:",
            error
        );

        showToast(
            error.message ||
            "Redemption failed."
        );

    }

}


/* =========================================================
   MYSTERY BOX
   ========================================================= */

const MYSTERY_BOX_COST = 2000;


const MYSTERY_REWARDS = [

    {
        name: "+500 Points",
        type: "points",
        value: 500,
        chance: 35
    },

    {
        name: "+1,000 Points",
        type: "points",
        value: 1000,
        chance: 25
    },

    {
        name: "+3,000 Points",
        type: "points",
        value: 3000,
        chance: 15
    },

    {
        name: "TSh 2,000 Shop Voucher",
        type: "voucher",
        value: 2000,
        chance: 10
    },

    {
        name: "Free Shipping",
        type: "shipping",
        value: 1,
        chance: 7
    },

    {
        name: "10% Shop Discount",
        type: "discount",
        value: 10,
        chance: 5
    },

    {
        name: "1 Day CHAPCY VIP",
        type: "vip",
        value: 1,
        chance: 2
    },

    {
        name: "RARE CHAPCY REWARD",
        type: "rare",
        value: 1,
        chance: 1
    }

];


/* =========================================================
   OPEN MYSTERY BOX
   ========================================================= */

async function openMysteryBox() {

    if (!requireLogin()) return;


    const confirmed =
        confirm(
            `🎁 Mystery Box\n\n` +
            `Cost: ${formatNumber(MYSTERY_BOX_COST)} points\n\n` +
            `Every box contains a reward.\n\n` +
            `Open now?`
        );

    if (!confirmed) return;


    try {

        const userRef =
            doc(
                db,
                "users",
                currentUser.uid
            );

        let selectedReward = null;


        await runTransaction(
            db,
            async transaction => {

                const userSnap =
                    await transaction.get(
                        userRef
                    );

                if (!userSnap.exists()) {

                    throw new Error(
                        "User not found."
                    );

                }

                const data =
                    userSnap.data();

                const points =
                    Number(
                        data.points || 0
                    );

                if (
                    points <
                    MYSTERY_BOX_COST
                ) {

                    throw new Error(
                        "You need 2,000 points."
                    );

                }


                selectedReward =
                    pickMysteryReward();


                let newPoints =
                    points -
                    MYSTERY_BOX_COST;


                /*
                   If reward is points,
                   add them immediately.
                */

                if (
                    selectedReward.type ===
                    "points"
                ) {

                    newPoints +=
                        selectedReward.value;

                }


                transaction.update(
                    userRef,
                    {

                        points:
                            newPoints,

                        spentPoints:
                            Number(
                                data.spentPoints || 0
                            ) +
                            MYSTERY_BOX_COST,

                        updatedAt:
                            serverTimestamp()

                    }
                );


                const txRef =
                    doc(
                        collection(
                            db,
                            "pointTransactions"
                        )
                    );


                transaction.set(
                    txRef,
                    {

                        userId:
                            currentUser.uid,

                        type:
                            "mystery_box",

                        amount:
                            -MYSTERY_BOX_COST,

                        source:
                            "mystery_box",

                        reward:
                            selectedReward.name,

                        status:
                            "completed",

                        createdAt:
                            serverTimestamp()

                    }
                );


                const boxRef =
                    doc(
                        collection(
                            db,
                            "mysteryBoxTransactions"
                        )
                    );


                transaction.set(
                    boxRef,
                    {

                        userId:
                            currentUser.uid,

                        cost:
                            MYSTERY_BOX_COST,

                        reward:
                            selectedReward,

                        createdAt:
                            serverTimestamp()

                    }
                );

            }
        );


        showMysteryResult(
            selectedReward
        );

        await loadRewards();

    } catch (error) {

        console.error(
            "Mystery box error:",
            error
        );

        showToast(
            error.message ||
            "Mystery Box failed."
        );

    }

}


/* =========================================================
   RANDOM MYSTERY REWARD
   ========================================================= */

function pickMysteryReward() {

    const total =
        MYSTERY_REWARDS.reduce(
            (sum, reward) =>
                sum + reward.chance,
            0
        );

    let random =
        Math.random() * total;

    for (
        const reward
        of MYSTERY_REWARDS
    ) {

        random -=
            reward.chance;

        if (random <= 0) {

            return reward;

        }

    }

    return MYSTERY_REWARDS[0];

}


/* =========================================================
   MYSTERY RESULT
   ========================================================= */

function showMysteryResult(
    reward
) {

    const message =
        `🎉 You won!\n\n${reward.name}`;

    showToast(message);


    const result =
        document.querySelector(
            "#mysteryResult"
        );

    if (result) {

        result.textContent =
            reward.name;

        result.classList.add(
            "show"
        );

    }

}


/* =========================================================
   BUY POINTS
   ========================================================= */

const POINT_PACKAGES = {

    500: {
        points: 500,
        price: 500
    },

    1200: {
        points: 1200,
        price: 1000
    },

    3000: {
        points: 3000,
        price: 2000
    },

    8000: {
        points: 8000,
        price: 5000
    },

    18000: {
        points: 18000,
        price: 10000
    },

    50000: {
        points: 50000,
        price: 25000
    },

    120000: {
        points: 120000,
        price: 50000
    }

};


/* =========================================================
   CREATE POINT PURCHASE
   ========================================================= */

async function buyPoints(
    packageKey
) {

    if (!requireLogin()) return;

    const pack =
        POINT_PACKAGES[packageKey];

    if (!pack) {

        showToast(
            "Package not found."
        );

        return;
    }


    try {

        const purchaseRef =
            await addDoc(
                collection(
                    db,
                    "pointPurchases"
                ),
                {

                    userId:
                        currentUser.uid,

                    points:
                        pack.points,

                    price:
                        pack.price,

                    currency:
                        "TZS",

                    status:
                        "pending",

                    provider:
                        "not_selected",

                    createdAt:
                        serverTimestamp()

                }
            );


        /*
           IMPORTANT:
           Points are NOT added here.

           Payment gateway should confirm
           payment first, then backend /
           Cloud Function credits points.
        */


        showToast(
            `Package selected: ${formatNumber(pack.points)} points`
        );


        console.log(
            "Point purchase created:",
            purchaseRef.id
        );


        closeModal(
            "buyPointsModal"
        );


        /*
           Future payment integration:

           Mixx by Yas
           M-Pesa
           Airtel Money
           Card
           etc.

           The payment backend should update:

           status: "paid"

           and then securely credit points.
        */


    } catch (error) {

        console.error(
            "Purchase error:",
            error
        );

        showToast(
            "Could not create purchase."
        );

    }

}


/* =========================================================
   TRANSACTION HISTORY
   ========================================================= */

async function openHistory() {

    if (!requireLogin()) return;

    const modal =
        document.getElementById(
            "historyModal"
        );

    if (modal) {

        modal.classList.add(
            "active"
        );

    }


    const list =
        document.querySelector(
            ".history-list"
        );

    if (!list) return;

    list.innerHTML = `
        <div class="history-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            Loading history...
        </div>
    `;


    try {

        const q =
            query(
                collection(
                    db,
                    "pointTransactions"
                ),
                where(
                    "userId",
                    "==",
                    currentUser.uid
                ),
                orderBy(
                    "createdAt",
                    "desc"
                ),
                limit(50)
            );

        const snap =
            await getDocs(q);


        if (snap.empty) {

            list.innerHTML = `
                <div class="empty-history">
                    <i class="fa-solid fa-clock-rotate-left"></i>
                    <p>No transactions yet.</p>
                </div>
            `;

            return;
        }


        list.innerHTML = "";


        snap.forEach(
            transactionSnap => {

                const data =
                    transactionSnap.data();

                list.appendChild(
                    createHistoryItem(
                        data
                    )
                );

            }
        );


    } catch (error) {

        console.error(
            "History error:",
            error
        );


        /*
           Fallback without orderBy.
        */

        try {

            const q =
                query(
                    collection(
                        db,
                        "pointTransactions"
                    ),
                    where(
                        "userId",
                        "==",
                        currentUser.uid
                    ),
                    limit(50)
                );

            const snap =
                await getDocs(q);

            list.innerHTML = "";

            const transactions =
                [];

            snap.forEach(
                item => {

                    transactions.push(
                        item.data()
                    );

                }
            );

            transactions.sort(
                (a, b) =>
                    getTimestampMs(
                        b.createdAt
                    ) -
                    getTimestampMs(
                        a.createdAt
                    )
            );

            transactions.forEach(
                item => {

                    list.appendChild(
                        createHistoryItem(
                            item
                        )
                    );

                }
            );

        } catch (fallbackError) {

            console.error(
                fallbackError
            );

            list.innerHTML = `
                <div class="empty-history">
                    Unable to load history.
                </div>
            `;

        }

    }

}


/* =========================================================
   CREATE HISTORY ITEM
   ========================================================= */

function createHistoryItem(data) {

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "history-item";


    const amount =
        Number(
            data.amount || 0
        );

    const positive =
        amount >= 0;


    const icon =
        positive
            ? "fa-arrow-down"
            : "fa-arrow-up";


    const source =
        formatSource(
            data.source
        );


    const date =
        formatDate(
            data.createdAt
        );


    item.innerHTML = `

        <div class="history-icon ${positive ? "plus" : "minus"}">

            <i class="fa-solid ${icon}"></i>

        </div>

        <div class="history-content">

            <strong>
                ${escapeHTML(source)}
            </strong>

            <small>
                ${escapeHTML(date)}
            </small>

        </div>

        <div class="history-amount ${positive ? "plus" : "minus"}">

            ${positive ? "+" : ""}
            ${formatNumber(amount)}

        </div>

    `;


    return item;

}


/* =========================================================
   REFERRAL
   ========================================================= */

function generateReferralCode(uid) {

    return (
        "CHAPCY" +
        uid
            .substring(0, 6)
            .toUpperCase()
    );

}


async function copyReferral() {

    if (!requireLogin()) return;

    let code =
        currentUserData?.referralCode;

    if (!code) {

        code =
            generateReferralCode(
                currentUser.uid
            );

        try {

            await setDoc(
                doc(
                    db,
                    "users",
                    currentUser.uid
                ),
                {
                    referralCode: code
                },
                {
                    merge: true
                }
            );

        } catch (error) {

            console.warn(
                error
            );

        }

    }


    try {

        await navigator.clipboard.writeText(
            code
        );

        showToast(
            "📋 Referral code copied!"
        );

    } catch {

        fallbackCopy(
            code
        );

    }

}


/* =========================================================
   SHARE REFERRAL
   ========================================================= */

async function shareReferral() {

    if (!requireLogin()) return;

    const code =
        currentUserData?.referralCode ||
        generateReferralCode(
            currentUser.uid
        );

    const text =
        `Join me on CHAPCY 🌍🔥\n\n` +
        `Use my referral code: ${code}\n\n` +
        `Earn CHAPCY Points together!`;


    if (
        navigator.share
    ) {

        try {

            await navigator.share({

                title:
                    "Join CHAPCY",

                text:
                    text

            });

            return;

        } catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {
                return;
            }

        }

    }


    fallbackCopy(text);

}


/* =========================================================
   FALLBACK COPY
   ========================================================= */

function fallbackCopy(text) {

    const input =
        document.createElement(
            "textarea"
        );

    input.value = text;

    input.style.position =
        "fixed";

    input.style.opacity =
        "0";

    document.body.appendChild(
        input
    );

    input.select();

    try {

        document.execCommand(
            "copy"
        );

        showToast(
            "📋 Copied!"
        );

    } catch {

        showToast(
            "Copy failed."
        );

    }

    input.remove();

}


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

function scrollToSection(id) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   OPEN MODAL
   ========================================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.add(
        "active"
    );

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.remove(
        "active"
    );

}


/* =========================================================
   GO BACK
   ========================================================= */

function goBack() {

    if (
        window.history.length > 1
    ) {

        window.history.back();

    } else {

        window.location.href =
            "Index.html";

    }

}


/* =========================================================
   SHOW TOAST
   ========================================================= */

function showToast(message) {

    let toast =
        document.getElementById(
            "rewardToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "rewardToast";

        toast.className =
            "toast";

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
        window.__chapcyToastTimer
    );


    window.__chapcyToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   REQUIRE LOGIN
   ========================================================= */

function requireLogin() {

    if (
        !currentUser
    ) {

        showToast(
            "🔐 Please login first."
        );

        return false;

    }

    return true;

}


/* =========================================================
   RESET UI
   ========================================================= */

function resetRewardsUI() {

    setText(
        "availablePoints",
        "0"
    );

    setText(
        "earnedPoints",
        "0"
    );

    setText(
        "spentPoints",
        "0"
    );

    setText(
        "pendingPoints",
        "0"
    );

    setText(
        "userLevel",
        "Bronze"
    );

    setText(
        "userXP",
        "0"
    );

    setText(
        "streakCount",
        "0"
    );

}


/* =========================================================
   TEXT HELPER
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   NUMBER FORMAT
   ========================================================= */

function formatNumber(value) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-US"
    );

}


/* =========================================================
   DATE KEY
   ========================================================= */

function getDateKey() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;

}


/* =========================================================
   DATE FORMAT
   ========================================================= */

function formatDate(timestamp) {

    if (!timestamp) {

        return "Just now";

    }

    const date =
        timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);

    return date.toLocaleString(
        "en-US",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   TIMESTAMP TO MILLISECONDS
   ========================================================= */

function getTimestampMs(
    timestamp
) {

    if (!timestamp) return 0;

    if (
        typeof timestamp.toMillis ===
        "function"
    ) {

        return timestamp.toMillis();

    }

    if (
        typeof timestamp.toDate ===
        "function"
    ) {

        return timestamp.toDate()
            .getTime();

    }

    return new Date(
        timestamp
    ).getTime();

}


/* =========================================================
   FORMAT SOURCE
   ========================================================= */

function formatSource(source) {

    if (!source) {

        return "CHAPCY Activity";

    }

    const names = {

        daily_login:
            "Daily Login",

        watch_tv:
            "Watched CHAPCY TV",

        comment:
            "Comment Reward",

        reaction:
            "Reaction Reward",

        complete_profile:
            "Profile Completed",

        join_group:
            "Joined Group",

        invite_friend:
            "Friend Referral",

        reward_redemption:
            "Reward Redemption",

        mystery_box:
            "Mystery Box"

    };

    return (
        names[source] ||
        source
            .replaceAll(
                "_",
                " "
            )
            .replace(
                /\b\w/g,
                char =>
                    char.toUpperCase()
            )
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
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
   GLOBAL FUNCTIONS
   HTML onclick="..." CAN USE THESE
   ========================================================= */

window.goBack =
    goBack;

window.openModal =
    openModal;

window.closeModal =
    closeModal;

window.openHistory =
    openHistory;

window.openMysteryBox =
    openMysteryBox;

window.copyReferral =
    copyReferral;

window.shareReferral =
    shareReferral;

window.scrollToSection =
    scrollToSection;

window.claimDailyLogin =
    claimDailyLogin;

window.earnPoints =
    earnPoints;

window.redeemReward =
    redeemReward;

window.buyPoints =
    buyPoints;


/* =========================================================
   CONVENIENCE FUNCTIONS FOR HTML
   ========================================================= */

window.earnWatchTV =
    () => earnPoints("watchTV");

window.earnComment =
    () => earnPoints("comment");

window.earnReaction =
    () => earnPoints("reaction");

window.earnProfile =
    () => earnPoints("profile");

window.earnJoinGroup =
    () => earnPoints("joinGroup");

window.earnInviteFriend =
    () => earnPoints("inviteFriend");


/* =========================================================
   REDEEM SHORTCUTS
   ========================================================= */

window.redeemAirtime =
    () =>
        redeemReward(
            "airtime1000"
        );

window.redeemData =
    () =>
        redeemReward(
            "data1GB"
        );

window.redeemShopVoucher =
    () =>
        redeemReward(
            "shop5000"
        );

window.redeemShipping =
    () =>
        redeemReward(
            "freeShipping"
        );

window.redeemVIP =
    () =>
        redeemReward(
            "vip30"
        );

window.redeemCashback =
    () =>
        redeemReward(
            "cashback10000"
        );


/* =========================================================
   POINT PACKAGE SHORTCUTS
   ========================================================= */

window.buy500 =
    () => buyPoints(500);

window.buy1200 =
    () => buyPoints(1200);

window.buy3000 =
    () => buyPoints(3000);

window.buy8000 =
    () => buyPoints(8000);

window.buy18000 =
    () => buyPoints(18000);

window.buy50000 =
    () => buyPoints(50000);

window.buy120000 =
    () => buyPoints(120000);


/* =========================================================
   FIREBASE SCHEMA
   =========================================================

   users/{uid}

   {
       points: 1000,
       earnedPoints: 0,
       spentPoints: 0,
       pendingPoints: 0,
       xp: 0,
       level: "Bronze",
       streak: 0,
       lastLoginDate: "2026-09-08",
       referralCode: "CHAPCYABC123"
   }


   pointTransactions/{transactionId}

   {
       userId: "...",
       type: "earn",
       amount: 20,
       xp: 20,
       source: "daily_login",
       status: "completed",
       createdAt: serverTimestamp()
   }


   userChallenges/{challengeId}

   {
       userId: "...",
       challengeId: "watch5",
       dateKey: "2026-09-08",
       progress: 3,
       target: 5,
       reward: 50,
       completed: false
   }


   redemptions/{redemptionId}

   {
       userId: "...",
       rewardId: "airtime1000",
       rewardName: "TSh 1,000 Airtime",
       points: 2000,
       status: "pending",
       createdAt: serverTimestamp()
   }


   pointPurchases/{purchaseId}

   {
       userId: "...",
       points: 3000,
       price: 2000,
       currency: "TZS",
       status: "pending",
       provider: "not_selected",
       createdAt: serverTimestamp()
   }


   mysteryBoxTransactions/{id}

   {
       userId: "...",
       cost: 2000,
       reward: {...},
       createdAt: serverTimestamp()
   }

   =========================================================
   IMPORTANT SECURITY NOTE
   =========================================================

   For production:

   DO NOT allow users to directly edit:

   - points
   - earnedPoints
   - spentPoints
   - xp
   - streak
   - redemptions

   Those writes should eventually be handled by
   Firebase Cloud Functions / trusted backend.

   The frontend should request an action,
   while the backend validates and awards points.

   =========================================================
*/
