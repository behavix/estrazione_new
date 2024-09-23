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
            const now = new Date();
            // Extract the details of the day
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const today = `${day}/${month}/${year}`;
            // Get the details of the prize
            const prizeNumber = totalPrizes - prizesLeft;
            const expirationMinutes = 15;
            // Set expiration of the prize
            now.setMinutes(now.getMinutes() + expirationMinutes);
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const expiration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

            return {
                statusCode: 200,
                winning: true,
                message: 'Complimenti!\n\nHai vinto il caffè n.' + prizeNumber + ' del ' + today
                        + '.\n\nRitiralo entro le ' + expiration + '.',
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