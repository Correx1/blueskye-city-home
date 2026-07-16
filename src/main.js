import './style.css';
import { properties } from './data/properties.js';
import { projects } from './data/projects.js';
import { blogs } from './data/blogs.js';
import './components/navbar.js';

// --- Swiper Slider Library Import ---
import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// --- HTML Template Raw Imports ---
import homeHtml from './components/home-view.html?raw';
import propertiesHtml from './components/properties-view.html?raw';
import aboutHtml from './components/about-view.html?raw';
import projectsHtml from './components/projects-view.html?raw';
import blogsHtml from './components/blogs-view.html?raw';
import contactHtml from './components/contact-view.html?raw';
import authHtml from './components/auth-view.html?raw';
import affiliateHtml from './components/affiliate-view.html?raw';
import propertyCardHtml from './components/property-card.html?raw';
import blogCardHtml from './components/blog-card.html?raw';
import comparisonDrawerHtml from './components/comparison-drawer.html?raw';
import detailModalHtml from './components/detail-modal.html?raw';
import comparisonModalHtml from './components/comparison-modal.html?raw';
import propertyDetailViewHtml from './components/property-detail-view.html?raw';
import aboutSectionHtml from './components/about-section.html?raw';
import portfolioBenefitsHtml from './components/portfolio-benefits.html?raw';
import testimonialsSectionHtml from './components/testimonials-section.html?raw';
import faqSectionHtml from './components/faq-section.html?raw';
import projectCardHtml from './components/project-card.html?raw';
import projectDetailViewHtml from './components/project-detail-view.html?raw';
import blogDetailViewHtml from './components/blog-detail-view.html?raw';

// --- HTML Form Modal Templates ---
import clientLoginFormHtml from './components/client-login-form.html?raw';
import clientRegisterFormHtml from './components/client-register-form.html?raw';
import affiliateLoginFormHtml from './components/affiliate-login-form.html?raw';
import affiliateRegisterFormHtml from './components/affiliate-register-form.html?raw';
import orderWizardModalHtml from './components/order-wizard-modal.html?raw';

// --- Privacy and Terms Page Templates ---
import privacyHtml from './components/privacy-view.html?raw';
import termsHtml from './components/terms-view.html?raw';

// --- Admin Dashboard Layout Template ---
import adminHtml from './admin/admin-view.html?raw';
import { renderAdminTabContent, bindAdminTabListeners } from './admin/admin-subviews.js';

// --- Customer Portal Layout Template ---
import customerHtml from './customer/customer-view.html?raw';
import { renderCustomerPortal, bindCustomerListeners, ensureCustomerState } from './customer/js/customer.js';

// --- Affiliate Portal Layout Template ---
import affiliatePortalHtml from './affiliate/affiliate-view.html?raw';
import { renderAffiliatePortal, bindAffiliateListeners, ensureAffiliateState } from './affiliate/js/affiliate.js';





// --- HTML Template Interpolation Helper ---
function interpolate(template, data) {
  return template.replace(/\{\{([\w.]+)\}\}/g, (match, key) => {
    const keys = key.split('.');
    let val = data;
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k];
      } else {
        return '';
      }
    }
    return val !== undefined ? val : '';
  });
}

// --- State Management ---
const state = {
  activeRoute: 'home', // 'home', 'properties', 'about', 'projects', 'blogs', 'contact', 'auth'
  isMobileMenuOpen: false,
  favorites: JSON.parse(localStorage.getItem('blueskye_favorites')) || [],
  comparedPropertyIds: [],
  selectedProperty: null,
  selectedProject: null,
  selectedBlog: null,
  selectedImageIndex: 0,
  theme: 'light',
  
  // Search page filters state
  searchFilters: {
    query: '',
    city: 'all',
    type: 'all',
    priceRange: 'all',
    minPrice: 'all',
    maxPrice: 'all',
    minSize: 'all',
    maxSize: 'all',
    beds: 'all',
    status: 'all'
  },
  sortBy: 'featured',
  isGridView: true,
  propertiesPage: 1,
  propertiesPerPage: 10,

  // Mortgage Calculator State
  mortgage: {
    downPaymentPct: 20,
    interestRate: 6.5,
    loanTermYears: 30
  },
  projectFilters: {
    city: 'all',
    status: 'all'
  },
  customer: {
    isAuthenticated: false,
    activeTab: 'dashboard',
    authSubTab: 'login',
    profile: {
      name: 'Olumide Alao',
      email: 'client@blueskye.com',
      phone: '+234 812 559 4832',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      activePropertiesCount: 1,
      kycStatus: 'Verified'
    }
  },
  affiliate: {
    isAuthenticated: false,
    activeTab: 'dashboard',
    profile: {
      name: 'Jane Yusuf Alao',
      email: 'partner@blueskye.com',
      phone: '+234 809 123 4567',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      affiliate_type: 'Strategic Partner',
      commission_rate: 20,
      kycStatus: 'Pending'
    }
  },
  admin: {
    isAuthenticated: true,
    activeTab: 'overview',
    expandedGroups: {
      properties: false,
      customers: false,
      sales: false,
      partners: false,
      finance: false,
      billing: false,
      inspections: false,
      staff: false,
      blog: false,
      reports: false,
      settings: false
    },
    staffName: 'Amina Bello',
    staffRole: 'Administrator',
    theme: localStorage.getItem('blueskye_admin_theme') || 'light',
    
    // Mock databases
    kycQueue: [
      { id: 1, name: 'Chukwu Raphael', email: 'chukwu@domain.com', docType: 'International Passport', docUrl: 'passport.jpg', status: 'Pending Review', date: '2026-07-06' },
      { id: 2, name: 'Amina Yusuf', email: 'amina@domain.com', docType: 'Driver\'s License', docUrl: 'license.jpg', status: 'Approved', date: '2026-07-05' }
    ],
    inspectionsList: [
      { id: 1, name: 'Jane Doe', phone: '+2348011122233', email: 'jane@domain.com', propertyTitle: 'Magnolia Diplomat Mansion', date: '2026-07-10', type: 'Physical Tour', status: 'Pending' },
      { id: 2, name: 'John Smith', phone: '+2348099988877', email: 'john@domain.com', propertyTitle: 'Serene Serviced Plot', date: '2026-07-12', type: 'Virtual Video', status: 'Confirmed' }
    ],
    ordersLedger: [
      { id: 1, clientName: 'Jane Doe', email: 'jane@domain.com', propertyTitle: 'Magnolia Diplomat Mansion', price: 850000000, formattedPrice: '₦850,000,000', plan: 'Outright', date: '2026-07-07', status: 'Pending Downpayment', paidAmount: 0 },
      { id: 2, clientName: 'Amina Yusuf', email: 'amina@domain.com', propertyTitle: 'Serene Serviced Plot', price: 150000000, formattedPrice: '₦150,000,000', plan: '6-Month Installment', date: '2026-07-05', status: 'Active Installments', paidAmount: 50000000 }
    ],
    paymentsLog: [
      { id: 101, saleId: 2, clientName: 'Amina Yusuf', propertyTitle: 'Serene Serviced Plot', amount: 50000000, date: '2026-07-05', channel: 'Bank Transfer', reference: 'TXN-998877', note: 'Initial deposit payment', status: 'Confirmed', proofUrl: '' },
      { id: 102, saleId: 1, clientName: 'Jane Doe', propertyTitle: 'Magnolia Diplomat Mansion', amount: 150000000, date: '2026-07-11', channel: 'Bank Transfer', reference: 'TXN-887766', note: 'Downpayment proof uploaded', status: 'Pending Confirmation', proofUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80' }
    ],
    invoicesLog: [
      { id: 201, invoiceRef: 'INV-0001', saleId: 1, clientName: 'Jane Doe', email: 'jane@domain.com', propertyTitle: 'Magnolia Diplomat Mansion', date: '2026-07-07', price: 850000000, paid: 0, balance: 850000000, status: 'Unpaid', notes: 'Outright sale invoice.' },
      { id: 202, invoiceRef: 'INV-0002', saleId: 2, clientName: 'Amina Yusuf', email: 'amina@domain.com', propertyTitle: 'Serene Serviced Plot', date: '2026-07-05', price: 150000000, paid: 50000000, balance: 100000000, status: 'Partially Paid', notes: 'Installment sale invoice.' }
    ],
    referralsList: [
      {
        id: 1,
        name: 'Obinna Diala',
        email: 'obinna@partner.com',
        phone: '+2347065554433',
        status: 'Approved',
        code: 'SKY-OBIN-99',
        clicks: 245,
        sales: 3,
        earned: 45000000,
        balance: 15000000,
        isActive: true,
        uplineId: null,
        kycDocs: { passportUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', utilityUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=150&q=80' },
        bankDetails: { bankName: 'Zenith Bank PLC', accountNum: '1022345678', accountName: 'Obinna Diala', status: 'Approved' },
        commissionHistory: [
          { id: 401, saleRef: 'SKY-SALE-0002', clientName: 'Amina Yusuf', type: 'Direct (10%)', amount: 15000000, date: '2026-07-05' },
          { id: 402, saleRef: 'SKY-SALE-0004', clientName: 'Sarah Lawson', type: 'Indirect Gen 2 (5%)', amount: 30000000, date: '2026-07-08' }
        ],
        payoutsList: [
          { id: 501, amount: 15000000, date: '2026-07-07', status: 'Pending Release', bankName: 'Zenith Bank PLC', accountNum: '1022345678' }
        ]
      },
      {
        id: 2,
        name: 'Fatima Bello',
        email: 'fatima@partner.com',
        phone: '+2349032221100',
        status: 'Pending Review',
        code: 'SKY-FATI-12',
        clicks: 89,
        sales: 0,
        earned: 0,
        balance: 0,
        isActive: true,
        uplineId: 1,
        kycDocs: { passportUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', utilityUrl: '' },
        bankDetails: { bankName: 'Access Bank PLC', accountNum: '0033445566', accountName: 'Fatima Bello', status: 'Pending' },
        commissionHistory: [],
        payoutsList: []
      },
      {
        id: 3,
        name: 'Kelechi Nnamdi',
        email: 'kelechi@partner.com',
        phone: '+2348033322111',
        status: 'Approved',
        code: 'SKY-KELE-44',
        clicks: 120,
        sales: 1,
        earned: 15000000,
        balance: 5000000,
        isActive: true,
        uplineId: 1,
        kycDocs: { passportUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', utilityUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=150&q=80' },
        bankDetails: { bankName: 'GTBank PLC', accountNum: '0112233445', accountName: 'Kelechi Nnamdi', status: 'Approved' },
        commissionHistory: [
          { id: 403, saleRef: 'SKY-SALE-0004', clientName: 'Sarah Lawson', type: 'Direct (10%)', amount: 15000000, date: '2026-07-08' }
        ],
        payoutsList: [
          { id: 502, amount: 10000000, date: '2026-07-09', status: 'Cleared & Released', bankName: 'GTBank PLC', accountNum: '0112233445' }
        ]
      }
    ],
    contactMessages: [
      { id: 1, name: 'Emeka Okafor', email: 'emeka@gmail.com', message: 'I want to know if there is a payment flexible plan for Eko Atlantic duplex.', date: '2026-07-07' },
      { id: 2, name: 'Sarah Lawson', email: 'sarah@yahoo.com', message: 'Please send me the structural layout details for the Abuja diplomat estates.', date: '2026-07-06' }
    ],
    auditLogs: [
      { id: 1, time: '2026-07-07 08:15', staff: 'Amina Bello', action: 'Update Affiliate Rules commission rate to 10%', component: 'System Settings' },
      { id: 2, time: '2026-07-07 08:00', staff: 'Amina Bello', action: 'Log in successful', component: 'Authentication' }
    ],
    settings: {
      companyName: 'Blueskye City Home',
      companyLogo: '/image/blueskye logo.png',
      companyAddress: 'Plot 15, Lekki Phase 1, Lagos, Nigeria',
      companyPhone: '+234 1 234 5678',
      companyEmail: 'advisors@blueskyecityhome.com',
      
      commissionDirect: 10,
      commissionOverride: 5,
      cookieLifespanDays: 90,
      
      escrowBankName: 'Zenith Bank PLC',
      escrowAccountName: 'Blueskye Escrow Shield Ltd',
      escrowAccountNumber: '1012345678',
      escrowSwiftCode: 'ZENINGLA'
    }
  }
};

// --- Route Definitions ---
const routes = {
  'home': { 
    title: 'Blueskye City Home | Premium Luxury Real Estate & Properties',
    description: 'Discover exquisite villas, modern penthouses, and premium apartments. Blueskye City Home offers the finest selection of curated luxury properties.' 
  },
  'properties': { 
    title: 'Vetted Premium Properties | Blueskye City Home',
    description: 'Browse and search our catalog of premium real estate, luxury duplexes, and serviced land portfolios in Lagos and Abuja.' 
  },
  'property-detail': { 
    title: 'Property Detail | Blueskye City Home',
    description: 'Acquire vetted properties with secure escrow transaction portals and premium finishes.' 
  },
  'about': { 
    title: 'About Our Elite Firm | Blueskye City Home',
    description: 'Learn about our development timeline, institutional JV partnerships, and our commitment to architectural excellence in Nigeria.' 
  },
  'projects': { 
    title: 'Landmark Development Projects | Blueskye City Home',
    description: 'Preview master-planned communities, high-fidelity urban layouts, and pre-construction investment opportunities.' 
  },
  'project-detail': { 
    title: 'Project Detail | Blueskye City Home',
    description: 'Invest in serviced plots with road networks, solar grid configurations, and smart surveillance.' 
  },
  'blogs': { 
    title: 'The Blueskye Journal | Luxury Real Estate Insights',
    description: 'Read expert opinions, luxury design reviews, real estate investment guides, and global market updates.' 
  },
  'blog-detail': { 
    title: 'Blog Detail | The Blueskye Journal',
    description: 'Read detailed expert opinions, design guides, and market updates from the official Blueskye Journal.' 
  },
  'contact': { 
    title: 'Connect With Our Advisor Team | Blueskye City Home',
    description: 'Schedule site inspections, perfect deed queries, or arrange milestone escrows with our client advisors.' 
  },
  'auth': { 
    title: 'Client Portal Login & Registration | Blueskye City Home',
    description: 'Access your premium real estate dashboard, track active site inspection requests, and monitor escrow perfection milestones.' 
  },
  'affiliate': { 
    title: 'Elite Affiliate Partner Program | Blueskye City Home',
    description: 'Join the most elite real estate partnership network in Nigeria. Earn 10% direct commissions and 5% passive override commissions.' 
  },
  'privacy': {
    title: 'Privacy Policy | Blueskye City Home',
    description: 'Read our client data handling policies, encryption protocols, and affiliate referral cookies configuration.'
  },
  'terms': {
    title: 'Terms & Conditions | Blueskye City Home',
    description: 'Review our premium purchase terms, milestone payments guidelines, and site tour booking guidelines.'
  },
  'admin': {
    title: 'Admin Console | Blueskye City Home',
    description: 'Internal console for property management, customer audits, commission payouts, and settings.'
  },
  'customer': {
    title: 'Customer Portal | Blueskye City Home',
    description: 'Manage your property portfolios, check payment status ledger, and submit KYC documents.'
  },
  'affiliate-portal': {
    title: 'Affiliate Portal Console | Blueskye City Home',
    description: 'Track commission overrides, manage downlines network hierarchy, and trigger withdrawals.'
  }
};

// --- Slider Configuration ---
const slideImages = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
];
let sliderInterval = null;
let currentSlideIndex = 0;
let activeBg = 1;

// --- Initialization ---
function init() {
  const galleryImages = [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
  ];
  const loopVideo = "https://assets.mixkit.co/videos/preview/mixkit-modern-home-interior-42289-large.mp4";

  const propertyTitles = [
    "Exterior Facade View",
    "Spacious Living Hall",
    "Master Bedroom Retreat",
    "Gourmet Dining Lounge",
    "Bespoke Bath & Shower",
    "Sleek Fitted Kitchen",
    "Private Green Lawn",
    "Breathtaking Pool Deck",
    "Property Walkthrough Video"
  ];

  properties.forEach((p, idx) => {
    const pImages = [...(p.images || [])];
    while (pImages.length < 8) {
      const nextImg = galleryImages[(pImages.length + idx) % galleryImages.length];
      pImages.push(nextImg);
    }
    p.images = pImages.slice(0, 8);
    p.video = loopVideo;
    p.imageTitles = propertyTitles.slice(0, 9);
    if (!p.longDescription) {
      p.longDescription = p.description + " This premium property offers unparalleled investment security. Situated in a highly coveted neighborhood, it boasts top-tier civil infrastructure, immediate grid access, and state-of-the-art finishes. Ideal for discerning buyers looking for both immediate high-yield utility and long-term equity compound growth in the thriving Nigerian real estate sector.";
    }
  });

  // Initialize Projects database with site photos and unique titles
  projects.forEach((proj, idx) => {
    const baseImages = [...(proj.images || [])];
    
    // Add 3 site logging photos
    baseImages.push("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80"); // Site Foundation & Piling
    baseImages.push("https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"); // Site Concrete Shell
    baseImages.push("https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=800&q=80"); // Site Quality Inspection
    
    proj.images = baseImages;
    
    proj.imageTitles = [
      "Exterior Facade Rendering",
      "Interior Lounge Concept",
      "Panoramic Skydeck Plan",
      "Actual Site: Foundation & Piling Log",
      "Actual Site: Concrete Superstructure Shell",
      "Actual Site: Structural Inspection Log"
    ];
    
    // Additional parameters for admin projects module
    proj.totalPlots = 40 + (idx * 5);
    proj.availablePlots = 10 + (idx * 3);
    
    // Stage based on current progress
    if (proj.progress === 100) proj.stage = 'Completed';
    else if (proj.progress >= 80) proj.stage = 'Finishes';
    else if (proj.progress >= 45) proj.stage = 'Superstructure';
    else if (proj.progress >= 15) proj.stage = 'Foundation';
    else proj.stage = 'Pre-Launch';

    proj.siteManager = idx % 2 === 0 ? 'Aliyu Bello' : 'Chidi Egwu';
    
    // Initial reports list
    proj.reports = [
      {
        id: 1,
        date: "2026-07-05",
        author: proj.siteManager,
        milestone: proj.stage,
        progress: proj.progress,
        text: `Logged project activity for ${proj.title}. The site development phase is currently moving along standard estimates. Heavy civil materials have been fully checked in and construction teams are deployed.`,
        images: [baseImages[3] || baseImages[0]],
        comments: [
          { author: "Amina Bello", date: "2026-07-06 10:15", text: "Approved. Ready for the milestone escrow payment release request." }
        ]
      }
    ];
  });

  // Set initial theme to light
  state.theme = 'light';
  document.body.classList.remove('dark');
  
  // Set up Router
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('DOMContentLoaded', handleRoute);
  
  // Bind global clicks & events
  setupEventListeners();
  
  // First route render
  handleRoute();
}

// --- Dynamic SEO Meta Tags Manager ---
function updateMetaTags(title, description) {
  document.title = title;
  
  const titleMeta = document.querySelector('meta[name="title"]');
  if (titleMeta) titleMeta.setAttribute('content', title);
  
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);
  
  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) descMeta.setAttribute('content', description);
  
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);
}

// --- Router Handler ---
function handleRoute() {
  const rawHash = window.location.hash || '#home';
  
  if (rawHash.startsWith('#property-detail')) {
    const urlParams = new URLSearchParams(rawHash.split('?')[1] || '');
    const id = parseInt(urlParams.get('id'));
    state.selectedProperty = properties.find(p => p.id === id);
    if (state.selectedProperty) {
      state.selectedImageIndex = 0;
      state.activeRoute = 'property-detail';
      
      const title = `${state.selectedProperty.title} | Blueskye City Home`;
      const desc = `${state.selectedProperty.description || ''} Vetted land deeds, secure escrow transaction portals, and premium finishes in ${state.selectedProperty.city || 'Nigeria'}.`;
      updateMetaTags(title, desc);
      
      state.isMobileMenuOpen = false;
      renderApp();
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
  }

  if (rawHash.startsWith('#project-detail')) {
    const urlParams = new URLSearchParams(rawHash.split('?')[1] || '');
    const id = parseInt(urlParams.get('id'));
    state.selectedProject = projects.find(p => p.id === id);
    if (state.selectedProject) {
      state.selectedImageIndex = 0;
      state.activeRoute = 'project-detail';
      
      const title = `${state.selectedProject.title} Development | Blueskye City Home`;
      const desc = `${state.selectedProject.description || ''} Invest in serviced plot developments in ${state.selectedProject.city || 'Nigeria'}. Centralized grids and utilities.`;
      updateMetaTags(title, desc);
      
      state.isMobileMenuOpen = false;
      renderApp();
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
  }

  if (rawHash.startsWith('#blog-detail')) {
    const urlParams = new URLSearchParams(rawHash.split('?')[1] || '');
    const id = parseInt(urlParams.get('id'));
    state.selectedBlog = blogs.find(b => b.id === id);
    if (state.selectedBlog) {
      state.activeRoute = 'blog-detail';
      
      const title = `${state.selectedBlog.title} | The Blueskye Journal`;
      const desc = state.selectedBlog.excerpt || '';
      updateMetaTags(title, desc);
      
      state.isMobileMenuOpen = false;
      renderApp();
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
  }

  const hash = rawHash.split('?')[0].replace('#', '') || 'home';
  if (hash === 'auth') {
    window.location.hash = '#home';
    setTimeout(() => {
      const urlParams = new URLSearchParams(rawHash.split('?')[1] || '');
      const typeParam = urlParams.get('type') || urlParams.get('tab');
      if (typeParam === 'affiliate' || typeParam === 'register-affiliate') {
        openAffiliateAuthModal('register');
      } else if (typeParam === 'affiliate-login') {
        openAffiliateAuthModal('login');
      } else {
        openClientAuthModal('login');
      }
    }, 100);
    return;
  }

  if (routes[hash]) {
    state.activeRoute = hash;
    updateMetaTags(routes[hash].title, routes[hash].description);
  } else {
    window.location.hash = '#home';
    return;
  }
  
  // Close mobile drawer on route change
  state.isMobileMenuOpen = false;
  
  // Render main layout
  renderApp();
  window.scrollTo({ top: 0, behavior: 'instant' });

  if (state.activeRoute === 'admin' && state.admin.isAuthenticated) {
    initAdminTab(state.admin.activeTab);
  }

  // Manage slideshow timer based on active view
  if (state.activeRoute === 'home') {
    startHeroSlider();
  } else {
    if (sliderInterval) {
      clearInterval(sliderInterval);
      sliderInterval = null;
    }
  }
}

// --- Background Image Slideshow Handler (Double Buffer) ---
function startHeroSlider() {
  if (sliderInterval) {
    clearInterval(sliderInterval);
    sliderInterval = null;
  }
  
  const bg1 = document.querySelector('#hero-bg-1');
  const bg2 = document.querySelector('#hero-bg-2');
  if (!bg1 || !bg2) return;
  
  bg1.style.backgroundImage = `url('${slideImages[0]}')`;
  bg2.style.backgroundImage = `url('${slideImages[1]}')`;
  
  currentSlideIndex = 0;
  activeBg = 1;
  
  sliderInterval = setInterval(() => {
    const bg1El = document.querySelector('#hero-bg-1');
    const bg2El = document.querySelector('#hero-bg-2');
    
    if (!bg1El || !bg2El) {
      clearInterval(sliderInterval);
      sliderInterval = null;
      return;
    }
    
    currentSlideIndex = (currentSlideIndex + 1) % slideImages.length;
    const nextImg = slideImages[currentSlideIndex];
    
    if (activeBg === 1) {
      bg2El.style.backgroundImage = `url('${nextImg}')`;
      bg2El.style.opacity = '0.6';
      bg1El.style.opacity = '0';
      activeBg = 2;
    } else {
      bg1El.style.backgroundImage = `url('${nextImg}')`;
      bg1El.style.opacity = '0.6';
      bg2El.style.opacity = '0';
      activeBg = 1;
    }
  }, 5000);
}

// --- Main Layout Render ---
function renderApp() {
  const navbar = document.querySelector('app-navbar');
  const footer = document.querySelector('footer');
  const mainContent = document.querySelector('#main-content');

  if (state.activeRoute === 'admin' || state.activeRoute === 'customer' || state.activeRoute === 'affiliate-portal') {
    if (navbar) navbar.classList.add('hidden');
    if (footer) footer.classList.add('hidden');
    if (mainContent) {
      mainContent.className = "grow h-screen overflow-hidden";
    }
  } else {
    if (navbar) navbar.classList.remove('hidden');
    if (footer) footer.classList.remove('hidden');
    if (mainContent) {
      mainContent.className = "grow pt-16";
    }
  }

  if (mainContent) {
    mainContent.innerHTML = renderActiveView();
  }
  
  if (state.activeRoute === 'customer') {
    bindCustomerListeners(state, mainContent, renderApp);
  }
  
  if (state.activeRoute === 'affiliate-portal') {
    bindAffiliateListeners(state, mainContent, renderApp);
  }
  
  // Sync filter fields if active route is properties
  if (state.activeRoute === 'properties') {
    const qEl = document.querySelector('#filter-query');
    if (qEl) qEl.value = state.searchFilters.query;
    
    const cityEl = document.querySelector('#filter-city');
    if (cityEl) cityEl.value = state.searchFilters.city;
    
    const typeEl = document.querySelector('#filter-type');
    if (typeEl) typeEl.value = state.searchFilters.type;
    
    const statusEl = document.querySelector('#filter-status');
    if (statusEl) statusEl.value = state.searchFilters.status;

    const minPriceEl = document.querySelector('#filter-min-price');
    if (minPriceEl) minPriceEl.value = state.searchFilters.minPrice;

    const maxPriceEl = document.querySelector('#filter-max-price');
    if (maxPriceEl) maxPriceEl.value = state.searchFilters.maxPrice;

    const minSizeEl = document.querySelector('#filter-min-size');
    if (minSizeEl) minSizeEl.value = state.searchFilters.minSize;

    const maxSizeEl = document.querySelector('#filter-max-size');
    if (maxSizeEl) maxSizeEl.value = state.searchFilters.maxSize;
    
    const sortEl = document.querySelector('#sort-by');
    if (sortEl) sortEl.value = state.sortBy;
  }

  // Sync hero search fields if active route is home
  if (state.activeRoute === 'home') {
    const hqEl = document.querySelector('#hero-query');
    if (hqEl) hqEl.value = state.searchFilters.query;
    
    const hcityEl = document.querySelector('#hero-city');
    if (hcityEl) hcityEl.value = state.searchFilters.city;
    
    const htypeEl = document.querySelector('#hero-type');
    if (htypeEl) htypeEl.value = state.searchFilters.type;
  }
  
  // Update desktop nav links active styles
  document.querySelectorAll('#desktop-nav a').forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === state.activeRoute) {
      link.className = 'nav-link nav-link-active';
    } else {
      link.className = 'nav-link';
    }
  });

  // Update mobile nav links active styles
  document.querySelectorAll('#mobile-nav a').forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === state.activeRoute) {
      link.className = 'nav-link nav-link-active w-fit block';
    } else {
      link.className = 'nav-link w-fit block';
    }
  });

  // Update Favorites indicator
  const favCount = state.favorites.length;
  const favBadge = document.querySelector('#fav-badge');
  if (favBadge) {
    if (favCount > 0) {
      favBadge.innerText = favCount;
      favBadge.classList.remove('hidden');
    } else {
      favBadge.classList.add('hidden');
    }
  }
  
  const favIcon = document.querySelector('#fav-icon');
  if (favIcon) {
    if (favCount > 0) {
      favIcon.setAttribute('class', 'w-4 h-4 transition-all fill-primary-600 text-primary-600');
    } else {
      favIcon.setAttribute('class', 'w-4 h-4 transition-all fill-none text-slate-500');
    }
  }

  // Update Theme icons
  const themeIcon = document.querySelector('#theme-icon');
  if (themeIcon) {
    themeIcon.setAttribute('data-lucide', state.theme === 'dark' ? 'sun' : 'moon');
  }
  const themeIconMobile = document.querySelector('#theme-icon-mobile');
  if (themeIconMobile) {
    themeIconMobile.setAttribute('data-lucide', state.theme === 'dark' ? 'sun' : 'moon');
  }

  // Toggle Mobile Drawer class
  const drawer = document.querySelector('#mobile-drawer');
  if (drawer) {
    if (state.isMobileMenuOpen) {
      drawer.classList.remove('hidden');
    } else {
      drawer.classList.add('hidden');
    }
  }

  // Update Auth CTA button classes
  const authBtn = document.querySelector('#auth-nav-btn');
  if (authBtn) {
    if (state.activeRoute === 'auth') {
      authBtn.className = 'btn btn-sm btn-secondary shadow-sm';
    } else {
      authBtn.className = 'btn btn-sm btn-primary shadow-sm';
    }
  }

  // Dynamic updates for modals
  updateComparisonDrawer();
  
  // Run Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Initialize Swipers for Home view sections
  if (state.activeRoute === 'home' && Swiper) {
    // 1. Blog Swiper (1 slide on mobile, 2 on tablet, 3 on PC)
    const blogSwiperEl = document.querySelector('.blog-swiper');
    if (blogSwiperEl) {
      if (blogSwiperEl.swiper) {
        blogSwiperEl.swiper.destroy(true, true);
      }
      new Swiper('.blog-swiper', {
        modules: [Pagination],
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        pagination: {
          el: '.blog-swiper .swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          }
        }
      });
    }

    // 2. Testimonials Swiper (Autoplay & Loop enabled)
    const testSwiperEl = document.querySelector('.testimonials-swiper');
    if (testSwiperEl) {
      if (testSwiperEl.swiper) {
        testSwiperEl.swiper.destroy(true, true);
      }
      new Swiper('.testimonials-swiper', {
        modules: [Pagination, Autoplay],
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.testimonials-swiper .swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          }
        }
      });
    }
  }
}

// --- Active View Route Orchestrator ---
// --- Active View Route Orchestrator ---
function renderActiveView() {
  switch (state.activeRoute) {
    case 'home':
      return HomeViewTemplate();
    case 'properties':
      return PropertiesViewTemplate();
    case 'property-detail':
      return PropertyDetailViewTemplate();
    case 'project-detail':
      return ProjectDetailViewTemplate();
    case 'about':
      return AboutViewTemplate();
    case 'projects':
      return ProjectsViewTemplate();
    case 'blogs':
      return BlogsViewTemplate();
    case 'blog-detail':
      return BlogDetailViewTemplate();
    case 'contact':
      return ContactViewTemplate();
    case 'auth':
      return AuthViewTemplate();
    case 'affiliate':
      return AffiliateViewTemplate();
    case 'privacy':
      return privacyHtml;
    case 'terms':
      return termsHtml;
    case 'admin':
      return adminHtml;
    case 'customer':
      return renderCustomerPortal(state);
    case 'affiliate-portal':
      return renderAffiliatePortal(state);
    default:
      return HomeViewTemplate();
  }
}

// --- Admin Console Core Helpers ---
function renderAdminLoginView() {
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 text-slate-800 dark:text-slate-200">
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200/20 animate-fade-in p-8 space-y-6 relative">
        
        <!-- Logo -->
        <div class="text-center space-y-2">
          <img src="/image/blueskye logo.png" alt="Blueskye Logo" class="h-16 w-auto mx-auto object-contain mb-3" />
          <span class="text-primary-650 dark:text-primary-400 uppercase tracking-[0.25em] text-[9px] font-black">Security Console</span>
          <h2 class="font-display font-extrabold text-xl text-slate-900 dark:text-white leading-tight">Admin Console Log In</h2>
          <p class="text-[10px] text-slate-450 dark:text-slate-500 font-light">Verification required for employee network access.</p>
        </div>

        <form id="admin-login-form" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Employee Email</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <i class="bx bx-user text-sm"></i>
              </span>
              <input type="email" id="admin-email" value="admin@blueskye.com" required class="form-input text-xs pl-9 bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-white" />
            </div>
          </div>
          
          <div class="space-y-1.5">
            <label class="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Security Password</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <i class="bx bx-lock-alt text-sm"></i>
              </span>
              <input type="password" id="admin-password" placeholder="••••••••" required class="form-input text-xs pl-9 bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-white" />
              <button type="button" id="toggle-admin-pass-visibility" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-650 transition-colors">
                <i class="bx bx-show text-sm" id="admin-pass-eye-icon"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-md btn-primary w-full justify-center mt-2 shadow-md active:scale-98">
            Access System Console
          </button>
        </form>

        <div class="text-center pt-2 border-t border-slate-100 dark:border-slate-850">
          <a href="#home" class="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1">
            <i class="bx bx-arrow-back text-sm"></i> Back to Homepage
          </a>
        </div>

      </div>
    </div>
  `;
}

function getTabFriendlyTitle(tabName) {
  switch (tabName) {
    case 'overview': return 'Overview Dashboard';
    case 'properties-list': return 'Properties List';
    case 'projects-list': return 'Development Projects';
    case 'projects-add': return 'Manage Project Form';
    case 'projects-reports': return 'Project Progress Reports';
    case 'properties-mapping': return 'Land Plot Mapping';
    case 'customers': return 'Customer Database';
    case 'clients-bookings': return 'Tour Bookings';
    case 'clients-messages': return 'Contact Messages';
    case 'sales-list': return 'Sales Catalog';
    case 'sales-installments': return 'Installment Plans';
    case 'sales-payments': return 'Confirmed Payments';
    case 'sales-invoicing': return 'Invoices List';
    case 'partners-directory': return 'Partner Directory';
    case 'partners-ledger': return 'Commission Ledger';
    case 'partners-payouts': return 'Payout Records';
    case 'partners-tree': return 'Affiliate Hierarchy Tree';
    case 'inspections-calendar': return 'Inspection Calendar';
    case 'reports-sales': return 'Sales Summary Reports';
    case 'reports-commissions': return 'Commission Payouts Report';
    case 'reports-performance': return 'Performance Analytics';
    case 'finance-ledger': return 'Payment Ledger (Escrow)';
    case 'staff-accounts': return 'Staff Accounts';
    case 'staff-permissions': return 'Access Permissions';
    case 'blog-write': return 'Write Articles';
    case 'blog-subscribers': return 'News Subscribers';
    case 'settings-profile': return 'Platform Profile Settings';
    case 'settings-affiliate': return 'Affiliate Rules Settings';
    case 'settings-bank': return 'Escrow Bank Setup';
    case 'settings-audit': return 'System Audit Logs';
    case 'properties-add': return 'Manage Property Form';
    default: return 'Admin Console';
  }
}

function initAdminTab(tabName) {
  const titleEl = document.querySelector('#admin-header-title');
  const viewport = document.querySelector('#admin-viewport');
  if (!viewport) return;
  
  if (titleEl) {
    titleEl.innerText = getTabFriendlyTitle(tabName);
  }

  // Sync active classes in sidebar navigation menu
  document.querySelectorAll('#admin-sidebar-menu button').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
      if (btn.classList.contains('admin-submenu-btn')) {
        const parentDiv = btn.closest('div');
        if (parentDiv) {
          parentDiv.classList.remove('hidden');
          const groupName = parentDiv.id.replace('group-', '');
          state.admin.expandedGroups[groupName] = true;
          const toggleBtn = parentDiv.parentElement.querySelector('[data-toggle]');
          const chevron = document.querySelector(`#chevron-${groupName}`);
          if (chevron) chevron.className = 'bx bx-chevron-up text-xs transition-transform duration-200 text-white/60';
        }
      }
    }
  });

  // Restore sidebar expand states on render
  Object.keys(state.admin.expandedGroups).forEach(group => {
    const groupEl = document.querySelector(`#group-${group}`);
    const chevron = document.querySelector(`#chevron-${group}`);
    if (groupEl) {
      if (state.admin.expandedGroups[group]) {
        groupEl.classList.remove('hidden');
        if (chevron) chevron.className = 'bx bx-chevron-up text-xs transition-transform duration-200 text-white/60';
      } else {
        groupEl.classList.add('hidden');
        if (chevron) chevron.className = 'bx bx-chevron-down text-xs transition-transform duration-200 text-white/60';
      }
    }
  });

  // Render tab HTML content
  viewport.innerHTML = renderAdminTabContent(tabName, state, properties, projects, blogs);

  // Sync avatar and name elements on header topbar
  const avatarEl = document.querySelector('#admin-header-avatar');
  const nameEl = document.querySelector('#admin-header-name');
  const roleEl = document.querySelector('#admin-header-role');
  if (avatarEl) {
    const initials = state.admin.staffName.split(' ').map(n => n[0]).join('').substring(0, 2);
    avatarEl.innerText = initials;
  }
  if (nameEl) nameEl.innerText = state.admin.staffName;
  if (roleEl) roleEl.innerText = state.admin.staffRole;

  // Restore dashboard isolated dark theme state
  const container = document.querySelector('#admin-root-container');
  const themeIconEl = document.querySelector('#admin-theme-icon');
  if (container) {
    if (state.admin.theme === 'dark') {
      container.classList.add('dark');
    } else {
      container.classList.remove('dark');
    }
  }
  if (themeIconEl) {
    themeIconEl.className = state.admin.theme === 'dark' ? 'bx bx-sun text-lg' : 'bx bx-moon text-lg';
  }

  // Bind sub-component interactive controls (CRUD listeners, CMS clicks, settings inputs)
  bindAdminTabListeners(tabName, state, properties, projects, blogs, renderApp, initAdminTab);
}

function AffiliateViewTemplate() {
  return affiliateHtml;
}

// --- View Templates ---

// --- View Templates ---

function injectAboutSection(html) {
  return html.replace('<!-- ABOUT_SECTION -->', aboutSectionHtml);
}

function injectPortfolioBenefitsSection(html) {
  return html.replace('<!-- PORTFOLIO_BENEFITS_SECTION -->', portfolioBenefitsHtml);
}

function injectTestimonialsSection(html, testimonialsHtml) {
  const section = testimonialsSectionHtml.replace('<!-- TESTIMONIALS -->', testimonialsHtml);
  return html.replace('<!-- TESTIMONIALS_SECTION -->', section);
}

function injectFaqSection(html) {
  return html.replace('<!-- FAQ_SECTION -->', faqSectionHtml);
}



function getTestimonialsHtml() {
  return TestimonialsData.slice(0, 3).map(test => `
    <div class="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group">
      <!-- Decorative faded quote watermark -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="absolute -top-2 right-4 w-20 h-20 text-blue-500/10 dark:text-blue-400/12 pointer-events-none select-none scale-x-[-1]" aria-hidden="true"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>

      <!-- Gold Stars Rating -->
      <div class="flex gap-1 text-amber-500 mb-4">
        <i class="fa-solid fa-star text-xs"></i>
        <i class="fa-solid fa-star text-xs"></i>
        <i class="fa-solid fa-star text-xs"></i>
        <i class="fa-solid fa-star text-xs"></i>
        <i class="fa-solid fa-star text-xs"></i>
      </div>
      
      <p class="text-slate-600 dark:text-slate-350 text-xs italic leading-relaxed font-light mb-6 grow">
        "${test.quote}"
      </p>
      
      <div class="flex items-center gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
        <img src="${test.image}" alt="${test.author}" class="w-11 h-11 rounded-full object-cover ring-2 ring-primary-500/20" />
        <div>
          <h4 class="font-display font-extrabold text-xs text-slate-850 dark:text-white">${test.author}</h4>
          <span class="text-[10px] text-slate-400 font-medium">${test.title}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function HomeViewTemplate() {
  // Cap to 6 featured properties
  const featuredProps = properties.filter(p => p.featured).slice(0, 6);
  
  // Render featured property cards
  const featuredCardsHtml = featuredProps.map(prop => PropertyCardTemplate(prop)).join('');
  
  const testimonialsHtml = getTestimonialsHtml();

  // Render blog cards — plain 3-col grid (1 on mobile), max 3
  const blogSlidesHtml = blogs.slice(0, 3).map(blog => interpolate(blogCardHtml, blog)).join('');

  let finalHtml = homeHtml;
  finalHtml = finalHtml.replace('<!-- FEATURED_PROPERTIES -->', featuredCardsHtml);
  finalHtml = finalHtml.replace('<!-- BLOGS_SLIDER -->', blogSlidesHtml);
  finalHtml = injectAboutSection(finalHtml);
  finalHtml = injectPortfolioBenefitsSection(finalHtml);
  finalHtml = injectTestimonialsSection(finalHtml, testimonialsHtml);
  finalHtml = injectFaqSection(finalHtml);
  
  return finalHtml;

}

function PropertiesViewTemplate() {
  const filteredProps = getFilteredProperties();
  
  // Paginate items
  const totalItems = filteredProps.length;
  const totalPages = Math.ceil(totalItems / state.propertiesPerPage);
  
  // Safe-guard page index
  if (state.propertiesPage > totalPages && totalPages > 0) {
    state.propertiesPage = totalPages;
  }
  if (state.propertiesPage < 1) {
    state.propertiesPage = 1;
  }
  
  const startIndex = (state.propertiesPage - 1) * state.propertiesPerPage;
  const endIndex = startIndex + state.propertiesPerPage;
  const paginatedProps = filteredProps.slice(startIndex, endIndex);
  
  // Render filtered properties
  let propertiesGridHtml = '';
  if (paginatedProps.length === 0) {
    propertiesGridHtml = `
      <div class="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white border border-slate-205 rounded-md shadow-sm">
        <div class="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
          <i data-lucide="alert-circle" class="w-6 h-6"></i>
        </div>
        <h3 class="font-display font-bold text-sm text-slate-800">No properties matched</h3>
        <p class="text-xs text-slate-400 max-w-xs">Relax your filter terms or click reset to browse all listings.</p>
        <button id="no-results-reset" class="btn btn-sm btn-primary">Reset Filters</button>
      </div>
    `;
  } else {
    // Generate page numbers
    let pageButtonsHtml = '';
    if (totalPages > 1) {
      // Prev arrow
      const prevDisabled = state.propertiesPage === 1 ? 'disabled opacity-50 cursor-not-allowed' : '';
      pageButtonsHtml += `
        <button data-action="change-page" data-page="${state.propertiesPage - 1}" ${prevDisabled} class="h-10 w-10 rounded-md bg-slate-50 text-slate-650 hover:bg-slate-100 flex items-center justify-center font-bold text-xs transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      `;
      
      // Number buttons
      for (let i = 1; i <= totalPages; i++) {
        if (i === state.propertiesPage) {
          pageButtonsHtml += `
            <span class="h-10 w-10 rounded-md bg-primary-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              ${i}
            </span>
          `;
        } else {
          pageButtonsHtml += `
            <button data-action="change-page" data-page="${i}" class="h-10 w-10 rounded-md bg-slate-50 text-slate-650 hover:bg-slate-100 flex items-center justify-center font-bold text-xs transition-colors">
              ${i}
            </button>
          `;
        }
      }
      
      // Next arrow
      const nextDisabled = state.propertiesPage === totalPages ? 'disabled opacity-50 cursor-not-allowed' : '';
      pageButtonsHtml += `
        <button data-action="change-page" data-page="${state.propertiesPage + 1}" ${nextDisabled} class="h-10 w-10 rounded-md bg-slate-50 text-slate-650 hover:bg-slate-100 flex items-center justify-center font-bold text-xs transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      `;
    }
    
    const paginationLayoutHtml = totalPages > 1
      ? `<div class="flex items-center justify-center gap-2 pt-10">${pageButtonsHtml}</div>`
      : '';

    propertiesGridHtml = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${paginatedProps.map(prop => PropertyCardTemplate(prop)).join('')}
      </div>
      ${paginationLayoutHtml}
    `;
  }
  
  let finalHtml = propertiesHtml;
  finalHtml = finalHtml.replace('id="properties-count">0', `id="properties-count">${totalItems}`);
  finalHtml = finalHtml.replace('<!-- PROPERTIES_GRID -->', propertiesGridHtml);
  
  return finalHtml;
}

function PropertyDetailViewTemplate() {
  const prop = state.selectedProperty;
  if (!prop) return `<div class="p-20 text-center text-slate-500 font-bold text-sm">No property selected.</div>`;
  
  const isFavorited = state.favorites.includes(prop.id);
  
  // Estimate monthly mortgage
  const totalAmount = prop.price;
  const downPayment = (totalAmount * state.mortgage.downPaymentPct) / 100;
  const loanAmount = totalAmount - downPayment;
  const monthlyInterestRate = (state.mortgage.interestRate / 100) / 12;
  const numberOfPayments = state.mortgage.loanTermYears * 12;
  let monthlyPayment = 0;
  if (monthlyInterestRate > 0) {
    monthlyPayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  } else {
    monthlyPayment = loanAmount / numberOfPayments;
  }
  const formattedMonthly = isNaN(monthlyPayment) || !isFinite(monthlyPayment)
    ? '₦0'
    : new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(monthlyPayment);

  // Custom Icon Mapper for premium amenities
  const getAmenityIcon = (amenity) => {
    const text = amenity.toLowerCase();
    let path = '<path d="m9 11 3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>'; // check-square
    
    if (text.includes('pool')) {
      path = '<path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/>';
    } else if (text.includes('dock') || text.includes('waterfront')) {
      path = '<circle cx="12" cy="5" r="3"/><path d="M12 22V8M5 12H2M19 12h3M12 22a7 7 0 0 0 7-7M12 22a7 7 0 0 1-7-7"/>';
    } else if (text.includes('cinema') || text.includes('tv')) {
      path = '<rect width="20" height="15" x="2" y="3" rx="2"/><path d="m12 18-4 4M16 22l-4-4"/>';
    } else if (text.includes('power') || text.includes('electricity') || text.includes('solar') || text.includes('hvac') || text.includes('grid')) {
      path = '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>';
    } else if (text.includes('smart') || text.includes('automation')) {
      path = '<rect width="16" height="16" x="4" y="4" rx="2"/><path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/>';
    } else if (text.includes('lift') || text.includes('elevator')) {
      path = '<path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16"/>';
    } else if (text.includes('garage') || text.includes('parking') || text.includes('car')) {
      path = '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>';
    } else if (text.includes('sauna') || text.includes('spa') || text.includes('wellness') || text.includes('gym')) {
      path = '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>';
    } else if (text.includes('security') || text.includes('panic') || text.includes('armed') || text.includes('patrol')) {
      path = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>';
    } else if (text.includes('tennis') || text.includes('court') || text.includes('award')) {
      path = '<circle cx="12" cy="8" r="7"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/>';
    } else if (text.includes('garden') || text.includes('views') || text.includes('scenic') || text.includes('view') || text.includes('hilltop') || text.includes('land')) {
      path = '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2zm0 0v-5-2"/>';
    }
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-primary-600 shrink-0">${path}</svg>`;
  };

  // Generate amenities checklist with custom mapped icons
  const amenitiesListHtml = prop.amenities.map(amenity => `
    <div class="flex items-center gap-2">
      ${getAmenityIcon(amenity)}
      <span class="font-medium text-slate-700">${amenity}</span>
    </div>
  `).join('');

  // Slices & template strings for active media gallery
  const isVideoSelected = state.selectedImageIndex === 8;
  const featuredMediaHtml = isVideoSelected
    ? `<video src="${prop.video}" class="w-full h-full object-cover" autoplay loop muted controls></video>`
    : `<img src="${prop.images[state.selectedImageIndex] || prop.images[0]}" alt="${prop.title}" class="w-full h-full object-cover" />`;

  // Render 8 thumbnails
  let thumbsHtml = prop.images.map((img, i) => {
    const activeBorder = (state.selectedImageIndex === i) ? 'border-2 border-primary-600' : 'border border-slate-200/50';
    return `
      <div class="w-24 h-16 md:w-full md:h-[170px] rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-all shrink-0 relative ${activeBorder}" data-action="set-image" data-index="${i}">
        <img src="${img}" class="w-full h-full object-cover" />
      </div>
    `;
  }).join('');

  // Add 9th thumbnail for the video
  const videoThumbActive = isVideoSelected ? 'border-2 border-primary-600' : 'border border-slate-200/50';
  thumbsHtml += `
    <div class="w-24 h-16 md:w-full md:h-[170px] rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-all shrink-0 relative bg-slate-950 ${videoThumbActive}" data-action="set-image" data-index="8">
      <img src="${prop.images[0]}" class="w-full h-full object-cover opacity-60" />
      <div class="absolute inset-0 flex items-center justify-center bg-black/40">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-white"><path d="M8 5v14l11-7z"/></svg>
      </div>
    </div>
  `;

  let purchaseCtaText = 'Buy Now';
  let purchaseActionText = 'Order Now (Buy Now)';
  let purchaseBtnClass = 'bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md active:scale-95';
  let purchaseDisabledAttr = '';
  let statusBadgeClass = 'bg-primary-600';

  if (prop.status === 'Sold') {
    purchaseCtaText = 'Sold';
    purchaseActionText = 'Sold / Archived';
    purchaseBtnClass = 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed pointer-events-none';
    purchaseDisabledAttr = 'disabled';
    statusBadgeClass = 'bg-red-600';
  } else if (prop.status === 'For Rent') {
    purchaseCtaText = 'Rent Now';
    purchaseActionText = 'Order Now (Rent Now)';
    statusBadgeClass = 'bg-emerald-600';
  } else if (prop.status === 'For Sale') {
    purchaseCtaText = 'Buy Now';
    purchaseActionText = 'Order Now (Buy Now)';
    statusBadgeClass = 'bg-primary-600';
  }

  // Generate similar properties grid list
  let similar = properties.filter(p => p.id !== prop.id && (p.type === prop.type || p.city === prop.city));
  if (similar.length < 3) {
    const ids = similar.map(s => s.id);
    const fallbacks = properties.filter(p => p.id !== prop.id && !ids.includes(p.id));
    similar = [...similar, ...fallbacks];
  }
  similar = similar.slice(0, 3);
  const similarPropertiesHtml = similar.map(p => PropertyCardTemplate(p)).join('');

  const viewData = {
    ...prop,
    favClass: isFavorited ? 'fill-primary-600 text-primary-600' : '',
    formattedMonthly,
    downpaymentPct: state.mortgage.downPaymentPct,
    purchaseCtaText,
    purchaseActionText,
    purchaseBtnClass,
    purchaseDisabledAttr,
    statusBadgeClass,
    amenitiesListHtml,
    featuredMediaHtml,
    thumbnailsHtml: thumbsHtml,
    similarPropertiesHtml,
    currentImageTitle: prop.imageTitles[state.selectedImageIndex] || 'Media Room'
  };
  
  return interpolate(propertyDetailViewHtml, viewData);
}

function ProjectDetailViewTemplate() {
  const proj = state.selectedProject;
  if (!proj) return `<div class="p-20 text-center text-slate-500 font-bold text-sm">No project selected.</div>`;
  
  // Custom Icon Mapper for premium project features
  const projectAmenities = [
    "Smart Security Cameras",
    "Gated Estate Patrol",
    "24/7 Grid Solar Power",
    "Paved Access Road Networks",
    "Central Sewage & Water Treatment",
    "Fiber Optic Telecom Lines"
  ];
  
  const amenitiesListHtml = projectAmenities.map(amenity => `
    <div class="flex items-center gap-2">
      <i class="bx bx-check-square text-primary-500 text-sm"></i>
      <span class="font-medium text-slate-700 dark:text-slate-350">${amenity}</span>
    </div>
  `).join('');

  // active media gallery logic (reset index bounds dynamically)
  const safeIndex = state.selectedImageIndex % (proj.images.length || 1);
  const featuredMediaHtml = `<img src="${proj.images[safeIndex] || proj.images[0]}" alt="${proj.title}" class="w-full h-full object-cover" />`;

  // Render project image thumbnails
  let thumbsHtml = proj.images.map((img, i) => {
    const activeBorder = (safeIndex === i) ? 'border-2 border-primary-600' : 'border border-slate-200/50';
    return `
      <div class="w-24 h-16 md:w-full md:h-[120px] rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-all shrink-0 relative ${activeBorder}" data-action="set-image" data-index="${i}">
        <img src="${img}" class="w-full h-full object-cover" />
      </div>
    `;
  }).join('');

  const viewData = {
    ...proj,
    amenitiesListHtml,
    featuredMediaHtml,
    thumbnailsHtml: thumbsHtml,
    currentImageTitle: proj.imageTitles[safeIndex] || 'Development View'
  };
  
  return interpolate(projectDetailViewHtml, viewData);
}


function AboutViewTemplate() {
  const testimonialsHtml = getTestimonialsHtml();
  let html = aboutHtml;
  html = injectAboutSection(html);
  html = injectPortfolioBenefitsSection(html);
  html = injectTestimonialsSection(html, testimonialsHtml);
  html = injectFaqSection(html);
  return html;
}



function ProjectsViewTemplate() {
  let filtered = [...projects];
  if (state.projectFilters.city !== 'all') {
    filtered = filtered.filter(p => p.city.toLowerCase() === state.projectFilters.city.toLowerCase());
  }
  if (state.projectFilters.status !== 'all') {
    filtered = filtered.filter(p => p.status === state.projectFilters.status);
  }
  
  const cardsHtml = filtered.length > 0
    ? filtered.map(proj => {
        const renderData = {
          ...proj,
          image: proj.images && proj.images.length > 0 ? proj.images[0] : ''
        };
        return interpolate(projectCardHtml, renderData);
      }).join('')
    : `<div class="col-span-full text-center py-16 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800 rounded-xl p-8 shadow-sm">No developments found matching these filters.</div>`;
    
  let html = projectsHtml.replace('<!-- PROJECTS_GRID -->', cardsHtml);
  
  // Set selected state for filters dropdowns in HTML template
  html = html.replace(`value="${state.projectFilters.city}"`, `value="${state.projectFilters.city}" selected`);
  html = html.replace(`value="${state.projectFilters.status}"`, `value="${state.projectFilters.status}" selected`);
  
  return html;
}



function BlogsViewTemplate() {
  const blogsCardsHtml = blogs.map(blog => interpolate(blogCardHtml, blog)).join('');
  return blogsHtml.replace('<!-- BLOGS_LIST -->', blogsCardsHtml);
}

// --- Block-based Blog Content Compiler ---
function renderBlogBlocks(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';
  
  return blocks.map(block => {
    switch (block.type) {
      case 'heading':
        const tag = `h${block.level || 3}`;
        return `<${tag} class="font-display font-extrabold text-slate-850 dark:text-white mt-6 mb-3 text-lg sm:text-xl leading-tight">${block.text}</${tag}>`;
        
      case 'paragraph':
        return `<p class="leading-relaxed mb-4 text-slate-600 dark:text-slate-400 font-light text-sm">${block.text}</p>`;
        
      case 'quote':
        return `
          <blockquote class="border-l-4 border-primary-500 pl-4 py-2 italic text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/30 rounded-r-lg my-6">
            <p class="mb-1 leading-relaxed text-sm">"${block.text}"</p>
            ${block.author ? `<cite class="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mt-1">— ${block.author}</cite>` : ''}
          </blockquote>
        `;
        
      case 'image':
        return `
          <div class="my-6 space-y-2 group">
            <div class="rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800/80 aspect-16/10 max-h-[360px]">
              <img src="${block.url}" alt="${block.caption || ''}" class="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500" />
            </div>
            ${block.caption ? `<p class="text-[10px] text-center text-slate-400 dark:text-slate-500 font-medium italic">${block.caption}</p>` : ''}
          </div>
        `;
        
      case 'gallery':
        const colsClass = block.columns === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2';
        const galleryItems = block.images.map(img => `
          <div class="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-sm aspect-4/3 group">
            <img src="${img}" alt="Gallery photo" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550" />
          </div>
        `).join('');
        return `
          <div class="grid ${colsClass} gap-4 my-6">
            ${galleryItems}
          </div>
        `;
        
      case 'callout':
        let bgStyle = 'bg-primary-50/40 dark:bg-primary-950/10 border-primary-500/30 text-slate-700 dark:text-slate-300';
        let icon = 'bx bx-info-circle text-primary-500 text-base';
        if (block.style === 'warning') {
          bgStyle = 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-500/30 text-slate-700 dark:text-slate-300';
          icon = 'bx bx-error text-amber-500 text-base';
        } else if (block.style === 'tip') {
          bgStyle = 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-500/30 text-slate-700 dark:text-slate-300';
          icon = 'bx bx-check-circle text-emerald-500 text-base';
        }
        return `
          <div class="flex gap-3 border-l-4 p-4 rounded-r-lg my-6 ${bgStyle}">
            <i class="${icon} shrink-0 mt-0.5"></i>
            <p class="text-xs font-medium leading-relaxed">${block.text}</p>
          </div>
        `;
        
      case 'list':
        const listItems = block.items.map(item => `
          <li class="flex items-start gap-2 text-slate-650 dark:text-slate-400 font-light text-sm">
            <span class="text-primary-500 font-bold mt-0.5">•</span>
            <span>${item}</span>
          </li>
        `).join('');
        return `<ul class="space-y-2.5 my-4 pl-1">${listItems}</ul>`;
        
      default:
        return '';
    }
  }).join('');
}

function BlogDetailViewTemplate() {
  const blog = state.selectedBlog;
  if (!blog) return `<div class="p-20 text-center text-slate-500 font-bold text-sm">No blog selected.</div>`;
  
  // Filter the other blogs (up to 4) as related articles
  const related = blogs.filter(b => b.id !== blog.id).slice(0, 4);
  const relatedArticlesHtml = related.map(rel => `
    <div class="flex gap-3 items-center group">
      <img src="${rel.image}" alt="${rel.title}" class="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-100 dark:border-slate-800/60 shadow-sm" />
      <div class="min-w-0 grow">
        <a href="#blog-detail?id=${rel.id}" class="font-display font-extrabold text-[11px] text-slate-850 dark:text-white hover:text-primary-600 block truncate leading-tight transition-colors">
          ${rel.title}
        </a>
        <span class="text-[8px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">${rel.date}</span>
        <p class="text-[10px] text-slate-450 dark:text-slate-550 truncate mt-0.5 leading-none">
          ${rel.excerpt}
        </p>
      </div>
    </div>
  `).join('<hr class="border-slate-100 dark:border-slate-800/40 my-3" />');

  // Render blocks dynamically with fallback to content body
  const renderedContent = blog.blocks ? renderBlogBlocks(blog.blocks) : blog.content;

  const viewData = {
    ...blog,
    content: renderedContent,
    relatedArticlesHtml
  };
  
  return interpolate(blogDetailViewHtml, viewData);
}

function ContactViewTemplate() {
  return contactHtml;
}

function AuthViewTemplate() {
  return authHtml;
}

function PropertyCardTemplate(prop) {
  const isCompared = state.comparedPropertyIds.includes(prop.id);
  const compareIconSvg = isCompared
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-primary-600"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m9 12 2 2 4-4"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-slate-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>`;

  let purchaseCtaText = 'Buy Now';
  let purchaseBtnClass = 'btn-primary';
  let purchaseDisabledAttr = '';
  let statusBadgeClass = 'bg-primary-600';

  if (prop.status === 'Sold') {
    purchaseCtaText = 'Sold';
    purchaseBtnClass = 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed pointer-events-none';
    purchaseDisabledAttr = 'disabled';
    statusBadgeClass = 'bg-red-600';
  } else if (prop.status === 'For Rent') {
    purchaseCtaText = 'Rent Now';
    statusBadgeClass = 'bg-emerald-600';
  } else if (prop.status === 'For Sale') {
    purchaseCtaText = 'Buy Now';
    statusBadgeClass = 'bg-primary-600';
  }

  const cardData = {
    ...prop,
    imageUrl: prop.images[0],
    isFavoritedClass: state.favorites.includes(prop.id) ? 'fill-primary-600 text-primary-600' : 'fill-none text-slate-600 dark:text-slate-350',
    compareIconSvg,
    purchaseCtaText,
    purchaseBtnClass,
    purchaseDisabledAttr,
    statusBadgeClass
  };
  return interpolate(propertyCardHtml, cardData);
}

// --- Comparison Drawer ---
function updateComparisonDrawer() {
  const container = document.querySelector('#sidebar-comparison-container') || document.querySelector('#comparison-drawer-container');
  if (!container) return;
  
  if (state.comparedPropertyIds.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  const selectedList = properties.filter(p => state.comparedPropertyIds.includes(p.id));
  
  // Render selected items tags
  const selectedItemsHtml = selectedList.map(item => `
    <div class="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-md">
      <div class="flex items-center gap-2">
        <img src="${item.images[0]}" alt="${item.title}" class="w-8 h-8 rounded object-cover" />
        <div class="truncate max-w-[140px]">
          <span class="text-xs font-bold text-slate-850 block truncate">${item.title}</span>
          <span class="text-[10px] text-slate-500 font-semibold block">${item.formattedPrice}</span>
        </div>
      </div>
      <button data-action="remove-compare" data-id="${item.id}" class="text-slate-400 hover:text-red-500 transition-colors p-1">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>
  `).join('');

  const finalHtml = `
    <div class="bg-white p-5 rounded-md shadow-lg space-y-4 animate-fade-in">
      <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div class="h-8 w-8 rounded bg-primary-50 text-primary-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
        </div>
        <div>
          <h4 class="font-display font-bold text-xs text-slate-800 uppercase tracking-wider">Comparison List</h4>
          <p class="text-[10px] text-slate-400 font-medium">Up to 3 listings to compare</p>
        </div>
      </div>
      
      <div class="flex flex-col gap-2">
        ${selectedItemsHtml}
      </div>
      
      <div class="flex items-center gap-2 pt-2">
        <button id="clear-compare" class="text-xs uppercase font-bold tracking-widest text-slate-400 hover:text-slate-650 w-1/2 py-2 rounded-md text-center transition-colors">
          Clear
        </button>
        <button id="trigger-compare-modal" class="btn btn-sm btn-primary w-1/2 justify-center py-2 text-xs">
          Compare (${selectedList.length}/3)
        </button>
      </div>
    </div>
  `;
  
  container.innerHTML = finalHtml;
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// --- Detail Modal ---
// Detail Modal is replaced by dedicated details page view (property-detail)

// --- Comparison Modal Table ---
function updateComparisonModal(open = false) {
  const container = document.querySelector('#comparison-modal-container');
  if (!open || state.comparedPropertyIds.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  const selectedList = properties.filter(p => state.comparedPropertyIds.includes(p.id));
  
  const headersHtml = `
    <th class="py-3 px-2 text-slate-400 font-bold uppercase tracking-wider">Features</th>
    ${selectedList.map(item => `<th class="py-3 px-2 font-display font-bold text-slate-800 dark:text-white">${item.title}</th>`).join('')}
  `;
  
  const rowsHtml = `
    <tr><td class="py-2.5 px-2 font-bold uppercase text-[9px] tracking-wider text-slate-400">Price</td>${selectedList.map(item => `<td class="py-2.5 px-2 font-semibold text-primary-600">${item.formattedPrice}</td>`).join('')}</tr>
    <tr><td class="py-2.5 px-2 font-bold uppercase text-[9px] tracking-wider text-slate-400">Location</td>${selectedList.map(item => `<td class="py-2.5 px-2 font-light">${item.city}</td>`).join('')}</tr>
    <tr><td class="py-2.5 px-2 font-bold uppercase text-[9px] tracking-wider text-slate-400">Type</td>${selectedList.map(item => `<td class="py-2.5 px-2 font-light">${item.type}</td>`).join('')}</tr>
    <tr><td class="py-2.5 px-2 font-bold uppercase text-[9px] tracking-wider text-slate-400">Rooms</td>${selectedList.map(item => `<td class="py-2.5 px-2 font-light">${item.beds} Beds / ${item.baths} Baths</td>`).join('')}</tr>
    <tr><td class="py-2.5 px-2 font-bold uppercase text-[9px] tracking-wider text-slate-400">Area</td>${selectedList.map(item => `<td class="py-2.5 px-2 font-light">${item.area} Sqft</td>`).join('')}</tr>
  `;

  let finalHtml = comparisonModalHtml;
  finalHtml = finalHtml.replace('<!-- COMPARE_HEADERS -->', headersHtml);
  finalHtml = finalHtml.replace('<!-- COMPARE_ROWS -->', rowsHtml);
  
  container.innerHTML = finalHtml;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// --- Data Filtering Helper ---
function getFilteredProperties() {
  let result = [...properties];
  const filters = state.searchFilters;
  
  if (filters.query.trim()) {
    const q = filters.query.toLowerCase();
    result = result.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  }
  
  if (filters.city !== 'all') {
    result = result.filter(item => item.city.toLowerCase() === filters.city.toLowerCase());
  }
  
  if (filters.type !== 'all') {
    result = result.filter(item => item.type.toLowerCase() === filters.type.toLowerCase());
  }

  if (filters.status !== 'all') {
    result = result.filter(item => item.status === filters.status);
  }

  if (filters.minPrice !== 'all') {
    result = result.filter(item => item.price >= parseInt(filters.minPrice));
  }

  if (filters.maxPrice !== 'all') {
    result = result.filter(item => item.price <= parseInt(filters.maxPrice));
  }

  if (filters.minSize !== 'all') {
    result = result.filter(item => item.area >= parseInt(filters.minSize));
  }

  if (filters.maxSize !== 'all') {
    result = result.filter(item => item.area <= parseInt(filters.maxSize));
  }
  
  if (state.sortBy === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'area-desc') {
    result.sort((a, b) => b.area - a.area);
  }
  
  return result;
}

// --- Event Handlers & Routing Delegation ---
function setupEventListeners() {
  const root = document.querySelector('#app');
  
  root.addEventListener('click', (e) => {
    // 1. Mobile Menu Hamburger toggle
    const hamburger = e.target.closest('#mobile-menu-toggle');
    if (hamburger) {
      state.isMobileMenuOpen = true;
      renderApp();
      return;
    }
    
    // 2. Mobile Menu close
    const closeBtn = e.target.closest('#mobile-menu-close');
    const overlay = e.target.closest('#mobile-drawer-overlay');
    if (closeBtn || overlay) {
      state.isMobileMenuOpen = false;
      renderApp();
      return;
    }
    
    // 3. Theme toggle clicks
    const themeBtn = e.target.closest('#theme-toggle') || e.target.closest('#theme-toggle-mobile');
    if (themeBtn) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('blueskye_theme', state.theme);
      if (state.theme === 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      renderApp();
      return;
    }

    // FAQ Accordion click toggles with smooth transition & single-open logic
    const faqHeader = e.target.closest('[data-action="toggle-faq-accordion"]');
    if (faqHeader) {
      const parent = faqHeader.parentElement;
      const content = parent.querySelector('.faq-content');
      const icon = faqHeader.querySelector('span i');
      const isAlreadyOpen = !content.classList.contains('max-h-0');
      
      // Close all other accordions first
      document.querySelectorAll('.faq-content').forEach(item => {
        item.classList.add('max-h-0');
        item.classList.remove('pb-5');
        const otherHeader = item.previousElementSibling;
        if (otherHeader) {
          otherHeader.classList.remove('rounded-t-md');
          otherHeader.classList.add('rounded-md');
          const otherIcon = otherHeader.querySelector('span i');
          if (otherIcon) {
            otherIcon.className = 'bx bx-plus text-base';
          }
        }
      });
      
      // Toggle this one
      if (!isAlreadyOpen) {
        content.classList.remove('max-h-0');
        content.classList.add('pb-5');
        faqHeader.classList.remove('rounded-md');
        faqHeader.classList.add('rounded-t-md');
        if (icon) {
          icon.className = 'bx bx-minus text-base';
        }
      }
      
      return;
    }

    // 4. Favorites list quick toggle
    const favToggle = e.target.closest('[data-action="toggle-fav"]');
    if (favToggle) {
      e.preventDefault();
      const id = parseInt(favToggle.getAttribute('data-id'));
      const idx = state.favorites.indexOf(id);
      if (idx > -1) {
        state.favorites.splice(idx, 1);
      } else {
        state.favorites.push(id);
      }
      localStorage.setItem('blueskye_favorites', JSON.stringify(state.favorites));
      renderApp();
      return;
    }

    // 5. Category Quick Filters
    const filterCat = e.target.closest('[data-action="filter-category"]');
    if (filterCat) {
      const cat = filterCat.getAttribute('data-category');
      state.searchFilters = {
        query: '',
        city: 'all',
        type: cat,
        priceRange: 'all',
        beds: 'all',
        status: 'all'
      };
      window.location.hash = '#properties';
      return;
    }

    // 6. Comparison Checkboxes toggle
    const compToggle = e.target.closest('[data-action="toggle-compare"]');
    if (compToggle) {
      const id = parseInt(compToggle.getAttribute('data-id'));
      const idx = state.comparedPropertyIds.indexOf(id);
      if (idx > -1) {
        state.comparedPropertyIds.splice(idx, 1);
      } else {
        if (state.comparedPropertyIds.length >= 3) {
          alert("You can compare a maximum of 3 properties.");
          return;
        }
        state.comparedPropertyIds.push(id);
      }
      renderApp();
      return;
    }
    
    // Remove comparison item from drawer
    const removeCompareBtn = e.target.closest('[data-action="remove-compare"]');
    if (removeCompareBtn) {
      const id = parseInt(removeCompareBtn.getAttribute('data-id'));
      const idx = state.comparedPropertyIds.indexOf(id);
      if (idx > -1) {
        state.comparedPropertyIds.splice(idx, 1);
      }
      renderApp();
      return;
    }
    
    if (e.target.id === 'clear-compare') {
      state.comparedPropertyIds = [];
      renderApp();
      return;
    }



    // Trigger comparison list modal
    if (e.target.id === 'trigger-compare-modal') {
      updateComparisonModal(true);
      return;
    }
    if (e.target.id === 'close-compare-modal' || e.target.closest('#close-compare-modal')) {
      updateComparisonModal(false);
      return;
    }

    // 7. View detail page click
    const detailsTrigger = e.target.closest('[data-action="view-details"]');
    if (detailsTrigger) {
      const id = parseInt(detailsTrigger.getAttribute('data-id'));
      state.selectedImageIndex = 0;
      window.location.hash = `#property-detail?id=${id}`;
      return;
    }

    // Big featured image chevron clicks
    const detailPrev = e.target.closest('[data-action="detail-prev-slide"]');
    const detailNext = e.target.closest('[data-action="detail-next-slide"]');
    if (detailPrev || detailNext) {
      const activeItem = state.selectedProperty || state.selectedProject;
      if (activeItem && activeItem.images) {
        const totalImages = activeItem.images.length;
        if (detailPrev) {
          state.selectedImageIndex = (state.selectedImageIndex - 1 + totalImages) % totalImages;
        } else {
          state.selectedImageIndex = (state.selectedImageIndex + 1) % totalImages;
        }
        
        // Update the big image src inside #detail-featured-media-container
        const imgEl = document.querySelector('#detail-featured-media-container img');
        if (imgEl) {
          imgEl.src = activeItem.images[state.selectedImageIndex];
          imgEl.className = 'w-full h-full object-cover animate-fade-in';
        }
        
        // Update title overlay
        const titleEl = document.querySelector('#detail-image-title');
        if (titleEl && activeItem.imageTitles) {
          titleEl.innerText = activeItem.imageTitles[state.selectedImageIndex] || 'Media Room';
        }
        
        // Sync active border on thumbnails
        const allThumbs = document.querySelectorAll('[data-action="set-image"]');
        allThumbs.forEach(thumb => {
          const currentIdx = parseInt(thumb.getAttribute('data-index'));
          if (currentIdx === state.selectedImageIndex) {
            thumb.classList.add('border-2', 'border-primary-600');
            thumb.classList.remove('border', 'border-slate-200/50');
          } else {
            thumb.classList.remove('border-2', 'border-primary-600');
            thumb.classList.add('border', 'border-slate-200/50');
          }
        });
      }
      return;
    }

    // Image thumbnail selection inside details views (smooth DOM updates without page refresh)
    const setImageTrigger = e.target.closest('[data-action="set-image"]');
    if (setImageTrigger) {
      const idx = parseInt(setImageTrigger.getAttribute('data-index'));
      state.selectedImageIndex = idx;
      
      const mediaContainer = document.querySelector('#detail-featured-media-container');
      const activeItem = state.selectedProperty || state.selectedProject;
      if (mediaContainer && activeItem) {
        if (idx === 8 && state.selectedProperty) {
          mediaContainer.innerHTML = `
            <video src="${activeItem.video}" class="w-full h-full object-cover" autoplay loop muted controls></video>
            <div class="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-[9px] uppercase font-bold tracking-wider z-10 border border-white/5 flex items-center gap-1.5 shadow">
              <i class="bx bx-image-alt text-primary-400 text-xs"></i>
              <span id="detail-image-title">${activeItem.imageTitles[idx] || 'Media Room'}</span>
            </div>
            <button data-action="detail-prev-slide" class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white h-10 w-10 rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 z-10">
              <i class="bx bx-chevron-left text-2xl"></i>
            </button>
            <button data-action="detail-next-slide" class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white h-10 w-10 rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 z-10">
              <i class="bx bx-chevron-right text-2xl"></i>
            </button>
          `;
        } else {
          mediaContainer.innerHTML = `
            <img src="${activeItem.images[idx]}" class="w-full h-full object-cover animate-fade-in" />
            <div class="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-[9px] uppercase font-bold tracking-wider z-10 border border-white/5 flex items-center gap-1.5 shadow">
              <i class="bx bx-image-alt text-primary-400 text-xs"></i>
              <span id="detail-image-title">${activeItem.imageTitles[idx] || 'Media Room'}</span>
            </div>
            <button data-action="detail-prev-slide" class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white h-10 w-10 rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 z-10">
              <i class="bx bx-chevron-left text-2xl"></i>
            </button>
            <button data-action="detail-next-slide" class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white h-10 w-10 rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 z-10">
              <i class="bx bx-chevron-right text-2xl"></i>
            </button>
          `;
        }
      }
      
      // Update border active classes on thumbnails list
      const allThumbs = document.querySelectorAll('[data-action="set-image"]');
      allThumbs.forEach(thumb => {
        const currentIdx = parseInt(thumb.getAttribute('data-index'));
        if (currentIdx === idx) {
          thumb.classList.add('border-2', 'border-primary-600');
          thumb.classList.remove('border', 'border-slate-200/50');
        } else {
          thumb.classList.remove('border-2', 'border-primary-600');
          thumb.classList.add('border', 'border-slate-200/50');
        }
      });
      return;
    }

    const purchaseTrigger = e.target.closest('[data-action="purchase-direct"]');
    if (purchaseTrigger) {
      const id = parseInt(purchaseTrigger.getAttribute('data-id'));
      const prop = properties.find(p => p.id === id);
      openOrderWizardModal(prop);
      return;
    }

    // Intercept clicks on links pointing to #auth
    const authLink = e.target.closest('[href="#auth"]');
    if (authLink) {
      e.preventDefault();
      state.isMobileMenuOpen = false;
      
      const mobileDrawer = document.querySelector('#mobile-drawer');
      if (mobileDrawer) {
        mobileDrawer.classList.add('hidden');
      }
      
      const text = authLink.innerText.toLowerCase();
      if (text.includes('affiliate') || text.includes('partner') || state.activeRoute === 'affiliate') {
        if (text.includes('login') || text.includes('sign in')) {
          openAffiliateAuthModal('login');
        } else {
          openAffiliateAuthModal('register');
        }
      } else {
        if (text.includes('register') || text.includes('sign up') || text.includes('create')) {
          openClientAuthModal('register');
        } else {
          openClientAuthModal('login');
        }
      }
      return;
    }

    // Legal document preview popup
    const previewTrigger = e.target.closest('[data-action="preview-doc"]');
    if (previewTrigger) {
      const docTitle = previewTrigger.getAttribute('data-doc');
      const prop = state.selectedProperty || properties[0];
      
      const modal = document.createElement('div');
      modal.id = 'doc-preview-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4';
      modal.innerHTML = `
        <div class="bg-white rounded-md shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200/20 animate-fade-in text-slate-700">
          <div class="p-4 border-b border-slate-100 flex items-center justify-between">
            <h4 class="font-display font-extrabold text-xs text-slate-800 uppercase tracking-wider">${docTitle}</h4>
            <button id="close-doc-preview" class="text-slate-400 hover:text-slate-650 transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="p-8 overflow-y-auto space-y-6 bg-slate-50 font-serif text-slate-600 leading-relaxed text-[11px] select-none relative">
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none rotate-45">
              <span class="text-5xl font-sans font-bold uppercase tracking-widest text-slate-800">Blueskye Escrow</span>
            </div>
            
            <div class="text-center space-y-2 font-sans">
              <div class="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-5 h-5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h2 class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Federal Republic of Nigeria</h2>
              <p class="text-[8px] uppercase tracking-widest text-slate-500 font-bold">Land Registry Document Service</p>
            </div>
            
            <div class="border-t-2 border-double border-slate-300 pt-6 space-y-4">
              <div class="flex justify-between font-sans text-[9px] text-slate-500 font-bold">
                <span>Doc No: FGN/LND/REG-${prop.id}9482</span>
                <span>Date Filed: 12/04/2025</span>
              </div>
              <p class="text-center font-bold uppercase tracking-wider text-xs font-sans">OFFICIAL DEED OF CERTIFICATE</p>
              <p>THIS CERTIFIES THAT the leasehold property situated at <strong>${prop.location}, ${prop.city}</strong> has been registered under the Lands Act, with all titles matching survey plan and registered covenants verified by Blueskye Escrow Services.</p>
              <p>THE LEASEHOLDER hereby enjoys rights of absolute ownership under the registered C of O provisions. Blueskye Shield Escrow confirms zero liens, zero encumbrances, and fully settled property taxes on the deed.</p>
            </div>

            <div class="pt-8 flex justify-between items-end border-t border-slate-200 font-sans">
              <div class="text-center space-y-1">
                <div class="h-8 w-20 border border-dashed border-slate-300 rounded flex items-center justify-center font-serif text-[9px] italic text-slate-400">Official Seal</div>
                <span class="text-[7px] text-slate-400 font-bold block uppercase">Ministry of Lands</span>
              </div>
              <div class="text-center space-y-1">
                <div class="font-serif italic text-primary-600 text-[10px] tracking-wider font-bold">Blueskye Escrows</div>
                <span class="text-[7px] text-slate-400 font-bold block uppercase">Registrar of Deeds</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button id="close-doc-preview-btn" class="btn btn-sm btn-primary py-1.5 px-4 text-xs font-bold rounded-md">Close Preview</button>
          </div>
        </div>
      `;
      root.appendChild(modal);
      return;
    }

    if (e.target.id === 'close-doc-preview' || e.target.closest('#close-doc-preview') || e.target.id === 'close-doc-preview-btn' || e.target.id === 'doc-preview-modal') {
      const modal = document.querySelector('#doc-preview-modal');
      if (modal) {
        modal.remove();
      }
      return;
    }

    const pageBtn = e.target.closest('[data-action="change-page"]');
    if (pageBtn && !pageBtn.hasAttribute('disabled')) {
      const page = parseInt(pageBtn.getAttribute('data-page'));
      state.propertiesPage = page;
      renderApp();
      const gridEl = document.querySelector('#properties-grid-container');
      if (gridEl) {
        gridEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return;
    }

    if (e.target.id === 'affiliate-join-btn' || e.target.id === 'affiliate-login-btn') {
      alert("Thank you for your interest! The Blueskye Affiliate onboarding system will launch in Q3 2026. Your notification request has been logged.");
      return;
    }

    // Project slider chevron clicks
    const prevBtn = e.target.closest('[data-action="project-prev-slide"]');
    const nextBtn = e.target.closest('[data-action="project-next-slide"]');
    if (prevBtn || nextBtn) {
      const btn = prevBtn || nextBtn;
      const cardEl = btn.closest('[data-project-card]');
      const id = parseInt(cardEl.getAttribute('data-id'));
      const proj = projects.find(p => p.id === id);
      if (proj && proj.images) {
        let activeIdx = parseInt(cardEl.getAttribute('data-active-index') || '0');
        if (prevBtn) {
          activeIdx = (activeIdx - 1 + proj.images.length) % proj.images.length;
        } else {
          activeIdx = (activeIdx + 1) % proj.images.length;
        }
        cardEl.setAttribute('data-active-index', activeIdx);
        
        // Update image src
        const imgEl = cardEl.querySelector('.project-slide-img');
        if (imgEl) {
          imgEl.src = proj.images[activeIdx];
        }
        
        // Update counter label
        const countEl = cardEl.querySelector('.project-slide-count');
        if (countEl) {
          countEl.innerText = `Photo ${activeIdx + 1} of ${proj.images.length}`;
        }
      }
      return;
    }

    // Project card & advisor interaction click actions
    if (e.target.closest('[data-action="call-advisor"]')) {
      alert("Connecting with a Blueskye Development Executive... Dialing +234 (0) 81 2345 6789");
      return;
    }

    if (e.target.id === 'project-advisor-btn') {
      alert("Thank you! A senior development analyst will contact you at your registered email/phone within 2 hours to coordinate a private site review.");
      return;
    }

    if (e.target.closest('[data-action="jv-proposal-btn"]')) {
      alert("Opening joint venture proposal submission portal... Please prepare your layout survey plan, land deed certification, and topographic logs.");
      return;
    }

    if (e.target.closest('[data-action="advertise-btn"]')) {
      alert("Accessing seller onboarding services... An agency consultant will contact you to perform listing verification before publication.");
      return;
    }

    if (e.target.closest('[data-action="view-project"]')) {
      const id = parseInt(e.target.closest('[data-action="view-project"]').getAttribute('data-id'));
      state.selectedImageIndex = 0;
      window.location.hash = `#project-detail?id=${id}`;
      return;
    }

    const cardEl = e.target.closest('[data-project-card]');
    if (cardEl) {
      const id = parseInt(cardEl.getAttribute('data-id'));
      state.selectedImageIndex = 0;
      window.location.hash = `#project-detail?id=${id}`;
      return;
    }

    // Toggle Admin Password Visibility
    const togglePassBtn = e.target.closest('#toggle-admin-pass-visibility');
    if (togglePassBtn) {
      const passInput = document.querySelector('#admin-password');
      const eyeIcon = document.querySelector('#admin-pass-eye-icon');
      if (passInput && eyeIcon) {
        if (passInput.type === 'password') {
          passInput.type = 'text';
          eyeIcon.className = 'bx bx-hide text-sm';
        } else {
          passInput.type = 'password';
          eyeIcon.className = 'bx bx-show text-sm';
        }
      }
      return;
    }

    // Admin Sidebar Toggle Click Handlers (Responsive Collapse & Mobile Overlay)
    const sidebarToggleBtn = e.target.closest('#admin-sidebar-toggle');
    if (sidebarToggleBtn) {
      e.preventDefault();
      const sidebar = document.querySelector('#admin-sidebar');
      const overlay = document.querySelector('#admin-sidebar-overlay');
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
      return;
    }

    const overlayEl = e.target.closest('#admin-sidebar-overlay');
    if (overlayEl) {
      e.preventDefault();
      const sidebar = document.querySelector('#admin-sidebar');
      if (sidebar) {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.add('lg:-translate-x-full');
      }
      overlayEl.classList.add('opacity-0');
      overlayEl.addEventListener('transitionend', function hideOverlay() {
        overlayEl.classList.add('hidden');
        overlayEl.removeEventListener('transitionend', hideOverlay);
      }, { once: true });
      return;
    }

    // Admin Dark Mode Toggle
    const adminThemeBtn = e.target.closest('#admin-dark-mode-toggle');
    if (adminThemeBtn) {
      e.preventDefault();
      state.admin.theme = state.admin.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('blueskye_admin_theme', state.admin.theme);
      
      const container = document.querySelector('#admin-root-container');
      const themeIconEl = document.querySelector('#admin-theme-icon');
      if (container) {
        if (state.admin.theme === 'dark') {
          container.classList.add('dark');
        } else {
          container.classList.remove('dark');
        }
      }
      if (themeIconEl) {
        themeIconEl.className = state.admin.theme === 'dark' ? 'bx bx-sun text-lg' : 'bx bx-moon text-lg';
      }
      return;
    }

    // Admin Logout Trigger
    const logoutBtn = e.target.closest('#admin-logout-btn');
    if (logoutBtn) {
      e.preventDefault();
      state.admin.activeTab = 'overview';
      alert("Logged out of Admin Console successfully.");
      window.location.hash = '#home';
      return;
    }

    // Admin Sidebar Group Collapsible Toggle
    const toggleGroupBtn = e.target.closest('[data-toggle]');
    if (toggleGroupBtn) {
      const groupName = toggleGroupBtn.getAttribute('data-toggle');
      const groupEl = document.querySelector(`#group-${groupName}`);
      const chevron = document.querySelector(`#chevron-${groupName}`);
      
      if (groupEl) {
        const isHidden = groupEl.classList.contains('hidden');
        if (isHidden) {
          // Close all other groups first
          Object.keys(state.admin.expandedGroups).forEach(g => {
            state.admin.expandedGroups[g] = false;
            const otherGroupEl = document.querySelector(`#group-${g}`);
            const otherChevron = document.querySelector(`#chevron-${g}`);
            if (otherGroupEl) otherGroupEl.classList.add('hidden');
            if (otherChevron) otherChevron.className = 'bx bx-chevron-down text-xs transition-transform duration-200 text-white/60';
          });

          // Expand current group
          groupEl.classList.remove('hidden');
          if (chevron) chevron.className = 'bx bx-chevron-up text-xs transition-transform duration-200 text-white/60';
          state.admin.expandedGroups[groupName] = true;
        } else {
          // Collapse current group
          groupEl.classList.add('hidden');
          if (chevron) chevron.className = 'bx bx-chevron-down text-xs transition-transform duration-200 text-white/60';
          state.admin.expandedGroups[groupName] = false;
        }
      }
      return;
    }

    // Admin Tab selection click delegation
    const adminTabBtn = e.target.closest('[data-tab]');
    if (adminTabBtn && state.activeRoute === 'admin') {
      const tabName = adminTabBtn.getAttribute('data-tab');
      // Reset active styles
      document.querySelectorAll('#admin-sidebar-menu button').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Set active style
      adminTabBtn.classList.add('active');
      if (adminTabBtn.classList.contains('admin-submenu-btn')) {
        const parentDiv = adminTabBtn.closest('div');
        if (parentDiv) {
          const activeGroupName = parentDiv.id.replace('group-', '');
          
          // Collapse other groups
          Object.keys(state.admin.expandedGroups).forEach(g => {
            if (g !== activeGroupName) {
              state.admin.expandedGroups[g] = false;
              const otherGroupEl = document.querySelector(`#group-${g}`);
              const otherChevron = document.querySelector(`#chevron-${g}`);
              if (otherGroupEl) otherGroupEl.classList.add('hidden');
              if (otherChevron) otherChevron.className = 'bx bx-chevron-down text-xs transition-transform duration-200 text-white/60';
            }
          });
        }
      } else {
        // It's a top level link (e.g. Dashboard) - close all collapsible groups!
        Object.keys(state.admin.expandedGroups).forEach(g => {
          state.admin.expandedGroups[g] = false;
          const otherGroupEl = document.querySelector(`#group-${g}`);
          const otherChevron = document.querySelector(`#chevron-${g}`);
          if (otherGroupEl) otherGroupEl.classList.add('hidden');
          if (otherChevron) otherChevron.className = 'bx bx-chevron-down text-xs transition-transform duration-200 text-white/60';
        });
      }
      
      state.admin.activeTab = tabName;
      initAdminTab(tabName);

      // Auto-close sidebar on mobile after tab select
      if (window.innerWidth < 1024) {
        const sidebar = document.querySelector('#admin-sidebar');
        const overlay = document.querySelector('#admin-sidebar-overlay');
        if (sidebar) {
          sidebar.classList.add('-translate-x-full');
        }
        if (overlay) {
          overlay.classList.add('opacity-0');
          overlay.classList.add('hidden');
        }
      }
      return;
    }

    // Reset filters
    if (e.target.id === 'reset-filters' || e.target.id === 'no-results-reset') {
      state.propertiesPage = 1;
      state.searchFilters = {
        query: '',
        city: 'all',
        type: 'all',
        priceRange: 'all',
        minPrice: 'all',
        maxPrice: 'all',
        minSize: 'all',
        maxSize: 'all',
        beds: 'all',
        status: 'all'
      };
      renderApp();
      return;
    }
  });

  // Form submissions
  root.addEventListener('submit', (e) => {
    // Hero Search form matching user reference
    if (e.target.id === 'hero-search-form') {
      e.preventDefault();
      state.searchFilters.query = document.querySelector('#hero-query').value;
      state.searchFilters.type = document.querySelector('#hero-type').value;
      state.searchFilters.city = document.querySelector('#hero-city').value;
      window.location.hash = '#properties';
      return;
    }

    if (e.target.id === 'inquiry-form' || e.target.id === 'contact-form' || e.target.id === 'login-form' || e.target.id === 'footer-news' || e.target.id === 'faq-newsletter-form' || e.target.id === 'project-inquiry-form') {
      e.preventDefault();
      alert("Submitted successfully!");
      e.target.reset();
      return;
    }

    if (e.target.id === 'admin-login-form') {
      e.preventDefault();
      const email = document.querySelector('#admin-email').value.trim();
      
      if (email.toLowerCase().includes('site')) {
        state.admin.staffName = 'Aliyu Bello';
        state.admin.staffRole = 'Site Inspector Manager';
      } else if (email.toLowerCase().includes('editor') || email.toLowerCase().includes('blog')) {
        state.admin.staffName = 'Chidi Okafor';
        state.admin.staffRole = 'Blog Editor';
      } else {
        state.admin.staffName = 'Amina Bello';
        state.admin.staffRole = 'Administrator';
      }

      const code = prompt("2FA SECURE CODE\n\nEnter the 6-digit security code from your authentication token (e.g. Google Authenticator) to verify identity:");
      if (code !== null) {
        state.admin.isAuthenticated = true;
        
        const log = {
          id: state.admin.auditLogs.length + 1,
          time: new Date().toISOString().replace('T', ' ').substring(0, 16),
          staff: state.admin.staffName,
          action: 'Log in successful (2FA verified)',
          component: 'Authentication'
        };
        state.admin.auditLogs.unshift(log);

        alert(`Access Granted. Welcome back, ${state.admin.staffName}!`);
        renderApp();
        initAdminTab('overview');
      }
      return;
    }

    if (e.target.id === 'inspection-booking-form') {
      e.preventDefault();
      const name = document.querySelector('#inspect-name').value;
      const email = document.querySelector('#inspect-email').value;
      const phone = document.querySelector('#inspect-phone').value;
      const date = document.querySelector('#inspect-date').value;
      const type = document.querySelector('input[name="inspect-type"]:checked').value;
      const propertyTitle = e.target.getAttribute('data-property-title');
      
      alert(`Thank you, ${name}! Your request for a ${type} Inspection of "${propertyTitle}" on ${date} has been scheduled. An advisor will contact you at ${phone} to confirm.`);
      e.target.reset();
      return;
    }
  });

  // Handle select dropdown change events
  root.addEventListener('change', (e) => {
    if (e.target.id === 'project-filter-city') {
      state.projectFilters.city = e.target.value;
      renderApp();
      return;
    }
    if (e.target.id === 'project-filter-status') {
      state.projectFilters.status = e.target.value;
      renderApp();
      return;
    }
  });

  // Real-time Sidebar Inputs on properties search view
  root.addEventListener('input', (e) => {
    if (e.target.id === 'project-filter-city') {
      state.projectFilters.city = e.target.value;
      renderApp();
      return;
    }
    if (e.target.id === 'project-filter-status') {
      state.projectFilters.status = e.target.value;
      renderApp();
      return;
    }

    if (e.target.id && e.target.id.startsWith('filter-')) {
      state.propertiesPage = 1;
    }

    if (e.target.id === 'filter-query') {
      state.searchFilters.query = e.target.value;
      debounce(() => renderApp(), 300)();
      return;
    }
    
    if (e.target.id === 'filter-city') {
      state.searchFilters.city = e.target.value;
      renderApp();
      return;
    }

    if (e.target.id === 'filter-type') {
      state.searchFilters.type = e.target.value;
      renderApp();
      return;
    }

    if (e.target.id === 'filter-status') {
      state.searchFilters.status = e.target.value;
      renderApp();
      return;
    }

    if (e.target.id === 'filter-min-price') {
      state.searchFilters.minPrice = e.target.value;
      renderApp();
      return;
    }

    if (e.target.id === 'filter-max-price') {
      state.searchFilters.maxPrice = e.target.value;
      renderApp();
      return;
    }

    if (e.target.id === 'filter-min-size') {
      state.searchFilters.minSize = e.target.value;
      renderApp();
      return;
    }

    if (e.target.id === 'filter-max-size') {
      state.searchFilters.maxSize = e.target.value;
      renderApp();
      return;
    }

    if (e.target.id === 'sort-by') {
      state.sortBy = e.target.value;
      renderApp();
      return;
    }

    if (e.target.id === 'slider-downpayment') {
      state.mortgage.downPaymentPct = parseInt(e.target.value);
      updateMortgageVal();
    }
  });
}

function updateSliderImage() {
  const img = document.querySelector('#detail-slider-img');
  if (img && state.selectedProperty) {
    img.src = state.selectedProperty.images[state.selectedImageIndex];
  }
}

function updateMortgageVal() {
  const prop = state.selectedProperty;
  if (!prop) return;
  const totalAmount = prop.price;
  const downPayment = (totalAmount * state.mortgage.downPaymentPct) / 100;
  const loanAmount = totalAmount - downPayment;
  const monthlyInterestRate = (state.mortgage.interestRate / 100) / 12;
  const numberOfPayments = state.mortgage.loanTermYears * 12;
  let monthlyPayment = 0;
  if (monthlyInterestRate > 0) {
    monthlyPayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  } else {
    monthlyPayment = loanAmount / numberOfPayments;
  }
  const formattedMonthly = isNaN(monthlyPayment) || !isFinite(monthlyPayment)
    ? '₦0'
    : new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(monthlyPayment);
  
  const monthlyLabel = document.querySelector('#mortgage-monthly');
  if (monthlyLabel) {
    monthlyLabel.innerText = formattedMonthly;
  }

  const pctLabel = document.querySelector('#slider-downpayment-val');
  if (pctLabel) {
    pctLabel.innerText = `${state.mortgage.downPaymentPct}%`;
  }
}

// Simple debounce
let debounceTimeout;
function debounce(func, delay) {
  return function(...args) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Testimonials data
const TestimonialsData = [
  {
    quote: "Working with Blueskye City Home was a masterclass in elegance. Chidi Okafor sourced our lagoon-front villa in Banana Island before it even hit the public catalogs. The transaction was private and flawless.",
    author: "Alexandra Vane",
    title: "Venture Partner, Sequoia Group",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "Our search for a diplomat estate in Abuja ended in Maitama. Amina Yusuf aligned perfectly with our requirements, and their private calculator tools and off-market listings made it incredibly direct and secure.",
    author: "Senator Ibrahim D.",
    title: "National Assembly, Abuja",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "I highly recommend their property comparison tool. It saved us hours of spreadsheet planning, allowing us to align on a premier serviced duplex in Victoria Island in record time.",
    author: "Christian Moreau",
    title: "Executive Director, Art Guild",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
  }
];

// --- Client Auth Modal (Login / Register) ---
function openClientAuthModal(defaultTab = 'login') {
  const existing = document.querySelector('#client-auth-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'client-auth-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4';
  
  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200/20 animate-fade-in text-slate-800 dark:text-slate-200 p-8 space-y-6 relative">
      
      <!-- Close Button -->
      <button id="close-client-auth" class="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
        <i class="bx bx-x text-xl"></i>
      </button>

      <!-- Content Container -->
      <div id="client-auth-container"></div>
    </div>
  `;

  document.body.appendChild(modal);

  const container = modal.querySelector('#client-auth-container');
  const closeBtn = modal.querySelector('#close-client-auth');

  closeBtn.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  function showForm(tab) {
    if (tab === 'login') {
      container.innerHTML = clientLoginFormHtml;

      const form = container.querySelector('#modal-client-login');
      const toggleBtn = container.querySelector('#toggle-client-to-register');
      
      toggleBtn.addEventListener('click', () => showForm('register'));
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Logged in successfully!");
        modal.remove();
      });
    } else {
      container.innerHTML = clientRegisterFormHtml;

      const form = container.querySelector('#modal-client-register');
      const toggleBtn = container.querySelector('#toggle-client-to-login');
      
      toggleBtn.addEventListener('click', () => showForm('login'));
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = container.querySelector('#modal-reg-name').value;
        alert(`Congratulations ${name}! Your client profile has been registered. You can now log in.`);
        showForm('login');
      });
    }
  }

  showForm(defaultTab);
}

// --- Affiliate Auth Modal (Login / Register - Simple & Fast!) ---
function openAffiliateAuthModal(defaultTab = 'register') {
  const existing = document.querySelector('#affiliate-auth-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'affiliate-auth-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4';
  
  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200/20 animate-fade-in text-slate-800 dark:text-slate-200 p-8 space-y-6 relative">
      
      <!-- Close Button -->
      <button id="close-aff-auth" class="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
        <i class="bx bx-x text-xl"></i>
      </button>

      <!-- Content Container -->
      <div id="aff-auth-container"></div>
    </div>
  `;

  document.body.appendChild(modal);

  const container = modal.querySelector('#aff-auth-container');
  const closeBtn = modal.querySelector('#close-aff-auth');

  closeBtn.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  function showForm(tab) {
    if (tab === 'login') {
      container.innerHTML = affiliateLoginFormHtml;

      const form = container.querySelector('#modal-aff-login');
      const toggleBtn = container.querySelector('#toggle-aff-to-register');
      
      toggleBtn.addEventListener('click', () => showForm('register'));
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Affiliate logged in successfully!");
        modal.remove();
      });
    } else {
      container.innerHTML = affiliateRegisterFormHtml;

      const form = container.querySelector('#modal-aff-register');
      const toggleBtn = container.querySelector('#toggle-aff-to-login');
      
      toggleBtn.addEventListener('click', () => showForm('login'));
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = container.querySelector('#modal-aff-name').value;
        alert(`Congratulations ${name}! You have successfully registered as an Affiliate Partner. You can now log in.`);
        showForm('login');
      });
    }
  }

  showForm(defaultTab);
}

// --- Order / Register Interest Multi-step Form Wizard ---
function openOrderWizardModal(property) {
  // Pre-compile property selector options to avoid nesting backticks inside template literal
  const optionsHtml = properties.map(p => {
    const isSelected = p.id === property.id ? 'selected' : '';
    return `<option value="${p.id}" ${isSelected}>${p.title} (${p.formattedPrice})</option>`;
  }).join('');

  const modal = document.createElement('div');
  modal.id = 'order-wizard-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4';
  modal.setAttribute('data-step', '1');
  
  // Compiling options and interpolating order wizard modal template
  let wizardHtml = orderWizardModalHtml;
  wizardHtml = wizardHtml.replace(/\{\{title\}\}/g, property.title);
  wizardHtml = wizardHtml.replace(/\{\{formattedPrice\}\}/g, property.formattedPrice);
  wizardHtml = wizardHtml.replace(/\{\{image\}\}/g, property.images[0]);
  wizardHtml = wizardHtml.replace(/\{\{location\}\}/g, property.location);
  wizardHtml = wizardHtml.replace(/\{\{city\}\}/g, property.city);
  wizardHtml = wizardHtml.replace(/\{\{options\}\}/g, optionsHtml);

  modal.innerHTML = wizardHtml;
  
  document.body.appendChild(modal);
  setupWizardListeners(property, modal);
}

function setupWizardListeners(initialProperty, modal) {
  const backBtn = modal.querySelector('#wizard-back-btn');
  const nextBtn = modal.querySelector('#wizard-next-btn');
  const closeBtn = modal.querySelector('#close-order-wizard');
  const propSelect = modal.querySelector('#wizard-property-select');
  
  let currentStep = 1;
  let activeProperty = initialProperty;
  
  // Sync select drop down change
  propSelect.addEventListener('change', (e) => {
    const val = parseInt(e.target.value);
    activeProperty = properties.find(p => p.id === val);
    
    // Update Step 2 preview panel dynamically
    const thumb = modal.querySelector('#wizard-prop-thumb');
    const name = modal.querySelector('#wizard-prop-name');
    const price = modal.querySelector('#wizard-prop-price');
    const loc = modal.querySelector('#wizard-prop-loc');
    if (thumb) thumb.src = activeProperty.images[0];
    if (name) name.innerText = activeProperty.title;
    if (price) price.innerText = activeProperty.formattedPrice;
    if (loc) loc.innerText = `${activeProperty.location}, ${activeProperty.city}`;
  });
  
  closeBtn.addEventListener('click', () => modal.remove());
  
  backBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentStep < 4) {
      // Perform validation on inputs
      if (currentStep === 1) {
        const name = modal.querySelector('#wizard-name').value.trim();
        const email = modal.querySelector('#wizard-email').value.trim();
        const phone = modal.querySelector('#wizard-phone').value.trim();
        const address = modal.querySelector('#wizard-address').value.trim();
        if (!name || !email || !phone || !address) {
          alert("Please fill in all personal contact details.");
          return;
        }
      }
      setStep(currentStep + 1);
    } else {
      // Final submit
      const name = modal.querySelector('#wizard-name').value.trim();
      const paymentPlan = modal.querySelector('input[name="wizard-payment-plan"]:checked').value;
      
      alert(`Congratulations, ${name}! Your interest registration for "${activeProperty.title}" under the "${paymentPlan}" plan has been successfully sent. A transaction specialist will call you shortly.`);
      modal.remove();
    }
  });
  
  function setStep(step) {
    modal.querySelector(`#wizard-page-${currentStep}`).classList.add('hidden');
    modal.querySelector(`#wizard-page-${step}`).classList.remove('hidden');
    
    // Sync indicators classes
    modal.querySelector(`#step-dot-${currentStep}`).className = "h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-550 dark:text-slate-450 flex items-center justify-center text-[9px] font-extrabold";
    modal.querySelector(`#step-label-${currentStep}`).className = "text-[9px] font-bold uppercase tracking-wider text-slate-400";
    
    modal.querySelector(`#step-dot-${step}`).className = "h-5 w-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[9px] font-extrabold";
    modal.querySelector(`#step-label-${step}`).className = "text-[9px] font-bold uppercase tracking-wider text-primary-600";
    
    currentStep = step;
    
    // Back button disabled status
    backBtn.disabled = currentStep === 1;
    
    // Next button text sync
    if (currentStep === 4) {
      nextBtn.innerText = "Submit Request";
      
      // Populate step 4 text
      modal.querySelector('#confirm-prop-title').innerText = activeProperty.title;
      modal.querySelector('#confirm-prop-price').innerText = activeProperty.formattedPrice;
      modal.querySelector('#confirm-client-name').innerText = modal.querySelector('#wizard-name').value;
      modal.querySelector('#confirm-payment-plan').innerText = modal.querySelector('input[name="wizard-payment-plan"]:checked').value;
    } else {
      nextBtn.innerText = "Next";
    }
  }
}

// Start
init();
