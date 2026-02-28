# VidyaMitra - Intelligent Career Agent 🚀
<<<<<<< HEAD

VidyaMitra is a modern, AI-powered monolithic application designed to help job seekers optimize their career paths. It combines an intelligent backend with a premium, glassmorphic frontend to provide resume analysis, skill gap detection, career roadmaps, and interactive AI-driven quizzes.

## ✨ Features

=======
VidyaMitra is a modern, AI-powered monolithic application designed to help job seekers optimize their career paths. It combines an intelligent backend with a premium, glassmorphic frontend to provide resume analysis, skill gap detection, career roadmaps, and interactive AI-driven quizzes.
## ✨ Features
>>>>>>> 34a1d81faa0820f45de81452b3726452e9f4c534
- **AI Resume Analyzer**: Upload a PDF or paste text to get an instant overall score, strength analysis, and keyword density check.
- **Dynamic Skill Gap Analysis**: Enter a target role and your current skills to see exactly what you're missing.
- **AI Career Roadmap**: Generate a 3-5 year progression plan with estimated timelines and recommended certifications.
- **Adaptive Training Quizzes**: Generate specific quizzes on any topic (React, Python, etc.) to test your knowledge with instant AI feedback.
- **Skills Radar Chart**: Visual breakdown of your proficiency vs. market requirements.
- **Monolithic Architecture**: Unified Python backend (FastAPI) that serves the React frontend builder for zero-overhead deployment.
<<<<<<< HEAD

## 🛠️ Tech Stack

=======
## 🛠️ Tech Stack
>>>>>>> 34a1d81faa0820f45de81452b3726452e9f4c534
- **Backend**: Python 3.10+, [FastAPI](https://fastapi.tiangolo.com/)
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion
- **AI**: Google Gemini Pro 2.5 (Generative AI)
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React
<<<<<<< HEAD

## 🚀 Getting Started

### Prerequisites

- Python installed
- Node.js (only for modifying frontend)

### Installation

=======
## 🚀 Getting Started
### Prerequisites
- Python installed
- Node.js (only for modifying frontend)
### Installation
>>>>>>> 34a1d81faa0820f45de81452b3726452e9f4c534
1. **Clone the repository**
2. **Setup Virtual Environment**
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
<<<<<<< HEAD
### 3. Configure Environment Variables (For Judges/Evaluators)
Because we prioritize security, API keys are not committed to the repository. 

1. Duplicate the `.env.example` file and rename it to `.env`.
2. Open `.env` and insert a valid **Google Gemini API Key**:
   ```env
   # AI (Gemini)
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: The application's AI features will not function without a valid Gemini key)*

## 🏃 Running the Application

You only need one command to run everything!

```bash
uvicorn app.main:app --reload
```

Then visit: **[http://localhost:8000](http://localhost:8000)**

---

=======
3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   # Database (Supabase)
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   # AI (Gemini)
   GEMINI_API_KEY=your_gemini_api_key
   # Training (YouTube API - Optional)
   YOUTUBE_API_KEY=your_youtube_key
   ```
## 🏃 Running the Application
You only need one command to run everything!
```bash
uvicorn app.main:app --reload
```
Then visit: **[http://localhost:8000](http://localhost:8000)**
---
>>>>>>> 34a1d81faa0820f45de81452b3726452e9f4c534
**Note**: The project is designed as a **Monolith**. The React frontend code in `src/` has already been built into the `dist/` folder, which the Python server serves automatically. If you edit the JavaScript files, you will need to run `npm run build` again to see changes.
