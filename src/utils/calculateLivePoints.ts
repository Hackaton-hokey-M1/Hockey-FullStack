/**
 * Calcule les points en temps réel côté client pour une prédiction
 * Même logique que /lib/scoring.ts mais côté client
 */
export function calculateLivePoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): number {
  // 1. Score exact = 5 points
  if (predictedHome === actualHome && predictedAway === actualAway) {
    return 5;
  }

  // Calculer le résultat prédit et réel
  const predictedResult =
    predictedHome > predictedAway
      ? "home"
      : predictedHome < predictedAway
      ? "away"
      : "draw";
  const actualResult =
    actualHome > actualAway
      ? "home"
      : actualHome < actualAway
      ? "away"
      : "draw";

  // Vérifier si le résultat est correct
  const correctResult = predictedResult === actualResult;

  // 2. Un score exact + bon résultat = 3 points
  if (correctResult) {
    const homeExact = predictedHome === actualHome;
    const awayExact = predictedAway === actualAway;

    if (homeExact || awayExact) {
      return 3;
    }
  }

  // 3. Les deux scores proches (±1) + bon résultat = 2 points
  const homeDiff = Math.abs(predictedHome - actualHome);
  const awayDiff = Math.abs(predictedAway - actualAway);

  if (homeDiff <= 1 && awayDiff <= 1 && correctResult) {
    return 2;
  }

  // 4. Bon résultat uniquement = 1 point
  if (correctResult) {
    return 1;
  }

  // 5. Mauvais pronostic = 0 point
  return 0;
}
