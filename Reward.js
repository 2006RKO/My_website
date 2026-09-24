/* =========================================================
   CHAPCY REWARDS SYSTEM
   Points + Coins + Streak + Data + Bundles
========================================================= */


/* =========================
   DEFAULT USER WALLET
========================= */

const DEFAULT_WALLET = {
    points: 0,
    coins: 0,
    streak: 0,
    xp: 0,
    level: 1,
    lastLogin: null,
    transactions: []
};


let wallet =
    JSON.parse(localStorage.getItem("chapcyWallet")) ||
    DEFAULT_WALLET;


/* =========================
   SAVE
========================= */

function saveWallet(){

    localStorage.setItem(
        "chapcyWallet",
        JSON.stringify(wallet)
    );

}


/* =========================
   FORMAT NUMBERS
========================= */

function formatNumber(number){

    return Number(number || 0).toLocaleString();

}


/* =========================
   UPDATE UI
========================= */

function updateWalletUI(){

    const points =
        document.getElementById("pointsBalance");

    const coins =
        document.getElementById("coinsBalance");

    const streak =
        document.getElementById("streakDays");

    if(points){
        points.textContent =
            formatNumber(wallet.points);
    }

    if(coins){
        coins.textContent =
            formatNumber(wallet.coins);
    }

    if(streak){
        streak.textContent =
            formatNumber(wallet.streak);
    }


    updateLevel();

    renderTransactions();

    saveWallet();

}


/* =========================
   XP / LEVEL
========================= */

function updateLevel(){

    const xp = Number(wallet.xp || 0);

    let level = 1;

    if(xp >= 1000){
        level = 5;
    }else if(xp >= 500){
        level = 4;
    }else if(xp >= 250){
        level = 3;
    }else if(xp >= 100){
        level = 2;
    }


    wallet.level = level;


    const names = {
        1:"Bronze",
        2:"Silver",
        3:"Gold",
        4:"Platinum",
        5:"Diamond"
    };


    const requirements = {
        1:100,
        2:250,
        3:500,
        4:1000,
        5:1000
    };


    const levelName =
        document.getElementById("levelName");

    const xpText =
        document.getElementById("xpText");

    const progress =
        document.getElementById("xpProgress");


    if(levelName){

        levelName.textContent =
            names[level];

    }


    const maxXP =
        requirements[level];

    const previousXP =

        level === 1 ? 0 :
        level === 2 ? 100 :
        level === 3 ? 250 :
        level === 4 ? 500 :
        1000;


    const current =
        Math.max(0,xp - previousXP);

    const needed =
        Math.max(1,maxXP - previousXP);

    const percentage =
        Math.min(100,(current / needed) * 100);


    if(xpText){

        xpText.textContent =
            `${formatNumber(xp)} XP`;

    }


    if(progress){

        setTimeout(() => {

            progress.style.width =
                percentage + "%";

        },100);

    }

}


/* =========================
   TRANSACTION
========================= */

function addTransaction(
    title,
    description,
    value
){

    wallet.transactions.unshift({

        title,
        description,
        value,

        date:
            new Date().toLocaleString()

    });


    if(wallet.transactions.length > 30){

        wallet.transactions =
            wallet.transactions.slice(0,30);

    }

}


/* =========================
   ADD POINTS
========================= */

function addPoints(amount, reason="Reward"){

    amount = Number(amount);

    if(amount <= 0){
        return;
    }

    wallet.points += amount;

    wallet.xp += amount;

    addTransaction(
        reason,
        "CHAPCY Points earned",
        `+${amount} PTS`
    );

    updateWalletUI();

}


/* =========================
   ADD COINS
========================= */

function addCoins(amount, reason="Reward"){

    amount = Number(amount);

    if(amount <= 0){
        return;
    }

    wallet.coins += amount;

    wallet.xp += Math.min(amount,20);

    addTransaction(
        reason,
        "CHAPCY Coins earned",
        `+${amount} Coins`
    );

    updateWalletUI();

}


/* =========================
   DAILY LOGIN
========================= */

function checkDailyLogin(){

    const today =
        new Date().toISOString().slice(0,10);


    if(wallet.lastLogin === today){

        return;

    }


    const yesterdayDate =
        new Date();

    yesterdayDate.setDate(
        yesterdayDate.getDate() - 1
    );


    const yesterday =
        yesterdayDate
        .toISOString()
        .slice(0,10);


    if(wallet.lastLogin === yesterday){

        wallet.streak++;

    }else{

        wallet.streak = 1;

    }


    wallet.lastLogin = today;


    /* Rare Points */

    addPoints(
        1,
        "Daily Login"
    );


    /* Coins are easier to earn */

    addCoins(
        10,
        "Daily Login Bonus"
    );


    /* 7 DAY BONUS */

    if(wallet.streak === 7){

        addPoints(
            5,
            "7-Day Streak Bonus"
        );

        addCoins(
            50,
            "7-Day Streak Coins"
        );

    }


    /* 30 DAY BONUS */

    if(wallet.streak === 30){

        addPoints(
            15,
            "30-Day Streak Bonus"
        );

        addCoins(
            150,
            "30-Day Streak Coins"
        );

    }


    saveWallet();

}


/* =========================
   BUY POINTS
========================= */

function buyPoints(points, price){

    const confirmBuy =
        confirm(
            `Buy ${formatNumber(points)} CHAPCY Points for TSh ${formatNumber(price)}?`
        );


    if(!confirmBuy){

        return;

    }


    /*
       REAL PAYMENT SHOULD BE
       CONNECTED HERE LATER.
    */


    addPoints(
        points,
        "Purchased CHAPCY Points"
    );


    showToast(
        `${formatNumber(points)} Points added`
    );

}


/* =========================
   BUNDLE PURCHASE
========================= */

function buyBundle(
    name,
    price,
    coins,
    points,
    data
){

    const confirmed =
        confirm(

            `Buy ${name} for TSh ${formatNumber(price)}?\n\n` +

            `🪙 ${formatNumber(coins)} Coins\n` +

            `⭐ ${formatNumber(points)} Points\n` +

            `📶 ${data}`

        );


    if(!confirmed){

        return;

    }


    /*
       REAL PAYMENT GATEWAY
       WILL BE CONNECTED HERE.
    */


    addCoins(
        coins,
        `${name} Bundle`
    );


    addPoints(
        points,
        `${name} Bundle`
    );


    addTransaction(

        `${name} Data Bundle`,

        `${data} included`,

        `+${data}`

    );


    showToast(
        `${name} bundle activated`
    );

}


/* =========================
   NETWORK
========================= */

let selectedNetwork =
    "Vodacom";


function selectNetwork(button){

    document
        .querySelectorAll(".network")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    button.classList.add("active");


    selectedNetwork =
        button.dataset.network;


    const display =
        document.getElementById(
            "selectedNetwork"
        );


    if(display){

        display.textContent =
            selectedNetwork;

    }

}


/* =========================
   BUY DATA
========================= */

function buyData(
    data,
    cost
){

    const phone =
        document
        .getElementById("dataPhone")
        .value
        .trim();


    if(!phone){

        showToast(
            "Enter your phone number first"
        );

        return;

    }


    if(phone.length < 9){

        showToast(
            "Enter a valid phone number"
        );

        return;

    }


    if(wallet.points < cost){

        showToast(
            `You need ${formatNumber(cost)} Points`
        );

        return;

    }


    const confirmed =
        confirm(

            `Buy ${data} for ${formatNumber(cost)} Points?\n\n` +

            `Network: ${selectedNetwork}\n` +

            `Number: ${phone}`

        );


    if(!confirmed){

        return;

    }


    wallet.points -= cost;


    addTransaction(

        `Data Purchase — ${data}`,

        `${selectedNetwork} • ${phone}`,

        `-${formatNumber(cost)} PTS`

    );


    updateWalletUI();


    /*
       REAL DATA API WILL BE CONNECTED HERE.
    */


    showToast(
        `${data} request created`
    );

}


/* =========================
   CHALLENGE
========================= */

function completeChallenge(
    button,
    points,
    coins
){

    if(button.dataset.completed === "true"){

        return;

    }


    button.dataset.completed =
        "true";


    button.textContent =
        "Completed ✓";


    button.disabled = true;


    addPoints(
        points,
        "Daily Challenge"
    );


    addCoins(
        coins,
        "Daily Challenge"
    );


    showToast(
        "Challenge completed"
    );

}


/* =========================
   MYSTERY BOX
========================= */

function openMysteryBox(){

    document
        .getElementById("mysteryModal")
        .classList.add("show");

}


function closeMystery(){

    document
        .getElementById("mysteryModal")
        .classList.remove("show");

}


function claimMystery(){

    const cost = 50;


    if(wallet.coins < cost){

        showToast(
            "You need 50 Coins"
        );

        return;

    }


    wallet.coins -= cost;


    /*
       Rare rewards:
       mostly coins,
       sometimes points.
    */


    const random =
        Math.random();


    let rewardText = "";


    if(random < 0.70){

        const coins =
            Math.floor(
                Math.random() * 101
            ) + 20;

        addCoins(
            coins,
            "Mystery Box"
        );

        rewardText =
            `🪙 You won ${coins} Coins!`;

    }else{

        const points =
            Math.floor(
                Math.random() * 6
            );

        if(points > 0){

            addPoints(
                points,
                "Mystery Box"
            );

        }


        rewardText =
            `⭐ You won ${points} Points!`;

    }


    addTransaction(
        "Mystery Box",
        "Mystery reward",
        rewardText
    );


    updateWalletUI();


    document
        .getElementById("mysteryTitle")
        .textContent =
            "🎉 Congratulations!";


    document
        .getElementById("mysteryResult")
        .textContent =
            rewardText;


    document
        .querySelector(".mystery-modal .main-action")
        .textContent =
            "Close";


    document
        .querySelector(".mystery-modal .main-action")
        .onclick =
            closeMystery;

}


/* =========================
   HISTORY
========================= */

function openHistory(){

    renderHistory();

    document
        .getElementById("historyModal")
        .classList.add("show");

}


function closeHistory(){

    document
        .getElementById("historyModal")
        .classList.remove("show");

}


function renderHistory(){

    const list =
        document.getElementById(
            "historyList"
        );


    if(!list){

        return;

    }


    if(wallet.transactions.length === 0){

        list.innerHTML =
            `<div class="empty-transactions">
                No transactions yet.
            </div>`;

        return;

    }


    list.innerHTML =
        wallet.transactions
        .map(item => `

            <div class="history-item">

                <div>
                    <strong>
                        ${escapeHTML(item.title)}
                    </strong>

                    <span>
                        ${escapeHTML(item.description)}
                    </span>

                    <span>
                        ${escapeHTML(item.date)}
                    </span>
                </div>

                <b>
                    ${escapeHTML(item.value)}
                </b>

            </div>

        `)
        .join("");

}


/* =========================
   RECENT TRANSACTIONS
========================= */

function renderTransactions(){

    const list =
        document.getElementById(
            "recentTransactions"
        );


    if(!list){

        return;

    }


    if(wallet.transactions.length === 0){

        list.innerHTML =
            `<div class="empty-transactions">
                No transactions yet.
            </div>`;

        return;

    }


    list.innerHTML =
        wallet.transactions
        .slice(0,5)
        .map(item => `

            <div class="transaction">

                <div class="transaction-icon">
                    <i class="fa-solid fa-receipt"></i>
                </div>

                <div class="transaction-info">

                    <strong>
                        ${escapeHTML(item.title)}
                    </strong>

                    <span>
                        ${escapeHTML(item.description)}
                    </span>

                </div>

                <div class="transaction-value">
                    ${escapeHTML(item.value)}
                </div>

            </div>

        `)
        .join("");

}


/* =========================
   CHAPCY DROP
========================= */

function openDrop(){

    showToast(
        "CHAPCY Drop is opening..."
    );

    setTimeout(() => {

        window.location.href =
            "ChapcyDrop.html";

    },500);

}


/* =========================
   COIN INFO
========================= */

function showCoinInfo(){

    showToast(
        "Coins are mainly used for Chat, Groups and Gifts"
    );

}


/* =========================
   REFERRAL
========================= */

function copyReferral(){

    navigator
        .clipboard
        .writeText("CHAPCY2026")
        .then(() => {

            showToast(
                "Referral code copied"
            );

        })
        .catch(() => {

            showToast(
                "Referral code: CHAPCY2026"
            );

        });

}


/* =========================
   TOAST
========================= */

let toastTimer;


function showToast(message){

    const toast =
        document.getElementById("toast");

    const text =
        document.getElementById("toastMessage");


    if(!toast || !text){

        return;

    }


    text.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        },3000);

}


/* =========================
   SCROLL
========================= */

function scrollToSection(id){

    const element =
        document.getElementById(id);


    if(element){

        element.scrollIntoView({
            behavior:"smooth",
            block:"start"
        });

    }

}


/* =========================
   REFRESH
========================= */

function refreshWallet(){

    updateWalletUI();

    showToast(
        "Wallet refreshed"
    );

}


/* =========================
   BACK
========================= */

function goBack(){

    if(history.length > 1){

        history.back();

    }else{

        window.location.href =
            "chapcy.html";

    }

}


/* =========================
   SECURITY
========================= */

function escapeHTML(value){

    return String(value)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");

}


/* =========================
   START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkDailyLogin();

        updateWalletUI();

    }
);
