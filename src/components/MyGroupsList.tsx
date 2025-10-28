"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Calendar, Copy, Crown, Trophy, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useMatchesLive } from "@/contexts/MatchesLiveContext";
import { getMyGroups, UserGroup } from "@/lib/apiGroups";
import { matchService } from "@/services/matchService";
import type { Match } from "@/types/match";

type GroupWithMatch = UserGroup & {
  match?: Match;
};

export default function MyGroupsList() {
  const t = useTranslations("MyGroups");
  const router = useRouter();
  const [groups, setGroups] = useState<GroupWithMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Utiliser le contexte SSE pour les mises à jour en temps réel
  const { applyUpdateToMatch, liveUpdates } = useMatchesLive();

  useEffect(() => {
    const fetchGroupsWithMatches = async () => {
      try {
        const { groups: fetchedGroups } = await getMyGroups();

        // Récupérer tous les matchs
        const matches = await matchService.getAllMatches();

        // Enrichir les groupes avec les données des matchs
        const groupsWithMatches = fetchedGroups.map((group) => {
          if (group.externalMatchId) {
            const match = matches.find((m) => m.id === group.externalMatchId);
            return { ...group, match };
          }
          return group;
        });

        setGroups(groupsWithMatches);
      } catch (error) {
        console.error("Erreur lors du chargement des groupes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsWithMatches();
  }, []);

  // Appliquer les mises à jour SSE aux matchs des groupes
  useEffect(() => {
    if (groups.length === 0 || liveUpdates.size === 0) return;

    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (!group.match) return group;

        const updatedMatch = applyUpdateToMatch(group.match);
        if (updatedMatch !== group.match) {
          return { ...group, match: updatedMatch };
        }

        return group;
      })
    );
  }, [liveUpdates, applyUpdateToMatch]);

  const copyInviteCode = (code: string | null | undefined) => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-24 h-24 mx-auto mb-6 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center"
          >
            <Users className="w-12 h-12 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {t("noGroups")}
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button
              onClick={() => router.push("/groups/create")}
              className="rounded-full px-6 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
            >
              {t("createFirst")}
            </Button>
            <Button
              onClick={() => router.push("/groups/join")}
              variant="outline"
              className="rounded-full px-6"
            >
              {t("joinFirst")}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group, index) => (
        <motion.div
          key={group.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          {/* Background gradient */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-linear-to-tr from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl" />

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {group.name}
                  </h3>
                  {group.role === "ADMIN" && (
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className="flex items-center justify-center w-6 h-6 bg-linear-to-r from-yellow-500 to-orange-500 rounded-full"
                    >
                      <Crown className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                  )}
                </div>
                {group.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {group.description}
                  </p>
                )}
              </div>
            </div>

            {/* Match Info */}
            {group.match && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-4 p-4 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50"
              >
                <div className="flex items-center gap-2 mb-2 text-xs text-gray-600 dark:text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(group.match.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <motion.span
                    key={`status-${group.id}-${group.match.status}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: [0.8, 1.1, 1],
                      opacity: 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${
                      group.match.status === "live"
                        ? "bg-red-500 text-white animate-pulse"
                        : group.match.status === "finished"
                        ? "bg-gray-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {group.match.status === "live"
                      ? "En direct"
                      : group.match.status === "finished"
                      ? "Terminé"
                      : "À venir"}
                  </motion.span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-center">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {group.match.homeTeam.name}
                    </div>
                    <motion.div
                      key={`home-score-${group.id}-${group.match.homeScore}`}
                      initial={{ scale: 1 }}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1"
                    >
                      {group.match.homeScore}
                    </motion.div>
                  </div>
                  <div className="px-3 text-gray-400 dark:text-gray-500 font-semibold">
                    VS
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {group.match.awayTeam.name}
                    </div>
                    <motion.div
                      key={`away-score-${group.id}-${group.match.awayScore}`}
                      initial={{ scale: 1 }}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-1"
                    >
                      {group.match.awayScore}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>
                  {group.membersCount}{" "}
                  {group.membersCount > 1 ? t("members") : t("member")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Trophy className="w-4 h-4" />
                <span>
                  {t("score")}: {group.score}
                </span>
              </div>
            </div>

            {/* Badge de rôle */}
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  group.role === "ADMIN"
                    ? "bg-linear-to-r from-yellow-500 to-orange-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {group.role === "ADMIN" ? t("owner") : t("admin")}
              </span>
            </div>

            {/* Code d'invitation pour les admins */}
            {group.role === "ADMIN" && group.inviteCode && (
              <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t("inviteCode")}
                    </p>
                    <code className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                      {group.inviteCode}
                    </code>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyInviteCode(group.inviteCode ?? null)}
                    className="p-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Copy
                      className={`w-4 h-4 ${
                        copiedCode === group.inviteCode
                          ? "text-green-600"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    />
                  </motion.button>
                </div>
              </div>
            )}

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/groups/${group.id}`)}
              className="w-full px-6 py-3 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg transition-all duration-300"
            >
              {t("viewGroup")}
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
