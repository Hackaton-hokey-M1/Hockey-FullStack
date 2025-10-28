"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Crown,
  ShieldCheck,
  ShieldOff,
  UserX,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { manageMember, type MemberAction } from "@/lib/apiGroups";

interface MemberActionsProps {
  groupId: number;
  memberId: string;
  memberRole: "ADMIN" | "MEMBER";
  isBanned: boolean;
  isOwner: boolean;
  currentUserIsOwner: boolean;
  currentUserIsAdmin: boolean;
  onActionComplete: () => void;
}

interface ActionConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: MemberAction;
  description: string;
  color: string;
  bgColor: string;
  hoverBgColor: string;
  iconBgColor: string;
  dangerous?: boolean;
}

export function MemberActions({
  groupId,
  memberId,
  memberRole,
  isBanned,
  isOwner,
  currentUserIsOwner,
  currentUserIsAdmin,
  onActionComplete,
}: MemberActionsProps) {
  const [selectedAction, setSelectedAction] = useState<ActionConfig | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Si pas de permissions, ne rien afficher
  if (!currentUserIsOwner && !currentUserIsAdmin) {
    return null;
  }

  // Ne peut pas gérer le créateur
  if (isOwner) {
    return null;
  }

  const handleActionClick = (actionConfig: ActionConfig) => {
    setSelectedAction(actionConfig);
  };

  const handleConfirm = async () => {
    if (!selectedAction) return;

    setLoading(true);
    try {
      const result = await manageMember(
        groupId,
        memberId,
        selectedAction.action
      );
      toast.success(result.message);
      setSelectedAction(null);
      onActionComplete();
    } catch (error) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error
          : undefined;
      toast.error(errorMessage || "Erreur lors de l'action");
    } finally {
      setLoading(false);
    }
  };

  // Liste des actions disponibles selon les permissions
  const actions: ActionConfig[] = [];

  // Créateur peut tout faire
  if (currentUserIsOwner) {
    if (memberRole === "MEMBER") {
      actions.push({
        icon: Crown,
        label: "Promouvoir",
        action: "promote" as MemberAction,
        description: "Promouvoir ce membre en administrateur du groupe",
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
        hoverBgColor: "hover:bg-yellow-200 dark:hover:bg-yellow-900/40",
        iconBgColor: "bg-yellow-500",
      });
    } else {
      actions.push({
        icon: ShieldOff,
        label: "Rétrograder",
        action: "demote" as MemberAction,
        description: "Rétrograder cet administrateur en membre simple",
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
        hoverBgColor: "hover:bg-orange-200 dark:hover:bg-orange-900/40",
        iconBgColor: "bg-orange-500",
      });
    }

    actions.push({
      icon: UserX,
      label: "Expulser",
      action: "kick" as MemberAction,
      description: "Retirer définitivement ce membre du groupe",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      hoverBgColor: "hover:bg-red-200 dark:hover:bg-red-900/40",
      iconBgColor: "bg-red-500",
      dangerous: true,
    });
  }

  // Admin et créateur peuvent bannir/débannir
  if (currentUserIsOwner || (currentUserIsAdmin && memberRole === "MEMBER")) {
    if (isBanned) {
      actions.push({
        icon: ShieldCheck,
        label: "Débannir",
        action: "unban" as MemberAction,
        description: "Autoriser ce membre à participer de nouveau",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        hoverBgColor: "hover:bg-green-200 dark:hover:bg-green-900/40",
        iconBgColor: "bg-green-500",
      });
    } else {
      actions.push({
        icon: ShieldOff,
        label: "Bannir",
        action: "ban" as MemberAction,
        description: "Empêcher ce membre de participer au groupe",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        hoverBgColor: "hover:bg-red-200 dark:hover:bg-red-900/40",
        iconBgColor: "bg-red-500",
        dangerous: true,
      });
    }
  }

  if (actions.length === 0) {
    return null;
  }

  return (
    <>
      {/* Boutons d'actions avec icônes */}
      <div className="flex items-center gap-1.5">
        {actions.map((actionConfig, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleActionClick(actionConfig)}
            className={`p-2 rounded-xl ${actionConfig.bgColor} ${actionConfig.hoverBgColor} ${actionConfig.color} transition-all shadow-sm hover:shadow-md`}
            title={actionConfig.label}
          >
            <actionConfig.icon className="w-4 h-4" />
          </motion.button>
        ))}
      </div>

      {/* Modal de confirmation */}
      <AnimatePresence>
        {selectedAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setSelectedAction(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Header avec icône */}
              <div className="relative p-6 pb-4">
                <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-gray-100 dark:from-gray-800 to-transparent opacity-50" />

                <button
                  onClick={() => !loading && setSelectedAction(null)}
                  disabled={loading}
                  className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="relative flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className={`w-16 h-16 ${selectedAction.iconBgColor} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <selectedAction.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedAction.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAction.description}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 pb-6">
                {selectedAction.dangerous && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 mb-6"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                        Attention
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                        Cette action ne peut pas être annulée
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Boutons d'action */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setSelectedAction(null)}
                    disabled={loading}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={loading}
                    className={`flex-1 ${
                      selectedAction.dangerous
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {loading ? "Traitement..." : "Confirmer"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
