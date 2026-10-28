// Pirina Informatica · Interactive Client Logic

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. Data Model for Interactive Diagnostics
  // -------------------------------------------------------------
  const diagnosticsData = {
    phone: [
      {
        id: 'p-screen',
        icon: '📱',
        title: 'Schermo rotto, righe verticali o touch non risponde',
        desc: 'Sostituzione express del gruppo display con pannelli OLED/In-Cell calibrati. Conservazione del sensore di prossimità, FaceID/TouchID e TrueTone.',
        time: '45 - 90 Minuti',
        dataSafety: 'Dati 100% al sicuro (nessun reset)',
        parts: 'Pannelli Original Grade con guarnizione IP68',
        warranty: 'Garanzia certificata 6 mesi',
        badge: 'INTERVENTO EXPRESS'
      },
      {
        id: 'p-battery',
        icon: '🔋',
        title: 'Batteria dura poche ore, si spegne al freddo o è gonfia',
        desc: 'Montaggio cella fresca a ciclo zero con test di assorbimento della scheda madre per escludere dispersioni di corrente nascoste.',
        time: '30 - 45 Minuti',
        dataSafety: 'Dati inalterati',
        parts: 'Batterie High-Capacity con chip TI certificato',
        warranty: 'Garanzia 6 mesi su tenuta carica',
        badge: 'SOSTITUZIONE RAPIDA'
      },
      {
        id: 'p-port',
        icon: '🔌',
        title: 'Cavo non fa contatto o non si ricarica più',
        desc: 'Pulizia micro-meccanica della presa con microscopio o sostituzione del connettore Type-C/Lightning dissaldato.',
        time: '1 Ora',
        dataSafety: 'Dati 100% protetti',
        parts: 'Modulo dock con microfono e antenna originali',
        warranty: 'Garanzia su aggancio e ricarica rapida',
        badge: 'LABORATORIO HARDWARE'
      },
      {
        id: 'p-liquid',
        icon: '💧',
        title: 'Caduto in acqua o liquido (mare, piscina, pioggia)',
        desc: 'Trattamento deossidante istantaneo in vasca a ultrasuoni, isolamento dei corti sui condensatori primari e verifica al termocamera.',
        time: '24 - 48 Ore',
        dataSafety: 'Massima priorità al salvataggio foto e dati',
        parts: 'Sostituzione componenti SMD ossidati',
        warranty: 'Verifica stabilità su banco prova',
        badge: 'INTERVENTO CRITICO'
      }
    ],

    laptop: [
      {
        id: 'l-ssd',
        icon: '⚡',
        title: 'Computer lentissimo, si blocca all\'avvio o disco al 100%',
        desc: 'Upgrade a disco a stato solido NVMe ad altissima velocità e clonazione speculare 1:1: ritrovi programmi, file e impostazioni identici, ma con velocità moltiplicata per 10.',
        time: 'In giornata (2-4 ore)',
        dataSafety: 'Clonazione certificata senza perdite',
        parts: 'SSD NVMe PCIe Gen3/Gen4 primari marchi',
        warranty: 'Garanzia 2 anni sul nuovo drive',
        badge: 'RIGENERAZIONE COMPLETA'
      },
      {
        id: 'l-thermal',
        icon: '🔥',
        title: 'Ventola rumorosa al massimo e portatile che scotta',
        desc: 'Smontaggio dissipatore, decontaminazione condotti d\'aria e applicazione di pasta termica ad alta conducibilità per abbattere le temperature operative fino a 25°C.',
        time: '1 - 2 Ore',
        dataSafety: 'Intervento esclusivamente hardware',
        parts: 'Compound termico Thermal Grizzly / Noctua',
        warranty: 'Test stress termico a pieno carico',
        badge: 'MANUTENZIONE PREVENTIVA'
      },
      {
        id: 'l-hinge',
        icon: '🛠️',
        title: 'Cerniere rotte, cover spaccata o schermo che dondola',
        desc: 'Ricostruzione strutturale dei supporti delle cerniere mediante saldatura molecolare e resina bicomponente, evitando la costosa sostituzione dell\'intero chassis.',
        time: '24 Ore',
        dataSafety: 'Dati protetti',
        parts: 'Ancoraggi rinforzati in acciaio/resina',
        warranty: 'Garanzia strutturale sull\'apertura',
        badge: 'RICOSTRUZIONE STRUTTURALE'
      },
      {
        id: 'l-mac',
        icon: '🍎',
        title: 'MacBook con punto interrogativo o schermo nero',
        desc: 'Diagnosi circuitale su architetture Apple (Intel e Apple Silicon M1/M2/M3), ripristino DFU del firmware, riparazione retroilluminazione display o connettori display.',
        time: '24 - 48 Ore',
        dataSafety: 'Analisi preventiva integrità APFS',
        parts: 'Componenti original spec micro-saldati',
        warranty: 'Garanzia su lavorazione scheda logica',
        badge: 'SPECIALISTICO MAC'
      }
    ],

    desktop: [
      {
        id: 'd-boot',
        icon: '⚠️',
        title: 'PC non dà segni di vita, non si accende o va in loop',
        desc: 'Diagnosi strumentale con tester per linee di alimentazione 12V/5V/3.3V, verifica rail PSU, reset CMOS hardware e collaudo banchi RAM.',
        time: '2 - 4 Ore',
        dataSafety: 'Tutti i tuoi archivi rimangono intatti',
        parts: 'Alimentatori certificati 80+ Gold / Mainboard',
        warranty: 'Garanzia completa sui ricambi',
        badge: 'DIAGNOSI ACCURATA'
      },
      {
        id: 'd-gaming',
        icon: '🎮',
        title: 'Assemblaggio PC Gaming o Workstation professionale',
        desc: 'Progettazione configurazione bilanciata, montaggio a regola d\'arte con cable management professionale, configurazione profili XMP/EXPO e curve ventole silenziose.',
        time: '24 - 48 Ore',
        dataSafety: 'Installazione pulita driver e OS ottimizzato',
        parts: 'Componenti selezionati per il tuo budget',
        warranty: 'Supporto tecnico e collaudo stabilità',
        badge: 'CUSTOM BUILD'
      },
      {
        id: 'd-bsod',
        icon: '💻',
        title: 'Schermate blu frequenti (BSOD) o crash durante il lavoro',
        desc: 'Analisi dei file minidump del crash di sistema, test approfondito della memoria con MemTest86 e stress-test della GPU per identificare il componente instabile.',
        time: '12 - 24 Ore',
        dataSafety: 'Isolamento del disco prima del test',
        parts: 'Sostituzione mirata del componente difettoso',
        warranty: 'Rapporto di stabilità allegato',
        badge: 'TEST FORENSE'
      }
    ],

    data: [
      {
        id: 'dt-hdd',
        icon: '💽',
        title: 'Hard Disk esterno fa "tac-tac", non viene letto o cade',
        desc: 'Fermare immediatamente l\'uso! Eseguiamo il recupero mediante clonazione raw a basso livello con controllo hardware dei settori danneggiati senza stressare le testine.',
        time: '1 - 3 Giorni',
        dataSafety: 'Operazioni in sola lettura su copia forense',
        parts: 'Camera pulita e ponti USB-SATA nativi',
        warranty: 'Nessun dato = Nessun costo di recupero',
        badge: 'SALVATAGGIO CRITICO'
      },
      {
        id: 'dt-usb',
        icon: '💾',
        title: 'Pennetta USB o Scheda SD chiede di essere formattata',
        desc: 'Ricostruzione della tabella delle partizioni (FAT32, NTFS, exFAT), decodifica dei blocchi NAND non accessibili e salvataggio delle fotografie e documenti.',
        time: '24 - 48 Ore',
        dataSafety: 'Riservatezza assoluta con NDA standard',
        parts: 'Lettori dedicati e controller raw',
        warranty: 'Consegna su nuovo supporto sicuro',
        badge: 'RECUPERO MEMORIE'
      },
      {
        id: 'dt-backup',
        icon: '☁️',
        title: 'Vuoi mettere al sicuro le tue foto e non perdere nulla?',
        desc: 'Configurazione di sistemi di backup automatico 3-2-1 su hard disk ridondati (RAID/NAS) e cloud cifrato, con sincronizzazione trasparente dal tuo smartphone e PC.',
        time: 'In giornata',
        dataSafety: 'Doppia copia protetta',
        parts: 'Software professionale e storage ridondato',
        warranty: 'Istruzioni chiare per il controllo periodico',
        badge: 'PREVENZIONE TOTALE'
      }
    ]
  };

  // State
  let currentCategory = 'phone';
  let currentSymptom = diagnosticsData.phone[0];

  // DOM bindings
  const categoryTabs = document.querySelectorAll('.cat-tab');
  const symptomList = document.getElementById('symptom-list');
  const solTitle = document.getElementById('sol-title');
  const solDesc = document.getElementById('sol-desc');
  const solTime = document.getElementById('sol-time');
  const solData = document.getElementById('sol-data');
  const solParts = document.getElementById('sol-parts');
  const solWarranty = document.getElementById('sol-warranty');
  const solBadge = document.getElementById('sol-badge');
  const solWhatsappBtn = document.getElementById('sol-whatsapp-btn');

  // Category switching
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category;
      currentSymptom = diagnosticsData[currentCategory][0];
      renderSymptoms();
      updateSolutionCard();
    });
  });

  function renderSymptoms() {
    symptomList.innerHTML = '';
    const items = diagnosticsData[currentCategory] || [];
    items.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.className = `symptom-btn ${item.id === currentSymptom.id ? 'active' : ''}`;
      btn.innerHTML = `
        <span class="sym-text">
          <span class="sym-icon">${item.icon}</span>
          ${item.title}
        </span>
        <span class="sym-arrow">→</span>
      `;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.symptom-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSymptom = item;
        updateSolutionCard();
      });
      symptomList.appendChild(btn);
    });
  }

  function updateSolutionCard() {
    if (!currentSymptom) return;
    solTitle.textContent = currentSymptom.title;
    solDesc.textContent = currentSymptom.desc;
    solTime.textContent = currentSymptom.time;
    solData.textContent = currentSymptom.dataSafety;
    solParts.textContent = currentSymptom.parts;
    solWarranty.textContent = currentSymptom.warranty;
    solBadge.textContent = currentSymptom.badge;

    // Generate dynamic WhatsApp Message
    const catLabels = {
      phone: 'Smartphone / Tablet',
      laptop: 'Notebook / Mac',
      desktop: 'PC Fisso / Desktop',
      data: 'Recupero Dati'
    };
    const catName = catLabels[currentCategory] || 'Dispositivo';
    const msgText = encodeURIComponent(
      `Buongiorno Pirina Informatica! Vi contatto dalla vostra pagina web per richiedere informazioni/preventivo su un ${catName}.\n` +
      `Problema riscontrato: "${currentSymptom.title}".\n` +
      `Potete darmi indicazioni su disponibilità e fattibilità dell'intervento? Grazie!`
    );
    solWhatsappBtn.href = `https://wa.me/393297245039?text=${msgText}`;
  }

  // Initial render
  renderSymptoms();
  updateSolutionCard();

  // -------------------------------------------------------------
  // 2. Interactive Repair Tracker Demo
  // -------------------------------------------------------------
  const trackerInput = document.getElementById('tracker-input');
  const trackerBtn = document.getElementById('tracker-btn');
  const trackerStatusText = document.getElementById('tracker-status-text');
  const stepItems = document.querySelectorAll('.step-item');
  const stepLines = document.querySelectorAll('.step-line');
  const demoPills = document.querySelectorAll('.pill-demo');

  if (trackerInput && trackerBtn && trackerStatusText) {
  const demoCases = {
    'PIR-842': {
      title: 'iPhone 14 Pro',
      step: 3, // In hardware repair
      status: 'Scheda <strong>PIR-842</strong>: iPhone 14 Pro — Sostituzione display OLED e sigillatura IP68 in corso al banco 1. Test finale programmato per le 17:30.'
    },
    'OLB-109': {
      title: 'Lenovo ThinkPad E15',
      step: 5, // Ready for pickup
      status: 'Scheda <strong>OLB-109</strong>: Lenovo ThinkPad — Upgrade NVMe 1TB e pulizia termica completati. Dispositivo collaudato e <strong>PRONTO AL RITIRO</strong> presso la sede di Via Roma 99.'
    }
  };

  function updateTrackerUI(code) {
    const clean = code.trim().toUpperCase();
    
    // Check PirinaStore first
    const store = window.PirinaStore;
    const liveRecord = store ? store.getRepairByCode(clean) : null;

    if (liveRecord) {
      setStepActive(Math.min(5, liveRecord.step));
      const stepMsg = liveRecord.step === 5 
        ? `Dispositivo collaudato e <strong>PRONTO AL RITIRO</strong> presso la sede di Via Roma 99.` 
        : (liveRecord.statusText || 'Lavorazione in corso.');
      trackerStatusText.innerHTML = `Scheda <strong>${liveRecord.code}</strong>: ${escapeHtml(liveRecord.deviceModel)} — ${escapeHtml(stepMsg)}`;
      return;
    }

    const match = demoCases[clean];
    if (match) {
      setStepActive(match.step);
      trackerStatusText.innerHTML = match.status;
    } else {
      // Not found
      setStepActive(1);
      trackerStatusText.innerHTML = `Scheda <strong>${clean || 'NON TROVATA'}</strong>: Nessuna riparazione associata a questo codice. Verifica il numero sulla ricevuta di Via Roma 99 o contattaci al <a href="tel:+393297245039" style="color:var(--accent-cyan); text-decoration:underline;">+39 329 724 5039</a>.`;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // React to store updates
  window.addEventListener('pirina:store-updated', () => {
    if (trackerInput && trackerInput.value) {
      updateTrackerUI(trackerInput.value);
    }
  });

  function setStepActive(activeStep) {
    stepItems.forEach((item, index) => {
      const stepNum = index + 1;
      item.classList.remove('completed', 'current');
      if (stepNum < activeStep) {
        item.classList.add('completed');
        item.querySelector('.step-circle').textContent = '✓';
      } else if (stepNum === activeStep) {
        item.classList.add('current');
        const icons = ['📥', '🔬', '⚙️', '🧪', '📦'];
        item.querySelector('.step-circle').textContent = icons[stepNum - 1] || '⚙️';
      } else {
        const icons = ['1', '2', '3', '4', '5'];
        item.querySelector('.step-circle').textContent = icons[stepNum - 1];
      }
    });

    stepLines.forEach((line, index) => {
      line.classList.toggle('active', index < activeStep - 1);
    });
  }

  trackerBtn.addEventListener('click', () => {
    updateTrackerUI(trackerInput.value || 'PIR-842');
  });

  trackerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      updateTrackerUI(trackerInput.value || 'PIR-842');
    }
  });

  demoPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const code = pill.dataset.code;
      trackerInput.value = code;
      updateTrackerUI(code);
    });
  });
  }

  // -------------------------------------------------------------
  // 3. Copy Address to Clipboard with feedback
  // -------------------------------------------------------------
  const copyAddressBtn = document.getElementById('copy-address-btn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = "Via Roma, 99, 07026 Olbia SS";
      navigator.clipboard.writeText(address).then(() => {
        const originalText = copyAddressBtn.textContent;
        copyAddressBtn.textContent = "✓ Indirizzo Copiato!";
        copyAddressBtn.style.borderColor = "var(--accent-emerald)";
        copyAddressBtn.style.color = "var(--accent-emerald)";
        setTimeout(() => {
          copyAddressBtn.textContent = originalText;
          copyAddressBtn.style.borderColor = "";
          copyAddressBtn.style.color = "";
        }, 2500);
      }).catch(() => {
        alert("Indirizzo: Via Roma, 99, 07026 Olbia SS");
      });
    });
  }

  // -------------------------------------------------------------
  // 4. Customer Support Ticketing & WhatsApp Handoff
  // -------------------------------------------------------------
  const supportTicketForm = document.getElementById('support-ticket-form');
  const supportInitialView = document.getElementById('support-initial-view');
  const supportSuccessView = document.getElementById('support-success-view');
  const ticketPillRef = document.getElementById('ticket-pill-ref');
  const ticketPillDate = document.getElementById('ticket-pill-date');
  const ticketDisplayName = document.getElementById('ticket-display-name');
  const ticketDisplayDevice = document.getElementById('ticket-display-device');
  const ticketDisplaySubject = document.getElementById('ticket-display-subject');
  const ticketWhatsAppBtn = document.getElementById('ticket-whatsapp-btn');
  const ticketNewBtn = document.getElementById('ticket-new-btn');

  if (supportTicketForm && window.PirinaStore) {
    supportTicketForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('supp-name').value.trim();
      const phone = document.getElementById('supp-phone').value.trim();
      const deviceType = document.getElementById('supp-device-type').value;
      const deviceModel = document.getElementById('supp-device-model').value.trim();
      const urgency = document.getElementById('supp-urgency').value;
      const subject = document.getElementById('supp-subject').value.trim();
      const message = document.getElementById('supp-message').value.trim();

      if (!name || !phone || !deviceModel || !subject || !message) {
        alert('Compila tutti i campi obbligatori contrassegnati con * per registrare la richiesta.');
        return;
      }

      // Crea il ticket nel PirinaStore
      const newTicket = window.PirinaStore.createTicket({
        customerName: name,
        customerPhone: phone,
        deviceType,
        deviceModel,
        urgency,
        subject,
        message
      });

      // Genera il link WhatsApp bilaterale per il cliente
      const waUrl = window.PirinaStore.buildWhatsAppTicketUrl(newTicket, 'client');

      // Popola i dati nella card di conferma
      if (ticketPillRef) ticketPillRef.textContent = newTicket.ticketRef;
      if (ticketPillDate) ticketPillDate.textContent = 'Registrato adesso';
      if (ticketDisplayName) ticketDisplayName.textContent = newTicket.customerName;
      if (ticketDisplayDevice) ticketDisplayDevice.textContent = `${newTicket.deviceType} · ${newTicket.deviceModel}`;
      if (ticketDisplaySubject) ticketDisplaySubject.textContent = newTicket.subject;
      if (ticketWhatsAppBtn) ticketWhatsAppBtn.href = waUrl;

      // Mostra la vista di conferma e nascondi quella iniziale
      if (supportInitialView) supportInitialView.style.display = 'none';
      if (supportSuccessView) {
        supportSuccessView.style.display = 'block';
        supportSuccessView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset form
      supportTicketForm.reset();
    });

    if (ticketNewBtn) {
      ticketNewBtn.addEventListener('click', () => {
        if (supportSuccessView) supportSuccessView.style.display = 'none';
        if (supportInitialView) {
          supportInitialView.style.display = 'block';
          const nameInput = document.getElementById('supp-name');
          if (nameInput) nameInput.focus();
        }
      });
    }
  }
});
