// Pirina Informatica · Shared Store Layer (admin.store.js)
// Gestione stato unificato tra Landing Page pubblica e Dashboard Operativa

(function(window) {
  const STORAGE_KEY = 'pirina_lab_store_v1';

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getRawData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Assicurati che i ticket esistano anche se lo storage era stato creato in precedenza
        if (!parsed.tickets && window.PIRINA_DEFAULT_DATA && window.PIRINA_DEFAULT_DATA.tickets) {
          parsed.tickets = clone(window.PIRINA_DEFAULT_DATA.tickets);
          saveRawData(parsed);
        }
        return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage non accessibile o corrotto, fallback a default:', e);
    }
    const defaults = window.PIRINA_DEFAULT_DATA || { labConfig: {}, repairs: [], tickets: [] };
    saveRawData(defaults);
    return clone(defaults);
  }

  function saveRawData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('pirina:store-updated', { detail: data }));
    } catch (e) {
      console.error('Errore nel salvataggio localStorage:', e);
    }
  }

  const PirinaStore = {
    // -------------------------------------------------------------
    // Lettura & Query
    // -------------------------------------------------------------
    getAllRepairs() {
      const data = getRawData();
      return (data.repairs || []).sort((a, b) => new Date(b.checkinDate) - new Date(a.checkinDate));
    },

    getRepairByCode(code) {
      if (!code) return null;
      const clean = code.trim().toUpperCase();
      const repairs = this.getAllRepairs();
      return repairs.find(r => (r.code && r.code.toUpperCase() === clean)) || null;
    },

    getRepairById(id) {
      const repairs = this.getAllRepairs();
      return repairs.find(r => r.id === id) || null;
    },

    getStats() {
      const repairs = this.getAllRepairs();
      const tickets = this.getAllTickets();

      const active = repairs.filter(r => r.step >= 1 && r.step <= 4);
      const ready = repairs.filter(r => r.step === 5);
      const delivered = repairs.filter(r => r.step === 6);
      const pendingDiagnosis = repairs.filter(r => r.step === 1 || r.step === 2);
      
      const totalEstimatedRevenue = repairs
        .filter(r => r.step >= 1 && r.step <= 5)
        .reduce((sum, r) => sum + (Number(r.estimatedCost) || 0), 0);

      const collectedDeposits = repairs
        .reduce((sum, r) => sum + (Number(r.depositPaid) || 0), 0);

      const openTickets = tickets.filter(t => t.status === 'aperto');
      const inProgressTickets = tickets.filter(t => t.status === 'in_gestione');
      const resolvedTickets = tickets.filter(t => t.status === 'risolto');
      const convertedTickets = tickets.filter(t => t.status === 'convertito');

      return {
        total: repairs.length,
        activeCount: active.length,
        readyCount: ready.length,
        deliveredCount: delivered.length,
        pendingDiagnosisCount: pendingDiagnosis.length,
        totalEstimatedRevenue,
        collectedDeposits,
        // Support Tickets
        totalTickets: tickets.length,
        openTicketsCount: openTickets.length,
        inProgressTicketsCount: inProgressTickets.length,
        resolvedTicketsCount: resolvedTickets.length,
        convertedTicketsCount: convertedTickets.length
      };
    },

    // -------------------------------------------------------------
    // Support Tickets: Query
    // -------------------------------------------------------------
    getAllTickets() {
      const data = getRawData();
      return (data.tickets || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    getTicketByRef(ref) {
      if (!ref) return null;
      const clean = ref.trim().toUpperCase();
      const tickets = this.getAllTickets();
      return tickets.find(t => (t.ticketRef && t.ticketRef.toUpperCase() === clean)) || null;
    },

    getTicketById(id) {
      const tickets = this.getAllTickets();
      return tickets.find(t => t.id === id) || null;
    },

    // -------------------------------------------------------------
    // Support Tickets: Scrittura & Handoff
    // -------------------------------------------------------------
    createTicket(ticketInput) {
      const data = getRawData();
      data.tickets = data.tickets || [];

      // Determina codice progressivo TICK-XXX
      let maxNum = 103;
      data.tickets.forEach(t => {
        if (t.ticketRef) {
          const match = t.ticketRef.match(/TICK-(\d+)/i);
          if (match) {
            const val = parseInt(match[1], 10);
            if (val > maxNum) maxNum = val;
          }
        }
      });
      const nextRef = `TICK-${maxNum + 1}`;

      const newTicket = {
        id: 'tick-' + Date.now(),
        ticketRef: nextRef,
        customerName: (ticketInput.customerName || '').trim(),
        customerPhone: (ticketInput.customerPhone || '').trim(),
        deviceType: ticketInput.deviceType || 'Smartphone',
        deviceModel: (ticketInput.deviceModel || '').trim(),
        subject: (ticketInput.subject || '').trim(),
        message: (ticketInput.message || '').trim(),
        urgency: ticketInput.urgency || 'normale',
        status: 'aperto', // 'aperto' | 'in_gestione' | 'risolto' | 'convertito'
        createdAt: new Date().toISOString(),
        convertedRepairCode: null,
        channel: 'web+whatsapp'
      };

      data.tickets.unshift(newTicket);
      saveRawData(data);
      return newTicket;
    },

    updateTicket(id, patches) {
      const data = getRawData();
      const index = (data.tickets || []).findIndex(t => t.id === id);
      if (index === -1) return null;

      data.tickets[index] = {
        ...data.tickets[index],
        ...patches,
        updatedAt: new Date().toISOString()
      };

      saveRawData(data);
      return data.tickets[index];
    },

    updateTicketStatus(id, newStatus) {
      return this.updateTicket(id, { status: newStatus });
    },

    deleteTicket(id) {
      const data = getRawData();
      data.tickets = (data.tickets || []).filter(t => t.id !== id);
      saveRawData(data);
      return true;
    },

    // Conversione da Ticket di supporto in Scheda di riparazione banco (PIR-XXX)
    convertTicketToRepair(ticketId) {
      const ticket = this.getTicketById(ticketId);
      if (!ticket) return null;

      if (ticket.status === 'convertito' && ticket.convertedRepairCode) {
        return {
          ticket,
          repair: this.getRepairByCode(ticket.convertedRepairCode)
        };
      }

      // Crea la riparazione
      const repairRecord = {
        customerName: ticket.customerName,
        customerPhone: ticket.customerPhone,
        deviceType: ticket.deviceType,
        deviceModel: ticket.deviceModel,
        issueDescription: ticket.subject ? `${ticket.subject} — ${ticket.message}` : ticket.message,
        step: 1, // Check-in iniziale
        statusText: `Ricevuto via ticket ${ticket.ticketRef}. Apparato atteso per check-in fisico in Via Roma 99.`,
        technician: 'Andrea P.',
        internalNotes: `Generato automaticamente dal Ticket Assistenza ${ticket.ticketRef} (Urgenza: ${ticket.urgency}). Canale: ${ticket.channel}.`
      };

      const newRepair = this.createRepair(repairRecord);

      // Aggiorna lo stato del ticket
      const updatedTicket = this.updateTicket(ticketId, {
        status: 'convertito',
        convertedRepairCode: newRepair.code
      });

      return {
        ticket: updatedTicket,
        repair: newRepair
      };
    },

    // Generatore link WhatsApp per Ticket (continuazione bilaterale)
    buildWhatsAppTicketUrl(ticket, direction = 'client') {
      if (!ticket) return '#';

      if (direction === 'client') {
        // Handoff del cliente verso Andrea Pirina (+39 329 724 5039)
        const targetPhone = '393297245039';
        const msg = `Ciao Andrea (Pirina Informatica), ho appena inviato la richiesta di assistenza [Ticket #${ticket.ticketRef}] dal vostro sito web.\n\n` +
          `• Dispositivo: ${ticket.deviceModel || ticket.deviceType}\n` +
          `• Oggetto: ${ticket.subject}\n` +
          `• Dettagli: ${ticket.message}\n` +
          `• Urgenza: ${ticket.urgency}\n\n` +
          `Vorrei continuare qui su WhatsApp per aggiornamenti o per concordare la consegna in Via Roma 99.`;
        return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
      }

      if (direction === 'admin') {
        // Risposta da Andrea Pirina verso il cliente
        const cleanPhone = (ticket.customerPhone || '').replace(/[^\d+]/g, '');
        const phoneToUse = cleanPhone.startsWith('+') 
          ? cleanPhone.slice(1) 
          : (cleanPhone.startsWith('39') ? cleanPhone : '39' + cleanPhone);

        const msg = `Ciao ${ticket.customerName || 'Cliente'}, sono Andrea di Pirina Informatica (Via Roma 99, Olbia).\n\n` +
          `Ho preso in carico la tua richiesta di supporto [Ticket #${ticket.ticketRef}] per ${ticket.deviceModel || 'il tuo dispositivo'}.\n` +
          `In merito a: "${ticket.subject}"\n\n` +
          `Possiamo approfondire qui: puoi inviarmi una foto del problema o dirmi quando preferisci passare in laboratorio? Grazie!`;
        return `https://wa.me/${phoneToUse}?text=${encodeURIComponent(msg)}`;
      }

      return '#';
    },

    getConfig() {
      const data = getRawData();
      return clone(data.labConfig || {});
    },

    // -------------------------------------------------------------
    // Scrittura & Modifiche
    // -------------------------------------------------------------
    createRepair(newRecord) {
      const data = getRawData();
      data.repairs = data.repairs || [];

      // Auto-genera codice se non fornito
      if (!newRecord.code) {
        const nextNum = 855 + data.repairs.length;
        newRecord.code = `PIR-${nextNum}`;
      } else {
        newRecord.code = newRecord.code.trim().toUpperCase();
      }

      newRecord.id = 'rep-' + Date.now();
      newRecord.checkinDate = newRecord.checkinDate || new Date().toISOString();
      newRecord.step = Number(newRecord.step) || 1;
      newRecord.statusText = newRecord.statusText || 'Apparato registrato con successo. Check-in completato.';

      data.repairs.unshift(newRecord);
      saveRawData(data);
      return newRecord;
    },

    updateRepair(id, patches) {
      const data = getRawData();
      const index = (data.repairs || []).findIndex(r => r.id === id);
      if (index === -1) return null;

      data.repairs[index] = {
        ...data.repairs[index],
        ...patches,
        updatedAt: new Date().toISOString()
      };

      saveRawData(data);
      return data.repairs[index];
    },

    advanceStep(id, newStep, customStatusText) {
      const stepLabels = {
        1: 'Check-in: Ricezione apparato e registrazione scheda.',
        2: 'Diagnostica: Test strumentale banchi e verifica componentistica.',
        3: 'Lavorazione attiva al banco microscopio / saldatura.',
        4: 'Quality Control: Stress test termico e funzionale in corso.',
        5: 'Riparazione completata. PRONTO AL RITIRO in Via Roma 99.',
        6: 'Apparato consegnato al cliente con garanzia applicata.'
      };

      const patches = {
        step: Number(newStep),
        statusText: customStatusText || stepLabels[newStep] || 'Stato aggiornato.'
      };

      return this.updateRepair(id, patches);
    },

    deleteRepair(id) {
      const data = getRawData();
      data.repairs = (data.repairs || []).filter(r => r.id !== id);
      saveRawData(data);
      return true;
    },

    updateConfig(newConfig) {
      const data = getRawData();
      data.labConfig = {
        ...data.labConfig,
        ...newConfig
      };
      saveRawData(data);
      return data.labConfig;
    },

    resetToDefaults() {
      const defaults = window.PIRINA_DEFAULT_DATA || { labConfig: {}, repairs: [], tickets: [] };
      saveRawData(defaults);
      return clone(defaults);
    },

    // -------------------------------------------------------------
    // Google Reviews & Reputazione
    // -------------------------------------------------------------
    getGoogleReviews() {
      const data = getRawData();
      if (data.googleReviews) {
        return clone(data.googleReviews);
      }
      return clone((window.PIRINA_DEFAULT_DATA && window.PIRINA_DEFAULT_DATA.googleReviews) || {
        averageRating: 4.9,
        maxRating: 5.0,
        totalReviews: 194,
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Pirina+Informatica+Via+Roma+99+Olbia",
        items: []
      });
    },

    getGoogleReviewInviteUrl() {
      const r = this.getGoogleReviews();
      return r.googleMapsUrl || "https://www.google.com/maps/search/?api=1&query=Pirina+Informatica+Via+Roma+99+Olbia";
    },

    // Generatore link WhatsApp per cliente
    buildWhatsAppNotificationUrl(repair) {
      if (!repair) return '#';
      const cleanPhone = (repair.customerPhone || '').replace(/[^\d+]/g, '');
      const phoneToUse = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : (cleanPhone.startsWith('39') ? cleanPhone : '39' + cleanPhone);

      let msg = '';
      if (repair.step === 5) {
        msg = `Gentile ${repair.customerName}, le confermiamo da Pirina Informatica (Via Roma 99, Olbia) che la riparazione del suo ${repair.deviceModel} (Scheda ${repair.code}) è COMPLETATA e l'apparato è PRONTO AL RITIRO! Saldo dovuto: €${(Number(repair.estimatedCost) - Number(repair.depositPaid || 0))}. A presto!`;
      } else if (repair.step === 6) {
        msg = `Gentile ${repair.customerName}, grazie per aver ritirato il suo ${repair.deviceModel} presso Pirina Informatica (Via Roma 99, Olbia). Garanzia attiva sull'intervento. Se si è trovato bene, ci aiuterebbe tantissimo lasciando una breve recensione su Google: https://www.google.com/maps/search/?api=1&query=Pirina+Informatica+Via+Roma+99+Olbia . Grazie di cuore da Andrea!`;
      } else if (repair.step === 2) {
        msg = `Gentile ${repair.customerName}, da Pirina Informatica: abbiamo completato la diagnosi per il suo ${repair.deviceModel} (Scheda ${repair.code}). Preventivo stimato: €${repair.estimatedCost}. Ci confermi se possiamo procedere con l'intervento? Grazie!`;
      } else {
        msg = `Gentile ${repair.customerName}, da Pirina Informatica: aggiornamento per la scheda ${repair.code} (${repair.deviceModel}): ${repair.statusText}. Per info siamo in Via Roma 99 o al 329 724 5039.`;
      }

      return `https://wa.me/${phoneToUse}?text=${encodeURIComponent(msg)}`;
    }
  };

  // Esponi globalmente
  window.PirinaStore = PirinaStore;

  // Sincronizzazione automatica se un'altra scheda modifica il localStorage
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      window.dispatchEvent(new CustomEvent('pirina:store-updated', { detail: getRawData() }));
    }
  });

})(window);
