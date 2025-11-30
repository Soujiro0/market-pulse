import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <div id="header-logo-icon" className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-500 transition-colors">
                        <Activity className="w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">Market<span className="text-indigo-500">Pulse</span></h1>
                </div>
            </div>
        </header>
    );
};

export default Header;
