/**
 * GeoLab - "The art of using AI"
 * Offer Template Generator Application Logic
 */

(function () {
  'use strict';

  // --- Constants & Currency Formats ---
  const CURRENCIES = {
    USD: { symbol: '$', code: 'USD', position: 'before' },
    EUR: { symbol: '€', code: 'EUR', position: 'before' },
    GEL: { symbol: '₾', code: 'GEL', position: 'after' },
    GBP: { symbol: '£', code: 'GBP', position: 'before' }
  };

  const DEFAULT_STATE = {
    // Document Meta
    offerNumber: 'GL-AI-2026-018',
    issueDate: new Date().toISOString().split('T')[0],
    validUntilDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD',
    
    // Organization & Program
    organization: 'GeoLab',
    programName: 'The art of using AI',
    programTagline: 'A curated educational program at the intersection of human creativity and artificial intelligence, designed for curious minds ready to shape the future.',
    providerContact: 'Executive Training Division • admissions@geolab.edu.ge • +995 32 200 0000',
    providerLocation: 'Tbilisi, Georgia • geolab.edu.ge',

    // Client Information
    clientName: 'Apex Creative Technologies',
    clientDescription: 'Executive AI enablement and workflow transformation for 20 senior designers, product leads, and creative technologists.',
    clientContact: 'Elena Rostova, VP of Design & Innovation',
    clientEmail: 'e.rostova@apexcreative.io',

    // Commercial Terms & Inclusions
    paymentTerms: '50% upon agreement execution, 50% upon program completion. Net 14 days.',
    deliverablesNote: 'Includes full access to GeoLab AI Exploration Sandboxes, hands-on lab environments, proprietary prompt blueprints, and official GeoLab Executive Certifications.',

    // Line Items
    items: [
      {
        id: 'item-1',
        name: 'Module 1: Generative AI Architecture & Prompt Engineering',
        sku: 'GL-AI-M01',
        quantity: 1,
        unitPrice: 1650.00
      },
      {
        id: 'item-2',
        name: 'Module 2: Autonomous Agents & Workflow Automation Workshop',
        sku: 'GL-AI-M02',
        quantity: 1,
        unitPrice: 1950.00
      },
      {
        id: 'item-3',
        name: 'Module 3: Multimodal Creative Direction & Synthetic Media Lab',
        sku: 'GL-AI-M03',
        quantity: 1,
        unitPrice: 1400.00
      },
      {
        id: 'item-4',
        name: 'Dedicated AI Cloud Sandbox & Individual Mentorship Pass',
        sku: 'GL-AI-SBX',
        quantity: 20,
        unitPrice: 75.00
      }
    ],

    // Calculations & Adjustments
    discountPercent: 5,
    taxPercent: 0
  };

  // Preset curriculum packages
  const PRESETS = {
    executive: {
      name: 'Full Executive Program (4 Modules)',
      items: [
        { id: 'p1', name: 'Module 1: Generative AI Architecture & Prompt Engineering', sku: 'GL-AI-M01', quantity: 1, unitPrice: 1650.00 },
        { id: 'p2', name: 'Module 2: Autonomous Agents & Workflow Automation Workshop', sku: 'GL-AI-M02', quantity: 1, unitPrice: 1950.00 },
        { id: 'p3', name: 'Module 3: Multimodal Creative Direction & Synthetic Media Lab', sku: 'GL-AI-M03', quantity: 1, unitPrice: 1400.00 },
        { id: 'p4', name: 'Dedicated AI Cloud Sandbox & Individual Mentorship Pass', sku: 'GL-AI-SBX', quantity: 20, unitPrice: 75.00 }
      ],
      discountPercent: 5
    },
    intensive: {
      name: 'Accelerated 2-Day AI Sprint',
      items: [
        { id: 'p1', name: 'Intensive AI Tools & Workflow Automation Sprint (16 Hours)', sku: 'GL-AI-SPRINT', quantity: 1, unitPrice: 2800.00 },
        { id: 'p2', name: 'Custom Enterprise Prompt Library & System Blueprints', sku: 'GL-AI-LIB', quantity: 1, unitPrice: 950.00 }
      ],
      discountPercent: 0
    },
    single: {
      name: 'Individual Masterclass Seat',
      items: [
        { id: 'p1', name: 'The Art of Using AI - Full Cohort Seat (8 Weeks)', sku: 'GL-AI-SEAT', quantity: 1, unitPrice: 1200.00 },
        { id: 'p2', name: 'Lab Sandbox & Model API Credits Pack', sku: 'GL-AI-CRED', quantity: 1, unitPrice: 150.00 }
      ],
      discountPercent: 0
    }
  };

  // --- App State ---
  let state = loadSavedState() || JSON.parse(JSON.stringify(DEFAULT_STATE));
  let currentZoom = 1;
  let activeTab = 'editor'; // for mobile view: 'editor' | 'preview'

  // --- Helpers ---
  function generateId() {
    return 'item-' + Math.random().toString(36).substr(2, 9);
  }

  function loadSavedState() {
    try {
      const saved = localStorage.getItem('geolab_offer_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load saved state from localStorage:', e);
    }
    return null;
  }

  function saveState() {
    try {
      localStorage.setItem('geolab_offer_state', JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save state to localStorage:', e);
    }
  }

  function formatCurrency(amount, currencyCode) {
    const cur = CURRENCIES[currencyCode] || CURRENCIES.USD;
    const formattedNum = Number(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    if (cur.position === 'after') {
      return `${formattedNum} ${cur.symbol}`;
    }
    return `${cur.symbol}${formattedNum}`;
  }

  function formatDateDisplay(isoString) {
    if (!isoString) return '';
    try {
      const parts = isoString.split('-');
      if (parts.length === 3) {
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      return isoString;
    } catch (e) {
      return isoString;
    }
  }

  // --- Calculations ---
  function computeTotals() {
    let subtotal = 0;
    const itemTotals = {};

    state.items.forEach(item => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      const total = qty * price;
      itemTotals[item.id] = total;
      subtotal += total;
    });

    const discountRate = Math.max(0, Math.min(100, parseFloat(state.discountPercent) || 0));
    const discountAmount = subtotal * (discountRate / 100);
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    
    const taxRate = Math.max(0, parseFloat(state.taxPercent) || 0);
    const taxAmount = taxableAmount * (taxRate / 100);
    
    const grandTotal = taxableAmount + taxAmount;

    return {
      subtotal,
      discountRate,
      discountAmount,
      taxRate,
      taxAmount,
      grandTotal,
      itemTotals
    };
  }

  // --- UI Notification Toast ---
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 transform translate-y-2 opacity-0 ${
      type === 'success' ? 'bg-slate-900 text-white border border-slate-700' : 'bg-slate-900 text-white'
    }`;
    toast.innerHTML = `
      <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>${message}</span>
    `;

    const container = document.getElementById('toast-container');
    if (container) {
      container.appendChild(toast);
      requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
      });
      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  }

  // --- Render Editor Inputs ---
  function populateEditorFields() {
    // Basic inputs
    setInputValue('input-offer-number', state.offerNumber);
    setInputValue('input-issue-date', state.issueDate);
    setInputValue('input-valid-until', state.validUntilDate);
    setInputValue('input-currency', state.currency);
    
    setInputValue('input-client-name', state.clientName);
    setInputValue('input-client-desc', state.clientDescription);
    setInputValue('input-client-contact', state.clientContact);
    setInputValue('input-client-email', state.clientEmail);

    setInputValue('input-payment-terms', state.paymentTerms);
    setInputValue('input-deliverables', state.deliverablesNote);

    setInputValue('input-discount-percent', state.discountPercent);
    setInputValue('input-tax-percent', state.taxPercent);

    renderLineItemRows();
  }

  function setInputValue(elementId, value) {
    const el = document.getElementById(elementId);
    if (el && value !== undefined) {
      el.value = value;
    }
  }

  // Render Line Item Rows in Editor
  function renderLineItemRows() {
    const container = document.getElementById('line-items-container');
    if (!container) return;

    container.innerHTML = '';
    const totals = computeTotals();

    state.items.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'line-item-row p-4 rounded-xl border border-slate-200 bg-white mb-3 shadow-xs space-y-3';
      row.setAttribute('data-id', item.id);

      const itemTotalFormatted = formatCurrency(totals.itemTotals[item.id] || 0, state.currency);

      row.innerHTML = `
        <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
              ${index + 1}
            </span>
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Line Item</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium text-slate-400">Total:</span>
            <span class="text-xs font-mono font-bold text-slate-900 line-total-display">${itemTotalFormatted}</span>
            <button type="button" class="btn-duplicate-item p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition" title="Duplicate line">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </button>
            <button type="button" class="btn-remove-item p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition" title="Remove line">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div class="md:col-span-8">
            <label class="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Product / Module Name</label>
            <input type="text" class="item-name-input w-full px-3 py-1.5 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-slate-900 input-focus-ring transition" placeholder="e.g. Module 1: Generative AI Architecture" value="${escapeHtml(item.name)}">
          </div>
          <div class="md:col-span-4">
            <label class="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Product # / SKU</label>
            <input type="text" class="item-sku-input w-full px-3 py-1.5 text-sm font-mono bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-slate-700 input-focus-ring transition" placeholder="GL-AI-01" value="${escapeHtml(item.sku)}">
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-12 gap-3 pt-1">
          <div class="md:col-span-6">
            <label class="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Quantity</label>
            <input type="number" min="1" step="1" class="item-qty-input w-full px-3 py-1.5 text-sm font-mono bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-slate-900 input-focus-ring transition" value="${item.quantity}">
          </div>
          <div class="md:col-span-6">
            <label class="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Unit Price (${CURRENCIES[state.currency]?.symbol || '$'})</label>
            <input type="number" min="0" step="0.01" class="item-price-input w-full px-3 py-1.5 text-sm font-mono bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-slate-900 input-focus-ring transition" value="${item.unitPrice}">
          </div>
        </div>
      `;

      // Event Listeners for this row
      const nameInput = row.querySelector('.item-name-input');
      const skuInput = row.querySelector('.item-sku-input');
      const qtyInput = row.querySelector('.item-qty-input');
      const priceInput = row.querySelector('.item-price-input');
      const removeBtn = row.querySelector('.btn-remove-item');
      const dupBtn = row.querySelector('.btn-duplicate-item');

      nameInput.addEventListener('input', (e) => {
        item.name = e.target.value;
        onStateChange();
      });

      skuInput.addEventListener('input', (e) => {
        item.sku = e.target.value;
        onStateChange();
      });

      qtyInput.addEventListener('input', (e) => {
        item.quantity = parseFloat(e.target.value) || 0;
        updateLineTotalDisplay(row, item);
        onStateChange();
      });

      priceInput.addEventListener('input', (e) => {
        item.unitPrice = parseFloat(e.target.value) || 0;
        updateLineTotalDisplay(row, item);
        onStateChange();
      });

      removeBtn.addEventListener('click', () => {
        if (state.items.length <= 1) {
          showToast('Offer must contain at least one line item', 'info');
          return;
        }
        state.items = state.items.filter(it => it.id !== item.id);
        renderLineItemRows();
        onStateChange();
      });

      dupBtn.addEventListener('click', () => {
        const newItem = {
          ...item,
          id: generateId(),
          name: item.name + ' (Copy)'
        };
        const currentIndex = state.items.findIndex(it => it.id === item.id);
        state.items.splice(currentIndex + 1, 0, newItem);
        renderLineItemRows();
        onStateChange();
        showToast('Line item duplicated', 'success');
      });

      container.appendChild(row);
    });

    updateSummaryCards();
  }

  function updateLineTotalDisplay(rowElement, item) {
    const totalEl = rowElement.querySelector('.line-total-display');
    if (totalEl) {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      totalEl.textContent = formatCurrency(qty * price, state.currency);
    }
  }

  function updateSummaryCards() {
    const totals = computeTotals();
    const elSubtotal = document.getElementById('calc-subtotal');
    const elGrandTotal = document.getElementById('calc-grand-total');

    if (elSubtotal) elSubtotal.textContent = formatCurrency(totals.subtotal, state.currency);
    if (elGrandTotal) elGrandTotal.textContent = formatCurrency(totals.grandTotal, state.currency);
  }

  // --- Render Live Preview (The Generated Offer Document) ---
  function renderLivePreview() {
    const totals = computeTotals();

    // 1. Header elements
    setTextContent('preview-offer-number', state.offerNumber || 'GL-AI-2026-000');
    setTextContent('preview-issue-date', formatDateDisplay(state.issueDate));
    setTextContent('preview-valid-until', formatDateDisplay(state.validUntilDate));

    // 2. Client Information
    setTextContent('preview-client-name', state.clientName || 'Client Organization');
    setTextContent('preview-client-desc', state.clientDescription || 'No project description provided.');
    
    // Client contact & email badge
    const clientContactWrapper = document.getElementById('preview-client-contact-wrap');
    if (clientContactWrapper) {
      if (state.clientContact || state.clientEmail) {
        clientContactWrapper.classList.remove('hidden');
        setTextContent('preview-client-contact', state.clientContact || '');
        setTextContent('preview-client-email', state.clientEmail ? ` • ${state.clientEmail}` : '');
      } else {
        clientContactWrapper.classList.add('hidden');
      }
    }

    // 3. Line Items Table
    const tableBody = document.getElementById('preview-table-body');
    if (tableBody) {
      tableBody.innerHTML = '';
      
      state.items.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-100 hover:bg-slate-50/50 transition-colors print-avoid-break';

        const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);

        tr.innerHTML = `
          <td class="py-3 px-3 text-xs font-mono text-slate-400 text-center w-8">
            ${String(index + 1).padStart(2, '0')}
          </td>
          <td class="py-3 px-3">
            <div class="font-medium text-slate-900 text-sm leading-snug">${escapeHtml(item.name || 'Untitled Service')}</div>
          </td>
          <td class="py-3 px-3 text-xs font-mono text-slate-500 whitespace-nowrap">
            <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60 font-semibold">${escapeHtml(item.sku || 'GL-AI')}</span>
          </td>
          <td class="py-3 px-3 text-xs font-mono text-slate-700 text-center whitespace-nowrap">
            ${item.quantity || 0}
          </td>
          <td class="py-3 px-3 text-xs font-mono text-slate-700 text-right whitespace-nowrap">
            ${formatCurrency(item.unitPrice || 0, state.currency)}
          </td>
          <td class="py-3 px-3 text-xs font-mono font-semibold text-slate-900 text-right whitespace-nowrap">
            ${formatCurrency(lineTotal, state.currency)}
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }

    // 4. Financial Calculations in Preview
    setTextContent('preview-subtotal', formatCurrency(totals.subtotal, state.currency));

    // Discount row
    const discountRow = document.getElementById('preview-discount-row');
    if (discountRow) {
      if (totals.discountRate > 0) {
        discountRow.classList.remove('hidden');
        setTextContent('preview-discount-label', `Discount (${totals.discountRate}%)`);
        setTextContent('preview-discount-amount', `-${formatCurrency(totals.discountAmount, state.currency)}`);
      } else {
        discountRow.classList.add('hidden');
      }
    }

    // Tax row
    const taxRow = document.getElementById('preview-tax-row');
    if (taxRow) {
      if (totals.taxRate > 0) {
        taxRow.classList.remove('hidden');
        setTextContent('preview-tax-label', `Tax / VAT (${totals.taxRate}%)`);
        setTextContent('preview-tax-amount', formatCurrency(totals.taxAmount, state.currency));
      } else {
        taxRow.classList.add('hidden');
      }
    }

    // Total Offer Amount
    setTextContent('preview-grand-total', formatCurrency(totals.grandTotal, state.currency));
    setTextContent('preview-currency-badge', state.currency);

    // 5. Commercial Notes & Payment Terms
    setTextContent('preview-payment-terms', state.paymentTerms || 'Standard commercial terms apply.');
    setTextContent('preview-deliverables', state.deliverablesNote || 'All program materials and certifications included.');

    // 6. Organization & Program details
    setTextContent('preview-org-name', state.organization);
    setTextContent('preview-program-name', state.programName);
    setTextContent('preview-program-tagline', state.programTagline);
  }

  function setTextContent(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = text;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- State Change Listener ---
  function onStateChange() {
    saveState();
    renderLivePreview();
    updateSummaryCards();
  }

  // --- Attach Global Event Listeners ---
  function initEventListeners() {
    // Basic Form inputs
    bindInput('input-offer-number', 'offerNumber');
    bindInput('input-issue-date', 'issueDate');
    bindInput('input-valid-until', 'validUntilDate');
    bindInput('input-currency', 'currency');

    bindInput('input-client-name', 'clientName');
    bindInput('input-client-desc', 'clientDescription');
    bindInput('input-client-contact', 'clientContact');
    bindInput('input-client-email', 'clientEmail');

    bindInput('input-payment-terms', 'paymentTerms');
    bindInput('input-deliverables', 'deliverablesNote');

    bindInput('input-discount-percent', 'discountPercent', true);
    bindInput('input-tax-percent', 'taxPercent', true);

    // Currency Change updates line items UI too
    const currencySelect = document.getElementById('input-currency');
    if (currencySelect) {
      currencySelect.addEventListener('change', () => {
        renderLineItemRows();
      });
    }

    // Add Line Item Button
    const addBtn = document.getElementById('btn-add-line-item');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const itemNumber = state.items.length + 1;
        const newItem = {
          id: generateId(),
          name: `Curated Program Module ${itemNumber}`,
          sku: `GL-AI-M0${itemNumber}`,
          quantity: 1,
          unitPrice: 1000.00
        };
        state.items.push(newItem);
        renderLineItemRows();
        onStateChange();

        // Scroll to the newly added item
        const container = document.getElementById('line-items-container');
        if (container && container.lastElementChild) {
          container.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    // Preset selector
    const presetSelect = document.getElementById('preset-selector');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        const key = e.target.value;
        if (PRESETS[key]) {
          const preset = PRESETS[key];
          state.items = JSON.parse(JSON.stringify(preset.items));
          state.discountPercent = preset.discountPercent;
          setInputValue('input-discount-percent', state.discountPercent);
          renderLineItemRows();
          onStateChange();
          showToast(`Loaded "${preset.name}" preset`, 'success');
        }
        e.target.value = '';
      });
    }

    // Print Buttons
    const printButtons = document.querySelectorAll('.action-print');
    printButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        triggerPrint();
      });
    });

    // Reset Button
    const resetBtn = document.getElementById('btn-reset-form');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset offer to default GeoLab sample data? All unsaved customizations will be restored.')) {
          state = JSON.parse(JSON.stringify(DEFAULT_STATE));
          localStorage.removeItem('geolab_offer_state');
          populateEditorFields();
          onStateChange();
          showToast('Restored default GeoLab offer template', 'info');
        }
      });
    }

    // Clear Form Button
    const clearBtn = document.getElementById('btn-clear-form');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear all fields to create an offer from scratch?')) {
          state.clientName = '';
          state.clientDescription = '';
          state.clientContact = '';
          state.clientEmail = '';
          state.items = [
            { id: generateId(), name: '', sku: '', quantity: 1, unitPrice: 0 }
          ];
          state.discountPercent = 0;
          state.taxPercent = 0;
          populateEditorFields();
          onStateChange();
          showToast('Form cleared', 'info');
        }
      });
    }

    // Zoom Controls
    setupZoomControls();

    // Mobile View Switcher
    setupMobileTabs();

    // Keyboard shortcut for Print (Cmd+P / Ctrl+P is handled natively, but Cmd+S to save)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        // Trigger native print cleanly
      }
    });
  }

  function bindInput(elementId, stateKey, isNumber = false) {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.addEventListener('input', (e) => {
      state[stateKey] = isNumber ? parseFloat(e.target.value) || 0 : e.target.value;
      onStateChange();
    });
  }

  // --- Print Handler ---
  function triggerPrint() {
    // Before printing, reset preview zoom transform to 1 so the page lays out cleanly
    const paper = document.getElementById('offer-sheet');
    const originalTransform = paper ? paper.style.transform : '';
    if (paper) paper.style.transform = 'none';

    window.print();

    // Restore zoom after print dialog closes
    setTimeout(() => {
      if (paper) paper.style.transform = originalTransform;
    }, 500);
  }

  // --- Zoom Controls ---
  function setupZoomControls() {
    const zoomIn = document.getElementById('btn-zoom-in');
    const zoomOut = document.getElementById('btn-zoom-out');
    const zoomReset = document.getElementById('btn-zoom-reset');
    const zoomDisplay = document.getElementById('zoom-percentage');
    const paper = document.getElementById('offer-sheet');

    function applyZoom(zoom) {
      currentZoom = Math.min(1.4, Math.max(0.5, zoom));
      if (paper) {
        paper.style.transform = `scale(${currentZoom})`;
        paper.style.transformOrigin = 'top center';
      }
      if (zoomDisplay) {
        zoomDisplay.textContent = `${Math.round(currentZoom * 100)}%`;
      }
    }

    if (zoomIn) {
      zoomIn.addEventListener('click', () => applyZoom(currentZoom + 0.1));
    }
    if (zoomOut) {
      zoomOut.addEventListener('click', () => applyZoom(currentZoom - 0.1));
    }
    if (zoomReset) {
      zoomReset.addEventListener('click', () => applyZoom(1));
    }

    // Auto-fit zoom on smaller desktop screens
    function autoFitPreview() {
      const previewWrapper = document.getElementById('preview-panel');
      if (window.innerWidth >= 1024 && previewWrapper) {
        const availableWidth = previewWrapper.clientWidth - 64; // accounting for padding
        const paperWidth = 794; // approx A4 210mm in px at 96dpi
        if (availableWidth < paperWidth) {
          const fitRatio = Math.max(0.65, Math.floor((availableWidth / paperWidth) * 100) / 100);
          applyZoom(fitRatio);
        }
      }
    }

    window.addEventListener('resize', autoFitPreview);
    autoFitPreview();
  }

  // --- Mobile Switcher (Editor / Preview Tabs) ---
  function setupMobileTabs() {
    const tabEditor = document.getElementById('tab-btn-editor');
    const tabPreview = document.getElementById('tab-btn-preview');
    const editorPanel = document.getElementById('editor-panel');
    const previewPanel = document.getElementById('preview-panel');

    if (!tabEditor || !tabPreview || !editorPanel || !previewPanel) return;

    tabEditor.addEventListener('click', () => {
      activeTab = 'editor';
      tabEditor.classList.add('bg-white', 'text-slate-900', 'shadow-xs');
      tabEditor.classList.remove('text-slate-500');
      tabPreview.classList.remove('bg-white', 'text-slate-900', 'shadow-xs');
      tabPreview.classList.add('text-slate-500');

      editorPanel.classList.remove('hidden');
      previewPanel.classList.add('hidden', 'lg:flex');
    });

    tabPreview.addEventListener('click', () => {
      activeTab = 'preview';
      tabPreview.classList.add('bg-white', 'text-slate-900', 'shadow-xs');
      tabPreview.classList.remove('text-slate-500');
      tabEditor.classList.remove('bg-white', 'text-slate-900', 'shadow-xs');
      tabEditor.classList.add('text-slate-500');

      editorPanel.classList.add('hidden');
      previewPanel.classList.remove('hidden');
      previewPanel.classList.add('flex');
    });
  }

  // --- Initialize App on DOM Ready ---
  document.addEventListener('DOMContentLoaded', () => {
    populateEditorFields();
    initEventListeners();
    renderLivePreview();
  });

})();
