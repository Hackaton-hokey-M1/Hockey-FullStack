/**
 * Calcule les points gagnés pour une prédiction selon un système de scoring précis
 *
 * Système de points :
 * - Score exact (3-2 → 3-2) : 5 points
 * - 1 score exact + bon résultat (3-2 → 3-1) : 3 points
 * - Les 2 scores avec écart de ±1 but (3-2 → 4-3 ou 2-1) : 2 points
 * - Bon résultat uniquement : 1 point
 * - Mauvais pronostic : 0 point
 *
 * @param pointsExactScore - Non utilisé dans ce système (gardé pour compatibilité)
 * @param pointsCorrectResult - Non utilisé dans ce système (gardé pour compatibilité)
 */

export function calculatePoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _pointsExactScore: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _pointsCorrectResult: number
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

  // Vérifier si le résultat est correct (victoire/défaite/nul)
  const correctResult = predictedResult === actualResult;

  // 2. Un score exact + bon résultat = 3 points
  if (correctResult) {
    const homeExact = predictedHome === actualHome;
    const awayExact = predictedAway === actualAway;

    if (homeExact || awayExact) {
      return 3;
    }
  }

  // 3. Les deux scores sont proches (écart de ±1 sur chaque) + bon résultat = 2 points
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

/**
 * Détermine le statut d'un match en fonction de la date et des scores
 */
export function getMatchStatus(
  date: string,
  homeScore: number,
  awayScore: number
): "scheduled" | "live" | "finished" {
  const matchDate = new Date(date);
  const now = new Date();

  // Si le match est dans le futur
  if (matchDate > now) {
    return "scheduled";
  }

  // Si les deux scores sont à 0 et que le match devrait avoir commencé
  // on considère qu'il est en cours
  if (homeScore === 0 && awayScore === 0) {
    const hoursSinceMatch =
      (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60);
    // Si moins de 3 heures depuis le début prévu, considérer comme en cours
    if (hoursSinceMatch < 3) {
      return "live";
    }
  }

  // Si le match a commencé et qu'il y a des scores, il est probablement terminé
  // (sauf si on a une API en temps réel qui indique "live")
  const hoursSinceMatch =
    (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60);
  if (hoursSinceMatch > 3) {
    return "finished";
  }

  return "live";
}
