/* =========================================================
   CHAPCY REWARDS — JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const backBtn = document.getElementById("rewardsBack");

    const coinBalance = document.getElementById("coinBalance");
    const heroCoinBalance = document.getElementById("heroCoinBalance");

    const coinAdd = document.getElementById("coinAdd");

    const profileBtn = document.getElementById("rewardProfile");

    const notificationBtn =
        document.getElementById("rewardNotification");

    const rewardNavs =
        document.querySelectorAll(".reward-nav");

    const claimButtons =
        document.querySelectorAll(".claim-btn");


    /* =====================================================
       COIN BALANCE
    ===================================================== */

    let balance =
        Number(localStorage.getItem("chapcyCoins")) || 12850;


    function formatCoins(number) {

        return number.toLocaleString("en-US");

    }


    function updateBalance() {

        const formatted =
            formatCoins(balance);

        if (coinBalance) {
            coinBalance.textContent = formatted;
        }

        if (heroCoinBalance) {
            heroCoinBalance.textContent = formatted;
        }

        localStorage.setItem(
            "chapcyCoins",
            balance
        );
    }


    updateBalance();


    /* =====================================================
       BACK BUTTON
    ===================================================== */

    if (backBtn) {

        backBtn.addEventListener("click", () => {

            if (window.history.length > 1) {

                window.history.back();

            } else {

                window.location.href = "index.html";

            }

        });

    }


    /* =====================================================
       ADD COINS
    ===================================================== */

    if (coinAdd) {

        coinAdd.addEventListener("click", () => {

            coinAdd.classList.add("coin-pulse");

            setTimeout(() => {

                coinAdd.classList.remove(
                    "coin-pulse"
                );

            }, 500);


            showRewardMessage(
                "Coin Store",
                "Coin purchase will be available soon."
            );

        });

    }


    /* =====================================================
       PROFILE
    ===================================================== */

    if (profileBtn) {

        profileBtn.addEventListener("click", () => {

            window.location.href = "profile.html";

        });

    }


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            () => {

                showRewardMessage(
                    "Notifications",
                    "You have 3 new notifications."
                );

            }
        );

    }


    /* =====================================================
       REWARD NAVIGATION
    ===================================================== */

    rewardNavs.forEach((nav) => {

        nav.addEventListener("click", () => {

            rewardNavs.forEach(item => {

                item.classList.remove("active");

            });

            nav.classList.add("active");


            const text =
                nav.querySelector("span")?.textContent
                || "Rewards";


            if (text === "Leaderboard") {

                showRewardMessage(
                    "Leaderboard",
                    "Leaderboard page coming soon."
                );

            }

            else if (text === "Challenges") {

                showRewardMessage(
                    "Challenges",
                    "New challenges are coming soon."
                );

            }

            else if (text === "History") {

                showRewardMessage(
                    "Reward History",
                    "Your reward history will appear here."
                );

            }

        });

    });


    /* =====================================================
       CLAIM REWARD
    ===================================================== */

    claimButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const card =
                button.closest(".reward-card");

            if (!card) return;


            const priceElement =
                card.querySelector(".reward-price strong");

            const titleElement =
                card.querySelector(".reward-card-body h3");


            const price =
                Number(
                    priceElement?.textContent
                    .replace(/,/g, "")
                ) || 0;


            const rewardName =
                titleElement?.textContent.trim()
                || "Reward";


            /* ================================
               ALREADY CLAIMED
            ================================= */

            if (button.classList.contains("claimed")) {

                return;

            }


            /* ================================
               NOT ENOUGH COINS
            ================================= */

            if (balance < price) {

                showRewardMessage(
                    "Not Enough Coins",
                    `You need ${formatCoins(price - balance)} more coins.`
                );

                card.classList.add(
                    "insufficient"
                );

                setTimeout(() => {

                    card.classList.remove(
                        "insufficient"
                    );

                }, 500);

                return;

            }


            /* ================================
               DEDUCT COINS
            ================================= */

            balance -= price;

            updateBalance();


            /* ================================
               BUTTON
            ================================= */

            button.classList.add("claimed");

            button.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Claimed
            `;


            button.disabled = true;


            /* ================================
               CARD ANIMATION
            ================================= */

            card.classList.add(
                "reward-claimed"
            );


            createCoinsAnimation(card);


            /* ================================
               SUCCESS MESSAGE
            ================================= */

            showRewardMessage(
                "Reward Claimed! 🎉",
                `${rewardName} has been added to your rewards.`
            );


            setTimeout(() => {

                card.classList.remove(
                    "reward-claimed"
                );

            }, 900);

        });

    });


    /* =====================================================
       MESSAGE POPUP
    ===================================================== */

    function showRewardMessage(title, message) {

        const old =
            document.querySelector(
                ".reward-toast"
            );

        if (old) {

            old.remove();

        }


        const toast =
            document.createElement("div");


        toast.className =
            "reward-toast";


        toast.innerHTML = `

            <div class="toast-icon">
                <i class="fa-solid fa-sparkles"></i>
            </div>

            <div class="toast-content">

                <strong>
                    ${title}
                </strong>

                <span>
                    ${message}
                </span>

            </div>

            <button class="toast-close">
                <i class="fa-solid fa-xmark"></i>
            </button>

        `;


        document.body.appendChild(toast);


        requestAnimationFrame(() => {

            toast.classList.add(
                "show"
            );

        });


        const close =
            toast.querySelector(
                ".toast-close"
            );


        close.addEventListener(
            "click",
            () => removeToast(toast)
        );


        setTimeout(() => {

            removeToast(toast);

        }, 4500);

    }


    function removeToast(toast) {

        if (!toast) return;

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 400);

    }


    /* =====================================================
       COIN PARTICLES
    ===================================================== */

    function createCoinsAnimation(card) {

        const rect =
            card.getBoundingClientRect();


        for (let i = 0; i < 12; i++) {

            const coin =
                document.createElement("span");


            coin.className =
                "reward-coin-particle";


            coin.innerHTML =
                '<i class="fa-solid fa-star"></i>';


            coin.style.left =
                `${rect.left + rect.width / 2}px`;


            coin.style.top =
                `${rect.top + 100}px`;


            coin.style.setProperty(
                "--x",
                `${(Math.random() - .5) * 220}px`
            );


            coin.style.setProperty(
                "--y",
                `${-80 - Math.random() * 180}px`
            );


            document.body.appendChild(
                coin
            );


            setTimeout(() => {

                coin.remove();

            }, 1000);

        }

    }


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                const toast =
                    document.querySelector(
                        ".reward-toast"
                    );

                if (toast) {

                    removeToast(toast);

                }

            }

        }
    );

});
