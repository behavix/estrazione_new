document.addEventListener('DOMContentLoaded', function() {

    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    const validParam = urlParams.get('valid');  
 
    let resultMessage = false;
    let timeMessage = false;
/*
    if (!checkLocalStorage()){
        document.getElementById('playMsg').innerText = 'Il tuo browser non è '
        + 'abilitato al salvataggio dei dati o ti trovi su una scheda in incognito.'
        + '\n\nIl sito potrebbe non funzionare correttamente.';
    }
*/
    //if (checkLocalStorage()){

    // Check if the user has already played and when
    resultMessage = localStorage.getItem('resultMessage');
    timeMessage = localStorage.getItem('timeMessage');

    if (resultMessage || timeMessage) {
        const lastTime = parseInt(timeMessage);
        const elapsedTime = Date.now() - lastTime;

        const timeoutResult = 15 * 60 * 1000; // milliseconds
        const timeoutMessage =  3 * 60 * 60 * 1000

        // If the user played more than 4 hours ago, reset the message
        if (elapsedTime >= timeoutMessage) {
            localStorage.removeItem('resultMessage');
            localStorage.removeItem('timeMessage');
            resultMessage = false;
            timeMessage = false;
            
        // If the user played more than 15 minutes, change the message
        } else if (elapsedTime >= timeoutResult) {
            resultMessage = 'Hai già partecipato all\'estrazione.';
            localStorage.setItem('resultMessage', resultMessage);
        }
    }

    //}

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

    // Prevent user from going back
    window.onpopstate = function() {
        history.go(1);
    };
});

// Call the function to participate in the draw
document.getElementById('prizeButton').addEventListener('click', () => {
    document.getElementById('prizeButton').style.opacity = 0.3;
    document.getElementById('playMsg').style.display = 'none';
    document.getElementById('waitMsg').style.display = 'block';
    fetch('/.netlify/functions/prizeHandler')
        .then(response => {
            if (!response.ok) {
                document.getElementById('result').innerText = 'Si è verificato un errore. Riprova più tardi.';
                throw new Error('Il network non risponde, riprova.', response.statusText);
            }
            return response.json();
    })
    .then(data => {
        let message = data.message;
        if (checkLocalStorage){
            // Store the result message in localStorage
            localStorage.setItem('resultMessage', message);
            localStorage.setItem('timeMessage', Date.now());
        }   

        // Hide the button and display the result message
        document.getElementById('wheel').style.display = 'none';
        document.getElementById('wheel').style.height = 0;
        document.getElementById('result').style.display = 'block';
        document.getElementById('result').innerText = message;
    })
    
    .catch(error => {
        console.error('Errore:', error);
        document.getElementById('result').innerText = 'Si è verificato un errore. Riprova più tardi.';
    });

    // Prevent user from going back
    window.onpopstate = function() {
        history.go(1);
    };
});


// Local storage test
function checkLocalStorage() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');

        const test = localStorage.getItem('test');
        const storage = test ? true : false;
        return storage;
    } catch (e) {
        return false;
    }
}