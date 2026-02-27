import React, { useState } from 'react';
import { Video, Search, ExternalLink, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { motion } from 'framer-motion';

export default function Training() {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [trainingData, setTrainingData] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        setError('');

        try {
            const res = await api.post('/training/plan', {
                skill: topic,
                focus_area: "Fundamentals"
            });
            setTrainingData(res.data);
        } catch (err) {
            setError('Failed to fetch training modules.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Video className="w-5 h-5 text-red-500" />
                    Curated Video Training
                </h2>

                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition bg-white/50"
                            placeholder="Search for a skill (e.g. Next.js, Docker, Machine Learning)"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !topic}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold shadow-md hover:bg-slate-800 transition disabled:opacity-70 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
            </div>

            {trainingData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <div className="md:col-span-2 lg:col-span-3 mb-2 mt-4 first:mt-0">
                        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Training Plan for: {trainingData.skill}</h3>
                        <p className="text-slate-500 mt-2 text-sm">Estimated Timeline: {trainingData.timeline_weeks} Weeks</p>
                    </div>

                    {trainingData.videos.map((video, idx) => (
                        <a
                            key={idx}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-panel rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col group"
                        >
                            <div className="relative aspect-video w-full bg-slate-200 overflow-hidden">
                                {video.thumbnail ? (
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                                        <Video className="w-10 h-10 opacity-50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-300"></div>
                            </div>

                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="font-bold text-slate-800 line-clamp-2 leading-snug mb-2 group-hover:text-red-500 transition">{video.title}</h4>
                                <p className="text-xs text-slate-500 line-clamp-2 mt-auto">Video Tutorial</p>

                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-medium text-slate-600">
                                    <span>YouTube</span>
                                    <ExternalLink className="w-4 h-4 group-hover:text-red-500 transition" />
                                </div>
                            </div>
                        </a>
                    ))}

                    {trainingData.videos.length === 0 && (
                        <div className="md:col-span-2 lg:col-span-3 glass-panel p-8 text-center rounded-2xl">
                            <p className="text-slate-500">No videos found for this topic using the provided key.</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
