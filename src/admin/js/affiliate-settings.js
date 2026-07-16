import settingsTemplates from '../html/affiliate-settings.html?raw';

function getSection(name) {
  const startMarker = `data-section="${name}"`;
  const startIdx = settingsTemplates.indexOf(startMarker);
  if (startIdx === -1) return '';
  const divStart = settingsTemplates.lastIndexOf('<div', startIdx);
  const endMarker = `END SECTION: ${name}`;
  const endCommentIdx = settingsTemplates.indexOf(endMarker, startIdx);
  if (endCommentIdx === -1) return '';
  const closingDiv = settingsTemplates.lastIndexOf('</div>', endCommentIdx);
  if (closingDiv === -1) return '';
  return settingsTemplates.slice(divStart, closingDiv + 6);
}

function ensureSettings(state) {
  if (!state.admin.settings) state.admin.settings = {};
  if (!state.admin.settings.affiliateRules) {
    state.admin.settings.affiliateRules = {
      allowDownlineSales: true,
      gen1Rate: 10,
      gen2Rate: 5
    };
  }
}

// 1. MASTER ROUTER
export function renderAffiliateSettingsTab(state) {
  ensureSettings(state);
  return getSection('affiliate-settings-template');
}

// --- Bind Affiliate Settings Event Listeners ---
export function bindAffiliateSettingsTabListeners(state, root, addAuditLog, initAdminTab, renderApp) {
  ensureSettings(state);
  const rules = state.admin.settings.affiliateRules;

  // Pre-fill fields values
  const allowDownline = document.querySelector('#sett-allow-downline-sales');
  const gen1Input = document.querySelector('#sett-rate-gen1');
  const gen2Input = document.querySelector('#sett-rate-gen2');

  if (allowDownline) allowDownline.checked = rules.allowDownlineSales;
  if (gen1Input) gen1Input.value = rules.gen1Rate;
  if (gen2Input) gen2Input.value = rules.gen2Rate;

  // Submit save settings handler
  const form = document.querySelector('#affiliate-settings-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newAllow = allowDownline?.checked || false;
      const newRate1 = parseInt(gen1Input?.value || 10);
      const newRate2 = parseInt(gen2Input?.value || 5);

      if (newRate1 < 0 || newRate1 > 100 || newRate2 < 0 || newRate2 > 100) {
        alert('Commission rates must sit within 0-100 range values.');
        return;
      }

      rules.allowDownlineSales = newAllow;
      rules.gen1Rate = newRate1;
      rules.gen2Rate = newRate2;

      addAuditLog(`Updated global affiliate configurations: allowDownlineSales=${newAllow}, Gen1Rate=${newRate1}%, Gen2Rate=${newRate2}%`, 'Settings');
      alert('Affiliate system-wide configuration defaults saved successfully.');
      
      initAdminTab('affiliate-settings');
      renderApp();
    });
  }

  // Redirect link click
  document.querySelector('#sett-redirect-directory-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.admin.partnerViewMode = 'list';
    initAdminTab('partners-directory');
  });
}
