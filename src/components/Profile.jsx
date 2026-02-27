import React, { useState } from 'react';
import { User, Mail, Shield, Key, Camera, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    // Using placeholder data since we don't have a GET /me endpoint yet
    const [profile, setProfile] = useState({
        name: 'VidyaMitra User',
        email: 'user@example.com',
        role: 'Job Seeker',
        phone: '+1 (555) 000-0000',
        location: 'San Francisco, CA'
    });

    const handleLogout = () => {
        setAuthToken(null);
        navigate('/');
    };

    return (
        <div className="max-w-4xl space-y-8">
            {/* Header Profile Card */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-500 to-indigo-600"></div>

                <div className="relative pt-16 sm:pt-20 flex flex-col sm:flex-row items-center sm:items-end gap-6">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 shadow-xl overflow-hidden flex items-center justify-center bg-gradient-to-tr from-primary-100 to-indigo-100">
                            <span className="text-5xl font-black text-indigo-400">U</span>
                        </div>
                        <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md text-slate-600 hover:text-primary-600 transition opacity-0 group-hover:opacity-100">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-3xl font-extrabold text-slate-900">{profile.name}</h2>
                        <p className="text-slate-500 font-medium">{profile.role} • {profile.location}</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition"
                        >
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Personal Information */}
                <div className="md:col-span-2 glass-panel p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Personal Information</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                            {isEditing ? (
                                <input type="text" className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                            ) : (
                                <p className="font-semibold text-slate-800">{profile.name}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                            {isEditing ? (
                                <input type="email" className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                            ) : (
                                <p className="font-semibold text-slate-800 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {profile.email}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                            {isEditing ? (
                                <input type="tel" className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                            ) : (
                                <p className="font-semibold text-slate-800">{profile.phone}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
                            {isEditing ? (
                                <input type="text" className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} />
                            ) : (
                                <p className="font-semibold text-slate-800">{profile.location}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="glass-panel p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Security</h3>

                    <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition group bg-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-primary-50 text-slate-600 group-hover:text-primary-600 transition">
                                <Key className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-slate-800 text-sm">Change Password</p>
                                <p className="text-xs text-slate-500">Update your credentials</p>
                            </div>
                        </div>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition group bg-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 text-slate-600 group-hover:text-indigo-600 transition">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-slate-800 text-sm">Two-Factor Auth</p>
                                <p className="text-xs text-slate-500">Secure your account</p>
                            </div>
                        </div>
                    </button>

                    <div className="pt-6 mt-6 border-t border-slate-100">
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 hover:shadow-sm transition">
                            <LogOut className="w-5 h-5" /> Sign Out from Account
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
