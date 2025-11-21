
const catTableBody = document.getElementById("catTableBody");
const catNameInput = document.getElementById("catName");
const catIdInput = document.getElementById("catsId");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const addBtn = document.getElementById("addBtn");
const catTable = document.getElementById("catTable");

// Load brands from backend and populate the table
async function loadColor() {
    const response = await fetch("LoadColor");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
            const colorItems = json.colorList;
            catTableBody.innerHTML = "";

            colorItems.forEach(cat => {
                // Create a new row instead of cloning
                const tr = document.createElement("tr");

                const tdId = document.createElement("td");
                tdId.textContent = cat.id;
                tr.appendChild(tdId);

                const tdName = document.createElement("td");
                tdName.textContent = cat.value;
                tr.appendChild(tdName);

                tr.addEventListener("click", () => {
                    catIdInput.value = cat.id;
                    catNameInput.value = cat.value;
                    updateBtn.disabled = false;
                    deleteBtn.disabled = false;
                });

                catTableBody.appendChild(tr);
            });
        } else {
            Swal.fire({icon: 'error', title: 'Error', text: json.message});


        }
    } else {
        Swal.fire({icon: 'error', title: 'Error', text: "Network error while loading Color"});
    }
}

// Add Color
addBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const catName = catNameInput.value.trim();

    if (catName !== "") {
        fetch("AddColorServlet", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `catName=${encodeURIComponent(catName)}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {


                        Swal.fire({
                            title: "Color added successfully",
                            icon: "success",
                            draggable: true
                        });
                        resetForm();
                        loadColor();
                    } else {
                        Swal.fire({icon: 'error', title: 'Error', text: data.message});

                    }
                });
    } else {
        Swal.fire("Please enter a Color name");
    }
});

// Update Category
updateBtn.addEventListener("click", function () {
    const catId = catIdInput.value;
    const catName = catNameInput.value.trim();

    if (catId && catName) {
        fetch("UpdateColorServlet", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `catId=${catId}&catName=${encodeURIComponent(catName)}`
        })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {

                        Swal.fire({
                            title: "Color updated successfully",
                            icon: "success",
                            draggable: true
                        });
                        resetForm();
                        loadColor();
                    } else {
                        Swal.fire({icon: 'error', title: 'Error', text: data.message});
                    }
                });
    } else {
        Swal.fire({icon: 'error', title: 'Error', text: "Please select a Color and enter a name"});

    }
});

// Delete Color
deleteBtn.addEventListener("click", function () {
    const catId = catIdInput.value;

    if (!catId) return;

    Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this color?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("DeleteColorServlet", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `catId=${catId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Color deleted successfully.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    resetForm();
                    loadColor();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Failed',
                        text: data.message
                    });
                }
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'Failed to delete color due to network error.'
                });
            });
        }
    });
});

// Clear form + disable buttons
function resetForm() {
    catIdInput.value = "";
    catNameInput.value = "";
    updateBtn.disabled = true;
    deleteBtn.disabled = true;
}

// Initial load when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    loadColor();
    resetForm();
});

