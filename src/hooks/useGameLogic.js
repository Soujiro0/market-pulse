import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { RARITY, TIERS, PROFILES } from '@/constants';
import items from '@/data/items.json';
import { formatMoney } from '@/utils';
import { simulationReducer, initialSimulationState } from '@/reducers/simulationReducer';

const useGameLogic = () => {
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem('marketPulseSave_v3');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // Data migration for activeProducts to include image
                if (parsed.activeProducts && parsed.activeProducts.length > 0) {
                    parsed.activeProducts = parsed.activeProducts.map(p => {
                        if (!p.image) {
                            const itemData = items.find(item => item.name === p.name);
                            if (itemData) {
                                return {
                                    ...p,
                                    image: `assets/items/${itemData.image}`
                                };
                            }
                        }
                        return p;
                    });
                }

                // Data migration for profileIcon
                let profileIcon = PROFILES[0].image; // default to just the filename
                if (parsed.profileIcon) {
                    if (parsed.profileIcon.includes('/')) {
                        // It's a path, so strip it to get the filename
                        profileIcon = parsed.profileIcon.split('/').pop();
                    } else {
                        // It's already just a filename
                        profileIcon = parsed.profileIcon;
                    }
                }

                // Ensure all necessary properties exist, provide defaults if missing
                return {
                    balance: parsed.balance || 10000,
                    turn: parsed.turn || 1,
                    marketViewMode: parsed.marketViewMode || 'grid',
                    marketClimate: parsed.marketClimate || 'Stable',
                    activeProducts: parsed.activeProducts || [],
                    currentProduct: parsed.currentProduct || null,
                    investmentAmount: parsed.investmentAmount || 0,
                    units: parsed.units || 0,
                    duration: parsed.duration || 0,
                    history: parsed.history || [],
                    loan: parsed.loan || { active: false, amount: 0, dueTurn: 0, interestRate: 0.05 },
                    chartType: parsed.chartType || 'line',
                    xp: parsed.xp || 0,
                    tierIndex: parsed.tierIndex || 0,
                    rank: parsed.rank || 1,
                    showLoadingOverlay: false,
                    simulationResult: null,
                    showSimulationResultOverlay: false,
                    alertModal: { isOpen: false, title: '', message: '', type: 'info' },
                    rerollCostMultiplier: parsed.rerollCostMultiplier || 5,
                    rerollBasePrice: parsed.rerollBasePrice || 0,
                    rerollCount: parsed.rerollCount || 0,
                    rerollLimit: parsed.rerollLimit !== undefined ? parsed.rerollLimit : 5,
                    profileIcon: profileIcon,
                    username: parsed.username || 'OPERATOR_ID',
                    hasPulledOut: parsed.hasPulledOut || false, // New state for pull out system
                };
            } catch (e) {
                console.error("Save file corrupted, starting new game.", e);
            }
        }
        return {
            balance: 10000,
            turn: 1,
            marketViewMode: 'grid',
            marketClimate: 'Stable',
            activeProducts: [],
            currentProduct: null,
            investmentAmount: 0,
            units: 0,
            duration: 0,
            history: [],
            loan: { active: false, amount: 0, dueTurn: 0, interestRate: 0.05 },
            chartType: 'line',
            xp: 0,
            tierIndex: 0,
            rank: 1,
            showLoadingOverlay: false,
            simulationResult: null, // New state for simulation results
            showSimulationResultOverlay: false, // New state for showing result overlay
            alertModal: { isOpen: false, title: '', message: '', type: 'info' },
            rerollCostMultiplier: 5, // Starting at 5%
            rerollBasePrice: 0, // Base price for rerolls this turn
            rerollCount: 0, // Number of rerolls this turn
            rerollLimit: 5, // Number of rerolls available
            profileIcon: PROFILES[0].image,
            username: 'OPERATOR_ID',
            hasPulledOut: false, // New state for pull out system
        };
    });

    const [simulationState, dispatchSimulation] = useReducer(simulationReducer, initialSimulationState);

    const chartInstanceRef = useRef(null);
    const simTimeoutRef = useRef(null);
    const previousBalanceRef = useRef(state.balance);

    // Toggle Loading Overlay
    const toggleLoadingOverlay = useCallback((show) => {
        setState(prevState => ({ ...prevState, showLoadingOverlay: show }));
    }, []);

    // Update profile icon
    const updateProfileIcon = useCallback((icon) => {
        setState(prevState => ({ ...prevState, profileIcon: icon }));
    }, []);

    const updateUsername = useCallback((name) => {
        setState(prevState => ({ ...prevState, username: name }));
    }, []);

    const addMoney = useCallback((amount) => {
        setState(prevState => ({ ...prevState, balance: prevState.balance + amount }));
    }, []);

    const setBalance = useCallback((amount) => {
        setState(prevState => ({ ...prevState, balance: amount }));
    }, []);

    // Save game state to localStorage
    const saveGame = useCallback(() => {
        localStorage.setItem('marketPulseSave_v3', JSON.stringify(state));
    }, [state]);

    // Reset game data
    const resetData = useCallback(() => {
localStorage.removeItem('marketPulseSave_v3');
            window.location.reload();
    }, []);

    // Leveling Logic
    const addXp = useCallback((amount) => {
        setState(prevState => {
            const newXp = prevState.xp + amount;
            const xpPerRank = 1000;
            const totalRanks = Math.floor(newXp / xpPerRank);

            let newTierIndex = Math.floor(totalRanks / 5);
            let newRank = (totalRanks % 5) + 1;

            if (newTierIndex >= TIERS.length) {
                newTierIndex = TIERS.length - 1;
                newRank = 5;
            }

            return { ...prevState, xp: newXp, tierIndex: newTierIndex, rank: newRank };
        });
    }, []);

    const toggleMarketView = useCallback((mode) => {
        setState(prevState => ({ ...prevState, marketViewMode: mode }));
    }, []);

    // Market Logic
    const randomizeMarket = useCallback(() => {
        const rand = Math.random();
        let climate = 'Stable';
        let momentumBias = 1.0, volatilityMult = 1.0;

        if (rand < 0.25) { climate = 'Expansion'; momentumBias = 1.05; volatilityMult = 0.7; }
        else if (rand < 0.50) { climate = 'Recession'; momentumBias = 0.95; volatilityMult = 1.4; }
        else if (rand < 0.70) { climate = 'Turbulent'; volatilityMult = 2.0; }

        const shuffled = [...items.map((item, i) => ({
            id: `p${i}`, name: item.name, image: `assets/items/${item.image}`,
            basePrice: Math.floor(Math.random() * 500) + 20,
            desc: item.flavorText || "Revolutionary tech."
        }))].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);

        const newActiveProducts = selected.map(tpl => {
            const rRoll = Math.random();
            let rarity = RARITY.STANDARD;
            if (rRoll > 0.95) rarity = RARITY.UNICORN;
            else if (rRoll > 0.85) rarity = RARITY.DISRUPTIVE;
            else if (rRoll > 0.60) rarity = RARITY.EMERGING;

            const priceVariation = 0.8 + (Math.random() * 0.4);
            const currentPrice = tpl.basePrice * rarity.mult * priceVariation;

            let baseVol = 0.2 + Math.random() * 1.3;
            if (rarity.id === 'unicorn') baseVol = 1.0 + (Math.random() * 0.5);
            let finalVol = baseVol * volatilityMult;

            let baseMom = 0.9 + (Math.random() * 0.2);
            if (climate === 'Expansion') baseMom += 0.02;
            if (climate === 'Recession') baseMom -= 0.02;

            return {
                ...tpl, currentPrice, volatility: finalVol, momentum: baseMom, rarity,
                hype: Math.floor(Math.random() * 100)
            };
        });
        setState(prevState => ({ ...prevState, marketClimate: climate, activeProducts: newActiveProducts }));
    }, []);

    // Reroll Market (keeps climate, refreshes products)
    const rerollMarket = useCallback(() => {
        setState(prevState => {
            // Check if reroll limit is reached
            if (prevState.rerollLimit <= 0) {
                return {
                    ...prevState,
                    alertModal: { isOpen: true, title: 'Reroll Limit Reached', message: 'You have reached your reroll limit for this period. The limit will reset in a few turns.', type: 'error' }
                };
            }

            // Check if balance is negative
            if (prevState.balance <= 0) {
                return {
                    ...prevState,
                    alertModal: { isOpen: true, title: 'Insufficient Capital', message: 'Cannot reroll market when your capital is negative or zero.', type: 'error' }
                };
            }

            // Calculate base price if this is the first reroll of the turn
            let basePrice = prevState.rerollBasePrice;
            if (prevState.rerollCount === 0) {
                basePrice = Math.floor(prevState.balance * 0.05); // 5% of current balance
            }

            // Calculate current reroll cost: base price + (1% of current balance * reroll count)
            const incrementCost = Math.floor(prevState.balance * 0.01) * prevState.rerollCount;
            const rerollCost = basePrice + incrementCost;
            
            // Check if can afford
            if (prevState.balance < rerollCost) {
                return {
                    ...prevState,
                    alertModal: { isOpen: true, title: 'Insufficient Funds', message: `Reroll cost is ${formatMoney(rerollCost)}. You need more capital.`, type: 'error' }
                };
            }

            // Use existing climate and momentum/volatility multipliers
            const climate = prevState.marketClimate;
            let momentumBias = 1.0, volatilityMult = 1.0;
            
            if (climate === 'Expansion') { momentumBias = 1.05; volatilityMult = 0.7; }
            else if (climate === 'Recession') { momentumBias = 0.95; volatilityMult = 1.4; }
            else if (climate === 'Turbulent') { volatilityMult = 2.0; }

            const shuffled = [...items.map((item, i) => ({
                id: `p${i}`, name: item.name, image: `assets/items/${item.image}`,
                basePrice: Math.floor(Math.random() * 500) + 20,
                desc: item.flavorText || "Revolutionary tech."
            }))].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 10);

            const newActiveProducts = selected.map(tpl => {
                const rRoll = Math.random();
                let rarity = RARITY.STANDARD;
                if (rRoll > 0.95) rarity = RARITY.UNICORN;
                else if (rRoll > 0.85) rarity = RARITY.DISRUPTIVE;
                else if (rRoll > 0.60) rarity = RARITY.EMERGING;

                const priceVariation = 0.8 + (Math.random() * 0.4);
                const currentPrice = tpl.basePrice * rarity.mult * priceVariation;

                let baseVol = 0.2 + Math.random() * 1.3;
                if (rarity.id === 'unicorn') baseVol = 1.0 + (Math.random() * 0.5);
                let finalVol = baseVol * volatilityMult;

                let baseMom = 0.9 + (Math.random() * 0.2);
                if (climate === 'Expansion') baseMom += 0.02;
                if (climate === 'Recession') baseMom -= 0.02;

                return {
                    ...tpl, currentPrice, volatility: finalVol, momentum: baseMom, rarity,
                    hype: Math.floor(Math.random() * 100)
                };
            });

            return {
                ...prevState,
                balance: prevState.balance - rerollCost,
                activeProducts: newActiveProducts,
                rerollBasePrice: basePrice, // Store the base price for this turn
                rerollCount: prevState.rerollCount + 1, // Increment reroll count
                rerollLimit: prevState.rerollLimit - 1, // Decrement reroll limit
            };
        });
    }, []);

    // Loan Logic
    const toggleLoanModal = useCallback((show) => {
        setState(prevState => ({ ...prevState, showLoanModal: show }));
    }, []);

    const takeLoan = useCallback((amount, term) => {
        if (amount > 0 && amount <= 50000) {
            const premium = Math.floor(term / 5) * 0.01;
            const rate = 0.05 + premium;
            const totalDue = Math.floor(amount * (1 + rate));

            setState(prevState => ({
                ...prevState,
                balance: prevState.balance + amount,
                loan: { active: true, amount: totalDue, dueTurn: prevState.turn + term, interestRate: rate },
                showLoanModal: false,
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                alertModal: { isOpen: true, title: 'Invalid Loan Amount', message: 'The maximum loan amount is $50,000. Please enter a valid amount.', type: 'error' }
            }));
        }
    }, []);

    const payLoan = useCallback(() => {
        setState(prevState => {
            if (prevState.balance >= prevState.loan.amount) {
                return {
                    ...prevState,
                    balance: prevState.balance - prevState.loan.amount,
                    loan: { active: false, amount: 0, dueTurn: 0, interestRate: 0.05 },
                };
            } else {
                return {
                    ...prevState,
                    alertModal: { isOpen: true, title: 'Insufficient Funds', message: 'You do not have enough capital to pay off this loan.', type: 'error' }
                };
            }
        });
    }, []);

    const checkLoanStatus = useCallback(() => {
        setState(prevState => {
            if (!prevState.loan.active) return prevState;

            if (prevState.turn > prevState.loan.dueTurn) {
                const overdueTurns = prevState.turn - prevState.loan.dueTurn;

                if (overdueTurns >= 10) {
                    return {
                        ...prevState,
                        balance: prevState.balance - prevState.loan.amount, // Balance goes negative if insufficient
                        loan: { active: false, amount: 0, dueTurn: 0, interestRate: 0.05 },
                        alertModal: { isOpen: true, title: 'LOAN DEFAULT', message: 'Assets Seized! The bank has liquidated your capital to cover the debt, resulting in a negative balance if insufficient.', type: 'error' }
                    };
                } else {
                    // Late Penalty: Increase debt by 50%
                    const penalty = Math.floor(prevState.loan.amount * 0.50);
                    return {
                        ...prevState,
                        loan: { ...prevState.loan, amount: prevState.loan.amount + penalty },
                    };
                }
            }
            return prevState;
        });
    }, []);

    // Trading Logic
    const setCurrentProduct = useCallback((product) => {
        setState(prevState => ({ ...prevState, currentProduct: product }));
    }, []);

    const setTradeParams = useCallback((units, duration, investmentAmount) => {
        setState(prevState => ({ ...prevState, units, duration, investmentAmount }));
    }, []);

    const executeTrade = useCallback(() => {
        setState(prevState => {
            const newBalance = prevState.balance - prevState.investmentAmount;
            return { ...prevState, balance: newBalance, showSimulationResultOverlay: false };
        });
        dispatchSimulation({ type: 'RESET' });
    }, []);

    // Simulation Logic
    const updateChartType = useCallback((type) => {
        setState(prevState => ({ ...prevState, chartType: type }));
        if (chartInstanceRef.current) {
            chartInstanceRef.current.config.type = type;
            chartInstanceRef.current.update();
        }
    }, []);

    const finishSimulation = useCallback((finalPrice, initialInvestment, units, currentProduct, peakPrice, lowestPrice) => {
        dispatchSimulation({ type: 'FINISH' });
        const finalValue = finalPrice * units;
        const profit = finalValue - initialInvestment;

        setState(prevState => {
            let newBalance = prevState.balance;
            let earnedXp = 50;

            if (!prevState.hasPulledOut) { // Only add profit if not pulled out early
                newBalance += finalValue;
                if (profit > 0) {
                    earnedXp += Math.floor(profit / 100);
                }
            } else {
                // If pulled out, profit was already added (minus fee), so just update XP if any
                if (profit > 0) { // Use original profit for XP calculation
                    earnedXp += Math.floor(profit / 100);
                }
            }

            const newHistory = [...prevState.history, {
                turn: prevState.turn,
                productName: currentProduct.name,
                rarityLabel: currentProduct.rarity.label,
                rarityBg: currentProduct.rarity.bg,
                rarityColor: currentProduct.rarity.color,
                rarityId: currentProduct.rarity.id,
                rarityIcon: currentProduct.rarity.icon,
                profit: profit,
                units: units,
                buyPrice: initialInvestment / units,
                sellPrice: finalPrice,
                climate: prevState.marketClimate
            }];

            const xpPerRank = 1000;
            const totalRanks = Math.floor((prevState.xp + earnedXp) / xpPerRank);

            let newTierIndex = Math.floor(totalRanks / 5);
            let newRank = (totalRanks % 5) + 1;

            if (newTierIndex >= TIERS.length) {
                newTierIndex = TIERS.length - 1;
                newRank = 5;
            }

            return {
                ...prevState,
                balance: newBalance,
                history: newHistory,
                xp: prevState.xp + earnedXp,
                tierIndex: newTierIndex,
                rank: newRank,
                simulationResult: {
                    initialInvestment,
                    finalValue,
                    profit,
                    productName: currentProduct.name,
                    peakPrice,
                    lowestPrice,
                },
                hasPulledOut: false, // Reset for next simulation
            };
        });
    }, []);

    const pullOut = useCallback((currentPrice, initialInvestment, units, currentProduct, peakPrice, lowestPrice) => {
        const finalValue = currentPrice * units;
        let profit = finalValue - initialInvestment;
        let adjustedProfit = profit;

        if (profit > 0) {
            adjustedProfit = profit * 0.75; // 25% fee on profit
        }

        setState(prevState => {
            // Add XP (50 base + 1 per $100 profit) - use original profit for XP
            let earnedXp = 50;
            if (profit > 0) {
                earnedXp += Math.floor(profit / 100);
            }

            const newHistory = [...prevState.history, {
                turn: prevState.turn,
                productName: currentProduct.name,
                rarityLabel: currentProduct.rarity.label,
                rarityBg: currentProduct.rarity.bg,
                rarityColor: currentProduct.rarity.color,
                rarityId: currentProduct.rarity.id,
                rarityIcon: currentProduct.rarity.icon,
                profit: adjustedProfit, // Store adjusted profit in history
                units: units,
                buyPrice: initialInvestment / units,
                sellPrice: currentPrice,
                climate: prevState.marketClimate
            }];

            const xpPerRank = 1000;
            const totalRanks = Math.floor((prevState.xp + earnedXp) / xpPerRank);

            let newTierIndex = Math.floor(totalRanks / 5);
            let newRank = (totalRanks % 5) + 1;

            if (newTierIndex >= TIERS.length) {
                newTierIndex = TIERS.length - 1;
                newRank = 5;
            }

            return {
                ...prevState,
                balance: prevState.balance + adjustedProfit,
                history: newHistory,
                xp: prevState.xp + earnedXp,
                tierIndex: newTierIndex,
                rank: newRank,
                simulationResult: {
                    initialInvestment,
                    finalValue: currentPrice * units, // Final value at pull out
                    profit: adjustedProfit, // Adjusted profit
                    productName: currentProduct.name,
                    peakPrice,
                    lowestPrice,
                },
                hasPulledOut: true,
            };
        });
    }, []);

    const hideResultOverlay = useCallback((show) => {
        setState(prevState => ({ ...prevState, showSimulationResultOverlay: show }));
    }, []);

    const closeAlertModal = useCallback(() => {
        setState(prevState => ({ ...prevState, alertModal: { isOpen: false, title: '', message: '', type: 'info' } }));
    }, []);

    const nextTurn = useCallback(() => {
        setState(prevState => {
            const newTurn = prevState.turn + 1;
            const newRerollLimit = newTurn % 5 === 0 ? 5 : prevState.rerollLimit;

            return {
                ...prevState,
                turn: newTurn,
                rerollCostMultiplier: 5, // Reset multiplier
                rerollBasePrice: 0, // Reset base price
                rerollCount: 0, // Reset reroll count
                rerollLimit: newRerollLimit, // Reset reroll limit every 5 turns
            };
        });
        checkLoanStatus();
        randomizeMarket();
    }, [checkLoanStatus, randomizeMarket]);

    // Initial load and market randomization
    useEffect(() => {
        if (state.activeProducts.length === 0) {
            randomizeMarket();
        }
    }, [state.activeProducts.length, randomizeMarket]);

    // Save game state whenever it changes
    useEffect(() => {
        saveGame();
    }, [state, saveGame]);

    return {
        state,
        simulationState,
        dispatchSimulation,
        formatMoney,
        resetData,
        addXp,
        toggleMarketView,
        randomizeMarket,
        rerollMarket,
        toggleLoanModal,
        takeLoan,
        payLoan,
        checkLoanStatus,
        setCurrentProduct,
        setTradeParams,
        executeTrade,
        updateChartType,
        finishSimulation,
        hideResultOverlay,
        closeAlertModal,
        nextTurn,
        chartInstanceRef,
        simTimeoutRef,
        previousBalanceRef,
        toggleLoadingOverlay,
        updateProfileIcon,
        updateUsername,
        pullOut,
        addMoney,
        setBalance,
    };
};

export default useGameLogic;
