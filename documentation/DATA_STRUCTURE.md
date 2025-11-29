# Market Pulse: Data Structure Documentation

This document outlines the primary JSON-formatted data structures used in the Market Pulse game. The main state is managed within the `useGameLogic` hook and stored in `localStorage` under the key `marketPulseSave_v3`.

## Main Game State (`state` object)

This is the root object that holds all persistent game data.

```json
{
  "balance": 10000,
  "turn": 1,
  "marketViewMode": "grid",
  "marketClimate": "Neutral",
  "activeProducts": [],
  "currentProduct": null,
  "investmentAmount": 0,
  "units": 0,
  "duration": 0,
  "history": [],
  "loan": {
    "active": false,
    "amount": 0,
    "dueTurn": 0,
    "interestRate": 0.05
  },
  "chartType": "line",
  "xp": 0,
  "tierIndex": 0,
  "rank": 1,
  "showLoadingOverlay": false,
  "simulationResult": null,
  "showSimulationResultOverlay": false,
  "showLoanModal": false
}
```

### State Properties

-   `balance` (Number): The player's current cash on hand. Can be negative (debt).
-   `turn` (Number): The current turn number of the game.
-   `marketViewMode` (String): The current view mode for the market page. Can be `'grid'` or `'list'`.
-   `marketClimate` (String): The current global market climate. (e.g., `'Bull Market'`, `'Bear Market'`, `'Neutral'`, `'Volatile'`).
-   `activeProducts` (Array): An array of `Product` objects currently available in the market.
-   `currentProduct` (Object | null): The `Product` object selected for trading.
-   `investmentAmount` (Number): The total cost basis for the current trade.
-   `units` (Number): The number of units selected for the current trade.
-   `duration` (Number): The number of days (horizon) selected for the current trade.
-   `history` (Array): An array of `HistoryEntry` objects, logging all completed trades.
-   `loan` (Object): A `Loan` object representing the player's current debt status.
-   `chartType` (String): The preferred chart type for the simulation view. Can be `'line'` or `'bar'`.
-   `xp` (Number): The player's total experience points.
-   `tierIndex` (Number): The index of the player's current career tier (from the `TIERS` constant).
-   `rank` (Number): The player's current rank within their tier (1-5).
-   `showLoadingOverlay` (Boolean): Controls the visibility of the global loading overlay.
-   `simulationResult` (Object | null): An object containing the results of the last simulation.
-   `showSimulationResultOverlay` (Boolean): Controls the visibility of the simulation result overlay.
-   `showLoanModal` (Boolean): Controls the visibility of the loan modal.

## `Product` Object

Represents a single tradable asset in the market.

```json
{
  "id": "p0",
  "name": "Quantum Toaster",
  "icon": "🍞",
  "basePrice": 120,
  "desc": "Browns bread using quantum tunneling.",
  "currentPrice": 135.50,
  "volatility": 0.85,
  "momentum": 1.01,
  "rarity": {
    "id": "standard",
    "label": "Standard",
    "mult": 1,
    "color": "text-slate-400",
    "bg": "bg-standard",
    "border": "card-base",
    "icon": "box",
    "glow": "card-base"
  },
  "hype": 75
}
```

## `HistoryEntry` Object

Represents a single completed trade in the player's history.

```json
{
  "turn": 5,
  "productName": "Quantum Toaster",
  "rarityLabel": "Standard",
  "rarityId": "standard",
  "rarityIcon": "box",
  "profit": 500.25,
  "units": 10,
  "buyPrice": 135.50,
  "sellPrice": 185.52,
  "climate": "Bull Market"
}
```

## `Loan` Object

Represents the player's loan status.

```json
{
  "active": true,
  "amount": 5250,
  "dueTurn": 15,
  "interestRate": 0.05
}
```
