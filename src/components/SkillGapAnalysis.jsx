import React, { useState } from 'react';
import { Target, Search, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
export default function SkillGapAnalysis() {
    const [currentSkills, setCurrentSkills] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState('');

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!currentSkills.trim() || !targetRole.trim()) return;

        setLoading(true);
        setError('');
        setAnalysis(null);

        try {
            const parsedSkills = currentSkills.split(',').map(s => s.trim()).filter(s => s);
            const res = await api.post('/career/skill-gap', {
                user_skills: parsedSkills,
                target_role: targetRole
            });
            setAnalysis(res.data);
        } catch (err) {
            setError('Failed to generate skill gap analysis.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Search className="w-5 h-5 text-indigo-500" />
                    Find Your Skill Gaps
                </h2>

                <form onSubmit={handleAnalyze} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Target Job Role</label>
                            <div className="relative">
                                <Target className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white/50"
                                    placeholder="e.g. Senior Frontend Engineer"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Your Current Skills (comma separated)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white/50"
                                placeholder="React, CSS, JavaScript..."
                                value={currentSkills}
                                onChange={(e) => setCurrentSkills(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !currentSkills || !targetRole}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition disabled:opacity-70 flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze Gaps'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                        {error}
                    </div>
                )}
            </div>

            {analysis && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Missing Skills */}
                    <div className="glass-panel p-6 rounded-2xl bg-indigo-50/30 border-indigo-100">
                        <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-indigo-500" />
                            Critical Missing Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {analysis.missing_skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-white text-indigo-700 text-sm font-medium rounded-lg border border-indigo-200 shadow-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                        {analysis.missing_skills.length === 0 && (
                            <p className="text-slate-500 text-sm">You have all the core skills required! Great job.</p>
                        )}
                    </div>

                    {/* Learning Priorities */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Learning Priorities</h3>
                        <ul className="space-y-3">
                            {analysis.learning_priorities.map((priority, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 divide-x divide-slate-200">
                                    <span className="font-bold text-slate-400 w-6">{i + 1}</span>
                                    <span className="pl-3">{priority}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Recommended Courses */}
                    <div className="md:col-span-2 glass-panel p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary-500" />
                            Recommended Resources
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {analysis.recommended_courses.map((course, i) => (
                                <a
                                    key={i}
                                    href={course.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-4 bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition group"
                                >
                                    <h4 className="font-semibold text-slate-800 group-hover:text-primary-600 transition mb-1 line-clamp-2">{course.title}</h4>
                                    <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">View Course →</span>
                                </a>
                            ))}
                        </div>
                    </div>

                </motion.div>
            )}
        </div>
    );
}
