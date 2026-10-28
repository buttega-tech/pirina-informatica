// Pirina Informatica · Hardcoded Admin Dataset (admin.data.js)
// Questo file costituisce il dataset iniziale preconfigurato per il laboratorio.

window.PIRINA_DEFAULT_DATA = {
  labConfig: {
    businessName: "Pirina Informatica di Pirina Andrea",
    address: "Via Roma, 99 — 07026 Olbia (SS)",
    phone: "+39 329 724 5039",
    whatsapp: "393297245039",
    email: "assistenza@pirinainformatica.it",
    openingHours: {
      weekdays: "09:00 – 13:00 / 16:00 – 19:30",
      saturday: "09:00 – 13:00",
      sunday: "Chiuso"
    },
    benches: [
      { id: 1, name: "Banco 1 · Micro-Saldatura & Smartphone", technician: "Andrea P.", status: "occupato", currentJob: "PIR-842 (iPhone 14 Pro)" },
      { id: 2, name: "Banco 2 · PC Desktop, Mac & Upgrade SSD", technician: "Andrea P.", status: "libero", currentJob: "In attesa apparato" },
      { id: 3, name: "Banco 3 · Diagnostica & Vasca Ultrasuoni", technician: "Andrea P.", status: "in-test", currentJob: "PIR-854 (Trattamento deossidante)" }
    ]
  },

  repairs: [
    {
      id: "rep-001",
      code: "PIR-842",
      customerName: "Marco Deiana",
      customerPhone: "+39 340 123 4567",
      deviceType: "Smartphone",
      deviceModel: "iPhone 14 Pro (128GB)",
      serialImei: "354892104829103",
      issueDescription: "Vetro rotto a seguito di caduta, righe verticali verdi sul display OLED. Touch screen parzialmente bloccato.",
      step: 3, // 1: Check-in, 2: Diagnosi, 3: Lavorazione, 4: QC, 5: Pronto, 6: Consegnato
      statusText: "Sostituzione display OLED e sigillatura IP68 in corso al banco 1. Test finale programmato per le 17:30.",
      estimatedCost: 180,
      depositPaid: 50,
      dataProtectionConsent: true,
      technician: "Andrea P.",
      checkinDate: "2026-10-26T10:15:00",
      targetDeliveryDate: "2026-10-27T18:00:00",
      internalNotes: "Schermo originale grado OEM arrivato. Salvaguardare TrueTone tramite programmatore e ripristinare guarnizione ermetica."
    },
    {
      id: "rep-002",
      code: "OLB-109",
      customerName: "Elena Sanna",
      customerPhone: "+39 348 765 4321",
      deviceType: "Notebook",
      deviceModel: "Lenovo ThinkPad E15 Gen 4",
      serialImei: "PF-3X92KL",
      issueDescription: "Avvio lentissimo (oltre 4 minuti), disco meccanico rumoroso al 100% fisso, temperature elevate.",
      step: 5,
      statusText: "Upgrade NVMe 1TB e pulizia termica completati. Dispositivo collaudato e PRONTO AL RITIRO presso la sede di Via Roma 99.",
      estimatedCost: 120,
      depositPaid: 0,
      dataProtectionConsent: true,
      technician: "Andrea P.",
      checkinDate: "2026-10-25T16:30:00",
      targetDeliveryDate: "2026-10-27T12:00:00",
      internalNotes: "Clonazione 1:1 riuscita su Crucial P3 Plus 1TB. Pasta termica Thermal Grizzly applicata, delta termico -22°C."
    },
    {
      id: "rep-003",
      code: "PIR-850",
      customerName: "Studio Legale Melis",
      customerPhone: "+39 0789 24891",
      deviceType: "PC Desktop",
      deviceModel: "Dell OptiPlex 7080 Workstation",
      serialImei: "DL-7080-MELIS",
      issueDescription: "Schermate blu (BSOD) frequenti con codice MEMORY_MANAGEMENT durante l'uso del gestionale.",
      step: 4,
      statusText: "Modulo RAM difettoso sostituito. Ciclo di stress test MemTest86 completato con 0 errori su 4 passaggi.",
      estimatedCost: 85,
      depositPaid: 0,
      dataProtectionConsent: true,
      technician: "Andrea P.",
      checkinDate: "2026-10-26T09:00:00",
      targetDeliveryDate: "2026-10-27T19:00:00",
      internalNotes: "Banco DDR4 16GB Kingston Fury installato. Testate 8 ore continuative sotto carico."
    },
    {
      id: "rep-004",
      code: "PIR-851",
      customerName: "Fabio Columbano",
      customerPhone: "+39 328 998 1234",
      deviceType: "MacBook",
      deviceModel: "MacBook Pro 14\" M1 Pro (2021)",
      serialImei: "C02G90XSMD6R",
      issueDescription: "Non ricarica dalle porte MagSafe e USB-C sinistre dopo sbalzo di tensione con caricatore non originale.",
      step: 3,
      statusText: "Indagine microsaldatura: chip di gestione USB-PD CD3217 surriscaldato, isolamento linea 20V.",
      estimatedCost: 220,
      depositPaid: 50,
      dataProtectionConsent: true,
      technician: "Andrea P.",
      checkinDate: "2026-10-26T14:45:00",
      targetDeliveryDate: "2026-10-28T16:00:00",
      internalNotes: "Attesa ricezione IC originale. Dati SSD intatti."
    },
    {
      id: "rep-005",
      code: "PIR-852",
      customerName: "Sara Spano",
      customerPhone: "+39 333 445 5667",
      deviceType: "Smartphone",
      deviceModel: "Samsung Galaxy S23 Ultra",
      serialImei: "359102830192849",
      issueDescription: "Batteria degradata (dura meno di 4 ore), cover posteriore leggermente scollata per rigonfiamento.",
      step: 2,
      statusText: "Scheda registrata. In attesa del ricambio batteria Samsung Service Pack originale in consegna ore 14:00.",
      estimatedCost: 75,
      depositPaid: 0,
      dataProtectionConsent: true,
      technician: "Andrea P.",
      checkinDate: "2026-10-27T08:30:00",
      targetDeliveryDate: "2026-10-27T17:30:00",
      internalNotes: "Verificare guarnizione camera perimetrale."
    },
    {
      id: "rep-006",
      code: "PIR-853",
      customerName: "Ristorante Da Pasqualino",
      customerPhone: "+39 349 112 2334",
      deviceType: "Recupero Dati",
      deviceModel: "Western Digital MyPassport 2TB",
      serialImei: "WDBYFT0020BBK",
      issueDescription: "Disco caduto dal bancone cassa. Il disco gira ma Windows chiede di formattarlo. Contiene fatture e bilanci.",
      step: 2,
      statusText: "Diagnostica forense: lettura testine 0 e 1 ok, degradazione lenta su settore MFT. Clonazione raw avviata a 25MB/s.",
      estimatedCost: 150,
      depositPaid: 50,
      dataProtectionConsent: true,
      technician: "Andrea P.",
      checkinDate: "2026-10-26T17:00:00",
      targetDeliveryDate: "2026-10-29T12:00:00",
      internalNotes: "Priorità massima contabilità. Estrarre cartella C:\\Fatture_2025-2026 prima della chiusura."
    },
    {
      id: "rep-007",
      code: "PIR-854",
      customerName: "Gianluca Mura",
      customerPhone: "+39 339 678 9012",
      deviceType: "Smartphone",
      deviceModel: "Xiaomi Redmi Note 12 Pro",
      serialImei: "864902189031234",
      issueDescription: "Caduto in acqua salata durante una battuta di pesca a Pittulongu. Spento subito.",
      step: 1,
      statusText: "Dispositivo in decontaminazione preventiva. Apertura e bagno in vasca a ultrasuoni con alcool isopropilico al 99.9%.",
      estimatedCost: 90,
      depositPaid: 30,
      dataProtectionConsent: true,
      technician: "Andrea P.",
      checkinDate: "2026-10-27T08:50:00",
      targetDeliveryDate: "2026-10-28T18:00:00",
      internalNotes: "Non alimentare prima dell'asciugatura sottovuoto a 45°C."
    },
    {
      id: "rep-008",
      code: "PIR-839",
      customerName: "Chiara Cossu",
      customerPhone: "+39 347 554 3322",
      deviceType: "Console / PC",
      deviceModel: "Sony PlayStation 5 Digital",
      serialImei: "CFI-1116B",
      issueDescription: "Spegnimento improvviso dopo 20 minuti di gioco con messaggio di surriscaldamento del sistema.",
      step: 6, // Consegnato
      statusText: "Riparazione conclusa e consegnata. Sostituzione metallo liquido APU e pulizia radiatore di scarico.",
      estimatedCost: 80,
      depositPaid: 80,
      dataProtectionConsent: true,
      technician: "Andrea P.",
      checkinDate: "2026-10-24T11:00:00",
      targetDeliveryDate: "2026-10-25T18:00:00",
      internalNotes: "Metallo liquido riposizionato con barriera sigillante in schiuma. Test Ratchet & Clank 2h ok."
    }
  ],

  tickets: [
    {
      id: "tick-101",
      ticketRef: "TICK-101",
      customerName: "Roberto Cossu",
      customerPhone: "+39 340 987 6543",
      deviceType: "MacBook",
      deviceModel: "MacBook Pro 13\" (2020)",
      subject: "Infiltrazione accidentale di caffè sulla tastiera",
      message: "Stamattina è caduta mezza tazzina di caffè sul lato destro. L'ho spento subito e non l'ho più riacceso. Si può fare pulizia ultrasuoni e recuperare i dati della tesi?",
      urgency: "alta",
      status: "aperto", // 'aperto' | 'in_gestione' | 'risolto' | 'convertito'
      createdAt: "2026-10-27T08:15:00",
      convertedRepairCode: null,
      channel: "web+whatsapp"
    },
    {
      id: "tick-102",
      ticketRef: "TICK-102",
      customerName: "Maria Giovanna Addis",
      customerPhone: "+39 349 876 5432",
      deviceType: "Tablet",
      deviceModel: "iPad Air 4th Gen",
      subject: "Preventivo sostituzione batteria che dura meno di 2 ore",
      message: "La batteria scende a zero all'improvviso appena arriva al 20%. Vorrei sapere il costo e le tempistiche di sostituzione in sede a Olbia.",
      urgency: "normale",
      status: "in_gestione",
      createdAt: "2026-10-26T17:40:00",
      convertedRepairCode: null,
      channel: "web+whatsapp"
    },
    {
      id: "tick-103",
      ticketRef: "TICK-103",
      customerName: "Cristian Pinna",
      customerPhone: "+39 333 112 2334",
      deviceType: "PC Desktop",
      deviceModel: "PC Gaming Custom (RTX 4070)",
      subject: "Consulenza assemblaggio e cablaggio cable management",
      message: "Ho ordinato i componenti della nuova build e vorrei far fare l'assemblaggio completo a regola d'arte, montaggio AIO e collaudo termico.",
      urgency: "bassa",
      status: "risolto",
      createdAt: "2026-10-25T11:20:00",
      convertedRepairCode: null,
      channel: "web+whatsapp"
    }
  ],

  googleReviews: {
    averageRating: 4.9,
    maxRating: 5.0,
    totalReviews: 194,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Pirina+Informatica+Via+Roma+99+Olbia",
    items: [
      {
        id: "rev-1",
        author: "Marco Deiana",
        initials: "MD",
        rating: 5,
        relativeTime: "1 settimana fa",
        category: "smartphone",
        device: "iPhone 14 Pro · Sostituzione Display OLED",
        text: "Portato iPhone con display completamente nero dopo una brutta caduta. Andrea ha sostituito lo schermo in meno di un'ora con pezzo di altissima qualità, conservando TrueTone e tutte le funzioni. Trasparente sul prezzo fin dal primo minuto. Consigliatissimo!",
        verified: true
      },
      {
        id: "rev-2",
        author: "Elena Sanna",
        initials: "ES",
        rating: 5,
        relativeTime: "2 settimane fa",
        category: "notebook",
        device: "ThinkPad E15 · Upgrade SSD NVMe & Termica",
        text: "Il mio notebook di lavoro impiegava 5 minuti ad avviarsi ed era diventato inutilizzabile. Clonazione su SSD veloce e pulizia ventole: ora si accende in 7 secondi esatti senza aver perso neppure un documento. Onestà e competenza rare a Olbia.",
        verified: true
      },
      {
        id: "rev-3",
        author: "Fabio Columbano",
        initials: "FC",
        rating: 5,
        relativeTime: "1 mese fa",
        category: "mac",
        device: "MacBook Pro M1 · Microsaldatura Scheda Madre",
        text: "In altri centri mi avevano detto che la scheda logica era da buttare con preventivi assurdi. Andrea ha individuato il chip di alimentazione bruciato ed eseguito una microsaldatura impeccabile. Computer resuscitato a un terzo del costo. Un vero professionista.",
        verified: true
      },
      {
        id: "rev-4",
        author: "Sara Spano",
        initials: "SS",
        rating: 5,
        relativeTime: "1 mese fa",
        category: "smartphone",
        device: "Samsung Galaxy S23 Ultra · Batteria Originale",
        text: "Sostituzione batteria in giornata con ricambio certificato. Telefono tornato all'autonomia originale di due giorni. Ottima accoglienza in Via Roma e disponibilità massima anche per spiegazioni tecniche.",
        verified: true
      },
      {
        id: "rev-5",
        author: "Ristorante Da Pasqualino",
        initials: "DP",
        rating: 5,
        relativeTime: "2 mesi fa",
        category: "storage",
        device: "Hard Disk WD 2TB · Recupero Dati Emergenza",
        text: "Il disco con tutta la contabilità e le fatture degli ultimi 3 anni è caduto ed era illeggibile. Eravamo disperati. Pirina Informatica è riuscito a clonare ed estrarre il 100% dei dati in 48 ore. Ci ha letteralmente salvato l'attività.",
        verified: true
      },
      {
        id: "rev-6",
        author: "Gianluca Mura",
        initials: "GM",
        rating: 5,
        relativeTime: "3 mesi fa",
        category: "smartphone",
        device: "Xiaomi Redmi · Trattamento Deossidante Liquidi",
        text: "Telefono caduto in acqua di mare: spento e portato subito in Via Roma. Lavaggio ultrasuoni e deossidazione hanno salvato la scheda madre e tutte le foto di famiglia che non avevo sincronizzato sul cloud. Grazie di cuore!",
        verified: true
      }
    ]
  }
};
