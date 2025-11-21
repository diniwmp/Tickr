
function loadData() {
    getUserData();
    getCityData();

    const ordersTab = document.getElementById("orders-tab");
    if (ordersTab) {
        ordersTab.addEventListener("click", function () {
            getOrderData(); // Load only when tab is clicked
        });
    }
}


async function getUserData() {

    const popup = new Notification();

    const response = await fetch("MyAccount");

    if (response.ok) {
        const json = await response.json();
        console.log(json);
        document.getElementById("username").innerHTML = `Hello ${json.firstName} ${json.lastName}`;
        document.getElementById("since").innerHTML = `Tickr Member Since ${json.since}`;
        document.getElementById("firstName").value = json.firstName;
        document.getElementById("lastName").value = json.lastName;
        document.getElementById("currentPassword").value = json.password;
        document.getElementById("phone").value = json.phone;
        document.getElementById("email").value = json.email;




        if (json.hasOwnProperty("addressList") && json.addressList !== undefined) {

            let email;
            let lineOne;
            let lineTwo;
            let city;
            let postalCode;
            let cityId;

            const addressUL = document.getElementById("addressUL");

            json.addressList.forEach(address => {
                email = address.user.email;

                lineOne = address.lineOne;
                lineTwo = address.lineTwo;
                city = address.city.name;
                postalCode = address.postalCode;

                cityId = address.city.id;

                const line = document.createElement("Li");
                line.innerHTML = lineOne + ",<br/>" +
                        lineTwo + ",<br/>" +
                        city + "<br/>" +
                        postalCode;

                addressUL.appendChild(line);



            });

            console.log("lineOne:", lineOne);
            console.log("lineTwo:", lineTwo);
            console.log("postalCode:", postalCode);
            console.log("cityId:", cityId);



//            document.getElementById("addName").innerHTML = `${json.firstName} ${json.lastName}`;
//            document.getElementById("addEmail").innerHTML = `Email: ${email}`;
//            document.getElementById("phone").innerHTML = `Phone: ${mobile}`;

            document.getElementById("lineOne").value = lineOne;
            document.getElementById("lineTwo").value = lineTwo;
            document.getElementById("postalCode").value = postalCode;
            document.getElementById("citySelect").value = Number(cityId);

        }




    } else {
//        popup.error({
//            message: "Somthing went wrong Please try agian leater"
//        });

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Somthing went wrong Please try agian leater.'
        });

    }
}

async function getCityData() {


    const response = await fetch("CityData");

    console.log("CityData response status:", response.status);
    if (response.ok) {
        const json = await response.json();
        console.log("CityData JSON:", json);
        const citySelect = document.getElementById("citySelect");
        if (!citySelect) {
            console.log("citySelect element not found!");
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'citySelect element not found!'
            });
            return;
        }
        if (!Array.isArray(json)) {
            console.log("CityData response is not an array!");

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'CityData response is not an array!'
            });
            return;
        }
        json.forEach(city => {
            let option = document.createElement("option");
            option.innerHTML = city.name;
            option.value = city.id;
            citySelect.appendChild(option);
        });
    } else {
        console.log("Failed to fetch CityData");
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch CityData'
        });
    }
}



async function saveChanges() {

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const lineOne = document.getElementById("lineOne").value;
    const lineTwo = document.getElementById("lineTwo").value;
    const postalCode = document.getElementById("postalCode").value;
    const  cityId = document.getElementById("citySelect").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const userDataObject = {
        firstName: firstName,
        lastName: lastName,
        lineOne: lineOne,
        lineTwo: lineTwo,
        postalCode: postalCode,
        cityId: cityId,
        email: email,
        phone: phone,
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    };

    const userDataJson = JSON.stringify(userDataObject);


    const response = await fetch(
            "SaveUserChanges", {
                method: "POST",
                body: userDataJson,
                headers: {
                    "Content-Type": "application/json"
                }

            }
    );

    if (response.ok) {

        const json = await response.json();
        if (json.status) {

            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your profile details were updated successfully.'
            }).then(() => {
                window.location.reload();
                getUserData();
                
            });


        } else {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: json.message || 'Could not update your profile.'
            });
//            document.getElementById("message").innerHTML = json.message;

        }

    } else {
//        document.getElementById("message").innerHTML = "Profile Details update failed";

        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Profile details update failed. Please try again.'
        });
    }



}


const catTableBody = document.getElementById("catTableBody");


async function getOrderData() {

    const response = await fetch("LoadUserOrderItem");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            const userOrderItems = json.orderList;
            catTableBody.innerHTML = "";

            userOrderItems.forEach(userorder => {
                // Create a new row instead of cloning
                const tr = document.createElement("tr");

                const tdId = document.createElement("td");
                tdId.textContent = userorder.id;
                tr.appendChild(tdId);

                const tdProductName = document.createElement("td");
                tdProductName.textContent = userorder.product.title;
                tr.appendChild(tdProductName);


                const tdQty = document.createElement("td");
                tdQty.textContent = userorder.qty;
                tr.appendChild(tdQty);

                const tdStatus = document.createElement("td");
                tdStatus.textContent = userorder.orderStatus.value;
                tr.appendChild(tdStatus);

                const tdDelivary = document.createElement("td");
                tdDelivary.textContent = userorder.deliveryType.name;
                tr.appendChild(tdDelivary);

                const tdCreatedAt = document.createElement("td");
                tdCreatedAt.textContent = formatDate(userorder.orders.created_at); // field from backend
                tr.appendChild(tdCreatedAt);

                catTableBody.appendChild(tr);
            });
        } else {
//            alert("Failed to load Order: " + json.message);

            Swal.fire({
                icon: 'error',
                title: 'Failed to Load Orders',
                text: json.message || 'An unexpected error occurred while loading orders.'
            });
        }
    } else {
//        alert("Network error while loading Order");

        Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Unable to connect to the server while loading orders.'
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





