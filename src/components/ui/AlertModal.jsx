// src/components/ui/AlertModal.jsx
import React from 'react';

const AlertModal = ({ isOpen, onClose, title, message, type = 'info' }) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'error':
                return '⚠️';
            case 'warning':
                return '⚡';
            case 'success':
                return '✓';
            default:
                return 'ℹ️';
        }
    };

    const getColors = () => {
        switch (type) {
            case 'error':
                return {
                    border: 'border-red-700',
                    icon: 'text-red-500',
                    button: 'bg-red-600 hover:bg-red-500 shadow-red-900/50'
                };
            case 'warning':
                return {
                    border: 'border-yellow-700',
                    icon: 'text-yellow-500',
                    button: 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-900/50'
                };
            case 'success':
                return {
                    border: 'border-emerald-700',
                    icon: 'text-emerald-500',
                    button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/50'
                };
            default:
                return {
                    border: 'border-indigo-700',
                    icon: 'text-indigo-500',
                    button: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/50'
                };
        }
    };

    const colors = getColors();

    return (
        <div className="fixed inset-0 bg-slate-950/80 z-100 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
            <div className={`bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 border ${colors.border} relative`}>
                <div className="text-center">
                    <div className={`text-6xl mb-4 ${colors.icon}`}>
                        {getIcon()}
                    </div>
                    {title && (
                        <h3 className="text-xl font-bold text-white mb-3">
                            {title}
                        </h3>
                    )}
                    <p className="text-slate-300 mb-6 leading-relaxed">
                        {message}
                    </p>
                    <button
                        onClick={onClose}
                        className={`w-full py-3 rounded-lg text-white font-bold transition-all shadow-lg ${colors.button} uppercase text-sm tracking-wide`}
                    >
                        Acknowledge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
