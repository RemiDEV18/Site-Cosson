// Fonction serveur Vercel : récupère les avis Google Business Profile
// et les renvoie au site (voir /README.md pour la configuration).
//
// Variables d'environnement nécessaires (à définir dans Vercel > Settings > Environment Variables) :
//   GOOGLE_PLACES_API_KEY = votre clé API Google Places
//   GOOGLE_PLACE_ID       = l'identifiant Google Place de votre fiche établissement

module.exports = async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      res.status(500).json({ error: 'missing_config' });
      return;
    }

    const fields = 'name,rating,user_ratings_total,reviews,url';
    const url =
      'https://maps.googleapis.com/maps/api/place/details/json' +
      '?place_id=' + encodeURIComponent(placeId) +
      '&fields=' + encodeURIComponent(fields) +
      '&language=fr' +
      '&reviews_no_translations=true' +
      '&key=' + apiKey;

    const apiRes = await fetch(url);
    const data = await apiRes.json();

    if (data.status !== 'OK') {
      res.status(502).json({ error: data.status || 'api_error' });
      return;
    }

    const result = data.result || {};
    const reviews = (result.reviews || []).map((rv) => ({
      author: rv.author_name,
      photo: rv.profile_photo_url,
      rating: rv.rating,
      relativeTime: rv.relative_time_description,
      text: rv.text
    }));

    // Le contenu est mis en cache 6h côté Vercel pour limiter les appels à l'API Google.
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
    res.status(200).json({
      rating: typeof result.rating === 'number' ? result.rating : null,
      total: result.user_ratings_total || 0,
      mapsUrl: result.url || null,
      reviews: reviews
    });
  } catch (err) {
    res.status(500).json({ error: 'server_error' });
  }
};
