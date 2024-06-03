document.addEventListener('DOMContentLoaded', function() {
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    const validParam = urlParams.get('valid');

    // Controlla se l'utente ha già partecipato all'estrazione e tieni conto del tempo trascorso
    const resultMessage = localStorage.getItem('resultMessage');
    const timeMessage = localStorage.getItem('timeMessage');

    // Se è presente un risultato e sono passate più di 8 ore, cancellalo
    const eightHoursInMilliseconds = 8 * 60 * 60 * 1000;
    if (resultMessage && timeMessage) {
        const lastTime = parseInt(timeMessage);
        const elapsedTime = Date.now() - lastTime;
        if (elapsedTime >= eightHoursInMilliseconds) {
            localStorage.removeItem('resultMessage');
            localStorage.removeItem('timeMessage');
        }
    }

    // Se il risultato non è stato cancellato
    if (resultMessage) {
        // Visualizza il messaggio di risultato memorizzato
        document.getElementById('wheel').style.display = 'none';
        document.getElementById('wheel').style.height = 0;
        document.getElementById("result").style.display = 'block';
        document.getElementById("result").innerText = resultMessage;

    // Se l'utente accede direttamente e non tramite questionario
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
        localStorage.setItem('timeMessage', Date.now());

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