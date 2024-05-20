const Airtable = require('airtable');
const fs = require('fs').promises;
const path = require('path');

// Configurazione di Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base('app8M2ssxYlm1xDJu');

module.exports.handler = async function(event, context) {
    try {
        // Ricava i dati dal file di configurazione
        const configPath = path.resolve(__dirname, 'config', 'configPrizes.json');
        const configData = await fs.readFile(configPath, 'utf-8');
        const config = JSON.parse(configData);
        const totalPrizes = config.totalPrizes;
        const expectedSurveys = config.expectedSurveys;

        // Ottieni la data corrente in formato YYYY-MM-DD (la T in questo formato separa l'ora dalla data)
        const now = new Date();
        const today = now.toISOString().split('T')[0]; // 'YYYY-MM-DD'

        // Cerca il record per la data corrente
        const records = await base('PrizeCounter').select({
            filterByFormula: `{date} = '${today}'`
        }).firstPage();

        let currentRecord;
        let recordId;
        let prizesLeft;
  
        if (records.length === 0) {
            // Se non esiste un record per oggi, creane uno nuovo
            currentRecord = await base('PrizeCounter').create({
                date: today,
                prizesLeft: totalPrizes,
                totalPrizes: totalPrizes
            });
        } else {
            // Se esiste un record per oggi, usa quel record
            currentRecord = records[0];
        }
        // Ricava dati del record corrente
        recordId = currentRecord.id;
        prizesLeft = currentRecord.prizesLeft; 

        // Ricava la probabilità di vincita a partire dai dati caricati nel file json
        const probability = totalPrizes / expectedSurveys;
        // Salva il risultato casuale in una variabile booleana, sarà vera se rientra nella probabilità ricavata
        const winner = Math.random() < probability;

        // Controlla se ci sono premi rimanenti e se il numero ottenuto è vincente
        if (prizesLeft > 0 && winner) {
            prizesLeft--;
            await base('PrizeCounter').update(recordId, { prizesLeft });
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
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Errore nel sistema di estrazione dei premi.' }),
        };
    }
}