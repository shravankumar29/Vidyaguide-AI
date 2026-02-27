import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Basic Placeholder Pages
const Home = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center mt-20">
    <h1 className="text-5xl font-extrabold text-gradient mb-4">Welcome to VidyaMitra</h1>
    <p className="text-xl text-slate-600 max-w-2xl mx-auto">Your Intelligent Career Agent. Elevate your professional journey with AI-driven insights, resume analysis, and tailored mock interviews.</p>
    <div className="mt-8 flex justify-center gap-4">
      <Link to="/login" className="px-6 py-3 bg-primary-600 text-white rounded-full font-semibold shadow-lg hover:bg-primary-700 transition">Get Started</Link>
      <Link to="/features" className="px-6 py-3 bg-white text-slate-800 rounded-full font-semibold shadow border hover:bg-slate-50 transition">Explore Features</Link>
    </div>
  </motion.div>
);

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
            <Link to="/features" className="text-slate-600 hover:text-primary-600 font-medium transition">Features</Link>
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
