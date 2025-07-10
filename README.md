# JobNest

JobNest is a full-stack web application for job seekers and employers, featuring job postings, campaigns, and user management. The backend is built with Node.js, Express, and MongoDB, while the frontend uses React and Tailwind CSS.

## Project Structure

```
JobNest/
  ├── api/         # Backend API (Express, MongoDB)
  ├── backend/     # (Unused/legacy)
  ├── frontend/    # Frontend (React, Tailwind CSS)
  ├── package.json
  ├── README.md
  └── ...
```

### Key Directories
- **api/**: Main backend API, including models, routes, and server logic.
- **frontend/**: React frontend app with pages, components, and assets.
- **backend/**: (Currently unused; all backend logic is in `api/`.)

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### 1. Clone the Repository
```bash
git clone <repo-url>
cd JobNest
```

### 2. Install Dependencies
#### Backend (API)
```bash
cd api
npm install
```
#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Configure Environment Variables
- Copy `api/env.example` to `api/.env` and update values as needed:
  - `MONGODB_URI` (MongoDB connection string)
  - `JWT_SECRET` (JWT secret key)
  - `CORS_ORIGIN` (Frontend URL)

### 4. Run the Application
#### Start MongoDB
Make sure MongoDB is running locally or provide a remote URI.

#### Start Backend (API)
```bash
cd api
npm start
```

#### Start Frontend
```bash
cd frontend
npm start
```

The frontend will typically run on [http://localhost:3000](http://localhost:3000) and the backend API on [http://localhost:5000](http://localhost:5000).

## Environment Variables (`api/.env`)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/jobnest
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h
CORS_ORIGIN=http://localhost:3000
```

## Features
- User authentication (JWT)
- Job posting and search
- Campaign creation and contributions
- User roles: jobseeker, employer, admin, etc.
- RESTful API
- Responsive frontend UI

## Scripts
### Backend (from `api/`)
- `npm start` — Start the API server
- `npm run dev` — Start with nodemon (if configured)

### Frontend (from `frontend/`)
- `npm start` — Start the React app

## License
MIT
