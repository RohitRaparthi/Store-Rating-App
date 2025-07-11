# 🏪 FullStack Store Rating System

A full-stack web application that allows users to register, login, and rate stores. The application supports role-based access for three user types: **Admin**, **Normal User**, and **Store Owner**.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization

### 👥 User Roles
- **Admin**:
  - Add new users and stores
  - View dashboard statistics
  - Filter, search, and sort users and stores
- **Normal User**:
  - Register & login
  - Rate and update ratings for stores
  - View store listings and ratings
- **Store Owner**:
  - View users who rated their store
  - See average store rating

---

## 🧱 Tech Stack

| Layer     | Tech                     |
|-----------|--------------------------|
| Frontend  | ReactJS + Context API    |
| Backend   | ExpressJS                |
| Database  | SQLite                   |
| Auth      | JWT + bcrypt             |
| Styling   | CSS / Styled Components  |
| API Calls | Axios                    |

---

## 📁 Project Structure

```
store-rating-app/
│
├── backend/
│ ├── server.js
│ ├── db/
│ ├── routes/
│ ├── middleware/
│ └── controllers/
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── api/
│ │ ├── pages/
│ │ ├── context/
│ │ ├── components/
│ │ ├── App.js
│ │ └── index.js
```

---

## 🛠️ Setup Instructions

### 🔧 Backend (Express + SQLite)

```bash
cd backend
npm install
node server.js
Runs on http://localhost:4000
```
### 🌐 Frontend (React)
```
cd frontend
npm install
npm start
Runs on http://localhost:3000
```

REACT_APP_API_BASE_URL=http://localhost:4000/api

---

## 🧪 Test Users (Seed Data)

| Role        | Email               | Password   |
| ----------- | --------------------| ---------- |
| Admin       | [admin@example.com] | Admin\@123 |
| Normal User | [user@example.com]  | User\@123  |
| Store Owner | [owner@example.com] | Owner\@123 |

---

## 🔄 API Overview
POST /auth/login
Login and get token

POST /auth/register
Register new normal user

PUT /auth/update-password
Update password (logged-in user)

POST /admin/add-user
Add any user (admin only)

POST /admin/add-store
Add store and assign owner

GET /admin/users / GET /admin/stores
Get all users / stores (with filters)

GET /user/stores
View store listings

POST /user/rate
Submit or update rating

GET /store-owner/raters
List users who rated their store

GET /store-owner/average-rating
Store’s average rating

---

## ✅ Validations

| Field    | Rule                                      |
| -------- | ----------------------------------------- |
| Name     | 20–60 characters                          |
| Email    | Valid format                              |
| Address  | Max 400 characters                        |
| Password | 8–16 chars, ≥1 uppercase, ≥1 special char |

---

## 🙌 Acknowledgements
Assignment by Roxiler Systems
Developed by [RohitRaparthi]
