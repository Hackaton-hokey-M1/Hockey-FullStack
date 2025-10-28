# 🧪 Guide de test - Système de prédictions

## Vérification rapide

### Étape 1 : Vérifier que les prédictions se chargent

1. Ouvrez votre navigateur et allez sur un groupe avec un match
2. Ouvrez la console (F12 → Console)
3. Vérifiez ces logs :

```
Prédictions chargées: Array[...]
Match ID du groupe: "12345"
=== PredictionsRanking Debug ===
Total predictions: X
Filtered predictions: Y
```

✅ **Si vous voyez ces logs** : Les prédictions se chargent correctement
❌ **Si erreur 401/403** : Problème d'authentification
❌ **Si erreur 404** : Route API introuvable

### Étape 2 : Vérifier l'affichage des pronostics

Dans le classement, vous devriez voir :

```
┌────────────────────────────────────────────────┐
│ 🥇 1  Jean Dupont                    3-2  💚+3 │
│      Membre depuis 01/10/2024         100 pts  │
├────────────────────────────────────────────────┤
│ 🥈 2  Marie Martin                   2-1  💚+1 │
│      Membre depuis 05/10/2024          45 pts  │
└────────────────────────────────────────────────┘
```

✅ **Ce que vous devez voir** :

- Le score prédit (ex: 3-2) à côté du nom
- Un badge vert avec les points si la prédiction a gagné des points
- Le score total de chaque membre

❌ **Si "Pas de pronostic"** : Vérifiez les logs de debug

### Étape 3 : Vérifier le matching utilisateur/prédiction

Dans la console, cherchez :

```
Member: id=abc-123, name=Jean, hasPrediction=true
Prediction: userId=abc-123, matchId=456, score=3-2
```

✅ **Les IDs doivent correspondre** : `member.id` === `prediction.userId`

## Tests complets

### Test 1 : Créer une prédiction

1. Allez sur la page d'un groupe avec un match à venir
2. Cliquez sur "Faire mon pronostic"
3. Entrez un score (ex: 3-2)
4. Validez
5. Retournez sur la page du groupe
6. **Vérifiez** : Votre pronostic apparaît dans le classement

### Test 2 : Plusieurs membres avec prédictions

1. Créez un groupe avec plusieurs membres
2. Chaque membre fait une prédiction différente
3. Vérifiez que tous les pronostics s'affichent
4. Vérifiez que les membres sans pronostic affichent "Pas de pronostic"

### Test 3 : Mise à jour automatique des scores

⚠️ **Pré-requis** : Le match doit être terminé dans l'API externe

1. Faites une prédiction sur un match à venir
2. Attendez que le match se termine (ou simulez dans l'API)
3. Le système vérifie toutes les 30 secondes
4. **Après max 30 sec** : Les scores devraient se mettre à jour automatiquement
5. **Vérifiez** :
   - Le badge vert avec les points apparaît
   - Le score total du membre est mis à jour

### Test 4 : Calcul des points

**Score exact (3 points)** :

- Prédiction : 3-2
- Résultat réel : 3-2
- ✅ Points gagnés : 3

**Bon résultat (1 point)** :

- Prédiction : 3-1 (victoire équipe domicile)
- Résultat réel : 2-1 (victoire équipe domicile)
- ✅ Points gagnés : 1

**Mauvais pronostic (0 points)** :

- Prédiction : 3-1 (victoire équipe domicile)
- Résultat réel : 1-3 (victoire équipe extérieure)
- ❌ Points gagnés : 0

## Débogage en cas de problème

### Problème : "Pas de pronostic" alors que j'ai fait une prédiction

**Debug** :

1. Ouvrez la console
2. Cherchez ces logs :

```javascript
// Vérifiez que les prédictions sont chargées
console.log("Prédictions chargées:", predictionsData.predictions);

// Vérifiez le matching
console.log("Member: id=XXX, hasPrediction=true/false");
console.log("Prediction: userId=YYY");
```

3. **Si les IDs ne correspondent pas** :
   - Le `member.id` doit être égal au `prediction.userId`
   - Ce sont tous les deux des strings (UUID)

### Problème : L'API retourne une erreur 401

**Solution** :

1. Vérifiez que vous êtes connecté
2. Vérifiez que le token d'authentification est valide
3. Rafraîchissez la page

### Problème : Les scores ne se mettent pas à jour automatiquement

**Debug** :

1. Ouvrez la console
2. Cherchez : `"Match terminé détecté, mise à jour des scores..."`
3. Si vous ne voyez pas ce message :
   - Le match n'est peut-être pas terminé (`status !== "finished"`)
   - Vérifiez le statut du match dans les logs

**Solution** :

- Attendez 30 secondes pour la prochaine vérification
- Rafraîchissez la page pour forcer une vérification immédiate

## URLs utiles

- **Page du groupe** : `/groups/[id]`
- **API prédictions** : `/api/groups/[id]/predictions`
- **API mise à jour scores** : `/api/predictions/update-scores` (POST)

## Logs utiles pour le support

Si vous avez un problème, partagez ces informations :

```javascript
// Copiez-collez ces logs de la console :
1. Prédictions chargées: [...]
2. Match ID du groupe: "..."
3. Total predictions: X
4. Filtered predictions: Y
5. Members: Z
6. Member: id=..., name=..., hasPrediction=...
```

## Commandes de débogage manuel

### Vérifier les prédictions d'un groupe

```javascript
// Dans la console du navigateur
fetch("/api/groups/1/predictions")
  .then((r) => r.json())
  .then(console.log);
```

### Forcer la mise à jour des scores

```javascript
// Dans la console du navigateur
fetch("/api/predictions/update-scores", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    matchId: "12345",
    groupId: 1,
    homeScore: 3,
    awayScore: 2,
  }),
})
  .then((r) => r.json())
  .then(console.log);
```
