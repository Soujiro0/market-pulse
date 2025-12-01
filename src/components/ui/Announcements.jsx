import React, { useState } from 'react';
import allAnnouncements from '@/data/announcements.json';

const Announcements = ({ onAnnouncementClick }) => {
    const [filter, setFilter] = useState('all'); // 'all', 'updates', 'notices'

    const filteredAnnouncements = allAnnouncements.filter(announcement => {
        if (filter === 'all') return true;
        if (filter === 'updates') {
            return announcement.tag === 'Patch Notes' || announcement.tag === 'New Feature';
        }
        if (filter === 'notices') {
            return announcement.tag === 'Notice';
        }
        return false;
    });

    const getFilterButtonClass = (buttonFilter) => {
        return `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            filter === buttonFilter
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`;
    };

    return (
        <div>
            <div className="flex justify-center gap-4 mb-6">
                <button onClick={() => setFilter('all')} className={getFilterButtonClass('all')}>
                    All
                </button>
                <button onClick={() => setFilter('updates')} className={getFilterButtonClass('updates')}>
                    Updates
                </button>
                <button onClick={() => setFilter('notices')} className={getFilterButtonClass('notices')}>
                    Notices
                </button>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                {filteredAnnouncements.length > 0 ? (
                    filteredAnnouncements.map(announcement => (
                        <div 
                            key={announcement.id} 
                            className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors"
                            onClick={() => onAnnouncementClick(announcement)}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-indigo-400">{announcement.title}</h3>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                    announcement.tag === 'Patch Notes' ? 'bg-blue-500/20 text-blue-300' :
                                    announcement.tag === 'New Feature' ? 'bg-green-500/20 text-green-300' :
                                    'bg-yellow-500/20 text-yellow-300'
                                }`}>
                                    {announcement.tag}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 mb-2 truncate">{announcement.content}</p>
                            <p className="text-xs text-slate-500 text-right">{announcement.date}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-400 text-center py-8">No announcements found for this category.</p>
                )}
            </div>
        </div>
    );
};

export default Announcements;
