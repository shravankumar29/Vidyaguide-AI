<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 34a1d81faa0820f45de81452b3726452e9f4c534
import { User, Mail, Shield, Key, Camera, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

<<<<<<< HEAD
    // Password Modal State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

=======
>>>>>>> 34a1d81faa0820f45de81452b3726452e9f4c534
    // Using placeholder data since we don't have a GET /me endpoint yet
    const [profile, setProfile] = useState({
        name: 'VidyaMitra User',
        email: 'user@example.com',
        role: 'Job Seeker',
        phone: '+1 (555) 000-0000',
        location: 'San Francisco, CA'
    });

<<<<<<< HEAD
    // Load profile from local storage on component mount
    useEffect(() => {
        const savedProfile = localStorage.getItem('vidyamitra_user_profile');
        if (savedProfile) {
            try {
                setProfile(JSON.parse(savedProfile));
            } catch (e) {
                console.error("Could not parse saved profile data", e);
            }
        }
    }, []);

    const handleSaveProfile = () => {
        if (isEditing) {
            // About to toggle off, save to local storage
            localStorage.setItem('vidyamitra_user_profile', JSON.stringify(profile));
        }
        setIsEditing(!isEditing);
    };

=======
>>>>>>> 34a1d81faa0820f45de81452b3726452e9f4c534
    const handleLogout = () => {
        setAuthToken(null);
        navigate('/');
    };

<<<<<<< HEAD
    const handleChangePassword = (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwords.new !== passwords.confirm) {
            setPasswordError("New passwords don't match");
            return;
        }
        if (passwords.new.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        // Mock successful password change
        setPasswordSuccess("Password updated successfully!");
        setTimeout(() => {
            setIsPasswordModalOpen(false);
            setPasswords({ current: '', new: '', confirm: '' });
            setPasswordSuccess('');
        }, 1500);
    };

=======
>>>>>>> 34a1d81faa0820f45de81452b3726452e9f4c534
    return (
        <div className="max-w-4xl space-y-8">
            {/* Header Profile Card */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-500 to-indigo-600"></div>

                <div className="relative pt-16 sm:pt-20 flex flex-col sm:flex-row items-center sm:items-end gap-6">
                    <div className="relative group">
<<<<<<< HEAD
                        <button
                            className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 shadow-xl overflow-hidden flex items-center justify-center bg-gradient-to-tr from-primary-100 to-indigo-100 hover:scale-105 transition-transform"
                            onClick={() => alert('Profile picture upload clicked')}
                        >
                            <span className="text-5xl font-black text-indigo-400">U</span>
                        </button>
                        <button
                            className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md text-slate-600 hover:text-primary-600 transition opacity-0 group-hover:opacity-100 pointer-events-none"
                        >
=======
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 shadow-xl overflow-hidden flex items-center justify-center bg-gradient-to-tr from-primary-100 to-indigo-100">
                            <span className="text-5xl font-black text-indigo-400">U</span>
                        </div>
                        <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md text-slate-600 hover:text-primary-600 transition opacity-0 group-hover:opacity-100">
>>>>>>> 34a1d81faa0820f45de81452b3726452e9f4c534
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-3xl font-extrabold text-slate-900">{profile.name}</h2>
                        <p className="text-slate-500 font-medium">{profile.role} • {profile.location}</p>
                    </div>

                    <div className="flex gap-3">
                        <button
<<<<<<< HEAD
                            onClick={handleSaveProfile}
=======
                            onClick={() => setIsEditing(!isEditing)}
>>>>>>> 34a1d81faa0820f45de81452b3726452e9f4c534
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

<<<<<<< HEAD
                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition group bg-white cursor-pointer"
                    >
=======
                    <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition group bg-white">
>>>>>>> 34a1d81faa0820f45de81452b3726452e9f4c534
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

<<<<<<< HEAD
                    {/* Two-Factor Auth Removed as Per Request */}
=======
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
>>>>>>> 34a1d81faa0820f45de81452b3726452e9f4c534

                    <div className="pt-6 mt-6 border-t border-slate-100">
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 hover:shadow-sm transition">
                            <LogOut className="w-5 h-5" /> Sign Out from Account
                        </button>
                    </div>
                </div>

            </div>
<<<<<<< HEAD

            {/* Password Change Modal Overlay */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-100"
                    >
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Key className="w-6 h-6 text-primary-500" />
                            Change Password
                        </h3>

                        {passwordError && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg border border-red-100">{passwordError}</p>}
                        {passwordSuccess && <p className="text-green-600 text-sm mb-4 p-3 bg-green-50 rounded-lg border border-green-100 font-medium">{passwordSuccess}</p>}

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Current Password</label>
                                <input
                                    type="password" required
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 bg-slate-50 transition"
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                                <input
                                    type="password" required
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 bg-slate-50 transition"
                                    value={passwords.new}
                                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password" required
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 bg-slate-50 transition"
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPasswordModalOpen(false);
                                        setPasswords({ current: '', new: '', confirm: '' });
                                        setPasswordError('');
                                    }}
                                    className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-md hover:bg-primary-700 transition"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
=======
>>>>>>> 34a1d81faa0820f45de81452b3726452e9f4c534
        </div>
    );
}
