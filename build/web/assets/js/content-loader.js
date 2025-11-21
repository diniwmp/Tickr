
function loadHeader() {
const data = `<div class="container">
                <div class="header-top">
                    <div class="row justify-content-between align-items-center">
                        <div class="col d-none d-lg-block">
                            <ul class="header-contact">
                                <li><i class="fas fa-envelope"></i> <a href="mailto:info@travolo.com">info@tickr.com</a>
                                </li>
                                <li><i class="fas fa-phone-alt"></i> <a href="tel:02073885619">020 7388 5619</a></li>
                            </ul>
                        </div>
                        <div class="col-auto">
                            <div class="header-social">
                                <a href="#"><i class="fab fa-facebook-f"></i></a>
                                <a href="#"><i class="fab fa-instagram"></i></a>
                                <a href="#"><i class="fab fa-pinterest-p"></i></a>
                                <a href="#"><i class="fab fa-twitter"></i></a>
                            </div>
                        </div>
                        <div class="col-auto d-flex ">
                            <a class="vs-btn style2 mb-3 mt-3" href="sign-up.html">Register</a>
                            <a class="vs-btn style2 mb-3 mt-3 ms-2" href="my-account.html"><i class="far fa-user-circle"></i></a>
                        </div>
                    </div>
                </div>
            </div>  
            <div class ="sticky-wrapper">
                <div class="sticky-active">
                    <div class="container position-relative z-index-common">
                        <div class="row align-items-center justify-content-between">
                            <div class="col-auto">
                                <div class="vs-logo">
                                    <a href="index.html"><img src="assets/img/logo.png" alt="logo"></a>
                                </div>
                            </div>
                            <div class="col text-end text-xl-center">
                                <nav class="main-menu  menu-style1 d-none d-lg-block">
                                    <ul>
                                        <li>
                                            <a href="index.html">Home</a>
                                        </li>

                                        <li class="menu-item-has-children mega-menu-wrap">
                                            <a href="#">Pages</a>
                                            <ul class="mega-menu">
                                                <li>
                                                    <a href="shop.html">Pagelist 1</a>
                                                    <ul>
                                                        <li><a href="index.html">Home </a></li>
                                                        <li><a href="shop.html">Watches</a></li>
                                                        <li><a href="shop.html">Watches Details</a></li>

                                                    </ul>
                                                </li>
                                                <li>
                                                    <a href="#">Pagelist 2</a>
                                                    <ul>
                                                        <li><a href="about.html">About Us</a></li>
                                                        <li><a href="shop.html">Shop</a></li>
                                                        <li><a href="shop.html">Shop Details</a></li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <a href="#">Pagelist 3</a>
                                                    <ul>
                                                        <li><a href="cart.html">Cart</a></li>
                                                        <li><a href="wishlist.html">Wishlist</a></li>
                                                        <li><a href="checkout.html">Checkout</a></li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <a href="#">Pagelist 4</a>
                                                    <ul>
                                                        <li><a href="my-account.html">User Profile</a></li>
                                                        <li><a href="sign-up.html">Sign Up</a></li>
                                                        <li><a href="sign.in">Sign In</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                        <li class="menu-item-has-children">
                                            <a href="#">Watches</a>
                                            <ul class="sub-menu">
                                                <li><a href="wishlist.html">Wishlist</a></li>
                                                <li><a href="cart.html">Cart</a></li>
                                                <li><a href="checkout.html">Checkout</a></li>

                                            </ul>
                                        </li>
                                        <li class="menu-item-has-children">
                                            <a href="#">Shop</a>
                                            <ul class="sub-menu">
                                                <li><a href="shop.html">Shop</a></li>
                                                <li><a href="shop.html">Shop Details</a></li>
                                                <li><a href="cart.html">Cart</a></li>
                                                <li><a href="checkout.html">Checkout</a></li>
                                            </ul>
                                        </li>

                                        <li>
                                            <a href="contact.html">Contact</a>
                                        </li>
                                    </ul>
                                </nav>
                                <button class="vs-menu-toggle d-inline-block d-lg-none"><i class="fal fa-bars"></i></button>
                            </div>
                            <div class="col-auto d-none d-xl-block">
                                <div class="header-btns">
                                    <button onclick="window.location='shop.html';"  class="searchBoxTggler"><i class="fal fa-search"></i></button>
                                    <button  onclick="window.location='cart.html';" class="sideCartToggler"><i class="fal fa-shopping-bag"></i>
                                    <span class="button-badge">2</span></button>
                                    <button onclick="window.location='wishlist.html';"  class="sideCartToggler"><i class="fal fa-heart"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        document.querySelector("header").innerHTML = data;
}

function loadFooter() {
const data = ` <div class="footer-wrapper footer-layout1" data-bg-src="assets/img/bg/footer-bg.jpg">
                <div class="footer-top">
                    <div class="shadow-color"></div>
  
                </div>
                <div class="widget-area">
                    <div class="container">
                        <div class="row g-5 justify-content-between">
                            <div class="col-md-6 col-xl-3">
                                <div class="widget footer-widget">
                                    <div class="vs-widget-about">
                                        <div>
                                            <a class="footer-logo" href="index.html"><img src="assets/img/favicons/favicon.png" alt="Tickr"
                                                                                          class="logo" /></a>
                                            
                                            <span  style="font-size:35px; font-weight: 600; color: #37d4d9;">Ticker</span>
                                        </div>
                                        <p class="footer-text">Ticker is your ultimate destination for timeless sophistication and precision timekeeping.
                                            We curate a premium collection of classic and modern watches that blend luxury,
                                            innovation, and style.
                                        </p>
                                        <div class="social-style">
                                            <a href="#" target="_blank"><i class="fab fa-facebook-f"></i></a>
                                            <a href="#" target="_blank"><i class="fab fa-instagram"></i></a>
                                            <a href="#" target="_blank"><i class="fab fa-pinterest-p"></i></a>
                                            <a href="#" target="_blank"><i class="fab fa-twitter"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 col-xl-2">
                                <div class="widget widget_nav_menu footer-widget">
                                    <h3 class="widget_title">Useful Links</h3>
                                    <div class="menu-all-pages-container">
                                        <ul class="menu">
                                            <li><a href="index.html"><i class="far fa-angle-right"></i> Home</a></li>
                                            <li><a href="shop.html"><i class="far fa-angle-right"></i> Watches</a></li>
                                            <li><a href="my-account.html"><i class="far fa-angle-right"></i> My Account</a></li>
                                            <li><a href="sign-in.html"><i class="far fa-angle-right"></i> Sign In</a></li>
                                            <li><a href="sign-up.html"><i class="far fa-angle-right"></i> Sign Up</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6 col-xl-3">
                                <div class="widget footer-widget">
                                    <h4 class="widget_title">Subscribe</h4>
                                    <form class="newsletter-form">
                                        <p class="form_text">Subscribe Our Newsletter For Getting Quick Updates</p>
                                        <input class="form-control" type="email" placeholder="Your Email Address" />
                                        <button type="submit" class="vs-btn style4">Subscribe</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="copyright-wrap">
                        <div class="row justify-content-between align-items-center">
                            <div class="col-lg-auto">
                                <p class="copyright-text">Copyright <i class="fal fa-copyright"></i>
                                    <script>document.write(new Date().getFullYear())</script> <a href="index.html">Tickr</a>.
                                    All Rights Reserved By <a href="index.html">TickrWatches</a>
                                </p>
                            </div>
                            <div class="col-auto d-none d-lg-block">
                                <div class="copyright-menu">
                                    <ul class="list-unstyled">
                                        <li><a href="#">Privacy</a></li>
                                        <li><a href="#">Terms & Conditions</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
 
    <div class="sideCart-wrapper offcanvas-wrapper d-none d-lg-block" id="cart-dropdown">
            <div class="sidemenu-content">
                <button class="closeButton border-theme bg-theme-hover sideMenuCls"><i class="far fa-times"></i></button>
                <div class="widget widget_shopping_cart">
                    <h3 class="widget_title">Shopping cart</h3>
                    <div class="widget_shopping_cart_content">
                        <ul class="cart_list">
                            <li class="mini_cart_item">
                                <ul class="cart-item-list" id="side-panel-cart-item-list">
                                </ul>
                            </li>
                        </ul>
                        <div class="total">
                            <strong>Subtotal:</strong> <span class="amount" id="side-panel-cart-sub-total"> Rs.0.00</span>
                        </div>
                        <div class="buttons">
                            <a href="cart.html" class="vs-btn style4">View cart</a>
                            <a href="checkout.html" class="vs-btn style4">Checkout</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

<div class="closeMask"></div>`;
        document.querySelector("footer").innerHTML = data;
}


async function viewCart() {
const popup = new Notification();
        try {
        const response = await fetch("LoadCartItems");
                if (response.ok) {
        const json = await response.json();
                if (json.status) {
        const side_panel_cart_item_list = document.getElementById("side-panel-cart-item-list");
                side_panel_cart_item_list.innerHTML = "";
                let total = 0;
                json.cartItems.forEach(cart => {
                let productSubTotal = cart.product.price * cart.qty;
                        total += productSubTotal;
                        const cartItem = `
                        <li class="mini_cart_item">
                            <a href="#" class="remove"><i class="fal fa-trash-alt"></i></a>
                            <a href="single-product.html?id=${cart.product.id}">
                                <img src="product-images/${cart.product.id}/image1.png" alt="Cart Image" />
                            </a>
                            <div class="item-content">
                                <h3 class="item-title">
                                    <a href="single-product.html?id=${cart.product.id}">${cart.product.title}</a>
                                </h3>
                                <div class="item-price">
                                    <span class="currency-symbol">Rs. </span>
                                    ${(cart.product.price).toFixed(2)}
                                </div>
                                <div class="pro-qty item-quantity">
                                    <input type="number" class="quantity-input" value="${cart.qty}" readonly>
                                </div>
                            </div>
                        </li>
                    `;
                        side_panel_cart_item_list.innerHTML += cartItem;
                });
                document.getElementById("side-panel-cart-sub-total").innerText = `Rs. ${(total).toFixed(2)}`;
        } else {
        popup.error({ message: json.message });
        }
        } else {
        popup.error({ message: "Cart Items Loading Failed" });
        }
        } catch (err) {
popup.error({ message: "Unexpected error loading cart!" });
        console.error(err);
        }
}

window.addEventListener("DOMContentLoaded", () => {
loadHeader();
        loadFooter();
});



