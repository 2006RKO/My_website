"use strict";


/* =====================================================
   CHAPCY WORLDWIDE REWARDS
===================================================== */


/* =====================================================
   USER WALLET
===================================================== */

const wallet = {

    balance: 0,

    points: 0,

    coins: 0,

    streak: 0,

    xp: 0,

    level: 1,

    name: "CHAPCY User",

    phone: "",

    countryCode: "",

    countryName: "Worldwide",

    currencyCode: "USD",

    currencySymbol: "$"

};


/* =====================================================
   CURRENCY DATABASE
===================================================== */

const CURRENCIES = {

    TZ: {
        country: "Tanzania",
        currency: "TZS",
        symbol: "TSh",
        flag: "🇹🇿"
    },

    KE: {
        country: "Kenya",
        currency: "KES",
        symbol: "KSh",
        flag: "🇰🇪"
    },

    UG: {
        country: "Uganda",
        currency: "UGX",
        symbol: "USh",
        flag: "🇺🇬"
    },

    RW: {
        country: "Rwanda",
        currency: "RWF",
        symbol: "FRw",
        flag: "🇷🇼"
    },

    BI: {
        country: "Burundi",
        currency: "BIF",
        symbol: "FBu",
        flag: "🇧🇮"
    },

    NG: {
        country: "Nigeria",
        currency: "NGN",
        symbol: "₦",
        flag: "🇳🇬"
    },

    GH: {
        country: "Ghana",
        currency: "GHS",
        symbol: "GH₵",
        flag: "🇬🇭"
    },

    ZA: {
        country: "South Africa",
        currency: "ZAR",
        symbol: "R",
        flag: "🇿🇦"
    },

    US: {
        country: "United States",
        currency: "USD",
        symbol: "$",
        flag: "🇺🇸"
    },

    CA: {
        country: "Canada",
        currency: "CAD",
        symbol: "C$",
        flag: "🇨🇦"
    },

    GB: {
        country: "United Kingdom",
        currency: "GBP",
        symbol: "£",
        flag: "🇬🇧"
    },

    DE: {
        country: "Germany",
        currency: "EUR",
        symbol: "€",
        flag: "🇩🇪"
    },

    FR: {
        country: "France",
        currency: "EUR",
        symbol: "€",
        flag: "🇫🇷"
    },

    IT: {
        country: "Italy",
        currency: "EUR",
        symbol: "€",
        flag: "🇮🇹"
    },

    ES: {
        country: "Spain",
        currency: "EUR",
        symbol: "€",
        flag: "🇪🇸"
    },

    IN: {
        country: "India",
        currency: "INR",
        symbol: "₹",
        flag: "🇮🇳"
    },

    CN: {
        country: "China",
        currency: "CNY",
        symbol: "¥",
        flag: "🇨🇳"
    },

    JP: {
        country: "Japan",
        currency: "JPY",
        symbol: "¥",
        flag: "🇯🇵"
    },

    AE: {
        country: "United Arab Emirates",
        currency: "AED",
        symbol: "د.إ",
        flag: "🇦🇪"
    },

    SA: {
        country: "Saudi Arabia",
        currency: "SAR",
        symbol: "﷼",
        flag: "🇸🇦"
    },

    AU: {
        country: "Australia",
        currency: "AUD",
        symbol: "A$",
        flag: "🇦🇺"
    },

    NZ: {
        country: "New Zealand",
        currency: "NZD",
        symbol: "NZ$",
        flag: "🇳🇿"
    },

    BR: {
        country: "Brazil",
        currency: "BRL",
        symbol: "R$",
        flag: "🇧🇷"
    },

    MX: {
        country: "Mexico",
        currency: "MXN",
        symbol: "MX$",
        flag: "🇲🇽"
    }
};


/* =====================================================
   STATE
===================================================== */

let balanceVisible = true;

let selectedNetwork = "Vodacom";

let toastTimer = null;


/* =====================================================
   NUMBER FORMAT
===================================================== */

function formatNumber(number){

    return new Intl.NumberFormat(
        "en-US",
        {
            maximumFractionDigits:2
        }
    ).format(
        Number(number || 0)
    );

}


/* =====================================================
   FORMAT MONEY
===================================================== */

function formatMoney(amount){

    return `${wallet.currencySymbol} ${formatNumber(amount)}`;

}


/* =====================================================
   LOAD WALLET
===================================================== */

async function loadWallet(){

    const refresh =
        document.querySelector(".wallet-refresh");

    try{

        if(refresh){

            refresh.classList.add("loading");
        }


        const response = await fetch(
            "wallet.php",
            {
                method:"GET",

                credentials:"same-origin",

                cache:"no-store",

                headers:{
                    "Accept":"application/json"
                }
            }
        );


        if(!response.ok){

            throw new Error(
                `Wallet server returned ${response.status}`
            );
        }


        const data =
            await response.json();


        if(!data.success){

            throw new Error(
                data.message ||
                "Unable to load wallet."
            );
        }


        /*
         * REAL DATABASE VALUES
         */

        wallet.balance =
            Number(data.balance || 0);


        wallet.points =
            Number(
                data.points ??
                data.chapcy_points ??
                0
            );


        wallet.coins =
            Number(data.coins || 0);


        wallet.streak =
            Number(
                data.streak ??
                data.login_streak ??
                0
            );


        wallet.xp =
            Number(data.xp || 0);


        wallet.level =
            Number(data.level || 1);


        wallet.name =
            data.name ||
            "CHAPCY User";


        wallet.phone =
            data.phone ||
            "";


        wallet.countryCode =
            String(
                data.country_code ||
                ""
            ).toUpperCase();


        /*
         * Currency comes from PHP/database.
         * If PHP doesn't send it, use country map.
         */

        const countryCurrency =
            CURRENCIES[
                wallet.countryCode
            ];


        wallet.countryName =
            data.country_name ||
            countryCurrency?.country ||
            "Worldwide";


        wallet.currencyCode =
            data.currency_code ||
            countryCurrency?.currency ||
            "USD";


        wallet.currencySymbol =
            data.currency_symbol ||
            countryCurrency?.symbol ||
            "$";


        updateAll();


        showToast(
            "Wallet updated successfully.",
            "success"
        );


    }catch(error){

        console.error(
            "CHAPCY WALLET:",
            error
        );


        /*
         * IMPORTANT:
         * No fake balance is inserted here.
         */

        showToast(
            "Unable to load your wallet. Check your login/session.",
            "error"
        );


    }finally{

        if(refresh){

            refresh.classList.remove("loading");
        }

    }

}


/* =====================================================
   UPDATE EVERYTHING
===================================================== */

function updateAll(){

    updateWallet();

    updatePoints();

    updateCoins();

    updateStreak();

    updateLevel();

    updatePrices();

}


/* =====================================================
   UPDATE WALLET
===================================================== */

function updateWallet(){

    const balance =
        document.getElementById(
            "walletBalance"
        );


    if(balance){

        if(balanceVisible){

            balance.textContent =
                formatNumber(
                    wallet.balance
                );

        }else{

            balance.textContent =
                "••••••";
        }

    }


    const symbol =
        document.getElementById(
            "currencySymbol"
        );


    if(symbol){

        symbol.textContent =
            wallet.currencySymbol;
    }


    const code =
        document.getElementById(
            "currencyCode"
        );


    if(code){

        code.textContent =
            wallet.currencyCode;
    }


    const countryInfo =
        CURRENCIES[
            wallet.countryCode
        ];


    const flag =
        countryInfo?.flag ||
        "🌍";


    const country =
        document.getElementById(
            "balanceCountry"
        );


    if(country){

        country.textContent =
            `${flag} ${wallet.countryName}`;
    }


    const headerCountry =
        document.getElementById(
            "walletCountryText"
        );


    if(headerCountry){

        headerCountry.textContent =
            `${flag} ${wallet.countryName} Account`;
    }


    const userName =
        document.getElementById(
            "walletUserName"
        );


    if(userName){

        userName.textContent =
            wallet.name;
    }


    const phone =
        document.getElementById(
            "walletPhone"
        );


    if(phone){

        phone.textContent =
            wallet.phone ||
            `${wallet.countryName} Account`;
    }


    const noticeTitle =
        document.getElementById(
            "currencyNoticeTitle"
        );


    if(noticeTitle){

        noticeTitle.textContent =
            `${wallet.countryName} Wallet`;
    }


    const noticeText =
        document.getElementById(
            "currencyNoticeText"
        );


    if(noticeText){

        noticeText.textContent =
            `Your wallet displays ${wallet.currencyCode} based on the country used during registration.`;
    }


    updateEye();

}


/* =====================================================
   EYE
===================================================== */

function toggleWalletBalance(){

    balanceVisible =
        !balanceVisible;

    updateWallet();

}


function updateEye(){

    const icon =
        document.getElementById(
            "walletEyeIcon"
        );


    if(!icon) return;


    icon.className =
        balanceVisible

        ? "fa-solid fa-eye"

        : "fa-solid fa-eye-slash";

}


/* =====================================================
   POINTS
===================================================== */

function updatePoints(){

    const element =
        document.getElementById(
            "pointsBalance"
        );


    if(element){

        element.textContent =
            formatNumber(
                wallet.points
            );
    }

}


/* =====================================================
   COINS
===================================================== */

function updateCoins(){

    const element =
        document.getElementById(
            "coinsBalance"
        );


    if(element){

        element.textContent =
            formatNumber(
                wallet.coins
            );
    }

}


/* =====================================================
   STREAK
===================================================== */

function updateStreak(){

    const element =
        document.getElementById(
            "streakDays"
        );


    if(element){

        element.textContent =
            formatNumber(
                wallet.streak
            );
    }

}


/* =====================================================
   LEVEL / XP
===================================================== */

function updateLevel(){

    const level =
        document.getElementById(
            "levelName"
        );


    const xpText =
        document.getElementById(
            "xpText"
        );


    const progress =
        document.getElementById(
            "xpProgress"
        );


    const currentXP =
        Number(wallet.xp || 0);


    const currentLevel =
        Number(wallet.level || 1);


    const xpNeeded =
        currentLevel * 100;


    const percentage =
        Math.min(
            100,
            (currentXP / xpNeeded) * 100
        );


    if(level){

        const names = [
            "Bronze",
            "Silver",
            "Gold",
            "Platinum",
            "Diamond",
            "Legend"
        ];


        level.textContent =
            names[
                Math.min(
                    currentLevel - 1,
                    names.length - 1
                )
            ] ||
            `Level ${currentLevel}`;
    }


    if(xpText){

        xpText.textContent =
            `${currentXP} / ${xpNeeded} XP`;
    }


    if(progress){

        progress.style.width =
            `${percentage}%`;
    }

}


/* =====================================================
   UPDATE ALL MONEY PRICES
===================================================== */

function updatePrices(){

    /*
     * IMPORTANT:
     * These prices are converted for display.
     *
     * The actual payment amount should be
     * calculated/validated by PHP/payment backend.
     */

    document
        .querySelectorAll(
            "[data-money-price]"
        )
        .forEach(element => {

            const base =
                Number(
                    element.dataset.moneyPrice
                );


            element.textContent =
                formatMoney(
                    getLocalizedPrice(base)
                );

        });


    document
        .querySelectorAll(
            ".bundle-price[data-price]"
        )
        .forEach(element => {

            const base =
                Number(
                    element.dataset.price
                );


            element.textContent =
                formatMoney(
                    getLocalizedPrice(base)
                );

        });

}


/* =====================================================
   WORLDWIDE DISPLAY PRICE
===================================================== */

function getLocalizedPrice(baseTZS){

    /*
     * CHAPCY base prices are currently defined
     * in TZS.
     *
     * The backend should eventually provide
     * the official country price table.
     *
     * This front-end map is only for display.
     */

    const rates = {

        TZS:1,

        KES:0.052,

        UGX:0.47,

        RWF:0.35,

        BIF:0.60,

        NGN:0.30,

        GHS:0.0060,

        ZAR:0.0062,

        USD:0.00039,

        CAD:0.00053,

        GBP:0.00030,

        EUR:0.00036,

        INR:0.033,

        CNY:0.0028,

        JPY:0.056,

        AED:0.00143,

        SAR:0.00146,

        AUD:0.00060,

        NZD:0.00064,

        BRL:0.0021,

        MXN:0.0074

    };


    const rate =
        rates[
            wallet.currencyCode
        ] ?? 1;


    return baseTZS * rate;

}


/* =====================================================
   REFRESH
===================================================== */

function refreshWallet(){

    loadWallet();

}


/* =====================================================
   NETWORK
===================================================== */

function selectNetwork(button){

    document
        .querySelectorAll(".network")
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });


    button.classList.add("active");


    selectedNetwork =
        button.dataset.network;


    const selected =
        document.getElementById(
            "selectedNetwork"
        );


    if(selected){

        selected.textContent =
            selectedNetwork;
    }

}


/* =====================================================
   BUY DATA
===================================================== */

function buyData(dataSize, pointsCost){

    const phone =
        document
        .getElementById("dataPhone")
        ?.value
        .trim();


    if(!phone){

        showToast(
            "Enter the phone number first.",
            "error"
        );

        return;
    }


    if(wallet.points < pointsCost){

        showToast(
            "You do not have enough CHAPCY Points.",
            "error"
        );

        return;
    }


    /*
     * Front-end confirmation only.
     *
     * Actual deduction and data delivery
     * must happen through secure PHP/API.
     */

    showToast(
        `${dataSize} selected for ${selectedNetwork}.`,
        "success"
    );

}


/* =====================================================
   BUY POINTS
===================================================== */

function buyPoints(points, priceTZS){

    const displayPrice =
        formatMoney(
            getLocalizedPrice(priceTZS)
        );


    showActionModal(

        "Buy CHAPCY Points",

        `You selected ${formatNumber(points)} Points for ${displayPrice}. Payment will use your account's local currency.`,

        "fa-solid fa-star"

    );

}


/* =====================================================
   BUNDLES
===================================================== */

function buyBundle(
    name,
    priceTZS,
    coins,
    points,
    data
){

    const price =
        formatMoney(
            getLocalizedPrice(priceTZS)
        );


    showActionModal(

        `CHAPCY ${name}`,

        `${price} gives you +${formatNumber(coins)} Coins, +${formatNumber(points)} Points and ${data}.`,

        "fa-solid fa-gift"

    );

}


/* =====================================================
   COIN INFO
===================================================== */

function showCoinInfo(){

    showActionModal(

        "CHAPCY Coins",

        "Coins are the everyday CHAPCY currency used for eligible chat, group, gift and reaction features.",

        "fa-solid fa-coins"

    );

}


/* =====================================================
   DROP
===================================================== */

function openDrop(){

    showActionModal(

        "CHAPCY Drop",

        "Use your rare CHAPCY Points for eligible shopping discounts and special benefits.",

        "fa-solid fa-bag-shopping"

    );

}


/* =====================================================
   MYSTERY BOX
===================================================== */

function openMysteryBox(){

    const modal =
        document.getElementById(
            "mysteryModal"
        );


    if(modal){

        modal.classList.add(
            "active"
        );
    }

}


function closeMystery(){

    const modal =
        document.getElementById(
            "mysteryModal"
        );


    if(modal){

        modal.classList.remove(
            "active"
        );
    }

}


function claimMystery(){

    if(wallet.coins < 50){

        showToast(
            "You need 50 Coins to open the Mystery Box.",
            "error"
        );

        return;
    }


    const rewards = [

        "1 CHAPCY Point",

        "2 CHAPCY Points",

        "3 CHAPCY Points",

        "5 CHAPCY Points",

        "10 Coins",

        "25 Coins"

    ];


    const result =
        rewards[
            Math.floor(
                Math.random() *
                rewards.length
            )
        ];


    const resultElement =
        document.getElementById(
            "mysteryResult"
        );


    if(resultElement){

        resultElement.textContent =
            `Your mystery reward: ${result}`;
    }


    showToast(
        "Mystery Box opened.",
        "success"
    );

}


/* =====================================================
   HISTORY
===================================================== */

function openHistory(){

    const modal =
        document.getElementById(
            "historyModal"
        );


    if(modal){

        modal.classList.add(
            "active"
        );
    }


    loadTransactions();

}


function closeHistory(){

    const modal =
        document.getElementById(
            "historyModal"
        );


    if(modal){

        modal.classList.remove(
            "active"
        );
    }

}


/* =====================================================
   TRANSACTIONS
===================================================== */

async function loadTransactions(){

    const list =
        document.getElementById(
            "historyList"
        );


    if(!list) return;


    list.innerHTML =
        `
        <div class="history-empty">
            Loading transactions...
        </div>
        `;


    try{

        const response =
            await fetch(
                "wallet_transactions.php",
                {
                    method:"GET",
                    credentials:"same-origin",
                    cache:"no-store"
                }
            );


        if(!response.ok){

            throw new Error(
                "Transactions unavailable"
            );
        }


        const data =
            await response.json();


        if(
            !data.success ||
            !Array.isArray(data.transactions) ||
            data.transactions.length === 0
        ){

            list.innerHTML =
                `
                <div class="history-empty">
                    No transactions yet.
                </div>
                `;

            return;
        }


        list.innerHTML =
            data.transactions
            .map(transaction => {

                const amount =
                    Number(
                        transaction.amount || 0
                    );


                return `
                    <div class="transaction-item">

                        <div class="transaction-icon">

                            <i class="fa-solid fa-receipt"></i>

                        </div>

                        <div class="transaction-info">

                            <strong>
                                ${escapeHTML(
                                    transaction.title ||
                                    "Transaction"
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    transaction.created_at ||
                                    ""
                                )}
                            </span>

                        </div>

                        <div class="transaction-amount">

                            ${transaction.type === "credit" ? "+" : "-"}
                            ${formatMoney(amount)}

                        </div>

                    </div>
                `;

            })
            .join("");


    }catch(error){

        console.error(error);


        list.innerHTML =
            `
            <div class="history-empty">
                Transaction history is not available yet.
            </div>
            `;

    }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value){

    return String(value ?? "")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");

}


/* =====================================================
   RECENT TRANSACTIONS
===================================================== */

async function loadRecentTransactions(){

    const container =
        document.getElementById(
            "recentTransactions"
        );


    if(!container) return;


    try{

        const response =
            await fetch(
                "wallet_transactions.php",
                {
                    credentials:"same-origin",
                    cache:"no-store"
                }
            );


        if(!response.ok){

            throw new Error();
        }


        const data =
            await response.json();


        if(
            !data.success ||
            !data.transactions?.length
        ){

            container.innerHTML =
                `
                <div class="empty-transactions">
                    No transactions yet.
                </div>
                `;

            return;
        }


        container.innerHTML =
            data.transactions
            .slice(0,5)
            .map(transaction => {

                const amount =
                    Number(
                        transaction.amount || 0
                    );


                return `

                    <div class="transaction-item">

                        <div class="transaction-icon">

                            <i class="fa-solid fa-receipt"></i>

                        </div>


                        <div class="transaction-info">

                            <strong>
                                ${escapeHTML(
                                    transaction.title ||
                                    "Transaction"
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    transaction.created_at ||
                                    ""
                                )}
                            </span>

                        </div>


                        <div class="transaction-amount">

                            ${transaction.type === "credit" ? "+" : "-"}

                            ${formatMoney(amount)}

                        </div>

                    </div>

                `;

            })
            .join("");


    }catch(error){

        container.innerHTML =
            `
            <div class="empty-transactions">
                No transactions yet.
            </div>
            `;

    }

}


/* =====================================================
   CHALLENGE
===================================================== */

function completeChallenge(
    button,
    points,
    coins
){

    if(
        button.classList.contains(
            "completed"
        )
    ){

        return;
    }


    button.classList.add(
        "completed"
    );


    button.textContent =
        "Completed ✓";


    showToast(
        `Challenge completed: +${points} Point(s) +${coins} Coins.`,
        "success"
    );

}


/* =====================================================
   ACTION MODAL
===================================================== */

function showActionModal(
    title,
    text,
    icon
){

    const modal =
        document.getElementById(
            "actionModal"
        );


    const titleElement =
        document.getElementById(
            "actionModalTitle"
        );


    const textElement =
        document.getElementById(
            "actionModalText"
        );


    const iconElement =
        document.getElementById(
            "actionModalIcon"
        );


    if(titleElement){

        titleElement.textContent =
            title;
    }


    if(textElement){

        textElement.textContent =
            text;
    }


    if(iconElement){

        iconElement.className =
            icon ||
            "fa-solid fa-wallet";
    }


    if(modal){

        modal.classList.add(
            "active"
        );
    }

}


function closeActionModal(){

    const modal =
        document.getElementById(
            "actionModal"
        );


    if(modal){

        modal.classList.remove(
            "active"
        );
    }

}


/* =====================================================
   WALLET ACTION
===================================================== */

function openWalletAction(type){

    if(type === "deposit"){

        showActionModal(

            "Add Money",

            `Add money to your CHAPCY wallet using ${wallet.currencyCode}.`,

            "fa-solid fa-wallet"

        );

        return;
    }


    if(type === "transfer"){

        showActionModal(

            "Transfer Money",

            `Transfer money from your ${wallet.currencyCode} CHAPCY wallet.`,

            "fa-solid fa-paper-plane"

        );

    }

}


/* =====================================================
   SCROLL
===================================================== */

function scrollToSection(id){

    const section =
        document.getElementById(id);


    if(section){

        section.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

    }

}


/* =====================================================
   REFERRAL
===================================================== */

async function copyReferral(){

    const code =
        "CHAPCY2026";


    try{

        await navigator.clipboard.writeText(
            code
        );


        showToast(
            "Referral code copied.",
            "success"
        );


    }catch(error){

        showToast(
            code,
            "success"
        );

    }

}


/* =====================================================
   TOAST
===================================================== */

function showToast(
    message,
    type="success"
){

    const toast =
        document.getElementById(
            "toast"
        );


    const messageElement =
        document.getElementById(
            "toastMessage"
        );


    const icon =
        document.getElementById(
            "toastIcon"
        );


    if(!toast || !messageElement){

        return;
    }


    messageElement.textContent =
        message;


    if(icon){

        icon.className =
            type === "error"

            ? "fa-solid fa-circle-exclamation"

            : "fa-solid fa-circle-check";

    }


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3200
        );

}


/* =====================================================
   BACK
===================================================== */

function goBack(){

    if(
        window.history.length > 1
    ){

        window.history.back();

    }else{

        window.location.href =
            "chapcy.html";

    }

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadWallet();

        loadRecentTransactions();

    }
);


/* =====================================================
   GLOBAL EXPORTS
===================================================== */

window.goBack =
    goBack;

window.openHistory =
    openHistory;

window.closeHistory =
    closeHistory;

window.refreshWallet =
    refreshWallet;

window.toggleWalletBalance =
    toggleWalletBalance;

window.selectNetwork =
    selectNetwork;

window.buyData =
    buyData;

window.buyPoints =
    buyPoints;

window.buyBundle =
    buyBundle;

window.showCoinInfo =
    showCoinInfo;

window.openDrop =
    openDrop;

window.openMysteryBox =
    openMysteryBox;

window.closeMystery =
    closeMystery;

window.claimMystery =
    claimMystery;

window.completeChallenge =
    completeChallenge;

window.scrollToSection =
    scrollToSection;

window.copyReferral =
    copyReferral;

window.openWalletAction =
    openWalletAction;

window.closeActionModal =
    closeActionModal;
