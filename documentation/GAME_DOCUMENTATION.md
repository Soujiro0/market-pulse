# Market Pulse: Comprehensive Documentation

**Version**: 2.8.2
**Platform**: Web (Single Page Application)
**Genre**: Strategic Business Simulation

## Section 1: Player's Guide (User Manual)

### 1.1 Introduction

Market Pulse is a high-stakes financial strategy game where players assume the role of an aspiring market operator. Your goal is to scale a starting capital of $10,000 into a corporate empire by identifying high-potential assets, executing timed trades, and climbing the corporate ladder from "Intern" to "Chairman."

### 1.2 Core Gameplay Loop

The game operates on a turn-based system with a real-time simulation phase.

**Analyze (The Feed):**
* Review 10 randomized Global Ventures (assets) generated each turn.
* Assess value based on Price, Rarity Tier, Hype (Demand), and the global Market Climate.
* Toggle between Grid View and List View for different data perspectives.

**Commit (The Desk):**
* Select an asset to enter the Trading Desk.
* **Set Horizon**: Choose how long to hold the asset (30-365 days). Longer holds offer higher risk/reward.
* **Set Volume**: Choose how many units to buy.
* **Overdraft Strategy**: You can purchase more units than your cash allows, pushing your balance into negative (Debt). This leverages potential gains but increases bankruptcy risk.

**Simulate (Live Feed):**
* Watch the price action unfold on a live chart.
* **Controls**: Pause, Speed Up (1x, 2x, 4x), or Skip to the end.
* **Constraint**: You cannot exit a trade early. You must wait for the Horizon to complete.

**Liquidate:**
* Positions close automatically at the end of the Horizon.
* Profit/Loss is realized immediately.
* XP is awarded based on trade performance.

### 1.3 Game Elements

**Resources**
* **Liquidity**: Your cash on hand. Can be negative.
* **XP (Experience)**: Gained by trading. Unlocks new Ranks.
* **Turn**: Advances by 1 after every completed trade.

**Asset Classes (Rarity)**
Every asset belongs to a specific tier that dictates its volatility and potential return.

| Icon | Tier Name | Characteristics | Multiplier |
|---|---|---|---|
| 📦 | Standard | Low volatility, stable, safe. | 1.0x |
| ⚡ | Emerging | Growth potential, moderate risk. | 1.5x |
| ⭐ | Disruptive | High volatility, market movers. | 3.0x |
| 👑 | Unicorn | Extreme risk/reward. The "1%". | 10.0x |

**Market Climates**
Global conditions that affect all assets for the current turn.
*   **Bull Market (Trending Up)**: Lower volatility, positive momentum bias.
*   **Bear Market (Trending Down)**: Higher volatility, negative momentum bias.
*   **Neutral**: Balanced market conditions.
*   **Volatile**: Extreme price swings in both directions.

### 1.4 Strategic Advice (Tips)

*   **Leverage Debt Wisely**: Taking loans early can boost your buying power for safe, Standard tier assets. But beware of compound interest—always check the total repayment before signing.
*   **Match Horizon to Rarity**:
    *   Standard/Emerging: Good for short-term flips (30-60 days).
    *   Unicorns: Require long horizons (200+ days) to realize their massive 10x potential, as they are extremely volatile in the short term.
*   **Climate Awareness**:
    *   In a Bull Market, be aggressive. Most assets drift upwards.
    *   In a Bear Market, trade small volumes or sit out turns to preserve capital.

## Section 2: Advanced Mechanics

### 2.1 The Leveling System (Career Ladder)

Progression is measured by your Corporate Tier. There are 10 Tiers, and each Tier consists of 5 Ranks.
*   **XP Requirement**: 1000 XP to advance 1 Rank.
*   **Promotion**: Advancing 5 Ranks promotes you to the next Tier.

**Tier List:**
1.  Intern
2.  Analyst
3.  Associate
4.  Trader
5.  Broker
6.  Manager
7.  Director
8.  VP
9.  Executive
10. Chairman

### 2.2 Corporate Finance (The Loan Bank)

A facility to provide liquidity when insolvent or to leverage capital for massive trades.
*   **Credit Limit**: $50,000 Maximum Principal.
*   **Interest Structure**:
    *   Base Rate: 5% fixed.
    *   Time Premium: +1% for every 5 turns of loan duration.
*   **Lock-in**: Loans cannot be repaid before their maturity date.
*   **Default & Liquidation**: If a loan remains unpaid for 10 turns after its due date, the bank automatically seizes assets to cover the debt (Liquidation), drastically reducing your Net Capital.

## Section 3: Developer Reference (Technical Manual)

### 3.1 Technical Architecture

**Stack**: React 18, HTML5, Tailwind CSS (Styling), Chart.js (Visualization), Lucide Icons (UI), Vanilla JavaScript (Logic).
**State Management**: Singleton `MarketGame` class holding balance, turn, activeProducts, loan, xp, history, etc.

### 3.2 Core Algorithms

**Asset Generation Logic**
*   Base Price: `Random(20, 520)`
*   Price Calculation: `Base Price * Rarity Multiplier * Random_Variation`
*   Volatility: `(Random(0.1, 1.0) * Climate_Vol_Modifier)`
*   Momentum: `(Random(0.9, 1.1) + Climate_Bias_Modifier)`

**Simulation Algorithm (Random Walk)**
The price curve is pre-calculated or generated tick-by-tick using a modified random walk:
```javascript
Step_Noise = (Math.random() * 2) - 1; // Range -1 to 1
Volatility_Factor = Product.volatility * 0.05;
Momentum_Bias = (Product.momentum - 1) * 0.05;

Percent_Change = (Step_Noise * Volatility_Factor) + Momentum_Bias;
New_Price = Current_Price * (1 + Percent_Change);
```

**XP Calculation Formula**
*   Base XP: 50 points per completed trade.
*   Performance Bonus: `Math.floor(Net_Profit / 100)` (Only applied if profit > 0).
*   Example: A $5,000 profit yields 50 (Base) + 50 (Bonus) = 100 XP.

### 3.3 Transaction Logic (Formulas)

1.  **Buying (Initialization)**
    ```
    Cost_Basis = Unit_Price * Units_Selected
    New_Balance = Current_Balance - Cost_Basis
    // Note: New_Balance is allowed to be negative (Overdraft).
    ```

2.  **Selling (Liquidation)**
    ```
    Revenue = Final_Market_Price * Units_Held
    New_Balance = Current_Balance + Revenue
    Net_Profit = Revenue - Cost_Basis
    ```

3.  **Loan Calculations**
    ```
    Premium_Rate = Math.floor(Duration_Turns / 5) * 0.01;
    Total_Interest_Rate = 0.05 + Premium_Rate;
    Repayment_Amount = Principal * (1 + Total_Interest_Rate);
    ```

### 3.4 Configuration Constants

**Rarity Config:**
```javascript
const RARITY = {
    STANDARD:   { mult: 1.0, color: 'slate', icon: 'box' },
    EMERGING:   { mult: 1.5, color: 'blue', icon: 'zap' },
    DISRUPTIVE: { mult: 3.0, color: 'purple', icon: 'star' },
    UNICORN:    { mult: 10.0, color: 'yellow', icon: 'crown' }
}
```

**Climate Config:**
*   Bull: Momentum +0.02, Volatility 0.8x
*   Bear: Momentum -0.02, Volatility 1.2x
*   Volatile: Momentum 0.0, Volatility 1.5x

## Section 4: Visual Design System

**Theme**: "High-Frequency Trading Terminal" / Cyberpunk Finance.

**Color Palette (Dark Mode):**
*   Backgrounds: Slate 900 (#0f172a), Slate 950 (#020617).
*   Primary Action: Indigo 500 (#6366f1).
*   Positive Data: Emerald 400 (#34d399).
*   Negative Data: Red 500 (#ef4444).
*   Special: Yellow/Gold for Unicorns, Purple for Disruptive assets.

**Typography:**
*   UI Text: Inter (Clean Sans-Serif).
*   Data/Numbers: JetBrains Mono

**Art Style**

JSON Format Context for Art Style
```javascript
{
  "artStyleContext": {
    "meta": {
      "styleName": "Vector Pop-Industrial (Sprite)",
      "version": "2.1.0",
      "usage": "Game Inventory Icons / UI Sprites",
      "description": "High-contrast 2D vector-style assets with cel-shading. Optimized for sprite sheets with transparent backgrounds."
    },
    "visualPillars": [
      "Silhouette Isolation": "The object must have a closed, distinct outer boundary to facilitate clean background removal.",
      "Square Composition": "The subject must fit comfortably within a 1:1 frame without cropping key details.",
      "Hard-Surface Cartoon": "Sturdy machinery with friendly proportions.",
      "Cel-Shading": "Hard-edged shadows using a 2-tone or 3-tone system."
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
      "baseMaterials": ["#4F6D7A (Slate)", "#2C3E50 (Dark Grey)", "#D4C4A8 (Beige)"],
      "accents": ["#F1C40F (Hazard Yellow)", "#E74C3C (Alert Red)"],
      "energy": ["#00E5FF (Plasma Cyan)", "#D500F9 (Electric Purple)"]
    },
    "assetSpecifics": {
      "itemName": "Quantum Toaster",
      "viewAngle": "Isometric or 3/4 Front View",
      "cropping": "Full object visible, centered."
    }
  }
}
```