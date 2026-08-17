# Archive mobile — décision

Depuis le 17 août 2026, ce dossier n’est plus un frontend produit.

## Statut

- `apps/web` est l’unique application Web active et l’unique cible Vercel.
- `frontend/` est gelé : aucune nouvelle fonctionnalité, correction produit ou évolution éditoriale ne doit y être développée.
- Le dossier reste versionné parce qu’il contient l’unique projet Android/Capacitor, le pont natif, les scripts de compilation APK et des ressources de contrôle visuel qui ne sont pas encore migrés.
- Les commandes historiques restent utilisables uniquement pour reproduire ou extraire la coque mobile, jamais pour publier un second site.

## Éléments à migrer avant suppression

1. le projet Capacitor et sa configuration Android ;
2. le pont d’authentification et les comportements natifs (barres système, haptique, splash screen) ;
3. les scripts de diagnostic, compilation et installation APK ;
4. les ressources Android et les contrôles visuels encore utiles.

Une fois ces quatre éléments repris par `apps/web` ou par une coque mobile dédiée, validés sur appareil et documentés, ce dossier pourra être supprimé dans un commit séparé.
