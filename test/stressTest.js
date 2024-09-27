async function stressTest() {
    const attempts = 100;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < attempts; i++) {
        try {
            let response = await fetch('/.netlify/functions/prizeHandler');
            if (!response.ok) {
                console.log(`Errore al tentativo ${i + 1}: ${response.statusText}`);
                failCount++;
            } else {
                let data = await response.json();
                // Verifica che il dato atteso sia corretto
                if (data.message) {
                    successCount++;
                } else {
                    console.log(`Errore al tentativo ${i + 1}: Risposta inattesa`, data);
                    failCount++;
                }
            }
        } catch (error) {
            console.error(`Errore al tentativo ${i + 1}:`, error);
            failCount++;
        }
    }

    console.log(`Test completato. Successi: ${successCount}, Fallimenti: ${failCount}`);
}

stressTest();