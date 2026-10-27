// Pirina Informatica · Operational Dashboard Logic (admin.js)

document.addEventListener('DOMContentLoaded', () => {
  const store = window.PirinaStore;
  if (!store) {
    console.error('PirinaStore non trovato!');
    return;
  }

  // State
  let currentFilter = 'all';
  let searchQuery = '';
  let activeModalRepair = null;

  // DOM Elements
  const kpiTotal = document.getElementById('kpi-total');
  const kpiActive = document.getElementById('kpi-active');
  const kpiReady = document.getElementById('kpi-ready');
  const kpiRevenue = document.getElementById('kpi-revenue');
  const repairsTableBody = document.getElementById('repairs-table-body');
  const searchInput = document.getElementById('dash-search-input');
  const filterTabs = document.querySelectorAll('.f-tab');
  const clockEl = document.getElementById('dash-clock');

  // Modals
  const repairModal = document.getElementById('repair-modal');
  const modalClose = document.getElementById('modal-close');
  const modalCancel = document.getElementById('modal-cancel');
  const repairForm = document.getElementById('repair-form');
  const modalTitle = document.getElementById('modal-title');
  const btnNewRepair = document.getElementById('btn-new-repair');
  const btnResetData = document.getElementById('btn-reset-data');

  // WhatsApp Modal
  const waModal = document.getElementById('wa-modal');
  const waModalClose = document.getElementById('wa-modal-close');
  const waTextarea = document.getElementById('wa-preview-text');
  const waSendBtn = document.getElementById('wa-send-btn');
  let currentWaUrl = '#';

  // Live Clock
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = now.toLocaleDateString('it-IT', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  updateClock();
  setInterval(updateClock, 30000);

  // -------------------------------------------------------------
  // Render KPI Metrics
  // -------------------------------------------------------------
  function renderMetrics() {
    const stats = store.getStats();
    kpiTotal.textContent = stats.total;
    kpiActive.textContent = stats.activeCount;
    kpiReady.textContent = stats.readyCount;
    kpiRevenue.textContent = `€${stats.totalEstimatedRevenue}`;
  }

  // -------------------------------------------------------------
  // Render Repairs Table
  // -------------------------------------------------------------
  function getStepBadge(step) {
    const steps = {
      1: { name: '1. Check-In', cls: 'step-1', icon: '📥' },
      2: { name: '2. Diagnosi', cls: 'step-2', icon: '🔬' },
      3: { name: '3. In Lavorazione', cls: 'step-3', icon: '⚙️' },
      4: { name: '4. Quality Control', cls: 'step-4', icon: '🧪' },
      5: { name: '5. Pronto al Ritiro', cls: 'step-5', icon: '📦' },
      6: { name: '6. Consegnato', cls: 'step-6', icon: '✓' }
    };
    const s = steps[step] || { name: `Step ${step}`, cls: 'step-1', icon: '•' };
    return `<span class="step-badge ${s.cls}">${s.icon} ${s.name}</span>`;
  }

  function renderTable() {
    let list = store.getAllRepairs();

    // Filter by tab
    if (currentFilter === 'active') {
      list = list.filter(r => r.step >= 1 && r.step <= 4);
    } else if (currentFilter === 'diagnosis') {
      list = list.filter(r => r.step === 1 || r.step === 2);
    } else if (currentFilter === 'ready') {
      list = list.filter(r => r.step === 5);
    } else if (currentFilter === 'delivered') {
      list = list.filter(r => r.step === 6);
    }

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => 
        (r.code && r.code.toLowerCase().includes(q)) ||
        (r.customerName && r.customerName.toLowerCase().includes(q)) ||
        (r.deviceModel && r.deviceModel.toLowerCase().includes(q)) ||
        (r.issueDescription && r.issueDescription.toLowerCase().includes(q))
      );
    }

    if (list.length === 0) {
      repairsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--adm-muted);">
            Nessuna scheda trovata con i filtri correnti.
          </td>
        </tr>
      `;
      return;
    }

    repairsTableBody.innerHTML = list.map(r => {
      const balance = (Number(r.estimatedCost) || 0) - (Number(r.depositPaid) || 0);
      const balanceHtml = balance <= 0 
        ? `<span class="balance-paid">Saldato</span>` 
        : `<span class="balance-unpaid">Da saldare: €${balance}</span>`;

      return `
        <tr data-id="${r.id}">
          <td>
            <span class="badge-code">${r.code}</span>
          </td>
          <td>
            <strong>${escapeHtml(r.customerName)}</strong>
            <div style="font-size: 12px; color: var(--adm-muted);">
              <a href="tel:${r.customerPhone}" style="color: var(--adm-muted); text-decoration: none;">${r.customerPhone}</a>
            </div>
          </td>
          <td>
            <strong>${escapeHtml(r.deviceModel)}</strong>
            <div style="font-size: 11px; color: var(--adm-dim); max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${escapeHtml(r.issueDescription || '')}
            </div>
          </td>
          <td>
            ${getStepBadge(r.step)}
          </td>
          <td>
            <div style="font-size: 12px; max-width: 250px; line-height: 1.4;">
              ${escapeHtml(r.statusText || '')}
            </div>
          </td>
          <td>
            <span class="price-tag">€${r.estimatedCost || 0}</span>
            ${balanceHtml}
          </td>
          <td>
            <div class="action-cell">
              <button class="icon-btn" title="Avanza Step" onclick="window.advanceRepairStep('${r.id}')">⏩</button>
              <button class="icon-btn wa" title="Invia Notifica WhatsApp" onclick="window.openWaModal('${r.id}')">💬</button>
              <button class="icon-btn" title="Modifica Scheda" onclick="window.editRepair('${r.id}')">✏️</button>
              <button class="icon-btn del" title="Elimina Scheda" onclick="window.deleteRepairConfirm('${r.id}')">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // -------------------------------------------------------------
  // Filter tabs & Search
  // -------------------------------------------------------------
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderTable();
    });
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderTable();
  });

  // -------------------------------------------------------------
  // Global Actions for Table Rows
  // -------------------------------------------------------------
  window.advanceRepairStep = function(id) {
    const repair = store.getRepairById(id);
    if (!repair) return;

    if (repair.step >= 6) {
      alert(`La scheda ${repair.code} è già al completamento finale (Consegnato).`);
      return;
    }

    const nextStep = repair.step + 1;
    store.advanceStep(id, nextStep);
    renderMetrics();
    renderTable();
  };

  window.openWaModal = function(id) {
    const repair = store.getRepairById(id);
    if (!repair) return;

    activeModalRepair = repair;
    const url = store.buildWhatsAppNotificationUrl(repair);
    currentWaUrl = url;

    // Decode message for preview
    const urlObj = new URL(url);
    const msg = urlObj.searchParams.get('text') || '';
    waTextarea.value = msg;

    waModal.classList.add('open');
  };

  waSendBtn.addEventListener('click', () => {
    if (activeModalRepair) {
      const cleanPhone = (activeModalRepair.customerPhone || '').replace(/[^\d+]/g, '');
      const phoneToUse = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : (cleanPhone.startsWith('39') ? cleanPhone : '39' + cleanPhone);
      const finalMsg = encodeURIComponent(waTextarea.value);
      window.open(`https://wa.me/${phoneToUse}?text=${finalMsg}`, '_blank');
      waModal.classList.remove('open');
    }
  });

  waModalClose.addEventListener('click', () => waModal.classList.remove('open'));

  window.deleteRepairConfirm = function(id) {
    const repair = store.getRepairById(id);
    if (!repair) return;
    if (confirm(`Sei sicuro di voler eliminare la scheda ${repair.code} (${repair.deviceModel})?`)) {
      store.deleteRepair(id);
      renderMetrics();
      renderTable();
    }
  };

  window.editRepair = function(id) {
    const repair = store.getRepairById(id);
    if (!repair) return;

    activeModalRepair = repair;
    modalTitle.textContent = `Modifica Scheda ${repair.code}`;

    document.getElementById('form-id').value = repair.id;
    document.getElementById('form-code').value = repair.code;
    document.getElementById('form-customer-name').value = repair.customerName || '';
    document.getElementById('form-customer-phone').value = repair.customerPhone || '';
    document.getElementById('form-device-type').value = repair.deviceType || 'Smartphone';
    document.getElementById('form-device-model').value = repair.deviceModel || '';
    document.getElementById('form-step').value = repair.step || 1;
    document.getElementById('form-cost').value = repair.estimatedCost || 0;
    document.getElementById('form-deposit').value = repair.depositPaid || 0;
    document.getElementById('form-issue').value = repair.issueDescription || '';
    document.getElementById('form-status').value = repair.statusText || '';
    document.getElementById('form-notes').value = repair.internalNotes || '';

    repairModal.classList.add('open');
  };

  // -------------------------------------------------------------
  // New Repair Modal
  // -------------------------------------------------------------
  btnNewRepair.addEventListener('click', () => {
    activeModalRepair = null;
    modalTitle.textContent = 'Nuova Scheda Riparazione';
    repairForm.reset();
    document.getElementById('form-id').value = '';
    
    // Auto-generate code
    const existing = store.getAllRepairs();
    const nextCode = `PIR-${845 + existing.length}`;
    document.getElementById('form-code').value = nextCode;
    document.getElementById('form-step').value = '1';
    document.getElementById('form-status').value = 'Ricezione apparato & check-in completato in Via Roma 99.';

    repairModal.classList.add('open');
  });

  modalClose.addEventListener('click', () => repairModal.classList.remove('open'));
  modalCancel.addEventListener('click', () => repairModal.classList.remove('open'));

  repairForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('form-id').value;

    const recordData = {
      code: document.getElementById('form-code').value.trim().toUpperCase(),
      customerName: document.getElementById('form-customer-name').value.trim(),
      customerPhone: document.getElementById('form-customer-phone').value.trim(),
      deviceType: document.getElementById('form-device-type').value,
      deviceModel: document.getElementById('form-device-model').value.trim(),
      step: Number(document.getElementById('form-step').value) || 1,
      estimatedCost: Number(document.getElementById('form-cost').value) || 0,
      depositPaid: Number(document.getElementById('form-deposit').value) || 0,
      issueDescription: document.getElementById('form-issue').value.trim(),
      statusText: document.getElementById('form-status').value.trim(),
      internalNotes: document.getElementById('form-notes').value.trim(),
      technician: "Andrea P."
    };

    if (id) {
      store.updateRepair(id, recordData);
    } else {
      store.createRepair(recordData);
    }

    repairModal.classList.remove('open');
    renderMetrics();
    renderTable();
  });

  // -------------------------------------------------------------
  // Reset to Defaults
  // -------------------------------------------------------------
  if (btnResetData) {
    btnResetData.addEventListener('click', () => {
      if (confirm('Vuoi ripristinare il dataset hardcoded predefinito di Pirina Informatica? Tutte le modifiche locali non salvate verranno resettate.')) {
        store.resetToDefaults();
        renderMetrics();
        renderTable();
        alert('Dati ripristinati allo stato iniziale hardcoded!');
      }
    });
  }

  // Helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // React to cross-tab updates
  window.addEventListener('pirina:store-updated', () => {
    renderMetrics();
    renderTable();
  });

  // Initial render
  renderMetrics();
  renderTable();
});
