// =====================================================
// CHAPCY DATA HUB
// FIREBASE READY
// =====================================================

import {
    auth,
    db
} from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    ref,
    push,
    set,
    onValue,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// =====================================================
// ELEMENTS
// =====================================================

const backBtn =
    document.getElementById("backBtn");

const headerPoints =
    document.getElementById("headerPoints");

const totalPoints =
    document.getElementById("totalPoints");

const dataPurchased =
    document.getElementById("dataPurchased");

const streakCount =
    document.getElementById("streakCount");

const streakNumber =
    document.getElementById("streakNumber");

const networkCards =
    document.querySelectorAll(".network-card");

const selectedNetworkLabel =
    document.getElementById(
        "selectedNetworkLabel"
    );

const packageGrid =
    document.getElementById("packageGrid");

const purchaseModal =
    document.getElementById("purchaseModal");

const modalClose =
    document.getElementById("modalClose");

const modalNetwork =
    document.getElementById("modalNetwork");

const modalBundle =
    document.getElementById("modalBundle");

const modalPrice =
    document.getElementById("modalPrice");

const modalPoints =
    document.getElementById("modalPoints");

const phoneNumber =
    document.getElementById("phoneNumber");

const confirmPurchase =
    document.getElementById(
        "confirmPurchase"
    );

const historyList =
    document.getElementById("historyList");

const buyNowBtn =
    document.getElementById("buyNowBtn");

const rewardsBtn =
    document.getElementById("rewardsBtn");

const pointsButton =
    document.getElementById("pointsButton");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


// =====================================================
// STATE
// =====================================================

let currentUser = null;

let selectedNetwork = "tigo";

let selectedPackage = null;


// =====================================================
// DEMO PACKAGE CATALOG
// =====================================================
//
// Hizi ni UI/catalog values tu.
// Bei halisi zitawekwa kutoka provider/API yako.
// =====================================================

const packages = {

    tigo: [

        {
            id: "tigo-1gb",
            data: "1 GB",
            price: 1000,
            points: 10
        },

        {
            id: "tigo-3gb",
            data: "3 GB",
            price: 2500,
            points: 30
        },

        {
            id: "tigo-5gb",
            data: "5 GB",
            price: 4000,
            points: 50,
            popular: true
        },

        {
            id: "tigo-10gb",
            data: "10 GB",
            price: 7500,
            points: 90
        }

    ],


    airtel: [

        {
            id: "airtel-1gb",
            data: "1 GB",
            price: 1000,
            points: 8
        },

        {
            id: "airtel-3gb",
            data: "3 GB",
            price: 2500,
            points: 25
        },

        {
            id: "airtel-5gb",
            data: "5 GB",
            price: 4000,
            points: 45,
            popular: true
        },

        {
            id: "airtel-10gb",
            data: "10 GB",
            price: 7500,
            points: 80
        }

    ],


    vodacom: [

        {
            id: "vodacom-1gb",
            data: "1 GB",
            price: 1000,
            points: 8
        },

        {
            id: "vodacom-3gb",
            data: "3 GB",
            price: 2500,
            points: 25
        },

        {
            id: "vodacom-5gb",
            data: "5 GB",
            price: 4000,
            points: 45,
            popular: true
        },

        {
            id: "vodacom-10gb",
            data: "10 GB",
            price: 7500,
            points: 80
        }

    ],


    halotel: [

        {
            id: "halotel-1gb",
            data: "1 GB",
            price: 1000,
            points: 8
        },

        {
            id: "halotel-3gb",
            data: "3 GB",
            price: 2500,
            points: 25
        },

        {
            id: "halotel-5gb",
            data: "5 GB",
            price: 4000,
            points: 45,
            popular: true
        },

        {
            id: "halotel-10gb",
            data: "10 GB",
            price: 7500,
            points: 80
        }

    ]

};


// =====================================================
// NETWORK NAMES
// =====================================================

const networkNames = {

    tigo: "TIGO",

    airtel: "AIRTEL",

    vodacom: "VODACOM",

    halotel: "HALOTEL"

};


// =====================================================
// NETWORK COLORS / CLASS
// =====================================================

const networkClass = {

    tigo: "tigo-logo",

    airtel: "airtel-logo",

    vodacom: "vodacom-logo",

    halotel: "halotel-logo"

};


// =====================================================
// AUTH
// =====================================================

onAuthStateChanged(
    auth,
    (user) => {

        currentUser =
            user || null;


        if (!user) {

            console.log(
                "Data Hub: guest mode"
            );

            return;

        }


        console.log(
            "Data Hub user:",
            user.uid
        );


        loadUserData(user.uid);

        loadPurchaseHistory(user.uid);

    }
);


// =====================================================
// LOAD USER DATA
// =====================================================

function loadUserData(uid) {

    const userRef =
        ref(
            db,
            `users/${uid}`
        );


    onValue(
        userRef,
        (snapshot) => {

            const data =
                snapshot.val() || {};


            const points =
                Number(
                    data.chapcyPoints || 0
                );


            const totalData =
                Number(
                    data.totalDataPurchased || 0
                );


            const streak =
                Number(
                    data.dataStreak || 0
                );


            updatePoints(points);

            updateData(
                totalData
            );

            updateStreak(
                streak
            );

        }
    );

}


// =====================================================
// UPDATE POINTS
// =====================================================

function updatePoints(points) {

    headerPoints.textContent =
        points.toLocaleString();

    totalPoints.textContent =
        points.toLocaleString();

}


// =====================================================
// UPDATE DATA
// =====================================================

function updateData(total) {

    if (total >= 1000) {

        dataPurchased.textContent =
            (total / 1000).toFixed(1) +
            " TB";

    } else {

        dataPurchased.textContent =
            total +
            " GB";

    }

}


// =====================================================
// UPDATE STREAK
// =====================================================

function updateStreak(streak) {

    streakNumber.textContent =
        streak;

    streakCount.textContent =
        streak +
        (streak === 1
            ? " Day"
            : " Days");

}


// =====================================================
// NETWORK SELECT
// =====================================================

networkCards.forEach(
    (card) => {

        card.addEventListener(
            "click",
            () => {

                networkCards.forEach(
                    item => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );


                card.classList.add(
                    "active"
                );


                selectedNetwork =
                    card.dataset.network;


                renderPackages();

            }
        );

    }
);


// =====================================================
// RENDER PACKAGES
// =====================================================

function renderPackages() {

    const networkPackages =
        packages[selectedNetwork] || [];


    selectedNetworkLabel.textContent =
        networkNames[selectedNetwork] +
        " DATA";


    packageGrid.innerHTML = "";


    networkPackages.forEach(
        (item) => {

            const card =
                document.createElement("article");

            card.className =
                "package-card" +
                (
                    item.popular
                        ? " popular"
                        : ""
                );


            card.innerHTML = `

                ${
                    item.popular
                        ? `
                            <div class="popular-tag">
                                POPULAR
                            </div>
                          `
                        : ""
                }

                <span>
                    ${networkNames[selectedNetwork]}
                </span>

                <h4>
                    ${item.data}
                </h4>

                <div class="package-price">
                    TSh ${item.price.toLocaleString()}
                </div>

                <div class="package-points">
                    ⭐ +${item.points} CHAPCY Points
                </div>

                <button
                    class="package-buy"
                    data-package-id="${item.id}"
                >
                    Buy ${item.data}
                </button>

            `;


            const buyButton =
                card.querySelector(
                    ".package-buy"
                );


            buyButton.addEventListener(
                "click",
                () => {

                    openPurchase(
                        item
                    );

                }
            );


            packageGrid.appendChild(
                card
            );

        }
    );

}


// =====================================================
// OPEN PURCHASE
// =====================================================

function openPurchase(item) {

    selectedPackage = item;


    modalNetwork.textContent =
        networkNames[selectedNetwork];


    modalBundle.textContent =
        item.data;


    modalPrice.textContent =
        "TSh " +
        item.price.toLocaleString();


    modalPoints.textContent =
        "+" +
        item.points +
        " Points";


    phoneNumber.value = "";


    purchaseModal.classList.add(
        "show"
    );


    setTimeout(
        () => {
            phoneNumber.focus();
        },
        200
    );

}


// =====================================================
// CLOSE MODAL
// =====================================================

function closePurchase() {

    purchaseModal.classList.remove(
        "show"
    );

    selectedPackage = null;

}


modalClose.addEventListener(
    "click",
    closePurchase
);


purchaseModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            purchaseModal
        ) {

            closePurchase();

        }

    }
);


// =====================================================
// CONFIRM PURCHASE
// =====================================================

confirmPurchase.addEventListener(
    "click",
    async () => {

        const phone =
            phoneNumber.value.trim();


        if (!selectedPackage) {
            return;
        }


        if (!phone) {

            showToast(
                "Enter your phone number."
            );

            phoneNumber.focus();

            return;

        }


        if (!isValidPhone(phone)) {

            showToast(
                "Enter a valid Tanzanian number."
            );

            phoneNumber.focus();

            return;

        }


        if (!currentUser) {

            showToast(
                "Please login to continue."
            );

            return;

        }


        /*
        =================================================
        IMPORTANT

        HAPA NDIPO PAYMENT PROVIDER/API
        ITAUNGANISHWA.

        USI-ADD POINTS HAPA KABLA PAYMENT
        HAJATHIBITISHWA.

        =================================================
        */


        confirmPurchase.disabled = true;

        confirmPurchase.innerHTML =
            `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Processing...
            `;


        try {

            /*
            ------------------------------------------------
            TEMPORARY PURCHASE REQUEST

            Hii inahifadhi request tu.
            Baadaye payment provider/API itatumika
            kuthibitisha transaction.
            ------------------------------------------------
            */

            const purchaseRef =
                push(
                    ref(
                        db,
                        `purchaseRequests/${currentUser.uid}`
                    )
                );


            await set(
                purchaseRef,
                {

                    userId:
                        currentUser.uid,

                    network:
                        selectedNetwork,

                    packageId:
                        selectedPackage.id,

                    data:
                        selectedPackage.data,

                    price:
                        selectedPackage.price,

                    rewardPoints:
                        selectedPackage.points,

                    phone:
                        phone,

                    status:
                        "pending",

                    createdAt:
                        serverTimestamp()

                }
            );


            closePurchase();


            showToast(
                "Purchase request created."
            );


            /*
            ------------------------------------------------
            HAPA BAADAYE:

            Payment success
                  ↓
            Provider confirms
                  ↓
            Bundle delivered
                  ↓
            Add CHAPCY Points
                  ↓
            Update Rewards
            ------------------------------------------------
            */


        } catch (error) {

            console.error(
                "Purchase error:",
                error
            );


            showToast(
                "Something went wrong. Try again."
            );

        } finally {

            confirmPurchase.disabled =
                false;

            confirmPurchase.innerHTML =
                `
                    <i class="fa-solid fa-lock"></i>
                    Continue Purchase
                `;

        }

    }
);


// =====================================================
// PHONE VALIDATION
// =====================================================

function isValidPhone(phone) {

    const clean =
        phone.replace(
            /\s+/g,
            ""
        );


    return /^(\+255|255|0)[67]\d{8}$/.test(
        clean
    );

}


// =====================================================
// PURCHASE HISTORY
// =====================================================

function loadPurchaseHistory(uid) {

    const historyRef =
        ref(
            db,
            `purchases/${uid}`
        );


    onValue(
        historyRef,
        (snapshot) => {

            const data =
                snapshot.val();


            if (!data) {

                showEmptyHistory();

                return;

            }


            renderHistory(
                data
            );

        }
    );

}


// =====================================================
// RENDER HISTORY
// =====================================================

function renderHistory(data) {

    historyList.innerHTML = "";


    const purchases =
        Object.values(data)
            .sort(
                (a, b) =>
                    (b.createdAt || 0) -
                    (a.createdAt || 0)
            )
            .slice(0, 10);


    purchases.forEach(
        (purchase) => {

            const item =
                document.createElement("div");

            item.className =
                "history-item";


            const network =
                purchase.network ||
                "tigo";


            item.innerHTML = `

                <div
                    class="history-network
                    ${networkClass[network] || "tigo-logo"}"
                >
                    ${
                        networkNames[network]
                            ?.charAt(0) || "C"
                    }
                </div>

                <div class="history-info">

                    <strong>
                        ${
                            networkNames[network] ||
                            "Network"
                        }
                        •
                        ${
                            purchase.data ||
                            "Data"
                        }
                    </strong>

                    <span>
                        ${
                            purchase.status ||
                            "completed"
                        }
                    </span>

                </div>

                <div class="history-points">
                    +${
                        purchase.rewardPoints ||
                        0
                    } ⭐
                </div>

            `;


            historyList.appendChild(
                item
            );

        }
    );

}


// =====================================================
// EMPTY HISTORY
// =====================================================

function showEmptyHistory() {

    historyList.innerHTML = `

        <div class="empty-history">

            <i class="fa-solid fa-receipt"></i>

            <p>
                No purchases yet
            </p>

            <span>
                Your data purchases will appear here.
            </span>

        </div>

    `;

}


// =====================================================
// TOAST
// =====================================================

function showToast(message) {

    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


// =====================================================
// QUICK BUTTONS
// =====================================================

buyNowBtn.addEventListener(
    "click",
    () => {

        document
            .getElementById(
                "packagesSection"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


rewardsBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "Reward.html";

    }
);


pointsButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "Reward.html";

    }
);


// =====================================================
// BACK
// =====================================================

backBtn.addEventListener(
    "click",
    () => {

        if (
            window.history.length > 1
        ) {

            window.history.back();

        } else {

            window.location.href =
                "chapcy.html";

        }

    }
);


// =====================================================
// INITIAL LOAD
// =====================================================

renderPackages();
