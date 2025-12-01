import React from 'react';
import { X } from 'lucide-react';

const AnnouncementDetailModal = ({ isOpen, onClose, announcement }) => {
    if (!isOpen || !announcement) return null;

    const getTagColor = (tag) => {
        switch (tag) {
            case 'Patch Notes':
                return 'bg-blue-500/20 text-blue-300';
            case 'New Feature':
                return 'bg-green-500/20 text-green-300';
            case 'Notice':
                return 'bg-yellow-500/20 text-yellow-300';
            default:
                return 'bg-slate-500/20 text-slate-300';
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/90 z-[60] flex items-center justify-center p-4 backdrop-blur-md fade-in">
            <div className="bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6 border border-indigo-600 relative">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{announcement.title}</h3>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getTagColor(announcement.tag)}`}>
                                {announcement.tag}
                            </span>
                            <span className="text-sm text-slate-400">{announcement.date}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {announcement.content}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementDetailModal;
