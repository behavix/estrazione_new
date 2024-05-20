document.getElementById('prizeButton').addEventListener('click', () => {
    fetch('/.netlify/functions/prizeExtractor')
        .then(response => response.json())
        .then(data => {
            // Visualizza il messaggio di vincita o di non vincita
            document.getElementById("result").innerText = data.message;
        })
        .catch(error => {
            console.error('Errore:', error);
            document.getElementById("result").innerText = 'Si è verificato un errore. Riprova più tardi.';
        });
});