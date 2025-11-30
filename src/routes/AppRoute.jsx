import { Routes, Route } from 'react-router-dom';
import App from '@/App';
import { HomePage, MarketPage, TradingPage, SimulationPage, ProfilePage, HelpPage } from '@/pages';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<HomePage />} />
                <Route path="market" element={<MarketPage />} />
                <Route path="trading" element={<TradingPage />} />
                <Route path="simulation" element={<SimulationPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="help" element={<HelpPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
