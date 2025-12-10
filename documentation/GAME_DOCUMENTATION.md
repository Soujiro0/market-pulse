# Market Pulse: Comprehensive Documentation

**Version**: 0.0.1-build.20251211.1
**Platform**: Web (Single Page Application)
**Genre**: Strategic Business Simulation
**Last Updated**: December 11, 2025

---

## Section 1: Player's Guide (User Manual)

### 1.1 Introduction

Market Pulse is a high-stakes financial strategy game where players assume the role of an aspiring market operator. Your goal is to scale a starting capital of $10,000 into a corporate empire by identifying high-potential assets, executing timed trades, and climbing the corporate ladder from "Intern" to "Chairman."

### 1.2 Core Gameplay Loop

The game operates on a turn-based system with a real-time simulation phase.

#### **Analyze (The Feed)**
* Review 10 randomized Global Ventures (assets) generated each turn
* Assess value based on Price, Rarity Tier, Hype (Demand), and the global Market Climate
* Toggle between Grid View and List View for different data perspectives
* **New:** Use the Reroll feature to refresh the market (costs increase with turn number, 5 rerolls max per turn)

#### **Commit (The Desk)**
* Select an asset to enter the Trading Desk
* **Set Horizon**: Choose how long to hold the asset (30-365 days). Longer holds offer higher risk/reward
* **Set Volume**: Choose how many units to buy
* **Overdraft Strategy**: You can purchase more units than your cash allows, pushing your balance into negative (Debt). This leverages potential gains but increases bankruptcy risk

#### **Simulate (Live Feed)**
* Watch the price action unfold on a live chart
* **Controls**: Pause, Speed Up (1x, 2x, 4x), or Skip to the end
* **Early Exit**: You can choose to exit a trade early
  - **Fee Structure**: 25% fee applies ONLY to profits (not losses)
  - If trading at a loss, you can exit without penalty
  - Formula: `adjustedProfit = Math.max(0, profit * 0.75)`

#### **Liquidate**
* Positions close automatically at the end of the Horizon
* Profit/Loss is realized immediately
* XP is awarded based on trade performance
* **XP Formula**: `50 + Math.max(0, Math.floor(profit / 100))`

---

### 1.3 Game Elements

#### **Resources**
* **Liquidity**: Your cash on hand. Can be negative (triggers loan warnings)
* **XP (Experience)**: Gained by trading. Unlocks new Ranks
* **Turn**: Advances by 1 after every completed trade

#### **Asset Classes (Rarity)**
Every asset belongs to a specific tier that dictates its volatility and potential return.

| Icon | Tier Name | Rarity ID | Characteristics | Volatility Multiplier |
|------|-----------|-----------|-----------------|----------------------|
| 📦 | Standard | `standard` | Low volatility, stable, safe | 1.0x |
| ⚡ | Emerging | `emerging` | Growth potential, moderate risk | 1.5x |
| ⭐ | Disruptive | `disruptive` | High volatility, market movers | 3.0x |
| 👑 | Unicorn | `unicorn` | Extreme risk/reward. The "1%" | 10.0x |

**Rarity Drop Rates:**
- Standard: 60%
- Emerging: 25%
- Disruptive: 12%
- Unicorn: 3%

#### **Market Climates**
Global conditions that affect all assets for the current turn.

| Climate | Effect | Volatility | Momentum Bias |
|---------|--------|------------|---------------|
| 🌱 **Expansion** | Bull market conditions | Lower | Positive (+5% to +15%) |
| 📉 **Recession** | Bear market conditions | Higher | Negative (-10% to -5%) |
| ⚖️ **Stable** | Balanced market | Normal | Neutral (-2% to +2%) |
| 🌪️ **Turbulent** | Extreme swings | Extreme | Chaotic (-15% to +15%) |

**Climate Probabilities:**
- Stable: 40%
- Expansion: 25%
- Recession: 25%
- Turbulent: 10%

---

### 1.4 Market Events System

**New in v0.0.1:** Random market events can occur that dramatically affect trading outcomes.

#### **Event Structure**
- **Duration**: Events last 3-10 turns
- **Effects**: Modify profit/loss multipliers
- **Visibility**: Active event displayed in UI with countdown
- **Persistence**: Events continue even if you switch products

#### **Event Rarity Tiers**

| Rarity | Drop Rate | Typical Effects |
|--------|-----------|-----------------|
| Common | 60% | Modest multipliers (0.8x-1.2x) |
| Uncommon | 25% | Moderate multipliers (0.5x-1.5x) |
| Rare | 12% | Strong multipliers (0.3x-2x) |
| Legendary | 3% | Extreme multipliers (0.1x-5x) |

#### **Example Events**

**Great Depression** (Uncommon, Recession)
- Duration: 10 turns
- Profit Multiplier: 1x
- Loss Multiplier: 2x
- Effect: Losses are doubled, gains remain normal

**Tech Boom** (Rare, Expansion)
- Duration: 8 turns
- Profit Multiplier: 2x
- Loss Multiplier: 1x
- Effect: Gains are doubled, losses remain normal

**AI Revolution** (Legendary, Expansion)
- Duration: 5 turns
- Profit Multiplier: 3x
- Loss Multiplier: 0.5x
- Effect: Triple gains, halved losses

**Black Swan Event** (Legendary, Turbulent)
- Duration: 3 turns
- Profit Multiplier: 0.5x
- Loss Multiplier: 3x
- Effect: Extreme downside risk

---

### 1.5 Loan & Debt System

#### **Going Negative**
- You can spend more than your balance (overdraft)
- Automatic loan is triggered when balance < $0
- Warning modal appears on first negative balance

#### **Loan Terms**
- **Base Interest Rate**: 5% per turn
- **Premium Tiers**:
  - Small Loan (<$10k): No premium (5% total)
  - Medium Loan ($10k-$50k): +2% premium (7% total)
  - Large Loan (>$50k): +4% premium (9% total)
- **Repayment Period**: 20 turns grace period
- **Compounding**: Interest compounds every turn

#### **Loan Mechanics**
```javascript
// Interest calculation
const premium = loanAmount > 50000 ? 0.04 : 
                loanAmount > 10000 ? 0.02 : 0;
const totalRate = 0.05 + premium;
newLoanAmount = loanAmount * (1 + totalRate);
```

#### **Consequences**
- **Turn 20**: Final warning
- **Turn 21+**: Game Over (Liquidation)
- All assets seized, game resets

#### **Loan Management**
- **Take Loan**: Request additional capital (if loan not active)
- **Pay Loan**: Repay partial or full amount
- **Strategic Use**: Leverage loans to multiply gains during favorable events

---

### 1.6 Reroll Market Feature

#### **Functionality**
- Refresh the 10 available products without completing a trade
- Useful when no attractive opportunities are present
- Does not advance turn counter

#### **Cost Structure**
```javascript
// Dynamic pricing based on turn progression
const baseCost = 50 + (turn * 10);
const totalCost = baseCost * rerollCostMultiplier;
```

**Example Costs:**
- Turn 1: $60 (50 + 1*10)
- Turn 10: $150 (50 + 10*10)
- Turn 50: $550 (50 + 50*10)

#### **Limitations**
- Maximum 5 rerolls per turn
- Counter resets after completing a trade
- Cannot reroll if balance too low

---

### 1.7 Rank Progression System

Climb the corporate ladder by earning XP through successful trades. Each rank requires **5000 XP** to advance.

**Rank Structure:** 10 tiers (Intern to Chairman), each with 5 levels (50 total ranks)

| Rank ID | Title | XP Required | Icon | Unlocks |
|---------|-------|-------------|------|---------|
| 0 | Intern | 0 | 🎓 | Base gameplay |
| 1 | Analyst | 100 | 📊 | Basic analytics |
| 2 | Associate | 300 | 💼 | Enhanced market view |
| 3 | Manager | 600 | 🏢 | Advanced strategies |
| 4 | Director | 1000 | 🎯 | Premium features |
| 5 | VP | 1500 | 💎 | Executive tools |
| 6 | SVP | 2100 | 🏆 | Elite status |
| 7 | Chairman | 3000 | 👑 | Master tier |

---

### 1.8 Profile Page & Data Management

The Profile page provides comprehensive statistics, history tracking, and data management tools.

#### **Statistics Overview**
- **Win Rate**: Percentage of profitable trades
- **Total Turns**: Number of completed transactions
- **Net Lifetime P/L**: Total profit/loss across all trades
- **Rank Progress**: Visual XP bar showing progress to next rank

#### **Transaction History**
View detailed logs of all completed trades with pagination:
- Year (Turn number)
- Asset name
- Asset class (rarity tier)
- Market climate
- Volume (units traded)
- Buy/Sell prices
- Profit/Loss

#### **Profile Customization**
- Edit username
- Choose from 8 avatar icons
- Changes saved automatically

#### **Data Management (Export/Import)**

**Export Player Data**
- Creates an encrypted backup of your complete game progress
- Includes all player stats, transaction history, and game state
- Data is encrypted using AES encryption to prevent tampering
- Downloaded as `.json` file with timestamp
- Use case: Backup before major updates, share progress, or play across devices

**Import Player Data**
- Restore previously exported save files
- Automatic validation and decryption
- Version compatibility checking
- Error handling for corrupted or tampered files
- Page auto-refreshes after successful import

**Security Features:**
- All exported data is AES-encrypted with a secret key
- Prevents manual editing of save files
- Import fails if data has been modified or corrupted
- Clear error messages for troubleshooting

**Common Import Errors:**
- "Invalid save file" - File is corrupted or tampered with
- "Invalid save file format" - Missing required data fields
- "Incompatible version" - Save from different game version
- "File content corrupted" - File cannot be read properly

#### **Danger Zone (Reset Data)**
- Permanently deletes all game progress
- Two-step confirmation required
- Must type "DELETE" to confirm
- Cannot be undone

---

### 1.9 Collection System

The Collection system allows players to purchase and collect items as premium assets, separate from regular trading.

#### **Databank**
- Encyclopedia of all items in the game
- Items are locked until encountered in Global Ventures
- Items unlock only when purchased/traded in the main market
- Locked items display as "?" with hidden images
- Unlocked items show full details and images

#### **Collection Market**
A premium marketplace where players can purchase collectibles with varying rarities.

**Market Features:**
- **10 Random Items**: 10 collectibles available per refresh cycle
- **Auto-Refresh**: Market refreshes every 5 minutes
- **Rarity-Based Pricing**: Higher rarity = higher cost (50% premium)
- **Multiple Purchases**: Can buy the same item multiple times
- **Purchase Protection**: Each item can only be bought once per refresh
  - "Purchased" button prevents spam buying
  - "Buy Another" option if item already owned
  - Counter resets on market refresh
  - Shows owned count badge

**Rarity Distribution:**
- Standard (65%): $10M - $30M
- Emerging (30%): $3.5M - $7.5M
- Disruptive (4%): $10M - $25M
- Unicorn (1%): $30M - $50M

#### **My Collection**
View and manage all purchased collectibles with advanced filtering and selection tools.

**Collection Stats:**
- Total Items: Number of collectibles owned
- Purchase Value: Total amount spent
- Current Value: 65% of purchase price (sell value)

**Interface Features:**
- **Rarity Filter**: Dropdown to filter by rarity tier
  - Options: All, Standard, Emerging, Disruptive, Unicorn
  - Shows count for each category
  - Resets to page 1 on filter change
- **Pagination**: 8 items per page
  - Previous/Next navigation buttons
  - Direct page number selection
  - Maintains filter across pages
- **Multi-Selection**: Select multiple items for bulk operations
  - Click cards to toggle selection (cyan ring indicator)
  - "Select All" button - selects all items in current filtered view
  - "Deselect All" button - clears all selections
  - Bulk sell button shows total earnings for selected items

**Collectible Properties:**
- Item Name and Image
- Rarity (Standard, Emerging, Disruptive, Unicorn)
- Level (starts at 1, increases through merging)
- Purchase Price
- Acquired Turn
- Rarity-based card colors and effects

**Visual Effects by Rarity:**
- **Standard**: Blue accents, no shine effect
- **Emerging**: Indigo accents, no shine effect
- **Disruptive**: Purple accents, **shine effect on hover**
- **Unicorn**: Yellow/gold accents, **shine effect on hover**

**Selling Collectibles:**
- **Single Sell**: Click individual item's sell button
  - Sell for 65% of purchase price
  - Confirmation modal shows loss calculation
- **Multi-Sell**: Select multiple items and use bulk sell button
  - Shows total earnings for all selected items
  - Processes all sales at once
  - Displays combined result in success modal
- Instant liquidity
- Cannot be undone

#### **Merge System** ✨

Combine multiple copies of the same item to upgrade its rarity.

**Merge Requirements:**
| From Rarity | Items Needed | Result | Value Bonus |
|-------------|--------------|--------|-------------|
| Standard | 3 copies | 1 Emerging | +20% |
| Emerging | 3 copies | 1 Disruptive | +20% |
| Disruptive | 5 copies | 1 Unicorn | +20% |
| Unicorn | - | Cannot merge | - |

**Merge Rules:**
- All items must be the same item name
- All items must be the same rarity
- All items must be the same level
- Merged item receives +20% value bonus (formula: totalPrice × 1.2)
- Level increases by 1 after merge

**Merge Interface:**
- **Drag and Drop**: Interactive crafting system using @dnd-kit
  - Draggable items from available list
  - Droppable slots for crafting (3 or 5 slots depending on rarity)
  - Visual feedback during drag operations
  - Remove items from slots by clicking X button
- **Visual Slots**: See exactly what you're merging
  - Shows item images and prices
  - Highlights when dragging over
  - Slot counter shows progress (e.g., "2/3")
  - Total price displayed below slots
- **Result Preview**: Shows the upgraded item before confirming
  - Full card with upgraded rarity styling
  - New value calculation with +20% bonus
  - Sell value preview (65% of new value)
  - Item flavor text and description
- **Eligible Groups**: System highlights which items can be merged
  - Filters by same item name, rarity, and level
  - Shows merge requirements (3 or 5 items)
  - Merge button badge shows number of eligible groups
  - Only shows groups with 2+ items

**Strategic Benefits:**
- Build high-value collections
- Create rare items without relying on market RNG
- Increase resale value through merging
- Progress toward completing high-tier collections

---

### 1.10 Strategic Advice (Tips)

#### **For Beginners**
1. **Start Conservative**: Focus on Standard and Emerging tier assets
2. **Watch the Climate**: Expansion favors long positions, Recession favors quick exits
3. **Don't Overextend**: Avoid massive debt in early game
4. **Use Events**: Market events can multiply your gains - time your big trades accordingly
5. **Backup Your Progress**: Export your data regularly to prevent loss

#### **Advanced Strategies**
1. **Event Arbitrage**: Take loans during favorable events (Tech Boom, AI Revolution)
2. **Climate Rotation**: Switch strategies based on market climate
3. **Rarity Sniping**: Hunt for Unicorns during Expansion climates
4. **Debt Leverage**: Strategic debt can 10x your returns - but manage risk carefully

#### **Risk Management**
1. **25% Rule**: Never let debt exceed 25% of expected gains
2. **Event Timing**: Exit positions before negative events hit
3. **Diversification**: Don't go all-in on a single asset
4. **Horizon Matching**: Match holding period to climate stability

---

## Section 2: Technical Documentation

### 2.1 Technical Architecture

#### **Framework & Libraries**
- **Frontend**: React 18.3.1
- **Routing**: React Router DOM 6.30.2
- **Styling**: Tailwind CSS 4.1.17
- **Charts**: Chart.js 4.5.1 + React-ChartJS-2 5.3.1
- **Icons**: Lucide React 0.555.0
- **Encryption**: crypto-js (AES encryption for save files)
- **Build Tool**: Vite (Rolldown) 7.2.5

#### **State Management**
- **Architecture**: React Context API
- **Hook**: `useGameLogic` (custom hook)
- **Persistence**: LocalStorage with dual-key structure

#### **Data Structure (v4)**

**Player Data** (`marketPulseSave_player_v4`):
```json
{
  "balance": 10000,
  "xp": 0,
  "rankId": 0,
  "username": "OPERATOR_ID",
  "profileIcon": "profile_0.webp",
  "history": [],
  "loan": {
    "active": false,
    "amount": 0,
    "dueTurn": 0,
    "interestRate": 0.05
  }
}
```

**Game State** (`marketPulseSave_gameState_v4`):
```json
{
  "turn": 1,
  "marketClimate": "Stable",
  "marketViewMode": "grid",
  "activeProducts": [],
  "currentProduct": null,
  "investmentAmount": 0,
  "units": 0,
  "duration": 365,
  "chartType": "line",
  "rerollCount": 0,
  "rerollLimit": 5,
  "rerollBasePrice": 50,
  "rerollCostMultiplier": 5,
  "hasPulledOut": false,
  "marketEvent": null,
  "eventTurnsLeft": 0
}
```

#### **Version Migration**
The system automatically migrates old save formats (v1-v3) to v4 on load:
```javascript
// v3 → v4 migration
if (oldData && !playerData && !gameStateData) {
  playerData = {
    balance: oldData.balance,
    xp: oldData.xp,
    // ... extract player fields
  };
  gameStateData = {
    turn: oldData.turn,
    marketClimate: oldData.marketClimate,
    // ... extract game state fields
  };
}
```

#### **Data Export/Import System**

**Export Format (Encrypted):**
```json
{
  "version": "v4",
  "timestamp": "2025-12-07T12:34:56.789Z",
  "player": { /* player data object */ },
  "gameState": { /* game state data object */ }
}
```

**Encryption Process:**
1. Data is serialized to JSON string
2. AES encryption applied with secret key
3. Encrypted string saved to `.json` file
4. Filename: `market-pulse-save-{timestamp}.json`

**Import Process:**
1. File content read as text
2. AES decryption with secret key
3. JSON parsing and validation
4. Version compatibility check
5. Data structure validation
6. State update if all checks pass

**Error Handling:**
```javascript
// Import validation
if (!jsonData) {
  throw new Error('Decryption failed');
}
if (!parsedData.player || !parsedData.gameState) {
  throw new Error('Invalid data structure');
}
if (parsedData.version !== 'v4') {
  throw new Error('Incompatible version');
}
```

**Utility Functions:**
- `exportPlayerData(playerData, gameStateData)` - Returns `{success, error?}`
- `importPlayerData(encryptedData)` - Returns `{success, data?, error?}`

Located in: `/src/utils/playerData.js`

---

### 2.2 Core Game Logic

#### **Price Simulation Algorithm**

```javascript
// Geometric Brownian Motion with adjustments
const dt = 1 / 365; // Daily time step
const drift = (momentum - 1) + climateDrift;
const randomShock = (Math.random() - 0.5) * volatility * Math.sqrt(dt);
const priceChange = currentPrice * (drift * dt + randomShock);
newPrice = Math.max(1, currentPrice + priceChange);
```

**Momentum Calculation:**
```javascript
// Hype influences momentum
const hypeFactor = (product.hype / 100) * 0.1;
momentum = baseMomentum + hypeFactor;
```

**Volatility Modifiers:**
```javascript
// Rarity affects volatility
const rarityMultiplier = {
  standard: 1.0,
  emerging: 1.5,
  disruptive: 3.0,
  unicorn: 10.0
};
adjustedVolatility = baseVolatility * rarityMultiplier[rarity];
```

#### **Climate Effects**

```javascript
const climateEffects = {
  Stable: { volatilityMod: 0, driftRange: [-0.02, 0.02] },
  Expansion: { volatilityMod: -0.1, driftRange: [0.05, 0.15] },
  Recession: { volatilityMod: 0.1, driftRange: [-0.10, -0.05] },
  Turbulent: { volatilityMod: 0.3, driftRange: [-0.15, 0.15] }
};
```

#### **Event Multiplier Application**

```javascript
// Applied at trade completion
if (marketEvent) {
  if (profit > 0) {
    profit *= marketEvent.profitMultiplier;
  } else {
    profit *= marketEvent.lossMultiplier;
  }
}
```

---

### 2.3 File Structure

```
market-pulse/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── AlertModal.jsx         # Generic alert dialogs
│   │   │   ├── LoadingOverlay.jsx     # Loading states
│   │   │   ├── LoanModal.jsx          # Loan confirmation
│   │   │   ├── LoanBankModal.jsx      # Loan management UI
│   │   │   └── SimulationResultOverlay.jsx
│   │   ├── Dashboard.jsx              # Overview panel
│   │   ├── MarketFeed.jsx             # Product grid/list
│   │   ├── ProductCard.jsx            # Individual asset card
│   │   ├── TopBar.jsx                 # Header with stats
│   │   └── LiveChart.jsx              # Price chart
│   ├── hooks/
│   │   └── useGameLogic.js            # Core game state & logic
│   ├── pages/
│   │   ├── MarketPage.jsx             # Main market view
│   │   ├── TradingPage.jsx            # Trade execution
│   │   ├── SimulationPage.jsx         # Live simulation
│   │   └── data.json                  # Test save data
│   ├── App.jsx                        # Root component
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Global styles
├── public/
│   └── assets/
│       ├── items/                     # Product images
│       └── profiles/                  # Profile icons
├── documentation/
│   ├── GAME_DOCUMENTATION.md          # This file
│   ├── DATA_STRUCTURE_NEW.md          # Data schema docs
│   └── MIGRATION_SUMMARY.md           # v3→v4 migration guide
└── package.json                       # Dependencies & version
```

---

### 2.4 Component Responsibilities

#### **App.jsx**
- Root router configuration
- Global modal states (alert, loan, loading)
- GameLogic context provider

#### **MarketPage.jsx**
- Displays active products (grid/list toggle)
- Handles reroll market functionality
- Shows current climate and event status
- Local alert and loading states

#### **TradingPage.jsx**
- Investment amount and unit selection
- Horizon (duration) slider
- Position entry logic
- Local loading state for execution

#### **SimulationPage.jsx**
- Live price chart rendering
- Simulation controls (play, pause, speed, skip)
- Early exit functionality
- Result overlay management
- Local simulation result state

#### **useGameLogic.js**
- Central state management hook
- All game logic functions
- LocalStorage persistence
- Save/load/reset operations
- Turn progression
- Event generation and management

---

### 2.5 Key Functions Reference

#### **State Management**
```javascript
// Load game from localStorage
const { state, /* functions */ } = useGameLogic();

// Save current state
saveGame();

// Reset to default state
resetData();
```

#### **Market Operations**
```javascript
// Generate new products for current turn
generateProducts();

// Refresh market (costs money)
rerollMarket(); // Returns { success, error, message }

// Toggle view mode
toggleMarketView();
```

#### **Trading Operations**
```javascript
// Enter a position
selectProduct(product);
setInvestmentAmount(amount);
setUnits(count);
setDuration(days);
startSimulation();

// During simulation
togglePause();
changeSpeed(multiplier); // 1, 2, or 4
skipToEnd();
pullOut(); // Early exit (returns result)

// Complete trade
finishSimulation(finalPrice, ...); // Returns result object
```

#### **Loan Operations**
```javascript
// Loan management
takeLoan(amount); // Returns { success, error, message }
payLoan(amount);  // Returns { success, error, message }
checkLoanStatus(); // Auto-called each turn
```

#### **Progression**
```javascript
// Advance to next turn
nextTurn();

// Check rank up
checkRankUp();
```

---

### 2.6 Event System Implementation

#### **Event Pool**
```javascript
const EVENT_POOL = [
  {
    name: "Tech Boom",
    rarity: "rare",
    climate: "Expansion",
    duration: 8,
    profitMultiplier: 2,
    lossMultiplier: 1,
    icon: "🚀"
  },
  // ... 20+ events total
];
```

#### **Event Generation**
```javascript
// 15% chance per turn
if (Math.random() < 0.15 && !marketEvent) {
  const event = selectRandomEvent(); // Rarity-weighted
  setMarketEvent({
    ...event,
    duration: random(3, 10)
  });
  setEventTurnsLeft(event.duration);
}
```

#### **Event Decay**
```javascript
// Each turn
if (eventTurnsLeft > 0) {
  eventTurnsLeft--;
  if (eventTurnsLeft === 0) {
    clearMarketEvent();
  }
}
```

---

### 2.7 Testing & Debugging

#### **Test Save Data**
Located at `src/pages/data.json` - contains a realistic mid-game state for testing:
- Turn 70
- Active loan
- Great Depression event active
- Multiple products in history

#### **Debug Tips**
1. **State Inspection**: Use React DevTools to inspect `GameLogicContext`
2. **LocalStorage**: Check Application tab in browser DevTools
3. **Price Simulation**: Add `console.log` in `startSimulation` loop
4. **Event Testing**: Temporarily increase event chance to 100%

#### **Common Issues**
- **Simulation not progressing**: Check if `isPaused` is true
- **Modal not showing**: Ensure local state is set in component
- **Loan not triggering**: Verify balance is actually negative
- **Events not appearing**: Check `eventTurnsLeft` and event generation logic

---

## Section 3: Visual Design System

### 3.1 Design Philosophy

**Theme**: "High-Frequency Trading Terminal" meets Cyberpunk Finance

**Core Pillars:**
1. **Risk/Reward Balance**: Every decision has meaningful tradeoffs
2. **Progressive Complexity**: Simple to learn, depth emerges over time
3. **Skill Expression**: Mastery comes from pattern recognition and timing
4. **No Pay-to-Win**: Pure skill-based progression

---

### 3.2 Color Palette

**UI Colors:**
- Background: `#0A0E1A` (Dark Navy)
- Surface: `#0f172a` (Slate 900)
- Deep Surface: `#020617` (Slate 950)
- Primary Accent: `#00D9FF` (Cyan)
- Secondary: `#6366f1` (Indigo 500)

**Data Colors:**
- Success/Profit: `#00FF88` (Emerald Green)
- Warning: `#FFB800` (Amber)
- Error/Loss: `#FF4747` (Red)
- Neutral: `#94A3B8` (Slate)

**Rarity Colors:**
- Standard: `#94A3B8` (Gray/Slate)
- Emerging: `#60A5FA` (Blue 400)
- Disruptive: `#A78BFA` (Purple 400)
- Unicorn: `#FBBF24` (Gold/Yellow 400)

---

### 3.3 Typography

**Font Families:**
- **UI Text**: Inter (Sans-Serif)
  - Headings: Bold (600-700 weight)
  - Body: Regular (400 weight)
- **Data/Numbers**: JetBrains Mono (Monospace)

**Size Scale:**
- XS: 0.75rem (12px)
- SM: 0.875rem (14px)
- Base: 1rem (16px)
- LG: 1.125rem (18px)
- XL: 1.25rem (20px)
- 2XL: 1.5rem (24px)
- 3XL: 1.875rem (30px)

---

### 3.4 Art Style System

#### **Asset Art Direction**

```json
{
  "artStyleContext": {
    "meta": {
      "styleName": "Vector Pop-Industrial (Sprite)",
      "version": "2.1.0",
      "usage": "Game Inventory Icons / UI Sprites",
      "description": "High-contrast 2D vector-style assets with cel-shading. Optimized for sprite sheets with transparent backgrounds."
    },
    "visualPillars": [
      "Silhouette Isolation: The object must have a closed, distinct outer boundary to facilitate clean background removal.",
      "Square Composition: The subject must fit comfortably within a 1:1 frame without cropping key details.",
      "Hard-Surface Cartoon: Sturdy machinery with friendly proportions.",
      "Cel-Shading: Hard-edged shadows using a 2-tone or 3-tone system."
    ],
    "technicalSpecs": {
      "fileFormat": "PNG (32-bit with Alpha Channel)",
      "dimensions": "1024x1024px (Source), 256x256px (In-Game)",
      "aspectRatio": "1:1 (Square)",
      "background": {
        "type": "Transparent",
        "hex": "#00000000",
        "requirement": "No background scenery, gradients, or vignetting. Shadow must be contained within the object's footprint or explicitly excluded."
      },
      "padding": "Ensure 5-10% padding from image edges to prevent mipmap bleeding.",
      "lineWork": {
        "outerStroke": "Thick dark outline (8-12px) to separate asset from game background.",
        "innerStroke": "Medium outline (4-6px) for major forms."
      }
    },
    "colorPalette": {
      "baseMaterials": [
        "#4F6D7A (Slate)",
        "#2C3E50 (Dark Grey)",
        "#D4C4A8 (Beige)"
      ],
      "accents": [
        "#F1C40F (Hazard Yellow)",
        "#E74C3C (Alert Red)"
      ],
      "energy": [
        "#00E5FF (Plasma Cyan)",
        "#D500F9 (Electric Purple)"
      ]
    },
    "lightingModel": {
      "lightSource": "Top-Left 45° angle",
      "shadowDirection": "Bottom-Right",
      "highlightPlacement": "Top surfaces and edges",
      "ambientOcclusion": "Dark crevices and joints (optional)"
    },
    "exampleAssets": [
      {
        "itemName": "Quantum Toaster",
        "viewAngle": "Isometric or 3/4 Front View",
        "cropping": "Full object visible, centered.",
        "keyFeatures": [
          "Visible heating coils with glow effect",
          "Control panel with illuminated buttons",
          "Robust metallic body with panel lines",
          "Bread slots visible from top angle"
        ]
      },
      {
        "itemName": "VR Headset",
        "viewAngle": "3/4 Front View",
        "cropping": "Full headset with straps visible",
        "keyFeatures": [
          "Glossy lens surfaces with reflections",
          "Cushioned face padding",
          "Adjustment straps with buckles",
          "LED indicator lights"
        ]
      },
      {
        "itemName": "Hydroponic Kit",
        "viewAngle": "Isometric",
        "cropping": "Full system with plants visible",
        "keyFeatures": [
          "Transparent water reservoir",
          "Growing trays with vegetation",
          "LED grow lights overhead",
          "Tubes and pump mechanism"
        ]
      }
    ],
    "prohibitedElements": [
      "Photorealistic textures or gradients",
      "Complex background environments",
      "Overly detailed mechanical internals (keep it stylized)",
      "Text labels or UI elements baked into asset",
      "Multiple light sources causing conflicting shadows"
    ],
    "compositionRules": {
      "rule1": "Object must read clearly at 256x256px thumbnail size",
      "rule2": "Silhouette should be recognizable at small scale",
      "rule3": "Color contrast must be sufficient for visibility on dark (#0A0E1A) background",
      "rule4": "No critical details in corner areas (risk of being cut off)"
    },
    "styleCues": {
      "referenceTitles": [
        "Overwatch - Character Design (Proportions)",
        "Team Fortress 2 - Weapon Models (Readability)",
        "Fortnite - Item Icons (Bold Outlines)",
        "Valorant - Ability Icons (Graphic Simplicity)"
      ],
      "avoidingReferences": [
        "Realistic product photography",
        "Blender Cycles photorealism",
        "Hyper-detailed sci-fi concept art"
      ]
    },
    "implementationNotes": {
      "assetNaming": "Use descriptive names: 'Quantum_Toaster_Icon_1024.png'",
      "organizationStructure": "Sort by rarity tier in folder structure",
      "versionControl": "Keep layered source files (.psd/.ai) separate from exports",
      "qualityControl": [
        "Check for aliasing artifacts on edges",
        "Verify transparency is clean (no semi-transparent halos)",
        "Test at both 1024px and 256px to ensure scaling quality",
        "Preview on dark background (#0A0E1A) before finalizing"
      ]
    },
    "futureConsiderations": {
      "animationReadiness": "Design with potential sprite animation in mind (idle bobbing, glow pulses)",
      "variantSupport": "Leave room for color variants or upgrade tiers",
      "UIScaling": "Ensure icons work at multiple sizes (64px, 128px, 256px, 512px)"
    }
  }
}
```

#### **Asset Creation Guidelines**

**Step-by-Step Asset Creation:**

1. **Concept Phase**
   - Sketch basic silhouette in 1:1 ratio
   - Define 2-3 key identifying features
   - Choose base color palette from spec

2. **Vector Creation**
   - Build in layers: Background → Mid → Foreground
   - Use thick outer stroke (8-12px black)
   - Apply 2-tone cel-shading

3. **Lighting & Detail**
   - Light source from top-left
   - Highlight edges with 15-20% lighter tint
   - Shadow areas with 20-30% darker tint

4. **Export & Optimization**
   - Export at 1024x1024px PNG with alpha
   - Verify transparent background
   - Test at 256x256px scale
   - Preview on dark UI background

5. **Quality Check**
   - Silhouette readable at thumbnail size?
   - Colors contrast well with background?
   - No edge artifacts or halos?
   - Centered with 5-10% padding?

---

### 3.5 UI Components

#### **Card Design**
- Border radius: 8px (rounded-lg)
- Border: 1px solid slate-700/50
- Shadow: Subtle glow on hover
- Padding: 16px (p-4)

#### **Buttons**
- Primary: Cyan background with hover glow
- Secondary: Slate background with border
- Danger: Red background for destructive actions
- Disabled: 50% opacity with no-cursor

#### **Charts**
- Line color: Cyan (#00D9FF)
- Grid lines: Slate 700/30
- Profit area: Green gradient
- Loss area: Red gradient

---

## Section 4: Version History

### v0.0.1-build.20251207.1 (Current)
**Major Changes:**
- ✅ Added encrypted export/import functionality for player data
- ✅ Implemented AES encryption for save file protection
- ✅ Added data management UI to Profile page
- ✅ Created comprehensive error handling for import failures

**New Features:**
- Export player data as encrypted JSON backup
- Import player data from encrypted backup files
- Data tampering prevention via encryption
- User-friendly error modals for import issues
- Profile page data management section

**Security Enhancements:**
- AES encryption for all exported data
- Import validation and version checking
- Protection against save file manipulation
- Clear error messages for corrupted files

### v0.0.1-build.20251203.4
**Major Changes:**
- ✅ Separated player data from game state in localStorage
- ✅ Removed component-specific state from persistence layer
- ✅ Implemented automatic v3→v4 save migration
- ✅ Fixed simulation result handling and early exit logic
- ✅ Improved error handling (functions return result objects)
- ✅ Component-local state management for modals/overlays

**New Features:**
- Market Events system with duration and multipliers
- Reroll market functionality
- Enhanced loan warning system
- Profile icon selection (8 avatars)

**Bug Fixes:**
- Fixed finishSimulation returning null
- Fixed pullOut not capturing result
- Fixed toggleLoadingOverlay not defined errors
- Fixed hideResultOverlay not defined errors

### v2.8.2 (Previous)
- Initial documented version
- Basic trading mechanics
- Loan system
- Rank progression

---

## Section 5: Future Roadmap

### Planned Features
- [ ] Achievements system
- [ ] Leaderboards
- [ ] Daily challenges
- [ ] Portfolio tracking across multiple assets
- [ ] Market news feed
- [ ] Economic indicators dashboard
- [ ] Tutorial/onboarding flow
- [ ] Sound effects and music
- [ ] Mobile responsive design improvements

### Potential Expansions
- [ ] Multiplayer trading competitions
- [ ] Asset categories (Tech, Real Estate, Commodities)
- [ ] Advanced chart indicators (RSI, MACD, Bollinger Bands)
- [ ] Historical data replay mode
- [ ] Custom event creator

---

## Appendix A: Complete Event List

| Event Name | Rarity | Climate | Duration | Profit Mult | Loss Mult | Icon |
|------------|--------|---------|----------|-------------|-----------|------|
| Tech Boom | Rare | Expansion | 8 | 2x | 1x | 🚀 |
| Great Depression | Uncommon | Recession | 10 | 1x | 2x | 💀 |
| AI Revolution | Legendary | Expansion | 5 | 3x | 0.5x | 🤖 |
| Market Correction | Common | Recession | 5 | 1x | 1.2x | 📉 |
| Bull Run | Common | Expansion | 6 | 1.3x | 1x | 🐂 |
| Bear Market | Common | Recession | 7 | 1x | 1.3x | 🐻 |
| Black Swan Event | Legendary | Turbulent | 3 | 0.5x | 3x | 🦢 |
| Golden Age | Rare | Expansion | 10 | 1.8x | 0.8x | 🏛️ |
| Supply Shock | Uncommon | Turbulent | 4 | 1.2x | 1.5x | ⚠️ |
| Regulatory Approval | Common | Stable | 5 | 1.4x | 1x | ✅ |

*(And 10+ more events)*

---

## Appendix B: Product Database

The game features 50+ unique products across 4 categories:
- **Technology**: VR Headsets, Quantum Computers, AI Assistants
- **Finance**: Crypto Wallets, Digital Bonds, NFT Collections
- **Lifestyle**: Smart Watches, Hydroponic Kits, DNA Test Kits
- **Industrial**: 3D Printers, Solar Panels, Drones

Each product has:
- Unique name and description
- Base price ($50-$800)
- Random volatility (0.3-2.0)
- Random momentum (0.85-1.15)
- Random hype (0-100)
- Assigned rarity tier
- Custom sprite asset (256x256px PNG)

---

## Appendix C: Formula Reference

### Price Movement
```javascript
newPrice = currentPrice * (1 + drift * dt + volatility * randomShock * sqrt(dt))
```

### Profit Calculation
```javascript
profit = (sellPrice - buyPrice) * units
if (marketEvent) {
  profit = profit > 0 
    ? profit * event.profitMultiplier 
    : profit * event.lossMultiplier
}
```

### Early Exit Penalty
```javascript
adjustedProfit = Math.max(0, profit * 0.75)
```

### XP Gain
```javascript
xpGain = 50 + Math.max(0, Math.floor(profit / 100))
```

### Loan Interest
```javascript
premium = loanAmount > 50000 ? 0.04 : (loanAmount > 10000 ? 0.02 : 0)
interestRate = 0.05 + premium
newLoanAmount = loanAmount * (1 + interestRate)
```

### Reroll Cost
```javascript
baseCost = 50 + (turn * 10)
totalCost = baseCost * rerollCostMultiplier
```

---

**End of Documentation**

*For support or contributions, visit the project repository*
*Last Updated: December 7, 2025*
*Version: 0.0.1-build.20251207.1*