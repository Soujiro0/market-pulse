import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { formatMoney } from '@/utils';
import { History, TrendingUp, TrendingDown, Minus, Activity, Box, Zap, Star, Crown, ChevronLeft, ChevronRight, Trash2, User, Edit, Download, Upload } from 'lucide-react';
import { CLIMATES, RARITY } from '@/constants';
import ranks from '@/data/ranks.json';
import PROFILES from '@/data/profiles.json';
import RanksModal from '@/components/ui/RanksModal';

const EditProfileModal = ({ isOpen, onClose, currentUsername, currentIcon, onSave }) => {
    const [username, setUsername] = useState(currentUsername);
    const [icon, setIcon] = useState(currentIcon);

    useEffect(() => {
        setUsername(currentUsername);
        setIcon(currentIcon);
    }, [isOpen, currentUsername, currentIcon]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(username, icon);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-950/90 z-200 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
            <div className="bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full p-8 border border-indigo-700 relative animate-bounce-in">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Edit Profile</h3>

                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg font-mono text-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Avatar</label>
                        <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
                            {PROFILES.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setIcon(p.image)}
                                    className={`aspect-square rounded-xl flex items-center justify-center transition-all hover:scale-110 ${icon === p.image
                                            ? 'ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/50'
                                            : 'border border-slate-700'
                                        }`}
                                >
                                    <img src={`/market-pulse/assets/profiles/${p.image}`} alt={p.name} className="w-full h-full object-cover rounded-lg" loading="lazy" decoding="async" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-slate-700 hover:bg-slate-600 hover:scale-105 active:scale-95 uppercase text-sm tracking-wide"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 uppercase text-sm tracking-wide"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};


const ProfilePage = () => {
    const { state, resetData, updateProfileIcon, updateUsername, exportData, importData } = useGame();
    const navigate = useNavigate();
    const { history, xp, rankId, profileIcon, username } = state;

    const [currentPage, setCurrentPage] = useState(1);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [isRanksModalOpen, setIsRanksModalOpen] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importError, setImportError] = useState('');
    const itemsPerPage = 10;

    const handleSaveProfile = (newUsername, newIcon) => {
        updateUsername(newUsername);
        updateProfileIcon(newIcon);
    };

    const handleExportData = () => {
        const result = exportData();
        if (!result.success) {
            setImportError('Failed to export data. Please try again.');
            setShowImportModal(true);
        }
    };

    const handleImportData = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const encryptedData = e.target?.result;
                const result = importData(encryptedData);
                
                if (result.success) {
                    // Success - reload page to reflect changes
                    window.location.reload();
                } else {
                    // Show error modal
                    setImportError(result.error);
                    setShowImportModal(true);
                }
            } catch (error) {
                setImportError('Failed to read file. Please try again.');
                setShowImportModal(true);
            }
        };
        reader.readAsText(file);
        
        // Reset input so same file can be selected again
        event.target.value = '';
    };

    const totalWins = history.filter(h => h.profit > 0).length;
    const winRate = history.length > 0 ? Math.round((totalWins / history.length) * 100) : 0;
    const totalPL = history.reduce((acc, h) => acc + h.profit, 0);

    const currentRank = ranks[rankId];
    const tierName = currentRank.name;
    const xpPerRank = 5000;
    const currentRankXP = xp % xpPerRank;

    // Pagination logic
    const reversedHistory = [...history].reverse();
    const totalPages = Math.ceil(reversedHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentHistory = reversedHistory.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    const progress = (currentRankXP / xpPerRank) * 100;

    return (
        <>
            <div className="space-y-6 fade-in">
                <div className="flex items-center gap-2 text-slate-500 hover:text-white cursor-pointer transition-colors w-fit group mb-4" onClick={() => navigate('/')}>
                    <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> <span className="font-semibold text-sm font-mono uppercase">Back to Home</span>
                </div>

                {/* Profile Header */}
                <div className="glass-panel p-8 rounded-xl flex items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="flex flex-col items-center gap-4 z-10">
                        <div className="relative z-10">
                            <div
                                id="profile-tier-icon"
                                className="w-24 h-24 rounded-full bg-slate-800 border-4 border-indigo-400 flex items-center justify-center shadow-xl shadow-indigo-500/40 overflow-hidden"
                            >
                                <img src={`assets/profiles/${profileIcon}`} alt="Profile" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                            </div>
                            <div id="profile-tier-badge" className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full border-2 border-slate-900 shadow-lg animate-pulse">
                                Rank {currentRank.level}
                            </div>
                        </div>
                    </div>

                    <div className="grow">
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                                {username} <span id="profile-tier-name" className="text-sm font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">{tierName.toUpperCase()}</span>
                            </h2>
                            <button onClick={() => setShowEditModal(true)} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors">
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                            <button onClick={() => setIsRanksModalOpen(true)} className="w-12 h-12 hover:scale-110 transition-transform">
                                <img src={`assets/ranks/${currentRank.image}`} alt={currentRank.name} className="w-full h-full object-contain" loading="lazy" decoding="async" />
                            </button>
                            <div className="grow">
                                <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono uppercase">
                                    <span>Progress to Next Rank</span>
                                    <span id="profile-xp-text">{currentRankXP} / {xpPerRank} XP</span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div id="profile-xp-bar" className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-xl border-l-4 border-emerald-500">
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Win Rate</p>
                        <p id="profile-winrate" className="text-3xl font-mono font-bold text-white">{winRate}%</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl border-l-4 border-indigo-500">
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Total Turns</p>
                        <p id="profile-turns" className="text-3xl font-mono font-bold text-white">{history.length}</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl border-l-4 border-yellow-500">
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Net Lifetime P/L</p>
                        <p id="profile-pl" className={`text-3xl font-mono font-bold ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {totalPL >= 0 ? '+' : ''}{formatMoney(totalPL)}
                        </p>
                    </div>
                </div>

                {/* History Table */}
                <div className="glass-panel rounded-xl overflow-hidden mt-8">
                    <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider font-mono flex items-center gap-2">
                            <History className="w-4 h-4" /> Transaction Log
                        </h3>
                        {history.length > 0 && (
                            <span className="text-xs text-slate-500 font-mono">
                                {reversedHistory.length} total transactions
                            </span>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-900 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-3 font-semibold font-mono">Year</th>
                                    <th className="px-6 py-3 font-semibold font-mono">Asset</th>
                                    <th className="px-6 py-3 font-semibold font-mono">Class</th>
                                    <th className="px-6 py-3 font-semibold font-mono">Climate</th>
                                    <th className="px-6 py-3 font-semibold font-mono text-right">Vol</th>
                                    <th className="px-6 py-3 font-semibold font-mono text-right">Buy</th>
                                    <th className="px-6 py-3 font-semibold font-mono text-right">Sell</th>
                                    <th className="px-6 py-3 text-right font-semibold font-mono">P/L</th>
                                </tr>
                            </thead>
                            <tbody id="history-table-body" className="text-slate-300">
                                {history.length === 0 ? (
                                    <tr id="empty-history"><td colSpan="8" className="px-6 py-8 text-center text-slate-600 font-mono text-xs">NO_DATA_FOUND</td></tr>
                                ) : (
                                    currentHistory.map((h, index) => {
                                        const rarityObj = RARITY[h.rarityId?.toUpperCase()] || RARITY.STANDARD;
                                        const climateInfo = CLIMATES[h.climate] || { icon: 'minus', color: 'text-slate-400' };

                                        const ClimateIcon = () => {
                                            switch (climateInfo.icon) {
                                                case 'trending-up': return <TrendingUp className="w-3 h-3" />;
                                                case 'trending-down': return <TrendingDown className="w-3 h-3" />;
                                                case 'minus': return <Minus className="w-3 h-3" />;
                                                case 'activity': return <Activity className="w-3 h-3" />;
                                                default: return <Minus className="w-3 h-3" />;
                                            }
                                        };

                                        const RarityIconComponent = () => {
                                            switch (rarityObj.icon) {
                                                case RARITY.STANDARD.icon: return <Box className="w-3 h-3" />;
                                                case RARITY.EMERGING.icon: return <Zap className="w-3 h-3" />;
                                                case RARITY.DISRUPTIVE.icon: return <Star className="w-3 h-3" />;
                                                case RARITY.UNICORN.icon: return <Crown className="w-3 h-3" />;
                                                default: return <Box className="w-3 h-3" />;
                                            }
                                        };

                                        return (
                                            <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-slate-400">{h.turn}</td>
                                                <td className="px-6 py-4 font-bold text-white">{h.productName}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold border ${rarityObj.bg} ${rarityObj.color} border-opacity-20 flex items-center w-fit gap-1`}>
                                                        <RarityIconComponent /> {h.rarityLabel}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-mono flex items-center gap-1 ${climateInfo.color}`}>
                                                        <ClimateIcon /> {h.climate}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-300 text-right">{h.units}</td>
                                                <td className="px-6 py-4 font-mono text-slate-400 text-right">{formatMoney(h.buyPrice || 0)}</td>
                                                <td className="px-6 py-4 font-mono text-slate-300 text-right">{formatMoney(h.sellPrice || 0)}</td>
                                                <td className={`px-6 py-4 text-right font-mono font-bold ${h.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {h.profit >= 0 ? '+' : ''}{formatMoney(h.profit)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {history.length > itemsPerPage && (
                        <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/30 flex justify-between items-center">
                            <div className="text-xs text-slate-500 font-mono">
                                Showing {startIndex + 1}-{Math.min(endIndex, reversedHistory.length)} of {reversedHistory.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded font-mono text-xs flex items-center gap-1 transition-colors ${currentPage === 1
                                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        }`}
                                >
                                    <ChevronLeft className="w-3 h-3" /> Prev
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                        // Show first page, last page, current page, and pages around current
                                        const showPage =
                                            page === 1 ||
                                            page === totalPages ||
                                            Math.abs(page - currentPage) <= 1;

                                        const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                                        const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                                        if (showEllipsisBefore || showEllipsisAfter) {
                                            return <span key={page} className="text-slate-600 px-2">...</span>;
                                        }

                                        if (!showPage) return null;

                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-8 h-8 rounded font-mono text-xs transition-colors ${currentPage === page
                                                    ? 'bg-indigo-600 text-white font-bold'
                                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded font-mono text-xs flex items-center gap-1 transition-colors ${currentPage === totalPages
                                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        }`}
                                >
                                    Next <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Export/Import Data Section */}
                <div className="glass-panel p-6 rounded-xl border border-indigo-900/30 bg-indigo-950/10">
                    <h3 className="text-lg font-bold text-indigo-400 mb-3 flex items-center gap-2">
                        <Upload className="w-5 h-5" /> Data Management
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                        Export your progress to create a secure backup, or import a previously saved file.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleExportData}
                            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-indigo-900/30 transition-all hover:scale-105 active:scale-95 uppercase text-sm tracking-wide"
                        >
                            <Download className="w-4 h-4" /> Export Data
                        </button>
                        <label className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase text-sm tracking-wide">
                            <Upload className="w-4 h-4" /> Import Data
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImportData}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Reset Data Button */}
                <div className="glass-panel p-6 rounded-xl border border-red-900/30 bg-red-950/10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-red-400 mb-1 flex items-center gap-2">
                                <Trash2 className="w-5 h-5" /> Danger Zone
                            </h3>
                            <p className="text-sm text-slate-400">Permanently delete all progress and start over</p>
                        </div>
                        <button
                            onClick={() => setShowResetModal(true)}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-red-900/30 transition-all hover:scale-105 active:scale-95 uppercase text-sm tracking-wide"
                        >
                            Reset Data
                        </button>
                    </div>
                </div>

            </div>

            <EditProfileModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                currentUsername={username}
                currentIcon={profileIcon}
                onSave={handleSaveProfile}
            />

            <RanksModal
                isOpen={isRanksModalOpen}
                onClose={() => setIsRanksModalOpen(false)}
                currentRankId={rankId}
            />

            {/* Reset Confirmation Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-slate-950/90 z-200 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
                    <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-8 border border-red-700 relative animate-bounce-in">
                        <div className="text-center">
                            <div className="text-6xl mb-4 text-red-500 animate-pulse">
                                ⚠️
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">
                                Reset All Data?
                            </h3>
                            <p className="text-slate-300 mb-4 leading-relaxed text-sm">
                                This action cannot be undone. All your progress, history, and stats will be permanently deleted.
                            </p>
                            <div className="mb-6">
                                <label className="text-xs font-bold text-red-400 uppercase mb-2 block text-left">Type "DELETE" to confirm</label>
                                <input
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                                    placeholder="DELETE"
                                    className="w-full p-3 bg-slate-800 border-2 border-red-900 rounded-lg font-mono text-white text-center focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder-slate-600"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowResetModal(false);
                                        setConfirmText('');
                                    }}
                                    className="flex-1 py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-slate-700 hover:bg-slate-600 hover:scale-105 active:scale-95 uppercase text-sm tracking-wide"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirmText === 'DELETE') {
                                            setShowResetModal(false);
                                            setShowFinalConfirmation(true);
                                        }
                                    }}
                                    disabled={confirmText !== 'DELETE'}
                                    className="flex-1 py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-red-600 hover:bg-red-500 disabled:text-slate-400 disabled:bg-slate-700 disabled:cursor-not-allowed hover:scale-105 active:scale-95 disabled:hover:scale-100 uppercase text-sm tracking-wide"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Final Confirmation Modal */}
            {showFinalConfirmation && (
                <div className="fixed inset-0 bg-slate-950/95 z-200 flex items-center justify-center p-4 backdrop-blur-md fade-in">
                    <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-8 border-2 border-red-600 relative animate-bounce-in">
                        <div className="text-center">
                            <div className="text-7xl mb-4 text-red-600 animate-pulse">
                                🚨
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                Final Confirmation
                            </h3>
                            <p className="text-slate-200 mb-2 leading-relaxed text-base font-semibold">
                                Are you absolutely sure?
                            </p>
                            <p className="text-red-400 mb-6 leading-relaxed text-sm">
                                This will permanently delete all your data. This action cannot be reversed.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowFinalConfirmation(false);
                                        setConfirmText('');
                                    }}
                                    className="flex-1 py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-slate-700 hover:bg-slate-600 hover:scale-105 active:scale-95 uppercase text-sm tracking-wide"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        resetData();
                                        setShowFinalConfirmation(false);
                                        setConfirmText('');
                                        navigate('/');
                                    }}
                                    className="flex-1 py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 uppercase text-sm tracking-wide"
                                >
                                    Delete Everything
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Import Error Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-slate-950/90 z-200 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
                    <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-8 border border-red-700 relative animate-bounce-in">
                        <div className="text-center">
                            <div className="text-6xl mb-4 text-red-500">
                                ❌
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">
                                Import Failed
                            </h3>
                            <p className="text-slate-300 mb-6 leading-relaxed text-sm">
                                {importError}
                            </p>
                            <button
                                onClick={() => {
                                    setShowImportModal(false);
                                    setImportError('');
                                }}
                                className="w-full py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-slate-700 hover:bg-slate-600 hover:scale-105 active:scale-95 uppercase text-sm tracking-wide"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfilePage;
