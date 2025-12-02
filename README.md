# 🏢 JobNest

JobNest is a full-stack web application for job seekers and employers, featuring job postings, campaigns, and user management. The backend is built with Node.js, Express, and MongoDB, while the frontend uses React and Tailwind CSS.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Setup Instructions](#local-setup-instructions)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [License](#license)

## ✨ Features
- 🔐 User authentication (JWT)
- 📝 Job posting and search
- 🎯 Campaign creation and contributions
- 👥 User roles: jobseeker, employer, admin
- 🚀 RESTful API
- 📱 Responsive frontend UI
- 💳 Payment integration (Stripe & Razorpay)
- 📁 File upload support
- 🔔 Real-time updates with Socket.io

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Helmet & Compression for security/performance
- Morgan for logging
- Multer for file uploads
- Stripe & Razorpay for payments

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- Tailwind CSS for styling
- React Hook Form
- React Hot Toast
- Lucide React icons
- Socket.io Client

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
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
│
├── frontend/              # Frontend (React, Tailwind CSS)
│   ├── src/               # Source files
│   │   ├── services/      # API Service Layer
│   │   ├── contexts/      # React Contexts
│   │   ├── components/    # React Components
│   │   └── pages/         # Page Components
│   ├── public/            # Public assets
│   └── package.json       # Frontend dependencies
│
├── Company Logos/         # Company logo assets
├── package.json           # Root package.json
└── README.md
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** - You can use either:
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud - Recommended for beginners)
  - [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (Local installation)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Local Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd JobNest-v1
```

### Step 2: Install Backend Dependencies

```bash
cd api
npm install
```

This will install all the backend dependencies including:
- Express, MongoDB, JWT, bcryptjs, and other server packages

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

This will install all the frontend dependencies including:
- React, React Router, Axios, Tailwind CSS, and other UI packages

### Step 4: Configure Environment Variables

#### Backend Environment Variables

1. Navigate to the `api` folder:
   ```bash
   cd ../api
   ```

2. You'll see a `.env` file already exists. Update it with your own values:

   ```env
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret_key_here
   JWT_EXPIRE=24h
   CORS_ORIGIN=http://localhost:3000
   STRIPE_SECRET_KEY=your_stripe_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

   **Important Configuration Notes:**

   - **MONGODB_URI**: 
     - For MongoDB Atlas: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/jobnest?retryWrites=true&w=majority`
     - For Local MongoDB: `mongodb://localhost:27017/jobnest`
   
   - **JWT_SECRET**: Generate a strong secret key. You can use:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   
   - **Payment Keys**: 
     - For development, you can use test keys from Stripe/Razorpay
     - Sign up at [Stripe](https://stripe.com) or [Razorpay](https://razorpay.com) to get your keys

   - **PORT**: The backend will run on port 5001 (can be changed)

3. If you want a template, you can also reference `api/env.example`

### Step 5: Setup MongoDB

#### Option A: Using MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `jobnest`
7. Paste the complete connection string in your `.env` file as `MONGODB_URI`

#### Option B: Using Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # MongoDB should start automatically as a service
   ```
3. Use `mongodb://localhost:27017/jobnest` as your `MONGODB_URI`

## 🎬 Running the Application

### Method 1: Run Backend and Frontend Separately (Recommended for Development)

#### Terminal 1 - Start Backend Server

```bash
cd api
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

The backend server will start on `http://localhost:5001`

You should see:
```
🚀 Server running on port 5001
📊 Environment: development
🔗 API URL: http://localhost:5001
✅ Connected to MongoDB
```

#### Terminal 2 - Start Frontend Application

Open a new terminal window:

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

### Method 2: Check API Health

Once the backend is running, you can verify it's working:

```bash
curl http://localhost:5001/api/health
```

Or visit `http://localhost:5001/api/health` in your browser.

### Method 3: Seed Database (Optional)

To populate your database with sample job data:

```bash
cd api
npm run seed
```

## 🌐 Using the Application

1. **Access the Frontend**: Open your browser and go to `http://localhost:3000`
2. **Access the API**: The backend API is available at `http://localhost:5001`
3. **API Documentation**: Visit `http://localhost:5001/` to see available endpoints

## 📡 API Endpoints

The backend exposes the following main endpoints:

- **GET** `/` - API welcome message with endpoint list
- **GET** `/api/health` - Health check endpoint
- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/login` - User login
- **GET** `/api/jobs` - Get all jobs
- **POST** `/api/jobs` - Create a new job (auth required)
- **GET** `/api/users` - Get users (auth required)
- **GET** `/api/campaigns` - Get all campaigns
- **POST** `/api/campaigns` - Create a campaign (auth required)

## 🔧 Available Scripts

### Root Directory
```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run install-all      # Install all dependencies (root, backend, frontend)
```

### Backend (from `api/` directory)
```bash
npm start                # Start the API server
npm run dev              # Start with nodemon (auto-restart)
npm run seed             # Seed database with sample jobs
npm test                 # Run tests
```

### Frontend (from `frontend/` directory)
```bash
npm start                # Start React development server
npm run build            # Build for production
npm test                 # Run tests
```

## 🔒 Environment Variables Reference

### Backend (`api/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port for backend server | `5001` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/jobnest` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here` |
| `JWT_EXPIRE` | JWT token expiration time | `24h` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Stripe API secret key | `sk_test_...` |
| `RAZORPAY_KEY_ID` | Razorpay key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | `your_secret` |

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem**: `❌ MongoDB connection error`

**Solutions**:
- Ensure MongoDB is running (for local setup)
- Check your `MONGODB_URI` is correct
- For Atlas: Verify network access and database user credentials
- Check firewall settings

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::5001`

**Solutions**:
```bash
# Find and kill the process using the port
lsof -ti:5001 | xargs kill -9

# Or change the PORT in api/.env
```

### Frontend Can't Connect to Backend

**Problem**: API calls failing from frontend

**Solutions**:
- Ensure backend is running on `http://localhost:5001`
- Check `proxy` in `frontend/package.json` is set to `http://localhost:5001`
- Verify CORS settings in `api/index.js`

### Dependencies Issues

**Problem**: Module not found errors

**Solutions**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Do this in both api/ and frontend/ directories
```

## 📝 Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **API Testing**: Use tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test API endpoints
3. **Database GUI**: Use [MongoDB Compass](https://www.mongodb.com/products/compass) to visualize your database
4. **Code Quality**: Run tests before committing changes

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ by the JobNest Team
