import commissionsTemplates from '../html/commissions.html?raw';

function getSection(name) {
  const startMarker = `data-section="${name}"`;
  const startIdx = commissionsTemplates.indexOf(startMarker);
  if (startIdx === -1) return '';
  const divStart = commissionsTemplates.lastIndexOf('<div', startIdx);
  const endMarker = `END SECTION: ${name}`;
  const endCommentIdx = commissionsTemplates.indexOf(endMarker, startIdx);
  if (endCommentIdx === -1) return '';
  const closingDiv = commissionsTemplates.lastIndexOf('</div>', endCommentIdx);
  if (closingDiv === -1) return '';
  return commissionsTemplates.slice(divStart, closingDiv + 6);
}

function fmtNGN(val) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
}

function ensureCommissions(state) {
  if (!state.admin.commissionsLedger) state.admin.commissionsLedger = [];
  const comms = state.admin.commissionsLedger;
  const list = state.admin.referralsList || [];
  const sales = state.admin.ordersLedger || [];

  // Generate commissions dynamic logs chronologically if list is empty
  if (comms.length === 0 && sales.length > 0) {
    sales.forEach(s => {
      if (s.affiliate1 && s.affiliate1 !== 'Direct') {
        const aff1 = list.find(a => a.name === s.affiliate1);
        if (aff1) {
          // Gen 1: 10% direct commission
          const amt1 = Math.round(s.price * 0.1);
          comms.push({
            id: comms.length + 501,
            affiliateId: aff1.id,
            affiliateName: aff1.name,
            saleId: s.id,
            saleRef: `SKY-SALE-${String(s.id).padStart(4, '0')}`,
            generation: 'Generation 1 (Direct)',
            rate: 10,
            amount: amt1,
            status: 'Pending',
            date: s.date || '2026-07-01'
          });

          // Gen 2: 5% override commission if upline exists
          if (aff1.uplineId) {
            const aff2 = list.find(a => a.id === aff1.uplineId);
            if (aff2) {
              const amt2 = Math.round(s.price * 0.05);
              comms.push({
                id: comms.length + 501,
                affiliateId: aff2.id,
                affiliateName: aff2.name,
                saleId: s.id,
                saleRef: `SKY-SALE-${String(s.id).padStart(4, '0')}`,
                generation: 'Generation 2 (Override)',
                rate: 5,
                amount: amt2,
                status: 'Pending',
                date: s.date || '2026-07-01'
              });
            }
          }
        }
      }
    });

    // Back-sync to partner's accumulated totals
    list.forEach(p => {
      const partnerComms = comms.filter(c => c.affiliateId === p.id);
      p.earned = partnerComms.reduce((sum, c) => sum + c.amount, 0);
      
      // Calculate unpaid balance (earned minus cleared/released payouts)
      const approvedWithdrawals = (state.admin.withdrawalsLog || [])
        .filter(w => w.affiliateId === p.id && (w.status === 'Paid' || w.status === 'Approved'));
      const releasedAmt = approvedWithdrawals.reduce((sum, w) => sum + w.amount, 0);
      
      p.balance = Math.max(0, p.earned - releasedAmt);
    });
  }
}

// 1. MASTER ROUTER
export function renderCommissionLedgerTab(state) {
  ensureCommissions(state);
  return getSection('commissions-ledger-template');
}

// --- Bind Commissions Event Listeners ---
export function bindCommissionsTabListeners(state, root, addAuditLog, initAdminTab, renderApp) {
  ensureCommissions(state);
  const comms = state.admin.commissionsLedger || [];
  const list = state.admin.referralsList || [];

  // Populate drilldown dropdown
  const drilldownSelect = document.querySelector('#comm-drilldown-select');
  if (drilldownSelect && !drilldownSelect.dataset.initialized) {
    drilldownSelect.innerHTML = `
      <option value="all">-- View All System-Wide Commissions --</option>
      ${list.map(p => `<option value="${p.id}">${p.name} (${p.code})</option>`).join('')}
    `;
    drilldownSelect.dataset.initialized = 'true';
  }

  const searchInp = document.querySelector('#comm-search-input');
  const genFilter = document.querySelector('#filter-comm-gen');
  const statusFilter = document.querySelector('#filter-comm-status');
  const dateFrom = document.querySelector('#filter-comm-date-from');
  const dateTo = document.querySelector('#filter-comm-date-to');

  function renderTableRows() {
    const q = (searchInp?.value || '').toLowerCase().trim();
    const gv = genFilter?.value || 'all';
    const sv = statusFilter?.value || 'all';
    const df = dateFrom?.value || '';
    const dt = dateTo?.value || '';
    const drilldownId = drilldownSelect?.value || 'all';

    const tbody = document.querySelector('#commissions-table-body');
    if (!tbody) return;

    const filtered = comms.filter(c => {
      const matchesDrilldown = drilldownId === 'all' || c.affiliateId === parseInt(drilldownId);
      const matchesQuery = !q || [c.affiliateName, c.saleRef].join(' ').toLowerCase().includes(q);
      const matchesGen = gv === 'all' || c.generation === gv;
      const matchesStatus = sv === 'all' || c.status === sv;
      const matchesDate = (!df || c.date >= df) && (!dt || c.date <= dt);
      return matchesDrilldown && matchesQuery && matchesGen && matchesStatus && matchesDate;
    });

    // Update running total metric label
    const scopedTotalVal = filtered.reduce((sum, c) => sum + c.amount, 0);
    document.querySelector('#comm-scoped-total').textContent = fmtNGN(scopedTotalVal);

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-xs text-slate-400 italic">No commission log credit entries matched.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(c => {
      const badgeClass = c.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      return `
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-sm font-semibold">
          <td class="p-3 font-mono text-slate-500">${c.date}</td>
          <td class="p-3 text-slate-900 dark:text-white font-bold cursor-pointer hover:underline" data-view-part-id="${c.affiliateId}">${c.affiliateName}</td>
          <td class="p-3 text-slate-650 dark:text-slate-350 text-xs">${c.generation}</td>
          <td class="p-3 font-mono text-slate-450 text-xs">${c.saleRef}</td>
          <td class="p-3 font-mono text-slate-500">${c.rate}%</td>
          <td class="p-3 text-right text-emerald-605 font-bold">${fmtNGN(c.amount)}</td>
          <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeClass}">${c.status}</span></td>
        </tr>
      `;
    }).join('');
  }

  // Bind change triggers
  if (drilldownSelect) drilldownSelect.addEventListener('change', renderTableRows);
  if (searchInp) searchInp.addEventListener('input', renderTableRows);
  if (genFilter) genFilter.addEventListener('change', renderTableRows);
  if (statusFilter) statusFilter.addEventListener('change', renderTableRows);
  if (dateFrom) dateFrom.addEventListener('change', renderTableRows);
  if (dateTo) dateTo.addEventListener('change', renderTableRows);

  // Export CSV functional builder
  document.querySelector('#comm-export-csv-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const drilldownId = drilldownSelect?.value || 'all';
    
    // Filter active dataset
    const activeData = comms.filter(c => {
      if (drilldownId !== 'all' && c.affiliateId !== parseInt(drilldownId)) return false;
      return true;
    });

    if (activeData.length === 0) {
      alert('No ledger records to export.');
      return;
    }

    // Build CSV file content string
    let csvContent = 'Date,Affiliate,Generation,Sale Reference,Rate (%),Amount (NGN),Status\r\n';
    
    activeData.forEach(c => {
      csvContent += `"${c.date}","${c.affiliateName}","${c.generation}","${c.saleRef}",${c.rate},${c.amount},"${c.status}"\r\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    
    const scopeName = drilldownId === 'all' ? 'System-Wide' : list.find(p => p.id === parseInt(drilldownId))?.name || 'Affiliate';
    link.setAttribute('download', `Commissions_Statement_${scopeName.replace(/\s+/g, '_')}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog(`Exported commissions statement ledger for ${scopeName}`, 'Affiliates');
  });

  // Load table records
  renderTableRows();
}
