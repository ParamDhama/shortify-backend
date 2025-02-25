<h1 align="center">🚀 Shortify Backend</h1>  
<p align="center">The powerful backend service for Shortify, a modern URL shortener. Built with Node.js, Express, and MongoDB.</p>  

<div align="center">
<strong>🔗 Frontend Repository:</strong> <a href="https://github.com/ParamDhama/shortify-frontend.git" target="_blank">Github</a><br>
<strong>🖥️ Backend Repository:</strong> <a href="https://github.com/ParamDhama/shortify-backend.git" target="_blank">Github</a><br>
<strong>✅ API Endpoints and Testing:</strong> <a href="https://documenter.getpostman.com/view/38259618/2sAYXEEJXh" target="_blank">Postman Docs</a>
</div>  

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-green?style=flat-square">
  <img src="https://img.shields.io/badge/Express.js-4.18.2-blue?style=flat-square">
  <img src="https://img.shields.io/badge/MongoDB-6.x-yellowgreen?style=flat-square">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square">
</p>  

---

## 📌 Table of Contents  
- [✨ Features](#-features)  
- [🛠 Technologies Used](#-technologies-used)  
- [🚀 Getting Started](#-getting-started)  
  - [🔹 Prerequisites](#-prerequisites)  
  - [🔹 Installation](#-installation)  
  - [🔹 Running the Application](#-running-the-application)  
- [📂 Project Structure](#-project-structure)  
- [🌍 API Endpoints](#-api-endpoints)  
- [🔑 Authentication and Authorization](#-authentication-and-authorization)  
- [⚠️ Error Handling](#-error-handling)  
- [🤝 Contributing](#-contributing)  
- [📜 License](#-license)  

---

## ✨ Features  

✅ **URL Shortening** – Convert long URLs into short, shareable links  
✅ **Link Analytics** – Track visits, referrers, and user behavior  
✅ **User Authentication** – Secure JWT-based login, registration, and authorization  
✅ **Admin Controls** – Manage users and monitor system performance  
✅ **Rate Limiting** – Prevent spam and abuse with security checks  
✅ **Scalability** – Optimized for performance with MongoDB and Express.js  

---

## 🛠 Technologies Used  

| **Technology**  | **Usage**  |  
|----------------|-----------|  
| **Node.js**    | Backend runtime  |  
| **Express.js** | Web framework  |  
| **MongoDB**    | Database  |  
| **JWT**        | Authentication  |  
| **Bcrypt**     | Password encryption  |  
| **Mongoose**   | MongoDB ODM  |  
| **dotenv**     | Environment management  |  

---

## 🚀 Getting Started  

### 🔹 Prerequisites  
Ensure you have the following installed:  
- **Node.js v14+** ([Download](https://nodejs.org/))  
- **MongoDB** (Local or Cloud instance)  

### 🔹 Installation  

```bash
git clone https://github.com/ParamDhama/shortify-backend.git
cd shortify-backend
npm install
```

### 🔹 Environment Setup  

Create a `.env` file in the root directory and add the following variables:  

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Replace `your_mongodb_connection_string` with your actual MongoDB connection string.  

### 🔹 Running the Application  

```bash
npm start
```
🔗 The API server will be running at: **http://localhost:3000**  

---

## 📂 Project Structure  

```
shortify-backend/
├── controllers/
│   ├── authController.js
│   ├── urlController.js
│   ├── adminController.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── errorHandler.js
├── models/
│   ├── User.js
│   ├── Url.js
│   ├── Click.js
├── routes/
│   ├── authRoutes.js
│   ├── urlRoutes.js
│   ├── adminRoutes.js
├── utils/
│   ├── validator.js
│   ├── logger.js
├── .env.example
├── .gitignore
├── index.js
├── package.json
└── README.md
```

---

## 🌍 API Endpoints  

### 🔑 Authentication  

| Method | Endpoint | Description |  
|--------|----------|-------------|  
| `POST` | `/api/auth/register` | Register a new user |  
| `POST` | `/api/auth/login` | Authenticate a user and return JWT token |  
| `POST` | `/api/auth/forgot-password` | Initiate password reset |  
| `POST` | `/api/auth/reset-password` | Reset user password |  

### 🔗 URL Management  

| Method | Endpoint | Description |  
|--------|----------|-------------|  
| `POST` | `/api/urls` | Create a new shortened URL |  
| `GET` | `/api/urls` | Retrieve all URLs for the authenticated user |  
| `GET` | `/:shortId` | Redirect to the original URL |  
| `DELETE` | `/api/urls/:id` | Delete a shortened URL |  

### 🔧 Admin  

| Method | Endpoint | Description |  
|--------|----------|-------------|  
| `GET` | `/api/admin/users` | Retrieve all users |  
| `DELETE` | `/api/admin/users/:id` | Delete a specific user |  

---

## 🔑 Authentication and Authorization  

✔️ **JWT-based Authentication** – Secure access using JSON Web Tokens  
✔️ **Role-Based Access Control** – Restrict access to admin routes  
✔️ **Protected Routes** – Users must be logged in to manage URLs  

Example **Protected Route Middleware**:  

```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
```

---

## ⚠️ Error Handling  

- ✅ **Centralized Error Handling** – Catches all server errors  
- ✅ **Custom Validation Errors** – Uses Joi for structured validation  
- ✅ **Request Logging** – Logs errors using Winston  

Example **Error Handler Middleware**:  

```javascript
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
};
```

---

## 🤝 Contributing  

🚀 Contributions are welcome!  

1. **Fork the Repository**  
2. **Clone Your Fork**  
   ```bash
   git clone https://github.com/ParamDhama/shortify-backend.git
   cd shortify-backend
   ```
3. **Create a New Branch**  
   ```bash
   git checkout -b feature-name
   ```
4. **Make Your Changes & Push**  
   ```bash
   git commit -m "Add feature"
   git push origin feature-name
   ```
5. **Submit a Pull Request**  

---

## 📜 License  

This project is open-source and available under the **MIT License**.  

📌 **Enjoy using Shortify Backend!** 🚀  
