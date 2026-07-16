import overviewHtml from '../html/overview.html?raw';

function fmtNGN(val) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
}

function getSalesValueForPeriod(state, period) {
  const ledger = state.admin.ordersLedger || [];
  const now = new Date('2026-07-15'); // Reference system date

  const filtered = ledger.filter(item => {
    if (period === 'all') return true;
    const itemDate = new Date(item.date);
    if (isNaN(itemDate.getTime())) return false;

    if (period === 'month') {
      return itemDate.getFullYear() === now.getFullYear() && itemDate.getMonth() === now.getMonth();
    }
    if (period === 'quarter') {
      const itemQuarter = Math.floor(itemDate.getMonth() / 3);
      const nowQuarter = Math.floor(now.getMonth() / 3);
      return itemDate.getFullYear() === now.getFullYear() && itemQuarter === nowQuarter;
    }
    return true;
  });

  return filtered.reduce((sum, item) => sum + item.price, 0);
}

function getSystemActivities(state) {
  const events = [];

  // 1. Add audit logs
  if (state.admin.auditLogs) {
    state.admin.auditLogs.forEach(l => {
      events.push({
        time: l.time,
        actor: l.staff,
        component: l.component,
        action: l.action,
        tab: 'settings-audit'
      });
    });
  }

  // 2. Add sales orders
  if (state.admin.ordersLedger) {
    state.admin.ordersLedger.forEach(o => {
      events.push({
        time: o.date + ' 10:00',
        actor: 'Client Desk',
        component: 'Sales',
        action: `Order initialized for client ${o.clientName} on property "${o.propertyTitle}"`,
        tab: 'sales-list'
      });
    });
  }

  // 3. Add payments confirmation logs
  if (state.admin.paymentsLog) {
    state.admin.paymentsLog.forEach(p => {
      events.push({
        time: p.date + ' 11:30',
        actor: p.clientName,
        component: 'Payments',
        action: `Escrow payment receipt of ${fmtNGN(p.amount)} status set to "${p.status}"`,
        tab: 'payments-list'
      });
    });
  }

  // 4. Add referrals payouts
  if (state.admin.referralsList) {
    state.admin.referralsList.forEach(aff => {
      (aff.payoutsList || []).forEach(w => {
        events.push({
          time: w.date + ' 14:15',
          actor: aff.name,
          component: 'Affiliates',
          action: `Commission payout request of ${fmtNGN(w.amount)} set to "${w.status}"`,
          tab: 'reports-commissions'
        });
      });
    });
  }

  // Sort chronological descending
  events.sort((a, b) => b.time.localeCompare(a.time));

  // return top 8 items
  return events.slice(0, 8);
}

function renderActivitiesHtml(state) {
  const list = getSystemActivities(state);
  if (list.length === 0) {
    return `<tr><td colspan="5" class="p-4 text-center text-sm text-slate-400 italic">No recent system activities found.</td></tr>`;
  }

  return list.map(evt => `
    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors text-sm">
      <td class="p-3 font-mono text-slate-400 whitespace-nowrap">${evt.time}</td>
      <td class="p-3 font-semibold text-slate-800 dark:text-slate-200">${evt.actor}</td>
      <td class="p-3">
        <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold text-xs uppercase tracking-wider">${evt.component}</span>
      </td>
      <td class="p-3 text-slate-600 dark:text-slate-400">${evt.action}</td>
      <td class="p-3 text-right">
        <button data-tab="${evt.tab}" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold uppercase text-xs tracking-wider focus:outline-none flex items-center justify-end gap-0.5 ml-auto">
          <span>Go</span><i class="bx bx-right-arrow-alt text-sm"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function generateNeedsAttentionHtml(state) {
  const items = [];

  // 1. Pending Client KYC
  (state.admin.kycQueue || []).forEach(k => {
    if (k.status === 'Pending Review') {
      items.push({
        icon: 'bx bx-shield-quarter text-amber-500',
        title: `Client KYC Approval: ${k.name}`,
        desc: `${k.docType} awaiting NIN/Verification validation check`,
        tab: 'customers',
        bg: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20'
      });
    }
  });

  // 2. Pending Affiliate KYC
  (state.admin.referralsList || []).forEach(p => {
    if (p.status === 'Pending Review') {
      items.push({
        icon: 'bx bx-shield-quarter text-amber-500',
        title: `Affiliate KYC: ${p.name}`,
        desc: `Affiliate registration verification check required`,
        tab: 'partners-directory',
        bg: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20'
      });
    }
  });

  // 3. Pending Payments
  (state.admin.paymentsLog || []).forEach(pay => {
    if (pay.status === 'Pending Confirmation') {
      items.push({
        icon: 'bx bx-wallet text-green-500',
        title: `Confirm Payment: ${pay.clientName}`,
        desc: `${pay.propertyTitle} escrow slip receipt: ${fmtNGN(pay.amount)}`,
        tab: 'payments-list',
        bg: 'bg-green-500/5 dark:bg-green-500/10 border-green-500/20'
      });
    }
  });

  // 4. Pending Withdrawals
  (state.admin.referralsList || []).forEach(p => {
    (p.payoutsList || []).forEach(w => {
      if (w.status === 'Pending Release') {
        items.push({
          icon: 'bx bx-money-withdraw text-purple-500',
          title: `Payout Release: ${p.name}`,
          desc: `Withdrawal transfer request for ${fmtNGN(w.amount)}`,
          tab: 'reports-commissions',
          bg: 'bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20'
        });
      }
    });
  });

  if (items.length === 0) {
    return `<div class="p-4 text-center text-sm text-slate-400 italic">No operational alerts pending.</div>`;
  }

  return items.map(item => `
    <div data-tab="${item.tab}" class="p-3 ${item.bg} rounded border flex items-start gap-2.5 cursor-pointer hover:border-slate-400 transition-all text-sm">
      <i class="${item.icon} mt-0.5 text-lg"></i>
      <div class="flex-1 min-w-0">
        <span class="font-semibold text-slate-900 dark:text-white block truncate leading-tight">${item.title}</span>
        <p class="text-xs text-slate-500 mt-1 leading-normal truncate">${item.desc}</p>
      </div>
      <i class="bx bx-chevron-right text-slate-400 self-center text-sm ml-auto"></i>
    </div>
  `).join('');
}

export function renderOverviewTab(state, properties) {
  // 1. Total Properties
  const totalProps = properties.length;
  const availableProps = properties.filter(p => p.status === 'For Sale').length;
  const soldProps = properties.filter(p => p.status === 'Sold').length;
  const reservedProps = properties.filter(p => p.status === 'Reserved').length;
  const propsBreakdown = `${availableProps} Available · ${reservedProps} Reserved · ${soldProps} Sold`;

  // 2. Total Customers
  const customerEmails = new Set();
  if (state.admin.kycQueue) {
    state.admin.kycQueue.forEach(k => customerEmails.add(k.email.toLowerCase()));
  }
  if (state.admin.ordersLedger) {
    state.admin.ordersLedger.forEach(o => customerEmails.add(o.email.toLowerCase()));
  }
  const totalCustomers = customerEmails.size || 0;

  // 3. Total Sales Value (based on selected period dropdown)
  const period = state.admin.salesPeriodSelected || 'all';
  const totalSalesVal = getSalesValueForPeriod(state, period);
  const formattedSalesVal = fmtNGN(totalSalesVal);
  const periodLabels = {
    'month': 'This Month',
    'quarter': 'This Quarter',
    'all': 'All Time'
  };
  const salesSubtext = `${periodLabels[period]} sales volume`;

  // 4. Commissions Owed (Liability)
  const totalCommOwed = (state.admin.referralsList || []).reduce((sum, p) => sum + (p.balance || 0), 0);
  const formattedCommOwed = fmtNGN(totalCommOwed);

  // 5. Pending KYC Count
  const clientKycPending = (state.admin.kycQueue || []).filter(k => k.status === 'Pending Review').length;
  const affiliateKycPending = (state.admin.referralsList || []).filter(p => p.status === 'Pending Review').length;
  const totalKycPending = clientKycPending + affiliateKycPending;
  const kycBreakdown = `${clientKycPending} Clients · ${affiliateKycPending} Affiliates`;

  // 6. Pending Withdrawal Requests
  let pendingWithdrawalsCount = 0;
  let pendingWithdrawalsValue = 0;
  (state.admin.referralsList || []).forEach(p => {
    (p.payoutsList || []).forEach(w => {
      if (w.status === 'Pending Release') {
        pendingWithdrawalsCount++;
        pendingWithdrawalsValue += w.amount;
      }
    });
  });
  const withdrawalsCountText = `${pendingWithdrawalsCount} Requests`;
  const withdrawalsValText = `Total: ${fmtNGN(pendingWithdrawalsValue)}`;

  // 7. Inspection Queue
  const inspectionsPending = (state.admin.inspectionsList || []).filter(i => i.status === 'Pending' || i.status === 'Confirmed').length;
  const inspectionsCountText = `${inspectionsPending} Pending`;

  // Dynamic Recent Activity logs table rows
  const recentActivitiesHtml = renderActivitiesHtml(state);

  // Dynamic Needs Attention alert cards list
  const needsAttentionHtml = generateNeedsAttentionHtml(state);

  let finalHtml = overviewHtml;
  finalHtml = finalHtml
    .replace('id="kpi-properties-total">0', `id="kpi-properties-total">${totalProps}`)
    .replace('id="kpi-properties-breakdown">0 Available · 0 Reserved · 0 Sold', `id="kpi-properties-breakdown">${propsBreakdown}`)
    .replace('id="kpi-customers-total">0', `id="kpi-customers-total">${totalCustomers}`)
    .replace('id="kpi-sales-value">₦0', `id="kpi-sales-value">${formattedSalesVal}`)
    .replace('id="kpi-sales-subtext">Confirmed sales ledger', `id="kpi-sales-subtext">${salesSubtext}`)
    .replace('id="kpi-commissions-owed">₦0', `id="kpi-commissions-owed">${formattedCommOwed}`)
    .replace('id="kpi-kyc-pending">0', `id="kpi-kyc-pending">${totalKycPending}`)
    .replace('id="kpi-kyc-breakdown">0 Clients · 0 Affiliates', `id="kpi-kyc-breakdown">${kycBreakdown}`)
    .replace('id="kpi-withdrawals-count">0 Requests', `id="kpi-withdrawals-count">${withdrawalsCountText}`)
    .replace('id="kpi-withdrawals-value">Total: ₦0', `id="kpi-withdrawals-value">${withdrawalsValText}`)
    .replace('id="kpi-inspections-count">0 Pending', `id="kpi-inspections-count">${inspectionsCountText}`)
    .replace('<!-- DYNAMIC RECENT ACTIVITIES -->', recentActivitiesHtml)
    .replace('<!-- DYNAMIC ACTION ITEMS -->', needsAttentionHtml);

  // Set default state option selection tag
  finalHtml = finalHtml.replace(`value="${period}"`, `value="${period}" selected`);

  return finalHtml;
}

export function bindOverviewTabListeners(state, root, initAdminTab) {
  // Sync the sales period selector value and change trigger
  const periodSelect = document.getElementById('sales-period-select');
  if (periodSelect) {
    periodSelect.value = state.admin.salesPeriodSelected || 'all';
    periodSelect.addEventListener('change', (e) => {
      state.admin.salesPeriodSelected = e.target.value;
      initAdminTab('overview');
    });
  }

  // Bind navigation triggers on cards and timeline lists
  root.addEventListener('click', (e) => {
    const tabTarget = e.target.closest('[data-tab]');
    if (tabTarget) {
      const tabName = tabTarget.getAttribute('data-tab');
      if (tabName && state.activeRoute === 'admin') {
        e.preventDefault();
        
        // Try clicking actual matching sidebar button to load routes and folder chevrons
        const sidebarBtn = document.querySelector(`#admin-sidebar-menu button[data-tab="${tabName}"]`);
        if (sidebarBtn) {
          sidebarBtn.click();
        } else {
          // Fallback direct tab render
          state.admin.activeTab = tabName;
          initAdminTab(tabName);
        }
      }
    }
  });

  // Re-initialize Chart trends visual
  setTimeout(() => {
    const salesCtx = document.getElementById('salesOverviewChart');
    if (!salesCtx || !window.Chart) return;

    const period = state.admin.salesPeriodSelected || 'all';
    
    // Period responsive configurations
    let labels, revData, commData, periodText;
    if (period === 'month') {
      labels = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'];
      revData = [150, 280, 390, 450]; // Scaled mock trends
      commData = [15, 28, 39, 45];
      periodText = 'This Month (₦ Millions)';
    } else if (period === 'quarter') {
      labels = ['Month 1', 'Month 2', 'Month 3'];
      revData = [320, 680, 850];
      commData = [32, 68, 85];
      periodText = 'This Quarter (₦ Millions)';
    } else {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
      revData = [150, 320, 480, 710, 850, 1100, 1450];
      commData = [15, 32, 48, 71, 85, 110, 145];
      periodText = 'Sales Performance Trend (₦ Millions)';
    }

    const labelEl = document.getElementById('overview-chart-period-label');
    if (labelEl) labelEl.textContent = periodText;

    new window.Chart(salesCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Sales Revenue',
            data: revData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderWidth: 2,
            tension: 0.35,
            fill: true,
            pointRadius: 3
          },
          {
            label: 'Commissions Paid',
            data: commData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            borderWidth: 1.5,
            borderDash: [4, 4],
            tension: 0.35,
            fill: true,
            pointRadius: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 10,
              font: { size: 9, weight: '600', family: 'Inter' }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 8,
            cornerRadius: 4,
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: ₦${context.raw.toLocaleString()}M`;
              }
            }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(156, 163, 175, 0.05)' },
            ticks: {
              font: { size: 8, family: 'Inter' },
              callback: function(value) { return '₦' + value + 'M'; }
            }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 8, family: 'Inter' } }
          }
        }
      }
    });
  }, 50);
}
