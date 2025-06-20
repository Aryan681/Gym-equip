# 🏋️‍♂️ Gym Equipment AI Assistant

> Your intelligent workout companion powered by computer vision and AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/yourusername/gym-equipment/graphs/commit-activity)

## 🔍 Overview

Gym Equipment AI Assistant is a cutting-edge web application that leverages computer vision and artificial intelligence to identify gym equipment from images and provide personalized workout recommendations. Whether you're a fitness enthusiast or a beginner, this tool helps you make the most of your gym equipment with AI-powered exercise suggestions.

## 🚀 Live Demo

[🔗 View Live Demo](https://gym-equipment-ai.vercel.app) (Coming Soon)

---

## 🧰 Tech Stack

### Frontend

* React 18 (Vite)
* Tailwind CSS
* GSAP (animations)
* React Router
* Axios

### Backend

* Node.js + Express
* MongoDB
* Redis (caching)
* JWT Auth
* Supabase (Google OAuth)
* Wger API Integration ✅

### AI/ML

* FastAPI backend with a custom ML model
* TensorFlow or PyTorch (used in model training)

### DevOps

* Vercel (Frontend hosting)
* Render (Backend hosting)
* GitHub Actions (CI/CD)

---

## 🛠️ Features

* 🧠 **AI Equipment Detection**

  * FastAPI model for gym gear classification
  * Trained on real-world gym images

* 💪 **Accurate Workout Suggestions**

  * Uses Wger API for real exercises
  * Retrieves exercise name, description, GIFs, and muscles
  * Automatically adapts if no match is found

* 🚀 **Efficient Caching**

  * Redis for reduced API calls and faster responses

* 🔐 **Secure Auth**

  * Google login via Supabase
  * JWT-based sessions

* 🎨 **Modern UI**

  * Responsive Tailwind-based design
  * Smooth page transitions with GSAP

---

## 📦 Installation

```bash
git clone https://github.com/aryansingh/gym-equipment.git
cd gym-equipment
```

### Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Run Servers

```bash
# In server/
npm start

# In client/
npm run dev
```

---

## ⚙️ Environment Variables

### 🔐 Backend (.env)

```env
PORT=3000
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
REDIS_URL=redis_connection_string
EQUIPMENT_PREDICTOR_URL=http://localhost:8000/predict
```

### 🎯 Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_id
```

---

## 🔁 API Endpoints

### Auth

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
GET  /api/auth/me
POST /api/auth/logout
```

### Core Functionality

```http
POST /api/combo  // Upload image, predict equipment, fetch 3 workouts from Wger
```

---

## 🌟 How It Works

1. **User uploads image** → Frontend sends it to FastAPI.
2. **FastAPI model predicts gym equipment** like "bench press" or "dumbbell".
3. **Backend uses Wger API** to:

   * Fetch 3 real exercises matching that equipment
   * Provide GIFs + muscle groups + instructions
4. **Frontend renders the exercises beautifully** to the user.

---

## 🧪 Testing

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

---

## 🛣 Roadmap

* [x] Replace Gemini with Wger API
* [x] Real GIFs and muscle info from Wger
* [ ] Add language selector for exercises (Wger supports 10+ langs)
* [ ] Equipment-based filter for Wger query
* [ ] Add exercise difficulty rating and filters

---

## 👨‍💻 Author

**Aryan Singh Naruka**

* GitHub: [@aryan681](https://github.com/aryan681)
* LinkedIn: [Aryan Singh Naruka](https://linkedin.com/in/aryansingh1-2)

---

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for full details.

---

## 🗂 Project Structure

```
gym-equipment/
├── client/            # React frontend
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── context/
│       └── utils/
├── server/            # Express backend
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   └── redisClient.js
├── detector/          # FastAPI ML service
│   └── app.py
└── README.md
```

---

⭐️ From [Aryan Singh Naruka](https://github.com/aryansingh)
