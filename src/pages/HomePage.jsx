import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { formatMoney } from '@/utils';
import { Play, Activity, DollarSign, Zap, User, BookOpen } from 'lucide-react';
import { TIERS } from '@/constants';

const HomePage = () => {
    const { state } = useGame();
    const navigate = useNavigate();
    const { balance, turn, history, xp, tierIndex, rank, loan, profileIcon } = state;

    const totalWins = history.filter(h => h.profit > 0).length;
    const totalLosses = history.filter(h => h.profit < 0).length;

    const tierName = TIERS[tierIndex];
    const xpPerRank = 1000;
    const currentRankXP = xp % xpPerRank;
    const xpProgress = (currentRankXP / xpPerRank) * 100;

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center fade-in">
            <div className="max-w-6xl w-full space-y-8">
                {/* Quick Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700"
                    >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-semibold">Profile</span>
                    </button>
                    <button
                        onClick={() => navigate('/help')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700"
                    >
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-semibold">Manual</span>
                    </button>
                </div>

                {/* Hero Section */}
                <div className="glass-panel p-12 rounded-3xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div
                            className="relative cursor-pointer"
                            onClick={() => navigate('/profile')}
                        >
                            <div
                                className="w-32 h-32 rounded-full bg-indigo-600 border-4 border-indigo-400 flex items-center justify-center text-7xl shadow-2xl hover:scale-110 transition-transform"
                            >
                                {profileIcon || '👤'}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full border-2 border-slate-900 shadow-lg pointer-events-none">
                                Rank {rank}
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-3">
                                Welcome Back, <span className="text-indigo-400">Operator</span>
                            </h1>

                            <p className="text-slate-400 text-lg font-semibold flex items-center gap-2">
                                <span id="profile-tier-name" className="text-sm font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">{tierName.toUpperCase()}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Balance Card */}
                    <div className="glass-panel p-8 rounded-xl border border-indigo-500/30 hover:border-indigo-500 transition-all hover:scale-105">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-400 text-sm uppercase font-bold tracking-wider">Available Capital</span>
                            <DollarSign className="w-6 h-6 text-indigo-400" />
                        </div>
                        <p className="text-5xl font-bold text-white font-mono">{formatMoney(balance)}</p>
                        <p className="text-xs text-slate-500 mt-2">Ready for deployment</p>
                    </div>

                    {/* Year Counter */}
                    <div className="glass-panel p-8 rounded-xl border border-emerald-500/30 hover:border-emerald-500 transition-all hover:scale-105">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-400 text-sm uppercase font-bold tracking-wider">Market Year</span>
                            <Activity className="w-6 h-6 text-emerald-400" />
                        </div>
                        <p className="text-5xl font-bold text-white font-mono">#{turn}</p>
                        <p className="text-xs text-slate-500 mt-2">{totalWins + totalLosses} trades completed</p>
                    </div>
                </div>

                {/* XP Progress Bar */}
                <div className="glass-panel p-6 rounded-xl border border-indigo-500/30">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Zap className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-slate-400 text-sm uppercase font-bold">Experience Progress</p>
                                <p className="text-indigo-400 font-mono font-bold">{currentRankXP} / {xpPerRank} XP</p>
                            </div>
                            <div className="relative w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-indigo-500 transition-all duration-500 shadow-lg"
                                    style={{ width: `${xpProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 text-center">Level up to unlock new trading capabilities</p>
                </div>

                {/* Loan Warning */}
                {loan.active && (
                    <div className="glass-panel p-6 rounded-xl border border-red-500/50 bg-red-500/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-red-400 animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-red-400 font-bold text-sm uppercase">Active Loan Warning</p>
                                    <p className="text-slate-400 text-xs mt-1">
                                        Outstanding debt: <span className="font-mono font-bold text-red-400">{formatMoney(loan.amount)}</span> | Due: Year {loan.dueTurn}
                                    </p>
                                </div>
                            </div>
                            <span className="text-red-500 text-xs font-bold px-3 py-1 bg-red-900/30 rounded-full border border-red-900">
                                {loan.dueTurn - turn} Years Remaining
                            </span>
                        </div>
                    </div>
                )}

                {/* CTA Button */}
                <div className="text-center pt-4">
                    <button
                        onClick={() => navigate('/market')}
                        className="group relative flex items-center justify-start p-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl rounded-full shadow-2xl shadow-indigo-900/50 transition-all duration-500 hover:scale-105 hover:shadow-indigo-500/50 hover:pr-8 mx-auto overflow-hidden"
                    >
                        {/* Background Glow Effect */}
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl group-hover:blur-3xl transition-all -z-10 animate-pulse"></div>

                        {/* Shining Sweep Effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] skew-x-12 group-hover:animate-[shimmer_1s_infinite] transition-transform"></div>

                        {/* Icon - Always Visible */}
                        <Play className="w-8 h-8 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />

                        {/* Text - Slides out on Hover */}
                        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 transition-all duration-500 ease-in-out">
                            Enter Market
                        </span>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default HomePage;
