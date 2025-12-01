import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const TerminalModal = ({ isOpen, onClose, onCommand }) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState([]);
    const outputRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleCommandSubmit = (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const newOutput = [...output, `$ ${input}`];
        setOutput(newOutput);
        onCommand(input, (response) => {
            setOutput(prev => [...prev, ...response.split('\n')]);
        });
        setInput('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 z-[999] flex items-center justify-center p-4 backdrop-blur-sm fade-in">
            <div className="bg-slate-900 rounded-xl shadow-2xl max-w-3xl w-full h-3/4 flex flex-col border border-indigo-700 relative">
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h3 className="text-xl font-bold text-white font-mono">DEV CONSOLE</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div ref={outputRef} className="flex-grow p-4 font-mono text-sm text-slate-300 overflow-y-auto custom-scrollbar">
                    {output.map((line, index) => (
                        <div key={index} className={line.startsWith('$') ? 'text-indigo-400' : ''}>{line}</div>
                    ))}
                </div>
                <form onSubmit={handleCommandSubmit} className="p-4 border-t border-slate-700">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg font-mono text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        placeholder="Type cheat code..."
                    />
                </form>
            </div>
        </div>
    );
};

export default TerminalModal;
