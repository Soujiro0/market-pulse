import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useGame } from './contexts/GameContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingOverlay from './components/ui/LoadingOverlay';
import AlertModal from './components/ui/AlertModal';
import LoanModal from './components/ui/LoanModal';
import TerminalModal from './components/ui/TerminalModal';

const titleMap = {
    '/': 'Market Pulse - Home',
    '/profile': 'Market Pulse - Profile',
    '/market': 'Market Pulse - Market',
    '/trading': 'Market Pulse - Trading',
    '/simulation': 'Market Pulse - Simulation',
    '/help': 'Market Pulse - Help',
};

function App() {
    const { state, closeAlertModal, addXp, resetData, randomizeMarket, setState } = useGame();
    const location = useLocation();
    const [showTerminal, setShowTerminal] = useState(false);

    useEffect(() => {
        const baseTitle = 'Market Pulse';
        const pageTitle = titleMap[location.pathname] || baseTitle;
        document.title = pageTitle;
    }, [location.pathname]);

    const toggleTerminal = useCallback((event) => {
        if (event.ctrlKey && event.key === '`') {
            event.preventDefault();
            setShowTerminal(prev => !prev);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', toggleTerminal);
        return () => {
            window.removeEventListener('keydown', toggleTerminal);
        };
    }, [toggleTerminal]);

    const handleTerminalCommand = useCallback((command, respond) => {
        const [cmd, ...args] = command.split(' ');
        let response = '';

        switch (cmd) {
            case 'help':
                response = `Available commands:
- help: Show this help message.
- add_money <amount>: Add or subtract money from your balance (use negative for subtraction).
- add_xp <amount>: Add experience points.
- reset_game: Reset all game data.
- randomize_market: Randomize the market immediately.
- set_balance <amount>: Set your balance to a specific amount.`;
                break;
            case 'add_money':
                const moneyToAdd = parseInt(args[0]);
                if (!isNaN(moneyToAdd)) {
                    let newBalance;
                    setState(prevState => {
                        newBalance = prevState.balance + moneyToAdd;
                        return { ...prevState, balance: newBalance };
                    });
                    response = `Added ${formatMoney(moneyToAdd)}. New balance: ${formatMoney(newBalance)}`;
                } else {
                    response = 'Usage: add_money <amount>';
                }
                break;
            case 'add_xp':
                const xpToAdd = parseInt(args[0]);
                if (!isNaN(xpToAdd)) {
                    addXp(xpToAdd);
                    const expectedNewXp = state.xp + xpToAdd; // Calculate expected new XP
                    response = `Added ${xpToAdd} XP. New XP: ${expectedNewXp}`;
                } else {
                    response = 'Usage: add_xp <amount>';
                }
                break;
            case 'reset_game':
                resetData();
                response = 'Game data reset. Reloading...';
                break;
            case 'randomize_market':
                randomizeMarket();
                response = 'Market randomized.';
                break;
            case 'set_balance':
                const newBalance = parseInt(args[0]);
                if (!isNaN(newBalance)) {
                    setState(prevState => ({ ...prevState, balance: newBalance }));
                    response = `Balance set to: ${formatMoney(newBalance)}`;
                } else {
                    response = 'Usage: set_balance <amount>';
                }
                break;
            default:
                response = `Unknown command: ${command}. Type 'help' for a list of commands.`;
        }
        respond(response);
    }, [addXp, resetData, randomizeMarket, setState, state.balance, state.xp]);

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
            <TerminalModal isOpen={showTerminal} onClose={() => setShowTerminal(false)} onCommand={handleTerminalCommand} />

        <img src="" alt="" />
        </div>
    );
}

export default App;