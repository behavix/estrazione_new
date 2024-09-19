// Import the airtableConn function
const connAirtable = require('./utils/connAirtable');
// Import the readConfig function
const readConfig = require('./utils/readConfig');
// Import the logError function
const logError = require('./utils/logError');

module.exports.handler = async function(event, context) {
    try {
        // Read config file
        console.log('Reading configuration...');
        const config = await readConfig('../config/config.json');
        console.log('Configuration read:', config);

        // Airtable connection
        const airtableBase = await connAirtable(config.airtableBase); 
        
        // Find or create today's record
        const currentRecord = await currentRecordFinder(airtableBase, config);

        // Process prize drawing
        const response = await prizeExtractor(airtableBase, config, currentRecord);

        return response;
       
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

// Helper function to find or create today's record
async function currentRecordFinder(airtableBase, config) {
    try {
        // Find the last record of the counting table
        const lastRecord = await airtableBase(config.countTable).select({
            maxRecords: 1,
            sort: [{ field: 'date', direction: 'desc' }]
        }).firstPage();

        // Get current date
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        // Check if the last record is today's, otherwise create a new one
        if (lastRecord.length === 0 || lastRecord[0].fields.date !== today) {
            // If the table is empty or doesn't have a record for today yet, create a new record
            return await airtableBase(config.countTable).create({
                date: today,
                prizesLeft: config.totalPrizes,
                totalPrizes: config.totalPrizes
            });
        } else {
            // Otherwise, use the existing one
            return lastRecord[0];
        }
    } catch (error) {
        console.error('Errore:', error);
        await logError(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Si è verificato un errore.' }),
        };
    }
}

// Helper function to process prize drawing
async function prizeExtractor(airtableBase, config, currentRecord) {
    try {
        // Obtain data from the current record
        let recordId = currentRecord.id;
        let prizesLeft = currentRecord.fields.prizesLeft;

        // Obtain the winning probability from the data loaded in the JSON file
        const probability = config.totalPrizes / config.expectedSurveys;
        // Generate a random number, check if it falls within the probability
        // and save the result in a boolean variable
        const winner = Math.random() < probability;

        // Check if there are still prizes and if the obtained value is winning
        if (prizesLeft > 0 && winner) {
            prizesLeft--;
            await airtableBase(config.countTable).update(recordId, { prizesLeft });
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Complimenti, hai vinto un caffè!' }),
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Questa volta non hai vinto.\n\nRiprova domani!' }),
            };
        }
    } catch (error) {
        console.error('Errore:', error);
        await logError(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Si è verificato un errore.' }),
        };
    }
}