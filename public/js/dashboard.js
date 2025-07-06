console.log("✅ dashboard.js is loaded!");
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
        window.location.href = "/login.html";
        return;
    }

    console.log("User Role:", role);

    // ✅ Show admin sections
    if (role === "admin") {
        document.getElementById("manage-users").style.display = "block";
        document.getElementById("access-control").style.display = "block";
        document.getElementById("threat-analytics").style.display = "block"; // ✅ Ensure this section is visible

        loadUsers(); 
        loadAccessControl();
        loadThreatAnalytics();  // ✅ Load Threat Analytics when page opens
    } else {
        document.getElementById("manage-users").style.display = "none";
        document.getElementById("access-control").style.display = "none";
        document.getElementById("threat-analytics").style.display = "none";
    }

    // ✅ Sidebar Click Events
    document.getElementById("threat-analytics-sidebar").addEventListener("click", () => {
        document.getElementById("threat-analytics").scrollIntoView({ behavior: "smooth" });
        loadThreatAnalytics(); // ✅ Ensures new logs are loaded when clicked
    });
    
    // ✅ Function to Load Users Table
    async function loadUsers() {
        try {
            const response = await fetch("http://localhost:5000/api/admin/all-users", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to fetch users");

            const users = await response.json();
            const usersTable = document.getElementById("users-table");

            if (!usersTable) {
                console.error("⚠️ 'users-table' element not found in HTML.");
                return;
            }

            usersTable.innerHTML = ""; // Clear table

            users.forEach((user) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${user.ipAddress || "Unknown"}</td>
                    <td>
                        <select onchange="updateUserRole('${user._id}', this.value)">
                            <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
                            <option value="engineer" ${user.role === "engineer" ? "selected" : ""}>Engineer</option>
                            <option value="analyst" ${user.role === "analyst" ? "selected" : ""}>Analyst</option>
                            <option value="it_support" ${user.role === "it_support" ? "selected" : ""}>IT Support</option>
                            <option value="employee" ${user.role === "employee" ? "selected" : ""}>Employee</option>
                        </select>
                    </td>
                    <td><button onclick="deleteUser('${user._id}')">Delete</button></td>
                `;
                usersTable.appendChild(row);
            });

        } catch (error) {
            console.error("❌ Error fetching users:", error);
        }
    }

    // ✅ Function to Load Access Control Table
    async function loadAccessControl() {
        try {
            const response = await fetch("http://localhost:5000/api/admin/access-control", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
    
            if (!response.ok) throw new Error("Failed to fetch access control data");
    
            const users = await response.json();
            const accessTable = document.getElementById("access-table");
    
            if (!accessTable) {
                console.error("⚠️ 'access-table' element not found in HTML.");
                return;
            }
    
            accessTable.innerHTML = ""; // Clear table before adding new data
    
            users.forEach((user) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td>${user.ipAddress || "Unknown"}</td>
                    <td>${user.status || "Active"}</td>
                    <td>
                        <button onclick="lockAccount('${user._id}')">Lock</button>
                        <button onclick="unlockAccount('${user._id}')">Unlock</button>
                    </td>
                `;
                accessTable.appendChild(row);
            });
    
        } catch (error) {
            console.error("❌ Error loading access control data:", error);
        }
    }   
    
    // ✅ Load Threat Analytics and Render Line Graph
async function loadThreatAnalytics() {
    try {
        const response = await fetch("http://localhost:5000/api/admin/threat-analytics", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (!response.ok) throw new Error("Failed to fetch threat analytics");

        const logs = await response.json();
        console.log("📊 Threat Analytics Data:", logs);  // ✅ Debugging

        renderThreatLineGraph(logs);
    } catch (error) {
        console.error("❌ Error loading threat analytics:", error);
    }
}

// ✅ Function to Render Line Graph
function renderThreatLineGraph(threats) {
    const ctx = document.getElementById("threatLineGraph").getContext("2d");

    // ✅ Convert timestamps to readable dates
    const dates = threats.map(log => new Date(log.timestamp).toLocaleDateString());
    const counts = {};

    // ✅ Count events per day
    dates.forEach(date => {
        counts[date] = (counts[date] || 0) + 1;
    });

    // ✅ Prepare data for Chart.js
    const labels = Object.keys(counts);
    const dataPoints = Object.values(counts);

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Threat Events Over Time",
                data: dataPoints,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.1)",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" }
            },
            scales: {
                x: { title: { display: true, text: "Date" } },
                y: { title: { display: true, text: "Number of Threats" }, beginAtZero: true }
            }
        }
    });
}

    // ✅ Function to Load Threat Analytics Table
    async function loadThreatAnalytics() {
    try {
        const response = await fetch("http://localhost:5000/api/threats", {
            headers: { Authorization: `Bearer ${yourAuthToken}` },
        });

        if (!response.ok) throw new Error("Failed to fetch threat analytics");

        const logs = await response.json();
        console.log("📊 Threat Analytics Data:", logs);  // ✅ Debugging

        const analyticsTable = document.getElementById("analytics-table");
        if (!analyticsTable) {
            console.error("⚠️ 'analytics-table' element not found in HTML.");
            return;
        }

        analyticsTable.innerHTML = ""; // ✅ Clear previous data

        logs.forEach((log) => {
            let row = document.createElement("tr");
            let severityClass = "";

            // ✅ Color Coding for Severity Levels
            if (log.severity === "High") severityClass = "high-severity";
            else if (log.severity === "Medium") severityClass = "medium-severity";
            else severityClass = "low-severity";

            row.innerHTML = `
                <td>${log.eventType || "Unknown"}</td>
                <td>${log.ipAddress || "Unknown"}</td>
                <td class="${severityClass}">${log.severity || "Unknown"}</td>
                <td>${timeAgo(log.timestamp)}</td>
            `;
            analyticsTable.appendChild(row);
        });

    } catch (error) {
        console.error("❌ Error loading threat analytics:", error);
    }
}

    logs.forEach((log) => {
        let row = document.createElement("tr");
        let severityClass = "";
    
        // ✅ Apply colors based on severity
        if (log.severity === "High") severityClass = "high-severity";
        else if (log.severity === "Medium") severityClass = "medium-severity";
        else severityClass = "low-severity";
    
        row.innerHTML = `
            <td>${log.eventType}</td>
            <td>${log.ipAddress || "Unknown"}</td>
            <td class="${severityClass}">${log.severity}</td>
            <td>${new Date(log.timestamp).toLocaleString()}</td>
        `;
        analyticsTable.appendChild(row);
    });
    
    
    // ✅ Function to Convert Timestamp to "Time Ago" Format
    function timeAgo(timestamp) {
        const timeDiff = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (timeDiff < 60) return `${timeDiff} seconds ago`;
        if (timeDiff < 3600) return `${Math.floor(timeDiff / 60)} minutes ago`;
        if (timeDiff < 86400) return `${Math.floor(timeDiff / 3600)} hours ago`;
        return `${Math.floor(timeDiff / 86400)} days ago`;
    }
    
    document.getElementById("threat-analytics-sidebar").addEventListener("click", () => {
        document.getElementById("threat-analytics").scrollIntoView({ behavior: "smooth" });
        loadThreatAnalytics(); 
    });
    
    // ✅ Load Threat Analytics on Page Load
    document.addEventListener("DOMContentLoaded", loadThreatAnalytics);

    // ✅ Logout Function
    document.getElementById("logout").addEventListener("click", function () {
    console.log("Logout button clicked"); // Debugging

    // Remove authentication token and role from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redirect to login page
    window.location.href = "./login.html"; 
});
});
window.lockAccount = async function (userId) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/admin/lock-user/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to lock user");
        alert("User account locked!");
        loadAccessControl(); // Reload table
    } catch (error) {
        console.error("❌ Error locking user:", error);
    }
};

window.unlockAccount = async function (userId) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/admin/unlock-user/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to unlock user");
        alert("User account unlocked!");
        loadAccessControl(); // Reload table
    } catch (error) {
        console.error("❌ Error unlocking user:", error);
    }
};

// ✅ Attach functions to `window` to avoid "unused declaration" warning
window.updateUserRole = updateUserRole;
window.deleteUser = deleteUser;
window.lockAccount = lockAccount;
window.unlockAccount = unlockAccount;
window.loadThreatAnalytics = loadThreatAnalytics;
