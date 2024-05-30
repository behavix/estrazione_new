const fs = require('fs').promises;
const path = require('path');

// Function to read config file
async function readConfig(configFileName) {
    try {
        const configPath = path.resolve(__dirname, configFileName);
        console.log("Attempting to read config file from:", configPath);
        const configData = await fs.readFile(configPath, 'utf-8');
        return JSON.parse(configData);
    } catch (error) {
        console.error("Errore nella lettura del file config:", error);
        throw error;
    }
}

module.exports = readConfig;