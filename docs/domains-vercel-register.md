# Domini Pirina: Register.it e Vercel

Verifica operativa: 30 ottobre 2026, 18:13:57 UTC. Project Bottega
`pirina-informatica`, id `a209f6f4-2c50-48d0-b472-b919253c26c6`.

L'indirizzo pubblico principale è **https://www.pirinainformatica.it**.
Tutti gli altri indirizzi pubblici elencati sotto restituiscono un redirect
permanente HTTP **308**, conservando percorso e query, verso questo host.

## Collegamento al progetto

- Vercel: `pirina-informatica`, scope `squirrools-projects`.
- Project id verificato: `prj_YhblSBk2AZtuDIEjEuDKFrA9Ccfp`.
- Deployment di produzione esistente: `dpl_DD7X4ZjqVQaZEKdyHhJ6bJNQEtWi`,
  `pirina-informatica-6bgeg313t-squirrools-projects.vercel.app`, stato READY.
- Associazioni e redirect configurati sui domini del progetto tramite API
  Vercel; nessun nuovo deployment del sito richiesto per il cambio DNS.
- DNS autoritativi mantenuti su `ns1.register.it` e `ns2.register.it`.

| Host | Risposta HTTPS verificata |
| --- | --- |
| www.pirinainformatica.it | 200, sito Pirina e pagina operatore |
| pirinainformatica.it | 308 al principale |
| pirina-informatica.it | 308 al principale |
| www.pirina-informatica.it | 308 al principale |
| pirina-informatica.online | 308 al principale |
| www.pirina-informatica.online | 308 al principale |
| pirina-informatica.shop | 308 al principale |
| www.pirina-informatica.shop | 308 al principale |
| pirina-informatica.vercel.app | 308 al principale |

La matrice copre `/` e `/operatore?domain_check=pirina`: 18 risposte HTTPS
verificate con validazione TLS attiva. `vercel domains verify` restituisce `ok`
per tutti i nove host. Il vecchio indirizzo pubblico Vercel è incluso nei
redirect, per consolidare anche quel punto di ingresso.

## Record DNS applicati

Per ciascuno dei quattro domini acquistati (`pirinainformatica.it`,
`pirina-informatica.it`, `pirina-informatica.online`, `pirina-informatica.shop`):

| Nome relativo | Tipo | Valore | TTL |
| --- | --- | --- | --- |
| @ | A | 216.150.1.1 | 900 |
| @ | A | 216.150.16.1 | 900 |
| www | CNAME | 00e2e062735a565f.vercel-dns-016.com. | 900 |

Valori letti dalle raccomandazioni di rango 1 dell'API Vercel per il progetto,
non derivati da una guida generica. Prima del cambio ogni apex aveva un solo
record A `195.110.124.133` e `www` era CNAME verso il proprio apex, TTL 900.
Non erano presenti record AAAA web in conflitto nelle zone lette.

Gli altri record esistenti sono stati conservati: MX `10 mail.register.it.`,
SPF `v=spf1 include:spf.webapps.net ~all`, SRV autodiscover, CNAME authsmtp,
autoconfig, ftp, pop e DKIM `key-regi001`/`key-regi002`, oltre a MX/SPF della
PEC. Nessun cambio dei nameserver o delle impostazioni DNSSEC. Le query
autoritative finali confermano A, CNAME, MX e SPF sui quattro domini.

I certificati del principale sono gestiti da Vercel. Per completare HTTPS
sugli alias sono stati emessi con `vercel certs issue` i certificati gestiti
per ciascuna coppia apex/www `.it`, `.online` e `.shop`; successivo collaudo
HTTPS e redirect interamente superato.

## Servizio richieste e accesso operatore

Il sito continua a inoltrare `/api/*` alla API condivisa esistente
`https://fraiga-websites-api.vercel.app`, posseduta dal repository Console.
Target Supabase dedicato: `whhevilmtanrdexejupp`, schema `website_support`.

Al solo sito Pirina `30000000-0000-4000-8000-000000000002` è stata aggiunta
l'origine esatta `https://www.pirinainformatica.it`, conservando le tre origini
precedenti. Aggiornamento dati con confronto dell'array originale e lettura
successiva. Nessuna migrazione, nuovo account, cambio membership o credenziale.

Controlli sul dominio definitivo:

- `/api/health`: 200, servizio website-support, target dedicato corretto.
- `/api/session` senza login e con origine del sito: 401 `login_required`.
- Stesso endpoint con origine non registrata: 403 `origin_denied`.
- Richiesta supporto vuota: 422 `invalid_support_request`, rifiutata prima
  della persistenza; nessuna richiesta cliente sintetica creata.

La pagina pubblica e `/operatore` sono raggiungibili; i dati riservati restano
protetti. Questo collaudo non ha usato credenziali operatore né letto messaggi.

## SEO, prove e limiti

Gli alias verificati non servono copie con risposta 200: rispondono 308 verso
l'host principale. Google documenta 301/308 come redirect permanenti e segnali
per la selezione della destinazione canonica. Non è stata verificata Search
Console né dichiarata un'avvenuta scansione o indicizzazione di Google.

Riferimenti ufficiali letti:

- [Domini e redirect Vercel](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting).
- [API domini di progetto Vercel](https://vercel.com/docs/rest-api/projects/add-a-domain-to-a-project).
- [Redirect e Ricerca Google](https://developers.google.com/search/docs/crawling-indexing/301-redirects).

Prove puntuali: `/Users/gio/Bottega/audit/pirina-domains-2026-10-30/`:
`verification.json`, `origin-registration.json`, screenshot delle quattro zone
prima/dopo e `pirina-live.jpg`. La prima verifica, precedente all'emissione dei
certificati alias, è distinta in `verification-before-alias-certificates.json`.
Sono prove datate dei percorsi e resolver verificati, non una garanzia su ogni
cache DNS o sul comportamento futuro. Le URL di deployment immutabili Vercel
non sono oggetto di questo collegamento dei domini pubblici.

Rollback DNS: ripristinare per ogni dominio il solo A precedente ed eliminare
il secondo A aggiunto, riportando `www` al CNAME verso il proprio apex.
Ripristinare gli abbinamenti Vercel solo dopo aver rivalutato la destinazione
voluta; l'host principale attuale è l'unica origine pubblica nuova autorizzata
sul servizio richieste. Non modificare MX/TXT o ricreare credenziali per un rollback.
