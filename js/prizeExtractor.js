// Funzione per calcolare se è stato vinto il premio
function prizeExtractor() {

    // Carica il conteggio dei premi assegnati oggi
    fetch('./prizes.json')
    .then(response => response.json())
    .then(data => {
        var prizesAwarded = data.prizes_awarded;

        // Carica il numero premi deciso per la mensa ed il numero di sondaggi stimato
        fetch('./data.json')
            .then(response => response.json())
            .then(data => {
            var totalPrizes = data.total_prizes;
            var expectedSurveys = data.expected_surveys;

            // Ricava la probabilità di vincita a partire dai dati caricati nel file json
            var probability = totalPrizes / expectedSurveys;

            // Controlla che ci siano ancora premi disponibili 
            // e poi genera un numero casuale tra 0 e 1 confrontandolo con la probabilità ricavata
            if (prizesAwarded < totalPrizes && Math.random() < probability) {
                document.getElementById("result").innerText = "Congratulazioni! Hai vinto un caffè!";           
                data.prizes_awarded++;   // incrementa la variabile dei premi assegnati
                fetch('./prizes.json', {
                    method: 'PUT',   // accede al file con il conteggio per aggiornarlo
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer BEHAVIX_TOKEN'
                    },
                    body: JSON.stringify(data),
                });
 
            } else {
                document.getElementById("result").innerText = "Non hai vinto. Ritenta la prossima volta!";
            }
        })
        .catch(error => console.error('Errore nel caricamento dei dati:', error));
    })
    .catch(error => console.error('Errore nel caricamento dei dati:', error));
}

// Aggiungi un event listener al bottone
document.getElementById("prize").addEventListener("click", prizeExtractor);                                                               