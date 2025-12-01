import React from 'react';
import { X } from 'lucide-react';

const GenericModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
            <div className="bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-indigo-700 relative">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default GenericModal;
