```javascript
/* =========================================================
   CHAPCY REWARDS V27
   XAMPP + PHP READY
========================================================= */

"use strict";


/* =========================================================
   API CONFIGURATION
========================================================= */

/*
   Kama Reward.html iko:

   http://localhost/chapcy/Reward.html

   basi API hizi zitakuwa:

   http://localhost/chapcy/api/...
*/

const API = {

    rewards:
        "api/rewards.php",

    daily:
        "api/daily-reward.php",

    buyPoints:
        "api/buy-points.php",

    buyBundle:
        "api/buy-bundle.php",

    redeem:
        "api/redeem.php",

    history:
        "api/history.php"

};


/* =========================================================
   GLOBAL STATE
========================================================= */

const STATE = {

    userId:null,

    points:0,

    earned:0,

    spent:0,

    pending:0,

    xp:0,

    level:1,

    levelName:"Bronze",

    streak:0,

    dailyClaimed:false,

    loading:false,

    history:[]

};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = id =>
    document.getElementById(id);


const formatNumber = number => {

    return Number(number || 0)
        .toLocaleString("en-US");

};


const setText = (id,value) => {

    const element = $(id);

    if(element){

        element.textContent = value;

    }

};


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message,type="success"){

    const toast =
        $("toast");

    const text =
        $("toastMessage");

    if(!toast || !text){

        alert(message);

        return;

    }


    text.textContent =
        message;


    toast.classList.toggle(
        "error",
        type === "error"
    );


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        },3500);

}


/* =========================================================
   MODALS
========================================================= */

function openModal(id){

    const modal =
        $(id);

    if(!modal) return;

    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


function closeModal(id){

    const modal =
        $(id);

    if(!modal) return;

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    const opened =
        document.querySelector(
            ".modal.active"
        );


    if(!opened){

        document.body.style.overflow =
            "";

    }

}


window.closeModal =
    closeModal;


/* =========================================================
   BACK
========================================================= */

function goBack(){

    if(window.history.length > 1){

        window.history.back();

    }else{

        window.location.href =
            "chapcy.html";

    }

}


window.goBack =
    goBack;


/* =========================================================
   SCROLL
========================================================= */

function scrollToSection(id){

    const element =
        $(id);

    if(!element) return;

    element.scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

}


window.scrollToSection =
    scrollToSection;


/* =========================================================
   FIREBASE USER
========================================================= */

function getCurrentUser(){

    if(
        window.CHAPCY_CURRENT_USER
    ){

        return window.CHAPCY_CURRENT_USER;

    }

    return null;

}


/* =========================================================
   GET USER ID
========================================================= */

function getUserId(){

    const user =
        getCurrentUser();


    if(user && user.uid){

        return user.uid;

    }


    /*
       Optional fallback for XAMPP sessions.
    */

    if(window.CHAPCY_USER_ID){

        return window.CHAPCY_USER_ID;

    }


    return null;

}


/* =========================================================
   API REQUEST
========================================================= */

async function apiRequest(
    endpoint,
    options={}
){

    const userId =
        getUserId();


    const controller =
        new AbortController();


    const timeout =
        setTimeout(
            () => controller.abort(),
            15000
        );


    try{

        const response =
            await fetch(
                endpoint,
                {

                    method:
                        options.method || "POST",

                    headers:{
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"

                    },

                    credentials:"include",

                    body:
                        options.body
                        ? JSON.stringify({
                            ...options.body,
                            user_id:userId
                        })
                        : JSON.stringify({
                            user_id:userId
                        }),

                    signal:
                        controller.signal

                }
            );


        clearTimeout(timeout);


        const raw =
            await response.text();


        let data;


        try{

            data =
                JSON.parse(raw);

        }catch(error){

            console.error(
                "Invalid PHP JSON:",
                raw
            );

            throw new Error(
                "Server returned invalid response."
            );

        }


        if(!response.ok){

            throw new Error(
                data.message ||
                "Server request failed."
            );

        }


        if(
            data.success === false
        ){

            throw new Error(
                data.message ||
                "Transaction failed."
            );

        }


        return data;

    }catch(error){

        clearTimeout(timeout);


        if(
            error.name ===
            "AbortError"
        ){

            throw new Error(
                "Server took too long to respond."
            );

        }


        throw error;

    }

}


/* =========================================================
   LOAD REWARDS
========================================================= */

async function loadRewards(){

    try{

        const data =
            await apiRequest(
                API.rewards,
                {
                    method:"POST"
                }
            );


        if(data.user){

            applyUserData(
                data.user
            );

        }


        if(data.stats){

            applyStats(
                data.stats
            );

        }


        if(
            typeof data.daily_claimed
            !== "undefined"
        ){

            STATE.dailyClaimed =
                Boolean(
                    data.daily_claimed
                );

        }


        updateUI();


    }catch(error){

        console.error(
            "Rewards loading error:",
            error
        );


        /*
           Don't destroy UI if backend
           isn't connected yet.
        */

        showToast(
            "Unable to load reward balance.",
            "error"
        );

    }

}


/* =========================================================
   APPLY USER DATA
========================================================= */

function applyUserData(user){

    STATE.points =
        Number(
            user.coins ??
            user.points ??
            0
        );


    STATE.xp =
        Number(
            user.xp ??
            0
        );


    STATE.level =
        Number(
            user.level ??
            1
        );


    STATE.streak =
        Number(
            user.login_streak ??
            user.streak ??
            0
        );


    if(user.level_name){

        STATE.levelName =
            user.level_name;

    }

}


/* =========================================================
   APPLY STATS
========================================================= */

function applyStats(stats){

    STATE.earned =
        Number(
            stats.earned ??
            0
        );


    STATE.spent =
        Number(
            stats.spent ??
            0
        );


    STATE.pending =
        Number(
            stats.pending ??
            0
        );

}


/* =========================================================
   UPDATE UI
========================================================= */

function updateUI(){

    setText(
        "availablePoints",
        formatNumber(STATE.points)
    );


    setText(
        "earnedPoints",
        formatNumber(STATE.earned)
    );


    setText(
        "spentPoints",
        formatNumber(STATE.spent)
    );


    setText(
        "pendingPoints",
        formatNumber(STATE.pending)
    );


    setText(
        "streakDays",
        STATE.streak
    );


    setText(
        "userLevel",
        STATE.levelName
    );


    updateLevel();


    updateDailyReward();

}


/* =========================================================
   LEVEL SYSTEM
========================================================= */

function updateLevel(){

    const levels = [

        {
            name:"Bronze",
            min:0,
            max:5000
        },

        {
            name:"Silver",
            min:5000,
            max:15000
        },

        {
            name:"Gold",
            min:15000,
            max:30000
        },

        {
            name:"Platinum",
            min:30000,
            max:60000
        },

        {
            name:"Diamond",
            min:60000,
            max:100000
        },

        {
            name:"Legend",
            min:100000,
            max:250000
        }

    ];


    let current =
        levels[0];


    for(
        const level of levels
    ){

        if(
            STATE.xp >=
            level.min
        ){

            current =
                level;

        }

    }


    const progress =
        current.max === Infinity
        ? 100
        : Math.min(
            100,
            Math.max(
                0,
                (
                    (
                        STATE.xp -
                        current.min
                    )
                    /
                    (
                        current.max -
                        current.min
                    )
                ) * 100
            )
        );


    setText(
        "userLevel",
        current.name
    );


    setText(
        "levelText",
        `${formatNumber(
            STATE.xp
        )} / ${formatNumber(
            current.max
        )} XP`
    );


    const progressBar =
        $("levelProgress");


    if(progressBar){

        progressBar.style.width =
            `${progress}%`;

    }

}


/* =========================================================
   DAILY REWARD UI
========================================================= */

function updateDailyReward(){

    const button =
        $("dailyRewardBtn");


    const card =
        $("dailyLoginCard");


    const status =
        $("loginRewardStatus");


    const text =
        $("dailyRewardText");


    if(STATE.dailyClaimed){

        if(button){

            button.disabled =
                true;

            button.innerHTML =
                `<i class="fa-solid fa-check"></i> Claimed`;

        }


        if(status){

            status.textContent =
                "Today's reward claimed";

        }


        if(text){

            text.textContent =
                "Come back tomorrow for your next reward.";

        }


        if(card){

            card.classList.add(
                "loading"
            );

        }

    }else{

        if(button){

            button.disabled =
                false;

            button.innerHTML =
                `<i class="fa-solid fa-gift"></i> Claim`;

        }


        if(status){

            status.textContent =
                "Check in today";

        }


        if(text){

            text.textContent =
                "Login today and collect your CHAPCY Points.";

        }


        if(card){

            card.classList.remove(
                "loading"
            );

        }

    }

}


/* =========================================================
   DAILY LOGIN CLAIM
========================================================= */

async function claimDailyLogin(){

    if(STATE.dailyClaimed){

        showToast(
            "Today's reward has already been claimed."
        );

        return;

    }


    const button =
        $("dailyRewardBtn");


    if(button){

        button.disabled =
            true;

        button.classList.add(
            "loading"
        );

        button.innerHTML =
            `<i class="fa-solid fa-spinner fa-spin"></i> Claiming...`;

    }


    try{

        const data =
            await apiRequest(
                API.daily,
                {
                    method:"POST",
                    body:{
                        reward:20
                    }
                }
            );


        if(data.user){

            applyUserData(
                data.user
            );

        }


        if(data.stats){

            applyStats(
                data.stats
            );

        }


        STATE.dailyClaimed =
            true;


        updateUI();


        showToast(
            data.message ||
            "Daily reward claimed! +20 Points"
        );


    }catch(error){

        console.error(error);


        showToast(
            error.message ||
            "Daily reward failed.",
            "error"
        );


        if(button){

            button.disabled =
                false;

        }

    }finally{

        if(button){

            button.classList.remove(
                "loading"
            );

        }

    }

}


window.claimDailyLogin =
    claimDailyLogin;


/* =========================================================
   REWARD ACTION
========================================================= */

async function rewardAction(type){

    const rewards = {

        watch:5,

        comment:3,

        reaction:1,

        profile:50

    };


    const amount =
        rewards[type];


    if(!amount){

        return;

    }


    try{

        const data =
            await apiRequest(
                API.rewards,
                {
                    method:"POST",

                    body:{
                        action:type,
                        reward:amount
                    }

                }
            );


        if(data.user){

            applyUserData(
                data.user
            );

        }


        if(data.stats){

            applyStats(
                data.stats
            );

        }


        updateUI();


        showToast(
            data.message ||
            `You earned +${amount} Points`
        );


    }catch(error){

        showToast(
            error.message ||
            "Reward action failed.",
            "error"
        );

    }

}


window.rewardAction =
    rewardAction;


/* =========================================================
   BUY POINTS
========================================================= */

async function buyPoints(
    points,
    price
){

    openModal(
        "buyPointsModal"
    );


    closeModal(
        "buyPointsModal"
    );


    const confirmed =
        await confirmTransaction(
            "Buy CHAPCY Points",
            `You selected ${formatNumber(points)} Points for TSh ${formatNumber(price)}. Continue to payment?`
        );


    if(!confirmed){

        return;

    }


    try{

        showToast(
            "Creating payment request..."
        );


        const data =
            await apiRequest(
                API.buyPoints,
                {
                    method:"POST",

                    body:{
                        points:points,
                        amount:price,
                        currency:"TZS"
                    }

                }
            );


        /*
           PHP can return payment URL,
           reference or instructions.
        */

        if(data.payment_url){

            window.location.href =
                data.payment_url;

            return;

        }


        if(data.user){

            applyUserData(
                data.user
            );

        }


        if(data.stats){

            applyStats(
                data.stats
            );

        }


        updateUI();


        showToast(
            data.message ||
            "Payment request created."
        );


    }catch(error){

        showToast(
            error.message ||
            "Unable to create payment.",
            "error"
        );

    }

}


window.buyPoints =
    buyPoints;


/* =========================================================
   BUY DATA BUNDLE
========================================================= */

async function buyBundle(
    bundle,
    points
){

    const confirmed =
        await confirmTransaction(
            "Buy Data Bundle",
            `Buy ${bundle} using ${formatNumber(points)} CHAPCY Points?`
        );


    if(!confirmed){

        return;

    }


    if(
        STATE.points <
        points
    ){

        showToast(
            "You do not have enough CHAPCY Points.",
            "error"
        );

        return;

    }


    try{

        showToast(
            "Processing bundle..."
        );


        const data =
            await apiRequest(
                API.buyBundle,
                {
                    method:"POST",

                    body:{
                        bundle:bundle,
                        points:points
                    }

                }
            );


        if(data.user){

            applyUserData(
                data.user
            );

        }


        if(data.stats){

            applyStats(
                data.stats
            );

        }


        updateUI();


        showToast(
            data.message ||
            `${bundle} bundle purchased successfully.`
        );


    }catch(error){

        showToast(
            error.message ||
            "Bundle purchase failed.",
            "error"
        );

    }

}


window.buyBundle =
    buyBundle;


/* =========================================================
   REDEEM
========================================================= */

async function redeemReward(
    type,
    value,
    points
){

    if(
        STATE.points <
        Number(points)
    ){

        showToast(
            "Insufficient CHAPCY Points.",
            "error"
        );

        return;

    }


    const confirmed =
        await confirmTransaction(
            "Confirm Redemption",
            `Use ${formatNumber(points)} CHAPCY Points for this reward?`
        );


    if(!confirmed){

        return;

    }


    try{

        showToast(
            "Processing redemption..."
        );


        const data =
            await apiRequest(
                API.redeem,
                {
                    method:"POST",

                    body:{
                        reward_type:type,
                        value:value,
                        points:points
                    }

                }
            );


        if(data.user){

            applyUserData(
                data.user
            );

        }


        if(data.stats){

            applyStats(
                data.stats
            );

        }


        updateUI();


        showToast(
            data.message ||
            "Reward redeemed successfully."
        );


    }catch(error){

        showToast(
            error.message ||
            "Redemption failed.",
            "error"
        );

    }

}


window.redeemReward =
    redeemReward;


/* =========================================================
   CONFIRM TRANSACTION
========================================================= */

function confirmTransaction(
    title,
    message
){

    return new Promise(
        resolve => {

            const modal =
                $("confirmModal");


            const titleElement =
                $("confirmTitle");


            const messageElement =
                $("confirmMessage");


            const button =
                $("confirmButton");


            if(
                !modal ||
                !titleElement ||
                !messageElement ||
                !button
            ){

                resolve(
                    window.confirm(
                        message
                    )
                );

                return;

            }


            titleElement.textContent =
                title;


            messageElement.textContent =
                message;


            openModal(
                "confirmModal"
            );


            const handler = () => {

                button.removeEventListener(
                    "click",
                    handler
                );


                closeModal(
                    "confirmModal"
                );


                resolve(true);

            };


            button.addEventListener(
                "click",
                handler
            );


            modal.dataset.cancelled =
                "false";

        }
    );

}


/* =========================================================
   BUY POINTS MODAL
========================================================= */

function openBuyPoints(){

    openModal(
        "buyPointsModal"
    );

}


window.openBuyPoints =
    openBuyPoints;


/* =========================================================
   HISTORY
========================================================= */

async function openHistory(){

    openModal(
        "historyModal"
    );


    const list =
        $("historyList");


    if(!list) return;


    list.innerHTML = `

        <div class="empty-history">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <p>
                Loading transactions...
            </p>

        </div>

    `;


    try{

        const data =
            await apiRequest(
                API.history,
                {
                    method:"POST"
                }
            );


        const history =
            data.transactions ||
            data.history ||
            [];


        STATE.history =
            history;


        renderHistory(
            history
        );


    }catch(error){

        console.error(error);


        list.innerHTML = `

            <div class="empty-history">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <p>
                    Unable to load history.
                </p>

            </div>

        `;

    }

}


window.openHistory =
    openHistory;


/* =========================================================
   RENDER HISTORY
========================================================= */

function renderHistory(
    history
){

    const list =
        $("historyList");


    if(!list) return;


    if(!history.length){

        list.innerHTML = `

            <div class="empty-history">

                <i class="fa-solid fa-receipt"></i>

                <p>
                    No transactions yet.
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML =
        history.map(
            transaction => {

                const points =
                    Number(
                        transaction.points ??
                        0
                    );


                const isPlus =
                    points > 0;


                const icon =
                    transaction.icon ||
                    (
                        isPlus
                        ? "fa-plus"
                        : "fa-minus"
                    );


                const date =
                    transaction.created_at
                    ? formatDate(
                        transaction.created_at
                    )
                    : "";


                return `

                    <div class="history-item">

                        <div class="history-icon">

                            <i class="fa-solid ${icon}"></i>

                        </div>


                        <div class="history-info">

                            <strong>
                                ${
                                    escapeHTML(
                                        transaction.description ||
                                        transaction.type ||
                                        "CHAPCY Transaction"
                                    )
                                }
                            </strong>

                            <small>
                                ${date}
                            </small>

                        </div>


                        <div class="
                            history-points
                            ${isPlus ? "plus" : "minus"}
                        ">

                            ${
                                isPlus
                                ? "+"
                                : ""
                            }

                            ${formatNumber(points)}

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   DATE
========================================================= */

function formatDate(
    date
){

    const parsed =
        new Date(date);


    if(
        Number.isNaN(
            parsed.getTime()
        )
    ){

        return date;

    }


    return parsed.toLocaleString(
        "en-TZ",
        {
            day:"2-digit",
            month:"short",
            year:"numeric",
            hour:"2-digit",
            minute:"2-digit"
        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
){

    return String(value)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");

}


/* =========================================================
   REFERRAL
========================================================= */

function openReferral(){

    const section =
        document.querySelector(
            ".referral-card"
        );


    if(section){

        section.scrollIntoView({
            behavior:"smooth",
            block:"center"
        });

    }

}


window.openReferral =
    openReferral;


/* =========================================================
   COPY REFERRAL
========================================================= */

async function copyReferral(){

    const element =
        $("referralCode");


    if(!element) return;


    const code =
        element.textContent.trim();


    try{

        await navigator.clipboard.writeText(
            code
        );


        showToast(
            "Referral code copied."
        );

    }catch(error){

        showToast(
            "Unable to copy referral code.",
            "error"
        );

    }

}


window.copyReferral =
    copyReferral;


/* =========================================================
   SHARE REFERRAL
========================================================= */

async function shareReferral(){

    const element =
        $("referralCode");


    const code =
        element
        ? element.textContent.trim()
        : "CHAPCY2026";


    const shareData = {

        title:
            "Join CHAPCY",

        text:
            `Join me on CHAPCY and earn rewards. My referral code is ${code}.`

    };


    try{

        if(
            navigator.share
        ){

            await navigator.share(
                shareData
            );

        }else{

            await navigator.clipboard.writeText(
                shareData.text
            );


            showToast(
                "Invite message copied."
            );

        }

    }catch(error){

        if(
            error.name !==
            "AbortError"
        ){

            showToast(
                "Unable to share invite.",
                "error"
            );

        }

    }

}


window.shareReferral =
    shareReferral;


/* =========================================================
   MYSTERY BOX
========================================================= */

function openMysteryBox(){

    showToast(
        "Mystery Box system is ready for PHP connection."
    );

}


window.openMysteryBox =
    openMysteryBox;


/* =========================================================
   AUTH READY
========================================================= */

window.addEventListener(
    "chapcyUserReady",
    event => {

        const user =
            event.detail;


        if(user){

            window.CHAPCY_CURRENT_USER =
                user;

        }


        loadRewards();

    }
);


/* =========================================================
   SIGNED OUT
========================================================= */

window.addEventListener(
    "chapcyUserSignedOut",
    () => {

        STATE.userId =
            null;

        STATE.points =
            0;

        STATE.earned =
            0;

        STATE.spent =
            0;

        STATE.pending =
            0;

        STATE.streak =
            0;

        STATE.dailyClaimed =
            false;


        updateUI();


        showToast(
            "Please login to use CHAPCY Rewards.",
            "error"
        );

    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key !==
            "Escape"
        ){

            return;

        }


        const modal =
            document.querySelector(
                ".modal.active"
            );


        if(modal){

            closeModal(
                modal.id
            );

        }

    }
);


/* =========================================================
   PREVENT DOUBLE SUBMIT
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button"
            );


        if(!button) return;


        if(
            button.dataset.processing ===
            "true"
        ){

            event.preventDefault();

            return;

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateUI();


        /*
           If Firebase has already
           initialized before this script.
        */

        if(
            window.CHAPCY_CURRENT_USER
        ){

            loadRewards();

        }

    }
);
```
