# TaskFlow
### Applicazione Web Fullstack per la Gestione delle Attività

> **Frontend:** Sara Costanzo &nbsp;|&nbsp; **Backend:** Eleonora D'Aniello &nbsp;|&nbsp; A.A. 2025/2026

---

## Panoramica

TaskFlow è un'applicazione web fullstack per la gestione personale delle attività. Permette agli utenti di registrarsi, accedere, creare task, modificarli, eliminarli e filtrarli per stato e priorità.

| | |
|---|---|
| **Porta backend** | http://localhost:8080 |
| **Porta frontend** | http://localhost:5501 (Live Server) |
| **Database** | PostgreSQL — schema `progettoFinale` |

---

## Stack Tecnologico

### Frontend — Sara Costanzo
- **HTML5** — struttura delle pagine (login, registrazione, dashboard)
- **CSS3** — stile personalizzato, layout Flexbox, badge colorati per stato e priorità
- **JavaScript ES6+** — Vanilla JS, Fetch API, `localStorage` per la sessione utente

### Backend — Eleonora D'Aniello
- **Java 21**
- **Spring Boot 4.0.5** — framework principale
- **Spring MVC** — gestione richieste HTTP tramite `@RestController`
- **Spring Data JPA + Hibernate ORM 7** — persistenza e mapping oggetti ↔ tabelle
- **Jakarta Bean Validation** — validazione DTO con `@Email`, `@NotBlank`, `@NotNull`, `@Positive`
- **Lombok** — riduzione del boilerplate (getter, setter, costruttori)
- **PostgreSQL** — database relazionale, schema gestito automaticamente da Hibernate (`ddl-auto=update`)

---

## Dipendenze Maven

```xml
<!-- pom.xml — Spring Boot 4.0.5, Java 21 -->

spring-boot-starter-data-jpa       <!-- JPA + Hibernate per PostgreSQL -->
spring-boot-starter-validation     <!-- Jakarta Bean Validation per i DTO -->
spring-boot-starter-webmvc         <!-- Spring MVC per le REST API -->
spring-boot-devtools               <!-- Hot reload in sviluppo (scope: runtime) -->
postgresql                         <!-- Driver JDBC (scope: runtime) -->
lombok                             <!-- Getter/setter automatici (scope: optional) -->
spring-boot-starter-test           <!-- JUnit 5 + Mockito + Spring Test (scope: test) -->
```

---

## Struttura del Progetto

```
progettofinale/
├── src/main/java/it/itconsulting/progettofinale/
│   ├── controller/
│   │   ├── TaskController.java        REST controller per i task
│   │   └── UserController.java        REST controller per gli utenti
│   ├── dto/
│   │   ├── LoginDto.java              Dati login (email + password)
│   │   ├── TaskDto.java               Dati task con validazione
│   │   └── UserDto.java               Dati registrazione utente
│   ├── enumerazioni/
│   │   ├── Priorita.java              Enum: ALTA, MEDIA, BASSA
│   │   └── Stato.java                 Enum: DAFARE, INCORSO, COMPLETATO
│   ├── model/
│   │   ├── Errore.java                Modello risposta di errore
│   │   ├── Task.java                  Entità JPA task (@ManyToOne User)
│   │   └── User.java                  Entità JPA utente (@OneToMany Tasks)
│   ├── repository/
│   │   ├── TaskRepository.java        JpaRepository + query per userId, stato, priorità
│   │   └── UserRepository.java        JpaRepository + findByEmail
│   ├── service/
│   │   ├── TaskService.java           Business logic task (CRUD)
│   │   └── UserService.java           Business logic utenti (login/register)
│   └── ProgettofinaleApplication.java
│
├── src/main/resources/
│   ├── static/
│   │   ├── css/style.css              Stili globali
│   │   ├── js/config.js               BASE_URL, getUser(), formatDate(), logout()
│   │   ├── js/login.js                Logica pagina login
│   │   ├── js/register.js             Logica pagina registrazione
│   │   ├── js/dashboard.js            Logica dashboard (CRUD task + filtri server-side)
│   │   ├── login.html
│   │   ├── register.html
│   │   └── dashboard.html
│   ├── application.properties         Configurazione DB e JPA
│   └── env.properties                 Password PostgreSQL (escluso da Git)
│
├── pom.xml
└── .gitignore
```

---

## API REST

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `POST` | `/api/users/register` | Registra un nuovo utente |
| `POST` | `/api/users/login` | Autentica l'utente, restituisce oggetto User |
| `GET` | `/api/users/{id}/tasks` | Recupera i task dell'utente (supporta `?stato=` e `?priorita=`) |
| `POST` | `/api/users/{id}/tasks` | Crea un nuovo task per l'utente |
| `PUT` | `/api/tasks/{id}` | Aggiorna titolo, descrizione, stato, priorità e scadenza |
| `DELETE` | `/api/tasks/{id}` | Elimina il task |

Tutti gli endpoint accettano e restituiscono **JSON**.
CORS abilitato per `http://localhost:5501` e `http://127.0.0.1:5501`.

---

## Modello dei Dati

### User
| Campo | Tipo | Note |
|-------|------|------|
| `id` | `Long` | Chiave primaria, generata automaticamente |
| `username` | `String` | `@NotBlank` |
| `email` | `String` | `@Email @NotBlank` |
| `password` | `String` | `@NotBlank` |
| `tasks` | `List<Task>` | `@OneToMany` — `@JsonIgnore` per evitare cicli |

### Task
| Campo | Tipo | Note |
|-------|------|------|
| `id` | `Long` | Chiave primaria, generata automaticamente |
| `titolo` | `String` | `@NotBlank` |
| `descrizione` | `String` | Opzionale |
| `stato` | `Stato` | `DAFARE \| INCORSO \| COMPLETATO` — `@Enumerated(STRING)` |
| `priorita` | `Priorita` | `ALTA \| MEDIA \| BASSA` — `@Enumerated(STRING)` |
| `dataCreazione` | `LocalDateTime` | Impostata automaticamente dal service |
| `dataScadenza` | `LocalDateTime` | Opzionale |
| `user` | `User` | `@ManyToOne` — utente proprietario del task |

---

## Configurazione

**`src/main/resources/application.properties`**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/progettoFinale
spring.datasource.username=postgres
spring.datasource.password=${env.PASSWORD_POSTGRES}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.default_schema=public
```

**`src/main/resources/env.properties`** _(non versionato — va creato localmente)_
```properties
env.PASSWORD_POSTGRES=LA_TUA_PASSWORD_POSTGRESQL
```

---

## Come Avviare il Progetto

### Prerequisiti
- Java 21 installato (`java -version` per verificare)
- PostgreSQL attivo con database `progettoFinale` creato
- File `env.properties` presente con la password corretta
- VS Code con estensione **Live Server**

### 1. Crea il database (solo la prima volta)
```sql
CREATE DATABASE "progettoFinale";
```

### 2. Avvia il backend
```bash
cd progetto_finale_gestione_attivita_fullstack/progettofinale
.\mvnw.cmd spring-boot:run
```
Il server parte su `http://localhost:8080`. Hibernate crea le tabelle automaticamente al primo avvio.

### 3. Avvia il frontend
Aprire la cartella `src/main/resources/static/` in VS Code, click destro su `login.html` → **Open with Live Server**.
Il browser si apre su `http://localhost:5501/login.html`.

---

## Note su Git e Sicurezza

Il file `env.properties` è nel `.gitignore` perché contiene la password del database.
**Dopo aver clonato il repository** è necessario crearlo manualmente:

```bash
# src/main/resources/env.properties
env.PASSWORD_POSTGRES=la_tua_password
```

**Elementi esclusi da Git:**
- `src/main/resources/env.properties` — credenziali database
- `target/` — cartella di build Maven
- `.idea/` e `*.iml` — configurazioni IDE
