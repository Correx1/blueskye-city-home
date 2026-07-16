import { renderOverviewTab, bindOverviewTabListeners } from './js/overview.js';
import { 
  renderPropertiesListTab, 
  renderAddEditPropertyTab, 
  renderPropertyDetailTab,
  renderLandPlotMappingTab, 
  renderAddEditPlotAllocationTab,
  bindPropertiesListTabListeners,
  bindAddEditPropertyTabListeners,
  bindPropertyDetailTabListeners,
  bindLandPlotMappingTabListeners,
  bindAddEditPlotAllocationTabListeners
} from './js/property.js';
import { 
  renderProjectsListTab, 
  renderAddEditProjectTab, 
  renderProjectReportsTab,
  renderProjectDetailTab,
  bindProjectsListTabListeners,
  bindAddEditProjectTabListeners,
  bindProjectReportsTabListeners,
  bindProjectDetailTabListeners
} from './js/project.js';
import { 
  renderCustomersTab, 
  bindCustomersTabListeners 
} from './js/customer.js';
import { 
  renderSalesCatalogTab, 
  bindSalesTabListeners
} from './js/sales.js';
import {
  renderPaymentsTab,
  bindPaymentsTabListeners
} from './js/payments.js';
import {
  renderInvoicesTab,
  bindInvoicesTabListeners
} from './js/invoices.js';
import { 
  renderPartnerDirectoryTab, 
  bindPartnersTabListeners
} from './js/partner.js';
import {
  renderCommissionLedgerTab,
  bindCommissionsTabListeners
} from './js/commissions.js';
import {
  renderWithdrawalRequestsTab,
  bindWithdrawalsTabListeners
} from './js/withdrawals.js';
import { 
  renderTourBookingsTab, 
  renderInspectionCalendarTab,
  bindInspectionsTabListeners
} from './js/inspection.js';
import { 
  renderSalesSummaryReportTab, 
  renderCommissionReportTab, 
  renderPerformanceAnalyticsTab, 
  renderPaymentLedgerTab,
  bindReportsFinanceTabListeners
} from './js/reports-finance.js';
import { 
  renderWriteArticlesTab, 
  renderNewsSubscribersTab, 
  renderContactMessagesTab,
  bindBlogTabListeners
} from './js/blog.js';
import { 
  renderSettingsHubTab, 
  bindSettingsHubListeners 
} from './js/settings.js';
import { 
  renderSupportTab, 
  bindSupportTabListeners 
} from './js/support.js';

export function renderAdminTabContent(tabName, state, properties, projects, blogs) {
  switch (tabName) {
    case 'overview': return renderOverviewTab(state, properties);
    case 'properties-list': return renderPropertiesListTab(properties);
    case 'properties-add': return renderAddEditPropertyTab(state, properties, projects);
    case 'properties-detail': return renderPropertyDetailTab(state, properties, projects);
    case 'projects-list': return renderProjectsListTab(state, projects, properties);
    case 'projects-add': return renderAddEditProjectTab(state, projects);
    case 'projects-detail': return renderProjectDetailTab(state, projects, properties);
    case 'projects-reports': return renderProjectReportsTab(state, projects);
    case 'properties-mapping': return renderLandPlotMappingTab(state, properties, projects);
    case 'properties-mapping-add': return renderAddEditPlotAllocationTab(state, properties, projects);
    case 'customers': return renderCustomersTab(state, properties, projects);
    case 'sales-list': return renderSalesCatalogTab(state, properties, projects);
    case 'payments-list': return renderPaymentsTab(state, properties, projects);
    case 'invoices-list': return renderInvoicesTab(state, properties, projects);
    case 'partners-directory': return renderPartnerDirectoryTab(state);
    case 'commission-ledger': return renderCommissionLedgerTab(state);
    case 'withdrawal-requests': return renderWithdrawalRequestsTab(state);
    case 'affiliate-settings': return renderAffiliateSettingsTab(state);
    case 'clients-bookings': return renderTourBookingsTab(state);
    case 'inspections-calendar': return renderInspectionCalendarTab(state);
    case 'reports-sales': return renderSalesSummaryReportTab(state);
    case 'reports-commissions': return renderCommissionReportTab(state);
    case 'reports-performance': return renderPerformanceAnalyticsTab(state);
    case 'finance-ledger': return renderPaymentLedgerTab(state);
    case 'blog-write': return renderWriteArticlesTab(state);
    case 'blog-subscribers': return renderNewsSubscribersTab(state);
    case 'clients-messages': return renderContactMessagesTab(state);
    case 'staff-accounts':
    case 'staff-permissions':
    case 'affiliate-settings':
    case 'settings-hub':
    case 'settings-profile':
    case 'settings-bank':
    case 'settings-audit':
      return renderSettingsHubTab(state);
    case 'support-helpdesk': return renderSupportTab(state);
    default: return renderOverviewTab(state, properties);
  }
}

export function bindAdminTabListeners(tabName, state, properties, projects, blogs, renderApp, initAdminTab) {
  const root = document.querySelector('#admin-viewport');
  if (!root) return;

  // Global audit logger helper
  function addAuditLog(action, component) {
    if (!state.admin.auditLogs) state.admin.auditLogs = [];
    const log = {
      id: state.admin.auditLogs.length + 1,
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      staff: state.admin.staffName || 'Admin Coordinator',
      action: action,
      component: component
    };
    state.admin.auditLogs.unshift(log);
  }

  switch (tabName) {
    case 'overview':
      bindOverviewTabListeners(state, root, initAdminTab);
      break;
    case 'properties-list':
      bindPropertiesListTabListeners(state, root, initAdminTab, properties, addAuditLog);
      break;
    case 'properties-add':
      bindAddEditPropertyTabListeners(state, root, initAdminTab, properties, addAuditLog, renderApp);
      break;
    case 'properties-detail':
      bindPropertyDetailTabListeners(state, root, initAdminTab, properties, addAuditLog);
      break;
    case 'projects-list':
      bindProjectsListTabListeners(state, root, initAdminTab, projects, addAuditLog);
      break;
    case 'projects-add':
      bindAddEditProjectTabListeners(state, root, initAdminTab, projects, addAuditLog, renderApp);
      break;
    case 'projects-detail':
      bindProjectDetailTabListeners(state, root, initAdminTab, projects, properties, addAuditLog);
      break;
    case 'projects-reports':
      bindProjectReportsTabListeners(state, root, initAdminTab, projects, addAuditLog, renderApp);
      break;
    case 'properties-mapping':
      bindLandPlotMappingTabListeners(state, root, initAdminTab, properties, addAuditLog);
      break;
    case 'properties-mapping-add':
      bindAddEditPlotAllocationTabListeners(state, root, initAdminTab, addAuditLog);
      break;
    case 'customers':
      bindCustomersTabListeners(state, root, initAdminTab, addAuditLog, renderApp);
      break;
    case 'sales-list':
      bindSalesTabListeners(state, root, initAdminTab, addAuditLog, renderApp);
      break;
    case 'payments-list':
      bindPaymentsTabListeners(state, root, initAdminTab, addAuditLog, renderApp);
      break;
    case 'invoices-list':
      bindInvoicesTabListeners(state, root, initAdminTab, addAuditLog, renderApp);
      break;
    case 'partners-directory':
      bindPartnersTabListeners(state, root, addAuditLog, initAdminTab, renderApp);
      break;
    case 'commission-ledger':
      bindCommissionsTabListeners(state, root, addAuditLog, initAdminTab, renderApp);
      break;
    case 'withdrawal-requests':
      bindWithdrawalsTabListeners(state, root, addAuditLog, initAdminTab, renderApp);
      break;
    case 'affiliate-settings':
      bindAffiliateSettingsTabListeners(state, root, addAuditLog, initAdminTab, renderApp);
      break;
    case 'clients-bookings':
    case 'inspections-calendar':
      bindInspectionsTabListeners(state, root, addAuditLog, initAdminTab);
      break;
    case 'reports-sales':
    case 'reports-commissions':
    case 'reports-performance':
    case 'finance-ledger':
      bindReportsFinanceTabListeners(state, root, addAuditLog, initAdminTab);
      break;
    case 'blog-write':
    case 'blog-subscribers':
    case 'clients-messages':
      bindBlogTabListeners(state, root, addAuditLog, initAdminTab, blogs);
      break;
    case 'staff-accounts':
    case 'staff-permissions':
    case 'affiliate-settings':
    case 'settings-hub':
    case 'settings-profile':
    case 'settings-bank':
    case 'settings-audit':
      bindSettingsHubListeners(state, root, addAuditLog, initAdminTab, renderApp);
      break;
    case 'support-helpdesk':
      bindSupportTabListeners(state, root, addAuditLog, initAdminTab, renderApp);
      break;
  }
}
