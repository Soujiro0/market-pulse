# Market Pulse: Restructured Data Documentation

This document outlines the new restructured data format, separating player data from game state data.

## Overview

The data has been reorganized into two main categories:
1. **Player Data** - Information specific to the player
2. **Game State Data** - Current game state and market information

Component-specific states (modals, overlays, etc.) have been moved to individual components.

## Player Data

Stored under `marketPulseSave_player_v4` in localStorage:

```json
{
  "balance": 10000,
  "xp": 0,
  "rankId": 0,
  "profileIcon": "profile_0.webp",
  "username": "OPERATOR_ID",
  "history": [],
  "loan": {
    "active": false,
    "amount": 0,
    "dueTurn": 0,
    "interestRate": 0.05
  }
}
```

### Player Data Properties

- `balance` (number): Player's current money
- `xp` (number): Player's experience points
- `rankId` (number): Current rank/tier index
- `profileIcon` (string): Profile icon filename
- `username` (string): Player's username
- `history` (array): Array of trade history entries
- `loan` (object): Current loan information

## Game State Data

Stored under `marketPulseSave_gameState_v4` in localStorage:

```json
{
  "turn": 1,
  "marketViewMode": "grid",
  "marketClimate": "Stable",
  "activeProducts": [],
  "currentProduct": null,
  "investmentAmount": 0,
  "units": 0,
  "duration": 0,
  "chartType": "line",
  "rerollCostMultiplier": 5,
  "rerollBasePrice": 0,
  "rerollCount": 0,
  "rerollLimit": 5,
  "hasPulledOut": false,
  "marketEvent": null,
  "eventTurnsLeft": 0
}
```

### Game State Properties

- `turn` (number): Current turn/year in the game
- `marketViewMode` (string): "grid" or "list" view mode
- `marketClimate` (string): Current market climate ("Stable", "Expansion", "Recession", "Turbulent")
- `activeProducts` (array): Array of products currently available in the market
- `currentProduct` (object|null): Product currently being traded
- `investmentAmount` (number): Amount invested in current trade
- `units` (number): Number of units purchased
- `duration` (number): Duration for simulation
- `chartType` (string): Chart display type ("line", "bar", etc.)
- `rerollCostMultiplier` (number): Multiplier for reroll costs
- `rerollBasePrice` (number): Base price for rerolls this turn
- `rerollCount` (number): Number of rerolls used this turn
- `rerollLimit` (number): Maximum rerolls available
- `hasPulledOut` (boolean): Whether player has pulled out of investment
- `marketEvent` (object|null): Current active market event
- `eventTurnsLeft` (number): Turns remaining for current event

## Component-Specific States (Not Persisted)

These states are now managed within their respective components and are not saved to localStorage:

- `showLoadingOverlay` - Moved to App.jsx
- `showSimulationResultOverlay` - Moved to SimulationPage.jsx
- `simulationResult` - Moved to SimulationPage.jsx
- `alertModal` - Moved to App.jsx
- `showLoanModal` - Moved to LoanModal.jsx
- `showEventModal` - Moved to App.jsx
- `showFinishedEventModal` - Moved to App.jsx
- `newEvent` - Moved to App.jsx
- `finishedEvent` - Moved to App.jsx

## Migration

When loading old saves (`marketPulseSave_v3`), the system will automatically:
1. Split data into player and game state
2. Remove component-specific states
3. Save in the new format
4. Delete the old save

## Benefits

1. **Better Organization**: Clear separation of concerns
2. **Easier Maintenance**: Component states are where they're used
3. **Cleaner Persistence**: Only game-relevant data is saved
4. **Improved Performance**: Smaller localStorage entries
5. **Better Testing**: Easier to mock player vs game state
