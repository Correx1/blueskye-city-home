import reportsFinanceTemplates from '../html/reports-finance.html?raw';

function getSection(name) {
  const startMarker = `data-section="${name}"`;
  const startIdx = reportsFinanceTemplates.indexOf(startMarker);
  if (startIdx === -1) return '';
  const divStart = reportsFinanceTemplates.lastIndexOf('<div', startIdx);
  const endMarker = `END SECTION: ${name}`;
  const endCommentIdx = reportsFinanceTemplates.indexOf(endMarker, startIdx);
  if (endCommentIdx === -1) return '';
  const closingDiv = reportsFinanceTemplates.lastIndexOf('</div>', endCommentIdx);
  if (closingDiv === -1) return '';
  return reportsFinanceTemplates.slice(divStart, closingDiv + 6);
}

function fmtNGN(val) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
}

// 1. MASTER ROUTER
export function renderSalesSummaryReportTab(state) {
  if (!state.admin.reportsTabActive) state.admin.reportsTabActive = 'sales';
  
  let html = getSection('reports-hub-template');
  
  // Inject sub-viewport report templates
  const tab = state.admin.reportsTabActive;
  let subHtml = '';
  
  if (tab === 'sales') subHtml = getSection('subreport-sales-template');
  else if (tab === 'commissions') subHtml = getSection('subreport-commissions-template');
  else if (tab === 'customers') subHtml = getSection('subreport-customers-template');
  else if (tab === 'performance') subHtml = getSection('subreport-performance-template');
  else if (tab === 'property') subHtml = getSection('subreport-property-template');
  else if (tab === 'inspections') subHtml = getSection('subreport-inspections-template');

  return html.replace('<!-- DYNAMIC TAB SUBVIEW RENDERED HERE -->', subHtml || '');
}

// Re-map old individual imports if requested
export function renderCommissionReportTab(state) { return renderSalesSummaryReportTab(state); }
export function renderPerformanceAnalyticsTab(state) { return renderSalesSummaryReportTab(state); }

// --- Bind Hub Events Listeners ---
export function bindReportsFinanceTabListeners(state, root, addAuditLog, initAdminTab) {
  if (!state.admin.reportsTabActive) state.admin.reportsTabActive = 'sales';
  const tab = state.admin.reportsTabActive;

  // Render Subtabs style highlights
  ['sales', 'commissions', 'customers', 'performance', 'property', 'inspections'].forEach(t => {
    const el = document.querySelector(`#rep-btn-${t}`);
    if (el) {
      if (t === tab) {
        el.className = "pb-2 border-b-2 border-blue-600 text-blue-605 uppercase font-display tracking-wider";
      } else {
        el.className = "pb-2 border-b-2 border-transparent text-slate-400 hover:text-slate-650 uppercase font-display tracking-wider";
      }
    }
  });

  const sales = state.admin.ordersLedger || [];
  const list = state.admin.referralsList || [];
  const customers = state.admin.kycQueue || [];
  const properties = state.properties || [];
  const tours = state.admin.inspectionsList || [];

  // --- SUBTAB 1: SALES REVENUE HUB ---
  if (tab === 'sales') {
    const periodSel = document.querySelector('#sales-rep-period');
    const tbody = document.querySelector('#sales-rep-tbody');

    function renderSalesRows() {
      const pv = periodSel?.value || 'all';
      
      const filtered = sales.filter(s => {
        if (pv === 'month') return s.date && s.date.startsWith('2026-07');
        return true;
      });

      const actualRev = filtered.reduce((sum, s) => sum + (s.price || 0), 0);
      const pct = Math.min(100, Math.round((actualRev / 500000000) * 100));
      const gap = Math.max(0, 500000000 - actualRev);

      document.querySelector('#sales-rep-actual-vol').textContent = fmtNGN(actualRev);
      document.querySelector('#sales-rep-actual-bar').style.width = `${pct}%`;
      
      const pctEl = document.querySelector('#sales-rep-actual-pct');
      const gapEl = document.querySelector('#sales-rep-actual-gap');
      if (pctEl) pctEl.textContent = `${pct}%`;
      if (gapEl) gapEl.textContent = `${fmtNGN(gap)} Remaining Gap`;

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-xs text-slate-400 italic">No sales logs matching criteria.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(s => {
        const paid = (s.paymentHistory || []).reduce((sum, h) => sum + h.amount, 0);
        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
            <td class="p-3 font-bold text-slate-900 dark:text-white">SKY-SALE-${String(s.id).padStart(4, '0')}</td>
            <td class="p-3 text-slate-700 dark:text-slate-300 font-bold">${s.clientName}</td>
            <td class="p-3 text-slate-500 font-normal">${s.propertyTitle}</td>
            <td class="p-3 font-normal">${s.affiliate1 || 'Direct'}</td>
            <td class="p-3 font-bold">${fmtNGN(s.price)}</td>
            <td class="p-3 text-emerald-650 font-bold">${fmtNGN(paid)}</td>
          </tr>
        `;
      }).join('');
    }

    if (periodSel) periodSel.addEventListener('change', renderSalesRows);
    
    document.querySelector('#sales-rep-export-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      let csv = 'Sale ID,Customer,Property,Affiliate,Price,Paid\r\n';
      sales.forEach(s => {
        const paid = (s.paymentHistory || []).reduce((sum, h) => sum + h.amount, 0);
        csv += `"${s.id}","${s.clientName}","${s.propertyTitle}","${s.affiliate1 || 'Direct'}",${s.price},${paid}\r\n`;
      });
      downloadCsv(csv, 'Sales_Revenue_Report');
      addAuditLog('Exported Sales Revenue Report CSV', 'Reports');
    });

    renderSalesRows();
  }

  // --- SUBTAB 2: COMMISSIONS HUB ---
  if (tab === 'commissions') {
    const periodSel = document.querySelector('#comm-rep-period');
    const tbody = document.querySelector('#comm-rep-tbody');

    function renderCommsRows() {
      // Calculate system-wide commission values
      const comms = state.admin.commissionsLedger || [];
      const totalEarned = comms.reduce((sum, c) => sum + c.amount, 0);
      
      const withdrawals = state.admin.withdrawalsLog || [];
      const releasedPaid = withdrawals.filter(w => w.status === 'Paid').reduce((sum, w) => sum + w.amount, 0);
      const pendingLiability = Math.max(0, totalEarned - releasedPaid);

      document.querySelector('#comm-rep-earned').textContent = fmtNGN(totalEarned);
      document.querySelector('#comm-rep-paid').textContent = fmtNGN(releasedPaid);
      document.querySelector('#comm-rep-pending').textContent = fmtNGN(pendingLiability);

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-xs text-slate-400 italic">No affiliate details.</td></tr>`;
        return;
      }

      tbody.innerHTML = list.map(p => {
        const partnerComms = comms.filter(c => c.affiliateId === p.id);
        const gen1 = partnerComms.filter(c => c.generation.includes('Gen 1')).reduce((sum, c) => sum + c.amount, 0);
        const gen2 = partnerComms.filter(c => c.generation.includes('Gen 2')).reduce((sum, c) => sum + c.amount, 0);
        const earnedVal = gen1 + gen2;
        const paidVal = withdrawals.filter(w => w.affiliateId === p.id && w.status === 'Paid').reduce((sum, w) => sum + w.amount, 0);
        const balVal = Math.max(0, earnedVal - paidVal);

        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
            <td class="p-3 text-slate-900 dark:text-white font-bold">${p.name}</td>
            <td class="p-3 font-normal">${fmtNGN(gen1)}</td>
            <td class="p-3 font-normal">${fmtNGN(gen2)}</td>
            <td class="p-3 font-bold">${fmtNGN(earnedVal)}</td>
            <td class="p-3 text-emerald-650">${fmtNGN(paidVal)}</td>
            <td class="p-3 text-rose-500 font-bold">${fmtNGN(balVal)}</td>
          </tr>
        `;
      }).join('');
    }

    if (periodSel) periodSel.addEventListener('change', renderCommsRows);

    document.querySelector('#comm-rep-export-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      let csv = 'Affiliate,Gen 1 Direct,Gen 2 Override,Total Earned,Paid Released,Outstanding Balance\r\n';
      list.forEach(p => {
        const comms = state.admin.commissionsLedger || [];
        const partnerComms = comms.filter(c => c.affiliateId === p.id);
        const gen1 = partnerComms.filter(c => c.generation.includes('Gen 1')).reduce((sum, c) => sum + c.amount, 0);
        const gen2 = partnerComms.filter(c => c.generation.includes('Gen 2')).reduce((sum, c) => sum + c.amount, 0);
        const withdrawals = state.admin.withdrawalsLog || [];
        const paidVal = withdrawals.filter(w => w.affiliateId === p.id && w.status === 'Paid').reduce((sum, w) => sum + w.amount, 0);
        csv += `"${p.name}",${gen1},${gen2},${gen1 + gen2},${paidVal},${Math.max(0, (gen1 + gen2) - paidVal)}\r\n`;
      });
      downloadCsv(csv, 'Commissions_Payouts_Report');
      addAuditLog('Exported Commissions Report CSV', 'Reports');
    });

    renderCommsRows();
  }

  // --- SUBTAB 3: CUSTOMER TRENDS HUB ---
  if (tab === 'customers') {
    const tbody = document.querySelector('#cust-rep-tbody');

    function renderCustRows() {
      const verifiedKyc = customers.filter(c => c.status === 'Approved').length;
      const kycPct = customers.length > 0 ? Math.round((verifiedKyc / customers.length) * 100) : 0;

      const totalVal = sales.reduce((sum, s) => sum + (s.price || 0), 0);
      const paidVal = sales.reduce((sum, s) => sum + (s.paymentHistory || []).reduce((h, p) => h + p.amount, 0), 0);
      const outstandingVal = Math.max(0, totalVal - paidVal);
      const payPct = totalVal > 0 ? Math.round((paidVal / totalVal) * 100) : 0;

      document.querySelector('#cust-rep-kyc-pct').textContent = `${kycPct}%`;
      document.querySelector('#cust-rep-kyc-bar').style.width = `${kycPct}%`;
      document.querySelector('#cust-rep-pay-pct').textContent = `${payPct}%`;
      document.querySelector('#cust-rep-pay-bar').style.width = `${payPct}%`;
      document.querySelector('#cust-rep-outstanding').textContent = fmtNGN(outstandingVal);

      if (customers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-xs text-slate-400 italic">No customers profiles loaded.</td></tr>`;
        return;
      }

      tbody.innerHTML = customers.map(c => {
        const custSales = sales.filter(s => s.clientName === c.name);
        const cTotal = custSales.reduce((sum, s) => sum + s.price, 0);
        const cPaid = custSales.reduce((sum, s) => sum + (s.paymentHistory || []).reduce((h, p) => h + p.amount, 0), 0);
        const cBal = Math.max(0, cTotal - cPaid);

        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
            <td class="p-3 text-slate-900 dark:text-white font-bold">${c.name}</td>
            <td class="p-3 font-normal">${c.status}</td>
            <td class="p-3 text-center">${custSales.length} Deals</td>
            <td class="p-3">${fmtNGN(cTotal)}</td>
            <td class="p-3 text-emerald-650">${fmtNGN(cPaid)}</td>
            <td class="p-3 text-rose-500 font-bold">${fmtNGN(cBal)}</td>
          </tr>
        `;
      }).join('');
    }

    document.querySelector('#cust-rep-export-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      let csv = 'Customer,KYC Status,Deals Count,Total Value,Amount Paid,Outstanding Balance\r\n';
      customers.forEach(c => {
        const custSales = sales.filter(s => s.clientName === c.name);
        const cTotal = custSales.reduce((sum, s) => sum + s.price, 0);
        const cPaid = custSales.reduce((sum, s) => sum + (s.paymentHistory || []).reduce((h, p) => h + p.amount, 0), 0);
        csv += `"${c.name}","${c.status}",${custSales.length},${cTotal},${cPaid},${Math.max(0, cTotal - cPaid)}\r\n`;
      });
      downloadCsv(csv, 'Customers_Trends_Report');
      addAuditLog('Exported Customers Report CSV', 'Reports');
    });

    renderCustRows();
  }

  // --- SUBTAB 4: AFFILIATE PERFORMANCE ---
  if (tab === 'performance') {
    const searchLeader = document.querySelector('#leader-rep-search');
    const podiumGrid = document.querySelector('#leader-rank-podium');
    const tbody = document.querySelector('#leader-rep-tbody');

    function renderLeaderboard() {
      const q = (searchLeader?.value || '').toLowerCase().trim();

      // Compute performance rankings
      const leaderData = list.map(p => {
        const directSales = sales.filter(s => s.affiliate1 === p.name);
        const totalSalesVal = directSales.reduce((sum, s) => sum + s.price, 0);
        
        const comms = state.admin.commissionsLedger || [];
        const totalComms = comms.filter(c => c.affiliateId === p.id).reduce((sum, c) => sum + c.amount, 0);
        
        const referralsCount = list.filter(a => a.uplineId === p.id).length;
        const gen2Count = list.filter(a => {
          const sponsorObj = list.find(s => s.id === a.uplineId);
          return sponsorObj && sponsorObj.uplineId === p.id;
        }).length;

        return {
          id: p.id,
          name: p.name,
          code: p.code,
          salesVal: totalSalesVal,
          commissions: totalComms,
          referrals: referralsCount,
          gen2Size: gen2Count
        };
      });

      // Sort by salesValue descending
      leaderData.sort((a, b) => b.salesVal - a.salesVal);

      // Render top 3 podium
      const top3 = leaderData.slice(0, 3);
      if (podiumGrid) {
        podiumGrid.innerHTML = top3.map((lead, idx) => {
          const medals = ['🥇 Gold Sponsor', '🥈 Silver Sponsor', '🥉 Bronze Sponsor'];
          const borders = ['border-yellow-450 bg-yellow-500/5', 'border-slate-300 bg-slate-100/10', 'border-amber-600 bg-amber-500/5'];
          
          return `
            <div class="border rounded-xl p-4 text-center space-y-2 shadow-sm ${borders[idx] || 'border-slate-200'}">
              <span class="text-xs uppercase font-extrabold tracking-wide block">${medals[idx] || `Rank ${idx + 1}`}</span>
              <span class="block font-black text-slate-900 dark:text-white text-sm mt-1">${lead.name}</span>
              <span class="block text-[10px] text-slate-400 font-mono mt-0.5">Code: ${lead.code}</span>
              <div class="pt-2 border-t border-slate-200/20 text-xs">
                Sales: <span class="font-bold text-emerald-600">${fmtNGN(lead.salesVal)}</span>
              </div>
            </div>
          `;
        }).join('');
      }

      // Filter remaining table rows
      const filtered = leaderData.filter(lead => !q || lead.name.toLowerCase().includes(q));

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-xs text-slate-400 italic">No leaderboard matches.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map((lead, idx) => `
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
          <td class="p-3 text-center font-bold text-slate-500">${idx + 1}</td>
          <td class="p-3 text-slate-900 dark:text-white font-bold">${lead.name}</td>
          <td class="p-3 font-mono text-slate-400">${lead.code}</td>
          <td class="p-3 text-slate-900 dark:text-white font-bold">${fmtNGN(lead.salesVal)}</td>
          <td class="p-3 text-emerald-600 font-bold">${fmtNGN(lead.commissions)}</td>
          <td class="p-3 text-center font-normal">${lead.referrals}</td>
          <td class="p-3 text-center font-normal">${lead.gen2Size}</td>
        </tr>
      `).join('');
    }

    if (searchLeader) searchLeader.addEventListener('input', renderLeaderboard);

    document.querySelector('#leader-rep-export-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      let csv = 'Rank,Affiliate,Code,Sales Value,Commissions Earned,Referrals Count,Gen 2 Downline Size\r\n';
      // Recalculate same data
      const leaderData = list.map(p => {
        const directSales = sales.filter(s => s.affiliate1 === p.name);
        const totalSalesVal = directSales.reduce((sum, s) => sum + s.price, 0);
        const comms = state.admin.commissionsLedger || [];
        const totalComms = comms.filter(c => c.affiliateId === p.id).reduce((sum, c) => sum + c.amount, 0);
        const referralsCount = list.filter(a => a.uplineId === p.id).length;
        const gen2Count = list.filter(a => {
          const sponsorObj = list.find(s => s.id === a.uplineId);
          return sponsorObj && sponsorObj.uplineId === p.id;
        }).length;
        return { name: p.name, code: p.code, salesVal: totalSalesVal, commissions: totalComms, referrals: referralsCount, gen2Size: gen2Count };
      });
      leaderData.sort((a, b) => b.salesVal - a.salesVal);
      
      leaderData.forEach((lead, idx) => {
        csv += `${idx + 1},"${lead.name}","${lead.code}",${lead.salesVal},${lead.commissions},${lead.referrals},${lead.gen2Size}\r\n`;
      });

      downloadCsv(csv, 'Affiliates_Performance_Leaderboard');
      addAuditLog('Exported Affiliates Leaderboard CSV', 'Reports');
    });

    renderLeaderboard();
  }

  // --- SUBTAB 5: PROPERTY REPORT HUB ---
  if (tab === 'property') {
    const statusSel = document.querySelector('#prop-rep-status');
    const tbody = document.querySelector('#prop-rep-tbody');

    function renderPropertyReport() {
      const sv = statusSel?.value || 'all';

      // Status breakdown
      const availCount = properties.filter(p => p.status === 'Available').length;
      const resCount = properties.filter(p => p.status === 'Reserved').length;
      const soldCount = properties.filter(p => p.status === 'Sold').length;
      const totalCount = properties.length;

      document.querySelector('#prop-rep-stat-avail').textContent = availCount;
      document.querySelector('#prop-rep-stat-res').textContent = resCount;
      document.querySelector('#prop-rep-stat-sold').textContent = soldCount;

      const pAvail = totalCount > 0 ? Math.round((availCount / totalCount) * 100) : 0;
      const pRes = totalCount > 0 ? Math.round((resCount / totalCount) * 100) : 0;
      const pSold = totalCount > 0 ? 100 - pAvail - pRes : 0;

      // Color chunks bar donut simulation
      const bar = document.querySelector('#prop-rep-bar-breakdown');
      if (bar) {
        bar.innerHTML = `
          <div class="bg-emerald-500 h-full" style="width: ${pAvail}%" title="Available"></div>
          <div class="bg-blue-500 h-full" style="width: ${pRes}%" title="Reserved"></div>
          <div class="bg-rose-500 h-full" style="width: ${pSold}%" title="Sold"></div>
        `;
      }

      // Filter summary list
      const filtered = properties.filter(p => sv === 'all' || p.status === sv);

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-xs text-slate-400 italic">No properties matches.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(p => {
        const bookCount = tours.filter(t => t.propertyTitle === p.title).length;
        const convRate = p.status === 'Sold' ? '100%' : bookCount > 0 ? '0%' : '—';
        
        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
            <td class="p-3 text-slate-900 dark:text-white font-bold">${p.title}</td>
            <td class="p-3 font-normal">${p.location || 'Lekki Lagos'}</td>
            <td class="p-3">${fmtNGN(p.price)}</td>
            <td class="p-3 text-xs font-normal">${p.status}</td>
            <td class="p-3 text-center font-normal">${bookCount}</td>
            <td class="p-3 text-right text-emerald-650 font-bold">${convRate}</td>
          </tr>
        `;
      }).join('');
    }

    if (statusSel) statusSel.addEventListener('change', renderPropertyReport);

    document.querySelector('#prop-rep-export-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      let csv = 'Property Plot,Location,Price,Status,Tours Count,Conversion (%)\r\n';
      properties.forEach(p => {
        const bookCount = tours.filter(t => t.propertyTitle === p.title).length;
        const convRate = p.status === 'Sold' ? '100%' : bookCount > 0 ? '0%' : '0%';
        csv += `"${p.title}","${p.location || 'Lagos'}",${p.price},"${p.status}",${bookCount},"${convRate}"\r\n`;
      });
      downloadCsv(csv, 'Properties_Catalog_Report');
      addAuditLog('Exported Properties Report CSV', 'Reports');
    });

    renderPropertyReport();
  }

  // --- SUBTAB 6: INSPECTION TOURS REPORT ---
  if (tab === 'inspections') {
    const periodSel = document.querySelector('#ins-rep-period');
    const tbody = document.querySelector('#ins-rep-tbody');

    function renderInspectionReport() {
      // General metrics
      const totalBook = tours.length;
      const confirmedBook = tours.filter(t => t.status === 'Confirmed' || t.status === 'Completed').length;
      const completedBook = tours.filter(t => t.status === 'Completed').length;
      
      const attendedBook = tours.filter(t => t.status === 'Completed' && t.postReport?.attended === 'Attended').length;
      const leadSoldBook = tours.filter(t => t.status === 'Completed' && t.postReport?.leadStatus === 'Hot').length;

      const confirmRate = totalBook > 0 ? Math.round((confirmedBook / totalBook) * 100) : 0;
      const attendRate = confirmedBook > 0 ? Math.round((attendedBook / confirmedBook) * 100) : 0;
      const convRate = attendedBook > 0 ? Math.round((leadSoldBook / attendedBook) * 100) : 0;

      document.querySelector('#ins-rep-total').textContent = totalBook;
      document.querySelector('#ins-rep-confirm-rate').textContent = `${confirmRate}%`;
      document.querySelector('#ins-rep-attend-rate').textContent = `${attendRate}%`;
      document.querySelector('#ins-rep-conversion-rate').textContent = `${convRate}%`;

      // Managers performance summaries
      const managers = ['Obinna Okafor', 'Funmi Adebayo', 'Chidi Benson', 'Adewale Bashir'];

      tbody.innerHTML = managers.map(mgr => {
        const mgrTours = tours.filter(t => t.assignedManager === mgr);
        const totalAssigned = mgrTours.length;
        const confirmed = mgrTours.filter(t => t.status === 'Confirmed' || t.status === 'Completed').length;
        const completed = mgrTours.filter(t => t.status === 'Completed').length;
        const cancelled = mgrTours.filter(t => t.status === 'Cancelled').length;
        
        const attended = mgrTours.filter(t => t.status === 'Completed' && t.postReport?.attended === 'Attended').length;
        const rate = confirmed > 0 ? Math.round((attended / confirmed) * 100) : 0;

        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
            <td class="p-3 text-slate-900 dark:text-white font-bold">${mgr}</td>
            <td class="p-3 text-center font-normal">${totalAssigned}</td>
            <td class="p-3 text-center font-normal">${confirmed}</td>
            <td class="p-3 text-center font-normal">${completed}</td>
            <td class="p-3 text-center font-normal">${cancelled}</td>
            <td class="p-3 text-right text-blue-600 font-bold">${rate}%</td>
          </tr>
        `;
      }).join('');
    }

    if (periodSel) periodSel.addEventListener('change', renderInspectionReport);

    document.querySelector('#ins-rep-export-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      let csv = 'Site Manager,Assigned Tours,Confirmed,Completed,Cancelled,Attendance Rate (%)\r\n';
      const managers = ['Obinna Okafor', 'Funmi Adebayo', 'Chidi Benson', 'Adewale Bashir'];
      managers.forEach(mgr => {
        const mgrTours = tours.filter(t => t.assignedManager === mgr);
        const totalAssigned = mgrTours.length;
        const confirmed = mgrTours.filter(t => t.status === 'Confirmed' || t.status === 'Completed').length;
        const completed = mgrTours.filter(t => t.status === 'Completed').length;
        const cancelled = mgrTours.filter(t => t.status === 'Cancelled').length;
        const attended = mgrTours.filter(t => t.status === 'Completed' && t.postReport?.attended === 'Attended').length;
        const rate = confirmed > 0 ? Math.round((attended / confirmed) * 105) : 0;
        csv += `"${mgr}",${totalAssigned},${confirmed},${completed},${cancelled},"${rate}%"\r\n`;
      });
      downloadCsv(csv, 'Inspections_Tours_Report');
      addAuditLog('Exported Site Tours Report CSV', 'Reports');
    });

    renderInspectionReport();
  }

  // --- Scopes Sub-tabs click listener ---
  root.addEventListener('click', (e) => {
    const reportTab = e.target.closest('[data-report-tab]');
    if (reportTab) {
      e.preventDefault();
      state.admin.reportsTabActive = reportTab.getAttribute('data-report-tab');
      initAdminTab('reports-sales'); // Re-loads same subview router context!
      return;
    }
    
    // Support visual click nodes inside leaderboard linking back to directory
    const leaderLink = e.target.closest('[data-view-part-id]');
    if (leaderLink && tab === 'performance') {
      e.preventDefault();
      state.admin.selectedPartnerId = parseInt(leaderLink.getAttribute('data-view-part-id'));
      state.admin.partnerViewMode = 'detail';
      state.admin.partnerDetailSubtab = 'profile';
      initAdminTab('partners-directory');
      return;
    }
  });
}

// Global CSV Downloader dispatcher helper
function downloadCsv(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().substring(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Payment Escrow Ledger
export function renderPaymentLedgerTab(state) {
  const orders = state.admin.ordersLedger || [];
  let html = getSection('payment-ledger-template');

  const rows = orders.map(o => {
    const paid = (o.paymentHistory || []).reduce((sum, p) => sum + p.amount, 0);
    const badgeClass = o.status === 'Paid Off' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600';
    return `
      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
        <td class="p-3">
          <span class="block font-bold text-slate-900 dark:text-white">${o.clientName}</span>
          <span class="block text-[10px] text-slate-400 font-mono mt-0.5">${o.email}</span>
        </td>
        <td class="p-3 text-slate-700 dark:text-slate-350 text-xs">${o.propertyTitle}</td>
        <td class="p-3 font-mono">${fmtNGN(o.price)}</td>
        <td class="p-3 text-xs">${o.plan}</td>
        <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeClass}">${o.status}</span></td>
        <td class="p-3 text-right">
          <span class="text-[10px] text-slate-400 italic font-normal">Escrow Ledger Active</span>
        </td>
      </tr>
    `;
  }).join('');

  return html.replace('<!-- DYNAMIC LEDGER ROWS -->', rows);
}

