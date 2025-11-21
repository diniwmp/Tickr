async function loadProducts() {
    const popup = new Notification();

    try {
        const response = await fetch("LoadProductAdmin");

        if (response.ok) {
            const json = await response.json();

            if (json.status) {
                console.log(json);
                const pItems = json.pList;
                const product_item_container = document.getElementById("product-item-container");
                const productHtml = document.getElementById("p-item-row");
                product_item_container.innerHTML = "";


                let totalQty = 0;

                pItems.forEach(pList => {
                    totalQty += pList.qty;

                    // Clone template row
                    let productCloneHtml = productHtml.cloneNode(true);
                    productCloneHtml.style.display = ""; // Unhide


                    // Update product details
                    productCloneHtml.querySelector("#p-id").innerHTML = pList.id;
                    productCloneHtml.querySelector("#product-a1").href = "single-product-view.html?id=" + pList.id;
                    productCloneHtml.querySelector("#product-image").src = "product-images/" + pList.id + "/image1.jpeg";
                    productCloneHtml.querySelector("#product-title").innerHTML = pList.title;
                    productCloneHtml.querySelector("#product-price").innerHTML = new Intl.NumberFormat("en-US", {minimumFractionDigits: 2}).format(pList.price);

                    // Set quantity input value correctly
                    productCloneHtml.querySelector("#product-qty").innerHTML = pList.qty;

                    productCloneHtml.querySelector("#date").innerHTML = formatDate(pList.created_at);

                    product_item_container.appendChild(productCloneHtml);

                });

                // Update total quantity display
                document.getElementById("total-quantity").innerHTML = totalQty;

            } else {
                popup.error({
                    message: json.message
                });
            }
        } else {
            popup.error({
                message: "Wishlist Items Loading Failed"
            });
        }
    } catch (error) {
        popup.error({
            message: "Error loading wishlist"
        });
    }
}


function formatDate(isoDateStr) {
    const date = new Date(isoDateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}