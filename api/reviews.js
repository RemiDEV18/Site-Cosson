// Fonction serveur Vercel : récupère les avis Google Business Profile
// Version compatible avec Places API (NEW)

module.exports = async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      res.status(500).json({ error: 'missing_config' });
      return;
    }

    // URL de la nouvelle API Google Places
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?fields=reviews,rating,userRatingCount,googleMapsUri&languageCode=fr&key=${apiKey}`;

    const apiRes = await fetch(url, {
      headers: {
        'X-Goog-FieldMask': 'reviews,rating,userRatingCount,googleMapsUri'
      }
    });

    const data = await apiRes.json();

    if (data.error) {
      res.status(502).json({ error: data.error.message || 'api_error' });
      return;
    }

    const reviews = (data.reviews || []).map((rv) => ({
      author: rv.authorAttribution?.displayName || null,
      photo: rv.authorAttribution?.photoUri || null,
      rating: rv.rating || null,
      relativeTime: rv.relativePublishTimeDescription || null,
      text: rv.text || null
    }));

    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
    res.status(200).json({
      rating: data.rating || null,
      total: data.userRatingCount || 0,
      mapsUrl: data.googleMapsUri || null,
      reviews: reviews
    });

  } catch (err) {
    res.status(500).json({ error: 'server_error' });
  }
};
