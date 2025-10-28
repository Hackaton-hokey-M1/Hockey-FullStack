# Système d'affichage des prédictions dans le classement

## 📋 Résumé des modifications

J'ai implémenté un système complet pour afficher les prédictions des membres dans le classement du groupe, avec mise à jour automatique des scores.

## 🎯 Fonctionnalités ajoutées

### 1. **API de récupération des prédictions**

- **Fichier**: `src/app/api/groups/[id]/predictions/route.ts`
- Récupère toutes les prédictions d'un groupe avec les informations des utilisateurs
- Vérifie que l'utilisateur est membre du groupe avant de retourner les données

### 2. **Composant d'affichage des prédictions**

- **Fichier**: `src/components/PredictionsRanking.tsx`
- Affiche le classement des membres avec leurs pronostics
- Montre le score prédit (ex: 3-2) à côté de chaque membre
- Affiche les points gagnés sur le match (badge vert avec +3, +1, etc.)
- Design responsive et animé avec Framer Motion

### 3. **Système de calcul des points**

- **Fichier**: `src/lib/scoring.ts`
- Calcule automatiquement les points selon les règles du groupe :
  - **Score exact** : Nombre de points configuré (par défaut 3)
  - **Bon résultat** : Points si victoire/défaite/nul correct (par défaut 1)
  - **Mauvais pronostic** : 0 points

### 4. **API de mise à jour des scores**

- **Fichier**: `src/app/api/predictions/update-scores/route.ts`
- Met à jour automatiquement les scores quand un match est terminé
- Calcule les points de chaque prédiction
- Met à jour le score total de chaque membre dans le groupe

### 5. **Mise à jour automatique en temps réel**

- **Fichier**: `src/components/AutoScoreUpdater.tsx`
- Vérifie toutes les 30 secondes si le match est terminé
- Lance automatiquement la mise à jour des scores
- Rafraîchit l'affichage après la mise à jour

### 6. **Intégration dans la page du groupe**

- **Fichier**: `src/app/[locale]/groups/[id]/page.tsx`
- Charge les prédictions en parallèle avec les autres données
- Affiche le composant `PredictionsRanking` avec toutes les données
- Active le système de mise à jour automatique

## 🔧 Corrections effectuées

### Problème de matching utilisateur/prédiction

Le problème initial était que les prédictions n'étaient pas affichées. La cause :

- L'interface `Member` était incorrecte : elle avait `id: number` + `userId: string`
- En réalité, l'API retourne `id: string` qui EST déjà le `userId`

**Solution** : Correction de l'interface et utilisation de `member.id` pour le matching.

### Autres corrections

- Correction des types TypeScript (`joinedAt` doit être `string` côté client)
- Correction de l'ordre des imports
- Ajout de logs de débogage pour faciliter le suivi

## 📊 Structure des données

### Prédiction

```typescript
interface Prediction {
  id: number;
  userId: string; // ID de l'utilisateur
  groupId: number;
  externalMatchId: string; // ID du match externe
  homeScore: number; // Score prédit équipe domicile
  awayScore: number; // Score prédit équipe extérieure
  points: number | null; // Points gagnés (null si non calculé)
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}
```

### Membre du groupe

```typescript
interface Member {
  id: string; // C'est le userId
  name: string | null;
  role: "ADMIN" | "MEMBER";
  score: number; // Score total dans le groupe
  isBanned: boolean;
  joinedAt: string;
}
```

## 🎨 Interface utilisateur

Le classement affiche maintenant :

1. **Position** : Badge coloré (or pour 1er, argent pour 2e, bronze pour 3e)
2. **Nom du membre** : Avec icônes pour admin/banni
3. **Date d'adhésion**
4. **Pronostic** : Score prédit (ex: 3-2) dans un badge stylisé
5. **Points gagnés** : Badge vert avec +X si des points ont été marqués
6. **Score total** : En gros et en couleur

## 🧪 Tests et débogage

Des logs ont été ajoutés pour faciliter le débogage :

- Console du navigateur : logs des prédictions chargées
- Console du navigateur : logs du matching utilisateur/prédiction
- Console serveur : logs de la mise à jour des scores

Pour vérifier que tout fonctionne :

1. Ouvrez la console du navigateur (F12)
2. Allez sur la page d'un groupe avec un match
3. Vérifiez les logs :
   ```
   Prédictions chargées: [...]
   Match ID du groupe: xxx
   === PredictionsRanking Debug ===
   ```

## 🚀 Prochaines étapes possibles

1. **Notifications** : Alerter les utilisateurs quand les scores sont finalisés
2. **Historique** : Afficher l'historique des prédictions passées
3. **Statistiques** : Taux de réussite, meilleur prédicteur, etc.
4. **Live scoring** : Afficher les points en temps réel pendant le match
5. **Badges** : Récompenses pour les meilleurs prédicteurs

## 📝 Notes importantes

- Les scores ne sont mis à jour qu'une seule fois par match (évite les doublons)
- Le système vérifie automatiquement toutes les 30 secondes si un match est terminé
- Les prédictions sont filtrées par match si un `matchId` est fourni
- Le classement est trié par score décroissant
