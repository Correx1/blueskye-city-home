import withdrawalsTemplates from '../html/withdrawals.html?raw';

function getSection(name) {
  const startMarker = `data-section="${name}"`;
  const startIdx = withdrawalsTemplates.indexOf(startMarker);
  if (startIdx === -1) return '';
  const divStart = withdrawalsTemplates.lastIndexOf('<div', startIdx);
  const endMarker = `END SECTION: ${name}`;
  const endCommentIdx = withdrawalsTemplates.indexOf(endMarker, startIdx);
  if (endCommentIdx === -1) return '';
  const closingDiv = withdrawalsTemplates.lastIndexOf('</div>', endCommentIdx);
  if (closingDiv === -1) return '';
  return withdrawalsTemplates.slice(divStart, closingDiv + 6);
}

function fmtNGN(val) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
}

function ensureWithdrawals(state) {
  if (!state.admin.withdrawalsLog) {
    state.admin.withdrawalsLog = [
      {
        id: 1001,
        affiliateId: 1,
        affiliateName: 'Florence Nduka',
        bankName: 'Zenith Bank PLC',
        accountNum: '1012345678',
        accountName: 'Florence Nduka',
        bankDetailsMasked: '•••• 5678',
        amount: 350000,
        status: 'Pending',
        dateRequested: '2026-07-12',
        receiptUrl: ''
      },
      {
        id: 1002,
        affiliateId: 2,
        affiliateName: 'Kelechi Nnamdi',
        bankName: 'Access Bank',
        accountNum: '0019876543',
        accountName: 'Kelechi Nnamdi Solutions',
        bankDetailsMasked: '•••• 6543',
        amount: 750000,
        status: 'Paid',
        dateRequested: '2026-07-08',
        receiptUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=200'
      }
    ];
  }
}

// 1. MASTER ROUTER
export function renderWithdrawalRequestsTab(state) {
  ensureWithdrawals(state);
  return getSection('withdrawals-list-template');
}

// --- Bind Withdrawals Event Listeners ---
export function bindWithdrawalsTabListeners(state, root, addAuditLog, initAdminTab, renderApp) {
  ensureWithdrawals(state);
  const log = state.admin.withdrawalsLog || [];
  const list = state.admin.referralsList || [];

  const searchInp = document.querySelector('#with-search-input');
  const statusFilter = document.querySelector('#filter-with-status');
  const dateFrom = document.querySelector('#filter-with-date-from');
  const dateTo = document.querySelector('#filter-with-date-to');

  // Initialize status filter to Pending by default to draw immediate attention
  if (statusFilter && !statusFilter.dataset.initialized) {
    statusFilter.value = 'Pending';
    statusFilter.dataset.initialized = 'true';
  }

  function renderTableRows() {
    const q = (searchInp?.value || '').toLowerCase().trim();
    const sv = statusFilter?.value || 'all';
    const df = dateFrom?.value || '';
    const dt = dateTo?.value || '';

    const tbody = document.querySelector('#withdrawals-table-body');
    if (!tbody) return;

    const filtered = log.filter(w => {
      const matchesQuery = !q || w.affiliateName.toLowerCase().includes(q);
      const matchesStatus = sv === 'all' || w.status === sv;
      const matchesDate = (!df || w.dateRequested >= df) && (!dt || w.dateRequested <= dt);
      return matchesQuery && matchesStatus && matchesDate;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-xs text-slate-400 italic">No payout requests matched filters.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(w => {
      let badgeClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      if (w.status === 'Paid') badgeClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450';
      else if (w.status === 'Approved') badgeClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-450';

      let actionsHtml = '';
      if (w.status === 'Pending') {
        actionsHtml = `<button data-process-with-id="${w.id}" class="bg-indigo-650 hover:bg-indigo-750 text-white font-bold py-1 px-2.5 rounded text-xs active:scale-98">Process</button>`;
      } else if (w.status === 'Approved') {
        actionsHtml = `<button data-process-with-id="${w.id}" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2.5 rounded text-xs active:scale-98">Upload Receipt</button>`;
      } else {
        actionsHtml = `<span class="text-xs text-slate-450 italic font-normal">Reconciled</span>`;
      }

      return `
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-sm font-semibold">
          <td class="p-3 font-mono text-slate-400">${w.dateRequested}</td>
          <td class="p-3">
            <span class="block text-slate-900 dark:text-white font-bold">${w.affiliateName}</span>
          </td>
          <td class="p-3 text-emerald-600 font-bold">${fmtNGN(w.amount)}</td>
          <td class="p-3 font-mono text-slate-500">${w.bankName} (${w.bankDetailsMasked})</td>
          <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeClass}">${w.status}</span></td>
          <td class="p-3 text-right">${actionsHtml}</td>
        </tr>
      `;
    }).join('');
  }

  // Bind change triggers
  if (searchInp) searchInp.addEventListener('input', renderTableRows);
  if (statusFilter) statusFilter.addEventListener('change', renderTableRows);
  if (dateFrom) dateFrom.addEventListener('change', renderTableRows);
  if (dateTo) dateTo.addEventListener('change', renderTableRows);

  document.querySelector('#clear-with-filters-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (searchInp) searchInp.value = '';
    if (statusFilter) statusFilter.value = 'all';
    if (dateFrom) dateFrom.value = '';
    if (dateTo) dateTo.value = '';
    renderTableRows();
  });

  // Modal actions triggers
  const modal = document.querySelector('#payout-process-modal');
  const fileInput = document.querySelector('#payout-receipt-file-input');
  const fileLabel = document.querySelector('#payout-receipt-file-label');
  const step1 = document.querySelector('#payout-step-1');
  const step2 = document.querySelector('#payout-step-2');

  let activeWithdrawal = null;
  let attachedReceiptBase64 = '';

  root.addEventListener('click', (e) => {
    // Process button click
    const processBtn = e.target.closest('[data-process-with-id]');
    if (processBtn && modal) {
      e.preventDefault();
      const id = parseInt(processBtn.getAttribute('data-process-with-id'));
      activeWithdrawal = log.find(item => item.id === id);

      if (activeWithdrawal) {
        document.querySelector('#modal-with-name').textContent = activeWithdrawal.affiliateName;
        document.querySelector('#modal-with-amount').textContent = fmtNGN(activeWithdrawal.amount);
        document.querySelector('#modal-with-bank').textContent = `${activeWithdrawal.bankName} — Account: ${activeWithdrawal.accountNum} — Beneficiary: ${activeWithdrawal.accountName}`;
        
        attachedReceiptBase64 = activeWithdrawal.receiptUrl || '';
        if (fileLabel) {
          fileLabel.textContent = activeWithdrawal.receiptUrl ? 'File document attached' : 'No document attached';
        }

        // Adjust visible steps based on status
        if (activeWithdrawal.status === 'Pending') {
          step1.classList.remove('hidden');
          step2.classList.add('hidden');
        } else if (activeWithdrawal.status === 'Approved') {
          step1.classList.add('hidden');
          step2.classList.remove('hidden');
        }

        modal.classList.remove('hidden');
      }
      return;
    }

    // Modal Close
    if (e.target.closest('#close-payout-modal-btn')) {
      e.preventDefault();
      modal?.classList.add('hidden');
      activeWithdrawal = null;
      return;
    }
  });

  // Approve button action
  document.querySelector('#btn-approve-withdrawal')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (activeWithdrawal) {
      activeWithdrawal.status = 'Approved';
      addAuditLog(`Approved payout release request for ${activeWithdrawal.affiliateName} value ${fmtNGN(activeWithdrawal.amount)}`, 'Affiliates');
      
      // Advance steps
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
      renderTableRows();
    }
  });

  // Reject button action
  document.querySelector('#btn-reject-withdrawal')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (activeWithdrawal && confirm(`Are you sure you want to reject this withdrawal request?`)) {
      activeWithdrawal.status = 'Rejected';
      addAuditLog(`Rejected cashout request for ${activeWithdrawal.affiliateName} value ${fmtNGN(activeWithdrawal.amount)}`, 'Affiliates');
      alert('Payout request marked as Rejected.');
      
      modal?.classList.add('hidden');
      activeWithdrawal = null;
      renderTableRows();
      renderApp();
    }
  });

  // File attach listeners
  const btnTrigger = document.querySelector('#btn-trigger-receipt-file');
  if (btnTrigger && fileInput) {
    btnTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      fileInput.click();
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        attachedReceiptBase64 = event.target.result;
        if (fileLabel) fileLabel.textContent = file.name;
      };
      reader.readAsDataURL(file);
    });
  }

  // Confirm Mark as Paid release button
  document.querySelector('#btn-confirm-mark-paid')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!attachedReceiptBase64) {
      alert('Please upload a bank transaction transfer receipt file to confirm payment clearance.');
      return;
    }

    if (activeWithdrawal) {
      activeWithdrawal.status = 'Paid';
      activeWithdrawal.receiptUrl = attachedReceiptBase64;
      
      // Deduct from partner ledger balance
      const partner = list.find(p => p.id === activeWithdrawal.affiliateId);
      if (partner) {
        partner.balance = Math.max(0, partner.balance - activeWithdrawal.amount);
      }

      addAuditLog(`Marked payout request for ${activeWithdrawal.affiliateName} as Paid. Receipt attached.`, 'Affiliates');
      alert('Withdrawal marked as Paid and client balance ledger updated.');

      modal?.classList.add('hidden');
      activeWithdrawal = null;
      
      renderTableRows();
      renderApp();
    }
  });

  // Load table rows
  renderTableRows();
}
