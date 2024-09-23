// Import the logError function
const logError = require('./logError');


// Helper function to find or create today's record
async function todayRecord(airtableBase, config) {
  try {
      // Find the last record of the counting table
      const lastRecord = await airtableBase(config.countTable).select({
          maxRecords: 1,
          sort: [{ field: 'date', direction: 'desc' }]
      }).firstPage();

      // Get the current date
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

module.exports = todayRecord;