import partnerTemplates from '../html/partner.html?raw';

function getSection(name) {
  const startMarker = `data-section="${name}"`;
  const startIdx = partnerTemplates.indexOf(startMarker);
  if (startIdx === -1) return '';
  const divStart = partnerTemplates.lastIndexOf('<div', startIdx);
  const endMarker = `END SECTION: ${name}`;
  const endCommentIdx = partnerTemplates.indexOf(endMarker, startIdx);
  if (endCommentIdx === -1) return '';
  const closingDiv = partnerTemplates.lastIndexOf('</div>', endCommentIdx);
  if (closingDiv === -1) return '';
  return partnerTemplates.slice(divStart, closingDiv + 6);
}

function fmtNGN(val) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
}

function getInitials(name) {
  if (!name) return 'AP';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

function kycStatusClass(status) {
  switch (status) {
    case 'Approved': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450';
    case 'Pending Review': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    case 'Rejected': return 'bg-rose-500/10 text-rose-600 dark:text-rose-455';
    default: return 'bg-slate-100 text-slate-500';
  }
}

function bankStatusClass(status) {
  switch (status) {
    case 'Approved': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450';
    case 'Pending': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    case 'Rejected': return 'bg-rose-500/10 text-rose-600 dark:text-rose-455';
    default: return 'bg-slate-100 text-slate-550';
  }
}

// 1. MASTER ROUTER
export function renderPartnerDirectoryTab(state) {
  if (!state.admin.referralsList) state.admin.referralsList = [];
  if (!state.admin.partnerViewMode) state.admin.partnerViewMode = 'list';

  const mode = state.admin.partnerViewMode;
  const list = state.admin.referralsList;
  const selectedId = state.admin.selectedPartnerId;
  const partner = selectedId != null ? list.find(p => p.id === parseInt(selectedId)) : null;

  if (mode === 'create') return renderFormView(state);
  if (mode === 'detail' && partner) return renderDetailView(state, partner);
  return renderListView(state);
}

// 1.1 LIST DIRECTORY VIEW
function generateListRowsHtml(items, allPartners) {
  if (items.length === 0) {
    return `<tr><td colspan="9" class="p-4 text-center text-xs text-slate-400 italic">No affiliate records matched filters criteria.</td></tr>`;
  }

  return items.map(p => {
    const upline = p.uplineId ? allPartners.find(x => x.id === p.uplineId) : null;
    const uplineName = upline ? upline.name : '— (Direct)';
    const kycBadge = kycStatusClass(p.status);
    const activeDot = p.isActive ? 'bg-emerald-500' : 'bg-slate-350';
    const tier = p.uplineId ? 'Gen 2 (Sub)' : 'Gen 1 (Root)';

    return `
    <tr class="hover:bg-slate-50/40 dark:hover:bg-slate-955/20 transition-colors font-semibold">
      <td class="p-3">
        <span class="block text-slate-900 dark:text-white font-bold cursor-pointer hover:underline" data-view-part-id="${p.id}">${p.name}</span>
        <span class="block text-[10px] text-slate-400 font-mono mt-0.5">${p.email}</span>
      </td>
      <td class="p-3"><code class="bg-slate-100 dark:bg-slate-955 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono text-xs font-bold">${p.code}</code></td>
      <td class="p-3 text-xs text-slate-500 font-normal">${tier}</td>
      <td class="p-3 text-xs text-slate-500 dark:text-slate-350 font-normal">${uplineName}</td>
      <td class="p-3 text-xs text-slate-900 dark:text-white font-bold">₦${(p.salesVolume || 0).toLocaleString()}</td>
      <td class="p-3 text-xs text-emerald-600 font-bold">${fmtNGN(p.balance)}</td>
      <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${kycBadge}">${p.status}</span></td>
      <td class="p-3 text-center">
        <span class="inline-flex w-2.5 h-2.5 rounded-full ${activeDot}" title="${p.isActive ? 'Active' : 'Inactive'}"></span>
      </td>
      <td class="p-3 text-right">
        <div class="flex items-center justify-end gap-2 text-base">
          <button data-view-part-id="${p.id}" class="text-blue-500 hover:text-blue-750 p-1" title="View Detail"><i class="bx bx-show"></i></button>
          <button data-delete-part-id="${p.id}" class="text-rose-505 hover:text-rose-700 p-1" title="Delete"><i class="bx bx-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function renderListView(state) {
  const list = state.admin.referralsList || [];
  
  // Stats
  const activeCount = list.filter(p => p.isActive).length;
  const pendingCount = list.filter(p => p.status === 'Pending Review').length;
  const unpaidLiability = list.reduce((a, p) => a + (p.balance || 0), 0);

  let html = getSection('partner-directory-template');
  
  html = html
    .replace('id="part-metric-total">0', `id="part-metric-total">${list.length}`)
    .replace('id="part-metric-active">0', `id="part-metric-active">${activeCount}`)
    .replace('id="part-metric-pending">0', `id="part-metric-pending">${pendingCount}`)
    .replace('id="part-metric-payouts">₦0', `id="part-metric-payouts">${fmtNGN(unpaidLiability)}`);

  return html;
}

// 1.2 REGISTRATION FORM VIEW
function renderFormView(state) {
  const list = state.admin.referralsList || [];
  const uplineOptions = list.map(p => `<option value="${p.id}">${p.name} (${p.code})</option>`).join('');

  let html = getSection('partner-form-template');
  return html.replace('<!-- DYNAMIC REFERRALS -->', uplineOptions);
}

// 1.3 PROFILE TABBED DETAIL VIEW
function renderDetailView(state, partner) {
  let html = getSection('partner-detail-template');
  
  html = html
    .replace('id="detail-part-initials">AP', `id="detail-part-initials">${getInitials(partner.name)}`)
    .replace('id="detail-part-title-name">AFFILIATE NAME', `id="detail-part-title-name">${partner.name}`)
    .replace('id="detail-part-code">SKY-CODE', `id="detail-part-code">${partner.code}`)
    .replace('id="detail-part-date-joined">2026-07-01', `id="detail-part-date-joined">${partner.dateJoined || '2026-07-01'}`)
    .replace('id="p-detail-name">Kelechi Nnamdi', `id="p-detail-name">${partner.name}`)
    .replace('id="p-detail-email">kelechi@domain.com', `id="p-detail-email">${partner.email}`)
    .replace('id="p-detail-phone">+234...', `id="p-detail-phone">${partner.phone}`)
    .replace('id="p-detail-active-dot">', `id="p-detail-active-dot" class="w-2.5 h-2.5 rounded-full ${partner.isActive ? 'bg-emerald-500' : 'bg-slate-350'}">`)
    .replace('id="p-detail-active-text">Active', `id="p-detail-active-text">${partner.isActive ? 'Active Network Connection' : 'Suspended'}`)
    .replace('id="toggle-part-active-btn" class="px-3 py-1.5 rounded text-xs font-bold active:scale-98 text-white transition-all">', `id="toggle-part-active-btn" class="px-3 py-1.5 rounded text-xs font-bold active:scale-98 text-white transition-all ${partner.isActive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}">${partner.isActive ? 'Suspend' : 'Activate'}`)
    .replace('id="p-detail-bank-status">Pending Verification', `id="p-detail-bank-status" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${bankStatusClass(partner.bankDetails?.status || 'Pending')}">${partner.bankDetails?.status || 'Pending'}`)
    .replace('id="p-detail-bank-name">Zenith Bank PLC', `id="p-detail-bank-name">${partner.bankDetails?.bankName || 'Not Linked'}`)
    .replace('id="p-detail-bank-num" class="font-mono">1012345678', `id="p-detail-bank-num" class="font-mono">${partner.bankDetails?.accountNum || '—'}`)
    .replace('id="p-detail-bank-account-name">Kelechi Nnamdi Corporate', `id="p-detail-bank-account-name">${partner.bankDetails?.accountName || '—'}`)
    .replace('id="p-detail-kyc-status">KYC: Pending', `id="p-detail-kyc-status" class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${kycStatusClass(partner.status)}">KYC: ${partner.status}`);

  // Images docs
  let passportHtml = partner.kycDocs?.passportUrl
    ? `<img src="${partner.kycDocs.passportUrl}" class="max-w-full max-h-[140px] object-contain rounded" />`
    : `<span class="text-[10px] text-slate-400 italic">No passport photo uploaded</span>`;
    
  let utilityHtml = partner.kycDocs?.utilityUrl
    ? `<img src="${partner.kycDocs.utilityUrl}" class="max-w-full max-h-[140px] object-contain rounded" />`
    : `<span class="text-[10px] text-slate-400 italic">No utility bill uploaded</span>`;

  html = html
    .replace('<!-- PHOTO ID -->', passportHtml)
    .replace('<!-- UTILITY BILL -->', utilityHtml);

  // Subtab view injection
  const sub = state.admin.partnerDetailSubtab || 'profile';
  let subHtml = '';
  if (sub === 'tree') {
    subHtml = renderTreeSubtab(state, partner);
  } else if (sub === 'finance') {
    subHtml = renderFinanceSubtab(state, partner);
  }

  if (subHtml) {
    html = html.replace('<!-- Profile & KYC Tab (Default View) -->', subHtml);
  }

  return html;
}

// 1.3.1 NETWORKS TREE SUBTAB
function renderTreeSubtab(state, partner) {
  let html = getSection('visual-tree-subtab');
  const list = state.admin.referralsList || [];
  const sponsor = partner.uplineId ? list.find(s => s.id === partner.uplineId) : null;
  const sponsorText = sponsor ? `${sponsor.name} (${sponsor.code})` : 'Direct Affiliate (Root)';

  html = html.replace('id="tree-upline-sponsor-text">Sponsor: Direct', `id="tree-upline-sponsor-text">Sponsor Recruiter: ${sponsorText}`);

  // Tree nodes calculation
  const gen1 = list.filter(p => p.uplineId === partner.id);
  
  let treeNodesHtml = `
    <!-- Root Center Node -->
    <div class="flex flex-col items-center">
      <div class="bg-[#1e3a8a] text-white px-4 py-2.5 rounded-lg shadow-md border border-white/10 text-center">
        <span class="block font-black uppercase text-xs">${partner.name}</span>
        <span class="block text-[9px] text-white/70 font-mono mt-0.5">ROOT | Code: ${partner.code}</span>
      </div>
      
      ${gen1.length > 0 ? `
        <!-- Arrow divider to Gen 1 -->
        <div class="h-6 w-px bg-slate-350 dark:bg-slate-700 my-1"></div>
        
        <!-- Gen 1 direct child nodes list -->
        <div class="flex flex-wrap justify-center gap-6 pt-2 border-t border-dashed border-slate-300 dark:border-slate-800">
          ${gen1.map(g1 => {
            const gen2 = list.filter(p => p.uplineId === g1.id);
            return `
              <div class="flex flex-col items-center">
                <!-- Gen 1 Node -->
                <div class="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded shadow-xs text-center cursor-pointer hover:border-blue-500 transition-colors" data-view-part-id="${g1.id}">
                  <span class="block font-bold text-slate-800 dark:text-white text-[11px]">${g1.name}</span>
                  <span class="block text-[9px] text-slate-400 font-mono">Gen 1 | Code: ${g1.code}</span>
                </div>
                
                ${gen2.length > 0 ? `
                  <div class="h-4 w-px bg-slate-350 dark:bg-slate-700 my-0.5"></div>
                  <!-- Gen 2 Node wrapper -->
                  <div class="flex gap-3 pt-1 border-t border-dashed border-slate-200 dark:border-slate-850">
                    ${gen2.map(g2 => `
                      <div class="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-900 p-2 rounded shadow-xs text-center cursor-pointer hover:border-blue-500 transition-colors" data-view-part-id="${g2.id}">
                        <span class="block text-slate-700 dark:text-slate-300 font-medium text-[10px]">${g2.name}</span>
                        <span class="block text-[8px] text-slate-400 font-mono">Gen 2 | ${g2.code}</span>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      ` : `<div class="text-center text-slate-450 italic text-[11px] py-4">No downline recruits (Generation 1 / Generation 2) registered under this sponsor.</div>`}
    </div>
  `;

  return html.replace('<!-- TREE CONTAINER DYNAMIC GENERATION -->', treeNodesHtml);
}

// 1.3.2 FINANCE SUBTAB
function renderFinanceSubtab(state, partner) {
  let html = getSection('finance-subtab');

  const earned = partner.earned || 0;
  const balance = partner.balance || 0;
  
  // Attributed sales
  const sales = state.admin.ordersLedger || [];
  
  // Filter sales where this affiliate is Gen 1 (affiliate1 === partner.name) 
  // or Gen 2 upliner (which is when affiliate1's upline is partner.id)
  const list = state.admin.referralsList || [];
  
  const attributedSales = sales.filter(s => {
    if (s.affiliate1 === partner.name) return true;
    const directAff = list.find(a => a.name === s.affiliate1);
    if (directAff && directAff.uplineId === partner.id) return true;
    return false;
  });

  const salesCount = attributedSales.length;

  html = html
    .replace('id="finance-earned">₦0', `id="finance-earned">${fmtNGN(earned)}`)
    .replace('id="finance-balance">₦0', `id="finance-balance">${fmtNGN(balance)}`)
    .replace('id="finance-sales-count">0 Deals', `id="finance-sales-count">${salesCount} Deals`);

  // Attributed sales rows
  let salesRowsHtml = attributedSales.map(s => {
    const isDirect = s.affiliate1 === partner.name;
    const rate = isDirect ? 0.1 : 0.05;
    const comm = Math.round(s.price * rate);

    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-xs font-semibold">
        <td class="p-2.5 font-mono text-slate-500">SKY-SALE-${String(s.id).padStart(4, '0')}</td>
        <td class="p-2.5 text-slate-400 font-normal font-mono">${s.date}</td>
        <td class="p-2.5 text-slate-800 dark:text-white font-bold">${s.clientName}</td>
        <td class="p-2.5 text-slate-500 font-normal">${s.propertyTitle}</td>
        <td class="p-2.5">${fmtNGN(s.price)}</td>
        <td class="p-2.5 text-right text-emerald-600 font-bold">${fmtNGN(comm)}</td>
      </tr>
    `;
  }).join('');

  if (!salesRowsHtml) salesRowsHtml = `<tr><td colspan="6" class="p-4 text-center text-slate-400 italic">No sales deals attributed to this partner network sponsor.</td></tr>`;
  html = html.replace('<!-- DYNAMIC ATTRIBUTED SALES -->', salesRowsHtml);

  // Commission History Credits (system ledger scoped to partner)
  const commissions = state.admin.commissionsLedger || [];
  const partnerComms = commissions.filter(c => c.affiliateId === partner.id);
  
  let commsRowsHtml = partnerComms.map(c => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-xs font-semibold">
      <td class="p-2.5 font-mono text-slate-400">${c.date}</td>
      <td class="p-2.5 font-mono text-slate-700 dark:text-slate-300 font-bold">${c.saleRef}</td>
      <td class="p-2.5 text-slate-500 font-normal">${c.generation}</td>
      <td class="p-2.5 font-mono text-slate-450 font-normal">${c.rate}%</td>
      <td class="p-2.5 text-right text-emerald-600 font-bold">${fmtNGN(c.amount)}</td>
    </tr>
  `).join('');

  if (!commsRowsHtml) commsRowsHtml = `<tr><td colspan="5" class="p-4 text-center text-slate-400 italic">No commission credits journal lines found.</td></tr>`;
  html = html.replace('<!-- DYNAMIC COMMISSIONS CREDITS -->', commsRowsHtml);

  // Withdrawals Requests
  const withdrawals = state.admin.withdrawalsLog || [];
  const partnerWithdrawals = withdrawals.filter(w => w.affiliateId === partner.id);

  let withdrawalsRowsHtml = partnerWithdrawals.map(w => {
    const badgeClass = w.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : w.status === 'Approved' ? 'bg-blue-500/10 text-blue-600' : 'bg-amber-500/10 text-amber-600';
    const slipHtml = w.receiptUrl 
      ? `<a href="${w.receiptUrl}" download="receipt-${w.id}.pdf" class="text-blue-550 hover:underline font-bold flex items-center gap-1"><i class="bx bx-paperclip text-sm"></i> Download</a>`
      : `<span class="text-slate-400 font-normal italic">No Receipt</span>`;

    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-xs font-semibold">
        <td class="p-2.5 font-mono text-slate-500">${w.dateRequested}</td>
        <td class="p-2.5 text-slate-500 font-normal">${w.bankName} (${w.bankDetailsMasked})</td>
        <td class="p-2.5 font-bold">${fmtNGN(w.amount)}</td>
        <td class="p-2.5 font-normal">${slipHtml}</td>
        <td class="p-2.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeClass}">${w.status}</span></td>
      </tr>
    `;
  }).join('');

  if (!withdrawalsRowsHtml) withdrawalsRowsHtml = `<tr><td colspan="5" class="p-4 text-center text-slate-400 italic">No withdrawal transaction requests logged.</td></tr>`;
  html = html.replace('<!-- DYNAMIC WITHDRAWALS -->', withdrawalsRowsHtml);

  return html;
}

// 2. EVENT BINDERS
export function bindPartnersTabListeners(state, root, addAuditLog, initAdminTab, renderApp) {
  if (!state.admin.referralsList) state.admin.referralsList = [];
  const log = state.admin.referralsList;
  const viewMode = state.admin.partnerViewMode;

  // Render Subtabs style highlights in Details View
  if (viewMode === 'detail') {
    const activeSub = state.admin.partnerDetailSubtab || 'profile';
    ['profile', 'tree', 'finance'].forEach(tab => {
      const el = document.querySelector(`#tab-btn-${tab}`);
      if (el) {
        if (tab === activeSub) {
          el.className = "pb-2 border-b-2 border-blue-600 text-blue-600 font-display uppercase tracking-wider";
        } else {
          el.className = "pb-2 border-b-2 border-transparent text-slate-400 hover:text-slate-655 font-display uppercase tracking-wider";
        }
      }
    });
  }

  // Register Code Generator on form input
  if (viewMode === 'create') {
    const nameInput = document.querySelector('#part-form-name');
    const codeInput = document.querySelector('#part-form-code');
    if (nameInput && codeInput) {
      nameInput.addEventListener('input', e => {
        const val = e.target.value.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
        if (val) {
          codeInput.value = `SKY-${val}-${Math.floor(100 + Math.random() * 900)}`;
        }
      });
    }
  }

  // Live filter update inside partner directory
  if (viewMode === 'list') {
    const searchInp = document.querySelector('#part-search-input');
    const kycFilter = document.querySelector('#filter-part-kyc');
    const tierFilter = document.querySelector('#filter-part-tier');
    const activeFilter = document.querySelector('#filter-part-active');

    function applyPartFilters() {
      const q = (searchInp?.value || '').toLowerCase().trim();
      const kycF = kycFilter?.value || 'all';
      const tierF = tierFilter?.value || 'all';
      const activeF = activeFilter?.value || 'all';

      const tbody = document.querySelector('#partner-directory-table-body');
      if (!tbody) return;

      const filtered = log.filter(p => {
        const matchesQuery = !q || [p.name, p.code, p.email, p.phone].join(' ').toLowerCase().includes(q);
        const matchesKYC = kycF === 'all' || p.status === kycF;
        const matchesTier = tierF === 'all' || (tierF === 'Gen 1' ? !p.uplineId : p.uplineId);
        const matchesActive = activeF === 'all' || (activeF === 'active' ? p.isActive : !p.isActive);
        return matchesQuery && matchesKYC && matchesTier && matchesActive;
      });

      tbody.innerHTML = generateListRowsHtml(filtered, log);
    }

    if (searchInp) searchInp.addEventListener('input', applyPartFilters);
    if (kycFilter) kycFilter.addEventListener('change', applyPartFilters);
    if (tierFilter) tierFilter.addEventListener('change', applyPartFilters);
    if (activeFilter) activeFilter.addEventListener('change', applyPartFilters);

    document.querySelector('#clear-part-filters-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInp) searchInp.value = '';
      if (kycFilter) kycFilter.value = 'all';
      if (tierFilter) tierFilter.value = 'all';
      if (activeFilter) activeFilter.value = 'all';
      applyPartFilters();
    });

    applyPartFilters();
  }

  // Submit manual registration
  if (viewMode === 'create') {
    const form = document.querySelector('#part-creation-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('#part-form-name').value.trim();
        const email = document.querySelector('#part-form-email').value.trim();
        const phone = document.querySelector('#part-form-phone').value.trim();
        const code = document.querySelector('#part-form-code').value.trim();
        const uplineIdVal = document.querySelector('#part-form-upline').value;
        
        const bankName = document.querySelector('#part-form-bank-name').value.trim();
        const bankNum = document.querySelector('#part-form-bank-num').value.trim();
        const bankAccName = document.querySelector('#part-form-bank-accname').value.trim();

        if (!name || !email || !phone || !code || !bankName || !bankNum || !bankAccName) {
          alert('Please fill in all required inputs.');
          return;
        }

        // Unique code check
        if (log.some(p => p.code === code)) {
          alert(`Referral code "${code}" is already taken.`);
          return;
        }

        const nextId = log.length > 0 ? Math.max(...log.map(p => p.id)) + 1 : 1;
        const newPart = {
          id: nextId,
          name,
          email,
          phone,
          code,
          uplineId: uplineIdVal ? parseInt(uplineIdVal) : null,
          status: 'Pending Review',
          isActive: true,
          salesVolume: 0,
          earned: 0,
          balance: 0,
          dateJoined: new Date().toISOString().substring(0, 10),
          kycDocs: {
            passportUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
            utilityUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=200'
          },
          bankDetails: {
            bankName,
            accountNum: bankNum,
            accountName: bankAccName,
            status: 'Pending'
          },
          commissionHistory: [],
          payoutsList: []
        };

        log.unshift(newPart);
        addAuditLog(`Registered new affiliate account for ${name} (${code})`, 'Affiliates');
        alert(`Affiliate ${name} registered successfully.`);
        
        state.admin.partnerViewMode = 'list';
        state.admin.selectedPartnerId = null;
        initAdminTab('partners-directory');
        renderApp();
      });
    }
  }

  // --- Profile & KYC details page listeners ---
  if (viewMode === 'detail') {
    const selectedId = state.admin.selectedPartnerId;
    const partner = log.find(item => item.id === parseInt(selectedId));

    if (partner) {
      // Toggle Active Connection
      document.querySelector('#toggle-part-active-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        partner.isActive = !partner.isActive;
        addAuditLog(`${partner.isActive ? 'Enabled' : 'Disabled'} referral active status for ${partner.name}`, 'Affiliates');
        initAdminTab('partners-directory');
      });

      // Approve/Reject disbursement bank accounts
      document.querySelector('#approve-part-bank-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (partner.bankDetails) partner.bankDetails.status = 'Approved';
        addAuditLog(`Approved Zenith disbursement bank credentials for ${partner.name}`, 'Affiliates');
        alert(`Bank details verified for ${partner.name}.`);
        initAdminTab('partners-directory');
      });

      document.querySelector('#reject-part-bank-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (partner.bankDetails) partner.bankDetails.status = 'Rejected';
        addAuditLog(`Rejected bank account details verification for ${partner.name}`, 'Affiliates');
        alert(`Bank details marked as Rejected for ${partner.name}.`);
        initAdminTab('partners-directory');
      });

      document.querySelector('#flag-part-bank-resubmit-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (partner.bankDetails) partner.bankDetails.status = 'Resubmit Needed';
        addAuditLog(`Flagged bank details re-submission loop for ${partner.name}`, 'Affiliates');
        alert(`Bank details flagged for resubmission for ${partner.name}.`);
        initAdminTab('partners-directory');
      });

      // Identity KYC approvals
      document.querySelector('#approve-part-kyc-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        partner.status = 'Approved';
        addAuditLog(`Approved identity KYC compliance verification check for ${partner.name}`, 'Affiliates');
        alert(`Compliance verified for ${partner.name}.`);
        initAdminTab('partners-directory');
      });

      const rejectBox = document.querySelector('#p-detail-kyc-reject-reason-box');
      const rejectReasonInput = document.querySelector('#p-detail-kyc-reject-reason');
      
      document.querySelector('#trigger-reject-part-kyc-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        rejectBox?.classList.remove('hidden');
      });

      document.querySelector('#cancel-reject-kyc-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        rejectBox?.classList.add('hidden');
      });

      document.querySelector('#confirm-reject-kyc-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        const reason = rejectReasonInput?.value.trim();
        if (!reason) {
          alert('Please enter a rejection reason.');
          return;
        }

        partner.status = 'Rejected';
        partner.kycRejectReason = reason;
        
        addAuditLog(`Rejected identity KYC compliance verification check for ${partner.name}. Reason: ${reason}`, 'Affiliates');
        alert(`Identity KYC Rejected for ${partner.name}.`);
        
        rejectBox?.classList.add('hidden');
        initAdminTab('partners-directory');
      });
    }
  }

  // --- Click Delegations ---
  root.addEventListener('click', (e) => {
    // Click view partner detail
    const viewBtn = e.target.closest('[data-view-part-id]');
    if (viewBtn) {
      e.preventDefault();
      state.admin.selectedPartnerId = parseInt(viewBtn.getAttribute('data-view-part-id'));
      state.admin.partnerViewMode = 'detail';
      state.admin.partnerDetailSubtab = 'profile';
      initAdminTab('partners-directory');
      return;
    }

    // Add partner click
    if (e.target.closest('#add-manual-partner-btn')) {
      e.preventDefault();
      state.admin.partnerViewMode = 'create';
      state.admin.selectedPartnerId = null;
      initAdminTab('partners-directory');
      return;
    }

    // Cancel forms / back buttons
    if (e.target.closest('#back-to-partners-btn') || e.target.closest('#cancel-part-form-btn') || e.target.closest('#part-form-cancel-btn')) {
      e.preventDefault();
      state.admin.partnerViewMode = 'list';
      state.admin.selectedPartnerId = null;
      initAdminTab('partners-directory');
      return;
    }

    // Tab switch detail
    const tabBtn = e.target.closest('[data-detail-tab]');
    if (tabBtn) {
      e.preventDefault();
      state.admin.partnerDetailSubtab = tabBtn.getAttribute('data-detail-tab');
      initAdminTab('partners-directory');
      return;
    }

    // Delete partner
    const delBtn = e.target.closest('[data-delete-part-id]');
    if (delBtn) {
      e.preventDefault();
      const id = parseInt(delBtn.getAttribute('data-delete-part-id'));
      const idx = log.findIndex(item => item.id === id);
      if (idx !== -1 && confirm(`Delete Affiliate ${log[idx].name}?`)) {
        const name = log[idx].name;
        log.splice(idx, 1);
        addAuditLog(`Deleted affiliate records for ${name}`, 'Affiliates');
        initAdminTab('partners-directory');
        renderApp();
      }
      return;
    }
  });
}
