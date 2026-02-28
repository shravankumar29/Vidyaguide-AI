import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function ResumeAnalyzer() {
    const [resumeText, setResumeText] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState('');

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!resumeText.trim() && !file) return;

        setLoading(true);
        setError('');
        setAnalysis(null);

        try {
            let res;
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                res = await api.post('/resume/analyze-file', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                res = await api.post('/resume/analyze', { resume_text: resumeText });
            }
            setAnalysis(res.data);

            // Log the progress to the backend seamlessly
            try {
                await api.post('/progress/log', {
                    module_name: "Resume Score",
                    score: res.data.score
                });
            } catch (progressErr) {
                console.error("Failed to log progress", progressErr);
            }

        } catch (err) {
            setError('Failed to analyze resume. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Upload className="w-5 h-5 text-primary-500" />
                    Analyze Your Resume
                </h2>

                <form onSubmit={handleAnalyze} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Upload Resume (PDF or Image)</label>
                        <div className="flex items-center justify-center w-full mb-4">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-3 text-slate-400" />
                                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-slate-500">{file ? file.name : "PDF, PNG, JPG (MAX. 5MB)"}</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => { setFile(e.target.files[0]); setResumeText(''); }} />
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-2">
                        <hr className="flex-1 border-slate-200" />
                        <span className="text-slate-400 text-sm font-medium">OR</span>
                        <hr className="flex-1 border-slate-200" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Paste Resume Text</label>
                        <textarea
                            rows="6"
                            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition bg-white/50"
                            placeholder="Paste the content of your resume here to get AI-powered insights..."
                            value={resumeText}
                            onChange={(e) => { setResumeText(e.target.value); setFile(null); }}
                            disabled={!!file}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || (!resumeText && !file)}
                        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><FileText className="w-5 h-5" /> Generate AI Analysis</>}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}
            </div>

            {analysis && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Main Score Card */}
                    <div className="md:col-span-2 glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-8 justify-between bg-gradient-to-r from-white to-primary-50/50">
                        <div className="flex flex-col items-center justify-center text-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100 min-w-[200px]">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Overall Score</h3>
                            <div className={`text-7xl font-black tracking-tighter ${analysis.score >= 80 ? 'text-green-500' : analysis.score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                                {analysis.score}<span className="text-2xl text-slate-300">/100</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="p-4 bg-white/60 rounded-xl border border-white">
                                <h4 className="font-bold text-slate-800 mb-1">Professional Summary</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{analysis.professional_summary}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/60 rounded-xl border border-white flex flex-col items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Formatting</span>
                                    <span className="text-2xl font-bold text-slate-800">{analysis.formatting_score}%</span>
                                </div>
                                <div className="p-4 bg-white/60 rounded-xl border border-white flex flex-col items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Keywords</span>
                                    <span className="text-2xl font-bold text-slate-800">{analysis.keyword_score}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Key Strengths
                            </h3>
                            <ul className="space-y-2">
                                {analysis.key_strengths.map((str, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                                        <span className="shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full bg-green-400"></span>
                                        {str}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Extracted Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {analysis.extracted_skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-yellow-500" />
                                Missing Critical Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {analysis.missing_skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-md border border-yellow-200">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Suitable Roles Based on Profile</h3>
                            <div className="flex flex-wrap gap-2">
                                {analysis.tailored_roles.map((role, i) => (
                                    <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-200 shadow-sm">
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 glass-panel p-6 rounded-2xl border-t-4 border-t-primary-500">
                        <h3 className="text-lg font-black text-slate-800 mb-4 uppercase tracking-wide">Actionable Feedback</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {analysis.improvement_suggestions.map((suggestion, i) => (
                                <div key={i} className="flex items-start gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 font-black shadow-sm">{i + 1}</div>
                                    <p className="text-slate-700 text-sm font-medium leading-relaxed">{suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills Radar Chart */}
                    <div className="md:col-span-2 glass-panel p-6 rounded-2xl mt-2 bg-slate-900 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-400 to-indigo-500 shadow-sm flex items-center justify-center">
                                <span className="text-white text-sm font-bold">📊</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">Skills Analysis</h3>
                        </div>
                        <p className="text-slate-400 text-sm mb-6 ml-11">Compare proficiency in desired role:</p>

                        <div className="h-96 w-full rounded-xl p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                    ...analysis.extracted_skills.slice(0, 3).map(skill => ({ subject: skill, current: 85, required: 95 })),
                                    ...analysis.missing_skills.slice(0, 3).map(skill => ({ subject: skill, current: 20, required: 90 })),
                                    { subject: 'Formatting', current: analysis.formatting_score, required: 100 },
                                    { subject: 'Keywords', current: analysis.keyword_score, required: 100 }
                                ]}>
                                    <PolarGrid stroke="#334155" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 500 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Current Level" dataKey="current" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} strokeWidth={2} />
                                    <Radar name="Requirement Role" dataKey="required" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
                                    <Legend iconType="rect" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                                        itemStyle={{ fontWeight: 'bold' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
