document.addEventListener('DOMContentLoaded', function() {
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    const validParam = urlParams.get('valid');

    // Check if the user has already played and when
    const resultMessage = localStorage.getItem('resultMessage');
    const timeMessage = localStorage.getItem('timeMessage');

    // If the user played more than 4 hours ago, reset the result
    const eightHoursInMilliseconds = 4 * 60 * 60 * 1000;
    if (resultMessage && timeMessage) {
        const lastTime = parseInt(timeMessage);
        const elapsedTime = Date.now() - lastTime;
        if (elapsedTime >= eightHoursInMilliseconds) {
            localStorage.removeItem('resultMessage');
            localStorage.removeItem('timeMessage');
        }
    }

    // If the user has already played in this session,
    if (resultMessage) {
        // then display the last result
        document.getElementById('wheel').style.display = 'none';
        document.getElementById('wheel').style.height = 0;
        document.getElementById("result").style.display = 'block';
        document.getElementById("result").innerText = resultMessage;

    // If the user visits the draw page directly,
    } else if (!referrer || !validParam || validParam !== 'true') {
        // then notify that they need to complete the questionnaire
        document.getElementById('thanks').style.display = 'none';
        document.getElementById('thanks').style.height = 0;
        document.getElementById('wheel').style.display = 'none';
        document.getElementById('wheel').style.height = 0;
        document.getElementById("result").style.display = 'block';
        document.getElementById("result").innerText = 'Devi compilare il questionario per partecipare all\'estrazione!';
    }

    // Keep the page unchanged in case of reload
    history.replaceState({}, document.title, window.location.pathname);
});


// Call the function to participate in the draw
document.getElementById('prizeButton').addEventListener('click', () => {
    fetch('/.netlify/functions/prizeHandler')
        .then(response => {
            if (!response.ok) {
                throw new Error('Il network non risponde, riprova.', response.statusText);
            }
            return response.json();
    })
    .then(data => {
        // Store the result message in localStorage
        localStorage.setItem('resultMessage', data.message);
        localStorage.setItem('timeMessage', Date.now());

        // Hide the button and display the result message
        document.getElementById('wheel').style.display = 'none';
        document.getElementById('wheel').style.height = 0;
        document.getElementById("result").style.display = 'block';
        document.getElementById("result").innerText = data.message;

        // Prevent the page from reloading
        const landingPageURL = window.location.origin + '/landing-page.html';
        history.pushState({}, document.title, landingPageURL);
    })
    .catch(error => {
        console.error('Errore:', error);
        document.getElementById("result").innerText = 'Si è verificato un errore. Riprova più tardi.';
    });
});