import staffTemplates from '../html/staff.html?raw';

function getSection(name) {
  const startMarker = `data-section="${name}"`;
  const startIdx = staffTemplates.indexOf(startMarker);
  if (startIdx === -1) return '';
  const divStart = staffTemplates.lastIndexOf('<div', startIdx);
  const endMarker = `END SECTION: ${name}`;
  const endCommentIdx = staffTemplates.indexOf(endMarker, startIdx);
  if (endCommentIdx === -1) return '';
  const closingDiv = staffTemplates.lastIndexOf('</div>', endCommentIdx);
  if (closingDiv === -1) return '';
  return staffTemplates.slice(divStart, closingDiv + 6);
}

function ensureStaffState(state) {
  if (!state.admin.staffAccounts) {
    state.admin.staffAccounts = [
      { id: 1, name: 'Amina Bello', email: 'amina@blueskye.com', role: 'Super Admin', status: 'Active', dateAdded: '2026-07-01' },
      { id: 2, name: 'Aliyu Bello', email: 'aliyu@blueskye.com', role: 'Site Manager', status: 'Active', dateAdded: '2026-07-02' },
      { id: 3, name: 'Chidi Okafor', email: 'chidi@blueskye.com', role: 'Finance/Accounts', status: 'Active', dateAdded: '2026-07-04' }
    ];
  }

  const modules = [
    'Properties & Projects',
    'Customer Database',
    'Sales & Invoicing',
    'Payments',
    'Affiliate Management',
    'Commission & Withdrawals',
    'Site Inspections',
    'Reports & Analytics',
    'User & Role Management',
    'System Settings'
  ];

  if (!state.admin.roleColumns) {
    state.admin.roleColumns = ['Super Admin', 'Sales Manager', 'Marketing Manager', 'Site Manager', 'Finance/Accounts'];
  }

  if (!state.admin.permissionsMatrix) {
    // Fill exact presets values from specifications
    const defaults = {
      'Properties & Projects': { 'Super Admin': 'Full Access', 'Sales Manager': 'View Only', 'Marketing Manager': 'View Only', 'Site Manager': 'Full Access', 'Finance/Accounts': 'View Only' },
      'Customer Database': { 'Super Admin': 'Full Access', 'Sales Manager': 'Full Access', 'Marketing Manager': 'View Only', 'Site Manager': 'View Only', 'Finance/Accounts': 'View Only' },
      'Sales & Invoicing': { 'Super Admin': 'Full Access', 'Sales Manager': 'Full Access', 'Marketing Manager': 'No Access', 'Site Manager': 'No Access', 'Finance/Accounts': 'Full Access' },
      'Payments': { 'Super Admin': 'Full Access', 'Sales Manager': 'View Only', 'Marketing Manager': 'No Access', 'Site Manager': 'No Access', 'Finance/Accounts': 'Full Access' },
      'Affiliate Management': { 'Super Admin': 'Full Access', 'Sales Manager': 'View Only', 'Marketing Manager': 'Full Access', 'Site Manager': 'No Access', 'Finance/Accounts': 'View Only' },
      'Commission & Withdrawals': { 'Super Admin': 'Full Access', 'Sales Manager': 'No Access', 'Marketing Manager': 'No Access', 'Site Manager': 'No Access', 'Finance/Accounts': 'Full Access' },
      'Site Inspections': { 'Super Admin': 'Full Access', 'Sales Manager': 'View Only', 'Marketing Manager': 'No Access', 'Site Manager': 'Full Access', 'Finance/Accounts': 'No Access' },
      'Reports & Analytics': { 'Super Admin': 'Full Access', 'Sales Manager': 'Partial', 'Marketing Manager': 'Partial', 'Site Manager': 'Partial', 'Finance/Accounts': 'Partial' },
      'User & Role Management': { 'Super Admin': 'Full Access', 'Sales Manager': 'No Access', 'Marketing Manager': 'No Access', 'Site Manager': 'No Access', 'Finance/Accounts': 'No Access' },
      'System Settings': { 'Super Admin': 'Full Access', 'Sales Manager': 'No Access', 'Marketing Manager': 'No Access', 'Site Manager': 'No Access', 'Finance/Accounts': 'No Access' }
    };

    // Ensure all combinations are mapped
    const matrix = {};
    modules.forEach(m => {
      matrix[m] = {};
      state.admin.roleColumns.forEach(r => {
        matrix[m][r] = (defaults[m] && defaults[m][r]) ? defaults[m][r] : 'No Access';
      });
    });
    state.admin.permissionsMatrix = matrix;
  }
}

// 1. MASTER ROUTERS
export function renderStaffAccountsTab(state) {
  ensureStaffState(state);
  return getSection('staff-accounts-template');
}

export function renderAccessPermissionsTab(state) {
  ensureStaffState(state);
  return getSection('access-permissions-template');
}

// --- Bind Staff Events Listeners ---
export function bindStaffTabListeners(state, root, addAuditLog, initAdminTab, renderApp) {
  ensureStaffState(state);
  const staff = state.admin.staffAccounts || [];
  const activeTab = state.admin.activeTab;

  // 1. STAFF ACCOUNTS DIRECTORY
  if (activeTab === 'staff-accounts') {
    const searchInp = document.querySelector('#staff-search-input');
    const roleFilter = document.querySelector('#filter-staff-role');
    const tbody = document.querySelector('#staff-accounts-table-body');

    function renderTableRows() {
      const q = (searchInp?.value || '').toLowerCase().trim();
      const rv = roleFilter?.value || 'all';

      const filtered = staff.filter(s => {
        const matchesQuery = !q || [s.name, s.email].join(' ').toLowerCase().includes(q);
        const matchesRole = rv === 'all' || s.role === rv;
        return matchesQuery && matchesRole;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-xs text-slate-400 italic">No staff operators found.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(s => {
        const badgeClass = s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' : 'badge-base badge-danger';
        const actionBtn = s.status === 'Active' 
          ? `<button data-suspend-staff="${s.id}" class="text-rose-600 hover:underline font-bold text-xs">Suspend</button>` 
          : `<button data-activate-staff="${s.id}" class="text-emerald-600 hover:underline font-bold text-xs">Activate</button>`;

        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
            <td class="p-3 text-slate-900 dark:text-white font-bold">${s.name}</td>
            <td class="p-3 font-mono text-slate-500 text-xs">${s.email}</td>
            <td class="p-3 text-blue-650 dark:text-blue-400 text-xs">${s.role}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeClass}">${s.status}</span></td>
            <td class="p-3 font-mono text-slate-400 text-xs">${s.dateAdded}</td>
            <td class="p-3 text-right">${actionBtn}</td>
          </tr>
        `;
      }).join('');
    }

    if (searchInp) searchInp.addEventListener('input', renderTableRows);
    if (roleFilter) roleFilter.addEventListener('change', renderTableRows);

    document.querySelector('#clear-staff-filters-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInp) searchInp.value = '';
      if (roleFilter) roleFilter.value = 'all';
      renderTableRows();
    });

    // Modal triggers
    const modal = document.querySelector('#add-staff-modal');
    
    document.querySelector('#btn-add-staff-trigger')?.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Auto-generate temp password
      const pwInput = document.querySelector('#staff-form-password');
      if (pwInput) pwInput.value = `SKY-INV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      
      modal?.classList.remove('hidden');
    });

    document.querySelector('#close-staff-modal-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      modal?.classList.add('hidden');
    });

    // Form submit invite staff
    const addStaffForm = document.querySelector('#add-staff-form');
    if (addStaffForm) {
      addStaffForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('#staff-form-name').value.trim();
        const email = document.querySelector('#staff-form-email').value.trim();
        const role = document.querySelector('#staff-form-role').value;
        const pw = document.querySelector('#staff-form-password').value;

        if (!name || !email || !role || !pw) return;

        const newStaff = {
          id: staff.length + 1,
          name,
          email,
          role,
          status: 'Active',
          dateAdded: new Date().toISOString().substring(0, 10)
        };

        staff.push(newStaff);
        addAuditLog(`Sent temporary credentials invite to staff operator ${name} as role ${role}`, 'Staff Accounts');
        
        alert(`System invite email dispatched successfully to ${email}.\nTemporary password: ${pw}`);
        modal?.classList.add('hidden');
        addStaffForm.reset();
        
        renderTableRows();
      });
    }

    // Bind suspend/activate row actions
    root.addEventListener('click', (e) => {
      const suspendBtn = e.target.closest('[data-suspend-staff]');
      if (suspendBtn) {
        e.preventDefault();
        const id = parseInt(suspendBtn.getAttribute('data-suspend-staff'));
        const s = staff.find(x => x.id === id);
        if (s) {
          s.status = 'Suspended';
          addAuditLog(`Suspended active portal console credentials of staff operator ${s.name}`, 'Staff Accounts');
          renderTableRows();
        }
        return;
      }

      const activateBtn = e.target.closest('[data-activate-staff]');
      if (activateBtn) {
        e.preventDefault();
        const id = parseInt(activateBtn.getAttribute('data-activate-staff'));
        const s = staff.find(x => x.id === id);
        if (s) {
          s.status = 'Active';
          addAuditLog(`Re-activated access console permissions for staff operator ${s.name}`, 'Staff Accounts');
          renderTableRows();
        }
      }
    });

    renderTableRows();
  }

  // 2. ACCESS PERMISSIONS MATRIX GRID
  if (activeTab === 'staff-permissions') {
    const roles = state.admin.roleColumns || [];
    const matrix = state.admin.permissionsMatrix || {};

    const headerRow = document.querySelector('#perm-grid-header-row');
    const tbody = document.querySelector('#perm-grid-tbody');

    function renderMatrixGrid() {
      if (!headerRow || !tbody) return;

      // 1. Column headers
      headerRow.innerHTML = `<th class="p-3 w-56">Feature Module</th>` + 
        roles.map(r => `<th class="p-3 text-center">${r}</th>`).join('');

      // 2. Row cells
      const modules = Object.keys(matrix);
      tbody.innerHTML = modules.map(m => {
        const cellsHtml = roles.map(r => {
          const val = matrix[m][r] || 'No Access';
          
          // Disable edit dropdown for Super Admin (always Full Access)
          const isDisabled = r === 'Super Admin' ? 'disabled' : '';

          return `
            <td class="p-3 text-center">
              <select data-matrix-mod="${m}" data-matrix-role="${r}" ${isDisabled} class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-1.5 mx-auto w-32 text-center text-slate-800 font-bold border-slate-200/50">
                <option value="Full Access" ${val === 'Full Access' ? 'selected' : ''}>Full Access</option>
                <option value="View Only" ${val === 'View Only' ? 'selected' : ''}>View Only</option>
                <option value="Partial" ${val === 'Partial' ? 'selected' : ''}>Partial</option>
                <option value="No Access" ${val === 'No Access' ? 'selected' : ''}>No Access</option>
              </select>
            </td>
          `;
        }).join('');

        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
            <td class="p-3 text-slate-900 dark:text-white font-bold">${m}</td>
            ${cellsHtml}
          </tr>
        `;
      }).join('');
    }

    // Save Access Grid changes button
    document.querySelector('#save-permissions-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      
      const selects = document.querySelectorAll('select[data-matrix-mod]');
      selects.forEach(sel => {
        const m = sel.getAttribute('data-matrix-mod');
        const r = sel.getAttribute('data-matrix-role');
        const val = sel.value;
        if (matrix[m]) matrix[m][r] = val;
      });

      addAuditLog(`Saved global roles permissions matrix grid overrides`, 'Access Matrix');
      alert('Access permissions matrix saved successfully.');
      initAdminTab('staff-permissions');
      renderApp();
    });

    // Add Custom Role button click trigger
    document.querySelector('#btn-add-custom-role')?.addEventListener('click', (e) => {
      e.preventDefault();
      const roleName = prompt('Enter the name of the custom staff role to add:');
      if (!roleName) return;

      const trimmedName = roleName.trim();
      if (roles.includes(trimmedName)) {
        alert('This role name already exists in the matrix.');
        return;
      }

      roles.push(trimmedName);
      
      // Initialize matrix column with No Access for all modules
      const modules = Object.keys(matrix);
      modules.forEach(m => {
        matrix[m][trimmedName] = 'No Access';
      });

      addAuditLog(`Added custom staff role class "${trimmedName}" to the permissions grid`, 'Access Matrix');
      alert(`Role "${trimmedName}" added. Set its module privileges in the column below.`);
      
      initAdminTab('staff-permissions');
    });

    renderMatrixGrid();
  }
}
