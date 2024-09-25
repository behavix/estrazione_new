// Import the logError function
const logError = require('./logError');


// Helper function to process prize drawing
async function assignPrize(airtableBase, config, currentRecord) {

    try {
        // Obtain data from the current record
        const recordId = currentRecord.id;
        const totalPrizes = currentRecord.fields.totalPrizes;
        let prizesLeft = currentRecord.fields.prizesLeft;
        
        // Check if there are still prizes
        if (prizesLeft > 0) {
            prizesLeft--;
            await airtableBase(config.countTable).update(recordId, { prizesLeft });
            
            // Get the current time
            const options = { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' };
            const now = new Date();

            // Extract the details of the day
            const today = now.toLocaleDateString('it-IT', options);

            // Get the details of the prize
            const prizeNumber = totalPrizes - prizesLeft;

            // Calculates expiration
            now.setMinutes(now.getMinutes() + 15);
            const expiration = now.toLocaleTimeString('it-IT', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit' });

            return {
                statusCode: 200,
                winning: true,
                message: 'Complimenti!\n\nHai vinto il caffè n.' + prizeNumber + ' del ' + today
                        + '.\n\nRitiralo entro le ore ' + expiration + '.',
            };
        } else {
            return {
                statusCode: 200,
                winning: false,
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

module.exports = assignPrize;