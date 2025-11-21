const brandTableBody = document.getElementById("brandTableBody");
const brandNameInput = document.getElementById("brandName");
const brandIdInput = document.getElementById("brandId");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const addBtn = document.getElementById("addBtn");
const brandTable = document.getElementById("brandTable");

// Load brands from backend and populate the table
async function loadBrand() {
    const response = await fetch("LoadBrand");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            const brandItems = json.brandList;
            brandTableBody.innerHTML = "";

            brandItems.forEach(brand => {
                // Create a new row instead of cloning
                const tr = document.createElement("tr");

                const tdId = document.createElement("td");
                tdId.textContent = brand.id;
                tr.appendChild(tdId);

                const tdName = document.createElement("td");
                tdName.textContent = brand.name;
                tr.appendChild(tdName);

                tr.addEventListener("click", () => {
                    brandIdInput.value = brand.id;
                    brandNameInput.value = brand.name;
                    updateBtn.disabled = false;
                    deleteBtn.disabled = false;
                });

                brandTableBody.appendChild(tr);
            });
        } else {

            Swal.fire({icon: 'error', title: 'Error', text: json.message});

        }
    } else {
        Swal.fire({icon: 'error', title: 'Error', text: 'Network error while loading brands'});

    }
}

// Add Brand
addBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const brandName = brandNameInput.value.trim();

    if (brandName !== "") {
        fetch("AddBrandServlet", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `brandName=${encodeURIComponent(brandName)}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {

                        Swal.fire({
                            title: "Brand added successfully",
                            icon: "success",
                            draggable: true
                        });
                        resetForm();
                        loadBrand();
                    } else {
                        Swal.fire({icon: 'error', title: 'Error', text: data.message});

                    }
                });
//                .catch(() => alert("Failed to add brand due to network error"));
    } else {

        Swal.fire("Please enter a brand name");

    }
});

// Update Brand
updateBtn.addEventListener("click", function () {
    const brandId = brandIdInput.value;
    const brandName = brandNameInput.value.trim();

    if (brandId && brandName) {
        fetch("UpdateBrandServlet", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `brandId=${brandId}&brandName=${encodeURIComponent(brandName)}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {

                        Swal.fire({
                            title: "Brand updated successfully",
                            icon: "success",
                            draggable: true
                        });
                        resetForm();
                        loadBrand();
                    } else {
                        Swal.fire({icon: 'error', title: 'Error', text: data.message});
                    }
                });
//                .catch(() => alert("Failed to update brand due to network error"));
    } else {
        Swal.fire("Please select a brand and enter a name");
    }
});


// Delete Brand
deleteBtn.addEventListener("click", function () {
    const brandId = brandIdInput.value;

    if (!brandId)
        return;

    Swal.fire({
        title: "Are you sure?",
        text: "you want to delete this brand?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            // Proceed with delete request
            fetch("DeleteBrandServlet", {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: `brandId=${brandId}`
            })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Brand deleted successfully.",
                                icon: "success",
                                timer: 2000,
                                showConfirmButton: false
                            });
                            resetForm();
                            loadBrand();
                        } else {
                            Swal.fire({
                                title: "Delete failed",
                                text: data.message,
                                icon: "error"
                            });
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to delete brand due to network error.",
                            icon: "error"
                        });
                    });
        }
    });
});


// Clear form + disable buttons
function resetForm() {
    brandIdInput.value = "";
    brandNameInput.value = "";
    updateBtn.disabled = true;
    deleteBtn.disabled = true;
    loadBrand();

}

// Initial load when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    loadBrand();
    resetForm();
});
