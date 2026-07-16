import invoicesTemplates from '../html/invoices.html?raw';

function getSection(name) {
  const startMarker = `data-section="${name}"`;
  const startIdx = invoicesTemplates.indexOf(startMarker);
  if (startIdx === -1) return '';
  const divStart = invoicesTemplates.lastIndexOf('<div', startIdx);
  const endMarker = `END SECTION: ${name}`;
  const endCommentIdx = invoicesTemplates.indexOf(endMarker, startIdx);
  if (endCommentIdx === -1) return '';
  const closingDiv = invoicesTemplates.lastIndexOf('</div>', endCommentIdx);
  if (closingDiv === -1) return '';
  return invoicesTemplates.slice(divStart, closingDiv + 6);
}

function fmtNGN(val) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
}

function invoiceBadgeClass(status) {
  switch (status) {
    case 'Fully Paid': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450';
    case 'Partially Paid': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400';
    case 'Unpaid': return 'bg-rose-500/10 text-rose-600 dark:text-rose-455';
    default: return 'bg-slate-100 text-slate-500';
  }
}

// Helper: Generate Reference SKY-SALE-xxxx
function genRef(id) {
  return `SKY-SALE-${String(id).padStart(4, '0')}`;
}

// 1. MASTER ROUTER
export function renderInvoicesTab(state, properties, projects) {
  if (!state.admin.invoicesLog) state.admin.invoicesLog = [];
  if (!state.admin.invoicesViewMode) state.admin.invoicesViewMode = 'list';

  const mode = state.admin.invoicesViewMode;

  if (mode === 'create') return renderFormView(state, properties);
  return renderListView(state);
}

// 2. LIST VIEW
function renderListView(state) {
  let html = getSection('invoices-list-template');
  return html;
}

// 3. FORM VIEW
function renderFormView(state, properties) {
  let html = getSection('invoice-form-template');

  // Customer dropdown
  const customers = state.admin.kycQueue || [];
  const custOpts = customers.map(c => `
    <option value="${c.name}|${c.email}">${c.name} (${c.email})</option>
  `).join('');

  // Property dropdown
  const propOpts = (properties || []).map(p => `
    <option value="${p.title}|${p.type || 'Residential'}|${p.location || 'Lagos'}">${p.title}</option>
  `).join('');

  html = html
    .replace('<!-- DYNAMIC CUSTOMERS -->', custOpts)
    .replace('<!-- DYNAMIC PROPERTIES -->', propOpts);

  return html;
}

// --- Bind Invoices Event Listeners ---
export function bindInvoicesTabListeners(state, root, initAdminTab, addAuditLog, renderApp) {
  if (!state.admin.invoicesLog) state.admin.invoicesLog = [];
  const log = state.admin.invoicesLog;
  const viewMode = state.admin.invoicesViewMode;

  if (viewMode === 'list') {
    const searchInp = document.querySelector('#inv-search-input');
    const statusFilter = document.querySelector('#filter-inv-status');
    const dateFrom = document.querySelector('#filter-inv-date-from');
    const dateTo = document.querySelector('#filter-inv-date-to');

    function renderTableRows() {
      const q = (searchInp?.value || '').toLowerCase().trim();
      const sv = statusFilter?.value || 'all';
      const df = dateFrom?.value || '';
      const dt = dateTo?.value || '';

      const tbody = document.querySelector('#invoices-table-body');
      if (!tbody) return;

      const filtered = log.filter(inv => {
        const matchesQuery = !q || [inv.clientName, inv.propertyTitle, inv.invoiceRef].join(' ').toLowerCase().includes(q);
        const matchesStatus = sv === 'all' || inv.status === sv;
        const matchesDate = (!df || inv.date >= df) && (!dt || inv.date <= dt);
        return matchesQuery && matchesStatus && matchesDate;
      });

      // Update KPI metrics
      const totalInvoicedVal = log.reduce((sum, inv) => sum + (inv.price || 0), 0);
      const paidCount = log.filter(inv => inv.status === 'Fully Paid').length;
      const partialCount = log.filter(inv => inv.status === 'Partially Paid').length;
      const unpaidCount = log.filter(inv => inv.status === 'Unpaid').length;

      document.querySelector('#inv-metric-total').textContent = fmtNGN(totalInvoicedVal);
      document.querySelector('#inv-metric-paid').textContent = `${paidCount} Paid`;
      document.querySelector('#inv-metric-partial').textContent = `${partialCount} Partial`;
      document.querySelector('#inv-metric-unpaid').textContent = `${unpaidCount} Unpaid`;

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="p-4 text-center text-xs text-slate-400 italic">No invoice records matched current filters.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(inv => {
        const badge = invoiceBadgeClass(inv.status);
        const dateStr = inv.date || '2026-07-01';
        const paid = inv.paid || 0;
        const balance = inv.balance || 0;

        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-sm font-semibold">
            <td class="p-3 font-mono text-slate-500">${dateStr}</td>
            <td class="p-3 font-mono text-slate-900 dark:text-white font-bold">${inv.invoiceRef}</td>
            <td class="p-3">
              <span class="block text-slate-900 dark:text-white font-bold">${inv.clientName}</span>
              <span class="block text-[10px] text-slate-400 font-mono mt-0.5">${inv.email}</span>
            </td>
            <td class="p-3 text-slate-650 dark:text-slate-350 text-xs">${inv.propertyTitle}</td>
            <td class="p-3">${fmtNGN(inv.price)}</td>
            <td class="p-3 text-emerald-600">${fmtNGN(paid)}</td>
            <td class="p-3 text-rose-500">${fmtNGN(balance)}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badge}">${inv.status}</span></td>
            <td class="p-3 text-right">
              <div class="flex items-center justify-end gap-2 text-base">
                <button data-print-invoice-id="${inv.id}" class="text-blue-500 hover:text-blue-750 p-1" title="Print Invoice Statement"><i class="bx bx-printer"></i></button>
                <button data-resend-invoice-id="${inv.id}" class="text-indigo-650 hover:text-indigo-800 p-1" title="Resend Invoice to Email"><i class="bx bx-envelope"></i></button>
                <button data-delete-invoice-id="${inv.id}" class="text-rose-505 hover:text-rose-700 p-1" title="Delete"><i class="bx bx-trash"></i></button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    if (searchInp) searchInp.addEventListener('input', renderTableRows);
    if (statusFilter) statusFilter.addEventListener('change', renderTableRows);
    if (dateFrom) dateFrom.addEventListener('change', renderTableRows);
    if (dateTo) dateTo.addEventListener('change', renderTableRows);

    document.querySelector('#clear-inv-filters-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInp) searchInp.value = '';
      if (statusFilter) statusFilter.value = 'all';
      if (dateFrom) dateFrom.value = '';
      if (dateTo) dateTo.value = '';
      renderTableRows();
    });

    renderTableRows();
  }

  // --- Bind Manual Invoice Create Form ---
  if (viewMode === 'create') {
    document.querySelector('#inv-form-date').value = new Date().toISOString().substring(0, 10);

    const form = document.querySelector('#inv-creation-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const custRaw = document.querySelector('#inv-form-customer').value;
        const propRaw = document.querySelector('#inv-form-property').value;
        const priceVal = document.querySelector('#inv-form-price').value;
        const date = document.querySelector('#inv-form-date').value;
        const notes = document.querySelector('#inv-form-note').value.trim();

        if (!custRaw || !propRaw || !priceVal || !date) {
          alert('Missing fields required.');
          return;
        }

        const [clientName, email] = custRaw.split('|');
        const [propertyTitle, propertyType, propertyLocation] = propRaw.split('|');
        const price = parseFloat(priceVal);

        const nextId = log.length > 0 ? Math.max(...log.map(i => i.id)) + 1 : 201;
        const invoiceRef = `INV-${String(nextId).padStart(4, '0')}`;

        log.unshift({
          id: nextId,
          invoiceRef,
          saleId: null,
          clientName,
          email,
          propertyTitle,
          propertyType,
          propertyLocation,
          date,
          price,
          paid: 0,
          balance: price,
          status: 'Unpaid',
          notes
        });

        addAuditLog(`Generated manual ad-hoc invoice ${invoiceRef} for ${clientName}`, 'Invoices');
        alert(`Invoice ${invoiceRef} successfully generated.`);
        
        state.admin.invoicesViewMode = 'list';
        initAdminTab('invoices-list');
        renderApp();
      });
    }
  }

  // --- Clicks Delegation & branded PDF statement ---
  root.addEventListener('click', (e) => {
    // Generate manual invoice click
    if (e.target.closest('#generate-manual-invoice-btn')) {
      e.preventDefault();
      state.admin.invoicesViewMode = 'create';
      initAdminTab('invoices-list');
      return;
    }

    // Cancel forms / back buttons
    if (e.target.closest('#cancel-inv-form-btn') || e.target.closest('#inv-form-cancel-btn')) {
      e.preventDefault();
      state.admin.invoicesViewMode = 'list';
      initAdminTab('invoices-list');
      return;
    }

    // Delete invoice
    const delBtn = e.target.closest('[data-delete-invoice-id]');
    if (delBtn) {
      e.preventDefault();
      const invId = parseInt(delBtn.getAttribute('data-delete-invoice-id'));
      const idx = log.findIndex(item => item.id === invId);
      if (idx !== -1 && confirm(`Delete Invoice ${log[idx].invoiceRef}?`)) {
        const refName = log[idx].invoiceRef;
        log.splice(idx, 1);
        addAuditLog(`Deleted invoice document ${refName}`, 'Invoices');
        initAdminTab('invoices-list');
        renderApp();
      }
      return;
    }

    // Resend Invoice dispatch (simulates email alert)
    const resendBtn = e.target.closest('[data-resend-invoice-id]');
    if (resendBtn) {
      e.preventDefault();
      const invId = parseInt(resendBtn.getAttribute('data-resend-invoice-id'));
      const inv = log.find(item => item.id === invId);
      if (inv) {
        alert(`RESEND EMAIL SUCCESS\n\nStatement Invoice ${inv.invoiceRef} was successfully dispatched to ${inv.email}.`);
        addAuditLog(`Resent invoice statement mail for reference ${inv.invoiceRef} to ${inv.email}`, 'Invoices');
      }
      return;
    }

    // Print Invoice branded layout PDF style
    const printBtn = e.target.closest('[data-print-invoice-id]');
    if (printBtn) {
      e.preventDefault();
      const invId = parseInt(printBtn.getAttribute('data-print-invoice-id'));
      const inv = log.find(item => item.id === invId);

      if (inv) {
        const companyName = state.admin.settings?.companyName || 'BLUESKYE CITY HOME';
        const companyAddress = state.admin.settings?.companyAddress || 'Plot 15, Lekki Phase 1, Lagos';
        const companyEmail = state.admin.settings?.companyEmail || 'advisors@blueskyecityhome.com';
        
        const escrowBank = state.admin.settings?.escrowBankName || 'Zenith Bank PLC';
        const escrowName = state.admin.settings?.escrowAccountName || 'Blueskye Escrow Shield Ltd';
        const escrowNumber = state.admin.settings?.escrowAccountNumber || '1012345678';

        const w = window.open('', '_blank');
        w.document.write(`
          <html>
          <head>
            <title>Invoice — ${inv.invoiceRef}</title>
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
                  <p><b>Invoice Reference:</b> ${inv.invoiceRef}</p>
                  <p><b>Date Issued:</b> ${inv.date}</p>
                  <p><b>Status:</b> ${inv.status}</p>
                </div>
                <div>
                  <p><b>Billed To Customer:</b></p>
                  <p style="font-weight: 700; color: #1e293b; margin: 4px 0;">${inv.clientName}</p>
                  <p>Email: ${inv.email}</p>
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
                      <p style="font-weight: 700; margin: 0 0 4px 0;">${inv.propertyTitle}</p>
                      <p style="font-size: 11px; color: #64748b; margin: 0;">Plot details associated with layout purchase.</p>
                    </td>
                    <td style="text-align: right; font-weight: bold;">${fmtNGN(inv.price)}</td>
                  </tr>
                  <tr class="total">
                    <td>Contract Total Value</td>
                    <td style="text-align: right;">${fmtNGN(inv.price)}</td>
                  </tr>
                  <tr>
                    <td>Escrow Payments Confirmed</td>
                    <td style="text-align: right; color: #10b981; font-weight: bold;">${fmtNGN(inv.paid)}</td>
                  </tr>
                  <tr class="total" style="color: ${inv.balance > 0 ? '#ef4444' : '#10b981'};">
                    <td>Balance Outstanding</td>
                    <td style="text-align: right;">${fmtNGN(inv.balance)}</td>
                  </tr>
                </tbody>
              </table>

              ${inv.notes ? `
                <div style="margin-top: 25px; font-size: 12px; background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #f1f5f9;">
                  <b>Notes &amp; Deadlines Terms:</b>
                  <p style="margin: 6px 0 0 0; color: #475569; line-height: 1.5;">${inv.notes}</p>
                </div>
              ` : ''}

              <div class="footer">
                <p>Please send all bank transfer payments to verified corporate Escrow account: <b>${escrowBank}</b>, Account Name: <b>${escrowName}</b>, Account Number: <b>${escrowNumber}</b>.</p>
                <p style="text-align: center; margin-top: 15px; font-size: 10px;">Issued officially by ${companyName} billing registries. Thank you for your custom.</p>
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
}
