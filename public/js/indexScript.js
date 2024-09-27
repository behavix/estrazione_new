document.addEventListener('DOMContentLoaded', function() {
   
    const urlParams = new URLSearchParams(window.location.search);
    const validParam = urlParams.get('valid');  

    // Check if the user visits the draw page directly
    fetch('/.netlify/functions/validateUrl?valid=' + validParam)
        .then(response => response.json())
        .then(data => {
            if (data.isValid) {
                removeValidParam();
                generateToken();
            } else {
                let message = 'Devi compilare il questionario per partecipare all\'estrazione!';
                document.getElementById('thanks').innerText = message;
            }
        })    
        .catch(error => {
            console.error('Errore durante la validazione dell\'url', error);
        });
});

function generateToken() {
    fetch('/.netlify/functions/generateToken')
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(error => {
            console.error('Errore durante la generazione del token:', error);
        });
}

function removeValidParam() {
    const url = new URL(window.location.href);
    // Remove parameter 'valid'
    url.searchParams.delete('valid');
    
    // Replace url on history
    window.history.replaceState({}, document.title, url.toString());
}