import inspectionTemplates from '../html/inspection.html?raw';

function getSection(name) {
  const startMarker = `data-section="${name}"`;
  const startIdx = inspectionTemplates.indexOf(startMarker);
  if (startIdx === -1) return '';
  const divStart = inspectionTemplates.lastIndexOf('<div', startIdx);
  const endMarker = `END SECTION: ${name}`;
  const endCommentIdx = inspectionTemplates.indexOf(endMarker, startIdx);
  if (endCommentIdx === -1) return '';
  const closingDiv = inspectionTemplates.lastIndexOf('</div>', endCommentIdx);
  if (closingDiv === -1) return '';
  return inspectionTemplates.slice(divStart, closingDiv + 6);
}

function ensureInspections(state) {
  if (!state.admin.inspectionsList) {
    state.admin.inspectionsList = [
      {
        id: 301,
        name: 'Florence Nduka',
        phone: '08012345678',
        email: 'florence@domain.com',
        propertyTitle: 'Lekki Gardens Extension',
        date: '2026-07-18',
        time: '10:00',
        source: 'Customer Portal',
        status: 'Pending',
        assignedManager: 'Unassigned',
        notes: 'Requested site coordinates verification details.',
        postReport: null
      },
      {
        id: 302,
        name: 'Tunde Bakare',
        phone: '09087654321',
        email: 'tunde@domain.com',
        propertyTitle: 'BlueSky Epe Oasis',
        date: '2026-07-12',
        time: '14:30',
        source: 'Public Site Form',
        status: 'Confirmed',
        assignedManager: 'Obinna Okafor',
        notes: 'Would like to view Epe allocation maps.',
        postReport: null
      },
      {
        id: 303,
        name: 'Amara Nwosu',
        phone: '08122334455',
        email: 'amara@domain.com',
        propertyTitle: 'BlueSky Lekki Phase 1 Residential',
        date: '2026-07-08',
        time: '11:00',
        source: 'Customer Portal',
        status: 'Completed',
        assignedManager: 'Funmi Adebayo',
        notes: 'Attended. Interested in Outright purchase.',
        postReport: {
          attended: 'Attended',
          leadStatus: 'Hot',
          feedback: 'Extremely pleased with Epe site layout. Requested contract.',
          notes: 'Prepare sale invoicing paperwork.'
        }
      }
    ];
  }
}

// 1. MASTER ROUTERS
export function renderTourBookingsTab(state) {
  ensureInspections(state);
  return getSection('tour-bookings-template');
}

export function renderInspectionCalendarTab(state) {
  ensureInspections(state);
  return getSection('inspections-calendar-template');
}

// Helper: Status colors
function statusBadgeClass(status) {
  switch (status) {
    case 'Confirmed': return 'bg-blue-500/10 text-blue-600 dark:text-blue-450';
    case 'Completed': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450';
    case 'Cancelled': return 'bg-rose-500/10 text-rose-600 dark:text-rose-455';
    default: return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
  }
}

// --- Bind Inspections Event Listeners ---
export function bindInspectionsTabListeners(state, root, addAuditLog, initAdminTab) {
  ensureInspections(state);
  const tours = state.admin.inspectionsList || [];
  const activeTab = state.admin.activeTab;

  // 1. TOUR BOOKINGS LIST VIEW BINDERS
  if (activeTab === 'clients-bookings') {
    const searchInp = document.querySelector('#ins-search-input');
    const statusFilter = document.querySelector('#filter-ins-status');
    const dateFrom = document.querySelector('#filter-ins-date-from');
    const dateTo = document.querySelector('#filter-ins-date-to');

    function renderTableRows() {
      const q = (searchInp?.value || '').toLowerCase().trim();
      const sv = statusFilter?.value || 'all';
      const df = dateFrom?.value || '';
      const dt = dateTo?.value || '';

      const tbody = document.querySelector('#tour-bookings-table-body');
      if (!tbody) return;

      const filtered = tours.filter(t => {
        const matchesQuery = !q || [t.name, t.propertyTitle, t.assignedManager].join(' ').toLowerCase().includes(q);
        const matchesStatus = sv === 'all' || t.status === sv;
        const matchesDate = (!df || t.date >= df) && (!dt || t.date <= dt);
        return matchesQuery && matchesStatus && matchesDate;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-xs text-slate-400 italic">No inspection bookings matched.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(t => {
        const badge = statusBadgeClass(t.status);
        const managerText = t.assignedManager === 'Unassigned' 
          ? `<span class="text-slate-400 font-normal italic">Unassigned</span>` 
          : `<span class="text-slate-800 dark:text-slate-200 font-bold">${t.assignedManager}</span>`;

        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-sm font-semibold">
            <td class="p-3">
              <span class="block text-slate-900 dark:text-white font-bold cursor-pointer hover:underline" data-detail-booking-id="${t.id}">${t.name}</span>
              <span class="block text-[10px] text-slate-400 font-mono mt-0.5">${t.phone}</span>
            </td>
            <td class="p-3 text-xs text-slate-650 dark:text-slate-350 font-normal">${t.propertyTitle}</td>
            <td class="p-3 font-mono text-slate-500 text-xs">${t.date} ${t.time || ''}</td>
            <td class="p-3 font-mono text-slate-450 text-xs">${t.source}</td>
            <td class="p-3">${managerText}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badge}">${t.status}</span></td>
            <td class="p-3 text-right">
              <button data-detail-booking-id="${t.id}" class="bg-indigo-650 hover:bg-indigo-750 text-white font-bold py-1 px-2.5 rounded text-xs active:scale-98">Manage</button>
            </td>
          </tr>
        `;
      }).join('');
    }

    if (searchInp) searchInp.addEventListener('input', renderTableRows);
    if (statusFilter) statusFilter.addEventListener('change', renderTableRows);
    if (dateFrom) dateFrom.addEventListener('change', renderTableRows);
    if (dateTo) dateTo.addEventListener('change', renderTableRows);

    document.querySelector('#clear-ins-filters-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInp) searchInp.value = '';
      if (statusFilter) statusFilter.value = 'all';
      if (dateFrom) dateFrom.value = '';
      if (dateTo) dateTo.value = '';
      renderTableRows();
    });

    renderTableRows();

    // Booking Detail modal handlers
    const modal = document.querySelector('#booking-detail-modal');
    
    // Actions forms steps
    const secConfirm = document.querySelector('#section-ins-confirm');
    const secReschedule = document.querySelector('#section-ins-reschedule');
    const secCancel = document.querySelector('#section-ins-cancel');
    const secPostReport = document.querySelector('#section-ins-post-report');
    const actRow = document.querySelector('#booking-actions-row');

    let activeBooking = null;

    root.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-detail-booking-id]');
      if (openBtn && modal) {
        e.preventDefault();
        const id = parseInt(openBtn.getAttribute('data-detail-booking-id') || openBtn.dataset.detailBookingId);
        activeBooking = tours.find(item => item.id === id);

        if (activeBooking) {
          document.querySelector('#detail-ins-name').textContent = activeBooking.name;
          document.querySelector('#detail-ins-property').textContent = activeBooking.propertyTitle;
          document.querySelector('#detail-ins-contact').textContent = `${activeBooking.email} | ${activeBooking.phone}`;
          document.querySelector('#detail-ins-date').textContent = `${activeBooking.date} ${activeBooking.time || ''}`;
          document.querySelector('#detail-ins-notes').textContent = activeBooking.notes || 'No client commentary logged.';

          // Hide all step panels initially
          secConfirm?.classList.add('hidden');
          secReschedule?.classList.add('hidden');
          secCancel?.classList.add('hidden');
          secPostReport?.classList.add('hidden');
          actRow?.classList.remove('hidden');

          // Build staff managers select options
          const mgrSelect = document.querySelector('#ins-confirm-manager');
          if (mgrSelect) {
            const managersList = ['Obinna Okafor', 'Funmi Adebayo', 'Chidi Benson', 'Adewale Bashir'];
            mgrSelect.innerHTML = managersList.map(m => `<option value="${m}">${m}</option>`).join('');
          }

          // Renders action row buttons depending on status
          const actConfirm = document.querySelector('#act-confirm-btn');
          const actResched = document.querySelector('#act-reschedule-btn');
          const actComplete = document.querySelector('#act-complete-btn');
          const actCancel = document.querySelector('#act-cancel-btn');

          if (activeBooking.status === 'Pending') {
            actConfirm?.classList.remove('hidden');
            actResched?.classList.remove('hidden');
            actComplete?.classList.add('hidden');
            actCancel?.classList.remove('hidden');
          } else if (activeBooking.status === 'Confirmed') {
            actConfirm?.classList.add('hidden');
            actResched?.classList.remove('hidden');
            actComplete?.classList.remove('hidden');
            actCancel?.classList.remove('hidden');
          } else if (activeBooking.status === 'Completed') {
            // Already completed: render Post-Inspection Report Read-Only!
            actRow?.classList.add('hidden');
            secPostReport?.classList.remove('hidden');
            
            // Lock fields to read-only
            const r = activeBooking.postReport || { attended: 'Attended', leadStatus: 'Warm', feedback: 'No feedback', notes: '' };
            
            // Set values
            const radioAttended = document.querySelector(`input[name="ins-post-attended"][value="${r.attended}"]`);
            if (radioAttended) radioAttended.checked = true;
            document.querySelector('#ins-post-lead').value = r.leadStatus;
            document.querySelector('#ins-post-feedback').value = r.feedback;
            document.querySelector('#ins-post-notes').value = r.notes;

            // Make read-only
            document.querySelectorAll('input[name="ins-post-attended"]').forEach(el => el.disabled = true);
            document.querySelector('#ins-post-lead').disabled = true;
            document.querySelector('#ins-post-feedback').readOnly = true;
            document.querySelector('#ins-post-notes').readOnly = true;
            document.querySelector('#btn-post-report-submit').classList.add('hidden');
          } else {
            // Cancelled
            actRow?.classList.add('hidden');
          }

          modal.classList.remove('hidden');
        }
        return;
      }

      // Close modal
      if (e.target.closest('#close-booking-modal-btn')) {
        e.preventDefault();
        modal?.classList.add('hidden');
        activeBooking = null;
        return;
      }
    });

    // Action button clicks inside details
    document.querySelector('#act-confirm-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      secConfirm.classList.remove('hidden');
      secReschedule.classList.add('hidden');
      secCancel.classList.add('hidden');
      if (activeBooking) {
        document.querySelector('#ins-confirm-datetime').value = `${activeBooking.date}T${activeBooking.time || '10:00'}`;
      }
    });

    document.querySelector('#act-reschedule-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      secReschedule.classList.remove('hidden');
      secConfirm.classList.add('hidden');
      secCancel.classList.add('hidden');
      if (activeBooking) {
        document.querySelector('#ins-reschedule-datetime').value = `${activeBooking.date}T${activeBooking.time || '10:00'}`;
      }
    });

    document.querySelector('#act-cancel-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      secCancel.classList.remove('hidden');
      secConfirm.classList.add('hidden');
      secReschedule.classList.add('hidden');
    });

    // Submitting Scheduling confirmations
    document.querySelector('#btn-confirm-booking-submit')?.addEventListener('click', (e) => {
      e.preventDefault();
      const manager = document.querySelector('#ins-confirm-manager').value;
      const dt = document.querySelector('#ins-confirm-datetime').value;

      if (!manager || !dt) {
        alert('Site manager and final date details are required.');
        return;
      }

      const [dateVal, timeVal] = dt.split('T');
      if (activeBooking) {
        activeBooking.status = 'Confirmed';
        activeBooking.assignedManager = manager;
        activeBooking.date = dateVal;
        activeBooking.time = timeVal || '10:00';

        addAuditLog(`Confirmed inspection tour for ${activeBooking.name} and assigned manager ${manager}`, 'Inspections');
        alert(`Site visit confirmed successfully.\nConfirmation dispatch email sent to ${activeBooking.email}.`);
        
        modal?.classList.add('hidden');
        activeBooking = null;
        renderTableRows();
      }
    });

    // Submitting Reschedules
    document.querySelector('#btn-reschedule-booking-submit')?.addEventListener('click', (e) => {
      e.preventDefault();
      const dt = document.querySelector('#ins-reschedule-datetime').value;
      if (!dt) return;

      const [dateVal, timeVal] = dt.split('T');
      if (activeBooking) {
        activeBooking.date = dateVal;
        activeBooking.time = timeVal || '10:00';
        activeBooking.status = 'Pending';

        addAuditLog(`Rescheduled inspection booking for ${activeBooking.name} to ${dateVal}`, 'Inspections');
        alert('Booking date updated.');
        
        modal?.classList.add('hidden');
        activeBooking = null;
        renderTableRows();
      }
    });

    // Submitting Cancellations
    document.querySelector('#btn-cancel-booking-submit')?.addEventListener('click', (e) => {
      e.preventDefault();
      const reason = document.querySelector('#ins-cancel-reason').value.trim();
      if (!reason) {
        alert('Please specify a cancellation reason.');
        return;
      }

      if (activeBooking) {
        activeBooking.status = 'Cancelled';
        activeBooking.cancelReason = reason;

        addAuditLog(`Cancelled inspection booking for ${activeBooking.name}. Reason: ${reason}`, 'Inspections');
        alert('Inspection booking cancelled.');

        modal?.classList.add('hidden');
        activeBooking = null;
        renderTableRows();
      }
    });

    // Trigger complete report form
    document.querySelector('#act-complete-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      secPostReport.classList.remove('hidden');
      secConfirm.classList.add('hidden');
      secReschedule.classList.add('hidden');
      secCancel.classList.add('hidden');
      actRow.classList.add('hidden');

      // Reset fields for fresh entry
      document.querySelector('input[name="ins-post-attended"][value="Attended"]').checked = true;
      document.querySelector('#ins-post-lead').value = 'Warm';
      document.querySelector('#ins-post-feedback').value = '';
      document.querySelector('#ins-post-notes').value = '';
      
      document.querySelectorAll('input[name="ins-post-attended"]').forEach(el => el.disabled = false);
      document.querySelector('#ins-post-lead').disabled = false;
      document.querySelector('#ins-post-feedback').readOnly = false;
      document.querySelector('#ins-post-notes').readOnly = false;
      document.querySelector('#btn-post-report-submit').classList.remove('hidden');
    });

    // Submit Post report log
    document.querySelector('#btn-post-report-submit')?.addEventListener('click', (e) => {
      e.preventDefault();
      const attended = document.querySelector('input[name="ins-post-attended"]:checked').value;
      const leadStatus = document.querySelector('#ins-post-lead').value;
      const feedback = document.querySelector('#ins-post-feedback').value.trim();
      const internalNotes = document.querySelector('#ins-post-notes').value.trim();

      if (!feedback) {
        alert('Client feedback comments are required.');
        return;
      }

      if (activeBooking) {
        activeBooking.status = 'Completed';
        activeBooking.postReport = {
          attended,
          leadStatus,
          feedback,
          notes: internalNotes
        };

        addAuditLog(`Filed Post-Inspection report for client ${activeBooking.name}. Lead Status: ${leadStatus}`, 'Inspections');
        alert('Post-visit feedback report successfully logged.');

        modal?.classList.add('hidden');
        activeBooking = null;
        renderTableRows();
      }
    });
  }

  // 2. CALENDAR MONTH VIEW BINDERS
  if (activeTab === 'inspections-calendar') {
    const calendarDays = document.querySelector('#calendar-days-grid');
    const myInsToggle = document.querySelector('#cal-filter-my-inspections');

    // Assume the logged-in Site Manager is "Obinna Okafor" for demonstration
    const myManagerName = 'Obinna Okafor';

    function renderCalendar() {
      if (!calendarDays) return;

      const filterMyOnly = myInsToggle?.checked || false;
      const filteredTours = tours.filter(t => {
        if (t.status !== 'Confirmed' && t.status !== 'Completed') return false;
        if (filterMyOnly && t.assignedManager !== myManagerName) return false;
        return true;
      });

      // Build grid layout for July 2026 (Starts on a Wednesday: 3 empty prefix blocks)
      let daysHtml = '';
      
      // Prefix Wednesday offset
      for (let offset = 0; offset < 3; offset++) {
        daysHtml += `<div class="bg-slate-50/20 dark:bg-slate-900/10 min-h-[90px] border border-slate-200/20 rounded p-1"></div>`;
      }

      for (let day = 1; day <= 31; day++) {
        const dateStr = `2026-07-${String(day).padStart(2, '0')}`;
        const dayEvents = filteredTours.filter(t => t.date === dateStr);

        let eventsLogHtml = dayEvents.map(ev => {
          let colorClass = 'bg-blue-600/15 text-blue-700';
          if (ev.status === 'Completed') colorClass = 'bg-emerald-600/15 text-emerald-700';
          return `
            <div class="p-1 rounded text-[10px] ${colorClass} truncate mt-1 text-left font-bold" title="${ev.name} (${ev.assignedManager})">
              ${ev.name.split(' ')[0]}
            </div>
          `;
        }).join('');

        daysHtml += `
          <div class="min-h-[90px] bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 rounded p-1.5 flex flex-col justify-between hover:bg-slate-50/40">
            <span class="text-xs text-slate-400 font-bold self-start">${day}</span>
            <div class="flex-1 overflow-y-auto max-h-[60px] scrollbar-hide">
              ${eventsLogHtml}
            </div>
          </div>
        `;
      }

      calendarDays.innerHTML = daysHtml;
    }

    if (myInsToggle) {
      myInsToggle.addEventListener('change', renderCalendar);
    }

    renderCalendar();
  }
}
