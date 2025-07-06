async function login() {
    console.log("Login function called!"); // ✅ Debugging

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    console.log("Email:", email); // ✅ Debugging
    console.log("Password:", password); // ✅ Debugging

    try {
        // ✅ Fetch user's IP address
        let ipResponse = await fetch("https://api64.ipify.org?format=json");
        let ipData = await ipResponse.json();
        let clientIP = ipData.ip || "Unknown";

        console.log("Fetched IP:", clientIP); // ✅ Debugging

        // ✅ Send login request with IP
        let response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, ipAddress: clientIP }),
        });

        let data = await response.json();
        console.log("Login Response:", data); // ✅ Debugging

        if (response.ok && data.token) {
            console.log("Token:", data.token); 
            console.log("Role:", data.role);  

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            // ✅ Redirect to dashboard
            window.location.href = "./dashboard.html";
        } else {
            alert("Login failed: " + (data.msg || "Invalid credentials"));
        }
    } catch (error) {
        console.error("❌ Error during login:", error);
        alert("Something went wrong! Check console.");
    }
}
