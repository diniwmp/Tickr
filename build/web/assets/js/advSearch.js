// Global variables
const st_product = document.getElementById("st-product"); // product card template node
let current_page = 0;

// Load initial data (brands, categories, colors) and products
async function sloadData() {
    const response = await fetch("LoadsData");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);

            LoadOptions("brand", json.brandList, "name");
            LoadOptions("category", json.catList, "value");
            LoadOptions("color", json.colorList, "value");

            // Load first page of products
            searchProducts(0);
        }
    }
}

// Load filter options dynamically and add click listeners
function LoadOptions(prefix, datalist, property) {
    const options = document.getElementById(prefix + "-options");
    const li = document.getElementById(prefix + "-li");
    options.innerHTML = "";

    datalist.forEach(item => {
        const liClone = li.cloneNode(true);
        liClone.removeAttribute("id");
        liClone.style.display = "block";
        const aTag = liClone.querySelector("a");
        aTag.removeAttribute("id");
        aTag.innerHTML = item[property];

        liClone.addEventListener("click", function () {
            document.querySelectorAll(`#${prefix}-options li`).forEach(el => el.classList.remove("chosen"));
            this.classList.add("chosen");
            current_page = 0; // Reset to first page on filter change
            searchProducts(0);
        });

        options.appendChild(liClone);
    });
}

// Search and load products with filters, sorting, and pagination
async function searchProducts(firstResult) {
    
    const brand_name = document.querySelector("#brand-options .chosen a")?.innerHTML;
    const cat_name = document.querySelector("#category-options .chosen a")?.innerHTML;
    const color_name = document.querySelector("#color-options .chosen a")?.innerHTML;

    const price_start = Number(document.getElementById("slider-range").value);
    const price_end = 10000000000; // large number for no max limit

    const sort_value = document.getElementById("st-sort")?.value || "Sort by Latest";

    const data = {
        firstResult: firstResult,
        brandName: brand_name,
        categoryName: cat_name,
        colorName: color_name,
        priceStart: price_start,
        priceEnd: price_end,
        sortValue: sort_value
    };

    console.log("Sending:", data);

    const response = await fetch("AdvanceSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            updateProductView(json);

        } else {
            console.log("Search failed.");
            
                  Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Search failed'
        });
        }
    } else {
        console.log("Network error.");
        
                 Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Network error,Search failed'
        });
    }
}

// Update the product list and pagination buttons
function updateProductView(json) {
    const product_container = document.getElementById("st-product-container");
    product_container.innerHTML = "";

    json.productList.forEach(product => {
        let st_product_clone = st_product.cloneNode(true);
        
        // Update product link and images
        st_product_clone.querySelector("#st-product-a-1").href = "single-product-view.html?id=" + product.id;
        st_product_clone.querySelector("#st-product-img-1").src = "product-images/" + product.id + "/image1.jpeg";
        st_product_clone.querySelector("#st-product-a-2").href = "single-product-view.html?id=" + product.id;

        // Set product title, category, color, and price
        st_product_clone.querySelector("#st-product-title-1").innerHTML = product.title;
        st_product_clone.querySelector("#similer-product-category").innerHTML = product.category.value;
        st_product_clone.querySelector("#similer-product-color").innerHTML = product.color.value;
        st_product_clone.querySelector("#st-product-price-1").innerHTML = new Intl.NumberFormat(
            "en-US", { minimumFractionDigits: 2 }).format(product.price);

        // Add event listeners for add to cart and wishlist buttons
        st_product_clone.querySelector("#st-product-add-to-cart").addEventListener("click", (e) => {
            addToCart(product.id, 1);
            e.preventDefault();
        });

        st_product_clone.querySelector("#st-product-add-to-wish").addEventListener("click", (e) => {
            addToWish(product.id);
            e.preventDefault();
        });

        product_container.appendChild(st_product_clone);
    });

    // Pagination
    const st_pagination_container = document.getElementById("st-pagination-container");
    st_pagination_container.innerHTML = "";

    const all_product_count = json.allProductCount;
    document.getElementById("all-item-count").innerHTML = all_product_count;
    const product_per_page = 6;
    const pages = Math.ceil(all_product_count / product_per_page);

    // Prev button
    if (current_page > 0) {
        const prevBtn = document.createElement("a");
        prevBtn.href = "#";
        prevBtn.className = "axil-btn btn-bg-primary ml--10";
        prevBtn.textContent = "Prev";
        prevBtn.addEventListener("click", (e) => {
            e.preventDefault();
            current_page--;
            searchProducts(current_page * product_per_page);
        });
        st_pagination_container.appendChild(prevBtn);
    }

    // Page buttons
    for (let i = 0; i < pages; i++) {
        const pageBtn = document.createElement("a");
        pageBtn.href = "#";
        pageBtn.textContent = (i + 1);
        pageBtn.className = (i === current_page) 
            ? "axil-btn btn btn-primary btn-lg fw-bold ml--10" 
            : "axil-btn btn btn-outline-secondary btn-lg ml--10";

        pageBtn.addEventListener("click", (e) => {
            e.preventDefault();
            current_page = i;
            searchProducts(current_page * product_per_page);
        });

        st_pagination_container.appendChild(pageBtn);
    }

    // Next button
    if (current_page < pages - 1) {
        const nextBtn = document.createElement("a");
        nextBtn.href = "#";
        nextBtn.className = "axil-btn btn-bg-primary ml--10";
        nextBtn.textContent = "Next";
        nextBtn.addEventListener("click", (e) => {
            e.preventDefault();
            current_page++;
            searchProducts(current_page * product_per_page);
        });
        st_pagination_container.appendChild(nextBtn);
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
        console.error('addToWish error:', error);
    }
}

