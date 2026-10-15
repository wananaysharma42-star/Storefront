# 🛒 Storefront — Full-Stack E-Commerce App

A full-stack e-commerce web application with a **React + Vite** frontend and a **Node.js / Express / MongoDB** backend, featuring JWT-based authentication, cart & wishlist management, and **Razorpay** payment integration.

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| Vite | Build Tool & Dev Server |
| React Router DOM | Client-side Routing |
| Tailwind CSS v4 | Styling |
| Axios | HTTP Client |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API Server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens (JWT) | Authentication |
| bcrypt | Password Hashing |
| Razorpay | Payment Gateway |
| dotenv | Environment Variable Management |
| cookie-parser | Cookie Handling |
| cors | Cross-Origin Resource Sharing |

---

## 📁 Project Structure

```
Ecommerce_App/
├── client/
│   └── vite-project/          # React + Vite frontend
│       ├── src/               # App entry point
│       ├── pages/             # Page-level components
│       ├── components/        # Reusable UI components
│       ├── context/           # React Context (global state)
│       ├── axiosCalls/        # Axios API call utilities
│       ├── public/            # Static assets
│       ├── index.html
│       └── vite.config.js
│
└── server/                    # Node.js + Express backend
    ├── config/                # DB & Razorpay configuration
    ├── controllers/           # Route handler logic
    │   ├── customer.controller.js
    │   ├── product.controller.js
    │   ├── cart.controller.js
    │   ├── wishlist.controller.js
    │   └── order.controller.js
    ├── models/                # Mongoose schemas
    │   ├── customer.model.js
    │   └── product.model.js
    ├── routes/                # Express route definitions
    │   ├── customer.routes.js
    │   ├── product.routes.js
    │   ├── cart.routes.js
    │   ├── wishlist.routes.js
    │   └── order.routes.js
    ├── middlewares/           # Auth & other middlewares
    ├── utils/                 # Helpers (e.g. JWT generator)
    ├── .env                   # Environment variables (never commit!)
    ├── .env.example           # Environment variable blueprint
    ├── index.js               # Server entry point (port 8002)
    └── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher
- A **MongoDB Atlas** cluster (or local MongoDB instance)
- A **Razorpay** account (for payment integration)

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Ecommerce_App
```

---

### 2. Backend Setup

```bash
cd server
```

**Install dependencies:**
```bash
npm install
```

**Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and fill in your actual credentials (see [Environment Variables](#-environment-variables) below).

**Start the dev server:**
```bash
nodemon index.js
# or
node index.js
```

The server will run at **http://localhost:8002**

---

### 3. Frontend Setup

```bash
cd client/vite-project
```

**Install dependencies:**
```bash
npm install
```

**Start the dev server:**
```bash
npm run dev
```

The frontend will run at **http://localhost:5173**

---

## 🔑 Environment Variables

Create a `.env` file inside the `server/` directory by copying `.env.example`:

```bash
cp server/.env.example server/.env
```

| Variable | Description |
|---|---|
| `uname` | MongoDB Atlas username |
| `pass` | MongoDB Atlas password |
| `dburl` | Full MongoDB connection string (SRV format) |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID (from Razorpay Dashboard) |
| `RAZORPAY_KEY_SECRET` | Razorpay API Key Secret |

> ⚠️ **Never commit your `.env` file to version control.** Ensure `.env` is in your `.gitignore`.

---

## 📡 API Endpoints

The base URL for all endpoints is `http://localhost:8002`.

### 👤 Customers (`/customers`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/customers/register` | ❌ | Register a new customer |
| `POST` | `/customers/login` | ❌ | Login and receive JWT cookie |
| `POST` | `/customers/logout` | ✅ | Logout and clear cookie |
| `GET` | `/customers/profile` | ✅ | Get logged-in customer profile |

### 🛍️ Products (`/products`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/products` | ❌ | Get all products |
| `GET` | `/products/:id` | ❌ | Get a product by ID |

### 🛒 Cart (`/cart`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/cart` | ✅ | Get current cart |
| `POST` | `/cart/add` | ✅ | Add item to cart |
| `PUT` | `/cart/update` | ✅ | Update item quantity |
| `DELETE` | `/cart/remove/:productId` | ✅ | Remove item from cart |
| `DELETE` | `/cart/clear` | ✅ | Clear entire cart |

### ❤️ Wishlist (`/wishlist`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/wishlist` | ✅ | Get wishlist |
| `POST` | `/wishlist/add` | ✅ | Add item to wishlist |
| `DELETE` | `/wishlist/remove/:productId` | ✅ | Remove from wishlist |

### 📦 Orders (`/orders`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/orders/create-payment` | ✅ | Create a Razorpay payment order |
| `POST` | `/orders/verify-payment` | ✅ | Verify payment signature & confirm order |
| `GET` | `/orders` | ✅ | Get all orders for the logged-in customer |
| `GET` | `/orders/:id` | ✅ | Get a specific order by ID |

> ✅ **Auth** = Requires a valid JWT token (sent via `httpOnly` cookie).

---

## 💳 Payment Flow (Razorpay)

1. Customer adds items to cart and proceeds to checkout.
2. Frontend calls `POST /orders/create-payment` with shipping details.
3. Backend creates a Razorpay order and returns the `razorpayOrderId` and `amount`.
4. Frontend opens the **Razorpay checkout modal** using the Razorpay JS SDK.
5. On successful payment, frontend calls `POST /orders/verify-payment` with the payment signature.
6. Backend verifies the HMAC-SHA256 signature, updates stock, clears the cart, and marks the order as **PLACED**.

---

## 🔐 Authentication

- JWT tokens are issued on **register** and **login**.
- Tokens are stored in **`httpOnly` cookies** (not accessible via JavaScript) for security.
- Protected routes use a middleware that verifies the token from the cookie and attaches `req.customer`.

---

## 📝 License

This project is for educational/personal use. Feel free to fork and extend it.
