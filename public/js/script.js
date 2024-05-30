document.getElementById('prizeButton').addEventListener('click', () => {
    fetch('/.netlify/functions/prizeHandler')
        .then(response => {
            if (!response.ok) {
                throw new Error('Il network non risponde, riprova.', response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Nascondi il pulsante e visualizza il messaggio di vincita o di non vincita
            document.getElementById('wheel').style.display = 'none';
            document.getElementById('wheel').style.height = 0;
            document.getElementById("result").style.display = 'block';
            document.getElementById("result").innerText = data.message;
        })
        .catch(error => {
            console.error('Errore:', error);
            document.getElementById("result").innerText = 'Si è verificato un errore. Riprova più tardi.';
        });
});