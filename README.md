# Site Cosson Électricité

Site vitrine statique en un seul fichier (`index.html`), avec un panneau
d'administration intégré (accessible via `#admin` en bas de page), et une
fonction serveur (`api/reviews.js`) qui récupère automatiquement les avis
Google de l'établissement.

## Déployer sur GitHub + Vercel

1. Crée un nouveau dépôt sur GitHub et mets-y ces fichiers (`index.html`,
   `vercel.json`, le dossier `api/`).
2. Sur [vercel.com](https://vercel.com), clique sur **Add New → Project**,
   importe ce dépôt GitHub. Vercel détecte automatiquement le site statique
   et la fonction serveur dans `api/`, aucune configuration n'est nécessaire.
3. Déploie : le site est en ligne sur `ton-projet.vercel.app` (domaine
   personnalisé possible ensuite dans les réglages Vercel).
4. Configure les avis Google (voir section dédiée ci-dessous), sinon la page
   Avis affichera un message de repli en attendant.

## Avis Google (automatique)

La page **Avis** (et l'accueil) affiche désormais automatiquement les avis
Google de l'établissement — il n'y a plus rien à saisir à la main. Cela
passe par la fonction `api/reviews.js`, qui a besoin de deux informations
secrètes que Google te fournit :

1. **Créer une clé API Google Places**
   - Va sur [console.cloud.google.com](https://console.cloud.google.com/),
     crée un projet (ou utilise un projet existant).
   - Dans **API et services → Bibliothèque**, active **Places API**.
   - Dans **API et services → Identifiants**, crée une **clé API**.
   - Restreins-la (« Restrictions de l'API ») à **Places API** uniquement,
     pour éviter qu'elle serve à autre chose si elle fuite.
2. **Trouver ton Place ID**
   - Utilise l'outil officiel de Google :
     [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)
   - Recherche « Cosson Électricité, 1 Impasse des Genêts, 18310 Graçay »,
     clique sur la bonne fiche, copie le **Place ID** affiché.
3. **Renseigner ces deux valeurs dans Vercel**
   - Dans le projet Vercel : **Settings → Environment Variables**, ajoute :
     - `GOOGLE_PLACES_API_KEY` = la clé créée à l'étape 1
     - `GOOGLE_PLACE_ID` = l'identifiant copié à l'étape 2
   - Redéploie le projet (Vercel → onglet Deployments → **Redeploy**) pour
     que les nouvelles variables soient prises en compte.

Une fois configuré, les avis se mettent à jour tout seuls (rafraîchis toutes
les 6h environ) — plus besoin de repasser par l'administration.

**Limites côté Google** (pas modifiables) : l'API Places ne renvoie que les
5 avis les plus pertinents, pas l'historique complet. Les appels à cette API
au-delà du crédit gratuit mensuel de Google Cloud sont facturés, mais avec
la mise en cache (6h) et le trafic d'un site vitrine, l'usage reste très
largement dans le crédit gratuit.

Tant que ces variables ne sont pas configurées, ou en dehors d'un déploiement
Vercel (par ex. en ouvrant `index.html` directement, ou dans l'aperçu
claude.ai), la page affiche un message de repli invitant à consulter la page
Facebook, plutôt que des avis inventés.

## Modifier le reste du contenu du site

Le panneau d'administration (`#admin`, code d'accès par défaut : `cosson18`)
permet de modifier tous les autres textes du site (services, photovoltaïque,
bornes, domotique, galerie, à propos, contact — mais plus les avis, gérés
automatiquement désormais). **Attention** : comme ce site est 100% statique,
les modifications faites depuis le panneau admin ne sont enregistrées que
dans le navigateur de la personne qui les fait — elles ne seront pas
visibles par les vrais visiteurs du site tant que le fichier `index.html`
n'est pas mis à jour et redéployé.

Pour publier un changement pour de vrai :
1. Ouvre `#admin`, modifie le contenu, clique sur **Enregistrer**.
2. Clique sur **Exporter le contenu (JSON)** pour télécharger le fichier
   `cosson-electricite-contenu.json`.
3. Dans `index.html`, remplace le contenu du bloc
   `<script id="site-data" type="application/json"> ... </script>`
   par le contenu de ce fichier JSON.
4. Commit + push sur GitHub : Vercel redéploie automatiquement.

## Changer le code d'accès admin

Dans `index.html`, cherche la ligne :
```js
var ADMIN_CODE = "cosson18";
```
et remplace `"cosson18"` par le code de ton choix.

