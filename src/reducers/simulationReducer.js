// src/reducers/simulationReducer.js
export const initialSimulationState = {
    speed: 1,
    isPaused: false,
    isFinished: false,
};

export const simulationReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SPEED':
            return { ...state, speed: action.payload };
        case 'TOGGLE_PAUSE':
            return { ...state, isPaused: !state.isPaused };
        case 'FINISH':
            return { ...state, isFinished: true };
        case 'RESET':
            return initialSimulationState;
        default:
            return state;
    }
};
