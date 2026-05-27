// ============================================
// NLC Admin Panel — Single Page Application
// ============================================

const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'
  : (window.location.origin.includes('vercel.app')
      ? 'https://nlcgym-backend.onrender.com/api' // Replace with your actual production Render URL
      : window.location.origin + '/api');
const ADMIN_API = API_BASE + '/admin';
const logoSrc = window.location.pathname.startsWith('/admin') ? '/admin/images/nlc_logo.png' : 'images/nlc_logo.png';

// ─── SVG ICONS ───────────────────────────────────────
const icons = {
  dashboard: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  coaches: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  blogs: '<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  careers: '<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
  applications: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  logout: '<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  empty: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  enquiries: '<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
};

// ─── STATE ───────────────────────────────────────────
let state = {
  token: localStorage.getItem('nlc_admin_token'),
  currentPage: 'dashboard',
  coaches: [],
  blogs: [],
  careers: [],
  applications: [],
  transformations: [],
  enquiries: [],
  dashboard: {},
  loading: false,
};

// ─── API HELPERS ─────────────────────────────────────

async function api(endpoint, options = {}) {
  const headers = { ...options.headers };
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${ADMIN_API}${endpoint}`, { ...options, headers });
  
  if (res.status === 401) {
    logout();
    throw new Error('Session expired');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

// ─── TOAST ───────────────────────────────────────────

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function setButtonLoading(button, isLoading, text = 'Saving...') {
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalHtml = button.innerHTML;
    button.innerHTML = `<span class="spinner-inline"></span> ${text}`;
  } else {
    button.disabled = false;
    if (button.dataset.originalHtml) {
      button.innerHTML = button.dataset.originalHtml;
    }
  }
}

function showConfirmModal(title, message, onConfirm) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" style="max-width: 420px; animation: modalSlideUp 0.2s ease;">
      <div class="modal-header">
        <h2>${title}</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <div style="padding: 24px;">
        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14px; line-height: 1.6;">${message}</p>
        <div class="modal-actions" style="margin-top: 0; padding-top: 0; border-top: none;">
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button type="button" class="btn btn-danger btn-confirm-action">Delete</button>
        </div>
      </div>
    </div>
  `;
  
  const confirmBtn = modal.querySelector('.btn-confirm-action');
  confirmBtn.addEventListener('click', async () => {
    setButtonLoading(confirmBtn, true, 'Deleting...');
    try {
      await onConfirm();
      modal.remove();
    } catch(err) {
      showToast(err.message, 'error');
      setButtonLoading(confirmBtn, false);
    }
  });
  
  document.body.appendChild(modal);
}

// ─── AUTH ────────────────────────────────────────────

async function login(email, password) {
  try {
    const data = await fetch(`${ADMIN_API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(r => r.json());

    if (data.token) {
      state.token = data.token;
      localStorage.setItem('nlc_admin_token', data.token);
      render();
      showToast('Welcome back!');
    } else {
      showToast(data.error || 'Login failed', 'error');
    }
  } catch (err) {
    showToast('Login failed', 'error');
  }
}

function logout() {
  state.token = null;
  localStorage.removeItem('nlc_admin_token');
  render();
}

// ─── DATA LOADING ────────────────────────────────────

async function loadDashboard() {
  try {
    state.dashboard = await api('/dashboard');
  } catch(e) { console.error(e); }
}

async function loadCoaches() {
  try { state.coaches = await api('/coaches'); } catch(e) { console.error(e); }
}

async function loadBlogs() {
  try { state.blogs = await api('/blogs'); } catch(e) { console.error(e); }
}

async function loadCareers() {
  try { state.careers = await api('/careers'); } catch(e) { console.error(e); }
}

async function loadApplications() {
  try { state.applications = await api('/applications'); } catch(e) { console.error(e); }
}

async function loadTransformations() {
  try { state.transformations = await api('/transformations'); } catch(e) { console.error(e); }
}

async function loadEnquiries() {
  try { state.enquiries = await api('/enquiries'); } catch(e) { console.error(e); }
}

// ─── RENDER ──────────────────────────────────────────

function render() {
  const app = document.getElementById('app');
  if (!state.token) {
    app.innerHTML = renderLogin();
    return;
  }
  app.innerHTML = renderLayout();
  loadPageData();
}

function renderLogin() {
  return `
    <div class="login-page">
      <div class="login-card">
        <div class="login-logo"><img src="${logoSrc}" alt="NLC"></div>
        <h1>Admin Panel</h1>
        <p>No Limits CrossFit — Control Panel</p>
        <form onsubmit="handleLogin(event)">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="login-email" required placeholder="admin@nlcgym.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-password" required placeholder="••••••••">
          </div>
          <button type="submit" class="btn btn-primary btn-full">Sign In</button>
        </form>
      </div>
    </div>
  `;
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar) sidebar.classList.toggle('sidebar--open');
  if (overlay) overlay.classList.toggle('active');
}

function renderLayout() {
  return `
    <button class="sidebar-toggle" onclick="toggleSidebar()">
      ${icons.menu}
    </button>
    <div class="sidebar-overlay" onclick="toggleSidebar()"></div>
    <div class="admin-layout">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <img src="${logoSrc}" alt="NLC">
          <div class="sidebar-brand">
            <span class="sidebar-brand-name">No Limits CrossFit</span>
            <span class="sidebar-brand-sub">Admin Panel</span>
          </div>
        </div>
        <nav class="sidebar-nav">
          <span class="nav-section-label">Main</span>
          <button class="nav-item ${state.currentPage === 'dashboard' ? 'active' : ''}" onclick="navigateTo('dashboard')">
            <span class="nav-icon">${icons.dashboard}</span> Dashboard
          </button>
          <span class="nav-section-label">Sales & Leads</span>
          <button class="nav-item ${state.currentPage === 'enquiries' ? 'active' : ''}" onclick="navigateTo('enquiries')">
            <span class="nav-icon">${icons.enquiries}</span> Enquiries
          </button>
          <span class="nav-section-label">Content</span>
          <button class="nav-item ${state.currentPage === 'coaches' ? 'active' : ''}" onclick="navigateTo('coaches')">
            <span class="nav-icon">${icons.coaches}</span> Coaches
          </button>
          <button class="nav-item ${state.currentPage === 'blogs' ? 'active' : ''}" onclick="navigateTo('blogs')">
            <span class="nav-icon">${icons.blogs}</span> Blogs
          </button>
          <span class="nav-section-label">Recruitment</span>
          <button class="nav-item ${state.currentPage === 'careers' ? 'active' : ''}" onclick="navigateTo('careers')">
            <span class="nav-icon">${icons.careers}</span> Careers
          </button>
          <button class="nav-item ${state.currentPage === 'applications' ? 'active' : ''}" onclick="navigateTo('applications')">
            <span class="nav-icon">${icons.applications}</span> Applications
          </button>
          <span class="nav-section-label">Wall of Fame</span>
          <button class="nav-item ${state.currentPage === 'transformations' ? 'active' : ''}" onclick="navigateTo('transformations')">
            <span class="nav-icon">${icons.coaches}</span> Transformations
          </button>
        </nav>
        <div class="sidebar-footer">
          <button class="nav-item" onclick="logout()">
            <span class="nav-icon">${icons.logout}</span> Logout
          </button>
        </div>
      </aside>
      <main class="main-content">
        <div id="page-content">
          <div class="loading"><div class="spinner"></div></div>
        </div>
      </main>
    </div>
  `;
}

async function loadPageData() {
  const content = document.getElementById('page-content');
  content.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  switch(state.currentPage) {
    case 'dashboard':
      await loadDashboard();
      content.innerHTML = renderDashboard();
      break;
    case 'coaches':
      await loadCoaches();
      content.innerHTML = renderCoaches();
      break;
    case 'blogs':
      await loadBlogs();
      content.innerHTML = renderBlogs();
      break;
    case 'careers':
      await loadCareers();
      content.innerHTML = renderCareers();
      break;
    case 'applications':
      await loadApplications();
      content.innerHTML = renderApplications();
      break;
    case 'transformations':
      await loadTransformations();
      content.innerHTML = renderTransformations();
      break;
    case 'enquiries':
      await loadEnquiries();
      content.innerHTML = renderEnquiries();
      break;
  }
}

function navigateTo(page) {
  state.currentPage = page;
  render();
}

// ─── DASHBOARD ───────────────────────────────────────

function renderDashboard() {
  const d = state.dashboard;
  return `
    <div class="page-header">
      <div><h1>Dashboard</h1><p>Overview of your gym management</p></div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon stat-icon--coaches">${icons.coaches}</div><div class="stat-value">${d.totalCoaches || 0}</div><div class="stat-label">Active Coaches</div></div>
      <div class="stat-card"><div class="stat-icon stat-icon--blogs">${icons.blogs}</div><div class="stat-value">${d.totalBlogs || 0}</div><div class="stat-label">Published Blogs</div></div>
      <div class="stat-card"><div class="stat-icon stat-icon--careers">${icons.careers}</div><div class="stat-value">${d.totalOpenings || 0}</div><div class="stat-label">Job Openings</div></div>
      <div class="stat-card"><div class="stat-icon stat-icon--applications">${icons.applications}</div><div class="stat-value">${d.pendingApplications || 0}</div><div class="stat-label">Pending Applications</div></div>
    </div>
  `;
}

// ─── COACHES PAGE ────────────────────────────────────

function renderCoaches() {
  return `
    <div class="page-header">
      <div><h1>Coaches</h1><p>Manage your coaching team</p></div>
      <button class="btn btn-primary btn-icon" onclick="openCoachModal()"><span class="nav-icon">${icons.plus}</span> Add Coach</button>
    </div>
    ${state.coaches.length === 0 ? '<div class="empty-state"><div class="empty-icon">' + icons.coaches + '</div><h3>No coaches yet</h3><p>Add your first coach to get started.</p></div>' : `
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead><tr><th>Image</th><th>Name</th><th>Title</th><th>Specialty</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${state.coaches.map(c => `
            <tr>
              <td>${c.image_url ? `<img src="${c.image_url}" alt="${c.name}">` : '—'}</td>
              <td><strong>${c.name}</strong></td>
              <td>${c.title}</td>
              <td>${c.specialty || '—'}</td>
              <td><span class="badge ${c.is_active ? 'badge-active' : 'badge-inactive'}">${c.is_active ? 'Active' : 'Inactive'}</span></td>
              <td style="white-space: nowrap;">
                <button class="btn btn-secondary btn-sm" onclick="openCoachModal(${c.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCoach(${c.id})">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="mobile-card-list">
        ${state.coaches.map(c => `
          <div class="mobile-card">
            <div class="mobile-card__top">
              ${c.image_url ? `<img class="mobile-card__img" src="${c.image_url}" alt="${c.name}">` : '<div class="mobile-card__img-placeholder">👤</div>'}
              <div class="mobile-card__info">
                <div class="mobile-card__name">${c.name}</div>
                <div class="mobile-card__sub">${c.title}</div>
              </div>
            </div>
            <div class="mobile-card__meta">
              <span class="badge ${c.is_active ? 'badge-active' : 'badge-inactive'}">${c.is_active ? 'Active' : 'Inactive'}</span>
              ${c.specialty ? `<span style="font-size:11px;color:var(--text-muted)">${c.specialty}</span>` : ''}
            </div>
            <div class="mobile-card__actions">
              <button class="btn btn-secondary btn-sm" onclick="openCoachModal(${c.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteCoach(${c.id})">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`}
  `;
}

async function openCoachModal(id = null) {
  let coach = { name:'', title:'', transformations:'', hours:'', specialty:'', description:'', bio:'', start_date:'', end_date:'', display_order:0 };
  if (id) {
    try { coach = await api(`/coaches/${id}`); } catch(e) { showToast(e.message,'error'); return; }
  }

  // Format dates for input fields
  const startDate = coach.start_date ? new Date(coach.start_date).toISOString().split('T')[0] : '';
  const endDate = coach.end_date ? new Date(coach.end_date).toISOString().split('T')[0] : '';

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" style="max-width:680px">
      <div class="modal-header">
        <h2>${id ? 'Edit' : 'Add'} Coach</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <form onsubmit="saveCoach(event, ${id})">
        <div class="form-row">
          <div class="form-group"><label>Name *</label><input name="name" value="${coach.name || ''}" required></div>
          <div class="form-group"><label>Title *</label><input name="title" value="${coach.title || ''}" required></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Specialty</label><input name="specialty" value="${coach.specialty || ''}"></div>
          <div class="form-group"><label>Display Order</label><input name="display_order" type="number" value="${coach.display_order || 0}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Transformations</label><input name="transformations" value="${coach.transformations || ''}"></div>
          <div class="form-group"><label>Hours</label><input name="hours" value="${coach.hours || ''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Start Date</label><input type="date" name="start_date" value="${startDate}"></div>
          <div class="form-group"><label>End Date <small>(leave empty if current)</small></label><input type="date" name="end_date" value="${endDate}"></div>
        </div>
        <div class="form-group"><label>Short Description <small>(shown on card back)</small></label><textarea name="description" style="min-height:60px">${coach.description || ''}</textarea></div>
        <div class="form-group"><label>Full Bio <small>(shown in detail popup)</small></label><textarea name="bio" style="min-height:120px">${coach.bio || ''}</textarea></div>
        <div class="form-group"><label>Image ${id ? '(leave empty to keep current)' : ''}</label><input type="file" name="image" accept="image/*"></div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button type="submit" class="btn btn-primary">${id ? 'Update' : 'Create'} Coach</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

async function saveCoach(e, id) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  setButtonLoading(submitBtn, true);
  const formData = new FormData(form);

  try {
    const url = id ? `/coaches/${id}` : '/coaches';
    const method = id ? 'PUT' : 'POST';
    
    await api(url, { method, body: formData });
    
    document.querySelector('.modal-overlay').remove();
    showToast(`Coach ${id ? 'updated' : 'created'} successfully!`);
    navigateTo('coaches');
  } catch(err) {
    showToast(err.message, 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

function deleteCoach(id) {
  showConfirmModal(
    'Delete Coach',
    'Are you sure you want to delete this coach? This action cannot be undone and will permanently remove them from the database.',
    async () => {
      await api(`/coaches/${id}`, { method: 'DELETE' });
      showToast('Coach deleted successfully');
      navigateTo('coaches');
    }
  );
}

// ─── BLOGS PAGE ──────────────────────────────────────

function renderBlogs() {
  return `
    <div class="page-header">
      <div><h1>Blogs</h1><p>Manage your blog posts</p></div>
      <button class="btn btn-primary btn-icon" onclick="openBlogModal()"><span class="nav-icon">${icons.plus}</span> New Blog</button>
    </div>
    ${state.blogs.length === 0 ? '<div class="empty-state"><div class="empty-icon">' + icons.blogs + '</div><h3>No blogs yet</h3><p>Write your first blog post.</p></div>' : `
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead>
        <tbody>
          ${state.blogs.map(b => `
            <tr>
              <td>${b.image_url ? `<img src="${b.image_url}" alt="${b.title}">` : '—'}</td>
              <td><strong>${b.title}</strong><br><small style="color:var(--text-muted)">${b.slug}</small></td>
              <td>${b.category}</td>
              <td><span class="badge ${b.is_published ? 'badge-published' : 'badge-draft'}">${b.is_published ? 'Published' : 'Draft'}</span></td>
              <td>${b.is_featured ? '<span class="badge badge-featured">Featured</span>' : '—'}</td>
              <td style="white-space: nowrap;">
                <button class="btn btn-secondary btn-sm" onclick="openBlogModal(${b.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteBlog(${b.id})">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="mobile-card-list">
        ${state.blogs.map(b => `
          <div class="mobile-card">
            <div class="mobile-card__top">
              ${b.image_url ? `<img class="mobile-card__img" src="${b.image_url}" alt="${b.title}">` : '<div class="mobile-card__img-placeholder">📝</div>'}
              <div class="mobile-card__info">
                <div class="mobile-card__name">${b.title}</div>
                <div class="mobile-card__sub">${b.category}</div>
              </div>
            </div>
            <div class="mobile-card__meta">
              <span class="badge ${b.is_published ? 'badge-published' : 'badge-draft'}">${b.is_published ? 'Published' : 'Draft'}</span>
              ${b.is_featured ? '<span class="badge badge-featured">Featured</span>' : ''}
            </div>
            <div class="mobile-card__actions">
              <button class="btn btn-secondary btn-sm" onclick="openBlogModal(${b.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteBlog(${b.id})">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`}
  `;
}

async function openBlogModal(id = null) {
  let blog = { title:'', summary:'', content:'', category:'General', author_name:'NLC Team', author_bio:'', image_alt:'', meta_description: '', meta_keywords: '', is_featured:false, is_published:true };
  if (id) {
    try { blog = await api(`/blogs/${id}`); } catch(e) { showToast(e.message,'error'); return; }
  }

  // Destroy any existing CKEditor instance before creating a new modal
  if (window.CKEDITOR && CKEDITOR.instances['blog-content-editor']) {
    CKEDITOR.instances['blog-content-editor'].destroy(true);
  }

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" style="max-width:860px">
      <div class="modal-header">
        <h2>${id ? 'Edit' : 'Create'} Blog Post</h2>
        <button class="modal-close" id="blog-modal-close-x">×</button>
      </div>
      <form onsubmit="saveBlog(event, ${id})" id="blog-modal-form">
        <div class="form-group"><label>Title</label><input name="title" value="${(blog.title || '').replace(/"/g, '&quot;')}" required></div>
        <div class="form-group"><label>Summary</label><textarea name="summary" style="min-height:60px">${blog.summary || ''}</textarea></div>
        <div class="form-group">
          <label>Content <small style="color:gray;font-weight:normal;">(Use the toolbar below to format text, insert images, tables, etc.)</small></label>
          <textarea id="blog-content-editor" name="content">${blog.content || ''}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Category</label>
            <select name="category">
              ${['General','Transformations','Workouts','Food','Recovery','Mindset'].map(c => `<option value="${c}" ${blog.category===c?'selected':''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label>Image Alt Text <small style="color:gray;font-weight:normal;">(For SEO)</small></label><input name="image_alt" value="${(blog.image_alt || '').replace(/"/g, '&quot;')}" placeholder="e.g. CrossFit athlete doing deadlift"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Author Name</label><input name="author_name" value="${blog.author_name || 'NLC Team'}"></div>
          <div class="form-group"><label>Author Bio</label><input name="author_bio" value="${(blog.author_bio || '').replace(/"/g, '&quot;')}"></div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Meta Description <small style="color:gray; font-weight:normal;">(For SEO, max 160 chars)</small></label>
            <textarea name="meta_description" style="min-height:50px">${(blog.meta_description || '').replace(/"/g, '&quot;')}</textarea>
          </div>
          <div class="form-group">
            <label>Meta Keywords <small style="color:gray; font-weight:normal;">(Comma separated)</small></label>
            <input name="meta_keywords" value="${(blog.meta_keywords || '').replace(/"/g, '&quot;')}">
          </div>
        </div>
        <div class="form-group"><label>Hero Image ${id ? '(leave empty to keep current)' : ''}</label><input type="file" name="image" accept="image/*"></div>
        <div class="form-row">
          <div class="form-group"><label class="form-checkbox"><input type="checkbox" name="is_featured" ${blog.is_featured ? 'checked' : ''}> Featured Post</label></div>
          <div class="form-group"><label class="form-checkbox"><input type="checkbox" name="is_published" ${blog.is_published ? 'checked' : ''}> Published</label></div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="blog-modal-cancel-btn">Cancel</button>
          <button type="submit" class="btn btn-primary">${id ? 'Update' : 'Publish'} Blog</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  // Helper to cleanly close modal + destroy editor
  function closeBlogModal() {
    if (window.CKEDITOR && CKEDITOR.instances['blog-content-editor']) {
      CKEDITOR.instances['blog-content-editor'].destroy(true);
    }
    modal.remove();
  }
  document.getElementById('blog-modal-close-x').addEventListener('click', closeBlogModal);
  document.getElementById('blog-modal-cancel-btn').addEventListener('click', closeBlogModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeBlogModal(); });

  // Initialize CKEditor — retry up to 30 times (3s) in case CDN is still loading
  let ckAttempts = 0;
  function initCKEditor() {
    if (typeof CKEDITOR !== 'undefined') {
      // Safe: destroy any orphaned instance before replacing
      if (CKEDITOR.instances['blog-content-editor']) {
        CKEDITOR.instances['blog-content-editor'].destroy(true);
      }
      CKEDITOR.replace('blog-content-editor', {
        height: 400,
        removePlugins: 'elementspath',
        toolbar: [
          { name: 'clipboard',   items: ['Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo'] },
          { name: 'links',       items: ['Link','Unlink','Anchor'] },
          { name: 'insert',      items: ['Image','Table','HorizontalRule','SpecialChar'] },
          '/',
          { name: 'basicstyles', items: ['Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat'] },
          { name: 'paragraph',   items: ['NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'] },
          { name: 'styles',      items: ['Styles','Format','Font','FontSize'] },
          { name: 'colors',      items: ['TextColor','BGColor'] },
          { name: 'tools',       items: ['Maximize','Source'] },
        ],
        extraAllowedContent: 'img[*]{*}(*); table[*]{*}(*); td[*]{*}(*); th[*]{*}(*); tr[*]{*}(*); p[*]{*}(*); span[*]{*}(*); div[*]{*}(*)',
        contentsCss: [
          'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
          'body { font-family: Inter, sans-serif; font-size: 15px; line-height: 1.7; color: #1a1a1a; padding: 12px 16px; }'
        ]
      });
    } else if (ckAttempts < 30) {
      ckAttempts++;
      setTimeout(initCKEditor, 100);
    } else {
      console.warn('CKEditor CDN failed to load after 3 seconds. Falling back to plain textarea.');
    }
  }
  // Small delay to let the browser paint the modal before CKEditor measures it
  setTimeout(initCKEditor, 50);
}

async function saveBlog(e, id) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  setButtonLoading(submitBtn, true);

  // Sync CKEditor content back into the textarea before FormData reads it
  if (window.CKEDITOR && CKEDITOR.instances['blog-content-editor']) {
    CKEDITOR.instances['blog-content-editor'].updateElement();
  }

  const formData = new FormData(form);

  // Handle checkboxes (unchecked = not in FormData)
  formData.set('is_featured', form.querySelector('[name=is_featured]').checked ? 'true' : 'false');
  formData.set('is_published', form.querySelector('[name=is_published]').checked ? 'true' : 'false');

  try {
    const url = id ? `/blogs/${id}` : '/blogs';
    const method = id ? 'PUT' : 'POST';
    await api(url, { method, body: formData });

    // Destroy editor before closing
    if (window.CKEDITOR && CKEDITOR.instances['blog-content-editor']) {
      CKEDITOR.instances['blog-content-editor'].destroy(true);
    }
    document.querySelector('.modal-overlay')?.remove();
    showToast(`Blog ${id ? 'updated' : 'published'} successfully!`);
    navigateTo('blogs');
  } catch(err) {
    showToast(err.message, 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

function deleteBlog(id) {
  showConfirmModal(
    'Delete Blog Post',
    'Are you sure you want to delete this blog post? This action cannot be undone and will permanently remove it from the database.',
    async () => {
      await api(`/blogs/${id}`, { method: 'DELETE' });
      showToast('Blog deleted successfully');
      navigateTo('blogs');
    }
  );
}

// ─── CAREERS PAGE ────────────────────────────────────

function renderCareers() {
  return `
    <div class="page-header">
      <div><h1>Career Openings</h1><p>Manage job positions</p></div>
      <button class="btn btn-primary btn-icon" onclick="openCareerModal()"><span class="nav-icon">${icons.plus}</span> Add Opening</button>
    </div>
    ${state.careers.length === 0 ? '<div class="empty-state"><div class="empty-icon">' + icons.careers + '</div><h3>No openings yet</h3><p>Post your first job opening.</p></div>' : `
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead><tr><th>Title</th><th>Type</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${state.careers.map(c => `
            <tr>
              <td><strong>${c.title}</strong></td>
              <td>${c.type}</td>
              <td>${c.location || 'On-site'}</td>
              <td><span class="badge ${c.is_active ? 'badge-active' : 'badge-inactive'}">${c.is_active ? 'Active' : 'Closed'}</span></td>
              <td style="white-space: nowrap;">
                <button class="btn btn-secondary btn-sm" onclick="openCareerModal(${c.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCareer(${c.id})">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="mobile-card-list">
        ${state.careers.map(c => `
          <div class="mobile-card">
            <div class="mobile-card__top">
              <div class="mobile-card__img-placeholder">💼</div>
              <div class="mobile-card__info">
                <div class="mobile-card__name">${c.title}</div>
                <div class="mobile-card__sub">${c.type} · ${c.location || 'On-site'}</div>
              </div>
            </div>
            <div class="mobile-card__meta">
              <span class="badge ${c.is_active ? 'badge-active' : 'badge-inactive'}">${c.is_active ? 'Active' : 'Closed'}</span>
            </div>
            <div class="mobile-card__actions">
              <button class="btn btn-secondary btn-sm" onclick="openCareerModal(${c.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteCareer(${c.id})">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`}
  `;
}

async function openCareerModal(id = null) {
  let job = { title:'', type:'Full-time', location:'On-site', description:'', requirements:'' };
  if (id) {
    try {
      const all = state.careers;
      job = all.find(c => c.id === id) || job;
    } catch(e) {}
  }

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>${id ? 'Edit' : 'Add'} Job Opening</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <form onsubmit="saveCareer(event, ${id})">
        <div class="form-group"><label>Job Title</label><input name="title" value="${(job.title || '').replace(/"/g, '&quot;')}" required></div>
        <div class="form-row">
          <div class="form-group">
            <label>Type</label>
            <select name="type">
              ${['Full-time','Part-time','Remote','Hybrid','Contract','Remote / Hybrid'].map(t => `<option value="${t}" ${job.type===t?'selected':''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label>Location</label><input name="location" value="${job.location || 'On-site'}"></div>
        </div>
        <div class="form-group"><label>Description</label><textarea name="description" required>${job.description || ''}</textarea></div>
        <div class="form-group"><label>Requirements</label><textarea name="requirements">${job.requirements || ''}</textarea></div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button type="submit" class="btn btn-primary">${id ? 'Update' : 'Create'} Opening</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

async function saveCareer(e, id) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  setButtonLoading(submitBtn, true);
  const data = Object.fromEntries(new FormData(form));

  try {
    const url = id ? `/careers/${id}` : '/careers';
    const method = id ? 'PUT' : 'POST';
    await api(url, { method, body: JSON.stringify(data) });
    
    document.querySelector('.modal-overlay').remove();
    showToast(`Opening ${id ? 'updated' : 'created'} successfully!`);
    navigateTo('careers');
  } catch(err) { 
    showToast(err.message, 'error'); 
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

function deleteCareer(id) {
  showConfirmModal(
    'Delete Job Opening',
    'Are you sure you want to delete this job opening? This action cannot be undone and will permanently remove it from the database.',
    async () => {
      await api(`/careers/${id}`, { method: 'DELETE' });
      showToast('Opening deleted successfully');
      navigateTo('careers');
    }
  );
}

// ─── APPLICATIONS PAGE ──────────────────────────────

function renderApplications() {
  return `
    <div class="page-header">
      <div><h1>Applications</h1><p>Review job applications from candidates</p></div>
    </div>
    ${state.applications.length === 0 ? '<div class="empty-state"><div class="empty-icon">' + icons.applications + '</div><h3>No applications yet</h3><p>Applications will appear here when candidates apply.</p></div>' : `
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead><tr><th>Name</th><th>Email</th><th>Position</th><th>Resume</th><th>Certificate</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          ${state.applications.map(a => `
            <tr>
              <td><strong>${a.full_name}</strong>${a.phone ? `<br><small style="color:var(--text-muted)">${a.phone}</small>` : ''}</td>
              <td>${a.email}</td>
              <td>${a.job_title || '—'}</td>
              <td>${a.resume_url ? `<a href="${a.resume_url}" target="_blank" class="btn btn-secondary btn-sm">View</a>` : '—'}</td>
              <td>${(() => {
                if (!a.certificate_url) return '—';
                try {
                  const urls = JSON.parse(a.certificate_url);
                  if (Array.isArray(urls)) {
                    return urls.map((u, i) => `<a href="${u}" target="_blank" class="btn btn-secondary btn-sm" style="margin:2px">${urls.length > 1 ? i+1 : 'View'}</a>`).join('');
                  }
                } catch(e) {}
                return `<a href="${a.certificate_url}" target="_blank" class="btn btn-secondary btn-sm">View</a>`;
              })()}</td>
              <td><span class="badge badge-${a.status}">${a.status}</span></td>
              <td>${new Date(a.created_at).toLocaleDateString()}</td>
              <td>
                <select onchange="updateAppStatus(${a.id}, this.value)" style="padding:6px 10px;background:var(--bg-input);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);font-size:12px;">
                  ${['pending','reviewed','shortlisted','rejected'].map(s => `<option value="${s}" ${a.status===s?'selected':''}>${s}</option>`).join('')}
                </select>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="mobile-card-list">
        ${state.applications.map(a => `
          <div class="mobile-card">
            <div class="mobile-card__top">
              <div class="mobile-card__img-placeholder">👤</div>
              <div class="mobile-card__info">
                <div class="mobile-card__name">${a.full_name}</div>
                <div class="mobile-card__sub">${a.email}</div>
              </div>
            </div>
            <div class="mobile-card__meta">
              <span class="badge badge-${a.status}">${a.status}</span>
              <span style="font-size:11px;color:var(--text-muted)">${a.job_title || ''} · ${new Date(a.created_at).toLocaleDateString()}</span>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:4px">
              <select onchange="updateAppStatus(${a.id}, this.value)" style="flex:1;padding:8px 10px;background:var(--bg-input);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);font-size:12px;">
                ${['pending','reviewed','shortlisted','rejected'].map(s => `<option value="${s}" ${a.status===s?'selected':''}>${s}</option>`).join('')}
              </select>
              ${a.resume_url ? `<a href="${a.resume_url}" target="_blank" class="btn btn-secondary btn-sm">Resume</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>`}
  `;
}

async function updateAppStatus(id, status) {
  try {
    await api(`/applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    showToast('Status updated');
  } catch(err) { showToast(err.message, 'error'); }
}

// ─── EVENT HANDLERS ──────────────────────────────────

window.handleLogin = async function(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  setButtonLoading(submitBtn, true);
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  try {
    await login(email, password);
  } finally {
    setButtonLoading(submitBtn, false);
  }
};

// Make functions globally accessible
window.navigateTo = navigateTo;
window.logout = logout;
window.openCoachModal = openCoachModal;
window.saveCoach = saveCoach;
window.deleteCoach = deleteCoach;
window.openBlogModal = openBlogModal;
window.saveBlog = saveBlog;
window.deleteBlog = deleteBlog;
window.openCareerModal = openCareerModal;
window.saveCareer = saveCareer;
window.deleteCareer = deleteCareer;
window.updateAppStatus = updateAppStatus;
window.toggleSidebar = toggleSidebar;
window.openTransformationModal = openTransformationModal;
window.saveTransformation = saveTransformation;
window.deleteTransformation = deleteTransformation;

// ─── TRANSFORMATIONS PAGE ────────────────────────────

function renderTransformations() {
  return `
    <div class="page-header">
      <div><h1>Transformations</h1><p>Manage Wall of Fame reviews</p></div>
      <button class="btn btn-primary btn-icon" onclick="openTransformationModal()"><span class="nav-icon">${icons.plus}</span> Add Review</button>
    </div>
    ${state.transformations.length === 0 ? '<div class="empty-state"><div class="empty-icon">' + icons.coaches + '</div><h3>No transformations yet</h3><p>Add your first transformation review.</p></div>' : `
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead><tr><th>Image</th><th>Name</th><th>Title</th><th>Rating</th><th>Metrics</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${state.transformations.map(t => `
            <tr>
              <td>${t.image_url ? `<img src="${t.image_url}" alt="${t.name}">` : '\u2014'}</td>
              <td><strong>${t.name}</strong></td>
              <td>${t.title}</td>
              <td>${'\u2605'.repeat(t.rating || 5)}</td>
              <td>${t.metrics || '\u2014'}</td>
              <td><span class="badge ${t.is_active ? 'badge-active' : 'badge-inactive'}">${t.is_active ? 'Active' : 'Inactive'}</span></td>
              <td style="white-space: nowrap;">
                <button class="btn btn-secondary btn-sm" onclick="openTransformationModal(${t.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTransformation(${t.id})">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="mobile-card-list">
        ${state.transformations.map(t => `
          <div class="mobile-card">
            <div class="mobile-card__top">
              ${t.image_url ? `<img class="mobile-card__img" src="${t.image_url}" alt="${t.name}">` : '<div class="mobile-card__img-placeholder">⭐</div>'}
              <div class="mobile-card__info">
                <div class="mobile-card__name">${t.name}</div>
                <div class="mobile-card__sub">${t.title}</div>
              </div>
            </div>
            <div class="mobile-card__meta">
              <span class="badge ${t.is_active ? 'badge-active' : 'badge-inactive'}">${t.is_active ? 'Active' : 'Inactive'}</span>
              ${t.metrics ? `<span style="font-size:11px;color:var(--text-muted)">${t.metrics}</span>` : ''}
            </div>
            <div class="mobile-card__actions">
              <button class="btn btn-secondary btn-sm" onclick="openTransformationModal(${t.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteTransformation(${t.id})">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`}
  `;
}

async function openTransformationModal(id = null) {
  let t = { name:'', title:'', description:'', rating:5, metrics:'', review:'' };
  if (id) {
    try { t = await api(`/transformations/${id}`); } catch(e) { showToast(e.message,'error'); return; }
  }

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" style="max-width:640px">
      <div class="modal-header">
        <h2>${id ? 'Edit' : 'Add'} Transformation</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">\u00d7</button>
      </div>
      <form onsubmit="saveTransformation(event, ${id})">
        <div class="form-row">
          <div class="form-group"><label>Member Name *</label><input name="name" value="${t.name || ''}" required></div>
          <div class="form-group"><label>Card Title *</label><input name="title" value="${t.title || ''}" required placeholder="e.g. The Athlete"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Rating (1-5)</label><input type="number" name="rating" min="1" max="5" value="${t.rating || 5}"></div>
          <div class="form-group"><label>Metrics <small>(e.g. 1.4k Hours)</small></label><input name="metrics" value="${t.metrics || ''}" placeholder="1.4k Hours"></div>
        </div>
        <div class="form-group"><label>Description <small>(journey summary)</small></label><textarea name="description" style="min-height:80px">${t.description || ''}</textarea></div>
        <div class="form-group"><label>Review / Quote <small>(member's testimonial)</small></label><textarea name="review" style="min-height:80px">${t.review || ''}</textarea></div>
        <div class="form-group"><label>Image ${id ? '(leave empty to keep current)' : ''}</label><input type="file" name="image" accept="image/*"></div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button type="submit" class="btn btn-primary">${id ? 'Update' : 'Create'} Review</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

async function saveTransformation(e, id) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  setButtonLoading(submitBtn, true);
  const formData = new FormData(form);

  try {
    const url = id ? `/transformations/${id}` : '/transformations';
    const method = id ? 'PUT' : 'POST';

    await api(url, { method, body: formData });
    document.querySelector('.modal-overlay').remove();
    showToast(`Review ${id ? 'updated' : 'created'} successfully!`);
    navigateTo('transformations');
  } catch(err) { 
    showToast(err.message, 'error'); 
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

function deleteTransformation(id) {
  showConfirmModal(
    'Delete Transformation',
    'Are you sure you want to delete this transformation? This action cannot be undone and will permanently remove it from the database.',
    async () => {
      await api(`/transformations/${id}`, { method: 'DELETE' });
      showToast('Transformation deleted successfully');
      navigateTo('transformations');
    }
  );
}

// ─── ENQUIRIES PAGE ────────────────────────────────────

function renderEnquiries() {
  return `
    <div class="page-header">
      <div><h1>Gym Enquiries</h1><p>Manage leads from the Get Fit form</p></div>
    </div>
    ${state.enquiries.length === 0 ? '<div class="empty-state"><div class="empty-icon">' + icons.enquiries + '</div><h3>No enquiries yet</h3><p>Leads will appear here.</p></div>' : `
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead><tr><th>Date</th><th>Name</th><th>Contact</th><th>Fitness Goals</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${state.enquiries.map(e => `
            <tr>
              <td>${new Date(e.created_at).toLocaleDateString()}</td>
              <td><strong>${e.name}</strong></td>
              <td>${e.email}<br/><small style="color:#aaa;">${e.phone}</small></td>
              <td>${e.fitness_goals || 'N/A'}</td>
              <td>
                <select onchange="handleEnquiryStatusChange(${e.id}, event)" style="padding:4px 8px; border-radius:4px; border:1px solid #333; background:#222; color:#fff; font-size:13px;">
                  <option value="new" ${e.status === 'new' ? 'selected' : ''}>New</option>
                  <option value="contacted" ${e.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                  <option value="closed" ${e.status === 'closed' ? 'selected' : ''}>Closed</option>
                </select>
              </td>
              <td><button class="btn btn-secondary btn-sm" onclick="viewEnquiry(${e.id})">View Details</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="mobile-card-list">
        ${state.enquiries.map(e => `
          <div class="mobile-card">
            <div class="mobile-card__top">
              <div class="mobile-card__img-placeholder">✉️</div>
              <div class="mobile-card__info">
                <div class="mobile-card__name">${e.name}</div>
                <div class="mobile-card__sub">${e.email} · ${e.phone}</div>
              </div>
            </div>
            <div class="mobile-card__meta">
              <span style="font-size:11px;color:var(--text-muted)">${e.fitness_goals || 'N/A'} · ${new Date(e.created_at).toLocaleDateString()}</span>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:4px">
              <select onchange="handleEnquiryStatusChange(${e.id}, event)" style="flex:1;padding:8px 10px;background:var(--bg-input);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);font-size:12px;">
                <option value="new" ${e.status==='new'?'selected':''}>New</option>
                <option value="contacted" ${e.status==='contacted'?'selected':''}>Contacted</option>
                <option value="closed" ${e.status==='closed'?'selected':''}>Closed</option>
              </select>
              <button class="btn btn-secondary btn-sm" onclick="viewEnquiry(${e.id})">Details</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`}
  `;
}

async function handleEnquiryStatusChange(id, event) {
  const newStatus = event.target.value;
  try {
    await api(`/enquiries/${id}/status`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
    showToast('Status updated successfully');
  } catch(err) {
    showToast(err.message, 'error');
    navigateTo('enquiries');
  }
}

function viewEnquiry(id) {
  const e = state.enquiries.find(x => x.id === id);
  if(!e) return;

  const statusColor = e.status === 'new' ? '#4CAF50' : e.status === 'contacted' ? '#FF9800' : '#888';

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" style="max-width: 620px; padding: 0;">
      <div class="modal-header" style="padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <h2 style="margin: 0; font-size: 20px;">Enquiry Details</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <div style="padding: 32px; color: #fff; font-family: 'Inter', sans-serif;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px 40px; margin-bottom: 32px;">
          <div>
            <div style="color: #777; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px; margin-bottom: 8px;">Full Name</div>
            <div style="font-size: 17px; font-weight: 500; color: #fff;">${e.name}</div>
          </div>
          <div>
            <div style="color: #777; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px; margin-bottom: 8px;">Fitness Goals</div>
            <div style="font-size: 17px; font-weight: 600; color: #DD3028;">${e.fitness_goals || 'N/A'}</div>
          </div>
          <div>
            <div style="color: #777; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px; margin-bottom: 8px;">Email Address</div>
            <div style="font-size: 15px; color: #ddd; word-break: break-all;">${e.email}</div>
          </div>
          <div>
            <div style="color: #777; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px; margin-bottom: 8px;">Phone Number</div>
            <div style="font-size: 15px; color: #ddd;">${e.phone}</div>
          </div>
          <div>
            <div style="color: #777; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px; margin-bottom: 8px;">Age & Gender</div>
            <div style="font-size: 14px; color: #ddd;">${e.age || 'N/A'} yr, ${e.gender || 'N/A'}</div>
          </div>
          <div>
            <div style="color: #777; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px; margin-bottom: 8px;">Training Mode</div>
            <div style="font-size: 14px; color: #ddd;">${e.training_mode || 'N/A'}</div>
          </div>
          <div>
            <div style="color: #777; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px; margin-bottom: 8px;">Submitted On</div>
            <div style="font-size: 14px; color: #aaa;">${new Date(e.created_at).toLocaleString()}</div>
          </div>
          <div>
            <div style="color: #777; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px; margin-bottom: 8px;">Current Status</div>
            <div style="display: inline-block; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; background: ${statusColor}22; color: ${statusColor}; border: 1px solid ${statusColor}44;">${e.status}</div>
          </div>
        </div>
        <div style="background: rgba(255,255,255,0.03); border-left: 3px solid #DD3028; padding: 20px 24px; border-radius: 0 8px 8px 0;">
          <div style="color: #777; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.8px; margin-bottom: 12px;">Message / Additional Info</div>
          <p style="margin: 0; line-height: 1.7; font-size: 14px; color: #ccc; white-space: pre-wrap;">${e.message || 'No additional message provided.'}</p>
        </div>
      </div>
      <div style="padding: 20px 32px; border-top: 1px solid rgba(255,255,255,0.06); text-align: right;">
        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// ─── INIT ────────────────────────────────────────────
render();
