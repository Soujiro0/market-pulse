# Market Pulse: Restructured Data Documentation

**Version**: 0.0.1-build.20251211.1  
**Last Updated**: December 11, 2025

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
  },
  "seenItems": [],
  "collection": []
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
- `seenItems` (array): Array of item names that have been unlocked in the Databank
- `collection` (array): Array of collectible items purchased from Collection Market

### Collection Item Structure

Each item in the `collection` array follows this structure:

```json
{
  "id": "collectible_1234567890_0.123",
  "itemName": "CryptoShark",
  "purchasePrice": 1500,
  "acquiredTurn": 5,
  "rarity": "emerging",
  "level": 1
}
```

- `id` (string): Unique identifier for this collectible instance
- `itemName` (string): Name of the item from items.json
- `purchasePrice` (number): Amount paid for this item
- `acquiredTurn` (number): Turn when the item was acquired
- `rarity` (string): Rarity tier ("standard", "emerging", "disruptive", "unicorn")
- `level` (number): Level of the item (increases when merging)

### Collectible Merging System

Players can merge multiple copies of the same item to upgrade its rarity:

**Merge Requirements:**
- 3 Standard items → 1 Emerging item
- 3 Emerging items → 1 Disruptive item  
- 5 Disruptive items → 1 Unicorn item

**Merge Rules:**
- All items must be the same item, same rarity, and same level
- Merged items receive a +20% value bonus (formula: totalPrice × 1.2)
- Level increases by 1 after each merge
- Unicorn rarity items cannot be merged further
- Drag and drop interface for intuitive crafting

### Collection Interface Features

**Pagination System:**
- Displays 8 collectibles per page
- Shows page numbers with Previous/Next navigation
- Current page highlighted with cyan styling
- Resets to page 1 when filter changes
- Maintains selections across page navigation

**Rarity Filtering:**
- Dropdown filter: All, Standard, Emerging, Disruptive, Unicorn
- Shows item count for each rarity category
- Filtering preserves selection state
- Filter persists across page navigation

**Multi-Selection System:**
- Click cards to toggle selection (cyan ring indicator)
- Select All: Selects all items in current filtered view
- Deselect All: Clears all selections
- Selected items persist across page navigation
- Bulk sell button appears when items selected
- Shows total sell value for selected items

**Visual Presentation:**
- Rarity-based colors:
  - Standard: Blue (rgb(59,130,246))
  - Emerging: Indigo (rgb(99,102,241))
  - Disruptive: Purple (rgb(168,85,247))
  - Unicorn: Yellow/Gold (rgb(234,179,8))
- Shine effects: Only on Disruptive and Unicorn during hover
- Selection indicator: Cyan ring (ring-4 ring-cyan-400) and filled checkbox
- Hover effects: Scale transform (105%) and glow based on rarity

**Multi-Selection System:**
- Click cards to toggle selection (cyan ring indicator)
- Select All: Selects all items in current filtered view
- Deselect All: Clears all selections
- Selected items persist across page navigation
- Bulk sell button appears when items selected

**Visual Presentation:**
- Rarity-based colors: Blue (Standard), Indigo (Emerging), Purple (Disruptive), Yellow (Unicorn)
- Shine effects: Only visible on Disruptive and Unicorn rarities during hover
- Selection indicator: Cyan ring and filled checkbox
- Hover effects: Scale transform and glow based on rarity

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

### Collection Interface Features

**Pagination System:**
- Displays 8 collectibles per page
- Shows page numbers with Previous/Next navigation
- Current page highlighted with cyan styling
- Resets to page 1 when filter changes
- Maintains selections across page navigation

**Rarity Filtering:**
- Dropdown filter: All, Standard, Emerging, Disruptive, Unicorn
- Shows item count for each rarity category
- Filtering preserves selection state
- Filter persists across page navigation

**Multi-Selection System:**
- Click cards to toggle selection (cyan ring indicator)
- Select All: Selects all items in current filtered view
- Deselect All: Clears all selections
- Selected items persist across page navigation
- Bulk sell button appears when items selected
- Shows total sell value for selected items

**Visual Presentation:**
- Rarity-based colors:
  - Standard: Blue (rgb(59,130,246))
  - Emerging: Indigo (rgb(99,102,241))
  - Disruptive: Purple (rgb(168,85,247))
  - Unicorn: Yellow/Gold (rgb(234,179,8))
- Shine effects: Only on Disruptive and Unicorn during hover
- Selection indicator: Cyan ring (ring-4 ring-cyan-400) and filled checkbox
- Hover effects: Scale transform (105%) and glow based on rarity

## Export/Import Data Structure

When exporting data through the Profile page, the system creates an encrypted JSON file with the following structure (before encryption):

```json
{
  "version": "v4",
  "timestamp": "2025-12-07T12:34:56.789Z",
  "player": {
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
    },
    "seenItems": [],
    "collection": []
  },
  "gameState": {
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
}
```

### Export/Import Properties

- `version` (string): Save file version identifier ("v4")
- `timestamp` (string): ISO 8601 timestamp of when the save was created
- `player` (object): Complete player data snapshot
- `gameState` (object): Complete game state snapshot

### Security

- All exported data is encrypted using **AES encryption** via crypto-js
- Prevents tampering or manual editing of save files
- Import process validates:
  - Successful decryption
  - Valid JSON structure
  - Presence of required fields (player, gameState)
  - Compatible version number

### Error Handling

Import failures return descriptive error messages:
- **"Invalid save file"** - Decryption failed (corrupted or tampered)
- **"Invalid save file format"** - Missing required data fields
- **"Incompatible version"** - Save from different game version
- **"File content corrupted"** - JSON parsing failed

## Benefits

1. **Better Organization**: Clear separation of concerns
2. **Easier Maintenance**: Component states are where they're used
3. **Cleaner Persistence**: Only game-relevant data is saved
4. **Improved Performance**: Smaller localStorage entries
5. **Better Testing**: Easier to mock player vs game state
6. **Data Security**: Encrypted backups prevent save manipulation
7. **Cross-Device Play**: Export and import saves across different devices
8. **Backup & Recovery**: Safe backups before updates or experiments
