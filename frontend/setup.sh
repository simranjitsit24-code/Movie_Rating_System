#!/bin/bash

echo "🎬 Movie Rating System Setup"
echo "============================"

# Create backend
echo "📦 Setting up backend..."
mkdir -p backend
cd backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv cors multer
npm install --save-dev nodemon
mkdir -p models routes middleware config
cd ..

# Create frontend
echo "📦 Setting up frontend..."
npm create vite@latest frontend -- --template react
cd frontend
npm install react-router-dom axios react-icons @mui/material @emotion/react @emotion/styled react-star-ratings
cd ..

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. cd backend && npm run dev"
echo "2. cd frontend && npm run dev"
echo ""
echo "🔗 Backend: http://localhost:5000"
echo "🔗 Frontend: http://localhost:5173"