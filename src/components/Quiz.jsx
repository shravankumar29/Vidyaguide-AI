import React, { useState } from 'react';
import { BookOpen, CheckCircle, HelpCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Quiz() {
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [error, setError] = useState('');

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!domain.trim()) return;

        setLoading(true);
        setError('');
        setQuizData(null);
        setShowResults(false);
        setAnswers({});
        setCurrentQuestionIdx(0);

        try {
            const res = await api.post('/interactive/quiz/generate', {
                domain: domain,
                difficulty: "intermediate",
                num_questions: 5
            });
            setQuizData(res.data);
        } catch (err) {
            setError('Failed to generate quiz.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (optionIdx) => {
        setAnswers({ ...answers, [currentQuestionIdx]: optionIdx });
    };

    const calculateScore = () => {
        let score = 0;
        quizData.questions.forEach((q, i) => {
            if (answers[i] === q.correct_option_index) {
                score += 1;
            }
        });
        return score;
    };

    return (
        <div className="space-y-6">
            {!quizData && (
                <div className="glass-panel p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-indigo-500" />
                        Adaptive Training Quizzes
                    </h2>

                    <form onSubmit={handleGenerate} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Topic or Technology</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white/50"
                                placeholder="e.g. React Hooks, System Design, Data Structures"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !domain}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-primary-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition disabled:opacity-70 flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Quiz'}
                        </button>
                    </form>
                    {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
                </div>
            )}

            {quizData && !showResults && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-8 rounded-2xl max-w-2xl mx-auto"
                >
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">{quizData.domain}</span>
                        <span className="text-slate-500 font-medium text-sm">Question {currentQuestionIdx + 1} of {quizData.questions.length}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 mb-8 leading-snug">
                        {quizData.questions[currentQuestionIdx].question_text}
                    </h3>

                    <div className="space-y-3 mb-8">
                        {quizData.questions[currentQuestionIdx].options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition font-medium ${answers[currentQuestionIdx] === idx
                                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-900 shadow-sm transform scale-[1.01]'
                                    : 'border-slate-200 bg-white hover:border-indigo-300 text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                <span className="inline-block w-6 h-6 rounded bg-white text-center shadow-sm border border-slate-200 text-slate-500 mr-3 text-sm leading-6">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {option}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                        <button
                            onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
                            disabled={currentQuestionIdx === 0}
                            className="text-slate-500 font-medium hover:text-slate-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        {currentQuestionIdx < quizData.questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                                disabled={answers[currentQuestionIdx] === undefined}
                                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium shadow-md hover:bg-slate-800 transition disabled:opacity-50"
                            >
                                Next Question
                            </button>
                        ) : (
                            <button
                                onClick={async () => {
                                    setShowResults(true);
                                    try {
                                        await api.post('/progress/log', {
                                            module_name: "Last Quiz Score",
                                            score: calculateScore()
                                        });
                                    } catch (err) {
                                        console.error("Failed to log quiz progress", err);
                                    }
                                }}
                                disabled={answers[currentQuestionIdx] === undefined}
                                className="px-6 py-2.5 bg-green-500 text-white rounded-lg font-medium shadow-md hover:bg-green-600 transition disabled:opacity-50 flex items-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" /> Submit Quiz
                            </button>
                        )}
                    </div>
                </motion.div>
            )}

            {showResults && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 rounded-2xl max-w-2xl mx-auto shadow-xl border-t-8 border-t-indigo-500"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 mb-4 shadow-inner">
                            <span className="text-3xl font-black">{calculateScore()}</span>
                            <span className="text-xl">/{quizData.questions.length}</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Quiz Complete!</h2>
                        <p className="text-slate-500">You've finished the assessment for {quizData.domain}.</p>
                    </div>

                    {/* Results Pie Chart */}
                    <div className="h-64 mb-8 w-full max-w-sm mx-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Correct', value: calculateScore() },
                                        { name: 'Incorrect', value: quizData.questions.length - calculateScore() }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell key="cell-0" fill="#22c55e" />
                                    <Cell key="cell-1" fill="#ef4444" />
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-6">
                        {quizData.questions.map((q, i) => (
                            <div key={i} className="p-5 rounded-xl border border-slate-100 bg-white shadow-sm">
                                <p className="font-bold text-slate-800 mb-3">{i + 1}. {q.question_text}</p>

                                <div className="text-sm space-y-2">
                                    <p className={`p-3 rounded-lg flex items-center gap-2 font-medium ${answers[i] === q.correct_option_index ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                        {answers[i] === q.correct_option_index ? <CheckCircle className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                                        Your Answer: {q.options[answers[i]] || "Skipped"}
                                    </p>

                                    {answers[i] !== q.correct_option_index && (
                                        <p className="p-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 font-medium">
                                            Correct Answer: {q.options[q.correct_option_index]}
                                        </p>
                                    )}

                                    <p className="text-slate-500 mt-2 px-1 text-sm"><span className="font-bold text-slate-700">Explanation:</span> {q.explanation}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => { setQuizData(null); setDomain(''); }}
                        className="w-full mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold shadow-md hover:bg-slate-800 transition"
                    >
                        Take Another Quiz
                    </button>
                </motion.div>
            )}
        </div>
    );
}
