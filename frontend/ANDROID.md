# Excellence Lycée sur Android

Le projet Android est généré avec Capacitor 8 dans `android/`. L’interface Vite compilée dans `dist/` est embarquée dans l’APK ; l’application ne charge pas le site Vercel dans une WebView distante. Les contenus et comptes continuent d’utiliser le projet Supabase `cxcxztiyzprgcjniimuf`.

## Commandes

- `npm run mobile:setup` : installe une chaîne Android portable dans `%LOCALAPPDATA%\ExcellenceLyceeMobile`.
- `npm run mobile:sync` : compile le frontend puis le synchronise avec Android.
- `npm run mobile:apk` : génère `artifacts/Excellence-Lycee-debug.apk`.
- `npm run mobile:install` : installe cet APK sur l’unique téléphone relié en USB.

## Installer sur un téléphone

Deux méthodes sont possibles :

1. Copier `artifacts/Excellence-Lycee-debug.apk` sur le téléphone, l’ouvrir et autoriser temporairement l’installation depuis cette source.
2. Activer les options développeur et le débogage USB, brancher le téléphone, accepter la clé du PC puis exécuter `npm run mobile:install`.

Cette version est signée avec une clé de débogage. Elle sert uniquement aux tests et ne doit pas être envoyée sur Google Play.

## Fonctions déjà adaptées

- identifiant Android `com.excellencelycee.app` ;
- API Android cible 36, Android minimum 7/API 24 ;
- bouton Retour et mise en arrière-plan ;
- reprise automatique de la session Supabase et de la présence ;
- zones sûres et affichage bord à bord ;
- vibrations légères et sons de clic ;
- bannière hors connexion ;
- lien profond `excellencelycee://reset-password` côté application.

## Avant une publication Play Store

- tester l’APK sur plusieurs téléphones ;
- remplacer les icônes et l’écran de lancement provisoires ;
- autoriser le lien de récupération mobile dans Supabase ;
- ajouter les notifications push FCM pour les défis ;
- ajouter la suppression du compte et la politique de confidentialité ;
- produire un AAB signé avec une clé d’upload privée.
