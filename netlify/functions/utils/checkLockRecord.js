// Import the logError function
const logError = require('./logError');


// Function to find or create the check record to lock/unlock the main table
// It's used to prevent multiple accesses to the table

async function checkLockRecord(airtableBase, config) {

  try {

    // Fetch the existing check record
    const records = await airtableBase(config.checkTable).select().firstPage()
    let checkRecord;

    // If a record exists, save it in a variable
    if (records.length > 0) {
      checkRecord = records[0];

    // else create one and set it as unlocked
    } else {
      try {
        checkRecord = await airtableBase(config.checkTable).create({
          Lock: false,
          Timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Errore durante la creazione del record:', error.message);
        await logError(error);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: error.message }),
        };
      } 
    }

    // Return the created/read record
    return checkRecord;

  } catch (error) {
    // Log error to Airtable
    await logError(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports = checkLockRecord;