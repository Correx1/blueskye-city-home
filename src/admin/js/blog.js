import blogTemplates from '../html/blog.html?raw';

function getSection(name) {
  const startMarker = `data-section="${name}"`;
  const startIdx = blogTemplates.indexOf(startMarker);
  if (startIdx === -1) return '';
  const divStart = blogTemplates.lastIndexOf('<div', startIdx);
  const endMarker = `END SECTION: ${name}`;
  const endCommentIdx = blogTemplates.indexOf(endMarker, startIdx);
  if (endCommentIdx === -1) return '';
  const closingDiv = blogTemplates.lastIndexOf('</div>', endCommentIdx);
  if (closingDiv === -1) return '';
  return blogTemplates.slice(divStart, closingDiv + 6);
}

function ensureTaxonomyState(state, blogs) {
  if (!state.admin.blogCategories) {
    state.admin.blogCategories = [
      { id: 1, name: 'Market Updates', slug: 'market-updates' },
      { id: 2, name: 'Investment Guides', slug: 'investment-guides' },
      { id: 3, name: 'Company News', slug: 'company-news' }
    ];
  }
  if (!state.admin.blogTags) {
    state.admin.blogTags = [
      { id: 1, name: 'Real Estate', slug: 'real-estate' },
      { id: 2, name: 'Lekki Land', slug: 'lekki-land' },
      { id: 3, name: 'Finance', slug: 'finance' }
    ];
  }
  if (!state.admin.blogViewMode) state.admin.blogViewMode = 'list';
  if (!state.admin.blogSubtabActive) state.admin.blogSubtabActive = 'posts';
  if (!state.admin.blogSelectedTags) state.admin.blogSelectedTags = [];

  // Align blogs list with fields defaults (Status, category, views etc.)
  blogs.forEach(b => {
    if (!b.status) b.status = 'Published';
    if (!b.category) b.category = 'Investment Guides';
    if (b.views === undefined) b.views = Math.floor(Math.random() * 450) + 50;
    if (!b.tags) b.tags = ['Real Estate'];
  });
}

// 1. MASTER ROUTERS
export function renderWriteArticlesTab(state) {
  return getSection('write-articles-template');
}

// Re-map old individual imports if requested
export function renderNewsSubscribersTab(state) {
  return getSection('news-subscribers-template');
}

export function renderContactMessagesTab(state) {
  const msgs = state.admin.contactMessages || [];
  let html = getSection('contact-inquiries-template');

  const rows = msgs.map(m => `
    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
      <td class="p-3">
        <span class="block font-bold text-slate-900 dark:text-white">${m.name}</span>
        <span class="block text-[10px] text-slate-400 font-mono mt-0.5">${m.email}</span>
      </td>
      <td class="p-3 text-slate-655 dark:text-slate-350 max-w-sm font-normal">${m.message}</td>
      <td class="p-3 text-slate-450">${m.date}</td>
      <td class="p-3 text-right">
        <button data-archive-msg="${m.id}" class="text-slate-400 hover:text-slate-600 font-bold">Archive</button>
      </td>
    </tr>
  `).join('');

  return html.replace('<!-- DYNAMIC CONTACT INQUIRIES -->', rows);
}

// --- Bind Blog Events Listeners ---
export function bindBlogTabListeners(state, root, addAuditLog, initAdminTab, blogs, renderApp) {
  ensureTaxonomyState(state, blogs);
  const activeTab = state.admin.activeTab;

  // 0b. Newsletter Broadcast Subscriptions & Campaigns Hub
  if (activeTab === 'blog-subscribers') {
    // Ensure state
    if (!state.admin.subscribersList) {
      state.admin.subscribersList = [
        { id: 1, name: 'Florence Nduka', email: 'florence@domain.com', source: 'Website signup', date: '2026-07-12', status: 'Subscribed' },
        { id: 2, name: 'Kelechi Nnamdi', email: 'kelechi@domain.com', source: 'Customer', date: '2026-07-10', status: 'Subscribed' },
        { id: 3, name: 'Amara Nwosu', email: 'amara@domain.com', source: 'Affiliate', date: '2026-07-08', status: 'Subscribed' },
        { id: 4, name: 'Tunde Bakare', email: 'tunde@domain.com', source: 'Manually added', date: '2026-07-05', status: 'Unsubscribed' }
      ];
    }
    if (!state.admin.campaignsList) {
      state.admin.campaignsList = [
        {
          id: 1,
          name: 'July Sales Launch promo',
          subject: 'Claim 10% Discount on Epe Oasis Plots!',
          sentDate: '2026-07-14 11:30',
          recipientsCount: 3,
          status: 'Sent',
          openRate: '75%',
          clickRate: '25%',
          body: 'Check out our new site release...'
        }
      ];
    }
    if (!state.admin.newsSubtabActive) state.admin.newsSubtabActive = 'subscribers';

    const subtab = state.admin.newsSubtabActive;
    const subs = state.admin.subscribersList;
    const camps = state.admin.campaignsList;

    // Adjust Viewports visibility
    const vSub = document.querySelector('#viewport-news-subscribers');
    const vCompose = document.querySelector('#viewport-news-compose');
    const vHist = document.querySelector('#viewport-news-history');

    if (vSub && vCompose && vHist) {
      vSub.classList.add('hidden');
      vCompose.classList.add('hidden');
      vHist.classList.add('hidden');

      if (subtab === 'subscribers') vSub.classList.remove('hidden');
      else if (subtab === 'compose') vCompose.classList.remove('hidden');
      else if (subtab === 'history') vHist.classList.remove('hidden');
    }

    // Render Subtabs style highlights
    const btnSub = document.querySelector('#btn-news-subscribers-tab');
    const btnCompose = document.querySelector('#btn-news-compose-tab');
    const btnHist = document.querySelector('#btn-news-history-tab');

    if (btnSub && btnCompose && btnHist) {
      [btnSub, btnCompose, btnHist].forEach(el => {
        el.className = "pb-1.5 border-b-2 border-transparent text-slate-400 hover:text-slate-655 font-display uppercase tracking-wider";
      });
      if (subtab === 'subscribers') btnSub.className = "pb-1.5 border-b-2 border-blue-600 text-blue-600 font-display uppercase tracking-wider";
      else if (subtab === 'compose') btnCompose.className = "pb-1.5 border-b-2 border-blue-600 text-blue-600 font-display uppercase tracking-wider";
      else if (subtab === 'history') btnHist.className = "pb-1.5 border-b-2 border-blue-600 text-blue-600 font-display uppercase tracking-wider";
    }

    // --- SUB-VIEW A: SUBSCRIBERS DIRECTORY ---
    if (subtab === 'subscribers') {
      const searchInp = document.querySelector('#news-sub-search');
      const sourceFilter = document.querySelector('#filter-news-sub-source');
      const statusFilter = document.querySelector('#filter-news-sub-status');
      const tbody = document.querySelector('#news-subscribers-tbody');

      function renderSubsTable() {
        const q = (searchInp?.value || '').toLowerCase().trim();
        const sc = sourceFilter?.value || 'all';
        const st = statusFilter?.value || 'all';

        const filtered = subs.filter(x => {
          const matchesQuery = !q || [x.name, x.email].join(' ').toLowerCase().includes(q);
          const matchesSource = sc === 'all' || x.source === sc;
          const matchesStatus = st === 'all' || x.status === st;
          return matchesQuery && matchesSource && matchesStatus;
        });

        // Set metrics counts
        const totalActive = subs.filter(x => x.status === 'Subscribed').length;
        const totalUnsub = subs.filter(x => x.status === 'Unsubscribed').length;

        document.querySelector('#news-sub-total-count').textContent = totalActive;
        document.querySelector('#news-sub-unsub-count').textContent = totalUnsub;

        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-xs text-slate-400 italic">No subscribers records matched.</td></tr>`;
          return;
        }

        tbody.innerHTML = filtered.map(x => {
          const badgeStyle = x.status === 'Subscribed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' : 'bg-rose-500/10 text-rose-650';
          const sourceBadge = x.source === 'Customer' ? 'bg-blue-500/10 text-blue-605' :
                              x.source === 'Affiliate' ? 'bg-purple-500/10 text-purple-600' : 'bg-slate-100 text-slate-550';
          
          return `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-xs font-semibold">
              <td class="p-3 text-slate-900 dark:text-white font-bold">${x.name || '<span class="text-slate-400 font-normal italic">Anonymous</span>'}</td>
              <td class="p-3 font-mono text-slate-500">${x.email}</td>
              <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${sourceBadge}">${x.source}</span></td>
              <td class="p-3 font-mono text-slate-450">${x.date}</td>
              <td class="p-3 text-right"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeStyle}">${x.status}</span></td>
            </tr>
          `;
        }).join('');
      }

      if (searchInp) searchInp.addEventListener('input', renderSubsTable);
      if (sourceFilter) sourceFilter.addEventListener('change', renderSubsTable);
      if (statusFilter) statusFilter.addEventListener('change', renderSubsTable);

      // Manual Add Subscriber Modal Flow
      const manualModal = document.querySelector('#news-add-sub-modal');
      const manualForm = document.querySelector('#news-add-sub-form');

      document.querySelector('#btn-news-sub-add-manual')?.addEventListener('click', (e) => {
        e.preventDefault();
        manualModal?.classList.remove('hidden');
      });

      document.querySelector('#close-news-add-sub-modal-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        manualModal?.classList.add('hidden');
      });

      if (manualForm) {
        manualForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.querySelector('#news-form-sub-name').value.trim();
          const email = document.querySelector('#news-form-sub-email').value.trim();
          if (!email) return;

          const newSub = {
            id: subs.length + 1,
            name,
            email,
            source: 'Manually added',
            date: new Date().toISOString().substring(0, 10),
            status: 'Subscribed'
          };
          subs.unshift(newSub);
          addAuditLog(`Manually registered new newsletter subscriber: ${email}`, 'Newsletter');
          alert(`Subscriber added successfully.`);
          
          manualModal?.classList.add('hidden');
          manualForm.reset();
          renderSubsTable();
        });
      }

      // CSV Bulk Import Modal Flow
      const csvModal = document.querySelector('#news-csv-import-modal');
      const fileInput = document.querySelector('#news-csv-file-input');
      const fileLabel = document.querySelector('#news-csv-file-label');
      const uploadStep = document.querySelector('#csv-upload-step');
      const previewStep = document.querySelector('#csv-preview-step');
      const previewTbody = document.querySelector('#csv-preview-tbody');

      let mockImportList = [];

      document.querySelector('#btn-news-sub-import-csv')?.addEventListener('click', (e) => {
        e.preventDefault();
        // Reset modal steps
        uploadStep?.classList.remove('hidden');
        previewStep?.classList.add('hidden');
        if (fileLabel) fileLabel.textContent = 'No file chosen';
        csvModal?.classList.remove('hidden');
      });

      document.querySelector('#close-news-csv-modal-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        csvModal?.classList.add('hidden');
      });

      document.querySelector('#btn-trigger-news-csv')?.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput?.click();
      });

      fileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        fileLabel.textContent = file.name;
        
        // Mock CSV parse rows
        mockImportList = [
          { name: 'Obinna Diala', email: 'obinna@diala.com' },
          { name: 'Grace Adebayo', email: 'grace@adebayo.com' },
          { name: 'Segun Coker', email: 'segun@coker.com' }
        ];

        // Render mock preview
        previewTbody.innerHTML = mockImportList.map(r => `
          <tr class="text-xs font-semibold border-b border-slate-100 dark:border-slate-800">
            <td class="p-2 text-slate-800 dark:text-white">${r.name}</td>
            <td class="p-2 font-mono text-slate-450">${r.email}</td>
          </tr>
        `).join('');

        uploadStep?.classList.add('hidden');
        previewStep?.classList.remove('hidden');
      });

      document.querySelector('#btn-confirm-csv-import')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (mockImportList.length > 0) {
          mockImportList.forEach(r => {
            if (!subs.some(x => x.email === r.email)) {
              subs.unshift({
                id: subs.length + 1,
                name: r.name,
                email: r.email,
                source: 'Manually added',
                date: new Date().toISOString().substring(0, 10),
                status: 'Subscribed'
              });
            }
          });

          addAuditLog(`Bulk imported ${mockImportList.length} newsletter subscribers via CSV`, 'Newsletter');
          alert(`Successfully imported ${mockImportList.length} subscribers.`);
          
          csvModal?.classList.add('hidden');
          mockImportList = [];
          renderSubsTable();
          renderApp();
        }
      });

      renderSubsTable();
    }

    // --- SUB-VIEW B: COMPOSE CAMPAIGN ---
    if (subtab === 'compose') {
      const form = document.querySelector('#news-campaign-composer-form');
      const contentInp = document.querySelector('#campaign-form-content');
      
      const optSchedule = document.querySelector('input[name="camp-send-option"][value="schedule"]');
      const optNow = document.querySelector('input[name="camp-send-option"][value="now"]');
      const timeBox = document.querySelector('#sec-campaign-schedule-time');

      // Schedule options toggles
      document.querySelectorAll('input[name="camp-send-option"]').forEach(radio => {
        radio.addEventListener('change', () => {
          if (optSchedule?.checked) timeBox.classList.remove('hidden');
          else timeBox.classList.add('hidden');
        });
      });

      // Toolbar mock buttons
      document.querySelectorAll('[data-camp-tool]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const tool = btn.getAttribute('data-camp-tool');
          const start = contentInp.selectionStart;
          const end = contentInp.selectionEnd;
          const text = contentInp.value;
          const selected = text.substring(start, end);

          let wrapper = '';
          if (tool === 'bold') wrapper = `**${selected || 'bold text'}**`;
          else if (tool === 'italic') wrapper = `*${selected || 'italic text'}*`;
          else if (tool === 'heading') wrapper = `\n## ${selected || 'Heading H2'}\n`;
          else if (tool === 'list') wrapper = `\n- ${selected || 'List item'}\n`;
          else if (tool === 'link') wrapper = `[${selected || 'Link Text'}](https://example.com)`;

          contentInp.value = text.substring(0, start) + wrapper + text.substring(end);
          contentInp.focus();
        });
      });

      // Test email modal flows
      const testModal = document.querySelector('#news-test-send-modal');
      const testForm = document.querySelector('#news-test-send-form');

      document.querySelector('#btn-campaign-test-send')?.addEventListener('click', (e) => {
        e.preventDefault();
        testModal?.classList.remove('hidden');
      });

      document.querySelector('#close-news-test-modal-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        testModal?.classList.add('hidden');
      });

      if (testForm) {
        testForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const testEmail = document.querySelector('#news-test-email').value.trim();
          if (testEmail) {
            alert(`Test broadcast email successfully sent to: ${testEmail}`);
            testModal?.classList.add('hidden');
            testForm.reset();
          }
        });
      }

      // Campaign submit dispatch handler
      if (form) {
        // Pre-fill duplicates if state carries cached compose properties
        if (state.admin.newsletterDuplicateCache) {
          const cache = state.admin.newsletterDuplicateCache;
          document.querySelector('#campaign-form-name').value = `Copy of ${cache.name}`;
          document.querySelector('#campaign-form-subject').value = cache.subject;
          contentInp.value = cache.body;
          document.querySelector('#campaign-form-segment').value = cache.segment;
          // Clear cache
          state.admin.newsletterDuplicateCache = null;
        }

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.querySelector('#campaign-form-name').value.trim();
          const subject = document.querySelector('#campaign-form-subject').value.trim();
          const body = contentInp.value.trim();
          const segment = document.querySelector('#campaign-form-segment').value;
          const sendOpt = document.querySelector('input[name="camp-send-option"]:checked').value;
          const schedTime = sendOpt === 'schedule' ? document.querySelector('#campaign-form-scheduletime').value : '';

          if (sendOpt === 'schedule' && !schedTime) {
            alert('Please select a scheduled date and time.');
            return;
          }

          // Compute segment recipients count
          let count = subs.filter(x => x.status === 'Subscribed').length;
          if (segment === 'Customer') {
            count = subs.filter(x => x.source === 'Customer' && x.status === 'Subscribed').length;
          } else if (segment === 'Affiliate') {
            count = subs.filter(x => x.source === 'Affiliate' && x.status === 'Subscribed').length;
          }

          const status = sendOpt === 'schedule' ? 'Scheduled' : 'Sent';
          const sentDate = sendOpt === 'schedule' ? schedTime.replace('T', ' ') : new Date().toISOString().replace('T', ' ').substring(0, 16);

          const newCamp = {
            id: camps.length + 1,
            name,
            subject,
            sentDate,
            recipientsCount: count,
            status,
            openRate: status === 'Sent' ? '68%' : '—',
            clickRate: status === 'Sent' ? '18%' : '—',
            body,
            segment
          };

          camps.unshift(newCamp);
          addAuditLog(`Dispatched email campaign: "${name}" to segment "${segment}" (${count} recipients)`, 'Newsletter');
          alert(status === 'Sent' ? 'Campaign dispatched successfully to mail server.' : `Campaign scheduled for release on ${sentDate}.`);

          // Redirect to History
          state.admin.newsSubtabActive = 'history';
          initAdminTab('blog-subscribers');
          renderApp();
        });
      }
    }

    // --- SUB-VIEW C: CAMPAIGN HISTORY ---
    if (subtab === 'history') {
      const tbody = document.querySelector('#news-campaigns-tbody');

      function renderCampaignsTable() {
        if (!tbody) return;

        if (camps.length === 0) {
          tbody.innerHTML = `<tr><td colspan="8" class="p-4 text-center text-xs text-slate-400 italic">No broadcast campaign history logs found.</td></tr>`;
          return;
        }

        tbody.innerHTML = camps.map(c => {
          let badge = 'bg-slate-100 text-slate-550';
          if (c.status === 'Sent') badge = 'bg-emerald-500/10 text-emerald-650';
          else if (c.status === 'Scheduled') badge = 'bg-blue-500/10 text-blue-650';

          return `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-xs font-semibold">
              <td class="p-3 text-slate-900 dark:text-white font-bold">${c.name}</td>
              <td class="p-3 text-slate-655 dark:text-slate-350 font-normal max-w-xs truncate">${c.subject}</td>
              <td class="p-3 font-mono text-slate-450">${c.sentDate}</td>
              <td class="p-3 text-center font-normal">${c.recipientsCount} leads</td>
              <td class="p-3"><span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${badge}">${c.status}</span></td>
              <td class="p-3 text-center font-normal font-mono text-slate-500">${c.openRate}</td>
              <td class="p-3 text-center font-normal font-mono text-slate-500">${c.clickRate}</td>
              <td class="p-3 text-right space-x-1">
                <button data-detail-camp-id="${c.id}" class="bg-indigo-650 hover:bg-indigo-750 text-white font-bold py-1 px-2.5 rounded text-[10px] active:scale-98">View</button>
                <button data-duplicate-camp-id="${c.id}" class="bg-slate-100 hover:bg-slate-205 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold py-1 px-2.5 rounded text-[10px] active:scale-98 border border-slate-200/50">Duplicate</button>
              </td>
            </tr>
          `;
        }).join('');
      }

      // History row clicks View / Duplicate
      root.addEventListener('click', (e) => {
        // View Read-only Modal
        const viewBtn = e.target.closest('[data-detail-camp-id]');
        const histModal = document.querySelector('#news-history-detail-modal');
        if (viewBtn && histModal) {
          e.preventDefault();
          const id = parseInt(viewBtn.getAttribute('data-detail-camp-id'));
          const camp = camps.find(x => x.id === id);
          if (camp) {
            document.querySelector('#hist-modal-campaign-name').textContent = camp.name;
            document.querySelector('#hist-modal-segment').textContent = `${camp.segment} (${camp.recipientsCount} recipients)`;
            document.querySelector('#hist-modal-date').textContent = camp.sentDate;
            document.querySelector('#hist-modal-subject').textContent = camp.subject;
            
            // Format body content
            document.querySelector('#hist-modal-body').innerHTML = camp.body
              .replace(/\n\n/g, '</p><p class="mt-2.5">')
              .replace(/\n/g, '<br>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>');

            histModal.classList.remove('hidden');
          }
          return;
        }

        // Close details modal
        if (e.target.closest('#close-news-history-modal-btn')) {
          e.preventDefault();
          document.querySelector('#news-history-detail-modal')?.classList.add('hidden');
          return;
        }

        // Duplicate campaign
        const dupBtn = e.target.closest('[data-duplicate-camp-id]');
        if (dupBtn) {
          e.preventDefault();
          const id = parseInt(dupBtn.getAttribute('data-duplicate-camp-id'));
          const camp = camps.find(x => x.id === id);
          if (camp) {
            state.admin.newsletterDuplicateCache = {
              name: camp.name,
              subject: camp.subject,
              body: camp.body,
              segment: camp.segment
            };
            
            // Shift to compose tab
            state.admin.newsSubtabActive = 'compose';
            initAdminTab('blog-subscribers');
          }
        }
      });

      renderCampaignsTable();
    }

    // --- Sub-tab navigation click triggers ---
    document.querySelector('#btn-news-subscribers-tab')?.addEventListener('click', (e) => {
      e.preventDefault();
      state.admin.newsSubtabActive = 'subscribers';
      initAdminTab('blog-subscribers');
    });

    document.querySelector('#btn-news-compose-tab')?.addEventListener('click', (e) => {
      e.preventDefault();
      state.admin.newsSubtabActive = 'compose';
      initAdminTab('blog-subscribers');
    });

    document.querySelector('#btn-news-history-tab')?.addEventListener('click', (e) => {
      e.preventDefault();
      state.admin.newsSubtabActive = 'history';
      initAdminTab('blog-subscribers');
    });

    return;
  }

  // 1. BLOG WRITE SUB-TABS ROUTER SWITCHES ...


  if (activeTab !== 'blog-write') return;

  const mode = state.admin.blogViewMode;
  const subtab = state.admin.blogSubtabActive;

  // Adjust Viewport Visibility
  const viewList = document.querySelector('#viewport-blog-posts-list');
  const viewForm = document.querySelector('#viewport-blog-post-form');
  const viewTaxonomy = document.querySelector('#viewport-blog-taxonomy-manager');
  const headerNav = document.querySelector('#blog-dashboard-header');

  if (mode === 'list') {
    headerNav.classList.remove('hidden');
    viewForm.classList.add('hidden');
    if (subtab === 'posts') {
      viewList.classList.remove('hidden');
      viewTaxonomy.classList.add('hidden');
    } else {
      viewList.classList.add('hidden');
      viewTaxonomy.classList.remove('hidden');
    }
  } else {
    // Editor Form mode
    headerNav.classList.add('hidden');
    viewForm.classList.remove('hidden');
    viewList.classList.add('hidden');
    viewTaxonomy.classList.add('hidden');
  }

  // Render Subtabs style highlights
  const postsTabBtn = document.querySelector('#btn-blog-posts-subtab');
  const taxTabBtn = document.querySelector('#btn-blog-taxonomy-subtab');

  if (postsTabBtn && taxTabBtn) {
    if (subtab === 'posts') {
      postsTabBtn.className = "pb-1.5 border-b-2 border-blue-600 text-blue-600 font-display uppercase tracking-wider";
      taxTabBtn.className = "pb-1.5 border-b-2 border-transparent text-slate-400 hover:text-slate-600 font-display uppercase tracking-wider";
    } else {
      postsTabBtn.className = "pb-1.5 border-b-2 border-transparent text-slate-400 hover:text-slate-600 font-display uppercase tracking-wider";
      taxTabBtn.className = "pb-1.5 border-b-2 border-blue-600 text-blue-600 font-display uppercase tracking-wider";
    }
  }

  // --- VIEWPORT A: BLOG POSTS LIST RENDERING ---
  if (mode === 'list' && subtab === 'posts') {
    const searchInp = document.querySelector('#blog-search-input');
    const statusFilter = document.querySelector('#filter-blog-status');
    const catFilter = document.querySelector('#filter-blog-category');
    const dateFrom = document.querySelector('#filter-blog-date-from');
    const dateTo = document.querySelector('#filter-blog-date-to');
    const tbody = document.querySelector('#blog-posts-table-body');

    // Populate Category filter dropdown
    if (catFilter) {
      catFilter.innerHTML = `<option value="all">All Categories</option>` + 
        state.admin.blogCategories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    }

    function renderBlogList() {
      if (!tbody) return;

      const q = (searchInp?.value || '').toLowerCase().trim();
      const sv = statusFilter?.value || 'all';
      const cv = catFilter?.value || 'all';
      const df = dateFrom?.value || '';
      const dt = dateTo?.value || '';

      const filtered = blogs.filter(b => {
        const matchesQuery = !q || [b.title, b.excerpt, b.content].join(' ').toLowerCase().includes(q);
        const matchesStatus = sv === 'all' || b.status === sv;
        const matchesCategory = cv === 'all' || b.category === cv;
        
        let matchesDate = true;
        if (b.date) {
          const postDate = new Date(b.date).toISOString().substring(0, 10);
          matchesDate = (!df || postDate >= df) && (!dt || postDate <= dt);
        }
        return matchesQuery && matchesStatus && matchesCategory && matchesDate;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="p-4 text-center text-xs text-slate-400 italic">No articles found in library.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(b => {
        let badgeClass = 'bg-slate-100 text-slate-655';
        if (b.status === 'Published') badgeClass = 'bg-emerald-500/10 text-emerald-650';
        else if (b.status === 'Scheduled') badgeClass = 'bg-blue-500/10 text-blue-650';

        const displayDate = b.status === 'Scheduled' && b.scheduledTime 
          ? `Scheduled: ${b.scheduledTime.replace('T', ' ')}` 
          : b.date;

        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-xs font-semibold">
            <td class="p-3">
              <div class="h-10 w-14 rounded overflow-hidden border border-slate-200/20 bg-slate-100">
                <img src="${b.image}" class="w-full h-full object-cover" />
              </div>
            </td>
            <td class="p-3 text-slate-900 dark:text-white font-bold leading-snug w-64">${b.title}</td>
            <td class="p-3 text-slate-500 font-normal">${b.category}</td>
            <td class="p-3 font-normal">${b.author}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${badgeClass}">${b.status}</span></td>
            <td class="p-3 font-mono text-slate-450">${displayDate}</td>
            <td class="p-3 text-center font-normal font-mono">${b.views || 0}</td>
            <td class="p-3 text-right">
              <!-- Dropdown menu trigger -->
              <div class="relative inline-block text-left" data-blog-actions-menu-id="${b.id}">
                <button type="button" class="btn-blog-actions-trigger bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded p-1" title="Row Actions">
                  <i class="bx bx-dots-vertical-rounded text-sm"></i>
                </button>
                <!-- Actions menu dropdown list (hidden by default) -->
                <div class="blog-actions-dropdown absolute right-0 mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg shadow-xl z-20 hidden text-left text-xs font-semibold py-1">
                  <button data-action-edit="${b.id}" class="w-full py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 block flex items-center gap-1.5"><i class="bx bx-edit text-sm"></i> Edit Post</button>
                  <button data-action-duplicate="${b.id}" class="w-full py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 block flex items-center gap-1.5"><i class="bx bx-copy text-sm"></i> Duplicate</button>
                  <button data-action-view="${b.id}" class="w-full py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#1e3a8a] dark:text-blue-400 block flex items-center gap-1.5"><i class="bx bx-show-alt text-sm"></i> View Live</button>
                  <button data-action-toggle-status="${b.id}" class="w-full py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-600 block flex items-center gap-1.5">
                    <i class="bx bx-transfer text-sm"></i> ${b.status === 'Published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <div class="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                  <button data-action-delete="${b.id}" class="w-full py-2 px-3 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 block flex items-center gap-1.5"><i class="bx bx-trash text-sm"></i> Delete</button>
                </div>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    if (searchInp) searchInp.addEventListener('input', renderBlogList);
    if (statusFilter) statusFilter.addEventListener('change', renderBlogList);
    if (catFilter) catFilter.addEventListener('change', renderBlogList);
    if (dateFrom) dateFrom.addEventListener('change', renderBlogList);
    if (dateTo) dateTo.addEventListener('change', renderBlogList);

    renderBlogList();

    // Show/hide row dropdown menus
    root.addEventListener('click', (e) => {
      const trigger = e.target.closest('.btn-blog-actions-trigger');
      if (trigger) {
        e.preventDefault();
        const menu = trigger.nextElementSibling;
        // Close other open menus
        document.querySelectorAll('.blog-actions-dropdown').forEach(el => {
          if (el !== menu) el.classList.add('hidden');
        });
        menu.classList.toggle('hidden');
        return;
      }
      
      // Close dropdown if clicked outside
      if (!e.target.closest('[data-blog-actions-menu-id]')) {
        document.querySelectorAll('.blog-actions-dropdown').forEach(el => el.classList.add('hidden'));
      }
    });

    // Row action selections
    root.addEventListener('click', (e) => {
      // Edit Post
      const editBtn = e.target.closest('[data-action-edit]');
      if (editBtn) {
        e.preventDefault();
        const id = parseInt(editBtn.getAttribute('data-action-edit'));
        const post = blogs.find(x => x.id === id);
        if (post) {
          state.admin.blogViewMode = 'edit';
          state.admin.blogActiveArticleId = id;
          state.admin.blogSelectedTags = [...(post.tags || [])];
          
          initAdminTab('blog-write');
        }
        return;
      }

      // Duplicate Post
      const dupBtn = e.target.closest('[data-action-duplicate]');
      if (dupBtn) {
        e.preventDefault();
        const id = parseInt(dupBtn.getAttribute('data-action-duplicate'));
        const post = blogs.find(x => x.id === id);
        if (post) {
          const duplicated = {
            ...post,
            id: blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1,
            title: `Copy of ${post.title}`,
            status: 'Draft',
            views: 0,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          };
          blogs.unshift(duplicated);
          addAuditLog(`Duplicated blog post: "${post.title}"`, 'Platform Journal');
          renderBlogList();
          alert('Article duplicated as Draft.');
        }
        return;
      }

      // View Live Read-only Preview
      const viewBtn = e.target.closest('[data-action-view]');
      const prevModal = document.querySelector('#blog-preview-live-modal');
      if (viewBtn && prevModal) {
        e.preventDefault();
        const id = parseInt(viewBtn.getAttribute('data-action-view'));
        const post = blogs.find(x => x.id === id);
        if (post) {
          document.querySelector('#modal-prev-category').textContent = post.category;
          document.querySelector('#modal-prev-date').textContent = post.date;
          document.querySelector('#modal-prev-title').textContent = post.title;
          document.querySelector('#modal-prev-author').textContent = post.author;
          document.querySelector('#modal-prev-image').src = post.image;
          document.querySelector('#modal-prev-excerpt').textContent = post.excerpt;
          
          // Formats simple body tags markup
          document.querySelector('#modal-prev-body').innerHTML = post.content
            .replace(/\n\n/g, '</p><p class="mt-3">')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');

          document.querySelector('#modal-prev-tags-list').innerHTML = (post.tags || []).map(t => 
            `<span class="bg-slate-100 dark:bg-slate-800 text-slate-655 px-2 py-0.5 rounded text-[10px]">#${t}</span>`
          ).join('');

          prevModal.classList.remove('hidden');
        }
        return;
      }

      // Close Live Preview modal
      if (e.target.closest('#close-blog-preview-modal-btn')) {
        e.preventDefault();
        document.querySelector('#blog-preview-live-modal')?.classList.add('hidden');
        return;
      }

      // Quick Publish/Unpublish status switch
      const toggleBtn = e.target.closest('[data-action-toggle-status]');
      if (toggleBtn) {
        e.preventDefault();
        const id = parseInt(toggleBtn.getAttribute('data-action-toggle-status'));
        const post = blogs.find(x => x.id === id);
        if (post) {
          post.status = post.status === 'Published' ? 'Draft' : 'Published';
          addAuditLog(`Quick toggled blog status of "${post.title}" to ${post.status}`, 'Platform Journal');
          renderBlogList();
        }
        return;
      }

      // Delete Post
      const delBtn = e.target.closest('[data-action-delete]');
      if (delBtn) {
        e.preventDefault();
        const id = parseInt(delBtn.getAttribute('data-action-delete'));
        const idx = blogs.findIndex(x => x.id === id);
        if (idx !== -1 && confirm('Are you sure you want to delete this article?')) {
          const removed = blogs.splice(idx, 1)[0];
          addAuditLog(`Deleted journal article: "${removed.title}"`, 'Platform Journal');
          renderBlogList();
        }
      }
    });
  }

  // --- VIEWPORT B: ADD / EDIT BLOG EDITOR FORM ---
  if (mode === 'add' || mode === 'edit') {
    const titleInp = document.querySelector('#blog-form-title');
    const slugInp = document.querySelector('#blog-form-slug');
    const contentInp = document.querySelector('#blog-form-content');
    const excerptInp = document.querySelector('#blog-form-excerpt');
    
    const imgFileInput = document.querySelector('#blog-form-image-file');
    const imgUrlInput = document.querySelector('#blog-form-image-url');
    const imgPreview = document.querySelector('#blog-form-image-preview');

    const statusSel = document.querySelector('#blog-form-status');
    const scheduleTimeBox = document.querySelector('#sec-blog-schedule-time');
    const categorySel = document.querySelector('#blog-form-category');
    const tagsInp = document.querySelector('#blog-form-tags-input');
    const authorSel = document.querySelector('#blog-form-author');

    const seoAccordionBtn = document.querySelector('#btn-blog-seo-accordion');
    const seoAccordionBody = document.querySelector('#sec-blog-seo-accordion-body');
    const seoChevron = document.querySelector('#blog-seo-accordion-chevron');

    const seoTitleInp = document.querySelector('#blog-form-seo-title');
    const seoDescInp = document.querySelector('#blog-form-seo-desc');

    // Populate dropdown selects
    if (categorySel) {
      categorySel.innerHTML = state.admin.blogCategories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    }
    if (authorSel) {
      // Mock author selects
      const authors = ['Amina Bello', 'Aliyu Bello', 'Chidi Okafor'];
      authorSel.innerHTML = authors.map(a => `<option value="${a}">${a}</option>`).join('');
      authorSel.value = state.admin.staffName || 'Amina Bello';
    }

    // Toggle scheduled date visibility
    statusSel?.addEventListener('change', () => {
      if (statusSel.value === 'Scheduled') {
        scheduleTimeBox.classList.remove('hidden');
      } else {
        scheduleTimeBox.classList.add('hidden');
      }
    });

    // Auto-generate Slug on Title input (Only when adding or if slug is empty)
    titleInp?.addEventListener('input', () => {
      if (mode === 'add') {
        slugInp.value = titleInp.value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
      }
    });

    // Image upload handler
    imgFileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        imgPreview.src = event.target.result;
        imgUrlInput.value = ''; // Clear URL if file uploaded
      };
      reader.readAsDataURL(file);
    });

    imgUrlInput?.addEventListener('input', () => {
      if (imgUrlInput.value.trim()) {
        imgPreview.src = imgUrlInput.value.trim();
      }
    });

    // Rich Text Editor Toolbar mock buttons
    document.querySelectorAll('[data-edit-tool]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tool = btn.getAttribute('data-edit-tool');
        const start = contentInp.selectionStart;
        const end = contentInp.selectionEnd;
        const text = contentInp.value;
        const selected = text.substring(start, end);

        let wrapper = '';
        if (tool === 'bold') wrapper = `**${selected || 'bold text'}**`;
        else if (tool === 'italic') wrapper = `*${selected || 'italic text'}*`;
        else if (tool === 'heading') wrapper = `\n## ${selected || 'Heading H2'}\n`;
        else if (tool === 'list') wrapper = `\n- ${selected || 'List item'}\n`;
        else if (tool === 'link') wrapper = `[${selected || 'Link Text'}](https://example.com)`;
        else if (tool === 'image') wrapper = `![${selected || 'Image description'}](https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80)`;

        contentInp.value = text.substring(0, start) + wrapper + text.substring(end);
        contentInp.focus();
      });
    });

    // Tags list input handlers
    function renderSelectedTags() {
      const container = document.querySelector('#blog-form-tags-badges-list');
      if (!container) return;
      container.innerHTML = state.admin.blogSelectedTags.map(tag => `
        <span class="bg-blue-500/10 text-blue-650 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
          #${tag}
          <button type="button" data-remove-tag="${tag}" class="text-blue-600 hover:text-blue-800 text-[10px] font-black">×</button>
        </span>
      `).join('');
    }

    tagsInp?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = tagsInp.value.trim().replace(/[^a-zA-Z0-9\s]/g, '');
        if (val && !state.admin.blogSelectedTags.includes(val)) {
          state.admin.blogSelectedTags.push(val);
          tagsInp.value = '';
          renderSelectedTags();
        }
      }
    });

    root.addEventListener('click', (e) => {
      const rmBtn = e.target.closest('[data-remove-tag]');
      if (rmBtn) {
        e.preventDefault();
        const tag = rmBtn.getAttribute('data-remove-tag');
        state.admin.blogSelectedTags = state.admin.blogSelectedTags.filter(t => t !== tag);
        renderSelectedTags();
      }
    });

    // SEO Accordion
    seoAccordionBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      seoAccordionBody.classList.toggle('hidden');
      seoChevron.classList.toggle('rotate-185');
    });

    // Back to directory button
    document.querySelector('#btn-blog-editor-back')?.addEventListener('click', (e) => {
      e.preventDefault();
      state.admin.blogViewMode = 'list';
      initAdminTab('blog-write');
    });

    // Pre-fill values if edit mode
    let activeArticle = null;
    if (mode === 'edit') {
      activeArticle = blogs.find(x => x.id === state.admin.blogActiveArticleId);
      if (activeArticle) {
        titleInp.value = activeArticle.title;
        slugInp.value = activeArticle.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
        contentInp.value = activeArticle.content;
        excerptInp.value = activeArticle.excerpt;
        imgPreview.src = activeArticle.image;
        imgUrlInput.value = activeArticle.image.startsWith('http') ? activeArticle.image : '';
        statusSel.value = activeArticle.status;
        categorySel.value = activeArticle.category;
        authorSel.value = activeArticle.author;

        if (activeArticle.status === 'Scheduled') {
          scheduleTimeBox.classList.remove('hidden');
          document.querySelector('#blog-form-scheduletime').value = activeArticle.scheduledTime || '';
        }

        if (activeArticle.seo) {
          seoTitleInp.value = activeArticle.seo.title || '';
          seoDescInp.value = activeArticle.seo.description || '';
        }
      }
    }

    renderSelectedTags();

    // Form submit controller
    const composerForm = document.querySelector('#blog-editor-composer-form');
    if (composerForm) {
      composerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = titleInp.value.trim();
        const slug = slugInp.value.trim();
        const content = contentInp.value.trim();
        const excerpt = excerptInp.value.trim() || content.substring(0, 140) + '...';
        const image = imgPreview.src;
        const category = categorySel.value;
        const author = authorSel.value;
        const status = statusSel.value;
        const scheduledTime = status === 'Scheduled' ? document.querySelector('#blog-form-scheduletime').value : '';

        if (status === 'Scheduled' && !scheduledTime) {
          alert('Please select a scheduled release date and time.');
          return;
        }

        const tags = [...state.admin.blogSelectedTags];
        const seo = {
          title: seoTitleInp.value.trim(),
          description: seoDescInp.value.trim()
        };

        if (mode === 'add') {
          const newId = blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1;
          const newBlog = {
            id: newId,
            title,
            excerpt,
            author,
            category,
            tags,
            image,
            content,
            status,
            scheduledTime,
            seo,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            views: 0
          };
          blogs.unshift(newBlog);
          addAuditLog(`Created and published new article "${title}"`, 'Platform Journal');
          alert('New article created successfully.');
        } else {
          // Edit mode
          if (activeArticle) {
            activeArticle.title = title;
            activeArticle.content = content;
            activeArticle.excerpt = excerpt;
            activeArticle.image = image;
            activeArticle.category = category;
            activeArticle.author = author;
            activeArticle.status = status;
            activeArticle.scheduledTime = scheduledTime;
            activeArticle.tags = tags;
            activeArticle.seo = seo;

            addAuditLog(`Updated article details for "${title}"`, 'Platform Journal');
            alert('Article details updated successfully.');
          }
        }

        // Return to list directory
        state.admin.blogViewMode = 'list';
        initAdminTab('blog-write');
        renderApp();
      });
    }

    // Save Draft button handler
    document.querySelector('#btn-blog-save-draft')?.addEventListener('click', (e) => {
      e.preventDefault();
      statusSel.value = 'Draft';
      // Trigger submit click
      composerForm.requestSubmit();
    });
  }

  // --- VIEWPORT C: CATEGORIES & TAGS INLINE MANAGER ---
  if (mode === 'list' && subtab === 'taxonomy') {
    const catsTbody = document.querySelector('#tax-categories-tbody');
    const tagsTbody = document.querySelector('#tax-tags-tbody');

    const catForm = document.querySelector('#form-tax-add-category');
    const tagForm = document.querySelector('#form-tax-add-tag');

    // Toggle forms trigger
    document.querySelector('#btn-tax-add-cat-toggle')?.addEventListener('click', () => {
      catForm.classList.remove('hidden');
    });
    document.querySelector('#btn-tax-cancel-cat')?.addEventListener('click', () => {
      catForm.classList.add('hidden');
    });

    document.querySelector('#btn-tax-add-tag-toggle')?.addEventListener('click', () => {
      tagForm.classList.remove('hidden');
    });
    document.querySelector('#btn-tax-cancel-tag')?.addEventListener('click', () => {
      tagForm.classList.add('hidden');
    });

    // Auto-generate taxonomies slugs
    document.querySelector('#tax-cat-name')?.addEventListener('input', (e) => {
      document.querySelector('#tax-cat-slug').value = e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    });
    document.querySelector('#tax-tag-name')?.addEventListener('input', (e) => {
      document.querySelector('#tax-tag-slug').value = e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    });

    function renderTaxonomyTables() {
      // 1. Categories
      catsTbody.innerHTML = state.admin.blogCategories.map(cat => {
        const pCount = blogs.filter(b => b.category === cat.name).length;
        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
            <td class="p-3 text-slate-900 dark:text-white font-bold">${cat.name}</td>
            <td class="p-3 font-mono text-slate-400">${cat.slug}</td>
            <td class="p-3 text-center font-normal">${pCount} Posts</td>
            <td class="p-3 text-right">
              <button data-delete-cat="${cat.id}" class="text-rose-600 hover:underline">Delete</button>
            </td>
          </tr>
        `;
      }).join('');

      // 2. Tags
      tagsTbody.innerHTML = state.admin.blogTags.map(tag => {
        const pCount = blogs.filter(b => (b.tags || []).includes(tag.name)).length;
        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
            <td class="p-3 text-slate-900 dark:text-white font-bold">${tag.name}</td>
            <td class="p-3 font-mono text-slate-400">${tag.slug}</td>
            <td class="p-3 text-center font-normal">${pCount} Posts</td>
            <td class="p-3 text-right">
              <button data-delete-tag="${tag.id}" class="text-rose-600 hover:underline">Delete</button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Submit Add Category
    catForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.querySelector('#tax-cat-name').value.trim();
      const slug = document.querySelector('#tax-cat-slug').value.trim();
      if (!name || !slug) return;

      const newCat = {
        id: state.admin.blogCategories.length + 1,
        name,
        slug
      };
      state.admin.blogCategories.push(newCat);
      addAuditLog(`Added editorial category taxonomy: ${name}`, 'Platform Journal');
      catForm.reset();
      catForm.classList.add('hidden');
      renderTaxonomyTables();
    });

    // Submit Add Tag
    tagForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.querySelector('#tax-tag-name').value.trim();
      const slug = document.querySelector('#tax-tag-slug').value.trim();
      if (!name || !slug) return;

      const newTag = {
        id: state.admin.blogTags.length + 1,
        name,
        slug
      };
      state.admin.blogTags.push(newTag);
      addAuditLog(`Added editorial tag taxonomy: ${name}`, 'Platform Journal');
      tagForm.reset();
      tagForm.classList.add('hidden');
      renderTaxonomyTables();
    });

    // Row Delete taxonomies
    root.addEventListener('click', (e) => {
      const delCat = e.target.closest('[data-delete-cat]');
      if (delCat) {
        e.preventDefault();
        const id = parseInt(delCat.getAttribute('data-delete-cat'));
        const idx = state.admin.blogCategories.findIndex(c => c.id === id);
        if (idx !== -1) {
          const removed = state.admin.blogCategories.splice(idx, 1)[0];
          addAuditLog(`Deleted editorial category: ${removed.name}`, 'Platform Journal');
          renderTaxonomyTables();
        }
        return;
      }

      const delTag = e.target.closest('[data-delete-tag]');
      if (delTag) {
        e.preventDefault();
        const id = parseInt(delTag.getAttribute('data-delete-tag'));
        const idx = state.admin.blogTags.findIndex(t => t.id === id);
        if (idx !== -1) {
          const removed = state.admin.blogTags.splice(idx, 1)[0];
          addAuditLog(`Deleted editorial tag: ${removed.name}`, 'Platform Journal');
          renderTaxonomyTables();
        }
      }
    });

    renderTaxonomyTables();
  }

  // --- Subtabs switches triggers ---
  document.querySelector('#btn-blog-posts-subtab')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.admin.blogSubtabActive = 'posts';
    initAdminTab('blog-write');
  });

  document.querySelector('#btn-blog-taxonomy-subtab')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.admin.blogSubtabActive = 'taxonomy';
    initAdminTab('blog-write');
  });

  // Write trigger click
  document.querySelector('#btn-write-post-trigger')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.admin.blogViewMode = 'add';
    state.admin.blogSelectedTags = [];
    initAdminTab('blog-write');
  });
}
