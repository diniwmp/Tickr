async function loadWishlistItems() {
     try {
        const response = await fetch("LoadWishlistItems");

        if (response.status === 401) {
            // User not logged in - redirect to sign-in page
            window.location.href = "sign-in.html";
            return;
        }

        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load wishlist data from server.'
            });
            return;
        }

        const json = await response.json();

        if (!json.status) {
            Swal.fire({
                icon: 'info',
                title: 'Info',
                text: json.message || 'No wishlist items found.'
            });
            return;
        }

        const wishItems = json.wishItems;
        const wishlistContainer = document.getElementById("wishlist-item-container");
        const templateRow = document.getElementById("wish-item-row");

        wishlistContainer.innerHTML = ""; // clear old items

        let totalQty = 0;

        wishItems.forEach(wishlist => {
            totalQty += wishlist.qty || 1;  // default qty = 1 if missing

            // Clone template row and fill data
            const row = templateRow.cloneNode(true);
            row.removeAttribute("id");
            row.style.display = "";

            row.querySelector("#product-a1").href = `single-product-view.html?id=${wishlist.product.id}`;
            row.querySelector("#product-image").src = `product-images/${wishlist.product.id}/image1.jpeg`;
            row.querySelector("#product-title").textContent = wishlist.product.title;
            row.querySelector("#product-price").textContent = new Intl.NumberFormat("en-US", {minimumFractionDigits: 2}).format(wishlist.product.price);
            row.querySelector("#product-qty").textContent = wishlist.qty || 1;

            // Add event listener for Add to Cart button if present
            const addToCartBtn = row.querySelector("#cart");
            if (addToCartBtn) {
                addToCartBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    addToCart(wishlist.product.id, 1);
                });
            }

            // Add event listener for Remove button if present
            const removeBtn = row.querySelector("#remove");
            if (removeBtn) {
                removeBtn.setAttribute("data-wishlist-id", wishlist.id);

                removeBtn.addEventListener("click", async (e) => {
                    e.preventDefault();

                    const { isConfirmed } = await Swal.fire({
                        title: 'Are you sure?',
                        text: 'Do you want to remove this item from your wishlist?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, remove it',
                        cancelButtonText: 'Cancel',
                        reverseButtons: true
                    });

                    if (!isConfirmed) return;

                    const wishlistId = removeBtn.getAttribute("data-wishlist-id");

                    try {
                        const deleteResponse = await fetch("DeleteWishItem", {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: `wishlistId=${encodeURIComponent(wishlistId)}`
                        });

                        const result = await deleteResponse.text();

                        if (result.trim() === "success") {
                            await Swal.fire({
                                icon: 'success',
                                title: 'Removed!',
                                text: 'Item removed from wishlist.'
                            });
                            // Remove row from DOM or reload page
                            row.remove();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Failed to remove item. Please try again.'
                            });
                        }
                    } catch (err) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Network Error',
                            text: 'Could not connect to server.'
                        });
                    }
                });
            }

            wishlistContainer.appendChild(row);
        });

        // Update total quantity display if you have an element for it
        const totalQtySpan = document.getElementById("total-quantity");
        if (totalQtySpan) {
            totalQtySpan.textContent = totalQty;
        }

    } catch (error) {
        console.error("Error loading wishlist:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unexpected error occurred while loading wishlist.'
        });
    }
}




