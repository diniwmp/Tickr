
function invoiceLoad() {

    loadInvoiceData();
    loadInvoiceUserData();

}


async function loadInvoiceData() {

    const response = await fetch("InvoiceServlet");
    if (!response.ok) {
        if (response.status === 401) {
            window.location = "sign-in.html";
        } else {
            Swal.fire({icon: 'error', title: 'Error', text: 'Failed to load checkout data.'});
        }
        return;
    }

    const json = await response.json();
    if (!json.status) {
        if (json.message === "Empty cart") {
            Swal.fire({icon: 'info', title: 'Empty Cart', text: 'Empty cart. Please add some products.'}).then(() => {
                window.location = "index.html";
            });
        } else {
            Swal.fire({icon: 'error', title: 'Error', text: json.message});
        }
        return;
    }


    // Load cart table
    const st_tbody = document.getElementById("st-tbody");
    const st_item_tr = document.getElementById("st-item-tr");
    const st_shipping_charges_span = document.getElementById("st-product-shipping-tr");
    const st_total_amount_span = document.getElementById("st-order-total-amount");
    const st_subtotal_amount_span = document.getElementById("st-product-total");
    const cartItems = json.cartList;


    st_tbody.innerHTML = ""; // clear

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

    // Update subtotal
    st_subtotal_amount_span.textContent = subtotal.toFixed(2);
    
    


}



async function loadInvoiceUserData() {

    const popup = new Notification();

    const response = await fetch("MyAccount");

    if (response.ok) {
        const json = await response.json();
        console.log(json);
        document.getElementById("name").innerHTML = `${json.firstName} ${json.lastName}`;
        document.getElementById("email").innerHTML = `${json.email}`;
        document.getElementById("phone").innerHTML = json.phone;


        if (json.hasOwnProperty("addressList") && json.addressList !== undefined) {

            let lineOne;
            let lineTwo;
            let city;
            let postalCode;

            const addressUL = document.getElementById("addressUL");

            json.addressList.forEach(address => {

                lineOne = address.lineOne;
                lineTwo = address.lineTwo;
                city = address.city.name;
                postalCode = address.postalCode;

                cityId = address.city.id;

                const line = document.createElement("line");
                line.innerHTML = lineOne + "," +
                        lineTwo + ",<br/>" +
                        city + ", Postal Code -" +
                        postalCode;

                addressUL.appendChild(line);

            });


        } else {
            popup.error({
                message: "Somthing went wrong Please try agian leater"
                });

            }


    }
}