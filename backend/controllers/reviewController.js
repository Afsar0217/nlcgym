const db = require('../config/db');

const PLACE_ID = 'ChIJD62kQQ-NyzsRyogM6WOI4ZE';
const CACHE_KEY = 'google_reviews';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const fetchReviewsFromGoogle = async () => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY is not set in environment variables');
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK') {
    throw new Error(`Google API Error: ${data.status} - ${data.error_message || ''}`);
  }

  // Filter for 5-star reviews and sort by time, or just take what they give us
  // The API usually returns up to 5 reviews.
  let reviews = data.result?.reviews || [];
  
  // Sort reviews to show highest rating first, then most recent
  reviews = reviews.sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.time - a.time;
  });

  return reviews;
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
        console.log('Fetching fresh reviews from Google API...');
        const freshReviews = await fetchReviewsFromGoogle();
        
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
