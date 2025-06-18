# 🏋️‍♂️ Gym Equipment AI Assistant

> Your intelligent workout companion powered by computer vision and AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/yourusername/gym-equipment/graphs/commit-activity)

## 🔍 Overview

Gym Equipment AI Assistant is a cutting-edge web application that leverages computer vision and artificial intelligence to identify gym equipment from images and provide personalized workout recommendations. Whether you're a fitness enthusiast or a beginner, this tool helps you make the most of your gym equipment with AI-powered exercise suggestions.

## 🚀 Live Demo

[View Live Demo](https://gym-equipment-ai.vercel.app) (Coming Soon)

## 🧰 Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- GSAP for animations
- React Router for navigation
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB for database
- Redis for caching
- JWT for authentication
- Google OAuth integration

### AI/ML
- TensorFlow.js for computer vision
- Custom ML model for equipment recognition

### DevOps
- Vercel for frontend hosting
- Render for backend hosting
- GitHub Actions for CI/CD

## 🛠️ Features

- 🤖 **AI-Powered Equipment Recognition**
  - Instant identification of gym equipment from images
  - High-accuracy computer vision model
  - Real-time processing

- 💪 **Personalized Workout Plans**
  - Custom exercise recommendations
  - Difficulty level adaptation
  - Progressive workout tracking

- 🔐 **Secure Authentication**
  - Google OAuth integration
  - JWT-based session management
  - Secure password hashing

- 🎨 **Modern UI/UX**
  - Responsive design for all devices
  - Smooth GSAP animations
  - Beautiful gradient effects
  - Dark/Light mode support

- 📱 **Progressive Web App**
  - Offline functionality
  - Push notifications
  - Installable on devices

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gym-equipment.git
cd gym-equipment
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Start the development servers:
```bash
# Start backend server (from server directory)
npm start

# Start frontend server (from client directory)
npm run dev
```

## ⚙️ Environment Variables

### Backend (.env)
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
REDIS_URL=your_redis_url
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🔁 API Reference

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
GET /api/auth/me
POST /api/auth/logout
```

### Equipment Analysis
```http
POST /api/analyze
GET /api/exercises
GET /api/combo 
```

### User Data
```http
GET /api/user/me
```

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 🙋 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🧠 Known Issues & Roadmap

### Current Issues
- [ ] Mobile responsiveness improvements needed
- [ ] Performance optimization for large image uploads
- [ ] Add more exercise variations

### Roadmap
- [ ] Integration with fitness tracking apps
- [ ] Social features and workout sharing
- [ ] Video exercise demonstrations
- [ ] AI-powered form correction

## 👨‍💻 Author

**Aryan Singh Naruka**
- GitHub: [@aryansingh](https://github.com/aryansingh)
- LinkedIn: [Aryan Singh Naruka](https://linkedin.com/in/aryansingh)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📁 Project Structure

```
gym-equipment/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/      # React context
│   │   ├── component/        # common
│   │   ├── pages/        # Page components
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
├── server/                # Backend Node.js application
│   ├── controllers/      # Route controllers
│   ├──prisma/          # Database models (ORM)
│   ├── routes/          # API routes
│   └── middleware/           # Middleware
└── Readme/                 # Documentation
```

---

⭐️ From [Aryan Singh Naruka](https://github.com/aryansingh)