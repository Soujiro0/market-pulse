import { createContext, useContext } from 'react';
import useGameLogic from '@/hooks/useGameLogic';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
    const game = useGameLogic();
    return (
        <GameContext.Provider value={game}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
