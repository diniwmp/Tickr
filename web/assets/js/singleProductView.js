

async  function  loadsData() {
    console.log("ok");
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("id")) {
        const productId = searchParams.get("id");
        console.log(productId);
        const response = await fetch("SingleProduct?id=" + productId);

        if (response.ok) {
            const json = await response.json();

            if (json.status) {
                console.log(json);


                document.getElementById("image1").src = "product-images\\" + json.product.id + "\\image1.jpeg";
                document.getElementById("image2").src = "product-images\\" + json.product.id + "\\image2.jpeg";
                document.getElementById("image3").src = "product-images\\" + json.product.id + "\\image3.jpeg";

                document.getElementById("thumb-image1").src = "product-images\\" + json.product.id + "\\image1.jpeg";
                document.getElementById("thumb-image2").src = "product-images\\" + json.product.id + "\\image2.jpeg";
                document.getElementById("thumb-image3").src = "product-images\\" + json.product.id + "\\image3.jpeg";

                document.getElementById("product-title").innerHTML = json.product.title;
                document.getElementById("published-on").innerHTML = json.product.created_at;
                document.getElementById("product-price").innerHTML = new Intl.NumberFormat("en-US",
                        {minimumFractionDigits: 2}).format(json.product.price);
                document.getElementById("brand-name").innerHTML = json.product.model.brand.name;
                document.getElementById("model-name").innerHTML = json.product.model.name;
                document.getElementById("category").innerHTML = json.product.category.value;
                document.getElementById("color").innerHTML = json.product.color.value;
                document.getElementById("product-stock").innerHTML = json.product.qty;
                document.getElementById("description").innerHTML = json.product.description;



                //add to cart main button
                const addToCartMain = document.getElementById("add-to-cart-main");
                addToCartMain.addEventListener(
                        "click", (e) => {
                    addToCart(json.product.id, document.getElementById("add-to-cart-qty").value);
                    e.preventDefault();
                });

                const addToWishMain = document.getElementById("add-to-wishlist-main");
                if (addToWishMain) {
                    addToWishMain.addEventListener("click", (e) => {
                        addToWish(json.product.id);
                        e.preventDefault();
                    });
                }

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


            } else {
                console.log("error");
                window.location = "index.html";
            }


        } else {
            console.log("error");

        }

    }

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
        console.log('addToWish error:', error);
    }
}

