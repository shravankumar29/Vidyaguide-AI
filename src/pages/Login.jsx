import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../services/api';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', { email, password });
            setAuthToken(res.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-16 px-4 relative">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-300 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-panel w-full max-w-md p-8 rounded-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h2>
                    <p className="text-slate-500">Log in to continue your career journey</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center shadow-inner">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition bg-white/50"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition bg-white/50"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                Sign In <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Don't have an account? <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition">Register here</Link>
                </p>
            </motion.div>
        </div>
    );
}
