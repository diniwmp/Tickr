
async function signUp() {
    
event.preventDefault(); // prevent page reload
//    const firstName = $("#firstName").val();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const  mobile = document.getElementById("mobile").value;
    const password = document.getElementById("password").value;


    const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobile:mobile,
        password: password

    }; //js wala object ekak

    const userJson = JSON.stringify(user);
    const  response = await fetch(
            "SignUp",
            {
                method: "POST",
                body: userJson,
                headers: {
                    "Content-Type": "application/json"
                }
            }

    );

    if (response.ok) { //success

        const json = await response.json();

        if (json.status) { //if true
            //redirect another page
            document.getElementById("message").className = "text-success";
            document.getElementById("message").innerHTML = json.message;

            window.location = "verify-account.html";
        } else { //when status false
            //custom message
            document.getElementById("message").innerHTML = json.message;

        }
    } else {
        document.getElementById("message").innerHTML = "Registration failed.Please try again";
    }

}

