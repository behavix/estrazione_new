// Import the logError function
const logError = require('./logError');


// Function to lock the main table using a check table
// It's used to prevent multiple accesses to the table

async function lockTable(airtableBase, config, checkRecord) {

    let success = false;

    if (checkRecord){

        try {  

            // Check the status of the table
            isLocked =  checkRecord.fields['Lock'] || false;

            // Check if has timed out to force the unlock
            const timeout = 10 * 1000;  // milliseconds
            let lockTimestamp = new Date(checkRecord.fields['Timestamp']).getTime();
                
            let currentTime = Date.now();
            let hasTimedOut = currentTime - lockTimestamp > timeout;

            // If it's unlocked or has timed out, lock it
            if (!isLocked || hasTimedOut){
                try {
                    await airtableBase(config.checkTable).update(checkRecord.id, {
                        Lock: true,
                        Timestamp: new Date().toISOString(),
                    });
                    success = true;

                } catch (error) {
                    console.error('Errore durante l\'aggiornamento del check record:', error.message);
                    await logError(error);
                    success = false;
                }
            }

        } catch (error) {
            await logError(error);
            console.error('Errore durante la lettura o il blocco della tabella:', error.message);
            return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
            success: false,
            };
        }
    }
    
    // Return the feedback
    if (success){
        return {
            statusCode: 200,
            success: true,
        };
    } else {
        return {
            statusCode: 500,
            success: false,
        };
    }
}

module.exports = lockTable;