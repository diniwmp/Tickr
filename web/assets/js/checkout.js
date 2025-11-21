async function loadCheckoutData() {

    const response = await fetch("LoadCheckoutData");
    if (!response.ok) {
        if (response.status === 401) {
            window.location = "sign-in.html";
        } else {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load checkout data.' });
        }
        return;
    }

    const json = await response.json();
    if (!json.status) {
        if (json.message === "Empty cart") {
            Swal.fire({ icon: 'info', title: 'Empty Cart', text: 'Empty cart. Please add some products.' }).then(() => {
                window.location = "index.html";
            });
        } else {
            Swal.fire({ icon: 'error', title: 'Error', text: json.message });
        }
        return;
    }

    const userAddress = json.userAddress;
    const cityList = json.cityList;
    const cartItems = json.cartList;
    const deliveryTypes = json.deliveryTypes;

    const city_select = document.getElementById("city-select");

    // Populate city list
    cityList.forEach(city => {
        const option = document.createElement("option");
        option.value = city.id;
        option.textContent = city.name;
        city_select.appendChild(option);
    });

    // Address checkbox
    const current_address_checkbox = document.getElementById("checkbox1");
    current_address_checkbox.addEventListener("change", () => {
        const first_name = document.getElementById("first-name");
        const last_name = document.getElementById("last-name");
        const line_one = document.getElementById("line-one");
        const line_two = document.getElementById("line-two");
        const postal_code = document.getElementById("postal-code");
        const mobile = document.getElementById("mobile");
        const email = document.getElementById("email");

        if (current_address_checkbox.checked) {
            first_name.value = userAddress.user.first_name;
            last_name.value = userAddress.user.last_name;
            city_select.value = userAddress.city.id;
            city_select.disabled = true;
            city_select.dispatchEvent(new Event("change"));
            line_one.value = userAddress.lineOne;
            line_two.value = userAddress.lineTwo;
            postal_code.value = userAddress.postalCode;
            mobile.value = userAddress.user.mobile;
            email.value = userAddress.user.email;
        } else {
            first_name.value = "";
            last_name.value = "";
            city_select.value = 0;
            city_select.disabled = false;
            city_select.dispatchEvent(new Event("change"));
            line_one.value = "";
            line_two.value = "";
            postal_code.value = "";
            mobile.value = "";
            email.value = "";
        }
    });

    // Load cart
    const st_tbody = document.getElementById("st-tbody");
    const st_item_tr = document.getElementById("st-item-tr");
    const st_shipping_charges_span = document.getElementById("st-product-shipping-charges");
    const st_total_amount_span = document.getElementById("st-order-total-amount");
    const st_subtotal_amount_span = document.getElementById("st-product-total");

    st_tbody.innerHTML = "";

    let subtotal = 0;

    cartItems.forEach(cart => {
        const clone = st_item_tr.cloneNode(true);
        clone.removeAttribute("id");
        clone.style.display = "";

        clone.querySelector("#product-a1").href = "single-product.html?id=" + cart.product.id;
        clone.querySelector("#product-image").src = "product-images/" + cart.product.id + "/image1.jpeg";
        clone.querySelector("#st-product-title").textContent = cart.product.title;
        clone.querySelector("#st-product-qty").textContent = cart.qty;

        const unitPrice = Number(cart.product.price);
        const itemTotal = unitPrice * cart.qty;
        subtotal += itemTotal;

        clone.querySelector("#st-product-price").textContent = unitPrice.toFixed(2);
        clone.querySelector("#st-product-total-amount").textContent = itemTotal.toFixed(2);

        st_tbody.appendChild(clone);
    });

    st_subtotal_amount_span.textContent = subtotal.toFixed(2);

    // Shipping & total logic
    city_select.addEventListener("change", () => {
        const selectedCity = city_select.options[city_select.selectedIndex].text.toLowerCase();

        let shippingCost = 0;

        if (selectedCity === "colombo") {
            shippingCost = deliveryTypes[0].price;
        } else {
            shippingCost = deliveryTypes[1].price;
        }

        st_shipping_charges_span.textContent = shippingCost.toFixed(2);
        st_total_amount_span.textContent = (subtotal + shippingCost).toFixed(2);
    });

    // Trigger initial shipping + total if pre-filled city exists
    if (city_select.value !== "0") {
        city_select.dispatchEvent(new Event("change"));
    }
}

payhere.onCompleted = function onCompleted(orderId) {
    Swal.fire({
        icon: 'success',
        title: 'Payment Completed',
        text: "Payment completed. Order Id " + orderId,
        timer: 1500,
        showConfirmButton: false
    });


};


payhere.onDismissed = function onDismissed() {

    console.log("Payment dismissed");
        Swal.fire({icon: 'error', title: 'Payment Error', text: error});

};


payhere.onError = function onError(error) {

    Swal.fire({icon: 'error', title: 'Payment Error', text: error});
};





// Checkout function remains unchanged
async function checkout() {


    const checkbox1 = document.getElementById("checkbox1").checked;
    const first_name = document.getElementById("first-name").value;
    const last_name = document.getElementById("last-name").value;
    const line_one = document.getElementById("line-one").value;
    const line_two = document.getElementById("line-two").value;
    const postal_code = document.getElementById("postal-code").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const city_select = document.getElementById("city-select").value;

    let data = {
        isCurrentAddress: checkbox1,
        firstName: first_name,
        lastName: last_name,
        citySelect: city_select,
        lineOne: line_one,
        lineTwo: line_two,
        postalCode: postal_code,
        mobile: mobile,
        email: email
    };

    let dataJSON = JSON.stringify(data);


    try {
        const response = await fetch("Checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: dataJSON
        });

        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                //payhere process
                payhere.startPayment(json.payhereJson);
            } else {
                Swal.fire({icon: 'error', title: 'Error', text: json.message});
            }
        } else {
            Swal.fire({icon: 'error', title: 'Error', text: 'Something went wrong. Please try again!'});
        }
    } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire({icon: 'error', title: 'Error', text: 'Something went wrong. Please try again!'});
    }


}




function downInvoice() {
    const firstName = document.getElementById("first-name")?.value.trim() || "N/A";
    const lastName = document.getElementById("last-name")?.value.trim() || "N/A";
    const mobile = document.getElementById("mobile")?.value.trim() || "N/A";
    const email = document.getElementById("email")?.value.trim() || "N/A";
    const address1 = document.getElementById("line-one")?.value.trim() || "";
    const address2 = document.getElementById("line-two")?.value.trim() || "";
    const postalCode = document.getElementById("postal-code")?.value.trim() || "00000";
    const citySelect = document.getElementById("city-select");
    const city = citySelect?.options[citySelect.selectedIndex]?.text || "N/A";

    const fullAddress = `${address1}, ${address2}, ${city}, ${postalCode}`;

    const cartRows = document.querySelectorAll("#st-tbody > tr.cart_item");
    let productRows = "";
    cartRows.forEach(row => {
        const img = row.querySelector("#product-image")?.src || "";
        const title = row.querySelector("#st-product-title")?.textContent || "";
        const price = row.querySelector("#st-product-price")?.textContent || "0.00";
        const qty = row.querySelector("#st-product-qty")?.textContent || "0";
        const total = row.querySelector("#st-product-total-amount")?.textContent || "0.00";

        productRows += `
        <tr class="cart_item">
            <td><img src="${img}" width="70" height="70"></td>
            <td>${title}</td>
            <td>Rs. ${price}</td>
            <td>${qty}</td>
            <td>Rs. ${total}</td>
        </tr>`;
    });

    const subtotal = document.getElementById("st-product-total")?.textContent || "0.00";
    const shipping = document.getElementById("st-product-shipping-charges")?.textContent || "0.00";
    const total = document.getElementById("st-order-total-amount")?.textContent || "0.00";

    const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice - Ticker Watches</title>
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        body { font-family: 'Jost', sans-serif; background: #fdf6f9; padding: 20px; }
        .amount { font-weight: 500; display: block; margin-bottom: 8px; }
        .cart_table th, .cart_table td { border: 1px solid #ddd; padding: 8px; }
        .print-btn {
            display: block;
            margin: 30px auto 10px;
            padding: 10px 20px;
            background-color: #d63384;
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
        }
        .print-btn:hover {
            background-color: #c22074;
        }
        @media print {
            .print-btn { display: none !important; }
        }
    </style>
</head>
<body>
    <div class="container" id="invoice-content">
        <div class="text-center">
            <div class="vs-logo mb-3">
                <a href="#"><img src="assets/img/logo.png" alt="logo" style="max-height: 300px;"></a>
            </div>
            <h2 class="h1">Invoice</h2>
        </div>

        <section class="vs-checkout-wrapper mt-4">
            <div class="row">
                <div class="col-lg-6">
                    <span class="amount"><strong>Name:</strong> ${firstName} ${lastName}</span>
                    <span class="amount"><strong>Email:</strong> ${email}</span>
                    <span class="amount"><strong>Mobile:</strong> ${mobile}</span>
                    <span class="amount"><strong>Address:</strong> ${fullAddress}</span>
                </div>
            </div>

            <h4 class="mt-4 pt-lg-2">Your Order</h4>
            <div class="table-responsive">
                <table class="cart_table w-100">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productRows}
                    </tbody>
                </table>
            </div>

            <div class="row justify-content-end mt-4">
                <div class="col-md-6">
                    <table class="table">
                        <tr>
                            <td><strong>Subtotal:</strong></td>
                            <td>Rs. ${subtotal}</td>
                        </tr>
                        <tr>
                            <td><strong>Shipping:</strong></td>
                            <td>Rs. ${shipping}</td>
                        </tr>
                        <tr>
                            <td><strong>Total:</strong></td>
                            <td><strong>Rs. ${total}</strong></td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="text-center mt-4">
                <button class="print-btn" onclick="window.print()">Save Invoice</button>
            </div>
        </section>
    </div>
</body>
</html>`;

    const win = window.open("", "_blank", "width=900,height=800");
    win.document.write(invoiceHTML);
    win.document.close();
}