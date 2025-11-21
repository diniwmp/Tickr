function getCityData() {
    fetch("CityData")
        .then((response) => {
            if (!response.ok) {
                throw new Error("CityData not available");
            }
            return response.json();
        })
        .then((data) => {
            const citySelect = document.getElementById("citySelect");
            const editCitySelect = document.getElementById("editAddrCity");

            if (!citySelect || !editCitySelect) {
                console.warn("City select elements not found");
                return;
            }

            citySelect.innerHTML = `<option value="0">Select City</option>`;
            editCitySelect.innerHTML = `<option value="0">Select City</option>`;

            data.forEach((city) => {
                const option1 = document.createElement("option");
                option1.value = city.id;
                option1.textContent = city.name;
                citySelect.appendChild(option1);

                const option2 = document.createElement("option");
                option2.value = city.id;
                option2.textContent = city.name;
                editCitySelect.appendChild(option2);
            });
        })
        .catch((error) => {
            console.error("Error loading cities:", error);
        });
}

function loadUserData() {
    fetch("MyAccount")
        .then((response) => {
            if (!response.ok) {
                throw new Error("MyAccount fetch failed");
            }
            return response.json();
        })
        .then((json) => {
            // Safely get elements
            const setText = (id, text) => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = text;
            };
            const setValue = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.value = val;
            };

            setText("username", `Hello ${json.firstName} ${json.lastName}`);
            setText("since", `Tickr Member Since ${json.since}`);
            setText("addName", `${json.firstName} ${json.lastName}`);
            setText("addEmail", `Email: ${json.email}`);
            setText("contact", `Phone: ${json.phone}`);
            setText("phone", `Phone: ${json.phone}`);

            setValue("firstName", json.firstName);
            setValue("lastName", json.lastName);
            setValue("email", json.email);
            setValue("currentPassword", "");

            const addressList = json.addressList;
            if (Array.isArray(addressList) && addressList.length > 0) {
                const address = addressList[0];

                setText("addrLineOne", `${address.lineOne},`);
                setText("addrLineTwo", address.lineTwo);
                setText("addrCity", address.city.name);
                setText("addrPostal", address.postalCode);

                setValue("editAddrLine1", address.lineOne);
                setValue("editAddrLine2", address.lineTwo);
                setValue("editAddrPostal", address.postalCode);
                setValue("editAddrCity", address.city.id);
            }
        })
        .catch((error) => {
            console.error("Error loading user data:", error);
        });
}

// Call functions on DOM load
document.addEventListener("DOMContentLoaded", () => {
    getCityData();
    loadUserData();
});
