/**
 * API Service Layer — Centralized API calls for the frontend.
 * All components import from here instead of making direct fetch calls.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── COACHES ─────────────────────────────────────────

export async function getCoaches() {
  return fetchJSON(`${API_BASE}/coaches`);
}

// ─── BLOGS ───────────────────────────────────────────

export async function getBlogs(category = 'All', limit = 50, offset = 0) {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.set('category', category);
  params.set('limit', limit);
  params.set('offset', offset);
  
  return fetchJSON(`${API_BASE}/blogs?${params.toString()}`);
}

export async function getBlogBySlug(slug) {
  return fetchJSON(`${API_BASE}/blogs/${slug}`);
}

export async function getBlogCategories() {
  return fetchJSON(`${API_BASE}/blogs/categories`);
}

// ─── CAREERS ─────────────────────────────────────────

export async function getJobOpenings() {
  return fetchJSON(`${API_BASE}/careers`);
}

export async function applyForJob(jobId, formData) {
  const res = await fetch(`${API_BASE}/careers/${jobId}/apply`, {
    method: 'POST',
    body: formData, // FormData with resume file
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Application failed');
  }
  return res.json();
}

// ─── TRANSFORMATIONS ─────────────────────────────────

export async function getTransformations() {
  return fetchJSON(`${API_BASE}/transformations`);
}

// ─── ENQUIRIES ───────────────────────────────────────

export async function submitEnquiryForm(formData) {
  const res = await fetch(`${API_BASE}/enquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Submission failed');
  }
  return res.json();
}
