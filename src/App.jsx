import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { FileText, Target, Map, BrainCircuit, BarChart } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { setAuthToken } from './services/api';

const Home = () => {
  const navigate = useNavigate();

  const handleGuestAccess = () => {
    // Generate a secure mock session for the user
    setAuthToken("vidyamitra_guest_session_123");
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-20 pb-16 text-center w-full max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 mt-8">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">VidyaMitra AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Your Intelligent Career Agent. Elevate your professional journey with AI-driven insights, resume analysis, and tailored mock interviews.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="px-8 py-4 bg-primary-600 text-white rounded-full font-bold shadow-xl hover:bg-primary-700 hover:shadow-2xl transition-all transform hover:-translate-y-1">
            Start Your Journey
          </Link>
          <button onClick={handleGuestAccess} className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold shadow-sm hover:bg-slate-50 hover:shadow-md transition-all transform hover:-translate-y-1">
            Try as Guest
          </button>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="w-full bg-white/50 py-20 px-6 backdrop-blur-sm border-y border-slate-200/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">What is VidyaMitra AI?</h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-4xl mx-auto">
            VidyaMitra is a modern, AI-powered platform designed to help job seekers optimize their career paths. It combines an intelligent backend with a premium interface to provide comprehensive resume analysis, skill gap detection, personalized career roadmaps, and interactive AI-driven quizzes. Let our AI be your personal mentor to navigate the modern job market.
          </p>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="w-full py-20 px-6 max-w-7xl mx-auto mb-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful AI Features</h2>
          <p className="text-xl text-slate-600">Everything you need to land your dream job</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <FileText className="w-8 h-8 text-blue-500" />, title: "AI Resume Analyzer", desc: "Upload a PDF or paste text to get an instant overall score, strength analysis, and keyword density check compared to job descriptions." },
            { icon: <Target className="w-8 h-8 text-rose-500" />, title: "Dynamic Skill Gap Analysis", desc: "Enter a target role and your current skills to see exactly what you're missing and what you need to focus on next." },
            { icon: <Map className="w-8 h-8 text-emerald-500" />, title: "AI Career Roadmap", desc: "Generate a custom 3-5 year progression plan with estimated timelines and recommended certifications to reach your goals." },
            { icon: <BrainCircuit className="w-8 h-8 text-purple-500" />, title: "Adaptive Training Quizzes", desc: "Generate specific quizzes on any topic (React, Python, etc.) to test your knowledge with instant AI feedback." },
            { icon: <BarChart className="w-8 h-8 text-amber-500" />, title: "Skills Radar Chart", desc: "Visual breakdown of your proficiency vs. market requirements to help you understand your competitive standing." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300 group"
            >
              <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-50 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden bg-slate-50">
        {/* Dynamic Background Blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-200 blur-3xl opacity-50 mix-blend-multiply animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-indigo-200 blur-3xl opacity-50 mix-blend-multiply animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        {/* Navbar */}
        <nav className="glass-panel fixed w-full top-0 z-50 flex justify-between items-center py-4 px-8">
          <Link to="/" className="text-2xl font-bold text-slate-800">
            Vidya<span className="text-primary-600">Mitra</span>
          </Link>
          <div className="flex gap-6 items-center">

            <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition font-medium">Sign Up</Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-24 min-h-[calc(100vh-80px)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
