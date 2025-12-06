# 🏢 JobNest

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green.svg)

JobNest is a comprehensive full-stack web application designed to bridge the gap between job seekers and employers. It features a robust job posting system, campaign management, and seamless user interaction. Built with a modern tech stack, JobNest ensures performance, scalability, and a premium user experience.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Local Setup Instructions](#-local-setup-instructions)
- [Running the Application](#-running-the-application)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [License](#-license)
- [Copyright](#-copyright)

## ✨ Features
- **🔐 Secure Authentication**: JWT-based user authentication and authorization.
- **📝 Job Management**: comprehensive job posting, searching, and application system.
- **🎯 Campaign System**: Create and manage recruitment campaigns.
- **👥 Role-Based Access**: Distinct roles for Job Seekers, Employers, and Admins.
- **🚀 RESTful API**: Well-structured and documented API endpoints.
- **📱 Responsive Design**: Fully responsive UI built with React and Tailwind CSS.
- **💳 Payment Integration**: Seamless payments via Stripe and Razorpay.
- **📁 File Handling**: Secure file upload support for resumes and documents.
- **🔔 Real-time Updates**: Instant notifications using Socket.io.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT & bcryptjs
- **Security**: Helmet, Compression, CORS
- **Logging**: Morgan
- **File Uploads**: Multer
- **Payments**: Stripe & Razorpay

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS, Lucide React Icons
- **State/Data**: Axios, React Hook Form
- **Notifications**: React Hot Toast
- **Real-time**: Socket.io Client

## 📁 Project Structure

```
JobNest-v1/
├── api/                    # Backend API (Express, MongoDB)
│   ├── config/            # Configuration (DB, etc.)
│   ├── controllers/       # Route controllers (Business Logic)
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # Uploaded files
│   ├── index.js           # Main server file
│   └── .env               # Environment variables
│
├── frontend/              # Frontend (React, Tailwind CSS)
│   ├── src/               # Source files
│   │   ├── services/      # API Service Layer
│   │   ├── contexts/      # React Contexts
│   │   ├── components/    # React Components
│   │   │   └── layout/    # Layout components (Navbar, Footer, CopyrightBar)
│   │   └── pages/         # Page Components
│   ├── public/            # Public assets
│   └── package.json       # Frontend dependencies
│
├── Company Logos/         # Company logo assets
├── package.json           # Root package.json
└── README.md
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** - [Atlas](https://www.mongodb.com/cloud/atlas) (Cloud) or [Community Edition](https://www.mongodb.com/try/download/community) (Local)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Local Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/masterunix/jobnest-v1.git
cd JobNest-v1
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd api
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `api` directory with the following variables:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=24h
CORS_ORIGIN=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 🎬 Running the Application

### Method 1: Concurrent (Recommended)

From the root directory (if configured) or separate terminals:

**Terminal 1 (Backend):**
```bash
cd api
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API Welcome & Status |
| GET | `/api/health` | System Health Check |
| POST | `/api/auth/register` | User Registration |
| POST | `/api/auth/login` | User Login |
| GET | `/api/jobs` | List All Jobs |
| POST | `/api/jobs` | Create Job (Auth) |
| GET | `/api/campaigns` | List Campaigns |

## � Screenshots

*(Add screenshots of your application here)*

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## © Copyright

**Copyright by vatsal goyal 2025, under MIT licence.**

Built with ❤️ by the JobNest Team.
