import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useGame } from './contexts/GameContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingOverlay from './components/ui/LoadingOverlay';
import AlertModal from './components/ui/AlertModal';
import LoanModal from './components/ui/LoanModal';

const titleMap = {
    '/': 'Market Pulse - Home',
    '/profile': 'Market Pulse - Profile',
    '/market': 'Market Pulse - Market',
    '/trading': 'Market Pulse - Trading',
    '/simulation': 'Market Pulse - Simulation',
    '/help': 'Market Pulse - Help',
};

function App() {
    const { state, closeAlertModal } = useGame();
    const location = useLocation();

    useEffect(() => {
        const baseTitle = 'Market Pulse';
        const pageTitle = titleMap[location.pathname] || baseTitle;
        document.title = pageTitle;
    }, [location.pathname]);

    const showHeaderAndFooter = location.pathname !== '/simulation';

    return (
        <div className="min-h-screen flex flex-col">
            {showHeaderAndFooter && <Header />}

            <main className="grow p-4 md:p-6 relative">
                <div id="app-container" className="max-w-7xl mx-auto h-full">
                    <Outlet />
                </div>
            </main>

            {showHeaderAndFooter && <Footer />}

            <LoadingOverlay isLoading={state.showLoadingOverlay} />
            <AlertModal 
                isOpen={state.alertModal?.isOpen || false}
                onClose={closeAlertModal}
                title={state.alertModal?.title || ''}
                message={state.alertModal?.message || ''}
                type={state.alertModal?.type || 'info'}
            />
            <LoanModal />
        </div>
    );
}

export default App;