import propertyTemplates from '../html/property.html?raw';

function getTemplateHtml(id) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(propertyTemplates, 'text/html');
  const temp = doc.querySelector(`#${id}`);
  return temp ? temp.innerHTML : '';
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

// Global click-away handler to hide status quick menus
document.addEventListener('click', (e) => {
  if (!e.target.closest('.status-menu-container')) {
    document.querySelectorAll('.status-dropdown-menu').forEach(menu => menu.classList.add('hidden'));
  }
});

// 1. Render Properties List View
export function renderPropertiesListTab(properties) {
  let html = getTemplateHtml('properties-list-template');
  return html;
}

// 2. Render Add/Edit Property Form
export function renderAddEditPropertyTab(state, properties, projects) {
  const editId = state.admin.editingPropertyId;
  const p = editId ? properties.find(item => item.id === editId) : null;
  const isEditing = !!p;

  let html = getTemplateHtml('properties-add-edit-template');

  // Fill projects options
  const projectOptionsHtml = `<option value="None">None (Independent Development)</option>` + projects.map(pr => `
    <option value="${pr.title}" ${isEditing && p.project === pr.title ? 'selected' : ''}>${pr.title}</option>
  `).join('');
  
  html = html.replace('<!-- DYNAMIC PROJECT OPTIONS -->', projectOptionsHtml);
  html = html.replace('Create Property Catalog Entry', isEditing ? 'Modify Property Catalog Entry' : 'Create Property Catalog Entry');
  html = html.replace('Publish Property Listing', isEditing ? 'Save Changes' : 'Publish Property Listing');

  return html;
}

// 3. Render Property Detail View
export function renderPropertyDetailTab(state, properties, projects) {
  let html = getTemplateHtml('property-detail-template');
  return html;
}

// 4. Render Land Plot Mapping
export function renderLandPlotMappingTab(state, properties, projects) {
  if (!state.admin.plots) {
    state.admin.plots = [
      { id: 'PK-101', project: 'Lekki Heights Residence', area: '650 Sqm', status: 'Allocated', client: 'Chukwu Raphael', coordinates: '6.4281° N, 3.4219° E', price: 12000000, physicalStage: 'Fully Handed Over', provisionalLetterName: 'provisional_pk101.pdf', provisionalLetterUrl: '#', surveyDeedName: 'deed_assignment_pk101.pdf', surveyDeedUrl: '#', surveyPlanName: 'plan_pk101.pdf', surveyPlanUrl: '#', paymentMode: 'Outright' },
      { id: 'PK-102', project: 'Lekki Heights Residence', area: '650 Sqm', status: 'Available', client: 'None', coordinates: '6.4283° N, 3.4222° E', price: 12000000, physicalStage: 'Beacons Placed', provisionalLetterName: '', provisionalLetterUrl: '', surveyDeedName: '', surveyDeedUrl: '', surveyPlanName: '', surveyPlanUrl: '', paymentMode: 'Outright' },
      { id: 'AB-201', project: 'Abuja Diplomatic Estates', area: '1000 Sqm', status: 'Escrow Pending', client: 'Jane Doe', coordinates: '9.0765° N, 7.3985° E', price: 25000000, physicalStage: 'Beacons Placed', provisionalLetterName: 'provisional_ab201.pdf', provisionalLetterUrl: '#', surveyDeedName: '', surveyDeedUrl: '', surveyPlanName: '', surveyPlanUrl: '', paymentMode: 'Installmental' },
      { id: 'AB-202', project: 'Abuja Diplomatic Estates', area: '1000 Sqm', status: 'Allocated', client: 'Amina Yusuf', coordinates: '9.0768° N, 7.3990° E', price: 25000000, physicalStage: 'Fully Handed Over', provisionalLetterName: 'provisional_ab202.pdf', provisionalLetterUrl: '#', surveyDeedName: 'deed_assignment_ab202.pdf', surveyDeedUrl: '#', surveyPlanName: 'plan_ab202.pdf', surveyPlanUrl: '#', paymentMode: 'Outright' }
    ];
  }
  const plots = state.admin.plots;
  let html = getTemplateHtml('land-plot-mapping-template');

  const projectsFilterHtml = `<option value="all">All Projects</option>` + projects.map(p => `
    <option value="${p.title}">${p.title}</option>
  `).join('');
  html = html.replace('<!-- DYNAMIC PROJECTS -->', projectsFilterHtml);

  const tbodyHtml = plots.map(pl => {
    const priceFormatted = fmtNGN(pl.price);
    let statusClass = 'bg-green-500/10 text-green-600 dark:text-green-400';
    if (pl.status === 'Allocated') statusClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    else if (pl.status === 'Reserved') statusClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    else if (pl.status === 'Escrow Pending') statusClass = 'bg-purple-500/10 text-purple-600 dark:text-purple-400';

    let physicalClass = 'text-slate-455';
    if (pl.physicalStage === 'Fully Handed Over') physicalClass = 'text-green-600 dark:text-green-400 font-bold';
    else if (pl.physicalStage === 'Inspected') physicalClass = 'text-blue-500 font-semibold';
    else if (pl.physicalStage === 'Beacons Placed') physicalClass = 'text-amber-500 font-semibold';

    const provName = pl.provisionalLetterName || '';
    const provUrl = pl.provisionalLetterUrl || '#';
    const deedName = pl.surveyDeedName || '';
    const deedUrl = pl.surveyDeedUrl || '#';
    const planName = pl.surveyPlanName || '';
    const planUrl = pl.surveyPlanUrl || '#';

    return `
      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
        <td class="p-4">
          <span class="block font-bold text-slate-900 dark:text-white text-xs">${pl.id}</span>
          <span class="block text-[9px] text-slate-400 font-mono mt-0.5">${pl.coordinates}</span>
        </td>
        <td class="p-4">
          <span class="block text-slate-700 dark:text-slate-355 font-semibold">${pl.project}</span>
        </td>
        <td class="p-4">
          <span class="block font-bold text-slate-800 dark:text-slate-200">${pl.area}</span>
          <span class="block text-[10px] text-slate-450 font-semibold mt-0.5">${priceFormatted} (${pl.paymentMode || 'Outright'})</span>
        </td>
        <td class="p-4">
          <span class="block font-bold text-[#1d4ed8] dark:text-[#60a5fa]">${pl.client || 'None'}</span>
        </td>
        <td class="p-4">
          <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${statusClass}">${pl.status}</span>
          <span class="block text-[9px] mt-1.5 ${physicalClass}"><i class="bx bx-check-shield text-[10px]"></i> ${pl.physicalStage || 'No Action'}</span>
        </td>
        <td class="p-4">
          <div class="flex flex-col gap-1 text-[10px]">
            ${provName ? `
              <a href="${provUrl}" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold">
                <i class="bx bx-file text-[11px]"></i> <span>Provisional Letter</span>
              </a>
            ` : ''}
            ${deedName ? `
              <a href="${deedUrl}" target="_blank" class="text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1 font-bold">
                <i class="bx bx-certification text-[11px]"></i> <span>Deed of Assignment</span>
              </a>
            ` : ''}
            ${planName ? `
              <a href="${planUrl}" target="_blank" class="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-bold">
                <i class="bx bx-map text-[11px]"></i> <span>Survey Plan</span>
              </a>
            ` : ''}
            ${(!provName && !deedName && !planName) ? `
              <span class="text-slate-400 italic">No deeds loaded</span>
            ` : ''}
          </div>
        </td>
        <td class="p-4 text-right space-x-2">
          <button data-plot-edit-id="${pl.id}" class="text-blue-550 hover:text-blue-755 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Edit Plot"><i class="bx bx-edit text-sm"></i></button>
          <button data-plot-delete-id="${pl.id}" class="text-rose-500 hover:text-rose-755 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Delete Plot"><i class="bx bx-trash text-sm"></i></button>
        </td>
      </tr>
    `;
  }).join('');

  html = html.replace('<!-- DYNAMIC PLOTS ROWS -->', tbodyHtml);
  return html;
}

// 5. Render Add/Edit Plot Allocation Form
export function renderAddEditPlotAllocationTab(state, properties, projects) {
  const plots = state.admin.plots || [];
  const customers = state.admin.kycQueue || [];
  const editingPlotId = state.admin.editingPlotId;
  const editingPlot = editingPlotId ? plots.find(p => p.id === editingPlotId) : null;
  const isEditing = !!editingPlot;

  let html = getTemplateHtml('plot-allocation-form-template');

  html = html.replace('Register New Land Plot Allocation', isEditing ? 'Modify Plot Allocation Detail' : 'Register New Land Plot Allocation');
  html = html.replace('Confirm Allocation Register', isEditing ? 'Save Allocation Changes' : 'Confirm Allocation Register');
  
  const projectOptionsHtml = projects.map(p => `
    <option value="${p.title}" ${isEditing && editingPlot.project === p.title ? 'selected' : ''}>${p.title}</option>
  `).join('');
  html = html.replace('<!-- DYNAMIC PROJECT OPTIONS -->', projectOptionsHtml);

  const customerOptionsHtml = `<option value="None">None (Unassigned Plot)</option>` + customers.map(c => `
    <option value="${c.name}" ${isEditing && editingPlot.client === c.name ? 'selected' : ''}>${c.name} (${c.status === 'Approved' ? 'Verified' : 'Pending'})</option>
  `).join('');
  html = html.replace('<!-- DYNAMIC CUSTOMER OPTIONS -->', customerOptionsHtml);

  return html;
}

// --- Bind List Tab Listeners ---
export function bindPropertiesListTabListeners(state, root, initAdminTab, properties, addAuditLog) {
  const searchInput = document.querySelector('#admin-search-properties');
  const cityFilter = document.querySelector('#filter-property-city');
  const projectFilter = document.querySelector('#filter-property-project');
  const statusFilter = document.querySelector('#filter-property-status');
  const sortSelect = document.querySelector('#sort-property');
  const priceMinInput = document.querySelector('#filter-price-min');
  const priceMaxInput = document.querySelector('#filter-price-max');
  const sizeMinInput = document.querySelector('#filter-size-min');
  const sizeMaxInput = document.querySelector('#filter-size-max');

  // Load project options in filter dropdown
  const projectSelect = document.querySelector('#filter-property-project');
  if (projectSelect) {
    const projectsList = Array.from(new Set(properties.map(p => p.project).filter(Boolean)));
    projectSelect.innerHTML = `<option value="all">All Projects</option>` + projectsList.map(proj => `
      <option value="${proj}">${proj}</option>
    `).join('');
  }

  function getFilteredProperties() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const cityVal = cityFilter ? cityFilter.value : 'all';
    const projVal = projectFilter ? projectFilter.value : 'all';
    const statVal = statusFilter ? statusFilter.value : 'all';
    const sortVal = sortSelect ? sortSelect.value : 'default';

    const priceMin = priceMinInput && priceMinInput.value ? parseFloat(priceMinInput.value) * 1000000 : null;
    const priceMax = priceMaxInput && priceMaxInput.value ? parseFloat(priceMaxInput.value) * 1000000 : null;
    const sizeMin = sizeMinInput && sizeMinInput.value ? parseFloat(sizeMinInput.value) : null;
    const sizeMax = sizeMaxInput && sizeMaxInput.value ? parseFloat(sizeMaxInput.value) : null;

    let filtered = properties.filter(p => {
      const matchesQuery = p.title.toLowerCase().includes(query) || (p.location && p.location.toLowerCase().includes(query));
      const matchesCity = cityVal === 'all' || p.city === cityVal;
      const matchesProj = projVal === 'all' || p.project === projVal;
      const matchesStatus = statVal === 'all' || p.status === statVal;

      const matchesPriceMin = priceMin === null || p.price >= priceMin;
      const matchesPriceMax = priceMax === null || p.price <= priceMax;

      const sizeNum = p.size ? parseInt(p.size) : 0;
      const matchesSizeMin = sizeMin === null || sizeNum >= sizeMin;
      const matchesSizeMax = sizeMax === null || sizeNum <= sizeMax;

      return matchesQuery && matchesCity && matchesProj && matchesStatus && matchesPriceMin && matchesPriceMax && matchesSizeMin && matchesSizeMax;
    });

    if (sortVal === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'title-asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }

  function renderTableRows() {
    const list = getFilteredProperties();
    const tbody = document.querySelector('#admin-properties-table-body');
    const emptyState = document.querySelector('#properties-empty-state');
    const tableWrapper = document.querySelector('#properties-table-wrapper');

    if (!tbody) return;

    if (list.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (tableWrapper) tableWrapper.classList.add('hidden');
      const hasActiveFilters = (searchInput && searchInput.value) || 
                               (cityFilter && cityFilter.value !== 'all') || 
                               (projectFilter && projectFilter.value !== 'all') || 
                               (statusFilter && statusFilter.value !== 'all') ||
                               (priceMinInput && priceMinInput.value) ||
                               (priceMaxInput && priceMaxInput.value) ||
                               (sizeMinInput && sizeMinInput.value) ||
                               (sizeMaxInput && sizeMaxInput.value);

      const actionBtn = document.querySelector('#empty-state-action');
      const stateText = document.querySelector('#empty-state-text');
      if (actionBtn && stateText) {
        if (hasActiveFilters) {
          stateText.textContent = 'No properties matched your search filters.';
          actionBtn.textContent = 'Clear Filters';
          actionBtn.onclick = clearAllFilters;
        } else {
          stateText.textContent = 'Your properties catalog is currently empty.';
          actionBtn.textContent = 'Add your first property';
          actionBtn.onclick = () => initAdminTab('properties-add');
        }
      }
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (tableWrapper) tableWrapper.classList.remove('hidden');

    tbody.innerHTML = list.map(p => {
      let statusClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      if (p.status === 'Available') {
        statusClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450';
      } else if (p.status === 'Reserved') {
        statusClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      } else if (p.status === 'Sold') {
        statusClass = 'bg-rose-500/10 text-rose-600 dark:text-rose-455';
      }

      const dateStr = p.dateAdded || '2026-07-01';

      return `
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-sm">
          <td class="p-4">
            <span class="block font-semibold text-slate-900 dark:text-white">${p.title}</span>
            <span class="block text-xs text-slate-450 mt-0.5">${p.location || p.city}</span>
          </td>
          <td class="p-4 text-slate-650 dark:text-slate-350">${p.project && p.project !== 'None' ? p.project : '<span class="text-slate-400 italic">Unassigned</span>'}</td>
          <td class="p-4 font-semibold text-slate-800 dark:text-slate-300 text-xs">${p.city}</td>
          <td class="p-4 font-mono text-slate-700 dark:text-slate-300 text-xs">${p.size || '450 Sqm'}</td>
          <td class="p-4 font-bold text-slate-800 dark:text-slate-200 text-xs">${fmtNGN(p.price)}</td>
          <td class="p-4">
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${statusClass}">${p.status}</span>
          </td>
          <td class="p-4 font-mono text-slate-450 text-xs">${dateStr}</td>
          <td class="p-4 text-right">
            <div class="flex items-center justify-end gap-2 text-base">
              <button data-view-id="${p.id}" class="text-blue-500 hover:text-blue-700 p-1" title="View Detail"><i class="bx bx-show"></i></button>
              <button data-edit-id="${p.id}" class="text-emerald-500 hover:text-emerald-700 p-1" title="Edit"><i class="bx bx-edit"></i></button>
              
              <!-- Quick Status Menu dropdown -->
              <div class="relative inline-block text-left status-menu-container">
                <button class="status-menu-trigger text-slate-450 hover:text-slate-600 dark:hover:text-slate-200 p-1" title="Quick Status">
                  <i class="bx bx-check-shield"></i>
                </button>
                <div class="status-dropdown-menu hidden absolute right-0 mt-1 w-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-md z-40 text-xs py-1 text-left text-slate-700 dark:text-slate-350">
                  <button data-change-status="Available" data-prop-id="${p.id}" class="w-full px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 block text-left">Available</button>
                  <button data-change-status="Reserved" data-prop-id="${p.id}" class="w-full px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 block text-left">Reserved</button>
                  <button data-change-status="Sold" data-prop-id="${p.id}" class="w-full px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 block text-left">Sold</button>
                </div>
              </div>

              <button data-delete-id="${p.id}" class="text-rose-500 hover:text-rose-750 p-1" title="Delete"><i class="bx bx-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function clearAllFilters() {
    if (searchInput) searchInput.value = '';
    if (cityFilter) cityFilter.value = 'all';
    if (projectFilter) projectFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (sortSelect) sortSelect.value = 'default';
    if (priceMinInput) priceMinInput.value = '';
    if (priceMaxInput) priceMaxInput.value = '';
    if (sizeMinInput) sizeMinInput.value = '';
    if (sizeMaxInput) sizeMaxInput.value = '';
    renderTableRows();
    showToast('Filters cleared successfully.');
  }

  if (searchInput) searchInput.addEventListener('input', renderTableRows);
  if (cityFilter) cityFilter.addEventListener('change', renderTableRows);
  if (projectFilter) projectFilter.addEventListener('change', renderTableRows);
  if (statusFilter) statusFilter.addEventListener('change', renderTableRows);
  if (sortSelect) sortSelect.addEventListener('change', renderTableRows);
  if (priceMinInput) priceMinInput.addEventListener('input', renderTableRows);
  if (priceMaxInput) priceMaxInput.addEventListener('input', renderTableRows);
  if (sizeMinInput) sizeMinInput.addEventListener('input', renderTableRows);
  if (sizeMaxInput) sizeMaxInput.addEventListener('input', renderTableRows);

  const clearBtn = document.querySelector('#clear-filters-btn');
  if (clearBtn) clearBtn.addEventListener('click', (e) => { e.preventDefault(); clearAllFilters(); });

  // Handle actions click delegation
  root.addEventListener('click', (e) => {
    // Add Click
    if (e.target.closest('#add-property-modal-btn')) {
      e.preventDefault();
      state.admin.editingPropertyId = null;
      initAdminTab('properties-add');
      return;
    }

    // View Detail Click
    const viewBtn = e.target.closest('[data-view-id]');
    if (viewBtn) {
      e.preventDefault();
      const id = parseInt(viewBtn.getAttribute('data-view-id'));
      state.admin.selectedPropertyId = id;
      initAdminTab('properties-detail');
      return;
    }

    // Edit Click
    const editBtn = e.target.closest('[data-edit-id]');
    if (editBtn) {
      e.preventDefault();
      const id = parseInt(editBtn.getAttribute('data-edit-id'));
      state.admin.editingPropertyId = id;
      initAdminTab('properties-add');
      return;
    }

    // Delete Click
    const deleteBtn = e.target.closest('[data-delete-id]');
    if (deleteBtn) {
      e.preventDefault();
      const id = parseInt(deleteBtn.getAttribute('data-delete-id'));
      const idx = properties.findIndex(p => p.id === id);
      if (idx !== -1) {
        if (confirm(`Are you sure you want to permanently delete catalog listing "${properties[idx].title}"?`)) {
          const title = properties[idx].title;
          properties.splice(idx, 1);
          addAuditLog(`Permanently deleted catalog listing "${title}"`, 'Properties Catalog');
          showToast(`Deleted property "${title}".`);
          renderTableRows();
        }
      }
      return;
    }

    // Toggle Quick Status menu triggers
    const trigger = e.target.closest('.status-menu-trigger');
    if (trigger) {
      e.preventDefault();
      const menu = trigger.nextElementSibling;
      const isHidden = menu.classList.contains('hidden');
      document.querySelectorAll('.status-dropdown-menu').forEach(m => m.classList.add('hidden'));
      if (isHidden) {
        menu.classList.remove('hidden');
      }
      return;
    }

    // Quick Status change buttons
    const changeStatusBtn = e.target.closest('[data-change-status]');
    if (changeStatusBtn) {
      e.preventDefault();
      const newStatus = changeStatusBtn.getAttribute('data-change-status');
      const propId = parseInt(changeStatusBtn.getAttribute('data-prop-id'));
      const prop = properties.find(p => p.id === propId);
      if (prop) {
        prop.status = newStatus;
        addAuditLog(`Quick-changed status of "${prop.title}" to ${newStatus}`, 'Properties Catalog');
        showToast(`Property marked as ${newStatus} successfully.`);
        initAdminTab('properties-list');
      }
    }
  });

  renderTableRows();
}

// --- Bind Add/Edit Property Form Listeners ---
export function bindAddEditPropertyTabListeners(state, root, initAdminTab, properties, addAuditLog, renderApp) {
  const form = document.querySelector('#property-full-form');
  const editId = state.admin.editingPropertyId;
  const p = editId ? properties.find(item => item.id === editId) : null;
  const isEditing = !!p;

  // Set fields on edit load
  if (isEditing) {
    document.querySelector('#full-prop-id').value = p.id;
    document.querySelector('#full-prop-title').value = p.title;
    document.querySelector('#full-prop-project').value = p.project || 'None';
    document.querySelector('#full-prop-location').value = p.location || '';
    document.querySelector('#full-prop-status').value = p.status || 'Available';
    document.querySelector('#full-prop-price').value = p.price || '';
    document.querySelector('#full-prop-desc').value = p.description || '';
    document.querySelector('#full-prop-publish-toggle').checked = p.published !== false;

    // Split size back into numeric and unit values
    const sizeStr = p.size || '0 Sqm';
    const match = sizeStr.match(/^([\d.,]+)\s*(\w+)$/);
    if (match) {
      document.querySelector('#full-prop-size-num').value = match[1];
      document.querySelector('#full-prop-size-unit').value = match[2];
    } else {
      document.querySelector('#full-prop-size-num').value = sizeStr;
    }

    // Set payment plan check boxes
    const plans = p.paymentPlans || ['Outright'];
    document.querySelector('#plan-outright').checked = plans.includes('Outright');
    document.querySelector('#plan-3m').checked = plans.includes('3-Month');
    document.querySelector('#plan-6m').checked = plans.includes('6-Month');
    document.querySelector('#plan-12m').checked = plans.includes('12-Month');
  }

  // Pre-load temporary dynamic media and docs previews arrays
  const photosArray = isEditing && p.images ? [...p.images] : [];
  const docsArray = isEditing && p.documents ? [...p.documents] : [];

  const photosPreview = document.querySelector('#photos-preview-container');
  const docsPreview = document.querySelector('#docs-preview-container');

  function renderPhotosPreview() {
    if (!photosPreview) return;
    if (photosArray.length === 0) {
      photosPreview.innerHTML = '<span class="text-xs text-slate-400 italic">No image assets loaded.</span>';
      return;
    }
    photosPreview.innerHTML = photosArray.map((src, idx) => `
      <div class="relative group h-14 w-20 border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
        <img src="${src}" class="h-full w-full object-cover" />
        <button type="button" class="remove-photo absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity" data-idx="${idx}"><i class="bx bx-trash"></i></button>
      </div>
    `).join('');
  }

  function renderDocsPreview() {
    if (!docsPreview) return;
    if (docsArray.length === 0) {
      docsPreview.innerHTML = '<p class="text-xs text-slate-450 italic font-medium">No files attached yet.</p>';
      return;
    }
    docsPreview.innerHTML = docsArray.map((doc, idx) => `
      <div class="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800">
        <div class="flex flex-col text-xs truncate">
          <span class="font-bold text-slate-700 dark:text-slate-350 truncate"><i class="bx bx-paperclip text-slate-400"></i> ${doc.name}</span>
          <span class="text-[10px] text-slate-400 font-medium">${doc.type} (${doc.size})</span>
        </div>
        <button type="button" class="remove-doc text-rose-500 hover:text-rose-700" data-idx="${idx}"><i class="bx bx-x text-base"></i></button>
      </div>
    `).join('');
  }

  renderPhotosPreview();
  renderDocsPreview();

  // Photo uploads handler
  const photosInput = document.querySelector('#prop-photos-input');
  const triggerPhotos = document.querySelector('#trigger-photos-upload');
  if (triggerPhotos && photosInput) {
    triggerPhotos.addEventListener('click', () => photosInput.click());
    photosInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          photosArray.push(event.target.result);
          renderPhotosPreview();
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Documents attachments handler
  const docsInput = document.querySelector('#prop-docs-input');
  const triggerDocs = document.querySelector('#trigger-docs-upload');
  const docTypeSelect = document.querySelector('#doc-type-uploader-select');
  if (triggerDocs && docsInput) {
    triggerDocs.addEventListener('click', () => docsInput.click());
    docsInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const type = docTypeSelect ? docTypeSelect.value : 'Survey Plan';
        docsArray.push({
          type: type,
          name: file.name,
          date: new Date().toISOString().substring(0, 10),
          uploader: state.admin.staffName || 'Amina Bello',
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          url: event.target.result
        });
        renderDocsPreview();
      };
      reader.readAsDataURL(file);
    });
  }

  // Delete previews inside form container
  root.addEventListener('click', (e) => {
    const removePhotoBtn = e.target.closest('.remove-photo');
    if (removePhotoBtn) {
      e.preventDefault();
      const idx = parseInt(removePhotoBtn.getAttribute('data-idx'));
      photosArray.splice(idx, 1);
      renderPhotosPreview();
      return;
    }

    const removeDocBtn = e.target.closest('.remove-doc');
    if (removeDocBtn) {
      e.preventDefault();
      const idx = parseInt(removeDocBtn.getAttribute('data-idx'));
      docsArray.splice(idx, 1);
      renderDocsPreview();
      return;
    }

    const cancelFormBtn = e.target.closest('#cancel-property-btn') || e.target.closest('#cancel-property-form-btn');
    if (cancelFormBtn) {
      e.preventDefault();
      state.admin.editingPropertyId = null;
      initAdminTab('properties-list');
    }
  });

  // Submit form handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const editIdVal = document.querySelector('#full-prop-id').value;
      const title = document.querySelector('#full-prop-title').value.trim();
      const project = document.querySelector('#full-prop-project').value;
      const location = document.querySelector('#full-prop-location').value.trim();
      const sizeNum = document.querySelector('#full-prop-size-num').value.trim();
      const sizeUnit = document.querySelector('#full-prop-size-unit').value;
      const status = document.querySelector('#full-prop-status').value;
      const priceVal = document.querySelector('#full-prop-price').value.trim();
      const desc = document.querySelector('#full-prop-desc').value.trim();
      const published = document.querySelector('#full-prop-publish-toggle').checked;

      // Inline validation
      let isValid = true;
      document.querySelectorAll('[id^="err-prop-"]').forEach(el => el.classList.add('hidden'));

      if (!title) {
        document.querySelector('#err-prop-title').classList.remove('hidden');
        isValid = false;
      }
      if (!location) {
        document.querySelector('#err-prop-location').classList.remove('hidden');
        isValid = false;
      }
      if (!sizeNum) {
        document.querySelector('#err-prop-size').classList.remove('hidden');
        isValid = false;
      }
      if (!priceVal) {
        document.querySelector('#err-prop-price').classList.remove('hidden');
        isValid = false;
      }
      if (!desc) {
        document.querySelector('#err-prop-desc').classList.remove('hidden');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      const price = parseInt(priceVal) || 0;
      const size = `${sizeNum} ${sizeUnit}`;

      // Build payment plans array
      const paymentPlans = [];
      if (document.querySelector('#plan-outright').checked) paymentPlans.push('Outright');
      if (document.querySelector('#plan-3m').checked) paymentPlans.push('3-Month');
      if (document.querySelector('#plan-6m').checked) paymentPlans.push('6-Month');
      if (document.querySelector('#plan-12m').checked) paymentPlans.push('12-Month');

      if (editIdVal) {
        const prop = properties.find(item => item.id === parseInt(editIdVal));
        if (prop) {
          prop.title = title;
          prop.project = project;
          prop.location = location;
          prop.city = location.split(',').pop().trim();
          prop.size = size;
          prop.price = price;
          prop.status = status;
          prop.description = desc;
          prop.published = published;
          prop.paymentPlans = paymentPlans;
          prop.images = photosArray.length > 0 ? photosArray : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'];
          prop.documents = docsArray;

          addAuditLog(`Updated details for property "${title}"`, 'Properties Catalog');
          showToast(`Changes saved for "${title}" successfully.`);
        }
      } else {
        const newId = properties.length > 0 ? Math.max(...properties.map(item => item.id)) + 1 : 1;
        const newProperty = {
          id: newId,
          title: title,
          project: project,
          location: location,
          city: location.split(',').pop().trim(),
          size: size,
          price: price,
          status: status,
          description: desc,
          published: published,
          paymentPlans: paymentPlans,
          images: photosArray.length > 0 ? photosArray : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'],
          documents: docsArray,
          dateAdded: new Date().toISOString().substring(0, 10)
        };
        properties.unshift(newProperty);

        addAuditLog(`Published new property listing "${title}"`, 'Properties Catalog');
        showToast(`Listing "${title}" created successfully.`);
      }

      state.admin.editingPropertyId = null;
      initAdminTab('properties-list');
      renderApp();
    });
  }
}

// --- Bind Details Tab Listeners ---
export function bindPropertyDetailTabListeners(state, root, initAdminTab, properties, addAuditLog) {
  const targetId = state.admin.selectedPropertyId;
  const prop = targetId ? properties.find(p => p.id === targetId) : null;
  
  if (!prop) {
    root.innerHTML = `<div class="p-6 text-center text-slate-500">Error: Target property not found in database catalog.</div>`;
    return;
  }

  // Assign header data
  document.querySelector('#detail-prop-title').textContent = prop.title;
  const statusBadge = document.querySelector('#detail-prop-status-badge');
  if (statusBadge) {
    statusBadge.textContent = prop.status;
    statusBadge.className = 'px-2.5 py-0.5 rounded text-xs font-bold uppercase ';
    if (prop.status === 'Available') statusBadge.className += 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450';
    else if (prop.status === 'Reserved') statusBadge.className += 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    else if (prop.status === 'Sold') statusBadge.className += 'bg-rose-500/10 text-rose-600 dark:text-rose-455';
  }

  // Load read-only spec details
  document.querySelector('#detail-project').textContent = prop.project && prop.project !== 'None' ? prop.project : 'Independent Development';
  document.querySelector('#detail-location').textContent = prop.location || prop.city;
  document.querySelector('#detail-size').textContent = prop.size || '450 Sqm';
  document.querySelector('#detail-price').textContent = fmtNGN(prop.price);
  document.querySelector('#detail-publish-status').innerHTML = prop.published !== false 
    ? '<span class="text-emerald-500 font-semibold">Live on website</span>' 
    : '<span class="text-rose-500 font-semibold">Draft / Internal Only</span>';
  
  const plansContainer = document.querySelector('#detail-plans-list');
  if (plansContainer) {
    const plans = prop.paymentPlans || ['Outright'];
    plansContainer.innerHTML = plans.map(p => `
      <span class="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-350">${p}</span>
    `).join('');
  }

  document.querySelector('#detail-desc').textContent = prop.description || 'No description listed.';
  
  const gallery = document.querySelector('#detail-gallery-grid');
  if (gallery) {
    const images = prop.images || ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'];
    gallery.innerHTML = images.map(src => `
      <div class="h-28 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <a href="${src}" target="_blank"><img src="${src}" class="h-full w-full object-cover hover:scale-103 transition-transform duration-300" /></a>
      </div>
    `).join('');
  }

  // Load Assigned Customers & Sales (Tab 2)
  const salesTableBody = document.querySelector('#detail-sales-table-body');
  if (salesTableBody) {
    const sales = (state.admin.ordersLedger || []).filter(o => o.propertyTitle === prop.title);
    if (sales.length === 0) {
      salesTableBody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-sm text-slate-400 italic">No customer sales or reservations recorded for this property.</td></tr>`;
    } else {
      salesTableBody.innerHTML = sales.map(sale => `
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-sm font-semibold">
          <td class="p-3 text-blue-600 dark:text-blue-400 cursor-pointer" data-route-to="customers">${sale.clientName}</td>
          <td class="p-3 text-slate-500 font-normal">${sale.date}</td>
          <td class="p-3 font-mono">${fmtNGN(sale.price)}</td>
          <td class="p-3">
            <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/10 text-amber-500">${sale.status}</span>
          </td>
          <td class="p-3 text-right">
            <button data-route-to="sales-list" class="text-blue-600 dark:text-blue-400 hover:underline">View Sale Ledger <i class="bx bx-right-arrow-alt align-middle"></i></button>
          </td>
        </tr>
      `).join('');
    }
  }

  // Load Inspections booked (Tab 3)
  const inspectionsTableBody = document.querySelector('#detail-inspections-table-body');
  if (inspectionsTableBody) {
    const inspections = (state.admin.inspectionsList || []).filter(i => i.propertyTitle === prop.title);
    if (inspections.length === 0) {
      inspectionsTableBody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-sm text-slate-400 italic">No upcoming site inspections registered.</td></tr>`;
    } else {
      inspectionsTableBody.innerHTML = inspections.map(i => `
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-sm font-semibold">
          <td class="p-3">${i.name}</td>
          <td class="p-3 text-slate-500 font-normal font-mono">${i.date}</td>
          <td class="p-3 text-slate-650 dark:text-slate-450">${i.type}</td>
          <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold ${i.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}">${i.status}</span></td>
        </tr>
      `).join('');
    }
  }

  // Load Documents store (Tab 4)
  const docsTableBody = document.querySelector('#detail-docs-table-body');
  function renderDocsStoreTable() {
    if (!docsTableBody) return;
    const docs = prop.documents || [];
    if (docs.length === 0) {
      docsTableBody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-sm text-slate-400 italic">No documents attached in archive.</td></tr>`;
      return;
    }
    docsTableBody.innerHTML = docs.map((doc, idx) => `
      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-sm font-semibold">
        <td class="p-3 text-slate-800 dark:text-slate-200">${doc.type}</td>
        <td class="p-3"><a href="${doc.url || '#'}" download="${doc.name}" class="text-blue-500 hover:underline"><i class="bx bx-paperclip text-slate-400 mr-1 text-sm font-normal"></i>${doc.name}</a></td>
        <td class="p-3 font-mono text-slate-500 font-normal text-xs">${doc.date || '2026-07-15'}</td>
        <td class="p-3 text-slate-500 font-normal">${doc.uploader || 'Amina Bello'}</td>
        <td class="p-3 text-slate-500 font-normal text-xs">${doc.size || '1.1 MB'}</td>
        <td class="p-3 text-right space-x-2.5 text-base">
          <a href="${doc.url || '#'}" download="${doc.name}" class="text-blue-500 hover:text-blue-700" title="Download"><i class="bx bx-download"></i></a>
          <button data-replace-idx="${idx}" class="text-emerald-500 hover:text-emerald-700" title="Replace"><i class="bx bx-refresh"></i></button>
          <button data-delete-idx="${idx}" class="text-rose-500 hover:text-rose-700" title="Delete"><i class="bx bx-trash"></i></button>
        </td>
      </tr>
    `).join('');
  }
  renderDocsStoreTable();

  // Document upload Modal handlers
  const uploadTrigger = document.querySelector('#doc-upload-trigger-btn');
  const uploadModal = document.querySelector('#doc-upload-modal');
  const modalClose = document.querySelector('#doc-modal-close');
  const modalCancel = document.querySelector('#doc-modal-cancel');
  const modalForm = document.querySelector('#doc-upload-modal-form');

  if (uploadTrigger && uploadModal) {
    uploadTrigger.addEventListener('click', () => uploadModal.classList.remove('hidden'));
  }
  if (modalClose && uploadModal) {
    modalClose.addEventListener('click', () => uploadModal.classList.add('hidden'));
  }
  if (modalCancel && uploadModal) {
    modalCancel.addEventListener('click', () => uploadModal.classList.add('hidden'));
  }

  if (modalForm && uploadModal) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.querySelector('#modal-doc-type').value;
      const fileInput = document.querySelector('#modal-doc-file');
      const file = fileInput.files[0];
      
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (!prop.documents) prop.documents = [];
        prop.documents.push({
          type: type,
          name: file.name,
          date: new Date().toISOString().substring(0, 10),
          uploader: state.admin.staffName || 'Amina Bello',
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          url: event.target.result
        });
        
        addAuditLog(`Uploaded document "${file.name}" to property "${prop.title}"`, 'Properties Catalog');
        showToast('Document uploaded successfully.');
        uploadModal.classList.add('hidden');
        modalForm.reset();
        renderDocsStoreTable();
      };
      reader.readAsDataURL(file);
    });
  }

  // Tabs switching handler
  const tabsNav = document.querySelector('#detail-tabs-nav');
  if (tabsNav) {
    tabsNav.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-detail-tab]');
      if (!btn) return;
      
      e.preventDefault();
      const activeTab = btn.getAttribute('data-detail-tab');
      
      document.querySelectorAll('.detail-tab-btn').forEach(b => {
        b.classList.remove('border-blue-600', 'text-blue-600');
        b.classList.add('border-transparent', 'text-slate-500');
      });
      btn.classList.remove('border-transparent', 'text-slate-500');
      btn.classList.add('border-blue-600', 'text-blue-600');

      document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
      const panel = document.getElementById(`panel-${activeTab}`);
      if (panel) panel.classList.remove('hidden');
    });
  }

  // Action clicks inside Detail View
  root.addEventListener('click', (e) => {
    // Edit Click
    if (e.target.closest('#detail-edit-btn')) {
      e.preventDefault();
      state.admin.editingPropertyId = prop.id;
      initAdminTab('properties-add');
      return;
    }

    // Back to Catalog
    if (e.target.closest('#detail-back-btn')) {
      e.preventDefault();
      state.admin.selectedPropertyId = null;
      initAdminTab('properties-list');
      return;
    }

    // Replace Document
    const replaceBtn = e.target.closest('[data-replace-idx]');
    if (replaceBtn) {
      e.preventDefault();
      const idx = parseInt(replaceBtn.getAttribute('data-replace-idx'));
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.onchange = (ev) => {
        const file = ev.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          prop.documents[idx].name = file.name;
          prop.documents[idx].size = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
          prop.documents[idx].url = event.target.result;
          prop.documents[idx].date = new Date().toISOString().substring(0, 10);
          
          addAuditLog(`Replaced document file at index ${idx} on "${prop.title}"`, 'Properties Catalog');
          showToast('Document replaced successfully.');
          renderDocsStoreTable();
        };
        reader.readAsDataURL(file);
      };
      fileInput.click();
      return;
    }

    // Delete Document
    const deleteBtn = e.target.closest('[data-delete-idx]');
    if (deleteBtn) {
      e.preventDefault();
      const idx = parseInt(deleteBtn.getAttribute('data-delete-idx'));
      const docName = prop.documents[idx].name;
      if (confirm(`Remove "${docName}" from archive?`)) {
        prop.documents.splice(idx, 1);
        addAuditLog(`Deleted document "${docName}" from "${prop.title}"`, 'Properties Catalog');
        showToast('Document removed successfully.');
        renderDocsStoreTable();
      }
      return;
    }

    // Dynamic routing link inside subtabs
    const routeLink = e.target.closest('[data-route-to]');
    if (routeLink) {
      e.preventDefault();
      const tab = routeLink.getAttribute('data-route-to');
      if (tab) {
        const sidebarBtn = document.querySelector(`#admin-sidebar-menu button[data-tab="${tab}"]`);
        if (sidebarBtn) {
          sidebarBtn.click();
        } else {
          state.admin.activeTab = tab;
          initAdminTab(tab);
        }
      }
    }
  });
}

export function bindLandPlotMappingTabListeners(state, root, initAdminTab, properties, addAuditLog) {
  const searchInput = document.querySelector('#admin-search-plots');
  const projectFilter = document.querySelector('#filter-plot-project-select');
  const statusFilter = document.querySelector('#filter-plot-status-select');

  function filterPlotsTable() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const projVal = projectFilter ? projectFilter.value : 'all';
    const statVal = statusFilter ? statusFilter.value : 'all';
    const tbody = document.querySelector('#admin-plots-table-body');
    if (!tbody) return;

    const filtered = state.admin.plots.filter(pl => {
      const matchesQuery = pl.id.toLowerCase().includes(query) || 
                           (pl.client && pl.client.toLowerCase().includes(query)) || 
                           (pl.coordinates && pl.coordinates.toLowerCase().includes(query));
      const matchesProj = projVal === 'all' || pl.project === projVal;
      const matchesStat = statVal === 'all' || pl.status === statVal;
      return matchesQuery && matchesProj && matchesStat;
    });

    tbody.innerHTML = filtered.map(pl => {
      const priceFormatted = fmtNGN(pl.price || 15000000);
      let statusClass = 'bg-green-500/10 text-green-600 dark:text-green-400';
      if (pl.status === 'Allocated') statusClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      else if (pl.status === 'Reserved') statusClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      else if (pl.status === 'Escrow Pending') statusClass = 'bg-purple-500/10 text-purple-600 dark:text-purple-400';

      let physicalClass = 'text-slate-455';
      if (pl.physicalStage === 'Fully Handed Over') physicalClass = 'text-green-600 dark:text-green-400 font-bold';
      else if (pl.physicalStage === 'Inspected') physicalClass = 'text-blue-500 font-semibold';
      else if (pl.physicalStage === 'Beacons Placed') physicalClass = 'text-amber-500 font-semibold';

      const provName = pl.provisionalLetterName || '';
      const provUrl = pl.provisionalLetterUrl || '#';
      const deedName = pl.surveyDeedName || '';
      const deedUrl = pl.surveyDeedUrl || '#';
      const planName = pl.surveyPlanName || '';
      const planUrl = pl.surveyPlanUrl || '#';

      return `
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
          <td class="p-4">
            <span class="block font-bold text-slate-900 dark:text-white text-xs">${pl.id}</span>
            <span class="block text-[9px] text-slate-400 font-mono mt-0.5">${pl.coordinates}</span>
          </td>
          <td class="p-4">
            <span class="block text-slate-700 dark:text-slate-355 font-semibold">${pl.project}</span>
          </td>
          <td class="p-4">
            <span class="block font-bold text-slate-800 dark:text-slate-200">${pl.area}</span>
            <span class="block text-[10px] text-slate-455 font-semibold mt-0.5">${priceFormatted} (${pl.paymentMode || 'Outright'})</span>
          </td>
          <td class="p-4">
            <span class="block font-bold text-[#1d4ed8] dark:text-[#60a5fa]">${pl.client || 'None'}</span>
          </td>
          <td class="p-4">
            <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${statusClass}">${pl.status}</span>
            <span class="block text-[9px] mt-1.5 ${physicalClass}"><i class="bx bx-check-shield text-[10px]"></i> ${pl.physicalStage || 'No Action'}</span>
          </td>
          <td class="p-4">
            <div class="flex flex-col gap-1 text-[10px]">
              ${provName ? `
                <a href="${provUrl}" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold">
                  <i class="bx bx-file text-[11px]"></i> <span>Provisional Letter</span>
                </a>
              ` : ''}
              ${deedName ? `
                <a href="${deedUrl}" target="_blank" class="text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1 font-bold">
                  <i class="bx bx-certification text-[11px]"></i> <span>Deed of Assignment</span>
                </a>
              ` : ''}
              ${planName ? `
                <a href="${planUrl}" target="_blank" class="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-bold">
                  <i class="bx bx-map text-[11px]"></i> <span>Survey Plan</span>
                </a>
              ` : ''}
              ${(!provName && !deedName && !planName) ? `
                <span class="text-slate-400 italic">No deeds loaded</span>
              ` : ''}
            </div>
          </td>
          <td class="p-4 text-right space-x-2">
            <button data-plot-edit-id="${pl.id}" class="text-blue-550 hover:text-blue-755 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Edit Plot"><i class="bx bx-edit text-sm"></i></button>
            <button data-plot-delete-id="${pl.id}" class="text-rose-500 hover:text-rose-755 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Delete Plot"><i class="bx bx-trash text-sm"></i></button>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (searchInput) searchInput.addEventListener('input', filterPlotsTable);
  if (projectFilter) projectFilter.addEventListener('change', filterPlotsTable);
  if (statusFilter) statusFilter.addEventListener('change', filterPlotsTable);

  root.addEventListener('click', (e) => {
    if (e.target.closest('#go-to-allocate-plot-btn')) {
      e.preventDefault();
      state.admin.editingPlotId = null;
      initAdminTab('properties-mapping-add');
      return;
    }

    const editBtn = e.target.closest('[data-plot-edit-id]');
    if (editBtn) {
      e.preventDefault();
      const id = editBtn.getAttribute('data-plot-edit-id');
      state.admin.editingPlotId = id;
      initAdminTab('properties-mapping-add');
      return;
    }

    const deleteBtn = e.target.closest('[data-plot-delete-id]');
    if (deleteBtn) {
      e.preventDefault();
      const id = deleteBtn.getAttribute('data-plot-delete-id');
      const idx = state.admin.plots.findIndex(p => p.id === id);
      if (idx !== -1) {
        if (confirm(`Are you sure you want to delete plot layout mapping "${id}"?`)) {
          state.admin.plots.splice(idx, 1);
          addAuditLog(`Deleted layout plot mapping "${id}"`, 'Plot Allocations');
          showToast(`Plot layout "${id}" deleted successfully.`);
          initAdminTab('properties-mapping');
        }
      }
    }
  });
}

export function bindAddEditPlotAllocationTabListeners(state, root, initAdminTab, addAuditLog) {
  const form = document.querySelector('#plot-allocation-form');
  const editingPlotId = state.admin.editingPlotId;
  const plots = state.admin.plots || [];
  const editingPlot = editingPlotId ? plots.find(p => p.id === editingPlotId) : null;
  const isEditing = !!editingPlot;

  if (isEditing) {
    document.querySelector('#plot-edit-id').value = editingPlot.id;
    document.querySelector('#form-plot-id').value = editingPlot.id;
    document.querySelector('#form-plot-project').value = editingPlot.project;
    document.querySelector('#form-plot-area').value = editingPlot.area;
    document.querySelector('#form-plot-coordinates').value = editingPlot.coordinates;
    document.querySelector('#form-plot-price').value = editingPlot.price;
    document.querySelector('#form-plot-payment-mode').value = editingPlot.paymentMode;
    document.querySelector('#form-plot-client').value = editingPlot.client;
    document.querySelector('#form-plot-status').value = editingPlot.status;
    document.querySelector('#form-plot-physical-stage').value = editingPlot.physicalStage || 'No Action';
    
    document.querySelector('#val-plot-provisional-name').value = editingPlot.provisionalLetterName || '';
    document.querySelector('#val-plot-provisional-url').value = editingPlot.provisionalLetterUrl || '';
    document.querySelector('#val-plot-deed-name').value = editingPlot.surveyDeedName || '';
    document.querySelector('#val-plot-deed-url').value = editingPlot.surveyDeedUrl || '';
    document.querySelector('#val-plot-plan-name').value = editingPlot.surveyPlanName || '';
    document.querySelector('#val-plot-plan-url').value = editingPlot.surveyPlanUrl || '';
  }

  const uploadProvisional = document.querySelector('#upload-plot-provisional');
  if (uploadProvisional) {
    uploadProvisional.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        document.querySelector('#info-plot-provisional').textContent = file.name;
        document.querySelector('#val-plot-provisional-name').value = file.name;
        document.querySelector('#val-plot-provisional-url').value = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  const btnProvisional = document.querySelector('#btn-trigger-provisional');
  if (btnProvisional && uploadProvisional) {
    btnProvisional.addEventListener('click', (e) => {
      e.preventDefault();
      uploadProvisional.click();
    });
  }

  const uploadDeed = document.querySelector('#upload-plot-deed');
  if (uploadDeed) {
    uploadDeed.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        document.querySelector('#info-plot-deed').textContent = file.name;
        document.querySelector('#val-plot-deed-name').value = file.name;
        document.querySelector('#val-plot-deed-url').value = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  const btnDeed = document.querySelector('#btn-trigger-deed');
  if (btnDeed && uploadDeed) {
    btnDeed.addEventListener('click', (e) => {
      e.preventDefault();
      uploadDeed.click();
    });
  }

  const uploadPlan = document.querySelector('#upload-plot-plan');
  if (uploadPlan) {
    uploadPlan.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        document.querySelector('#info-plot-plan').textContent = file.name;
        document.querySelector('#val-plot-plan-name').value = file.name;
        document.querySelector('#val-plot-plan-url').value = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  const btnPlan = document.querySelector('#btn-trigger-plan');
  if (btnPlan && uploadPlan) {
    btnPlan.addEventListener('click', (e) => {
      e.preventDefault();
      uploadPlan.click();
    });
  }

  root.addEventListener('click', (e) => {
    if (e.target.closest('#back-to-plots-btn') || e.target.closest('#cancel-allocation-btn')) {
      e.preventDefault();
      state.admin.editingPlotId = null;
      initAdminTab('properties-mapping');
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const editIdVal = document.querySelector('#plot-edit-id').value;
      const plotId = document.querySelector('#form-plot-id').value.trim().toUpperCase();
      const project = document.querySelector('#form-plot-project').value;
      const area = document.querySelector('#form-plot-area').value.trim();
      const coordinates = document.querySelector('#form-plot-coordinates').value.trim();
      const price = parseInt(document.querySelector('#form-plot-price').value) || 0;
      const paymentMode = document.querySelector('#form-plot-payment-mode').value;
      const client = document.querySelector('#form-plot-client').value;
      const status = document.querySelector('#form-plot-status').value;
      const physicalStage = document.querySelector('#form-plot-physical-stage').value;

      const provisionalLetterName = document.querySelector('#val-plot-provisional-name').value;
      const provisionalLetterUrl = document.querySelector('#val-plot-provisional-url').value;
      const surveyDeedName = document.querySelector('#val-plot-deed-name').value;
      const surveyDeedUrl = document.querySelector('#val-plot-deed-url').value;
      const surveyPlanName = document.querySelector('#val-plot-plan-name').value;
      const surveyPlanUrl = document.querySelector('#val-plot-plan-url').value;

      if (editIdVal) {
        const pl = state.admin.plots.find(p => p.id === editIdVal);
        if (pl) {
          pl.project = project;
          pl.area = area;
          pl.coordinates = coordinates;
          pl.price = price;
          pl.paymentMode = paymentMode;
          pl.client = client;
          pl.status = status;
          pl.physicalStage = physicalStage;
          
          pl.provisionalLetterName = provisionalLetterName;
          pl.provisionalLetterUrl = provisionalLetterUrl;
          pl.surveyDeedName = surveyDeedName;
          pl.surveyDeedUrl = surveyDeedUrl;
          pl.surveyPlanName = surveyPlanName;
          pl.surveyPlanUrl = surveyPlanUrl;

          addAuditLog(`Updated allocation details for plot "${editIdVal}"`, 'Plot Allocations');
          showToast(`Plot "${editIdVal}" updated successfully.`);
        }
      } else {
        const exists = state.admin.plots.some(p => p.id === plotId);
        if (exists) {
          showToast(`Error: A plot layout record with ID "${plotId}" already exists.`, 'error');
          return;
        }

        const newPlot = {
          id: plotId,
          project,
          area,
          coordinates,
          price,
          paymentMode,
          client,
          status,
          physicalStage,
          provisionalLetterName,
          provisionalLetterUrl,
          surveyDeedName,
          surveyDeedUrl,
          surveyPlanName,
          surveyPlanUrl
        };

        state.admin.plots.unshift(newPlot);
        addAuditLog(`Mapped new layout plot "${plotId}" under project "${project}"`, 'Plot Allocations');
        showToast(`Plot "${plotId}" allocated successfully.`);
      }

      state.admin.editingPlotId = null;
      initAdminTab('properties-mapping');
    });
  }
}
