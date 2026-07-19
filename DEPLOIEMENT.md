# Mise en ligne — jds-global.com

Trois étapes, ~15 minutes au total. Dans l'ordre.

---

## 1. Déployer sur Vercel (~5 min)

**Option A — sans terminal (la plus simple) :**
1. Va sur https://vercel.com et connecte-toi (ton compte existant, celui de Prep-center).
2. "Add New… → Project" → onglet **"Deploy from CLI or Import"** → glisse le dossier `site/` (ou le zip décompressé) dans la zone d'upload. Autre chemin : pousse le dossier dans un repo GitHub `Jordan6701/jds-global-site` et importe-le.
3. Framework : **Other**. Aucun réglage build (site statique). Deploy.
4. Le site est en ligne sur une URL `*.vercel.app`. Vérifie que tout s'affiche.

**Option B — en CLI :**
```bash
npm i -g vercel
cd site
vercel --prod
```

Le fichier `vercel.json` inclus gère déjà : URLs propres (`/services` sans .html), en-têtes de sécurité, cache des assets.

---

## 2. Rattacher le domaine jds-global.com (~5 min)

1. Dans le projet Vercel : **Settings → Domains → Add** → `jds-global.com` (ajoute aussi `www.jds-global.com`, Vercel redirigera www → apex).
2. Vercel affiche les enregistrements DNS à créer. Chez ton registrar (là où tu as acheté jds-global.com) :
   - Type **A** — nom `@` — valeur `76.76.21.21`
   - Type **CNAME** — nom `www` — valeur `cname.vercel-dns.com`
   *(Vérifie les valeurs exactes affichées par Vercel au moment de l'ajout : elles font foi.)*
3. **Important — ton e-mail** : contact@jds-global.com tourne déjà sur ce domaine. Ne touche à **aucun enregistrement MX ni TXT (SPF/DKIM)** existant. Tu ajoutes seulement le A et le CNAME ci-dessus.
4. Propagation : de quelques minutes à quelques heures. Vercel émet le certificat HTTPS automatiquement.

---

## 3. Activer le formulaire Formspree (~5 min)

Tant que ce n'est pas fait, le formulaire fonctionne quand même (il ouvre la messagerie du visiteur). Pour recevoir les demandes directement :

1. Crée un compte sur https://formspree.io (plan gratuit : 50 envois/mois).
2. "New form" → e-mail de réception : `contact@jds-global.com` → Formspree te donne un ID du type `mzbqwxyz`.
3. Ouvre `script.js`, première ligne :
   ```js
   var FORMSPREE_ID = "";      →      var FORMSPREE_ID = "mzbqwxyz";
   ```
4. Redéploie (re-upload du fichier ou `vercel --prod`).
5. Teste : envoie une demande depuis /contact, vérifie qu'elle arrive dans ta boîte. Le premier envoi demande une confirmation par e-mail à Formspree — clique le lien.

---

## Après la mise en ligne (SEO, à faire une fois)

1. **Google Search Console** — https://search.google.com/search-console → ajoute la propriété `jds-global.com` (validation DNS : un TXT à ajouter, sans risque pour l'e-mail) → soumets le sitemap : `https://jds-global.com/sitemap.xml`.
2. **Google Business Profile** — https://business.google.com → crée la fiche JDS Global (adresse Reichstett, tél 06 67 54 62 19, horaires lun–ven 8h30–19h, catégorie "Grossiste" ou "Service de déstockage"). C'est le levier local n°1, plus impactant que le site les premiers mois.
3. **Test de partage** — colle https://jds-global.com dans WhatsApp : la vignette or/noir doit apparaître. Si une vieille version s'affiche plus tard, purge le cache sur https://developers.facebook.com/tools/debug/.

---

## Contenu du dossier `site/`

| Fichier | Rôle |
|---|---|
| index / presentation / services / contact .html | Les 4 pages |
| styles.css, script.js | Style et interactions partagés |
| vercel.json | Config Vercel (URLs propres, sécurité, cache) |
| sitemap.xml, robots.txt | Indexation |
| favicon.* , apple-touch-icon, icon-192/512 | Icônes |
| og-image.png | Vignette de partage (WhatsApp, LinkedIn…) |
| site.webmanifest | Manifest mobile |
