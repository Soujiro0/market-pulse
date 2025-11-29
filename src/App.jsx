// src/App.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useGame } from './contexts/GameContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingOverlay from './components/ui/LoadingOverlay';
import AlertModal from './components/ui/AlertModal';
import LoanModal from './components/ui/LoanModal';

function App() {
    const { state, closeAlertModal } = useGame();
    const location = useLocation();

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