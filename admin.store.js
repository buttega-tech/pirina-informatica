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
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage non accessibile o corrotto, fallback a default:', e);
    }
    const defaults = window.PIRINA_DEFAULT_DATA || { labConfig: {}, repairs: [] };
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
      const active = repairs.filter(r => r.step >= 1 && r.step <= 4);
      const ready = repairs.filter(r => r.step === 5);
      const delivered = repairs.filter(r => r.step === 6);
      const pendingDiagnosis = repairs.filter(r => r.step === 1 || r.step === 2);
      
      const totalEstimatedRevenue = repairs
        .filter(r => r.step >= 1 && r.step <= 5)
        .reduce((sum, r) => sum + (Number(r.estimatedCost) || 0), 0);

      const collectedDeposits = repairs
        .reduce((sum, r) => sum + (Number(r.depositPaid) || 0), 0);

      return {
        total: repairs.length,
        activeCount: active.length,
        readyCount: ready.length,
        deliveredCount: delivered.length,
        pendingDiagnosisCount: pendingDiagnosis.length,
        totalEstimatedRevenue,
        collectedDeposits
      };
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
      const defaults = window.PIRINA_DEFAULT_DATA || { labConfig: {}, repairs: [] };
      saveRawData(defaults);
      return clone(defaults);
    },

    // Generatore link WhatsApp per cliente
    buildWhatsAppNotificationUrl(repair) {
      if (!repair) return '#';
      const cleanPhone = (repair.customerPhone || '').replace(/[^\d+]/g, '');
      const phoneToUse = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : (cleanPhone.startsWith('39') ? cleanPhone : '39' + cleanPhone);

      let msg = '';
      if (repair.step === 5) {
        msg = `Gentile ${repair.customerName}, le confermiamo da Pirina Informatica (Via Roma 99, Olbia) che la riparazione del suo ${repair.deviceModel} (Scheda ${repair.code}) è COMPLETATA e l'apparato è PRONTO AL RITIRO! Saldo dovuto: €${(Number(repair.estimatedCost) - Number(repair.depositPaid || 0))}. A presto!`;
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
