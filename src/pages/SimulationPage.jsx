// src/pages/SimulationPage.jsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { formatMoney } from '../utils';
import { Play, Pause, CheckCircle } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const SimulationPage = () => {
    const {
        state,
        simulationState,
        dispatchSimulation,
        updateChartType,
        finishSimulation,
        hideResultOverlay,
        nextTurn,
        chartInstanceRef,
        simTimeoutRef,
    } = useGame();
    const navigate = useNavigate();

    const { currentProduct, duration, units, investmentAmount, chartType, simulationResult, showSimulationResultOverlay } = state;
    const { speed, isPaused, isFinished } = simulationState;

    const [currentDay, setCurrentDay] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(currentProduct?.currentPrice || 0);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [isSkipping, setIsSkipping] = useState(false);

    const pricesRef = useRef([]);
    const currentDayRef = useRef(0);
    const isSkippingRef = useRef(false);

    // Generate price data for the simulation
    useEffect(() => {
        if (!currentProduct || !duration) {
            navigate('/market');
            return;
        }

        dispatchSimulation({ type: 'RESET' });
        setIsSkipping(false);
        isSkippingRef.current = false;
        currentDayRef.current = 0;

        let prices = [currentProduct.currentPrice];
        let price = currentProduct.currentPrice;
        for (let i = 1; i <= duration; i++) {
            let noise = (Math.random() * 2) - 1;
            let volFactor = currentProduct.volatility * 0.05;
            let bias = (currentProduct.momentum - 1) * 0.05;
            let changePercent = (noise * volFactor) + bias;
            price = price * (1 + changePercent);
            if (price < 0.01) price = 0.01;
            prices.push(price);
        }
        pricesRef.current = prices;
        setCurrentPrice(currentProduct.currentPrice);
        setCurrentDay(0);

        setChartData({
            labels: [],
            datasets: [{
                label: 'Price',
                data: [],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2, pointRadius: 0, fill: true, tension: 0.2
            }, {
                label: 'Entry', data: [], borderColor: '#64748b', borderDash: [5, 5], borderWidth: 1, pointRadius: 0, fill: false
            }]
        });
    }, [currentProduct, duration, navigate, dispatchSimulation]);

    // Simulation loop
    useEffect(() => {
        if (!currentProduct || simulationState.isFinished) return;

        const prices = pricesRef.current;
        const totalDays = prices.length - 1;

        const step = () => {
            // Check if simulation should stop
            if (simulationState.isFinished) return;

            const currentDayIndex = currentDayRef.current;

            // Handle skip - fast-forward to end
            if (isSkippingRef.current) {
                const allLabels = [];
                const allPriceData = [];
                const allEntryData = [];
                
                for (let i = currentDayIndex; i <= totalDays; i++) {
                    allLabels.push(i);
                    allPriceData.push(prices[i]);
                    allEntryData.push(currentProduct.currentPrice);
                }
                
                const finalPrice = prices[totalDays];
                const newBorderColor = finalPrice >= currentProduct.currentPrice ? '#34d399' : '#f87171';
                const newBackgroundColor = finalPrice >= currentProduct.currentPrice ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                
                setChartData(prevChartData => ({
                    labels: [...prevChartData.labels, ...allLabels],
                    datasets: [{
                        ...prevChartData.datasets[0],
                        data: [...prevChartData.datasets[0].data, ...allPriceData],
                        borderColor: newBorderColor,
                        backgroundColor: newBackgroundColor,
                    }, {
                        ...prevChartData.datasets[1],
                        data: [...prevChartData.datasets[1].data, ...allEntryData],
                    }]
                }));
                
                currentDayRef.current = totalDays;
                setCurrentDay(totalDays);
                setCurrentPrice(finalPrice);
                finishSimulation(finalPrice, investmentAmount, units, currentProduct);
                return;
            }

            // Handle pause
            if (simulationState.isPaused) {
                simTimeoutRef.current = setTimeout(step, 100);
                return;
            }

            // Check if simulation is complete
            if (currentDayIndex >= prices.length) {
                finishSimulation(prices[prices.length - 1], investmentAmount, units, currentProduct);
                return;
            }

            // Normal step - update one day
            const price = prices[currentDayIndex];
            setCurrentPrice(price);
            currentDayRef.current = currentDayIndex;
            setCurrentDay(currentDayIndex);

            setChartData(prevChartData => {
                const newLabels = [...prevChartData.labels, currentDayIndex];
                const newPriceData = [...prevChartData.datasets[0].data, price];
                const newEntryData = [...prevChartData.datasets[1].data, currentProduct.currentPrice];

                const newBorderColor = price >= currentProduct.currentPrice ? '#34d399' : '#f87171';
                const newBackgroundColor = price >= currentProduct.currentPrice ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';

                return {
                    labels: newLabels,
                    datasets: [{
                        ...prevChartData.datasets[0],
                        data: newPriceData,
                        borderColor: newBorderColor,
                        backgroundColor: newBackgroundColor,
                    }, {
                        ...prevChartData.datasets[1],
                        data: newEntryData,
                    }]
                };
            });

            // Schedule next step
            currentDayRef.current = currentDayIndex + 1;
            const baseDelay = Math.max(20, Math.min(300, Math.floor(30000 / totalDays)));
            const nextDelay = baseDelay / simulationState.speed;
            simTimeoutRef.current = setTimeout(step, nextDelay);
        };

        // Start the simulation loop
        simTimeoutRef.current = setTimeout(step, 500);

        return () => {
            if (simTimeoutRef.current) {
                clearTimeout(simTimeoutRef.current);
            }
        };
    }, [currentProduct, investmentAmount, units, finishSimulation, simulationState.isFinished, simulationState.isPaused, simulationState.speed, simTimeoutRef]);

    const handleNextTurn = () => {
        nextTurn();
        navigate('/market');
    };

    const handleSkip = useCallback(() => {
        if (!isSkippingRef.current && !simulationState.isFinished) {
            isSkippingRef.current = true;
            setIsSkipping(true);
        }
    }, [simulationState.isFinished]);

    if (!currentProduct) {
        return null; // Should not happen if routed correctly
    }

    const profit = (currentPrice * units) - investmentAmount;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { intersect: false, mode: 'index' },
        scales: {
            x: { grid: { display: false }, ticks: { display: false } },
            y: { beginAtZero: false, grid: { color: '#1e293b' }, ticks: { color: '#64748b' } }
        },
        plugins: { legend: { display: false } }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col fade-in">
            {/* Full Screen HUD */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20 pointer-events-none">
                {/* Left HUD */}
                <div className="bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-lg pointer-events-auto shadow-lg">
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Active Asset</div>
                    <div id="sim-product-name" className="text-xl font-mono text-indigo-400 font-bold">{currentProduct.name}</div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className={`w-2 h-2 rounded-full ${isFinished ? 'bg-slate-600' : 'bg-red-500 animate-pulse'}`}></div>
                        <span className={`text-[10px] font-bold uppercase ${isFinished ? 'text-slate-500' : 'text-red-500'}`}>{isFinished ? 'Offline' : 'Live Feed'}</span>
                    </div>
                </div>

                {/* Right HUD */}
                <div className="bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-lg pointer-events-auto shadow-lg text-right min-w-[200px]">
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Current Valuation</div>
                    <div className={`text-3xl font-mono font-bold ${currentPrice >= currentProduct.currentPrice ? 'text-emerald-400' : 'text-red-400'}`}>{formatMoney(currentPrice)}</div>
                    <div className={`text-lg font-mono font-bold mt-1 ${profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{profit >= 0 ? '+' : ''}{formatMoney(profit)}</div>
                </div>
            </div>

            {/* Chart Area (Full Screen) */}
            <div className="flex-grow w-full h-full relative">
                <div className="chart-container w-full h-full">
                    {chartType === 'line' ? (
                        <Line data={chartData} options={chartOptions} ref={chartInstanceRef} />
                    ) : (
                        <Bar data={chartData} options={chartOptions} ref={chartInstanceRef} />
                    )}
                </div>
            </div>

            {/* Bottom Control Deck */}
            <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                <div className="max-w-4xl mx-auto bg-slate-900/90 backdrop-blur border border-slate-700 rounded-full p-2 flex justify-between items-center shadow-2xl">

                    <div className="flex items-center gap-6 px-6">
                        <div>
                            <span className="block text-[10px] text-slate-500 font-mono uppercase">T-Time</span>
                            <span className="font-mono text-white font-bold text-lg">{currentDay}</span>
                        </div>
                        <div className="hidden sm:block">
                            <select
                                id="chart-type-selector"
                                onChange={(e) => updateChartType(e.target.value)}
                                value={chartType}
                                className="bg-slate-800 border border-slate-700 text-slate-400 text-xs rounded focus:border-indigo-500 block p-1 outline-none font-mono"
                            >
                                <option value="line">LINE</option>
                                <option value="bar">BAR</option>
                            </select>
                        </div>
                    </div>

                    {/* Media Controls */}
                    {!isFinished ? (
                        <div className="flex items-center gap-2" id="sim-controls">
                            <button onClick={() => dispatchSimulation({ type: 'TOGGLE_PAUSE' })} className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 flex items-center justify-center transition-colors">
                                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                            </button>
                            <div className="h-6 w-px bg-slate-700 mx-2"></div>
                            <button onClick={() => dispatchSimulation({ type: 'SET_SPEED', payload: 1 })} className={`px-3 py-1 rounded text-xs font-mono border transition-colors relative ${speed === 1 ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'}`}>
                                {speed === 1 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>}
                                1x
                            </button>
                            <button onClick={() => dispatchSimulation({ type: 'SET_SPEED', payload: 2 })} className={`px-3 py-1 rounded text-xs font-mono border transition-colors relative ${speed === 2 ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'}`}>
                                {speed === 2 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>}
                                2x
                            </button>
                            <button onClick={() => dispatchSimulation({ type: 'SET_SPEED', payload: 4 })} className={`px-3 py-1 rounded text-xs font-mono border transition-colors relative ${speed === 4 ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'}`}>
                                {speed === 4 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>}
                                4x
                            </button>
                            <div className="h-6 w-px bg-slate-700 mx-2"></div>
                            <button onClick={handleSkip} className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono tracking-wider shadow-lg shadow-indigo-500/30 transition-all">{"SKIP >>"}</button>
                        </div>
                    ) : (
                        /* Post-Sim Controls */
                        <div id="post-sim-controls" className="flex items-center gap-4 px-4 w-full justify-end">
                            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider animate-pulse">Simulation Complete</span>
                            <button onClick={() => hideResultOverlay(true)} className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono tracking-wider shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2">
                                FINALIZE <CheckCircle className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Result Overlay */}
            {showSimulationResultOverlay && simulationResult && (
                <div className="fixed inset-0 bg-slate-950/90 z-[200] flex items-center justify-center p-4 fade-in">
                    <div className="max-w-md w-full text-center relative">
                        {/* Glow behind result */}
                        <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="mb-8">
                                <div className="text-8xl mb-4 animate-bounce drop-shadow-2xl">
                                    {simulationResult.profit > 0 ? '💰' : '📉'}
                                </div>
                                <h3 className="text-4xl font-bold mb-2 text-white tracking-tight">
                                    {simulationResult.profit > 0 ? 'Venture Closed' : 'Stop Loss'}
                                </h3>
                                <p className="text-slate-400 text-lg">
                                    {simulationResult.profit > 0 ? 'Capital gains realized.' : 'Asset value depreciated.'}
                                </p>
                            </div>

                            <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-8 mb-8 border border-slate-700 shadow-2xl">
                                <div className="flex justify-between mb-4 border-b border-slate-800 pb-4">
                                    <span className="text-slate-500 text-sm uppercase font-bold tracking-wider">Initial Capital</span>
                                    <span className="font-mono font-bold text-white text-lg">{formatMoney(simulationResult.initialInvestment)}</span>
                                </div>
                                <div className="flex justify-between mb-4 border-b border-slate-800 pb-4">
                                    <span className="text-slate-500 text-sm uppercase font-bold tracking-wider">Exit Valuation</span>
                                    <span className="font-mono font-bold text-white text-lg">{formatMoney(simulationResult.finalValue)}</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="font-bold text-slate-400 text-sm uppercase tracking-wider">Net P/L</span>
                                    <span className={`font-mono font-bold text-2xl ${simulationResult.profit >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                        {simulationResult.profit >= 0 ? '+' : ''}{formatMoney(simulationResult.profit)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => hideResultOverlay(false)} className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-xl border border-slate-700 transition-colors uppercase text-xs">
                                    Review Chart
                                </button>
                                <button onClick={handleNextTurn} className="w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/50 transition-transform hover:-translate-y-1 uppercase text-xs tracking-wide">
                                    Return to Market
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimulationPage;