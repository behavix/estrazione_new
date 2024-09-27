document.addEventListener('DOMContentLoaded', function() {
 
    const timeoutResult = 15 * 60 * 1000; // milliseconds
    const timeoutMessage =  3 * 60 * 60 * 1000
    let resultMessage = false;
    let timeMessage = false;

    /*
    if (!checkLocalStorage()){
        document.getElementById('playMsg').innerText = 'Il tuo browser non è '
        + 'abilitato al salvataggio dei dati o ti trovi su una scheda in incognito.'
        + '\n\nIl sito potrebbe non funzionare correttamente.';
    }
    */

    try {
        // Check if the user has already played and when
        resultMessage = localStorage.getItem('resultMessage');
        timeMessage = localStorage.getItem('timeMessage');

        if (resultMessage || timeMessage) {
            const lastTime = parseInt(timeMessage);
            const elapsedTime = Date.now() - lastTime;

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

    } catch (error){
        console.error('Errore durante il recupero dei dati da localStorage:', error);
        resultMessage = false;
    }

    // If the user has already played in this session,
    if (resultMessage) {
        // then display the last result
        document.getElementById('wheel').style.display = 'none';
        document.getElementById('wheel').style.height = 0;
        document.getElementById("result").style.display = 'block';
        document.getElementById("result").innerText = resultMessage;

    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        // Check if the user visits the draw page directly
        fetch(`/.netlify/functions/validateToken?token=${token}`)
        .then(response => response.json())
        .then(data => {
            // if not, allow to play
            if (data.isValid) {
                removeValidParam()
                removeToken();
                document.getElementById('wheel').style.display = 'block';
            } else {
                // else notify that they need to complete the questionnaire
                document.getElementById('thanks').style.display = 'none';
                document.getElementById('thanks').style.height = 0;
                document.getElementById("result").style.display = 'block';
                document.getElementById("result").innerText = 'Devi compilare il questionario per partecipare all\'estrazione!';
            }
        })
        .catch(error => {
            console.error('Errore durante la verifica del token:', error);
            document.getElementById("result").innerText = 'Devi compilare il questionario per partecipare all\'estrazione!';
        });
    }

    // Prevent user from going back
    history.pushState(null, null, window.location.href);
        window.onpopstate = function() {
        history.pushState(null, null, window.location.href);
    };

});

// Call the function to participate in the draw
document.getElementById('prizeButton').addEventListener('click', () => {
    document.getElementById('prizeButton').style.opacity = 0.3;
    document.getElementById('playMsg').style.display = 'none';
    document.getElementById('waitMsg').style.display = 'block';

    // Prevent user from going back
    history.pushState(null, null, window.location.href);
    window.onpopstate = function() {
        history.pushState(null, null, window.location.href);
    };

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
            try {
                // Store the result message in localStorage
                localStorage.setItem('resultMessage', message);
                localStorage.setItem('timeMessage', Date.now());
            } catch (error) {
                console.error('Errore durante il salvataggio dei dati su localStorage:', error);
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

function removeValidParam() {
    const url = new URL(window.location.href);
    // Remove parameter 'valid'
    url.searchParams.delete('valid');
    
    // Replace url on history
    window.history.replaceState({}, document.title, url.toString());

    window.location.reload();
}

function removeToken() {
    const url = new URL(window.location.href);
    // Remove token
    url.searchParams.delete('token');
    
    // Replace url on history
    window.history.replaceState({}, document.title, url.toString());
}