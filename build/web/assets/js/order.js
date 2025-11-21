



const catTableBody = document.getElementById("catTableBody");


// Load brands from backend and populate the table
async function loadOrder() {
    const response = await fetch("LoadOrderItem");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            const orderItems = json.orderList;
            catTableBody.innerHTML = "";

            orderItems.forEach(order => {
                // Create a new row instead of cloning
                const tr = document.createElement("tr");

                const tdId = document.createElement("td");
                tdId.textContent = order.id;
                tr.appendChild(tdId);

                const tdProductName = document.createElement("td");
                tdProductName.textContent = order.product.title;
                tr.appendChild(tdProductName);

                const tdUserName = document.createElement("td");
                tdUserName.textContent = order.orders.user.first_name;
                tr.appendChild(tdUserName);

                const tdQty = document.createElement("td");
                tdQty.textContent = order.qty;
                tr.appendChild(tdQty);

                const tdStatus = document.createElement("td");
                tdStatus.textContent = order.orderStatus.value;
                tr.appendChild(tdStatus);

                const tdDelivary = document.createElement("td");
                tdDelivary.textContent = order.deliveryType.name;
                tr.appendChild(tdDelivary);

                const tdCreatedAt = document.createElement("td");
                tdCreatedAt.textContent = formatDate(order.orders.created_at); // field from backend
                tr.appendChild(tdCreatedAt);
                
                   const tdAmount = document.createElement("td");
                tdAmount.textContent = formatCurrency(order.amount);
                tr.appendChild(tdAmount);

                catTableBody.appendChild(tr);
            });
        } else {
            alert("Failed to load Order: " + json.message);
        }
    } else {
        alert("Network error while loading Order");
    }
}


function formatCurrency(amount) {
    return `Rs. ${Number(amount).toFixed(2)}`;
}





function formatDate(isoDateStr) {
    const date = new Date(isoDateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}