"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy } from "lucide-react";

import { Match } from "@/types/match";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "live":
        return "EN DIRECT";
      case "finished":
        return "TERMINÉ";
      case "postponed":
        return "REPORTÉ";
      default:
        return "À VENIR";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 animate-pulse";
      case "finished":
        return "bg-gray-500";
      case "postponed":
        return "bg-orange-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="w-full group"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Status Badge avec glow */}
        <div className="absolute top-0 left-0 right-0 h-1">
          <div
            className={`h-full ${getStatusColor(match.status)}`}
            style={{
              boxShadow:
                match.status === "live"
                  ? "0 0 20px rgba(239, 68, 68, 0.5)"
                  : undefined,
            }}
          />
        </div>

        {/* Match Content */}
        <div className="flex-1 p-4 sm:p-6 pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Teams Section */}
            <div className="flex-1 flex items-center justify-between gap-4">
              {/* Home Team */}
              <div className="flex-1 flex flex-col items-center gap-2">
                {match.homeTeam.logo && (
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center overflow-hidden shadow-lg"
                  >
                    <img
                      src={match.homeTeam.logo}
                      alt={match.homeTeam.name}
                      className="w-12 h-12 object-contain"
                    />
                  </motion.div>
                )}
                <div className="text-center">
                  <p className="font-semibold text-lg line-clamp-1">
                    {match.homeTeam.shortName || match.homeTeam.name}
                  </p>
                </div>
              </div>

              {/* Score or VS */}
              <div className="flex flex-col items-center justify-center gap-2 px-4">
                {match.status === "finished" || match.status === "live" ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-3"
                  >
                    <motion.span
                      whileHover={{ scale: 1.2 }}
                      className="text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                    >
                      {match.homeScore ?? 0}
                    </motion.span>
                    <span className="text-xl text-gray-400">-</span>
                    <motion.span
                      whileHover={{ scale: 1.2 }}
                      className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                    >
                      {match.awayScore ?? 0}
                    </motion.span>
                  </motion.div>
                ) : (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xl font-semibold text-gray-400"
                  >
                    VS
                  </motion.span>
                )}

                {/* Status Badge */}
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className={`${getStatusColor(
                    match.status
                  )} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg`}
                >
                  {getStatusLabel(match.status)}
                </motion.span>
              </div>

              {/* Away Team */}
              <div className="flex-1 flex flex-col items-center gap-2">
                {match.awayTeam.logo && (
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="w-16 h-16 rounded-full bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center overflow-hidden shadow-lg"
                  >
                    <img
                      src={match.awayTeam.logo}
                      alt={match.awayTeam.name}
                      className="w-12 h-12 object-contain"
                    />
                  </motion.div>
                )}
                <div className="text-center">
                  <p className="font-semibold text-lg line-clamp-1">
                    {match.awayTeam.shortName || match.awayTeam.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-24 bg-linear-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

            {/* Match Info */}
            <div className="flex lg:flex-col gap-4 lg:gap-2 text-sm text-gray-600 dark:text-gray-400 lg:min-w-[200px]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="line-clamp-1">{formatDate(match.date)}</span>
              </div>

              {match.tournament && (
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 shrink-0" />
                  <span className="line-clamp-1">{match.tournament.name}</span>
                </div>
              )}

              {match.venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="line-clamp-1">{match.venue}</span>
                </div>
              )}

              {match.round && (
                <div className="text-xs font-medium text-gray-500 dark:text-gray-500">
                  {match.round}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-400/10 dark:to-cyan-400/10" />
        </div>
      </div>
    </motion.div>
  );
}
