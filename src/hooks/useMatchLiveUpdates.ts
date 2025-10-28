import { useCallback, useEffect, useRef, useState } from "react";

interface SSEMessage {
  type: "initial" | "update" | "error" | "ping";
  matches?: Array<{
    id: number;
    home_team_id: number;
    away_team_id: number;
    home_score: number;
    away_score: number;
    played_at: string;
    tournament_id: number;
    status: "scheduled" | "live" | "finished";
  }>;
  message?: string;
}

interface UseMatchLiveUpdatesOptions {
  onMatchUpdate?: (matches: SSEMessage["matches"]) => void;
  onError?: (error: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  enabled?: boolean;
}

const MAX_RECONNECT_DELAY = 30000; // 30 secondes max
const INITIAL_RECONNECT_DELAY = 1000; // 1 seconde

/**
 * Hook personnalisé pour gérer les mises à jour en temps réel des matchs via SSE
 * avec reconnexion automatique et backoff exponentiel
 */
export function useMatchLiveUpdates({
  onMatchUpdate,
  onError,
  onConnect,
  onDisconnect,
  enabled = true,
}: UseMatchLiveUpdatesOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY);
  const reconnectAttemptsRef = useRef(0);
  const connectFnRef = useRef<(() => void) | null>(null);

  /**
   * Nettoie les ressources
   */
  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      console.log("[SSE Hook] Fermeture de la connexion");
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setIsConnected(false);
    setIsReconnecting(false);
  }, []);

  /**
   * Établit la connexion SSE
   */
  const connect = useCallback(() => {
    if (!enabled) return;

    // Nettoyer toute connexion existante
    cleanup();

    try {
      console.log("[SSE Hook] Établissement de la connexion SSE...");
      const eventSource = new EventSource("/api/matches/live");

      // Événement : ouverture de la connexion
      eventSource.addEventListener("open", () => {
        console.log("[SSE Hook] Connexion SSE établie avec succès");
        setIsConnected(true);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;
        reconnectDelayRef.current = INITIAL_RECONNECT_DELAY;
        onConnect?.();
      });

      // Événement : mises à jour des matchs
      eventSource.addEventListener("matches", (event) => {
        try {
          const data: SSEMessage = JSON.parse(event.data);
          console.log(
            `[SSE Hook] Reçu ${
              data.matches?.length || 0
            } mise(s) à jour de match`
          );

          if (data.matches && data.matches.length > 0) {
            onMatchUpdate?.(data.matches);
          }
        } catch (error) {
          console.error(
            "[SSE Hook] Erreur lors du parsing des données:",
            error
          );
        }
      });

      // Événement : ping (keep-alive)
      eventSource.addEventListener("ping", () => {
        // Keep-alive reçu, pas besoin d'action
      });

      // Événement : erreur depuis le serveur
      eventSource.addEventListener("error", (event) => {
        try {
          const data: SSEMessage = JSON.parse((event as MessageEvent).data);
          console.error("[SSE Hook] Erreur du serveur:", data.message);
          onError?.(data.message || "Erreur serveur");
        } catch {
          // Ignorer si ce n'est pas une erreur parsable
        }
      });

      // Erreur de connexion
      eventSource.onerror = (error) => {
        console.error("[SSE Hook] Erreur de connexion SSE", error);
        setIsConnected(false);
        onDisconnect?.();

        // Nettoyer et programmer une reconnexion
        if (eventSource.readyState === EventSource.CLOSED) {
          cleanup();

          // Programmer une reconnexion
          setIsReconnecting(true);
          reconnectAttemptsRef.current += 1;

          const delay = Math.min(
            reconnectDelayRef.current *
              Math.pow(2, reconnectAttemptsRef.current - 1),
            MAX_RECONNECT_DELAY
          );

          console.log(
            `[SSE Hook] Tentative de reconnexion ${reconnectAttemptsRef.current} dans ${delay}ms`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connectFnRef.current?.();
          }, delay);
        }
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error(
        "[SSE Hook] Erreur lors de l'établissement de la connexion:",
        error
      );
      // Programmer une reconnexion en cas d'erreur
      setIsReconnecting(true);
      reconnectAttemptsRef.current += 1;

      const delay = Math.min(
        reconnectDelayRef.current *
          Math.pow(2, reconnectAttemptsRef.current - 1),
        MAX_RECONNECT_DELAY
      );

      reconnectTimeoutRef.current = setTimeout(() => {
        connectFnRef.current?.();
      }, delay);
    }
  }, [enabled, cleanup, onConnect, onDisconnect, onMatchUpdate, onError]);

  // Stocker la référence de connect dans le ref (dans un effet)
  useEffect(() => {
    connectFnRef.current = connect;
  }, [connect]);

  /**
   * Tente de se reconnecter avec backoff exponentiel
   */
  const scheduleReconnect = useCallback(() => {
    if (!enabled) return;

    setIsReconnecting(true);
    reconnectAttemptsRef.current += 1;

    const delay = Math.min(
      reconnectDelayRef.current * Math.pow(2, reconnectAttemptsRef.current - 1),
      MAX_RECONNECT_DELAY
    );

    console.log(
      `[SSE Hook] Tentative de reconnexion ${reconnectAttemptsRef.current} dans ${delay}ms`
    );

    reconnectTimeoutRef.current = setTimeout(() => {
      connectFnRef.current?.();
    }, delay);
  }, [enabled]);

  /**
   * Déconnecte manuellement le SSE
   */
  const disconnect = useCallback(() => {
    console.log("[SSE Hook] Déconnexion manuelle");
    cleanup();
  }, [cleanup]);

  /**
   * Reconnecte manuellement le SSE
   */
  const reconnect = useCallback(() => {
    console.log("[SSE Hook] Reconnexion manuelle");
    reconnectAttemptsRef.current = 0;
    reconnectDelayRef.current = INITIAL_RECONNECT_DELAY;
    connect();
  }, [connect]);

  // Établir la connexion au montage du composant
  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      cleanup();
    }

    // Nettoyer au démontage
    return () => {
      cleanup();
    };
  }, [enabled, connect, cleanup]);

  return {
    isConnected,
    isReconnecting,
    disconnect,
    reconnect,
  };
}
