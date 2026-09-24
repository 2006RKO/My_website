```javascript
/* =========================================================
   CHAPCY NOTIFICATION ENGINE
   LIVE COMMUNITY + TRANSACTIONS + REWARDS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    let firebaseReady = false;
    let currentUser = null;
    let unsubscribeNotifications = null;

    const notificationsList =
        document.getElementById("notificationsList");

    const loadingState =
        document.getElementById("loadingState");

    const emptyState =
        document.getElementById("emptyState");

    const unreadText =
        document.getElementById("unreadText");

    const unreadCount =
        document.getElementById("unreadCount");

    const allCount =
        document.getElementById("allCount");

    const headerUnreadBadge =
        document.getElementById("headerUnreadBadge");

    const markAllBtn =
        document.getElementById("markAllBtn");

    const backBtn =
        document.getElementById("backBtn");


    /* =====================================================
       BACK BUTTON
    ===================================================== */

    backBtn?.addEventListener("click", () => {

        if (document.referrer) {
            history.back();
        } else {
            window.location.href = "chapcy.html";
        }

    });


    /* =====================================================
       FIREBASE READY
    ===================================================== */

    window.addEventListener(
        "chapcyUserReady",
        async (event) => {

            currentUser =
                event.detail?.user || null;

            firebaseReady = true;

            await startNotifications();

        }
    );


    /* =====================================================
       USER SIGNED OUT
    ===================================================== */

    window.addEventListener(
        "chapcyUserSignedOut",
        () => {

            currentUser = null;

            stopNotifications();

            showEmpty(
                "Login required",
                "Please login to view your CHAPCY notifications."
            );

        }
    );


    /* =====================================================
       START NOTIFICATIONS
    ===================================================== */

    async function startNotifications(){

        if (!firebaseReady) return;

        if (!currentUser){

            showEmpty(
                "No user",
                "Please login to CHAPCY."
            );

            return;
        }


        try{

            const firebase =
                window.CHAPCY_FIREBASE;

            if (!firebase){

                throw new Error(
                    "CHAPCY Firebase is not available."
                );

            }


            const {
                db
            } = firebase;


            /*
             * Firebase Firestore imports
             */

            const {
                collection,
                query,
                orderBy,
                limit,
                onSnapshot
            } = await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
            );


            /*
             * =================================================
             * PUBLIC COMMUNITY NOTIFICATIONS
             * =================================================
             *
             * Every CHAPCY user can see important
             * community activities.
             */

            const notificationsRef =
                collection(
                    db,
                    "chapcyNotifications"
                );


            const notificationsQuery =
                query(
                    notificationsRef,
                    orderBy(
                        "createdAt",
                        "desc"
                    ),
                    limit(100)
                );


            stopNotifications();


            unsubscribeNotifications =
                onSnapshot(
                    notificationsQuery,
                    snapshot => {

                        hideLoading();

                        const notifications =
                            snapshot.docs.map(
                                doc => ({

                                    id: doc.id,

                                    ...doc.data()

                                })
                            );


                        renderNotifications(
                            notifications
                        );

                    },

                    error => {

                        console.error(
                            "CHAPCY Notifications error:",
                            error
                        );

                        hideLoading();

                        showEmpty(
                            "Unable to load notifications",
                            "Please check your connection and try again."
                        );

                    }
                );


        }catch(error){

            console.error(
                "CHAPCY Notification Engine:",
                error
            );

            hideLoading();

            showEmpty(
                "Something went wrong",
                "Notifications could not be loaded."
            );

        }

    }


    /* =====================================================
       STOP LISTENER
    ===================================================== */

    function stopNotifications(){

        if(
            typeof unsubscribeNotifications ===
            "function"
        ){

            unsubscribeNotifications();

            unsubscribeNotifications = null;

        }

    }


    /* =====================================================
       RENDER
    ===================================================== */

    function renderNotifications(
        notifications
    ){

        if(!notificationsList) return;


        notificationsList.innerHTML = "";


        if(!notifications.length){

            showEmpty(
                "No notifications",
                "CHAPCY community activity will appear here."
            );

            updateCounters([]);

            return;

        }


        hideEmpty();


        notifications.forEach(
            notification => {

                const card =
                    createNotificationCard(
                        notification
                    );

                notificationsList.appendChild(
                    card
                );

            }
        );


        updateCounters(
            notifications
        );

    }


    /* =====================================================
       CREATE CARD
    ===================================================== */

    function createNotificationCard(
        notification
    ){

        const card =
            document.createElement("article");

        card.className =
            "notification-card";


        if(
            notification.unread === true
        ){

            card.classList.add(
                "is-unread"
            );

        }


        const icon =
            getNotificationIcon(
                notification.type
            );


        const title =
            escapeHTML(
                notification.title ||
                "CHAPCY Activity"
            );


        const message =
            escapeHTML(
                notification.message ||
                ""
            );


        const username =
            escapeHTML(
                notification.username ||
                "CHAPCY User"
            );


        const time =
            formatTime(
                notification.createdAt
            );


        card.innerHTML = `

            <div class="notification-card-icon ${getTypeClass(notification.type)}">

                <i class="${icon}"></i>

            </div>


            <div class="notification-card-content">

                <div class="notification-card-top">

                    <strong>
                        ${title}
                    </strong>

                    ${
                        notification.unread === true
                        ? `
                            <span class="notification-new">
                                NEW
                            </span>
                          `
                        : ""
                    }

                </div>


                <p>
                    ${message}
                </p>


                <div class="notification-meta">

                    <span>
                        <i class="fa-solid fa-user"></i>
                        ${username}
                    </span>

                    <span>
                        ${time}
                    </span>

                </div>


                ${
                    notification.actionUrl
                    ? `
                        <button
                            class="notification-open-btn"
                            type="button"
                            data-url="${escapeAttribute(notification.actionUrl)}">

                            ${escapeHTML(
                                notification.actionText ||
                                "Open"
                            )}

                            <i class="fa-solid fa-arrow-right"></i>

                        </button>
                      `
                    : ""
                }

            </div>

        `;


        const openButton =
            card.querySelector(
                ".notification-open-btn"
            );


        openButton?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const url =
                    openButton.dataset.url;

                if(url){

                    window.location.href =
                        url;

                }

            }
        );


        card.addEventListener(
            "click",
            () => {

                openNotification(
                    notification
                );

            }
        );


        return card;

    }


    /* =====================================================
       OPEN NOTIFICATION
    ===================================================== */

    function openNotification(
        notification
    ){

        const modal =
            document.getElementById(
                "notificationModal"
            );

        if(!modal) return;


        const title =
            document.getElementById(
                "modalTitle"
            );

        const message =
            document.getElementById(
                "modalMessage"
            );

        const time =
            document.getElementById(
                "modalTime"
            );

        const icon =
            document.getElementById(
                "modalNotificationIcon"
            );

        const action =
            document.getElementById(
                "modalActionBtn"
            );


        if(title){

            title.textContent =
                notification.title ||
                "CHAPCY Activity";

        }


        if(message){

            message.textContent =
                notification.message ||
                "";

        }


        if(time){

            time.textContent =
                formatTime(
                    notification.createdAt
                );

        }


        if(icon){

            icon.innerHTML = `
                <i class="${getNotificationIcon(
                    notification.type
                )}"></i>
            `;

        }


        if(action){

            if(notification.actionUrl){

                action.style.display =
                    "inline-flex";

                action.textContent =
                    notification.actionText ||
                    "Open";

                action.onclick = () => {

                    window.location.href =
                        notification.actionUrl;

                };

            }else{

                action.style.display =
                    "none";

            }

        }


        modal.classList.add(
            "show"
        );

        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    document.addEventListener(
        "click",
        event => {

            if(
                event.target.matches(
                    "[data-close-modal]"
                )
            ){

                closeModal();

            }

        }
    );


    function closeModal(){

        const modal =
            document.getElementById(
                "notificationModal"
            );

        if(modal){

            modal.classList.remove(
                "show"
            );

        }

        document.body.style.overflow =
            "";

    }


    /* =====================================================
       MARK ALL AS READ
    ===================================================== */

    markAllBtn?.addEventListener(
        "click",
        async () => {

            if(!currentUser) return;


            try{

                const {
                    db
                } = window.CHAPCY_FIREBASE;


                const {
                    collection,
                    query,
                    where,
                    getDocs,
                    writeBatch
                } = await import(
                    "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
                );


                const q =
                    query(
                        collection(
                            db,
                            "chapcyNotifications"
                        ),
                        where(
                            "targetUserId",
                            "==",
                            currentUser.uid
                        ),
                        where(
                            "unread",
                            "==",
                            true
                        )
                    );


                const snapshot =
                    await getDocs(q);


                if(snapshot.empty){

                    showToast(
                        "Already read",
                        "There are no unread notifications."
                    );

                    return;

                }


                const batch =
                    writeBatch(db);


                snapshot.forEach(
                    doc => {

                        batch.update(
                            doc.ref,
                            {
                                unread: false
                            }
                        );

                    }
                );


                await batch.commit();


                showToast(
                    "Notifications updated",
                    "All your notifications are now marked as read."
                );


            }catch(error){

                console.error(
                    error
                );

                showToast(
                    "Error",
                    "Unable to update notifications."
                );

            }

        }
    );


    /* =====================================================
       FILTER TABS
    ===================================================== */

    const tabs =
        document.querySelectorAll(
            ".notification-tab"
        );


    tabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    tabs.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );

                    tab.classList.add(
                        "active"
                    );

                    const filter =
                        tab.dataset.filter;

                    filterNotifications(
                        filter
                    );

                }
            );

        }
    );


    let cachedNotifications = [];


    function filterNotifications(
        filter
    ){

        let filtered =
            [...cachedNotifications];


        if(filter === "unread"){

            filtered =
                filtered.filter(
                    n =>
                        n.unread === true
                );

        }


        if(
            filter === "social" ||
            filter === "rewards" ||
            filter === "shop"
        ){

            filtered =
                filtered.filter(
                    n =>
                        n.category === filter
                );

        }


        renderFiltered(
            filtered
        );

    }


    function renderFiltered(
        notifications
    ){

        if(!notificationsList)
            return;


        notificationsList.innerHTML =
            "";


        if(!notifications.length){

            showEmpty(
                "Nothing here",
                "No notifications match this filter."
            );

            return;

        }


        hideEmpty();


        notifications.forEach(
            notification => {

                notificationsList.appendChild(
                    createNotificationCard(
                        notification
                    )
                );

            }
        );

    }


    /* =====================================================
       COUNTERS
    ===================================================== */

    function updateCounters(
        notifications
    ){

        cachedNotifications =
            notifications;


        const unread =
            notifications.filter(
                n =>
                    n.unread === true
            ).length;


        if(allCount){

            allCount.textContent =
                notifications.length;

        }


        if(unreadCount){

            unreadCount.textContent =
                unread;

        }


        if(unreadText){

            unreadText.textContent =
                `${unread} unread notification${
                    unread === 1 ? "" : "s"
                }`;

        }


        if(headerUnreadBadge){

            headerUnreadBadge.textContent =
                unread;

            headerUnreadBadge.classList.toggle(
                "hidden",
                unread === 0
            );

        }

    }


    /* =====================================================
       NOTIFICATION ICONS
    ===================================================== */

    function getNotificationIcon(
        type
    ){

        const icons = {

            transaction:
                "fa-solid fa-money-bill-transfer",

            points:
                "fa-solid fa-star",

            purchase:
                "fa-solid fa-cart-shopping",

            drop:
                "fa-solid fa-bag-shopping",

            reward:
                "fa-solid fa-gift",

            leaderboard:
                "fa-solid fa-trophy",

            achievement:
                "fa-solid fa-medal",

            social:
                "fa-solid fa-users",

            system:
                "fa-solid fa-bell"

        };


        return icons[type] ||
               icons.system;

    }


    function getTypeClass(
        type
    ){

        return `notification-${type || "system"}`;

    }


    /* =====================================================
       TIME
    ===================================================== */

    function formatTime(
        timestamp
    ){

        if(!timestamp)
            return "Just now";


        try{

            const date =
                timestamp.toDate
                    ? timestamp.toDate()
                    : new Date(timestamp);


            return new Intl.DateTimeFormat(
                "en",
                {
                    dateStyle: "medium",
                    timeStyle: "short"
                }
            ).format(date);

        }catch(error){

            return "Recently";

        }

    }


    /* =====================================================
       EMPTY / LOADING
    ===================================================== */

    function showEmpty(
        title,
        message
    ){

        if(emptyState){

            emptyState.classList.remove(
                "hidden"
            );

        }


        const emptyTitle =
            document.getElementById(
                "emptyTitle"
            );

        const emptyMessage =
            document.getElementById(
                "emptyMessage"
            );


        if(emptyTitle){

            emptyTitle.textContent =
                title;

        }


        if(emptyMessage){

            emptyMessage.textContent =
                message;

        }


        if(notificationsList){

            notificationsList.innerHTML =
                "";

        }

    }


    function hideEmpty(){

        emptyState?.classList.add(
            "hidden"
        );

    }


    function hideLoading(){

        loadingState?.classList.add(
            "hidden"
        );

    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(
        title,
        message
    ){

        const toast =
            document.getElementById(
                "toast"
            );

        if(!toast) return;


        const toastTitle =
            document.getElementById(
                "toastTitle"
            );

        const toastMessage =
            document.getElementById(
                "toastMessage"
            );


        if(toastTitle){

            toastTitle.textContent =
                title;

        }


        if(toastMessage){

            toastMessage.textContent =
                message;

        }


        toast.classList.add(
            "show"
        );


        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3500
        );

    }


    /* =====================================================
       SECURITY HELPERS
    ===================================================== */

    function escapeHTML(
        value
    ){

        return String(value ?? "")
            .replace(
                /[&<>"']/g,
                char => ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;"
                })[char]
            );

    }


    function escapeAttribute(
        value
    ){

        return escapeHTML(
            value
        );

    }


    /* =====================================================
       CLEANUP
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            stopNotifications();

        }
    );

});
```
