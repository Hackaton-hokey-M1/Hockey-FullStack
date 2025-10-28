import { NextRequest } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;
const POLLING_INTERVAL = 5000; // 5 secondes
const KEEP_ALIVE_INTERVAL = 15000; // 15 secondes

interface ApiMatch {
  id: number;
  home_team_id: number;
  away_team_id: number;
  home_score: number;
  away_score: number;
  played_at: string;
  tournament_id: number;
}

/**
 * Détermine le statut d'un match basé sur sa date
 */
const getMatchStatus = (
  playedAt: string
): "scheduled" | "live" | "finished" => {
  const matchDate = new Date(playedAt);
  const now = new Date();
  const diffInHours = (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 0) {
    return "scheduled";
  }
  if (diffInHours < 3) {
    return "live";
  }
  return "finished";
};

/**
 * Récupère les matchs depuis l'API externe
 */
async function fetchMatches(): Promise<ApiMatch[]> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL n'est pas définie");
  }

  const response = await fetch(`${API_BASE_URL}/matches`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Compare deux ensembles de matchs et retourne ceux qui ont changé
 */
function getChangedMatches(
  oldMatches: ApiMatch[],
  newMatches: ApiMatch[]
): ApiMatch[] {
  const changed: ApiMatch[] = [];

  newMatches.forEach((newMatch) => {
    const oldMatch = oldMatches.find((m) => m.id === newMatch.id);

    if (!oldMatch) {
      // Nouveau match
      changed.push(newMatch);
    } else if (
      oldMatch.home_score !== newMatch.home_score ||
      oldMatch.away_score !== newMatch.away_score ||
      getMatchStatus(oldMatch.played_at) !== getMatchStatus(newMatch.played_at)
    ) {
      // Match modifié (score ou statut changé)
      changed.push(newMatch);
    }
  });

  return changed;
}

/**
 * Endpoint SSE pour les mises à jour en temps réel des matchs
 */
export async function GET(request: NextRequest) {
  // Vérifier que l'API est configurée
  if (!API_BASE_URL) {
    return new Response(
      JSON.stringify({
        error: "API_BASE_URL n'est pas définie",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Créer un stream pour SSE
  const encoder = new TextEncoder();
  let isActive = true;
  let previousMatches: ApiMatch[] = [];

  const stream = new ReadableStream({
    async start(controller) {
      console.log("[SSE] Nouvelle connexion client établie");

      // Fonction pour envoyer un message SSE
      const sendSSE = (data: string, event?: string) => {
        try {
          if (event) {
            controller.enqueue(encoder.encode(`event: ${event}\n`));
          }
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch (error) {
          console.error("[SSE] Erreur lors de l'envoi:", error);
        }
      };

      // Keep-alive pour maintenir la connexion
      const keepAliveInterval = setInterval(() => {
        if (isActive) {
          sendSSE(JSON.stringify({ type: "ping" }), "ping");
        }
      }, KEEP_ALIVE_INTERVAL);

      // Polling de l'API externe
      const pollingInterval = setInterval(async () => {
        if (!isActive) return;

        try {
          const matches = await fetchMatches();

          // Première récupération : envoyer tous les matchs
          if (previousMatches.length === 0) {
            console.log(
              `[SSE] Envoi initial de ${matches.length} matchs au client`
            );
            sendSSE(
              JSON.stringify({
                type: "initial",
                matches: matches.map((m) => ({
                  ...m,
                  status: getMatchStatus(m.played_at),
                })),
              }),
              "matches"
            );
            previousMatches = matches;
            return;
          }

          // Vérifier les changements
          const changedMatches = getChangedMatches(previousMatches, matches);

          if (changedMatches.length > 0) {
            console.log(
              `[SSE] ${changedMatches.length} match(s) modifié(s) détecté(s)`
            );
            changedMatches.forEach((match) => {
              const status = getMatchStatus(match.played_at);
              console.log(
                `[SSE] Match ${match.id}: ${match.home_score}-${match.away_score} [${status}]`
              );
            });

            sendSSE(
              JSON.stringify({
                type: "update",
                matches: changedMatches.map((m) => ({
                  ...m,
                  status: getMatchStatus(m.played_at),
                })),
              }),
              "matches"
            );
          }

          previousMatches = matches;
        } catch (error) {
          console.error("[SSE] Erreur lors du polling:", error);
          sendSSE(
            JSON.stringify({
              type: "error",
              message:
                error instanceof Error ? error.message : "Erreur inconnue",
            }),
            "error"
          );
        }
      }, POLLING_INTERVAL);

      // Gestion de la fermeture de la connexion
      request.signal.addEventListener("abort", () => {
        console.log("[SSE] Connexion client fermée");
        isActive = false;
        clearInterval(keepAliveInterval);
        clearInterval(pollingInterval);
        try {
          controller.close();
        } catch (error) {
          // Ignorer les erreurs de fermeture
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Pour nginx
    },
  });
}
