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

// In-memory/localStorage caching wrapper
async function fetchWithCache(url, cacheKey, fallbackData = null) {
  const cached = localStorage.getItem(cacheKey);
  
  // Background fetch to ensure data is always fresh for the next load
  const fetchPromise = fetchJSON(url).then(data => {
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  }).catch(err => {
    console.error(`Background fetch failed for ${cacheKey}:`, err);
    throw err;
  });

  // If we have cached data, return it instantly while the background fetch updates the cache silently
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // Ignore parse error and wait for fetch
    }
  }

  // If we have instant fallback data provided (for the very first visit), return that!
  if (fallbackData) {
    return fallbackData;
  }
  
  // If no cache and no fallback, wait for the network
  return fetchPromise;
}

// ─── COACHES ─────────────────────────────────────────

// Hardcoded real data to instantly render on the very first visit before the API resolves
const INITIAL_COACHES = [
  { name: 'Rakesh', title: 'Fat Loss', image_url: '/images/square.png', transformations: 50, hours: '10k+', specialty: 'Fat Loss', description: 'Expert in shedding fat quickly.' },
  { name: 'Santosh', title: 'Bodybuilding', image_url: '/images/square.png', transformations: 40, hours: '8k+', specialty: 'Bodybuilding', description: 'Building muscle mass and strength.' },
  { name: 'Madini', title: 'Special Population Training', image_url: '/images/square.png', transformations: 30, hours: '5k+', specialty: 'Special Population Training', description: 'Training for all conditions.' },
  { name: 'Akhil', title: 'Overall Fitness & Strength', image_url: '/images/square.png', transformations: 60, hours: '12k+', specialty: 'Overall Fitness', description: 'Achieve peak functional fitness.' },
  { name: 'Samuel', title: 'Boxing', image_url: '/images/square.png', transformations: 20, hours: '4k+', specialty: 'Boxing', description: 'Professional boxing coach.' }
];

export async function getCoaches() {
  return fetchWithCache(`${API_BASE}/coaches`, 'nlc_coaches_cache', INITIAL_COACHES);
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

// ─── GOOGLE REVIEWS ──────────────────────────────────

export async function getGoogleReviews() {
  return fetchJSON(`${API_BASE}/reviews`);
}
