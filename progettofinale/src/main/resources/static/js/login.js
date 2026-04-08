// login.js — gestisce il login dell'utente

// Se l'utente è già loggato lo mando direttamente alla dashboard
if (getUser()) {
    window.location.href = 'dashboard.html';
}

// Quando il form viene inviato
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errMsg   = document.getElementById('errMsg');

    errMsg.textContent = '';

    // Controllo campi vuoti
    if (!email || !password) {
        errMsg.textContent = 'Compila tutti i campi.';
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const user = await response.json();
            saveUser(user);
            window.location.href = 'dashboard.html';
        } else {
            errMsg.textContent = 'Email o password non corretti.';
        }
    } catch (err) {
        errMsg.textContent = 'Errore di connessione al server.';
    }
});
