"use client";

import { useEffect } from "react";

import { matchService } from "@/services/matchService";
import type { Match } from "@/types/match";

interface AutoScoreUpdaterProps {
  groupId: number;
  matchId?: string;
  onScoresUpdated?: () => void;
}

/**
 * Composant qui vérifie automatiquement si un match est terminé
 * et met à jour les scores des prédictions
 */
export function AutoScoreUpdater({
  groupId,
  matchId,
  onScoresUpdated,
}: AutoScoreUpdaterProps) {
  useEffect(() => {
    if (!matchId) return;

    let intervalId: NodeJS.Timeout;

    const checkAndUpdateScores = async () => {
      try {
        // Récupérer les données actuelles du match
        const matches = await matchService.getAllMatches();
        const match = matches.find((m) => m.id === matchId);

        if (!match) return;

        // Si le match est terminé, mettre à jour les scores
        if (match.status === "finished") {
          console.log("Match terminé détecté, mise à jour des scores...");

          const response = await fetch("/api/predictions/update-scores", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              matchId: match.id,
              groupId,
              homeScore: match.homeScore,
              awayScore: match.awayScore,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Scores mis à jour:", data);

            // Appeler le callback pour rafraîchir l'affichage
            if (onScoresUpdated) {
              onScoresUpdated();
            }

            // Arrêter la vérification une fois les scores mis à jour
            if (intervalId) {
              clearInterval(intervalId);
            }
          } else {
            console.error("Erreur lors de la mise à jour des scores");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du match:", error);
      }
    };

    // Vérifier immédiatement
    checkAndUpdateScores();

    // Puis vérifier toutes les 30 secondes
    intervalId = setInterval(checkAndUpdateScores, 30000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [groupId, matchId, onScoresUpdated]);

  // Ce composant n'affiche rien, il fonctionne en arrière-plan
  return null;
}

