async function loadCartItems() {

    try {
        const response = await fetch("LoadCartItems");
        
        if (response.status === 401) {
            // User is not logged in, redirect to sign-in page
            window.location.href = "sign-in.html";
            return;
        }

        if (!response.ok) {
            // Server returned an error status code (not 2xx)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch cart data from server.'
            });
            return;
        }

        const json = await response.json();

        if (!json.status) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: json.message || 'Failed to load cart items.'
            });
            return;
        }

        const cartItems = json.cartList;

        const cartContainer = document.getElementById("cart-item-container");
        const sampleRow = document.getElementById("cart-item-row");

        cartContainer.innerHTML = ""; // Clear existing rows

        let totalQty = 0;
        let totalAmount = 0;

        cartItems.forEach(cart => {
            const product = cart.product;
            const qty = cart.qty;
            const price = parseFloat(product.price);
            const subTotal = qty * price;

            const row = sampleRow.cloneNode(true);
            row.style.display = "table-row";

            // Fill product data
            row.querySelector("#product-a1").href = `single-product-view.html?id=${product.id}`;
            row.querySelector("#product-image").src = `product-images/${product.id}/image1.jpeg`;
            row.querySelector("#product-title").innerText = product.title;
            row.querySelector("#product-price").innerText = price.toFixed(2);
            row.querySelector("#product-qty").value = qty;
            row.querySelector("#product-total").innerText = subTotal.toFixed(2);

            // Add delete event listener if button exists
            const deleteBtn = row.querySelector("#remove");
            if (deleteBtn) {
                deleteBtn.setAttribute("data-cart-id", cart.id);

                deleteBtn.addEventListener("click", async (e) => {
                    e.preventDefault();

                    const {isConfirmed} = await Swal.fire({
                        title: 'Remove item?',
                        text: 'Are you sure you want to remove this item from the cart?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, remove it',
                        cancelButtonText: 'No, keep it',
                        reverseButtons: true
                    });

                    if (!isConfirmed) return;

                    const cartId = deleteBtn.getAttribute("data-cart-id");
                    if (!cartId) {
                        Swal.fire({icon: 'error', title: 'Error', text: 'Invalid cart item.'});
                        return;
                    }

                    deleteBtn.disabled = true;

                    try {
                        Swal.fire({
                            title: 'Removing...',
                            allowOutsideClick: false,
                            didOpen: () => Swal.showLoading()
                        });

                        const deleteResponse = await fetch("DeleteCartItem", {
                            method: "POST",
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                            body: `cartId=${encodeURIComponent(cartId)}`
                        });

                        Swal.close();

                        if (!deleteResponse.ok) {
                            const text = await deleteResponse.text().catch(() => '');
                            Swal.fire({
                                icon: 'error',
                                title: 'Server error',
                                text: text || 'Failed to delete cart item.'
                            });
                            deleteBtn.disabled = false;
                            return;
                        }

                        const result = (await deleteResponse.text()).trim();

                        if (result === "success") {
                            await Swal.fire({icon: 'success', title: 'Removed', text: 'Cart item deleted successfully.'});
                            const rowEl = document.getElementById(`cart-item-row-${cartId}`);
                            if (rowEl) rowEl.remove();
                            else window.location.reload();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Could not remove item',
                                text: result || 'Error deleting cart item.'
                            });
                            deleteBtn.disabled = false;
                        }
                    } catch (err) {
                        Swal.close();
                        Swal.fire({
                            icon: 'error',
                            title: 'Network error',
                            text: 'Unable to connect to the server. Please try again.'
                        });
                        deleteBtn.disabled = false;
                    }
                });
            }

            cartContainer.appendChild(row);

            totalQty += qty;
            totalAmount += subTotal;
        });

        // Update totals display
        document.getElementById("order-total-quantity").innerText = totalQty;
        document.getElementById("order-total-amount").innerText = `Rs. ${totalAmount.toFixed(2)}`;

    } catch (error) {
        console.error("Error loading cart items:", error);

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch cart data from server.'
        });
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

