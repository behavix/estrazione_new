const Airtable = require('airtable');

// Function to connect to Airtable, receives the base ID as a parameter
async function connAirtable(airtableBase) {
    console.log(process.env.AIRTABLE_TOKEN);
    try {
        // Initialize the connection to Airtable using the credentials saved in the environment variable
        const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(airtableBase);
        console.log("ciaone arrivederci");
        return base;
    } catch (error) {
        console.error("Errore durante la connessione ad Airtable:", error);
        throw error;
    }
}

module.exports = connAirtable;
