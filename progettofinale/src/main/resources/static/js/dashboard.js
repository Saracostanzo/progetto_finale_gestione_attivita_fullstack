// dashboard.js — gestisce tutta la logica della pagina principale dopo il login

// prima cosa: controllo se l'utente è loggato, altrimenti lo rimando subito al login
// getUser() è definita in config.js e legge dal localStorage
const currentUser = getUser();
if (!currentUser) {
  window.location.href = 'login.html';
}

// mostro il nome utente nella navbar in alto a destra
document.getElementById('welcomeUser').textContent = 'Ciao, ' + currentUser.username;

// qui salvo i task che mi arrivano dal server, mi serve per aprire il modal di modifica
let tasks = [];

// uso questa variabile per capire se sto creando un task nuovo o modificando uno esistente
// se è null significa "nuovo task", altrimenti contiene l'id del task da modificare
let taskIdInModifica = null;


// questa funzione carica i task dal backend
//  passiamo già i filtri nell'url come query parameters
// in questo modo è il database a filtrare più efficiente con grandi quantità di dati
async function caricaTask() {
  const stato = document.getElementById('filtroStato').value;
  const priorita = document.getElementById('filtroPriorita').value;

  // costruisco i parametri solo se l'utente ha selezionato qualcosa
  // se i select sono vuoti non aggiungo nulla e prendo tutti i task
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


// questa funzione prende la lista di task e la disegna nella tabella HTML
// la chiamo ogni volta che i dati cambiano (caricamento, creazione, modifica, eliminazione)
function mostraTask(lista) {
  const tbody = document.getElementById('taskBody');
  const emptyMsg = document.getElementById('emptyMsg');

  // svuoto la tabella prima di ridisegnarla
  tbody.innerHTML = '';

  // se non ci sono task mostro il messaggio "Nessun task trovato"
  if (lista.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  lista.forEach(function (task) {

    // uso questi oggetti per convertire il valore dell'enum in testo leggibile e classe CSS
    // es. DAFARE → "Da fare" e badge-dafare per il colore
    const statoLabel = { DAFARE: 'Da fare', INCORSO: 'In corso', COMPLETATO: 'Completato' };
    const statoClass = { DAFARE: 'badge-dafare', INCORSO: 'badge-incorso', COMPLETATO: 'badge-completato' };

    // stesso discorso per la priorità
    const prioClass = { ALTA: 'badge-alta', MEDIA: 'badge-media', BASSA: 'badge-bassa' };

    // creo la riga della tabella dinamicamente con i dati del task
    // i bottoni Modifica ed Elimina passano direttamente l'id del task
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


// chiedo conferma prima di eliminare poi chiamo l'endpoint delete del backend
// dopo l'eliminazione ricarico la lista per aggiornare la tabella
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


// apro il modal in modalità nuovo task resetto il form e metto taskIdInModifica a null
function openModal() {
  taskIdInModifica = null;
  document.getElementById('modalTitle').textContent = 'Nuovo Task';
  document.getElementById('taskForm').reset();
  document.getElementById('modalErr').textContent = '';
  document.getElementById('modal').classList.add('open');
}


// apro il modal in modalità modifica precompilo i campi con i dati del task esistente
// cerco il task nell'array tasks che ho già in memoria senza fare un'altra chiamata al server
function apriModifica(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;

  // salvo l'id così quando l'utente clicca Salva so che devo fare PUT e non POST
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


// chiudo il modal togliendo la classe CSS "open"
function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

// chiudo anche cliccando fuori dalla box del modal 
document.getElementById('modal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});


// gestisco il submit del form  questo vale sia per la creazione che per la modifica
// capisco quale operazione fare guardando taskIdInModifica
document.getElementById('taskForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const titolo = document.getElementById('inputTitolo').value.trim();
  const descrizione = document.getElementById('inputDescrizione').value.trim();
  const stato = document.getElementById('inputStato').value;
  const priorita = document.getElementById('inputPriorita').value;
  const scadenza = document.getElementById('inputScadenza').value;
  const errMsg = document.getElementById('modalErr');

  // validazione lato client
  if (!titolo && descrizione) {
    errMsg.textContent = 'Il titolo e la descrizione sono obbligatori.';
    return;
  }

  // costruisco l'oggetto da mandare al backend in formato JSON
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
      // se taskIdInModifica non è null sto modificando  uso put con l'id del task
      response = await fetch(`${BASE_URL}/tasks/${taskIdInModifica}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dati)
      });
    } else {
      // altrimenti sto creando  uso post sull'endpoint dell'utente corrente
      response = await fetch(`${BASE_URL}/users/${currentUser.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dati)
      });
    }

    if (response.ok) {
      closeModal();
      caricaTask(); // ricarico la lista per mostrare il task appena creato/modificato
    } else {
      // mostro il messaggio di errore che arriva dal backend 
      const errBody = await response.json();
      errMsg.textContent = errBody.messaggio || 'Errore durante il salvataggio.';
    }
  } catch (err) {
    errMsg.textContent = 'Errore di connessione.';
  }
});


// il logout cancella i dati dell'utente dal localStorage e rimanda al login
function logout() {
  removeUser();
  window.location.href = 'login.html';
}


// avvio: appena la pagina è pronta carico subito i task dell'utente
caricaTask();
