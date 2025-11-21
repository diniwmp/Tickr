
function loadsModels() {

    loadBrand();
    loadModelTable();

}

async function loadBrand() {
    const brandSelect = document.getElementById("brandSelect");

    try {
        const response = await fetch("LoadBrand");

        if (response.ok) {
            const json = await response.json();

            if (json.status && json.brandList) {
                // Clear and re-add default option
                brandSelect.innerHTML = '<option value="0">Select Brand</option>';

                json.brandList.forEach(brand => {
                    const option = document.createElement("option");
                    option.value = brand.id;
                    option.textContent = brand.name;
                    brandSelect.appendChild(option);
                });
            } else {
                Swal.fire({icon: 'error', title: 'Error', text: "No brands found"});

            }
        } else {
            Swal.fire({icon: 'error', title: 'Error', text: 'Failed to fetch brands!'});

        }
    } catch (error) {
        console.log("Error loading brands:", error);
    }
}


async function loadModelTable() {
    const modelTableBody = document.getElementById("modelTableBody");

    try {
        const response = await fetch("LoadModelsTable");

        if (response.ok) {
            const json = await response.json();

            if (json.status) {
                modelTableBody.innerHTML = "";

                json.models.forEach(model => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${model.id}</td>
                        <td>${model.brandName}</td>
                        <td>${model.modelName}</td>
                    `;



                    modelTableBody.appendChild(row);
                });
            } else {
                modelTableBody.innerHTML = "<tr><td colspan='3'>No models found.</td></tr>";
            }
        } else {
            Swal.fire({icon: 'error', title: 'Error', text: 'Failed to load model data!'});

        }
    } catch (error) {
        Swal.fire({icon: 'error', title: 'Error', text: 'Failed to load model data!'});

    }
}


document.getElementById("modelForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const modelName = document.getElementById("modelName").value.trim();
    const brandId = document.getElementById("brandSelect").value;

    if (brandId === "0") {

        Swal.fire("Please select a brand");
        return;
    }

    const formData = new URLSearchParams();
    formData.append("modelName", modelName);
    formData.append("brandId", brandId);

    try {
        const response = await fetch("AddModel", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: formData
        });

        const json = await response.json();

        if (json.status) {
            Swal.fire({icon: 'success', title: 'Success', text: json.message});

            document.getElementById("modelForm").reset();
            loadModelTable(); // reload model table
        } else {

            Swal.fire({icon: 'error', title: 'Error', text: 'Failed to add model!'});
        }
    } catch (error) {
        Swal.fire({icon: 'error', title: 'Error', text: json.message});

    }
});

