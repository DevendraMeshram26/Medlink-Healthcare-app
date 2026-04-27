# 🏥 Medlink Healthcare App

Medlink is a premium, dual-role healthcare platform designed to bridge the gap between patients and medical professionals. Built with a modern tech stack, it offers a seamless experience for booking appointments, managing schedules, and AI-powered health consultations.

---

## 🌟 Core Features

### 👤 For Patients
- **Smart Appointment Booking**: Effortlessly find specialists and book appointments with a few taps.
- **V-Doc AI Assistant**: Get instant preliminary medical advice and health guidance powered by AI (Gemini/Groq).
- **NutriSnap (AI Nutritionist)**: Gain valuable insights about the nutritional content (calories, protein, fats) of food items using integrated AI vision analysis.
- **Nearby Discovery**: Search for doctors and hospitals based on your location and needs.
- **Personalized Profile**: Manage your health records and track upcoming appointments.

### 👨‍⚕️ For Doctors
- **Doctor Dashboard**: A dedicated space for verified professionals to manage their daily schedule and view patient requests.
- **Verification Flow**: Secure application process for doctors to join the platform.
- **Verified Badge**: Authenticated professionals receive a badge for patient trust.

### 🎨 Modern UX/UI
- **Rich Aesthetics**: Vibrant colors, sleek dark modes, and premium typography using the Medlink Design System.
- **Skeleton Loading**: Animated shimmer effects (Skeleton Doctor Cards) to provide a smooth, low-latency feel during data fetching.
- **Role-Based Navigation**: Dynamic tab navigation that adapts instantly based on whether the user is a Patient or a Verified Doctor.

---

## 🛠️ Tech Stack

- **Frontend**: React Native with **Expo**
- **Backend**: **Node.js** with **Express.js**
- **Database**: **MongoDB** with Mongoose
- **Styling**: Vanilla CSS / React Native StyleSheet (Medlink Design System)
- **AI Integration**: **Google Gemini (Vision & Text)** & **Groq API**
- **Image Handling**: Cloudinary
- **Navigation**: React Navigation (Stack & Tabs)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo Go app on your phone (for testing)
- MongoDB instance (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/DevendraMeshram26/Medlink-Healthcare-app.git
cd Medlink-Healthcare-app
```

### 2. Setup Backend
```bash
cd backend
npm install
# Create a .env file with:
# MONGO_URL, JWT_SECRET, PORT, GEMINI_API_KEY, GROQ_API_KEY
npm start
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
# Create a .env file with:
# API_BASE_URL (your local IP or Vercel URL)
npx expo start
```

---

## 📄 License
This project is licensed under the MIT License.
