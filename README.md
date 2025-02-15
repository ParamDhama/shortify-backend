# 🚀 URL Shortener Backend  

This is the **backend** for a **URL shortening and analytics system**. It allows users to shorten URLs, track clicks, and manage links securely.  

🔗 **Frontend Repository:** _Coming Soon_  
🖥️ **Backend Repository:** [GitHub](https://github.com/ParamDhama/url-shortener-backend.git)  
✅ **API Endpoints and testing:** [Postman](https://documenter.getpostman.com/view/38259618/2sAYXEEJXh) 

---

## 📌 Features  
✔️ **User Authentication** (Signup, Login, Password Reset, Email Verification)  
✔️ **Shorten URLs** & **Track Clicks** (Location, Device, Browser)  
✔️ **Manage Short URLs** (Edit, Delete)  
✔️ **Admin Controls** (Manage Users, URLs, Clicks)  
✔️ **Security** (JWT Authentication, Role-Based Access)  

---

## 📂 Project Structure  
```
📦 url-shortener-backend
│-- 📂 controllers      # Business logic for authentication, URLs, clicks, admin
│-- 📂 models           # Mongoose models (User, URL, Click)
│-- 📂 routes           # API route definitions
│-- 📂 middleware       # Authentication & Authorization middleware
│-- 📂 utils            # Helper functions (email, IP tracking, cleanup jobs)
│-- 📜 .env             # Environment variables
│-- 📜 index.js         # Main server entry point
│-- 📜 README.md        # Project documentation
```

---

## 🛠️ Tech Stack  
✅ **Backend:** Node.js, Express.js  
✅ **Database:** MongoDB (Mongoose ORM)  
✅ **Authentication:** JWT (JSON Web Token), Bcrypt.js  
✅ **Security:** CORS,  Rate Limiting  
✅ **Other:** Nodemailer (Email), QR Code Generator  

---

## ⚙️ Installation & Setup  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/ParamDhama/url-shortener-backend.git
cd url-shortener-backend
```

### 2️⃣ Install Dependencies  
```bash
npm install
```

### 3️⃣ Create `.env` File  
Create a `.env` file in the project root and add the following:  
```ini
PORT=5000
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URI=http://localhost:3000
BASE_URL=http://localhost:5000
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### 4️⃣ Start the Server  
```bash
npm start
```
Server will run at: **http://localhost:5000**  

---

## 📌 API Endpoints  

### 🔹 **Auth Routes (`/api/auth/`)**  
| Method | Endpoint | Description | Access |
|--------|----------|------------|--------|
| POST   | `/register` | Register a new user | Public |
| POST   | `/login` | Login user | Public |
| POST   | `/forgot-password` | Request password reset | Public |
| POST   | `/reset-password/:token` | Reset password | Public |
| POST   | `/resend-verification` | Resend email verification | Public |
| GET    | `/verify/:token` | Verify user email | Public |
| POST   | `/change-password` | Change password | Authenticated |

---

### 🔹 **URL Shortening (`/api/url/`)**  
| Method | Endpoint | Description | Access |
|--------|----------|------------|--------|
| POST   | `/shorten` | Create a short URL | Authenticated |
| GET    | `/:shortUrl` | Redirect to original URL | Public |
| GET    | `/user/urls` | Get user's URLs | Authenticated |
| DELETE | `/user/urls/:shortUrl` | Delete user's URL | Authenticated |

---

### 🔹 **Click Tracking (`/api/clicks/`)**  
| Method | Endpoint | Description | Access |
|--------|----------|------------|--------|
| GET    | `/:urlId` | Get analytics for a specific URL | Authenticated |

---

### 🔹 **Admin Routes (`/api/admin/`)**  
| Method | Endpoint | Description | Access |
|--------|----------|------------|--------|
| GET    | `/users` | Get all users | Admin |
| PUT    | `/users/role` | Change user role | Admin |
| PUT    | `/users/ban/:id` | Ban/unban a user | Admin |
| DELETE | `/users/:id` | Delete a user | Admin |
| PUT    | `/urls/restore` | Restore deleted URLs | Admin |
| DELETE | `/urls` | Delete a URL | Admin |
| GET    | `/clicks` | Get all click analytics | Admin |

---

## 🔒 Authentication & Security  
- **JWT Authentication** for protected routes  
- **Role-Based Access Control (RBAC)** for **Admin & User** roles  
- **Password Hashing** with **bcrypt.js**  
- **Secure Email Verification & Password Reset**  

---

## 📊 Click Analytics  
Each click on a shortened URL is tracked with:  
- **IP Address & Location** 🌍  
- **Device Type** 📱💻  
- **Browser Used** 🌐  

---

## 🛠️ Testing the API  
- Use **Postman** or **cURL** to test endpoints  
- Example request:  
```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com", "password":"Test@1234"}'
```

---

## 🛠️ Future Enhancements  
✅ **Custom Short URLs**  
✅ **Detailed Analytics Dashboard**  
✅ **Multi-Factor Authentication (MFA)**  

---

## 📝 License  
This project is **open-source** under the **MIT License**.  

---

## 🙌 Contributing  
Want to improve this project? Follow these steps:  
1. **Fork** the repository  
2. **Create a new branch** (`git checkout -b feature-name`)  
3. **Commit changes** (`git commit -m "Added new feature"`)  
4. **Push to GitHub** (`git push origin feature-name`)  
5. **Submit a Pull Request**  

---

## 📞 Contact  
👤 **Param Dhama**  
📧 **dhamaparam@gmail.com**  
🌐 **[LinkedIn](https://www.linkedin.com/in/paramdhama/)**  
🔗 **[GitHub](https://github.com/ParamDhama)**  

---

### ⭐ **If you like this project, don’t forget to star it!** 🚀🌟  
