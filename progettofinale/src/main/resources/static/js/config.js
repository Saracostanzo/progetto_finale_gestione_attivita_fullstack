// config.js — variabili e funzioni condivise tra tutte le pagine

const BASE_URL = 'http://localhost:8080/api';

// Salva l'utente in localStorage dopo il login
function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

// Recupera l'utente salvato (restituisce null se non loggato)
function getUser() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
}

// Rimuove l'utente dal localStorage (logout)
function removeUser() {
    localStorage.removeItem('user');
}

// Formatta una data che arriva dal backend.
// Il backend restituisce LocalDateTime come array
function formatDate(val) {
    if (!val) return '—';

    if (Array.isArray(val)) {
        const [anno, mese, giorno, ore = 0, minuti = 0] = val;
        const pad = n => String(n).padStart(2, '0');
        return `${pad(giorno)}/${pad(mese)}/${anno} ${pad(ore)}:${pad(minuti)}`;
    }

    // Se è una stringa ISO (es. "2025-04-15T10:30:00")
    const d = new Date(val);
    if (isNaN(d)) return val;
    return d.toLocaleString('it-IT');
}

// Converte il valore della data in formato per input datetime-local
// L'input vuole: "yyyy-MM-ddTHH:mm"
function toInputDateTime(val) {
    if (!val) return '';

    let d;
    if (Array.isArray(val)) {
        const [anno, mese, giorno, ore = 0, minuti = 0] = val;
        d = new Date(anno, mese - 1, giorno, ore, minuti);
    } else {
        d = new Date(val);
    }

    if (isNaN(d)) return '';

    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
