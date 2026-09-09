/* =========================================================
   CHAPCY MESSAGES
   Firebase Authentication + Firestore
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    writeBatch,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
   WEKA CONFIG YA PROJECT YAKO HAPA
========================================================= */

const firebaseConfig = {

    apiKey: "WEKA_API_KEY_YAKO",
    authDomain: "PROJECT-YAKO.firebaseapp.com",
    projectId: "PROJECT-YAKO",
    storageBucket: "PROJECT-YAKO.firebasestorage.app",
    messagingSenderId: "WEKA_SENDER_ID",
    appId: "WEKA_APP_ID"

};


/* =========================================================
   FIREBASE INITIALIZATION
========================================================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


/* =========================================================
   SETTINGS
========================================================= */

const LOGIN_PAGE = "Login.html";

const HOME_PAGE = "Index.html";


/* =========================================================
   GLOBAL STATE
========================================================= */

let currentUser = null;

let allMessages = [];

let activeFilter = "all";

let searchTerm = "";

let unsubscribeMessages = null;

let selectedMessage = null;


/* =========================================================
   DOM
========================================================= */

const messageList =
    document.getElementById("messageList");

const loadingState =
    document.getElementById("loadingState");

const errorState =
    document.getElementById("errorState");

const errorText =
    document.getElementById("errorText");

const emptyState =
    document.getElementById("emptyState");

const emptyTitle =
    document.getElementById("emptyTitle");

const emptyText =
    document.getElementById("emptyText");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const unreadCount =
    document.getElementById("unreadCount");

const allCount =
    document.getElementById("allCount");

const markAllBtn =
    document.getElementById("markAllBtn");

const refreshBtn =
    document.getElementById("refreshBtn");

const retryBtn =
    document.getElementById("retryBtn");

const connectionStatus =
    document.getElementById("connectionStatus");

const modal =
    document.getElementById("messageModal");

const modalBackdrop =
    document.getElementById("modalBackdrop");

const closeModal =
    document.getElementById("closeModal");

const deleteMessageBtn =
    document.getElementById("deleteMessageBtn");

const replyBtn =
    document.getElementById("replyBtn");

const toast =
    document.getElementById("toast");

const toastText =
    document.getElementById("toastText");

const toastIcon =
    document.getElementById("toastIcon");


/* =========================================================
   AUTH
========================================================= */

onAuthStateChanged(auth, user => {

    if (!user) {

        currentUser = null;

        connectionStatus.textContent =
            "Not signed in";

        showError(
            "Please sign in to view your messages."
        );

        /*
         * Ukihitaji redirect automatic:
         *
         * window.location.href = LOGIN_PAGE;
         */

        return;
    }


    currentUser = user;

    connectionStatus.textContent =
        "Live inbox";

    loadMessages();

});


/* =========================================================
   LOAD FIRESTORE MESSAGES
========================================================= */

function loadMessages(){

    if (!currentUser){
        return;
    }


    showLoading();

    hideError();


    /*
     * Firestore structure:
     *
     * messages/{messageId}
     *
     * receiverId
     * senderId
     * senderName
     * senderEmail
     * senderPhoto
     * text
     * read
     * createdAt
     * conversationId
     */


    const messagesRef =
        collection(db, "messages");


    const messagesQuery =
        query(
            messagesRef,

            where(
                "receiverId",
                "==",
                currentUser.uid
            ),

            orderBy(
                "createdAt",
                "desc"
            )
        );


    if (unsubscribeMessages){
        unsubscribeMessages();
    }


    unsubscribeMessages =
        onSnapshot(
            messagesQuery,

            snapshot => {

                allMessages =
                    snapshot.docs.map(
                        messageDoc => ({

                            id: messageDoc.id,

                            ...messageDoc.data()

                        })
                    );


                connectionStatus.textContent =
                    "● Live";


                renderMessages();

            },

            error => {

                console.error(
                    "Firestore messages error:",
                    error
                );

                connectionStatus.textContent =
                    "Connection error";

                showError(
                    getFirebaseError(error)
                );

            }
        );

}


/* =========================================================
   RENDER
========================================================= */

function renderMessages(){

    hideLoading();

    hideError();


    const filteredMessages =
        getFilteredMessages();


    updateCounters();


    messageList.innerHTML = "";


    if (
        filteredMessages.length === 0
    ){

        messageList.innerHTML = "";

        showEmpty();

        return;
    }


    hideEmpty();


    const fragment =
        document.createDocumentFragment();


    filteredMessages.forEach(message => {

        const card =
            createMessageCard(message);

        fragment.appendChild(card);

    });


    messageList.appendChild(fragment);

}


/* =========================================================
   FILTER
========================================================= */

function getFilteredMessages(){

    let result =
        [...allMessages];


    if (activeFilter === "unread"){

        result =
            result.filter(
                message =>
                    message.read !== true
            );

    }


    if (searchTerm){

        const term =
            searchTerm.toLowerCase();


        result =
            result.filter(message => {

                const sender =
                    String(
                        message.senderName || ""
                    ).toLowerCase();


                const email =
                    String(
                        message.senderEmail || ""
                    ).toLowerCase();


                const text =
                    String(
                        message.text || ""
                    ).toLowerCase();


                return (
                    sender.includes(term) ||
                    email.includes(term) ||
                    text.includes(term)
                );

            });

    }


    return result;

}


/* =========================================================
   CREATE MESSAGE CARD
========================================================= */

function createMessageCard(message){

    const card =
        document.createElement("article");


    const unread =
        message.read !== true;


    card.className =
        `message-card ${unread ? "unread" : ""}`;


    card.dataset.id =
        message.id;


    /* =====================================================
       AVATAR
    ===================================================== */

    const avatar =
        document.createElement("div");

    avatar.className =
        "message-avatar";


    const photo =
        message.senderPhoto ||
        message.senderPhotoURL ||
        message.photoURL;


    if (photo){

        const img =
            document.createElement("img");

        img.src = photo;

        img.alt =
            message.senderName || "User";

        img.loading = "lazy";

        img.onerror = () => {

            img.remove();

            avatar.insertAdjacentHTML(
                "beforeend",
                getInitial(
                    message.senderName
                )
            );

        };

        avatar.appendChild(img);

    } else {

        avatar.innerHTML =
            getInitial(
                message.senderName
            );

    }


    /* =====================================================
       ONLINE DOT
    ===================================================== */

    if (message.senderOnline === true){

        const online =
            document.createElement("span");

        online.className =
            "online-dot";

        avatar.appendChild(online);

    }


    /* =====================================================
       CONTENT
    ===================================================== */

    const content =
        document.createElement("div");

    content.className =
        "message-content";


    const top =
        document.createElement("div");

    top.className =
        "message-top";


    const sender =
        document.createElement("div");

    sender.className =
        "sender-name";

    sender.textContent =
        message.senderName ||
        "CHAPCY User";


    const time =
        document.createElement("time");

    time.className =
        "message-time-small";

    time.textContent =
        formatTime(
            message.createdAt
        );


    top.appendChild(sender);

    top.appendChild(time);


    const preview =
        document.createElement("p");

    preview.className =
        "message-preview";

    preview.textContent =
        message.text ||
        "New message";


    content.appendChild(top);

    content.appendChild(preview);


    /* =====================================================
       RIGHT SIDE
    ===================================================== */

    const right =
        document.createElement("div");

    right.className =
        "message-arrow";


    if (unread){

        const dot =
            document.createElement("span");

        dot.className =
            "unread-dot";

        right.appendChild(dot);

    } else {

        const arrow =
            document.createElement("i");

        arrow.className =
            "fa-solid fa-chevron-right";

        right.appendChild(arrow);

    }


    /* =====================================================
       CARD
    ===================================================== */

    card.appendChild(avatar);

    card.appendChild(content);

    card.appendChild(right);


    card.addEventListener(
        "click",
        () => openMessage(message)
    );


    return card;

}


/* =========================================================
   OPEN MESSAGE
========================================================= */

async function openMessage(message){

    selectedMessage =
        message;


    fillModal(message);

    showModal();


    /*
     * Automatically mark unread message
     * as read when opened.
     */

    if (
        message.read !== true
    ){

        await markMessageAsRead(
            message.id
        );

    }

}


/* =========================================================
   FILL MODAL
========================================================= */

function fillModal(message){

    const modalAvatar =
        document.getElementById(
            "modalAvatar"
        );

    const modalAvatarText =
        document.getElementById(
            "modalAvatarText"
        );


    const photo =
        message.senderPhoto ||
        message.senderPhotoURL ||
        message.photoURL;


    modalAvatar.innerHTML = "";


    if (photo){

        const img =
            document.createElement("img");

        img.src = photo;

        img.alt =
            message.senderName || "User";

        img.onerror = () => {

            modalAvatar.innerHTML =
                getInitial(
                    message.senderName
                );

        };

        modalAvatar.appendChild(img);

    } else {

        modalAvatar.appendChild(
            document.createTextNode(
                getInitial(
                    message.senderName
                )
            )
        );

    }


    document.getElementById(
        "modalSenderName"
    ).textContent =
        message.senderName ||
        "CHAPCY User";


    document.getElementById(
        "modalSenderEmail"
    ).textContent =
        message.senderEmail ||
        "";


    document.getElementById(
        "modalTime"
    ).textContent =
        formatFullDate(
            message.createdAt
        );


    document.getElementById(
        "modalMessage"
    ).textContent =
        message.text ||
        "";

}


/* =========================================================
   MARK ONE AS READ
========================================================= */

async function markMessageAsRead(
    messageId
){

    if (!currentUser){
        return;
    }


    try{

        const messageRef =
            doc(
                db,
                "messages",
                messageId
            );


        await updateDoc(
            messageRef,
            {
                read: true,
                readAt: serverTimestamp()
            }
        );

    }catch(error){

        console.error(
            "Mark as read error:",
            error
        );

    }

}


/* =========================================================
   MARK ALL AS READ
========================================================= */

async function markAllAsRead(){

    if (!currentUser){
        return;
    }


    const unreadMessages =
        allMessages.filter(
            message =>
                message.read !== true
        );


    if (
        unreadMessages.length === 0
    ){

        showToast(
            "No unread messages",
            "fa-solid fa-envelope-open"
        );

        return;
    }


    markAllBtn.disabled = true;


    try{

        const batch =
            writeBatch(db);


        unreadMessages.forEach(
            message => {

                const ref =
                    doc(
                        db,
                        "messages",
                        message.id
                    );


                batch.update(
                    ref,
                    {
                        read: true,
                        readAt:
                            serverTimestamp()
                    }
                );

            }
        );


        await batch.commit();


        showToast(
            `${unreadMessages.length} messages marked as read`,
            "fa-solid fa-check-double"
        );


    }catch(error){

        console.error(
            "Mark all read error:",
            error
        );


        showToast(
            "Unable to update messages",
            "fa-solid fa-triangle-exclamation"
        );

    }


    markAllBtn.disabled = false;

}


/* =========================================================
   DELETE MESSAGE
========================================================= */

async function deleteSelectedMessage(){

    if (
        !selectedMessage ||
        !currentUser
    ){
        return;
    }


    const confirmed =
        window.confirm(
            "Delete this message?"
        );


    if (!confirmed){
        return;
    }


    try{

        const messageRef =
            doc(
                db,
                "messages",
                selectedMessage.id
            );


        await deleteDoc(
            messageRef
        );


        closeMessageModal();


        showToast(
            "Message deleted",
            "fa-solid fa-trash"
        );


    }catch(error){

        console.error(
            "Delete message error:",
            error
        );


        showToast(
            "Unable to delete message",
            "fa-solid fa-triangle-exclamation"
        );

    }

}


/* =========================================================
   REPLY
========================================================= */

function replyToMessage(){

    if (!selectedMessage){
        return;
    }


    /*
     * If you already have a private chat page,
     * change this URL to your actual chat page.
     */

    const senderId =
        selectedMessage.senderId || "";


    const conversationId =
        selectedMessage.conversationId || "";


    const url =
        `chat.html?user=${encodeURIComponent(senderId)}&conversation=${encodeURIComponent(conversationId)}`;


    window.location.href = url;

}


/* =========================================================
   COUNTERS
========================================================= */

function updateCounters(){

    const unread =
        allMessages.filter(
            message =>
                message.read !== true
        ).length;


    allCount.textContent =
        allMessages.length;


    unreadCount.textContent =
        unread;


    /*
     * Update homepage badge too.
     */

    updateGlobalUnreadBadge(
        unread
    );

}


/* =========================================================
   HOMEPAGE BADGE
========================================================= */

function updateGlobalUnreadBadge(
    count
){

    /*
     * If Messages.html is inside an iframe,
     * this will also try parent.
     */

    try{

        const badge =
            document.getElementById(
                "unreadBadge"
            );


        if (badge){

            badge.textContent =
                count;

            badge.style.display =
                count > 0
                    ? "flex"
                    : "none";

        }

    }catch(error){

        console.warn(
            "Badge update error:",
            error
        );

    }

}


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    event => {

        searchTerm =
            event.target.value.trim();


        clearSearch.classList.toggle(
            "show",
            searchTerm.length > 0
        );


        renderMessages();

    }
);


clearSearch.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        searchTerm = "";

        clearSearch.classList.remove(
            "show"
        );

        renderMessages();

        searchInput.focus();

    }
);


/* =========================================================
   FILTER BUTTONS
========================================================= */

document
    .querySelectorAll(".filter-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter-btn"
                    )
                    .forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                activeFilter =
                    button.dataset.filter;


                renderMessages();

            }
        );

    });


/* =========================================================
   MODAL EVENTS
========================================================= */

closeModal.addEventListener(
    "click",
    closeMessageModal
);

modalBackdrop.addEventListener(
    "click",
    closeMessageModal
);

deleteMessageBtn.addEventListener(
    "click",
    deleteSelectedMessage
);

replyBtn.addEventListener(
    "click",
    replyToMessage
);


/* =========================================================
   MARK ALL
========================================================= */

markAllBtn.addEventListener(
    "click",
    markAllAsRead
);


/* =========================================================
   REFRESH
========================================================= */

refreshBtn.addEventListener(
    "click",
    () => {

        refreshBtn.classList.add(
            "loading"
        );


        loadMessages();


        setTimeout(
            () => {

                refreshBtn.classList.remove(
                    "loading"
                );

            },
            800
        );

    }
);


/* =========================================================
   RETRY
========================================================= */

retryBtn.addEventListener(
    "click",
    loadMessages
);


/* =========================================================
   BACK
========================================================= */

document
    .getElementById("backBtn")
    .addEventListener(
        "click",
        () => {

            if (
                window.history.length > 1
            ){

                window.history.back();

            }else{

                window.location.href =
                    HOME_PAGE;

            }

        }
    );


/* =========================================================
   MODAL
========================================================= */

function showModal(){

    modal.classList.remove(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";

}


function closeMessageModal(){

    modal.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";

    selectedMessage =
        null;

}


/* =========================================================
   LOADING / EMPTY / ERROR
========================================================= */

function showLoading(){

    loadingState.classList.remove(
        "hidden"
    );

    emptyState.classList.add(
        "hidden"
    );

    messageList.innerHTML = "";

}


function hideLoading(){

    loadingState.classList.add(
        "hidden"
    );

}


function showEmpty(){

    emptyState.classList.remove(
        "hidden"
    );


    if (activeFilter === "unread"){

        emptyTitle.textContent =
            "You're all caught up";

        emptyText.textContent =
            "There are no unread messages.";

    }else if(searchTerm){

        emptyTitle.textContent =
            "No results";

        emptyText.textContent =
            "No messages match your search.";

    }else{

        emptyTitle.textContent =
            "No messages";

        emptyText.textContent =
            "Your inbox is currently empty.";

    }

}


function hideEmpty(){

    emptyState.classList.add(
        "hidden"
    );

}


function showError(message){

    loadingState.classList.add(
        "hidden"
    );

    emptyState.classList.add(
        "hidden"
    );

    errorState.classList.remove(
        "hidden"
    );

    errorText.textContent =
        message;

}


function hideError(){

    errorState.classList.add(
        "hidden"
    );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(
    message,
    icon = "fa-solid fa-check"
){

    toastText.textContent =
        message;

    toastIcon.className =
        icon;


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
            2500
        );

}


/* =========================================================
   INITIALS
========================================================= */

function getInitial(name){

    if (!name){
        return "?";
    }


    const words =
        String(name)
            .trim()
            .split(/\s+/);


    if (words.length >= 2){

        return (
            words[0][0] +
            words[1][0]
        ).toUpperCase();

    }


    return words[0][0]
        .toUpperCase();

}


/* =========================================================
   TIME
========================================================= */

function getDate(timestamp){

    if (!timestamp){
        return null;
    }


    if (
        typeof timestamp.toDate ===
        "function"
    ){

        return timestamp.toDate();

    }


    if (
        timestamp instanceof Date
    ){

        return timestamp;

    }


    if (
        typeof timestamp === "number"
    ){

        return new Date(timestamp);

    }


    return null;

}


function formatTime(timestamp){

    const date =
        getDate(timestamp);


    if (!date){
        return "";
    }


    const now =
        new Date();


    const diff =
        now - date;


    const seconds =
        Math.floor(diff / 1000);


    const minutes =
        Math.floor(seconds / 60);


    const hours =
        Math.floor(minutes / 60);


    const days =
        Math.floor(hours / 24);


    if (seconds < 60){
        return "now";
    }


    if (minutes < 60){
        return `${minutes}m`;
    }


    if (hours < 24){
        return `${hours}h`;
    }


    if (days < 7){
        return `${days}d`;
    }


    return date.toLocaleDateString(
        undefined,
        {
            day:"numeric",
            month:"short"
        }
    );

}


function formatFullDate(timestamp){

    const date =
        getDate(timestamp);


    if (!date){
        return "Date unavailable";
    }


    return date.toLocaleString(
        undefined,
        {
            dateStyle:"medium",
            timeStyle:"short"
        }
    );

}


/* =========================================================
   FIREBASE ERROR
========================================================= */

function getFirebaseError(error){

    if (!error){
        return "Unknown error.";
    }


    if (
        error.code ===
        "permission-denied"
    ){

        return (
            "Firebase denied access. Check your Firestore Security Rules."
        );

    }


    if (
        error.code ===
        "failed-precondition"
    ){

        return (
            "Firestore needs the required index for this query."
        );

    }


    if (
        error.code ===
        "unavailable"
    ){

        return (
            "Firebase is temporarily unavailable."
        );

    }


    return (
        error.message ||
        "Unable to load messages."
    );

}


/* =========================================================
   CLEANUP
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        if (unsubscribeMessages){

            unsubscribeMessages();

        }

    }
);
