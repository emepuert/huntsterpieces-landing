# 📁 Images du Site

Ce dossier contient toutes les images nécessaires pour le site.

## ✅ Fichiers présents

### 📸 Screenshots
- ✅ `player-screenshot.png` - Interface joueur (vue mobile)
- ✅ `admin-screenshot.png` - Dashboard administrateur

### 🎯 Favicons
- ✅ `favicon.ico` - Icône principale (multi-résolution)
- ✅ `favicon.svg` - Version vectorielle (moderne)
- ✅ `favicon-96x96.png` - Version PNG haute résolution
- ✅ `apple-touch-icon.png` - Icône iOS (180x180)

### 🌐 Social Media
- ✅ `og-image.png` - Image Open Graph pour les réseaux sociaux (1200x630)

### 📱 Progressive Web App (PWA)
- ✅ `site.webmanifest` - Configuration PWA
- ✅ `web-app-manifest-192x192.png` - Icône PWA 192x192
- ✅ `web-app-manifest-512x512.png` - Icône PWA 512x512

---

## 🚀 Intégration dans le site

Tous ces fichiers sont **déjà intégrés** dans le HTML :

### Dans `<head>` :
```html
<!-- Favicons -->
<link rel="icon" type="image/x-icon" href="./images/favicon.ico">
<link rel="icon" type="image/svg+xml" href="./images/favicon.svg">
<link rel="icon" type="image/png" sizes="96x96" href="./images/favicon-96x96.png">
<link rel="apple-touch-icon" sizes="180x180" href="./images/apple-touch-icon.png">

<!-- PWA Manifest -->
<link rel="manifest" href="./images/site.webmanifest">
<meta name="theme-color" content="#1A1F3A">

<!-- Open Graph -->
<meta property="og:image" content="./images/og-image.png">
```

### Screenshots utilisés :
- Section "Player View" → `player-screenshot.png`
- Section "Admin Panel" → `admin-screenshot.png`

---

## 🎨 Bonus PWA (Progressive Web App)

Le site est maintenant configuré comme une PWA ! Cela permet aux utilisateurs :
- 📲 D'installer le site comme une app sur mobile/desktop
- 🚀 De l'utiliser en mode standalone (sans barre de navigation)
- 🎯 D'avoir une icône sur leur écran d'accueil

Les icônes PWA (192x192 et 512x512) sont utilisées par Android/Chrome quand on "Ajoute à l'écran d'accueil".

---

## ✅ Tout est en place !

Tous les fichiers sont présents et correctement intégrés dans le HTML. Le site est prêt ! 🎉

### 💡 Pour tester :
1. **Favicons** : Ouvre le site et regarde l'onglet du navigateur
2. **PWA** : Sur mobile, clique sur "Ajouter à l'écran d'accueil"
3. **Open Graph** : Partage l'URL sur LinkedIn/Facebook pour voir l'image de prévisualisation
4. **Screenshots** : Vérifie les sections "Player View" et "Admin Panel"

