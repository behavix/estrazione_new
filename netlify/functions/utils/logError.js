// Import the airtableConn function
const connAirtable = require('./connAirtable');
// Import the readConfig function
const readConfig = require('./readConfig');


// Helper function to log errors in Airtable
async function logError(error) {
    try {
        // Read config file and connect to airtable
        const config = await readConfig('../config/config.json');
        const airtableBase = await connAirtable(config.airtableBase);

        await airtableBase(config.errorTable).create({
            error: error.message,
            details: JSON.stringify(error, Object.getOwnPropertyNames(error))
        });
    } catch (logError) {
        console.error('Errore durante connessione ad Airtable:', logError);
    }
}

module.exports = logError;