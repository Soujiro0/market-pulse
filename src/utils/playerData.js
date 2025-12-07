import CryptoJS from 'crypto-js';

// Secret key for encryption - in production, this should be in environment variables
const SECRET_KEY = 'market-pulse-data-protection-key-2025';

/**
 * Export player data as an encrypted JSON file
 * @param {Object} playerData - The player data to export
 * @param {Object} gameStateData - The game state data to export
 */
export const exportPlayerData = (playerData, gameStateData) => {
    try {
        const dataToExport = {
            version: 'v4',
            timestamp: new Date().toISOString(),
            player: playerData,
            gameState: gameStateData
        };

        // Convert to JSON string
        const jsonData = JSON.stringify(dataToExport);

        // Encrypt the data
        const encrypted = CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();

        // Create a blob and download
        const blob = new Blob([encrypted], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `market-pulse-save-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return { success: true };
    } catch (error) {
        console.error('Export failed:', error);
        return { success: false, error: 'Failed to export data' };
    }
};

/**
 * Import and decrypt player data from encrypted JSON file
 * @param {string} encryptedData - The encrypted data string from file
 * @returns {Object} - Object containing success status and data or error message
 */
export const importPlayerData = (encryptedData) => {
    try {
        // Decrypt the data
        const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const jsonData = decrypted.toString(CryptoJS.enc.Utf8);

        if (!jsonData) {
            throw new Error('Decryption failed. File may be corrupted or tampered with.');
        }

        // Parse the JSON
        const parsedData = JSON.parse(jsonData);

        // Validate the data structure
        if (!parsedData.player || !parsedData.gameState) {
            throw new Error('Invalid data structure. Missing required fields.');
        }

        // Validate version
        if (parsedData.version !== 'v4') {
            throw new Error('Incompatible save file version.');
        }

        return {
            success: true,
            data: {
                player: parsedData.player,
                gameState: parsedData.gameState,
                timestamp: parsedData.timestamp
            }
        };
    } catch (error) {
        console.error('Import failed:', error);
        
        // Return user-friendly error messages
        if (error.message.includes('Decryption failed')) {
            return { success: false, error: 'Invalid save file. The file may be corrupted or tampered with.' };
        } else if (error.message.includes('Invalid data structure')) {
            return { success: false, error: 'Invalid save file format. Required data is missing.' };
        } else if (error.message.includes('Incompatible save file version')) {
            return { success: false, error: 'This save file is from an incompatible version.' };
        } else if (error instanceof SyntaxError) {
            return { success: false, error: 'File content is corrupted or not a valid save file.' };
        } else {
            return { success: false, error: 'Failed to import data. Please check the file and try again.' };
        }
    }
};
