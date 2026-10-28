# Pirina Informatica · Web App & Operational Lab Desk

> **Percorso locale:** `/Users/gio/Bottega/projects/customers/pirina-informatica`  
> **Alias:** `projects/customers/pirina infomatica`  
> **Cliente:** Pirina Informatica di Pirina Andrea — Olbia (SS)  
> **Sede:** Via Roma, 99 — 07026 Olbia (SS) | Tel: +39 329 724 5039  
> **GitHub Repository:** [https://github.com/buttega-tech/pirina-informatica](https://github.com/buttega-tech/pirina-informatica)  
> **Live Production URL:** [https://pirina-informatica.vercel.app](https://pirina-informatica.vercel.app)  
> **Admin Desk URL:** [https://pirina-informatica.vercel.app/admin](https://pirina-informatica.vercel.app/admin)  

---

## Integrazione locale delle richieste di supporto

Il servizio Bottega per Pirina comprende sito e raccolta delle richieste:
il mittente non diventa un account o un cliente Bottega. Il backend locale
condiviso risiede nel progetto `console-buttega`. Avviandovi `npm run sites:local`,
il sito è disponibile su `http://127.0.0.1:8786/pirina/` e la casella riservata
a Pirina su `http://127.0.0.1:8786/support/pirina-informatica`.

Quel percorso carica `support.client.js` al posto dello store dimostrativo:
salva le richieste sul server, attende conferma e riusa lo stesso riferimento
in caso di retry. Non collega tracker o laboratorio e non crea una contabilità.
Il sito statico precedente descritto sotto mantiene il suo comportamento fino
a una successiva attivazione esplicita. Nessun deployment è implicito.

Il dettaglio dell'avvio, degli account di prova e dell'importazione dei soli
ticket si trova in `console-buttega/docs/pirina-support-local.md`.

---

## 1. Architettura della Web App

L'applicazione unisce due ambienti sincronizzati in tempo reale:

1. **Frontend Pubblico (`index.html`)**:
   - Landing page ad alto impatto con design "Cyber Lab" dark mode.
   - Diagnostica Interattiva dei guasti con selettore categorie (*Smartphone, Notebook, PC Fisso, Recupero Dati*).
   - Generatore rapido di preventivo via WhatsApp con messaggio precompilato.
   - **Live Repair Tracker**: ricerca lo stato di lavorazione del dispositivo inserendo il codice scheda rilasciato in sede.

2. **Dashboard Operativa di Laboratorio (`admin.html` / `/admin`)**:
   - Desk di gestione per il tecnico/titolare.
   - **Metriche KPI Live**: schede attive, in lavorazione sui banchi, pronte al ritiro, incasso totale previsto.
   - **Tabella Schede di Riparazione**: ricerca per cliente, codice, apparato; filtri rapidi per stato (*Check-in, Diagnosi, Lavorazione, QC, Pronto al Ritiro, Consegnato*).
   - **Avanzamento Rapido**: pulsante per far avanzare lo step del lavoro con un clic.
   - **Notifica WhatsApp Cliente**: apre WhatsApp con messaggio preformattato su misura per lo stato corrente dell'apparato (es. avviso di pronto ritiro con saldo).
   - **Creazione / Modifica Scheda**: modal con codice auto-generato (`PIR-XXX`), acconto versato e note di banco.
   - **Stato Banchi di Lavoro**: monitoraggio visivo dei 3 banchi di laboratorio (Microsaldatura, Assemblaggio PC/Mac, Diagnostica/Ultrasuoni).
   - **Reset Dati**: possibilità di ripristinare il dataset hardcoded predefinito.

---

## 2. Setup Dati (`admin.*`)

- **`admin.data.js`**: dataset hardcoded iniziale contenente schede riparazione realistiche (`PIR-842`, `OLB-109`, `PIR-850`, `PIR-851`, `PIR-852`, `PIR-853`, `PIR-854`, `PIR-839`), configurazione del laboratorio e dei banchi di lavoro.
- **`admin.store.js`**: layer di storage reattivo che sincronizza `admin.data.js` con `localStorage` (`pirina_lab_store_v1`) e propaga gli eventi in tempo reale tra le schede del browser (`storage` event). Se il tecnico aggiorna una scheda nell'admin, il tracker pubblico si aggiorna all'istante!
- **`admin.js`**: logica dell'interfaccia operativa.
- **`admin.css`**: design system specifico per il desk tecnico.

---

## 3. Struttura dei File

```
projects/customers/pirina-informatica/
├── index.html        # Landing page pubblica con Live Tracker
├── style.css         # Stile Cyber Lab landing
├── app.js            # Controller interattivo pubblico
├── admin.html        # Dashboard operativa di laboratorio (/admin)
├── admin.css         # Stile dashboard desk
├── admin.js          # Controller operativo dashboard
├── admin.data.js     # Dataset iniziale hardcoded
├── admin.store.js    # Store layer unificato & sync reattivo
├── vercel.json       # Configurazione rewrite /admin e security headers
├── package.json      # Manifest applicazione
└── README.md         # Documentazione
```

---

## 4. Comandi Utili

```sh
# Anteprima locale
open index.html
open admin.html

# Avvio server locale
npm run dev # oppure: npx serve . -l 3030
```
