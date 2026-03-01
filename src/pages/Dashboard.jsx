import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../services/api';
import {
    BarChart3,
    FileText,
    Briefcase,
    CheckCircle,
    Video,
    LogOut,
    BookOpen,
    User,
    Menu,
    X
} from 'lucide-react';

import ResumeAnalyzer from '../components/ResumeAnalyzer';
import SkillGapAnalysis from '../components/SkillGapAnalysis';
import CareerPath from '../components/CareerPath';
import Quiz from '../components/Quiz';
import Training from '../components/Training';
import Profile from '../components/Profile';

export default function Dashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [progressStats, setProgressStats] = useState({ resumeScore: '--', lastQuizScore: '--' });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (activeTab === 'overview') {
            api.get('/progress/')
                .then(res => {
                    const records = res.data.records || [];
                    let resume = '--';
                    let quiz = '--';
                    records.forEach(r => {
                        if (r.module_name === 'Resume Score') resume = r.score;
                        if (r.module_name === 'Last Quiz Score') quiz = r.score;
                    });
                    setProgressStats({ resumeScore: resume, lastQuizScore: quiz });
                })
                .catch(err => console.error("Failed to load progress:", err));
        }
    }, [activeTab]);

    const handleLogout = () => {
        setAuthToken(null);
        navigate('/');
    };

    const navItems = [
        { id: 'overview', icon: BarChart3, label: 'Overview' },
        { id: 'resume', icon: FileText, label: 'Resume AI' },
        { id: 'skills', icon: Briefcase, label: 'Skill Gap' },
        { id: 'path', icon: CheckCircle, label: 'Career Path' },
        { id: 'quiz', icon: BookOpen, label: 'Quizzes & Training' },
        { id: 'profile', icon: User, label: 'Profile Settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <motion.aside
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                <div className="h-20 flex items-center px-8 border-b border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800">
                        Vidya<span className="text-primary-600">Mitra</span>
                    </h2>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === item.id
                                ? 'bg-primary-50 text-primary-600 font-semibold shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 font-medium transition"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto w-full relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40 -z-10 animate-pulse-slow"></div>
                <div className="p-8 pb-20">

                    {/* Header */}
                    <header className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                {navItems.find(i => i.id === activeTab)?.label}
                            </h1>
                            <p className="text-slate-500 mt-1 placeholder">Welcome back to your career hub.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition mr-2"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            {/* User Avatar / Header Actions */}
                            <button
                                onClick={() => setActiveTab('profile')}
                                className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg transition transform hover:scale-105"
                                title="My Profile"
                            >
                                U
                            </button>
                            <button
                                onClick={handleLogout}
                                className="md:hidden p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </header>

                    {/* Dynamic Content Mapping */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Dynamic Stats */}
                                {['Resume Score', 'Last Quiz Score'].map((stat, i) => {
                                    const value = i === 0 ? progressStats.resumeScore : progressStats.lastQuizScore;
                                    // Resume is out of 100, Quiz is out of 5
                                    const maxScore = i === 0 ? 100 : 5;
                                    const widthPct = value !== '--' ? Math.min(100, Math.round((value / maxScore) * 100)) : 0;

                                    return (
                                        <div key={i} className="glass-panel p-6 rounded-2xl hover:shadow-2xl transition transform hover:-translate-y-1">
                                            <h3 className="text-slate-500 font-medium">{stat}</h3>
                                            <div className="text-4xl font-extrabold text-slate-800 mt-2">
                                                {value}
                                                <span className="text-xl text-slate-400 font-medium">/{maxScore}</span>
                                            </div>
                                            <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary-500 rounded-full transition-all duration-1000" style={{ width: `${widthPct}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Recent Activity */}
                                <div className="md:col-span-3 glass-panel p-6 rounded-2xl mt-4">
                                    <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Milestones</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-4 text-slate-600 bg-white/50 p-3 rounded-xl border border-white">
                                            <CheckCircle className="w-5 h-5 text-slate-300" />
                                            No recent activity. Start by uploading your resume or taking a quiz!
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === 'resume' && (
                            <div className="animate-fade-in">
                                <ResumeAnalyzer />
                            </div>
                        )}

                        {activeTab === 'skills' && (
                            <div className="animate-fade-in">
                                <SkillGapAnalysis />
                            </div>
                        )}

                        {activeTab === 'path' && (
                            <div className="animate-fade-in">
                                <CareerPath />
                            </div>
                        )}

                        {activeTab === 'quiz' && (
                            <div className="animate-fade-in space-y-8">
                                <Quiz />
                                <div className="mt-8 pt-8 border-t border-slate-200">
                                    <Training />
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="animate-fade-in">
                                <Profile />
                            </div>
                        )}

                    </motion.div>
                </div>
            </main>
        </div>
    );
}
