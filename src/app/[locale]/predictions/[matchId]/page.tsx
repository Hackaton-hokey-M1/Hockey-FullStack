"use client";

import { useCallback, useEffect, useState } from "react";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Loader2,
  Trophy,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMatchesLive } from "@/contexts/MatchesLiveContext";
import { matchService } from "@/services/matchService";
import type { Match } from "@/types/match";

export default function PredictionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchId = params.matchId as string;
  const locale = params.locale as string;
  const groupId = searchParams.get("groupId");

  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [homeScore, setHomeScore] = useState<string>("");
  const [awayScore, setAwayScore] = useState<string>("");

  // Utiliser le contexte SSE pour les mises à jour en temps réel
  const { liveUpdates } = useMatchesLive();

  // Charger le match initialement
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        const data = await matchService.getMatchById(parseInt(matchId));
        if (!data) {
          setError("Match introuvable");
        } else {
          setMatch(data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement du match:", err);
        setError("Impossible de charger le match");
      } finally {
        setLoading(false);
      }
    };

    if (matchId) {
      fetchMatch();
    }
  }, [matchId]);

  // Appliquer les mises à jour SSE au match
  const applyLiveUpdates = useCallback(() => {
    setMatch((prevMatch) => {
      if (!prevMatch) return null;

      const update = liveUpdates.get(prevMatch.id);
      if (!update) return prevMatch;

      // Vérifier si une mise à jour est nécessaire
      if (
        prevMatch.homeScore !== update.home_score ||
        prevMatch.awayScore !== update.away_score ||
        prevMatch.status !== update.status
      ) {
        return {
          ...prevMatch,
          homeScore: update.home_score,
          awayScore: update.away_score,
          status: update.status,
        };
      }

      return prevMatch;
    });
  }, [liveUpdates]);

  useEffect(() => {
    applyLiveUpdates();
  }, [applyLiveUpdates]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isMatchFinished =
    match?.status === "finished" || match?.status === "live";
  const canPredict = match?.status === "scheduled";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canPredict) {
      toast.error("Le match a déjà commencé ou est terminé");
      return;
    }

    if (!groupId) {
      toast.error("Aucun groupe sélectionné");
      return;
    }

    // Validation basique
    if (homeScore === "" || awayScore === "") {
      toast.error("Veuillez entrer les deux scores");
      return;
    }

    const home = parseInt(homeScore);
    const away = parseInt(awayScore);

    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
      toast.error("Veuillez entrer des scores valides (nombres positifs)");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId,
          groupId,
          homeScore: home,
          awayScore: away,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement");
      }

      toast.success(
        `Prédiction enregistrée: ${match?.homeTeam.name} ${home} - ${away} ${match?.awayTeam.name}`
      );

      // Attendre un peu avant de rediriger pour que l'utilisateur voie le toast
      setTimeout(() => {
        router.push(`/${locale}/matches/${matchId}`);
      }, 1500);
    } catch (err) {
      console.error("Erreur:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'enregistrement de la prédiction";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

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
    <div className="min-h-screen">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-color)",
            borderRadius: "1rem",
            padding: "1rem",
            fontSize: "0.95rem",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push(`/${locale}/matches/${matchId}`)}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au match
          </Button>

          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {isMatchFinished ? "Résultat du Match" : "Entrer mon Score"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isMatchFinished
              ? "Ce match est terminé, vous ne pouvez plus faire de prédiction"
              : "Faites votre prédiction pour ce match"}
          </p>
        </motion.div>

        {/* Match Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" />
          </div>

          <div className="p-6 sm:p-8">
            {/* Match Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-4 mb-8"
            >
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(match.date)} - {formatTime(match.date)}
                  </span>
                </div>
                {match.tournament && (
                  <>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>{match.tournament.name}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Status Badge */}
              {isMatchFinished && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    match.status === "finished"
                      ? "bg-gray-500 text-white"
                      : "bg-red-500 text-white animate-pulse"
                  }`}
                >
                  {match.status === "finished" ? "MATCH TERMINÉ" : "EN DIRECT"}
                </motion.div>
              )}
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Teams and Scores */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 items-center">
                {/* Home Team */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center shadow-lg overflow-hidden"
                  >
                    {match.homeTeam.logo ? (
                      <Image
                        src={match.homeTeam.logo}
                        alt={match.homeTeam.name}
                        width={64}
                        height={64}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                      />
                    ) : (
                      <span className="text-4xl sm:text-5xl">🏒</span>
                    )}
                  </motion.div>
                  <h2 className="font-bold text-lg sm:text-xl mb-2 line-clamp-2">
                    {match.homeTeam.name}
                  </h2>
                  {match.homeTeam.shortName && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {match.homeTeam.shortName}
                    </p>
                  )}

                  {isMatchFinished ? (
                    <div className="text-center text-4xl sm:text-5xl font-bold h-16 sm:h-20 flex items-center justify-center rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                      {match.homeScore}
                    </div>
                  ) : (
                    <Input
                      type="number"
                      min="0"
                      value={homeScore}
                      onChange={(e) => setHomeScore(e.target.value)}
                      placeholder="0"
                      className="text-center text-3xl sm:text-4xl font-bold h-16 sm:h-20 rounded-2xl border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    />
                  )}
                </motion.div>

                {/* VS Separator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl sm:text-3xl font-bold text-gray-400"
                  >
                    VS
                  </motion.span>
                </motion.div>

                {/* Away Team */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center shadow-lg overflow-hidden"
                  >
                    {match.awayTeam.logo ? (
                      <Image
                        src={match.awayTeam.logo}
                        alt={match.awayTeam.name}
                        width={64}
                        height={64}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                      />
                    ) : (
                      <span className="text-4xl sm:text-5xl">🏒</span>
                    )}
                  </motion.div>
                  <h2 className="font-bold text-lg sm:text-xl mb-2 line-clamp-2">
                    {match.awayTeam.name}
                  </h2>
                  {match.awayTeam.shortName && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {match.awayTeam.shortName}
                    </p>
                  )}

                  {isMatchFinished ? (
                    <div className="text-center text-4xl sm:text-5xl font-bold h-16 sm:h-20 flex items-center justify-center rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                      {match.awayScore}
                    </div>
                  ) : (
                    <Input
                      type="number"
                      min="0"
                      value={awayScore}
                      onChange={(e) => setAwayScore(e.target.value)}
                      placeholder="0"
                      className="text-center text-3xl sm:text-4xl font-bold h-16 sm:h-20 rounded-2xl border-2 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                    />
                  )}
                </motion.div>
              </div>

              {/* Submit Button or Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                {isMatchFinished ? (
                  <div className="text-center p-6 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600">
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      ⏱️ Match déjà joué
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Le score final est affiché ci-dessus. Les prédictions ne
                      sont plus acceptées.
                    </p>
                  </div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={submitting || !canPredict}
                      className="w-full text-lg sm:text-xl py-6 sm:py-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Enregistrement...
                        </span>
                      ) : (
                        "VALIDER"
                      )}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </form>
          </div>

          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
      </main>
    </div>
  );
}
