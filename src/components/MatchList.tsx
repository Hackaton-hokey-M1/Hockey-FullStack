"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";

import { matchService } from "@/services/matchService";
import { Match } from "@/types/match";

import MatchCard from "./MatchCard";

export default function MatchList() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await matchService.getAllMatches();
        setMatches(data);
      } catch (err) {
        setError(
          "Impossible de charger les matchs. Veuillez réessayer plus tard."
        );
        console.error("Erreur lors du chargement des matchs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 gap-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-blue-500" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Chargement des matchs...
        </motion.p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-12 gap-4"
      >
        <div className="flex items-center gap-3 p-6 rounded-3xl bg-red-50/80 dark:bg-red-950/30 backdrop-blur-xl border border-red-200/50 dark:border-red-800/50 shadow-xl">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <AlertCircle className="w-8 h-8 text-red-500" />
          </motion.div>
          <p className="text-lg font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      </motion.div>
    );
  }

  if (matches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 gap-4"
      >
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Aucun match disponible pour le moment.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-6 p-4 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50"
      >
        <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
          Matchs de Hockey
        </h2>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-sm font-semibold px-4 py-2 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
        >
          {matches.length} match{matches.length > 1 ? "s" : ""}
        </motion.span>
      </motion.div>

      {/* Match Cards */}
      <div className="space-y-4">
        {matches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <MatchCard match={match} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
