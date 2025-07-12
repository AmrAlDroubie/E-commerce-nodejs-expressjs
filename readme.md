# 🛒 E-Commerce Backend API

This is a e-commerce backend built with **Node.js**, **Express.js**, and **MongoDB**. It features authentication, authorization, product browsing, cart management, coupon checking, and admin access. The project also includes Redis caching and image upload via Multer.

## 🚀 Tech Stack

- Node.js + Express.js
- MongoDB with Mongoose
- Redis (caching)
- Multer (image upload)
- JWT (authentication & authorization)
- Postman (testing & documentation)

---

## 🔐 Auth Routes

| Method | Route            | Description                            |
| ------ | ---------------- | -------------------------------------- |
| POST   | `/signup`        | Register a new user                    |
| POST   | `/login`         | Login with email & password            |
| POST   | `/logout`        | Logout user                            |
| POST   | `/refresh-token` | Refresh access token                   |
| GET    | `/profile`       | Get logged-in user profile (protected) |

---

## 🛍️ Product Routes

| Method | Route                 | Description                        |
| ------ | --------------------- | ---------------------------------- |
| GET    | `/`                   | Get all products (admin protected) |
| GET    | `/featured`           | Get featured products              |
| GET    | `/images/:image`      | Serve uploaded product image       |
| GET    | `/category/:category` | Get products by category           |
| GET    | `/recommendations`    | Get random product recommendations |

---

## 🛒 Cart Routes

| Method | Route  | Description                  |
| ------ | ------ | ---------------------------- |
| GET    | `/`    | Get cart contents            |
| POST   | `/`    | Add product to cart          |
| PATCH  | `/:id` | Update quantity of cart item |
| DELETE | `/`    | Empty the entire cart        |
| DELETE | `/:id` | Remove single item from cart |

---

## 🎟️ Coupon Routes

| Method | Route           | Description       |
| ------ | --------------- | ----------------- |
| GET    | `/`             | Get all coupons   |
| GET    | `/check-coupon` | Validate a coupon |

---

## 🛠️ Admin Routes (Protected)

| Method | Route | Description                   |
| ------ | ----- | ----------------------------- |
| GET    | `/`   | Get all products (admin only) |

---

## 📂 Folder Structure
