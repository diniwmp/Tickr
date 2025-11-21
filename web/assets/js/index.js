function indexOnloadFunctions() {
    checkSessionCart();
    loadProductData();
    checkSessionWish();
}
async function checkSessionCart() {
    const popup = new Notification();
    const response = await fetch("CheckSessionCart");
    if (!response.ok) {

//        popup.error({
//            message: "Something went wrong! Try again shortly"
//        });
  Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong! Try again shortly'
        });

    }
}


async function checkSessionWish() {
    const popup = new Notification();
    const response = await fetch("CheckSessionWishlist");
    if (!response.ok) {
//        popup.error({
//            message: "Something went wrong! Try again shortly"
//        });

  Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong! Try again shortly'
        });
    }
}

async function loadProductData() {

    const popup = new Notification();
    const response = await fetch("LoadHomeData");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
//            loadBrands(json);
            loadNewArrivals(json);
        } else {
//            popup.error({
//                message: "Something went wrong! Try again shortly"
//            });
            Swal.fire({icon: 'error', title: 'Error', text: 'Something went wrong! Try again shortly'});

        }
    } else {
        Swal.fire({icon: 'error', title: 'Error', text: 'Something went wrong! Try again shortly'});

//        popup.error({
//            message: "Something went wrong! Try again shortly"
//        });
    }
}

function loadBrands(json) {
    const product_brand_container = document.getElementById("product-brand-container");
    let product_brand_card = document.getElementById("product-brand-card");
    product_brand_container.innerHTML = "";
    let card_delay = 200;
    json.brandList.forEach(item => {
        let product_brand_card_clone = product_brand_card.cloneNode(true);
        product_brand_card_clone.querySelector("#product-brand-mini-card")
                .setAttribute("data-sal", "zoom-out");
        product_brand_card_clone.querySelector("#product-brand-mini-card")
                .setAttribute("data-sal-delay", String(card_delay));
        product_brand_card_clone.querySelector("#product-brand-a")
                .href = "search.html";
        product_brand_card_clone.querySelector("#product-brand-title")
                .innerHTML = item.name;
        product_brand_container.appendChild(product_brand_card_clone);
        card_delay += 100;
        sal();
    });
}

function loadNewArrivals(json) {
//    const new_arrival_product_container = document.getElementById("new-arrival-product-container");
//    new_arrival_product_container.innerHTML = "";

    //similer products
    let smiler_product_main = document.getElementById("smiler-product-main");
    let productHtml = document.getElementById("similer-product");
    smiler_product_main.innerHTML = "";

    json.productList.forEach(item => {
        let productCloneHtml = productHtml.cloneNode(true);
        productCloneHtml.querySelector("#similer-product-a1").href = "single-product-view.html?id=" + item.id;
        productCloneHtml.querySelector("#similer-product-image").src = "product-images\\" + item.id + "\\image1.jpeg";
        productCloneHtml.querySelector("#simler-product-add-to-cart").addEventListener(
                "click", (e) => {
            addToCart(item.id, 1);
            e.preventDefault();
        });
        productCloneHtml.querySelector("#simler-product-add-to-wish").addEventListener(
                "click", (e) => {
            addToWish(item.id);
            e.preventDefault();
        });
        productCloneHtml.querySelector("#simlier-product-a2").href = "single-product-view.html?id=" + item.id;
        productCloneHtml.querySelector("#similer-product-title").innerHTML = item.title;

        productCloneHtml.querySelector("#similer-product-category").innerHTML = item.category.value;
        productCloneHtml.querySelector("#similer-product-price").innerHTML = new Intl.NumberFormat("en-US",
                {minimumFractionDigits: 2}).format(item.price);

        productCloneHtml.querySelector("#similer-product-color").innerHTML = item.color.value;
//                    productCloneHtml.querySelector("#similer-product-color-background").style.backgroundColor = item.color.value;

        smiler_product_main.appendChild(productCloneHtml);



    });



}



async function addToCart(productId, qty) {
    try {
        const response = await fetch(`AddToCart?prId=${productId}&qty=${qty}`);

        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Server error. Please try again later.'
            });
            return;
        }

        const json = await response.json();

        if (json.status) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: json.message || 'Product added to cart successfully.'
            });
        } else {
            // If the message contains "Please log in", prompt login modal or redirect
            if (json.message && json.message.toLowerCase().includes("log in")) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Login Required',
                    text: json.message,
                    showCancelButton: true,
                    confirmButtonText: 'Login',
                    cancelButtonText: 'Cancel'
                }).then(result => {
                    if (result.isConfirmed) {
                        // Redirect to login page or open login modal
                        window.location.href = 'sign-in.html'; // adjust as needed
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: json.message || 'Failed to add product to cart.'
                });
            }
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unexpected error occurred.'
        });
        console.error('AddToCart error:', error);
    }
}





async function addToWish(productId) {
    console.log("Adding to wishlist product id:", productId);

    try {
        const response = await fetch("AddToWishlist?prId=" + productId);

        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Server error. Please try again later.'
            });
            return;
        }

        const json = await response.json();
        console.log("Response JSON:", json);

        if (json.status) {
            Swal.fire({
                icon: 'success',
                title: 'Added to Wishlist',
                text: json.message || 'Item added to wishlist successfully.'
            });
        } else {
            if (json.message && json.message.toLowerCase().includes("log in")) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Login Required',
                    text: json.message,
                    showCancelButton: true,
                    confirmButtonText: 'Login',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirect to login page
                        window.location.href = 'sign-in.html'; // adjust this URL to your login page
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: json.message || 'Failed to add product to wishlist.'
                });
            }
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unexpected error occurred.'
        });
        console.error('addToWish error:', error);
    }
}

