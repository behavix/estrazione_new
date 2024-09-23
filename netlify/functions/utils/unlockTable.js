// Import the logError function
const logError = require('./logError');


// Helper function to unlock the check table
async function unlockTable(airtableBase, config, checkRecord) {

	if (checkRecord) {

		try {
			await airtableBase(config.checkTable).update(checkRecord.id, {
				Lock: false,
				Timestamp: new Date().toISOString(),
			 });
			console.log("Tabella sbloccata con successo.");
			return {
				statusCode: 200,
			  };
		
		  } catch (unlockError) {
			await logError(unlockError);
			console.error('Errore durante lo sblocco della tabella:', unlockError.message);
		  }
		}
	}

module.exports = unlockTable;