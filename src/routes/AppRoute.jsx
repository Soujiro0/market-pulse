import { Routes, Route } from 'react-router-dom';
import App from '../App';
import { HomePage, MarketPage, TradingPage, SimulationPage, ProfilePage, HelpPage, DatabankPage, PlaytestStatsPage, RedirectPage, NotFoundPage } from '@/pages';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                {/* Main application routes */}
                <Route index element={<HomePage />} />
                <Route path="market" element={<MarketPage />} />
                <Route path="trading" element={<TradingPage />} />
                <Route path="simulation" element={<SimulationPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="databank" element={<DatabankPage />} />
                
                {/* Stats routes */}
                <Route path="stats">
                    <Route path="playtest" element={<PlaytestStatsPage />} />
                </Route>

                {/* Legacy redirect route */}
                <Route path="market-pulse" element={<RedirectPage />} />

                {/* 404 - Catch all unmatched routes */}
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
