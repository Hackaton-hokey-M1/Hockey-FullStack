"use client";

import { motion } from "framer-motion";
import { Crown, Shield, TrendingUp, Trophy } from "lucide-react";

import { MemberActions } from "./MemberActions";

interface Prediction {
  id: number;
  userId: string;
  groupId: number;
  externalMatchId: string;
  homeScore: number;
  awayScore: number;
  points: number | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface Member {
  id: string; // C'est le userId
  name: string | null;
  role: string;
  score: number;
  isBanned: boolean;
  joinedAt: string;
}

interface PredictionsRankingProps {
  members: Member[];
  predictions: Prediction[];
  matchId?: string;
  groupId: number;
  ownerId: string;
  currentUserId?: string;
  onMembersUpdated: () => void;
}

export function PredictionsRanking({
  members,
  predictions,
  matchId,
  groupId,
  ownerId,
  currentUserId,
  onMembersUpdated,
}: PredictionsRankingProps) {
  // Créer un map des prédictions par userId
  const predictionsByUser = new Map<string, Prediction>();
  const filteredPredictions = predictions.filter(
    (p) => !matchId || p.externalMatchId === matchId
  );

  console.log("=== PredictionsRanking Debug ===");
  console.log("Total predictions:", predictions.length);
  console.log("Match ID filter:", matchId);
  console.log("Filtered predictions:", filteredPredictions.length);
  console.log("Members:", members.length);

  filteredPredictions.forEach((p) => {
    console.log(
      `Prediction: userId=${p.userId}, matchId=${p.externalMatchId}, score=${p.homeScore}-${p.awayScore}`
    );
    predictionsByUser.set(p.userId, p);
  });

  members.forEach((m) => {
    const pred = predictionsByUser.get(m.id);
    console.log(`Member: id=${m.id}, name=${m.name}, hasPrediction=${!!pred}`);
  });

  // Trier les membres par score décroissant
  const sortedMembers = [...members].sort((a, b) => b.score - a.score);

  // Vérifier les permissions de l'utilisateur actuel
  const currentUserIsOwner = currentUserId === ownerId;
  const currentUserMember = members.find((m) => m.id === currentUserId);
  const currentUserIsAdmin = currentUserMember?.role === "ADMIN";

  return (
    <div className="space-y-3">
      {sortedMembers.map((member, index) => {
        const prediction = predictionsByUser.get(member.id); // member.id est le userId
        const hasPrediction = !!prediction;
        const isOwner = member.id === ownerId;

        return (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative overflow-hidden rounded-2xl ${
              index === 0
                ? "bg-linear-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50"
                : "bg-gray-100/50 dark:bg-gray-800/50"
            } ${member.isBanned ? "opacity-60" : ""}`}
          >
            <div className="flex items-center justify-between p-4 gap-4">
              {/* Rang et utilisateur */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold shrink-0 ${
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                      {member.name || "Utilisateur"}
                    </span>
                    {isOwner && (
                      <span className="shrink-0" title="Créateur">
                        <Crown className="w-4 h-4 text-yellow-500" />
                      </span>
                    )}
                    {!isOwner && member.role === "ADMIN" && (
                      <span className="shrink-0" title="Admin">
                        <Shield className="w-4 h-4 text-blue-500" />
                      </span>
                    )}
                    {member.isBanned && (
                      <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded-full shrink-0">
                        Banni
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                    Membre depuis{" "}
                    {new Date(member.joinedAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              {/* Prédiction et score */}
              <div className="flex items-center gap-3">
                {hasPrediction ? (
                  <div className="flex items-center gap-3">
                    {/* Pronostic */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-gray-900/60 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {prediction.homeScore}
                      </span>
                      <span className="text-xs text-gray-500">-</span>
                      <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                        {prediction.awayScore}
                      </span>
                    </div>

                    {/* Points gagnés sur ce match */}
                    {prediction.points !== null && prediction.points > 0 && (
                      <motion.div
                        key={`points-${member.id}-${prediction.points}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                          scale: [0.8, 1.1, 1],
                          opacity: 1,
                        }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-lg"
                      >
                        <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                          +{prediction.points}
                        </span>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 italic">
                    Pas de pronostic
                  </div>
                )}

                {/* Score total */}
                <div className="text-right min-w-[60px]">
                  <motion.div
                    key={`score-${member.id}-${member.score}`}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                  >
                    {member.score}
                  </motion.div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    points
                  </div>
                </div>

                {/* Actions de gestion */}
                {currentUserId && member.id !== currentUserId && (
                  <MemberActions
                    groupId={groupId}
                    memberId={member.id}
                    memberRole={member.role as "ADMIN" | "MEMBER"}
                    isBanned={member.isBanned}
                    isOwner={isOwner}
                    currentUserIsOwner={currentUserIsOwner}
                    currentUserIsAdmin={currentUserIsAdmin}
                    onActionComplete={onMembersUpdated}
                  />
                )}
              </div>
            </div>

            {/* Barre de progression pour le leader */}
            {index === 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-yellow-500 to-orange-500" />
            )}
          </motion.div>
        );
      })}

      {sortedMembers.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Aucun membre dans ce groupe</p>
        </div>
      )}
    </div>
  );
}
