// Import the airtableConn function
const connAirtable = require('/utils/connAirtable');
// Import the readConfig function
const readConfig = require('/utils/readConfig');
// Import the logError function
const logError = require('/utils/logError');

module.exports.handler = async function(event, context) {
    try {
        // Read config file
        const config = await readConfig('/config/config.json');

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

        // Verifica se l'ultimo record è quello di oggi, altrimenti creane uno nuovo
        if (lastRecord.length === 0 || lastRecord[0].fields.date !== today) {
            // Se la tabella è vuota o non ha ancora un record per oggi, crea un nuovo record
            return await airtableBase(config.countTable).create({
                date: today,
                prizesLeft: config.totalPrizes,
                totalPrizes: config.totalPrizes
            });
        } else {
            // Altrimenti usa quello già esistente
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
        // Ricava dati del record corrente
        let recordId = currentRecord.id;
        let prizesLeft = currentRecord.fields.prizesLeft;

        // Ricava la probabilità di vincita a partire dai dati caricati nel file json
        const probability = config.totalPrizes / config.expectedSurveys;
        // Salva il risultato casuale in una variabile booleana, sarà vera se rientra nella probabilità ricavata
        const winner = Math.random() < probability;

        // Controlla se ci sono premi rimanenti e se il numero ottenuto è vincente
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
                body: JSON.stringify({ message: 'Questa volta non hai vinto. Riprova domani!' }),
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