# JDS Global — Site vitrine

## Contexte

Site vitrine statique de **JDS Global**, SAS de négoce & déstockage basée à Reichstett (Alsace).
Activité : rachat de stocks d'entreprises (invendus, fins de série, surstocks, liquidations) + revente en gros et au détail.
Dirigeant : Jordan Fritz. Le site s'adresse d'abord aux **vendeurs de stock** (objectif : générer des appels/demandes), ensuite aux acheteurs revendeurs.

- Domaine cible : **https://jds-global.com** (apex, pas de www — www redirige vers apex)
- E-mail : contact@jds-global.com — **l'e-mail vit déjà sur ce domaine : ne jamais toucher aux enregistrements DNS MX/TXT existants**
- Téléphone : +33 6 67 54 62 19
- Adresse : 3 rue du Chemin de Fer, 67116 Reichstett
- Horaires : lundi–vendredi, 8h30–19h
- Mentions légales : SAS au capital de 1 000 € · RCS Strasbourg 938 870 557 · TVA FR82 938 870 557

## Structure

Site 100 % statique, aucun build, aucun framework. HTML/CSS/JS vanilla.

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil (hero "Nous rachetons vos stocks", aperçu rachat, méthode 3 étapes, CTA) |
| `presentation.html` | Positionnement (négociant direct, pas une marketplace), engagements, méthode |
| `services.html` | Détail rachat (grille `grid cols4` : Invendus, Fins de série, Surstocks, Liquidations) + achat gros/détail |
| `contact.html` | Coordonnées + formulaire `#leadform` |
| `styles.css` | Styles partagés (variables CSS en tête : `--noir`, `--brass`, etc.) |
| `script.js` | Menu mobile, reveal au scroll, soumission du formulaire |
| `vercel.json` | cleanUrls, headers sécurité, cache |
| `sitemap.xml`, `robots.txt`, `site.webmanifest` | SEO/PWA |
| `favicon.*`, `apple-touch-icon.png`, `icon-192/512.png`, `og-image.png` | Icônes et image de partage |
| `DEPLOIEMENT.md` | Guide pas-à-pas Vercel + DNS + Formspree — **le lire avant tout déploiement** |

## Conventions à respecter

- **Design** : noir graphite / laiton. Ne pas introduire d'autres couleurs. Palette dans `:root` de `styles.css` (`--noir #0B0B0C`, `--brass #C9A24B`, `--brass-hi #E7C87A`, `--creme #EAE5D9`). Typo : Oswald (titres, uppercase) + Inter (texte). Signature visuelle : filets dorés fins (`--line`), pas de motifs "danger"/hachures.
- **Logo** : fichier `logo.svg` (Inter ExtraBold, JD laiton + S clair, GLOBAL centré dessous) — même logo que le hub arbitrage. Ne pas recréer en texte CSS.
- **URLs propres** : liens internes SANS extension (`/services`, pas `/services.html`) — cohérent avec `cleanUrls` de vercel.json. Canonicals et sitemap suivent la même règle.
- **Langue** : tout en français.
- **Contenu** : ne PAS mentionner le rachat de "retours" ou produits non neufs (choix assumé : on ne rachète que du neuf). Catégories de rachat = les 4 de la grille, pas plus.
- Chaque page contient un bloc JSON-LD `LocalBusiness` : si tel/adresse/horaires changent, les mettre à jour sur **les 4 pages** + le texte visible de `contact.html`.

## Formulaire

`script.js`, première ligne : `var FORMSPREE_ID = "";`
- Vide → fallback mailto (fonctionne sans configuration).
- Rempli avec l'ID Formspree (compte : contact@jds-global.com) → envoi AJAX vers `https://formspree.io/f/{ID}` avec messages de succès/erreur.

## Déploiement

Cible : **Vercel**, projet statique (framework "Other", aucun build).
1. Repo GitHub suggéré : `Jordan6701/jds-global-site` (le compte a déjà `Jordan6701/Prep-center` sur Vercel).
2. `vercel --prod` depuis la racine.
3. Domaine : ajouter `jds-global.com` + `www.jds-global.com` dans Vercel → suivre les enregistrements A/CNAME affichés par Vercel (voir DEPLOIEMENT.md). **Ne toucher à aucun MX/TXT.**
4. Après mise en ligne : Google Search Console (soumettre `https://jds-global.com/sitemap.xml`) + créer la fiche Google Business Profile.

## À faire (état au dernier point de synchronisation)

- [ ] Push GitHub + déploiement Vercel prod
- [ ] Rattachement domaine jds-global.com (A + CNAME, sans toucher MX/TXT)
- [ ] Création formulaire Formspree + renseigner FORMSPREE_ID + redéployer
- [ ] Search Console + sitemap
- [ ] Google Business Profile (levier local prioritaire)

## Garde-fous

- Toujours montrer les commandes DNS/Git destructives avant exécution et attendre validation.
- Pas de refonte visuelle sans demande explicite : le design est validé par Jordan.
- Vérifier le rendu après toute modif (les 4 pages partagent header/footer dupliqués : une modif de nav = 4 fichiers).
