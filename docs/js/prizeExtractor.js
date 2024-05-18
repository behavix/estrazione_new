// Funzione per calcolare se è stato vinto il premio
function prizeExtractor() {

    // Carica il conteggio dei premi assegnati oggi
    fetch('./data/prizes.json')
    .then(response => response.json())
    .then(prizesData => {
        var prizesAwarded = prizesData.prizes_awarded;

        // Carica il numero premi deciso per la mensa ed il numero di sondaggi stimato
        fetch('./data/probability-data.json')
        .then(response => response.json())
        .then(probabilityData => {
            var totalPrizes = probabilityData.total_prizes;
            var expectedSurveys = probabilityData.expected_surveys;

            // Ricava la probabilità di vincita a partire dai dati caricati nel file json
            var probability = totalPrizes / expectedSurveys;

            // Controlla che ci siano ancora premi disponibili 
            // e poi genera un numero casuale tra 0 e 1 confrontandolo con la probabilità ricavata
            if (prizesAwarded < totalPrizes && Math.random() < probability) {
                document.getElementById("result").innerText = "Congratulazioni! Hai vinto un caffè!";

                // Con la vincita chiama la action per incrementare la variabile dei premi assegnati 
                fetch('https://api.github.com/repos/EnMa85/estrazione-premi/actions/workflows/prizes-update/dispatches', {
                    method: 'POST',
                    headers: {
                        'Authorization': `token ${secrets.GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ref: 'main'
                    })
                })
                .then(response => {
                    if (response.ok) {
                        console.log("Workflow triggered successfully");
                    } else {
                        console.error('Error triggering workflow:', response.statusText);
                    }
                })
                .catch(error => console.error('Errore nel chiamare la GitHub Action:', error));
            } else {
                document.getElementById("result").innerText = "Non hai vinto. Ritenta la prossima volta!";
            }
        })
        .catch(error => console.error('Errore nel caricamento dei dati per il calcolo della probabilità:', error));
    })
    .catch(error => console.error('Errore nel caricamento dei dati del conteggio:', error));
}

// Aggiungi un event listener al bottone
document.getElementById("prize").addEventListener("click", prizeExtractor);                                                               