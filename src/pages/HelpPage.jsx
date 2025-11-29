// src/pages/HelpPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Crosshair, Lightbulb, Award, Layers, BarChart2, Landmark, Box, Zap, Star, Crown, HelpCircle } from 'lucide-react';

const HelpPage = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-5xl mx-auto fade-in bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden my-8 flex flex-col h-[85vh]">
            <div className="bg-slate-950 px-8 py-6 border-b border-slate-800 flex justify-between items-center sticky top-0 z-10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Book className="w-6 h-6 text-indigo-500" /> Operator Manual
                </h2>
                <button onClick={() => navigate('/')} className="text-slate-500 hover:text-white font-bold px-4 py-2 hover:bg-slate-800 rounded transition-colors">&times; CLOSE</button>
            </div>

            <div className="p-8 space-y-12 overflow-y-auto text-slate-300 flex-grow">
                {/* Overview */}
                <section>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Crosshair className="w-5 h-5 text-indigo-400" /> Mission Objectives
                    </h3>
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-sm leading-relaxed">
                        <p className="mb-4"><strong>Primary Goal:</strong> Scale your initial <strong>$10,000</strong> capital into a corporate empire. Climb the <strong>10 Tiers</strong> of the operator ladder.</p>
                        <p className="mb-4"><strong>The Loop:</strong></p>
                        <ul className="space-y-2 list-disc pl-5 marker:text-indigo-500">
                            <li><strong>Analyze:</strong> Review 10 randomized assets each year. Assess price, classification, and hype.</li>
                            <li><strong>Invest:</strong> Commit capital to an asset. Determine your <strong>Horizon</strong> (Duration) and <strong>Volume</strong> (Units).</li>
                            <li><strong>Simulate:</strong> Watch market performance in real-time.</li>
                            <li><strong>Liquidate:</strong> Collect returns (or absorb losses) automatically when the horizon ends.</li>
                        </ul>
                    </div>
                </section>

                {/* Tips & Suggestions */}
                <section>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-400" /> Strategic Advice
                    </h3>
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-sm space-y-4">
                        <p><strong className="text-indigo-400">1. Leverage Debt Wisely:</strong> Taking loans early can boost your buying power for safe, Blue Chip assets. But beware of compound interest—always check the total repayment before signing.</p>
                        <p><strong className="text-indigo-400">2. Match Horizon to Risk:</strong>
                            <br />- <strong>Blue Chip/Growth:</strong> Good for short-term flips (30-60 days).
                            <br />- <strong>Moonshot:</strong> Require long horizons (200+ days) to realize their massive 10x potential, as they are extremely volatile in the short term.
                        </p>
                        <p><strong className="text-indigo-400">3. Climate Awareness:</strong>
                            <br />- In <strong>Expansion</strong>, be aggressive. Most assets drift upwards.
                            <br />- In <strong>Recession</strong>, trade small volumes or sit out years to preserve capital.
                            <br />- <strong>Turbulent</strong> markets create extreme volatility—high risk, high reward.
                        </p>
                    </div>
                </section>

                {/* Leveling System */}
                <section>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-indigo-400" /> Career Progression
                    </h3>
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-sm">
                        <p className="mb-4">Operators gain <strong>XP</strong> for every completed transaction. Profitable trades yield bonus XP. Progress through 10 tiers and 5 ranks per tier.</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-mono text-slate-400 text-center">
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
                        <p className="mt-4 text-xs text-slate-500">*Each Rank requires 1000 XP.</p>
                    </div>
                </section>

                {/* Asset Classification */}
                <section>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-indigo-400" /> Asset Classification
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-slate-700 rounded-lg bg-slate-800/50 flex gap-4">
                            <div className="text-slate-400"><Box className="w-8 h-8" /></div>
                            <div>
                                <span className="text-xs font-bold bg-slate-700 text-slate-300 px-2 py-1 rounded uppercase">Blue Chip</span>
                                <p className="text-xs mt-2 text-slate-400">Low-risk, stable investments. Established blue-chip assets with predictable returns. <br /><strong>Multiplier: 1.0x</strong></p>
                            </div>
                        </div>
                        <div className="p-4 border border-blue-900/50 rounded-lg bg-blue-900/10 flex gap-4">
                            <div className="text-blue-400"><Zap className="w-8 h-8" /></div>
                            <div>
                                <span className="text-xs font-bold bg-blue-900/50 text-blue-300 px-2 py-1 rounded uppercase">Growth</span>
                                <p className="text-xs mt-2 text-slate-400">Balanced risk profile. Emerging growth stocks with potential for solid returns. <br /><strong>Multiplier: 1.5x</strong></p>
                            </div>
                        </div>
                        <div className="p-4 border border-purple-900/50 rounded-lg bg-purple-900/10 flex gap-4">
                            <div className="text-purple-400"><Star className="w-8 h-8" /></div>
                            <div>
                                <span className="text-xs font-bold bg-purple-900/50 text-purple-300 px-2 py-1 rounded uppercase">High-Risk</span>
                                <p className="text-xs mt-2 text-slate-400">High volatility, high reward. Disruptive innovations and speculative ventures. <br /><strong>Multiplier: 3.0x</strong></p>
                            </div>
                        </div>
                        <div className="p-4 border border-yellow-900/50 rounded-lg bg-yellow-900/10 flex gap-4">
                            <div className="text-yellow-400"><Crown className="w-8 h-8" /></div>
                            <div>
                                <span className="text-xs font-bold bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded uppercase">Moonshot</span>
                                <p className="text-xs mt-2 text-slate-400">Extreme risk/reward. Legendary moonshot opportunities with massive upside or total loss. <br /><strong>Multiplier: 10.0x</strong></p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Market Forces */}
                <section>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-indigo-400" /> Market Dynamics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <h4 className="font-bold text-white text-sm mb-2">Market Climate</h4>
                            <p className="text-xs text-slate-500 mb-3">Economic conditions affecting asset performance</p>
                            <ul className="text-xs text-slate-400 space-y-2">
                                <li className="flex justify-between"><span className="text-emerald-400">Expansion</span> <span>Uptrend Bias</span></li>
                                <li className="flex justify-between"><span className="text-slate-400">Stable</span> <span>Normal Volatility</span></li>
                                <li className="flex justify-between"><span className="text-red-400">Recession</span> <span>Downtrend Bias</span></li>
                                <li className="flex justify-between"><span className="text-orange-400">Turbulent</span> <span>Extreme Swings</span></li>
                            </ul>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <h4 className="font-bold text-white text-sm mb-2">Momentum</h4>
                            <p className="text-xs text-slate-400 mb-3">Current market trend for individual assets</p>
                            <ul className="text-xs text-slate-400 space-y-2">
                                <li className="flex justify-between"><span className="text-emerald-400">Upward</span> <span>Price trending up</span></li>
                                <li className="flex justify-between"><span className="text-slate-400">Neutral</span> <span>Stable trend</span></li>
                                <li className="flex justify-between"><span className="text-red-400">Downward</span> <span>Price trending down</span></li>
                            </ul>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <h4 className="font-bold text-white text-sm mb-2">Overdraft</h4>
                            <p className="text-xs text-slate-400">
                                You can execute trades exceeding your cash balance. This creates a <strong>Negative Balance (Debt)</strong>. Use with caution.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Banking */}
                <section>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-indigo-400" /> Loan Bank
                    </h3>
                    <div className="bg-red-950/10 p-6 rounded-xl border border-red-900/30 text-sm space-y-4">
                        <p className="text-slate-300">The Loan Bank provides liquidity when you are insolvent or wish to leverage up. Borrow against future returns.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div className="p-3 bg-red-900/20 rounded border border-red-900/30">
                                <strong className="text-red-400 block mb-1">Credit Limit</strong>
                                $50,000 Max Principal
                            </div>
                            <div className="p-3 bg-red-900/20 rounded border border-red-900/30">
                                <strong className="text-red-400 block mb-1">Lock Period</strong>
                                Cannot repay before Maturity Date.
                            </div>
                            <div className="p-3 bg-red-900/20 rounded border border-red-900/30">
                                <strong className="text-red-400 block mb-1">Liquidation</strong>
                                Defaulting (10 years late) seizes assets.
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQs */}
                <section>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-indigo-400" /> Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                            <h4 className="font-bold text-indigo-400 text-sm mb-2">How do I make money?</h4>
                            <p className="text-xs text-slate-400">Purchase assets from Global Ventures, hold them for your chosen duration (Horizon), and profit when prices increase during simulation. Higher classification assets (High-Risk, Moonshot) offer greater multipliers but with increased volatility.</p>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                            <h4 className="font-bold text-indigo-400 text-sm mb-2">What happens if I go negative?</h4>
                            <p className="text-xs text-slate-400">You can trade while in debt (Overdraft), but you're limited to purchasing 1 unit at a time. Use the Loan Bank to get back to positive liquidity, but remember loans have interest and must be repaid within the agreed timeframe.</p>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                            <h4 className="font-bold text-indigo-400 text-sm mb-2">Can I refresh the market?</h4>
                            <p className="text-xs text-slate-400">Yes! Click the Refresh button in Global Ventures to reroll available assets. The cost starts at 5% of your balance at the start of each year and increases by 1% per additional reroll. Climate remains the same when refreshing.</p>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                            <h4 className="font-bold text-indigo-400 text-sm mb-2">How do I advance to the next year?</h4>
                            <p className="text-xs text-slate-400">Complete a trade by selecting an asset, configuring your order (Horizon and Volume), executing the trade, and watching the simulation. Once finished, you'll automatically advance to the next year with fresh market opportunities.</p>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                            <h4 className="font-bold text-indigo-400 text-sm mb-2">What's the difference between Climate and Momentum?</h4>
                            <p className="text-xs text-slate-400"><strong>Market Climate</strong> affects all assets globally (Expansion, Recession, Stable, Turbulent). <strong>Momentum</strong> is specific to each individual asset showing its current trend (Upward, Neutral, Downward).</p>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                            <h4 className="font-bold text-indigo-400 text-sm mb-2">How do I level up?</h4>
                            <p className="text-xs text-slate-400">Complete trades to earn XP. Profitable trades give bonus XP. Progress through 10 tiers (Intern to Chairman), each with 5 ranks. Check your Profile page to see your current rank and XP progress.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HelpPage;
