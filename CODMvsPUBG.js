document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MOBILE SIDEBAR
    ========================= */

    const sideNav = document.getElementById("sideNav");
    const menuBtn = document.getElementById("menuBtn");
    const mobileOverlay = document.getElementById("mobileOverlay");

    function openMenu() {
        if (sideNav) sideNav.classList.add("open");
        if (mobileOverlay) mobileOverlay.classList.add("show");
    }

    function closeMenu() {
        if (sideNav) sideNav.classList.remove("open");
        if (mobileOverlay) mobileOverlay.classList.remove("show");
    }

    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            if (sideNav.classList.contains("open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener("click", closeMenu);
    }

    /* Close mobile menu after clicking a navigation link */

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 850) {
                closeMenu();
            }
        });
    });


    /* =========================
       LOGOUT PREVIEW
    ========================= */

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();

            alert(
                "CHAPCY Preview Mode\n\n" +
                "Login / Logout system itaunganishwa baadaye."
            );
        });
    }


    /* =========================
       CHAT ELEMENTS
    ========================= */

    const messages = document.getElementById("messages");
    const emptyChat = document.getElementById("emptyChat");
    const composer = document.getElementById("composer");
    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");


    /* =========================
       SEND MESSAGE
    ========================= */

    function sendMessage() {

        if (!messageInput || !messages) return;

        const text = messageInput.value.trim();

        if (!text) return;

        /* Remove empty state */

        if (emptyChat) {
            emptyChat.style.display = "none";
        }

        /* Create message */

        const message = document.createElement("div");

        message.className = "message mine";

        message.innerHTML = `
            <div class="message-body">
                <div class="message-name">
                    You
                </div>

                <div class="message-text">
                    ${escapeHTML(text)}
                </div>
            </div>

            <div class="avatar">
                Y
            </div>
        `;

        messages.appendChild(message);

        messageInput.value = "";

        scrollChatToBottom();
    }


    /* =========================
       ESCAPE HTML
       Prevents user input from
       becoming HTML
    ========================= */

    function escapeHTML(value) {
        const div = document.createElement("div");
        div.textContent = value;
        return div.innerHTML;
    }


    /* =========================
       SEND BUTTON
    ========================= */

    if (sendBtn) {
        sendBtn.addEventListener("click", sendMessage);
    }


    /* =========================
       ENTER TO SEND
    ========================= */

    if (messageInput) {

        messageInput.addEventListener("keydown", event => {

            if (event.key === "Enter" && !event.shiftKey) {

                event.preventDefault();

                sendMessage();
            }

        });
    }


    /* =========================
       AUTO SCROLL CHAT
    ========================= */

    function scrollChatToBottom() {

        if (!messages) return;

        messages.scrollTo({
            top: messages.scrollHeight,
            behavior: "smooth"
        });
    }


    /* =========================
       EMOJI PANEL
    ========================= */

    const emojiBtn = document.getElementById("emojiBtn");
    const emojiPanel = document.getElementById("emojiPanel");

    if (emojiBtn && emojiPanel) {

        emojiBtn.addEventListener("click", event => {

            event.stopPropagation();

            emojiPanel.classList.toggle("show");
        });

        emojiPanel.addEventListener("click", event => {
            event.stopPropagation();
        });

        document.addEventListener("click", () => {
            emojiPanel.classList.remove("show");
        });
    }


    /* =========================
       EMOJI SELECTION
    ========================= */

    document.querySelectorAll(".emoji").forEach(emoji => {

        emoji.addEventListener("click", () => {

            if (!messageInput) return;

            messageInput.value += emoji.textContent;

            messageInput.focus();
        });

    });


    /* =========================
       ADD BUTTON
    ========================= */

    const addBtn = document.getElementById("addBtn");

    if (addBtn) {

        addBtn.addEventListener("click", () => {

            alert(
                "CHAPCY Attachments\n\n" +
                "📷 Camera\n" +
                "🖼️ Gallery\n" +
                "📎 File\n" +
                "🎤 Voice"
            );

        });

    }


    /* =========================
       SEARCH
    ========================= */

    const searchBtn = document.getElementById("searchBtn");
    const searchBox = document.getElementById("searchBox");
    const searchInput = document.getElementById("searchInput");

    if (searchBtn && searchBox) {

        searchBtn.addEventListener("click", () => {

            searchBox.classList.toggle("show");

            if (searchBox.classList.contains("show") && searchInput) {
                setTimeout(() => {
                    searchInput.focus();
                }, 100);
            }
        });
    }


    /* =========================
       SEARCH CHAT MESSAGES
    ========================= */

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const query = searchInput.value
                .trim()
                .toLowerCase();

            document.querySelectorAll(".message").forEach(message => {

                const text =
                    message.textContent.toLowerCase();

                if (!query || text.includes(query)) {
                    message.style.display = "";
                } else {
                    message.style.display = "none";
                }

            });

        });
    }


    /* =========================
       ROOM INFO
    ========================= */

    const roomInfoBtn = document.getElementById("roomInfoBtn");
    const roomInfoPanel = document.getElementById("roomInfoPanel");

    if (roomInfoBtn && roomInfoPanel) {

        roomInfoBtn.addEventListener("click", event => {

            event.stopPropagation();

            roomInfoPanel.classList.toggle("show");

        });

        roomInfoPanel.addEventListener("click", event => {
            event.stopPropagation();
        });

        document.addEventListener("click", () => {
            roomInfoPanel.classList.remove("show");
        });
    }


    /* =========================
       LIVE BUTTON EFFECT
    ========================= */

    document.querySelectorAll(".game-live-btn").forEach(button => {

        button.addEventListener("click", () => {

            button.classList.add("clicked");

            setTimeout(() => {
                button.classList.remove("clicked");
            }, 500);

        });

    });


    /* =========================
       BATTLE SCORE ANIMATION
    ========================= */

    const scoreNumbers =
        document.querySelectorAll(".score-number");

    scoreNumbers.forEach(score => {

        const target =
            parseInt(score.textContent.trim());

        if (isNaN(target)) return;

        let current = 0;

        score.textContent = "0";

        const duration = 800;

        const start = performance.now();

        function animateScore(time) {

            const progress =
                Math.min((time - start) / duration, 1);

            current =
                Math.floor(progress * target);

            score.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animateScore);
            } else {
                score.textContent = target;
            }
        }

        requestAnimationFrame(animateScore);

    });


    /* =========================
       CARD HOVER TILT
       Desktop only
    ========================= */

    const teams =
        document.querySelectorAll(".team");

    teams.forEach(team => {

        team.addEventListener("mousemove", event => {

            if (window.innerWidth < 850) return;

            const rect =
                team.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const rotateY =
                ((x / rect.width) - 0.5) * 5;

            const rotateX =
                ((y / rect.height) - 0.5) * -5;

            team.style.transform =
                `perspective(700px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-2px)`;
        });

        team.addEventListener("mouseleave", () => {
            team.style.transform = "";
        });

    });


    /* =========================
       PREVIEW WELCOME MESSAGE
    ========================= */

    setTimeout(() => {

        if (!messages || !emptyChat) return;

        const welcome =
            document.createElement("div");

        welcome.className = "message";

        welcome.innerHTML = `
            <div class="avatar">
                C
            </div>

            <div class="message-body">
                <div class="message-name">
                    CHAPCY Battle
                </div>

                <div class="message-text">
                    🔥 Karibu kwenye CODM VS PUBG Battle Room!
                </div>
            </div>
        `;

        emptyChat.style.display = "none";

        messages.appendChild(welcome);

    }, 700);


    /* =========================
       ESC KEY
    ========================= */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeMenu();

            if (emojiPanel) {
                emojiPanel.classList.remove("show");
            }

            if (roomInfoPanel) {
                roomInfoPanel.classList.remove("show");
            }

            if (searchBox) {
                searchBox.classList.remove("show");
            }
        }

    });


    /* =========================
       WINDOW RESIZE
    ========================= */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 850) {
            closeMenu();
        }

    });

});
