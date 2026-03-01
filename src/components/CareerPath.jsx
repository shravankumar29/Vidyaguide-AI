import React, { useState } from 'react';
import { Map, Briefcase, Award, Clock, Loader2, ArrowDown } from 'lucide-react';
import { api } from '../services/api';
export default function CareerPath() {
    const [currentSkills, setCurrentSkills] = useState('');
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [pathData, setPathData] = useState(null);
    const [error, setError] = useState('');

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!currentSkills.trim() || !domain.trim()) return;

        setLoading(true);
        setError('');
        setPathData(null);

        try {
            const parsedSkills = currentSkills.split(',').map(s => s.trim()).filter(s => s);
            const res = await api.post('/career/roadmap', {
                extracted_skills: parsedSkills,
                domain: domain
            });
            setPathData(res.data);
        } catch (err) {
            setError('Failed to generate career path.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="glass-panel p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Map className="w-5 h-5 text-indigo-600" />
                    Generate Your AI Career Roadmap
                </h2>

                <form onSubmit={handleGenerate} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Desired Career Domain</label>
                            <div className="relative">
                                <Briefcase className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white/50"
                                    placeholder="e.g. Machine Learning, Cloud Architecture"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Current Underlying Skills</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white/50"
                                placeholder="Python, Statistics, SQL..."
                                value={currentSkills}
                                onChange={(e) => setCurrentSkills(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !currentSkills || !domain}
                        className="px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition disabled:opacity-70 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Roadmap'}
                    </button>
                </form>

                {error && (
                    <p className="mt-4 text-red-500 text-sm">{error}</p>
                )}
            </div>

            {pathData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* Summary Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-primary-600 text-white shadow-xl">
                            <h3 className="text-lg font-bold opacity-90 mb-1">Target Domain</h3>
                            <p className="text-2xl font-extrabold mb-6 truncate">{pathData.domain}</p>

                            <div className="flex items-center gap-3 bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                                <Clock className="w-6 h-6 opacity-80" />
                                <div>
                                    <p className="text-sm opacity-80 font-medium">Estimated Timeline</p>
                                    <p className="text-xl font-bold">{pathData.estimated_timeline}</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-2xl border-indigo-100 bg-indigo-50/50">
                            <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Recommended Certifications
                            </h3>
                            <ul className="space-y-2">
                                {pathData.certifications.map((cert, i) => (
                                    <li key={i} className="flex items-start gap-2 text-indigo-800 text-sm bg-white p-3 rounded-lg shadow-sm border border-indigo-100">
                                        <span className="shrink-0 w-2 h-2 mt-1.5 rounded-full bg-indigo-400"></span>
                                        {cert}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Stepper / Timeline */}
                    <div className="lg:col-span-2 glass-panel p-6 rounded-2xl relative">
                        <h3 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">Progression Steps</h3>

                        <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            {pathData.roadmap_steps.map((step, i) => (
                                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-8">

                                    {/* Marker */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
                                        {i + 1}
                                    </div>

                                    {/* Card */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm ml-4 md:ml-0 hover:shadow-md hover:border-indigo-300 transition cursor-default">
                                        <p className="text-slate-700 font-medium text-sm leading-relaxed">{step}</p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
