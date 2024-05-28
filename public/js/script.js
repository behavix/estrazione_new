document.getElementById('prizeButton').addEventListener('click', () => {
    fetch('/.netlify/functions/prizeHandler')
        .then(response => {
            if (!response.ok) {
                throw new Error('Il network non risponde, riprova.', response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Visualizza il messaggio di vincita o di non vincita
            document.getElementById("result").innerText = data.message;
        })
        .catch(error => {
            console.error('Errore:', error);
            document.getElementById("result").innerText = 'Si è verificato un errore. Riprova più tardi.';
        });
});