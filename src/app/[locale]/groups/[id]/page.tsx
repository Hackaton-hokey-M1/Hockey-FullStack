"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Copy,
  Crown,
  Shield,
  Trophy,
  Users as UsersIcon,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  getGroupById,
  getUsersInGroup,
  type Group,
  type GroupMember,
} from "@/lib/apiGroups";
import { matchService } from "@/services/matchService";
import type { Match } from "@/types/match";

type GroupWithMatch = Group & {
  match?: Match;
};

export default function GroupPage() {
  const router = useRouter();
  const params = useParams();
  const [group, setGroup] = useState<GroupWithMatch | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const idParam = params?.id;
        if (!idParam) return;
        const id = Array.isArray(idParam)
          ? Number(idParam[0])
          : Number(idParam);
        if (Number.isNaN(id)) return;

        // Récupérer les données du groupe et les membres en parallèle
        const [groupResponse, membersResponse] = await Promise.all([
          getGroupById(id),
          getUsersInGroup(id),
        ]);

        let groupWithMatch: GroupWithMatch = groupResponse.group;

        // Si le groupe a un match, récupérer les détails
        if (groupWithMatch.externalMatchId) {
          try {
            const matches = await matchService.getAllMatches();
            const match = matches.find(
              (m) => m.id === groupWithMatch.externalMatchId
            );
            if (match) {
              groupWithMatch = { ...groupWithMatch, match };
            }
          } catch (error) {
            console.error("Erreur lors du chargement du match:", error);
          }
        }

        setGroup(groupWithMatch);
        setMembers(membersResponse.users);
        console.log("Members loaded:", membersResponse.users);
        console.log(
          "Admin count:",
          membersResponse.users.filter((m) => m.role === "ADMIN").length
        );
      } catch (error) {
        console.error("Erreur lors du chargement du groupe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [params?.id]);

  const copyInviteCode = () => {
    if (group?.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Groupe introuvable
          </h2>
          <Button onClick={() => router.push("/my-groups")}>
            Retour à mes groupes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pb-8 max-w-7xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 mx-auto bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl">
              <UsersIcon className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold mb-3 bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {group.name}
          </h1>
          {group.description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {group.description}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-full border border-gray-200/50 dark:border-gray-700/50">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {group.visibility === "PUBLIC" ? "🌍 Public" : "🔒 Privé"}
              </span>
            </div>
            <div className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-full border border-gray-200/50 dark:border-gray-700/50">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                👥 {group.membersCount} membre
                {group.membersCount > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Invite Code for Admins */}
          {group.isOwner && group.inviteCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 max-w-md mx-auto p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Code d&apos;invitation
                  </p>
                  <code className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                    {group.inviteCode}
                  </code>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyInviteCode}
                  className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <Copy
                    className={`w-5 h-5 ${
                      copiedCode
                        ? "text-green-600"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  />
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Match Info */}
            {group.match && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-linear-to-tr from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Match à parier
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        group.match.status === "live"
                          ? "bg-red-500 text-white animate-pulse"
                          : group.match.status === "finished"
                          ? "bg-gray-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {group.match.status === "live"
                        ? "🔴 En direct"
                        : group.match.status === "finished"
                        ? "Terminé"
                        : "À venir"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(group.match.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex-1 text-center">
                      <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {group.match.homeTeam.name}
                      </div>
                      <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                        {group.match.homeScore}
                      </div>
                    </div>
                    <div className="px-6 text-2xl font-bold text-gray-400 dark:text-gray-500">
                      VS
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {group.match.awayTeam.name}
                      </div>
                      <div className="text-5xl font-bold text-cyan-600 dark:text-cyan-400">
                        {group.match.awayScore}
                      </div>
                    </div>
                  </div>

                  {group.match.status === "scheduled" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-2xl bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg shadow-lg transition-all"
                    >
                      🎯 Faire mon pronostic
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Members List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6"
            >
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-linear-to-tr from-purple-600/20 to-pink-600/20 rounded-full blur-3xl" />

              <div className="relative">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Classement
                </h2>

                <div className="space-y-3">
                  {members.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-4 rounded-2xl ${
                        index === 0
                          ? "bg-linear-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50"
                          : "bg-gray-100/50 dark:bg-gray-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-white"
                              : index === 1
                              ? "bg-gray-400 text-white"
                              : index === 2
                              ? "bg-orange-600 text-white"
                              : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {member.name || "Utilisateur"}
                            </span>
                            {member.role === "ADMIN" && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                            {member.isBanned && (
                              <Shield className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Membre depuis{" "}
                            {new Date(member.joinedAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {member.score}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          points
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Règles de scoring */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                📊 Règles de scoring
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Score exact
                  </span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    +{group.pointsExactScore}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bon résultat
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    +{group.pointsCorrectResult}
                  </span>
                </div>
                {(group.pointsBonus ?? 0) > 0 && (
                  <div className="flex items-center justify-between p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bonus
                    </span>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      +{group.pointsBonus ?? 0}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Stats du groupe */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                📈 Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total membres
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {members.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Admins
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {members.filter((m) => m.role === "ADMIN").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Score moyen
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {members.length > 0
                      ? Math.round(
                          members.reduce((sum, m) => sum + m.score, 0) /
                            members.length
                        )
                      : 0}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
