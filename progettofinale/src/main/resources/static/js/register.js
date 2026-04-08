// register.js — gestisce la registrazione di un nuovo utente

// Se l'utente è già loggato lo mando alla dashboard
if (getUser()) {
    window.location.href = 'dashboard.html';
}

// Quando il form viene inviato
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm  = document.getElementById('confirm').value;
    const errMsg   = document.getElementById('errMsg');

    errMsg.textContent = '';

    // Controllo campi vuoti
    if (!username || !email || !password || !confirm) {
        errMsg.textContent = 'Compila tutti i campi.';
        return;
    }

    // Controllo lunghezza password
    if (password.length < 6) {
        errMsg.textContent = 'La password deve essere di almeno 6 caratteri.';
        return;
    }

    // Controllo che le due password coincidano
    if (password !== confirm) {
        errMsg.textContent = 'Le password non coincidono.';
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert('Registrazione completata! Ora puoi accedere.');
            window.location.href = 'login.html';
        } else {
            const errBody = await response.json();
            errMsg.textContent = errBody.messaggio || 'Errore durante la registrazione.';
        }
    } catch (err) {
        errMsg.textContent = 'Errore di connessione al server.';
    }
});
