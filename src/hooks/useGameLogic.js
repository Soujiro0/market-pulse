import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { MARKET_EVENTS, RARITY, PROFILES } from '@/constants';
import items from '@/data/items.json';
import ranks from '@/data/ranks.json';
import { formatMoney } from '@/utils';
import { simulationReducer, initialSimulationState } from '@/reducers/simulationReducer';
import { exportPlayerData, importPlayerData } from '@/utils/playerData';

const useGameLogic = () => {
    // Helper function to load player data
    const loadPlayerData = () => {
        const saved = localStorage.getItem('marketPulseSave_player_v4');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Player save file corrupted.", e);
            }
        }
        return null;
    };

    // Helper function to load game state data
    const loadGameStateData = () => {
        const saved = localStorage.getItem('marketPulseSave_gameState_v4');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Game state save file corrupted.", e);
            }
        }
        return null;
    };

    // Migration from old save format (v3)
    const migrateFromV3 = () => {
        const oldSave = localStorage.getItem('marketPulseSave_v3');
        if (oldSave) {
            try {
                const parsed = JSON.parse(oldSave);
                
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
                let profileIcon = PROFILES[0].image;
                if (parsed.profileIcon) {
                    if (parsed.profileIcon.includes('/')) {
                        profileIcon = parsed.profileIcon.split('/').pop();
                    } else {
                        profileIcon = parsed.profileIcon;
                    }
                }

                const playerData = {
                    balance: parsed.balance || 10000,
                    xp: parsed.xp || 0,
                    rankId: parsed.rankId || 0,
                    profileIcon: profileIcon,
                    username: parsed.username || 'OPERATOR_ID',
                    history: parsed.history || [],
                    loan: parsed.loan || { active: false, amount: 0, dueTurn: 0, interestRate: 0.05 },
                    seenItems: parsed.seenItems || [] // Migrate seenItems if exists
                };

                const gameStateData = {
                    turn: parsed.turn || 1,
                    marketViewMode: parsed.marketViewMode || 'grid',
                    marketClimate: parsed.marketClimate || 'Stable',
                    activeProducts: parsed.activeProducts || [],
                    currentProduct: parsed.currentProduct || null,
                    investmentAmount: parsed.investmentAmount || 0,
                    units: parsed.units || 0,
                    duration: parsed.duration || 0,
                    chartType: parsed.chartType || 'line',
                    rerollCostMultiplier: parsed.rerollCostMultiplier || 5,
                    rerollBasePrice: parsed.rerollBasePrice || 0,
                    rerollCount: parsed.rerollCount || 0,
                    rerollLimit: parsed.rerollLimit !== undefined ? parsed.rerollLimit : 5,
                    hasPulledOut: parsed.hasPulledOut || false,
                    marketEvent: parsed.marketEvent || null,
                    eventTurnsLeft: parsed.eventTurnsLeft || 0
                };

                localStorage.setItem('marketPulseSave_player_v4', JSON.stringify(playerData));
                localStorage.setItem('marketPulseSave_gameState_v4', JSON.stringify(gameStateData));
                localStorage.removeItem('marketPulseSave_v3');

                return { playerData, gameStateData };
            } catch (e) {
                console.error("Migration from v3 failed.", e);
            }
        }
        return null;
    };

    const [state, setState] = useState(() => {
        // Try migration first
        const migrated = migrateFromV3();
        let playerData, gameStateData;

        if (migrated) {
            playerData = migrated.playerData;
            gameStateData = migrated.gameStateData;
        } else {
            playerData = loadPlayerData();
            gameStateData = loadGameStateData();
        }

        // Default player data
        const defaultPlayerData = {
            balance: 10000,
            xp: 0,
            rankId: 0,
            profileIcon: PROFILES[0].image,
            username: 'OPERATOR_ID',
            history: [],
            loan: { active: false, amount: 0, dueTurn: 0, interestRate: 0.05 },
            seenItems: [] // Track items that have appeared in market
        };

        // Default game state data
        const defaultGameStateData = {
            turn: 1,
            marketViewMode: 'grid',
            marketClimate: 'Stable',
            activeProducts: [],
            currentProduct: null,
            investmentAmount: 0,
            units: 0,
            duration: 0,
            chartType: 'line',
            rerollCostMultiplier: 5,
            rerollBasePrice: 0,
            rerollCount: 0,
            rerollLimit: 5,
            hasPulledOut: false,
            marketEvent: null,
            eventTurnsLeft: 0
        };

        return {
            ...defaultPlayerData,
            ...defaultGameStateData,
            ...(playerData || {}),
            ...(gameStateData || {})
        };
    });

    const [simulationState, dispatchSimulation] = useReducer(simulationReducer, initialSimulationState);

    const chartInstanceRef = useRef(null);
    const simTimeoutRef = useRef(null);
    const previousBalanceRef = useRef(state.balance);

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

    const addItemToSeen = useCallback((itemName) => {
        setState(prevState => {
            const currentSeenItems = prevState.seenItems || [];
            if (!currentSeenItems.includes(itemName)) {
                return { ...prevState, seenItems: [...currentSeenItems, itemName] };
            }
            return prevState;
        });
    }, []);

    // Save game state to localStorage (split into player and game state)
    const saveGame = useCallback(() => {
        const playerData = {
            balance: state.balance,
            xp: state.xp,
            rankId: state.rankId,
            profileIcon: state.profileIcon,
            username: state.username,
            history: state.history,
            loan: state.loan,
            seenItems: state.seenItems
        };

        const gameStateData = {
            turn: state.turn,
            marketViewMode: state.marketViewMode,
            marketClimate: state.marketClimate,
            activeProducts: state.activeProducts,
            currentProduct: state.currentProduct,
            investmentAmount: state.investmentAmount,
            units: state.units,
            duration: state.duration,
            chartType: state.chartType,
            rerollCostMultiplier: state.rerollCostMultiplier,
            rerollBasePrice: state.rerollBasePrice,
            rerollCount: state.rerollCount,
            rerollLimit: state.rerollLimit,
            hasPulledOut: state.hasPulledOut,
            marketEvent: state.marketEvent,
            eventTurnsLeft: state.eventTurnsLeft
        };

        localStorage.setItem('marketPulseSave_player_v4', JSON.stringify(playerData));
        localStorage.setItem('marketPulseSave_gameState_v4', JSON.stringify(gameStateData));
    }, [state]);

    // Export player data as encrypted file
    const exportData = useCallback(() => {
        const playerData = {
            balance: state.balance,
            xp: state.xp,
            rankId: state.rankId,
            profileIcon: state.profileIcon,
            username: state.username,
            history: state.history,
            loan: state.loan,
            seenItems: state.seenItems
        };

        const gameStateData = {
            turn: state.turn,
            marketViewMode: state.marketViewMode,
            marketClimate: state.marketClimate,
            activeProducts: state.activeProducts,
            currentProduct: state.currentProduct,
            investmentAmount: state.investmentAmount,
            units: state.units,
            duration: state.duration,
            chartType: state.chartType,
            rerollCostMultiplier: state.rerollCostMultiplier,
            rerollBasePrice: state.rerollBasePrice,
            rerollCount: state.rerollCount,
            rerollLimit: state.rerollLimit,
            hasPulledOut: state.hasPulledOut,
            marketEvent: state.marketEvent,
            eventTurnsLeft: state.eventTurnsLeft
        };

        return exportPlayerData(playerData, gameStateData);
    }, [state]);

    // Import player data from encrypted file
    const importData = useCallback((encryptedData) => {
        const result = importPlayerData(encryptedData);
        
        if (result.success) {
            // Merge imported data with current state
            setState(prevState => ({
                ...prevState,
                ...result.data.player,
                ...result.data.gameState
            }));
        }
        
        return result;
    }, []);

    // Reset game data
    const resetData = useCallback(() => {
        localStorage.removeItem('marketPulseSave_player_v4');
        localStorage.removeItem('marketPulseSave_gameState_v4');
        localStorage.removeItem('marketPulseSave_v3'); // Also remove old format if exists
        window.location.reload();
    }, []);

    // Leveling Logic
    const addXp = useCallback((amount) => {
        setState(prevState => {
            const newXp = prevState.xp + amount;
            const xpPerRank = 1000;
            let newRankId = Math.floor(newXp / xpPerRank);

            if (newRankId >= ranks.length) {
                newRankId = ranks.length - 1;
            }

            return { ...prevState, xp: newXp, rankId: newRankId };
        });
    }, []);

    const toggleMarketView = useCallback((mode) => {
        setState(prevState => ({ ...prevState, marketViewMode: mode }));
    }, []);

    // Market Logic
    const randomizeMarket = useCallback(() => {
        setState(prevState => {
            let climate = prevState.marketEvent ? prevState.marketEvent.climate : 'Stable';
            let momentumBias = 1.0, volatilityMult = 1.0;

            if (!prevState.marketEvent) {
                const rand = Math.random();
                if (rand < 0.25) { climate = 'Expansion'; }
                else if (rand < 0.50) { climate = 'Recession'; }
                else if (rand < 0.70) { climate = 'Turbulent'; }
            }

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

            return { ...prevState, marketClimate: climate, activeProducts: newActiveProducts };
        });
    }, []);

    // Reroll Market (keeps climate, refreshes products) - Returns error message if failed
    const rerollMarket = useCallback(() => {
        // Check if reroll limit is reached
        if (state.rerollLimit <= 0) {
            return { error: 'Reroll Limit Reached', message: 'You have reached your reroll limit for this period. The limit will reset in a few turns.' };
        }

        // Check if balance is negative
        if (state.balance <= 0) {
            return { error: 'Insufficient Capital', message: 'Cannot reroll market when your capital is negative or zero.' };
        }

        // Calculate base price if this is the first reroll of the turn
        let basePrice = state.rerollBasePrice;
        if (state.rerollCount === 0) {
            basePrice = Math.floor(state.balance * 0.05); // 5% of current balance
        }

        // Calculate current reroll cost: base price + (1% of current balance * reroll count)
        const incrementCost = Math.floor(state.balance * 0.01) * state.rerollCount;
        const rerollCost = basePrice + incrementCost;
        
        // Check if can afford
        if (state.balance < rerollCost) {
            return { error: 'Insufficient Funds', message: `Reroll cost is ${formatMoney(rerollCost)}. You need more capital.` };
        }

        setState(prevState => {
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

            // Get the base price and cost from state before update
            const basePrice = prevState.rerollBasePrice || Math.floor(prevState.balance * 0.05);
            const incrementCost = Math.floor(prevState.balance * 0.01) * prevState.rerollCount;
            const rerollCost = basePrice + incrementCost;

            return {
                ...prevState,
                balance: prevState.balance - rerollCost,
                activeProducts: newActiveProducts,
                rerollBasePrice: basePrice, // Store the base price for this turn
                rerollCount: prevState.rerollCount + 1, // Increment reroll count
                rerollLimit: prevState.rerollLimit - 1, // Decrement reroll limit
            };
        });
        
        return { success: true };
    }, [state.rerollLimit, state.balance, state.rerollBasePrice, state.rerollCount]);

    // Loan Logic - Returns success/error
    const takeLoan = useCallback((amount, term) => {
        if (amount > 0 && amount <= 50000) {
            const premium = Math.floor(term / 5) * 0.01;
            const rate = 0.05 + premium;
            const totalDue = Math.floor(amount * (1 + rate));

            setState(prevState => ({
                ...prevState,
                balance: prevState.balance + amount,
                loan: { active: true, amount: totalDue, dueTurn: prevState.turn + term, interestRate: rate },
                history: [...prevState.history, { type: 'loan', action: 'take', amount, turn: prevState.turn }],
            }));
            return { success: true };
        }
        else {
            return { error: 'Invalid Loan Amount', message: 'The maximum loan amount is $50,000. Please enter a valid amount.' };
        }
    }, []);

    const payLoan = useCallback(() => {
        setState(prevState => {
            if (prevState.balance >= prevState.loan.amount) {
                return {
                    ...prevState,
                    balance: prevState.balance - prevState.loan.amount,
                    loan: { active: false, amount: 0, dueTurn: 0, interestRate: 0.05 },
                    history: [...prevState.history, { type: 'loan', action: 'pay', amount: prevState.loan.amount, turn: prevState.turn }],
                };
            } else {
                return prevState; // Don't change state if insufficient funds
            }
        });
        
        // Return result
        if (state.balance >= state.loan.amount) {
            return { success: true };
        } else {
            return { error: 'Insufficient Funds', message: 'You do not have enough capital to pay off this loan.' };
        }
    }, [state.balance, state.loan.amount]);

    const checkLoanStatus = useCallback(() => {
        let hasDefaulted = false;
        
        setState(prevState => {
            if (!prevState.loan.active) return prevState;

            if (prevState.turn > prevState.loan.dueTurn) {
                const overdueTurns = prevState.turn - prevState.loan.dueTurn;

                if (overdueTurns >= 10) {
                    hasDefaulted = true;
                    return {
                        ...prevState,
                        balance: prevState.balance - prevState.loan.amount, // Balance goes negative if insufficient
                        loan: { active: false, amount: 0, dueTurn: 0, interestRate: 0.05 },
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
        
        return hasDefaulted ? { defaulted: true } : { defaulted: false };
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
            
            // Track item as seen when player actually buys it
            const currentSeenItems = prevState.seenItems || [];
            const productName = prevState.currentProduct?.name;
            const updatedSeenItems = productName && !currentSeenItems.includes(productName)
                ? [...currentSeenItems, productName]
                : currentSeenItems;
            
            return { 
                ...prevState, 
                balance: newBalance, 
                showSimulationResultOverlay: false,
                seenItems: updatedSeenItems
            };
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
        console.log('finishSimulation called with:', { finalPrice, initialInvestment, units, currentProduct, peakPrice, lowestPrice });
        dispatchSimulation({ type: 'FINISH' });
        
        // Calculate profit with event multipliers using current state
        let profit = (finalPrice * units) - initialInvestment;
        
        // Apply event multipliers from current state
        if (state.marketEvent) {
            if (profit > 0 && state.marketEvent.profitMultiplier) {
                profit *= state.marketEvent.profitMultiplier;
            } else if (profit < 0 && state.marketEvent.lossMultiplier) {
                profit *= state.marketEvent.lossMultiplier;
            }
        }

        const finalValue = initialInvestment + profit;
        
        // Build result object BEFORE setState
        const simulationResult = {
            initialInvestment,
            finalValue,
            profit,
            productName: currentProduct.name,
            peakPrice,
            lowestPrice,
        };
        
        console.log('Built simulationResult (before setState):', simulationResult);
        
        // Now update state
        setState(prevState => {
            let newBalance = prevState.balance;
            let earnedXp = 50;

            if (!prevState.hasPulledOut) {
                newBalance += (initialInvestment + profit);
                if (profit > 0) {
                    earnedXp += Math.floor(profit / 100);
                }
            } else {
                if (profit > 0) {
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
                climate: prevState.marketClimate,
                event: prevState.marketEvent ? prevState.marketEvent.name : null
            }];

            const xpPerRank = 1000;
            const newXp = prevState.xp + earnedXp;
            let newRankId = Math.floor(newXp / xpPerRank);

            if (newRankId >= ranks.length) {
                newRankId = ranks.length - 1;
            }

            return {
                ...prevState,
                balance: newBalance,
                history: newHistory,
                xp: newXp,
                rankId: newRankId,
                hasPulledOut: false,
            };
        });
        
        console.log('Returning simulationResult:', simulationResult);
        return simulationResult;
    }, [state.marketEvent]);

    const pullOut = useCallback((currentPrice, initialInvestment, units, currentProduct, peakPrice, lowestPrice) => {
        const finalValue = currentPrice * units;
        let profit = finalValue - initialInvestment;
        let adjustedProfit = profit;

        if (profit > 0) {
            adjustedProfit = profit * 0.75; // 25% fee on profit
        }

        // Build result object BEFORE setState
        const simulationResult = {
            initialInvestment,
            finalValue: currentPrice * units, // Final value at pull out
            profit: adjustedProfit, // Adjusted profit
            productName: currentProduct.name,
            peakPrice,
            lowestPrice,
        };

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
            const newXp = prevState.xp + earnedXp;
            let newRankId = Math.floor(newXp / xpPerRank);

            if (newRankId >= ranks.length) {
                newRankId = ranks.length - 1;
            }

            return {
                ...prevState,
                balance: prevState.balance + adjustedProfit,
                history: newHistory,
                xp: newXp,
                rankId: newRankId,
                hasPulledOut: true,
            };
        });

        return simulationResult;
    }, []);

    const nextTurn = useCallback(() => {
        setState(prevState => {
            const newTurn = prevState.turn + 1;
            let newRerollLimit = prevState.rerollLimit;
            if (newTurn % 5 === 0) {
                newRerollLimit = 5;
            }

            let currentEvent = prevState.marketEvent;
            let turnsLeft = prevState.eventTurnsLeft;

            // Decrease event timer
            if (turnsLeft > 0) {
                turnsLeft--;
            }

            // If event ends, clear it
            if (prevState.marketEvent && turnsLeft === 0) {
                currentEvent = null;
            }

            // Every 5 turns, check for a new event, but not if one just finished
            if (newTurn % 5 === 0 && !currentEvent) {
                const rand = Math.random();
                const eventKeys = Object.keys(MARKET_EVENTS);
                let chosenEventKey;

                if (rand < 0.05) { // 5% chance for Golden Age
                    chosenEventKey = 'GOLDEN_AGE';
                } else {
                    const commonEvents = eventKeys.filter(k => MARKET_EVENTS[k].rarity === 'common');
                    const uncommonEvents = eventKeys.filter(k => MARKET_EVENTS[k].rarity === 'uncommon');
                    
                    const regularRand = Math.random();
                    if (regularRand < 0.8) { // 80% chance for a common event
                        chosenEventKey = commonEvents[Math.floor(Math.random() * commonEvents.length)];
                    } else { // 20% chance for an uncommon event
                        chosenEventKey = uncommonEvents[Math.floor(Math.random() * uncommonEvents.length)];
                    }
                }
                
                currentEvent = MARKET_EVENTS[chosenEventKey];
                turnsLeft = currentEvent.duration;
            }

            return {
                ...prevState,
                turn: newTurn,
                rerollCostMultiplier: 5,
                rerollBasePrice: 0,
                rerollCount: 0,
                rerollLimit: newRerollLimit,
                marketEvent: currentEvent,
                eventTurnsLeft: turnsLeft,
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
        takeLoan,
        payLoan,
        checkLoanStatus,
        setCurrentProduct,
        setTradeParams,
        executeTrade,
        updateChartType,
        finishSimulation,
        nextTurn,
        chartInstanceRef,
        simTimeoutRef,
        previousBalanceRef,
        updateProfileIcon,
        updateUsername,
        pullOut,
        addMoney,
        setBalance,
        exportData,
        importData,
        addItemToSeen,
    };
};

export default useGameLogic;
