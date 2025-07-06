async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.token); // ✅ Store JWT Token
        localStorage.setItem("role", data.role);   // ✅ Store user role
        window.location.href = "dashboard.html";   // ✅ Redirect to dashboard
    } else {
        alert(data.msg); // Show error message
    }
}

// ✅ Corrected Logout Function
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Script Loaded!");

    // Find logout button
    const logoutBtn = document.getElementById("logoutBtn");
    console.log("Logout Button Found:", logoutBtn); // Debugging

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            console.log("🛑 Logout Button Clicked!"); // Debugging

            // Remove token and role
            localStorage.removeItem("token");
            localStorage.removeItem("role");

            console.log("✅ Token Removed:", localStorage.getItem("token"));
            console.log("✅ Role Removed:", localStorage.getItem("role"));

            // Redirect to login
            window.location.href = "login.html";
        });
    } else {
        console.warn("⚠️ Logout button not found. Check HTML ID!");
    }
});
