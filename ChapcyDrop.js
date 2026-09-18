/* =========================================================
   CHAPCY DROP
   REAL FIREBASE MARKETPLACE
   REALTIME PRODUCTS • CART • WISHLIST • AUTH
   SEARCH • CATEGORY • SORT • MODALS • ANIMATIONS
   ========================================================= */

import {
    db,
    auth,
    storage
} from "./firebase.js";

import {
    ref,
    onValue,
    get,
    set,
    update,
    remove,
    push,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";


/* =========================================================
   DOM
   ========================================================= */

const $ = (selector) =>
    document.querySelector(selector);

const $$ = (selector) =>
    document.querySelectorAll(selector);


/* =========================================================
   ELEMENTS
   ========================================================= */

const productsGrid =
    $("#productsGrid");

const productsLoading =
    $("#productsLoading");

const emptyProducts =
    $("#emptyProducts");

const categoryList =
    $("#categoryList");

const productSearch =
    $("#productSearch");

const clearSearch =
    $("#clearSearch");

const sortProducts =
    $("#sortProducts");

const productsTitle =
    $("#productsTitle");

const wishlistBadge =
    $("#wishlistBadge");

const cartBadge =
    $("#cartBadge");

const currentYear =
    $("#currentYear");


/* =========================================================
   STATE
   ========================================================= */

let currentUser = null;

let allProducts = [];

let visibleProducts = [];

let allCategories = [];

let activeCategory = "all";

let searchTerm = "";

let currentSort = "newest";

let selectedProduct = null;

let selectedQuantity = 1;

let cartItems = {};

let wishlistItems = {};

let productsListenerStarted = false;

let cartListenerStarted = false;

let wishlistListenerStarted = false;


/* =========================================================
   SETTINGS
   ========================================================= */

const PRODUCTS_PATH =
    "products";

const CATEGORIES_PATH =
    "categories";

const USERS_PATH =
    "users";

const CART_PATH =
    "cart";

const WISHLIST_PATH =
    "wishlist";

const ORDERS_PATH =
    "orders";


/* =========================================================
   INITIAL
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializePage();

    }
);


/* =========================================================
   INITIALIZE PAGE
   ========================================================= */

function initializePage() {

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }

    setupNavigation();

    setupSearch();

    setupSorting();

    setupCart();

    setupWishlist();

    setupProductModal();

    setupAuthModal();

    setupSellerButtons();

    setupCategoryButton();

    setupAnimations();

    setupKeyboard();

    setupScrollEffects();

    watchFirebaseAuth();

}


/* =========================================================
   FIREBASE AUTH
   ========================================================= */

function watchFirebaseAuth() {

    onAuthStateChanged(
        auth,
        async (user) => {

            currentUser = user || null;

            if (currentUser) {

                console.log(
                    "CHAPCY DROP user:",
                    currentUser.uid
                );

                await loadUserCart();

                await loadUserWishlist();

            } else {

                cartItems = {};

                wishlistItems = {};

                updateCartBadge();

                updateWishlistBadge();

                closeCart();

                closeWishlist();

            }

        }
    );

}


/* =========================================================
   REALTIME PRODUCTS
   ========================================================= */

function startProductsListener() {

    if (productsListenerStarted) {
        return;
    }

    productsListenerStarted = true;

    const productsRef =
        ref(db, PRODUCTS_PATH);

    onValue(
        productsRef,
        (snapshot) => {

            const data =
                snapshot.val();

            allProducts = [];

            if (data) {

                Object.entries(data)
                    .forEach(
                        ([id, product]) => {

                            if (!product) {
                                return;
                            }

                            allProducts.push({

                                id,

                                ...product

                            });

                        }
                    );

            }

            normalizeProducts();

            loadCategories();

            applyProductFilters();

        },
        (error) => {

            console.error(
                "Products Firebase error:",
                error
            );

            showProductsError(
                "Unable to load products from Firebase."
            );

        }
    );

}


/* =========================================================
   NORMALIZE PRODUCTS
   ========================================================= */

function normalizeProducts() {

    allProducts =
        allProducts.map(
            (product) => {

                return {

                    ...product,

                    id:
                        product.id ||
                        "",

                    name:
                        product.name ||
                        "Unnamed product",

                    description:
                        product.description ||
                        "",

                    category:
                        product.category ||
                        "Other",

                    price:
                        Number(product.price) || 0,

                    oldPrice:
                        Number(product.oldPrice) || 0,

                    image:
                        product.image ||
                        product.imageUrl ||
                        "",

                    sellerId:
                        product.sellerId ||
                        "",

                    sellerName:
                        product.sellerName ||
                        "",

                    createdAt:
                        product.createdAt ||
                        0,

                    stock:
                        Number(product.stock) || 0,

                    active:
                        product.active !== false

                };

            }
        )
        .filter(
            product =>
                product.active !== false
        );

}


/* =========================================================
   CATEGORIES
   ========================================================= */

function loadCategories() {

    const categorySet =
        new Set();

    allProducts.forEach(
        product => {

            if (
                product.category &&
                product.category.trim()
            ) {

                categorySet.add(
                    product.category.trim()
                );

            }

        }
    );

    allCategories =
        Array.from(categorySet)
            .sort(
                (a, b) =>
                    a.localeCompare(b)
            );

    renderCategories();

}


/* =========================================================
   RENDER CATEGORIES
   ========================================================= */

function renderCategories() {

    if (!categoryList) {
        return;
    }

    categoryList.innerHTML = "";

    const allButton =
        createCategoryButton(
            "all",
            "All",
            "fa-store"
        );

    categoryList.appendChild(
        allButton
    );

    allCategories.forEach(
        category => {

            const icon =
                getCategoryIcon(
                    category
                );

            const button =
                createCategoryButton(
                    category,
                    category,
                    icon
                );

            categoryList.appendChild(
                button
            );

        }
    );

    refreshCategoryActiveState();

}


/* =========================================================
   CATEGORY BUTTON
   ========================================================= */

function createCategoryButton(
    value,
    label,
    icon
) {

    const button =
        document.createElement("button");

    button.type =
        "button";

    button.className =
        "category-item";

    button.dataset.category =
        value;

    button.innerHTML = `

        <div class="category-icon">

            <i class="fa-solid ${icon}"></i>

        </div>

        <span>
            ${escapeHTML(label)}
        </span>

    `;

    button.addEventListener(
        "click",
        () => {

            activeCategory =
                value;

            refreshCategoryActiveState();

            applyProductFilters();

            scrollToProducts();

        }
    );

    return button;

}


/* =========================================================
   CATEGORY ICONS
   ========================================================= */

function getCategoryIcon(
    category
) {

    const name =
        category.toLowerCase();

    if (
        name.includes("phone") ||
        name.includes("mobile") ||
        name.includes("electronic")
    ) {
        return "fa-mobile-screen";
    }

    if (
        name.includes("fashion") ||
        name.includes("clothes") ||
        name.includes("cloth")
    ) {
        return "fa-shirt";
    }

    if (
        name.includes("shoe") ||
        name.includes("foot")
    ) {
        return "fa-shoe-prints";
    }

    if (
        name.includes("food") ||
        name.includes("drink")
    ) {
        return "fa-utensils";
    }

    if (
        name.includes("beauty") ||
        name.includes("cosmetic")
    ) {
        return "fa-wand-magic-sparkles";
    }

    if (
        name.includes("car") ||
        name.includes("auto")
    ) {
        return "fa-car";
    }

    if (
        name.includes("home") ||
        name.includes("house")
    ) {
        return "fa-house";
    }

    if (
        name.includes("sport")
    ) {
        return "fa-futbol";
    }

    if (
        name.includes("computer") ||
        name.includes("laptop")
    ) {
        return "fa-laptop";
    }

    if (
        name.includes("game")
    ) {
        return "fa-gamepad";
    }

    return "fa-tag";

}


/* =========================================================
   CATEGORY ACTIVE
   ========================================================= */

function refreshCategoryActiveState() {

    $$(".category-item")
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.category ===
                    activeCategory
                );

            }
        );

}


/* =========================================================
   FILTER PRODUCTS
   ========================================================= */

function applyProductFilters() {

    let result =
        [...allProducts];

    /* CATEGORY */

    if (
        activeCategory !== "all"
    ) {

        result =
            result.filter(
                product =>
                    String(
                        product.category
                    ).toLowerCase() ===
                    String(
                        activeCategory
                    ).toLowerCase()
            );

    }


    /* SEARCH */

    if (searchTerm.trim()) {

        const term =
            searchTerm
                .trim()
                .toLowerCase();

        result =
            result.filter(
                product => {

                    const text = [

                        product.name,

                        product.description,

                        product.category,

                        product.sellerName

                    ]
                        .join(" ")
                        .toLowerCase();

                    return text.includes(
                        term
                    );

                }
            );

    }


    /* SORT */

    result =
        sortProductsArray(
            result
        );

    visibleProducts =
        result;

    renderProducts(
        visibleProducts
    );

}


/* =========================================================
   SORT
   ========================================================= */

function sortProductsArray(
    products
) {

    const sorted =
        [...products];

    switch (currentSort) {

        case "price-low":

            sorted.sort(
                (a, b) =>
                    Number(a.price) -
                    Number(b.price)
            );

            break;


        case "price-high":

            sorted.sort(
                (a, b) =>
                    Number(b.price) -
                    Number(a.price)
            );

            break;


        case "popular":

            sorted.sort(
                (a, b) =>
                    Number(b.views || 0) -
                    Number(a.views || 0)
            );

            break;


        case "newest":

        default:

            sorted.sort(
                (a, b) =>
                    getTimestamp(
                        b.createdAt
                    ) -
                    getTimestamp(
                        a.createdAt
                    )
            );

            break;

    }

    return sorted;

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts(
    products
) {

    if (!productsGrid) {
        return;
    }

    if (productsLoading) {
        productsLoading.style.display =
            "none";
    }

    productsGrid.innerHTML = "";

    if (!products.length) {

        if (emptyProducts) {
            emptyProducts.hidden =
                false;
        }

        return;

    }

    if (emptyProducts) {
        emptyProducts.hidden =
            true;
    }


    products.forEach(
        (product, index) => {

            const card =
                createProductCard(
                    product
                );

            productsGrid.appendChild(
                card
            );

            requestAnimationFrame(
                () => {

                    setTimeout(
                        () => {

                            card.classList.add(
                                "product-visible"
                            );

                        },
                        Math.min(
                            index * 55,
                            450
                        )
                    );

                }
            );

        }
    );

}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function createProductCard(
    product
) {

    const card =
        document.createElement("article");

    card.className =
        "product-card";

    card.dataset.id =
        product.id;

    const image =
        product.image ||
        createPlaceholderImage();

    const isWishlisted =
        Boolean(
            wishlistItems[
                product.id
            ]
        );

    const price =
        formatMoney(
            product.price
        );

    const oldPrice =
        product.oldPrice > product.price
            ? formatMoney(
                product.oldPrice
            )
            : "";

    const discount =
        calculateDiscount(
            product.oldPrice,
            product.price
        );

    card.innerHTML = `

        <div class="product-image">

            ${
                discount
                ?
                `
                <span class="product-badge">
                    -${discount}%
                </span>
                `
                :
                ""
            }

            <button
                class="product-wishlist ${
                    isWishlisted
                        ? "active"
                        : ""
                }"
                type="button"
                aria-label="Add to wishlist"
            >

                <i class="${
                    isWishlisted
                        ? "fa-solid"
                        : "fa-regular"
                } fa-heart"></i>

            </button>

            <img
                src="${escapeAttribute(image)}"
                alt="${escapeAttribute(product.name)}"
                loading="lazy"
            >

        </div>


        <div class="product-info">

            <span class="product-category">
                ${escapeHTML(
                    product.category
                )}
            </span>


            <h3 class="product-name">
                ${escapeHTML(
                    product.name
                )}
            </h3>


            ${
                product.description
                ?
                `
                <p class="product-description">
                    ${escapeHTML(
                        product.description
                    )}
                </p>
                `
                :
                ""
            }


            <div class="product-bottom">

                <div>

                    <strong class="product-price">
                        ${price}
                    </strong>

                    ${
                        oldPrice
                        ?
                        `
                        <span class="product-old-price">
                            ${oldPrice}
                        </span>
                        `
                        :
                        ""
                    }

                </div>


                <button
                    class="product-add"
                    type="button"
                    aria-label="Add to cart"
                >

                    <i class="fa-solid fa-plus"></i>

                </button>

            </div>


            <div class="product-seller">

                <div class="product-seller-avatar">

                    <i class="fa-solid fa-store"></i>

                </div>

                <span>
                    ${
                        escapeHTML(
                            product.sellerName ||
                            "CHAPCY Seller"
                        )
                    }
                </span>

            </div>

        </div>

    `;


    /* CARD CLICK */

    card.addEventListener(
        "click",
        (event) => {

            if (
                event.target.closest(
                    ".product-wishlist"
                )
            ) {
                return;
            }

            if (
                event.target.closest(
                    ".product-add"
                )
            ) {
                return;
            }

            openProductModal(
                product
            );

        }
    );


    /* WISHLIST */

    const wishlistButton =
        card.querySelector(
            ".product-wishlist"
        );

    wishlistButton.addEventListener(
        "click",
        async (event) => {

            event.stopPropagation();

            await toggleWishlist(
                product
            );

        }
    );


    /* CART */

    const addButton =
        card.querySelector(
            ".product-add"
        );

    addButton.addEventListener(
        "click",
        async (event) => {

            event.stopPropagation();

            await addToCart(
                product,
                1
            );

        }
    );


    /* IMAGE ERROR */

    const img =
        card.querySelector(
            ".product-image img"
        );

    img.addEventListener(
        "error",
        () => {

            img.src =
                createPlaceholderImage();

        }
    );


    return card;

}


/* =========================================================
   PRODUCT MODAL
   ========================================================= */

function setupProductModal() {

    const closeButton =
        $("#closeProductModal");

    const backdrop =
        $("#productModalBackdrop");

    const decrease =
        $("#decreaseQuantity");

    const increase =
        $("#increaseQuantity");

    const addCart =
        $("#addToCartBtn");

    const modalWishlist =
        $("#modalWishlistBtn");


    closeButton?.addEventListener(
        "click",
        closeProductModal
    );

    backdrop?.addEventListener(
        "click",
        closeProductModal
    );


    decrease?.addEventListener(
        "click",
        () => {

            if (
                selectedQuantity > 1
            ) {

                selectedQuantity--;

                updateQuantityUI();

            }

        }
    );


    increase?.addEventListener(
        "click",
        () => {

            if (!selectedProduct) {
                return;
            }

            const stock =
                Number(
                    selectedProduct.stock
                );

            if (
                stock > 0 &&
                selectedQuantity >= stock
            ) {

                showToast(
                    "Stock",
                    `Only ${stock} available.`
                );

                return;

            }

            selectedQuantity++;

            updateQuantityUI();

        }
    );


    addCart?.addEventListener(
        "click",
        async () => {

            if (!selectedProduct) {
                return;
            }

            await addToCart(
                selectedProduct,
                selectedQuantity
            );

            closeProductModal();

        }
    );


    modalWishlist?.addEventListener(
        "click",
        async () => {

            if (!selectedProduct) {
                return;
            }

            await toggleWishlist(
                selectedProduct
            );

            updateModalWishlistButton();

        }
    );

}


/* =========================================================
   OPEN PRODUCT MODAL
   ========================================================= */

function openProductModal(
    product
) {

    selectedProduct =
        product;

    selectedQuantity =
        1;

    const modal =
        $("#productModal");

    if (!modal) {
        return;
    }


    const image =
        $("#modalProductImage");

    const category =
        $("#modalProductCategory");

    const name =
        $("#modalProductName");

    const price =
        $("#modalProductPrice");

    const description =
        $("#modalProductDescription");

    const seller =
        $("#modalSellerName");


    if (image) {

        image.innerHTML = `

            <img
                src="${escapeAttribute(
                    product.image ||
                    createPlaceholderImage()
                )}"
                alt="${escapeAttribute(
                    product.name
                )}"
            >

        `;

    }


    if (category) {

        category.textContent =
            product.category ||
            "";

    }


    if (name) {

        name.textContent =
            product.name ||
            "";

    }


    if (price) {

        price.textContent =
            formatMoney(
                product.price
            );

    }


    if (description) {

        description.textContent =
            product.description ||
            "No description available.";

    }


    if (seller) {

        seller.textContent =
            product.sellerName ||
            "CHAPCY Seller";

    }


    updateQuantityUI();

    updateModalWishlistButton();


    modal.classList.add(
        "show"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";


    animateModalContent();

}


/* =========================================================
   CLOSE PRODUCT MODAL
   ========================================================= */

function closeProductModal() {

    const modal =
        $("#productModal");

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "show"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    selectedProduct =
        null;

}


/* =========================================================
   QUANTITY UI
   ========================================================= */

function updateQuantityUI() {

    const quantity =
        $("#productQuantity");

    if (quantity) {

        quantity.textContent =
            selectedQuantity;

    }

}


/* =========================================================
   MODAL WISHLIST BUTTON
   ========================================================= */

function updateModalWishlistButton() {

    const button =
        $("#modalWishlistBtn");

    if (!button || !selectedProduct) {
        return;
    }

    const active =
        Boolean(
            wishlistItems[
                selectedProduct.id
            ]
        );

    button.innerHTML = `

        <i class="${
            active
                ? "fa-solid"
                : "fa-regular"
        } fa-heart"></i>

    `;

    button.classList.toggle(
        "active",
        active
    );

}


/* =========================================================
   CART
   ========================================================= */

function setupCart() {

    $("#cartBtn")
        ?.addEventListener(
            "click",
            openCart
        );

    $("#closeCart")
        ?.addEventListener(
            "click",
            closeCart
        );

    $("#cartBackdrop")
        ?.addEventListener(
            "click",
            closeCart
        );

    $("#checkoutBtn")
        ?.addEventListener(
            "click",
            goToCheckout
        );

}


/* =========================================================
   LOAD CART
   ========================================================= */

async function loadUserCart() {

    if (!currentUser) {
        return;
    }

    const cartRef =
        ref(
            db,
            `${USERS_PATH}/${currentUser.uid}/${CART_PATH}`
        );

    if (
        cartListenerStarted
    ) {
        return;
    }

    cartListenerStarted =
        true;

    onValue(
        cartRef,
        snapshot => {

            cartItems =
                snapshot.val() || {};

            updateCartBadge();

            renderCart();

        },
        error => {

            console.error(
                "Cart listener:",
                error
            );

        }
    );

}


/* =========================================================
   ADD TO CART
   ========================================================= */

async function addToCart(
    product,
    quantity = 1
) {

    if (!requireLogin()) {
        return false;
    }

    if (!product?.id) {
        return false;
    }


    try {

        const cartRef =
            ref(
                db,
                `${USERS_PATH}/${currentUser.uid}/${CART_PATH}/${product.id}`
            );

        const snapshot =
            await get(
                cartRef
            );

        const existing =
            snapshot.val();


        const currentQuantity =
            existing?.quantity || 0;


        const stock =
            Number(
                product.stock
            );


        const newQuantity =
            currentQuantity +
            quantity;


        if (
            stock > 0 &&
            newQuantity > stock
        ) {

            showToast(
                "Stock",
                `Only ${stock} available.`
            );

            return false;

        }


        await set(
            cartRef,
            {

                productId:
                    product.id,

                name:
                    product.name,

                price:
                    Number(
                        product.price
                    ),

                image:
                    product.image ||
                    "",

                sellerId:
                    product.sellerId ||
                    "",

                sellerName:
                    product.sellerName ||
                    "",

                quantity:
                    newQuantity,

                updatedAt:
                    serverTimestamp()

            }
        );


        showToast(
            "Added to cart",
            `${product.name} added to your cart.`
        );


        animateCartButton();

        return true;

    } catch (error) {

        console.error(
            "Add to cart error:",
            error
        );

        showToast(
            "Error",
            "Unable to add product to cart."
        );

        return false;

    }

}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

async function removeFromCart(
    productId
) {

    if (!requireLogin()) {
        return;
    }

    try {

        await remove(
            ref(
                db,
                `${USERS_PATH}/${currentUser.uid}/${CART_PATH}/${productId}`
            )
        );

        showToast(
            "Cart",
            "Product removed from cart."
        );

    } catch (error) {

        console.error(
            error
        );

    }

}


/* =========================================================
   UPDATE CART QUANTITY
   ========================================================= */

async function updateCartQuantity(
    productId,
    quantity
) {

    if (!currentUser) {
        return;
    }

    if (quantity <= 0) {

        await removeFromCart(
            productId
        );

        return;

    }


    try {

        await update(
            ref(
                db,
                `${USERS_PATH}/${currentUser.uid}/${CART_PATH}/${productId}`
            ),
            {

                quantity:
                    Number(quantity),

                updatedAt:
                    serverTimestamp()

            }
        );

    } catch (error) {

        console.error(
            "Cart update:",
            error
        );

    }

}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

    const container =
        $("#cartItems");

    const empty =
        $("#cartEmpty");

    const totalElement =
        $("#cartTotal");


    if (!container) {
        return;
    }

    container.innerHTML = "";


    const items =
        Object.entries(
            cartItems || {}
        );


    if (!items.length) {

        if (empty) {
            empty.style.display =
                "block";
        }

        if (totalElement) {
            totalElement.textContent =
                formatMoney(0);
        }

        return;

    }


    if (empty) {
        empty.style.display =
            "none";
    }


    let total =
        0;

    let itemCount =
        0;


    items.forEach(
        ([id, item]) => {

            if (!item) {
                return;
            }

            const quantity =
                Number(
                    item.quantity
                ) || 0;

            const price =
                Number(
                    item.price
                ) || 0;

            total +=
                price *
                quantity;

            itemCount +=
                quantity;


            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "cart-item";

            element.innerHTML = `

                <div class="cart-item-image">

                    <img
                        src="${escapeAttribute(
                            item.image ||
                            createPlaceholderImage()
                        )}"
                        alt="${escapeAttribute(
                            item.name
                        )}"
                    >

                </div>


                <div class="cart-item-info">

                    <h4>
                        ${escapeHTML(
                            item.name
                        )}
                    </h4>

                    <strong>
                        ${formatMoney(
                            price
                        )}
                    </strong>


                    <div class="cart-item-controls">

                        <button
                            type="button"
                            class="cart-minus"
                        >
                            −
                        </button>

                        <span>
                            ${quantity}
                        </span>

                        <button
                            type="button"
                            class="cart-plus"
                        >
                            +
                        </button>

                        <button
                            type="button"
                            class="cart-remove"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </div>

            `;


            element
                .querySelector(
                    ".cart-minus"
                )
                ?.addEventListener(
                    "click",
                    () => {

                        updateCartQuantity(
                            id,
                            quantity - 1
                        );

                    }
                );


            element
                .querySelector(
                    ".cart-plus"
                )
                ?.addEventListener(
                    "click",
                    () => {

                        updateCartQuantity(
                            id,
                            quantity + 1
                        );

                    }
                );


            element
                .querySelector(
                    ".cart-remove"
                )
                ?.addEventListener(
                    "click",
                    () => {

                        removeFromCart(
                            id
                        );

                    }
                );


            container.appendChild(
                element
            );

        }
    );


    if (totalElement) {

        totalElement.textContent =
            formatMoney(
                total
            );

    }

    updateCartBadge(
        itemCount
    );

}


/* =========================================================
   CART BADGE
   ========================================================= */

function updateCartBadge(
    forcedCount = null
) {

    let count =
        forcedCount;

    if (count === null) {

        count =
            Object.values(
                cartItems || {}
            ).reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item?.quantity || 0
                    ),
                0
            );

    }

    if (cartBadge) {

        cartBadge.textContent =
            count;

        cartBadge.style.display =
            count > 0
                ? "grid"
                : "none";

    }

}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

    const drawer =
        $("#cartDrawer");

    if (!drawer) {
        return;
    }

    renderCart();

    drawer.classList.add(
        "show"
    );

    drawer.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE CART
   ========================================================= */

function closeCart() {

    const drawer =
        $("#cartDrawer");

    if (!drawer) {
        return;
    }

    drawer.classList.remove(
        "show"
    );

    drawer.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

}


/* =========================================================
   WISHLIST
   ========================================================= */

function setupWishlist() {

    $("#wishlistBtn")
        ?.addEventListener(
            "click",
            openWishlist
        );

    $("#closeWishlist")
        ?.addEventListener(
            "click",
            closeWishlist
        );

    $("#wishlistBackdrop")
        ?.addEventListener(
            "click",
            closeWishlist
        );

}


/* =========================================================
   LOAD WISHLIST
   ========================================================= */

async function loadUserWishlist() {

    if (!currentUser) {
        return;
    }

    if (wishlistListenerStarted) {
        return;
    }

    wishlistListenerStarted =
        true;

    const wishlistRef =
        ref(
            db,
            `${USERS_PATH}/${currentUser.uid}/${WISHLIST_PATH}`
        );

    onValue(
        wishlistRef,
        snapshot => {

            wishlistItems =
                snapshot.val() || {};

            updateWishlistBadge();

            refreshProductWishlistButtons();

            updateModalWishlistButton();

            renderWishlist();

        },
        error => {

            console.error(
                "Wishlist listener:",
                error
            );

        }
    );

}


/* =========================================================
   TOGGLE WISHLIST
   ========================================================= */

async function toggleWishlist(
    product
) {

    if (!requireLogin()) {
        return;
    }

    if (!product?.id) {
        return;
    }


    const itemRef =
        ref(
            db,
            `${USERS_PATH}/${currentUser.uid}/${WISHLIST_PATH}/${product.id}`
        );


    try {

        if (
            wishlistItems[
                product.id
            ]
        ) {

            await remove(
                itemRef
            );

            showToast(
                "Wishlist",
                "Removed from wishlist."
            );

        } else {

            await set(
                itemRef,
                {

                    productId:
                        product.id,

                    name:
                        product.name,

                    price:
                        Number(
                            product.price
                        ),

                    image:
                        product.image ||
                        "",

                    sellerId:
                        product.sellerId ||
                        "",

                    sellerName:
                        product.sellerName ||
                        "",

                    createdAt:
                        serverTimestamp()

                }
            );

            showToast(
                "Wishlist",
                "Saved to your wishlist."
            );

        }

    } catch (error) {

        console.error(
            "Wishlist error:",
            error
        );

        showToast(
            "Error",
            "Unable to update wishlist."
        );

    }

}


/* =========================================================
   REFRESH WISHLIST BUTTONS
   ========================================================= */

function refreshProductWishlistButtons() {

    $$(".product-card")
        .forEach(
            card => {

                const id =
                    card.dataset.id;

                const button =
                    card.querySelector(
                        ".product-wishlist"
                    );

                if (!button) {
                    return;
                }

                const active =
                    Boolean(
                        wishlistItems[id]
                    );

                button.classList.toggle(
                    "active",
                    active
                );

                button.innerHTML = `

                    <i class="${
                        active
                            ? "fa-solid"
                            : "fa-regular"
                    } fa-heart"></i>

                `;

            }
        );

}


/* =========================================================
   WISHLIST BADGE
   ========================================================= */

function updateWishlistBadge() {

    const count =
        Object.keys(
            wishlistItems || {}
        ).length;

    if (wishlistBadge) {

        wishlistBadge.textContent =
            count;

        wishlistBadge.style.display =
            count > 0
                ? "grid"
                : "none";

    }

}


/* =========================================================
   RENDER WISHLIST
   ========================================================= */

function renderWishlist() {

    const container =
        $("#wishlistItems");

    const empty =
        $("#wishlistEmpty");


    if (!container) {
        return;
    }

    container.innerHTML = "";


    const items =
        Object.entries(
            wishlistItems || {}
        );


    if (!items.length) {

        if (empty) {
            empty.style.display =
                "block";
        }

        return;

    }


    if (empty) {
        empty.style.display =
            "none";
    }


    items.forEach(
        ([id, item]) => {

            if (!item) {
                return;
            }


            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "wishlist-item";


            element.innerHTML = `

                <div class="wishlist-item-image">

                    <img
                        src="${escapeAttribute(
                            item.image ||
                            createPlaceholderImage()
                        )}"
                        alt="${escapeAttribute(
                            item.name
                        )}"
                    >

                </div>


                <div class="wishlist-item-info">

                    <h4>
                        ${escapeHTML(
                            item.name
                        )}
                    </h4>

                    <strong>
                        ${formatMoney(
                            item.price
                        )}
                    </strong>

                    <button
                        type="button"
                        class="wishlist-add"
                    >
                        Add to Cart
                    </button>

                </div>


                <button
                    type="button"
                    class="wishlist-delete"
                    aria-label="Remove"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>

            `;


            element
                .querySelector(
                    ".wishlist-delete"
                )
                ?.addEventListener(
                    "click",
                    () => {

                        toggleWishlist({
                            id,
                            ...item
                        });

                    }
                );


            element
                .querySelector(
                    ".wishlist-add"
                )
                ?.addEventListener(
                    "click",
                    async () => {

                        await addToCart(
                            {
                                id,
                                ...item
                            },
                            1
                        );

                    }
                );


            container.appendChild(
                element
            );

        }
    );

}


/* =========================================================
   OPEN WISHLIST
   ========================================================= */

function openWishlist() {

    const drawer =
        $("#wishlistDrawer");

    if (!drawer) {
        return;
    }

    renderWishlist();

    drawer.classList.add(
        "show"
    );

    drawer.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE WISHLIST
   ========================================================= */

function closeWishlist() {

    const drawer =
        $("#wishlistDrawer");

    if (!drawer) {
        return;
    }

    drawer.classList.remove(
        "show"
    );

    drawer.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    $("#searchToggle")
        ?.addEventListener(
            "click",
            () => {

                const section =
                    $("#searchSection");

                section?.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                setTimeout(
                    () => {

                        productSearch?.focus();

                    },
                    350
                );

            }
        );


    productSearch
        ?.addEventListener(
            "input",
            () => {

                searchTerm =
                    productSearch.value;

                applyProductFilters();

            }
        );


    clearSearch
        ?.addEventListener(
            "click",
            () => {

                if (productSearch) {

                    productSearch.value =
                        "";

                }

                searchTerm =
                    "";

                applyProductFilters();

                productSearch?.focus();

            }
        );

}


/* =========================================================
   SORTING
   ========================================================= */

function setupSorting() {

    sortProducts
        ?.addEventListener(
            "change",
            () => {

                currentSort =
                    sortProducts.value;

                applyProductFilters();

            }
        );

}


/* =========================================================
   RESET
   ========================================================= */

function setupCategoryButton() {

    $("#allCategoriesBtn")
        ?.addEventListener(
            "click",
            () => {

                activeCategory =
                    "all";

                refreshCategoryActiveState();

                applyProductFilters();

                scrollToProducts();

            }
        );


    $("#resetProductsBtn")
        ?.addEventListener(
            "click",
            () => {

                activeCategory =
                    "all";

                searchTerm =
                    "";

                currentSort =
                    "newest";


                if (productSearch) {
                    productSearch.value =
                        "";
                }

                if (sortProducts) {
                    sortProducts.value =
                        "newest";
                }

                refreshCategoryActiveState();

                applyProductFilters();

            }
        );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    $("#backBtn")
        ?.addEventListener(
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


    $("#shopNowBtn")
        ?.addEventListener(
            "click",
            () => {

                scrollToProducts();

            }
        );


    $("#loginBtn")
        ?.addEventListener(
            "click",
            () => {

                window.location.href =
                    "login.html";

            }
        );


    $("#footerOrdersBtn")
        ?.addEventListener(
            "click",
            () => {

                if (!requireLogin()) {
                    return;
                }

                window.location.href =
                    "orders.html";

            }
        );


    $("#footerWishlistBtn")
        ?.addEventListener(
            "click",
            () => {

                if (!requireLogin()) {
                    return;
                }

                openWishlist();

            }
        );

}


/* =========================================================
   SELLER
   ========================================================= */

function setupSellerButtons() {

    const buttons = [

        "#sellOnChapcyBtn",

        "#openSellerBtn",

        "#footerSellerBtn"

    ];


    buttons.forEach(
        selector => {

            $(selector)
                ?.addEventListener(
                    "click",
                    () => {

                        if (
                            !requireLogin()
                        ) {
                            return;
                        }

                        window.location.href =
                            "seller.html";

                    }
                );

        }
    );

}


/* =========================================================
   AUTH REQUIRED
   ========================================================= */

function requireLogin() {

    if (currentUser) {
        return true;
    }

    openAuthModal();

    return false;

}


/* =========================================================
   AUTH MODAL
   ========================================================= */

function setupAuthModal() {

    $("#closeAuthModal")
        ?.addEventListener(
            "click",
            closeAuthModal
        );

    $("#authBackdrop")
        ?.addEventListener(
            "click",
            closeAuthModal
        );

}


/* =========================================================
   OPEN AUTH MODAL
   ========================================================= */

function openAuthModal() {

    const modal =
        $("#authModal");

    if (!modal) {
        return;
    }

    modal.classList.add(
        "show"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =========================================================
   CLOSE AUTH MODAL
   ========================================================= */

function closeAuthModal() {

    const modal =
        $("#authModal");

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "show"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function goToCheckout() {

    if (!requireLogin()) {
        return;
    }


    const items =
        Object.values(
            cartItems || {}
        );


    if (!items.length) {

        showToast(
            "Cart",
            "Your cart is empty."
        );

        return;

    }


    sessionStorage.setItem(
        "chapcyDropCheckout",
        "true"
    );


    window.location.href =
        "checkout.html";

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;

function showToast(
    title,
    message
) {

    const toast =
        $("#dropToast");

    if (!toast) {
        return;
    }

    const titleElement =
        $("#toastTitle");

    const messageElement =
        $("#toastMessage");


    if (titleElement) {
        titleElement.textContent =
            title;
    }

    if (messageElement) {
        messageElement.textContent =
            message;
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
            3500
        );

}


$("#closeToast")
    ?.addEventListener(
        "click",
        () => {

            $("#dropToast")
                ?.classList.remove(
                    "show"
                );

        }
    );


/* =========================================================
   CART ANIMATION
   ========================================================= */

function animateCartButton() {

    const button =
        $("#cartBtn");

    if (!button) {
        return;
    }

    button.classList.remove(
        "cart-pop"
    );

    void button.offsetWidth;

    button.classList.add(
        "cart-pop"
    );

}


/* =========================================================
   MODAL ANIMATION
   ========================================================= */

function animateModalContent() {

    const content =
        document.querySelector(
            ".product-modal-content"
        );

    if (!content) {
        return;
    }

    content.classList.remove(
        "modal-pop"
    );

    void content.offsetWidth;

    content.classList.add(
        "modal-pop"
    );

}


/* =========================================================
   PAGE ANIMATIONS
   ========================================================= */

function setupAnimations() {

    injectAnimationStyles();

    requestAnimationFrame(
        () => {

            document.body.classList.add(
                "page-ready"
            );

        }
    );

}


/* =========================================================
   SCROLL EFFECTS
   ========================================================= */

function setupScrollEffects() {

    const sections =
        document.querySelectorAll(
            ".category-section, .products-section, .seller-banner"
        );


    if (
        !("IntersectionObserver" in window)
    ) {

        sections.forEach(
            section => {

                section.classList.add(
                    "reveal-visible"
                );

            }
        );

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "reveal-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.08
            }
        );


    sections.forEach(
        section => {

            section.classList.add(
                "reveal-section"
            );

            observer.observe(
                section
            );

        }
    );

}


/* =========================================================
   KEYBOARD
   ========================================================= */

function setupKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeProductModal();

                closeCart();

                closeWishlist();

                closeAuthModal();

            }


            if (
                event.key === "/" &&
                document.activeElement?.tagName !==
                "INPUT"
            ) {

                event.preventDefault();

                productSearch?.focus();

            }

        }
    );

}


/* =========================================================
   SCROLL TO PRODUCTS
   ========================================================= */

function scrollToProducts() {

    $("#productsSection")
        ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


/* =========================================================
   ERROR STATE
   ========================================================= */

function showProductsError(
    message
) {

    if (!productsGrid) {
        return;
    }

    if (productsLoading) {
        productsLoading.style.display =
            "none";
    }

    productsGrid.innerHTML = `

        <div
            class="products-loading"
            style="grid-column:1/-1"
        >

            <div class="empty-icon">

                <i class="fa-solid fa-cloud-arrow-down"></i>

            </div>

            <h3>
                CHAPCY DROP unavailable
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

            <button
                type="button"
                class="primary-btn"
                id="retryProducts"
                style="margin-top:18px"
            >
                <i class="fa-solid fa-rotate-right"></i>
                Retry
            </button>

        </div>

    `;


    $("#retryProducts")
        ?.addEventListener(
            "click",
            () => {

                productsListenerStarted =
                    false;

                startProductsListener();

            }
        );

}


/* =========================================================
   START FIREBASE PRODUCT LISTENER
   ========================================================= */

startProductsListener();


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   ATTRIBUTE ESCAPE
   ========================================================= */

function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


/* =========================================================
   MONEY
   ========================================================= */

function formatMoney(
    value
) {

    const number =
        Number(value) || 0;


    return new Intl.NumberFormat(
        "en-TZ",
        {
            style: "currency",
            currency: "TZS",
            maximumFractionDigits: 0
        }
    ).format(
        number
    );

}


/* =========================================================
   DISCOUNT
   ========================================================= */

function calculateDiscount(
    oldPrice,
    price
) {

    const oldValue =
        Number(oldPrice);

    const newValue =
        Number(price);


    if (
        !oldValue ||
        !newValue ||
        oldValue <= newValue
    ) {

        return 0;

    }


    return Math.round(
        (
            (oldValue - newValue) /
            oldValue
        ) * 100
    );

}


/* =========================================================
   TIMESTAMP
   ========================================================= */

function getTimestamp(
    value
) {

    if (!value) {
        return 0;
    }

    if (
        typeof value === "number"
    ) {
        return value;
    }

    if (
        typeof value === "object" &&
        value.seconds
    ) {

        return (
            value.seconds * 1000
        );

    }

    if (
        typeof value === "string"
    ) {

        const time =
            Date.parse(value);

        return Number.isNaN(time)
            ? 0
            : time;

    }

    return 0;

}


/* =========================================================
   PLACEHOLDER
   ========================================================= */

function createPlaceholderImage() {

    const svg = `

        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800"
            height="800"
            viewBox="0 0 800 800"
        >

            <defs>

                <linearGradient
                    id="g"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >

                    <stop
                        offset="0"
                        stop-color="#07152e"
                    />

                    <stop
                        offset="1"
                        stop-color="#130b2e"
                    />

                </linearGradient>

            </defs>

            <rect
                width="800"
                height="800"
                fill="url(#g)"
            />

            <circle
                cx="400"
                cy="350"
                r="130"
                fill="none"
                stroke="#00eaff"
                stroke-opacity=".35"
                stroke-width="8"
            />

            <path
                d="M330 350h140M400 280v140"
                stroke="#00eaff"
                stroke-opacity=".65"
                stroke-width="10"
                stroke-linecap="round"
            />

            <text
                x="400"
                y="560"
                text-anchor="middle"
                fill="white"
                fill-opacity=".55"
                font-family="Arial"
                font-size="34"
                font-weight="bold"
            >
                CHAPCY DROP
            </text>

        </svg>

    `;


    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );

}


/* =========================================================
   INJECT ANIMATION STYLES
   ========================================================= */

function injectAnimationStyles() {

    if (
        document.getElementById(
            "chapcyDropAnimations"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );

    style.id =
        "chapcyDropAnimations";


    style.textContent = `

        /* PAGE */

        body {
            opacity: 0;
            transition: opacity .7s ease;
        }

        body.page-ready {
            opacity: 1;
        }


        /* PRODUCT REVEAL */

        .product-card {
            opacity: 0;
            transform:
                translateY(22px)
                scale(.97);
        }

        .product-card.product-visible {
            opacity: 1;
            transform:
                translateY(0)
                scale(1);

            transition:
                opacity .55s ease,
                transform .55s cubic-bezier(.2,.8,.2,1);
        }


        /* MODAL */

        .product-modal-content {
            transform:
                translateY(30px)
                scale(.94);

            opacity: 0;

            transition:
                transform .4s cubic-bezier(.2,.8,.2,1),
                opacity .3s ease;
        }

        .product-modal.show
        .product-modal-content {
            transform:
                translateY(0)
                scale(1);

            opacity: 1;
        }

        .product-modal-content.modal-pop {
            animation:
                chapcyModalPop .5s
                cubic-bezier(.2,.8,.2,1);
        }

        @keyframes chapcyModalPop {

            0% {
                transform:
                    translateY(30px)
                    scale(.92);
            }

            60% {
                transform:
                    translateY(-5px)
                    scale(1.015);
            }

            100% {
                transform:
                    translateY(0)
                    scale(1);
            }

        }


        /* CART */

        #cartBtn.cart-pop {
            animation:
                cartPop .45s
                cubic-bezier(.2,.8,.2,1);
        }

        @keyframes cartPop {

            0% {
                transform: scale(1);
            }

            35% {
                transform:
                    scale(1.2)
                    rotate(-5deg);
            }

            70% {
                transform:
                    scale(.94)
                    rotate(4deg);
            }

            100% {
                transform: scale(1);
            }

        }


        /* REVEAL */

        .reveal-section {
            opacity: 0;
            transform:
                translateY(25px);
            transition:
                opacity .7s ease,
                transform .7s ease;
        }

        .reveal-section.reveal-visible {
            opacity: 1;
            transform:
                translateY(0);
        }


        /* CATEGORY */

        .category-item {
            transition:
                transform .28s cubic-bezier(.2,.8,.2,1),
                border-color .28s ease,
                box-shadow .28s ease;
        }


        /* BUTTON RIPPLE */

        .chapcy-ripple {
            position: absolute;

            border-radius: 50%;

            pointer-events: none;

            background:
                rgba(255,255,255,.35);

            transform:
                scale(0);

            animation:
                chapcyRipple .6s ease-out;
        }

        @keyframes chapcyRipple {

            to {
                transform:
                    scale(4);

                opacity: 0;
            }

        }


        /* CART ITEMS */

        .cart-item,
        .wishlist-item {

            display: flex;

            align-items: center;

            gap: 11px;

            padding: 11px;

            margin-bottom: 10px;

            border-radius: 15px;

            background:
                rgba(255,255,255,.035);

            border:
                1px solid
                rgba(255,255,255,.06);

            animation:
                itemAppear .35s
                ease both;

        }

        @keyframes itemAppear {

            from {
                opacity: 0;
                transform:
                    translateX(15px);
            }

            to {
                opacity: 1;
                transform:
                    translateX(0);
            }

        }


        .cart-item-image,
        .wishlist-item-image {

            width: 58px;
            height: 58px;

            flex: 0 0 58px;

            overflow: hidden;

            border-radius: 12px;

            background: #071127;

        }

        .cart-item-image img,
        .wishlist-item-image img {

            width: 100%;
            height: 100%;

            object-fit: cover;

        }

        .cart-item-info,
        .wishlist-item-info {

            min-width: 0;

            flex: 1;

        }

        .cart-item-info h4,
        .wishlist-item-info h4 {

            overflow: hidden;

            text-overflow: ellipsis;

            white-space: nowrap;

            font-size: 10px;

        }

        .cart-item-info strong,
        .wishlist-item-info strong {

            display: block;

            margin-top: 4px;

            color: #65f5ff;

            font-size: 10px;

        }

        .cart-item-controls {

            display: flex;

            align-items: center;

            gap: 6px;

            margin-top: 7px;

        }

        .cart-item-controls button {

            width: 25px;
            height: 25px;

            display: grid;

            place-items: center;

            border-radius: 7px;

            color: white;

            background:
                rgba(255,255,255,.06);

        }

        .cart-item-controls span {

            min-width: 20px;

            text-align: center;

            font-size: 9px;

        }

        .cart-remove {

            margin-left: auto;

            color: #ff547f !important;

        }

        .wishlist-delete {

            width: 28px;
            height: 28px;

            flex: 0 0 28px;

            border-radius: 8px;

            color: #ff547f;

            background:
                rgba(255,79,127,.08);

        }

        .wishlist-add {

            margin-top: 7px;

            padding: 5px 8px;

            border-radius: 7px;

            color: #00161a;

            background: #00eaff;

            font-size: 8px;

            font-weight: 700;

        }


        /* AUTH */

        .auth-box {

            animation:
                authPop .4s
                cubic-bezier(.2,.8,.2,1);

        }

        @keyframes authPop {

            from {

                opacity: 0;

                transform:
                    scale(.9)
                    translateY(20px);

            }

            to {

                opacity: 1;

                transform:
                    scale(1)
                    translateY(0);

            }

        }

    `;


    document.head.appendChild(
        style
    );


    setupRippleEffect();

}


/* =========================================================
   RIPPLE EFFECT
   ========================================================= */

function setupRippleEffect() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button"
                );

            if (!button) {
                return;
            }

            if (
                button.classList.contains(
                    "modal-close"
                )
            ) {
                return;
            }


            const rect =
                button.getBoundingClientRect();


            const ripple =
                document.createElement(
                    "span"
                );

            ripple.className =
                "chapcy-ripple";


            const size =
                Math.max(
                    rect.width,
                    rect.height
                );


            ripple.style.width =
                `${size}px`;

            ripple.style.height =
                `${size}px`;

            ripple.style.left =
                `${
                    event.clientX -
                    rect.left -
                    size / 2
                }px`;

            ripple.style.top =
                `${
                    event.clientY -
                    rect.top -
                    size / 2
                }px`;


            if (
                getComputedStyle(
                    button
                ).position ===
                "static"
            ) {

                button.style.position =
                    "relative";

            }


            button.style.overflow =
                "hidden";


            button.appendChild(
                ripple
            );


            setTimeout(
                () => {

                    ripple.remove();

                },
                650
            );

        }
    );

}
