"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { useMatchLiveUpdates } from "@/hooks/useMatchLiveUpdates";
import type { Match } from "@/types/match";

interface MatchUpdate {
  id: number;
  home_team_id: number;
  away_team_id: number;
  home_score: number;
  away_score: number;
  played_at: string;
  tournament_id: number;
  status: "scheduled" | "live" | "finished";
}

interface MatchesLiveContextType {
  // Données
  liveUpdates: Map<string, MatchUpdate>;

  // États de connexion
  isConnected: boolean;
  isReconnecting: boolean;

  // Actions
  disconnect: () => void;
  reconnect: () => void;

  // Helpers
  getMatchUpdate: (matchId: string) => MatchUpdate | null;
  applyUpdateToMatch: (match: Match) => Match;
}

const MatchesLiveContext = createContext<MatchesLiveContextType | undefined>(
  undefined
);

interface MatchesLiveProviderProps {
  children: ReactNode;
}

/**
 * Provider qui gère la connexion SSE unique pour toute l'application
 * et partage les mises à jour en temps réel des matchs
 */
export function MatchesLiveProvider({ children }: MatchesLiveProviderProps) {
  const [liveUpdates, setLiveUpdates] = useState<Map<string, MatchUpdate>>(
    new Map()
  );

  /**
   * Callback appelé quand des matchs sont mis à jour
   */
  const handleMatchUpdate = useCallback((matches?: MatchUpdate[]) => {
    if (!matches || matches.length === 0) return;

    setLiveUpdates((prev) => {
      const newUpdates = new Map(prev);

      matches.forEach((match) => {
        const matchId = match.id.toString();
        const existingUpdate = newUpdates.get(matchId);

        // Mettre à jour seulement si les données ont changé
        if (
          !existingUpdate ||
          existingUpdate.home_score !== match.home_score ||
          existingUpdate.away_score !== match.away_score ||
          existingUpdate.status !== match.status
        ) {
          console.log(
            `[MatchesLiveContext] Mise à jour du match ${matchId}: ${match.home_score}-${match.away_score} [${match.status}]`
          );
          newUpdates.set(matchId, match);
        }
      });

      return newUpdates;
    });
  }, []);

  /**
   * Callback appelé en cas d'erreur
   */
  const handleError = useCallback((error: string) => {
    console.error("[MatchesLiveContext] Erreur SSE:", error);
  }, []);

  /**
   * Callback appelé lors de la connexion
   */
  const handleConnect = useCallback(() => {
    console.log("[MatchesLiveContext] Connecté au stream SSE");
  }, []);

  /**
   * Callback appelé lors de la déconnexion
   */
  const handleDisconnect = useCallback(() => {
    console.log("[MatchesLiveContext] Déconnecté du stream SSE");
  }, []);

  // Utiliser le hook SSE
  const { isConnected, isReconnecting, disconnect, reconnect } =
    useMatchLiveUpdates({
      onMatchUpdate: handleMatchUpdate,
      onError: handleError,
      onConnect: handleConnect,
      onDisconnect: handleDisconnect,
      enabled: true,
    });

  /**
   * Récupère la mise à jour d'un match spécifique
   */
  const getMatchUpdate = useCallback(
    (matchId: string): MatchUpdate | null => {
      return liveUpdates.get(matchId) || null;
    },
    [liveUpdates]
  );

  /**
   * Applique les mises à jour SSE à un objet Match
   */
  const applyUpdateToMatch = useCallback(
    (match: Match): Match => {
      const update = liveUpdates.get(match.id);

      if (!update) {
        return match;
      }

      // Vérifier si une mise à jour est nécessaire
      const needsUpdate =
        match.homeScore !== update.home_score ||
        match.awayScore !== update.away_score ||
        match.status !== update.status;

      if (!needsUpdate) {
        return match;
      }

      // Retourner un nouveau match avec les données mises à jour
      return {
        ...match,
        homeScore: update.home_score,
        awayScore: update.away_score,
        status: update.status,
      };
    },
    [liveUpdates]
  );

  const value = useMemo(
    () => ({
      liveUpdates,
      isConnected,
      isReconnecting,
      disconnect,
      reconnect,
      getMatchUpdate,
      applyUpdateToMatch,
    }),
    [
      liveUpdates,
      isConnected,
      isReconnecting,
      disconnect,
      reconnect,
      getMatchUpdate,
      applyUpdateToMatch,
    ]
  );

  return (
    <MatchesLiveContext.Provider value={value}>
      {children}
    </MatchesLiveContext.Provider>
  );
}

/**
 * Hook pour accéder au contexte des mises à jour en direct
 */
export function useMatchesLive(): MatchesLiveContextType {
  const context = useContext(MatchesLiveContext);

  if (context === undefined) {
    throw new Error(
      "useMatchesLive doit être utilisé à l'intérieur d'un MatchesLiveProvider"
    );
  }

  return context;
}
