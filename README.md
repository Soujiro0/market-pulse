# 💼 Market Pulse

**Version**: 0.0.1-build.20251207.1  
**Last Updated**: December 7, 2025

![Market Pulse Logo](public/assets/Market%20Pulse%20Logo.png)

> *"From Intern to Chairman. From $10,000 to Corporate Empire."*

A strategic market simulation game where you climb the corporate ladder by mastering high-stakes trading, navigating volatile markets, and building your fortune one calculated move at a time.

---

## 🎯 Your Mission

Transform your humble **$10,000** starting capital into a corporate empire. Each trade is a decision. Each decision shapes your destiny. Will you play it safe or risk it all for glory?

## 🎮 How to Play

### **📊 Phase 1: Analyze The Market**
- Browse 10 randomized investment opportunities each turn
- Assess **Price**, **Rarity**, **Hype**, and **Market Climate**
- Switch between Grid and List views
- **Reroll** the market (costs increase, 5 max per turn)

### **💰 Phase 2: Make Your Move**
- Select your target asset
- Choose your **Horizon** (30-365 days) — longer = higher risk/reward
- Set your **Volume** — how many units to buy
- Go into **Debt** if you dare (leverage your gains, risk bankruptcy)

### **📈 Phase 3: Watch & React**
- Live price simulation unfolds in real-time
- **Controls**: Pause, Speed Up (1x/2x/4x), Skip
- **Early Exit Option**: Pull out anytime with a 25% fee on profits (losses exit free)

### **💎 Phase 4: Collect Your Rewards**
- Positions auto-close at horizon end
- Gain XP based on performance
- Climb ranks from **Intern** 🎓 to **Chairman** 👑

---

## 🏆 Progression System

| Rank | Title | XP Required | What You Unlock |
|------|-------|-------------|-----------------|
| 0 | 🎓 **Intern** | 0 | Your journey begins |
| 1 | 📊 **Analyst** | 1,000 | Basic market insight |
| 2 | 💼 **Associate** | 2,000 | Enhanced strategies |
| 3 | 🏢 **Manager** | 3,000 | Advanced tools |
| 4 | 🎯 **Director** | 4,000 | Premium features |
| 5 | 💎 **VP** | 5,000 | Executive privileges |
| 6 | 🏆 **SVP** | 6,000 | Elite status |
| 7 | 👑 **Chairman** | 7,000 | Master of markets |

---

## 📦 Asset Classes

| Icon | Tier | Characteristics | Volatility |
|------|------|-----------------|------------|
| 📦 | **Standard** | Safe, stable returns | 1.0x |
| ⚡ | **Emerging** | Growth potential | 1.5x |
| ⭐ | **Disruptive** | High risk, high reward | 3.0x |
| 👑 | **Unicorn** | Extreme volatility (The 1%) | 10.0x |

---

## 🌍 Market Climates

| Climate | Effect | Strategy |
|---------|--------|----------|
| 🌱 **Expansion** | Bull market, lower volatility | Go long, hold positions |
| 📉 **Recession** | Bear market, higher risk | Quick exits, short horizons |
| ⚖️ **Stable** | Balanced conditions | Standard plays |
| 🌪️ **Turbulent** | Extreme swings | High risk/reward |

---

## 🎲 Market Events

Random events shake up the market for 3-10 turns:
- 🚀 **Tech Boom** — Double your profits!
- 💀 **Great Depression** — Double your losses
- 🤖 **AI Revolution** — Triple gains, half losses
- 🦢 **Black Swan** — Chaos reigns

**Pro Tip**: Time your biggest trades during favorable events!

---

## 💰 Loan System

Need capital? Take a **loan** up to $50,000:
- 5% base interest rate
- Premium increases with loan size
- Pay back before due date or face penalties
- Strategic debt can 10x your returns... or ruin you

---

## 💾 Save Your Progress

### **Export Data**
- Backup your empire to encrypted `.json` file
- Protected with AES encryption (no cheating!)
- Download with timestamp for version tracking

### **Import Data**
- Restore previous saves
- Play across multiple devices
- Auto-validates and decrypts safely

**Warning**: Tampered files won't import. Play fair!

---

## 🎯 Pro Tips

✅ **Risk Management**: Never let debt exceed 25% of expected gains  
✅ **Event Timing**: Save big plays for favorable market events  
✅ **Climate Rotation**: Adapt strategy to market conditions  
✅ **Diversification**: Don't go all-in on one asset  
✅ **Backup Often**: Export your data before risky moves  

---

## 📚 Full Documentation

Need more details? Check out the comprehensive guides:
- 📊 [Data Structure Documentation](documentation/DATA_STRUCTURE.md)
- 📖 [Complete Game Documentation](documentation/GAME_DOCUMENTATION.md)
- 🎨 [Prototype HTML](documentation/market_pulse.html)

---

## 🚀 Ready to Play?

Your journey from Intern to Chairman starts now. Will you build an empire or go bankrupt trying?

**The market waits for no one. Make your move.** 💼📈

---

<br>

# 👨‍💻 Developer Section

## Tech Stack

- **Frontend**: React 18.3.1
- **Build Tool**: Vite (Rolldown) 7.2.5
- **Styling**: Tailwind CSS 4.1.17
- **Charts**: Chart.js 4.5.1 with React-ChartJS-2 5.3.1
- **Icons**: Lucide React 0.555.0
- **Routing**: React Router DOM 6.30.2
- **Encryption**: crypto-js (AES encryption for save files)

## Project Structure

```
market-pulse/
├── src/
│   ├── components/         # UI components (modals, cards, layouts)
│   ├── contexts/          # React Context (GameContext)
│   ├── hooks/             # Custom hooks (useGameLogic, useGame)
│   ├── pages/             # Route pages
│   ├── utils/             # Utilities (playerData, formatMoney)
│   ├── data/              # JSON data (items, ranks, profiles)
│   ├── constants/         # Game constants
│   └── reducers/          # State reducers
├── public/assets/         # Game assets (items, profiles, ranks)
└── documentation/         # Game documentation
```

## Setup & Development

### Installation

```bash
# Clone the repository
git clone https://github.com/Soujiro0/market-pulse

# Navigate to project
cd market-pulse

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## State Management

- **Context API**: `GameContext` provides global game state
- **Custom Hook**: `useGameLogic` manages all game logic and persistence
- **LocalStorage**: Dual-key structure (`marketPulseSave_player_v4`, `marketPulseSave_gameState_v4`)
- **Auto-Save**: State persists on every change

## Key Features Implementation

### Export/Import System
- **Location**: `/src/utils/playerData.js`
- **Encryption**: AES via crypto-js
- **Functions**: `exportPlayerData()`, `importPlayerData()`

### Market Simulation
- **Algorithm**: Geometric Brownian Motion
- **Factors**: Volatility, momentum, climate, rarity, hype
- **Events**: Multipliers applied to profit/loss

### Progression System
- **XP Formula**: `50 + Math.max(0, Math.floor(profit / 100))`
- **Ranks**: 8 tiers (Intern to Chairman)
- **Threshold**: 1,000 XP per rank

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Version History

**v0.0.1-build.20251207.1** (Current)
- ✅ Encrypted export/import system
- ✅ AES save file protection
- ✅ Profile page data management
- ✅ Enhanced error handling

**v0.0.1-build.20251203.4**
- ✅ Market events system
- ✅ Reroll functionality
- ✅ Loan system enhancements
- ✅ Profile customization

## License

This project is for educational and portfolio purposes.

---

**Made with 💼 by Soujiro**  
*For support or questions, visit the [repository](https://github.com/Soujiro0/market-pulse)*