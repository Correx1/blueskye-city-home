// --- Admin Dashboard Sub-views Templates & Event Binders ---

export function renderAdminTabContent(tabName, state, properties, projects, blogs) {
  switch (tabName) {
    case 'overview': return renderOverviewTab(state, properties);
    case 'properties-list': return renderPropertiesListTab(properties);
    case 'properties-add': return renderAddEditPropertyTab(state, properties, projects);
    case 'properties-projects': return renderDevelopmentProjectsTab(projects);
    case 'properties-track': return renderTrackConstructionTab(projects);
    case 'properties-mapping': return renderLandPlotMappingTab();
    case 'customers-list': return renderCustomersListTab(state);
    case 'customers-kyc': return renderCustomersKycTab(state);
    case 'customers-access': return renderCustomersAccessTab(state);
    case 'customers-docs': return renderCustomersDocsTab(state);
    case 'customers-notes': return renderCustomerNotesTab(state);
    case 'sales-list': return renderSalesCatalogTab(state);
    case 'sales-installments': return renderInstallmentPlansTab(state);
    case 'sales-payments': return renderConfirmedPaymentsTab(state);
    case 'sales-invoicing': return renderInvoicesListTab(state);
    case 'partners-directory': return renderPartnerDirectoryTab(state);
    case 'partners-ledger': return renderCommissionOverridesTab(state);
    case 'partners-payouts': return renderPayoutRecordsTab(state);
    case 'partners-tree': return renderAffiliateTreeTab(state);
    case 'clients-bookings': return renderTourBookingsTab(state);
    case 'inspections-calendar': return renderInspectionCalendarTab(state);
    case 'reports-sales': return renderSalesSummaryReportTab(state);
    case 'reports-commissions': return renderCommissionReportTab(state);
    case 'reports-performance': return renderPerformanceAnalyticsTab(state);
    case 'finance-ledger': return renderPaymentLedgerTab(state);
    case 'staff-accounts': return renderStaffAccountsTab(state);
    case 'staff-permissions': return renderAccessPermissionsTab(state);
    case 'blog-write': return renderWriteArticlesTab(state);
    case 'blog-subscribers': return renderNewsSubscribersTab();
    case 'clients-messages': return renderContactMessagesTab(state);
    case 'settings-profile': return renderPlatformProfileTab(state);
    case 'settings-bank': return renderEscrowBankSetupTab(state);
    case 'settings-audit': return renderSystemAuditLogsTab(state);
    default: return renderOverviewTab(state, properties);
  }
}

// 1. Overview Tab
function renderOverviewTab(state, properties) {
  const activeCount = properties.length;
  
  // Calculate total sales dynamically from orders ledger
  const totalSalesVal = state.admin.ordersLedger.reduce((acc, curr) => acc + curr.price, 0);
  const formattedSalesVal = `₦${(totalSalesVal / 1000000000).toFixed(2)}B`;

  return `
    <div class="space-y-6 animate-fade-in text-slate-800 dark:text-slate-200">
      
      <!-- System-wide 4 Flat KPIs Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- 1. Total Sales Value -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-md p-5 shadow-none space-y-2 flex flex-col justify-between">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-450">Total Sales Value</span>
            <i class="bx bx-line-chart text-lg text-emerald-500"></i>
          </div>
          <div>
            <p class="text-2xl font-display font-black text-slate-950 dark:text-white">${formattedSalesVal}</p>
            <span class="text-[9px] text-emerald-500 font-semibold block mt-1">Confirmed escrow sales</span>
          </div>
        </div>

        <!-- 2. Commissions Owed -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-md p-5 shadow-none space-y-2 flex flex-col justify-between">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-455">Commissions Owed</span>
            <i class="bx bx-wallet text-lg text-blue-500"></i>
          </div>
          <div>
            <p class="text-2xl font-display font-black text-slate-955 dark:text-white">₦15,000,000</p>
            <span class="text-[9px] text-blue-500 font-semibold block mt-1">Awaiting bank clearance</span>
          </div>
        </div>

        <!-- 3. Total Properties -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-md p-5 shadow-none space-y-2 flex flex-col justify-between">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-450">Total Properties</span>
            <i class="bx bx-building-house text-lg text-[#1e3a8a]"></i>
          </div>
          <div>
            <p class="text-2xl font-display font-black text-slate-955 dark:text-white">${activeCount}</p>
            <span class="text-[9px] text-green-500 font-semibold block mt-1">Active catalog listings</span>
          </div>
        </div>

        <!-- 4. Outstanding Installment Receivables (The 1 More Card) -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-md p-5 shadow-none space-y-2 flex flex-col justify-between">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-450">Installment Receivables</span>
            <i class="bx bx-coin-stack text-lg text-amber-500"></i>
          </div>
          <div>
            <p class="text-2xl font-display font-black text-slate-955 dark:text-white">₦420,000,000</p>
            <span class="text-[9px] text-amber-500 font-semibold block mt-1">Outstanding buyer balances</span>
          </div>
        </div>

      </div>

      <!-- Charts & Detailed Tables Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left Side: Sales Line Chart & Transactions Table (Col-Span 2) -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Line Chart: Revenue Trend -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-md p-5 shadow-none space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Sales Revenue & Affiliate Payout Trends</h4>
              <span class="text-[9px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 font-bold">2026 Live data</span>
            </div>
            <div class="h-64 w-full relative">
              <canvas id="salesOverviewChart"></canvas>
            </div>
          </div>

          <!-- Transaction Ledger Table -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-md p-5 shadow-none space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Recent Sales & Invoicing Transactions</h4>
              <button data-tab="sales-list" class="text-xs text-[#1e3a8a] hover:underline font-semibold flex items-center gap-1">
                View Sales Ledger <i class="bx bx-right-arrow-alt"></i>
              </button>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm border-collapse">
                <thead>
                  <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                    <th class="p-3">Customer</th>
                    <th class="p-3">Property</th>
                    <th class="p-3">Referrer</th>
                    <th class="p-3">Value</th>
                    <th class="p-3">Contract Plan</th>
                    <th class="p-3">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td class="p-3 font-semibold">
                      <button data-tab="customers-list" class="text-[#1d4ed8] hover:underline font-bold text-left focus:outline-none">Chukwu Raphael</button>
                    </td>
                    <td class="p-3 font-medium">
                      <button data-tab="properties-list" class="text-[#1d4ed8] hover:underline text-left focus:outline-none">Lekki Heights Plot 101</button>
                    </td>
                    <td class="p-3">
                      <button data-tab="partners-directory" class="text-slate-650 hover:underline text-left focus:outline-none">Obinna Diala</button>
                    </td>
                    <td class="p-3 font-mono font-normal text-slate-800 dark:text-slate-200">₦150,000,000</td>
                    <td class="p-3 font-bold text-[9px] uppercase text-blue-600">Outright</td>
                    <td class="p-3"><span class="px-2 py-0.5 bg-green-500/10 text-green-600 rounded text-[9px] font-semibold uppercase">Confirmed</span></td>
                  </tr>
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td class="p-3 font-semibold">
                      <button data-tab="customers-list" class="text-[#1d4ed8] hover:underline font-bold text-left focus:outline-none">Jane Doe</button>
                    </td>
                    <td class="p-3 font-medium">
                      <button data-tab="properties-list" class="text-[#1d4ed8] hover:underline text-left focus:outline-none">Magnolia Mansion</button>
                    </td>
                    <td class="p-3">
                      <button data-tab="partners-directory" class="text-slate-650 hover:underline text-left focus:outline-none">Obinna Diala</button>
                    </td>
                    <td class="p-3 font-mono font-normal text-slate-800 dark:text-slate-200">₦850,000,000</td>
                    <td class="p-3 font-bold text-[9px] uppercase text-blue-600">Installments</td>
                    <td class="p-3"><span class="px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded text-[9px] font-semibold uppercase">Pending Downpay</span></td>
                  </tr>
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td class="p-3 font-semibold">
                      <button data-tab="customers-list" class="text-[#1d4ed8] hover:underline font-bold text-left focus:outline-none">Amina Yusuf</button>
                    </td>
                    <td class="p-3 font-medium">
                      <button data-tab="properties-list" class="text-[#1d4ed8] hover:underline text-left focus:outline-none">Serene Serviced Plot</button>
                    </td>
                    <td class="p-3 text-slate-400">None</td>
                    <td class="p-3 font-mono font-normal text-slate-800 dark:text-slate-200">₦150,000,000</td>
                    <td class="p-3 font-bold text-[9px] uppercase text-blue-600">Installments</td>
                    <td class="p-3"><span class="px-2 py-0.5 bg-green-500/10 text-green-600 rounded text-[9px] font-semibold uppercase">Active Plan</span></td>
                  </tr>
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td class="p-3 font-semibold">
                      <button data-tab="customers-list" class="text-[#1d4ed8] hover:underline font-bold text-left focus:outline-none">Florence Nduka</button>
                    </td>
                    <td class="p-3 font-medium">
                      <button data-tab="properties-list" class="text-[#1d4ed8] hover:underline text-left focus:outline-none">Lekki Heights Plot 102</button>
                    </td>
                    <td class="p-3">
                      <button data-tab="partners-directory" class="text-slate-650 hover:underline text-left focus:outline-none">Obinna Diala</button>
                    </td>
                    <td class="p-3 font-mono font-normal text-slate-800 dark:text-slate-200">₦180,000,000</td>
                    <td class="p-3 font-bold text-[9px] uppercase text-blue-600">Outright</td>
                    <td class="p-3"><span class="px-2 py-0.5 bg-green-500/10 text-green-600 rounded text-[9px] font-semibold uppercase">Confirmed</span></td>
                  </tr>
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td class="p-3 font-semibold">
                      <button data-tab="customers-list" class="text-[#1d4ed8] hover:underline font-bold text-left focus:outline-none">Kabiru Aliyu</button>
                    </td>
                    <td class="p-3 font-medium">
                      <button data-tab="properties-list" class="text-[#1d4ed8] hover:underline text-left focus:outline-none">Magnolia Mansion Plot B</button>
                    </td>
                    <td class="p-3">
                      <button data-tab="partners-directory" class="text-slate-650 hover:underline text-left focus:outline-none">Obinna Diala</button>
                    </td>
                    <td class="p-3 font-mono font-normal text-slate-800 dark:text-slate-200">₦240,000,000</td>
                    <td class="p-3 font-bold text-[9px] uppercase text-blue-600">Installments</td>
                    <td class="p-3"><span class="px-2 py-0.5 bg-red-500/10 text-red-600 rounded text-[9px] font-semibold uppercase">Overdue Payment</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- Right Side: Pie Chart & Escrow Alerts Checklist (Col-Span 1) -->
        <div class="space-y-6">
          
          <!-- Pie Chart: Sales Lead Contribution -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-md p-5 shadow-none space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Sales Contribution Channels</h4>
            <div class="h-64 w-full relative flex items-center justify-center">
              <canvas id="locationDistributionChart"></canvas>
            </div>
          </div>

          <!-- Alert Tickers Checklist -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-md p-5 shadow-none space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Pending Action Items</h4>
            </div>
            
            <div class="space-y-3">
              <div class="p-3 bg-amber-500/5 rounded border border-amber-500/20 flex items-start gap-2.5">
                <i class="bx bx-shield-quarter text-amber-500 mt-0.5"></i>
                <div>
                  <button data-tab="customers-kyc" class="text-xs font-bold text-slate-900 dark:text-white hover:underline text-left focus:outline-none block">Review KYC Document Uploads</button>
                  <p class="text-[9px] text-slate-500">Chukwu Raphael NIN verification pending</p>
                </div>
              </div>
              <div class="p-3 bg-blue-500/5 rounded border border-blue-500/20 flex items-start gap-2.5">
                <i class="bx bx-calendar text-[#1e3a8a] mt-0.5"></i>
                <div>
                  <button data-tab="clients-bookings" class="text-xs font-bold text-slate-900 dark:text-white hover:underline text-left focus:outline-none block">Coordinate Site Tours request</button>
                  <p class="text-[9px] text-slate-500">Jane Doe physical tour scheduling needed</p>
                </div>
              </div>
              <div class="p-3 bg-green-500/5 rounded border border-green-500/20 flex items-start gap-2.5">
                <i class="bx bx-wallet text-green-500 mt-0.5"></i>
                <div>
                  <button data-tab="partners-payouts" class="text-xs font-bold text-slate-900 dark:text-white hover:underline text-left focus:outline-none block">Approve Affiliate Payout request</button>
                  <p class="text-[9px] text-slate-500">Zenith Bank withdrawal payout verification pending</p>
                </div>
              </div>
              <div class="p-3 bg-red-500/5 rounded border border-red-500/20 flex items-start gap-2.5">
                <i class="bx bx-info-circle text-red-500 mt-0.5"></i>
                <div>
                  <button data-tab="sales-installments" class="text-xs font-bold text-slate-900 dark:text-white hover:underline text-left focus:outline-none block">Outstanding Invoice Reminder</button>
                  <p class="text-[9px] text-slate-500">Kabiru Aliyu installment overdue ₦45,000,000</p>
                </div>
              </div>
              <div class="p-3 bg-indigo-500/5 rounded border border-indigo-500/20 flex items-start gap-2.5">
                <i class="bx bx-building text-indigo-500 mt-0.5"></i>
                <div>
                  <button data-tab="properties-track" class="text-xs font-bold text-slate-900 dark:text-white hover:underline text-left focus:outline-none block">Construction Phase Sign-off</button>
                  <p class="text-[9px] text-slate-500">Lekki Heights Phase 1 foundation complete signoff</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}

// 2. Properties List (CRUD)
function renderPropertiesListTab(properties) {
  return `
    <div class="space-y-6 animate-fade-in relative text-slate-800 dark:text-slate-200">
      
      <!-- Module Title -->
      <div class="border-b border-slate-200/20 pb-3">
        <h3 class="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-white">Properties Catalog</h3>
      </div>

      <!-- Actions Bar (Search/Filters on left end, Add button on right end) -->
      <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <!-- Search & Filters (On Left end!) -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-4xl">
          <!-- Search box -->
          <div class="relative flex-1">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i class="bx bx-search text-sm"></i>
            </span>
            <input type="text" id="admin-search-properties" placeholder="Search title or location..." class="w-full form-input text-xs pl-9 bg-white dark:bg-slate-900 text-slate-850 dark:text-white" />
          </div>
          
          <!-- Status Filter -->
          <select id="filter-property-status" class="form-input text-xs bg-white dark:bg-slate-900 text-slate-850 dark:text-white shrink-0 sm:w-32">
            <option value="all">All Status</option>
            <option value="For Sale">For Sale</option>
            <option value="Sold">Sold</option>
          </select>
          
          <!-- Publish Filter -->
          <select id="filter-property-publish" class="form-input text-xs bg-white dark:bg-slate-900 text-slate-850 dark:text-white shrink-0 sm:w-32">
            <option value="all">All Publish</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>

          <!-- Sorting Select Dropdown -->
          <select id="sort-property" class="form-input text-xs bg-white dark:bg-slate-900 text-slate-850 dark:text-white shrink-0 sm:w-36">
            <option value="default">Default Sort</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Title: A to Z</option>
          </select>
        </div>

        <!-- Add button (On Right end!) -->
        <div class="flex items-center justify-end shrink-0">
          <button id="add-property-modal-btn" class="btn btn-sm btn-primary flex items-center gap-1.5 active:scale-98">
            <i class="bx bx-plus text-sm"></i>
            <span>Add New Property</span>
          </button>
        </div>
      </div>

      <!-- Properties Table Grid -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Image</th>
                <th class="p-4">Title</th>
                <th class="p-4">Location</th>
                <th class="p-4">Price</th>
                <th class="p-4">Status</th>
                <th class="p-4">Publish</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-properties-table-body" class="divide-y divide-slate-100 dark:divide-slate-850">
              ${properties.map(p => {
                const isPublished = p.published === undefined ? true : p.published;
                return `
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    <td class="p-4">
                      <img src="${p.images[0]}" class="h-10 w-16 object-cover rounded-md border border-slate-100 dark:border-slate-800" />
                    </td>
                    <td class="p-4 font-bold text-slate-900 dark:text-white">${p.title}</td>
                    <td class="p-4 text-slate-450">${p.city}</td>
                    <td class="p-4 font-semibold text-slate-800 dark:text-slate-300">${p.formattedPrice}</td>
                    <td class="p-4">
                      <span class="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                        p.status === 'For Sale' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }">${p.status}</span>
                    </td>
                    <td class="p-4">
                      <select data-publish-id="${p.id}" class="form-input py-1 px-2 text-[10px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded">
                        <option value="true" ${isPublished ? 'selected' : ''}>Published</option>
                        <option value="false" ${!isPublished ? 'selected' : ''}>Unpublished</option>
                      </select>
                    </td>
                    <td class="p-4 text-right space-x-2.5">
                      <button data-edit-id="${p.id}" class="text-blue-500 hover:text-blue-750 p-1" title="Edit"><i class="bx bx-edit text-base"></i></button>
                      <button data-delete-id="${p.id}" class="text-red-500 hover:text-red-750 p-1" title="Delete"><i class="bx bx-trash text-base"></i></button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Mock agents list for WooCommerce-grade Property Listing Sheets
const mockAgentsList = [
  { id: 1, name: "Aisha Bello", role: "Senior Partner Realtor", phone: "+234 803 123 4567", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" },
  { id: 2, name: "Chidi Egwu", role: "Land Acquisition Lead", phone: "+234 816 987 6543", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" },
  { id: 3, name: "Tolani Alao", role: "Client Relationship Manager", phone: "+234 902 444 5555", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" }
];

// 2.0 Add/Edit Property View (DEDICATED FULL VIEW WITH DYNAMIC SPECIFICATIONS & LIVE PREVIEW)
function renderAddEditPropertyTab(state, properties, projects) {
  const editId = state.admin.editingPropertyId;
  const p = editId ? properties.find(item => item.id === editId) : null;
  const isEditing = !!p;

  // Pre-load premium features checklist from state or defaults
  if (!state.admin.availableAmenities) {
    state.admin.availableAmenities = [
      "Swimming Pool", "24/7 Smart Security", "Backup Solar Power", "Fitness Center / Gym",
      "Paved Access Roads", "Drainage System", "CCTV Surveillance", "Smart Home Automation",
      "Water Treatment Plant", "Gated Security Community"
    ];
  }

  const activeFeatures = isEditing && p.amenities ? p.amenities : [];
  
  // Make sure any pre-existing amenities on the property are registered in state list
  if (isEditing && p.amenities) {
    p.amenities.forEach(am => {
      if (!state.admin.availableAmenities.includes(am)) {
        state.admin.availableAmenities.push(am);
      }
    });
  }

  // Render initial custom details
  let initialDetailsHtml = '';
  if (isEditing) {
    const details = p.customDetails || [];
    if (details.length === 0) {
      if (p.beds) details.push({ key: 'Bedrooms', value: p.beds });
      if (p.baths) details.push({ key: 'Bathrooms', value: p.baths });
      if (p.year) details.push({ key: 'Year Built', value: p.year });
    }
    
    details.forEach((det, index) => {
      initialDetailsHtml += `
        <div class="detail-row grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded border border-slate-100 dark:border-slate-850 animate-fade-in">
          <div class="sm:col-span-5">
            <select class="detail-key-select form-input py-2 text-sm bg-white dark:bg-slate-900 text-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 rounded">
              <option value="Bedrooms" ${det.key === 'Bedrooms' ? 'selected' : ''}>Bedrooms</option>
              <option value="Bathrooms" ${det.key === 'Bathrooms' ? 'selected' : ''}>Bathrooms</option>
              <option value="Property Type" ${det.key === 'Property Type' ? 'selected' : ''}>Property Type</option>
              <option value="Road Access" ${det.key === 'Road Access' ? 'selected' : ''}>Road Access</option>
              <option value="Electricity Access" ${det.key === 'Electricity Access' ? 'selected' : ''}>Electricity Access</option>
              <option value="Zoning Regulation" ${det.key === 'Zoning Regulation' ? 'selected' : ''}>Zoning Regulation</option>
              <option value="Topography" ${det.key === 'Topography' ? 'selected' : ''}>Topography</option>
              <option value="Custom" ${!['Bedrooms', 'Bathrooms', 'Property Type', 'Road Access', 'Electricity Access', 'Zoning Regulation', 'Topography'].includes(det.key) ? 'selected' : ''}>Custom Detail Key...</option>
            </select>
            <input type="text" class="detail-custom-key form-input py-2 text-sm mt-1 bg-white dark:bg-slate-900 ${['Bedrooms', 'Bathrooms', 'Property Type', 'Road Access', 'Electricity Access', 'Zoning Regulation', 'Topography'].includes(det.key) ? 'hidden' : ''}" placeholder="Enter Custom Key Name" value="${det.key}" />
          </div>
          <div class="sm:col-span-5">
            <input type="text" class="detail-value form-input py-2 text-sm bg-white dark:bg-slate-900" placeholder="e.g. 4, Flat, Commercial" value="${det.value}" />
          </div>
          <div class="sm:col-span-2 text-right">
            <button type="button" class="remove-detail-btn text-red-500 hover:text-red-750 transition-colors p-1" title="Remove Detail">
              <i class="bx bx-trash text-xl"></i>
            </button>
          </div>
        </div>
      `;
    });
  } else {
    // Default preset details for new properties
    initialDetailsHtml = `
      <div class="detail-row grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded border border-slate-100 dark:border-slate-850 animate-fade-in">
        <div class="sm:col-span-5">
          <select class="detail-key-select form-input py-2 text-sm bg-white dark:bg-slate-900 text-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 rounded">
            <option value="Bedrooms" selected>Bedrooms</option>
            <option value="Bathrooms">Bathrooms</option>
            <option value="Property Type">Property Type</option>
            <option value="Road Access">Road Access</option>
            <option value="Electricity Access">Electricity Access</option>
            <option value="Zoning Regulation">Zoning Regulation</option>
            <option value="Topography">Topography</option>
            <option value="Custom">Custom Detail Key...</option>
          </select>
          <input type="text" class="detail-custom-key form-input py-2 text-sm mt-1 bg-white dark:bg-slate-900 hidden" placeholder="Enter Custom Key Name" />
        </div>
        <div class="sm:col-span-5">
          <input type="text" class="detail-value form-input py-2 text-sm bg-white dark:bg-slate-900" placeholder="e.g. 4, Flat, Commercial" value="4" />
        </div>
        <div class="sm:col-span-2 text-right">
          <button type="button" class="remove-detail-btn text-red-500 hover:text-red-750 transition-colors p-1" title="Remove Detail">
            <i class="bx bx-trash text-xl"></i>
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="space-y-6 animate-fade-in text-slate-800 dark:text-slate-200 w-full mx-auto">
      
      <!-- Header Module Title -->
      <div class="flex items-center justify-between border-b border-slate-200/20 pb-4">
        <h3 class="text-base font-black uppercase tracking-wider text-slate-850 dark:text-white">
          ${isEditing ? 'Modify Property Catalog Entry' : 'Create Custom Property Entry'}
        </h3>
        <button id="cancel-property-btn" class="bg-[#1e3a8a] text-white hover:bg-blue-800 transition-all font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 shadow-sm active:scale-98">
          <i class="bx bx-left-arrow-alt text-sm"></i>
          <span>Back to Catalog</span>
        </button>
      </div>

      <!-- Balanced 2-Column Grid Layout -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start w-full">
        
        <!-- Left Side: Interactive Specification Sheet Form -->
        <div class="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-md p-6 space-y-6">
          <form id="property-full-form" class="space-y-6">
            <input type="hidden" id="full-prop-id" value="${isEditing ? p.id : ''}" />

            <!-- Section 1: Core Specifications -->
            <div class="space-y-4">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-855 pb-2">Core Specifications</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Property Name / Title</label>
                  <input type="text" id="full-prop-title" required value="${isEditing ? p.title : ''}" placeholder="e.g. Lekki Heights Plot 105" class="form-input py-2.5 text-sm bg-slate-50 dark:bg-slate-955 text-slate-850 dark:text-white" />
                </div>
                
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Development Project</label>
                  <select id="full-prop-project" class="form-input py-2.5 text-sm bg-slate-50 dark:bg-slate-955 text-slate-850 dark:text-white">
                    <option value="None">None</option>
                    ${projects.map(pr => `
                      <option value="${pr.title}" ${isEditing && p.project === pr.title ? 'selected' : ''}>${pr.title}</option>
                    `).join('')}
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Location (City)</label>
                  <input type="text" id="full-prop-city" required value="${isEditing ? p.city : 'Lekki'}" placeholder="e.g. Lekki" class="form-input py-2.5 text-sm bg-slate-50 dark:bg-slate-955 text-slate-850 dark:text-white" />
                </div>
                
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Size (Sqm / Plots)</label>
                  <input type="text" id="full-prop-size" required value="${isEditing ? (p.size || '450 Sqm') : '450 Sqm'}" placeholder="e.g. 450 Sqm or 2 Plots" class="form-input py-2.5 text-sm bg-slate-50 dark:bg-slate-955 text-slate-850 dark:text-white" />
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Price Value (₦)</label>
                  <input type="number" id="full-prop-price" required value="${isEditing ? p.price : ''}" placeholder="e.g. 150000000" class="form-input py-2.5 text-sm bg-slate-50 dark:bg-slate-955 text-slate-850 dark:text-white" />
                </div>
              </div>
            </div>

            <!-- Section 2: Listing Status & Payment Terms -->
            <div class="space-y-4">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-855 pb-2">Listing Status & Terms</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Availability Status</label>
                  <select id="full-prop-status" class="form-input py-2.5 text-sm bg-slate-50 dark:bg-slate-955 text-slate-850 dark:text-white">
                    <option value="For Sale" ${isEditing && p.status === 'For Sale' ? 'selected' : ''}>For Sale</option>
                    <option value="Sold" ${isEditing && p.status === 'Sold' ? 'selected' : ''}>Sold</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Escrow Covered Payment Plans</label>
                  <div class="flex flex-wrap gap-4 mt-2">
                    <label class="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input type="checkbox" id="plan-outright" checked class="rounded border-slate-350 text-[#1e3a8a] focus:ring-[#1e3a8a] h-4 w-4" />
                      <span>Outright</span>
                    </label>
                    <label class="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input type="checkbox" id="plan-3m" ${isEditing && p.paymentPlans && p.paymentPlans.includes('3-Month') ? 'checked' : ''} class="rounded border-slate-355 text-[#1e3a8a] focus:ring-[#1e3a8a] h-4 w-4" />
                      <span>3-Month</span>
                    </label>
                    <label class="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input type="checkbox" id="plan-6m" ${isEditing && p.paymentPlans && p.paymentPlans.includes('6-Month') ? 'checked' : ''} class="rounded border-slate-355 text-[#1e3a8a] focus:ring-[#1e3a8a] h-4 w-4" />
                      <span>6-Month</span>
                    </label>
                    <label class="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input type="checkbox" id="plan-12m" ${isEditing && p.paymentPlans && p.paymentPlans.includes('12-Month') ? 'checked' : ''} class="rounded border-slate-355 text-[#1e3a8a] focus:ring-[#1e3a8a] h-4 w-4" />
                      <span>12-Month</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 3: Premium Features & Amenities (WooCommerce-Style Checklist) -->
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-855 pb-2">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Premium Features & Amenities Checklist</h4>
                <div class="flex items-center gap-2">
                  <input type="text" id="new-amenity-input" placeholder="e.g. Cinema Room" class="form-input text-xs py-1 px-2.5 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 rounded w-40" />
                  <button type="button" id="add-amenity-btn" class="bg-[#1e3a8a] text-white hover:bg-blue-800 transition-all font-bold px-2.5 py-1 rounded text-xs active:scale-98">Add Amenity</button>
                </div>
              </div>
              <p class="text-xs text-slate-500">Toggle boolean amenities associated with this listing coordinates.</p>
              
              <div id="amenities-checkbox-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-slate-50/50 dark:bg-slate-955/20 p-4 rounded border border-slate-100 dark:border-slate-850">
                ${state.admin.availableAmenities.map(feature => {
                  const isChecked = activeFeatures.includes(feature);
                  return `
                    <div class="flex items-center justify-between group/amen bg-white dark:bg-slate-900 px-2 py-1.5 rounded border border-slate-200/40 dark:border-slate-800/40">
                      <label class="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:text-[#1e3a8a] dark:hover:text-blue-400 transition-colors flex-1 min-w-0 truncate">
                        <input type="checkbox" data-amenity="${feature}" ${isChecked ? 'checked' : ''} class="amenity-checkbox rounded border-slate-300 dark:border-slate-755 text-[#1e3a8a] focus:ring-[#1e3a8a] h-4 w-4" />
                        <span class="truncate">${feature}</span>
                      </label>
                      <button type="button" class="delete-amenity-btn text-red-500 hover:text-red-750 opacity-0 group-hover/amen:opacity-100 transition-opacity p-0.5 ml-1" data-amenity="${feature}" title="Delete amenity option">
                        <i class="bx bx-trash text-xs"></i>
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Section 4: Dynamic Specifications & Technical attributes (Add row key-value table) -->
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-855 pb-2">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Dynamic Specifications & Attributes</h4>
                <button type="button" id="add-detail-row-btn" class="bg-[#1e3a8a] text-white hover:bg-blue-800 transition-all font-bold px-3.5 py-1.5 rounded text-xs flex items-center gap-1 shadow-sm active:scale-98">
                  <i class="bx bx-plus text-xs"></i>
                  <span>Add Attribute</span>
                </button>
              </div>
              <p class="text-xs text-slate-500 leading-relaxed">Add dynamic specifications for buildings (Bedrooms, Bathrooms, Year) or lands (Zoning, Topography, Road access) without hardcoded constraints.</p>
              
              <div id="custom-details-container" class="space-y-3 mt-3">
                ${initialDetailsHtml}
              </div>
            </div>

            <!-- Section 5: Map Location Coordinates & Support Representative Agent -->
            <div class="space-y-4">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-855 pb-2">Location Map Coordinates & Assigned Realtor</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Google Maps Embed URL / Iframe Link</label>
                  <input type="text" id="full-prop-map-url" value="${isEditing && p.mapUrl ? p.mapUrl : ''}" placeholder="e.g. https://www.google.com/maps/embed?pb=..." class="form-input py-2.5 text-sm bg-slate-50 dark:bg-slate-955 text-slate-850 dark:text-white" />
                  <p class="text-[9px] text-slate-450 leading-relaxed">Paste the Google Map Share/Embed iframe URL coordinates to display listing map sheet</p>
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Assigned Realtor Representative</label>
                  <select id="full-prop-agent" class="form-input py-2.5 text-sm bg-slate-50 dark:bg-slate-955 text-slate-855 dark:text-white">
                    <option value="None">None (Unassigned)</option>
                    ${mockAgentsList.map(ag => `
                      <option value="${ag.name}" ${isEditing && p.agentName === ag.name ? 'selected' : ''}>${ag.name} (${ag.role})</option>
                    `).join('')}
                  </select>
                </div>
              </div>
            </div>

            <!-- Section 6: Interactive Image & Document Uploaders -->
            <div class="space-y-4">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-855 pb-2">Media & Regulatory Files Uploader</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Photo Uploading Widget -->
                <div class="space-y-3">
                  <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Photo Gallery Upload</label>
                  <div class="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-5 flex flex-col items-center justify-center text-center space-y-2.5 bg-slate-50/50 dark:bg-slate-950/20">
                    <i class="bx bx-image-add text-3xl text-slate-400"></i>
                    <span class="text-xs font-bold text-slate-600 dark:text-slate-400">Drag & drop photo assets or</span>
                    <button type="button" id="trigger-photos-upload" class="bg-[#1e3a8a] text-white hover:bg-blue-800 transition-all font-bold px-3.5 py-1.5 rounded text-xs active:scale-98">Browse Photos</button>
                    <input type="file" id="prop-photos-input" multiple accept="image/*" class="hidden" />
                  </div>
                  <input type="text" id="full-prop-image" value="${isEditing && p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}" placeholder="Direct asset photo URL coordinates" class="form-input py-2.5 text-sm bg-slate-50 dark:bg-slate-955 text-slate-850 dark:text-white" />
                  
                  <!-- Thumbnails Preview Grid -->
                  <div class="space-y-2 pt-1">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Gallery Thumbnails</label>
                    <div id="photos-preview-container" class="flex flex-wrap gap-2.5">
                      ${isEditing && p.images ? p.images.map(img => `
                        <div class="relative group h-14 w-20 border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
                          <img src="${img}" class="h-full w-full object-cover rounded" />
                          <button type="button" class="remove-photo-thumbnail absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity duration-150" data-src="${img}"><i class="bx bx-trash text-sm"></i></button>
                        </div>
                      `).join('') : `
                        <div class="relative group h-14 w-20 border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" class="h-full w-full object-cover rounded" />
                        </div>
                      `}
                    </div>
                  </div>
                </div>

                <!-- Document Uploading Widget -->
                <div class="space-y-3">
                  <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Property Verification Documents</label>
                  <div class="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-5 flex flex-col items-center justify-center text-center space-y-2.5 bg-slate-50/50 dark:bg-slate-950/20">
                    <i class="bx bx-file text-3xl text-slate-400"></i>
                    <span class="text-xs font-bold text-slate-600 dark:text-slate-400">Drag & drop certification PDFs or</span>
                    <button type="button" id="trigger-docs-upload" class="bg-[#1e3a8a] text-white hover:bg-blue-800 transition-all font-bold px-3.5 py-1.5 rounded text-xs active:scale-98">Browse Files</button>
                    <input type="file" id="prop-docs-input" multiple accept=".pdf,.doc,.docx,.png,.jpg" class="hidden" />
                  </div>
                  <input type="text" id="full-prop-docs" value="${isEditing && p.documentFileName ? p.documentFileName : ''}" placeholder="Verification documents index file" class="form-input py-2.5 text-sm bg-slate-50 dark:bg-slate-955 text-slate-850 dark:text-white" />
                  
                  <!-- Documents list container -->
                  <div class="space-y-2 pt-1">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Attached Verification Records</label>
                    <div id="docs-preview-container" class="space-y-1.5 text-xs text-slate-655 dark:text-slate-350">
                      ${isEditing && p.documentFileName ? `
                        <div class="flex items-center justify-between bg-slate-50 dark:bg-slate-955 p-2 rounded border border-slate-100 dark:border-slate-850">
                          <span class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300"><i class="bx bx-paperclip text-slate-450"></i>${p.documentFileName}</span>
                          <button type="button" class="remove-doc-btn text-red-500 hover:text-red-700"><i class="bx bx-x text-base"></i></button>
                        </div>
                      ` : `
                        <p class="text-xs text-slate-400 italic">No verification records uploaded yet</p>
                      `}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 7: Rich Details (Description, Tour Video) -->
            <div class="space-y-4">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-855 pb-2">Rich Media & Description</h4>
              
              <div class="space-y-2">
                <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Video Tour Link (Youtube Embed Coordinates)</label>
                <input type="text" id="full-prop-video" value="${isEditing && p.videoUrl ? p.videoUrl : ''}" placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ" class="form-input py-2.5 text-sm bg-slate-50 dark:bg-slate-955 text-slate-855 dark:text-white" />
              </div>

              <div class="space-y-2">
                <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Listing Description</label>
                <textarea id="full-prop-desc" rows="4" placeholder="Describe the land boundaries, neighborhood proximity features, security setups, and overall premium value proposition..." class="form-input py-2.5 text-sm bg-slate-50 dark:bg-slate-955 text-slate-855 dark:text-white min-h-[100px]">${isEditing && p.description ? p.description : ''}</textarea>
              </div>
            </div>

            <!-- Action submit buttons -->
            <div class="flex items-center gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-850">
              <button type="submit" class="bg-[#1e3a8a] text-white hover:bg-blue-800 transition-all font-bold py-3 px-8 rounded text-sm shadow-sm active:scale-98">
                ${isEditing ? 'Apply Specification Changes' : 'Publish Property Listing'}
              </button>
              <button type="button" id="cancel-property-form-btn" class="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 transition-all font-bold py-3 px-8 rounded text-sm active:scale-98">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Right Side: Real-time Live Listing Preview Card -->
        <div class="xl:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-md p-5 space-y-4 sticky top-6 shadow-none">
          <div class="border-b border-slate-100 dark:border-slate-850 pb-2">
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-white">Live Listing Sheet Preview</h4>
            <p class="text-[9px] text-slate-450">Updates instantly as specifications are modified</p>
          </div>

          <div id="live-preview-container" class="space-y-4">
            <!-- Dynamic Realtime Preview Card Render -->
            <div class="border border-slate-200/50 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50/20 dark:bg-slate-950/10">
              <!-- Preview Image slider mockup -->
              <div class="relative h-48 w-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
                <img id="prev-card-img" src="${isEditing && p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}" class="h-full w-full object-cover transition-all duration-300" />
                <span id="prev-card-status" class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-green-500 text-white">${isEditing ? p.status : 'For Sale'}</span>
                <span id="prev-card-project" class="absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-bold bg-slate-900/80 text-white">${isEditing && p.project && p.project !== 'None' ? p.project : 'Independent Development'}</span>
              </div>

              <!-- Preview Details Body -->
              <div class="p-4 space-y-4">
                <div class="space-y-1">
                  <h4 id="prev-card-title" class="text-sm font-black text-slate-850 dark:text-white tracking-wide uppercase leading-tight">${isEditing ? p.title : 'New Property Title'}</h4>
                  <p id="prev-card-location" class="text-xs text-slate-500 flex items-center gap-1"><i class="bx bx-map-pin"></i> ${isEditing ? p.city : 'Lekki'}, Nigeria</p>
                </div>

                <div class="flex items-center justify-between border-t border-b border-slate-100 dark:border-slate-850 py-2.5">
                  <div class="text-xs text-slate-500">Price tag</div>
                  <div id="prev-card-price" class="text-sm font-black text-[#1e3a8a] dark:text-blue-400">${isEditing ? p.formattedPrice : '₦0'}</div>
                </div>

                <!-- Preview features list -->
                <div class="space-y-2">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Custom Specifications</span>
                  <div id="prev-card-features" class="grid grid-cols-2 gap-2.5 text-xs text-slate-650 dark:text-slate-350">
                    ${isEditing && p.beds ? `<div class="flex items-center gap-1.5"><i class="bx bx-bed text-slate-400"></i><span>${p.beds} Bedrooms</span></div>` : ''}
                    ${isEditing && p.baths ? `<div class="flex items-center gap-1.5"><i class="bx bx-bath text-slate-400"></i><span>${p.baths} Bathrooms</span></div>` : ''}
                    ${isEditing && p.size ? `<div class="flex items-center gap-1.5"><i class="bx bx-expand text-slate-400"></i><span>Size: ${p.size}</span></div>` : ''}
                  </div>
                </div>

                <!-- Premium Features Checklist checklist summary -->
                <div class="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-850 pt-2">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Premium Amenities Included</span>
                  <div id="prev-card-amenities" class="flex flex-wrap gap-1.5">
                    <span class="text-xs text-slate-400 italic">None toggled</span>
                  </div>
                </div>

                <!-- Attached map coordinates status -->
                <div class="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-850 pt-2">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Map Coordinates</span>
                  <div id="prev-card-map-status" class="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <i class="bx bx-map-alt text-slate-450"></i>
                    <span>No Map Coordinates Attached</span>
                  </div>
                </div>

                <!-- Assigned agent support representative profile details -->
                <div id="prev-card-agent-section" class="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-850 pt-2">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Representative Realtor</span>
                  <div id="prev-card-agent-body" class="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/40 p-2 rounded border border-slate-150/10">
                    <img id="prev-card-agent-img" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" class="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800" />
                    <div>
                      <h5 id="prev-card-agent-name" class="text-xs font-bold text-slate-850 dark:text-white">Aisha Bello</h5>
                      <p id="prev-card-agent-role" class="text-[10px] text-slate-450">Senior Partner Realtor</p>
                    </div>
                  </div>
                </div>

                <!-- Payment Plans attached info -->
                <div class="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-850 pt-2">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Installment Tiers</span>
                  <div id="prev-card-plans" class="flex flex-wrap gap-2">
                    <span class="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-850 text-xs font-bold text-slate-700 dark:text-slate-300">Outright</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

// 2.1 Development Projects Tab
function renderDevelopmentProjectsTab(projects) {
  return `
    <div class="space-y-6 animate-fade-in relative">
      <div class="flex items-center justify-between">
        <p class="text-xs text-slate-500">Group multiple property plots and track land development phases.</p>
        <button id="add-project-modal-btn" class="btn btn-sm btn-primary active:scale-98">Add Development Project</button>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Project Name</th>
                <th class="p-4">Location</th>
                <th class="p-4">Total plots</th>
                <th class="p-4">Completed Stage</th>
                <th class="p-4">Assigned manager</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              ${projects.map(pr => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                  <td class="p-4 font-bold text-slate-900 dark:text-white">${pr.title}</td>
                  <td class="p-4 text-slate-450">${pr.location}</td>
                  <td class="p-4 font-medium">45 Plots</td>
                  <td class="p-4">
                    <span class="px-2 py-0.5 bg-blue-500/10 text-[#1d4ed8] text-[9px] font-black uppercase rounded">${pr.phase || 'Excavation'}</span>
                  </td>
                  <td class="p-4 text-slate-450 font-semibold">${pr.manager || 'Aliyu Bello'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Project Modal -->
      <div id="project-modal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center hidden opacity-0 transition-opacity duration-300">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md w-full max-w-md p-6 space-y-4 text-slate-800 dark:text-slate-200">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-white">Add Development Project</h4>
            <button type="button" id="close-project-modal" class="text-slate-400 hover:text-slate-650"><i class="bx bx-x text-xl"></i></button>
          </div>
          <form id="project-modal-form" class="space-y-4">
            <div class="space-y-1">
              <label class="text-[9px] font-bold text-slate-455 uppercase block">Project Name</label>
              <input type="text" id="project-title" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
            </div>
            <div class="space-y-1">
              <label class="text-[9px] font-bold text-slate-455 uppercase block">Location Coordinates</label>
              <input type="text" id="project-location" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
            </div>
            <div class="space-y-1">
              <label class="text-[9px] font-bold text-slate-455 uppercase block">Project Manager</label>
              <input type="text" id="project-manager" value="Aliyu Bello" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
            </div>
            <button type="submit" class="btn btn-sm btn-primary w-full justify-center py-2 active:scale-98 mt-2">
              Create Project
            </button>
          </form>
        </div>
      </div>

    </div>
  `;
}

// 3. Track Construction
function renderTrackConstructionTab(projects) {
  return `
    <div class="space-y-6 animate-fade-in">
      <p class="text-xs text-slate-450 max-w-lg">Manage active development landmarks, update completion milestones, and toggle construction phases.</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${projects.map(p => `
          <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl p-5 shadow-sm space-y-4">
            
            <div class="flex items-center gap-3">
              <img src="${p.images[0]}" class="h-12 w-20 object-cover rounded-md border border-slate-100 dark:border-slate-800" />
              <div>
                <h4 class="font-display font-extrabold text-sm text-slate-900 dark:text-white leading-tight">${p.title}</h4>
                <span class="text-[10px] text-slate-450">${p.location}</span>
              </div>
            </div>

            <!-- Milestone Slider -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-500">Milestone Progress:</span>
                <span class="font-black text-[#1d4ed8] dark:text-[#60a5fa]" id="percent-label-${p.id}">${p.progress || 75}%</span>
              </div>
              <input type="range" min="0" max="100" value="${p.progress || 75}" data-progress-slider="${p.id}" class="w-full accent-[#1d4ed8] cursor-ew-resize" />
            </div>

            <!-- Phase Select Dropdown -->
            <div class="space-y-1.5">
              <label class="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Development Phase</label>
              <select data-phase-select="${p.id}" class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white">
                <option value="Excavation" ${p.phase === 'Excavation' ? 'selected' : ''}>Phase 1: Excavation & Piling</option>
                <option value="Structure" ${p.phase === 'Structure' ? 'selected' : ''}>Phase 2: Reinforcement Concrete Structure</option>
                <option value="Finishes" ${p.phase === 'Finishes' ? 'selected' : ''}>Phase 3: MEP Installations & Interior Finishes</option>
                <option value="Handover" ${p.phase === 'Handover' ? 'selected' : ''}>Phase 4: Inspection & Key Handover</option>
              </select>
            </div>

            <!-- Save Action Button -->
            <button data-save-project-id="${p.id}" class="btn btn-sm btn-primary w-full justify-center py-2 active:scale-98">
              Update Landmark Progress
            </button>

          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 4. Land Plot Mapping
function renderLandPlotMappingTab() {
  const plots = [
    { id: 'PK-101', project: 'Lekki Heights Residence', area: '650 Sqm', status: 'Allocated', client: 'Chukwu Raphael', coordinates: '6.4281° N, 3.4219° E' },
    { id: 'PK-102', project: 'Lekki Heights Residence', area: '650 Sqm', status: 'Available', client: 'None', coordinates: '6.4283° N, 3.4222° E' },
    { id: 'AB-201', project: 'Abuja Diplomatic Estates', area: '1000 Sqm', status: 'Escrow Pending', client: 'Jane Doe', coordinates: '9.0765° N, 7.3985° E' },
    { id: 'AB-202', project: 'Abuja Diplomatic Estates', area: '1000 Sqm', status: 'Allocated', client: 'Amina Yusuf', coordinates: '9.0768° N, 7.3990° E' }
  ];

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Plot ID</th>
                <th class="p-4">Project Development</th>
                <th class="p-4">Dimensions</th>
                <th class="p-4">Survey coordinates</th>
                <th class="p-4">Client Allocation</th>
                <th class="p-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              ${plots.map(pl => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                  <td class="p-4 font-bold text-slate-900 dark:text-white">${pl.id}</td>
                  <td class="p-4 text-slate-450">${pl.project}</td>
                  <td class="p-4 font-medium">${pl.area}</td>
                  <td class="p-4 font-mono text-[10px] text-slate-400">${pl.coordinates}</td>
                  <td class="p-4 font-semibold text-[#1d4ed8] dark:text-[#60a5fa]">${pl.client}</td>
                  <td class="p-4">
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      pl.status === 'Available' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                      pl.status === 'Allocated' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }">${pl.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 5. Customer Database - Customers Directory
function renderCustomersListTab(state) {
  const kycQueue = state.admin.kycQueue;
  return `
    <div class="space-y-6 animate-fade-in">
      
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Search and filters -->
        <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div class="relative w-full sm:max-w-xs">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i class="bx bx-search text-sm"></i>
            </span>
            <input type="text" id="admin-search-customers" placeholder="Search customers..." class="form-input text-xs pl-9 bg-white dark:bg-slate-900 text-slate-850 dark:text-white" />
          </div>
          
          <select id="filter-kyc-status" class="form-input text-xs bg-white dark:bg-slate-900 text-slate-850 dark:text-white max-w-[150px]">
            <option value="all">All KYC Statuses</option>
            <option value="Approved">Verified</option>
            <option value="Pending Review">Pending Verification</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <!-- Add Customer button -->
        <button id="add-customer-btn" class="btn btn-sm btn-primary flex items-center gap-1.5 active:scale-98">
          <i class="bx bx-plus text-sm"></i>
          <span>Add New Customer</span>
        </button>
      </div>

      <!-- Customers Table -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Customer Name</th>
                <th class="p-4">Email Coordinates</th>
                <th class="p-4">KYC Compliance</th>
                <th class="p-4">Assigned Affiliate</th>
                <th class="p-4">Assets Owned</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-customers-table-body" class="divide-y divide-slate-100 dark:divide-slate-850">
              ${kycQueue.map(c => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                  <td class="p-4 font-bold text-slate-900 dark:text-white">${c.name}</td>
                  <td class="p-4 text-slate-455 font-mono">${c.email}</td>
                  <td class="p-4">
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      c.status === 'Approved' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                      c.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-red-500/10 text-red-600'
                    }">${c.status === 'Approved' ? 'Verified' : c.status}</span>
                  </td>
                  <td class="p-4 text-slate-500 font-semibold">Obinna Diala (Gen 1)</td>
                  <td class="p-4 text-slate-450 font-medium">Lekki Heights Plot 101</td>
                  <td class="p-4 text-right">
                    <button data-view-customer-id="${c.id}" class="text-[#1d4ed8] hover:text-[#1e3a8a] font-bold transition-colors">View Profile</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

// 5.1 Customer KYC Management
function renderCustomersKycTab(state) {
  const pending = state.admin.kycQueue;
  return `
    <div class="space-y-6 animate-fade-in">
      <p class="text-xs text-slate-455">Review official photo IDs, utility credentials, and national registration details (NIN/BVN). Contracts require verification to clear titles.</p>
      
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Client</th>
                <th class="p-4">Document Type</th>
                <th class="p-4">Date Uploaded</th>
                <th class="p-4">Compliance Status</th>
                <th class="p-4 text-right">Audit Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              ${pending.map(k => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                  <td class="p-4">
                    <span class="block font-bold text-slate-900 dark:text-white">${k.name}</span>
                    <span class="block text-[10px] text-slate-450">${k.email}</span>
                  </td>
                  <td class="p-4">
                    <span class="font-medium text-slate-800 dark:text-slate-300 flex items-center gap-1">
                      <i class="bx bx-file-blank text-slate-400"></i> ${k.docType}
                    </span>
                  </td>
                  <td class="p-4 text-slate-455">${k.date}</td>
                  <td class="p-4">
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      k.status === 'Approved' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                      k.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-red-500/10 text-red-650'
                    }">${k.status}</span>
                  </td>
                  <td class="p-4 text-right space-x-2">
                    ${k.status === 'Pending Review' ? `
                      <button data-approve-kyc="${k.id}" class="btn btn-sm py-1 px-3 bg-green-500/10 hover:bg-green-500 text-green-600 hover:text-white font-bold rounded transition-colors text-[10px]">Approve</button>
                      <button data-reject-kyc="${k.id}" class="btn btn-sm py-1 px-3 bg-red-500/10 hover:bg-red-500 text-red-605 hover:text-white font-bold rounded transition-colors text-[10px]">Reject</button>
                      <button data-request-kyc="${k.id}" class="btn btn-sm py-1 px-3 bg-blue-500/10 hover:bg-blue-500 text-[#1d4ed8] hover:text-white font-bold rounded transition-colors text-[10px]">Request Re-upload</button>
                    ` : `
                      <span class="text-[10px] text-slate-400 italic">Audit Verified</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 5.2 Portal Access Controls
function renderCustomersAccessTab(state) {
  const kycQueue = state.admin.kycQueue;
  return `
    <div class="space-y-6 animate-fade-in">
      <p class="text-xs text-slate-455">Enable or disable client login privileges and reset user passwords on behalf of customers.</p>
      
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Customer</th>
                <th class="p-4">Email</th>
                <th class="p-4">Portal Login</th>
                <th class="p-4 text-right">Access Controls Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              ${kycQueue.map(c => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                  <td class="p-4 font-bold text-slate-900 dark:text-white">${c.name}</td>
                  <td class="p-4 text-slate-455 font-mono">${c.email}</td>
                  <td class="p-4">
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      c.accessDisabled ? 'bg-red-500/10 text-red-650' : 'bg-green-500/10 text-green-600 dark:text-green-400'
                    }">${c.accessDisabled ? 'Disabled' : 'Enabled'}</span>
                  </td>
                  <td class="p-4 text-right space-x-2">
                    <button data-toggle-access-id="${c.id}" class="btn btn-sm py-1 px-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 font-bold rounded text-[10px] transition-colors">
                      ${c.accessDisabled ? 'Enable Portal' : 'Disable Portal'}
                    </button>
                    <button data-reset-pass-id="${c.id}" class="btn btn-sm py-1 px-3 bg-[#1d4ed8]/10 hover:bg-[#1d4ed8] text-[#1d4ed8] hover:text-white font-bold rounded text-[10px] transition-colors">
                      Reset Password
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 5.3 Upload Customer Documents
function renderCustomersDocsTab(state) {
  const kycQueue = state.admin.kycQueue;
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl p-6 shadow-sm max-w-xl space-y-4">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Admin Document Upload Locker</h4>
        <p class="text-xs text-slate-455">Upload digital land titles and letters of allocation directly to a customer's portal ledger.</p>
        
        <form id="customer-upload-docs-form" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-[9px] font-bold text-slate-455 uppercase tracking-wider block">Select Target Customer</label>
            <select id="upload-doc-customer-select" class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" required>
              <option value="" disabled selected>Select customer profile...</option>
              ${kycQueue.map(c => `<option value="${c.id}">${c.name} (${c.email})</option>`).join('')}
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-[9px] font-bold text-slate-455 uppercase tracking-wider block">Document Classification Type</label>
            <select id="upload-doc-class-select" class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" required>
              <option value="Allocation Letter">Allocation Letter coordinates</option>
              <option value="Certificate of Occupancy (C of O)">Certificate of Occupancy (C of O)</option>
              <option value="Deed of Assignment">Deed of Assignment contract</option>
              <option value="Survey Plan">Survey Plan coordinates mapping</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-[9px] font-bold text-slate-455 uppercase tracking-wider block">Select File (.PDF, .JPG)</label>
            <input type="file" id="upload-doc-file-input" required class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-[#1d4ed8] hover:file:bg-slate-200" />
          </div>

          <button type="submit" class="btn btn-sm btn-primary py-2 px-5 active:scale-98">
            Upload Document coordinates
          </button>
        </form>
      </div>
    </div>
  `;
}

// 7. Customer Notes Tab
function renderCustomerNotesTab(state) {
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <p class="text-xs text-slate-500">Internal notes per customer visible only to staff. Tagged by category classification.</p>
        <button class="btn btn-sm btn-primary" onclick="alert('Creating new staff note...')">Add Staff Note</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl p-5 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded uppercase">Payment Issue</span>
            <span class="text-[9px] text-slate-400 font-mono">2026-07-06 14:22</span>
          </div>
          <h4 class="font-bold text-xs text-slate-900 dark:text-white">Chukwu Raphael (Lekki Heights Plot 101)</h4>
          <p class="text-xs text-slate-500">Waiting for verified bank deposit receipt scan to confirm outright contract milestone clearance.</p>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl p-5 shadow-sm space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold bg-green-500/10 text-green-600 px-2 py-0.5 rounded uppercase">General Info</span>
            <span class="text-[9px] text-slate-400 font-mono">2026-07-05 09:12</span>
          </div>
          <h4 class="font-bold text-xs text-slate-900 dark:text-white">Jane Doe (Magnolia Diplomat Mansion)</h4>
          <p class="text-xs text-slate-500">Requested a site manager assignment update prior to coordinates inspections tour scheduled next Tuesday.</p>
        </div>
      </div>
    </div>
  `;
}

// 8. Sales Catalog
function renderSalesCatalogTab(state) {
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <p class="text-xs text-slate-500">Sales catalogs records matching outright and installment purchase contracts.</p>
        <button class="btn btn-sm btn-primary" onclick="alert('Creating manual contract sale...')">Record Sale</button>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Customer Details</th>
                <th class="p-4">Property Plot</th>
                <th class="p-4">Referral Affiliate</th>
                <th class="p-4">Contract Plan</th>
                <th class="p-4">Paid status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                <td class="p-4 font-bold text-slate-900 dark:text-white">Chukwu Raphael</td>
                <td class="p-4 text-slate-450 font-medium">Lekki Heights Plot 101</td>
                <td class="p-4 text-slate-455">Obinna Diala (Gen 1)</td>
                <td class="p-4 font-bold text-[10px] uppercase text-[#1d4ed8]">Outright</td>
                <td class="p-4"><span class="px-2 py-0.5 bg-green-500/10 text-green-600 rounded text-[9px] font-black uppercase">Confirmed</span></td>
              </tr>
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                <td class="p-4 font-bold text-slate-900 dark:text-white">Amina Yusuf</td>
                <td class="p-4 text-slate-455 font-medium">Serene Serviced Plot</td>
                <td class="p-4 text-slate-455">None</td>
                <td class="p-4 font-bold text-[10px] uppercase text-[#1d4ed8]">Installments</td>
                <td class="p-4"><span class="px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded text-[9px] font-black uppercase">Pending Downpay</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 9. Installment Plans Setup
function renderInstallmentPlansTab(state) {
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl p-5 shadow-sm max-w-xl space-y-4">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-white">Default Installment Rates Rules</h4>
        
        <form class="space-y-4" onsubmit="event.preventDefault(); alert('Installment parameters updated successfully.');">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Required Downpayment (%)</label>
              <input type="number" value="20" class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
            </div>
            
            <div class="space-y-1.5">
              <label class="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Max Installment Period (Months)</label>
              <input type="number" value="24" class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Late Payment Grace period (Days)</label>
            <input type="number" value="14" class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
          </div>

          <button type="submit" class="btn btn-sm btn-primary py-2 px-5 active:scale-98">
            Save Defaults
          </button>
        </form>
      </div>
    </div>
  `;
}

// 10. Confirmed Payments
function renderConfirmedPaymentsTab(state) {
  return `
    <div class="space-y-6 animate-fade-in">
      <p class="text-xs text-slate-500">Record bank offline transfers, confirm uploaded receipts, and balance ledgers.</p>
      
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Contract File</th>
                <th class="p-4">Paid amount</th>
                <th class="p-4">Payment Method</th>
                <th class="p-4">Transaction Ref</th>
                <th class="p-4">Confirm Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                <td class="p-4 font-bold">Chukwu Raphael (Lekki Heights)</td>
                <td class="p-4 font-semibold text-slate-900 dark:text-white">₦30,000,000</td>
                <td class="p-4">Bank Transfer Proof</td>
                <td class="p-4 font-mono text-[10px]">TXN-98447522</td>
                <td class="p-4 text-slate-455">2026-07-06</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 11. Invoices List
function renderInvoicesListTab(state) {
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Invoice ID</th>
                <th class="p-4">Customer</th>
                <th class="p-4">Total Price</th>
                <th class="p-4">Outstanding Balance</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                <td class="p-4 font-mono font-bold text-[#1d4ed8]">INV-2026-001</td>
                <td class="p-4 font-bold text-slate-900 dark:text-white">Chukwu Raphael</td>
                <td class="p-4">₦150,000,000</td>
                <td class="p-4 font-semibold text-slate-450">₦0</td>
                <td class="p-4 text-right">
                  <button class="text-[#1d4ed8] hover:text-[#1e3a8a] font-bold" onclick="alert('Downloading invoice PDF...')">Download PDF</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 12. Partner Directory
function renderPartnerDirectoryTab(state) {
  const partners = state.admin.referralsList;
  
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Partner details</th>
                <th class="p-4">Tracking Code</th>
                <th class="p-4">Tracking Clicks</th>
                <th class="p-4">Sales Closed</th>
                <th class="p-4">Override Earnings</th>
                <th class="p-4">KYC Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              ${partners.map(r => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                  <td class="p-4">
                    <span class="block font-bold text-slate-900 dark:text-white">${r.name}</span>
                    <span class="block text-[10px] text-slate-455">${r.email}</span>
                  </td>
                  <td class="p-4"><code class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono text-[10px]">${r.code}</code></td>
                  <td class="p-4 text-slate-500 font-medium">${r.clicks}</td>
                  <td class="p-4 font-bold text-slate-900 dark:text-white">${r.sales}</td>
                  <td class="p-4 font-semibold text-green-500">₦${r.earned.toLocaleString()}</td>
                  <td class="p-4">
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      r.status === 'Approved' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }">${r.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 13. Commission Overrides
function renderCommissionOverridesTab(state) {
  return `
    <div class="space-y-6 animate-fade-in">
      <p class="text-xs text-slate-455">Track overrides payouts matching the two-tiered model (10% Tier 1, 5% Tier 2 override rules).</p>
      
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Primary Affiliate</th>
                <th class="p-4">Secondary Invitee</th>
                <th class="p-4">Closed Deal Value</th>
                <th class="p-4">Calculated Override (5%)</th>
                <th class="p-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                <td class="p-4 font-bold text-slate-900 dark:text-white">Obinna Diala</td>
                <td class="p-4 font-medium text-slate-655">Kelechi Nnamdi</td>
                <td class="p-4">₦150,000,000</td>
                <td class="p-4 font-bold text-green-500">₦7,500,000</td>
                <td class="p-4">
                  <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-green-500/10 text-green-600 dark:text-green-400 uppercase tracking-wider">Cleared</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 14. Payout Records
function renderPayoutRecordsTab(state) {
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Partner Name</th>
                <th class="p-4">Commission Type</th>
                <th class="p-4">Requested amount</th>
                <th class="p-4">Bank targets details</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                <td class="p-4 font-bold text-slate-900 dark:text-white">Obinna Diala</td>
                <td class="p-4 text-slate-500">Direct Sales (10%)</td>
                <td class="p-4 font-semibold text-slate-800 dark:text-slate-200">₦15,000,000</td>
                <td class="p-4 text-[10px] text-slate-455">Zenith Bank PLC / 1022345678</td>
                <td class="p-4">
                  <span id="payout-status-1" class="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending Release</span>
                </td>
                <td class="p-4 text-right">
                  <button id="release-payout-btn-1" class="btn btn-sm py-1 px-3 bg-green-500/10 hover:bg-green-500 text-green-600 hover:text-white font-bold rounded text-[10px] active:scale-98 transition-all">Release Payout</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 14.1 Affiliate Hierarchy Tree
function renderAffiliateTreeTab(state) {
  return `
    <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl p-6 shadow-sm animate-fade-in space-y-4">
      <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Visual Affiliate Network Map</h4>
      <p class="text-xs text-slate-500">Two-tiered structural tree maps of uplines & downline recruits.</p>
      
      <div class="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/20 rounded-lg space-y-2 max-w-lg font-sans text-xs">
        <div class="flex items-center gap-1 font-bold text-[#1d4ed8]">
          <i class="bx bx-user-voice"></i> Obinna Diala (Upline Recruiter - Tier 1)
        </div>
        <div class="pl-8 border-l border-slate-300 dark:border-slate-800 space-y-2">
          <div class="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-350">
            <i class="bx bx-git-commit"></i> Kelechi Nnamdi (Recruited Downline - Tier 2)
          </div>
          <div class="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-350">
            <i class="bx bx-git-commit"></i> Amina Bello (Recruited Downline - Tier 2)
          </div>
        </div>
      </div>
    </div>
  `;
}

// 15. Tour Bookings
function renderTourBookingsTab(state) {
  const tours = state.admin.inspectionsList;
  
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Client Coordinator</th>
                <th class="p-4">Property Location</th>
                <th class="p-4">Preferred Date</th>
                <th class="p-4">Tour Modality</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              ${tours.map(t => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                  <td class="p-4">
                    <span class="block font-bold text-slate-900 dark:text-white">${t.name}</span>
                    <span class="block text-[10px] text-slate-455">${t.phone}</span>
                  </td>
                  <td class="p-4 font-semibold text-slate-800 dark:text-slate-300">${t.propertyTitle}</td>
                  <td class="p-4 text-slate-450">${t.date}</td>
                  <td class="p-4 font-medium">${t.type}</td>
                  <td class="p-4">
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      t.status === 'Confirmed' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                      t.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-red-500/10 text-red-650'
                    }">${t.status}</span>
                  </td>
                  <td class="p-4 text-right space-x-2">
                    ${t.status === 'Pending' ? `
                      <button data-confirm-tour="${t.id}" class="text-green-500 hover:text-green-600 font-bold">Confirm</button>
                      <button data-reschedule-tour="${t.id}" class="text-[#1d4ed8] hover:text-[#1e3a8a] font-bold">Reschedule</button>
                    ` : `
                      <span class="text-[10px] text-slate-400 italic">No Action Needed</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 15.1 Inspections Calendar
function renderInspectionCalendarTab(state) {
  return `
    <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl p-6 shadow-sm animate-fade-in space-y-4">
      <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Inspections calendar view</h4>
      
      <!-- Mock Calendar Grid -->
      <div class="grid grid-cols-7 gap-2 max-w-md text-center text-xs font-medium border-t border-slate-100 dark:border-slate-850 pt-4">
        <span class="text-slate-400">Su</span><span class="text-slate-400">Mo</span><span class="text-slate-400">Tu</span><span class="text-slate-400">We</span><span class="text-slate-400">Th</span><span class="text-slate-400">Fr</span><span class="text-slate-400">Sa</span>
        
        ${Array.from({ length: 31 }, (_, i) => i + 1).map(day => `
          <div class="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/40 relative hover:bg-slate-100/50 cursor-pointer">
            <span>${day}</span>
            ${day === 12 ? '<span class="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-amber-500" title="Pending Tour Scheduled"></span>' : ''}
            ${day === 18 ? '<span class="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-green-500" title="Confirmed site Inspection"></span>' : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 15.2 Sales Summary Reports
function renderSalesSummaryReportTab(state) {
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <p class="text-xs text-slate-500">Sales volume report indexes filterable by property structures.</p>
        <button class="btn btn-sm btn-primary" onclick="alert('Exporting Sales Report PDF...')">Export Report PDF</button>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl p-6 shadow-sm max-w-lg space-y-4">
        <h4 class="font-bold text-xs uppercase tracking-wider">Historical Sales Revenue (2026)</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-semibold"><span>Lekki Heights Residencies</span> <span>₦450,000,000</span></div>
            <div class="w-full h-2 bg-slate-100 rounded-full"><div class="h-full bg-[#1d4ed8] rounded-full" style="width: 75%"></div></div>
          </div>
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-semibold"><span>Abuja Diplomatic Estates</span> <span>₦200,000,000</span></div>
            <div class="w-full h-2 bg-slate-100 rounded-full"><div class="h-full bg-[#1d4ed8] rounded-full" style="width: 45%"></div></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 15.3 Commission Report Tab
function renderCommissionReportTab(state) {
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <p class="text-xs text-slate-500">Commissions summaries earned vs payouts cleared in current log intervals.</p>
        <button class="btn btn-sm btn-primary" onclick="alert('Exporting Commission Report CSV...')">Export CSV</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 space-y-1">
          <span class="text-[9px] font-bold text-slate-450 uppercase block">Total Commission Paid</span>
          <p class="text-lg font-extrabold text-green-500">₦85,000,000</p>
        </div>
        <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 space-y-1">
          <span class="text-[9px] font-bold text-slate-455 uppercase block">Total Commission Pending</span>
          <p class="text-lg font-extrabold text-amber-500">₦15,000,000</p>
        </div>
      </div>
    </div>
  `;
}

// 15.4 Performance Analytics Tab
function renderPerformanceAnalyticsTab(state) {
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl p-5 shadow-sm max-w-lg space-y-4">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Top-Performing Affiliates (Sales Value)</h4>
        
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs py-1 border-b border-slate-100">
            <span class="font-bold text-slate-800">1. Obinna Diala</span>
            <span class="font-semibold text-emerald-500">₦150,000,000</span>
          </div>
          <div class="flex items-center justify-between text-xs py-1 border-b border-slate-100">
            <span class="font-bold text-slate-800">2. Kelechi Nnamdi</span>
            <span class="font-semibold text-emerald-500">₦75,000,000</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 15.5 Payment Ledger (Escrow)
function renderPaymentLedgerTab(state) {
  const orders = state.admin.ordersLedger;
  
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Client Name</th>
                <th class="p-4">Property</th>
                <th class="p-4">Total Contract Value</th>
                <th class="p-4">Payment Option</th>
                <th class="p-4">Downpayment Clear</th>
                <th class="p-4">Milestone Escrow Status</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              ${orders.map(o => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                  <td class="p-4">
                    <span class="block font-bold text-slate-900 dark:text-white">${o.clientName}</span>
                    <span class="block text-[10px] text-slate-455">${o.email}</span>
                  </td>
                  <td class="p-4 font-semibold text-slate-800 dark:text-slate-300">${o.propertyTitle}</td>
                  <td class="p-4 font-mono font-medium">${o.formattedPrice}</td>
                  <td class="p-4 font-bold text-[10px] uppercase text-[#1d4ed8]">${o.plan}</td>
                  <td class="p-4 font-mono">₦${o.paidAmount.toLocaleString()}</td>
                  <td class="p-4">
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      o.status === 'Active Installments' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }">${o.status}</span>
                  </td>
                  <td class="p-4 text-right">
                    ${o.status === 'Pending Downpayment' ? `
                      <button data-clear-downpayment="${o.id}" class="btn btn-sm py-1 px-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white font-bold rounded text-[10px] active:scale-98">Clear Downpayment</button>
                    ` : `
                      <span class="text-[10px] text-slate-400 italic">Escrow Ledger Perfect</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 16. Staff Accounts
function renderStaffAccountsTab(state) {
  const staff = [
    { name: 'Amina Bello', email: 'amina@blueskye.com', role: 'Administrator', status: 'Active' },
    { name: 'Aliyu Bello', email: 'aliyu@blueskye.com', role: 'Site Inspector Manager', status: 'Active' },
    { name: 'Chidi Okafor', email: 'chidi@blueskye.com', role: 'Blog Editor', status: 'Active' }
  ];

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Employee Name</th>
                <th class="p-4">Email Coordinates</th>
                <th class="p-4">Assigned Role</th>
                <th class="p-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              ${staff.map(s => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                  <td class="p-4 font-bold text-slate-900 dark:text-white">${s.name}</td>
                  <td class="p-4 text-slate-455">${s.email}</td>
                  <td class="p-4 font-semibold text-[#1d4ed8] dark:text-[#60a5fa]">${s.role}</td>
                  <td class="p-4">
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-green-500/10 text-green-600 dark:text-green-400 uppercase tracking-wider">${s.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 17. Access Permissions
function renderAccessPermissionsTab(state) {
  return `
    <div class="space-y-6 animate-fade-in">
      <p class="text-xs text-slate-455">Granular matrix matching internal roles to feature screens. Enable checkbox matrix coordinates to adapt consoles.</p>
      
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Feature Target</th>
                <th class="p-4">Administrator</th>
                <th class="p-4">Site Inspector</th>
                <th class="p-4">Blog Editor</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                <td class="p-4 font-bold">Manage Properties Catalog</td>
                <td class="p-4"><input type="checkbox" checked disabled class="accent-[#1d4ed8]" /></td>
                <td class="p-4"><input type="checkbox" checked class="accent-[#1d4ed8]" /></td>
                <td class="p-4"><input type="checkbox" class="accent-[#1d4ed8]" /></td>
              </tr>
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                <td class="p-4 font-bold">Approve KYC compliance docs</td>
                <td class="p-4"><input type="checkbox" checked disabled class="accent-[#1d4ed8]" /></td>
                <td class="p-4"><input type="checkbox" class="accent-[#1d4ed8]" /></td>
                <td class="p-4"><input type="checkbox" class="accent-[#1d4ed8]" /></td>
              </tr>
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                <td class="p-4 font-bold">Payout Referral Commissions</td>
                <td class="p-4"><input type="checkbox" checked disabled class="accent-[#1d4ed8]" /></td>
                <td class="p-4"><input type="checkbox" class="accent-[#1d4ed8]" /></td>
                <td class="p-4"><input type="checkbox" class="accent-[#1d4ed8]" /></td>
              </tr>
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                <td class="p-4 font-bold">Write & Publish Articles</td>
                <td class="p-4"><input type="checkbox" checked disabled class="accent-[#1d4ed8]" /></td>
                <td class="p-4"><input type="checkbox" class="accent-[#1d4ed8]" /></td>
                <td class="p-4"><input type="checkbox" checked class="accent-[#1d4ed8]" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="flex justify-end">
        <button id="save-permissions-btn" class="btn btn-sm btn-primary active:scale-98">Save Access Grid</button>
      </div>
    </div>
  `;
}

// 18. Write Articles
function renderWriteArticlesTab(state) {
  return `
    <div class="space-y-6 animate-fade-in">
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Left Editor Composer -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl p-5 shadow-sm space-y-4">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Article Editor Composer</h4>
          
          <div class="space-y-3">
            <div class="space-y-1">
              <label class="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Article Title</label>
              <input type="text" id="blog-editor-title" placeholder="e.g. Navigating Real Estate Investments" class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
            </div>
            
            <div class="space-y-1">
              <label class="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Excerpt Synopsis</label>
              <input type="text" id="blog-editor-excerpt" placeholder="A brief hook summary for feed displays..." class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
            </div>
            
            <div class="space-y-1">
              <label class="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Author Name</label>
              <input type="text" id="blog-editor-author" placeholder="Amina Bello" class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
            </div>

            <!-- Block composer canvas -->
            <div class="space-y-2 border-t border-slate-100 dark:border-slate-850 pt-3">
              <div class="flex items-center justify-between">
                <span class="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Article Blocks Canvas</span>
                <div class="flex gap-1.5">
                  <button id="add-heading-block-btn" class="text-[9px] font-extrabold uppercase bg-slate-100 dark:bg-slate-850 px-2 py-1 rounded text-slate-655 hover:bg-slate-200">H2</button>
                  <button id="add-text-block-btn" class="text-[9px] font-extrabold uppercase bg-slate-100 dark:bg-slate-850 px-2 py-1 rounded text-slate-655 hover:bg-slate-200">Text</button>
                </div>
              </div>
              <div id="blog-canvas-area" class="space-y-2 max-h-48 overflow-y-auto pr-1">
                <textarea id="blog-content-main" placeholder="Write main article paragraphs here..." class="form-input text-xs h-32 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white"></textarea>
              </div>
            </div>
          </div>

          <button id="publish-article-btn" class="btn btn-sm btn-primary w-full justify-center py-2 shadow active:scale-98">
            Publish Live Article
          </button>
        </div>

        <!-- Right Side Live Preview Panel -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl p-6 shadow-sm space-y-4 max-h-[500px] overflow-y-auto">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">High-Fidelity Preview</h4>
            <span class="text-[9px] uppercase tracking-wider font-extrabold text-green-500 flex items-center gap-1">
              <span class="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span> Live Rendering
            </span>
          </div>

          <!-- Preview Content Mockup -->
          <article class="space-y-4">
            <span class="text-[9px] uppercase font-bold text-slate-400">Published in the Blueskye Journal</span>
            <h1 id="preview-title" class="font-display font-extrabold text-xl text-slate-950 dark:text-white leading-tight">Article Title Preview</h1>
            
            <div class="flex items-center gap-2 text-[10px] text-slate-455 font-medium">
              <div class="h-6 w-6 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center font-bold">A</div>
              <div>
                <span class="block font-bold text-slate-900 dark:text-white" id="preview-author">Author Name</span>
                <span class="block text-[8px] text-slate-400">July 2026 • 5 min read</span>
              </div>
            </div>
            
            <p id="preview-excerpt" class="text-xs font-medium text-slate-500 italic pl-3 border-l-2 border-[#1d4ed8]">Synopsis teaser excerpt goes here...</p>
            
            <div id="preview-body" class="text-xs font-light text-slate-655 dark:text-slate-400 leading-relaxed space-y-3">
              Write content on the left pane editor to preview structural layout details instantly.
            </div>
          </article>
        </div>

      </div>

    </div>
  `;
}

// 19. News Subscribers
function renderNewsSubscribersTab() {
  const subs = [
    { email: 'chukwu@domain.com', date: '2026-07-06' },
    { email: 'jane@domain.com', date: '2026-07-05' },
    { email: 'amina@domain.com', date: '2026-07-04' }
  ];

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Subscribed Email Address</th>
                <th class="p-4">Date Joined</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              ${subs.map(s => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 font-mono font-semibold text-slate-800 dark:text-slate-200">
                  <td class="p-4">${s.email}</td>
                  <td class="p-4 text-slate-450">${s.date}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 20. Contact Inquiries
function renderContactMessagesTab(state) {
  const msgs = state.admin.contactMessages;
  
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">From</th>
                <th class="p-4">Message Context</th>
                <th class="p-4">Date Logged</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              ${msgs.map(m => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                  <td class="p-4">
                    <span class="block font-bold text-slate-900 dark:text-white">${m.name}</span>
                    <span class="block text-[10px] text-slate-455">${m.email}</span>
                  </td>
                  <td class="p-4 text-slate-655 max-w-sm">${m.message}</td>
                  <td class="p-4 text-slate-450">${m.date}</td>
                  <td class="p-4 text-right">
                    <button data-archive-msg="${m.id}" class="text-slate-400 hover:text-slate-600 font-bold">Archive</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 21. Platform Profile Settings
function renderPlatformProfileTab(state) {
  const profile = state.admin.settings;
  
  return `
    <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl p-6 shadow-sm space-y-6 animate-fade-in max-w-xl">
      <h4 class="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-white">Platform Contact coordinates</h4>
      
      <form id="settings-profile-form" class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Company Name</label>
          <input type="text" id="set-company-name" value="${profile.companyName}" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
        </div>
        
        <div class="space-y-1.5">
          <label class="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Office Address</label>
          <input type="text" id="set-company-address" value="${profile.companyAddress}" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Support Phone</label>
            <input type="text" id="set-company-phone" value="${profile.companyPhone}" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
          </div>
          
          <div class="space-y-1.5">
            <label class="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Official Email</label>
            <input type="email" id="set-company-email" value="${profile.companyEmail}" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
          </div>
        </div>

        <button type="submit" class="btn btn-sm btn-primary py-2 px-5 active:scale-98">
          Save Profile Details
        </button>
      </form>
    </div>
  `;
}

// 22. Escrow Bank Setup
function renderEscrowBankSetupTab(state) {
  const bank = state.admin.settings;
  
  return `
    <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl p-6 shadow-sm space-y-6 animate-fade-in max-w-xl">
      <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Escrow Payment Bank Accounts</h4>
      
      <form id="settings-bank-form" class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Bank Name</label>
          <input type="text" id="set-bank-name" value="${bank.escrowBankName}" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
        </div>
        
        <div class="space-y-1.5">
          <label class="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Account Holder Name</label>
          <input type="text" id="set-bank-holder" value="${bank.escrowAccountName}" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Account Number</label>
            <input type="text" id="set-bank-number" value="${bank.escrowAccountNumber}" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
          </div>
          
          <div class="space-y-1.5">
            <label class="text-[9px] font-bold text-slate-455 uppercase tracking-wider">SWIFT Coordinate</label>
            <input type="text" id="set-bank-swift" value="${bank.escrowSwiftCode}" required class="form-input text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white" />
          </div>
        </div>

        <button type="submit" class="btn btn-sm btn-primary py-2 px-5 active:scale-98">
          Save Bank Setup
        </button>
      </form>
    </div>
  `;
}

// 23. System Audit Logs
function renderSystemAuditLogsTab(state) {
  const logs = state.admin.auditLogs;
  
  return `
    <div class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200/20 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/20 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th class="p-4">Timestamp Log</th>
                <th class="p-4">Employee Staff</th>
                <th class="p-4">Security Action</th>
                <th class="p-4">System Component</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-850">
              ${logs.map(l => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 font-mono text-[10px]">
                  <td class="p-4 text-slate-450">${l.time}</td>
                  <td class="p-4 font-bold text-slate-900 dark:text-white">${l.staff}</td>
                  <td class="p-4 text-slate-655">${l.action}</td>
                  <td class="p-4"><span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">${l.component}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// --- Tab Interactive Actions Listeners Binder ---
export function bindAdminTabListeners(tabName, state, properties, projects, blogs, renderApp, initAdminTab) {
  const root = document.querySelector('#admin-viewport');
  if (!root) return;

  // Global audit logger
  function addAuditLog(action, component) {
    const log = {
      id: state.admin.auditLogs.length + 1,
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      staff: state.admin.staffName,
      action: action,
      component: component
    };
    state.admin.auditLogs.unshift(log);
  }

  // 1. Overview Tab Charts Initialization
  if (tabName === 'overview') {
    setTimeout(() => {
      const salesCtx = document.getElementById('salesOverviewChart');
      const locCtx = document.getElementById('locationDistributionChart');

      if (salesCtx && window.Chart) {
        new window.Chart(salesCtx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [
              {
                label: 'Sales Revenue (₦ Millions)',
                data: [150, 320, 480, 710, 850, 1100, 1450],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
              },
              {
                label: 'Commissions Paid (₦ Millions)',
                data: [15, 32, 48, 71, 85, 110, 145],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 5
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: 'index',
              intersect: false
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  boxWidth: 12,
                  font: { size: 10, weight: '600', family: 'Inter' }
                }
              },
              tooltip: {
                backgroundColor: '#0f172a',
                titleFont: { size: 11, family: 'Inter', weight: 'bold' },
                bodyFont: { size: 11, family: 'Inter' },
                padding: 10,
                cornerRadius: 4,
                callbacks: {
                  label: function(context) {
                    return ` ${context.dataset.label.split(' ')[0]}: ₦${context.raw.toLocaleString()}M`;
                  }
                }
              }
            },
            scales: {
              y: {
                grid: { color: 'rgba(156, 163, 175, 0.08)' },
                ticks: {
                  font: { size: 9, family: 'Inter' },
                  callback: function(value) {
                    return '₦' + value + 'M';
                  }
                }
              },
              x: {
                grid: { display: false },
                ticks: { font: { size: 9, family: 'Inter' } }
              }
            }
          }
        });
      }

      if (locCtx && window.Chart) {
        new window.Chart(locCtx, {
          type: 'pie',
          data: {
            labels: ['Affiliates (75%)', 'Direct Search (20%)', 'Social Media (5%)'],
            datasets: [{
              data: [750, 200, 50],
              backgroundColor: ['#1e3a8a', '#10b981', '#f59e0b'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  boxWidth: 10,
                  font: { size: 9, weight: '600', family: 'Inter' },
                  padding: 15
                }
              },
              tooltip: {
                backgroundColor: '#0f172a',
                padding: 10,
                cornerRadius: 4,
                callbacks: {
                  label: function(context) {
                    const val = context.raw;
                    return ` Contribution: ₦${val.toLocaleString()}M`;
                  }
                }
              }
            }
          }
        });
      }
    }, 50);
  }

  // Properties Catalog Search & Edit/Delete
  if (tabName === 'properties-list') {
    const searchInput = document.querySelector('#admin-search-properties');
    const statusFilter = document.querySelector('#filter-property-status');
    const publishFilter = document.querySelector('#filter-property-publish');
    const sortFilter = document.querySelector('#sort-property');

    function filterPropertiesTable() {
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const statusVal = statusFilter ? statusFilter.value : 'all';
      const publishVal = publishFilter ? publishFilter.value : 'all';
      const sortVal = sortFilter ? sortFilter.value : 'default';
      const tbody = document.querySelector('#admin-properties-table-body');
      if (!tbody) return;

      let filtered = properties.filter(p => {
        const matchesQuery = p.title.toLowerCase().includes(query) || p.city.toLowerCase().includes(query);
        const matchesStatus = statusVal === 'all' || p.status === statusVal;
        
        const isPublished = p.published === undefined ? true : p.published;
        const matchesPublish = publishVal === 'all' || isPublished.toString() === publishVal;
        
        return matchesQuery && matchesStatus && matchesPublish;
      });

      // Sort operations
      if (sortVal === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortVal === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortVal === 'title-asc') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }

      tbody.innerHTML = filtered.map(p => {
        const isPublished = p.published === undefined ? true : p.published;
        return `
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
            <td class="p-4">
              <img src="${p.images[0]}" class="h-10 w-16 object-cover rounded-md border border-slate-100 dark:border-slate-800" />
            </td>
            <td class="p-4 font-bold text-slate-900 dark:text-white">${p.title}</td>
            <td class="p-4 text-slate-455">${p.city}</td>
            <td class="p-4 font-semibold text-slate-800 dark:text-slate-300">${p.formattedPrice}</td>
            <td class="p-4">
              <span class="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                p.status === 'For Sale' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
              }">${p.status}</span>
            </td>
            <td class="p-4">
              <select data-publish-id="${p.id}" class="form-input py-1 px-2 text-[10px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded">
                <option value="true" ${isPublished ? 'selected' : ''}>Published</option>
                <option value="false" ${!isPublished ? 'selected' : ''}>Unpublished</option>
              </select>
            </td>
            <td class="p-4 text-right space-x-2.5">
              <button data-view-prop-id="${p.id}" class="text-[#1d4ed8] hover:underline font-bold text-xs" title="View Property details">View</button>
              <button data-edit-id="${p.id}" class="text-blue-500 hover:text-blue-750 p-1" title="Edit"><i class="bx bx-edit text-base"></i></button>
              <button data-delete-id="${p.id}" class="text-red-500 hover:text-red-750 p-1" title="Delete"><i class="bx bx-trash text-base"></i></button>
            </td>
          </tr>
        `;
      }).join('');
    }

    if (searchInput) searchInput.addEventListener('input', filterPropertiesTable);
    if (statusFilter) statusFilter.addEventListener('change', filterPropertiesTable);
    if (publishFilter) publishFilter.addEventListener('change', filterPropertiesTable);
    if (sortFilter) sortFilter.addEventListener('change', filterPropertiesTable);

    // Watch for inline publish select changes
    root.addEventListener('change', (e) => {
      const publishSelect = e.target.closest('[data-publish-id]');
      if (publishSelect) {
        const id = parseInt(publishSelect.getAttribute('data-publish-id'));
        const prop = properties.find(p => p.id === id);
        if (prop) {
          prop.published = (publishSelect.value === 'true');
          addAuditLog(`${prop.published ? 'Published' : 'Unpublished'} property catalog listing "${prop.title}"`, 'Manage Properties');
          alert(`Property "${prop.title}" catalog listing status updated to ${prop.published ? 'Published' : 'Unpublished'}.`);
          initAdminTab('properties-list');
        }
      }
    });

    root.addEventListener('click', (e) => {
      const viewPropBtn = e.target.closest('[data-view-prop-id]');
      if (viewPropBtn) {
        e.preventDefault();
        const id = parseInt(viewPropBtn.getAttribute('data-view-prop-id'));
        const prop = properties.find(p => p.id === id);
        if (prop) {
          alert(`--- PROPERTY SPEC SHEET ---\n\nTitle: ${prop.title}\nCity Location: ${prop.city}\nPrice Coordinates: ${prop.formattedPrice}\nStatus Indicator: ${prop.status}\nPublish status: ${prop.published === undefined || prop.published ? 'Published' : 'Unpublished'}\nLayout size: ${prop.size || 450} Sqm\nStructure specs: ${prop.beds || 4} Bedrooms, ${prop.baths || 4} Bathrooms\nYear constructed: ${prop.year || 2026}`);
        }
      }

      const delBtn = e.target.closest('[data-delete-id]');
      if (delBtn) {
        const id = parseInt(delBtn.getAttribute('data-delete-id'));
        const idx = properties.findIndex(p => p.id === id);
        if (idx !== -1) {
          const title = properties[idx].title;
          if (confirm(`Are you sure you want to delete "${title}"?`)) {
            properties.splice(idx, 1);
            addAuditLog(`Deleted property "${title}"`, 'Manage Properties');
            alert("Property deleted successfully.");
            initAdminTab('properties-list');
          }
        }
      }

      const addBtn = e.target.closest('#add-property-modal-btn');
      if (addBtn) {
        e.preventDefault();
        state.admin.editingPropertyId = null;
        initAdminTab('properties-add');
      }

      const editBtn = e.target.closest('[data-edit-id]');
      if (editBtn) {
        e.preventDefault();
        const id = parseInt(editBtn.getAttribute('data-edit-id'));
        state.admin.editingPropertyId = id;
        initAdminTab('properties-add');
      }
    });
  }

  // 2.0 Add/Edit Property Form Submit, Cancel, Multi-media Uploads, and Dynamic Preview
  if (tabName === 'properties-add') {
    let uploadedPhotos = [];
    
    // Load pre-existing photos if editing
    const idValForPreload = document.querySelector('#full-prop-id') ? document.querySelector('#full-prop-id').value : '';
    if (idValForPreload) {
      const existingProp = properties.find(p => p.id === parseInt(idValForPreload));
      if (existingProp && existingProp.images) {
        uploadedPhotos = [...existingProp.images];
      }
    } else {
      // Default placeholder image
      uploadedPhotos = ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'];
    }

    const form = document.querySelector('#property-full-form');
    
    // Function to calculate and render the side live preview card in real-time
    function updateLivePreview() {
      const title = document.querySelector('#full-prop-title') ? document.querySelector('#full-prop-title').value.trim() : '';
      const city = document.querySelector('#full-prop-city') ? document.querySelector('#full-prop-city').value.trim() : '';
      const project = document.querySelector('#full-prop-project') ? document.querySelector('#full-prop-project').value : 'None';
      const priceVal = document.querySelector('#full-prop-price') ? parseFloat(document.querySelector('#full-prop-price').value) : 0;
      const status = document.querySelector('#full-prop-status') ? document.querySelector('#full-prop-status').value : 'For Sale';
      const sizeVal = document.querySelector('#full-prop-size') ? document.querySelector('#full-prop-size').value.trim() : '';
      
      // Update image
      const prevImg = document.querySelector('#prev-card-img');
      if (prevImg) {
        prevImg.src = uploadedPhotos.length > 0 ? uploadedPhotos[0] : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
      }
      
      // Update badge
      const prevStatus = document.querySelector('#prev-card-status');
      if (prevStatus) {
        prevStatus.innerText = status;
        if (status === 'Sold') {
          prevStatus.className = 'absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500 text-white';
        } else {
          prevStatus.className = 'absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-green-500 text-white';
        }
      }
      
      // Update project
      const prevProj = document.querySelector('#prev-card-project');
      if (prevProj) {
        prevProj.innerText = project === 'None' ? 'Independent Development' : project;
      }
      
      // Update Title & Location
      const prevTitle = document.querySelector('#prev-card-title');
      if (prevTitle) prevTitle.innerText = title || 'New Property Title';
      
      const prevLoc = document.querySelector('#prev-card-location');
      if (prevLoc) prevLoc.innerHTML = `<i class="bx bx-map-pin"></i> ${city || 'Lekki'}, Nigeria`;

      // Update Price
      const prevPrice = document.querySelector('#prev-card-price');
      if (prevPrice) {
        prevPrice.innerText = isNaN(priceVal) || priceVal === 0 ? '₦0' : `₦${priceVal.toLocaleString()}`;
      }

      // Update Amenities list summary
      const prevAmen = document.querySelector('#prev-card-amenities');
      if (prevAmen) {
        const activeFeatures = [];
        document.querySelectorAll('.amenity-checkbox:checked').forEach(cb => {
          activeFeatures.push(cb.getAttribute('data-amenity'));
        });
        if (activeFeatures.length === 0) {
          prevAmen.innerHTML = `<span class="text-xs text-slate-400 italic">None toggled</span>`;
        } else {
          prevAmen.innerHTML = activeFeatures.map(feat => `
            <span class="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[10px] font-semibold text-[#1e3a8a] dark:text-blue-400 border border-blue-150/10 flex items-center gap-1">
              <i class="bx bx-check text-xs"></i>${feat}
            </span>
          `).join('');
        }
      }

      // Update Map embed coordinates preview
      const mapUrl = document.querySelector('#full-prop-map-url') ? document.querySelector('#full-prop-map-url').value.trim() : '';
      const prevMap = document.querySelector('#prev-card-map-status');
      if (prevMap) {
        if (mapUrl) {
          let src = mapUrl;
          if (mapUrl.includes('<iframe')) {
            const match = mapUrl.match(/src="([^"]+)"/);
            if (match && match[1]) src = match[1];
          }
          prevMap.innerHTML = `
            <div class="w-full h-32 rounded overflow-hidden border border-slate-200 dark:border-slate-800 mt-1">
              <iframe src="${src}" class="w-full h-full border-0" allowfullscreen="" loading="lazy"></iframe>
            </div>
          `;
        } else {
          prevMap.innerHTML = `
            <div class="flex items-center gap-1.5 text-xs text-slate-500">
              <i class="bx bx-map-alt text-slate-400"></i>
              <span>No Map Coordinates Attached</span>
            </div>
          `;
        }
      }

      // Update Agent bio selection
      const agentSelect = document.querySelector('#full-prop-agent') ? document.querySelector('#full-prop-agent').value : 'None';
      const prevAgentSection = document.querySelector('#prev-card-agent-section');
      if (prevAgentSection) {
        if (agentSelect === 'None') {
          prevAgentSection.classList.add('hidden');
        } else {
          prevAgentSection.classList.remove('hidden');
          const agentObj = mockAgentsList.find(ag => ag.name === agentSelect);
          if (agentObj) {
            const imgEl = document.querySelector('#prev-card-agent-img');
            const nameEl = document.querySelector('#prev-card-agent-name');
            const roleEl = document.querySelector('#prev-card-agent-role');
            if (imgEl) imgEl.src = agentObj.image;
            if (nameEl) nameEl.innerText = agentObj.name;
            if (roleEl) roleEl.innerText = agentObj.role;
          }
        }
      }

      // Update Payment Plans preview
      const prevPlans = document.querySelector('#prev-card-plans');
      if (prevPlans) {
        const planBadges = [];
        if (document.querySelector('#plan-outright') && document.querySelector('#plan-outright').checked) planBadges.push('Outright');
        if (document.querySelector('#plan-3m') && document.querySelector('#plan-3m').checked) planBadges.push('3-Month');
        if (document.querySelector('#plan-6m') && document.querySelector('#plan-6m').checked) planBadges.push('6-Month');
        if (document.querySelector('#plan-12m') && document.querySelector('#plan-12m').checked) planBadges.push('12-Month');
        
        prevPlans.innerHTML = planBadges.map(pl => `
          <span class="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-850 text-xs font-bold text-slate-700 dark:text-slate-300">${pl}</span>
        `).join('');
      }

      // Update Verification Document preview
      const prevDocs = document.querySelector('#prev-card-docs');
      const docsVal = document.querySelector('#full-prop-docs') ? document.querySelector('#full-prop-docs').value.trim() : '';
      if (prevDocs) {
        prevDocs.innerHTML = docsVal ? `<span class="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1"><i class="bx bx-check-shield text-xs"></i> ${docsVal}</span>` : `<span class="text-slate-400 flex items-center gap-1"><i class="bx bx-paperclip text-xs"></i> None</span>`;
      }

      // Update dynamic custom details preview list (with empty-value tolerance!)
      const prevFeatures = document.querySelector('#prev-card-features');
      if (prevFeatures) {
        let featuresHtml = '';
        if (sizeVal) {
          featuresHtml += `
            <div class="flex items-center gap-1.5 animate-fade-in">
              <i class="bx bx-expand text-slate-400"></i>
              <span>Size: ${sizeVal}</span>
            </div>
          `;
        }
        
        // Loop through dynamic key-value rows
        const rows = document.querySelectorAll('.detail-row');
        rows.forEach(row => {
          const select = row.querySelector('.detail-key-select');
          const customKeyInput = row.querySelector('.detail-custom-key');
          const valInput = row.querySelector('.detail-value');
          if (select) {
            let keyName = select.value;
            if (keyName === 'Custom' && customKeyInput) {
              keyName = customKeyInput.value.trim();
            }
            const valName = valInput ? valInput.value.trim() : '';
            if (keyName) {
              let iconClass = 'bx bx-info-circle';
              if (keyName.toLowerCase().includes('bedroom')) iconClass = 'bx bx-bed';
              if (keyName.toLowerCase().includes('bathroom')) iconClass = 'bx bx-bath';
              if (keyName.toLowerCase().includes('type')) iconClass = 'bx bx-building-house';
              if (keyName.toLowerCase().includes('road')) iconClass = 'bx bx-navigation';
              if (keyName.toLowerCase().includes('pool')) iconClass = 'bx bx-swim';
              if (keyName.toLowerCase().includes('map')) iconClass = 'bx bx-map-alt';
              
              const displayStr = valName ? `${keyName}: ${valName}` : keyName;
              
              featuresHtml += `
                <div class="flex items-center gap-1.5 animate-fade-in">
                  <i class="${iconClass} text-slate-400"></i>
                  <span>${displayStr}</span>
                </div>
              `;
            }
          }
        });
        prevFeatures.innerHTML = featuresHtml || '<div class="text-[9px] text-slate-400 italic">No attributes added</div>';
      }
    }

    // Function to rebuild the available premium amenities list UI dynamically
    function refreshAmenitiesGrid() {
      const checkedSet = new Set();
      document.querySelectorAll('.amenity-checkbox:checked').forEach(cb => {
        checkedSet.add(cb.getAttribute('data-amenity'));
      });
      const grid = document.querySelector('#amenities-checkbox-grid');
      if (grid) {
        grid.innerHTML = state.admin.availableAmenities.map(feature => {
          const isChecked = checkedSet.has(feature);
          return `
            <div class="flex items-center justify-between group/amen bg-white dark:bg-slate-900 px-2 py-1.5 rounded border border-slate-200/40 dark:border-slate-800/40">
              <label class="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:text-[#1e3a8a] dark:hover:text-blue-400 transition-colors flex-1 min-w-0 truncate">
                <input type="checkbox" data-amenity="${feature}" ${isChecked ? 'checked' : ''} class="amenity-checkbox rounded border-slate-300 dark:border-slate-755 text-[#1e3a8a] focus:ring-[#1e3a8a] h-4 w-4" />
                <span class="truncate">${feature}</span>
              </label>
              <button type="button" class="delete-amenity-btn text-red-500 hover:text-red-750 opacity-0 group-hover/amen:opacity-100 transition-opacity p-0.5 ml-1" data-amenity="${feature}" title="Delete amenity option">
                <i class="bx bx-trash text-xs"></i>
              </button>
            </div>
          `;
        }).join('');
      }
      updateLivePreview();
    }

    // Dynamic key-value row management
    root.addEventListener('click', (e) => {
      // Add Custom Amenity Option
      const addAmenityBtn = e.target.closest('#add-amenity-btn');
      if (addAmenityBtn) {
        e.preventDefault();
        const inp = document.querySelector('#new-amenity-input');
        if (inp) {
          const val = inp.value.trim();
          if (val && !state.admin.availableAmenities.includes(val)) {
            state.admin.availableAmenities.push(val);
            inp.value = '';
            refreshAmenitiesGrid();
          }
        }
        return;
      }

      // Delete Custom Amenity Option
      const deleteAmenityBtn = e.target.closest('.delete-amenity-btn');
      if (deleteAmenityBtn) {
        e.preventDefault();
        const val = deleteAmenityBtn.getAttribute('data-amenity');
        if (val) {
          state.admin.availableAmenities = state.admin.availableAmenities.filter(am => am !== val);
          refreshAmenitiesGrid();
        }
        return;
      }

      const cancelBtn = e.target.closest('#cancel-property-btn') || e.target.closest('#cancel-property-form-btn');
      if (cancelBtn) {
        e.preventDefault();
        state.admin.editingPropertyId = null;
        initAdminTab('properties-list');
        return;
      }

      const addRowBtn = e.target.closest('#add-detail-row-btn');
      if (addRowBtn) {
        e.preventDefault();
        const container = document.querySelector('#custom-details-container');
        if (container) {
          const newRow = document.createElement('div');
          newRow.className = 'detail-row grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded border border-slate-100 dark:border-slate-850 animate-fade-in';
          newRow.innerHTML = `
            <div class="sm:col-span-5">
              <select class="detail-key-select form-input py-2 text-sm bg-white dark:bg-slate-900 text-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 rounded">
                <option value="Bedrooms">Bedrooms</option>
                <option value="Bathrooms">Bathrooms</option>
                <option value="Property Type">Property Type</option>
                <option value="Road Access">Road Access</option>
                <option value="Electricity Access">Electricity Access</option>
                <option value="Zoning Regulation">Zoning Regulation</option>
                <option value="Topography">Topography</option>
                <option value="Custom" selected>Custom Detail Key...</option>
              </select>
              <input type="text" class="detail-custom-key form-input py-2 text-sm mt-1 bg-white dark:bg-slate-900" placeholder="Enter Custom Key Name" />
            </div>
            <div class="sm:col-span-5">
              <input type="text" class="detail-value form-input py-2 text-sm bg-white dark:bg-slate-900" placeholder="e.g. 4, Flat, Commercial" value="" />
            </div>
            <div class="sm:col-span-2 text-right">
              <button type="button" class="remove-detail-btn text-red-500 hover:text-red-750 transition-colors p-1" title="Remove Detail">
                <i class="bx bx-trash text-xl"></i>
              </button>
            </div>
          `;
          container.appendChild(newRow);
          updateLivePreview();
        }
        return;
      }

      const removeRowBtn = e.target.closest('.remove-detail-btn');
      if (removeRowBtn) {
        e.preventDefault();
        const row = removeRowBtn.closest('.detail-row');
        if (row) {
          row.remove();
          updateLivePreview();
        }
        return;
      }

      // Photos uploads triggers
      const browsePhotosBtn = e.target.closest('#trigger-photos-upload');
      if (browsePhotosBtn) {
        e.preventDefault();
        const inp = document.querySelector('#prop-photos-input');
        if (inp) inp.click();
        return;
      }

      // Docs uploads triggers
      const browseDocsBtn = e.target.closest('#trigger-docs-upload');
      if (browseDocsBtn) {
        e.preventDefault();
        const inp = document.querySelector('#prop-docs-input');
        if (inp) inp.click();
        return;
      }

      // Remove photo thumbnail
      const removeThumbBtn = e.target.closest('.remove-photo-thumbnail');
      if (removeThumbBtn) {
        e.preventDefault();
        const src = removeThumbBtn.getAttribute('data-src');
        uploadedPhotos = uploadedPhotos.filter(img => img !== src);
        
        // Re-render thumbnail preview list
        const prevContainer = document.querySelector('#photos-preview-container');
        if (prevContainer) {
          prevContainer.innerHTML = uploadedPhotos.map(img => `
            <div class="relative group h-14 w-20 border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
              <img src="${img}" class="h-full w-full object-cover rounded" />
              <button type="button" class="remove-photo-thumbnail absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity duration-150" data-src="${img}"><i class="bx bx-trash text-sm"></i></button>
            </div>
          `).join('');
        }
        // Update input
        const imgInput = document.querySelector('#full-prop-image');
        if (imgInput) imgInput.value = uploadedPhotos.length > 0 ? uploadedPhotos[0] : '';
        updateLivePreview();
        return;
      }

      // Remove attached verification doc
      const removeDocBtn = e.target.closest('.remove-doc-btn');
      if (removeDocBtn) {
        e.preventDefault();
        const docsInput = document.querySelector('#full-prop-docs');
        if (docsInput) docsInput.value = '';
        const prevContainer = document.querySelector('#docs-preview-container');
        if (prevContainer) {
          prevContainer.innerHTML = `<p class="text-xs text-slate-400 italic">No verification records uploaded yet</p>`;
        }
        updateLivePreview();
        return;
      }
    });

    // Custom Key Select Change Listener
    root.addEventListener('change', (e) => {
      const select = e.target.closest('.detail-key-select');
      if (select) {
        const row = select.closest('.detail-row');
        if (row) {
          const customKeyInput = row.querySelector('.detail-custom-key');
          if (customKeyInput) {
            if (select.value === 'Custom') {
              customKeyInput.classList.remove('hidden');
              customKeyInput.value = '';
            } else {
              customKeyInput.classList.add('hidden');
              customKeyInput.value = select.value;
            }
          }
          updateLivePreview();
        }
      }
    });

    // Handle Photos Upload File Input
    const photosInput = document.querySelector('#prop-photos-input');
    if (photosInput) {
      photosInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            const f = files[i];
            const reader = new FileReader();
            reader.onload = (event) => {
              const urlStr = event.target.result;
              uploadedPhotos.push(urlStr);
              
              // Re-render thumbnail previews
              const prevContainer = document.querySelector('#photos-preview-container');
              if (prevContainer) {
                prevContainer.innerHTML = uploadedPhotos.map(img => `
                  <div class="relative group h-14 w-20 border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
                    <img src="${img}" class="h-full w-full object-cover rounded" />
                    <button type="button" class="remove-photo-thumbnail absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity duration-150" data-src="${img}"><i class="bx bx-trash text-sm"></i></button>
                  </div>
                `).join('');
              }
              // Update text input
              const imgInput = document.querySelector('#full-prop-image');
              if (imgInput) imgInput.value = uploadedPhotos[0];
              updateLivePreview();
            };
            reader.readAsDataURL(f);
          }
        }
      });
    }

    // Handle Docs Upload File Input
    const docsInput = document.querySelector('#prop-docs-input');
    if (docsInput) {
      docsInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          const f = files[0]; // read first file
          const docsInputText = document.querySelector('#full-prop-docs');
          if (docsInputText) docsInputText.value = f.name;
          
          const prevContainer = document.querySelector('#docs-preview-container');
          if (prevContainer) {
            prevContainer.innerHTML = `
              <div class="flex items-center justify-between bg-slate-50 dark:bg-slate-955 p-2 rounded border border-slate-100 dark:border-slate-850">
                <span class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300"><i class="bx bx-paperclip text-slate-450"></i>${f.name} (${(f.size/1024).toFixed(1)} KB)</span>
                <button type="button" class="remove-doc-btn text-red-500 hover:text-red-750"><i class="bx bx-x text-base"></i></button>
              </div>
            `;
          }
          updateLivePreview();
        }
      });
    }

    // Bind real-time input change triggers to form
    if (form) {
      form.addEventListener('input', updateLivePreview);
      form.addEventListener('change', updateLivePreview);
      
      // Initialize preview on render
      setTimeout(updateLivePreview, 50);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const idVal = document.querySelector('#full-prop-id').value;
        const title = document.querySelector('#full-prop-title').value.trim();
        const project = document.querySelector('#full-prop-project').value;
        const city = document.querySelector('#full-prop-city').value.trim();
        const size = document.querySelector('#full-prop-size').value.trim();
        const price = parseInt(document.querySelector('#full-prop-price').value);
        const status = document.querySelector('#full-prop-status').value;
        const video = document.querySelector('#full-prop-video').value.trim();
        const image = document.querySelector('#full-prop-image').value.trim();
        const docFile = document.querySelector('#full-prop-docs').value.trim();
        const mapUrlVal = document.querySelector('#full-prop-map-url').value.trim();
        const agentNameVal = document.querySelector('#full-prop-agent').value;

        // Build list of payment plan options based on checkboxes
        const plans = [];
        if (document.querySelector('#plan-outright').checked) plans.push('Outright');
        if (document.querySelector('#plan-3m').checked) plans.push('3-Month');
        if (document.querySelector('#plan-6m').checked) plans.push('6-Month');
        if (document.querySelector('#plan-12m').checked) plans.push('12-Month');

        // Extract premium amenities checkboxes
        const amenities = [];
        document.querySelectorAll('.amenity-checkbox:checked').forEach(cb => {
          amenities.push(cb.getAttribute('data-amenity'));
        });

        // Extract agent object details
        let agentObj = mockAgentsList.find(ag => ag.name === agentNameVal) || null;

        // Extract dynamic custom details key-value pairs
        const customDetails = [];
        let bedsVal = undefined;
        let bathsVal = undefined;
        let yearVal = 2026;

        const rows = document.querySelectorAll('.detail-row');
        rows.forEach(row => {
          const select = row.querySelector('.detail-key-select');
          const customKeyInput = row.querySelector('.detail-custom-key');
          const valInput = row.querySelector('.detail-value');
          if (select) {
            let keyName = select.value;
            if (keyName === 'Custom' && customKeyInput) {
              keyName = customKeyInput.value.trim();
            }
            const valName = valInput ? valInput.value.trim() : '';
            if (keyName) {
              customDetails.push({ key: keyName, value: valName });
              // Backwards compatibility sync for beds/baths/year
              if (keyName.toLowerCase() === 'bedrooms' && valName) bedsVal = parseInt(valName) || undefined;
              if (keyName.toLowerCase() === 'bathrooms' && valName) bathsVal = parseInt(valName) || undefined;
              if (keyName.toLowerCase() === 'year built' && valName) yearVal = parseInt(valName) || 2026;
            }
          }
        });

        if (idVal) {
          // Edit existing property
          const id = parseInt(idVal);
          const prop = properties.find(p => p.id === id);
          if (prop) {
            prop.title = title;
            prop.project = project;
            prop.city = city;
            prop.size = size;
            prop.price = price;
            prop.formattedPrice = `₦${price.toLocaleString()}`;
            prop.status = status;
            prop.beds = bedsVal;
            prop.baths = bathsVal;
            prop.year = yearVal;
            prop.videoUrl = video;
            prop.images = uploadedPhotos.length > 0 ? uploadedPhotos : [image];
            prop.paymentPlans = plans;
            prop.customDetails = customDetails;
            prop.amenities = amenities;
            prop.mapUrl = mapUrlVal;
            prop.agentName = agentNameVal !== 'None' ? agentNameVal : undefined;
            if (agentObj) {
              prop.agentRole = agentObj.role;
              prop.agentPhone = agentObj.phone;
              prop.agentImage = agentObj.image;
              prop.agent = {
                name: agentObj.name,
                role: agentObj.role,
                phone: agentObj.phone,
                image: agentObj.image,
                email: `${agentObj.name.toLowerCase().replace(' ', '.')}@blueskye.com`
              };
            } else {
              prop.agent = undefined;
            }
            if (docFile) prop.documentFileName = docFile;

            addAuditLog(`Updated comprehensive listing details for "${title}"`, 'Manage Properties');
            alert(`Property "${title}" updated successfully.`);
          }
        } else {
          // Add new property listing
          const newProp = {
            id: properties.length ? Math.max(...properties.map(p => p.id)) + 1 : 1,
            title: title,
            project: project,
            city: city,
            size: size,
            price: price,
            formattedPrice: `₦${price.toLocaleString()}`,
            status: status,
            beds: bedsVal,
            baths: bathsVal,
            year: yearVal,
            videoUrl: video,
            images: uploadedPhotos.length > 0 ? uploadedPhotos : [image],
            paymentPlans: plans,
            customDetails: customDetails,
            amenities: amenities,
            mapUrl: mapUrlVal,
            agentName: agentNameVal !== 'None' ? agentNameVal : undefined,
            agentRole: agentObj ? agentObj.role : undefined,
            agentPhone: agentObj ? agentObj.phone : undefined,
            agentImage: agentObj ? agentObj.image : undefined,
            agent: agentObj ? {
              name: agentObj.name,
              role: agentObj.role,
              phone: agentObj.phone,
              image: agentObj.image,
              email: `${agentObj.name.toLowerCase().replace(' ', '.')}@blueskye.com`
            } : undefined,
            documentFileName: docFile || 'land_deed.pdf',
            published: true
          };
          properties.unshift(newProp);
          addAuditLog(`Created comprehensive listing "${title}"`, 'Manage Properties');
          alert(`Property "${title}" listing created successfully.`);
        }

        state.admin.editingPropertyId = null;
        initAdminTab('properties-list');
      });
    }
  }

    // Development Projects Tab Listeners
    if (tabName === 'properties-projects') {
      root.addEventListener('click', (e) => {
        const addBtn = e.target.closest('#add-project-modal-btn');
        if (addBtn) {
          e.preventDefault();
          const modal = document.querySelector('#project-modal');
          if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
          }
        }

        const closeBtn = e.target.closest('#close-project-modal') || (e.target.id === 'project-modal');
        if (closeBtn) {
          const modal = document.querySelector('#project-modal');
          if (modal) {
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
          }
        }
      });

      const form = document.querySelector('#project-modal-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const title = document.querySelector('#project-title').value.trim();
          const location = document.querySelector('#project-location').value.trim();
          const manager = document.querySelector('#project-manager').value.trim();

          if (title && location && manager) {
            const newProject = {
              id: projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1,
              title: title,
              location: location,
              manager: manager,
              phase: 'Planning Phase',
              progress: 0,
              images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80']
            };
            projects.unshift(newProject);
            addAuditLog(`Created development project "${title}"`, 'Development Projects');
            alert(`Project "${title}" created successfully.`);
          
            const modal = document.querySelector('#project-modal');
            if (modal) {
              modal.classList.add('opacity-0');
              setTimeout(() => {
                modal.classList.add('hidden');
                initAdminTab('properties-projects');
              }, 300);
            }
          }
        });
      }
    }

    // Track Construction Sliders
    if (tabName === 'properties-track') {
      root.addEventListener('input', (e) => {
        const slider = e.target.closest('[data-progress-slider]');
        if (slider) {
          const id = parseInt(slider.getAttribute('data-progress-slider'));
          const label = document.querySelector(`#percent-label-${id}`);
          if (label) label.innerText = `${slider.value}%`;
        }
      });

      root.addEventListener('click', (e) => {
        const saveBtn = e.target.closest('[data-save-project-id]');
        if (saveBtn) {
          const id = parseInt(saveBtn.getAttribute('data-save-project-id'));
          const slider = document.querySelector(`[data-progress-slider="${id}"]`);
          const select = document.querySelector(`[data-phase-select="${id}"]`);
        
          const proj = projects.find(p => p.id === id);
          if (proj && slider && select) {
            proj.progress = parseInt(slider.value);
            proj.phase = select.value;
            addAuditLog(`Updated Landmark project "${proj.title}" progress to ${proj.progress}% (${proj.phase})`, 'Track Construction');
            alert(`Milestone progress for "${proj.title}" updated successfully!`);
            initAdminTab('properties-track');
          }
        }
      });
    }

    // Customers Directory search, filter, add new, and detail modals
    if (tabName === 'customers-list') {
      const searchInput = document.querySelector('#admin-search-customers');
      const filterSelect = document.querySelector('#filter-kyc-status');

      function filterTable() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const kycVal = filterSelect ? filterSelect.value : 'all';
        const tbody = document.querySelector('#admin-customers-table-body');
        if (!tbody) return;

        const filtered = state.admin.kycQueue.filter(c => {
          const matchesQuery = c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query);
          const matchesKyc = kycVal === 'all' || c.status === kycVal;
          return matchesQuery && matchesKyc;
        });

        tbody.innerHTML = filtered.map(c => `
        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
          <td class="p-4 font-bold text-slate-900 dark:text-white">${c.name}</td>
          <td class="p-4 text-slate-455 font-mono">${c.email}</td>
          <td class="p-4">
            <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${c.status === 'Approved' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
            c.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-red-500/10 text-red-600'
          }">${c.status === 'Approved' ? 'Verified' : c.status}</span>
          </td>
          <td class="p-4 text-slate-500 font-semibold">Obinna Diala (Gen 1)</td>
          <td class="p-4 text-slate-450 font-medium">Lekki Heights Plot 101</td>
          <td class="p-4 text-right">
            <button data-view-customer-id="${c.id}" class="text-[#1d4ed8] hover:text-[#1e3a8a] font-bold transition-colors">View Profile</button>
          </td>
        </tr>
      `).join('');
      }

      if (searchInput) searchInput.addEventListener('input', filterTable);
      if (filterSelect) filterSelect.addEventListener('change', filterTable);

      root.addEventListener('click', (e) => {
        // Add Customer manual wizard
        const addCustBtn = e.target.closest('#add-customer-btn');
        if (addCustBtn) {
          const name = prompt("Enter Customer Full Name:");
          if (!name) return;
          const email = prompt("Enter Email Coordinates:");
          if (!email) return;
          const phone = prompt("Enter Phone Number:", "+234");
        
          if (name && email && phone) {
            const newCustomer = {
              id: state.admin.kycQueue.length + 1,
              name: name,
              email: email,
              docType: 'NIN / BVN Slip',
              docUrl: 'nin.jpg',
              status: 'Pending Review',
              date: new Date().toISOString().substring(0, 10),
              phone: phone,
              accessDisabled: false,
              uploadedDocs: []
            };
            state.admin.kycQueue.push(newCustomer);
            addAuditLog(`Manually created new customer profile "${name}"`, 'Customer Database');
            alert(`Customer profile for "${name}" registered successfully.`);
            initAdminTab('customers-list');
          }
        }

        // Customer Detail View modal simulation
        const viewCustBtn = e.target.closest('[data-view-customer-id]');
        if (viewCustBtn) {
          const id = parseInt(viewCustBtn.getAttribute('data-view-customer-id'));
          const customer = state.admin.kycQueue.find(c => c.id === id);
          if (customer) {
            alert(`--- CUSTOMER PROFILE SHEET ---\n\nName: ${customer.name}\nEmail: ${customer.email}\nPhone: ${customer.phone || 'N/A'}\nKYC Status: ${customer.status}\nAssigned Affiliate: Obinna Diala\nPortal Access: ${customer.accessDisabled ? 'Disabled' : 'Enabled'}\n\nNotes Category: Payment Pending Outright Allocation`);
          }
        }
      });
    }

    // Customer KYC Approvals
    if (tabName === 'customers-kyc') {
      root.addEventListener('click', (e) => {
        const approveKycId = e.target.closest('[data-approve-kyc]');
        const rejectKycId = e.target.closest('[data-reject-kyc]');
        const requestKycId = e.target.closest('[data-request-kyc]');
      
        if (approveKycId) {
          const id = parseInt(approveKycId.getAttribute('data-approve-kyc'));
          const item = state.admin.kycQueue.find(k => k.id === id);
          if (item) {
            item.status = 'Approved';
            addAuditLog(`Approved KYC documents for customer "${item.name}"`, 'Customer KYC Management');
            alert(`KYC validation for "${item.name}" verified successfully.`);
            initAdminTab('customers-kyc');
          }
        }
      
        if (rejectKycId) {
          const id = parseInt(rejectKycId.getAttribute('data-reject-kyc'));
          const item = state.admin.kycQueue.find(k => k.id === id);
          if (item) {
            const reason = prompt("Enter Rejection Reason:", "NIN number does not match provided coordinates.");
            if (reason !== null) {
              item.status = 'Rejected';
              addAuditLog(`Rejected KYC documents for customer "${item.name}". Reason: ${reason}`, 'Customer KYC Management');
              alert(`KYC for "${item.name}" has been marked Rejected.`);
              initAdminTab('customers-kyc');
            }
          }
        }

        if (requestKycId) {
          const id = parseInt(requestKycId.getAttribute('data-request-kyc'));
          const item = state.admin.kycQueue.find(k => k.id === id);
          if (item) {
            addAuditLog(`Requested KYC documents re-upload for customer "${item.name}"`, 'Customer KYC Management');
            alert(`Sent compliance notification to "${item.name}" requesting immediate document re-upload.`);
            initAdminTab('customers-kyc');
          }
        }
      });
    }

    // Customer Portal Access Controls
    if (tabName === 'customers-access') {
      root.addEventListener('click', (e) => {
        const toggleAccessBtn = e.target.closest('[data-toggle-access-id]');
        const resetPassBtn = e.target.closest('[data-reset-pass-id]');

        if (toggleAccessBtn) {
          const id = parseInt(toggleAccessBtn.getAttribute('data-toggle-access-id'));
          const customer = state.admin.kycQueue.find(c => c.id === id);
          if (customer) {
            customer.accessDisabled = !customer.accessDisabled;
            addAuditLog(`${customer.accessDisabled ? 'Disabled' : 'Enabled'} portal login for customer "${customer.name}"`, 'Customer Portal Access');
            alert(`Portal access for "${customer.name}" has been ${customer.accessDisabled ? 'Disabled' : 'Enabled'}.`);
            initAdminTab('customers-access');
          }
        }

        if (resetPassBtn) {
          const id = parseInt(resetPassBtn.getAttribute('data-reset-pass-id'));
          const customer = state.admin.kycQueue.find(c => c.id === id);
          if (customer) {
            const tempPass = Math.random().toString(36).substring(2, 10);
            addAuditLog(`Reset password on behalf of customer "${customer.name}"`, 'Customer Portal Access');
            alert(`Temporary password reset coordinates generated successfully.\nTemporary Password: ${tempPass}`);
          }
        }
      });
    }

    // Customer Documents Upload Locker
    if (tabName === 'customers-docs') {
      const form = document.querySelector('#customer-upload-docs-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const selectCust = document.querySelector('#upload-doc-customer-select');
          const selectClass = document.querySelector('#upload-doc-class-select');
          const fileInp = document.querySelector('#upload-doc-file-input');

          const customer = state.admin.kycQueue.find(c => c.id === parseInt(selectCust.value));
          if (customer) {
            const docName = fileInp.files[0] ? fileInp.files[0].name : 'deed_document.pdf';
            if (!customer.uploadedDocs) customer.uploadedDocs = [];
            customer.uploadedDocs.push({
              type: selectClass.value,
              fileName: docName,
              date: new Date().toISOString().substring(0, 10)
            });
            addAuditLog(`Uploaded "${selectClass.value}" deed files (${docName}) to customer "${customer.name}" locker`, 'Upload Customer Documents');
            alert(`Official "${selectClass.value}" uploaded and saved directly to ${customer.name}'s vault file ledger!`);
            selectCust.value = '';
            fileInp.value = '';
          }
        });
      }
    }

    // Tour Bookings
    if (tabName === 'clients-bookings') {
      root.addEventListener('click', (e) => {
        const confirmId = e.target.closest('[data-confirm-tour]');
        const rescheduleId = e.target.closest('[data-reschedule-tour]');
      
        if (confirmId) {
          const id = parseInt(confirmId.getAttribute('data-confirm-tour'));
          const item = state.admin.inspectionsList.find(t => t.id === id);
          if (item) {
            item.status = 'Confirmed';
            addAuditLog(`Confirmed site tour request for client "${item.name}"`, 'Tour Bookings');
            alert(`Site tour for "${item.name}" confirmed successfully.`);
            initAdminTab('clients-bookings');
          }
        }
      
        if (rescheduleId) {
          const id = parseInt(rescheduleId.getAttribute('data-reschedule-tour'));
          const item = state.admin.inspectionsList.find(t => t.id === id);
          if (item) {
            const newDate = prompt("Enter New Preferred Date:", item.date);
            if (newDate) {
              item.date = newDate;
              item.status = 'Confirmed';
              addAuditLog(`Rescheduled site tour for client "${item.name}" to ${newDate}`, 'Tour Bookings');
              alert(`Site tour date rescheduled and confirmed successfully.`);
              initAdminTab('clients-bookings');
            }
          }
        }
      });
    }

    // Contact Inquiries Archive
    if (tabName === 'clients-messages') {
      root.addEventListener('click', (e) => {
        const archiveBtn = e.target.closest('[data-archive-msg]');
        if (archiveBtn) {
          const id = parseInt(archiveBtn.getAttribute('data-archive-msg'));
          const idx = state.admin.contactMessages.findIndex(m => m.id === id);
          if (idx !== -1) {
            const name = state.admin.contactMessages[idx].name;
            state.admin.contactMessages.splice(idx, 1);
            addAuditLog(`Archived inquiry message from client "${name}"`, 'Contact Messages');
            alert("Message archived successfully.");
            initAdminTab('clients-messages');
          }
        }
      });
    }

    // Release Commission Payouts
    if (tabName === 'partners-payouts') {
      root.addEventListener('click', (e) => {
        const releaseBtn = e.target.closest('#release-payout-btn-1');
        if (releaseBtn) {
          const statusEl = document.querySelector('#payout-status-1');
          if (statusEl) {
            statusEl.innerText = 'Cleared';
            statusEl.className = 'px-2 py-0.5 rounded-full text-[9px] font-black bg-green-500/10 text-green-600 dark:text-green-400 uppercase tracking-wider';
          }
          addAuditLog("Released commission payout of ₦15,000,000 to Obinna Diala", 'Payout Records');
          alert("Escrow Bank transfer clearance authorized successfully!");
          releaseBtn.remove();
        }
      });
    }

    // Clear Escrow Milestone Payments
    if (tabName === 'finance-ledger') {
      root.addEventListener('click', (e) => {
        const clearBtn = e.target.closest('[data-clear-downpayment]');
        if (clearBtn) {
          const id = parseInt(clearBtn.getAttribute('data-clear-downpayment'));
          const order = state.admin.ordersLedger.find(o => o.id === id);
          if (order) {
            order.status = 'Active Installments';
            order.paidAmount = order.price * 0.2; // 20% downpayment cleared
            addAuditLog(`Cleared downpayment installment of ₦${order.paidAmount.toLocaleString()} for client "${order.clientName}"`, 'Payment Ledger (Escrow)');
            alert(`Downpayment processed successfully. Milestone tracking ledger is now active.`);
            initAdminTab('finance-ledger');
          }
        }
      });
    }

    // Access Permissions Save
    if (tabName === 'staff-permissions') {
      const saveBtn = document.querySelector('#save-permissions-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          addAuditLog("Updated staff access permissions matrix tables", 'Access Permissions');
          alert("Access configuration matrix saved.");
        });
      }
    }

    // Write Articles Block Composer
    if (tabName === 'blog-write') {
      const titleInp = document.querySelector('#blog-editor-title');
      const excerptInp = document.querySelector('#blog-editor-excerpt');
      const authorInp = document.querySelector('#blog-editor-author');
      const contentInp = document.querySelector('#blog-content-main');
    
      function syncPreview() {
        const titlePrv = document.querySelector('#preview-title');
        const excerptPrv = document.querySelector('#preview-excerpt');
        const authorPrv = document.querySelector('#preview-author');
        const bodyPrv = document.querySelector('#preview-body');
      
        if (titlePrv && titleInp) titlePrv.innerText = titleInp.value || 'Article Title Preview';
        if (excerptPrv && excerptInp) excerptPrv.innerText = excerptInp.value || 'Synopsis teaser excerpt goes here...';
        if (authorPrv && authorInp) authorPrv.innerText = authorInp.value || 'Author Name';
        if (bodyPrv && contentInp) bodyPrv.innerText = contentInp.value || 'Write content on the left pane editor to preview structural layout details instantly.';
      }

      if (titleInp) titleInp.addEventListener('input', syncPreview);
      if (excerptInp) excerptInp.addEventListener('input', syncPreview);
      if (authorInp) authorInp.addEventListener('input', syncPreview);
      if (contentInp) contentInp.addEventListener('input', syncPreview);

      const headingBtn = document.querySelector('#add-heading-block-btn');
      const textBtn = document.querySelector('#add-text-block-btn');
      if (headingBtn && contentInp) {
        headingBtn.addEventListener('click', () => {
          contentInp.value += "\n\n## Section Header \n";
          syncPreview();
        });
      }
      if (textBtn && contentInp) {
        textBtn.addEventListener('click', () => {
          contentInp.value += "\n\nWrite sub-topic detail description contents here. \n";
          syncPreview();
        });
      }

      const publishBtn = document.querySelector('#publish-article-btn');
      if (publishBtn) {
        publishBtn.addEventListener('click', () => {
          const title = titleInp.value.trim();
          const excerpt = excerptInp.value.trim();
          const author = authorInp.value.trim();
          const content = contentInp.value.trim();
        
          if (!title || !author || !content) {
            alert("Please verify title, author, and paragraph content coordinates.");
            return;
          }

          const newBlog = {
            id: blogs.length ? Math.max(...blogs.map(b => b.id)) + 1 : 1,
            title: title,
            excerpt: excerpt || "Insights from the official Blueskye Journal.",
            author: author,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            readTime: '4 min read',
            category: 'Investments',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
            content: content
          };
          blogs.unshift(newBlog);
          addAuditLog(`Published new blog article "${title}" to website Journal`, 'Write Articles');
          alert(`Article "${title}" published and listed successfully!`);
        
          titleInp.value = '';
          excerptInp.value = '';
          authorInp.value = '';
          contentInp.value = '';
          syncPreview();
        });
      }
    }

    // Platform Profile Settings Form submit
    if (tabName === 'settings-profile') {
      const form = document.querySelector('#settings-profile-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          state.admin.settings.companyName = document.querySelector('#set-company-name').value;
          state.admin.settings.companyAddress = document.querySelector('#set-company-address').value;
          state.admin.settings.companyPhone = document.querySelector('#set-company-phone').value;
          state.admin.settings.companyEmail = document.querySelector('#set-company-email').value;
        
          addAuditLog("Updated Platform profile settings details", 'Platform Profile Settings');
          alert("Platform coordinates updated successfully.");
        });
      }
    }

    // Escrow Bank Setup Form submit
    if (tabName === 'settings-bank') {
      const form = document.querySelector('#settings-bank-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          state.admin.settings.escrowBankName = document.querySelector('#set-bank-name').value;
          state.admin.settings.escrowAccountName = document.querySelector('#set-bank-holder').value;
          state.admin.settings.escrowAccountNumber = document.querySelector('#set-bank-number').value;
          state.admin.settings.escrowSwiftCode = document.querySelector('#set-bank-swift').value;
        
          addAuditLog(`Updated target escrow banking coordinates to ${state.admin.settings.escrowBankName}`, 'Escrow Bank Setup');
          alert("Official Escrow payout target account configurations updated successfully.");
        });
      }
    }
  }
