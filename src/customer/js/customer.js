import customerTemplates from '../customer-view.html?raw';

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

// Ensure default customer states
export function ensureCustomerState(state) {
  if (!state.customer) {
    state.customer = {
      isAuthenticated: false,
      activeTab: 'dashboard',
      authSubTab: 'login',
      profile: {
        name: 'Olumide Alao',
        email: 'client@blueskye.com',
        phone: '+234 812 559 4832',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        kycStatus: 'Pending',
        kycRejectReason: 'Uploaded Utility Bill has expired and shows a different address coordinates.',
        isAffiliate: true,
        referredByName: 'Amina Yusuf',
        notifPrefs: { email: true, sms: false, push: true }
      },
      notificationsList: [
        { id: 1, title: 'Payment Confirmed', desc: '₦35,000,000 payment was confirmed by Accounts.', date: '2026-07-15 14:30', isRead: false, tab: 'payments' },
        { id: 2, title: 'KYC Document Verified', desc: 'Passport photo cleared structural review.', date: '2026-07-14 09:15', isRead: false, tab: 'kyc' },
        { id: 3, title: 'Inspection Scheduled', desc: 'Physical walkthrough is confirmed on calendar.', date: '2026-07-10 11:00', isRead: true, tab: 'inspections' }
      ],
      kycDocs: {
        govId: { name: 'Government-Issued ID (Passport/National ID)', status: 'Verified', date: '2026-07-14', file: 'gov_id.png' },
        passport: { name: 'Passport-Sized Photograph', status: 'Verified', date: '2026-07-14', file: 'photo.png' },
        address: { name: 'Proof of Address (Utility Bill/Lagos Rent Deed)', status: 'Rejected', date: '2026-07-15', file: 'utility_bill.png', reason: 'Utility bill is blurry and past 3 months expiration date.' }
      },
      selectedPropertyId: null,
      properties: [
        {
          id: 101,
          title: 'Grand Horizon Estates, Phase 2',
          type: 'Serviced Duplex Plot',
          plot: 'Plot 42',
          size: '600 Sqm',
          location: 'Lekki Scheme 2, Lagos',
          purchaseDate: '2026-05-12',
          price: 50000000,
          paid: 35000000,
          balance: 15000000,
          pctPaid: 70,
          status: 'Completing',
          imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
          mapUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80',
          nextDueAmount: 1250000,
          nextDueDate: '2026-08-15',
          documentsList: [
            { name: 'Land Allocation Letter', type: 'allocation', date: '2026-05-15', status: 'Available' },
            { name: 'Initial Deposit Receipt', type: 'receipt', date: '2026-05-12', status: 'Available' },
            { name: 'Registered Survey Plan', type: 'survey', date: '2026-06-01', status: 'Available' },
            { name: 'Deed of Assignment', type: 'deed', date: '-', status: 'Locked', reason: 'Available after 80% payment' },
            { name: 'Certificate of Occupancy (C of O)', type: 'c_of_o', date: '-', status: 'Locked', reason: 'Available after full payment completion' }
          ]
        }
      ],
      paymentsHistory: [
        { id: 201, date: '2026-05-12', amount: 20000000, method: 'Direct Bank Transfer', bankName: 'Zenith Bank', refNum: 'REF-882039', status: 'Confirmed' },
        { id: 202, date: '2026-06-15', amount: 15000000, method: 'Direct Bank Transfer', bankName: 'Zenith Bank', refNum: 'REF-992384', status: 'Confirmed' }
      ],
      installmentsSchedule: [
        { id: 301, dueDate: '2026-08-15', amount: 1250000, status: 'Upcoming' },
        { id: 302, dueDate: '2026-09-15', amount: 1250000, status: 'Upcoming' },
        { id: 303, dueDate: '2026-10-15', amount: 1250000, status: 'Upcoming' }
      ],
      paymentsActiveSubView: 'dashboard',
      inspections: [
        { id: 401, date: '2026-07-20 10:00', propertyTitle: 'Grand Horizon Estates, Phase 2 (Plot 42)', status: 'Confirmed', notes: 'Preferred morning slot verification.' },
        { id: 402, date: '2026-06-10 14:00', propertyTitle: 'Interest in: Magnolia Diplomat Mansion (Pre-purchase)', status: 'Done', notes: 'Exploring alternative duplex designs.', staffFeedback: 'Client was highly impressed by the soil structural layout and foundation thickness. Prefers block perfection.' }
      ],

      activities: [
        { id: 1, type: 'payment', title: 'Payment Confirmed', desc: 'Down payment of ₦35,000,000 confirmed for Grand Horizon Plot 42.', date: '2026-07-15 14:30', tab: 'payments' },
        { id: 2, type: 'kyc', title: 'KYC Verification Approved', desc: 'Your passport photo and Government ID details have been verified by compliance.', date: '2026-07-14 09:15', tab: 'kyc' },
        { id: 3, type: 'inspection', title: 'Site Inspection Scheduled', desc: 'Guided physical tour confirmed with Site Manager Adekunle.', date: '2026-07-10 11:00', tab: 'inspections' },
        { id: 4, type: 'referral', title: 'Referral Registered', desc: 'Amina Yusuf signed up using your client ambassador code link.', date: '2026-07-08 16:45', tab: 'referral' },
        { id: 5, type: 'support', title: 'Support Ticket Resolved', desc: 'Query regarding deed perfection fee milestone split has been marked resolved.', date: '2026-07-05 13:20', tab: 'support' },
        { id: 6, type: 'system', title: 'Client Account Activated', desc: 'Welcome to BlueSky City Customer Workspace hub.', date: '2026-07-01 10:00', tab: 'dashboard' }
      ]
    };
  }
  
  // Sync overall KYC status parameters
  const c = state.customer;
  const docs = Object.values(c.kycDocs);
  const rejected = docs.find(d => d.status === 'Rejected');
  if (rejected) {
    c.profile.kycStatus = 'Rejected';
    c.profile.kycRejectReason = rejected.reason;
  } else {
    const pending = docs.find(d => d.status === 'Pending' || d.status === 'Not Submitted');
    if (pending) {
      c.profile.kycStatus = 'Pending';
    } else {
      c.profile.kycStatus = 'Verified';
    }
  }
}

// Router Renderer
export function renderCustomerPortal(state) {
  ensureCustomerState(state);
  
  if (!state.customer.isAuthenticated) {
    return getSection('customer-login-template');
  }
  return getSection('customer-shell-template');
}

// Bind Listeners
export function bindCustomerListeners(state, root, renderApp) {
  ensureCustomerState(state);

  const c = state.customer;

  // 1. UNAUTHENTICATED LOGIN/REGISTER FLOWS
  if (!c.isAuthenticated) {
    const tabLogin = document.querySelector('[data-cust-auth-tab="login"]');
    const tabRegister = document.querySelector('[data-cust-auth-tab="register"]');
    const loginInterface = document.querySelector('#cust-login-interface');
    const registerInterface = document.querySelector('#cust-register-interface');
    const forgotInterface = document.querySelector('#cust-forgot-interface');

    function applyAuthTab(tab) {
      c.authSubTab = tab;
      if (tab === 'login') {
        tabLogin?.classList.add('border-[#1e3a8a]', 'text-[#1e3a8a]', 'dark:border-blue-400', 'dark:text-blue-400');
        tabLogin?.classList.remove('border-transparent', 'text-slate-400');
        tabRegister?.classList.add('border-transparent', 'text-slate-400');
        tabRegister?.classList.remove('border-[#1e3a8a]', 'text-[#1e3a8a]', 'dark:border-blue-400', 'dark:text-blue-400');
        
        loginInterface?.classList.remove('hidden');
        registerInterface?.classList.add('hidden');
        forgotInterface?.classList.add('hidden');
      } else {
        tabRegister?.classList.add('border-[#1e3a8a]', 'text-[#1e3a8a]', 'dark:border-blue-400', 'dark:text-blue-400');
        tabRegister?.classList.remove('border-transparent', 'text-slate-400');
        tabLogin?.classList.add('border-transparent', 'text-slate-400');
        tabLogin?.classList.remove('border-[#1e3a8a]', 'text-[#1e3a8a]', 'dark:border-blue-400', 'dark:text-blue-400');
        
        registerInterface?.classList.remove('hidden');
        loginInterface?.classList.add('hidden');
        forgotInterface?.classList.add('hidden');
      }
    }

    tabLogin?.addEventListener('click', () => applyAuthTab('login'));
    tabRegister?.addEventListener('click', () => applyAuthTab('register'));

    // Forgot Password triggers
    document.querySelector('#cust-forgot-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      loginInterface?.classList.add('hidden');
      registerInterface?.classList.add('hidden');
      forgotInterface?.classList.remove('hidden');
    });

    document.querySelector('#cust-forgot-cancel')?.addEventListener('click', (e) => {
      e.preventDefault();
      applyAuthTab('login');
    });

    // Forgot password submit
    const forgotForm = document.querySelector('#cust-forgot-form');
    forgotForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const banner = document.querySelector('#forgot-success-banner');
      if (banner) {
        banner.classList.remove('hidden');
        setTimeout(() => {
          banner.classList.add('hidden');
          forgotForm.reset();
          applyAuthTab('login');
        }, 3000);
      }
    });

    // Login Form Submit
    const loginForm = document.querySelector('#cust-login-form');
    loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.querySelector('#cust-login-email').value.trim();
      const pass = document.querySelector('#cust-login-pass').value.trim();

      // Simple mock logins using default values or whatever inputs entered
      c.profile.email = email || 'client@blueskye.com';
      c.profile.name = email.split('@')[0].toUpperCase();
      c.isAuthenticated = true;
      
      alert('Welcome back to BlueSky Client workspace.');
      renderApp();
    });

    // Register Form Submit
    const regForm = document.querySelector('#cust-register-form');
    regForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Hide tabs and inputs, show success view
      document.querySelector('#cust-auth-tabs')?.classList.add('hidden');
      document.querySelector('#cust-register-interface')?.classList.add('hidden');
      const successView = document.querySelector('#cust-register-success-interface');
      if (successView) successView.classList.remove('hidden');

      // Bind Back to Login
      document.querySelector('#cust-success-login-btn')?.addEventListener('click', (ev) => {
        ev.preventDefault();
        regForm.reset();
        successView?.classList.add('hidden');
        document.querySelector('#cust-auth-tabs')?.classList.remove('hidden');
        applyAuthTab('login');
      }, { once: true });
    });

    applyAuthTab(c.authSubTab);
    return;
  }

  // 2. AUTHENTICATED PORTAL WORKSPACE
  // Pre-fill profile avatar elements
  const avatarL = document.querySelector('#cust-profile-avatar-left');
  const avatarR = document.querySelector('#cust-profile-avatar-right');
  const nameL = document.querySelector('#cust-profile-name-left');
  const emailL = document.querySelector('#cust-profile-email-left');

  if (avatarL) avatarL.src = c.profile.avatar;
  if (avatarR) avatarR.src = c.profile.avatar;
  if (nameL) nameL.textContent = c.profile.name;
  if (emailL) emailL.textContent = c.profile.email;

  // Toggle mobile drawer
  const mobileToggle = document.querySelector('#cust-mobile-toggle');
  const sidebar = document.querySelector('#customer-sidebar');
  mobileToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    sidebar?.classList.toggle('-translate-x-full');
  });

  // Dynamic Notifications Setup
  const notifBtn = document.querySelector('#cust-notif-btn');
  const notifDropdown = document.querySelector('#cust-notif-dropdown');
  const notifBadge = document.querySelector('#cust-notif-badge');
  const notifList = document.querySelector('#cust-notif-list');
  const clearBtn = document.querySelector('#cust-notif-clear-btn');
  const viewAllBtn = document.querySelector('#cust-notif-view-all');

  function updateNotifBadge() {
    const unreadCount = c.notificationsList.filter(n => !n.isRead).length;
    if (unreadCount > 0) {
      if (notifBadge) {
        notifBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
        notifBadge.classList.remove('hidden');
      }
    } else {
      if (notifBadge) notifBadge.classList.add('hidden');
    }
  }

  // Initial sync
  updateNotifBadge();

  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown?.classList.toggle('hidden');
    avatarDropdown?.classList.add('hidden');
    renderNotifList();
  });

  function renderNotifList() {
    if (!notifList) return;
    const notices = c.notificationsList.slice(0, 15);
    if (notices.length === 0) {
      notifList.innerHTML = `<div class="text-[10px] text-slate-400 italic py-4 text-center">No new notifications.</div>`;
      return;
    }

    notifList.innerHTML = notices.map(n => `
      <div data-cust-notif-id="${n.id}" class="py-2.5 px-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all flex items-start gap-2.5 ${!n.isRead ? 'bg-blue-50/20 dark:bg-blue-955/15 font-bold border-l-2 border-blue-500' : 'opacity-70'}">
        <span class="h-2 w-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-blue-500' : 'bg-slate-300'}"></span>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-baseline gap-1">
            <h4 class="text-[10px] truncate text-slate-900 dark:text-white font-extrabold">${n.title}</h4>
            <span class="text-[7.5px] text-slate-400 font-normal shrink-0">${n.date}</span>
          </div>
          <p class="text-[9px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">${n.desc}</p>
        </div>
      </div>
    `).join('');

    notifList.querySelectorAll('[data-cust-notif-id]').forEach(el => {
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const id = parseInt(el.getAttribute('data-cust-notif-id'));
        const notice = c.notificationsList.find(x => x.id === id);
        if (notice) {
          notice.isRead = true;
          updateNotifBadge();
          notifDropdown?.classList.add('hidden');
          c.activeTab = notice.tab || 'dashboard';
          renderViewport();
        }
      });
    });
  }

  clearBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    c.notificationsList.forEach(n => n.isRead = true);
    updateNotifBadge();
    renderNotifList();
    if (c.activeTab === 'notifications') {
      renderViewport();
    }
  });

  viewAllBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    c.activeTab = 'notifications';
    notifDropdown?.classList.add('hidden');
    renderViewport();
  });

  // Toggle avatar account dropdown menu
  const avatarBtn = document.querySelector('#cust-avatar-btn');
  const avatarDropdown = document.querySelector('#cust-avatar-dropdown');
  const avatarChevron = document.querySelector('#cust-avatar-chevron');

  const dpAvatar = document.querySelector('#cust-dropdown-avatar');
  const dpName = document.querySelector('#cust-dropdown-name');
  const dpEmail = document.querySelector('#cust-dropdown-email');

  avatarBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    avatarDropdown?.classList.toggle('hidden');
    notifDropdown?.classList.add('hidden');
    avatarChevron?.classList.toggle('rotate-180');

    // Populate data dynamically
    if (dpName) dpName.textContent = c.profile.name;
    if (dpEmail) dpEmail.textContent = c.profile.email;
    if (dpAvatar) dpAvatar.src = c.profile.avatar;
  });

  // Body clicks dismiss popovers
  document.addEventListener('click', (e) => {
    if (notifDropdown && !notifDropdown.contains(e.target) && !notifBtn?.contains(e.target)) {
      notifDropdown.classList.add('hidden');
    }
    if (avatarDropdown && !avatarDropdown.contains(e.target) && !avatarBtn?.contains(e.target)) {
      avatarDropdown.classList.add('hidden');
      avatarChevron?.classList.remove('rotate-180');
    }
  });

  // Escape key closes popovers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      notifDropdown?.classList.add('hidden');
      avatarDropdown?.classList.add('hidden');
      avatarChevron?.classList.remove('rotate-180');
      logoutModal?.classList.add('hidden');
    }
  });

  // Dropdown actions profile settings / logout
  document.querySelector('#cust-dropdown-profile')?.addEventListener('click', (e) => {
    e.preventDefault();
    avatarDropdown?.classList.add('hidden');
    avatarChevron?.classList.remove('rotate-180');
    c.activeTab = 'profile-settings';
    renderViewport();
  });

  document.querySelector('#cust-dropdown-preferences')?.addEventListener('click', (e) => {
    e.preventDefault();
    avatarDropdown?.classList.add('hidden');
    avatarChevron?.classList.remove('rotate-180');
    c.activeTab = 'profile-settings';
    renderViewport();
  });

  document.querySelector('#cust-sidebar-settings-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    c.activeTab = 'profile-settings';
    renderViewport();
  });

  // Logout actions & modals
  const logoutModal = document.querySelector('#cust-logout-confirm-modal');
  const logoutModalCancel = document.querySelector('#cust-logout-cancel');
  const logoutModalConfirm = document.querySelector('#cust-logout-confirm');

  document.querySelector('#cust-dropdown-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    avatarDropdown?.classList.add('hidden');
    avatarChevron?.classList.remove('rotate-180');
    logoutModal?.classList.remove('hidden');
  });

  logoutModalCancel?.addEventListener('click', (e) => {
    e.stopPropagation();
    logoutModal?.classList.add('hidden');
  });

  logoutModalConfirm?.addEventListener('click', (e) => {
    e.stopPropagation();
    logoutModal?.classList.add('hidden');
    c.isAuthenticated = false;
    c.activeTab = 'dashboard';
    renderApp();
  });

  // Left rail Navigation buttons click listeners
  document.querySelectorAll('#customer-nav-rail button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = btn.getAttribute('data-cust-tab');
      c.activeTab = tab;
      renderViewport();
    });
  });

  // Render Viewport Placeholders
  function renderViewport() {
    const viewport = document.querySelector('#cust-viewport');
    const title = document.querySelector('#cust-viewport-title');
    if (!viewport) return;

    // Reset button highlights
    document.querySelectorAll('#customer-nav-rail button').forEach(btn => {
      const tab = btn.getAttribute('data-cust-tab');
      if (tab === c.activeTab) {
        btn.className = "customer-rail-btn active w-full flex items-center gap-3 py-2.5 px-3 bg-white/10 rounded-lg text-left transition-all text-white font-bold";
      } else {
        btn.className = "customer-rail-btn w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-all hover:bg-white/10 text-white/80";
      }
    });

    // Content viewports routing
    switch (c.activeTab) {
      case 'dashboard':
        if (title) title.innerHTML = `<i class="bx bx-grid-alt text-lg text-slate-400"></i> <span>Customer Dashboard</span>`;
        
        if (c.properties.length === 0) {
          // Zero-properties welcome first login state
          let kycBadgeHtml = '';
          const kycStat = c.profile.kycStatus;
          if (kycStat === 'Verified') {
            kycBadgeHtml = `<span class="badge-base badge-success text-[10px] px-2 py-0.5 rounded font-extrabold flex items-center gap-0.5 w-fit"><i class="bx bx-check-double"></i> Verified</span>`;
          } else if (kycStat === 'Pending') {
            kycBadgeHtml = `<span class="badge-base badge-warning text-[10px] px-2 py-0.5 rounded font-extrabold flex items-center gap-0.5 w-fit"><i class="bx bx-time-five"></i> Pending Review</span>`;
          } else {
            kycBadgeHtml = `
              <div class="space-y-1.5 text-left">
                <span class="badge-base badge-danger text-[10px] px-2 py-0.5 rounded font-extrabold flex items-center gap-0.5 w-fit"><i class="bx bx-error-circle"></i> Rejected</span>
                <p class="text-[9px] text-rose-600 font-normal leading-relaxed">Reason: ${c.profile.kycRejectReason}</p>
                <button data-link-to-tab="kyc" class="btn-danger text-[9px] py-1 px-2.5 flex items-center gap-0.5"><i class="bx bx-upload"></i> Re-upload Documents</button>
              </div>
            `;
          }

          viewport.innerHTML = `
            <div class="space-y-6 text-left animate-fade-in">
              <div class="bg-gradient-to-r from-[#1e3a8a] to-blue-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                <h3 class="font-display font-extrabold text-lg sm:text-xl">Welcome to BlueSky, ${c.profile.name}!</h3>
                <p class="text-xs text-white/80 mt-1 font-normal max-w-lg leading-relaxed">Your premium client workspace is ready. You currently have no purchased properties or outstanding balances logged to your account. Perfect your first investment below.</p>
                <button id="btn-dashboard-browse-properties" class="mt-4 bg-white text-[#1e3a8a] hover:bg-blue-50 text-[11px] font-bold py-2 px-5 rounded-lg active:scale-98 transition-all flex items-center gap-1.5 shadow-sm">
                  <i class="bx bx-search-alt"></i> Browse Vetted Properties
                </button>
              </div>

              <!-- KYC Compliance checklist card -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl space-y-3">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-shield-check"></i> KYC &amp; Verification Progress</h4>
                <p class="text-[10.5px] text-slate-450 font-normal leading-relaxed max-w-xl">You can verify your identification credentials right away. Clearing KYC compliance ensures prompt contract allocations when you perfect a property purchase.</p>
                <div class="pt-1">${kycBadgeHtml}</div>
              </div>
            </div>
          `;

          // Bind browse button redirect
          document.querySelector('#btn-dashboard-browse-properties')?.addEventListener('click', (e) => {
            e.preventDefault();
            state.activeRoute = 'properties';
            renderApp();
          });
        } else {
          // Standard Active Investment Dashboard
          const totalOwned = c.properties.length;
          const outstandingBalance = c.properties.reduce((sum, p) => sum + p.balance, 0);
          
          // Get next payment details
          const firstProp = c.properties[0];
          const hasPayments = firstProp.nextDueAmount > 0;
          const nextPaymentHtml = hasPayments 
            ? `<div class="space-y-0.5">
                 <span class="block text-base font-black text-slate-900 dark:text-white">${fmtNGN(firstProp.nextDueAmount)}</span>
                 <span class="block text-[9.5px] text-[#1e3a8a] dark:text-blue-400 font-bold">Due Date: ${firstProp.nextDueDate}</span>
               </div>`
            : `<span class="block text-slate-400 italic text-[11px] py-1">No upcoming payment</span>`;

          // KYC Badging
          let kycCardHtml = '';
          const kycStat = c.profile.kycStatus;
          if (kycStat === 'Verified') {
            kycCardHtml = `<span class="badge-base badge-success text-[10px] font-extrabold px-2.5 py-1 rounded flex items-center gap-0.5 w-fit uppercase"><i class="bx bx-check-double text-xs"></i> Verified</span>`;
          } else if (kycStat === 'Pending') {
            kycCardHtml = `<span class="badge-base badge-warning text-[10px] font-extrabold px-2.5 py-1 rounded flex items-center gap-0.5 w-fit uppercase"><i class="bx bx-time-five text-xs"></i> Pending Review</span>`;
          } else {
            kycCardHtml = `
              <div class="space-y-1 text-left">
                <span class="badge-base badge-danger text-[10px] font-extrabold px-2.5 py-1 rounded flex items-center gap-0.5 w-fit uppercase"><i class="bx bx-error-circle text-xs"></i> Rejected</span>
                <p class="text-[9px] text-rose-600 font-normal leading-relaxed">Reason: ${c.profile.kycRejectReason}</p>
                <button data-link-to-tab="kyc" class="btn-danger text-[9px] py-1 px-3 mt-1.5"><i class="bx bx-upload"></i> Re-upload Documents</button>
              </div>
            `;
          }

          // Build Recent Activity lists
          const activityRows = c.activities.map(act => {
            let iconClass = 'bx bx-info-circle text-slate-450 bg-slate-100 dark:bg-slate-800';
            if (act.type === 'payment') iconClass = 'bx bx-credit-card badge-base badge-success dark:bg-emerald-950/20';
            else if (act.type === 'kyc') iconClass = 'bx bx-shield-check text-blue-650 bg-blue-50 dark:bg-blue-950/20';
            else if (act.type === 'inspection') iconClass = 'bx bx-calendar text-indigo-650 bg-indigo-50 dark:bg-indigo-950/20';
            else if (act.type === 'referral') iconClass = 'bx bx-share-alt badge-base badge-warning dark:bg-amber-950/20';
            else if (act.type === 'support') iconClass = 'bx bx-message-rounded-check text-slate-655 bg-slate-50 dark:bg-slate-850';

            return `
              <div data-link-to-tab="${act.tab}" class="flex gap-3 py-3 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/20 rounded-lg p-2 transition-colors">
                <div class="h-8.5 w-8.5 rounded-lg flex items-center justify-center shrink-0 text-base ${iconClass}"></div>
                <div class="flex-1 min-w-0 text-left">
                  <div class="flex justify-between items-center">
                    <span class="font-extrabold text-slate-900 dark:text-white text-xs">${act.title}</span>
                    <span class="text-[8px] text-slate-400 font-mono">${act.date}</span>
                  </div>
                  <p class="text-[10px] text-slate-450 dark:text-slate-400 font-normal leading-relaxed mt-0.5 truncate">${act.desc}</p>
                </div>
              </div>
            `;
          }).join('');

          viewport.innerHTML = `
            <div class="space-y-6 text-left animate-fade-in">
              <!-- Welcome Alert Banner -->
              <div class="bg-gradient-to-r from-[#1e3a8a] to-blue-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                <h3 class="font-display font-extrabold text-lg sm:text-xl">Good day, ${c.profile.name}!</h3>
                <p class="text-xs text-white/80 mt-1 font-normal max-w-lg leading-relaxed">Welcome to your BlueSky Customer Hub. Monitor active deed registries, payment installment ledgers, and site tours bookings.</p>
              </div>

              <!-- 4 Metrics Summary Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1">
                  <span class="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">Properties Owned</span>
                  <span class="block text-xl font-black text-slate-900 dark:text-white">${totalOwned} Unit</span>
                  <span class="block text-[9px] text-[#1e3a8a] dark:text-blue-400 font-bold">${firstProp.title}</span>
                </div>
                
                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1">
                  <span class="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">Outstanding Balance</span>
                  <span class="block text-xl font-black text-slate-900 dark:text-white">${fmtNGN(outstandingBalance)}</span>
                  <span class="block text-[9px] text-slate-400 font-normal">Of total price ${fmtNGN(firstProp.price)}</span>
                </div>

                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1 flex flex-col justify-between min-h-[90px]">
                  <span class="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">Next Payment Due</span>
                  ${nextPaymentHtml}
                </div>

                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1">
                  <span class="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">KYC Compliance Status</span>
                  <div class="pt-0.5">${kycCardHtml}</div>
                </div>
              </div>

              <!-- Recent Activity Feed -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl space-y-3 shadow-xs">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-history"></i> Recent Activity Feed Updates</h4>
                <div class="divide-y divide-slate-100 dark:divide-slate-850">
                  ${activityRows}
                </div>
              </div>

            </div>
          `;
        }

        // Delegate listener clicks inside dashboard viewports (for re-uploads or activities)
        viewport.querySelectorAll('[data-link-to-tab]').forEach(el => {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = el.getAttribute('data-link-to-tab');
            c.activeTab = tab;
            renderViewport();
          });
        });
        break;

      case 'properties':
        if (title) title.innerHTML = `<i class="bx bx-home-heart text-lg text-slate-400"></i> <span>My Properties</span>`;
        
        if (c.selectedPropertyId === null) {
          // 1. GRID LIST VIEW
          if (c.properties.length === 0) {
            viewport.innerHTML = `
              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 p-6 rounded-2xl text-center space-y-4 max-w-lg mx-auto py-12 animate-fade-in">
                <div class="h-16 w-16 bg-blue-50 dark:bg-slate-800 text-[#1e3a8a] dark:text-blue-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-xs"><i class="bx bx-buildings"></i></div>
                <h3 class="font-display font-extrabold text-base text-slate-900 dark:text-white">No Properties Owned</h3>
                <p class="text-xs text-slate-450 dark:text-slate-400 leading-relaxed font-normal">You currently have no properties or servicing plot allocations logged under your client profile registry.</p>
              </div>
            `;
          } else {
            const cardsHtml = c.properties.map(p => {
              let badgeColor = 'badge-base badge-info';
              if (p.status === 'Fully Paid') badgeColor = 'badge-base badge-success';
              else if (p.status === 'Active') badgeColor = 'bg-indigo-500/10 text-indigo-650';

              return `
                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col text-xs font-semibold text-left">
                  <div class="h-44 relative bg-slate-100 dark:bg-slate-950">
                    <img src="${p.imageUrl}" alt="${p.title}" class="w-full h-full object-cover" />
                    <span class="absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${badgeColor}">${p.status}</span>
                  </div>
                  <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 class="font-black text-slate-900 dark:text-white text-sm">${p.title}</h4>
                      <p class="text-[10px] text-slate-400 font-normal mt-0.5">${p.type} • ${p.plot}</p>
                    </div>

                    <!-- Paid progress -->
                    <div class="space-y-1.5">
                      <div class="flex justify-between text-[9px]">
                        <span class="text-slate-400 uppercase font-bold">Payments Progress</span>
                        <span class="text-slate-800 dark:text-white font-extrabold">${p.pctPaid}% Paid</span>
                      </div>
                      <div class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-600 rounded-full transition-all duration-500" style="width: ${p.pctPaid}%"></div>
                      </div>
                      <div class="flex justify-between text-[9px] text-slate-450 font-normal pt-0.5">
                        <span>Paid: ${fmtNGN(p.paid)}</span>
                        <span>Balance: ${fmtNGN(p.balance)}</span>
                      </div>
                    </div>

                    <button data-view-property-id="${p.id}" class="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-2 rounded-lg text-center active:scale-98 transition-all shadow-xs">
                      View Details &amp; Documents
                    </button>
                  </div>
                </div>
              `;
            }).join('');

            viewport.innerHTML = `
              <div class="space-y-6 text-left animate-fade-in">
                <div>
                  <h3 class="text-sm font-black uppercase text-slate-450 tracking-wider">My Property Holdings</h3>
                  <p class="text-[11px] text-slate-400 font-normal mt-0.5">Manage details and perfection records for all purchased plots.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  ${cardsHtml}
                </div>
              </div>
            `;

            // Bind view detail trigger
            viewport.querySelectorAll('[data-view-property-id]').forEach(btn => {
              btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(btn.getAttribute('data-view-property-id'));
                c.selectedPropertyId = id;
                renderViewport();
              });
            });
          }
        } else {
          // 2. DETAILED PROPERTY VIEW
          const p = c.properties.find(x => x.id === c.selectedPropertyId);
          if (!p) {
            c.selectedPropertyId = null;
            renderViewport();
            return;
          }

          // Build documents logs
          const docsHtml = p.documentsList.map(doc => {
            const isLocked = doc.status === 'Locked';
            const statusBadge = isLocked 
              ? `<span class="bg-slate-100 text-slate-450 dark:bg-slate-800 dark:text-slate-500 text-[8px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 w-fit uppercase"><i class="bx bx-lock-alt"></i> Locked</span>`
              : `<span class="badge-base badge-success text-[8px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 w-fit uppercase"><i class="bx bx-check-circle"></i> Ready</span>`;
            
            const actionBtn = isLocked
              ? `<span class="text-[9px] text-slate-400 font-normal">${doc.reason}</span>`
              : `<button data-download-doc="${doc.name}" class="bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-1 px-3 rounded text-[10px] active:scale-98 transition-all flex items-center gap-0.5 shadow-xs"><i class="bx bx-download"></i> Download</button>`;

            return `
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/25 text-xs font-semibold ${isLocked ? 'opacity-60 bg-slate-50/20' : ''}">
                <td class="p-3 text-slate-900 dark:text-white font-bold">${doc.name}</td>
                <td class="p-3">${statusBadge}</td>
                <td class="p-3 font-mono text-slate-400">${doc.date}</td>
                <td class="p-3 text-right">${actionBtn}</td>
              </tr>
            `;
          }).join('');

          viewport.innerHTML = `
            <div class="space-y-6 text-left animate-fade-in text-xs font-semibold">
              <!-- Back Header -->
              <div class="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-850 pb-3">
                <button id="btn-back-to-properties" class="text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold flex items-center gap-0.5 text-xs"><i class="bx bx-arrow-back text-sm"></i> Back to holdings</button>
                <span class="px-2.5 py-0.5 badge-base badge-info rounded text-[10px] font-extrabold uppercase tracking-wider">${p.plot}</span>
              </div>

              <!-- Main Split: Top Overview Details Card + Image plot map -->
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Details block (7 cols) -->
                <div class="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 rounded-xl p-5 shadow-sm space-y-4">
                  <h3 class="text-sm font-black text-slate-900 dark:text-white">${p.title}</h3>
                  
                  <div class="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div>
                      <span class="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">Property Location</span>
                      <span class="block text-slate-800 dark:text-slate-200 font-bold mt-0.5">${p.location}</span>
                    </div>
                    <div>
                      <span class="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">Allocation Size</span>
                      <span class="block text-slate-800 dark:text-slate-200 font-bold mt-0.5">${p.size} (${p.type})</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div>
                      <span class="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">Purchase Agreement Date</span>
                      <span class="block text-slate-800 dark:text-slate-200 font-mono font-bold mt-0.5">${p.purchaseDate}</span>
                    </div>
                    <div>
                      <span class="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">Plot Coordinates Badge</span>
                      <span class="block text-slate-800 dark:text-slate-200 font-mono font-bold mt-0.5">${p.plot}</span>
                    </div>
                  </div>
                </div>

                <!-- Plot Map illustration (5 cols) -->
                <div class="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 rounded-xl overflow-hidden shadow-sm h-48 lg:h-auto min-h-[160px] relative">
                  <img src="${p.mapUrl}" alt="Plot Map layout" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-slate-950/20 flex items-end p-3 pointer-events-none">
                    <span class="bg-[#1e3a8a]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide font-mono uppercase">Horizon Phase 2 Grid allocation</span>
                  </div>
                </div>
              </div>

              <!-- Bottom Panels: Documents table (Left) + Payment Summary (Right) -->
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Documents (8 cols) -->
                <div class="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 rounded-xl p-5 shadow-sm space-y-4">
                  <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-file-blank"></i> Vetted Titles &amp; Documents</h4>
                  
                  <div class="overflow-x-auto text-[11px]">
                    <table class="w-full text-left border-collapse">
                      <thead>
                        <tr class="bg-slate-50 dark:bg-slate-955 border-b border-slate-200/20 text-slate-400 uppercase text-[8px] tracking-wide font-extrabold">
                          <th class="p-2.5">Document Title</th>
                          <th class="p-2.5">Status</th>
                          <th class="p-2.5">Date Perfected</th>
                          <th class="p-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
                        ${docsHtml}
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Payment Summary (4 cols) -->
                <div class="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-credit-card"></i> Payment Status</h4>
                    
                    <div class="space-y-3.5 pt-3">
                      <div>
                        <span class="block text-[8px] text-slate-400 uppercase font-bold">Total Contract Price</span>
                        <span class="block text-slate-900 dark:text-white font-extrabold text-sm font-mono">${fmtNGN(p.price)}</span>
                      </div>
                      <div>
                        <span class="block text-[8px] text-slate-400 uppercase font-bold text-emerald-650">Amount Paid</span>
                        <span class="block text-emerald-600 font-extrabold text-sm font-mono">${fmtNGN(p.paid)}</span>
                      </div>
                      <div>
                        <span class="block text-[8px] text-slate-400 uppercase font-bold text-rose-600">Outstanding Balance</span>
                        <span class="block text-rose-600 font-extrabold text-sm font-mono">${fmtNGN(p.balance)}</span>
                      </div>
                    </div>
                  </div>

                  <button id="btn-prop-detail-pay" class="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg text-center active:scale-98 transition-all mt-4 flex items-center justify-center gap-1 shadow-xs">
                    <i class="bx bx-plus-circle"></i> Make Payment
                  </button>
                </div>
              </div>

            </div>
          `;

          // Back button logic
          document.querySelector('#btn-back-to-properties')?.addEventListener('click', (e) => {
            e.preventDefault();
            c.selectedPropertyId = null;
            renderViewport();
          });

          // Redirect to payment tab
          document.querySelector('#btn-prop-detail-pay')?.addEventListener('click', (e) => {
            e.preventDefault();
            c.activeTab = 'payments';
            renderViewport();
          });

          // Document downloads alerts mock
          viewport.querySelectorAll('[data-download-doc]').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              const docName = btn.getAttribute('data-download-doc');
              alert(`Simulating document download: "${docName}.pdf" file perfection perfect secure download completed.`);
            });
          });
        }
        break;

      case 'payments':
        if (title) title.innerHTML = `<i class="bx bx-wallet text-lg text-slate-400"></i> <span>Payments &amp; Installments</span>`;
        
        const subview = c.paymentsActiveSubView || 'dashboard';

        if (subview === 'dashboard') {
          // Calculate outstanding balance summary
          const firstProp = c.properties[0];
          const outstanding = firstProp ? firstProp.balance : 0;
          const totalValuation = firstProp ? firstProp.price : 0;

          // History Rows
          const historyRows = c.paymentsHistory.map(h => {
            let statusBadge = 'badge-base badge-success';
            if (h.status === 'Pending Confirmation') statusBadge = 'badge-base badge-warning animate-pulse';
            
            return `
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
                <td class="p-3 font-mono text-slate-400">${h.date}</td>
                <td class="p-3 text-slate-900 dark:text-white font-extrabold">${fmtNGN(h.amount)}</td>
                <td class="p-3 font-normal">${h.method} (${h.bankName || 'N/A'})</td>
                <td class="p-3 font-mono text-slate-450">${h.refNum || '-'}</td>
                <td class="p-3"><span class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${statusBadge}">${h.status}</span></td>
              </tr>
            `;
          }).join('');

          // Upcoming schedule
          const scheduleHtml = c.installmentsSchedule.map((s, idx) => {
            const isNextDue = idx === 0;
            const cardBg = isNextDue 
              ? 'bg-amber-500/5 dark:bg-amber-950/10 border-amber-500/30 dark:border-amber-500/20 shadow-xs ring-1 ring-amber-500/20' 
              : 'bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800';
            
            return `
              <div class="p-4 rounded-xl border flex justify-between items-center text-xs font-semibold ${cardBg}">
                <div class="space-y-1">
                  <div class="flex items-center gap-1.5">
                    <span class="font-extrabold text-slate-800 dark:text-slate-200">Installment Period #${idx + 1}</span>
                    ${isNextDue ? `<span class="bg-amber-500 text-white font-black uppercase tracking-wider text-[8px] px-1.5 py-0.5 rounded animate-pulse">Next Due</span>` : ''}
                  </div>
                  <span class="block text-[10px] text-slate-400 font-normal">Target Date: ${s.dueDate}</span>
                </div>
                <span class="text-sm font-black text-slate-900 dark:text-white font-mono">${fmtNGN(s.amount)}</span>
              </div>
            `;
          }).join('');

          viewport.innerHTML = `
            <div class="space-y-6 text-left animate-fade-in text-xs font-semibold">
              <!-- Top Summary Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl flex items-center justify-between shadow-xs">
                  <div>
                    <span class="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">Outstanding Balance Summary</span>
                    <span class="block text-2xl font-black text-rose-600 font-mono mt-1">${fmtNGN(outstanding)}</span>
                    <span class="block text-[9px] text-slate-400 font-normal mt-0.5">Of total price ${fmtNGN(totalValuation)}</span>
                  </div>
                  <i class="bx bx-shield-quarter text-3xl text-rose-500/30"></i>
                </div>
                
                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl flex items-center justify-between shadow-xs">
                  <div>
                    <span class="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">Payments Actions Hub</span>
                    <div class="flex gap-2 mt-2">
                      <button id="btn-goto-upload-proof" class="bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-1.5 px-3 rounded text-[10px] active:scale-98 transition-all flex items-center gap-1 shadow-xs"><i class="bx bx-plus-circle"></i> Upload Proof</button>
                      <button id="btn-goto-receipts" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded text-[10px] active:scale-98 transition-all flex items-center gap-1"><i class="bx bx-receipt"></i> Receipts Archive</button>
                    </div>
                  </div>
                  <i class="bx bx-wallet text-3xl text-blue-500/20"></i>
                </div>
              </div>

              <!-- Main Content: Schedule (Left) + History Table (Right) -->
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Schedule (4 cols) -->
                <div class="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl shadow-sm space-y-4">
                  <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-calendar-check"></i> Installments Schedule Target</h4>
                  <div class="space-y-3">
                    ${scheduleHtml}
                  </div>
                </div>

                <!-- History Table (8 cols) -->
                <div class="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl shadow-sm space-y-4">
                  <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-history"></i> Full Ledger Transactions Log</h4>
                  
                  <div class="overflow-x-auto text-[11px]">
                    <table class="w-full text-left border-collapse">
                      <thead>
                        <tr class="bg-slate-50 dark:bg-slate-955 border-b border-slate-200/20 text-slate-400 uppercase text-[8px] tracking-wide font-extrabold">
                          <th class="p-2.5">Date Paid</th>
                          <th class="p-2.5">Amount</th>
                          <th class="p-2.5">Channel</th>
                          <th class="p-2.5">Ref No</th>
                          <th class="p-2.5">Verification</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
                        ${historyRows}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          `;

          // Bind Subview Shifts
          document.querySelector('#btn-goto-upload-proof')?.addEventListener('click', (e) => {
            e.preventDefault();
            c.paymentsActiveSubView = 'upload-proof';
            renderViewport();
          });

          document.querySelector('#btn-goto-receipts')?.addEventListener('click', (e) => {
            e.preventDefault();
            c.paymentsActiveSubView = 'receipts-archive';
            renderViewport();
          });
        }

        else if (subview === 'upload-proof') {
          // 2. MAKE PAYMENT / UPLOAD PROOF FORM
          const optionsHtml = c.properties.map(p => `<option value="${p.id}">${p.title} (${p.plot})</option>`).join('');

          viewport.innerHTML = `
            <div class="space-y-6 text-left animate-fade-in text-xs font-semibold max-w-lg mx-auto">
              <!-- Back Header -->
              <div class="border-b border-slate-200/50 dark:border-slate-855 pb-3">
                <button id="btn-back-to-payments" class="text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold flex items-center gap-0.5"><i class="bx bx-arrow-back text-sm"></i> Back to Payments</button>
              </div>

              <!-- Form card -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 p-6 rounded-xl shadow-sm space-y-5">
                <div>
                  <h3 class="font-display font-extrabold text-sm text-slate-900 dark:text-white">Submit Proof of Bank Payment</h3>
                  <p class="text-[10px] text-slate-400 font-normal mt-0.5">Please provide Zenith Bank transaction detail logs to perfect your down payment.</p>
                </div>

                <form id="form-upload-proof" class="space-y-4">
                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-450 uppercase block">Property Allocation *</label>
                    <select id="proof-prop-id" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full">
                      ${optionsHtml}
                    </select>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                      <label class="text-[9px] font-bold text-slate-450 uppercase block">Amount Paid (₦) *</label>
                      <input type="number" id="proof-amount" required placeholder="5000000" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full font-mono" />
                    </div>
                    <div class="space-y-1">
                      <label class="text-[9px] font-bold text-slate-455 uppercase block">Date Perfected *</label>
                      <input type="date" id="proof-date" required class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full font-mono" />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                      <label class="text-[9px] font-bold text-slate-450 uppercase block">Receiving Bank *</label>
                      <input type="text" id="proof-bank" required placeholder="Zenith Bank PLC" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full" />
                    </div>
                    <div class="space-y-1">
                      <label class="text-[9px] font-bold text-slate-450 uppercase block">Transaction Reference No *</label>
                      <input type="text" id="proof-ref" required placeholder="REF-100293849" class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full font-mono" />
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-450 uppercase block">Upload Receipt / Screenshot *</label>
                    <input type="file" id="proof-file" required class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full font-normal" accept="image/*,application/pdf" />
                    <span class="text-[8px] text-slate-400 font-normal">Accepted files: JPG, PNG, PDF. Max size: 5MB</span>
                  </div>

                  <button type="submit" class="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg active:scale-98 transition-all flex items-center justify-center gap-1 shadow-md">
                    <i class="bx bx-upload"></i> Submit Payment Slip
                  </button>
                </form>
              </div>
            </div>
          `;

          // Back button logic
          document.querySelector('#btn-back-to-payments')?.addEventListener('click', (e) => {
            e.preventDefault();
            c.paymentsActiveSubView = 'dashboard';
            renderViewport();
          });

          // Handle form submit
          document.querySelector('#form-upload-proof')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseInt(document.querySelector('#proof-amount').value);
            const date = document.querySelector('#proof-date').value;
            const bankName = document.querySelector('#proof-bank').value.trim();
            const refNum = document.querySelector('#proof-ref').value.trim();

            const newPayment = {
              id: c.paymentsHistory.length + 201,
              date,
              amount,
              method: 'Direct Bank Transfer',
              bankName,
              refNum,
              status: 'Pending Confirmation'
            };

            c.paymentsHistory.push(newPayment);

            // Add activity log
            c.activities.unshift({
              id: c.activities.length + 1,
              type: 'payment',
              title: 'Proof Uploaded',
              desc: `Deposit proof of ${fmtNGN(amount)} submitted. Status: Pending Confirmation.`,
              date: new Date().toISOString().substring(0, 16).replace('T', ' '),
              tab: 'payments'
            });

            alert(`Submitted — awaiting confirmation. Your proof of transfer for ${fmtNGN(amount)} has been uploaded under reference "${refNum}". Status is now Pending Confirmation until verified by our accounts desk.`);
            
            c.paymentsActiveSubView = 'dashboard';
            renderApp();
          });
        }

        else if (subview === 'receipts-archive') {
          // 3. CONFIRMED RECEIPTS ARCHIVE
          const confirmedPayments = c.paymentsHistory.filter(h => h.status === 'Confirmed');

          const receiptsRows = confirmedPayments.map(h => `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-xs font-semibold">
              <td class="p-3 font-mono text-slate-400">${h.date}</td>
              <td class="p-3 text-slate-900 dark:text-white font-extrabold">${fmtNGN(h.amount)}</td>
              <td class="p-3 font-mono text-slate-450">${h.refNum}</td>
              <td class="p-3 font-normal text-emerald-650 uppercase flex items-center gap-0.5"><i class="bx bx-check-shield text-xs"></i> Perfected</td>
              <td class="p-3 text-right">
                <button data-download-receipt="${h.refNum}" class="bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-1 px-3 rounded text-[10px] active:scale-98 transition-all flex items-center gap-0.5 shadow-xs"><i class="bx bx-download"></i> Receipt (PDF)</button>
              </td>
            </tr>
          `).join('');

          viewport.innerHTML = `
            <div class="space-y-6 text-left animate-fade-in text-xs font-semibold max-w-2xl mx-auto">
              <!-- Back Header -->
              <div class="border-b border-slate-200/50 dark:border-slate-855 pb-3">
                <button id="btn-back-to-payments" class="text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold flex items-center gap-0.5"><i class="bx bx-arrow-back text-sm"></i> Back to Payments</button>
              </div>

              <!-- Receipts list card -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl shadow-sm space-y-4">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-receipt"></i> Official Payment Receipts Archive</h4>
                
                <div class="overflow-x-auto text-[11px]">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="bg-slate-50 dark:bg-slate-955 border-b border-slate-200/20 text-slate-400 uppercase text-[8px] tracking-wide font-extrabold">
                        <th class="p-2.5">Date Confirmed</th>
                        <th class="p-2.5">Amount Confirmed</th>
                        <th class="p-2.5">Reference No</th>
                        <th class="p-2.5">Receipt Status</th>
                        <th class="p-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
                      ${receiptsRows || '<tr><td colspan="5" class="p-4 text-center text-slate-400 italic">No confirmed payments available yet.</td></tr>'}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          `;

          // Back button logic
          document.querySelector('#btn-back-to-payments')?.addEventListener('click', (e) => {
            e.preventDefault();
            c.paymentsActiveSubView = 'dashboard';
            renderViewport();
          });

          // Mock download trigger
          viewport.querySelectorAll('[data-download-receipt]').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              const ref = btn.getAttribute('data-download-receipt');
              alert(`Simulating receipt download: "RECEIPT-${ref}.pdf" download started successfully.`);
            });
          });
        }
        break;

      case 'inspections':
        if (title) title.innerHTML = `<i class="bx bx-calendar text-lg text-slate-400"></i> <span>Site Inspections</span>`;
        
        // Separate inspections
        const scheduledTours = c.inspections.filter(i => i.status === 'Pending' || i.status === 'Confirmed');
        const pastTours = c.inspections.filter(i => i.status === 'Done');

        // Render scheduled tours HTML
        const scheduledHtml = scheduledTours.map(t => {
          let statusBadge = 'badge-base badge-warning animate-pulse';
          if (t.status === 'Confirmed') statusBadge = 'badge-base badge-info';

          return `
            <div class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-lg flex justify-between items-center text-xs font-semibold">
              <div class="space-y-0.5">
                <span class="block text-slate-900 dark:text-white font-extrabold">${t.propertyTitle}</span>
                <span class="block text-[9px] text-slate-400 font-normal"><i class="bx bx-time text-xs mr-0.5 align-middle"></i>${t.date}</span>
                ${t.notes ? `<span class="block text-[8.5px] text-slate-450 font-normal mt-0.5 italic">Notes: "${t.notes}"</span>` : ''}
              </div>
              <span class="px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider ${statusBadge}">${t.status}</span>
            </div>
          `;
        }).join('') || `<div class="text-[10px] text-slate-400 italic py-2">No upcoming inspections scheduled.</div>`;

        // Render past tours HTML
        const pastHtml = pastTours.map(t => `
          <div class="p-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-lg space-y-2 text-xs font-semibold">
            <div class="flex justify-between items-center">
              <span class="font-extrabold text-slate-800 dark:text-slate-200">${t.propertyTitle}</span>
              <span class="text-[8.5px] font-mono text-slate-400">${t.date}</span>
            </div>
            <div class="bg-blue-500/5 border-l-2 border-[#1e3a8a] p-2 rounded text-[10px] font-normal leading-relaxed text-slate-500 dark:text-slate-400">
              <strong class="text-[#1e3a8a] dark:text-blue-400 block font-bold text-[9px] uppercase tracking-wider"><i class="bx bx-comment-detail"></i> Post-Inspection Report Summary:</strong>
              ${t.staffFeedback || 'No coordinator logs submitted.'}
            </div>
          </div>
        `).join('') || `<div class="text-[10px] text-slate-400 italic py-2">No historical tour records found.</div>`;

        // Properties dropdown list options
        const ownedOptions = c.properties.map(p => `<option value="${p.title} (${p.plot})">${p.title} (${p.plot})</option>`).join('');

        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold">
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- Left pane: Lists of scheduled tours & history (7 cols) -->
              <div class="lg:col-span-7 space-y-6">
                <!-- Upcoming tours card -->
                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl shadow-xs space-y-3">
                  <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-calendar-event"></i> Scheduled Tours</h4>
                  <div class="space-y-3.5">
                    ${scheduledHtml}
                  </div>
                </div>

                <!-- Past inspection history card -->
                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl shadow-xs space-y-3">
                  <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-history"></i> Inspection History &amp; Feedback</h4>
                  <div class="space-y-3.5">
                    ${pastHtml}
                  </div>
                </div>
              </div>

              <!-- Right pane: Book Inspection Form (5 cols) -->
              <div class="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl shadow-xs space-y-4 h-fit">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-455 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-calendar-plus"></i> Request New Guided Tour</h4>
                
                <form id="form-book-inspection" class="space-y-3.5">
                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-450 block uppercase">Property / Project Selection *</label>
                    <select id="inspect-prop-select" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full">
                      ${ownedOptions}
                      <optgroup label="Pre-purchase Exploration tours">
                        <option value="Interest in: Grand Horizon Estates, Phase 2 (Pre-purchase)">Interest in: Grand Horizon Estates, Phase 2</option>
                        <option value="Interest in: Magnolia Diplomat Mansion (Pre-purchase)">Interest in: Magnolia Diplomat Mansion</option>
                        <option value="Interest in: General Browsing Tour">General pre-purchase exploration tour</option>
                      </optgroup>
                    </select>
                  </div>

                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-455 block uppercase">Preferred Date &amp; Time *</label>
                    <input type="datetime-local" id="inspect-date-time" required class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full font-mono" />
                  </div>

                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-450 block uppercase">Tour Coordinator Instructions (Notes)</label>
                    <textarea id="inspect-notes" placeholder="Specify any preferences e.g. morning slot, structural layout questions..." class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full h-20 resize-none"></textarea>
                  </div>

                  <button type="submit" class="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg active:scale-98 transition-all flex items-center justify-center gap-1 shadow-md">
                    <i class="bx bx-calendar-plus"></i> Schedule Booking
                  </button>
                </form>
              </div>
            </div>
          </div>
        `;

        // Handle Form Submit
        document.querySelector('#form-book-inspection')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const propertyTitle = document.querySelector('#inspect-prop-select').value;
          const dateRaw = document.querySelector('#inspect-date-time').value;
          const notes = document.querySelector('#inspect-notes').value.trim();

          const formattedDate = dateRaw.replace('T', ' ');

          const newInspection = {
            id: c.inspections.length + 401,
            date: formattedDate,
            propertyTitle,
            status: 'Pending',
            notes
          };

          c.inspections.unshift(newInspection);

          // Add Activity log
          c.activities.unshift({
            id: c.activities.length + 1,
            type: 'inspection',
            title: 'Tour Scheduled',
            desc: `Site tour booked for "${propertyTitle}" on ${formattedDate}. Status: Pending Confirmation.`,
            date: new Date().toISOString().substring(0, 16).replace('T', ' '),
            tab: 'inspections'
          });

          alert(`Booking Submitted. Your inspection slot for "${propertyTitle}" on ${formattedDate} has been requested. Status: Pending Confirmation.`);
          
          renderViewport();
        });
        break;

      case 'kyc':
        if (title) title.innerHTML = `<i class="bx bx-id-card text-lg text-slate-400"></i> <span>KYC Verification</span>`;
        
        // Sync overall parameters
        const totalDocs = Object.keys(c.kycDocs).length;
        const verifiedDocs = Object.values(c.kycDocs).filter(d => d.status === 'Verified').length;
        const kycFinished = verifiedDocs === totalDocs;

        // Render slots
        const slotsHtml = Object.entries(c.kycDocs).map(([key, doc]) => {
          let statusBadge = 'bg-slate-100 text-slate-450 dark:bg-slate-800 dark:text-slate-500';
          if (doc.status === 'Verified') statusBadge = 'badge-base badge-success';
          else if (doc.status === 'Pending') statusBadge = 'badge-base badge-warning animate-pulse';
          else if (doc.status === 'Rejected') statusBadge = 'badge-base badge-danger';

          const isUploadable = doc.status === 'Rejected' || doc.status === 'Not Submitted';
          
          let formHtml = '';
          if (isUploadable) {
            formHtml = `
              <form data-kyc-form="${key}" class="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <div class="space-y-1">
                  <label class="text-[9px] font-bold text-slate-400 block uppercase">Upload PDF or JPG screenshot</label>
                  <input type="file" required class="form-input text-[10px] bg-slate-50 dark:bg-slate-950 py-1 w-full" accept="image/*,application/pdf" />
                </div>
                <button type="submit" class="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-1.5 rounded active:scale-98 transition-all flex items-center justify-center gap-1 shadow-xs">
                  <i class="bx bx-upload"></i> ${doc.status === 'Rejected' ? 'Re-upload File' : 'Submit File'}
                </button>
              </form>
            `;
          } else {
            formHtml = `
              <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400 font-normal flex items-center gap-1 italic">
                <i class="bx bx-check-shield text-emerald-650 text-xs"></i> File locked securely under compliance review
              </div>
            `;
          }

          let rejectMsgHtml = '';
          if (doc.status === 'Rejected' && doc.reason) {
            rejectMsgHtml = `
              <div class="bg-rose-500/5 border border-rose-500/10 p-2.5 rounded text-[10px] font-normal leading-relaxed text-rose-600 dark:text-rose-400 text-left mt-2">
                <strong class="font-bold block text-[9.5px] uppercase tracking-wider"><i class="bx bx-info-circle"></i> Rejected by Admin:</strong>
                "${doc.reason}"
              </div>
            `;
          }

          return `
            <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl flex flex-col justify-between shadow-xs text-xs font-semibold">
              <div>
                <div class="flex justify-between items-start gap-2">
                  <h4 class="font-bold text-slate-850 dark:text-white text-xs">${doc.name}</h4>
                  <span class="px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider shrink-0 ${statusBadge}">${doc.status}</span>
                </div>
                ${rejectMsgHtml}
              </div>
              ${formHtml}
            </div>
          `;
        }).join('');

        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold">
            
            <!-- Overall Progress Summary Banner -->
            <div class="p-5 rounded-xl border ${kycFinished ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700' : 'bg-amber-500/5 border-amber-500/20 text-amber-700'} flex items-center justify-between shadow-xs">
              <div class="space-y-1">
                <h3 class="font-display font-extrabold text-sm flex items-center gap-1.5">
                  <i class="bx bx-shield-check text-lg"></i>
                  KYC Verification Profile Progress
                </h3>
                <p class="text-[10.5px] font-normal leading-relaxed text-slate-450 dark:text-slate-400">
                  Compliance perfected: **${verifiedDocs} of ${totalDocs}** required identification coordinates cleared.
                </p>
              </div>
              <span class="text-lg font-black font-mono shrink-0">${verifiedDocs}/${totalDocs} Verified</span>
            </div>

            <!-- Upload Slots Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              ${slotsHtml}
            </div>
          </div>
        `;

        // Handle upload submit events
        viewport.querySelectorAll('form[data-kyc-form]').forEach(form => {
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            const key = form.getAttribute('data-kyc-form');
            const doc = c.kycDocs[key];

            doc.status = 'Pending';
            doc.date = new Date().toISOString().substring(0, 10);
            doc.reason = '';

            // Add activity log
            c.activities.unshift({
              id: c.activities.length + 1,
              type: 'kyc',
              title: 'KYC File Updated',
              desc: `Re-uploaded document verification for "${doc.name}". Status: Pending review.`,
              date: new Date().toISOString().substring(0, 16).replace('T', ' '),
              tab: 'kyc'
            });

            alert(`Verification Submitted. Your document for "${doc.name}" has been uploaded successfully. Status: Pending compliance review.`);
            
            renderApp();
          });
        });
        break;

      case 'referral':
        if (title) title.innerHTML = `<i class="bx bx-share-alt text-lg text-slate-400"></i> <span>Referral / Affiliate Info</span>`;
        
        let affiliateCardHtml = '';
        if (c.profile.isAffiliate) {
          affiliateCardHtml = `
            <div class="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 p-5 rounded-xl text-left space-y-3">
              <span class="badge-base badge-success text-[9px] px-2 py-0.5 rounded font-black tracking-wider uppercase"><i class="bx bx-check-shield"></i> Registered Affiliate Partner</span>
              <h4 class="font-extrabold text-xs text-slate-900 dark:text-white">You are an active partner in our Elite Program!</h4>
              <p class="text-[10px] text-slate-450 leading-relaxed font-normal">Monitor your downline hierarchies, check accrued commissions overrides, and launch payout perfect transfers.</p>
              <button id="btn-open-affiliate-portal" class="bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-1.5 px-4 rounded text-[10px] active:scale-98 transition-all flex items-center gap-1 shadow-xs"><i class="bx bx-launch"></i> Open Affiliate Portal</button>
            </div>
          `;
        } else {
          affiliateCardHtml = `
            <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl text-left space-y-3">
              <h4 class="font-extrabold text-xs text-slate-900 dark:text-white">Join the Elite Affiliate Partner Program</h4>
              <p class="text-[10px] text-slate-450 leading-relaxed font-normal">Accrue up to 10% direct payment commissions and 5% passive overrides by recommending our vetted residential estates.</p>
              <button id="btn-learn-affiliate" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-4 rounded text-[10px] active:scale-98 transition-all flex items-center gap-1"><i class="bx bx-info-circle"></i> Learn About Referral Program</button>
            </div>
          `;
        }

        let referrerNoteHtml = '';
        if (c.profile.referredByName) {
          referrerNoteHtml = `
            <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/80 p-4 rounded-lg text-left text-xs font-semibold text-slate-655 flex items-center gap-1.5">
              <i class="bx bx-gift text-lg text-amber-500"></i>
              <span>You were referred by <strong>${c.profile.referredByName}</strong></span>
            </div>
          `;
        } else {
          referrerNoteHtml = `
            <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/80 p-4 rounded-lg text-left text-xs font-normal text-slate-450 italic">
              No parent referrer coordinate registered to your profile.
            </div>
          `;
        }

        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in max-w-xl mx-auto">
            ${referrerNoteHtml}
            ${affiliateCardHtml}
          </div>
        `;

        // Bind portal redirects
        document.querySelector('#btn-open-affiliate-portal')?.addEventListener('click', (e) => {
          e.preventDefault();
          state.activeRoute = 'affiliate';
          renderApp();
        });

        document.querySelector('#btn-learn-affiliate')?.addEventListener('click', (e) => {
          e.preventDefault();
          state.activeRoute = 'affiliate';
          renderApp();
        });
        break;

      case 'support':
        if (title) title.innerHTML = `<i class="bx bx-help-circle text-lg text-slate-400"></i> <span>Support / Help</span>`;
        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- FAQs Column (7 cols) -->
              <div class="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl shadow-xs space-y-4">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-help-circle"></i> Frequently Asked Questions</h4>
                
                <div class="space-y-3 text-[11px]">
                  <div class="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                    <button class="faq-toggle-btn w-full text-left p-3 bg-slate-50/50 dark:bg-slate-900 flex justify-between items-center text-slate-800 dark:text-white font-extrabold focus:outline-none">
                      <span>How do I request my deed allocation letter?</span>
                      <i class="bx bx-chevron-down text-slate-400 transition-transform"></i>
                    </button>
                    <div class="faq-content p-3 text-slate-450 font-normal leading-relaxed border-t border-slate-100 dark:border-slate-800 hidden">
                      Deeds of Assignment and physical land allocations are perfected after completing at least 50% milestone clearance of the total property valuation list.
                    </div>
                  </div>

                  <div class="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                    <button class="faq-toggle-btn w-full text-left p-3 bg-slate-50/50 dark:bg-slate-900 flex justify-between items-center text-slate-800 dark:text-white font-extrabold focus:outline-none">
                      <span>Can I schedule weekend site inspections?</span>
                      <i class="bx bx-chevron-down text-slate-400 transition-transform"></i>
                    </button>
                    <div class="faq-content p-3 text-slate-455 font-normal leading-relaxed border-t border-slate-100 dark:border-slate-800 hidden">
                      Yes. Guided physical tour coordinators schedule bookings for Saturdays from 10:00 AM to 4:00 PM. Please request slots via the Site Inspections booking panel.
                    </div>
                  </div>

                  <div class="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                    <button class="faq-toggle-btn w-full text-left p-3 bg-slate-50/50 dark:bg-slate-900 flex justify-between items-center text-slate-800 dark:text-white font-extrabold focus:outline-none">
                      <span>What happens if a bank transfer payment isn't verified?</span>
                      <i class="bx bx-chevron-down text-slate-400 transition-transform"></i>
                    </button>
                    <div class="faq-content p-3 text-slate-455 font-normal leading-relaxed border-t border-slate-100 dark:border-slate-800 hidden">
                      Please upload the transfer screenshot and reference number inside the Payments &amp; Installments sub-view. The administrative billing desk audits slips within 24 hours.
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ticket Form Column (5 cols) -->
              <div class="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl shadow-xs space-y-4 h-fit">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-455 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-message-rounded-add"></i> Submit Help Ticket</h4>
                
                <form id="form-support-ticket" class="space-y-3.5">
                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-450 block uppercase">Inquiry Subject *</label>
                    <input type="text" id="ticket-subject" required placeholder="e.g., Deed perfection fee coordinates" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full" />
                  </div>

                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-450 block uppercase">Detailed Message *</label>
                    <textarea id="ticket-message" required placeholder="Explain your inquiry details here..." class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full h-24 resize-none"></textarea>
                  </div>

                  <button type="submit" class="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg active:scale-98 transition-all flex items-center justify-center gap-1 shadow-md">
                    <i class="bx bx-send"></i> Submit Ticket
                  </button>
                </form>
              </div>
            </div>
          </div>
        `;

        // Bind collapsibles
        viewport.querySelectorAll('.faq-toggle-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const panel = btn.nextElementSibling;
            const chevron = btn.querySelector('.bx-chevron-down') || btn.querySelector('.bx-chevron-up');
            
            panel.classList.toggle('hidden');
            if (chevron) {
              if (panel.classList.contains('hidden')) {
                chevron.className = 'bx bx-chevron-down text-slate-400 transition-transform';
              } else {
                chevron.className = 'bx bx-chevron-up text-slate-400 transition-transform';
              }
            }
          });
        });

        // Handle ticket submission
        document.querySelector('#form-support-ticket')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const subject = document.querySelector('#ticket-subject').value.trim();
          const message = document.querySelector('#ticket-message').value.trim();

          // Push ticket to admin simulation queue
          if (state.admin && state.admin.kycQueue) {
            // Mock adding a ticket record
            if (!state.admin.tickets) state.admin.tickets = [];
            state.admin.tickets.unshift({
              id: state.admin.tickets.length + 101,
              requesterName: c.profile.name,
              subject,
              message,
              source: 'Customer Portal',
              priority: 'Medium',
              status: 'Open',
              date: 'Just now'
            });
          }

          // Add activity feed
          c.activities.unshift({
            id: c.activities.length + 1,
            type: 'support',
            title: 'Help Ticket Logged',
            desc: `Support ticket regarding "${subject}" submitted successfully.`,
            date: new Date().toISOString().substring(0, 16).replace('T', ' '),
            tab: 'support'
          });

          alert(`Ticket created successfully. Source: Customer Portal. Our advisor team has received reference ticket for "${subject}".`);
          
          document.querySelector('#form-support-ticket').reset();
          renderViewport();
        });
        break;

      case 'profile-settings':
        if (title) title.innerHTML = `<i class="bx bx-cog text-lg text-slate-400"></i> <span>Profile &amp; Settings</span>`;
        
        let emailVerifyMsg = '';
        if (c.profile.email !== 'client@blueskye.com') {
          emailVerifyMsg = `
            <div class="bg-amber-500/10 border border-amber-500/20 text-amber-650 p-2.5 rounded text-[10px] font-normal leading-relaxed text-left">
              <i class="bx bx-info-circle align-middle mr-0.5"></i>
              <strong>Email verification pending:</strong> A verification link has been sent to <strong>${c.profile.email}</strong>.
            </div>
          `;
        }

        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold">
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- Left Pane: Edit Profile & Password Form (7 cols) -->
              <div class="lg:col-span-7 space-y-6">
                
                <!-- Edit Personal info card -->
                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl shadow-xs space-y-4">
                  <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5"><i class="bx bx-user-circle"></i> Edit Personal coordinates</h4>
                  ${emailVerifyMsg}
                  <form id="form-edit-personal" class="space-y-3.5">
                    <div class="space-y-1">
                      <label class="text-[9px] font-bold text-slate-450 uppercase">Legal Full Name *</label>
                      <input type="text" id="profile-edit-name" value="${c.profile.name}" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full" />
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div class="space-y-1">
                        <label class="text-[9px] font-bold text-slate-450 uppercase">Email Address *</label>
                        <input type="email" id="profile-edit-email" value="${c.profile.email}" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full font-mono" />
                      </div>
                      <div class="space-y-1">
                        <label class="text-[9px] font-bold text-slate-450 uppercase">Phone Number *</label>
                        <input type="tel" id="profile-edit-phone" value="${c.profile.phone}" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full font-mono" />
                      </div>
                    </div>
                    <button type="submit" class="bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-2 px-5 rounded-lg active:scale-98 transition-all shadow-xs">Update Profile Coordinates</button>
                  </form>
                </div>

                <!-- Change Password Form Card -->
                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl shadow-xs space-y-4">
                  <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5"><i class="bx bx-lock-alt"></i> Change Password</h4>
                  <form id="form-edit-password" class="space-y-3.5">
                    <div class="space-y-1">
                      <label class="text-[9px] font-bold text-slate-455 uppercase">Current Security Password</label>
                      <input type="password" id="pass-current" required placeholder="••••••••" class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full font-mono" />
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div class="space-y-1">
                        <label class="text-[9px] font-bold text-slate-455 uppercase">New Password</label>
                        <input type="password" id="pass-new" required placeholder="••••••••" class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full font-mono" />
                      </div>
                      <div class="space-y-1">
                        <label class="text-[9px] font-bold text-slate-455 uppercase">Confirm New Password</label>
                        <input type="password" id="pass-confirm" required placeholder="••••••••" class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full font-mono" />
                      </div>
                    </div>
                    <button type="submit" class="bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-2 px-5 rounded-lg active:scale-98 transition-all shadow-xs">Change Password</button>
                  </form>
                </div>
              </div>

              <!-- Right Pane: Notification Preferences (5 cols) -->
              <div class="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl shadow-xs space-y-4 h-fit">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5"><i class="bx bx-bell"></i> Notification Preferences</h4>
                
                <form id="form-notif-prefs" class="space-y-4">
                  <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <div class="space-y-0.5 text-left">
                      <span class="block font-extrabold text-slate-800 dark:text-slate-200">Email Alerts</span>
                      <p class="text-[9.5px] text-slate-450 font-normal">Receive installment warnings and payment confirmation pdfs.</p>
                    </div>
                    <input type="checkbox" id="pref-email" ${c.profile.notifPrefs.email ? 'checked' : ''} class="w-4 h-4 text-blue-650 rounded border-slate-200 focus:ring-blue-500" />
                  </div>

                  <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <div class="space-y-0.5 text-left">
                      <span class="block font-extrabold text-slate-800 dark:text-slate-200">SMS Notifications</span>
                      <p class="text-[9.5px] text-slate-450 font-normal">Receive immediate site inspection confirmations directly on phone.</p>
                    </div>
                    <input type="checkbox" id="pref-sms" ${c.profile.notifPrefs.sms ? 'checked' : ''} class="w-4 h-4 text-blue-650 rounded border-slate-200 focus:ring-blue-500" />
                  </div>

                  <div class="flex items-center justify-between py-2">
                    <div class="space-y-0.5 text-left">
                      <span class="block font-extrabold text-slate-800 dark:text-slate-200">Browser Push updates</span>
                      <p class="text-[9.5px] text-slate-450 font-normal">Accrue dashboard compliance logs alerts instantly.</p>
                    </div>
                    <input type="checkbox" id="pref-push" ${c.profile.notifPrefs.push ? 'checked' : ''} class="w-4 h-4 text-blue-650 rounded border-slate-200 focus:ring-blue-500" />
                  </div>

                  <button type="submit" class="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-2 rounded-lg text-center active:scale-98 transition-all shadow-xs">Save Toggles</button>
                </form>
              </div>
            </div>

          </div>
        `;

        // Handle profile submit
        document.querySelector('#form-edit-personal')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.querySelector('#profile-edit-name').value.trim();
          const email = document.querySelector('#profile-edit-email').value.trim();
          const phone = document.querySelector('#profile-edit-phone').value.trim();

          c.profile.name = name;
          c.profile.email = email;
          c.profile.phone = phone;

          alert('Client profile settings updated successfully.');
          renderApp();
        });

        // Handle password submit
        document.querySelector('#form-edit-password')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const cur = document.querySelector('#pass-current').value;
          const pNew = document.querySelector('#pass-new').value;
          const confirm = document.querySelector('#pass-confirm').value;

          if (pNew !== confirm) {
            alert('Validation Error: New passwords do not match!');
            return;
          }

          alert('Security settings saved. Security credentials modified successfully.');
          document.querySelector('#form-edit-password').reset();
          renderViewport();
        });

        // Handle notification preference submit
        document.querySelector('#form-notif-prefs')?.addEventListener('submit', (e) => {
          e.preventDefault();
          c.profile.notifPrefs.email = document.querySelector('#pref-email').checked;
          c.profile.notifPrefs.sms = document.querySelector('#pref-sms').checked;
          c.profile.notifPrefs.push = document.querySelector('#pref-push').checked;

          alert('Notification preferences updated and saved.');
          renderViewport();
        });
        break;

      case 'notifications':
        if (title) title.innerHTML = `<i class="bx bx-bell text-lg text-slate-400"></i> <span>Notifications Log</span>`;
        
        const noticesHtml = c.notificationsList.map(n => {
          let iconClass = 'bx bx-info-circle text-slate-450';
          if (n.tab === 'payments') iconClass = 'bx bx-credit-card text-emerald-650';
          else if (n.tab === 'kyc') iconClass = 'bx bx-shield-check text-blue-650';
          else if (n.tab === 'inspections') iconClass = 'bx bx-calendar text-indigo-650';

          return `
            <div data-link-to-tab="${n.tab}" data-notif-id="${n.id}" class="flex justify-between items-center py-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-855/20 px-3 cursor-pointer rounded-lg transition-colors ${n.isRead ? 'opacity-70 font-normal' : 'font-extrabold bg-[#1e3a8a]/5'}" title="Click to view details">
              <div class="flex gap-3 items-center min-w-0">
                <i class="${iconClass} text-lg shrink-0"></i>
                <div class="min-w-0 text-left">
                  <span class="block text-slate-900 dark:text-white text-xs">${n.title}</span>
                  <p class="text-[9.5px] text-slate-450 dark:text-slate-400 font-normal leading-relaxed truncate">${n.desc}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="text-[8px] text-slate-400 font-mono">${n.date}</span>
                ${!n.isRead ? `<span class="h-2 w-2 rounded-full bg-red-500"></span>` : ''}
              </div>
            </div>
          `;
        }).join('') || `<div class="text-[10px] text-slate-450 italic py-4">No notification alerts logs.</div>`;

        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl shadow-sm">
            <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 flex items-center gap-1.5"><i class="bx bx-bell-off"></i> Platform Notification Center</h4>
              <button id="btn-notif-mark-all-read" class="text-[10px] text-[#1e3a8a] dark:text-blue-400 hover:underline">Mark all as read</button>
            </div>
            
            <div class="divide-y divide-slate-100 dark:divide-slate-850">
              ${noticesHtml}
            </div>
          </div>
        `;

        // Bind clicks on notifications list to mark as read and switch tabs
        viewport.querySelectorAll('[data-notif-id]').forEach(el => {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(el.getAttribute('data-notif-id'));
            const tab = el.getAttribute('data-link-to-tab');
            const notice = c.notificationsList.find(x => x.id === id);
            if (notice) notice.isRead = true;

            c.activeTab = tab;
            renderViewport();
            
            // Sync unread badge count
            const unreadCount = c.notificationsList.filter(n => !n.isRead).length;
            const badge = document.querySelector('#cust-notif-btn span');
            if (badge) {
              if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.classList.remove('hidden');
              } else {
                badge.classList.add('hidden');
              }
            }
          });
        });

        // Mark all as read
        document.querySelector('#btn-notif-mark-all-read')?.addEventListener('click', (e) => {
          e.preventDefault();
          c.notificationsList.forEach(n => n.isRead = true);
          const badge = document.querySelector('#cust-notif-btn span');
          if (badge) badge.classList.add('hidden');
          
          alert('All notifications marked as read.');
          renderViewport();
        });
        break;
    }
  }

  renderViewport();
}
