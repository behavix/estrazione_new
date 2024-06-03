document.addEventListener('DOMContentLoaded', function() {
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    const validParam = urlParams.get('valid');

    // Controlla se l'utente ha già partecipato all'estrazione
    const resultMessage = localStorage.getItem('resultMessage');

    if (resultMessage) {
        // Visualizza il messaggio di risultato memorizzato
        document.getElementById('wheel').style.display = 'none';
        document.getElementById('wheel').style.height = 0;
        document.getElementById("result").style.display = 'block';
        document.getElementById("result").innerText = resultMessage;

    } else if (!referrer || !validParam || validParam !== 'true') {
        // Visualizza il messaggio di questionario non compilato
        document.getElementById('thanks').style.display = 'none';
        document.getElementById('thanks').style.height = 0;
        document.getElementById('wheel').style.display = 'none';
        document.getElementById('wheel').style.height = 0;
        document.getElementById("result").style.display = 'block';
        document.getElementById("result").innerText = 'Devi compilare il questionario per partecipare all\'estrazione!';
    }

    // Rimuovi il parametro URL
    history.replaceState({}, document.title, window.location.pathname);
});


document.getElementById('prizeButton').addEventListener('click', () => {
    fetch('/.netlify/functions/prizeHandler')
        .then(response => {
            if (!response.ok) {
                throw new Error('Il network non risponde, riprova.', response.statusText);
            }
            return response.json();
    })
    .then(data => {
        // Memorizza il messaggio di risultato nel localStorage
        localStorage.setItem('resultMessage', data.message);

        // Nascondi il pulsante e visualizza il messaggio di vincita o di non vincita
        document.getElementById('wheel').style.display = 'none';
        document.getElementById('wheel').style.height = 0;
        document.getElementById("result").style.display = 'block';
        document.getElementById("result").innerText = data.message;

        // Sostituisci l'URL nella cronologia del browser con l'URL della landing page
        const landingPageURL = window.location.origin + '/landing-page.html';
        history.pushState({}, document.title, landingPageURL);
    })
    .catch(error => {
        console.error('Errore:', error);
        document.getElementById("result").innerText = 'Si è verificato un errore. Riprova più tardi.';
    });
});