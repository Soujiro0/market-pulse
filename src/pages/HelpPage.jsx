import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Book, Crosshair, Lightbulb, Award, Layers, BarChart2, Landmark, Box, Zap, Star, Crown, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const HelpPage = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const pageContentRef = useRef(null);

    const pages = [
        // Page 1: Mission Objectives
        <section key="mission-objectives">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-indigo-400" /> Mission Objectives
            </h3>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-base leading-relaxed">
                <p className="mb-4"><strong>Primary Goal:</strong> Scale your initial <strong>$10,000</strong> capital into a corporate empire by identifying high-potential assets, executing timed trades, and climbing the corporate ladder from "Intern" to "Chairman."</p>
                <p className="mb-4"><strong>The Loop:</strong></p>
                <ul className="space-y-2 list-disc pl-5 marker:text-indigo-500">
                    <li><strong>Analyze (The Feed):</strong> Review 10 randomized Global Ventures (assets) generated each turn. Assess value based on Price, Rarity Tier, Hype (Demand), and the global Market Climate.</li>
                    <li><strong>Commit (The Desk):</strong> Select an asset to enter the Trading Desk. Set your <strong>Horizon</strong> (how long to hold the asset, 30-365 days) and <strong>Volume</strong> (how many units to buy). You can purchase more units than your cash allows, pushing your balance into negative (Debt).</li>
                    <li><strong>Simulate (Live Feed):</strong> Watch the price action unfold on a live chart. You can choose to exit a trade early, but a 25% fee will be applied to any profits.</li>
                    <li><strong>Liquidate:</strong> Positions close automatically at the end of the Horizon. Profit/Loss is realized immediately. XP is awarded based on trade performance.</li>
                </ul>
            </div>
        </section>,

        // Page 2: Strategic Advice
        <section key="strategic-advice">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" /> Strategic Advice
            </h3>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-base space-y-4">
                <p><strong className="text-indigo-400">1. Leverage Debt Wisely:</strong> Taking loans early can boost your buying power for safe, Standard tier assets. But beware of compound interest—always check the total repayment before signing.</p>
                <p><strong className="text-indigo-400">2. Match Horizon to Rarity:</strong>
                    <br />- <strong>Standard/Emerging:</strong> Good for short-term flips (30-60 days).
                    <br />- <strong>Unicorns:</strong> Require long horizons (200+ days) to realize their massive 10x potential, as they are extremely volatile in the short term.
                </p>
                <p><strong className="text-indigo-400">3. Climate Awareness:</strong>
                    <br />- In an <strong>Expansion</strong> market, be aggressive. Most assets drift upwards.
                    <br />- In a <strong>Recession</strong> market, trade small volumes or sit out turns to preserve capital.
                    <br />- <strong>Turbulent</strong> markets create extreme volatility—high risk, high reward.
                </p>
            </div>
        </section>,

        // Page 3: Career Progression
        <section key="career-progression">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" /> Career Progression
            </h3>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-base">
                <p className="mb-4">Operators gain <strong>XP</strong> for every completed transaction. Profitable trades yield bonus XP. Progress through 10 tiers and 5 ranks per tier.</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm font-mono text-slate-400 text-center">
                    <span className="bg-slate-900 p-2 rounded border border-slate-800">1. Intern</span>
                    <span className="bg-slate-900 p-2 rounded border border-slate-800">2. Analyst</span>
                    <span className="bg-slate-900 p-2 rounded border border-slate-800">3. Associate</span>
                    <span className="bg-slate-900 p-2 rounded border border-slate-800">4. Trader</span>
                    <span className="bg-slate-900 p-2 rounded border border-slate-800">5. Broker</span>
                    <span className="bg-slate-900 p-2 rounded border border-slate-800">6. Manager</span>
                    <span className="bg-slate-900 p-2 rounded border border-slate-800">7. Director</span>
                    <span className="bg-slate-900 p-2 rounded border border-slate-800">8. VP</span>
                    <span className="bg-slate-900 p-2 rounded border border-slate-800">9. Executive</span>
                    <span className="bg-slate-900 p-2 rounded border border-slate-800 text-yellow-500 font-bold">10. Chairman</span>
                </div>
                <p className="mt-4 text-sm text-slate-500">*Each Rank requires 1000 XP.</p>
            </div>
        </section>,

        // Page 4: Asset Classification
        <section key="asset-classification">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" /> Asset Classification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-700 rounded-lg bg-slate-800/50 flex gap-4">
                    <div className="text-slate-400"><Box className="w-8 h-8" /></div>
                    <div>
                        <span className="text-sm font-bold bg-slate-700 text-slate-300 px-2 py-1 rounded uppercase">Standard</span>
                        <p className="text-sm mt-2 text-slate-400">Low volatility, stable, safe. <br /><strong>Multiplier: 1.0x</strong></p>
                    </div>
                </div>
                <div className="p-4 border border-blue-900/50 rounded-lg bg-blue-900/10 flex gap-4">
                    <div className="text-blue-400"><Zap className="w-8 h-8" /></div>
                    <div>
                        <span className="text-sm font-bold bg-blue-900/50 text-blue-300 px-2 py-1 rounded uppercase">Emerging</span>
                        <p className="text-sm mt-2 text-slate-400">Growth potential, moderate risk. <br /><strong>Multiplier: 1.5x</strong></p>
                    </div>
                </div>
                <div className="p-4 border border-purple-900/50 rounded-lg bg-purple-900/10 flex gap-4">
                    <div className="text-purple-400"><Star className="w-8 h-8" /></div>
                    <div>
                        <span className="text-sm font-bold bg-purple-900/50 text-purple-300 px-2 py-1 rounded uppercase">Disruptive</span>
                        <p className="text-sm mt-2 text-slate-400">High volatility, market movers. <br /><strong>Multiplier: 3.0x</strong></p>
                    </div>
                </div>
                <div className="p-4 border border-yellow-900/50 rounded-lg bg-yellow-900/10 flex gap-4">
                    <div className="text-yellow-400"><Crown className="w-8 h-8" /></div>
                    <div>
                        <span className="text-sm font-bold bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded uppercase">Unicorn</span>
                        <p className="text-sm mt-2 text-slate-400">Extreme risk/reward. The "1%". <br /><strong>Multiplier: 10.0x</strong></p>
                    </div>
                </div>
            </div>
        </section>,

        // Page 5: Market Dynamics
        <section key="market-dynamics">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-400" /> Market Dynamics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white text-base mb-2">Market Climate</h4>
                    <p className="text-sm text-slate-500 mb-3">Global conditions that affect all assets for the current turn.</p>
                    <ul className="text-sm text-slate-400 space-y-2">
                        <li className="flex justify-between"><span className="text-emerald-400">Expansion</span> <span>Lower volatility, positive momentum bias</span></li>
                        <li className="flex justify-between"><span className="text-slate-400">Stable</span> <span>Balanced market conditions</span></li>
                        <li className="flex justify-between"><span className="text-red-400">Recession</span> <span>Higher volatility, negative momentum bias</span></li>
                        <li className="flex justify-between"><span className="text-orange-400">Turbulent</span> <span>Extreme price swings in both directions</span></li>
                    </ul>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white text-base mb-2">Momentum</h4>
                    <p className="text-sm text-slate-400 mb-3">Current market trend for individual assets</p>
                    <ul className="text-sm text-slate-400 space-y-2">
                        <li className="flex justify-between"><span className="text-emerald-400">Upward</span> <span>Price trending up</span></li>
                        <li className="flex justify-between"><span className="text-slate-400">Neutral</span> <span>Stable trend</span></li>
                        <li className="flex justify-between"><span className="text-red-400">Downward</span> <span>Price trending down</span></li>
                    </ul>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white text-base mb-2">Overdraft</h4>
                    <p className="text-sm text-slate-400">
                        You can purchase more units than your cash allows, pushing your balance into negative (Debt). This leverages potential gains but increases bankruptcy risk.
                    </p>
                </div>
            </div>
        </section>,

        // Page 6: Loan Bank
        <section key="loan-bank">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-indigo-400" /> Loan Bank
            </h3>
            <div className="bg-red-950/10 p-6 rounded-xl border border-red-900/30 text-base space-y-4">
                <p className="text-slate-300">The Loan Bank provides liquidity when you are insolvent or wish to leverage capital for massive trades.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-red-900/20 rounded border border-red-900/30">
                        <strong className="text-red-400 block mb-1">Credit Limit</strong>
                        $50,000 Maximum Principal
                    </div>
                    <div className="p-3 bg-red-900/20 rounded border border-red-900/30">
                        <strong className="text-red-400 block mb-1">Interest Structure</strong>
                        Base Rate: 5% fixed. +1% for every 5 turns of loan duration.
                    </div>
                    <div className="p-3 bg-red-900/20 rounded border border-red-900/30">
                        <strong className="text-red-400 block mb-1">Lock-in & Default</strong>
                        Cannot repay before maturity. Defaulting (10 turns late) seizes assets.
                    </div>
                </div>
            </div>
        </section>,

        // Page 7: FAQs (Part 1)
        <section key="faqs-part1">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" /> Frequently Asked Questions (1/2)
            </h3>
            <div className="space-y-4">
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-indigo-400 text-base mb-2">How do I make money?</h4>
                    <p className="text-sm text-slate-400">Purchase assets from Global Ventures, hold them for your chosen duration (Horizon), and profit when prices increase during simulation. Higher classification assets (Disruptive, Unicorn) offer greater multipliers but with increased volatility.</p>
                </div>
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-indigo-400 text-base mb-2">What happens if I go negative?</h4>
                    <p className="text-sm text-slate-400">You can trade while in debt (Overdraft), but you're limited to purchasing 1 unit at a time. Use the Loan Bank to get back to positive liquidity, but remember loans have interest and must be repaid within the agreed timeframe.</p>
                </div>
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-indigo-400 text-base mb-2">Can I refresh the market?</h4>
                    <p className="text-sm text-slate-400">Yes! Click the Refresh button in Global Ventures to reroll available assets. The cost starts at 5% of your balance at the start of each turn and increases by 1% per additional reroll. Climate remains the same when refreshing.</p>
                </div>
            </div>
        </section>,

        // Page 8: FAQs (Part 2)
        <section key="faqs-part2">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" /> Frequently Asked Questions (2/2)
            </h3>
            <div className="space-y-4">
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-indigo-400 text-base mb-2">How do I advance to the next turn?</h4>
                    <p className="text-sm text-slate-400">Complete a trade by selecting an asset, configuring your order (Horizon and Volume), executing the trade, and watching the simulation. Once finished, you'll automatically advance to the next turn with fresh market opportunities.</p>
                </div>
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-indigo-400 text-base mb-2">What's the difference between Climate and Momentum?</h4>
                    <p className="text-sm text-slate-400"><strong>Market Climate</strong> affects all assets globally (Expansion, Recession, Stable, Turbulent). <strong>Momentum</strong> is specific to each individual asset showing its current trend (Upward, Neutral, Downward).</p>
                </div>
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-indigo-400 text-base mb-2">How do I level up?</h4>
                    <p className="text-sm text-slate-400">Complete trades to earn XP. Profitable trades give bonus XP. Progress through 10 tiers (Intern to Chairman), each with 5 ranks. Check your Profile page to see your current rank and XP progress.</p>
                </div>
            </div>
        </section>,
    ];

    const totalPages = pages.length;

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
            if (pageContentRef.current) {
                pageContentRef.current.scrollTop = 0; // Scroll to top of new page
            }
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
            if (pageContentRef.current) {
                pageContentRef.current.scrollTop = 0; // Scroll to top of new page
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto fade-in bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden my-8 flex flex-col h-[85vh]">
            <div className="bg-slate-950 px-8 py-6 border-b border-slate-800 flex justify-between items-center sticky top-0 z-10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Book className="w-6 h-6 text-indigo-500" /> Operator Manual
                </h2>
                <button onClick={() => navigate('/')} className="text-slate-500 hover:text-white font-bold px-4 py-2 hover:bg-slate-800 rounded transition-colors">&times; CLOSE</button>
            </div>

            <div className="relative flex-grow flex flex-col">
                <div ref={pageContentRef} className="p-8 text-slate-300 flex-grow overflow-y-auto custom-scrollbar">
                    <div key={currentPage} className="transition-opacity duration-500 ease-in-out opacity-100">
                        {pages[currentPage]}
                    </div>
                </div>

                <div className="flex justify-between items-center p-4 border-t border-slate-800 bg-slate-950 sticky bottom-0">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" /> Previous
                    </button>
                    <span className="text-slate-400 text-sm">Page {currentPage + 1} of {totalPages}</span>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages - 1}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
