/* =========================================================
   CHAPCY NOTIFICATIONS SYSTEM
   FIREBASE REALTIME
========================================================= */

"use strict";


/* =========================================================
   FIREBASE
========================================================= */

let db = null;
let auth = null;

let currentUser = null;

let unsubscribeNotifications = null;


/* =========================================================
   STATE
========================================================= */

let notifications = [];

let currentFilter = "all";

let selectedNotification = null;

let notificationToDelete = null;


/* =========================================================
   DOM
========================================================= */

const notificationsList =
    document.getElementById("notificationsList");

const loadingState =
    document.getElementById("loadingState");

const emptyState =
    document.getElementById("emptyState");

const emptyTitle =
    document.getElementById("emptyTitle");

const emptyMessage =
    document.getElementById("emptyMessage");

const unreadText =
    document.getElementById("unreadText");

const headerUnreadBadge =
    document.getElementById("headerUnreadBadge");

const unreadCount =
    document.getElementById("unreadCount");

const allCount =
    document.getElementById("allCount");

const markAllBtn =
    document.getElementById("markAllBtn");

const backBtn =
    document.getElementById("backBtn");

const settingsBtn =
    document.getElementById("settingsBtn");

const notificationModal =
    document.getElementById("notificationModal");

const deleteModal =
    document.getElementById("deleteModal");

const toast =
    document.getElementById("toast");


/* =========================================================
   FIREBASE IMPORTS
========================================================= */

let firebaseModulesLoaded = false;

let firestoreModules = null;


/* =========================================================
   LOAD FIRESTORE MODULES
========================================================= */

async function loadFirestoreModules(){

    if(firebaseModulesLoaded){

        return firestoreModules;

    }


    firestoreModules = await import(
        "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
    );


    firebaseModulesLoaded = true;


    return firestoreModules;
}


/* =========================================================
   INIT FIREBASE
========================================================= */

async function initNotifications(){

    if(!window.CHAPCY_FIREBASE){

        console.error(
            "CHAPCY_FIREBASE has not been initialized."
        );

        showToast(
            "Firebase Error",
            "Firebase is not initialized."
        );

        return false;
    }


    db =
        window.CHAPCY_FIREBASE.db;

    auth =
        window.CHAPCY_FIREBASE.auth;


    return true;
}


/* =========================================================
   AUTH READY
========================================================= */

window.addEventListener(
    "chapcyUserReady",
    async event => {

        const user =
            event.detail?.user;


        if(!user){

            return;

        }


        currentUser = user;


        await initNotifications();

        await startRealtimeNotifications();

    }
);


/* =========================================================
   AUTH SIGNED OUT
========================================================= */

window.addEventListener(
    "chapcyUserSignedOut",
    () => {

        currentUser = null;

        notifications = [];


        stopRealtimeNotifications();


        renderNotifications();


        showToast(
            "Signed out",
            "Please login to view notifications."
        );

    }
);


/* =========================================================
   START REALTIME LISTENER
========================================================= */

async function startRealtimeNotifications(){

    if(!currentUser){

        return;

    }


    if(!db){

        const ready =
            await initNotifications();

        if(!ready){

            return;

        }

    }


    stopRealtimeNotifications();


    const {
        collection,
        query,
        where,
        orderBy,
        onSnapshot
    } = await loadFirestoreModules();


    /*
     * Firestore structure:
     *
     * notifications
     *     notificationId
     *
     *       userId
     *       type
     *       title
     *       message
     *       icon
     *       read
     *       createdAt
     *       actionUrl
     *       actorId
     *       actorName
     *       actorPhoto
     */


    const notificationsRef =
        collection(
            db,
            "notifications"
        );


    const notificationsQuery =
        query(

            notificationsRef,

            where(
                "userId",
                "==",
                currentUser.uid
            ),

            orderBy(
                "createdAt",
                "desc"
            )

        );


    unsubscribeNotifications =
        onSnapshot(

            notificationsQuery,

            snapshot => {

                notifications =
                    snapshot.docs.map(
                        documentSnapshot => {

                            return {

                                id:
                                    documentSnapshot.id,

                                ...documentSnapshot.data()

                            };

                        }
                    );


                loadingState
                    .classList
                    .add("hidden");


                renderNotifications();

            },


            error => {

                console.error(
                    "Notifications realtime error:",
                    error
                );


                loadingState
                    .classList
                    .add("hidden");


                showToast(
                    "Notification Error",
                    "Unable to load notifications."
                );

            }

        );

}


/* =========================================================
   STOP REALTIME
========================================================= */

function stopRealtimeNotifications(){

    if(
        typeof unsubscribeNotifications
        === "function"
    ){

        unsubscribeNotifications();

        unsubscribeNotifications = null;

    }

}


/* =========================================================
   FILTER
========================================================= */

function getFilteredNotifications(){

    if(currentFilter === "all"){

        return notifications;

    }


    if(currentFilter === "unread"){

        return notifications.filter(
            notification =>
                notification.read !== true
        );

    }


    if(currentFilter === "social"){

        return notifications.filter(
            notification =>
                [
                    "social",
                    "like",
                    "comment",
                    "follow",
                    "friend"
                ].includes(
                    notification.type
                )
        );

    }


    if(currentFilter === "rewards"){

        return notifications.filter(
            notification =>
                [
                    "reward",
                    "rewards",
                    "gift",
                    "challenge",
                    "points"
                ].includes(
                    notification.type
                )
        );

    }


    if(currentFilter === "shop"){

        return notifications.filter(
            notification =>
                [
                    "shop",
                    "order",
                    "payment",
                    "delivery"
                ].includes(
                    notification.type
                )
        );

    }


    return notifications;
}


/* =========================================================
   RENDER
========================================================= */

function renderNotifications(){

    updateCounts();


    const filtered =
        getFilteredNotifications();


    notificationsList.innerHTML = "";


    if(filtered.length === 0){

        emptyState
            .classList
            .remove("hidden");


        if(currentFilter === "unread"){

            emptyTitle.textContent =
                "You're all caught up!";

            emptyMessage.textContent =
                "There are no unread notifications.";

        }else{

            emptyTitle.textContent =
                "No notifications";

            emptyMessage.textContent =
                "You don't have any notifications yet.";

        }


        return;

    }


    emptyState
        .classList
        .add("hidden");


    filtered.forEach(
        notification => {

            notificationsList.appendChild(
                createNotificationElement(
                    notification
                )
            );

        }
    );

}


/* =========================================================
   CREATE NOTIFICATION
========================================================= */

function createNotificationElement(notification){

    const item =
        document.createElement("article");


    item.className =
        "notification-item";


    if(notification.read !== true){

        item.classList.add("unread");

    }


    const iconType =
        getIconType(
            notification.type
        );


    const icon =
        getNotificationIcon(
            notification.type,
            notification.icon
        );


    const time =
        formatNotificationTime(
            notification.createdAt
        );


    const title =
        escapeHTML(
            notification.title ||
            "CHAPCY Notification"
        );


    const message =
        escapeHTML(
            notification.message ||
            ""
        );


    item.innerHTML = `

        <div class="notification-icon ${iconType}">
            <i class="${icon}"></i>
        </div>


        <div class="notification-content">

            <div class="notification-top">

                <h3 class="notification-title">
                    ${title}
                </h3>

                <span class="notification-time">
                    ${time}
                </span>

            </div>


            <p class="notification-message">
                ${message}
            </p>


            ${
                notification.actionLabel
                ?
                `
                <span class="notification-action">

                    ${escapeHTML(
                        notification.actionLabel
                    )}

                    <i class="fa-solid fa-arrow-right"></i>

                </span>
                `
                :
                ""
            }

        </div>


        <div class="notification-actions">

            ${
                notification.read !== true
                ?
                `
                <button
                    class="item-action"
                    data-action="read"
                    title="Mark as read">

                    <i class="fa-solid fa-check"></i>

                </button>
                `
                :
                ""
            }


            <button
                class="item-action delete"
                data-action="delete"
                title="Delete">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

    `;


    /*
     * Open notification
     */

    item.addEventListener(
        "click",
        event => {

            if(
                event.target.closest(
                    ".item-action"
                )
            ){

                return;

            }


            openNotification(
                notification
            );

        }
    );


    /*
     * Mark read
     */

    const readButton =
        item.querySelector(
            '[data-action="read"]'
        );


    if(readButton){

        readButton.addEventListener(
            "click",
            async event => {

                event.stopPropagation();

                await markAsRead(
                    notification.id
                );

            }
        );

    }


    /*
     * Delete
     */

    const deleteButton =
        item.querySelector(
            '[data-action="delete"]'
        );


    deleteButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            notificationToDelete =
                notification;


            openDeleteModal();

        }
    );


    return item;
}


/* =========================================================
   OPEN NOTIFICATION
========================================================= */

async function openNotification(notification){

    selectedNotification =
        notification;


    if(notification.read !== true){

        await markAsRead(
            notification.id
        );

    }


    document.getElementById(
        "modalTitle"
    ).textContent =
        notification.title ||
        "CHAPCY Notification";


    document.getElementById(
        "modalMessage"
    ).textContent =
        notification.message ||
        "";


    document.getElementById(
        "modalTime"
    ).textContent =
        formatNotificationTime(
            notification.createdAt
        );


    const actionButton =
        document.getElementById(
            "modalActionBtn"
        );


    if(notification.actionUrl){

        actionButton.style.display =
            "block";

        actionButton.textContent =
            notification.actionLabel ||
            "Open";


    }else{

        actionButton.style.display =
            "none";

    }


    const icon =
        document.getElementById(
            "modalNotificationIcon"
        );


    icon.innerHTML =
        `<i class="${
            getNotificationIcon(
                notification.type,
                notification.icon
            )
        }"></i>`;


    notificationModal
        .classList
        .add("active");

}


/* =========================================================
   MARK AS READ
========================================================= */

async function markAsRead(notificationId){

    if(!currentUser || !db){

        return;

    }


    try{

        const {
            doc,
            updateDoc
        } =
            await loadFirestoreModules();


        const notificationRef =
            doc(
                db,
                "notifications",
                notificationId
            );


        await updateDoc(
            notificationRef,
            {

                read:true,

                readAt:
                    new Date()

            }
        );


    }catch(error){

        console.error(
            "Mark read error:",
            error
        );


        showToast(
            "Error",
            "Could not mark notification as read."
        );

    }

}


/* =========================================================
   MARK ALL AS READ
========================================================= */

async function markAllAsRead(){

    if(!currentUser || !db){

        return;

    }


    const unread =
        notifications.filter(
            notification =>
                notification.read !== true
        );


    if(unread.length === 0){

        showToast(
            "Already updated",
            "All notifications are already read."
        );

        return;

    }


    markAllBtn.disabled = true;


    try{

        const {
            doc,
            writeBatch
        } =
            await loadFirestoreModules();


        const batch =
            writeBatch(db);


        unread.forEach(
            notification => {

                const notificationRef =
                    doc(
                        db,
                        "notifications",
                        notification.id
                    );


                batch.update(
                    notificationRef,
                    {

                        read:true,

                        readAt:
                            new Date()

                    }
                );

            }
        );


        await batch.commit();


        showToast(
            "Done",
            "All notifications marked as read."
        );


    }catch(error){

        console.error(
            "Mark all read error:",
            error
        );


        showToast(
            "Error",
            "Unable to update notifications."
        );

    }finally{

        markAllBtn.disabled = false;

    }

}


/* =========================================================
   DELETE
========================================================= */

async function deleteNotification(){

    if(
        !currentUser ||
        !db ||
        !notificationToDelete
    ){

        return;

    }


    try{

        const {
            doc,
            deleteDoc
        } =
            await loadFirestoreModules();


        await deleteDoc(
            doc(
                db,
                "notifications",
                notificationToDelete.id
            )
        );


        closeDeleteModal();


        showToast(
            "Deleted",
            "Notification removed."
        );


        notificationToDelete =
            null;


    }catch(error){

        console.error(
            "Delete notification error:",
            error
        );


        showToast(
            "Error",
            "Could not delete notification."
        );

    }

}


/* =========================================================
   COUNTS
========================================================= */

function updateCounts(){

    const total =
        notifications.length;


    const unread =
        notifications.filter(
            notification =>
                notification.read !== true
        ).length;


    allCount.textContent =
        total;


    unreadCount.textContent =
        unread;


    unreadText.textContent =
        `${unread} unread notification${
            unread === 1 ? "" : "s"
        }`;


    if(unread > 0){

        headerUnreadBadge
            .classList
            .remove("hidden");


        headerUnreadBadge.textContent =
            unread > 99
                ? "99+"
                : unread;


    }else{

        headerUnreadBadge
            .classList
            .add("hidden");

    }

}


/* =========================================================
   ICONS
========================================================= */

function getIconType(type){

    if(
        [
            "reward",
            "rewards",
            "gift",
            "challenge",
            "points"
        ].includes(type)
    ){

        return "rewards";

    }


    if(
        [
            "like",
            "comment",
            "follow",
            "friend",
            "social"
        ].includes(type)
    ){

        return "social";

    }


    if(
        [
            "message",
            "chat"
        ].includes(type)
    ){

        return "message";

    }


    if(
        [
            "shop",
            "order",
            "payment",
            "delivery"
        ].includes(type)
    ){

        return "shop";

    }


    if(type === "system"){

        return "system";

    }


    return "";

}


function getNotificationIcon(type, customIcon){

    if(customIcon){

        return customIcon;

    }


    const icons = {

        like:
            "fa-solid fa-heart",

        comment:
            "fa-solid fa-comment",

        follow:
            "fa-solid fa-user-plus",

        friend:
            "fa-solid fa-user-group",

        message:
            "fa-solid fa-message",

        chat:
            "fa-solid fa-comments",

        reward:
            "fa-solid fa-gift",

        rewards:
            "fa-solid fa-gift",

        gift:
            "fa-solid fa-gift",

        challenge:
            "fa-solid fa-trophy",

        points:
            "fa-solid fa-coins",

        shop:
            "fa-solid fa-bag-shopping",

        order:
            "fa-solid fa-box",

        payment:
            "fa-solid fa-credit-card",

        delivery:
            "fa-solid fa-truck",

        system:
            "fa-solid fa-bullhorn"

    };


    return icons[type]
        ||
        "fa-solid fa-bell";
}


/* =========================================================
   TIME
========================================================= */

function formatNotificationTime(timestamp){

    if(!timestamp){

        return "";

    }


    let date;


    if(
        typeof timestamp.toDate
        === "function"
    ){

        date =
            timestamp.toDate();

    }

    else if(
        timestamp.seconds
    ){

        date =
            new Date(
                timestamp.seconds * 1000
            );

    }

    else{

        date =
            new Date(timestamp);

    }


    if(
        Number.isNaN(
            date.getTime()
        )
    ){

        return "";

    }


    const now =
        new Date();


    const diff =
        now.getTime()
        -
        date.getTime();


    const minute =
        60 * 1000;


    const hour =
        60 * minute;


    const day =
        24 * hour;


    if(diff < minute){

        return "Just now";

    }


    if(diff < hour){

        return `${Math.floor(
            diff / minute
        )}m ago`;

    }


    if(diff < day){

        return `${Math.floor(
            diff / hour
        )}h ago`;

    }


    if(diff < 7 * day){

        return `${Math.floor(
            diff / day
        )}d ago`;

    }


    return date.toLocaleDateString(
        undefined,
        {
            day:"numeric",
            month:"short",
            year:"numeric"
        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value){

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;
}


/* =========================================================
   MODALS
========================================================= */

function closeNotificationModal(){

    notificationModal
        .classList
        .remove("active");

}


function openDeleteModal(){

    deleteModal
        .classList
        .add("active");

}


function closeDeleteModal(){

    deleteModal
        .classList
        .remove("active");

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(title, message){

    document.getElementById(
        "toastTitle"
    ).textContent = title;


    document.getElementById(
        "toastMessage"
    ).textContent = message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
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
   FILTER EVENTS
========================================================= */

document
    .querySelectorAll(
        ".notification-tab"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".notification-tab"
                    )
                    .forEach(tab => {

                        tab.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderNotifications();

            }
        );

    });


/* =========================================================
   MARK ALL
========================================================= */

markAllBtn.addEventListener(
    "click",
    markAllAsRead
);


/* =========================================================
   DELETE CONFIRM
========================================================= */

document
    .getElementById(
        "confirmDeleteBtn"
    )
    .addEventListener(
        "click",
        deleteNotification
    );


document
    .getElementById(
        "cancelDeleteBtn"
    )
    .addEventListener(
        "click",
        closeDeleteModal
    );


/* =========================================================
   CLOSE MODAL
========================================================= */

document
    .querySelectorAll(
        "[data-close-modal]"
    )
    .forEach(element => {

        element.addEventListener(
            "click",
            closeNotificationModal
        );

    });


document
    .querySelectorAll(
        "[data-close-delete]"
    )
    .forEach(element => {

        element.addEventListener(
            "click",
            closeDeleteModal
        );

    });


/* =========================================================
   MODAL ACTION
========================================================= */

document
    .getElementById(
        "modalActionBtn"
    )
    .addEventListener(
        "click",
        () => {

            if(
                selectedNotification &&
                selectedNotification.actionUrl
            ){

                window.location.href =
                    selectedNotification.actionUrl;

            }

        }
    );


/* =========================================================
   BACK
========================================================= */

backBtn.addEventListener(
    "click",
    () => {

        if(
            window.history.length > 1
        ){

            window.history.back();

        }else{

            window.location.href =
                "Index.html";

        }

    }
);


/* =========================================================
   SETTINGS
========================================================= */

settingsBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "Settings.html";

    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if(event.key === "Escape"){

            closeNotificationModal();

            closeDeleteModal();

        }

    }
);


/* =========================================================
   INITIAL STATE
========================================================= */

loadingState
    .classList
    .remove("hidden");


/*
 * If the Firebase initialization script
 * dispatches chapcyUserReady before this
 * file finishes loading, check auth directly.
 */

setTimeout(
    async () => {

        if(
            window.CHAPCY_FIREBASE &&
            window.CHAPCY_FIREBASE.auth
        ){

            const user =
                window.CHAPCY_FIREBASE
                    .auth
                    .currentUser;


            if(user){

                currentUser =
                    user;


                await initNotifications();

                await startRealtimeNotifications();

            }

        }

    },
    300
);


/* =========================================================
   PUBLIC API
========================================================= */

window.CHAPCY_NOTIFICATIONS = {

    start:
        startRealtimeNotifications,

    stop:
        stopRealtimeNotifications,

    markAsRead,

    markAllAsRead,

    deleteNotification,

    openNotification

};
