import customerTemplates from '../html/customer.html?raw';

function getTemplateHtml(id) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(customerTemplates, 'text/html');
  const temp = doc.querySelector(`#${id}`);
  return temp ? temp.innerHTML : '';
}

function getSection(name) {
  const startMarker = `data-section="${name}"`;
  const startIdx = customerTemplates.indexOf(startMarker);
  if (startIdx === -1) return '';
  const divStart = customerTemplates.lastIndexOf('<div', startIdx);
  const endMarker = `END SECTION: ${name}`;
  const endCommentIdx = customerTemplates.indexOf(endMarker, startIdx);
  if (endCommentIdx === -1) return '';
  const closingDiv = customerTemplates.lastIndexOf('</div>', endCommentIdx);
  if (closingDiv === -1) return '';
  return customerTemplates.slice(divStart, closingDiv + 6);
}

function fmtNGN(val) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
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

// Database integrity check and defaults pre-fills
function initializeCustomerDefaults(state) {
  const customers = state.admin.kycQueue || [];
  
  // Ensure default client entries
  if (!customers.find(c => c.name === 'Jane Doe')) {
    customers.push({
      id: 3,
      name: 'Jane Doe',
      email: 'jane@domain.com',
      docType: 'Driver\'s License',
      docUrl: 'license.jpg',
      status: 'Pending Review',
      date: '2026-07-07',
      phone: '+234 802 999 8881',
      gender: 'Female',
      bvn: '22277766601',
      nin: '55511122203',
      address: 'Plot 4, Chevron Drive, Lekki, Lagos',
      portalAccess: 'Enabled',
      assignedAffiliate: 'Obinna Diala',
      dateJoined: '2026-07-07',
      notes: [
        { category: 'General', staff: 'Amina Bello', date: '2026-07-07 10:20', text: 'Completed initial land catalog walkthrough.' }
      ],
      landDocs: [],
      kycDocsDetail: {
        id: { status: 'Pending Review', reason: '', url: 'license.jpg', label: 'Driver\'s License Scan' },
        photo: { status: 'Pending Review', reason: '', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', label: 'Passport Photograph' },
        address: { status: 'Approved', reason: '', url: '#', label: 'Utility Bill Proof' }
      }
    });
  }

  customers.forEach(c => {
    if (!c.phone) c.phone = '+234 803 123 4567';
    if (!c.bvn) c.bvn = '22288899901';
    if (!c.nin) c.nin = '55500011122';
    if (!c.address) c.address = 'No 12, Alfred Rewane Road, Ikoyi, Lagos';
    if (!c.gender) c.gender = 'Male';
    if (!c.assignedAffiliate) c.assignedAffiliate = 'Direct';
    if (!c.dateJoined) c.dateJoined = c.date || '2026-07-01';
    if (!c.portalAccess) c.portalAccess = 'Enabled';
    if (!c.notes) c.notes = [];
    if (!c.landDocs) c.landDocs = [];
    if (!c.kycDocsDetail) {
      c.kycDocsDetail = {
        id: { status: c.status === 'Approved' ? 'Approved' : 'Pending Review', reason: '', url: '#', label: 'Verification ID Scan' },
        photo: { status: c.status === 'Approved' ? 'Approved' : 'Pending Review', reason: '', url: '#', label: 'Passport Photograph' },
        address: { status: c.status === 'Approved' ? 'Approved' : 'Pending Review', reason: '', url: '#', label: 'Utility Bill Proof' }
      };
    }
  });
}

// Compute Payment Status badge based on orders ledger ratios
function calculatePaymentStatus(c, state) {
  const orders = (state.admin.ordersLedger || []).filter(o => o.clientName === c.name);
  if (orders.length === 0) return 'Active';

  const allPaidOff = orders.every(o => o.status === 'Paid Off' || o.status === 'Fully Paid' || (o.paidAmount && o.paidAmount >= o.price));
  if (allPaidOff) return 'Fully Paid';

  const totalCommitted = orders.reduce((sum, o) => sum + (o.price || 0), 0);
  const totalPaid = orders.reduce((sum, o) => sum + (o.paidAmount || 0), 0);

  if (totalCommitted > 0 && (totalPaid / totalCommitted) >= 0.8) {
    return 'Completing';
  }
  return 'Active';
}

// 1. MASTER ROUTER
export function renderCustomersTab(state, properties, projects) {
  initializeCustomerDefaults(state);
  
  if (!state.admin.customerViewMode) state.admin.customerViewMode = 'list';
  const mode = state.admin.customerViewMode;

  const customers = state.admin.kycQueue || [];
  const selectedId = state.admin.selectedCustomerId;
  const customer = selectedId != null ? customers.find(c => c.id === parseInt(selectedId)) : null;

  if (mode === 'details' && customer) return renderDetailView(state, customer);
  if (mode === 'create' || (mode === 'edit' && customer)) return renderFormView(state, customer);
  return renderListView(state, customers);
}

// 2. LIST VIEW
function renderListView(state, customers) {
  let html = getSection('customers-list-template');

  // Fill affiliates options in filter
  const affiliates = state.admin.referralsList || [];
  const affiliateOptions = affiliates.filter(a => a.status === 'Approved').map(a => `
    <option value="${a.name}">${a.name}</option>
  `).join('');
  html = html.replace('<!-- DYNAMIC AFFILIATE OPTIONS -->', affiliateOptions);

  return html;
}

// 3. FORM VIEW
function renderFormView(state, customer) {
  const isEditing = !!customer;
  let html = getSection('customer-form-template');

  if (isEditing) {
    html = html.replace('Register New Customer Account', 'Modify Customer Account Details');
    html = html.replace('Confirm Registration', 'Save Changes');
  }

  // Populate affiliates list dropdown
  const affiliates = state.admin.referralsList || [];
  const affiliateOptions = affiliates.filter(a => a.status === 'Approved').map(a => `
    <option value="${a.name}" ${isEditing && customer.assignedAffiliate === a.name ? 'selected' : ''}>${a.name}</option>
  `).join('');
  html = html.replace('<!-- DYNAMIC REFERRAL LIST -->', affiliateOptions);

  return html;
}

// 4. DETAIL VIEW
function renderDetailView(state, customer) {
  let html = getSection('customer-detail-template');
  return html;
}

// --- Bind List View Event Listeners ---
export function bindCustomersTabListeners(state, root, initAdminTab, addAuditLog, renderApp) {
  const customers = state.admin.kycQueue || [];
  const viewMode = state.admin.customerViewMode;

  if (viewMode === 'list') {
    const searchInp = document.querySelector('#admin-search-customers');
    const kycFilter = document.querySelector('#filter-kyc-status');
    const payFilter = document.querySelector('#filter-payment-status');
    const affFilter = document.querySelector('#filter-assigned-affiliate');

    function renderTableRows() {
      const q = (searchInp?.value || '').toLowerCase().trim();
      const kv = kycFilter?.value || 'all';
      const pv = payFilter?.value || 'all';
      const av = affFilter?.value || 'all';
      
      const tbody = document.querySelector('#admin-customers-table-body');
      if (!tbody) return;

      const filtered = customers.filter(c => {
        const matchesQuery = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
        const matchesKyc = kv === 'all' || c.status === kv;
        const matchesPay = pv === 'all' || calculatePaymentStatus(c, state) === pv;
        const matchesAff = av === 'all' || c.assignedAffiliate === av;
        return matchesQuery && matchesKyc && matchesPay && matchesAff;
      });

      tbody.innerHTML = filtered.map(c => {
        const clientPlots = (state.admin.plots || []).filter(p => p.client === c.name);
        const clientOrders = (state.admin.ordersLedger || []).filter(o => o.clientName === c.name);
        const assetsCount = clientPlots.length + clientOrders.length;
        
        let propertiesStr = 'None';
        if (assetsCount > 0) {
          const firstAsset = clientPlots.length > 0 ? clientPlots[0].id : clientOrders[0].propertyTitle;
          propertiesStr = assetsCount > 1 ? `${firstAsset} (+${assetsCount - 1} more)` : firstAsset;
        }

        const kycClass = c.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' : c.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-455' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
        
        const payStatus = calculatePaymentStatus(c, state);
        const payClass = payStatus === 'Fully Paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' : payStatus === 'Completing' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400';

        const initials = c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const dateJoined = c.dateJoined || '2026-07-01';

        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-sm">
            <td class="p-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 flex items-center justify-center text-xs font-bold flex-shrink-0">${initials}</div>
                <span class="font-bold text-slate-900 dark:text-white cursor-pointer hover:underline" data-view-cust-id="${c.id}">${c.name}</span>
              </div>
            </td>
            <td class="p-3">
              <span class="block font-mono text-xs">${c.email}</span>
              <span class="block text-[10px] text-slate-400 font-mono mt-0.5">${c.phone}</span>
            </td>
            <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${kycClass}">${c.status === 'Approved' ? 'Verified' : c.status}</span></td>
            <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${payClass}">${payStatus}</span></td>
            <td class="p-3 text-slate-650 dark:text-slate-350 font-semibold">${c.assignedAffiliate === 'Direct' ? '<span class="text-slate-400 italic font-normal">Direct</span>' : c.assignedAffiliate}</td>
            <td class="p-3 font-mono text-slate-450 text-xs">${dateJoined}</td>
            <td class="p-3 font-semibold text-slate-700 dark:text-slate-300 text-xs">${propertiesStr}</td>
            <td class="p-3 text-right">
              <div class="flex items-center justify-end gap-2 text-base">
                <button data-view-cust-id="${c.id}" class="text-blue-500 hover:text-blue-700 p-1" title="View Detail"><i class="bx bx-show"></i></button>
                <button data-edit-cust-id="${c.id}" class="text-emerald-500 hover:text-emerald-700 p-1" title="Edit"><i class="bx bx-edit"></i></button>
                <button data-delete-cust-id="${c.id}" class="text-rose-500 hover:text-rose-700 p-1" title="Delete"><i class="bx bx-trash"></i></button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    if (searchInp) searchInp.addEventListener('input', renderTableRows);
    if (kycFilter) kycFilter.addEventListener('change', renderTableRows);
    if (payFilter) payFilter.addEventListener('change', renderTableRows);
    if (affFilter) affFilter.addEventListener('change', renderTableRows);

    renderTableRows();
  }

  // --- Bind Form Logic ---
  if (viewMode === 'create' || viewMode === 'edit') {
    const form = document.querySelector('#customer-registration-form');
    const selectedId = state.admin.selectedCustomerId;
    const c = selectedId ? customers.find(item => item.id === parseInt(selectedId)) : null;
    const isEditing = !!c;

    if (isEditing) {
      document.querySelector('#cust-edit-id').value = c.id;
      document.querySelector('#cust-form-name').value = c.name;
      document.querySelector('#cust-form-email').value = c.email;
      document.querySelector('#cust-form-phone').value = c.phone || '';
      document.querySelector('#cust-form-gender').value = c.gender || 'Male';
      document.querySelector('#cust-form-bvn').value = c.bvn || '';
      document.querySelector('#cust-form-nin').value = c.nin || '';
      document.querySelector('#cust-form-address').value = c.address || '';
      document.querySelector('#cust-form-status').value = c.status || 'Pending Review';
      document.querySelector('#cust-form-affiliate').value = c.assignedAffiliate || 'Direct';
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const editIdVal = document.querySelector('#cust-edit-id').value;
        const name = document.querySelector('#cust-form-name').value.trim();
        const email = document.querySelector('#cust-form-email').value.trim();
        const phone = document.querySelector('#cust-form-phone').value.trim();
        const gender = document.querySelector('#cust-form-gender').value;
        const bvn = document.querySelector('#cust-form-bvn').value.trim();
        const nin = document.querySelector('#cust-form-nin').value.trim();
        const address = document.querySelector('#cust-form-address').value.trim();
        const status = document.querySelector('#cust-form-status').value;
        const affiliate = document.querySelector('#cust-form-affiliate').value;

        // Validation checks
        let isValid = true;
        document.querySelectorAll('[id^="err-cust-"]').forEach(el => el.classList.add('hidden'));

        if (!name) {
          document.querySelector('#err-cust-name').classList.remove('hidden');
          isValid = false;
        }
        if (!email || !email.includes('@')) {
          document.querySelector('#err-cust-email').classList.remove('hidden');
          isValid = false;
        }
        if (!phone) {
          document.querySelector('#err-cust-phone').classList.remove('hidden');
          isValid = false;
        }
        if (!bvn || bvn.length !== 11 || isNaN(bvn)) {
          document.querySelector('#err-cust-bvn').classList.remove('hidden');
          isValid = false;
        }
        if (!nin || nin.length !== 11 || isNaN(nin)) {
          document.querySelector('#err-cust-nin').classList.remove('hidden');
          isValid = false;
        }
        if (!address) {
          document.querySelector('#err-cust-address').classList.remove('hidden');
          isValid = false;
        }

        if (!isValid) {
          showToast('Please fix validation errors on the form.', 'error');
          return;
        }

        if (editIdVal) {
          const entry = customers.find(item => item.id === parseInt(editIdVal));
          if (entry) {
            entry.name = name;
            entry.email = email;
            entry.phone = phone;
            entry.gender = gender;
            entry.bvn = bvn;
            entry.nin = nin;
            entry.address = address;
            entry.status = status;
            entry.assignedAffiliate = affiliate;

            addAuditLog(`Modified details for customer "${name}"`, 'Customers CRM');
            showToast(`Profile updated for "${name}" successfully.`);
            state.admin.selectedCustomerId = entry.id;
          }
        } else {
          const newId = customers.length > 0 ? Math.max(...customers.map(item => item.id)) + 1 : 1;
          const newCust = {
            id: newId,
            name,
            email,
            phone,
            gender,
            bvn,
            nin,
            address,
            status,
            assignedAffiliate: affiliate,
            portalAccess: 'Enabled',
            dateJoined: new Date().toISOString().substring(0, 10),
            notes: [],
            landDocs: [],
            kycDocsDetail: {
              id: { status: 'Pending Review', reason: '', url: '#', label: 'Verification ID Scan' },
              photo: { status: 'Pending Review', reason: '', url: '#', label: 'Passport Photograph' },
              address: { status: 'Pending Review', reason: '', url: '#', label: 'Utility Bill Proof' }
            }
          };
          customers.unshift(newCust);
          addAuditLog(`Registered new customer account "${name}"`, 'Customers CRM');
          showToast(`Account registered for "${name}" successfully.`);
          state.admin.selectedCustomerId = newId;
        }

        state.admin.customerViewMode = 'details';
        state.admin.activeCustDetailTab = 'info';
        initAdminTab('customers');
        renderApp();
      });
    }
  }

  // --- Bind Details Page Logic ---
  if (viewMode === 'details') {
    const selectedId = state.admin.selectedCustomerId;
    const c = selectedId ? customers.find(item => item.id === parseInt(selectedId)) : null;

    if (!c) {
      root.innerHTML = `<div class="p-6 text-center text-slate-500">Error: Client profile not found in CRM registry.</div>`;
      return;
    }

    // Populate header info
    document.querySelector('#cust-details-title-name').textContent = c.name;
    document.querySelector('#cust-portal-access-badge').textContent = `Portal ${c.portalAccess || 'Enabled'}`;
    document.querySelector('#cust-portal-access-badge').className = `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.portalAccess === 'Disabled' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-455' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450'}`;

    const kycBadge = document.querySelector('#cust-kyc-status-badge');
    if (kycBadge) {
      kycBadge.textContent = c.status === 'Approved' ? 'Verified' : c.status;
      kycBadge.className = `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-455' : c.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-455' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`;
    }

    // Compute committed metrics boxes values
    const clientPlots = (state.admin.plots || []).filter(p => p.client === c.name);
    const clientOrders = (state.admin.ordersLedger || []).filter(o => o.clientName === c.name);

    const plotsSum = clientPlots.reduce((sum, p) => sum + (p.price || 0), 0);
    const ordersSum = clientOrders.reduce((sum, o) => sum + (o.price || 0), 0);
    const committed = plotsSum + ordersSum;
    const paid = clientPlots.reduce((sum, p) => sum + (p.price || 0), 0) + clientOrders.reduce((sum, o) => sum + (o.paidAmount || 0), 0);
    const balance = Math.max(0, committed - paid);

    document.querySelector('#metric-committed-value').textContent = fmtNGN(committed);
    document.querySelector('#metric-paid-value').textContent = fmtNGN(paid);
    document.querySelector('#metric-balance-value').textContent = fmtNGN(balance);

    // KYC Compliance review status indicator cards
    const setKycDocCardStatus = (docKey, badgeId, rejectId, approveBtn, rejectBtn, reuploadBtn, viewLinkId) => {
      const doc = c.kycDocsDetail ? c.kycDocsDetail[docKey] : null;
      const statusEl = document.querySelector(`#${badgeId}`);
      const rejectReasonEl = document.querySelector(`#${rejectId}`);
      const linkEl = document.querySelector(`#${viewLinkId}`);

      if (doc && statusEl) {
        statusEl.textContent = doc.status;
        statusEl.className = `px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
          doc.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' : 
          doc.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-455' : 
          doc.status === 'Re-upload Requested' ? 'bg-indigo-500/10 text-indigo-650' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
        }`;
        
        if (doc.status === 'Rejected' && doc.reason) {
          rejectReasonEl.textContent = `Reason: ${doc.reason}`;
          rejectReasonEl.classList.remove('hidden');
        } else {
          rejectReasonEl.classList.add('hidden');
        }

        if (linkEl) {
          linkEl.href = doc.url || '#';
        }
      }
    };
    setKycDocCardStatus('id', 'kyc-status-doc-id', 'kyc-reject-reason-doc-id', '#approve-doc-id-btn', '#reject-doc-id-btn', '#reupload-doc-id-btn', 'kyc-doc-id-link');
    setKycDocCardStatus('photo', 'kyc-status-doc-photo', 'kyc-reject-reason-doc-photo', '#approve-doc-photo-btn', '#reject-doc-photo-btn', '#reupload-doc-photo-btn', 'kyc-doc-photo-link');
    setKycDocCardStatus('address', 'kyc-status-doc-address', 'kyc-reject-reason-doc-address', '#approve-doc-address-btn', '#reject-doc-address-btn', '#reupload-doc-address-btn', 'kyc-doc-address-link');

    // Portal Authorization
    const portalStatusEl = document.querySelector('#portal-sign-in-status');
    const portalToggleBtn = document.querySelector('#toggle-cust-access-btn');
    if (portalStatusEl && portalToggleBtn) {
      const isDisabled = c.portalAccess === 'Disabled';
      portalStatusEl.textContent = isDisabled ? 'Currently Disabled' : 'Currently Active';
      portalStatusEl.className = `text-[10px] font-bold ${isDisabled ? 'text-rose-500' : 'text-emerald-500'}`;
      
      portalToggleBtn.innerHTML = isDisabled ? '<i class="bx bx-check-circle"></i> Enable Portal' : '<i class="bx bx-block"></i> Disable Portal';
      portalToggleBtn.className = `px-2.5 py-1 text-[11px] font-semibold rounded active:scale-98 transition-all flex items-center gap-1 ${
        isDisabled ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
      }`;
    }

    // Dynamic Render of tab panels
    const renderDetailTabsPanels = () => {
      const activeTab = state.admin.activeCustDetailTab || 'info';
      
      // Update Tab header triggers UI
      document.querySelectorAll('#customer-details-tabs-nav button').forEach(btn => {
        const tabKey = btn.getAttribute('data-cust-tab');
        if (tabKey === activeTab) {
          btn.className = "pb-2 border-b-2 font-bold transition-all border-[#1e3a8a] text-[#1e3a8a] dark:text-blue-400";
        } else {
          btn.className = "pb-2 border-b-2 font-bold transition-all border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300";
        }
      });

      // Toggle panels display
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
      const activePanel = document.querySelector(`#pane-${activeTab}`);
      if (activePanel) activePanel.classList.remove('hidden');

      // Populate targeted panel data
      if (activeTab === 'info') {
        document.querySelector('#info-cust-name').textContent = c.name;
        document.querySelector('#info-cust-email').textContent = c.email;
        document.querySelector('#info-cust-phone').textContent = c.phone;
        document.querySelector('#info-cust-address').textContent = c.address;
        document.querySelector('#info-cust-nin').textContent = c.nin;
        document.querySelector('#info-cust-bvn').textContent = c.bvn;
        document.querySelector('#info-cust-affiliate').textContent = c.assignedAffiliate || 'Direct (None)';
        document.querySelector('#info-cust-date').textContent = c.dateJoined || '2026-07-01';
      }

      if (activeTab === 'properties') {
        const tbody = document.querySelector('#detail-properties-owned-tbody');
        if (tbody) {
          const list = [...clientPlots, ...clientOrders];
          if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-3 text-center text-xs text-slate-400 italic">No layout plots or property orders allocated.</td></tr>`;
          } else {
            tbody.innerHTML = list.map(item => {
              const price = item.price || 0;
              const title = item.propertyTitle || item.id;
              const typeStr = item.plan ? 'Order Reservation' : 'Allocated Plot';
              const planStr = item.plan || item.paymentMode || 'Outright';
              const status = item.status || 'Allocated';

              let statusClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-450';
              if (status === 'Allocated' || status === 'Paid Off') statusClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450';
              else if (status === 'Pending Downpayment') statusClass = 'bg-rose-500/10 text-rose-600 dark:text-rose-455';

              return `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
                  <td class="p-3 text-slate-900 dark:text-white font-bold">${title}</td>
                  <td class="p-3">${fmtNGN(price)}</td>
                  <td class="p-3 text-slate-500 font-normal">${typeStr}</td>
                  <td class="p-3 text-slate-500 font-normal">${planStr}</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded text-[9px] uppercase font-bold ${statusClass}">${status}</span>
                  </td>
                  <td class="p-3 text-right">
                    <button data-prop-redirect="${item.id}" class="text-blue-550 hover:underline">View Plot <i class="bx bx-right-arrow-alt align-middle"></i></button>
                  </td>
                </tr>
              `;
            }).join('');
          }
        }
      }

      if (activeTab === 'payments') {
        const tbody = document.querySelector('#detail-payments-history-tbody');
        if (tbody) {
          const payments = (state.admin.paymentsLog || []).filter(p => p.clientName === c.name);
          if (payments.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-3 text-center text-xs text-slate-400 italic">No payments history found.</td></tr>`;
          } else {
            tbody.innerHTML = payments.map(pay => {
              const statusClass = pay.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
              return `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
                  <td class="p-3 text-slate-500 font-normal">${pay.date}</td>
                  <td class="p-3 text-slate-900 dark:text-white font-bold">${pay.propertyTitle}</td>
                  <td class="p-3 font-bold">${fmtNGN(pay.amount)}</td>
                  <td class="p-3 text-slate-500 font-normal">${pay.channel}</td>
                  <td class="p-3 font-mono text-slate-500 font-normal">${pay.reference}</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded text-[9px] uppercase font-bold ${statusClass}">${pay.status}</span>
                  </td>
                </tr>
              `;
            }).join('');
          }
        }
      }

      if (activeTab === 'inspections') {
        const tbody = document.querySelector('#detail-inspections-tbody');
        if (tbody) {
          const inspections = (state.admin.inspectionsList || []).filter(i => i.email === c.email || i.name === c.name);
          if (inspections.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-3 text-center text-xs text-slate-400 italic">No upcoming site inspections registered.</td></tr>`;
          } else {
            tbody.innerHTML = inspections.map(i => {
              const statusClass = i.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
              return `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
                  <td class="p-3 font-mono">${i.date}</td>
                  <td class="p-3 text-slate-900 dark:text-white font-bold">${i.propertyTitle}</td>
                  <td class="p-3 text-slate-500 font-normal">${i.type}</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded text-[9px] uppercase font-bold ${statusClass}">${i.status}</span>
                  </td>
                </tr>
              `;
            }).join('');
          }
        }
      }

      if (activeTab === 'affiliate') {
        const box = document.querySelector('#referred-affiliate-profile-box');
        if (box) {
          const partner = (state.admin.referralsList || []).find(p => p.name === c.assignedAffiliate);
          if (!partner || c.assignedAffiliate === 'Direct') {
            box.innerHTML = `
              <div class="p-4 bg-slate-50 dark:bg-slate-955/20 rounded text-center text-slate-455 italic">
                Referred Directly (No marketing affiliate referral code assigned to client).
              </div>
            `;
          } else {
            box.innerHTML = `
              <div class="grid grid-cols-2 gap-4">
                <div><span class="text-slate-400 font-normal block">Affiliate Partner</span><span class="text-slate-900 dark:text-white font-bold">${partner.name}</span></div>
                <div><span class="text-slate-400 font-normal block">Realtor Code</span><span class="text-indigo-650 font-bold font-mono">${partner.code}</span></div>
                <div><span class="text-slate-400 font-normal block">Email Contact</span><span class="text-slate-700 dark:text-slate-350 font-mono">${partner.email}</span></div>
                <div><span class="text-slate-400 font-normal block">Registration Status</span><span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-600">${partner.status}</span></div>
              </div>
            `;
          }
        }
      }

      if (activeTab === 'documents') {
        const tbody = document.querySelector('#detail-land-documents-tbody');
        if (tbody) {
          const docs = c.landDocs || [];
          if (docs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-3 text-center text-xs text-slate-400 italic">No allocation letter, C of O, or deed files registered.</td></tr>`;
          } else {
            tbody.innerHTML = docs.map((doc, idx) => `
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
                <td class="p-3 text-slate-800 dark:text-slate-200">${doc.type}</td>
                <td class="p-3"><a href="${doc.url || '#'}" download="${doc.name}" class="text-blue-500 hover:underline"><i class="bx bx-paperclip text-slate-400 mr-1"></i>${doc.name}</a></td>
                <td class="p-3 font-mono text-slate-500 font-normal">${doc.date}</td>
                <td class="p-3 text-slate-500 font-normal">${doc.uploader}</td>
                <td class="p-3 text-right text-base space-x-2">
                  <a href="${doc.url || '#'}" download="${doc.name}" class="text-blue-500 hover:text-blue-755" title="Download"><i class="bx bx-download"></i></a>
                  <button data-delete-land-doc-idx="${idx}" class="text-rose-500 hover:text-rose-700" title="Delete"><i class="bx bx-trash text-sm"></i></button>
                </td>
              </tr>
            `).join('');
          }
        }
      }

      if (activeTab === 'notes') {
        const list = document.querySelector('#detail-staff-notes-list');
        if (list) {
          const notes = c.notes || [];
          if (notes.length === 0) {
            list.innerHTML = `<div class="py-6 text-center bg-slate-50 dark:bg-slate-955/30 rounded border border-dashed border-slate-200/30 text-xs text-slate-400 italic">No staff logs written for this client.</div>`;
          } else {
            list.innerHTML = notes.map((note, idx) => {
              let catClass = 'bg-slate-100 text-slate-655';
              if (note.category === 'Payment Issue') catClass = 'bg-rose-500/10 text-rose-600 dark:text-rose-455';
              else if (note.category === 'Legal') catClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400';

              return `
                <div class="bg-slate-50 dark:bg-slate-955/30 p-3 rounded border border-slate-200/10 space-y-1.5 text-xs animate-fade-in">
                  <div class="flex items-center justify-between text-[10px] text-slate-400 font-normal">
                    <span class="flex items-center gap-1.5"><span class="px-2 py-0.5 rounded font-bold uppercase tracking-wider ${catClass}">${note.category}</span> By ${note.staff} • ${note.date}</span>
                    <button data-delete-note-idx="${idx}" class="text-rose-500 hover:text-rose-700"><i class="bx bx-trash"></i></button>
                  </div>
                  <p class="text-slate-655 dark:text-slate-350 font-normal leading-relaxed">${note.text}</p>
                </div>
              `;
            }).join('');
          }
        }
      }
    };

    // Subtabs switcher binder
    const tabNav = document.querySelector('#customer-details-tabs-nav');
    if (tabNav) {
      tabNav.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-cust-tab]');
        if (!btn) return;
        
        e.preventDefault();
        state.admin.activeCustDetailTab = btn.getAttribute('data-cust-tab');
        renderDetailTabsPanels();
      });
    }

    // Modal dialog hooks
    const rejectModal = document.querySelector('#kyc-reject-reason-modal');
    const rejectCancel = document.querySelector('#kyc-reject-modal-cancel');
    const rejectForm = document.querySelector('#kyc-reject-modal-form');

    const pwModal = document.querySelector('#pw-reset-confirm-modal');
    const pwCancel = document.querySelector('#pw-reset-modal-cancel');
    const pwConfirm = document.querySelector('#pw-reset-modal-confirm');

    const landDocModal = document.querySelector('#land-doc-upload-modal');
    const landDocTrigger = document.querySelector('#trigger-deed-upload-modal-btn');
    const landDocCancel = document.querySelector('#land-doc-modal-cancel');
    const landDocForm = document.querySelector('#land-doc-upload-modal-form');

    // KYC rejection triggers
    root.addEventListener('click', (e) => {
      // Approve Doc
      const docApprove = e.target.closest('#approve-doc-id-btn, #approve-doc-photo-btn, #approve-doc-address-btn');
      if (docApprove) {
        e.preventDefault();
        const docKey = docApprove.id.includes('id') ? 'id' : docApprove.id.includes('photo') ? 'photo' : 'address';
        c.kycDocsDetail[docKey].status = 'Approved';
        
        // Auto-approve profile KYC if all docs approved
        if (c.kycDocsDetail.id.status === 'Approved' && c.kycDocsDetail.photo.status === 'Approved' && c.kycDocsDetail.address.status === 'Approved') {
          c.status = 'Approved';
        }

        addAuditLog(`Approved KYC document "${c.kycDocsDetail[docKey].label}" for customer "${c.name}"`, 'Customers CRM');
        showToast('Document approved successfully.');
        initAdminTab('customers');
        return;
      }

      // Reject Doc Modal trigger
      const docReject = e.target.closest('#reject-doc-id-btn, #reject-doc-photo-btn, #reject-doc-address-btn');
      if (docReject && rejectModal) {
        e.preventDefault();
        const docKey = docReject.id.includes('id') ? 'id' : docReject.id.includes('photo') ? 'photo' : 'address';
        document.querySelector('#modal-reject-doc-type').value = docKey;
        document.querySelector('#modal-reject-reason-text').value = '';
        rejectModal.classList.remove('hidden');
        return;
      }

      // Re-upload request
      const docReupload = e.target.closest('#reupload-doc-id-btn, #reupload-doc-photo-btn, #reupload-doc-address-btn');
      if (docReupload) {
        e.preventDefault();
        const docKey = docReupload.id.includes('id') ? 'id' : docReupload.id.includes('photo') ? 'photo' : 'address';
        c.kycDocsDetail[docKey].status = 'Re-upload Requested';
        
        addAuditLog(`Requested KYC document re-upload ("${c.kycDocsDetail[docKey].label}") from customer "${c.name}"`, 'Customers CRM');
        showToast('Re-upload request registered.');
        initAdminTab('customers');
        return;
      }

      // Password Reset trigger modal
      if (e.target.closest('#reset-cust-password-btn') && pwModal) {
        e.preventDefault();
        pwModal.classList.remove('hidden');
        return;
      }

      // Land document upload modal trigger
      if (e.target.closest('#trigger-deed-upload-modal-btn') && landDocModal) {
        e.preventDefault();
        landDocModal.classList.remove('hidden');
        return;
      }
    });

    // Cancel modal actions
    if (rejectCancel && rejectModal) {
      rejectCancel.addEventListener('click', () => rejectModal.classList.add('hidden'));
    }
    if (pwCancel && pwModal) {
      pwCancel.addEventListener('click', () => pwModal.classList.add('hidden'));
    }
    if (landDocCancel && landDocModal) {
      landDocCancel.addEventListener('click', () => landDocModal.classList.add('hidden'));
    }

    // Submit KYC Rejection Reason form
    if (rejectForm && rejectModal) {
      rejectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const docKey = document.querySelector('#modal-reject-doc-type').value;
        const reason = document.querySelector('#modal-reject-reason-text').value.trim();

        if (c.kycDocsDetail && c.kycDocsDetail[docKey]) {
          c.kycDocsDetail[docKey].status = 'Rejected';
          c.kycDocsDetail[docKey].reason = reason;
          c.status = 'Rejected';
          
          addAuditLog(`Rejected KYC document "${c.kycDocsDetail[docKey].label}" for customer "${c.name}". Reason: ${reason}`, 'Customers CRM');
          showToast('KYC Document marked as rejected.', 'error');
          rejectModal.classList.add('hidden');
          initAdminTab('customers');
        }
      });
    }

    // Confirm simulated password reset token generation
    if (pwConfirm && pwModal) {
      pwConfirm.addEventListener('click', (e) => {
        e.preventDefault();
        pwModal.classList.add('hidden');
        
        const token = `https://portal.blueskyecityhome.com/auth/reset?token=rst_2026_${Math.floor(Math.random() * 900000 + 100000)}`;
        const box = document.querySelector('#generated-reset-token-box');
        const inp = document.querySelector('#reset-token-input-readonly');
        
        if (box) box.classList.remove('hidden');
        if (inp) inp.value = token;

        addAuditLog(`Simulated password reset URL generation for "${c.name}"`, 'Customers CRM');
        showToast('Password reset link generated.');
      });
    }

    // Upload Land Document submission inside modal
    if (landDocForm && landDocModal) {
      landDocForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.querySelector('#modal-land-doc-type').value;
        const fileInput = document.querySelector('#modal-land-doc-file');
        const file = fileInput.files[0];
        
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          if (!c.landDocs) c.landDocs = [];
          c.landDocs.push({
            type: type,
            name: file.name,
            date: new Date().toISOString().substring(0, 10),
            uploader: state.admin.staffName || 'Amina Bello',
            url: event.target.result
          });

          addAuditLog(`Uploaded document "${file.name}" to customer "${c.name}" docs locker`, 'Customers CRM');
          showToast('Land document uploaded successfully.');
          landDocModal.classList.add('hidden');
          landDocForm.reset();
          renderDetailTabsPanels();
        };
        reader.readAsDataURL(file);
      });
    }

    // Portal login permissions access toggle
    const toggleAccessBtn = document.querySelector('#toggle-cust-access-btn');
    if (toggleAccessBtn) {
      toggleAccessBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isCurrentlyEnabled = c.portalAccess !== 'Disabled';
        c.portalAccess = isCurrentlyEnabled ? 'Disabled' : 'Enabled';

        addAuditLog(`${isCurrentlyEnabled ? 'Revoked' : 'Granted'} portal authorization for "${c.name}"`, 'Customers CRM');
        showToast(`Portal access ${isCurrentlyEnabled ? 'disabled' : 'enabled'} for customer.`);
        initAdminTab('customers');
      });
    }

    // Add Staff Comments Note Form submit
    const noteForm = document.querySelector('#add-customer-note-form');
    if (noteForm) {
      noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.querySelector('#note-category-select').value;
        const text = document.querySelector('#note-text-input').value.trim();

        if (text) {
          if (!c.notes) c.notes = [];
          c.notes.unshift({
            category,
            staff: state.admin.staffName || 'Amina Bello',
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            text
          });

          addAuditLog(`Added categorized note (${category}) to customer "${c.name}" profile`, 'Customers CRM');
          showToast('Staff note added successfully.');
          document.querySelector('#note-text-input').value = '';
          renderDetailTabsPanels();
        }
      });
    }

    // Global Details Clicks delegation
    root.addEventListener('click', (e) => {
      // Delete Land Doc
      const deleteDocBtn = e.target.closest('[data-delete-land-doc-idx]');
      if (deleteDocBtn) {
        e.preventDefault();
        const idx = parseInt(deleteDocBtn.getAttribute('data-delete-land-doc-idx'));
        const docName = c.landDocs[idx].name;
        if (confirm(`Are you sure you want to delete deed document "${docName}" from archive locker?`)) {
          c.landDocs.splice(idx, 1);
          addAuditLog(`Deleted document "${docName}" from customer "${c.name}" locker`, 'Customers CRM');
          showToast('Land document deleted.');
          renderDetailTabsPanels();
        }
        return;
      }

      // Delete Staff Comment Note
      const deleteNoteBtn = e.target.closest('[data-delete-note-idx]');
      if (deleteNoteBtn) {
        e.preventDefault();
        const idx = parseInt(deleteNoteBtn.getAttribute('data-delete-note-idx'));
        if (confirm('Permanently remove this note from staff timeline logs?')) {
          c.notes.splice(idx, 1);
          addAuditLog(`Deleted note index ${idx} for customer "${c.name}"`, 'Customers CRM');
          showToast('Staff note deleted.');
          renderDetailTabsPanels();
        }
        return;
      }

      // Copy simulated reset token link to clipboard
      if (e.target.closest('#copy-reset-token-btn')) {
        e.preventDefault();
        const copyVal = document.querySelector('#reset-token-input-readonly').value;
        navigator.clipboard.writeText(copyVal).then(() => {
          const copyBtn = document.querySelector('#copy-reset-token-btn');
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
          }, 1500);
        });
        return;
      }

      // Property table redirect views
      const propRedirect = e.target.closest('[data-prop-redirect]');
      if (propRedirect) {
        e.preventDefault();
        const pId = parseInt(propRedirect.getAttribute('data-prop-redirect'));
        
        // Find if it is in plots or orders
        const isPlot = (state.admin.plots || []).some(pl => pl.id === pId);
        if (isPlot) {
          state.admin.activeTab = 'properties-mapping';
          initAdminTab('properties-mapping');
        } else {
          state.admin.selectedPropertyId = pId;
          initAdminTab('properties-detail');
        }
      }
    });

    // Run initial subpanels render
    renderDetailTabsPanels();
  }

  // --- Global Navigation Triggers ---
  root.addEventListener('click', (e) => {
    // Add customer button
    if (e.target.closest('#add-customer-btn')) {
      e.preventDefault();
      state.admin.customerViewMode = 'create';
      state.admin.selectedCustomerId = null;
      initAdminTab('customers');
      return;
    }

    // Back to customer list
    if (e.target.closest('#detail-back-btn') || e.target.closest('#back-to-customers-btn') || e.target.closest('#cancel-cust-form-btn')) {
      e.preventDefault();
      state.admin.customerViewMode = 'list';
      state.admin.selectedCustomerId = null;
      initAdminTab('customers');
      return;
    }

    // View customer profile links
    const viewCust = e.target.closest('[data-view-cust-id]');
    if (viewCust) {
      e.preventDefault();
      const id = parseInt(viewCust.getAttribute('data-view-cust-id'));
      state.admin.selectedCustomerId = id;
      state.admin.customerViewMode = 'details';
      state.admin.activeCustDetailTab = 'info';
      initAdminTab('customers');
      return;
    }

    // Edit customer links
    const editCust = e.target.closest('[data-edit-cust-id]') || e.target.closest('#cust-details-modify-btn');
    if (editCust) {
      e.preventDefault();
      const id = editCust.id === 'cust-details-modify-btn' ? state.admin.selectedCustomerId : parseInt(editCust.getAttribute('data-edit-cust-id'));
      state.admin.selectedCustomerId = id;
      state.admin.customerViewMode = 'edit';
      initAdminTab('customers');
      return;
    }

    // Delete customer links
    const deleteCust = e.target.closest('[data-delete-cust-id]');
    if (deleteCust) {
      e.preventDefault();
      const id = parseInt(deleteCust.getAttribute('data-delete-cust-id'));
      const idx = customers.findIndex(item => item.id === id);
      if (idx !== -1) {
        if (confirm(`Are you sure you want to permanently delete customer "${customers[idx].name}" and all their associated files?`)) {
          const name = customers[idx].name;
          customers.splice(idx, 1);
          addAuditLog(`Deleted customer profile "${name}"`, 'Customers CRM');
          showToast(`Deleted customer profile "${name}".`);
          initAdminTab('customers');
          renderApp();
        }
      }
    }
  });
}
