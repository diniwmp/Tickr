async function adminSignIn() {

    const adminemail = document.getElementById("adminemail").value;
    const adminpassword = document.getElementById("adminpassword").value;

    const adminSignIn = {

        adminemail: adminemail,
        adminpassword: adminpassword

    };

    const adminSignInJson = JSON.stringify(adminSignIn);
     const  response = await fetch(
            "AdminSignIn",
            {
                method: "POST",
                body: adminSignInJson,
                headers: {
                    "Content-Type": "application/json"
                }
            }

    );
    if (response.ok) {
        const json = await response.json();
        if (json.success) {
            document.getElementById("message").className = "text-success";
            document.getElementById("message").innerHTML = json.message;
            setTimeout(() => {
                window.location = "adminIndex.html";
            }, 1500);
        } else {
            document.getElementById("message").className = "text-danger";
            document.getElementById("message").innerHTML = json.message;
        }
    } else {
        document.getElementById("message").className = "text-danger";
        document.getElementById("message").innerHTML = "Sign in failed. Please try again.";
    }

}




