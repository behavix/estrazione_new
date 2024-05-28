const Airtable = require('airtable');

// Funzione per connettersi ad Airtable, riceve come parametro l'id della base
async function connAirtable(airtableBase) {
    try {
        // Inizializza la connessione ad Airtable utilizzando le credenziali nella variabile d'ambiente
        const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(airtableBase);
        return base;
    } catch (error) {
        console.error("Errore durante la connessione ad Airtable:", error);
        throw error;
    }
}

module.exports = connAirtable;