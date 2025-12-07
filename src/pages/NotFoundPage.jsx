import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 flex items-center justify-center fade-in bg-slate-900">
            <div className="flex flex-col items-center text-center max-w-lg relative">
                    <div className="mb-6">
                        <h1 className="text-9xl font-bold text-white mb-2 font-mono">404</h1>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                        Page Not Found
                    </h2>
                    <p className="text-slate-400 text-lg mb-8">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-500/50 hover:scale-105"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </button>
                </div>
        </div>
    );
};

export default NotFoundPage;
