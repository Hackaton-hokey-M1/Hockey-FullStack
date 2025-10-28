"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";

import { useParams } from "next/navigation";

import { MatchGroupToolbar } from "@/components/MatchGroupToolbar";
import MatchHeader from "@/components/MatchHeader";
import PublicGroupList from "@/components/PublicGroupList";
import { useMatchesLive } from "@/contexts/MatchesLiveContext";
import { matchService } from "@/services/matchService";
import type { Match } from "@/types/match";

export default function MatchPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utiliser le contexte SSE pour les mises à jour en temps réel
  const { applyUpdateToMatch, liveUpdates } = useMatchesLive();

  // Charger le match initialement
  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setError("Identifiant de match invalide");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const m = await matchService.getMatchById(id);
        if (!m) setError("Match introuvable");
        else setMatch(m);
      } catch (e) {
        console.error("Erreur chargement match:", e);
        setError("Impossible de charger le match");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Appliquer les mises à jour SSE au match
  useEffect(() => {
    if (!match) return;

    const updatedMatch = applyUpdateToMatch(match);
    if (updatedMatch !== match) {
      setMatch(updatedMatch);
    }
  }, [liveUpdates, match?.id, applyUpdateToMatch]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-blue-500" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">
            Chargement du match…
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-6 rounded-3xl bg-red-50/80 dark:bg-red-950/30 backdrop-blur-xl border border-red-200/50 dark:border-red-800/50 shadow-xl"
        >
          <AlertCircle className="w-6 h-6 text-red-500" />
          <p className="text-red-600 dark:text-red-400">
            {error ?? "Erreur inconnue"}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
      <MatchHeader match={match} />
      <MatchGroupToolbar match={match} />
      <PublicGroupList matchId={match.id} />
    </div>
  );
}
