import paymentsTemplates from '../html/payments.html?raw';

function getSection(name) {
  const startMarker = `data-section="${name}"`;
  const startIdx = paymentsTemplates.indexOf(startMarker);
  if (startIdx === -1) return '';
  const divStart = paymentsTemplates.lastIndexOf('<div', startIdx);
  const endMarker = `END SECTION: ${name}`;
  const endCommentIdx = paymentsTemplates.indexOf(endMarker, startIdx);
  if (endCommentIdx === -1) return '';
  const closingDiv = paymentsTemplates.lastIndexOf('</div>', endCommentIdx);
  if (closingDiv === -1) return '';
  return paymentsTemplates.slice(divStart, closingDiv + 6);
}

function fmtNGN(val) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
}

function genRef(id) {
  return `SKY-SALE-${String(id).padStart(4, '0')}`;
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

// 1. MASTER ROUTER
export function renderPaymentsTab(state, properties, projects) {
  if (!state.admin.paymentsLog) state.admin.paymentsLog = [];
  if (!state.admin.paymentsViewMode) state.admin.paymentsViewMode = 'list';

  const mode = state.admin.paymentsViewMode;
  const selectedId = state.admin.selectedPaymentId;
  const payment = selectedId != null ? state.admin.paymentsLog.find(p => p.id === parseInt(selectedId)) : null;

  if (mode === 'confirm' && payment) return renderConfirmView(payment);
  if (mode === 'create') return renderFormView(state);
  return renderListView(state);
}

// 2. LIST VIEW
function renderListView(state) {
  let html = getSection('payments-list-template');
  return html;
}

// 3. CONFIRM AUDIT VIEW
function renderConfirmView(p) {
  let html = getSection('payment-confirm-template');
  return html;
}

// 4. FORM VIEW
function renderFormView(state) {
  let html = getSection('payment-form-template');

  // Populate sale selection dropdown
  const orders = state.admin.ordersLedger || [];
  const saleOptions = orders.map(o => `
    <option value="${o.id}">${genRef(o.id)} — ${o.clientName} (${o.propertyTitle})</option>
  `).join('');

  html = html.replace('<!-- DYNAMIC SALE OPTIONS -->', saleOptions);
  return html;
}

// --- Bind Payments Event Listeners ---
export function bindPaymentsTabListeners(state, root, initAdminTab, addAuditLog, renderApp) {
  if (!state.admin.paymentsLog) state.admin.paymentsLog = [];
  const log = state.admin.paymentsLog;
  const orders = state.admin.ordersLedger || [];
  const viewMode = state.admin.paymentsViewMode;

  if (viewMode === 'list') {
    const searchInp = document.querySelector('#pay-search-input');
    const statusFilter = document.querySelector('#filter-pay-status');
    const channelFilter = document.querySelector('#filter-pay-channel');
    const dateFrom = document.querySelector('#filter-pay-date-from');
    const dateTo = document.querySelector('#filter-pay-date-to');

    // Default filters view to 'Pending Confirmation' so admin sees audits first
    if (statusFilter && !statusFilter.dataset.initialized) {
      statusFilter.value = 'Pending Confirmation';
      statusFilter.dataset.initialized = 'true';
    }

    function renderTableRows() {
      const q = (searchInp?.value || '').toLowerCase().trim();
      const sv = statusFilter?.value || 'all';
      const cv = channelFilter?.value || 'all';
      const df = dateFrom?.value || '';
      const dt = dateTo?.value || '';

      const tbody = document.querySelector('#payments-table-body');
      if (!tbody) return;

      const filtered = log.filter(p => {
        const matchesQuery = !q || [p.clientName, p.propertyTitle, p.reference, String(p.id)].join(' ').toLowerCase().includes(q);
        const matchesStatus = sv === 'all' || p.status === sv;
        const matchesChannel = cv === 'all' || p.channel === cv;
        const matchesDate = (!df || p.date >= df) && (!dt || p.date <= dt);
        return matchesQuery && matchesStatus && matchesChannel && matchesDate;
      });

      // Update KPI metrics values
      const confirmedList = log.filter(p => p.status === 'Confirmed');
      const pendingList = log.filter(p => p.status === 'Pending Confirmation');
      const rejectedList = log.filter(p => p.status === 'Rejected');
      
      const totalCollected = confirmedList.reduce((sum, p) => sum + p.amount, 0);

      document.querySelector('#pay-metric-collected').textContent = fmtNGN(totalCollected);
      document.querySelector('#pay-metric-pending').textContent = `${pendingList.length} Pending`;
      document.querySelector('#pay-metric-approved').textContent = `${confirmedList.length} Cleared`;
      document.querySelector('#pay-metric-rejected').textContent = `${rejectedList.length} Rejected`;

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="p-4 text-center text-xs text-slate-400 italic">No transaction records matched current filters.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(p => {
        const badgeClass = p.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' : p.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-455' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
        
        let actionsHtml = '';
        if (p.status === 'Pending Confirmation') {
          actionsHtml = `<button data-audit-pay-id="${p.id}" class="bg-indigo-600 text-white hover:bg-indigo-700 font-bold py-1 px-2.5 rounded text-xs active:scale-98">Audit Proof</button>`;
        } else {
          actionsHtml = `
            <div class="flex items-center justify-end gap-2 text-base">
              <button data-print-receipt-id="${p.id}" class="text-blue-500 hover:text-blue-750 p-1" title="Print Receipt"><i class="bx bx-printer"></i></button>
              <button data-delete-pay-id="${p.id}" class="text-rose-550 hover:text-rose-700 p-1" title="Delete"><i class="bx bx-trash"></i></button>
            </div>
          `;
        }

        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-sm font-semibold">
            <td class="p-3 font-mono text-slate-500">${p.date}</td>
            <td class="p-3">RN-${p.id}</td>
            <td class="p-3">
              <span class="block text-slate-900 dark:text-white font-bold">${p.clientName}</span>
            </td>
            <td class="p-3 text-slate-650 dark:text-slate-350 text-xs">${p.propertyTitle}</td>
            <td class="p-3 text-emerald-600 dark:text-emerald-450 font-bold">${fmtNGN(p.amount)}</td>
            <td class="p-3 text-slate-500 font-normal text-xs">${p.channel}</td>
            <td class="p-3 font-mono text-slate-505 truncate max-w-[120px]">${p.reference || '—'}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeClass}">${p.status}</span></td>
            <td class="p-3 text-right">${actionsHtml}</td>
          </tr>
        `;
      }).join('');
    }

    if (searchInp) searchInp.addEventListener('input', renderTableRows);
    if (statusFilter) statusFilter.addEventListener('change', renderTableRows);
    if (channelFilter) channelFilter.addEventListener('change', renderTableRows);
    if (dateFrom) dateFrom.addEventListener('change', renderTableRows);
    if (dateTo) dateTo.addEventListener('change', renderTableRows);

    document.querySelector('#clear-pay-filters-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInp) searchInp.value = '';
      if (statusFilter) statusFilter.value = 'all';
      if (channelFilter) channelFilter.value = 'all';
      if (dateFrom) dateFrom.value = '';
      if (dateTo) dateTo.value = '';
      renderTableRows();
    });

    renderTableRows();
  }

  // --- Bind Confirm Audit Details ---
  if (viewMode === 'confirm') {
    const selectedId = state.admin.selectedPaymentId;
    const p = log.find(item => item.id === parseInt(selectedId));

    if (p) {
      document.querySelector('#audit-pay-id').value = p.id;
      document.querySelector('#reconcile-client-name').textContent = p.clientName;
      document.querySelector('#reconcile-property-title').textContent = p.propertyTitle;
      document.querySelector('#reconcile-claimed-amount').textContent = fmtNGN(p.amount);
      document.querySelector('#reconcile-claimed-ref').textContent = p.reference || '—';

      document.querySelector('#audit-confirmed-amount').value = p.amount;
      document.querySelector('#audit-confirmed-date').value = p.date || new Date().toISOString().substring(0, 10);
      document.querySelector('#audit-confirmed-ref').value = p.reference || '';
      document.querySelector('#audit-note').value = p.note || '';

      const imgPlaceholder = document.querySelector('#reconcile-proof-image-placeholder');
      if (imgPlaceholder) {
        if (p.proofUrl) {
          imgPlaceholder.innerHTML = `<img src="${p.proofUrl}" class="max-w-full max-h-[350px] object-contain rounded border border-slate-100 dark:border-slate-800" />`;
        } else {
          imgPlaceholder.innerHTML = `
            <div class="text-center text-slate-400 p-6 italic">
              <i class="bx bx-image-alt text-4xl block mb-1"></i>
              No physical proof uploaded (Direct manual entry).
            </div>
          `;
        }
      }
    }

    const reconcileForm = document.querySelector('#pay-reconcile-form');
    if (reconcileForm && p) {
      reconcileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const confirmedAmt = parseFloat(document.querySelector('#audit-confirmed-amount').value) || 0;
        const confirmedDate = document.querySelector('#audit-confirmed-date').value;
        const confirmedRef = document.querySelector('#audit-confirmed-ref').value.trim();
        const noteVal = document.querySelector('#audit-note').value.trim();

        if (confirmedAmt <= 0 || !confirmedDate || !confirmedRef) {
          alert('Reconciliation validation criteria checks failed.');
          return;
        }

        // Update payment status
        p.amount = confirmedAmt;
        p.date = confirmedDate;
        p.reference = confirmedRef;
        p.note = noteVal;
        p.status = 'Confirmed';

        // Credit sale balances
        const order = orders.find(o => o.id === p.saleId);
        if (order) {
          if (!order.paymentHistory) order.paymentHistory = [];
          
          let historyItem = order.paymentHistory.find(h => h.id === p.id);
          if (historyItem) {
            historyItem.amount = confirmedAmt;
            historyItem.date = confirmedDate;
            historyItem.reference = confirmedRef;
            historyItem.note = noteVal;
          } else {
            order.paymentHistory.push({
              id: p.id,
              amount: confirmedAmt,
              date: confirmedDate,
              channel: p.channel,
              reference: confirmedRef,
              note: noteVal
            });
          }

          order.paidAmount = order.paymentHistory.reduce((sum, h) => sum + h.amount, 0);
          syncScheduleClearing(order);

          // Update invoices log
          const invoices = state.admin.invoicesLog || [];
          const relatedInv = invoices.find(i => i.saleId === order.id);
          if (relatedInv) {
            relatedInv.paid = order.paidAmount;
            relatedInv.balance = Math.max(0, relatedInv.price - order.paidAmount);
            relatedInv.status = relatedInv.balance === 0 ? 'Fully Paid' : (relatedInv.paid > 0 ? 'Partially Paid' : 'Unpaid');
          }
        }

        addAuditLog(`Reconciled and confirmed payment proof slip REC-${p.id} value ${fmtNGN(confirmedAmt)}`, 'Payments');
        alert('Payment slip checked and credited to client ledger.');
        
        state.admin.paymentsViewMode = 'list';
        state.admin.selectedPaymentId = null;
        initAdminTab('payments-list');
        renderApp();
      });
    }

    // Reconcile Reject trigger
    document.querySelector('#reject-payment-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (p && confirm('Are you sure you want to reject this transaction receipt proof?')) {
        p.status = 'Rejected';
        
        // Remove from sale history
        const order = orders.find(o => o.id === p.saleId);
        if (order && order.paymentHistory) {
          const idx = order.paymentHistory.findIndex(h => h.id === p.id);
          if (idx !== -1) {
            order.paymentHistory.splice(idx, 1);
            order.paidAmount = order.paymentHistory.reduce((sum, h) => sum + h.amount, 0);
            syncScheduleClearing(order);
          }
        }

        addAuditLog(`Rejected escrow payment receipt proof REC-${p.id}`, 'Payments');
        alert('Receipt proof marked as Rejected.');
        
        state.admin.paymentsViewMode = 'list';
        state.admin.selectedPaymentId = null;
        initAdminTab('payments-list');
        renderApp();
      }
    });
  }

  // --- Bind Manual Log Controllers ---
  if (viewMode === 'create') {
    document.querySelector('#pay-form-date').value = new Date().toISOString().substring(0, 10);

    const manualForm = document.querySelector('#pay-manual-form');
    if (manualForm) {
      manualForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const saleId = parseInt(document.querySelector('#pay-form-sale').value);
        const amount = parseFloat(document.querySelector('#pay-form-amount').value) || 0;
        const channel = document.querySelector('#pay-form-channel').value;
        const date = document.querySelector('#pay-form-date').value;
        const reference = document.querySelector('#pay-form-ref').value.trim();
        const note = document.querySelector('#pay-form-note').value.trim();

        const order = orders.find(o => o.id === saleId);
        if (!order) return;

        const newPayId = Date.now();
        log.unshift({
          id: newPayId,
          saleId: saleId,
          clientName: order.clientName,
          propertyTitle: order.propertyTitle,
          amount: amount,
          date: date,
          channel: channel,
          reference: reference,
          note: note,
          proofUrl: '',
          status: 'Confirmed'
        });

        if (!order.paymentHistory) order.paymentHistory = [];
        order.paymentHistory.push({
          id: newPayId,
          amount: amount,
          date: date,
          channel: channel,
          reference: reference,
          note: note
        });
        
        order.paidAmount = order.paymentHistory.reduce((sum, h) => sum + h.amount, 0);
        syncScheduleClearing(order);

        // Update Invoices Log
        const invoices = state.admin.invoicesLog || [];
        const relatedInv = invoices.find(i => i.saleId === order.id);
        if (relatedInv) {
          relatedInv.paid = order.paidAmount;
          relatedInv.balance = Math.max(0, relatedInv.price - order.paidAmount);
          relatedInv.status = relatedInv.balance === 0 ? 'Fully Paid' : (relatedInv.paid > 0 ? 'Partially Paid' : 'Unpaid');
        }

        addAuditLog(`Logged direct payment of ${fmtNGN(amount)} for sale ${genRef(saleId)}`, 'Payments');
        alert('Manual payment logged.');
        
        state.admin.paymentsViewMode = 'list';
        initAdminTab('payments-list');
        renderApp();
      });
    }
  }

  // --- Clicks Delegation & Receipt Print ---
  root.addEventListener('click', (e) => {
    // Add manual page click
    if (e.target.closest('#add-manual-payment-btn')) {
      e.preventDefault();
      state.admin.paymentsViewMode = 'create';
      initAdminTab('payments-list');
      return;
    }

    // Cancel forms / back buttons
    if (e.target.closest('#cancel-pay-audit-btn') || e.target.closest('#cancel-pay-form-btn') || e.target.closest('#pay-form-cancel-btn')) {
      e.preventDefault();
      state.admin.paymentsViewMode = 'list';
      state.admin.selectedPaymentId = null;
      initAdminTab('payments-list');
      return;
    }

    // Audit button click
    const auditBtn = e.target.closest('[data-audit-pay-id]');
    if (auditBtn) {
      e.preventDefault();
      state.admin.selectedPaymentId = parseInt(auditBtn.getAttribute('data-audit-pay-id'));
      state.admin.paymentsViewMode = 'confirm';
      initAdminTab('payments-list');
      return;
    }

    // Delete payment entry
    const delBtn = e.target.closest('[data-delete-pay-id]');
    if (delBtn) {
      e.preventDefault();
      const pId = parseInt(delBtn.getAttribute('data-delete-pay-id'));
      const idx = log.findIndex(p => p.id === pId);
      
      if (idx !== -1 && confirm(`Delete Payment Entry REC-${pId}?`)) {
        const pRecord = log[idx];
        log.splice(idx, 1);
        
        // Remove from sale history
        const order = orders.find(o => o.id === pRecord.saleId);
        if (order && order.paymentHistory) {
          const hIdx = order.paymentHistory.findIndex(h => h.id === pId);
          if (hIdx !== -1) {
            order.paymentHistory.splice(hIdx, 1);
            order.paidAmount = order.paymentHistory.reduce((sum, h) => sum + h.amount, 0);
            syncScheduleClearing(order);
          }
        }
        
        addAuditLog(`Deleted payment record REC-${pId}`, 'Payments');
        initAdminTab('payments-list');
        renderApp();
      }
      return;
    }

    // Print Receipt
    const printBtn = e.target.closest('[data-print-receipt-id]');
    if (printBtn) {
      e.preventDefault();
      const pId = parseInt(printBtn.getAttribute('data-print-receipt-id'));
      const p = log.find(item => item.id === pId);
      const order = orders.find(o => o.id === p?.saleId);

      if (p && order) {
        const totalPaid = (order.paymentHistory || []).reduce((sum, h) => sum + h.amount, 0);
        const outstandingBal = Math.max(0, (order.price || 0) - totalPaid);
        
        const companyName = state.admin.settings?.companyName || 'BLUESKY CITY HOMES';
        const companyAddress = state.admin.settings?.companyAddress || 'Plot 15, Lekki Phase 1, Lagos';
        const companyEmail = state.admin.settings?.companyEmail || 'advisors@blueskyecityhome.com';

        const w = window.open('', '_blank');
        w.document.write(`
          <html>
          <head>
            <title>Receipt — REC-${p.id}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
              .receipt-card { max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
              .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
              .logo { font-size: 24px; font-weight: 850; color: #10b981; }
              .badge { padding: 4px 8px; border-radius: 4px; background-color: #d1fae5; color: #065f46; font-size: 11px; font-weight: bold; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; font-size: 14px; }
              table { width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 14px; }
              th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
              th { background-color: #f8fafc; font-weight: 700; color: #475569; }
              .total { font-weight: 800; font-size: 15px; }
              .footer { margin-top: 40px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="receipt-card">
              <div class="header">
                <div>
                  <div class="logo">${companyName}</div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${companyAddress}</div>
                </div>
                <span class="badge">Cleared Receipt</span>
              </div>

              <div class="grid">
                <div>
                  <p><b>Receipt ID:</b> REC-${p.id}</p>
                  <p><b>Payment Date:</b> ${p.date}</p>
                  <p><b>Channel:</b> ${p.channel}</p>
                  <p><b>Bank Ref ID:</b> ${p.reference || '—'}</p>
                </div>
                <div>
                  <p><b>Received From:</b></p>
                  <p style="font-weight: 700; color: #1e293b; margin: 4px 0;">${p.clientName}</p>
                  <p>Sale Agreement: ${genRef(order.id)}</p>
                  <p>Property: ${order.propertyTitle}</p>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Payment Item Allocation</th>
                    <th style="text-align: right; width: 150px;">Amount Credited</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Escrow Reconciled Bank Deposit Deposit</td>
                    <td style="text-align: right; font-weight: bold; color: #10b981;">${fmtNGN(p.amount)}</td>
                  </tr>
                  <tr class="total">
                    <td>Receipt Clearance Total</td>
                    <td style="text-align: right; color: #10b981;">${fmtNGN(p.amount)}</td>
                  </tr>
                </tbody>
              </table>

              <div style="margin-top: 25px; font-size: 12px; background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #f1f5f9;">
                <b>Statement balance details:</b>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 6px;">
                  <div>Contract Total:<br><b>${fmtNGN(order.price)}</b></div>
                  <div>Cumulative Paid:<br><b>${fmtNGN(totalPaid)}</b></div>
                  <div>Outstanding Bal:<br><b style="color: ${outstandingBal > 0 ? '#ef4444' : '#10b981'};">${fmtNGN(outstandingBal)}</b></div>
                </div>
              </div>

              <div class="footer">
                <p>This document constitutes confirmation of credit to client registry ledger statement. Reconciled officially by Billing registries.</p>
                <p style="text-align: center; margin-top: 15px; font-size: 10px;">Thank you for your business.</p>
              </div>
            </div>
          </body>
          </html>
        `);
        w.document.close();
        w.print();
      }
    }
  });
}
