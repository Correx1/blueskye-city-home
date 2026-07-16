import salesTemplates from '../html/sales.html?raw';

function getTemplateHtml(id) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(salesTemplates, 'text/html');
  const temp = doc.querySelector(`#${id}`);
  return temp ? temp.innerHTML : '';
}

function getSection(name) {
  const startMarker = `data-section="${name}"`;
  const startIdx = salesTemplates.indexOf(startMarker);
  if (startIdx === -1) return '';
  const divStart = salesTemplates.lastIndexOf('<div', startIdx);
  const endMarker = `END SECTION: ${name}`;
  const endCommentIdx = salesTemplates.indexOf(endMarker, startIdx);
  if (endCommentIdx === -1) return '';
  const closingDiv = salesTemplates.lastIndexOf('</div>', endCommentIdx);
  if (closingDiv === -1) return '';
  return salesTemplates.slice(divStart, closingDiv + 6);
}

function fmtNGN(val) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
}

function genRef(id) {
  return `SKY-SALE-${String(id).padStart(4, '0')}`;
}

function showToast(message, type = 'success') {
  let toast = document.getElementById('admin-success-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-success-toast';
    toast.className = 'fixed bottom-5 right-5 z-50 transform translate-y-10 opacity-0 transition-all duration-300 pointer-events-none';
    document.body.appendChild(toast);
  }
  toast.className = `fixed bottom-5 right-5 z-50 transform translate-y-0 opacity-100 transition-all duration-300 p-4 rounded-md shadow-lg flex items-center gap-2 border text-sm font-semibold text-white ${
    type === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-rose-600 border-rose-500'
  }`;
  toast.innerHTML = `<i class="bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'} text-lg"></i><span>${message}</span>`;
  setTimeout(() => {
    toast.className = 'fixed bottom-5 right-5 z-50 transform translate-y-10 opacity-0 transition-all duration-300 pointer-events-none';
  }, 3500);
}

// Sync schedules clearing chronologically based on total payments made
function syncScheduleClearing(order) {
  if (!order.schedule || order.schedule.length === 0) return;
  
  let remainingPaid = (order.paymentHistory || []).reduce((sum, p) => sum + p.amount, 0);
  
  // Sort schedule items by date
  order.schedule.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  
  order.schedule.forEach(s => {
    if (remainingPaid >= s.amount) {
      s.cleared = true;
      remainingPaid -= s.amount;
    } else {
      s.cleared = false;
    }
  });
}

function computeStatus(order) {
  const total = order.price || 0;
  const paid = (order.paymentHistory || []).reduce((sum, p) => sum + p.amount, 0);
  if (paid >= total) return 'Paid Off';
  if (paid > 0 && order.plan !== 'Outright') return 'Active Installments';
  if (paid > 0 && order.plan === 'Outright') return 'Paid Off';
  return 'Pending Downpayment';
}

function ensureOrders(state) {
  if (!state.admin.ordersLedger) state.admin.ordersLedger = [];
  state.admin.ordersLedger.forEach(o => {
    if (!o.paymentHistory) o.paymentHistory = [];
    if (!o.documents) o.documents = [];
    if (!o.schedule) o.schedule = [];
    if (!o.affiliate1) o.affiliate1 = '';
    if (!o.affiliate2) o.affiliate2 = '';
    if (!o.notes) o.notes = '';
    
    // Backfill payment history if paidAmount is registered but list is empty
    if (o.paymentHistory.length === 0 && o.paidAmount > 0) {
      o.paymentHistory.push({
        id: Date.now(),
        amount: o.paidAmount,
        date: o.date || '2026-07-01',
        channel: 'Bank Transfer',
        note: 'Initial deposit'
      });
    }
    syncScheduleClearing(o);
  });
}

// 1. MASTER ROUTER
export function renderSalesCatalogTab(state, properties, projects) {
  ensureOrders(state);
  
  if (!state.admin.salesViewMode) state.admin.salesViewMode = 'list';
  const mode = state.admin.salesViewMode;

  const orders = state.admin.ordersLedger || [];
  const selectedId = state.admin.selectedSaleId;
  const sale = selectedId != null ? orders.find(o => o.id === parseInt(selectedId)) : null;

  if (mode === 'detail' && sale) return renderDetailView(state, sale);
  if (mode === 'create' || (mode === 'edit' && sale)) return renderFormView(state, sale, properties);
  return renderListView(state, orders);
}

// 2. LIST VIEW
function renderListView(state, orders) {
  let html = getSection('sales-list-template');
  return html;
}

// 3. FORM VIEW
function renderFormView(state, sale, properties) {
  const isEditing = !!sale;
  let html = getSection('sale-form-template');

  // Customer dropdown
  const customers = state.admin.kycQueue || [];
  const customerOptions = customers.map(c => `
    <option value="${c.name}" ${isEditing && sale.clientName === c.name ? 'selected' : ''}>${c.name} (${c.email})</option>
  `).join('');

  // Available properties only (or current sale property)
  const availableProps = (properties || []).filter(p => p.status === 'Available' || (isEditing && p.title === sale.propertyTitle));
  const propertyOptions = availableProps.map(p => `
    <option value="${p.id}|${p.title}|${p.price}" ${isEditing && sale.propertyTitle === p.title ? 'selected' : ''}>${p.title} (₦${p.price.toLocaleString()})</option>
  `).join('');

  // Referral affiliate network
  const affiliates = state.admin.referralsList || [];
  const affiliateOptions = affiliates.filter(a => a.status === 'Approved').map(a => `
    <option value="${a.name}" ${isEditing && sale.affiliate1 === a.name ? 'selected' : ''}>${a.name} (${a.code})</option>
  `).join('');

  html = html
    .replace('<!-- DYNAMIC CUSTOMERS -->', customerOptions)
    .replace('<!-- DYNAMIC AVAILABLE PROPERTIES -->', propertyOptions)
    .replace('<!-- DYNAMIC REFERRALS -->', affiliateOptions);

  return html;
}

// 4. DETAIL VIEW
function renderDetailView(state, sale) {
  let html = getSection('sale-detail-template');
  return html;
}

// --- Bind Sales Tab Event Listeners ---
export function bindSalesTabListeners(state, root, initAdminTab, addAuditLog, renderApp) {
  ensureOrders(state);
  const orders = state.admin.ordersLedger || [];
  const viewMode = state.admin.salesViewMode;

  if (viewMode === 'list') {
    const searchInp = document.querySelector('#sales-search-input');
    const statusFilter = document.querySelector('#filter-sales-status');
    const planFilter = document.querySelector('#filter-sales-plan');
    const dateFrom = document.querySelector('#filter-sales-date-from');
    const dateTo = document.querySelector('#filter-sales-date-to');

    function renderTableRows() {
      const q = (searchInp?.value || '').toLowerCase().trim();
      const sv = statusFilter?.value || 'all';
      const pv = planFilter?.value || 'all';
      const df = dateFrom?.value || '';
      const dt = dateTo?.value || '';
      
      const tbody = document.querySelector('#sales-table-body');
      if (!tbody) return;

      const filtered = orders.filter(o => {
        const matchesQuery = !q || [o.clientName, o.propertyTitle, o.affiliate1, genRef(o.id)].join(' ').toLowerCase().includes(q);
        const matchesStatus = sv === 'all' || computeStatus(o) === sv;
        const matchesPlan = pv === 'all' || (pv === 'Outright' ? o.plan === 'Outright' : o.plan !== 'Outright');
        const matchesDate = (!df || o.date >= df) && (!dt || o.date <= dt);
        return matchesQuery && matchesStatus && matchesPlan && matchesDate;
      });

      // Update KPI totals in metrics cards
      const totalRevenueVal = orders.reduce((sum, o) => sum + (o.price || 0), 0);
      const totalPaidVal = orders.reduce((sum, o) => sum + (o.paymentHistory || []).reduce((s, p) => s + p.amount, 0), 0);
      const totalOutstandingVal = Math.max(0, totalRevenueVal - totalPaidVal);

      document.querySelector('#sales-metric-count').textContent = orders.length;
      document.querySelector('#sales-metric-volume').textContent = fmtNGN(totalRevenueVal);
      document.querySelector('#sales-metric-collected').textContent = fmtNGN(totalPaidVal);
      document.querySelector('#sales-metric-outstanding').textContent = fmtNGN(totalOutstandingVal);

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="p-4 text-center text-xs text-slate-400 italic">No sales transactions matched current filters criteria.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(o => {
        const paid = (o.paymentHistory || []).reduce((sum, p) => sum + p.amount, 0);
        const bal = Math.max(0, (o.price || 0) - paid);
        const status = computeStatus(o);
        const plan = o.plan === 'Outright' ? 'Outright' : 'Installment';

        let badgeClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-450';
        if (status === 'Paid Off') badgeClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450';
        else if (status === 'Pending Downpayment') badgeClass = 'bg-rose-500/10 text-rose-600 dark:text-rose-455';

        const affiliateStr = o.affiliate1 || '<span class="text-slate-400 italic font-normal">Direct</span>';

        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-sm font-semibold">
            <td class="p-3"><span class="font-mono text-slate-500">${genRef(o.id)}</span></td>
            <td class="p-3">
              <span class="block text-slate-900 dark:text-white font-bold cursor-pointer hover:underline" data-view-sale-id="${o.id}">${o.clientName}</span>
            </td>
            <td class="p-3 text-slate-650 dark:text-slate-350 text-xs">${o.propertyTitle}</td>
            <td class="p-3">${fmtNGN(o.price)}</td>
            <td class="p-3 text-emerald-600 dark:text-emerald-400">${fmtNGN(paid)}</td>
            <td class="p-3 text-rose-500">${fmtNGN(bal)}</td>
            <td class="p-3 text-slate-505 dark:text-slate-400 font-normal text-xs">${plan}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeClass}">${status}</span></td>
            <td class="p-3 font-mono text-slate-450 text-xs">${o.date}</td>
            <td class="p-3 text-right">
              <div class="flex items-center justify-end gap-2 text-base">
                <button data-invoice-sale-id="${o.id}" class="text-blue-500 hover:text-blue-700 p-1" title="Print Invoice"><i class="bx bx-printer"></i></button>
                <button data-view-sale-id="${o.id}" class="text-indigo-650 hover:text-indigo-800 p-1" title="View Detail"><i class="bx bx-show"></i></button>
                <button data-edit-sale-id="${o.id}" class="text-emerald-500 hover:text-emerald-700 p-1" title="Edit"><i class="bx bx-edit"></i></button>
                <button data-delete-sale-id="${o.id}" class="text-rose-500 hover:text-rose-700 p-1" title="Delete"><i class="bx bx-trash"></i></button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    if (searchInp) searchInp.addEventListener('input', renderTableRows);
    if (statusFilter) statusFilter.addEventListener('change', renderTableRows);
    if (planFilter) planFilter.addEventListener('change', renderTableRows);
    if (dateFrom) dateFrom.addEventListener('change', renderTableRows);
    if (dateTo) dateTo.addEventListener('change', renderTableRows);

    document.querySelector('#clear-sales-filters-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInp) searchInp.value = '';
      if (statusFilter) statusFilter.value = 'all';
      if (planFilter) planFilter.value = 'all';
      if (dateFrom) dateFrom.value = '';
      if (dateTo) dateTo.value = '';
      renderTableRows();
    });

    renderTableRows();
  }

  // --- Bind Create / Edit Form Controllers ---
  if (viewMode === 'create' || viewMode === 'edit') {
    const form = document.querySelector('#sale-creation-form');
    const selectedId = state.admin.selectedSaleId;
    const sale = selectedId ? orders.find(item => item.id === parseInt(selectedId)) : null;
    const isEditing = !!sale;

    let activePlanMode = 'fixed';
    let flexibleRows = [];

    // Today default date
    if (!isEditing) {
      document.querySelector('#sale-form-date').value = new Date().toISOString().substring(0, 10);
      document.querySelector('#fixed-plan-start-date').value = new Date().toISOString().substring(0, 10);
    }

    // Property pre-fills pricing
    const propertySelect = document.querySelector('#sale-form-property');
    const priceInput = document.querySelector('#sale-form-price');
    if (propertySelect && priceInput) {
      propertySelect.addEventListener('change', () => {
        const val = propertySelect.value;
        if (val && val.includes('|')) {
          const parts = val.split('|');
          priceInput.value = parts[2] || '';
          recalculateSchedule();
        }
      });
    }

    // Customer affiliate auto-suggest
    const customerSelect = document.querySelector('#sale-form-customer');
    const affiliateSelect = document.querySelector('#sale-form-affiliate');
    if (customerSelect && affiliateSelect) {
      customerSelect.addEventListener('change', () => {
        const custName = customerSelect.value;
        const custRecord = (state.admin.kycQueue || []).find(c => c.name === custName);
        if (custRecord && custRecord.assignedAffiliate && custRecord.assignedAffiliate !== 'Direct') {
          affiliateSelect.value = custRecord.assignedAffiliate;
        }
      });
    }

    // Toggle Payment plan container
    const planRadios = document.getElementsByName('sale-form-plan-radio');
    const setupContainer = document.querySelector('#installment-plan-setup-container');
    planRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'Installment') {
          setupContainer.classList.remove('hidden');
          recalculateSchedule();
        } else {
          setupContainer.classList.add('hidden');
        }
      });
    });

    // Toggle schedule fixed vs flexible panel
    const toggleFixed = document.querySelector('#toggle-plan-mode-fixed');
    const toggleFlexible = document.querySelector('#toggle-plan-mode-flexible');
    const panelFixed = document.querySelector('#panel-fixed-schedule');
    const panelFlexible = document.querySelector('#panel-flexible-schedule');

    if (toggleFixed && toggleFlexible) {
      toggleFixed.addEventListener('click', (e) => {
        e.preventDefault();
        activePlanMode = 'fixed';
        toggleFixed.className = "px-3 py-1 font-bold rounded bg-[#1e3a8a] text-white transition-all";
        toggleFlexible.className = "px-3 py-1 font-bold rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-all";
        panelFixed.classList.remove('hidden');
        panelFlexible.classList.add('hidden');
        recalculateSchedule();
      });

      toggleFlexible.addEventListener('click', (e) => {
        e.preventDefault();
        activePlanMode = 'flexible';
        toggleFlexible.className = "px-3 py-1 font-bold rounded bg-[#1e3a8a] text-white transition-all";
        toggleFixed.className = "px-3 py-1 font-bold rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-all";
        panelFlexible.classList.remove('hidden');
        panelFixed.classList.add('hidden');
        recalculateSchedule();
      });
    }

    // Recalculate schedule helper
    const recalculateSchedule = () => {
      const price = parseFloat(priceInput.value) || 0;
      const previewTbody = document.querySelector('#installment-preview-tbody');
      if (!previewTbody) return;

      if (activePlanMode === 'fixed') {
        const dpPct = parseFloat(document.querySelector('#fixed-plan-dp').value) || 0;
        const count = parseInt(document.querySelector('#fixed-plan-count').value) || 1;
        const startDateVal = document.querySelector('#fixed-plan-start-date').value || new Date().toISOString().substring(0, 10);

        const dpAmount = Math.round(price * (dpPct / 100));
        const rem = price - dpAmount;
        const monthlyAmt = Math.round(rem / count);

        const schedule = [];
        schedule.push({ seq: 0, label: 'Downpayment Deposit', dueDate: startDateVal, amount: dpAmount, cleared: false });

        let currentD = new Date(startDateVal);
        for (let i = 1; i <= count; i++) {
          currentD.setMonth(currentD.getMonth() + 1);
          const dateStr = currentD.toISOString().substring(0, 10);
          const amt = i === count ? rem - (monthlyAmt * (count - 1)) : monthlyAmt;
          schedule.push({ seq: i, label: `Installment ${i}`, dueDate: dateStr, amount: amt, cleared: false });
        }

        renderSchedulePreview(schedule);
      } else {
        // Flexible Mode
        const sum = flexibleRows.reduce((s, r) => s + r.amount, 0);
        const rem = Math.max(0, price - sum);
        document.querySelector('#flexible-plan-remaining-balance').textContent = fmtNGN(rem);

        const schedule = flexibleRows.map((r, i) => ({
          seq: i,
          label: r.label || `Installment ${i + 1}`,
          dueDate: r.dueDate || new Date().toISOString().substring(0, 10),
          amount: r.amount || 0,
          cleared: false
        }));

        renderSchedulePreview(schedule);
      }
    };

    const renderSchedulePreview = (schedule) => {
      const previewTbody = document.querySelector('#installment-preview-tbody');
      if (!previewTbody) return;

      previewTbody.innerHTML = schedule.map(s => `
        <tr class="border-b border-slate-250/10">
          <td class="py-1 font-mono">${s.seq}</td>
          <td class="py-1 text-slate-500">${s.label}</td>
          <td class="py-1 font-mono text-slate-500">${s.dueDate}</td>
          <td class="py-1 text-right font-bold">${fmtNGN(s.amount)}</td>
        </tr>
      `).join('');

      // Update hidden json
      document.querySelector('#sale-form-schedule-json').value = JSON.stringify(schedule);
    };

    // Calculate Fixed trigger
    document.querySelector('#btn-recalculate-fixed-plan')?.addEventListener('click', recalculateSchedule);

    // Flexible inputs manager
    const flexibleRowsContainer = document.querySelector('#flexible-rows-container');
    const addFlexRowBtn = document.querySelector('#btn-add-flexible-row');
    if (addFlexRowBtn && flexibleRowsContainer) {
      addFlexRowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = flexibleRows.length;
        flexibleRows.push({ label: `Installment ${idx + 1}`, dueDate: new Date().toISOString().substring(0, 10), amount: 0 });
        
        const div = document.createElement('div');
        div.className = "flex gap-2 items-center animate-fade-in";
        div.innerHTML = `
          <input type="text" placeholder="Installment label" class="form-input text-xs flex-1 bg-slate-50 dark:bg-slate-955 py-1.5" data-flex-row-label="${idx}" value="Installment ${idx + 1}" />
          <input type="date" class="form-input text-xs w-36 bg-slate-50 dark:bg-slate-955 py-1.5 font-mono" data-flex-row-date="${idx}" value="${new Date().toISOString().substring(0, 10)}" />
          <input type="number" placeholder="Amount (₦)" class="form-input text-xs w-36 bg-slate-50 dark:bg-slate-955 py-1.5 font-bold" data-flex-row-amount="${idx}" />
          <button type="button" class="btn-delete-flex-row text-rose-500 hover:text-rose-700 flex-shrink-0" data-flex-row-del="${idx}"><i class="bx bx-trash text-sm"></i></button>
        `;
        flexibleRowsContainer.appendChild(div);

        // Bind events
        div.querySelector(`[data-flex-row-label="${idx}"]`).addEventListener('input', (ev) => {
          flexibleRows[idx].label = ev.target.value;
          recalculateSchedule();
        });
        div.querySelector(`[data-flex-row-date="${idx}"]`).addEventListener('change', (ev) => {
          flexibleRows[idx].dueDate = ev.target.value;
          recalculateSchedule();
        });
        div.querySelector(`[data-flex-row-amount="${idx}"]`).addEventListener('input', (ev) => {
          flexibleRows[idx].amount = parseFloat(ev.target.value) || 0;
          recalculateSchedule();
        });
        div.querySelector(`[data-flex-row-del="${idx}"]`).addEventListener('click', (ev) => {
          ev.preventDefault();
          div.remove();
          flexibleRows[idx].amount = 0;
          recalculateSchedule();
        });

        recalculateSchedule();
      });
    }

    // Pre-fill editable schedules
    if (isEditing && sale.plan !== 'Outright' && sale.schedule?.length) {
      document.querySelector('#installment-plan-setup-container').classList.remove('hidden');
      document.querySelector('input[name="sale-form-plan-radio"][value="Installment"]').checked = true;
      
      // Load into flexible row state
      flexibleRows = sale.schedule.map(s => ({
        label: s.label,
        dueDate: s.dueDate,
        amount: s.amount
      }));
      
      if (flexibleRowsContainer) {
        flexibleRowsContainer.innerHTML = '';
        flexibleRows.forEach((row, idx) => {
          const div = document.createElement('div');
          div.className = "flex gap-2 items-center";
          div.innerHTML = `
            <input type="text" class="form-input text-xs flex-1 bg-slate-50 dark:bg-slate-955 py-1.5" data-flex-row-label="${idx}" value="${row.label}" />
            <input type="date" class="form-input text-xs w-36 bg-slate-50 dark:bg-slate-955 py-1.5 font-mono" data-flex-row-date="${idx}" value="${row.dueDate}" />
            <input type="number" class="form-input text-xs w-36 bg-slate-50 dark:bg-slate-955 py-1.5 font-bold" data-flex-row-amount="${idx}" value="${row.amount}" />
            <button type="button" class="btn-delete-flex-row text-rose-500 hover:text-rose-700 flex-shrink-0" data-flex-row-del="${idx}"><i class="bx bx-trash text-sm"></i></button>
          `;
          flexibleRowsContainer.appendChild(div);

          div.querySelector(`[data-flex-row-label="${idx}"]`).addEventListener('input', (ev) => {
            flexibleRows[idx].label = ev.target.value;
            recalculateSchedule();
          });
          div.querySelector(`[data-flex-row-date="${idx}"]`).addEventListener('change', (ev) => {
            flexibleRows[idx].dueDate = ev.target.value;
            recalculateSchedule();
          });
          div.querySelector(`[data-flex-row-amount="${idx}"]`).addEventListener('input', (ev) => {
            flexibleRows[idx].amount = parseFloat(ev.target.value) || 0;
            recalculateSchedule();
          });
          div.querySelector(`[data-flex-row-del="${idx}"]`).addEventListener('click', (ev) => {
            ev.preventDefault();
            div.remove();
            flexibleRows[idx].amount = 0;
            recalculateSchedule();
          });
        });
      }
      recalculateSchedule();
    }

    // Registration Form submit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const editIdVal = document.querySelector('#sale-edit-id').value;
        const customer = document.querySelector('#sale-form-customer').value;
        const propertyRaw = document.querySelector('#sale-form-property').value;
        const priceVal = document.querySelector('#sale-form-price').value;
        const date = document.querySelector('#sale-form-date').value;
        const affiliate = document.querySelector('#sale-form-affiliate').value;
        const notes = document.querySelector('#sale-form-notes').value.trim();

        const isInstallmentSelected = document.querySelector('input[name="sale-form-plan-radio"]:checked').value === 'Installment';
        const scheduleJson = document.querySelector('#sale-form-schedule-json').value || '[]';
        const schedule = isInstallmentSelected ? JSON.parse(scheduleJson) : [];

        if (!customer || !propertyRaw || !priceVal || !date) {
          showToast('Please fill in all required inputs.', 'error');
          return;
        }

        const [pId, pTitle] = propertyRaw.split('|');
        const price = parseFloat(priceVal);

        const targetProperty = properties.find(item => item.id === parseInt(pId));
        const clientEmail = (state.admin.kycQueue || []).find(c => c.name === customer)?.email || 'florence@domain.com';

        if (editIdVal) {
          const entry = orders.find(item => item.id === parseInt(editIdVal));
          if (entry) {
            entry.clientName = customer;
            entry.propertyId = parseInt(pId);
            entry.propertyTitle = pTitle;
            entry.price = price;
            entry.plan = isInstallmentSelected ? (schedule.length > 0 ? `${schedule.length - 1}-Installment Plan` : 'Installment Plan') : 'Outright';
            entry.date = date;
            entry.affiliate1 = affiliate;
            entry.notes = notes;
            entry.schedule = schedule;
            
            syncScheduleClearing(entry);
            addAuditLog(`Updated sale contract details for reference ${genRef(entry.id)}`, 'Sales');
            showToast(`Sale details saved successfully.`);
            state.admin.selectedSaleId = entry.id;
          }
        } else {
          // Generate new sale record
          const nextId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
          const newSale = {
            id: nextId,
            clientName: customer,
            email: clientEmail,
            propertyId: parseInt(pId),
            propertyTitle: pTitle,
            price: price,
            plan: isInstallmentSelected ? (schedule.length > 0 ? `${schedule.length - 1}-Installment Plan` : 'Installment Plan') : 'Outright',
            date: date,
            affiliate1: affiliate,
            affiliate2: '',
            notes: notes,
            schedule: schedule,
            paidAmount: 0,
            paymentHistory: [],
            documents: []
          };
          orders.unshift(newSale);

          // Mark property as Reserved
          if (targetProperty) {
            targetProperty.status = 'Reserved';
            addAuditLog(`Marked property "${pTitle}" as Reserved upon new contract sale registration`, 'Properties');
          }

          // Auto-generate invoice
          const invoices = state.admin.invoicesLog || [];
          const nextInvId = invoices.length > 0 ? Math.max(...invoices.map(i => i.id)) + 1 : 201;
          const invoiceRef = `INV-${String(nextInvId).padStart(4, '0')}`;
          
          invoices.unshift({
            id: nextInvId,
            invoiceRef,
            saleId: nextId,
            clientName: customer,
            email: clientEmail,
            propertyTitle: pTitle,
            date: date,
            price: price,
            paid: 0,
            balance: price,
            status: 'Unpaid',
            notes: `Auto-generated statement invoice for contract ${genRef(nextId)}.`
          });

          addAuditLog(`Registered new sale agreement ${genRef(nextId)} and auto-issued statement invoice ${invoiceRef}`, 'Sales');
          showToast(`Sale recorded successfully and Invoice ${invoiceRef} generated.`);
          state.admin.selectedSaleId = nextId;
        }

        state.admin.salesViewMode = 'detail';
        initAdminTab('sales-list');
        renderApp();
      });
    }
  }

  // --- Bind Detail View Controllers ---
  if (viewMode === 'detail') {
    const selectedId = state.admin.selectedSaleId;
    const sale = selectedId ? orders.find(item => item.id === parseInt(selectedId)) : null;

    if (!sale) {
      root.innerHTML = `<div class="p-6 text-center text-slate-500">Error: Sale record details not found.</div>`;
      return;
    }

    const paid = (sale.paymentHistory || []).reduce((sum, p) => sum + p.amount, 0);
    const balance = Math.max(0, sale.price - paid);
    const pct = sale.price > 0 ? Math.min(100, Math.round((paid / sale.price) * 100)) : 0;

    // Header info
    document.querySelector('#sale-detail-title-ref').textContent = genRef(sale.id);
    document.querySelector('#detail-committed-val').textContent = fmtNGN(sale.price);
    document.querySelector('#detail-paid-val').textContent = fmtNGN(paid);
    document.querySelector('#detail-balance-val').textContent = fmtNGN(balance);
    document.querySelector('#detail-paid-ratio-bar').style.width = `${pct}%`;
    document.querySelector('#detail-paid-ratio-text').textContent = `${pct}%`;

    // Customer
    const cust = (state.admin.kycQueue || []).find(c => c.name === sale.clientName) || { name: sale.clientName, email: sale.email, phone: 'N/A' };
    document.querySelector('#detail-cust-name').textContent = cust.name;
    document.querySelector('#detail-cust-email').textContent = cust.email;
    document.querySelector('#detail-cust-avatar').textContent = cust.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Property details
    document.querySelector('#detail-prop-title').textContent = sale.propertyTitle;
    document.querySelector('#detail-prop-location').textContent = sale.propertyLocation || 'Lekki Lagos';
    document.querySelector('#detail-prop-type').textContent = sale.propertyType || 'Residential Plot';

    // Affiliate commission chain: Generation 1 & override Generation 2
    const affiliateChainContainer = document.querySelector('#detail-affiliate-chain-list');
    if (affiliateChainContainer) {
      if (sale.affiliate1 === 'Direct' || !sale.affiliate1) {
        affiliateChainContainer.innerHTML = `<p class="text-xs text-slate-455 italic font-normal">Referred Directly (No Gen 1 / Gen 2 commissions chain assigned).</p>`;
      } else {
        const commDirect = Math.round(sale.price * 0.1);
        const commOverride = Math.round(sale.price * 0.05);

        affiliateChainContainer.innerHTML = `
          <div class="flex items-center justify-between py-1.5 border-b border-slate-105/10 text-xs">
            <div>
              <span class="block font-bold text-slate-800 dark:text-white">${sale.affiliate1}</span>
              <span class="block text-[10px] text-slate-400">Generation 1 Direct Realtor (10%)</span>
            </div>
            <span class="font-bold text-emerald-600 dark:text-emerald-450">${fmtNGN(commDirect)}</span>
          </div>
          <div class="flex items-center justify-between py-1.5 text-xs">
            <div>
              <span class="block font-bold text-slate-800 dark:text-white">Gen 2 Upliner Partner</span>
              <span class="block text-[10px] text-slate-400">Generation 2 Override Realtor (5%)</span>
            </div>
            <span class="font-bold text-purple-600 dark:text-purple-400">${fmtNGN(commOverride)}</span>
          </div>
        `;
      }
    }

    // Installment schedule
    const scheduleTbody = document.querySelector('#detail-schedule-tbody');
    if (scheduleTbody) {
      if (!sale.schedule || sale.schedule.length === 0) {
        scheduleTbody.innerHTML = `<tr><td colspan="5" class="p-3 text-center text-slate-400 italic">Outright sale contract (No installment schedule logged).</td></tr>`;
      } else {
        scheduleTbody.innerHTML = sale.schedule.map(s => {
          const isPast = new Date(s.dueDate) < new Date();
          const labelClass = s.cleared ? 'text-green-600 font-bold' : isPast ? 'text-rose-500 font-bold' : 'text-slate-655 font-bold';
          const badgeClass = s.cleared ? 'bg-emerald-500/10 text-emerald-600' : isPast ? 'bg-rose-500/10 text-rose-600' : 'bg-slate-100 text-slate-455';
          const badgeText = s.cleared ? 'Cleared' : isPast ? 'Overdue' : 'Upcoming';

          return `
            <tr class="border-b border-slate-100 dark:border-slate-850">
              <td class="p-3 font-mono text-slate-400">${s.seq}</td>
              <td class="p-3 text-slate-500 font-normal">${s.label}</td>
              <td class="p-3 font-mono ${labelClass}">${s.dueDate}</td>
              <td class="p-3 font-bold">${fmtNGN(s.amount)}</td>
              <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badgeClass}">${badgeText}</span></td>
            </tr>
          `;
        }).join('');
      }
    }

    // Payments ledger
    const paymentsTbody = document.querySelector('#detail-payments-history-tbody');
    if (paymentsTbody) {
      const ledger = sale.paymentHistory || [];
      if (ledger.length === 0) {
        paymentsTbody.innerHTML = `<tr><td colspan="6" class="p-3 text-center text-slate-400 italic">No payments recorded. Reconcile transaction ledger on left box.</td></tr>`;
      } else {
        paymentsTbody.innerHTML = ledger.map((pay, i) => `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
            <td class="p-3 font-mono text-slate-500">${pay.date}</td>
            <td class="p-3 text-slate-500 font-normal">${pay.channel || 'Direct transfer'}</td>
            <td class="p-3 text-emerald-600 font-bold">${fmtNGN(pay.amount)}</td>
            <td class="p-3 font-mono text-slate-500">${pay.reference || 'N/A'}</td>
            <td class="p-3 text-slate-500 font-normal max-w-[150px] truncate">${pay.note || '—'}</td>
            <td class="p-3 text-right">
              <button data-delete-payment-idx="${i}" class="text-rose-500 hover:text-rose-700"><i class="bx bx-trash"></i></button>
            </td>
          </tr>
        `).join('');
      }
    }

    // Associated statement documents
    const deedsContainer = document.querySelector('#detail-deeds-list-container');
    if (deedsContainer) {
      // Find matched invoices
      const invoices = (state.admin.invoicesLog || []).filter(i => i.saleId === sale.id);
      let htmlDocs = invoices.map(inv => `
        <div class="flex items-center justify-between bg-slate-50 dark:bg-slate-955 p-2.5 rounded border border-slate-200/20 text-xs">
          <span class="font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-bold"><i class="bx bx-file text-slate-400 text-sm"></i>Statement Invoice ${inv.invoiceRef}</span>
          <button data-print-invoice-id="${inv.id}" class="text-blue-550 hover:underline font-bold">Print/Download</button>
        </div>
      `).join('');

      const uploadedFiles = sale.documents || [];
      htmlDocs += uploadedFiles.map((doc, idx) => `
        <div class="flex items-center justify-between bg-slate-50 dark:bg-slate-955 p-2.5 rounded border border-slate-200/20 text-xs mt-1.5">
          <span class="font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-semibold"><i class="bx bx-paperclip text-slate-400 text-sm"></i>${doc.name}</span>
          <div class="flex gap-2">
            <a href="${doc.url || '#'}" download="${doc.name}" class="text-blue-550 hover:underline">Download</a>
            <button data-delete-sale-doc-idx="${idx}" class="text-rose-500 hover:text-rose-700 font-bold"><i class="bx bx-trash"></i></button>
          </div>
        </div>
      `).join('');

      deedsContainer.innerHTML = htmlDocs || `<span class="text-slate-400 italic text-[10px] block text-center py-2">No documents or invoices generated.</span>`;
    }

    // Scoped Manual Payment submit
    const payForm = document.querySelector('#detail-payment-log-form');
    if (payForm) {
      document.querySelector('#detail-log-pay-date').value = new Date().toISOString().substring(0, 10);
      
      payForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amt = parseFloat(document.querySelector('#detail-log-pay-amount').value) || 0;
        const date = document.querySelector('#detail-log-pay-date').value;
        const ref = document.querySelector('#detail-log-pay-ref').value.trim();
        const method = document.querySelector('#detail-log-pay-method').value;
        const notes = document.querySelector('#detail-log-pay-notes').value.trim();

        if (amt <= 0 || !date || !ref) {
          showToast('Payment details validation failed.', 'error');
          return;
        }

        // Add confirmed payment to payments log
        const payments = state.admin.paymentsLog || [];
        const newPayId = Date.now();
        
        payments.unshift({
          id: newPayId,
          saleId: sale.id,
          clientName: sale.clientName,
          propertyTitle: sale.propertyTitle,
          amount: amt,
          date: date,
          channel: method,
          reference: ref,
          note: notes,
          proofUrl: '',
          status: 'Confirmed'
        });

        // Add to sale history
        if (!sale.paymentHistory) sale.paymentHistory = [];
        sale.paymentHistory.push({
          id: newPayId,
          amount: amt,
          date: date,
          channel: method,
          reference: ref,
          note: notes
        });

        sale.paidAmount = sale.paymentHistory.reduce((sum, h) => sum + h.amount, 0);
        syncScheduleClearing(sale);

        // Reconcile Invoice details as well
        const invoices = state.admin.invoicesLog || [];
        const relatedInv = invoices.find(i => i.saleId === sale.id);
        if (relatedInv) {
          relatedInv.paid = sale.paidAmount;
          relatedInv.balance = Math.max(0, relatedInv.price - sale.paidAmount);
          relatedInv.status = relatedInv.balance === 0 ? 'Fully Paid' : (relatedInv.paid > 0 ? 'Partially Paid' : 'Unpaid');
        }

        addAuditLog(`Reconciled payment of ${fmtNGN(amt)} for sale ${genRef(sale.id)}`, 'Payments');
        showToast('Payment logged successfully.');
        initAdminTab('sales-list');
      });
    }
  }

  // --- Clicks Delegations & Print modal ---
  root.addEventListener('click', (e) => {
    // Add customer shortcut
    if (e.target.closest('#sale-form-add-customer-shortcut')) {
      e.preventDefault();
      state.admin.customerViewMode = 'create';
      state.admin.selectedCustomerId = null;
      initAdminTab('customers');
      return;
    }

    // View Sale details row
    const rowLink = e.target.closest('[data-view-sale-id]');
    if (rowLink && !e.target.closest('button')) {
      e.preventDefault();
      const id = parseInt(rowLink.getAttribute('data-view-sale-id'));
      state.admin.selectedSaleId = id;
      state.admin.salesViewMode = 'detail';
      initAdminTab('sales-list');
      return;
    }

    // View Sale details button
    const viewBtn = e.target.closest('[data-view-sale-id]');
    if (viewBtn && e.target.closest('button')) {
      e.preventDefault();
      const id = parseInt(viewBtn.getAttribute('data-view-sale-id'));
      state.admin.selectedSaleId = id;
      state.admin.salesViewMode = 'detail';
      initAdminTab('sales-list');
      return;
    }

    // Create sale trigger
    if (e.target.closest('#create-new-sale-btn')) {
      e.preventDefault();
      state.admin.selectedSaleId = null;
      state.admin.salesViewMode = 'create';
      initAdminTab('sales-list');
      return;
    }

    // Edit sale trigger
    const editBtn = e.target.closest('[data-edit-sale-id]') || e.target.closest('#edit-sale-btn');
    if (editBtn) {
      e.preventDefault();
      const id = editBtn.id === 'edit-sale-btn' ? state.admin.selectedSaleId : parseInt(editBtn.getAttribute('data-edit-sale-id'));
      state.admin.selectedSaleId = id;
      state.admin.salesViewMode = 'edit';
      initAdminTab('sales-list');
      return;
    }

    // Delete sale
    const deleteBtn = e.target.closest('[data-delete-sale-id]');
    if (deleteBtn) {
      e.preventDefault();
      const id = parseInt(deleteBtn.getAttribute('data-delete-sale-id'));
      const idx = orders.findIndex(item => item.id === id);
      if (idx !== -1) {
        if (confirm(`Are you sure you want to permanently delete sale contract ${genRef(id)}?`)) {
          const entry = orders[idx];
          // Make property Available again
          const prop = properties.find(p => p.title === entry.propertyTitle);
          if (prop) prop.status = 'Available';

          orders.splice(idx, 1);
          addAuditLog(`Deleted sale contract reference ${genRef(id)}`, 'Sales');
          showToast('Sale deleted.');
          initAdminTab('sales-list');
          renderApp();
        }
      }
      return;
    }

    // Back to sales list
    if (e.target.closest('#detail-back-btn') || e.target.closest('#back-to-sales-btn') || e.target.closest('#cancel-sale-form-btn')) {
      e.preventDefault();
      state.admin.salesViewMode = 'list';
      state.admin.selectedSaleId = null;
      initAdminTab('sales-list');
      return;
    }

    // Delete payment from detail
    const deletePayBtn = e.target.closest('[data-delete-payment-idx]');
    if (deletePayBtn) {
      e.preventDefault();
      const idx = parseInt(deletePayBtn.getAttribute('data-delete-payment-idx'));
      const saleId = parseInt(deletePayBtn.getAttribute('data-pay-sale-id'));
      const saleEntry = orders.find(item => item.id === saleId);
      
      if (saleEntry && confirm('Are you sure you want to delete this payment record?')) {
        const payRecord = saleEntry.paymentHistory[idx];
        
        // Remove from paymentsLog
        const payments = state.admin.paymentsLog || [];
        const pIdx = payments.findIndex(p => p.saleId === saleId && p.amount === payRecord.amount && p.date === payRecord.date);
        if (pIdx !== -1) payments.splice(pIdx, 1);

        saleEntry.paymentHistory.splice(idx, 1);
        saleEntry.paidAmount = saleEntry.paymentHistory.reduce((sum, p) => sum + p.amount, 0);
        syncScheduleClearing(saleEntry);

        // Reconcile Invoice
        const invoices = state.admin.invoicesLog || [];
        const relatedInv = invoices.find(i => i.saleId === saleEntry.id);
        if (relatedInv) {
          relatedInv.paid = saleEntry.paidAmount;
          relatedInv.balance = Math.max(0, relatedInv.price - saleEntry.paidAmount);
          relatedInv.status = relatedInv.balance === 0 ? 'Fully Paid' : (relatedInv.paid > 0 ? 'Partially Paid' : 'Unpaid');
        }

        addAuditLog(`Deleted payment record for sale ${genRef(saleId)}`, 'Payments');
        showToast('Payment record removed.', 'error');
        initAdminTab('sales-list');
      }
      return;
    }

    // Delete sale attachment doc
    const deleteDocBtn = e.target.closest('[data-delete-sale-doc-idx]');
    if (deleteDocBtn) {
      e.preventDefault();
      const idx = parseInt(deleteDocBtn.getAttribute('data-delete-sale-doc-idx'));
      const saleId = parseInt(deleteDocBtn.getAttribute('data-doc-sale-id'));
      const saleEntry = orders.find(item => item.id === saleId);
      
      if (saleEntry && confirm('Delete this attached file document?')) {
        const name = saleEntry.documents[idx].name;
        saleEntry.documents.splice(idx, 1);
        addAuditLog(`Removed document "${name}" from sale ${genRef(saleId)}`, 'Sales');
        showToast('Document removed.');
        initAdminTab('sales-list');
      }
      return;
    }

    // Upload Sale Document
    const uploadInput = document.querySelector('#sale-doc-file-input');
    if (e.target.closest('#trigger-sale-doc-upload') && uploadInput) {
      e.preventDefault();
      uploadInput.click();
      return;
    }

    // Manual invoice generation from detail
    if (e.target.closest('#btn-manual-invoice-generation')) {
      e.preventDefault();
      const saleId = state.admin.selectedSaleId;
      const saleEntry = orders.find(item => item.id === saleId);
      if (saleEntry) {
        const invoices = state.admin.invoicesLog || [];
        const nextInvId = invoices.length > 0 ? Math.max(...invoices.map(i => i.id)) + 1 : 201;
        const invoiceRef = `INV-${String(nextInvId).padStart(4, '0')}`;
        
        invoices.unshift({
          id: nextInvId,
          invoiceRef,
          saleId: saleEntry.id,
          clientName: saleEntry.clientName,
          email: saleEntry.email,
          propertyTitle: saleEntry.propertyTitle,
          date: new Date().toISOString().substring(0, 10),
          price: saleEntry.price,
          paid: saleEntry.paidAmount,
          balance: Math.max(0, saleEntry.price - saleEntry.paidAmount),
          status: saleEntry.paidAmount >= saleEntry.price ? 'Fully Paid' : (saleEntry.paidAmount > 0 ? 'Partially Paid' : 'Unpaid'),
          notes: 'Manually issued invoice copy statement.'
        });

        addAuditLog(`Issued manual copy invoice ${invoiceRef} for sale ${genRef(saleEntry.id)}`, 'Invoices');
        showToast(`Invoice ${invoiceRef} successfully generated.`);
        initAdminTab('sales-list');
      }
      return;
    }

    // Print Invoice layout modal trigger (General print dispatch window)
    const printInvBtn = e.target.closest('#print-sale-invoice-btn') || e.target.closest('[data-invoice-sale-id]');
    if (printInvBtn) {
      e.preventDefault();
      let saleToPrint = sale;
      if (!saleToPrint) {
        const printId = parseInt(printInvBtn.getAttribute('data-invoice-sale-id') || printInvBtn.dataset.invoiceSaleId);
        if (printId) saleToPrint = orders.find(o => o.id === printId);
      }

      if (saleToPrint) {
        const invoices = state.admin.invoicesLog || [];
        const matchedInv = invoices.find(i => i.saleId === saleToPrint.id) || { invoiceRef: 'INV-TEMP', date: saleToPrint.date, notes: '' };
        
        const companyName = state.admin.settings?.companyName || 'BLUESKYE CITY HOME';
        const companyAddress = state.admin.settings?.companyAddress || 'Plot 15, Lekki Phase 1, Lagos';
        const companyEmail = state.admin.settings?.companyEmail || 'advisors@blueskyecityhome.com';
        
        const escrowBank = state.admin.settings?.escrowBankName || 'Zenith Bank PLC';
        const escrowName = state.admin.settings?.escrowAccountName || 'Blueskye Escrow Shield Ltd';
        const escrowNumber = state.admin.settings?.escrowAccountNumber || '1012345678';

        const totalPaid = (saleToPrint.paymentHistory || []).reduce((sum, p) => sum + p.amount, 0);
        const outstandingBal = Math.max(0, saleToPrint.price - totalPaid);

        const w = window.open('', '_blank');
        w.document.write(`
          <html>
          <head>
            <title>Statement Invoice — ${matchedInv.invoiceRef}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
              .invoice-card { max-width: 800px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
              .header { border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
              .logo { font-size: 24px; font-weight: 800; color: #1e3a8a; }
              .invoice-title { font-size: 28px; font-weight: 900; color: #1e3a8a; text-transform: uppercase; margin: 0; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; font-size: 14px; }
              table { width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 14px; }
              th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
              th { background-color: #f8fafc; font-weight: 700; color: #475569; }
              .total { font-weight: 800; font-size: 15px; }
              .footer { margin-top: 40px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; line-height: 1.6; }
              .btn-group { display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end; }
              @media print { .btn-group { display: none; } }
            </style>
          </head>
          <body>
            <div class="invoice-card">
              <div class="header">
                <div>
                  <div class="logo">${companyName}</div>
                  <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${companyAddress} | ${companyEmail}</div>
                </div>
                <h1 class="invoice-title">Statement Invoice</h1>
              </div>

              <div class="grid">
                <div>
                  <p><b>Invoice Reference:</b> ${matchedInv.invoiceRef}</p>
                  <p><b>Date Issued:</b> ${matchedInv.date}</p>
                  <p><b>Contract Sale:</b> ${genRef(saleToPrint.id)}</p>
                  <p><b>Payment Terms:</b> ${saleToPrint.plan}</p>
                </div>
                <div>
                  <p><b>Billed To Customer:</b></p>
                  <p style="font-weight: 700; color: #1e293b; margin: 4px 0;">${saleToPrint.clientName}</p>
                  <p>Email: ${saleToPrint.email || 'N/A'}</p>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th style="text-align: right; width: 150px;">Contract Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p style="font-weight: 700; margin: 0 0 4px 0;">${saleToPrint.propertyTitle}</p>
                      <p style="font-size: 11px; color: #64748b; margin: 0;">Plot location coordinates matching estate catalog mappings.</p>
                    </td>
                    <td style="text-align: right; font-weight: bold;">${fmtNGN(saleToPrint.price)}</td>
                  </tr>
                  <tr class="total">
                    <td>Contract Total Value</td>
                    <td style="text-align: right;">${fmtNGN(saleToPrint.price)}</td>
                  </tr>
                  <tr>
                    <td>Escrow Payments Confirmed</td>
                    <td style="text-align: right; color: #10b981; font-weight: bold;">${fmtNGN(totalPaid)}</td>
                  </tr>
                  <tr class="total" style="color: ${outstandingBal > 0 ? '#ef4444' : '#10b981'};">
                    <td>Balance Outstanding</td>
                    <td style="text-align: right;">${fmtNGN(outstandingBal)}</td>
                  </tr>
                </tbody>
              </table>

              ${saleToPrint.notes || matchedInv.notes ? `
                <div style="margin-top: 25px; font-size: 12px; background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #f1f5f9;">
                  <b>Notes &amp; Deadlines Terms:</b>
                  <p style="margin: 6px 0 0 0; color: #475569; line-height: 1.5;">${saleToPrint.notes || matchedInv.notes}</p>
                </div>
              ` : ''}

              <div class="footer">
                <p>All payments must be made to verified Escrow Bank Account detail:<br>Bank: <b>${escrowBank}</b> | Account Name: <b>${escrowName}</b> | Account Number: <b>${escrowNumber}</b></p>
                <p style="text-align: center; margin-top: 15px; font-size: 10px;">Generated officially by Blueskye City Homes Ltd Billing registries. Thank you for your custom.</p>
              </div>
            </div>
            
            <div class="btn-group">
              <button onclick="window.print()" style="padding: 8px 16px; background-color: #1e3a8a; color: white; border: none; font-weight: 700; border-radius: 4px; cursor: pointer;">Print statement</button>
              <button onclick="window.close()" style="padding: 8px 16px; background-color: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; font-weight: 700; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
          </body>
          </html>
        `);
        w.document.close();
      }
    }
  });

  // Direct document upload changer listener
  const docInput = document.querySelector('#sale-doc-file-input');
  if (docInput) {
    docInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const saleId = state.admin.selectedSaleId;
        const saleEntry = orders.find(item => item.id === saleId);
        
        if (saleEntry) {
          if (!saleEntry.documents) saleEntry.documents = [];
          saleEntry.documents.push({
            name: file.name,
            url: event.target.result
          });

          addAuditLog(`Uploaded document "${file.name}" to sale agreement ${genRef(saleId)}`, 'Sales');
          showToast('File document attached successfully.');
          initAdminTab('sales-list');
        }
      };
      reader.readAsDataURL(file);
    });
  }
}
