"use client";

import { useEffect, useState } from "react";

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
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-600 dark:text-gray-400">
          Chargement des matchs...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="flex items-center gap-3 text-red-500">
          <AlertCircle className="w-8 h-8" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Aucun match disponible pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Matchs de Hockey</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {matches.length} match{matches.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Match Cards */}
      <div className="space-y-3">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
