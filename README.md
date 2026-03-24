# Asset Management API

## Overview

This project is a backend API for managing coupons/vouchers (assets). It allows authenticated users to claim assets while ensuring data consistency when multiple users attempt to access the same asset at the same time.

The main focus of this implementation is:

* Secure user authentication
* Handling concurrency and race conditions
* Efficient relational data retrieval using SQL joins

---

## Tech Stack

* Node.js
* Express.js
* MySQL
* JWT (Authentication)
* bcrypt (Password hashing)

---

## Project Structure

```
asset-management-api/
│
├── config/             # Database connection
├── controllers/        # API logic
├── middleware/         # Authentication middleware
├── routes/             # API routes
├── .env                # Environment variables
├── app.js              # Entry point
└── package.json
```

---

## Setup Instructions

1. Install dependencies:

```
npm install
```

2. Rename `.env.example` to `.env` and update it with your credentials.

3. Start server:

```
npx nodemon app.js
```

---

## Database Structure

CREATE DATABASE asset_db;

USE asset_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    status ENUM('AVAILABLE', 'CLAIMED') DEFAULT 'AVAILABLE',
    claimed_by INT NULL,
    FOREIGN KEY (claimed_by) REFERENCES users(id)
);

CREATE TABLE asset_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT,
    user_id INT,
    action VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


users: Stores registered user details
assets: Stores coupons/vouchers and their current status
asset_logs: Maintains history of asset actions (who claimed what and when)
---

## API Endpoints

### Auth

**Register**

```
POST /api/auth/register
```

**Login**

```
POST /api/auth/login
```

---

### Assets

**Get all assets**

```
GET /api/assets
```

**Claim asset**

```
POST /api/assets/claim/:id
```

**Get user asset history**

```
GET /api/assets/my
```

---