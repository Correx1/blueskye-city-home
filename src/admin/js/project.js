import projectTemplates from '../html/project.html?raw';

function getTemplateHtml(id) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(projectTemplates, 'text/html');
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

// 1. Projects List Rendering
export function renderProjectsListTab(state, projects, properties) {
  let html = getTemplateHtml('projects-list-template');
  return html;
}

// 2. Add/Edit Project Form Rendering
export function renderAddEditProjectTab(state, projects) {
  const editId = state.admin.editingProjectId;
  const pr = editId ? projects.find(item => item.id === editId) : null;
  const isEditing = !!pr;

  let html = getTemplateHtml('projects-add-edit-template');

  html = html.replace('Modify Development Project', isEditing ? 'Modify Development Project' : 'Create Development Project');
  html = html.replace('Publish Layout Project', isEditing ? 'Save Changes' : 'Publish Layout Project');

  let initialDetailsHtml = '';
  const details = (isEditing && pr.customDetails) ? pr.customDetails : [
    { key: 'Zoning', value: pr?.type || 'Residential' },
    { key: 'Electricity Supply', value: 'Grid Connected' }
  ];
  details.forEach((det) => {
    initialDetailsHtml += `
      <div class="project-detail-row grid grid-cols-12 gap-2 items-center bg-slate-50/50 dark:bg-slate-955/20 p-2.5 rounded border border-slate-100 dark:border-slate-850">
        <div class="col-span-5">
          <select class="project-detail-key-select form-input py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-855 dark:text-white rounded border border-slate-200 dark:border-slate-800">
            <option value="Zoning" ${det.key === 'Zoning' ? 'selected' : ''}>Zoning Classification</option>
            <option value="Soil Topography" ${det.key === 'Soil Topography' ? 'selected' : ''}>Soil Topography</option>
            <option value="Electricity Supply" ${det.key === 'Electricity Supply' ? 'selected' : ''}>Electricity Supply</option>
            <option value="Road Widths" ${det.key === 'Road Widths' ? 'selected' : ''}>Road Access Widths</option>
            <option value="Water Drainage" ${det.key === 'Water Drainage' ? 'selected' : ''}>Water Drainage System</option>
            <option value="Custom" ${!['Zoning', 'Soil Topography', 'Electricity Supply', 'Road Widths', 'Water Drainage'].includes(det.key) ? 'selected' : ''}>Custom Detail Key...</option>
          </select>
          <input type="text" class="project-detail-custom-key form-input py-1.5 text-xs mt-1 bg-white dark:bg-slate-900 ${['Zoning', 'Soil Topography', 'Electricity Supply', 'Road Widths', 'Water Drainage'].includes(det.key) ? 'hidden' : ''}" placeholder="Key Name" value="${det.key}" />
        </div>
        <div class="col-span-5">
          <input type="text" class="project-detail-value form-input py-1.5 text-xs bg-white dark:bg-slate-900" placeholder="Value" value="${det.value}" />
        </div>
        <div class="col-span-2 text-right">
          <button type="button" class="remove-project-detail-btn text-red-500 hover:text-red-755 p-1"><i class="bx bx-trash text-base"></i></button>
        </div>
      </div>
    `;
  });

  html = html.replace('<!-- DYNAMIC DETAILS -->', initialDetailsHtml);
  return html;
}

// 3. Project Detail Rendering
export function renderProjectDetailTab(state, projects, properties) {
  let html = getTemplateHtml('project-detail-template');
  return html;
}

// 4. Project Reports Tab Rendering (Legacy/Phase 2 keeping for backward safety)
export function renderProjectReportsTab(state, projects) {
  const selectedProjId = state.admin.activeReportProjectId || (projects.length ? projects[0].id : null);
  const pr = projects.find(item => item.id === selectedProjId);
  const editingReportId = state.admin.editingReportId;
  const editingReport = (pr && editingReportId) ? pr.reports.find(r => r.id === editingReportId) : null;
  const isEditing = !!editingReport;

  let html = getTemplateHtml('project-reports-template');

  const projectOptionsHtml = projects.map(item => `
    <option value="${item.id}" ${item.id === selectedProjId ? 'selected' : ''}>${item.title}</option>
  `).join('');
  html = html.replace('<!-- PROJECT OPTIONS -->', projectOptionsHtml);

  let statsHtml = '';
  if (pr) {
    statsHtml = `
      <div class="flex justify-between text-xs"><span>Manager:</span> <span class="font-bold">${pr.siteManager || 'Aliyu Bello'}</span></div>
      <div class="flex justify-between text-xs"><span>Stage:</span> <span class="font-bold text-[#1d4ed8] dark:text-[#60a5fa]">${pr.stage || 'Pre-Launch'}</span></div>
      <div class="flex justify-between text-xs"><span>Completion:</span> <span class="font-bold text-emerald-600 dark:text-emerald-400">${pr.progress || 0}% Done</span></div>
    `;
  }
  html = html.replace('<!-- STATS -->', statsHtml);

  html = html.replace('Submit Progress Update', isEditing ? 'Modify Site Update' : 'Submit Progress Update');
  html = html.replace('data-project-id=""', `data-project-id="${pr ? pr.id : ''}"`);

  if (isEditing) {
    html = html.replace('class="text-xs text-red-500 hover:underline hidden"', 'class="text-xs text-red-500 hover:underline"');
  }

  let timelineLogsHtml = '';
  if (pr) {
    const reports = pr.reports || [];
    if (reports.length === 0) {
      timelineLogsHtml = `<p class="text-xs text-slate-455 italic text-center py-4 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">No progress logs uploaded for this project yet.</p>`;
    } else {
      timelineLogsHtml = reports.map(rep => {
        const comments = rep.comments || [];
        const media = rep.media || [];

        return `
          <div class="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 rounded-xl p-5 space-y-4 shadow-sm relative animate-fade-in text-slate-800 dark:text-slate-200">
            <div class="absolute top-4 right-4 flex items-center gap-1">
              <button data-edit-report-id="${rep.id}" data-project-id="${pr.id}" class="text-blue-500 hover:text-blue-700 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded transition-colors" title="Edit Report"><i class="bx bx-edit text-sm"></i></button>
              <button data-delete-report-id="${rep.id}" data-project-id="${pr.id}" class="text-red-505 hover:text-red-755 p-1.5 rounded transition-colors" title="Delete Report"><i class="bx bx-trash text-sm"></i></button>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-full bg-[#1e3a8a]/10 dark:bg-blue-900/20 text-[#1e3a8a] dark:text-blue-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                ${(rep.author || 'Site Manager').split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div class="flex-1 space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-[10px] font-bold bg-[#1d4ed8]/10 text-[#1d4ed8] px-2 py-0.5 rounded uppercase tracking-wider">${rep.stage || 'Foundation'}</span>
                  <span class="text-[10px] font-semibold text-slate-455">${rep.date}</span>
                </div>
                <h4 class="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">${rep.milestone || 'Work Progress Logged'}</h4>
                <p class="text-[10px] text-slate-450">Logged by: <span class="font-bold text-slate-600 dark:text-slate-355">${rep.author || 'Site Manager'}</span></p>
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between items-center text-xs">
                <span class="font-semibold text-slate-505">Project Stage Progress:</span>
                <span class="font-bold text-[#1d4ed8] dark:text-[#60a5fa]">${rep.progress || 0}% Completed</span>
              </div>
              <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500" style="width: ${rep.progress || 0}%"></div>
              </div>
            </div>

            <div class="space-y-1">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Details of Work Accomplished</span>
              <p class="text-xs text-slate-655 dark:text-slate-350 leading-relaxed bg-slate-50/50 dark:bg-slate-955/20 p-3 rounded border border-slate-100 dark:border-slate-850">${rep.text}</p>
            </div>

            ${media.length > 0 ? `
              <div class="space-y-2">
                <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Attached Photos & Videos (${media.length})</span>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  ${media.map(m => `
                    <div class="border border-slate-200 dark:border-slate-800/80 rounded overflow-hidden bg-slate-50 dark:bg-slate-955/20 flex flex-col animate-fade-in">
                      <div class="relative h-24 w-full bg-black/10 flex items-center justify-center overflow-hidden">
                        ${m.type === 'video' ? `
                          <video src="${m.url}" controls class="h-full w-full object-cover"></video>
                          <span class="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold bg-purple-600 text-white flex items-center gap-0.5"><i class="bx bx-play-circle"></i> Video</span>
                        ` : `
                          <a href="${m.url}" target="_blank" class="block h-full w-full">
                            <img src="${m.url}" class="h-full w-full object-cover hover:scale-105 transition-transform duration-200" />
                          </a>
                          <span class="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-600 text-white">Photo</span>
                        `}
                      </div>
                      <div class="p-2 border-t border-slate-100 dark:border-slate-850 text-[10px] text-slate-700 dark:text-slate-355 font-bold truncate" title="${m.label || m.url.split('/').pop()}">
                        ${m.label || 'Attached Asset'}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div class="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-3">
              <span class="text-[9px] font-black text-slate-455 uppercase tracking-wider block">Compliance Feedback & Observations (${comments.length})</span>
              
              <div class="space-y-2.5 pl-3 border-l-2 border-slate-200 dark:border-slate-800">
                ${comments.map(c => `
                  <div class="text-[11px] space-y-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="font-extrabold text-slate-800 dark:text-slate-200">${c.author}</span>
                      <span class="text-[9px] text-slate-400 font-mono">${c.date}</span>
                    </div>
                    <p class="text-slate-655 dark:text-slate-400 leading-relaxed">${c.text}</p>
                  </div>
                `).join('')}
              </div>

              <form class="report-comment-form flex items-center gap-2 pt-1" data-report-id="${rep.id}" data-project-id="${pr.id}">
                <input type="text" placeholder="Add compliance feedback or approval notes..." class="form-input text-xs py-2 bg-slate-50 dark:bg-slate-955 text-slate-855 dark:text-white" required />
                <button type="submit" class="bg-[#1e3a8a] text-white hover:bg-blue-800 font-bold px-3.5 py-2 rounded text-xs active:scale-98 shrink-0">Add Note</button>
              </form>
            </div>
          </div>
        `;
      }).join('');
    }
  }
  html = html.replace('<!-- TIMELINE LOGS -->', timelineLogsHtml);

  return html;
}

// --- Event Listeners for Projects ---
export function bindProjectsListTabListeners(state, root, initAdminTab, projects, addAuditLog) {
  const searchInput = document.querySelector('#admin-search-projects');
  const stageFilter = document.querySelector('#filter-project-stage');

  function renderProjectsTable() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const stageVal = stageFilter ? stageFilter.value : 'all';
    const tbody = document.querySelector('#admin-projects-table-body');
    if (!tbody) return;

    const filtered = projects.filter(pr => {
      const matchesQuery = pr.title.toLowerCase().includes(query) || pr.location.toLowerCase().includes(query);
      const matchesStage = stageVal === 'all' || pr.stage === stageVal;
      return matchesQuery && matchesStage;
    });

    tbody.innerHTML = filtered.map(pr => {
      // Calculate plot stats based on linked properties in properties list
      const properties = state.properties || [];
      const projectProps = properties.filter(p => p.project === pr.title);
      const soldCount = projectProps.filter(p => p.status === 'Sold').length;
      const reservedCount = projectProps.filter(p => p.status === 'Reserved').length;
      const soldOrReserved = soldCount + reservedCount;
      const totalPlots = pr.totalPlots || 40;
      const availablePlots = Math.max(0, totalPlots - soldOrReserved);

      const ratioPercent = totalPlots > 0 ? Math.round((soldOrReserved / totalPlots) * 100) : 0;
      const dateStr = pr.dateCreated || '2026-07-01';

      let stageClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-450';
      if (pr.stage === 'Planning') stageClass = 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
      else if (pr.stage === 'Development') stageClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      else if (pr.stage === 'Pre-Launch') stageClass = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400';
      else if (pr.stage === 'Launch') stageClass = 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      else if (pr.stage === 'Allocation') stageClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450';

      return `
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors text-sm">
          <td class="p-4">
            <div class="flex items-center gap-3">
              <img src="${pr.images && pr.images[0] ? pr.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}" class="h-10 w-16 object-cover rounded-md border border-slate-100 dark:border-slate-800" />
              <div>
                <span class="block font-bold text-slate-900 dark:text-white text-[14.5px] cursor-pointer hover:underline text-blue-600 dark:text-blue-400" data-project-detail-id="${pr.id}">${pr.title}</span>
                <span class="block text-xs text-slate-400 font-semibold mt-0.5">${projectProps.length} Catalog Listings</span>
              </div>
            </div>
          </td>
          <td class="p-4 text-slate-650 dark:text-slate-350 text-xs">${pr.location}, ${pr.city || 'Lagos'}</td>
          <td class="p-4 text-xs">
            <div class="flex flex-col gap-1 w-28">
              <div class="flex justify-between font-semibold text-[10px] text-slate-500 dark:text-slate-400">
                <span>${availablePlots} Avail</span>
                <span>${soldOrReserved} Sold</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1">
                <div class="bg-emerald-500 h-1 rounded-full" style="width: ${ratioPercent}%"></div>
              </div>
            </div>
          </td>
          <td class="p-4">
            <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${stageClass}">${pr.stage || 'Planning'}</span>
          </td>
          <td class="p-4 text-slate-650 dark:text-slate-350 font-semibold text-xs">${pr.siteManager || 'Aliyu Bello'}</td>
          <td class="p-4 font-mono text-slate-450 text-xs">${dateStr}</td>
          <td class="p-4 text-right">
            <div class="flex items-center justify-end gap-2 text-base">
              <button data-project-view-id="${pr.id}" class="text-blue-500 hover:text-blue-750 p-1" title="View Detail"><i class="bx bx-show"></i></button>
              <button data-project-edit-id="${pr.id}" class="text-emerald-500 hover:text-emerald-700 p-1" title="Edit"><i class="bx bx-edit"></i></button>
              <button data-project-delete-id="${pr.id}" class="text-rose-500 hover:text-rose-700 p-1" title="Delete"><i class="bx bx-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (searchInput) searchInput.addEventListener('input', renderProjectsTable);
  if (stageFilter) stageFilter.addEventListener('change', renderProjectsTable);

  root.addEventListener('click', (e) => {
    // Add Project Click
    if (e.target.closest('#add-new-project-btn')) {
      e.preventDefault();
      state.admin.editingProjectId = null;
      initAdminTab('projects-add');
      return;
    }

    // Detail View Link Click
    const detailLink = e.target.closest('[data-project-detail-id]');
    if (detailLink) {
      e.preventDefault();
      const id = parseInt(detailLink.getAttribute('data-project-detail-id'));
      state.admin.selectedProjectId = id;
      initAdminTab('projects-detail');
      return;
    }

    // View Action Click
    const viewBtn = e.target.closest('[data-project-view-id]');
    if (viewBtn) {
      e.preventDefault();
      const id = parseInt(viewBtn.getAttribute('data-project-view-id'));
      state.admin.selectedProjectId = id;
      initAdminTab('projects-detail');
      return;
    }

    // Edit Click
    const editBtn = e.target.closest('[data-project-edit-id]');
    if (editBtn) {
      e.preventDefault();
      const id = parseInt(editBtn.getAttribute('data-project-edit-id'));
      state.admin.editingProjectId = id;
      initAdminTab('projects-add');
      return;
    }

    // Delete Click
    const deleteBtn = e.target.closest('[data-project-delete-id]');
    if (deleteBtn) {
      e.preventDefault();
      const id = parseInt(deleteBtn.getAttribute('data-project-delete-id'));
      const idx = projects.findIndex(item => item.id === id);
      if (idx !== -1) {
        if (confirm(`Are you sure you want to permanently delete project "${projects[idx].title}" and all its linked records?`)) {
          const title = projects[idx].title;
          projects.splice(idx, 1);
          addAuditLog(`Permanently deleted layout project "${title}"`, 'Development Projects');
          showToast(`Deleted project "${title}".`);
          renderProjectsTable();
        }
      }
    }
  });

  renderProjectsTable();
}

// --- Bind Add/Edit Project Form Listeners ---
export function bindAddEditProjectTabListeners(state, root, initAdminTab, projects, addAuditLog, renderApp) {
  const form = document.querySelector('#project-full-form');
  const editId = state.admin.editingProjectId;
  const pr = editId ? projects.find(item => item.id === editId) : null;
  const isEditing = !!pr;

  if (isEditing) {
    document.querySelector('#project-edit-id').value = pr.id;
    document.querySelector('#form-project-title').value = pr.title;
    document.querySelector('#form-project-manager').value = pr.siteManager || 'Aliyu Bello';
    document.querySelector('#form-project-location').value = pr.location || '';
    document.querySelector('#form-project-total-plots').value = pr.totalPlots || '';
    document.querySelector('#form-project-stage').value = pr.stage || 'Planning';
    document.querySelector('#form-project-gallery').value = pr.images[0] || '';
    document.querySelector('#form-project-desc').value = pr.description || '';
  }

  // Pre-load custom details row listeners
  const customDetailsContainer = document.querySelector('#project-custom-details-container');
  const addSpecBtn = document.querySelector('#add-project-detail-row-btn');

  if (addSpecBtn) {
    addSpecBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const div = document.createElement('div');
      div.className = "project-detail-row grid grid-cols-12 gap-2 items-center bg-slate-50/50 dark:bg-slate-955/20 p-2.5 rounded border border-slate-100 dark:border-slate-855 animate-fade-in";
      div.innerHTML = `
        <div class="col-span-5">
          <select class="project-detail-key-select form-input py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-855 dark:text-white rounded border border-slate-200 dark:border-slate-800">
            <option value="Zoning">Zoning Classification</option>
            <option value="Soil Topography">Soil Topography</option>
            <option value="Electricity Supply">Electricity Supply</option>
            <option value="Road Widths">Road Access Widths</option>
            <option value="Water Drainage">Water Drainage System</option>
            <option value="Custom" selected>Custom Detail Key...</option>
          </select>
          <input type="text" class="project-detail-custom-key form-input py-1.5 text-xs mt-1 bg-white dark:bg-slate-900" placeholder="Key Name" />
        </div>
        <div class="col-span-5">
          <input type="text" class="project-detail-value form-input py-1.5 text-xs bg-white dark:bg-slate-900" placeholder="Value" />
        </div>
        <div class="col-span-2 text-right">
          <button type="button" class="remove-project-detail-btn text-red-500 hover:text-red-755 p-1"><i class="bx bx-trash text-base"></i></button>
        </div>
      `;
      customDetailsContainer.appendChild(div);
      bindSpecRowChangeEvents(div);
    });
  }

  function bindSpecRowChangeEvents(row) {
    const select = row.querySelector('.project-detail-key-select');
    const customInput = row.querySelector('.project-detail-custom-key');
    const removeBtn = row.querySelector('.remove-project-detail-btn');

    if (select && customInput) {
      select.addEventListener('change', () => {
        if (select.value === 'Custom') {
          customInput.classList.remove('hidden');
        } else {
          customInput.classList.add('hidden');
          customInput.value = select.value;
        }
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        row.remove();
        updateRealtimePreview();
      });
    }
  }

  if (customDetailsContainer) {
    customDetailsContainer.querySelectorAll('.project-detail-row').forEach(row => {
      bindSpecRowChangeEvents(row);
    });
  }

  // Pre-load images gallery array
  const photosArray = isEditing && pr.images ? [...pr.images] : [];
  const photosPreview = document.querySelector('#project-photos-preview-container');

  function renderPhotosPreview() {
    if (!photosPreview) return;
    if (photosArray.length === 0) {
      photosPreview.innerHTML = '<span class="text-xs text-slate-400 italic">No image assets loaded.</span>';
      return;
    }
    photosPreview.innerHTML = photosArray.map((src, idx) => `
      <div class="relative group h-10 w-14 border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
        <img src="${src}" class="h-full w-full object-cover" />
        <button type="button" class="remove-photo absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity" data-idx="${idx}"><i class="bx bx-trash text-[10px]"></i></button>
      </div>
    `).join('');
  }
  renderPhotosPreview();

  // Photo uploads
  const photosInput = document.querySelector('#project-photos-input');
  const triggerPhotos = document.querySelector('#trigger-project-photos-upload');
  if (triggerPhotos && photosInput) {
    triggerPhotos.addEventListener('click', () => photosInput.click());
    photosInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          photosArray.push(event.target.result);
          renderPhotosPreview();
          const mainGallery = document.querySelector('#form-project-gallery');
          if (mainGallery && !mainGallery.value) {
            mainGallery.value = event.target.result;
          }
          updateRealtimePreview();
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Preview dynamics
  function updateRealtimePreview() {
    const title = document.querySelector('#form-project-title') ? document.querySelector('#form-project-title').value.trim() : '';
    const loc = document.querySelector('#form-project-location') ? document.querySelector('#form-project-location').value.trim() : '';
    const stage = document.querySelector('#form-project-stage') ? document.querySelector('#form-project-stage').value : 'Planning';
    const totalPlots = parseInt(document.querySelector('#form-project-total-plots').value) || 0;
    const mainImg = document.querySelector('#form-project-gallery') ? document.querySelector('#form-project-gallery').value.trim() : '';
    const manager = document.querySelector('#form-project-manager') ? document.querySelector('#form-project-manager').value : 'Aliyu Bello';

    document.querySelector('#prev-project-title').textContent = title || 'New Project Title';
    document.querySelector('#prev-project-location').innerHTML = `<i class="bx bx-map-pin"></i> ${loc || 'Banana Island'}`;
    document.querySelector('#prev-project-stage').textContent = stage;
    document.querySelector('#prev-project-plots-ratio').textContent = `0 / ${totalPlots} Sold`;

    if (mainImg) {
      document.querySelector('#prev-project-img').src = mainImg;
    }

    document.querySelector('#prev-project-manager-name').textContent = manager;
    const initial = manager.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    document.querySelector('#prev-project-manager-avatar').textContent = initial;

    // Specs
    const specsContainer = document.querySelector('#prev-project-features');
    if (specsContainer) {
      specsContainer.innerHTML = '';
      document.querySelectorAll('.project-detail-row').forEach(row => {
        const select = row.querySelector('.project-detail-key-select');
        const customInput = row.querySelector('.project-detail-custom-key');
        const valInput = row.querySelector('.project-detail-value');

        const keyName = (select.value === 'Custom') ? customInput.value.trim() : select.value;
        const val = valInput ? valInput.value.trim() : '';

        if (keyName && val) {
          const div = document.createElement('div');
          div.className = "flex items-center gap-1.5";
          div.innerHTML = `<i class="bx bx-check-double text-slate-400"></i><span>${keyName}: ${val}</span>`;
          specsContainer.appendChild(div);
        }
      });
    }
  }

  // Deletion delegate
  root.addEventListener('click', (e) => {
    const removePhotoBtn = e.target.closest('.remove-photo');
    if (removePhotoBtn) {
      e.preventDefault();
      const idx = parseInt(removePhotoBtn.getAttribute('data-idx'));
      photosArray.splice(idx, 1);
      renderPhotosPreview();
      updateRealtimePreview();
      return;
    }

    const cancelFormBtn = e.target.closest('#cancel-project-btn') || e.target.closest('#cancel-project-form-btn');
    if (cancelFormBtn) {
      e.preventDefault();
      state.admin.editingProjectId = null;
      initAdminTab('projects-list');
    }
  });

  // Bind key inputs updates to preview
  root.addEventListener('input', (e) => {
    if (e.target.closest('#form-project-title') || 
        e.target.closest('#form-project-location') || 
        e.target.closest('#form-project-total-plots') ||
        e.target.closest('#form-project-gallery') ||
        e.target.closest('.project-detail-value') ||
        e.target.closest('.project-detail-custom-key')) {
      updateRealtimePreview();
    }
  });

  root.addEventListener('change', (e) => {
    if (e.target.closest('#form-project-stage') || 
        e.target.closest('#form-project-manager') || 
        e.target.closest('.project-detail-key-select')) {
      updateRealtimePreview();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const editIdVal = document.querySelector('#project-edit-id').value;
      const title = document.querySelector('#form-project-title').value.trim();
      const manager = document.querySelector('#form-project-manager').value;
      const location = document.querySelector('#form-project-location').value.trim();
      const totalPlotsVal = document.querySelector('#form-project-total-plots').value.trim();
      const stage = document.querySelector('#form-project-stage').value;
      const description = document.querySelector('#form-project-desc').value.trim();

      // Inline validation
      let isValid = true;
      document.querySelectorAll('[id^="err-proj-"]').forEach(el => el.classList.add('hidden'));

      if (!title) {
        document.querySelector('#err-proj-title').classList.remove('hidden');
        isValid = false;
      }
      if (!location) {
        document.querySelector('#err-proj-location').classList.remove('hidden');
        isValid = false;
      }
      if (!totalPlotsVal || isNaN(totalPlotsVal) || parseInt(totalPlotsVal) <= 0) {
        document.querySelector('#err-proj-plots').classList.remove('hidden');
        isValid = false;
      }
      if (!description) {
        document.querySelector('#err-proj-desc').classList.remove('hidden');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      const totalPlots = parseInt(totalPlotsVal);

      // Collect specs attributes
      const customDetails = [];
      document.querySelectorAll('.project-detail-row').forEach(row => {
        const select = row.querySelector('.project-detail-key-select');
        const customInput = row.querySelector('.project-detail-custom-key');
        const valInput = row.querySelector('.project-detail-value');

        const keyName = (select.value === 'Custom') ? customInput.value.trim() : select.value;
        const val = valInput ? valInput.value.trim() : '';

        if (keyName && val) {
          customDetails.push({ key: keyName, value: val });
        }
      });

      if (editIdVal) {
        const prEntry = projects.find(item => item.id === parseInt(editIdVal));
        if (prEntry) {
          prEntry.title = title;
          prEntry.siteManager = manager;
          prEntry.location = location;
          prEntry.city = location.split(',').pop().trim();
          prEntry.stage = stage;
          prEntry.totalPlots = totalPlots;
          prEntry.description = description;
          prEntry.customDetails = customDetails;
          prEntry.images = photosArray.length > 0 ? photosArray : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'];

          addAuditLog(`Modified details for project "${title}"`, 'Development Projects');
          showToast(`Changes saved for "${title}" successfully.`);
        }
      } else {
        const newId = projects.length > 0 ? Math.max(...projects.map(item => item.id)) + 1 : 1;
        const newProject = {
          id: newId,
          title: title,
          siteManager: manager,
          location: location,
          city: location.split(',').pop().trim(),
          stage: stage,
          totalPlots: totalPlots,
          description: description,
          customDetails: customDetails,
          images: photosArray.length > 0 ? photosArray : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
          dateCreated: new Date().toISOString().substring(0, 10),
          reports: []
        };
        projects.unshift(newProject);

        addAuditLog(`Registered new development project "${title}"`, 'Development Projects');
        showToast(`Project "${title}" created successfully.`);
      }

      state.admin.editingProjectId = null;
      initAdminTab('projects-list');
      renderApp();
    });
  }

  updateRealtimePreview();
}

// --- Bind Details Tab Listeners ---
export function bindProjectDetailTabListeners(state, root, initAdminTab, projects, properties, addAuditLog) {
  const targetId = state.admin.selectedProjectId;
  const pr = targetId ? projects.find(p => p.id === targetId) : null;

  if (!pr) {
    root.innerHTML = `<div class="p-6 text-center text-slate-500">Error: Development project not found in database registry.</div>`;
    return;
  }

  // Populate project header data
  document.querySelector('#detail-project-title').textContent = pr.title;
  document.querySelector('#detail-project-sub').textContent = `${pr.location}, ${pr.city || 'Anambra'} | Site Manager: ${pr.siteManager || 'Aliyu Bello'}`;
  
  const stageBadge = document.querySelector('#detail-project-stage-badge');
  if (stageBadge) {
    stageBadge.textContent = pr.stage || 'Planning';
    stageBadge.className = 'px-2.5 py-0.5 rounded text-xs font-bold uppercase ';
    if (pr.stage === 'Planning') stageBadge.className += 'bg-slate-500/10 text-slate-655';
    else if (pr.stage === 'Development') stageBadge.className += 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    else if (pr.stage === 'Pre-Launch') stageBadge.className += 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400';
    else if (pr.stage === 'Launch') stageBadge.className += 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
    else if (pr.stage === 'Allocation') stageBadge.className += 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450';
  }

  // Compute stat metrics box values based on linked properties
  const projectProps = properties.filter(p => p.project === pr.title);
  const soldCount = projectProps.filter(p => p.status === 'Sold').length;
  const reservedCount = projectProps.filter(p => p.status === 'Reserved').length;
  const soldOrReserved = soldCount + reservedCount;
  
  const totalPlots = pr.totalPlots || 40;
  const availablePlots = Math.max(0, totalPlots - soldOrReserved);

  document.querySelector('#stat-total-plots').textContent = totalPlots;
  document.querySelector('#stat-available-plots').textContent = availablePlots;
  document.querySelector('#stat-reserved-plots').textContent = reservedCount;
  document.querySelector('#stat-sold-plots').textContent = soldCount;

  // Revenue calculation
  const totalRevenue = projectProps.filter(p => p.status === 'Sold').reduce((sum, p) => sum + (p.price || 0), 0);
  document.querySelector('#stat-project-revenue').textContent = fmtNGN(totalRevenue);

  // Render properties catalog nested table
  const tbody = document.querySelector('#detail-project-properties-tbody');
  if (tbody) {
    if (projectProps.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-xs text-slate-400 italic">No plots or catalog listings mapped under this project development yet.</td></tr>`;
    } else {
      tbody.innerHTML = projectProps.map(p => {
        let statusClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-450';
        if (p.status === 'Available') statusClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450';
        else if (p.status === 'Reserved') statusClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
        else if (p.status === 'Sold') statusClass = 'bg-rose-500/10 text-rose-600 dark:text-rose-455';

        const dateStr = p.dateAdded || '2026-07-01';

        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-xs font-semibold">
            <td class="p-4 text-slate-900 dark:text-white font-bold">${p.title}</td>
            <td class="p-4 text-slate-500 font-normal">${p.location || p.city}</td>
            <td class="p-4 font-mono text-slate-500 font-normal">${p.size || '450 Sqm'}</td>
            <td class="p-4 font-bold text-slate-800 dark:text-slate-200">${fmtNGN(p.price)}</td>
            <td class="p-4">
              <span class="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${statusClass}">${p.status}</span>
            </td>
            <td class="p-4 font-mono text-slate-450 font-normal">${dateStr}</td>
            <td class="p-4 text-right">
              <button data-prop-redirect-id="${p.id}" class="text-blue-550 hover:underline">View Spec <i class="bx bx-right-arrow-alt align-middle"></i></button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Handle Edit/Back button clicks
  root.addEventListener('click', (e) => {
    // Edit click
    if (e.target.closest('#detail-edit-btn')) {
      e.preventDefault();
      state.admin.editingProjectId = pr.id;
      initAdminTab('projects-add');
      return;
    }

    // Back to projects click
    if (e.target.closest('#detail-back-btn')) {
      e.preventDefault();
      state.admin.selectedProjectId = null;
      initAdminTab('projects-list');
      return;
    }

    // Redirect to target property details spec
    const redirectBtn = e.target.closest('[data-prop-redirect-id]');
    if (redirectBtn) {
      e.preventDefault();
      const pId = parseInt(redirectBtn.getAttribute('data-prop-redirect-id'));
      state.admin.selectedPropertyId = pId;
      initAdminTab('properties-detail');
    }
  });
}

// --- Bind Project Timeline Reports Listeners ---
export function bindProjectReportsTabListeners(state, root, initAdminTab, projects, addAuditLog, renderApp) {
  const projSelect = document.querySelector('#report-project-select');
  const cancelEditBtn = document.querySelector('#clear-report-edit-state-btn');
  const reportForm = document.querySelector('#new-construction-report-form');
  const commentsFeed = document.querySelector('#project-reports-timeline-container');

  const selectedProjId = state.admin.activeReportProjectId || (projects.length ? projects[0].id : null);
  const pr = projects.find(item => item.id === selectedProjId);

  if (projSelect) {
    projSelect.addEventListener('change', () => {
      state.admin.activeReportProjectId = parseInt(projSelect.value);
      state.admin.editingReportId = null;
      initAdminTab('projects-reports');
    });
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', (e) => {
      e.preventDefault();
      state.admin.editingReportId = null;
      initAdminTab('projects-reports');
    });
  }

  const editingReportId = state.admin.editingReportId;
  const editingReport = (pr && editingReportId) ? pr.reports.find(r => r.id === editingReportId) : null;
  const isEditing = !!editingReport;

  if (isEditing && reportForm) {
    document.querySelector('#report-edit-id').value = editingReport.id;
    document.querySelector('#report-form-milestone').value = editingReport.milestone;
    document.querySelector('#report-form-stage').value = editingReport.stage || 'Foundation';
    document.querySelector('#report-form-progress').value = editingReport.progress || 0;
    document.querySelector('#report-form-text').value = editingReport.text;
  }

  if (commentsFeed) {
    commentsFeed.addEventListener('submit', (e) => {
      const commentForm = e.target.closest('.report-comment-form');
      if (commentForm) {
        e.preventDefault();
        const rId = parseInt(commentForm.dataset.reportId);
        const pId = parseInt(commentForm.dataset.projectId);
        const inp = commentForm.querySelector('input');
        const text = inp ? inp.value.trim() : '';

        if (text) {
          const project = projects.find(item => item.id === pId);
          const report = project ? project.reports.find(r => r.id === rId) : null;
          if (report) {
            if (!report.comments) report.comments = [];
            
            const newComment = {
              id: report.comments.length + 1,
              author: "Platform Admin Coordinator",
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              text
            };
            report.comments.push(newComment);
            addAuditLog(`Added compliance feedback comments logs to milestone report "${report.milestone}"`, 'Development Projects');
            initAdminTab('projects-reports');
          }
        }
      }
    });
  }

  const mediaInput = document.querySelector('#report-media-input');
  const triggerMedia = document.querySelector('#trigger-report-media-upload');
  const mediaPreview = document.querySelector('#report-media-preview-container');
  const placeholder = document.querySelector('#report-media-placeholder');

  if (triggerMedia && mediaInput) {
    triggerMedia.addEventListener('click', (e) => {
      e.preventDefault();
      mediaInput.click();
    });
  }

  if (mediaInput) {
    mediaInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0 && placeholder) {
        placeholder.remove();
      }
      files.forEach(file => {
        const type = file.type.startsWith('video/') ? 'video' : 'photo';
        const reader = new FileReader();
        reader.onload = (event) => {
          const idx = mediaPreview.querySelectorAll('.report-media-item-row').length;
          const div = document.createElement('div');
          div.className = "report-media-item-row flex items-center gap-3 bg-slate-50 dark:bg-slate-955 p-2 rounded border border-slate-150/10 animate-fade-in";
          div.dataset.idx = idx;
          div.innerHTML = `
            <div class="relative h-10 w-14 rounded border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
              ${type === 'video' ? `<i class="bx bx-play-circle text-xl text-slate-400"></i>` : `<img src="${event.target.result}" class="h-full w-full object-cover" />`}
            </div>
            <div class="flex-1 min-w-0 grid grid-cols-2 gap-2">
              <select class="report-media-type form-input py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
                <option value="photo" ${type === 'photo' ? 'selected' : ''}>Photo</option>
                <option value="video" ${type === 'video' ? 'selected' : ''}>Video</option>
              </select>
              <input type="text" class="report-media-label form-input py-1 text-xs bg-white dark:bg-slate-900" placeholder="Label/Title" value="${file.name.split('.').slice(0,-1).join('.')}" />
            </div>
            <input type="hidden" class="report-media-url" value="${event.target.result}" />
            <button type="button" class="remove-report-media-item text-red-505 hover:text-red-755 p-1"><i class="bx bx-x text-base"></i></button>
          `;
          mediaPreview.appendChild(div);
        };
        reader.readAsDataURL(file);
      });
    });
  }

  if (mediaPreview) {
    mediaPreview.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.remove-report-media-item');
      if (removeBtn) {
        e.preventDefault();
        removeBtn.parentElement.remove();
        if (mediaPreview.querySelectorAll('.report-media-item-row').length === 0) {
          mediaPreview.innerHTML = `<p class="text-slate-400 italic text-[10px] text-center py-2" id="report-media-placeholder">No progress media files attached</p>`;
        }
      }
    });
  }

  root.addEventListener('click', (e) => {
    if (e.target.closest('#back-to-projects-btn')) {
      e.preventDefault();
      state.admin.editingReportId = null;
      initAdminTab('projects-list');
      return;
    }

    const editBtn = e.target.closest('[data-edit-report-id]');
    if (editBtn) {
      e.preventDefault();
      const rId = parseInt(editBtn.getAttribute('data-edit-report-id'));
      state.admin.editingReportId = rId;
      initAdminTab('projects-reports');
      return;
    }

    const deleteBtn = e.target.closest('[data-delete-report-id]');
    if (deleteBtn) {
      e.preventDefault();
      const rId = parseInt(deleteBtn.getAttribute('data-delete-report-id'));
      const pId = parseInt(deleteBtn.getAttribute('data-project-id'));
      
      const project = projects.find(item => item.id === pId);
      if (project) {
        const idx = project.reports.findIndex(r => r.id === rId);
        if (idx !== -1) {
          if (confirm(`Are you sure you want to delete report milestone "${project.reports[idx].milestone}"?`)) {
            const milestone = project.reports[idx].milestone;
            project.reports.splice(idx, 1);
            addAuditLog(`Deleted milestone construction report "${milestone}"`, 'Development Projects');
            showToast(`Report deleted successfully.`);
            initAdminTab('projects-reports');
          }
        }
      }
    }
  });

  if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pId = parseInt(reportForm.dataset.projectId);
      const rIdVal = document.querySelector('#report-edit-id').value;
      const milestone = document.querySelector('#report-form-milestone').value.trim();
      const stage = document.querySelector('#report-form-stage').value;
      const progress = parseInt(document.querySelector('#report-form-progress').value) || 0;
      const text = document.querySelector('#report-form-text').value.trim();

      const project = projects.find(item => item.id === pId);
      if (!project) return;

      const media = [];
      document.querySelectorAll('.report-media-item-row').forEach(row => {
        const type = row.querySelector('.report-media-type').value;
        const label = row.querySelector('.report-media-label').value.trim();
        const url = row.querySelector('.report-media-url').value;
        if (url) {
          media.push({ type, label, url });
        }
      });

      if (rIdVal) {
        const rep = project.reports.find(r => r.id === parseInt(rIdVal));
        if (rep) {
          rep.milestone = milestone;
          rep.stage = stage;
          rep.progress = progress;
          rep.text = text;
          rep.media = media;

          project.stage = stage;
          project.progress = progress;

          addAuditLog(`Edited milestone progress update "${milestone}" for project "${project.title}"`, 'Development Projects');
          showToast("Milestone report updated successfully.");
        }
      } else {
        const nextId = project.reports.length > 0 ? Math.max(...project.reports.map(r => r.id)) + 1 : 1;
        const newReport = {
          id: nextId,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          stage,
          progress,
          milestone,
          author: "Aliyu Bello",
          text,
          media,
          comments: []
        };
        if (!project.reports) project.reports = [];
        project.reports.unshift(newReport);

        project.stage = stage;
        project.progress = progress;

        addAuditLog(`Published milestone progress update "${milestone}" for project "${project.title}"`, 'Development Projects');
        showToast("Milestone report published successfully.");
      }

      state.admin.editingReportId = null;
      initAdminTab('projects-reports');
      renderApp();
    });
  }
}
