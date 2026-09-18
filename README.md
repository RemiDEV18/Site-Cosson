# Site Cosson Électricité

Site vitrine statique en un seul fichier (`index.html`), avec un panneau
d'administration intégré (accessible via `#admin` en bas de page).

## Déployer sur GitHub + Vercel

1. Crée un nouveau dépôt sur GitHub et mets-y ces fichiers (`index.html`, `vercel.json`).
2. Sur [vercel.com](https://vercel.com), clique sur **Add New → Project**,
   importe ce dépôt GitHub. Vercel détecte un site statique, aucune
   configuration n'est nécessaire (pas de build command).
3. Déploie : le site est en ligne sur `ton-projet.vercel.app` (domaine
   personnalisé possible ensuite dans les réglages Vercel).

## Modifier le contenu du site

Le panneau d'administration (`#admin`, code d'accès par défaut : `cosson18`)
permet de modifier tous les textes du site. **Attention** : comme ce site
est 100% statique (pas de serveur/base de données), les modifications faites
depuis le panneau admin ne sont enregistrées que dans le navigateur de la
personne qui les fait — elles ne seront pas visibles par les vrais visiteurs
du site tant que le fichier `index.html` n'est pas mis à jour et redéployé.

Pour publier un changement pour de vrai :
1. Ouvre `#admin`, modifie le contenu, clique sur **Enregistrer**.
2. Clique sur **Exporter le contenu (JSON)** pour télécharger le fichier
   `cosson-electricite-contenu.json`.
3. Dans `index.html`, remplace le contenu du bloc
   `<script id="site-data" type="application/json"> ... </script>`
   par le contenu de ce fichier JSON.
4. Commit + push sur GitHub : Vercel redéploie automatiquement.

Pour un vrai back-office (modifications en ligne, sans repasser par GitHub),
il faudrait ajouter une base de données et une API (par ex. avec les
fonctions serverless de Vercel) — dis-le-moi si tu veux que je le mette en place.

## Changer le code d'accès admin

Dans `index.html`, cherche la ligne :
```js
var ADMIN_CODE = "cosson18";
```
et remplace `"cosson18"` par le code de ton choix.
