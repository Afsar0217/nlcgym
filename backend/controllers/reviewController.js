const db = require('../config/db');

const PLACE_ID = 'ChIJD62kQQ-NyzsRyogM6WOI4ZE';
const CACHE_KEY = 'google_reviews';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const fetchReviewsFromSerpApi = async () => {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    throw new Error('SERPAPI_KEY is not set in environment variables');
  }

  const url = `https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${PLACE_ID}&hl=en&api_key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    throw new Error(`SerpApi Error: ${data.error}`);
  }

  let rawReviews = data.reviews || [];
  
  // Map SerpApi format to exactly match what the frontend expects
  // (which was originally based on the official Google API format)
  let formattedReviews = rawReviews.map(r => ({
    author_name: r.user?.name || 'Anonymous',
    profile_photo_url: r.user?.thumbnail || '',
    rating: r.rating || 5,
    text: r.snippet || '',
    relative_time_description: r.date || ''
  }));

  // Sort reviews to show highest rating first
  formattedReviews = formattedReviews.sort((a, b) => b.rating - a.rating);

  return formattedReviews;
};

exports.getReviews = async (req, res) => {
  try {
    // 1. Check if we have cached reviews in DB
    const { rows } = await db.query('SELECT value, updated_at FROM google_reviews WHERE key = $1', [CACHE_KEY]);
    
    let cachedData = rows[0];
    const now = new Date();

    // 2. If no cache OR cache is older than CACHE_TTL, fetch new ones
    if (!cachedData || (now - new Date(cachedData.updated_at)) > CACHE_TTL) {
      try {
        console.log('Fetching fresh reviews from SerpApi...');
        const freshReviews = await fetchReviewsFromSerpApi();
        
        // Save to DB
        const valueJson = JSON.stringify(freshReviews);
        await db.query(
          `INSERT INTO google_reviews (key, value, updated_at) 
           VALUES ($1, $2, NOW()) 
           ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
          [CACHE_KEY, valueJson]
        );

        return res.json(freshReviews);
      } catch (googleErr) {
        console.error('Error fetching from Google:', googleErr.message);
        // If Google API fails, fall back to cached data if it exists, even if expired
        if (cachedData) {
          console.log('Falling back to expired cache due to Google API error');
          return res.json(cachedData.value);
        }
        return res.status(500).json({ error: 'Failed to fetch reviews' });
      }
    }

    // 3. Return valid cached data
    return res.json(cachedData.value);

  } catch (error) {
    console.error('Error in getReviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
