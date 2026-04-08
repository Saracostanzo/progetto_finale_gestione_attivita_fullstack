// dashboard.js — logica della pagina principale

// Se l'utente non è loggato lo rimando al login
const currentUser = getUser();
if (!currentUser) {
  window.location.href = 'login.html';
}

// Mostro il nome nella navbar
document.getElementById('welcomeUser').textContent = 'Ciao, ' + currentUser.username;

// Array con tutti i task attualmente visibili (usato per la modifica)
let tasks = [];

// ID del task in modifica (null = stiamo creando un nuovo task)
let taskIdInModifica = null;


// CARICA TASK DAL SERVER


async function caricaTask() {
  const stato = document.getElementById('filtroStato').value;
  const priorita = document.getElementById('filtroPriorita').value;

  const params = new URLSearchParams();
  if (stato) params.append('stato', stato);
  if (priorita) params.append('priorita', priorita);
  
  const queryString = params.toString();
  const url = `${BASE_URL}/users/${currentUser.id}/tasks${queryString ? '?' + queryString : ''}`;
  try {
    const response = await fetch(url);
    tasks = await response.json();
    mostraTask(tasks);
  } catch (err) {
    alert('Errore nel caricamento dei task.');
  }
}


// MOSTRA I TASK NELLA TABELLA


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


// ELIMINA UN TASK


async function eliminaTask(id) {
  if (!confirm('Sei sicuro di voler eliminare questo task?')) return;

  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      caricaTask(); // ricarico la lista
    } else {
      alert("Errore durante l'eliminazione.");
    }
  } catch (err) {
    alert('Errore di connessione.');
  }
}


// MODAL — APRI PER NUOVO TASK


function openModal() {
  taskIdInModifica = null;
  document.getElementById('modalTitle').textContent = 'Nuovo Task';
  document.getElementById('taskForm').reset();
  document.getElementById('modalErr').textContent = '';
  document.getElementById('modal').classList.add('open');
}


// MODAL — APRI PER MODIFICA


function apriModifica(id) {
  // Trovo il task nell'array già caricato
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


// MODAL — CHIUDI


function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

// Chiudo il modal cliccando fuori dalla box
document.getElementById('modal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});


// SALVA TASK (crea o modifica)


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

  // Per la modifica uso la dataCreazione originale del task, per il nuovo uso l'ora corrente
  // const dataCreazioneStr = taskIdInModifica
  //   ? toInputDateTime(tasks.find(function (t) { return t.id === taskIdInModifica; }).dataCreazione)
  //   : new Date().toISOString().slice(0, 16);

  const dati = {
    titolo: titolo,
    descrizione: descrizione,
    stato: stato,
    priorita: priorita,
    // dataCreazione: dataCreazioneStr,
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
      caricaTask(); // ricarico la lista
    } else {
      errMsg.textContent = 'Errore nel salvataggio del task.';
    }
  } catch (err) {
    errMsg.textContent = 'Errore di connessione al server.';
  }
});


// LOGOUT


function logout() {
  removeUser();
  window.location.href = 'login.html';
}


// AVVIO


// Carico i task appena la pagina è pronta
caricaTask();
