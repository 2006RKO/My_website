import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
    getDatabase,
    ref,
    push,
    set,
    onChildAdded,
    onValue,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";


/* =====================================================
   CHAPCY FIREBASE CONFIG
===================================================== */

const firebaseConfig = {
    apiKey: "AIzaSyDIID2LpzjLiLeLJKgp-Vd7tNIyN-M1k",
    authDomain: "rko-website-design-2f792.firebaseapp.com",
    databaseURL: "https://rko-website-design-2f792-default-rtdb.firebaseio.com",
    projectId: "rko-website-design-2f792",
    storageBucket: "rko-website-design-2f792.firebasestorage.app",
    messagingSenderId: "782567629866",
    appId: "1:782567629866:web:d6d80d454d0653ea8b4f53",
    measurementId: "G-KQ1EKYE7E7"
};


/* =====================================================
   INITIALIZE
===================================================== */

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getDatabase(app);


/* =====================================================
   BUSINESS ROOM
===================================================== */

const ROOM_ID =
    "business";


const messagesRef =
    ref(
        db,
        `rooms/${ROOM_ID}/messages`
    );


/* =====================================================
   DOM
===================================================== */

const messages =
    document.getElementById("messages");

const emptyChat =
    document.getElementById("emptyChat");

const composer =
    document.getElementById("composer");

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

const profileName =
    document.getElementById("profileName");

const profileLetter =
    document.getElementById("profileLetter");

const logoutBtn =
    document.getElementById("logoutBtn");

const emojiBtn =
    document.getElementById("emojiBtn");

const emojiPanel =
    document.getElementById("emojiPanel");

const searchBtn =
    document.getElementById("searchBtn");

const searchBox =
    document.getElementById("searchBox");

const searchInput =
    document.getElementById("searchInput");

const roomInfoBtn =
    document.getElementById("roomInfoBtn");

const roomInfoPanel =
    document.getElementById("roomInfoPanel");

const menuBtn =
    document.getElementById("menuBtn");

const sideNav =
    document.getElementById("sideNav");

const mobileOverlay =
    document.getElementById("mobileOverlay");


/* =====================================================
   CURRENT USER
===================================================== */

let currentUser =
    null;


/* =====================================================
   AUTH
===================================================== */

onAuthStateChanged(
    auth,
    user => {

        if (!user) {

            /*
             * Kama login yako ya CHAPCY
             * inatumia localStorage badala ya
             * Firebase Auth session, usimtoe hapa.
             */

            const localUser =
                localStorage.getItem(
                    "chapcyUser"
                );

            if (!localUser) {

                window.location.href =
                    "Mychatregister.html";

                return;

            }

            try {

                currentUser =
                    JSON.parse(
                        localUser
                    );

                showUser(
                    currentUser
                );

            } catch {

                window.location.href =
                    "Mychatregister.html";

            }

            return;
        }


        currentUser =
            user;

        showUser(user);

    }
);


/* =====================================================
   SHOW USER
===================================================== */

function showUser(user) {

    const name =
        user.displayName ||
        user.name ||
        localStorage.getItem(
            "chapcyName"
        ) ||
        "CHAPCY User";


    if (profileName) {

        profileName.textContent =
            name;

    }


    if (profileLetter) {

        profileLetter.textContent =
            name
                .charAt(0)
                .toUpperCase();

    }

}


/* =====================================================
   SEND MESSAGE
===================================================== */

composer.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const text =
            messageInput
                .value
                .trim();


        if (!text) {
            return;
        }


        if (!currentUser) {

            alert(
                "Please login to CHAPCY first."
            );

            return;

        }


        sendBtn.disabled =
            true;


        try {

            const messageRef =
                push(messagesRef);


            const userName =
                currentUser.displayName ||
                currentUser.name ||
                localStorage.getItem(
                    "chapcyName"
                ) ||
                "CHAPCY User";


            const phone =
                currentUser.phoneNumber ||
                localStorage.getItem(
                    "chapcyPhone"
                ) ||
                "";


            await set(
                messageRef,
                {

                    uid:
                        currentUser.uid ||
                        localStorage.getItem(
                            "chapcyUID"
                        ),

                    name:
                        userName,

                    phone:
                        phone,

                    text:
                        text,

                    room:
                        ROOM_ID,

                    type:
                        "text",

                    timestamp:
                        serverTimestamp()

                }
            );


            /*
             * Optional:
             * Tuma message copy kwenda PHP/MySQL.
             */

            await saveMessageToXAMPP({

                uid:
                    currentUser.uid ||
                    localStorage.getItem(
                        "chapcyUID"
                    ),

                name:
                    userName,

                phone:
                    phone,

                room:
                    ROOM_ID,

                message:
                    text

            });


            messageInput.value =
                "";

        }

        catch (error) {

            console.error(
                "CHAPCY SEND ERROR:",
                error
            );

            alert(
                "Message failed to send."
            );

        }

        finally {

            sendBtn.disabled =
                false;

            messageInput.focus();

        }

    }
);


/* =====================================================
   RECEIVE MESSAGES
===================================================== */

onChildAdded(
    messagesRef,
    snapshot => {

        const data =
            snapshot.val();


        if (!data) {
            return;
        }


        if (emptyChat) {

            emptyChat.style.display =
                "none";

        }


        createMessage(
            data
        );

    }
);


/* =====================================================
   CREATE MESSAGE
===================================================== */

function createMessage(data) {

    const wrapper =
        document.createElement(
            "div"
        );


    const myUID =
        currentUser?.uid ||
        localStorage.getItem(
            "chapcyUID"
        );


    const isMine =
        data.uid === myUID;


    wrapper.className =
        isMine
            ? "message own-message"
            : "message";


    const name =
        escapeHTML(
            data.name ||
            "CHAPCY User"
        );


    const text =
        escapeHTML(
            data.text ||
            ""
        );


    wrapper.innerHTML = `

        <div class="message-avatar">
            ${name.charAt(0).toUpperCase()}
        </div>

        <div class="message-content">

            <div class="message-name">
                ${name}
            </div>

            <div class="message-bubble">
                ${text}
            </div>

        </div>

    `;


    messages.appendChild(
        wrapper
    );


    messages.scrollTop =
        messages.scrollHeight;

}


/* =====================================================
   XAMPP / PHP / MYSQL
===================================================== */

const PHP_URL =
    "http://localhost/chapcy/save-business-message.php";


async function saveMessageToXAMPP(
    data
) {

    try {

        const formData =
            new FormData();


        formData.append(
            "uid",
            data.uid || ""
        );

        formData.append(
            "name",
            data.name || ""
        );

        formData.append(
            "phone",
            data.phone || ""
        );

        formData.append(
            "room",
            data.room || "business"
        );

        formData.append(
            "message",
            data.message || ""
        );


        const response =
            await fetch(
                PHP_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


        const text =
            await response.text();


        console.log(
            "XAMPP:",
            text
        );


    }

    catch (error) {

        /*
         * Firebase bado inaweza kufanya kazi
         * hata XAMPP ikiwa haipo.
         */

        console.warn(
            "XAMPP unavailable:",
            error
        );

    }

}


/* =====================================================
   EMOJI
===================================================== */

if (emojiBtn) {

    emojiBtn.addEventListener(
        "click",
        () => {

            emojiPanel.classList.toggle(
                "show"
            );

        }
    );

}


document
    .querySelectorAll(
        "#emojiPanel button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    messageInput.value +=
                        button.textContent;

                    messageInput.focus();

                }
            );

        }
    );


/* =====================================================
   SEARCH
===================================================== */

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        () => {

            searchBox.classList.toggle(
                "show"
            );

            if (
                searchBox.classList.contains(
                    "show"
                )
            ) {

                searchInput.focus();

            }

        }
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const keyword =
                searchInput.value
                    .trim()
                    .toLowerCase();


            document
                .querySelectorAll(
                    ".message"
                )
                .forEach(
                    message => {

                        message.style.display =
                            message.textContent
                                .toLowerCase()
                                .includes(
                                    keyword
                                )
                                ? ""
                                : "none";

                    }
                );

        }
    );

}


/* =====================================================
   ROOM INFO
===================================================== */

if (roomInfoBtn) {

    roomInfoBtn.addEventListener(
        "click",
        () => {

            roomInfoPanel.classList.toggle(
                "show"
            );

        }
    );

}


/* =====================================================
   MOBILE MENU
===================================================== */

function closeMobileMenu() {

    sideNav.classList.remove(
        "open"
    );

    mobileOverlay.classList.remove(
        "show"
    );

}


if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        () => {

            sideNav.classList.add(
                "open"
            );

            mobileOverlay.classList.add(
                "show"
            );

        }
    );

}


if (mobileOverlay) {

    mobileOverlay.addEventListener(
        "click",
        closeMobileMenu
    );

}


/* =====================================================
   NAVIGATION
===================================================== */

document
    .querySelectorAll(
        ".nav-link"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const section =
                        button.dataset.section;


                    if (
                        section === "chat"
                    ) {

                        closeMobileMenu();

                        return;

                    }


                    const pages = {

                        discover:
                            "BusinessExplore.html",

                        rooms:
                            "BusinessRooms.html",

                        people:
                            "BusinessPeople.html",

                        mentions:
                            "Mentions.html",

                        messages:
                            "Messages.html",

                        settings:
                            "Settings.html"

                    };


                    if (
                        pages[section]
                    ) {

                        window.location.href =
                            pages[section];

                    }

                }
            );

        }
    );


/* =====================================================
   LOGOUT
===================================================== */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

            } catch (error) {

                console.warn(
                    "Firebase logout:",
                    error
                );

            }


            localStorage.removeItem(
                "chapcyUser"
            );

            localStorage.removeItem(
                "chapcyUID"
            );

            localStorage.removeItem(
                "chapcyPhone"
            );

            window.location.href =
                "Mychatregister.html";

        }
    );

}


/* =====================================================
   HTML SECURITY
===================================================== */

function escapeHTML(
    value
) {

    return String(value)
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


console.log(
    "CHAPCY BUSINESS LIVE CHAT READY 🚀"
);

console.log(
    "Firebase Room:",
    ROOM_ID
);

console.log(
    "XAMPP:",
    PHP_URL
);
