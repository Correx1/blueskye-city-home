import affiliateTemplates from '../affiliate-view.html?raw';

function getSection(name) {
  const startMarker = `data-section="${name}"`;
  const startIdx = affiliateTemplates.indexOf(startMarker);
  if (startIdx === -1) return '';
  const divStart = affiliateTemplates.lastIndexOf('<div', startIdx);
  const endMarker = `END SECTION: ${name}`;
  const endCommentIdx = affiliateTemplates.indexOf(endMarker, startIdx);
  if (endCommentIdx === -1) return '';
  const closingDiv = affiliateTemplates.lastIndexOf('</div>', endCommentIdx);
  if (closingDiv === -1) return '';
  return affiliateTemplates.slice(divStart, closingDiv + 6);
}

function fmtNGN(val) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
}

// Ensure default affiliate states
export function ensureAffiliateState(state) {
  if (!state.affiliate) {
    state.affiliate = {
      isAuthenticated: false,
      activeTab: 'dashboard',
      profile: {
        name: 'Jane Yusuf Alao',
        email: 'partner@blueskye.com',
        phone: '+234 809 123 4567',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        affiliate_type: 'Strategic Partner', // Ambassador (10%), Referral Partner (5%), Strategic Partner (20%)
        commission_rate: 20,
        kycStatus: 'Pending',
        bankDetails: {
          bankName: 'Zenith Bank PLC',
          accountNumber: '2081736271',
          accountName: 'Jane Yusuf Alao'
        }
      },
      salesCount: 14,
      gen1Earned: 24000000,
      gen2Earned: 5500000,
      pendingWithdrawals: 450000,
      privacyMaskingEnabled: false,
      allowDownlineSalesVisibility: true,
      referralCode: 'JANE-ALAO-STRAT',
      referralLink: 'https://blueskye.com/join?ref=JANE-ALAO-STRAT',
      bankVerificationPending: false,
      sales: [
        { id: 301, customer: 'Olumide Alao', property: 'Grand Horizon Estates, Phase 2', date: '2026-07-16', val: 50000000, rate: 20, commission: 10000000, level: 'Gen 1', status: 'Paid' },
        { id: 302, customer: 'Adebayo Cole', property: 'Skyline Heights Apartments', date: '2026-07-14', val: 35000000, rate: 20, commission: 7000000, level: 'Gen 1', status: 'Approved' },
        { id: 303, customer: 'Chidi Okafor', property: 'Grand Horizon Estates, Phase 2', date: '2026-07-10', val: 50000000, rate: 5, commission: 2500000, level: 'Gen 2', status: 'Approved', referrer: 'Adeyemi Adeleke' },
        { id: 304, customer: 'Ngozi Nwachukwu', property: 'Skyline Heights Apartments', date: '2026-06-28', val: 35000000, rate: 20, commission: 7000000, level: 'Gen 1', status: 'Paid' },
        { id: 305, customer: 'Bose Balogun', property: 'Eko Beachfront Terraces', date: '2026-06-15', val: 60000000, rate: 5, commission: 3000000, level: 'Gen 2', status: 'Paid', referrer: 'Adeyemi Adeleke' }
      ],
      commissions: [
        { id: 401, date: '2026-07-16', txId: 'TX-COMM-401', source: 'Olumide Alao', property: 'Grand Horizon Estates', val: 50000000, level: 'Gen 1', rate: 20, amt: 10000000, status: 'Paid' },
        { id: 402, date: '2026-07-14', txId: 'TX-COMM-402', source: 'Adebayo Cole', property: 'Skyline Heights Apt', val: 35000000, level: 'Gen 1', rate: 20, amt: 7000000, status: 'Approved' },
        { id: 403, date: '2026-07-10', txId: 'TX-COMM-403', source: 'Chidi Okafor (Adeyemi)', property: 'Grand Horizon Estates', val: 50000000, level: 'Gen 2', rate: 5, amt: 2500000, status: 'Approved' },
        { id: 404, date: '2026-06-28', txId: 'TX-COMM-404', source: 'Ngozi Nwachukwu', property: 'Skyline Heights Apt', val: 35000000, level: 'Gen 1', rate: 20, amt: 7000000, status: 'Paid' },
        { id: 405, date: '2026-06-15', txId: 'TX-COMM-405', source: 'Bose Balogun (Adeyemi)', property: 'Eko Beachfront Terraces', val: 60000000, level: 'Gen 2', rate: 5, amt: 3000000, status: 'Paid' }
      ],
      withdrawals: [
        { id: 501, date: '2026-07-15', amount: 450000, status: 'Pending', bankName: 'Zenith Bank PLC', accountNo: '2081736271', refNote: '' },
        { id: 502, date: '2026-07-12', amount: 350000, status: 'Paid', bankName: 'Zenith Bank PLC', accountNo: '2081736271', refNote: 'Zenith Bank Ref #102930219' }
      ],
      downlines: [
        { id: 601, name: 'Adeyemi Adeleke', dateJoined: '2026-05-20', totalSalesCount: 2, commissionGenerated: 5500000, sales: [
          { customer: 'Chidi Okafor', property: 'Grand Horizon Estates, Phase 2', date: '2026-07-10', val: 50000000, commission: 2500000 },
          { customer: 'Bose Balogun', property: 'Eko Beachfront Terraces', date: '2026-06-15', val: 60000000, commission: 3000000 }
        ]},
        { id: 602, name: 'Akin Olatunde', dateJoined: '2026-07-10', totalSalesCount: 0, commissionGenerated: 0, sales: [] }
      ],
      notificationsList: [
        { id: 1, title: 'Commission Credited', desc: '₦2,500,000 Override Commission credited from downline sale.', date: '2026-07-10 12:00', isRead: false, tab: 'commissions' },
        { id: 2, title: 'Withdrawal Approved', desc: '₦350,000 payout Zenith Bank transfer completed.', date: '2026-07-12 11:30', isRead: false, tab: 'withdrawals' },
        { id: 3, title: 'New Downline Partner Joined', desc: 'Akin Olatunde registered under your recruitment link.', date: '2026-07-10 09:00', isRead: true, tab: 'downlines' },
        { id: 4, title: 'KYC Verification Status', desc: 'Govt ID & Passport photo cleared compliance audits.', date: '2026-07-08 14:20', isRead: true, tab: 'kyc' }
      ],
      kycDocs: {
        govId: { name: 'Government ID', status: 'Verified', date: '2026-07-08', file: 'id_card.png' },
        passport: { name: 'Passport Photograph', status: 'Verified', date: '2026-07-08', file: 'passport.png' },
        bankDetails: { name: 'Bank Details Validation', status: 'Verified', date: '2026-07-08', file: 'bank_statement.png' },
        address: { name: 'Proof of Address', status: 'Verified', date: '2026-07-08', file: 'utility_bill.png' }
      },
      activities: [
        { id: 1, type: 'sale', title: 'New Sale Attributed (Gen 1)', desc: 'Plot 42 sale attributed to Amina Yusuf closed.', date: '2026-07-16 10:15', tab: 'sales' },
        { id: 2, type: 'commission', title: 'Gen-2 Commission Credited', desc: '₦250,500 override credited from sub-affiliate Adeleke sales.', date: '2026-07-15 16:40', tab: 'commissions' },
        { id: 3, type: 'withdrawal', title: 'Withdrawal Perfected', desc: '₦350,000 withdrawal request status updated to Paid.', date: '2026-07-12 11:30', tab: 'withdrawals' },
        { id: 4, type: 'downline', title: 'New Sub-Partner Joined (Gen 2)', desc: 'Akin Olatunde registered under your direct recruit link.', date: '2026-07-10 09:00', tab: 'downlines' },
        { id: 5, type: 'kyc', title: 'KYC Document Under Review', desc: 'Lagos utility bill address upload submitted to compliance.', date: '2026-07-08 14:20', tab: 'kyc' },
        { id: 6, type: 'system', title: 'Partner Account Activated', desc: 'Welcome to BlueSky City Affiliate Workspace console.', date: '2026-07-01 10:00', tab: 'dashboard' }
      ]
    };
  }
}

// Router Renderer
export function renderAffiliatePortal(state) {
  ensureAffiliateState(state);
  
  if (!state.affiliate.isAuthenticated) {
    return getSection('affiliate-login-template');
  }
  return getSection('affiliate-shell-template');
}

// Bind Listeners
export function bindAffiliateListeners(state, root, renderApp) {
  ensureAffiliateState(state);

  const aff = state.affiliate;

  // 1. UNAUTHENTICATED LOGIN FLOWS
  if (!aff.isAuthenticated) {
    const loginInterface = document.querySelector('#aff-login-interface');
    const registerInterface = document.querySelector('#aff-register-interface');
    const forgotInterface = document.querySelector('#aff-forgot-interface');
    const tabLogin = document.querySelector('[data-aff-auth-tab="login"]');
    const tabRegister = document.querySelector('[data-aff-auth-tab="register"]');

    function applyAuthTab(tab) {
      aff.authSubTab = tab;
      if (tab === 'login') {
        tabLogin?.classList.add('border-blue-600', 'text-blue-600', 'dark:border-blue-400', 'dark:text-blue-400');
        tabLogin?.classList.remove('border-transparent', 'text-slate-400');
        tabRegister?.classList.add('border-transparent', 'text-slate-400');
        tabRegister?.classList.remove('border-blue-600', 'text-blue-600', 'dark:border-blue-400', 'dark:text-blue-400');
        
        loginInterface?.classList.remove('hidden');
        registerInterface?.classList.add('hidden');
        forgotInterface?.classList.add('hidden');
      } else {
        tabRegister?.classList.add('border-blue-600', 'text-blue-600', 'dark:border-blue-400', 'dark:text-blue-400');
        tabRegister?.classList.remove('border-transparent', 'text-slate-400');
        tabLogin?.classList.add('border-transparent', 'text-slate-400');
        tabLogin?.classList.remove('border-blue-600', 'text-blue-600', 'dark:border-blue-400', 'dark:text-blue-400');
        
        registerInterface?.classList.remove('hidden');
        loginInterface?.classList.add('hidden');
        forgotInterface?.classList.add('hidden');
      }
    }

    tabLogin?.addEventListener('click', () => applyAuthTab('login'));
    tabRegister?.addEventListener('click', () => applyAuthTab('register'));

    if (!aff.authSubTab) aff.authSubTab = 'login';
    applyAuthTab(aff.authSubTab);

    // Register Form Submit
    const regForm = document.querySelector('#aff-register-form');
    regForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Hide tabs and forms
      document.querySelector('#aff-auth-tabs')?.classList.add('hidden');
      document.querySelector('#aff-register-interface')?.classList.add('hidden');
      const successView = document.querySelector('#aff-register-success-interface');
      if (successView) successView.classList.remove('hidden');

      // Bind Back to Login
      document.querySelector('#aff-success-login-btn')?.addEventListener('click', (ev) => {
        ev.preventDefault();
        regForm.reset();
        successView?.classList.add('hidden');
        document.querySelector('#aff-auth-tabs')?.classList.remove('hidden');
        applyAuthTab('login');
      }, { once: true });
    });

    // Forgot Password triggers
    document.querySelector('#aff-forgot-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      loginInterface?.classList.add('hidden');
      registerInterface?.classList.add('hidden');
      forgotInterface?.classList.remove('hidden');
    });

    document.querySelector('#aff-forgot-cancel')?.addEventListener('click', (e) => {
      e.preventDefault();
      applyAuthTab('login');
    });

    // Forgot password submit
    const forgotForm = document.querySelector('#aff-forgot-form');
    forgotForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const banner = document.querySelector('#aff-forgot-success-banner');
      if (banner) {
        banner.classList.remove('hidden');
        setTimeout(() => {
          banner.classList.add('hidden');
          forgotForm.reset();
          loginInterface?.classList.remove('hidden');
          forgotInterface?.classList.add('hidden');
        }, 3000);
      }
    });

    // Login Form Submit
    const loginForm = document.querySelector('#aff-login-form');
    loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.querySelector('#aff-login-email').value.trim();
      const simKyc = document.querySelector('input[name="aff-kyc-sim"]:checked').value;

      aff.profile.email = email || 'partner@blueskye.com';
      aff.profile.name = email.split('@')[0].toUpperCase();
      aff.profile.kycStatus = simKyc;
      
      // Setup rates based on type
      if (email.includes('ambassador')) {
        aff.profile.affiliate_type = 'Ambassador';
        aff.profile.commission_rate = 10;
      } else if (email.includes('referral')) {
        aff.profile.affiliate_type = 'Referral Partner';
        aff.profile.commission_rate = 5;
      } else {
        aff.profile.affiliate_type = 'Strategic Partner';
        aff.profile.commission_rate = 20;
      }

      aff.isAuthenticated = true;
      alert(`Welcome back ${aff.profile.name}! Logging in as ${aff.profile.affiliate_type} (${aff.profile.commission_rate}% commission).`);
      renderApp();
    });
    return;
  }

  // 2. AUTHENTICATED PORTAL WORKSPACE
  // Pre-fill profile elements
  const avatarR = document.querySelector('#aff-profile-avatar-right');
  const typeH = document.querySelector('#aff-type-header-label');
  const nameH = document.querySelector('#aff-header-name');
  const roleH = document.querySelector('#aff-header-role');

  if (avatarR) avatarR.src = aff.profile.avatar;
  if (typeH) typeH.textContent = aff.profile.affiliate_type;
  if (nameH) nameH.textContent = aff.profile.name;
  if (roleH) roleH.textContent = aff.profile.affiliate_type;

  // Sync KYC Banner Notice
  const bannerNotice = document.querySelector('#affiliate-kyc-pending-banner');
  if (bannerNotice) {
    if (aff.profile.kycStatus === 'Pending') {
      bannerNotice.classList.remove('hidden');
    } else {
      bannerNotice.classList.add('hidden');
    }
  }

  // Dark Mode Toggle logic (affiliate-specific)
  if (!aff.theme) {
    aff.theme = localStorage.getItem('blueskye_affiliate_theme') || 'light';
  }
  const layoutContainer = document.querySelector('#affiliate-main-layout');
  const themeIconEl = document.querySelector('#aff-theme-icon');

  function applyAffiliateTheme() {
    if (layoutContainer) {
      if (aff.theme === 'dark') {
        layoutContainer.classList.add('dark');
      } else {
        layoutContainer.classList.remove('dark');
      }
    }
    if (themeIconEl) {
      themeIconEl.className = aff.theme === 'dark' ? 'bx bx-sun text-lg' : 'bx bx-moon text-lg';
    }
  }

  // Initial theme sync
  applyAffiliateTheme();

  document.querySelector('#aff-dark-mode-toggle')?.addEventListener('click', (e) => {
    e.preventDefault();
    aff.theme = aff.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('blueskye_affiliate_theme', aff.theme);
    applyAffiliateTheme();
  });

  // Sidebar Toggle (Matching Admin layout collapse + overlay)
  const mobileToggle = document.querySelector('#aff-mobile-toggle');
  const sidebar = document.querySelector('#affiliate-sidebar');
  const overlay = document.querySelector('#aff-sidebar-overlay');

  mobileToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    if (sidebar) {
      const isCollapsed = sidebar.classList.contains('-translate-x-full') || sidebar.classList.contains('lg:-translate-x-full');
      if (isCollapsed) {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.remove('lg:-translate-x-full');
        if (overlay) {
          overlay.classList.remove('hidden');
          setTimeout(() => {
            overlay.classList.remove('opacity-0');
          }, 10);
        }
      } else {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.add('lg:-translate-x-full');
        if (overlay) {
          overlay.classList.add('opacity-0');
          overlay.addEventListener('transitionend', function hideOverlay() {
            overlay.classList.add('hidden');
            overlay.removeEventListener('transitionend', hideOverlay);
          }, { once: true });
        }
      }
    }
  });

  overlay?.addEventListener('click', (e) => {
    e.preventDefault();
    sidebar?.classList.add('-translate-x-full');
    sidebar?.classList.add('lg:-translate-x-full');
    overlay.classList.add('opacity-0');
    overlay.addEventListener('transitionend', function hideOverlay() {
      overlay.classList.add('hidden');
      overlay.removeEventListener('transitionend', hideOverlay);
    }, { once: true });
  });

  // Dynamic Notifications Setup
  const notifBtn = document.querySelector('#aff-notif-btn');
  const notifDropdown = document.querySelector('#aff-notif-dropdown');
  const notifBadge = document.querySelector('#aff-notif-badge');
  const notifList = document.querySelector('#aff-notif-list');
  const clearBtn = document.querySelector('#aff-notif-clear-btn');
  const viewAllBtn = document.querySelector('#aff-notif-view-all');

  function updateNotifBadge() {
    const unreadCount = aff.notificationsList.filter(n => !n.isRead).length;
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
    const notices = aff.notificationsList.slice(0, 15);
    if (notices.length === 0) {
      notifList.innerHTML = `<div class="text-[10px] text-slate-400 italic py-4 text-center">No new notifications.</div>`;
      return;
    }

    notifList.innerHTML = notices.map(n => `
      <div data-aff-notif-id="${n.id}" class="py-2.5 px-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all flex items-start gap-2.5 ${!n.isRead ? 'bg-emerald-50/20 dark:bg-emerald-955/15 font-bold border-l-2 border-emerald-500' : 'opacity-70'}">
        <span class="h-2 w-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-emerald-500' : 'bg-slate-350'}"></span>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-baseline gap-1">
            <h4 class="text-[10px] truncate text-slate-900 dark:text-white font-extrabold">${n.title}</h4>
            <span class="text-[7.5px] text-slate-400 font-normal shrink-0">${n.date}</span>
          </div>
          <p class="text-[9px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">${n.desc}</p>
        </div>
      </div>
    `).join('');

    notifList.querySelectorAll('[data-aff-notif-id]').forEach(el => {
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const id = parseInt(el.getAttribute('data-aff-notif-id'));
        const notice = aff.notificationsList.find(x => x.id === id);
        if (notice) {
          notice.isRead = true;
          updateNotifBadge();
          notifDropdown?.classList.add('hidden');
          aff.activeTab = notice.tab || 'dashboard';
          renderViewport();
        }
      });
    });
  }

  clearBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    aff.notificationsList.forEach(n => n.isRead = true);
    updateNotifBadge();
    renderNotifList();
    if (aff.activeTab === 'notifications') {
      renderViewport();
    }
  });

  viewAllBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    aff.activeTab = 'notifications';
    notifDropdown?.classList.add('hidden');
    renderViewport();
  });

  // Toggle avatar account dropdown menu
  const avatarBtn = document.querySelector('#aff-avatar-btn');
  const avatarDropdown = document.querySelector('#aff-avatar-dropdown');
  const avatarChevron = document.querySelector('#aff-avatar-chevron');

  const dpAvatar = document.querySelector('#aff-dropdown-avatar');
  const dpName = document.querySelector('#aff-dropdown-name');
  const dpEmail = document.querySelector('#aff-dropdown-email');
  const dpBadge = document.querySelector('#aff-dropdown-badge');

  avatarBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    avatarDropdown?.classList.toggle('hidden');
    notifDropdown?.classList.add('hidden');
    avatarChevron?.classList.toggle('rotate-180');

    // Populate data dynamically
    if (dpName) dpName.textContent = aff.profile.name;
    if (dpEmail) dpEmail.textContent = aff.profile.email;
    if (dpBadge) dpBadge.textContent = aff.profile.affiliate_type;
    if (dpAvatar) dpAvatar.src = aff.profile.avatar;
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
  document.querySelector('#aff-dropdown-profile')?.addEventListener('click', (e) => {
    e.preventDefault();
    avatarDropdown?.classList.add('hidden');
    avatarChevron?.classList.remove('rotate-180');
    aff.activeTab = 'profile-settings';
    renderViewport();
  });

  document.querySelector('#aff-dropdown-preferences')?.addEventListener('click', (e) => {
    e.preventDefault();
    avatarDropdown?.classList.add('hidden');
    avatarChevron?.classList.remove('rotate-180');
    aff.activeTab = 'profile-settings';
    renderViewport();
  });

  document.querySelector('#aff-sidebar-settings-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    aff.activeTab = 'profile-settings';
    renderViewport();
  });

  // Logout actions & modals
  const logoutModal = document.querySelector('#aff-logout-confirm-modal');
  const logoutModalCancel = document.querySelector('#aff-logout-cancel');
  const logoutModalConfirm = document.querySelector('#aff-logout-confirm');

  document.querySelector('#aff-dropdown-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    avatarDropdown?.classList.add('hidden');
    avatarChevron?.classList.remove('rotate-180');
    logoutModal?.classList.remove('hidden');
  });

  // Sidebar logout widget sync
  document.querySelector('#aff-logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    logoutModal?.classList.remove('hidden');
  });

  logoutModalCancel?.addEventListener('click', (e) => {
    e.stopPropagation();
    logoutModal?.classList.add('hidden');
  });

  logoutModalConfirm?.addEventListener('click', (e) => {
    e.stopPropagation();
    logoutModal?.classList.add('hidden');
    aff.isAuthenticated = false;
    aff.activeTab = 'dashboard';
    renderApp();
  });

  // Left rail Navigation buttons click listeners
  document.querySelectorAll('#affiliate-nav-rail button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = btn.getAttribute('data-aff-tab');
      aff.activeTab = tab;
      renderViewport();
    });
  });

  // Render Viewport Placeholders
  function renderViewport() {
    const viewport = document.querySelector('#aff-viewport');
    const title = document.querySelector('#aff-viewport-title');
    if (!viewport) return;

    // Reset button highlights
    document.querySelectorAll('#affiliate-nav-rail button').forEach(btn => {
      const tab = btn.getAttribute('data-aff-tab');
      if (tab === aff.activeTab) {
        btn.className = "affiliate-menu-btn active w-full flex items-center gap-3 py-3 px-4 rounded text-left font-semibold text-white hover:bg-white/10 transition-all duration-150";
      } else {
        btn.className = "affiliate-menu-btn w-full flex items-center gap-3 py-3 px-4 rounded text-left font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all duration-150";
      }
    });

    // Content viewports routing
    switch (aff.activeTab) {
      case 'dashboard':
        if (title) title.innerHTML = `<i class="bx bx-grid-alt text-lg text-emerald-600"></i> <span>Partner Dashboard</span>`;
        
        // KYC Badge
        let kycBadge = 'bg-slate-100 text-slate-450';
        if (aff.profile.kycStatus === 'Verified') kycBadge = 'badge-base badge-success';
        else if (aff.profile.kycStatus === 'Pending') kycBadge = 'badge-base badge-warning animate-pulse';

        // Activities list
        const activityRows = aff.activities.map(act => {
          let iconClass = 'bx bx-info-circle text-slate-450 bg-slate-100 dark:bg-slate-800';
          if (act.type === 'sale') iconClass = 'bx bx-shopping-bag text-blue-650 bg-blue-50 dark:bg-blue-950/20';
          else if (act.type === 'commission') iconClass = 'bx bx-coin-stack badge-base badge-success dark:bg-emerald-950/20';
          else if (act.type === 'withdrawal') iconClass = 'bx bx-export badge-base badge-warning dark:bg-amber-950/20';
          else if (act.type === 'downline') iconClass = 'bx bx-group text-purple-650 bg-purple-50 dark:bg-purple-950/20';

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
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold">
            <!-- Header Banner detailing Partner Type and base rates -->
            <div class="bg-[#0f172a] text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div class="space-y-1">
                <h3 class="font-display font-extrabold text-lg sm:text-xl">Good day, ${aff.profile.name}!</h3>
                <p class="text-xs text-white/70 font-normal max-w-lg">Track downline hierarchy sales, request withdrawals, and perfect campaign links.</p>
              </div>
              <div class="bg-white/5 border border-white/10 rounded-xl p-3 shrink-0 text-left space-y-1 min-w-[200px]">
                <div class="flex items-center gap-1.5">
                  <span class="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span class="text-[10px] text-emerald-400 uppercase tracking-widest font-black font-mono">${aff.profile.affiliate_type}</span>
                </div>
                <div class="text-[10px] text-white/80 font-normal mt-1 leading-relaxed">
                  Rate: <strong>${aff.profile.commission_rate}%</strong> direct (Gen 1) <br>
                  Rate: <strong>5%</strong> indirect (Gen 2 overrides)
                </div>
              </div>
            </div>

            <!-- 5 Summary Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1">
                <span class="block text-[8.5px] text-slate-400 uppercase font-bold tracking-wider">Total Sales Made</span>
                <span class="block text-lg font-black text-slate-900 dark:text-white">${aff.salesCount} Units</span>
                <span class="block text-[8px] text-slate-450 font-normal">Gen 1 + Gen 2 total</span>
              </div>
              
              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1">
                <span class="block text-[8.5px] text-slate-400 uppercase font-bold tracking-wider">Gen 1 Commission</span>
                <span class="block text-lg font-black text-slate-900 dark:text-white font-mono">${fmtNGN(aff.gen1Earned)}</span>
                <span class="block text-[8px] text-emerald-650 font-normal">From direct sales</span>
              </div>

              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1">
                <span class="block text-[8.5px] text-slate-400 uppercase font-bold tracking-wider">Gen 2 Commission</span>
                <span class="block text-lg font-black text-slate-900 dark:text-white font-mono">${fmtNGN(aff.gen2Earned)}</span>
                <span class="block text-[8px] text-purple-600 font-normal">From downline recruits</span>
              </div>

              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1">
                <span class="block text-[8.5px] text-slate-400 uppercase font-bold tracking-wider">Pending Payouts</span>
                <span class="block text-lg font-black text-slate-900 dark:text-white font-mono">${fmtNGN(aff.pendingWithdrawals)}</span>
                <span class="block text-[8px] text-amber-600 font-normal">Awaiting confirmation</span>
              </div>

              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1">
                <span class="block text-[8.5px] text-slate-400 uppercase font-bold tracking-wider">KYC Compliance Badge</span>
                <span class="block text-sm font-black uppercase tracking-wider py-1 px-2.5 rounded w-fit mt-1.5 ${kycBadge}">${aff.profile.kycStatus}</span>
              </div>
            </div>

            <!-- Chart (Left) + Activities (Right) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- Earnings Trend stacked SVG bar chart (7 cols) -->
              <div class="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
                <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 flex items-center gap-1.5"><i class="bx bx-bar-chart-alt-2"></i> Commissions Earnings Trend</h4>
                  <div class="flex gap-3 text-[8.5px] font-bold uppercase tracking-wider">
                    <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-[#1e3a8a]"></span> Gen 1</span>
                    <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-emerald-500"></span> Gen 2</span>
                  </div>
                </div>

                <!-- SVG rendering chart -->
                <div class="w-full">
                  <svg viewBox="0 0 500 160" class="w-full overflow-visible">
                    <!-- Grid Lines -->
                    <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(148, 163, 184, 0.15)" stroke-dasharray="3,3" />
                    <line x1="40" y1="60" x2="480" y2="60" stroke="rgba(148, 163, 184, 0.15)" stroke-dasharray="3,3" />
                    <line x1="40" y1="100" x2="480" y2="100" stroke="rgba(148, 163, 184, 0.15)" stroke-dasharray="3,3" />
                    <line x1="40" y1="130" x2="480" y2="130" stroke="rgba(148, 163, 184, 0.15)" />

                    <!-- Month May (Col 1) -->
                    <!-- Gen 1 Bar -->
                    <rect x="90" y="50" width="30" height="80" rx="4" fill="#1e3a8a" />
                    <!-- Gen 2 Bar -->
                    <rect x="125" y="90" width="30" height="40" rx="4" fill="#10b981" />
                    <text x="122" y="145" font-size="9" fill="#94a3b8" text-anchor="middle" font-weight="800">MAY</text>

                    <!-- Month June (Col 2) -->
                    <!-- Gen 1 Bar -->
                    <rect x="220" y="30" width="30" height="100" rx="4" fill="#1e3a8a" />
                    <!-- Gen 2 Bar -->
                    <rect x="255" y="70" width="30" height="60" rx="4" fill="#10b981" />
                    <text x="252" y="145" font-size="9" fill="#94a3b8" text-anchor="middle" font-weight="800">JUNE</text>

                    <!-- Month July (Col 3) -->
                    <!-- Gen 1 Bar -->
                    <rect x="350" y="40" width="30" height="90" rx="4" fill="#1e3a8a" />
                    <!-- Gen 2 Bar -->
                    <rect x="385" y="60" width="30" height="70" rx="4" fill="#10b981" />
                    <text x="382" y="145" font-size="9" fill="#94a3b8" text-anchor="middle" font-weight="800">JULY</text>

                    <!-- Value Labels -->
                    <text x="105" y="45" font-size="8" fill="#1e3a8a" text-anchor="middle" font-weight="bold">₦2.0M</text>
                    <text x="140" y="85" font-size="8" fill="#10b981" text-anchor="middle" font-weight="bold">₦0.5M</text>

                    <text x="235" y="25" font-size="8" fill="#1e3a8a" text-anchor="middle" font-weight="bold">₦2.5M</text>
                    <text x="270" y="65" font-size="8" fill="#10b981" text-anchor="middle" font-weight="bold">₦0.8M</text>

                    <text x="365" y="35" font-size="8" fill="#1e3a8a" text-anchor="middle" font-weight="bold">₦1.9M</text>
                    <text x="400" y="55" font-size="8" fill="#10b981" text-anchor="middle" font-weight="bold">₦0.7M</text>
                  </svg>
                </div>
              </div>

              <!-- Recent Activity Feed (5 cols) -->
              <div class="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-3">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-history"></i> Recent Network Activity</h4>
                <div class="divide-y divide-slate-100 dark:divide-slate-850">
                  ${activityRows}
                </div>
              </div>
            </div>

          </div>
        `;

        // Delegate click links inside dashboard viewports
        viewport.querySelectorAll('[data-link-to-tab]').forEach(el => {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = el.getAttribute('data-link-to-tab');
            aff.activeTab = tab;
            renderViewport();
          });
        });
        break;

      case 'sales':
        if (title) title.innerHTML = `<i class="bx bx-shopping-bag text-lg text-emerald-600"></i> <span>My Sales Log</span>`;
        
        // Masking helper
        const maskName = (name) => {
          if (!name) return '';
          if (!aff.privacyMaskingEnabled) return name;
          const parts = name.split(' ');
          return parts.map(p => p.charAt(0) + '***' + (p.length > 1 ? p.charAt(p.length - 1) : '')).join(' ');
        };

        // Filter states (local UI caches)
        if (!aff._salesFilter) {
          aff._salesFilter = { start: '', end: '', prop: 'all' };
        }

        const uniqueProps = [...new Set(aff.sales.map(s => s.property))];
        const propOptions = uniqueProps.map(p => `<option value="${p}" ${aff._salesFilter.prop === p ? 'selected' : ''}>${p}</option>`).join('');

        // Apply filters
        const filteredSales = aff.sales.filter(s => {
          const matchesProp = aff._salesFilter.prop === 'all' || s.property === aff._salesFilter.prop;
          let matchesDate = true;
          if (aff._salesFilter.start) {
            matchesDate = matchesDate && s.date >= aff._salesFilter.start;
          }
          if (aff._salesFilter.end) {
            matchesDate = matchesDate && s.date <= aff._salesFilter.end;
          }
          return matchesProp && matchesDate;
        });

        const salesRows = filteredSales.map(s => `
          <tr class="border-b border-slate-100 dark:border-slate-800 text-[11px] hover:bg-slate-50/40 dark:hover:bg-slate-850/10">
            <td class="py-3 px-4 text-slate-900 dark:text-white font-extrabold">${maskName(s.customer)}</td>
            <td class="py-3 px-4 text-slate-500 font-normal">${s.property}</td>
            <td class="py-3 px-4 font-mono text-slate-400">${s.date}</td>
            <td class="py-3 px-4 text-slate-500 font-normal">
              <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase ${s.level === 'Gen 1' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20' : 'bg-purple-50 text-purple-600 dark:bg-purple-950/20'}">
                ${s.level}
              </span>
            </td>
            <td class="py-3 px-4 font-mono text-slate-900 dark:text-white">${fmtNGN(s.val)}</td>
            <td class="py-3 px-4 font-mono text-emerald-600">${fmtNGN(s.commission)}</td>
            <td class="py-3 px-4 text-right">
              <button data-view-sale-id="${s.id}" class="text-[#1e3a8a] dark:text-blue-400 hover:underline font-bold text-[10px]"><i class="bx bx-show align-middle"></i> View</button>
            </td>
          </tr>
        `).join('') || `<tr><td colspan="7" class="py-8 text-center text-slate-450 italic">No matching sales records.</td></tr>`;

        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold">
            <!-- Filter Actions Header -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 flex items-center gap-1.5"><i class="bx bx-filter-alt"></i> Filter Parameters</h4>
                <div class="flex items-center gap-2">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="sales-privacy-toggle" ${aff.privacyMaskingEnabled ? 'checked' : ''} class="sr-only peer" />
                    <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                    <span class="ml-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mask Customer Names</span>
                  </label>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="space-y-1">
                  <label class="text-[9px] font-bold text-slate-400 uppercase">Property Vetted</label>
                  <select id="sales-filter-prop" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full">
                    <option value="all">All Properties</option>
                    ${propOptions}
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="text-[9px] font-bold text-slate-400 uppercase">Start Date</label>
                  <input type="date" id="sales-filter-start" value="${aff._salesFilter.start}" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full" />
                </div>
                <div class="space-y-1">
                  <label class="text-[9px] font-bold text-slate-400 uppercase">End Date</label>
                  <input type="date" id="sales-filter-end" value="${aff._salesFilter.end}" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full" />
                </div>
              </div>
            </div>

            <!-- Sales Table -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[9px] font-bold uppercase tracking-wider text-slate-450">
                      <th class="py-3 px-4">Customer</th>
                      <th class="py-3 px-4">Property</th>
                      <th class="py-3 px-4">Sale Date</th>
                      <th class="py-3 px-4">Generation</th>
                      <th class="py-3 px-4">Sale Value</th>
                      <th class="py-3 px-4">Commission Earned</th>
                      <th class="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${salesRows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Modals Area (Initially Hidden) -->
          <div id="sale-detail-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 hidden">
            <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200/30 dark:border-slate-800 max-w-sm w-full p-6 space-y-4 animate-scale-up text-left">
              <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 flex items-center gap-1"><i class="bx bx-file-find text-base"></i> Sale Ledger Breakdown</h4>
                <button id="btn-close-sale-modal" class="text-slate-400 hover:text-slate-600"><i class="bx bx-x text-lg"></i></button>
              </div>
              <div class="space-y-3 text-[11px] leading-relaxed">
                <div class="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                  <span class="text-slate-400 font-normal">Customer:</span>
                  <span class="font-extrabold text-slate-900 dark:text-white" id="modal-cust">-</span>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                  <span class="text-slate-400 font-normal">Property allocation:</span>
                  <span class="font-extrabold text-slate-900 dark:text-white" id="modal-prop">-</span>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                  <span class="text-slate-400 font-normal">Sale Date:</span>
                  <span class="font-mono text-slate-900 dark:text-white" id="modal-date">-</span>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                  <span class="text-slate-400 font-normal">Total Sale Value:</span>
                  <span class="font-mono text-slate-900 dark:text-white" id="modal-val">-</span>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                  <span class="text-slate-400 font-normal">Generation Tier:</span>
                  <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase" id="modal-level">-</span>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                  <span class="text-slate-400 font-normal">Commission Rate:</span>
                  <span class="font-extrabold text-slate-900 dark:text-white" id="modal-rate">-</span>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                  <span class="text-slate-400 font-normal">Commission Amount:</span>
                  <span class="font-mono text-emerald-600 text-xs" id="modal-commission">-</span>
                </div>
                <div class="flex justify-between py-1">
                  <span class="text-slate-400 font-normal">Payment Payout Status:</span>
                  <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase" id="modal-status">-</span>
                </div>
              </div>
              <button id="btn-close-sale-modal-bottom" class="w-full bg-[#1e3a8a] text-white py-2 rounded font-bold hover:bg-blue-800 transition-colors">Dismiss Details</button>
            </div>
          </div>
        `;

        // Bind filter event change listeners
        document.querySelector('#sales-filter-prop')?.addEventListener('change', (e) => {
          aff._salesFilter.prop = e.target.value;
          renderViewport();
        });
        document.querySelector('#sales-filter-start')?.addEventListener('change', (e) => {
          aff._salesFilter.start = e.target.value;
          renderViewport();
        });
        document.querySelector('#sales-filter-end')?.addEventListener('change', (e) => {
          aff._salesFilter.end = e.target.value;
          renderViewport();
        });

        // Toggle privacy setting
        document.querySelector('#sales-privacy-toggle')?.addEventListener('change', (e) => {
          aff.privacyMaskingEnabled = e.target.checked;
          renderViewport();
        });

        // Row details buttons
        viewport.querySelectorAll('[data-view-sale-id]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(btn.getAttribute('data-view-sale-id'));
            const sale = aff.sales.find(x => x.id === id);
            if (sale) {
              document.querySelector('#modal-cust').textContent = maskName(sale.customer);
              document.querySelector('#modal-prop').textContent = sale.property;
              document.querySelector('#modal-date').textContent = sale.date;
              document.querySelector('#modal-val').textContent = fmtNGN(sale.val);
              
              const levelSpan = document.querySelector('#modal-level');
              levelSpan.textContent = sale.level;
              levelSpan.className = sale.level === 'Gen 1' ? 'px-2 py-0.5 rounded text-[8px] font-black uppercase bg-blue-50 text-blue-600 dark:bg-blue-950/20' : 'px-2 py-0.5 rounded text-[8px] font-black uppercase bg-purple-50 text-purple-600 dark:bg-purple-950/20';

              document.querySelector('#modal-rate').textContent = `${sale.rate}% applied`;
              document.querySelector('#modal-commission').textContent = fmtNGN(sale.commission);
              
              const statusSpan = document.querySelector('#modal-status');
              statusSpan.textContent = sale.status;
              statusSpan.className = sale.status === 'Paid' ? 'px-2 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-50 text-emerald-650' : 'px-2 py-0.5 rounded text-[8px] font-black uppercase bg-amber-50 text-amber-650';

              document.querySelector('#sale-detail-modal').classList.remove('hidden');
            }
          });
        });

        // Close modal triggers
        const closeModal = () => {
          document.querySelector('#sale-detail-modal')?.classList.add('hidden');
        };
        document.querySelector('#btn-close-sale-modal')?.addEventListener('click', closeModal);
        document.querySelector('#btn-close-sale-modal-bottom')?.addEventListener('click', closeModal);
        break;

      case 'commissions':
        if (title) title.innerHTML = `<i class="bx bx-line-chart text-lg text-emerald-600"></i> <span>My Commissions</span>`;
        
        // Filter states (local UI caches)
        if (!aff._commFilter) {
          aff._commFilter = { start: '', end: '', level: 'all', status: 'all' };
        }

        // Apply filters
        const filteredComms = aff.commissions.filter(cRecord => {
          const matchesLevel = aff._commFilter.level === 'all' || cRecord.level === aff._commFilter.level;
          const matchesStatus = aff._commFilter.status === 'all' || cRecord.status === aff._commFilter.status;
          let matchesDate = true;
          if (aff._commFilter.start) {
            matchesDate = matchesDate && cRecord.date >= aff._commFilter.start;
          }
          if (aff._commFilter.end) {
            matchesDate = matchesDate && cRecord.date <= aff._commFilter.end;
          }
          return matchesLevel && matchesStatus && matchesDate;
        });

        // Sum computations
        const runningEarned = aff.commissions.reduce((acc, cr) => acc + cr.amt, 0);
        const withdrawnAmt = 27550000; // Simulated historical payout perfection total
        const curBalance = runningEarned - withdrawnAmt;

        const ledgerRows = filteredComms.map(cr => `
          <tr class="border-b border-slate-100 dark:border-slate-800 text-[11px] hover:bg-slate-50/40 dark:hover:bg-slate-850/10">
            <td class="py-3 px-4 font-mono text-slate-400">${cr.date}</td>
            <td class="py-3 px-4 font-mono text-slate-900 dark:text-white">${cr.txId}</td>
            <td class="py-3 px-4 text-slate-500 font-normal">${cr.source}</td>
            <td class="py-3 px-4 text-slate-500 font-normal">${cr.property}</td>
            <td class="py-3 px-4 font-mono text-slate-655">${fmtNGN(cr.val)}</td>
            <td class="py-3 px-4">
              <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase ${cr.level === 'Gen 1' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20' : 'bg-purple-50 text-purple-600 dark:bg-purple-950/20'}">
                ${cr.level}
              </span>
            </td>
            <!-- Separate Generation stream columns representation -->
            <td class="py-3 px-4 font-mono font-extrabold text-slate-900 dark:text-white text-right">
              ${cr.level === 'Gen 1' ? fmtNGN(cr.amt) : '—'}
            </td>
            <td class="py-3 px-4 font-mono font-extrabold text-slate-900 dark:text-white text-right">
              ${cr.level === 'Gen 2' ? fmtNGN(cr.amt) : '—'}
            </td>
            <td class="py-3 px-4 text-right">
              <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase ${cr.status === 'Paid' ? 'bg-emerald-50 text-emerald-650' : 'bg-amber-50 text-amber-650'}">
                ${cr.status}
              </span>
            </td>
          </tr>
        `).join('') || `<tr><td colspan="9" class="py-8 text-center text-slate-450 italic">No matching commissions ledger records.</td></tr>`;

        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold">
            
            <!-- running balances header -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1">
                <span class="block text-[8.5px] text-slate-450 uppercase font-bold tracking-wider">Running Total Earned</span>
                <span class="block text-base font-black text-slate-900 dark:text-white font-mono">${fmtNGN(runningEarned)}</span>
                <span class="block text-[8px] text-slate-450 font-normal">Gen 1 + Gen 2 historical</span>
              </div>
              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1">
                <span class="block text-[8.5px] text-slate-450 uppercase font-bold tracking-wider">Total Withdrawn Payouts</span>
                <span class="block text-base font-black text-slate-900 dark:text-white font-mono">${fmtNGN(withdrawnAmt)}</span>
                <span class="block text-[8px] text-emerald-650 font-normal">Cleared to bank accounts</span>
              </div>
              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1">
                <span class="block text-[8.5px] text-slate-450 uppercase font-bold tracking-wider">Current Account Balance</span>
                <span class="block text-base font-black text-emerald-650 font-mono">${fmtNGN(curBalance)}</span>
                <span class="block text-[8px] text-slate-450 font-normal">Withdrawable funds balance</span>
              </div>
            </div>

            <!-- Filters & CSV triggers panel -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 flex items-center gap-1.5"><i class="bx bx-filter"></i> Commissions ledger Filter</h4>
                <button id="btn-export-comm-csv" class="bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-1.5 px-4 rounded text-[10px] active:scale-98 transition-all flex items-center gap-1 shadow-xs"><i class="bx bx-download"></i> Export CSV</button>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="space-y-1">
                  <label class="text-[9px] font-bold text-slate-400 uppercase">Generation level</label>
                  <select id="comm-filter-level" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full">
                    <option value="all" ${aff._commFilter.level === 'all' ? 'selected' : ''}>All Levels</option>
                    <option value="Gen 1" ${aff._commFilter.level === 'Gen 1' ? 'selected' : ''}>Gen 1 (Direct)</option>
                    <option value="Gen 2" ${aff._commFilter.level === 'Gen 2' ? 'selected' : ''}>Gen 2 (Override)</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="text-[9px] font-bold text-slate-400 uppercase">Payout Status</label>
                  <select id="comm-filter-status" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full">
                    <option value="all" ${aff._commFilter.status === 'all' ? 'selected' : ''}>All Statuses</option>
                    <option value="Paid" ${aff._commFilter.status === 'Paid' ? 'selected' : ''}>Paid</option>
                    <option value="Approved" ${aff._commFilter.status === 'Approved' ? 'selected' : ''}>Approved</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="text-[9px] font-bold text-slate-400 uppercase">Start Date</label>
                  <input type="date" id="comm-filter-start" value="${aff._commFilter.start}" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full" />
                </div>
                <div class="space-y-1">
                  <label class="text-[9px] font-bold text-slate-400 uppercase">End Date</label>
                  <input type="date" id="comm-filter-end" value="${aff._commFilter.end}" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full" />
                </div>
              </div>
            </div>

            <!-- Ledger Table -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[9px] font-bold uppercase tracking-wider text-slate-455">
                      <th class="py-3 px-4">Date</th>
                      <th class="py-3 px-4">TX ID</th>
                      <th class="py-3 px-4">Source Client</th>
                      <th class="py-3 px-4">Property</th>
                      <th class="py-3 px-4">Sale Value</th>
                      <th class="py-3 px-4">Generation</th>
                      <th class="py-3 px-4 text-right">Gen 1 Earned</th>
                      <th class="py-3 px-4 text-right">Gen 2 Earned</th>
                      <th class="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${ledgerRows}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        `;

        // Bind filter event change listeners
        document.querySelector('#comm-filter-level')?.addEventListener('change', (e) => {
          aff._commFilter.level = e.target.value;
          renderViewport();
        });
        document.querySelector('#comm-filter-status')?.addEventListener('change', (e) => {
          aff._commFilter.status = e.target.value;
          renderViewport();
        });
        document.querySelector('#comm-filter-start')?.addEventListener('change', (e) => {
          aff._commFilter.start = e.target.value;
          renderViewport();
        });
        document.querySelector('#comm-filter-end')?.addEventListener('change', (e) => {
          aff._commFilter.end = e.target.value;
          renderViewport();
        });

        // Trigger CSV download
        document.querySelector('#btn-export-comm-csv')?.addEventListener('click', (e) => {
          e.preventDefault();
          
          const headers = ["Date", "Transaction ID", "Source", "Property", "Sale Value", "Generation", "Commission Rate %", "Amount Earned", "Status"];
          const csvLines = [headers.join(",")];
          
          filteredComms.forEach(cRecord => {
            const line = [
              cRecord.date,
              cRecord.txId,
              cRecord.source.replace(/,/g, ''),
              cRecord.property.replace(/,/g, ''),
              cRecord.val,
              cRecord.level,
              cRecord.rate,
              cRecord.amt,
              cRecord.status
            ];
            csvLines.push(line.join(","));
          });

          const csvBlob = new Blob([csvLines.join("\n")], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(csvBlob);
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", `commissions_report_${new Date().toISOString().substring(0,10)}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          alert('CSV Report download triggered successfully.');
        });
        break;

      case 'withdrawals':
        if (title) title.innerHTML = `<i class="bx bx-export text-lg text-emerald-600"></i> <span>Withdrawal Requests</span>`;
        
        // Sum calculation
        const totComms = aff.commissions.reduce((acc, cr) => acc + cr.amt, 0);
        const withdrawnTotal = aff.withdrawals.filter(w => w.status === 'Paid').reduce((acc, w) => acc + w.amount, 0);
        const pendingTotal = aff.withdrawals.filter(w => w.status === 'Pending').reduce((acc, w) => acc + w.amount, 0);
        const currentBalance = totComms - withdrawnTotal - pendingTotal;

        // History rows
        const withdrawalHistoryRows = aff.withdrawals.map(w => {
          let statusBadge = 'bg-slate-100 text-slate-455';
          if (w.status === 'Paid') statusBadge = 'badge-base badge-success';
          else if (w.status === 'Pending') statusBadge = 'badge-base badge-warning';

          return `
            <tr class="border-b border-slate-100 dark:border-slate-800 text-[11px] hover:bg-slate-50/40 dark:hover:bg-slate-855/10">
              <td class="py-3 px-4 font-mono text-slate-400">${w.date}</td>
              <td class="py-3 px-4 font-mono font-extrabold text-slate-900 dark:text-white">${fmtNGN(w.amount)}</td>
              <td class="py-3 px-4 text-slate-500 font-normal">
                <span class="block">${w.bankName}</span>
                <span class="block text-[10px] text-slate-400 font-mono">${w.accountNo}</span>
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase ${statusBadge}">${w.status}</span>
              </td>
              <td class="py-3 px-4 font-normal text-slate-450 italic">${w.refNote || '—'}</td>
            </tr>
          `;
        }).join('') || `<tr><td colspan="5" class="py-8 text-center text-slate-450 italic">No past withdrawal requests logs.</td></tr>`;

        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold">
            <!-- Balances Panel -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1">
                <span class="block text-[8.5px] text-slate-450 uppercase font-bold tracking-wider">Available For Withdrawal</span>
                <span class="block text-base font-black text-emerald-650 font-mono">${fmtNGN(currentBalance)}</span>
                <span class="block text-[8px] text-slate-450 font-normal">Total Earned minus Withdrawn &amp; Pending</span>
              </div>
              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1">
                <span class="block text-[8.5px] text-slate-450 uppercase font-bold tracking-wider">Pending Approvals</span>
                <span class="block text-base font-black text-amber-650 font-mono">${fmtNGN(pendingTotal)}</span>
                <span class="block text-[8px] text-slate-450 font-normal">Awaiting administrative clearance</span>
              </div>
              <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-1">
                <span class="block text-[8.5px] text-slate-455 uppercase font-bold tracking-wider">Historical Paid Payouts</span>
                <span class="block text-base font-black text-slate-900 dark:text-white font-mono">${fmtNGN(withdrawnTotal)}</span>
                <span class="block text-[8px] text-slate-450 font-normal">Transferred successfully</span>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- Request Form (5 cols) -->
              <div class="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4 h-fit">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-wallet-alt"></i> Request Payout Transfer</h4>
                
                <form id="form-withdrawal-request" class="space-y-3.5">
                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-450 block uppercase">Withdrawal Amount (NGN) *</label>
                    <input type="number" id="withdraw-amount" required placeholder="e.g. 500000" min="5000" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full font-mono" />
                    <span id="withdraw-error" class="text-[9.5px] text-red-500 hidden mt-1 block">⚠️ Requested amount exceeds available balance.</span>
                  </div>

                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-450 block uppercase">Target Bank Name *</label>
                    <input type="text" id="withdraw-bank" value="${aff.profile.bankDetails.bankName}" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full" />
                  </div>

                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-450 block uppercase">Account Number *</label>
                    <input type="text" id="withdraw-acc-no" value="${aff.profile.bankDetails.accountNumber}" required class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full font-mono" />
                  </div>

                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-450 block uppercase">Account Name *</label>
                    <input type="text" id="withdraw-acc-name" value="${aff.profile.bankDetails.accountName}" required class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full" />
                  </div>

                  <button type="submit" class="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg active:scale-98 transition-all flex items-center justify-center gap-1 shadow-md">
                    <i class="bx bx-send"></i> Submit Request
                  </button>
                </form>
              </div>

              <!-- History Table (7 cols) -->
              <div class="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-history"></i> Withdrawal History</h4>
                
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[9px] font-bold uppercase tracking-wider text-slate-450">
                        <th class="py-3 px-4">Date Requested</th>
                        <th class="py-3 px-4">Amount</th>
                        <th class="py-3 px-4">Bank Target</th>
                        <th class="py-3 px-4">Status</th>
                        <th class="py-3 px-4">Admin Ref note</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${withdrawalHistoryRows}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        `;

        // Handle Request Submission
        document.querySelector('#form-withdrawal-request')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const amount = parseFloat(document.querySelector('#withdraw-amount').value);
          const bank = document.querySelector('#withdraw-bank').value.trim();
          const accountNo = document.querySelector('#withdraw-acc-no').value.trim();
          const accountName = document.querySelector('#withdraw-acc-name').value.trim();
          const errorMsg = document.querySelector('#withdraw-error');

          if (amount > currentBalance) {
            errorMsg?.classList.remove('hidden');
            return;
          }
          errorMsg?.classList.add('hidden');

          // Log request
          aff.withdrawals.unshift({
            id: aff.withdrawals.length + 501,
            date: new Date().toISOString().substring(0, 10),
            amount,
            status: 'Pending',
            bankName: bank,
            accountNo,
            refNote: ''
          });

          // Log activity
          aff.activities.unshift({
            id: aff.activities.length + 1,
            type: 'withdrawal',
            title: 'Withdrawal Submitted',
            desc: `Request of ${fmtNGN(amount)} submitted successfully. Status: Pending.`,
            date: new Date().toISOString().substring(0, 16).replace('T', ' '),
            tab: 'withdrawals'
          });

          alert(`Withdrawal request of ${fmtNGN(amount)} submitted successfully. Source: Affiliate Portal.`);
          renderViewport();
        });
        break;

      case 'downlines':
        if (title) title.innerHTML = `<i class="bx bx-group text-lg text-emerald-600"></i> <span>My Downlines (Gen 1)</span>`;
        
        // Downlines list rows
        const downlineListRows = aff.downlines.map(d => `
          <tr class="border-b border-slate-100 dark:border-slate-800 text-[11px] hover:bg-slate-50/40 dark:hover:bg-slate-855/10">
            <td class="py-3 px-4 text-slate-900 dark:text-white font-extrabold flex items-center gap-1.5">
              <i class="bx bx-user text-slate-400 text-sm"></i> ${d.name}
            </td>
            <td class="py-3 px-4 font-mono text-slate-400">${d.dateJoined}</td>
            <td class="py-3 px-4 text-slate-900 dark:text-white font-bold">${d.totalSalesCount} Sales</td>
            <td class="py-3 px-4 font-mono text-emerald-600 font-extrabold">${fmtNGN(d.commissionGenerated)}</td>
            <td class="py-3 px-4 text-right">
              <button data-drill-down-id="${d.id}" class="bg-[#1e3a8a] text-white hover:bg-blue-800 font-bold py-1 px-3.5 rounded text-[10px]"><i class="bx bx-list-ul align-middle"></i> View Sales</button>
            </td>
          </tr>
        `).join('');

        // Drill-down View
        let drillDownPanelHtml = '';
        if (aff._selectedDownlineId) {
          const d = aff.downlines.find(x => x.id === aff._selectedDownlineId);
          if (d) {
            if (aff.allowDownlineSalesVisibility) {
              const dSalesRows = d.sales.map(s => `
                <tr class="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/30 text-[10px]">
                  <td class="py-2.5 px-3 font-extrabold text-slate-900 dark:text-white">
                    ${aff.privacyMaskingEnabled ? s.customer.split(' ').map(p => p.charAt(0) + '***').join(' ') : s.customer}
                  </td>
                  <td class="py-2.5 px-3 text-slate-500 font-normal">${s.property}</td>
                  <td class="py-2.5 px-3 font-mono text-slate-400">${s.date}</td>
                  <td class="py-2.5 px-3 font-mono text-slate-500">${fmtNGN(s.val)}</td>
                  <td class="py-2.5 px-3 font-mono text-emerald-600 font-extrabold text-right">${fmtNGN(s.commission)}</td>
                </tr>
              `).join('') || `<tr><td colspan="5" class="py-6 text-center text-slate-400 italic">No sales logs for this recruit.</td></tr>`;

              drillDownPanelHtml = `
                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4 animate-scale-up">
                  <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div class="space-y-0.5 text-left">
                      <span class="text-[8.5px] uppercase tracking-wider text-slate-400 font-bold">Downline Performance Details</span>
                      <h4 class="font-extrabold text-xs text-slate-900 dark:text-white">${d.name} — Direct Sales Log</h4>
                    </div>
                    <button id="btn-close-drill-down" class="text-slate-400 hover:text-slate-600 flex items-center gap-0.5 text-[10px] font-bold"><i class="bx bx-chevron-left text-lg"></i> Back to list</button>
                  </div>
                  
                  <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                      <thead>
                        <tr class="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[8.5px] font-bold uppercase tracking-wider text-slate-450">
                          <th class="py-2.5 px-3">Customer</th>
                          <th class="py-2.5 px-3">Property</th>
                          <th class="py-2.5 px-3">Sale Date</th>
                          <th class="py-2.5 px-3">Sale Value</th>
                          <th class="py-2.5 px-3 text-right">My 5% override</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${dSalesRows}
                      </tbody>
                    </table>
                  </div>
                </div>
              `;
            } else {
              drillDownPanelHtml = `
                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-xl shadow-xs space-y-4 text-center animate-scale-up py-8 max-w-md mx-auto">
                  <div class="h-12 w-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto text-xl"><i class="bx bx-lock-alt"></i></div>
                  <h4 class="font-extrabold text-xs text-slate-900 dark:text-white">Downline details visibility locked</h4>
                  <p class="text-[10px] text-slate-455 font-normal leading-relaxed">Detailed downline sales are currently not visible — contact your affiliate manager. Running commissions overrides calculations remain audit-ready below.</p>
                  
                  <div class="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-850 flex justify-between items-center text-left">
                    <span class="text-[9.5px] text-slate-400">Accrued Downline Override:</span>
                    <span class="font-mono text-emerald-650 font-extrabold text-sm">${fmtNGN(d.commissionGenerated)}</span>
                  </div>
                  <button id="btn-close-drill-down" class="text-slate-400 hover:text-slate-600 text-[10px] font-bold mt-2"><i class="bx bx-chevron-left align-middle"></i> Back to List</button>
                </div>
              `;
            }
          }
        }

        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold">
            <!-- Visibility Simulation Banner -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs flex justify-between items-center">
              <div class="space-y-0.5">
                <span class="text-[8.5px] uppercase tracking-wider text-slate-400 font-bold block">Developer QA panel</span>
                <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Downline Details Visibility Simulator</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="simulator-visibility-toggle" ${aff.allowDownlineSalesVisibility ? 'checked' : ''} class="sr-only peer" />
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-[#1e3a8a]"></div>
                <span class="ml-2 text-[9.5px] font-bold text-slate-500 uppercase">Allow Visibility</span>
              </label>
            </div>

            <!-- Downlines list table -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[9px] font-bold uppercase tracking-wider text-slate-450">
                      <th class="py-3 px-4">Gen-1 Partner Name</th>
                      <th class="py-3 px-4">Date Joined</th>
                      <th class="py-3 px-4">Sales closed</th>
                      <th class="py-3 px-4">Gen 2 override generated</th>
                      <th class="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${downlineListRows}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Drill-down Section panel -->
            <div id="drill-down-anchor">
              ${drillDownPanelHtml}
            </div>
          </div>
        `;

        // Bind visibility toggle simulator
        document.querySelector('#simulator-visibility-toggle')?.addEventListener('change', (e) => {
          aff.allowDownlineSalesVisibility = e.target.checked;
          renderViewport();
        });

        // Downline drill-down action
        viewport.querySelectorAll('[data-drill-down-id]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            aff._selectedDownlineId = parseInt(btn.getAttribute('data-drill-down-id'));
            renderViewport();
            // Scroll to drill-down panel
            document.querySelector('#drill-down-anchor')?.scrollIntoView({ behavior: 'smooth' });
          });
        });

        // Close drill-down
        document.querySelector('#btn-close-drill-down')?.addEventListener('click', (e) => {
          e.preventDefault();
          aff._selectedDownlineId = null;
          renderViewport();
        });
        break;

      case 'tools':
        if (title) title.innerHTML = `<i class="bx bx-link-external text-lg text-emerald-600"></i> <span>Referral Tools</span>`;
        
        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold">
            
            <!-- referral code card -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
              <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5"><i class="bx bx-link"></i> Unique Campaign links</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-850 space-y-2 text-left">
                  <span class="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Unique Referral Code</span>
                  <div class="flex justify-between items-center">
                    <span class="font-mono font-black text-sm text-slate-900 dark:text-white" id="ref-code-span">${aff.referralCode}</span>
                    <button id="btn-copy-code" class="text-[#1e3a8a] dark:text-blue-400 hover:underline font-bold text-[9.5px] uppercase"><i class="bx bx-copy"></i> Copy</button>
                  </div>
                </div>

                <div class="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-855 space-y-2 text-left">
                  <span class="text-[9px] uppercase tracking-wider font-bold text-slate-450 block">Direct Registration Referral Link</span>
                  <div class="flex justify-between items-center gap-2">
                    <span class="font-mono text-slate-500 text-[10px] truncate" id="ref-link-span">${aff.referralLink}</span>
                    <button id="btn-copy-link" class="text-[#1e3a8a] dark:text-blue-400 hover:underline font-bold text-[9.5px] uppercase shrink-0"><i class="bx bx-copy"></i> Copy</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- properties list shareables -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
              <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5"><i class="bx bx-building-house"></i> Shareable Vetted properties links</h4>
              
              <div class="space-y-3.5">
                <div class="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-850">
                  <div class="space-y-0.5 text-left">
                    <span class="font-extrabold text-slate-800 dark:text-slate-200">Grand Horizon Estates, Phase 2</span>
                    <span class="block text-[9.5px] text-slate-400 font-mono">https://blueskye.com/properties/grand-horizon?ref=${aff.referralCode}</span>
                  </div>
                  <button data-copy-val="https://blueskye.com/properties/grand-horizon?ref=${aff.referralCode}" class="btn-copy-prop bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 py-1.5 px-3 rounded text-[9.5px] font-bold"><i class="bx bx-copy"></i> Copy link</button>
                </div>

                <div class="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-850">
                  <div class="space-y-0.5 text-left">
                    <span class="font-extrabold text-slate-800 dark:text-slate-200">Skyline Heights Apartments</span>
                    <span class="block text-[9.5px] text-slate-400 font-mono">https://blueskye.com/properties/skyline-heights?ref=${aff.referralCode}</span>
                  </div>
                  <button data-copy-val="https://blueskye.com/properties/skyline-heights?ref=${aff.referralCode}" class="btn-copy-prop bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 py-1.5 px-3 rounded text-[9.5px] font-bold"><i class="bx bx-copy"></i> Copy link</button>
                </div>

                <div class="flex justify-between items-center py-2">
                  <div class="space-y-0.5 text-left">
                    <span class="font-extrabold text-slate-800 dark:text-slate-200">Eko Beachfront Terraces</span>
                    <span class="block text-[9.5px] text-slate-400 font-mono">https://blueskye.com/properties/eko-beachfront?ref=${aff.referralCode}</span>
                  </div>
                  <button data-copy-val="https://blueskye.com/properties/eko-beachfront?ref=${aff.referralCode}" class="btn-copy-prop bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 py-1.5 px-3 rounded text-[9.5px] font-bold"><i class="bx bx-copy"></i> Copy link</button>
                </div>
              </div>
            </div>

            <!-- Marketing Assets downloadable files list -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
              <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5"><i class="bx bx-download"></i> Marketing Campaign Assets</h4>
              
              <div class="space-y-3">
                <div class="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-slate-850">
                  <div class="flex items-center gap-2">
                    <i class="bx bxs-file-archive text-lg text-amber-500"></i>
                    <div class="text-left space-y-0.5">
                      <span class="font-extrabold text-slate-800 dark:text-slate-200">BlueSky Brand Logo pack</span>
                      <span class="block text-[9px] text-slate-400 font-normal">PNG, SVG, and EPS vectors zipped (4.5 MB)</span>
                    </div>
                  </div>
                  <button class="btn-mock-download bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 px-3 rounded text-[10px] font-bold"><i class="bx bx-download"></i> Download</button>
                </div>

                <div class="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-slate-850">
                  <div class="flex items-center gap-2">
                    <i class="bx bxs-file-pdf text-lg text-rose-500"></i>
                    <div class="text-left space-y-0.5">
                      <span class="font-extrabold text-slate-800 dark:text-slate-200">Digital Brochure &amp; Price Catalog</span>
                      <span class="block text-[9px] text-slate-400 font-normal">Latest properties listings brochure catalog PDF (12.8 MB)</span>
                    </div>
                  </div>
                  <button class="btn-mock-download bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 px-3 rounded text-[10px] font-bold"><i class="bx bx-download"></i> Download</button>
                </div>

                <div class="flex justify-between items-center py-2.5">
                  <div class="flex items-center gap-2">
                    <i class="bx bxs-file-image text-lg text-blue-500"></i>
                    <div class="text-left space-y-0.5">
                      <span class="font-extrabold text-slate-800 dark:text-slate-200">Social Media Flyers templates Pack</span>
                      <span class="block text-[9px] text-slate-400 font-normal">Instagram and Facebook flyers assets kit (18 MB)</span>
                    </div>
                  </div>
                  <button class="btn-mock-download bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 px-3 rounded text-[10px] font-bold"><i class="bx bx-download"></i> Download</button>
                </div>
              </div>
            </div>

          </div>
        `;

        // Clipboard handlers
        const copyToClipboard = (text, message) => {
          navigator.clipboard.writeText(text).then(() => {
            alert(message);
          });
        };
        document.querySelector('#btn-copy-code')?.addEventListener('click', () => {
          copyToClipboard(aff.referralCode, 'Referral code copied successfully.');
        });
        document.querySelector('#btn-copy-link')?.addEventListener('click', () => {
          copyToClipboard(aff.referralLink, 'Registration referral link copied successfully.');
        });
        viewport.querySelectorAll('.btn-copy-prop').forEach(btn => {
          btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-copy-val');
            copyToClipboard(val, 'Properties campaign trackable link copied successfully.');
          });
        });

        // Mock downloads
        viewport.querySelectorAll('.btn-mock-download').forEach(btn => {
          btn.addEventListener('click', () => {
            alert('Marketing assets pack packaging successfully. Your download has started.');
          });
        });
        break;

      case 'kyc':
        if (title) title.innerHTML = `<i class="bx bx-id-card text-lg text-emerald-600"></i> <span>KYC Verification</span>`;
        
        let bankAuditNotice = '';
        if (aff.bankVerificationPending) {
          bankAuditNotice = `
            <div class="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-3 rounded-lg text-[10px] leading-relaxed text-left flex items-start gap-1.5">
              <i class="bx bx-error-circle text-base text-amber-600 shrink-0"></i>
              <span><strong>Requires admin re-verification:</strong> You modified bank details recently. Withdrawal transfers will freeze temporarily until the administrative accounts desk perfects validation audits check.</span>
            </div>
          `;
        }

        const renderKycCard = (key, data) => {
          let cardStatusColor = 'text-slate-400';
          let statusLabel = 'Not Submitted';
          if (data.status === 'Verified') {
            cardStatusColor = 'text-emerald-650';
            statusLabel = 'Verified Compliance';
          } else if (data.status === 'Pending') {
            cardStatusColor = 'text-amber-655';
            statusLabel = 'Under Review';
          }

          let specificInputHtml = `
            <div class="flex items-center gap-3">
              <input type="file" class="file-kyc-input text-[10px] bg-slate-50 py-1.5 px-3 rounded border border-slate-200" />
              <button class="bg-[#1e3a8a] text-white py-1.5 px-4 rounded font-bold text-[10px] btn-upload-kyc-mock hover:bg-blue-800 transition-colors">Upload</button>
            </div>
          `;
          
          if (data.status === 'Verified' || data.status === 'Pending') {
            specificInputHtml = `
              <div class="text-[10px] text-slate-455 font-normal flex items-center gap-1">
                <i class="bx bx-lock-alt"></i> File: <code>${data.file}</code> (${data.date})
              </div>
            `;
          }

          let bankInputHtml = '';
          if (key === 'bankDetails') {
            bankInputHtml = `
              <div class="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-lg border border-slate-100 dark:border-slate-850 space-y-2 mt-2 font-normal text-[11px] text-slate-655">
                <div class="grid grid-cols-3 gap-2">
                  <div class="space-y-0.5">
                    <label class="text-[8.5px] uppercase font-bold text-slate-400">Bank Target</label>
                    <input type="text" id="kyc-bank-name" value="${aff.profile.bankDetails.bankName}" class="w-full bg-white dark:bg-slate-900 border border-slate-200 p-1 rounded font-extrabold" />
                  </div>
                  <div class="space-y-0.5">
                    <label class="text-[8.5px] uppercase font-bold text-slate-400">Account No</label>
                    <input type="text" id="kyc-acc-no" value="${aff.profile.bankDetails.accountNumber}" class="w-full bg-white dark:bg-slate-900 border border-slate-200 p-1 rounded font-extrabold font-mono" />
                  </div>
                  <div class="space-y-0.5">
                    <label class="text-[8.5px] uppercase font-bold text-slate-400">Account Name</label>
                    <input type="text" id="kyc-acc-name" value="${aff.profile.bankDetails.accountName}" class="w-full bg-white dark:bg-slate-900 border border-slate-200 p-1 rounded font-extrabold" />
                  </div>
                </div>
                <div class="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span class="text-[9.5px] text-amber-600 font-bold"><i class="bx bx-info-circle"></i> Editing bank details freezes withdrawals.</span>
                  <button id="btn-save-kyc-bank" class="bg-emerald-650 text-white font-bold py-1 px-3 rounded text-[9.5px]">Save Updates</button>
                </div>
              </div>
            `;
          }

          return `
            <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-3">
              <div class="flex justify-between items-start">
                <div class="space-y-0.5">
                  <h4 class="font-extrabold text-xs text-slate-900 dark:text-white">${data.name}</h4>
                  <span class="block text-[8px] text-slate-400 uppercase font-black font-mono ${cardStatusColor}"><i class="bx bx-circle"></i> ${statusLabel}</span>
                </div>
              </div>
              
              ${specificInputHtml}
              ${bankInputHtml}
            </div>
          `;
        };

        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold max-w-2xl mx-auto">
            ${bankAuditNotice}

            <div class="space-y-4">
              ${renderKycCard('govId', aff.kycDocs.govId)}
              ${renderKycCard('passport', aff.kycDocs.passport)}
              ${renderKycCard('bankDetails', aff.kycDocs.bankDetails)}
              ${renderKycCard('address', aff.kycDocs.address)}
            </div>
          </div>
        `;

        // Handle bank details updates
        document.querySelector('#btn-save-kyc-bank')?.addEventListener('click', (e) => {
          e.preventDefault();
          const name = document.querySelector('#kyc-bank-name').value.trim();
          const accNo = document.querySelector('#kyc-acc-no').value.trim();
          const accName = document.querySelector('#kyc-acc-name').value.trim();

          aff.profile.bankDetails.bankName = name;
          aff.profile.bankDetails.accountNumber = accNo;
          aff.profile.bankDetails.accountName = accName;
          
          aff.bankVerificationPending = true;
          aff.kycDocs.bankDetails.status = 'Pending';
          aff.kycDocs.bankDetails.date = new Date().toISOString().substring(0, 10);

          alert('Bank details updated. Status updated to Pending Review. Withdrawal capabilities frozen pending admin re-verification audits check.');
          renderViewport();
        });

        // Mock uploads
        viewport.querySelectorAll('.btn-upload-kyc-mock').forEach(btn => {
          btn.addEventListener('click', () => {
            alert('File selected and uploaded successfully. Document compliance checking scheduled.');
          });
        });
        break;

      case 'support':
        if (title) title.innerHTML = `<i class="bx bx-help-circle text-lg text-emerald-600"></i> <span>Support Desk</span>`;
        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- Collapsible FAQ list (7 cols) -->
              <div class="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5"><i class="bx bx-help-circle"></i> Frequently Asked Questions</h4>
                
                <div class="space-y-3 text-[11px]">
                  <div class="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                    <button class="faq-toggle-btn w-full text-left p-3 bg-slate-50/50 dark:bg-slate-900 flex justify-between items-center text-slate-800 dark:text-white font-extrabold focus:outline-none">
                      <span>May I request custom payout transfer intervals?</span>
                      <i class="bx bx-chevron-down text-slate-450 transition-transform"></i>
                    </button>
                    <div class="faq-content p-3 text-slate-450 font-normal leading-relaxed border-t border-slate-100 dark:border-slate-800 hidden">
                      Standard payout withdrawal validations are audited on the 15th and 30th of each calendar month. Elite Strategic partners may query support for weekly payout schedules under specialized escrows.
                    </div>
                  </div>

                  <div class="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                    <button class="faq-toggle-btn w-full text-left p-3 bg-slate-50/50 dark:bg-slate-900 flex justify-between items-center text-slate-800 dark:text-white font-extrabold focus:outline-none">
                      <span>How are override Gen 2 commissions calculated?</span>
                      <i class="bx bx-chevron-down text-slate-450 transition-transform"></i>
                    </button>
                    <div class="faq-content p-3 text-slate-450 font-normal leading-relaxed border-t border-slate-100 dark:border-slate-800 hidden">
                      Every affiliate record you personally recruit represents Gen 1 downline. When those downline partners perfect closures, they earn their direct rate (5% to 20%), while you automatically accrue a flat 5% passive override payout.
                    </div>
                  </div>

                  <div class="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                    <button class="faq-toggle-btn w-full text-left p-3 bg-slate-50/50 dark:bg-slate-900 flex justify-between items-center text-slate-800 dark:text-white font-extrabold focus:outline-none">
                      <span>What happens if my downlines recruit another partner?</span>
                      <i class="bx bx-chevron-down text-slate-450 transition-transform"></i>
                    </button>
                    <div class="faq-content p-3 text-slate-450 font-normal leading-relaxed border-t border-slate-100 dark:border-slate-800 hidden">
                      Our lifetime commission program caps overrides strictly at 2 generations deep (Gen 1 direct recruits, Gen 2 sub-recruits). Generational lines past Gen-2 do not generate commission overrides.
                    </div>
                  </div>
                </div>
              </div>

              <!-- Inquiry Form (5 cols) -->
              <div class="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4 h-fit">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-455 border-b border-slate-100 dark:border-slate-800 pb-1.5"><i class="bx bx-message-rounded-add"></i> Submit Ticket (Source: Affiliate)</h4>
                
                <form id="form-affiliate-ticket" class="space-y-3.5">
                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-450 block uppercase">Inquiry Subject *</label>
                    <input type="text" id="ticket-subject-aff" required placeholder="e.g. Override commission discrepancy query" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full" />
                  </div>

                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-450 block uppercase">Detailed Message *</label>
                    <textarea id="ticket-message-aff" required placeholder="Explain your inquiry details..." class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full h-24 resize-none"></textarea>
                  </div>

                  <button type="submit" class="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg active:scale-98 transition-all flex items-center justify-center gap-1 shadow-md">
                    <i class="bx bx-send"></i> Submit Affiliate Ticket
                  </button>
                </form>
              </div>
            </div>
          </div>
        `;

        // FAQ accordion
        viewport.querySelectorAll('.faq-toggle-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const panel = btn.nextElementSibling;
            panel.classList.toggle('hidden');
            const icon = btn.querySelector('.bx-chevron-down') || btn.querySelector('.bx-chevron-up');
            if (icon) {
              icon.className = panel.classList.contains('hidden') ? 'bx bx-chevron-down text-slate-450' : 'bx bx-chevron-up text-slate-450';
            }
          });
        });

        // Submit Ticket
        document.querySelector('#form-affiliate-ticket')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const subject = document.querySelector('#ticket-subject-aff').value.trim();
          const message = document.querySelector('#ticket-message-aff').value.trim();

          // Push ticket with Source: "Affiliate Portal"
          if (state.admin && state.admin.tickets) {
            state.admin.tickets.unshift({
              id: state.admin.tickets.length + 101,
              requesterName: aff.profile.name,
              subject,
              message,
              source: 'Affiliate Portal',
              priority: 'Medium',
              status: 'Open',
              date: 'Just now'
            });
          }

          // Activity log
          aff.activities.unshift({
            id: aff.activities.length + 1,
            type: 'support',
            title: 'Help Desk Ticket Logged',
            desc: `Affiliate Support ticket regarding "${subject}" created. Status: Open.`,
            date: new Date().toISOString().substring(0, 16).replace('T', ' '),
            tab: 'support'
          });

          alert(`Support Ticket created successfully. Source: Affiliate Portal. Ticket reference generated for "${subject}".`);
          document.querySelector('#form-affiliate-ticket').reset();
          renderViewport();
        });
        break;

      case 'profile-settings':
        if (title) title.innerHTML = `<i class="bx bx-cog text-lg text-emerald-600"></i> <span>Profile &amp; Settings</span>`;
        
        let bankWarnMsg = '';
        if (aff.bankVerificationPending) {
          bankWarnMsg = `
            <div class="bg-amber-500/10 border border-amber-500/20 text-amber-700 p-2.5 rounded text-[10px] font-normal leading-relaxed text-left">
              <i class="bx bx-info-circle align-middle mr-0.5"></i>
              <strong>Bank settings audit pending:</strong> Validation verification is currently active.
            </div>
          `;
        }

        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <!-- Left Pane: Edit Profile & Password (7 cols) -->
              <div class="lg:col-span-7 space-y-6">
                <!-- Personal details form -->
                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
                  <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5"><i class="bx bx-user-circle"></i> Edit Partner Coordinates</h4>
                  <form id="form-aff-edit-personal" class="space-y-3.5">
                    <div class="space-y-1">
                      <label class="text-[9px] font-bold text-slate-450 uppercase">Legal Full Name *</label>
                      <input type="text" id="aff-edit-name" value="${aff.profile.name}" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full" />
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div class="space-y-1">
                        <label class="text-[9px] font-bold text-slate-450 uppercase">Email Address *</label>
                        <input type="email" id="aff-edit-email" value="${aff.profile.email}" required class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full font-mono" />
                      </div>
                      <div class="space-y-1">
                        <label class="text-[9px] font-bold text-slate-450 uppercase">Phone Number *</label>
                        <input type="tel" id="aff-edit-phone" value="${aff.profile.phone}" required class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full font-mono" />
                      </div>
                    </div>
                    <button type="submit" class="bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-2 px-5 rounded-lg active:scale-98 transition-all shadow-xs">Save Updates</button>
                  </form>
                </div>

                <!-- Password Form -->
                <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
                  <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5"><i class="bx bx-lock-alt"></i> Change Password</h4>
                  <form id="form-aff-edit-password" class="space-y-3.5">
                    <div class="space-y-1">
                      <label class="text-[9px] font-bold text-slate-455 uppercase">Current Password</label>
                      <input type="password" id="aff-pass-current" required placeholder="••••••••" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full font-mono" />
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div class="space-y-1">
                        <label class="text-[9px] font-bold text-slate-455 uppercase">New Password</label>
                        <input type="password" id="aff-pass-new" required placeholder="••••••••" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full font-mono" />
                      </div>
                      <div class="space-y-1">
                        <label class="text-[9px] font-bold text-slate-455 uppercase">Confirm Password</label>
                        <input type="password" id="aff-pass-confirm" required placeholder="••••••••" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full font-mono" />
                      </div>
                    </div>
                    <button type="submit" class="bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-2 px-5 rounded-lg active:scale-98 transition-all shadow-xs">Change Password</button>
                  </form>
                </div>
              </div>

              <!-- Right Pane: Bank Details (5 cols) -->
              <div class="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4 h-fit">
                <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-1.5"><i class="bx bx-credit-card-front"></i> Edit Payout bank details</h4>
                ${bankWarnMsg}
                <form id="form-aff-edit-bank" class="space-y-3.5">
                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-450 block uppercase">Bank Name *</label>
                    <input type="text" id="aff-edit-bank-name" value="${aff.profile.bankDetails.bankName}" required class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-450 block uppercase">Account Number *</label>
                    <input type="text" id="aff-edit-bank-no" value="${aff.profile.bankDetails.accountNumber}" required class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full font-mono" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[9px] font-bold text-slate-455 block uppercase">Account Name *</label>
                    <input type="text" id="aff-edit-bank-name-label" value="${aff.profile.bankDetails.accountName}" required class="form-input text-xs bg-slate-50 dark:bg-slate-955 py-2 w-full" />
                  </div>
                  
                  <div class="p-2.5 bg-amber-500/5 border border-amber-500/10 text-amber-700 dark:text-amber-400 font-normal leading-relaxed text-[10px]">
                    ⚠️ Submitting bank changes triggers mandatory admin validation verification. Withdrawals will remain frozen until compliance clearance is completed.
                  </div>

                  <button type="submit" class="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-2 rounded-lg text-center active:scale-98 transition-all shadow-xs">Save Bank Details</button>
                </form>
              </div>

            </div>
          </div>
        `;

        // Personal update
        document.querySelector('#form-aff-edit-personal')?.addEventListener('submit', (e) => {
          e.preventDefault();
          aff.profile.name = document.querySelector('#aff-edit-name').value.trim();
          aff.profile.email = document.querySelector('#aff-edit-email').value.trim();
          aff.profile.phone = document.querySelector('#aff-edit-phone').value.trim();

          alert('Partner profile details updated successfully.');
          renderApp();
        });

        // Password update
        document.querySelector('#form-aff-edit-password')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const pNew = document.querySelector('#aff-pass-new').value;
          const confirm = document.querySelector('#aff-pass-confirm').value;

          if (pNew !== confirm) {
            alert('Validation Error: Passwords do not match!');
            return;
          }
          alert('Security settings saved. Password modified successfully.');
          document.querySelector('#form-aff-edit-password').reset();
          renderViewport();
        });

        // Bank update
        document.querySelector('#form-aff-edit-bank')?.addEventListener('submit', (e) => {
          e.preventDefault();
          aff.profile.bankDetails.bankName = document.querySelector('#aff-edit-bank-name').value.trim();
          aff.profile.bankDetails.accountNumber = document.querySelector('#aff-edit-bank-no').value.trim();
          aff.profile.bankDetails.accountName = document.querySelector('#aff-edit-bank-name-label').value.trim();

          aff.bankVerificationPending = true;
          aff.kycDocs.bankDetails.status = 'Pending';
          aff.kycDocs.bankDetails.date = new Date().toISOString().substring(0, 10);

          alert('Bank payout coordinates updated. Pending re-verification status activated. Withdrawals frozen.');
          renderViewport();
        });
        break;

      case 'notifications':
        if (title) title.innerHTML = `<i class="bx bx-bell text-lg text-emerald-600"></i> <span>Notifications Center</span>`;
        
        const noticeRowsHtml = aff.notificationsList.map(n => {
          let iconClass = 'bx bx-info-circle text-slate-400 bg-slate-100 dark:bg-slate-800';
          if (n.tab === 'commissions') iconClass = 'bx bx-coin-stack text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20';
          else if (n.tab === 'withdrawals') iconClass = 'bx bx-export text-amber-600 bg-amber-50 dark:bg-amber-950/20';
          else if (n.tab === 'downlines') iconClass = 'bx bx-group text-purple-650 bg-purple-50 dark:bg-purple-950/20';
          else if (n.tab === 'kyc') iconClass = 'bx bx-shield-check text-blue-650 bg-blue-50 dark:bg-blue-950/20';

          return `
            <div data-link-to-tab="${n.tab}" data-notif-id="${n.id}" class="flex justify-between items-center py-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-855/20 px-3 cursor-pointer rounded-lg transition-colors ${n.isRead ? 'opacity-70 font-normal' : 'font-extrabold bg-emerald-600/5'}" title="Click to view">
              <div class="flex gap-3 items-center min-w-0">
                <div class="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-base ${iconClass}"></div>
                <div class="min-w-0 text-left">
                  <span class="block text-slate-900 dark:text-white text-xs">${n.title}</span>
                  <p class="text-[9.5px] text-slate-450 dark:text-slate-400 font-normal leading-relaxed truncate">${n.desc}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="text-[8px] text-slate-400 font-mono">${n.date}</span>
                ${!n.isRead ? `<span class="h-2 w-2 rounded-full bg-emerald-500"></span>` : ''}
              </div>
            </div>
          `;
        }).join('') || `<div class="text-[10px] text-slate-450 italic py-4">No notification alerts logs.</div>`;

        viewport.innerHTML = `
          <div class="space-y-6 text-left animate-fade-in text-xs font-semibold max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-xl shadow-sm">
            <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 flex items-center gap-1.5"><i class="bx bx-bell-off"></i> Partner Notification Log</h4>
              <button id="btn-aff-notif-mark-all" class="text-[10px] text-emerald-650 hover:underline">Mark all as read</button>
            </div>
            
            <div class="divide-y divide-slate-100 dark:divide-slate-850">
              ${noticeRowsHtml}
            </div>
          </div>
        `;

        // Bind clicks on notifications
        viewport.querySelectorAll('[data-notif-id]').forEach(el => {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(el.getAttribute('data-notif-id'));
            const tab = el.getAttribute('data-link-to-tab');
            const notice = aff.notificationsList.find(x => x.id === id);
            if (notice) notice.isRead = true;

            aff.activeTab = tab;
            renderViewport();

            // Sync unread badge count
            const unreadCount = aff.notificationsList.filter(n => !n.isRead).length;
            const badge = document.querySelector('#aff-notif-btn span');
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
        document.querySelector('#btn-aff-notif-mark-all')?.addEventListener('click', (e) => {
          e.preventDefault();
          aff.notificationsList.forEach(n => n.isRead = true);
          const badge = document.querySelector('#aff-notif-btn span');
          if (badge) badge.classList.add('hidden');

          alert('All notifications marked as read.');
          renderViewport();
        });
        break;
    }
  }

  renderViewport();
}

