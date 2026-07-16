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
        kycStatus: 'Pending' // 'Pending' or 'Verified'
      },
      salesCount: 14,
      gen1Earned: 24000000,
      gen2Earned: 5500000,
      pendingWithdrawals: 450000,
      privacyMaskingEnabled: false,
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
    const forgotInterface = document.querySelector('#aff-forgot-interface');

    // Forgot Password triggers
    document.querySelector('#aff-forgot-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      loginInterface?.classList.add('hidden');
      forgotInterface?.classList.remove('hidden');
    });

    document.querySelector('#aff-forgot-cancel')?.addEventListener('click', (e) => {
      e.preventDefault();
      loginInterface?.classList.remove('hidden');
      forgotInterface?.classList.add('hidden');
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
  const avatarL = document.querySelector('#aff-profile-avatar-left');
  const avatarR = document.querySelector('#aff-profile-avatar-right');
  const nameL = document.querySelector('#aff-profile-name-left');
  const emailL = document.querySelector('#aff-profile-email-left');
  const typeL = document.querySelector('#aff-type-sidebar-label');

  if (avatarL) avatarL.src = aff.profile.avatar;
  if (avatarR) avatarR.src = aff.profile.avatar;
  if (nameL) nameL.textContent = aff.profile.name;
  if (emailL) emailL.textContent = aff.profile.email;
  if (typeL) typeL.textContent = aff.profile.affiliate_type;

  // Sync KYC Banner Notice
  const bannerNotice = document.querySelector('#affiliate-kyc-pending-banner');
  if (bannerNotice) {
    if (aff.profile.kycStatus === 'Pending') {
      bannerNotice.classList.remove('hidden');
    } else {
      bannerNotice.classList.add('hidden');
    }
  }

  // Toggle mobile drawer
  const mobileToggle = document.querySelector('#aff-mobile-toggle');
  const sidebar = document.querySelector('#affiliate-sidebar');
  mobileToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    sidebar?.classList.toggle('-translate-x-full');
  });

  // Toggle notification popover dropdown list
  const notifBtn = document.querySelector('#aff-notif-btn');
  const notifDropdown = document.querySelector('#aff-notif-dropdown');
  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown?.classList.toggle('hidden');
    avatarDropdown?.classList.add('hidden');
  });

  document.body.addEventListener('click', () => {
    notifDropdown?.classList.add('hidden');
    avatarDropdown?.classList.add('hidden');
  });

  // Toggle avatar account dropdown menu
  const avatarBtn = document.querySelector('#aff-avatar-btn');
  const avatarDropdown = document.querySelector('#aff-avatar-dropdown');
  const avatarChevron = document.querySelector('#aff-avatar-chevron');

  avatarBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    avatarDropdown?.classList.toggle('hidden');
    notifDropdown?.classList.add('hidden');
    avatarChevron?.classList.toggle('rotate-180');
  });

  document.querySelector('#aff-dropdown-settings')?.addEventListener('click', (e) => {
    e.preventDefault();
    aff.activeTab = 'profile-settings';
    renderViewport();
  });

  document.querySelector('#aff-sidebar-settings-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    aff.activeTab = 'profile-settings';
    renderViewport();
  });

  document.querySelector('#aff-dropdown-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    aff.isAuthenticated = false;
    aff.activeTab = 'dashboard';
    alert('Partner workspace logged out.');
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
        btn.className = "affiliate-rail-btn active w-full flex items-center gap-3 py-2.5 px-3 bg-white/10 rounded-lg text-left transition-all text-white font-bold";
      } else {
        btn.className = "affiliate-rail-btn w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-all hover:bg-white/10 text-white/80";
      }
    });

    // Content viewports routing
    switch (aff.activeTab) {
      case 'dashboard':
        if (title) title.innerHTML = `<i class="bx bx-grid-alt text-lg text-emerald-600"></i> <span>Partner Dashboard</span>`;
        
        // KYC Badge
        let kycBadge = 'bg-slate-100 text-slate-450';
        if (aff.profile.kycStatus === 'Verified') kycBadge = 'bg-emerald-500/10 text-emerald-650';
        else if (aff.profile.kycStatus === 'Pending') kycBadge = 'bg-amber-500/10 text-amber-650 animate-pulse';

        // Activities list
        const activityRows = aff.activities.map(act => {
          let iconClass = 'bx bx-info-circle text-slate-450 bg-slate-100 dark:bg-slate-800';
          if (act.type === 'sale') iconClass = 'bx bx-shopping-bag text-blue-650 bg-blue-50 dark:bg-blue-950/20';
          else if (act.type === 'commission') iconClass = 'bx bx-coin-stack text-emerald-650 bg-emerald-50 dark:bg-emerald-950/20';
          else if (act.type === 'withdrawal') iconClass = 'bx bx-export text-amber-650 bg-amber-50 dark:bg-amber-950/20';
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
        viewport.innerHTML = `
          <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 p-6 rounded-2xl text-center space-y-4 max-w-lg mx-auto py-12 animate-fade-in">
            <div class="h-16 w-16 bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-xs"><i class="bx bx-export"></i></div>
            <h3 class="font-display font-extrabold text-base text-slate-900 dark:text-white">Payout Withdrawal perfect logs</h3>
            <p class="text-xs text-slate-455 dark:text-slate-400 leading-relaxed font-normal">Submit withdrawal transfer targets, review transaction verification audits, and configure payout accounts details.</p>
          </div>
        `;
        break;

      case 'downlines':
        if (title) title.innerHTML = `<i class="bx bx-group text-lg text-emerald-600"></i> <span>My Downlines (Gen 1)</span>`;
        viewport.innerHTML = `
          <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 p-6 rounded-2xl text-center space-y-4 max-w-lg mx-auto py-12 animate-fade-in">
            <div class="h-16 w-16 bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-xs"><i class="bx bx-network-chart"></i></div>
            <h3 class="font-display font-extrabold text-base text-slate-900 dark:text-white">Recruited Network Downlines (Gen 1)</h3>
            <p class="text-xs text-slate-455 dark:text-slate-400 leading-relaxed font-normal">Trace active sub-recruits coordinates, count their downline performance, and audit 5% passive overrides logs.</p>
          </div>
        `;
        break;

      case 'tools':
        if (title) title.innerHTML = `<i class="bx bx-link-external text-lg text-emerald-600"></i> <span>Referral Tools</span>`;
        viewport.innerHTML = `
          <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 p-6 rounded-2xl text-center space-y-4 max-w-lg mx-auto py-12 animate-fade-in">
            <div class="h-16 w-16 bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-xs"><i class="bx bx-link"></i></div>
            <h3 class="font-display font-extrabold text-base text-slate-900 dark:text-white">Affiliate Codes &amp; Banners</h3>
            <p class="text-xs text-slate-455 dark:text-slate-400 leading-relaxed font-normal">Copy your custom referral links, download social banners assets, and track unique visitor log redirects.</p>
          </div>
        `;
        break;

      case 'kyc':
        if (title) title.innerHTML = `<i class="bx bx-id-card text-lg text-emerald-600"></i> <span>KYC Verification</span>`;
        viewport.innerHTML = `
          <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 p-6 rounded-2xl text-center space-y-4 max-w-lg mx-auto py-12 animate-fade-in">
            <div class="h-16 w-16 bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-xs"><i class="bx bx-id-card"></i></div>
            <h3 class="font-display font-extrabold text-base text-slate-900 dark:text-white">KYC Verification Files</h3>
            <p class="text-xs text-slate-455 dark:text-slate-400 leading-relaxed font-normal">Upload required verification items (Valid ID, Utility bills, Bank statements) to unlock full payout transfers capabilities.</p>
          </div>
        `;
        break;

      case 'support':
        if (title) title.innerHTML = `<i class="bx bx-help-circle text-lg text-emerald-600"></i> <span>Support Desk</span>`;
        viewport.innerHTML = `
          <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 p-6 rounded-2xl text-center space-y-4 max-w-lg mx-auto py-12 animate-fade-in">
            <div class="h-16 w-16 bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-xs"><i class="bx bx-support"></i></div>
            <h3 class="font-display font-extrabold text-base text-slate-900 dark:text-white">Partner Helpdesk Hub</h3>
            <p class="text-xs text-slate-455 dark:text-slate-400 leading-relaxed font-normal">Contact admin, request help, and check answers FAQ logs.</p>
          </div>
        `;
        break;

      case 'profile-settings':
        if (title) title.innerHTML = `<i class="bx bx-cog text-lg text-emerald-600"></i> <span>Profile &amp; Settings</span>`;
        viewport.innerHTML = `
          <form id="aff-profile-form" class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 p-5 rounded-xl max-w-md mx-auto text-xs font-semibold text-left space-y-4 animate-fade-in">
            <h4 class="font-bold text-xs uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-1.5"><i class="bx bx-user"></i> Profile Coordinates</h4>
            <div class="space-y-1">
              <label class="text-[9px] font-bold text-slate-450 uppercase">Legal Full Name</label>
              <input type="text" id="aff-profile-name" value="${aff.profile.name}" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full" />
            </div>
            <div class="space-y-1">
              <label class="text-[9px] font-bold text-slate-455 uppercase">Email Address</label>
              <input type="email" id="aff-profile-email" value="${aff.profile.email}" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full font-mono" />
            </div>
            <div class="space-y-1">
              <label class="text-[9px] font-bold text-slate-455 uppercase">Phone Number</label>
              <input type="text" id="aff-profile-phone" value="${aff.profile.phone}" class="form-input text-xs bg-slate-50 dark:bg-slate-950 py-2 w-full font-mono" />
            </div>
            <button type="submit" class="w-full bg-[#1e3a8a] text-white py-2 rounded font-bold">Update Partner Info</button>
          </form>
        `;

        // Handle profile submit
        document.querySelector('#aff-profile-form')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.querySelector('#aff-profile-name').value.trim();
          const email = document.querySelector('#aff-profile-email').value.trim();
          const phone = document.querySelector('#aff-profile-phone').value.trim();

          aff.profile.name = name;
          aff.profile.email = email;
          aff.profile.phone = phone;

          alert('Partner profile settings updated successfully.');
          renderApp();
        });
        break;
    }
  }

  renderViewport();
}
