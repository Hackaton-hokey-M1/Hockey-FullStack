"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Globe,
  Link as LinkIcon,
  Lock,
  UserPlus,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Type temporaire pour les groupes (à remplacer par votre vrai type)
interface Group {
  id: string;
  name: string;
  visibility: "public" | "private";
  description?: string;
  memberCount: number;
}

// Données mockées pour l'exemple (à remplacer par un appel API)
const mockPublicGroups: Group[] = [
  {
    id: "1",
    name: "Les Champions du Hockey",
    visibility: "public",
    description: "Groupe pour les vrais fans de hockey !",
    memberCount: 12,
  },
  {
    id: "2",
    name: "Paris entre amis",
    visibility: "public",
    description: "Paris amicaux sur tous les matchs",
    memberCount: 8,
  },
  {
    id: "3",
    name: "Pro Hockey Bets",
    visibility: "public",
    description: "Pour les parieurs sérieux uniquement",
    memberCount: 24,
  },
];

export default function JoinGroupPage() {
  const t = useTranslations("JoinGroup");
  const router = useRouter();
  const [hasInviteLink, setHasInviteLink] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [publicGroups] = useState<Group[]>(mockPublicGroups);

  const handleJoinWithLink = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la logique pour rejoindre avec un lien
    console.log("Rejoindre avec le lien:", inviteLink);
  };

  const handleJoinGroup = (groupId: string) => {
    // TODO: Implémenter la logique pour rejoindre un groupe public
    console.log("Rejoindre le groupe:", groupId);
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pb-8 max-w-4xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t("back")}</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 mx-auto bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{t("subtitle")}</p>
        </motion.div>

        {/* Invite Link Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-xl mb-6"
        >
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />

          <div className="relative space-y-4">
            {/* Checkbox */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setHasInviteLink(!hasInviteLink)}
            >
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                  hasInviteLink
                    ? "bg-linear-to-br from-purple-500 to-pink-500 border-purple-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {hasInviteLink && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
              <label className="font-semibold cursor-pointer">
                {t("hasInviteLink")}
              </label>
            </motion.div>

            {/* Invite Link Input (conditionnel) */}
            <AnimatePresence>
              {hasInviteLink && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleJoinWithLink}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-2">
                    <Label htmlFor="inviteLink" className="font-semibold">
                      {t("inviteLinkLabel")}
                    </Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="inviteLink"
                        type="text"
                        placeholder={t("inviteLinkPlaceholder")}
                        value={inviteLink}
                        onChange={(e) => setInviteLink(e.target.value)}
                        className="h-12 pl-12 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg"
                    >
                      {t("joinWithLink")}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Public Groups Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Section Header */}
          <div className="flex items-center justify-between p-4 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {t("publicGroups")}
            </h2>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-sm font-semibold px-4 py-2 rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg"
            >
              {publicGroups.length} groupes
            </motion.span>
          </div>

          {/* Groups List */}
          {publicGroups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 px-6 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <p className="text-gray-600 dark:text-gray-400">
                {t("noGroups")}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {publicGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="group relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative flex items-center justify-between gap-4">
                    {/* Group Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold">{group.name}</h3>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            group.visibility === "public"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                          }`}
                        >
                          {group.visibility === "public" ? (
                            <Globe className="w-3 h-3" />
                          ) : (
                            <Lock className="w-3 h-3" />
                          )}
                          {group.visibility === "public" ? "Public" : "Privé"}
                        </span>
                      </div>
                      {group.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {group.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>
                          {group.memberCount}{" "}
                          {group.memberCount > 1 ? t("members") : t("member")}
                        </span>
                      </div>
                    </div>

                    {/* Join Button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => handleJoinGroup(group.id)}
                        className="h-12 px-6 rounded-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg"
                      >
                        {t("joinButton")}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
