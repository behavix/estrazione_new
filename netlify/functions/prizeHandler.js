// Import the functions
const readConfig = require('./utils/readConfig');
const connAirtable = require('./utils/connAirtable');
const logError = require('./utils/logError');
const extractor = require('./utils/extractor');
const assignPrize = require('./utils/assignPrize');
const checkLockRecord = require('./utils/checkLockRecord');
const checkTodayRecord = require('./utils/checkTodayRecord');
const lockTable = require('./utils/lockTable');
const unlockTable = require('./utils/unlockTable');

module.exports.handler = async function() {

    try {   
        // Read config file
        const config = await readConfig('../config/config.json');

        // Airtable connection
        const airtableBase = await connAirtable(config.airtableBase);

        // Find the check record lo lock the main table
        const checkRecord = await checkLockRecord(airtableBase, config);

        // Process prize drawing
        const prize = await extractor(config);
        const nonWinningMessage = 'Questa volta non hai vinto.\n\nRiprova domani!';
        let message = nonWinningMessage;

        // If won, login to the database
        if (prize) {
            try {
                // Try to lock the main table to prevent multiple accesses
                const maxRetries = 10;
                const timePerAttempt = 1000; // milliseconds
                let attempts = 0;
                let success = false;
                do {
                    success = await lockTable(airtableBase, config, checkRecord);

                    if (!success) {
                        attempts++;
                        await new Promise(resolve => setTimeout(resolve, timePerAttempt));
                    }
                } while (!success && attempts < maxRetries);

                
                // If the table is still locked, stop and notify to the user
                if (!success) {
                    await logError('table not unlocked after several attempts');
                    message = nonWinningMessage;

                // Else continue the process
                } else {

                    // Find or create today's record
                    const todayRecord = await checkTodayRecord(airtableBase, config);
                
                    // Check if there's still a prize and save the related message
                    const assignedPrize = await assignPrize(airtableBase, config, todayRecord)

                    message = assignedPrize.winning ? assignedPrize.message : nonWinningMessage;
                }

            } catch (error) {
                console.error('Errore:', error);
                await logError(error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Si è verificato un errore.' }),
                };

            } finally {
                // At the end of the process unlock the table
                await unlockTable(airtableBase, config, checkRecord);
            }    
        }

        // Return the winning/non winning message
        return {
            statusCode: 200,
            body: JSON.stringify({ message: message }),
        };

    } catch (error) {
        console.error('Errore:', error);
        // Log error to Airtable
        await logError(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Si è verificato un errore.' }),
        };
    }  
}

