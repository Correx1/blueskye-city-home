import supportTemplates from '../html/support.html?raw';

export function renderSupportTab(state) {
  return supportTemplates;
}

function ensureSupportState(state) {
  if (!state.admin.supportTickets) {
    state.admin.supportTickets = [
      {
        id: 101,
        requesterName: 'Florence Nduka',
        email: 'florence@domain.com',
        phone: '+23480392348',
        subject: 'Delay in Plot 12 Allocation letter receipt',
        source: 'Customer Portal',
        priority: 'High',
        status: 'Open',
        timeAgo: '2h ago',
        staffAssigned: 'Amina Bello',
        internalNotes: 'Contacted surveyor department. Checking layout validation logs.',
        messages: [
          { sender: 'customer', text: 'Good day. I made the full outright payment for my plot at Epe Oasis last week, but I have not received my official allocation document yet. Please advise.', time: '2h ago' }
        ]
      },
      {
        id: 102,
        requesterName: 'Kelechi Nnamdi',
        email: 'kelechi@domain.com',
        phone: '+23470899011',
        subject: 'Affiliate payout banking verification status',
        source: 'Affiliate Portal',
        priority: 'Medium',
        status: 'Pending',
        timeAgo: '5h ago',
        staffAssigned: 'Aliyu Bello',
        internalNotes: 'Wants cashout processed. KYC is verified, bank details need manual audit check.',
        messages: [
          { sender: 'customer', text: 'Hi, my withdrawal request has been pending for 3 days. I uploaded the correct banking details. Can you help verify?', time: '5h ago' }
        ]
      },
      {
        id: 103,
        requesterName: 'Tunde Bakare',
        email: 'tunde@domain.com',
        phone: '+23481234567',
        subject: 'Site visit coordination to Lekki Breeze',
        source: 'Public Contact Form',
        priority: 'Low',
        status: 'Resolved',
        timeAgo: '1d ago',
        staffAssigned: 'Amina Bello',
        internalNotes: 'Assigned to site manager Ade. Tour confirmed for Saturday.',
        messages: [
          { sender: 'customer', text: 'Hello, I want to book a physical inspection of plots at Lekki Breeze this weekend.', time: '1d ago' },
          { sender: 'staff', text: 'Hello Mr. Tunde, we have confirmed your booking and assigned a site manager. Details sent to your email.', time: '18h ago' }
        ]
      }
    ];
  }

  if (!state.admin.supportFaqs) {
    state.admin.supportFaqs = [
      { id: 1, question: 'What documents do I get after purchasing a plot?', answer: 'You will receive a provisional allocation letter, receipt of payment, contract of sale, and eventually a registered survey plan and deed of assignment.', category: 'Purchasing Land', order: 1 },
      { id: 2, question: 'How do lifetime downline commissions work?', answer: 'You earn Gen 1 direct commissions from direct referrals. If your direct recruit invites others, they become Gen 2. You earn Gen 2 network commissions from their sales.', category: 'Affiliates & Commission', order: 2 },
      { id: 3, question: 'Can I pay in monthly installments?', answer: 'Yes, we offer flexible 3-month, 6-month, and 12-month installment payment plan brackets on available property portfolios.', category: 'Installments Payments', order: 3 }
    ];
  }

  if (!state.admin.supportActiveSubtab) state.admin.supportActiveSubtab = 'inbox';
  if (!state.admin.supportActiveStatusTab) state.admin.supportActiveStatusTab = 'all';
}

export function bindSupportTabListeners(state, root, addAuditLog, initAdminTab, renderApp) {
  ensureSupportState(state);

  const subtab = state.admin.supportActiveSubtab;
  const tickets = state.admin.supportTickets;
  const faqs = state.admin.supportFaqs;

  // Viewport toggles
  const vInbox = document.querySelector('#viewport-support-inbox');
  const vFaqs = document.querySelector('#viewport-support-faqs');

  if (vInbox && vFaqs) {
    if (subtab === 'inbox') {
      vInbox.classList.remove('hidden');
      vFaqs.classList.add('hidden');
    } else {
      vInbox.classList.add('hidden');
      vFaqs.classList.remove('hidden');
    }
  }

  // Active Subtabs Nav stylings
  const btnInboxTab = document.querySelector('#btn-support-inbox-tab');
  const btnFaqsTab = document.querySelector('#btn-support-faqs-tab');

  if (btnInboxTab && btnFaqsTab) {
    btnInboxTab.className = "pb-1.5 border-b-2 border-transparent text-slate-400 hover:text-slate-655 font-display uppercase tracking-wider";
    btnFaqsTab.className = "pb-1.5 border-b-2 border-transparent text-slate-400 hover:text-slate-655 font-display uppercase tracking-wider";

    if (subtab === 'inbox') btnInboxTab.className = "pb-1.5 border-b-2 border-blue-600 text-blue-600 font-display uppercase tracking-wider";
    else btnFaqsTab.className = "pb-1.5 border-b-2 border-blue-600 text-blue-600 font-display uppercase tracking-wider";
  }

  // --- 1. VIEWPORT: TICKET INBOX & DETAILS ---
  if (subtab === 'inbox') {
    const searchInp = document.querySelector('#ticket-search-input');
    const sourceFilter = document.querySelector('#filter-ticket-source');
    const priorityFilter = document.querySelector('#filter-ticket-priority');
    const staffFilter = document.querySelector('#filter-ticket-staff');
    const listContainer = document.querySelector('#ticket-list-container');

    const detailPlaceholder = document.querySelector('#ticket-detail-placeholder');
    const detailViewport = document.querySelector('#ticket-detail-viewport');

    // Handle ticket inner status tabs styling
    const statusTab = state.admin.supportActiveStatusTab;
    document.querySelectorAll('[data-ticket-status-tab]').forEach(btn => {
      btn.className = "pb-1 border-b-2 border-transparent hover:text-slate-700 text-slate-400";
      if (btn.getAttribute('data-ticket-status-tab') === statusTab) {
        btn.className = "pb-1 border-b-2 border-indigo-600 text-indigo-650";
      }
    });

    function renderTicketsList() {
      if (!listContainer) return;

      const q = (searchInp?.value || '').toLowerCase().trim();
      const sc = sourceFilter?.value || 'all';
      const pr = priorityFilter?.value || 'all';
      const sf = staffFilter?.value || 'all';

      const filtered = tickets.filter(t => {
        const matchesQuery = !q || [t.requesterName, t.subject, t.email].join(' ').toLowerCase().includes(q);
        const matchesStatus = statusTab === 'all' || t.status === statusTab;
        const matchesSource = sc === 'all' || t.source === sc;
        const matchesPriority = pr === 'all' || t.priority === pr;
        const matchesStaff = sf === 'all' || t.staffAssigned === sf || (sf === 'Unassigned' && !t.staffAssigned);
        
        return matchesQuery && matchesStatus && matchesSource && matchesPriority && matchesStaff;
      });

      if (filtered.length === 0) {
        listContainer.innerHTML = `<div class="p-6 text-center text-xs text-slate-450 italic font-medium">No tickets matched.</div>`;
        return;
      }

      listContainer.innerHTML = filtered.map(t => {
        const isSelected = t.id === state.admin.supportSelectedTicketId;
        const selectClass = isSelected ? 'bg-indigo-50/50 dark:bg-slate-850/40 border-l-4 border-indigo-600' : 'hover:bg-slate-50 dark:hover:bg-slate-850/10';
        
        let priorityClass = 'bg-slate-100 text-slate-655';
        if (t.priority === 'High' || t.priority === 'Urgent') priorityClass = 'bg-rose-500/10 text-rose-650';
        else if (t.priority === 'Medium') priorityClass = 'bg-amber-500/10 text-amber-600';

        let statusClass = 'bg-slate-100 text-slate-550';
        if (t.status === 'Open') statusClass = 'bg-blue-500/10 text-blue-650';
        else if (t.status === 'Pending') statusClass = 'bg-purple-500/10 text-purple-600';
        else if (t.status === 'Resolved') statusClass = 'bg-emerald-500/10 text-emerald-650';

        const lastMsg = t.messages[t.messages.length - 1]?.text || '';
        const preview = lastMsg.length > 50 ? lastMsg.substring(0, 50) + '...' : lastMsg;

        return `
          <div data-ticket-id="${t.id}" class="p-3 cursor-pointer border-b border-slate-100 dark:border-slate-850 transition-all ${selectClass} text-xs font-semibold">
            <div class="flex items-center justify-between mb-1">
              <span class="font-extrabold text-slate-900 dark:text-white">${t.requesterName}</span>
              <span class="font-mono text-[9px] text-slate-400 font-normal">${t.timeAgo}</span>
            </div>
            <p class="text-[11px] text-slate-850 dark:text-slate-200 font-extrabold truncate w-[260px]">${t.subject}</p>
            <p class="text-[10px] text-slate-450 font-normal mt-0.5 truncate w-[260px]">${preview}</p>
            <div class="flex items-center gap-1.5 mt-2 flex-wrap">
              <span class="px-1.5 py-0.2 rounded text-[8px] uppercase tracking-wider font-bold bg-slate-100 text-slate-500">${t.source}</span>
              <span class="px-1.5 py-0.2 rounded text-[8px] uppercase tracking-wider font-bold ${priorityClass}">${t.priority}</span>
              <span class="px-1.5 py-0.2 rounded text-[8px] uppercase tracking-wider font-bold ${statusClass}">${t.status}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    if (searchInp) searchInp.addEventListener('input', renderTicketsList);
    if (sourceFilter) sourceFilter.addEventListener('change', renderTicketsList);
    if (priorityFilter) priorityFilter.addEventListener('change', renderTicketsList);
    if (staffFilter) staffFilter.addEventListener('change', renderTicketsList);

    renderTicketsList();

    // Select ticket row click trigger
    root.addEventListener('click', (e) => {
      const row = e.target.closest('[data-ticket-id]');
      if (row) {
        e.preventDefault();
        const id = parseInt(row.getAttribute('data-ticket-id'));
        state.admin.supportSelectedTicketId = id;
        renderTicketsList();
        renderTicketDetail();
      }
    });

    // Inner status Tab triggers
    root.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('[data-ticket-status-tab]');
      if (tabBtn) {
        e.preventDefault();
        state.admin.supportActiveStatusTab = tabBtn.getAttribute('data-ticket-status-tab');
        initAdminTab('support-helpdesk');
      }
    });

    function renderTicketDetail() {
      const selectedId = state.admin.supportSelectedTicketId;
      if (!selectedId) {
        detailPlaceholder?.classList.remove('hidden');
        detailViewport?.classList.add('hidden');
        return;
      }

      const t = tickets.find(x => x.id === selectedId);
      if (!t) return;

      detailPlaceholder?.classList.add('hidden');
      detailViewport?.classList.remove('hidden');

      // Populate header info
      document.querySelector('#tkt-det-name').textContent = t.requesterName;
      document.querySelector('#tkt-det-contacts').textContent = `${t.email} • ${t.phone} • Source: ${t.source}`;

      // Wire profile navigation redirect link if exists (direct redirect link)
      const linkBadge = document.querySelector('#tkt-det-profile-badge-link');
      if (linkBadge) {
        linkBadge.onclick = (e) => {
          e.preventDefault();
          // Find customer by email or name match
          const client = state.customers?.find(c => c.email === t.email || c.name.toLowerCase() === t.requesterName.toLowerCase());
          if (client) {
            state.admin.customerDetailId = client.id;
            state.admin.activeTab = 'customers';
            initAdminTab('customers');
          } else {
            // Find affiliate partner
            const aff = state.partners?.find(p => p.email === t.email || p.name.toLowerCase() === t.requesterName.toLowerCase());
            if (aff) {
              state.admin.partnerDetailId = aff.id;
              state.admin.activeTab = 'partners-directory';
              initAdminTab('partners-directory');
            } else {
              alert('No registered Customer or Affiliate profile matches this email.');
            }
          }
        };
      }

      // Populate right sidebar controls
      document.querySelector('#tkt-meta-status').value = t.status;
      document.querySelector('#tkt-meta-priority').value = t.priority;
      document.querySelector('#tkt-meta-staff').value = t.staffAssigned || 'Unassigned';
      document.querySelector('#tkt-meta-internal-note-content').textContent = t.internalNotes || 'No internal team notes logged.';

      // Render conversation timeline chat bubbles
      const timeline = document.querySelector('#tkt-messages-timeline');
      if (timeline) {
        timeline.innerHTML = t.messages.map(m => {
          const isStaff = m.sender === 'staff';
          const bubbleBg = isStaff ? 'bg-indigo-600 text-white ml-auto' : 'bg-slate-100 dark:bg-slate-800 text-slate-850 dark:text-white mr-auto';
          const senderName = isStaff ? 'Platform Support Coordinator' : t.requesterName;
          
          return `
            <div class="max-w-[85%] rounded-lg p-2.5 shadow-xs ${bubbleBg} text-xs font-semibold leading-relaxed">
              <div class="flex items-center justify-between gap-6 mb-1 text-[8px] font-bold ${isStaff ? 'text-white/70' : 'text-slate-400'}">
                <span>${senderName}</span>
                <span class="font-mono">${m.time || 'just now'}</span>
              </div>
              <p class="font-normal text-[11px]">${m.text}</p>
            </div>
          `;
        }).join('');
        // Scroll to bottom
        timeline.scrollTop = timeline.scrollHeight;
      }
    }

    // Reply dispatch send click
    document.querySelector('#btn-tkt-send-reply')?.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedId = state.admin.supportSelectedTicketId;
      if (!selectedId) return;

      const t = tickets.find(x => x.id === selectedId);
      const text = document.querySelector('#tkt-reply-body').value.trim();
      if (!text || !t) return;

      t.messages.push({
        sender: 'staff',
        text: text,
        time: 'Just now'
      });
      // Move status to pending since staff responded
      if (t.status === 'Open') {
        t.status = 'Pending';
        addAuditLog(`Replied to ticket #${t.id} and set status to Pending`, 'Helpdesk');
      } else {
        addAuditLog(`Sent correspondence reply message to ticket #${t.id}`, 'Helpdesk');
      }

      document.querySelector('#tkt-reply-body').value = '';
      renderTicketDetail();
      renderTicketsList();
    });

    // Save Internal Staff note
    document.querySelector('#btn-tkt-save-internal-note')?.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedId = state.admin.supportSelectedTicketId;
      if (!selectedId) return;

      const t = tickets.find(x => x.id === selectedId);
      const noteText = document.querySelector('#tkt-meta-internal-note-textarea').value.trim();
      if (!noteText || !t) return;

      t.internalNotes = noteText;
      addAuditLog(`Saved internal staff comment log to ticket #${t.id}`, 'Helpdesk');
      document.querySelector('#tkt-meta-internal-note-textarea').value = '';
      renderTicketDetail();
      alert('Internal note saved.');
    });

    // Meta selects change triggers
    document.querySelector('#tkt-meta-status')?.addEventListener('change', (e) => {
      const selectedId = state.admin.supportSelectedTicketId;
      if (!selectedId) return;
      const t = tickets.find(x => x.id === selectedId);
      if (t) {
        const old = t.status;
        t.status = e.target.value;
        addAuditLog(`Updated status of ticket #${t.id} from ${old} to ${t.status}`, 'Helpdesk');
        renderTicketsList();
      }
    });

    document.querySelector('#tkt-meta-priority')?.addEventListener('change', (e) => {
      const selectedId = state.admin.supportSelectedTicketId;
      if (!selectedId) return;
      const t = tickets.find(x => x.id === selectedId);
      if (t) {
        t.priority = e.target.value;
        addAuditLog(`Updated priority of ticket #${t.id} to ${t.priority}`, 'Helpdesk');
        renderTicketsList();
      }
    });

    document.querySelector('#tkt-meta-staff')?.addEventListener('change', (e) => {
      const selectedId = state.admin.supportSelectedTicketId;
      if (!selectedId) return;
      const t = tickets.find(x => x.id === selectedId);
      if (t) {
        t.staffAssigned = e.target.value;
        addAuditLog(`Assigned staff member "${t.staffAssigned}" to ticket #${t.id}`, 'Helpdesk');
        renderTicketsList();
      }
    });

    // Resolve quick action button
    document.querySelector('#btn-tkt-mark-resolved')?.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedId = state.admin.supportSelectedTicketId;
      if (!selectedId) return;
      const t = tickets.find(x => x.id === selectedId);
      if (t) {
        t.status = 'Resolved';
        addAuditLog(`Quick resolved helpdesk ticket #${t.id}`, 'Helpdesk');
        renderTicketDetail();
        renderTicketsList();
        alert('Ticket marked as Resolved.');
      }
    });

    // Close Ticket action
    document.querySelector('#btn-tkt-close')?.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedId = state.admin.supportSelectedTicketId;
      if (!selectedId) return;
      const t = tickets.find(x => x.id === selectedId);
      if (t) {
        if (t.status !== 'Resolved' && !confirm('Warning: This ticket is not Resolved yet. Close anyway?')) {
          return;
        }
        t.status = 'Closed';
        addAuditLog(`Closed helpdesk ticket #${t.id}`, 'Helpdesk');
        renderTicketDetail();
        renderTicketsList();
        alert('Ticket closed.');
      }
    });

    renderTicketDetail();
  }

  // --- 2. VIEWPORT: FAQ MANAGEMENT ---
  if (subtab === 'faqs') {
    const tbody = document.querySelector('#support-faqs-tbody');

    const faqModal = document.querySelector('#support-faq-form-modal');
    const faqForm = document.querySelector('#support-faq-composer-form');
    const faqModalTitle = document.querySelector('#faq-modal-title');

    let activeFaqId = null;

    function renderFaqsTable() {
      if (!tbody) return;

      tbody.innerHTML = faqs.map(f => `
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-xs font-semibold">
          <td class="p-3 font-mono font-bold text-center">${f.order}</td>
          <td class="p-3 text-slate-500 font-bold">${f.category}</td>
          <td class="p-3 text-slate-900 dark:text-white font-extrabold w-[300px] leading-snug">${f.question}</td>
          <td class="p-3 text-slate-655 dark:text-slate-350 font-normal w-[400px] leading-relaxed">${f.answer}</td>
          <td class="p-3 text-right space-x-1.5">
            <button data-edit-faq="${f.id}" class="text-indigo-650 hover:underline">Edit</button>
            <button data-delete-faq="${f.id}" class="text-rose-600 hover:underline">Delete</button>
          </td>
        </tr>
      `).join('');
    }

    // Modal triggers Add FAQ
    document.querySelector('#btn-support-add-faq')?.addEventListener('click', (e) => {
      e.preventDefault();
      activeFaqId = null;
      faqModalTitle.textContent = 'Create FAQ Entry';
      faqForm.reset();
      // Auto pre-fill display order based on length
      document.querySelector('#faq-form-order').value = faqs.length + 1;
      faqModal?.classList.remove('hidden');
    });

    document.querySelector('#close-support-faq-modal-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      faqModal?.classList.add('hidden');
    });

    // Row edit triggers
    root.addEventListener('click', (e) => {
      const editBtn = e.target.closest('[data-edit-faq]');
      if (editBtn) {
        e.preventDefault();
        const id = parseInt(editBtn.getAttribute('data-edit-faq'));
        const f = faqs.find(x => x.id === id);
        if (f) {
          activeFaqId = id;
          faqModalTitle.textContent = 'Edit FAQ Entry';
          
          document.querySelector('#faq-form-category').value = f.category;
          document.querySelector('#faq-form-order').value = f.order;
          document.querySelector('#faq-form-question').value = f.question;
          document.querySelector('#faq-form-answer').value = f.answer;

          faqModal?.classList.remove('hidden');
        }
      }
    });

    // Row delete FAQ entry
    root.addEventListener('click', (e) => {
      const delBtn = e.target.closest('[data-delete-faq]');
      if (delBtn) {
        e.preventDefault();
        const id = parseInt(delBtn.getAttribute('data-delete-faq'));
        const idx = faqs.findIndex(x => x.id === id);
        if (idx !== -1 && confirm('Are you sure you want to delete this FAQ entry?')) {
          const removed = faqs.splice(idx, 1)[0];
          addAuditLog(`Deleted FAQ entry: "${removed.question}"`, 'Helpdesk');
          renderFaqsTable();
        }
      }
    });

    // FAQ Form submit save
    if (faqForm) {
      faqForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.querySelector('#faq-form-category').value;
        const order = parseInt(document.querySelector('#faq-form-order').value);
        const question = document.querySelector('#faq-form-question').value.trim();
        const answer = document.querySelector('#faq-form-answer').value.trim();

        if (activeFaqId === null) {
          // Add new FAQ
          const newFaq = {
            id: faqs.length > 0 ? Math.max(...faqs.map(x => x.id)) + 1 : 1,
            question,
            answer,
            category,
            order
          };
          faqs.push(newFaq);
          addAuditLog(`Created new FAQ guide entry: "${question}"`, 'Helpdesk');
          alert('FAQ entry created successfully.');
        } else {
          // Edit FAQ
          const f = faqs.find(x => x.id === activeFaqId);
          if (f) {
            f.category = category;
            f.order = order;
            f.question = question;
            f.answer = answer;
            addAuditLog(`Updated FAQ details for entry "${question}"`, 'Helpdesk');
            alert('FAQ entry details updated.');
          }
        }

        faqModal?.classList.add('hidden');
        renderFaqsTable();
        renderApp();
      });
    }

    renderFaqsTable();
  }

  // --- Subtabs switches click triggers ---
  document.querySelector('#btn-support-inbox-tab')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.admin.supportActiveSubtab = 'inbox';
    initAdminTab('support-helpdesk');
  });

  document.querySelector('#btn-support-faqs-tab')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.admin.supportActiveSubtab = 'faqs';
    initAdminTab('support-helpdesk');
  });
}
