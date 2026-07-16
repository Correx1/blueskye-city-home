import settingsTemplates from '../html/settings.html?raw';

function getSection(name) {
  const startMarker = `data-section="${name}"`;
  const startIdx = settingsTemplates.indexOf(startMarker);
  if (startIdx === -1) return '';
  const divStart = settingsTemplates.lastIndexOf('<div', startIdx);
  const endMarker = `END SECTION: ${name}`;
  const endCommentIdx = settingsTemplates.indexOf(endMarker, startIdx);
  if (endCommentIdx === -1) return '';
  const closingDiv = settingsTemplates.lastIndexOf('</div>', endCommentIdx);
  if (closingDiv === -1) return '';
  return settingsTemplates.slice(divStart, closingDiv + 6);
}

export function ensureSettingsState(state) {
  if (!state.admin.settings) state.admin.settings = {};
  const s = state.admin.settings;

  // Company identity info
  if (!s.companyName) s.companyName = 'BlueSky City Homes Ltd';
  if (!s.companyEmail) s.companyEmail = 'info@blueskyecity.com';
  if (!s.companyPhone) s.companyPhone = '+234 812 345 6789';
  if (!s.companyAddress) s.companyAddress = 'Plot 15, Admiralty Way, Lekki Phase 1, Lagos';
  if (!s.companyLogo) s.companyLogo = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=150&q=80';
  if (!s.companyFavicon) s.companyFavicon = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=32&q=80';
  if (!s.companyFooter) s.companyFooter = '© 2026 BlueSky City Homes Ltd. All rights reserved.';
  
  if (s.defaultGen1Rate === undefined) s.defaultGen1Rate = 10;
  if (s.defaultGen2Rate === undefined) s.defaultGen2Rate = 5;
  if (s.allowDownlineSales === undefined) s.allowDownlineSales = true;
  if (s.defaultInstallments === undefined) s.defaultInstallments = 12;
  if (s.defaultDownpayment === undefined) s.defaultDownpayment = 20;

  // Split Rules default ratios
  if (s.splitInvestment === undefined) s.splitInvestment = 20;
  if (s.splitPayments === undefined) s.splitPayments = 50;
  if (s.splitOperations === undefined) s.splitOperations = 30;


  // Blog content
  if (!s.blogDefaultStatus) s.blogDefaultStatus = 'Draft';
  if (s.blogCommentsEnabled === undefined) s.blogCommentsEnabled = false;

  // Newsletter
  if (!s.newsFromName) s.newsFromName = 'BlueSky Campaigns Hub';
  if (!s.newsFromEmail) s.newsFromEmail = 'broadcast@blueskyecity.com';
  if (!s.newsUnsubFooter) s.newsUnsubFooter = 'You are receiving this because you signed up on our public portal. To opt out, click Unsubscribe.';

  // Helpdesk support
  if (!s.helpdeskDefaultPriority) s.helpdeskDefaultPriority = 'Medium';
  if (!s.helpdeskAutoAssignment) s.helpdeskAutoAssignment = 'Round robin';

  // Notifications toggles
  if (s.notifSale === undefined) s.notifSale = true;
  if (s.notifKyc === undefined) s.notifKyc = true;
  if (s.notifPay === undefined) s.notifPay = true;
  if (s.notifWithdraw === undefined) s.notifWithdraw = true;
  if (s.notifInspect === undefined) s.notifInspect = true;
  if (s.notifTicket === undefined) s.notifTicket = true;
  if (s.notifCamp === undefined) s.notifCamp = true;

  // Dynamic modules list array
  if (!state.admin.modulesList) {
    state.admin.modulesList = [
      'Properties & Projects',
      'Customer Database',
      'Sales & Invoicing',
      'Payments',
      'Affiliate Management',
      'Commission & Withdrawals',
      'Site Inspections',
      'Content & Blog',
      'Newsletter',
      'Support/Helpdesk',
      'Reports & Analytics',
      'Settings'
    ];
  }

  // Dynamic roles directory list array
  if (!state.admin.rolesList) {
    state.admin.rolesList = [
      { id: 1, name: 'Super Admin', desc: 'Full administration access privileges.' },
      { id: 2, name: 'Sales Manager', desc: 'Manage deals catalog, invoicing, and buyers.' },
      { id: 3, name: 'Marketing Manager', desc: 'Handle affiliate partners network registrations.' },
      { id: 4, name: 'Site Manager', desc: 'Book inspection slots tours and confirm schedules.' },
      { id: 5, name: 'Finance/Accounts', desc: 'Verify payments receipt slips and manage escrow.' }
    ];
  }

  // Corporate bank accounts list array
  if (!state.admin.corporateBanks) {
    state.admin.corporateBanks = [
      { id: 1, name: 'BlueSky Customer Payments', bank: 'Zenith Bank PLC', number: '1019928374', label: 'Customer Payments' },
      { id: 2, name: 'BlueSky Savings & Investment', bank: 'Stanbic IBTC Bank', number: '0018892348', label: 'Investment' },
      { id: 3, name: 'BlueSky Operations Expenses', bank: 'Kuda/Moniepoint', number: '5012398457', label: 'Operations' }
    ];
  }

  // Staff members database accounts
  if (!state.admin.staffMembers) {
    state.admin.staffMembers = [
      { id: 1, name: 'Amina Bello', email: 'amina@blueskyecity.com', role: 'Super Admin', status: 'Active', date: '2026-07-01' },
      { id: 2, name: 'Aliyu Bello', email: 'aliyu@blueskyecity.com', role: 'Sales Manager', status: 'Active', date: '2026-07-02' },
      { id: 3, name: 'Chidi Okafor', email: 'chidi@blueskyecity.com', role: 'Marketing Manager', status: 'Active', date: '2026-07-03' },
      { id: 4, name: 'Adekunle Johnson', email: 'adekunle@blueskyecity.com', role: 'Site Manager', status: 'Active', date: '2026-07-04' },
      { id: 5, name: 'Florence Nduka', email: 'florence@blueskyecity.com', role: 'Finance/Accounts', status: 'Active', date: '2026-07-05' }
    ];
  }

  // dynamic roles modules permission settings matrix
  if (!state.admin.rolePermissions) {
    state.admin.rolePermissions = {
      'Super Admin': {
        'Properties & Projects': 'Full Access',
        'Customer Database': 'Full Access',
        'Sales & Invoicing': 'Full Access',
        'Payments': 'Full Access',
        'Affiliate Management': 'Full Access',
        'Commission & Withdrawals': 'Full Access',
        'Site Inspections': 'Full Access',
        'Content & Blog': 'Full Access',
        'Newsletter': 'Full Access',
        'Support/Helpdesk': 'Full Access',
        'Reports & Analytics': 'Full Access',
        'Settings': 'Full Access'
      },
      'Sales Manager': {
        'Properties & Projects': 'View Only',
        'Customer Database': 'Full Access',
        'Sales & Invoicing': 'Full Access',
        'Payments': 'View Only',
        'Affiliate Management': 'View Only',
        'Commission & Withdrawals': 'No Access',
        'Site Inspections': 'View Only',
        'Content & Blog': 'No Access',
        'Newsletter': 'No Access',
        'Support/Helpdesk': 'No Access',
        'Reports & Analytics': 'Partial',
        'Settings': 'No Access'
      },
      'Marketing Manager': {
        'Properties & Projects': 'View Only',
        'Customer Database': 'View Only',
        'Sales & Invoicing': 'No Access',
        'Payments': 'No Access',
        'Affiliate Management': 'Full Access',
        'Commission & Withdrawals': 'No Access',
        'Site Inspections': 'No Access',
        'Content & Blog': 'No Access',
        'Newsletter': 'No Access',
        'Support/Helpdesk': 'No Access',
        'Reports & Analytics': 'Partial',
        'Settings': 'No Access'
      },
      'Site Manager': {
        'Properties & Projects': 'Full Access',
        'Customer Database': 'View Only',
        'Sales & Invoicing': 'No Access',
        'Payments': 'No Access',
        'Affiliate Management': 'No Access',
        'Commission & Withdrawals': 'No Access',
        'Site Inspections': 'Full Access',
        'Content & Blog': 'No Access',
        'Newsletter': 'No Access',
        'Support/Helpdesk': 'No Access',
        'Reports & Analytics': 'Partial',
        'Settings': 'No Access'
      },
      'Finance/Accounts': {
        'Properties & Projects': 'View Only',
        'Customer Database': 'View Only',
        'Sales & Invoicing': 'Full Access',
        'Payments': 'Full Access',
        'Affiliate Management': 'View Only',
        'Commission & Withdrawals': 'Full Access',
        'Site Inspections': 'No Access',
        'Content & Blog': 'No Access',
        'Newsletter': 'No Access',
        'Support/Helpdesk': 'No Access',
        'Reports & Analytics': 'Partial',
        'Settings': 'No Access'
      }
    };
  }

  // Active settings tabs
  if (!state.admin.settingsActiveTab) state.admin.settingsActiveTab = 'company';
  if (!state.admin.settingsActiveRoleId) state.admin.settingsActiveRoleId = 1;
}

// 1. MASTER ROUTERS
export function renderSettingsHubTab(state) {
  ensureSettingsState(state);
  return getSection('settings-hub-template');
}

// --- Bind Settings Events Listeners ---
export function bindSettingsHubListeners(state, root, addAuditLog, initAdminTab, renderApp) {
  ensureSettingsState(state);

  const globalTab = state.admin.activeTab;
  if (globalTab === 'settings-audit') state.admin.settingsActiveTab = 'audit';
  else if (globalTab === 'settings-bank') state.admin.settingsActiveTab = 'payments';
  else if (globalTab === 'staff-accounts') state.admin.settingsActiveTab = 'staff';
  else if (globalTab === 'staff-permissions') state.admin.settingsActiveTab = 'permissions';

  const activeTab = state.admin.settingsActiveTab;
  const s = state.admin.settings;

  // Adjust Viewport Visibility
  const viewports = {
    company: document.querySelector('#viewport-set-company'),
    staff: document.querySelector('#viewport-set-staff'),
    permissions: document.querySelector('#viewport-set-permissions'),
    payments: document.querySelector('#viewport-set-payments'),
    notifications: document.querySelector('#viewport-set-notifications'),
    content: document.querySelector('#viewport-set-content'),
    audit: document.querySelector('#viewport-set-audit')
  };

  Object.keys(viewports).forEach(k => {
    if (viewports[k]) {
      if (k === activeTab) viewports[k].classList.remove('hidden');
      else viewports[k].classList.add('hidden');
    }
  });

  // Render left rail button active highlight class styles
  document.querySelectorAll('.settings-rail-btn').forEach(btn => {
    const tabName = btn.getAttribute('data-settings-hub-tab');
    if (tabName === activeTab) {
      btn.className = "settings-rail-btn w-full py-2.5 px-3 bg-blue-50 dark:bg-slate-850/50 rounded-lg text-left text-blue-600 dark:text-blue-400 font-bold border-l-4 border-blue-600 flex items-center gap-2 active:scale-98 transition-all";
    } else {
      btn.className = "settings-rail-btn w-full py-2.5 px-3 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-lg text-left text-slate-450 hover:text-slate-655 flex items-center gap-2 active:scale-98 transition-all";
    }
  });

  // Rail click routers
  root.addEventListener('click', (e) => {
    const railBtn = e.target.closest('[data-settings-hub-tab]');
    if (railBtn) {
      e.preventDefault();
      state.admin.settingsActiveTab = railBtn.getAttribute('data-settings-hub-tab');
      initAdminTab('settings-hub');
    }
  });

  // --- TAB 1: COMPANY INFO ---
  if (activeTab === 'company') {
    const form = document.querySelector('#form-set-company');
    if (form) {
      document.querySelector('#set-co-name').value = s.companyName;
      document.querySelector('#set-co-email').value = s.companyEmail;
      document.querySelector('#set-co-phone').value = s.companyPhone;
      document.querySelector('#set-co-address').value = s.companyAddress;
      document.querySelector('#set-co-logo-url').value = s.companyLogo;
      document.querySelector('#set-co-fav-url').value = s.companyFavicon;
      document.querySelector('#set-co-fb').value = s.facebookUrl || '';
      document.querySelector('#set-co-tw').value = s.twitterUrl || '';
      document.querySelector('#set-co-li').value = s.linkedinUrl || '';
      document.querySelector('#set-co-footer').value = s.companyFooter;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        s.companyName = document.querySelector('#set-co-name').value.trim();
        s.companyEmail = document.querySelector('#set-co-email').value.trim();
        s.companyPhone = document.querySelector('#set-co-phone').value.trim();
        s.companyAddress = document.querySelector('#set-co-address').value.trim();
        s.companyLogo = document.querySelector('#set-co-logo-url').value.trim();
        s.companyFavicon = document.querySelector('#set-co-fav-url').value.trim();
        s.facebookUrl = document.querySelector('#set-co-fb').value.trim();
        s.twitterUrl = document.querySelector('#set-co-tw').value.trim();
        s.linkedinUrl = document.querySelector('#set-co-li').value.trim();
        s.companyFooter = document.querySelector('#set-co-footer').value.trim();

        addAuditLog('Updated corporate identity branding profiles settings', 'System Settings');
        alert('Branding identity settings saved successfully.');
        initAdminTab('settings-hub');
        renderApp();
      });
    }
  }

  // --- TAB 2: STAFF & USERS ---
  if (activeTab === 'staff') {
    const tbody = document.querySelector('#set-staff-tbody');
    const staff = state.admin.staffMembers;

    function renderStaffTable() {
      if (!tbody) return;

      tbody.innerHTML = staff.map(x => `
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-body font-semibold">
          <td class="p-3 text-slate-900 dark:text-white font-extrabold">${x.name}</td>
          <td class="p-3 font-mono text-slate-500 dark:text-slate-400">${x.email}</td>
          <td class="p-3">
            <button data-link-to-role="${x.role}" class="bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded text-caption font-extrabold hover:underline transition-all">
              ${x.role}
            </button>
          </td>
          <td class="p-3"><span class="px-2 py-0.5 rounded text-caption font-bold uppercase tracking-wider ${x.status === 'Active' ? 'badge-base badge-success' : 'badge-base badge-danger'}">${x.status}</span></td>
          <td class="p-3 font-mono text-slate-400">${x.date}</td>
          <td class="p-3 text-right space-x-1">
            <button data-edit-staff-id="${x.id}" class="text-indigo-650 hover:underline">Edit</button>
            <button data-toggle-staff-id="${x.id}" class="text-amber-600 hover:underline">${x.status === 'Active' ? 'Suspend' : 'Activate'}</button>
            <button data-reset-pass-staff-id="${x.id}" class="text-slate-400 hover:text-slate-600 hover:underline">Reset Pass</button>
            <button data-delete-staff-id="${x.id}" class="text-rose-600 hover:underline">Delete</button>
          </td>
        </tr>
      `).join('');
    }

    // Modal Trigger Invite Staff
    const staffModal = document.querySelector('#set-staff-form-modal');
    const staffForm = document.querySelector('#set-staff-composer-form');
    const modalTitle = document.querySelector('#staff-modal-title');
    let activeStaffId = null;

    document.querySelector('#btn-set-add-staff')?.addEventListener('click', (e) => {
      e.preventDefault();
      activeStaffId = null;
      modalTitle.textContent = 'Add Staff Member';
      staffForm.reset();
      
      // Populate dynamic role options select
      const roleSel = document.querySelector('#staff-form-role');
      if (roleSel) {
        roleSel.innerHTML = state.admin.rolesList.map(r => `<option value="${r.name}">${r.name}</option>`).join('');
      }

      // Pre-fill temp password
      document.querySelector('#staff-form-pass').value = Math.random().toString(36).substring(2, 10).toUpperCase();
      staffModal?.classList.remove('hidden');
    });

    document.querySelector('#close-set-staff-modal-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      staffModal?.classList.add('hidden');
    });

    // Submit save Staff
    if (staffForm) {
      staffForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('#staff-form-name').value.trim();
        const email = document.querySelector('#staff-form-email').value.trim();
        const role = document.querySelector('#staff-form-role').value;
        const status = document.querySelector('#staff-form-status').value;

        if (activeStaffId === null) {
          const newStaff = {
            id: staff.length > 0 ? Math.max(...staff.map(x => x.id)) + 1 : 1,
            name,
            email,
            role,
            status,
            date: new Date().toISOString().substring(0, 10)
          };
          staff.push(newStaff);
          addAuditLog(`Registered new staff operator: "${name}" (${role})`, 'Staff Management');
          alert('Staff member registered successfully.');
        } else {
          const s = staff.find(x => x.id === activeStaffId);
          if (s) {
            s.name = name;
            s.email = email;
            s.role = role;
            s.status = status;
            addAuditLog(`Updated details for staff operator: "${name}"`, 'Staff Management');
            alert('Staff member details updated.');
          }
        }

        staffModal?.classList.add('hidden');
        renderStaffTable();
        renderApp();
      });
    }

    // Row Actions edit/suspend/delete
    root.addEventListener('click', (e) => {
      // Link to role matrix
      const linkRoleBtn = e.target.closest('[data-link-to-role]');
      if (linkRoleBtn) {
        e.preventDefault();
        const roleName = linkRoleBtn.getAttribute('data-link-to-role');
        const role = state.admin.rolesList.find(r => r.name === roleName);
        if (role) {
          state.admin.settingsActiveTab = 'permissions';
          state.admin.settingsActiveRoleId = role.id;
          initAdminTab('settings-hub');
        }
        return;
      }

      // Edit
      const editBtn = e.target.closest('[data-edit-staff-id]');
      if (editBtn) {
        e.preventDefault();
        const id = parseInt(editBtn.getAttribute('data-edit-staff-id'));
        const s = staff.find(x => x.id === id);
        if (s) {
          activeStaffId = id;
          modalTitle.textContent = 'Edit Staff Member';
          staffModal?.classList.remove('hidden');

          document.querySelector('#staff-form-name').value = s.name;
          document.querySelector('#staff-form-email').value = s.email;
          
          const roleSel = document.querySelector('#staff-form-role');
          if (roleSel) {
            roleSel.innerHTML = state.admin.rolesList.map(r => `<option value="${r.name}">${r.name}</option>`).join('');
            roleSel.value = s.role;
          }

          document.querySelector('#staff-form-status').value = s.status;
          document.querySelector('#staff-form-pass').value = '********'; // Masked
        }
        return;
      }

      // Suspend / Reactivate Toggle
      const toggleBtn = e.target.closest('[data-toggle-staff-id]');
      if (toggleBtn) {
        e.preventDefault();
        const id = parseInt(toggleBtn.getAttribute('data-toggle-staff-id'));
        const s = staff.find(x => x.id === id);
        if (s) {
          s.status = s.status === 'Active' ? 'Suspended' : 'Active';
          addAuditLog(`Toggled active status of staff operator "${s.name}" to ${s.status}`, 'Staff Management');
          renderStaffTable();
        }
        return;
      }

      // Reset password
      const resetBtn = e.target.closest('[data-reset-pass-staff-id]');
      if (resetBtn) {
        e.preventDefault();
        const id = parseInt(resetBtn.getAttribute('data-reset-pass-staff-id'));
        const s = staff.find(x => x.id === id);
        if (s) {
          const newPass = Math.random().toString(36).substring(2, 10).toUpperCase();
          addAuditLog(`Triggered administrative password reset for staff: "${s.name}"`, 'Staff Management');
          alert(`Temporary password code reset for ${s.name}: ${newPass}`);
        }
        return;
      }

      // Delete staff
      const delBtn = e.target.closest('[data-delete-staff-id]');
      if (delBtn) {
        e.preventDefault();
        const id = parseInt(delBtn.getAttribute('data-delete-staff-id'));
        const idx = staff.findIndex(x => x.id === id);
        if (idx !== -1 && confirm('Are you sure you want to delete this staff member?')) {
          const removed = staff.splice(idx, 1)[0];
          addAuditLog(`Deleted staff account operator: "${removed.name}"`, 'Staff Management');
          renderStaffTable();
        }
      }
    });

    renderStaffTable();
  }

  // --- TAB 3: ROLES & ACCESS MATRIX ---
  if (activeTab === 'permissions') {
    const rolesListContainer = document.querySelector('#set-roles-list-container');
    const matrixPlaceholder = document.querySelector('#permissions-pane-placeholder');
    const matrixViewport = document.querySelector('#permissions-pane-viewport');
    const roles = state.admin.rolesList;
    const modules = state.admin.modulesList;

    function renderRolesIndex() {
      if (!rolesListContainer) return;

      rolesListContainer.innerHTML = roles.map(r => {
        const isSelected = r.id === state.admin.settingsActiveRoleId;
        const selectClass = isSelected ? 'bg-indigo-50/50 dark:bg-slate-850/40 border-l-4 border-indigo-600' : 'hover:bg-slate-50 dark:hover:bg-slate-850/10';
        // Compute count dynamically from staff array
        const staffCount = state.admin.staffMembers.filter(s => s.role === r.name).length;

        return `
          <div data-role-id="${r.id}" class="p-4.5 cursor-pointer border-b border-slate-100 dark:border-slate-850 transition-all ${selectClass}">
            <div class="flex items-center justify-between">
              <span class="font-extrabold text-slate-900 dark:text-white text-body">${r.name}</span>
              <span class="text-caption text-slate-400 font-bold">${staffCount} Members</span>
            </div>
            <p class="text-caption text-slate-400 font-normal mt-1">${r.desc}</p>
            <div class="flex justify-end gap-3 mt-2.5">
              <button data-delete-role-id="${r.id}" class="text-rose-650 text-caption hover:underline font-bold">Delete</button>
            </div>
          </div>
        `;
      }).join('');
    }

    function renderPermissionMatrixGrid() {
      const activeRoleId = state.admin.settingsActiveRoleId;
      const r = roles.find(x => x.id === activeRoleId);
      if (!r) {
        matrixPlaceholder?.classList.remove('hidden');
        matrixViewport?.classList.add('hidden');
        return;
      }

      matrixPlaceholder?.classList.add('hidden');
      matrixViewport?.classList.remove('hidden');

      document.querySelector('#perm-role-name').textContent = r.name;
      document.querySelector('#perm-role-desc').textContent = r.desc;

      // Populate matrices rows
      const tbody = document.querySelector('#perm-matrix-tbody');
      if (tbody) {
        const perms = state.admin.rolePermissions[r.name] || {};

        tbody.innerHTML = modules.map(m => {
          const currentLevel = perms[m] || 'No Access';
          return `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-body font-semibold">
              <td class="p-3 font-bold text-slate-900 dark:text-white">${m}</td>
              <td class="p-3 text-right w-44">
                <select data-perm-module="${m}" class="input-base text-caption bg-slate-50 dark:bg-slate-955 py-1 w-full text-slate-700 dark:text-slate-300 font-semibold">
                  <option value="Full Access" ${currentLevel === 'Full Access' ? 'selected' : ''}>Full Access</option>
                  <option value="Partial" ${currentLevel === 'Partial' ? 'selected' : ''}>Partial</option>
                  <option value="View Only" ${currentLevel === 'View Only' ? 'selected' : ''}>View Only</option>
                  <option value="No Access" ${currentLevel === 'No Access' ? 'selected' : ''}>No Access</option>
                </select>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Role row click select
    root.addEventListener('click', (e) => {
      const row = e.target.closest('[data-role-id]');
      if (row) {
        e.preventDefault();
        const id = parseInt(row.getAttribute('data-role-id'));
        state.admin.settingsActiveRoleId = id;
        renderRolesIndex();
        renderPermissionMatrixGrid();
      }
    });

    // Save Matrix
    document.querySelector('#btn-perm-save-matrix')?.addEventListener('click', (e) => {
      e.preventDefault();
      const r = roles.find(x => x.id === state.admin.settingsActiveRoleId);
      if (!r) return;

      // Initialize dictionary
      if (!state.admin.rolePermissions[r.name]) state.admin.rolePermissions[r.name] = {};
      const dict = state.admin.rolePermissions[r.name];

      // Read selects
      document.querySelectorAll('[data-perm-module]').forEach(sel => {
        const m = sel.getAttribute('data-perm-module');
        dict[m] = sel.value;
      });

      addAuditLog(`Updated module permissions configuration settings matrix for role: "${r.name}"`, 'Settings Matrix');
      alert(`Permissions configuration settings for "${r.name}" saved successfully.`);
      renderPermissionMatrixGrid();
      renderApp();
    });

    // Add New Role
    const roleModal = document.querySelector('#set-role-form-modal');
    const roleForm = document.querySelector('#set-role-composer-form');

    document.querySelector('#btn-set-add-role')?.addEventListener('click', (e) => {
      e.preventDefault();
      roleForm.reset();
      roleModal?.classList.remove('hidden');
    });

    document.querySelector('#close-set-role-modal-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      roleModal?.classList.add('hidden');
    });

    if (roleForm) {
      roleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('#role-form-name').value.trim();
        const desc = document.querySelector('#role-form-desc').value.trim();

        if (roles.some(x => x.name.toLowerCase() === name.toLowerCase())) {
          alert('A role with this name already exists.');
          return;
        }

        const newRole = {
          id: roles.length > 0 ? Math.max(...roles.map(x => x.id)) + 1 : 1,
          name,
          desc
        };
        roles.push(newRole);

        // Pre-fill permissions dictionary
        state.admin.rolePermissions[name] = {};
        modules.forEach(m => {
          state.admin.rolePermissions[name][m] = 'No Access';
        });

        addAuditLog(`Created custom system operator role: "${name}"`, 'Settings Matrix');
        alert('Custom role created. Select it to configure its permission matrix details.');
        
        roleModal?.classList.add('hidden');
        renderRolesIndex();
      });
    }

    // Delete custom role
    root.addEventListener('click', (e) => {
      const delBtn = e.target.closest('[data-delete-role-id]');
      if (delBtn) {
        e.preventDefault();
        const id = parseInt(delBtn.getAttribute('data-delete-role-id'));
        const idx = roles.findIndex(x => x.id === id);
        if (idx !== -1) {
          const r = roles[idx];
          // Restrict super admin deletes
          if (r.name === 'Super Admin') {
            alert('Cannot delete the root default Super Admin role.');
            return;
          }
          if (confirm(`Are you sure you want to delete the role "${r.name}"?`)) {
            roles.splice(idx, 1);
            delete state.admin.rolePermissions[r.name];
            addAuditLog(`Deleted custom role: "${r.name}"`, 'Settings Matrix');
            state.admin.settingsActiveRoleId = 1;
            renderRolesIndex();
            renderPermissionMatrixGrid();
          }
        }
      }
    });

    renderRolesIndex();
    renderPermissionMatrixGrid();
  }

  // --- TAB 4: COMMISSION & PAYMENTS ---
  if (activeTab === 'payments') {
    const form = document.querySelector('#form-set-payments');
    const tbody = document.querySelector('#set-banks-tbody');
    const banks = state.admin.corporateBanks;

    function renderBanks() {
      if (!tbody) return;
      tbody.innerHTML = banks.map(b => `        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-body font-semibold">
          <td class="p-2.5"><span class="px-2 py-0.5 rounded text-caption font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">${b.label}</span></td>
          <td class="p-2.5 text-slate-900 dark:text-white font-extrabold">${b.name}</td>
          <td class="p-2.5 font-normal">${b.bank}</td>
          <td class="p-2.5 font-mono text-slate-500 dark:text-slate-400">${b.number}</td>
          <td class="p-2.5 text-right"><button data-delete-set-bank="${b.id}" class="text-rose-600 hover:underline font-bold text-caption uppercase">Remove</button></td>
        </tr>
      `).join('');
    }

    if (form) {
      document.querySelector('#set-pay-gen1').value = s.defaultGen1Rate;
      document.querySelector('#set-pay-gen2').value = s.defaultGen2Rate;
      document.querySelector('#set-pay-downline-visible').checked = s.allowDownlineSales;
      document.querySelector('#set-pay-inst-months').value = s.defaultInstallments;
      document.querySelector('#set-pay-inst-down').value = s.defaultDownpayment;

      // Prefill Auto-Routing Ratios
      const inputInvest = document.querySelector('#set-split-investment');
      const inputPay = document.querySelector('#set-split-payments');
      const inputOp = document.querySelector('#set-split-operations');
      const warningBanner = document.querySelector('#split-warning-banner');
      const successBanner = document.querySelector('#split-success-banner');
      const saveBtn = document.querySelector('#btn-save-payments-settings');

      if (inputInvest) inputInvest.value = s.splitInvestment || 20;
      if (inputPay) inputPay.value = s.splitPayments || 50;
      if (inputOp) inputOp.value = s.splitOperations || 30;

      function checkRatiosValidation() {
        const inv = parseInt(inputInvest?.value || 20);
        const pay = parseInt(inputPay?.value || 0);
        const op = parseInt(inputOp?.value || 0);
        const sum = inv + pay + op;

        if (sum !== 100) {
          if (warningBanner) {
            warningBanner.classList.remove('hidden');
            const totalSpan = warningBanner.querySelector('#split-current-total');
            if (totalSpan) totalSpan.textContent = sum + '%';
          }
          successBanner?.classList.add('hidden');
          if (saveBtn) saveBtn.disabled = true;
        } else {
          warningBanner?.classList.add('hidden');
          successBanner?.classList.remove('hidden');
          if (saveBtn) saveBtn.disabled = false;
        }
      }

      inputPay?.addEventListener('input', checkRatiosValidation);
      inputOp?.addEventListener('input', checkRatiosValidation);
      checkRatiosValidation(); // Initial triggers check

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const pay = parseInt(inputPay?.value || 0);
        const op = parseInt(inputOp?.value || 0);
        if (20 + pay + op !== 100) {
          alert('Error: The total auto-routing split percentage ratios must sum up to exactly 100% before saving.');
          return;
        }

        s.defaultGen1Rate = parseInt(document.querySelector('#set-pay-gen1').value);
        s.defaultGen2Rate = parseInt(document.querySelector('#set-pay-gen2').value);
        s.allowDownlineSales = document.querySelector('#set-pay-downline-visible').checked;
        s.defaultInstallments = parseInt(document.querySelector('#set-pay-inst-months').value);
        s.defaultDownpayment = parseInt(document.querySelector('#set-pay-inst-down').value);

        s.splitPayments = pay;
        s.splitOperations = op;

        addAuditLog('Updated commission plan, downline overrides, installment parameters, and holding account splitting ratios', 'System Settings');
        alert('Finance and payments settings saved successfully.');
        initAdminTab('settings-hub');
      });
    }

    // Toggle add bank form
    const addBankForm = document.querySelector('#sec-set-add-bank-form');
    document.querySelector('#btn-set-add-bank')?.addEventListener('click', (e) => {
      e.preventDefault();
      addBankForm.classList.remove('hidden');
    });
    document.querySelector('#btn-set-bank-cancel')?.addEventListener('click', (e) => {
      e.preventDefault();
      addBankForm.classList.add('hidden');
    });

    document.querySelector('#btn-set-bank-save')?.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.querySelector('#set-bank-name').value.trim();
      const bank = document.querySelector('#set-bank-institution').value.trim();
      const number = document.querySelector('#set-bank-number').value.trim();
      const label = document.querySelector('#set-bank-label').value;

      if (!name || !bank || !number) return;

      const newB = {
        id: banks.length + 1,
        name,
        bank,
        number,
        label
      };
      banks.push(newB);
      addAuditLog(`Added corporate bank account: "${name}" (${bank})`, 'System Settings');
      alert('Bank account added.');
      
      addBankForm.classList.add('hidden');
      document.querySelector('#set-bank-name').value = '';
      document.querySelector('#set-bank-institution').value = '';
      document.querySelector('#set-bank-number').value = '';
      renderBanks();
      renderApp();
    });

    // Delete Bank Account
    root.addEventListener('click', (e) => {
      const delBtn = e.target.closest('[data-delete-set-bank]');
      if (delBtn) {
        e.preventDefault();
        const id = parseInt(delBtn.getAttribute('data-delete-set-bank'));
        const idx = banks.findIndex(b => b.id === id);
        if (idx !== -1) {
          const removed = banks.splice(idx, 1)[0];
          addAuditLog(`Removed bank account details for ${removed.name}`, 'System Settings');
          renderBanks();
          renderApp();
        }
      }
    });

    renderBanks();
  }

  // --- TAB 5: NOTIFICATIONS CONFIG ---
  if (activeTab === 'notifications') {
    const form = document.querySelector('#form-set-notifications');
    if (form) {
      document.querySelector('#set-notif-nsale').checked = s.notifSale;
      document.querySelector('#set-notif-nkyc').checked = s.notifKyc;
      document.querySelector('#set-notif-npay').checked = s.notifPay;
      document.querySelector('#set-notif-nwithdraw').checked = s.notifWithdraw;
      document.querySelector('#set-notif-ninspect').checked = s.notifInspect;
      document.querySelector('#set-notif-nticket').checked = s.notifTicket;
      document.querySelector('#set-notif-ncamp').checked = s.notifCamp;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        s.notifSale = document.querySelector('#set-notif-nsale').checked;
        s.notifKyc = document.querySelector('#set-notif-nkyc').checked;
        s.notifPay = document.querySelector('#set-notif-npay').checked;
        s.notifWithdraw = document.querySelector('#set-notif-nwithdraw').checked;
        s.notifInspect = document.querySelector('#set-notif-ninspect').checked;
        s.notifTicket = document.querySelector('#set-notif-nticket').checked;
        s.notifCamp = document.querySelector('#set-notif-ncamp').checked;

        addAuditLog('Updated admin notifications events subscription triggers', 'System Settings');
        alert('Notification configurations saved successfully.');
        initAdminTab('settings-hub');
      });
    }
  }

  // --- TAB 6: CONTENT & SUPPORT SETTINGS ---
  if (activeTab === 'content') {
    const form = document.querySelector('#form-set-content');
    if (form) {
      document.querySelector('#set-blog-status').value = s.blogDefaultStatus;
      document.querySelector('#set-blog-comments').checked = s.blogCommentsEnabled;
      document.querySelector('#set-news-name').value = s.newsFromName;
      document.querySelector('#set-news-email').value = s.newsFromEmail;
      document.querySelector('#set-news-footer').value = s.newsUnsubFooter;
      document.querySelector('#set-tkt-priority').value = s.helpdeskDefaultPriority;
      document.querySelector('#set-tkt-routing').value = s.helpdeskAutoAssignment;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        s.blogDefaultStatus = document.querySelector('#set-blog-status').value;
        s.blogCommentsEnabled = document.querySelector('#set-blog-comments').checked;
        s.newsFromName = document.querySelector('#set-news-name').value.trim();
        s.newsFromEmail = document.querySelector('#set-news-email').value.trim();
        s.newsUnsubFooter = document.querySelector('#set-news-footer').value.trim();
        s.helpdeskDefaultPriority = document.querySelector('#set-tkt-priority').value;
        s.helpdeskAutoAssignment = document.querySelector('#set-tkt-routing').value;

        addAuditLog('Updated editorial cms blog, support tickets routing, and campaigns send defaults', 'System Settings');
        alert('Editorial and helpdesk defaults saved.');
        initAdminTab('settings-hub');
      });
    }
  }

  // --- TAB 7: ACTIVITY AUDIT LOGS ---
  if (activeTab === 'audit') {
    const searchInp = document.querySelector('#set-audit-search');
    const actionFilter = document.querySelector('#filter-audit-action');
    const moduleFilter = document.querySelector('#filter-audit-module');
    const dateFrom = document.querySelector('#filter-audit-date-from');
    const dateTo = document.querySelector('#filter-audit-date-to');
    const tbody = document.querySelector('#set-audit-tbody');

    const logs = state.admin.auditLogs || [];

    // Populate module filters list dynamically from modules state
    if (moduleFilter) {
      moduleFilter.innerHTML = `<option value="all">System Module</option>` +
        state.admin.modulesList.map(m => `<option value="${m}">${m}</option>`).join('');
    }

    function renderAuditLogsTable() {
      if (!tbody) return;

      const q = (searchInp?.value || '').toLowerCase().trim();
      const av = actionFilter?.value || 'all';
      const mv = moduleFilter?.value || 'all';
      const df = dateFrom?.value || '';
      const dt = dateTo?.value || '';

      const filtered = logs.filter(l => {
        const matchesQuery = !q || l.staff.toLowerCase().includes(q) || l.action.toLowerCase().includes(q);
        
        let matchesAction = true;
        if (av !== 'all') {
          matchesAction = l.action.toLowerCase().includes(av.toLowerCase());
        }

        const matchesModule = mv === 'all' || l.component === mv;
        
        const logDate = l.time.substring(0, 10);
        const matchesDate = (!df || logDate >= df) && (!dt || logDate <= dt);

        return matchesQuery && matchesAction && matchesModule && matchesDate;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-body text-slate-400 italic">No activity logs matched search criteria.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(l => {
        let typeBadge = 'bg-slate-100 text-slate-655';
        if (l.action.includes('Created') || l.action.includes('Add')) typeBadge = 'badge-base badge-success';
        else if (l.action.includes('Updated') || l.action.includes('Modified') || l.action.includes('Replied')) typeBadge = 'badge-base badge-info';
        else if (l.action.includes('Deleted') || l.action.includes('Removed') || l.action.includes('Suspended')) typeBadge = 'bg-rose-500/10 text-rose-655';
        else if (l.action.includes('Approved') || l.action.includes('Resolved')) typeBadge = 'bg-emerald-600/15 text-emerald-750';
        else if (l.action.includes('Rejected') || l.action.includes('Closed')) typeBadge = 'bg-amber-500/10 text-amber-600';
        else if (l.action.includes('Confirmed')) typeBadge = 'bg-indigo-500/10 text-indigo-650';

        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-body font-semibold">
            <td class="p-3 text-slate-900 dark:text-white font-extrabold">${l.staff}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded text-caption font-bold uppercase tracking-wider ${typeBadge}">${l.component}</span></td>
            <td class="p-3 text-slate-550 dark:text-slate-400 font-normal">${l.component}</td>
            <td class="p-3 text-slate-655 dark:text-slate-350 font-normal leading-relaxed max-w-sm truncate">${l.action}</td>
            <td class="p-3 font-mono text-slate-400">${l.time}</td>
          </tr>
        `;
      }).join('');
    }

    if (searchInp) searchInp.addEventListener('input', renderAuditLogsTable);
    if (actionFilter) actionFilter.addEventListener('change', renderAuditLogsTable);
    if (moduleFilter) moduleFilter.addEventListener('change', renderAuditLogsTable);
    if (dateFrom) dateFrom.addEventListener('change', renderAuditLogsTable);
    if (dateTo) dateTo.addEventListener('change', renderAuditLogsTable);

    renderAuditLogsTable();
  }
}
