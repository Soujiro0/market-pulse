import { useEffect, useState, useRef } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const PlaytestStatsPage = () => {
    const [report, setReport] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const savedData = localStorage.getItem('marketPulseSave_v3');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            const processedReport = processPlaytestData(parsedData);
            setReport(processedReport);
        }
    }, []);

    const processPlaytestData = (data) => {
        const { history, rerollCount, turn } = data;

        // 1. Player spend per turn
        const spendPerTurn = history.reduce((acc, item) => {
            if (item.buyPrice) {
                const investment = item.buyPrice * item.units;
                acc[item.turn] = (acc[item.turn] || 0) + investment;
            }
            return acc;
        }, {});

        // 2. Frequency of picking rarity
        const rarityFrequency = history.reduce((acc, item) => {
            if (item.rarityLabel) {
                acc[item.rarityLabel] = (acc[item.rarityLabel] || 0) + 1;
            }
            return acc;
        }, {});

        // 3. Reroll interaction
        const rerollInteraction = {
            totalRerolls: rerollCount,
            rerollsPerTurn: rerollCount / turn,
        };

        // 4. Frequency of market event
        const marketEventFrequency = history.reduce((acc, item) => {
            if (item.event) {
                acc[item.event] = (acc[item.event] || 0) + 1;
            }
            return acc;
        }, {});

        // 5. Frequency of rarity per tier
        const rarityPerTier = {}; // This is complex, will implement later if possible

        // 6. Loan Bank interaction
        const loanInteraction = history.reduce((acc, item) => {
            if (item.type === 'loan') {
                acc[item.action] = (acc[item.action] || 0) + 1;
            }
            return acc;
        }, { take: 0, pay: 0 });

        // 7. Frequency of won and loss
        const winLoss = history.reduce((acc, item) => {
            if (item.profit > 0) {
                acc.wins++;
            } else if (item.profit < 0) {
                acc.losses++;
            }
            return acc;
        }, { wins: 0, losses: 0 });

        return {
            spendPerTurn,
            rarityFrequency,
            rerollInteraction,
            marketEventFrequency,
            rarityPerTier,
            loanInteraction,
            winLoss,
        };
    };

    const handleExport = () => {
        if (!report) return;
        const jsonString = JSON.stringify(report, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'playtest-report.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedReport = JSON.parse(e.target.result);
                    setReport(importedReport);
                } catch (error) {
                    console.error("Error parsing JSON file:", error);
                    alert("Invalid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    };

    const triggerImport = () => {
        fileInputRef.current.click();
    };

    if (!report) {
        return (
            <div className="p-4 text-white">
                <h1 className="text-2xl font-bold mb-4">Playtest Stats Report</h1>
                <p>No playtest data found in local storage.</p>
                <button onClick={triggerImport} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded">
                    Import Report
                </button>
                <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} className="hidden" />
            </div>
        );
    }

    const spendPerTurnData = {
        labels: Object.keys(report.spendPerTurn),
        datasets: [{
            label: 'Spend per Turn',
            data: Object.values(report.spendPerTurn),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
    };

    const rarityFrequencyData = {
        labels: Object.keys(report.rarityFrequency),
        datasets: [{
            data: Object.values(report.rarityFrequency),
            backgroundColor: ['#94a3b8', '#3b82f6', '#a855f7', '#facc15'],
        }],
    };

    const marketEventFrequencyData = {
        labels: Object.keys(report.marketEventFrequency),
        datasets: [{
            data: Object.values(report.marketEventFrequency),
            backgroundColor: ['#10b981', '#ef4444', '#64748b', '#f97316', '#3b82f6', '#6b21a8'],
        }],
    };
    
    const loanInteractionData = {
        labels: ['Taken', 'Paid'],
        datasets: [{
            data: [report.loanInteraction.take, report.loanInteraction.pay],
            backgroundColor: ['#f97316', '#10b981'],
        }],
    };

    const winLossData = {
        labels: ['Wins', 'Losses'],
        datasets: [{
            data: [report.winLoss.wins, report.winLoss.losses],
            backgroundColor: ['#10b981', '#ef4444'],
        }],
    };

    return (
        <div className="p-4 text-white">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Playtest Stats Report</h1>
                <div className="flex gap-2">
                    <button onClick={triggerImport} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded">
                        Import Report
                    </button>
                    <button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded">
                        Export Report
                    </button>
                    <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} className="hidden" />
                </div>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg mb-4">
                <h2 className="text-xl font-bold mb-2">JSON Report</h2>
                <pre className="text-xs overflow-auto">{JSON.stringify(report, null, 2)}</pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Spend per Turn</h2>
                    <Line data={spendPerTurnData} />
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Rarity Frequency</h2>
                    <Doughnut data={rarityFrequencyData} />
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Market Event Frequency</h2>
                    <Doughnut data={marketEventFrequencyData} />
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Loan Interaction</h2>
                    <Doughnut data={loanInteractionData} />
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Win/Loss Ratio</h2>
                    <Doughnut data={winLossData} />
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Reroll Interaction</h2>
                    <p>Total Rerolls: {report.rerollInteraction.totalRerolls}</p>
                    <p>Rerolls per Turn: {report.rerollInteraction.rerollsPerTurn.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default PlaytestStatsPage;
