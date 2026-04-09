// dashboard.js — logica della pagina principale

// Se l'utente non è loggato lo rimando al login
const currentUser = getUser();
if (!currentUser) {
  window.location.href = 'login.html';
}

// Mostro il nome nella navbar
document.getElementById('welcomeUser').textContent = 'Ciao, ' + currentUser.username;

// Lista completa dei task ricevuta dal server (senza filtri)
let tuttiITask = [];

// Lista attualmente visibile dopo i filtri (usata anche da apriModifica)
let tasks = [];

// ID del task in modifica (null = stiamo creando un nuovo task)
let taskIdInModifica = null;


// ─── CARICA TASK DAL SERVER ───────────────────────────────────────────────────
// Recupera TUTTI i task dell'utente, poi applica i filtri client-side.

async function caricaTask() {
  const url = `${BASE_URL}/users/${currentUser.id}/tasks`;
  try {
    const response = await fetch(url);
    tuttiITask = await response.json();
    filtraTask();
  } catch (err) {
    alert('Errore nel caricamento dei task.');
  }
}


// ─── FILTRA LATO CLIENT ───────────────────────────────────────────────────────
// Legge i valori dei select e filtra tuttiITask senza fare nuove chiamate.

function filtraTask() {
  const stato = document.getElementById('filtroStato').value;
  const priorita = document.getElementById('filtroPriorita').value;

  tasks = tuttiITask.filter(function (t) {
    return (!stato || t.stato === stato) &&
           (!priorita || t.priorita === priorita);
  });

  mostraTask(tasks);
}


// ─── MOSTRA I TASK NELLA TABELLA ─────────────────────────────────────────────

function mostraTask(lista) {
  const tbody = document.getElementById('taskBody');
  const emptyMsg = document.getElementById('emptyMsg');

  tbody.innerHTML = '';

  if (lista.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  lista.forEach(function (task) {

    // Testo e classe CSS per il badge stato
    const statoLabel = { DAFARE: 'Da fare', INCORSO: 'In corso', COMPLETATO: 'Completato' };
    const statoClass = { DAFARE: 'badge-dafare', INCORSO: 'badge-incorso', COMPLETATO: 'badge-completato' };

    // Testo e classe CSS per il badge priorità
    const prioClass = { ALTA: 'badge-alta', MEDIA: 'badge-media', BASSA: 'badge-bassa' };

    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + task.titolo + '</td>' +
      '<td><span class="badge ' + (statoClass[task.stato] || '') + '">' + (statoLabel[task.stato] || task.stato) + '</span></td>' +
      '<td><span class="badge ' + (prioClass[task.priorita] || '') + '">' + task.priorita + '</span></td>' +
      '<td>' + formatDate(task.dataScadenza) + '</td>' +
      '<td class="row-actions">' +
      '<button class="btn-edit"   onclick="apriModifica(' + task.id + ')">Modifica</button>' +
      '<button class="btn-danger" onclick="eliminaTask(' + task.id + ')">Elimina</button>' +
      '</td>';

    tbody.appendChild(tr);
  });
}


// ─── ELIMINA UN TASK ─────────────────────────────────────────────────────────

async function eliminaTask(id) {
  if (!confirm('Sei sicuro di voler eliminare questo task?')) return;

  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      caricaTask();
    } else {
      alert("Errore durante l'eliminazione.");
    }
  } catch (err) {
    alert('Errore di connessione.');
  }
}


// ─── MODAL — APRI PER NUOVO TASK ─────────────────────────────────────────────

function openModal() {
  taskIdInModifica = null;
  document.getElementById('modalTitle').textContent = 'Nuovo Task';
  document.getElementById('taskForm').reset();
  document.getElementById('modalErr').textContent = '';
  document.getElementById('modal').classList.add('open');
}


// ─── MODAL — APRI PER MODIFICA ───────────────────────────────────────────────

function apriModifica(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;

  taskIdInModifica = task.id;

  document.getElementById('modalTitle').textContent = 'Modifica Task';
  document.getElementById('inputTitolo').value = task.titolo;
  document.getElementById('inputDescrizione').value = task.descrizione || '';
  document.getElementById('inputStato').value = task.stato;
  document.getElementById('inputPriorita').value = task.priorita;
  document.getElementById('inputScadenza').value = toInputDateTime(task.dataScadenza);
  document.getElementById('modalErr').textContent = '';

  document.getElementById('modal').classList.add('open');
}


// ─── MODAL — CHIUDI ──────────────────────────────────────────────────────────

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

// Chiudo il modal cliccando fuori dalla box
document.getElementById('modal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});


// ─── SALVA TASK (crea o modifica) ────────────────────────────────────────────

document.getElementById('taskForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const titolo = document.getElementById('inputTitolo').value.trim();
  const descrizione = document.getElementById('inputDescrizione').value.trim();
  const stato = document.getElementById('inputStato').value;
  const priorita = document.getElementById('inputPriorita').value;
  const scadenza = document.getElementById('inputScadenza').value;
  const errMsg = document.getElementById('modalErr');

  if (!titolo) {
    errMsg.textContent = 'Il titolo è obbligatorio.';
    return;
  }

  const dati = {
    titolo: titolo,
    descrizione: descrizione,
    stato: stato,
    priorita: priorita,
    dataScadenza: scadenza || null,
    userId: currentUser.id
  };

  try {
    let response;

    if (taskIdInModifica) {
      // Modifica task esistente
      response = await fetch(`${BASE_URL}/tasks/${taskIdInModifica}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dati)
      });
    } else {
      // Crea nuovo task
      response = await fetch(`${BASE_URL}/users/${currentUser.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dati)
      });
    }

    if (response.ok) {
      closeModal();
      caricaTask();
    } else {
      const errBody = await response.json();
      errMsg.textContent = errBody.messaggio || 'Errore durante il salvataggio.';
    }
  } catch (err) {
    errMsg.textContent = 'Errore di connessione.';
  }
});


// ─── LOGOUT ──────────────────────────────────────────────────────────────────

function logout() {
  removeUser();
  window.location.href = 'login.html';
}


// ─── AVVIO ───────────────────────────────────────────────────────────────────

caricaTask();
