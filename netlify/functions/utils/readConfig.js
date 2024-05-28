const fs = require('fs').promises;
const path = require('path');

// Function to read config file
async function readConfig(configFileName) {
    try {
        const configPath = path.resolve(__dirname, configFileName);
        const configData = await fs.readFile(configPath, 'utf-8');
        return JSON.parse(configData);
    } catch (error) {
        console.error("Error reading config file:", error);
        throw error;
    }
}

module.exports = readConfig;