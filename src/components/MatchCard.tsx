"use client";

import { Calendar, MapPin, Trophy } from "lucide-react";

import { Card } from "@/components/ui/card";
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
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-stretch">
        {/* Status Badge */}
        <div className="shrink-0 w-full sm:w-2 relative">
          <div className={`absolute inset-0 ${getStatusColor(match.status)}`} />
        </div>

        {/* Match Content */}
        <div className="flex-1 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Teams Section */}
            <div className="flex-1 flex items-center justify-between gap-4">
              {/* Home Team */}
              <div className="flex-1 flex flex-col items-center gap-2">
                {match.homeTeam.logo && (
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img
                      src={match.homeTeam.logo}
                      alt={match.homeTeam.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
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
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold">
                      {match.homeScore ?? 0}
                    </span>
                    <span className="text-xl text-gray-400">-</span>
                    <span className="text-3xl font-bold">
                      {match.awayScore ?? 0}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-semibold text-gray-400">
                    VS
                  </span>
                )}

                {/* Status Badge */}
                <span
                  className={`${getStatusColor(
                    match.status
                  )} text-white text-xs font-semibold px-3 py-1 rounded-full`}
                >
                  {getStatusLabel(match.status)}
                </span>
              </div>

              {/* Away Team */}
              <div className="flex-1 flex flex-col items-center gap-2">
                {match.awayTeam.logo && (
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img
                      src={match.awayTeam.logo}
                      alt={match.awayTeam.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                )}
                <div className="text-center">
                  <p className="font-semibold text-lg line-clamp-1">
                    {match.awayTeam.shortName || match.awayTeam.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-24 bg-gray-200 dark:bg-gray-700" />

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
      </div>
    </Card>
  );
}
