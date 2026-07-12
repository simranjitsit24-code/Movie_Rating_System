# 🎬 Movie Rating System

A full-stack web application where users can discover, rate, and review movies. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🌟 Live Demo

- **Frontend:** https://movie-rating-system-1.onrender.com


## 📸 Features

### 🔐 User Authentication
- Register with email and password
- Secure login with JWT token
- Password strength meter during registration
- Confirm password validation
- Session management

### 🎬 Movie Management
- Browse all movies with search and filter
- View detailed movie information
- See ratings and reviews from other users
- Filter movies by genre
- Sort by rating, recent, or oldest

### ⭐ Rating & Reviews
- Rate movies from 1 to 5 stars
- Write detailed reviews
- Like/unlike reviews
- View average ratings
- See total review counts

### ❤️ Favorites
- Add movies to favorites
- Remove from favorites
- View all favorite movies in one place
- Real-time favorite status updates

### 👤 User Profile
- View profile with user statistics
- Edit profile information
- Change avatar
- View your recent activity

### 🎨 UI Features
- Dark theme design
- Responsive layout
- Smooth animations
- Interactive star ratings
- Loading states
- Error handling
- Toast notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Navigation and routing
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library
- **CSS3** - Custom styling with dark theme

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

### DevOps
- **Render** - Hosting platform
- **MongoDB Atlas** - Cloud database
- **Git** - Version control

## 📂 Project Structure
movie-rating-system/
├── backend/
│ ├── server.js # Main server file
│ ├── package.json # Backend dependencies
│ └── .env # Environment variables
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Auth/
│ │ │ │ ├── Login.jsx
│ │ │ │ └── Register.jsx
│ │ │ ├── Home.jsx
│ │ │ ├── MovieList.jsx
│ │ │ ├── MovieCard.jsx
│ │ │ ├── MovieDetails.jsx
│ │ │ ├── Profile.jsx
│ │ │ ├── Navbar.jsx
│ │ │ └── Sidebar.jsx
│ │ ├── context/
│ │ │ └── AuthContext.jsx
│ │ ├── App.jsx
│ │ ├── App.css
│ │ └── main.jsx
│ ├── public/
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
├── .env.production
├── .gitignore
└── README.md
