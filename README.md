

````markdown
# 🛡️ CyberShield - Role-Based Cybersecurity Dashboard

CyberShield is a **Node.js-based cybersecurity monitoring system** with **role-based access control**, **IP whitelisting**, and a dynamic dashboard.  
This project demonstrates how to build a secure backend and frontend system that restricts user access based on roles and trusted IP addresses.

---

## ✨ Features

✅ **Role-Based Authentication**  
Users are assigned roles (Admin, Engineer, Analyst, IT Support, Employee) to control which dashboard sections they can access.

✅ **JWT Token Authentication**  
Secure login sessions using JSON Web Tokens.

✅ **Access Control with IP Whitelisting**  
Login is permitted only from trusted IP addresses managed by admins.

✅ **Brute Force Protection**  
Rate limiting on login routes to prevent repeated login attempts.

✅ **Dynamic Frontend Dashboard**  
Different users see different content based on their assigned role.

✅ **User Management APIs**  
Admins can add/remove whitelisted IPs and manage user access.

---

## 🛠️ Technologies Used

- **Node.js + Express.js** – REST API backend
- **MongoDB + Mongoose** – Database and schema modeling
- **JWT** – Secure token-based authentication
- **bcryptjs** – Password hashing
- **Express Rate Limit** – Brute force protection
- **HTML/CSS/JavaScript** – Frontend interface

---

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js installed (`v14` or newer recommended)
- MongoDB installed locally (or Atlas connection string)

---

### ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
````

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file in the root folder:**

   ```
   MONGO_URI=mongodb://127.0.0.1:27017/cybersecurityDB
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the server:**

   ```bash
   node server.js
   ```

   or for development:

   ```bash
   npx nodemon server.js
   ```

---

## 🔐 API Endpoints

### **Authentication**

* `POST /api/auth/register` – Register a new user
* `POST /api/auth/login` – Login and get JWT token

### **IP Whitelisting**

* `POST /api/auth/whitelist-ip` – Add a new whitelisted IP (Admin only)
* `DELETE /api/auth/whitelist-ip/:ip` – Remove a whitelisted IP (Admin only)

### **Protected Route Example**

* `GET /api/auth/admin` – Access admin dashboard (Admin only)

---

## 🎨 Frontend Usage

### Login Page (`index.html`)

* Users can log in with their email and password.
* After login, a JWT token and role are saved in `localStorage`.

### Dashboard Page (`dashboard.html`)

* Displays different sections dynamically:

  * **Admin:** Full access
  * **Engineer:** Network and configuration sections
  * **Analyst:** Security logs
  * **IT Support:** Support tools
  * **Employee:** Security alerts

---

## 📝 Example Users

When testing, you can create users like:

| Role       | Email                                               | Password    |
| ---------- | --------------------------------------------------- | ----------- |
| Admin      | [admin@example.com](mailto:admin@example.com)       | admin123    |
| Analyst    | [analyst@example.com](mailto:analyst@example.com)   | analyst123  |
| Engineer   | [engineer@example.com](mailto:engineer@example.com) | engineer123 |
| IT Support | [support@example.com](mailto:support@example.com)   | support123  |
| Employee   | [employee@example.com](mailto:employee@example.com) | employee123 |

---

## 🛡️ Security Considerations

* All passwords are hashed with bcrypt before saving.
* Brute-force protection with rate limiting is applied on login.
* IP whitelisting is enforced during authentication.
* JWT tokens expire in 1 hour.

---

## 🙌 Contributing

Feel free to fork this project and submit pull requests to enhance functionality or improve security!

---

## 📄 License

This project is licensed under the MIT License.

---


