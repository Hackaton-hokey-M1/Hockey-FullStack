"use client";

import { motion } from "framer-motion";
import { Plus, Users } from "lucide-react";

interface GroupActionsProps {
  onCreateGroup?: () => void;
  onJoinGroup?: () => void;
}

export default function GroupActions({
  onCreateGroup,
  onJoinGroup,
}: GroupActionsProps) {
  const handleCreateGroup = () => {
    if (onCreateGroup) {
      onCreateGroup();
    } else {
      // Rediriger vers la page de création
      window.location.href = "/groups/create";
    }
  };

  const handleJoinGroup = () => {
    if (onJoinGroup) {
      onJoinGroup();
    } else {
      // TODO: Implémenter la logique pour rejoindre un groupe
      console.log("Rejoindre un groupe");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <motion.button
        onClick={handleCreateGroup}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="group relative overflow-hidden px-6 py-3 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-shadow duration-300"
      >
        <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300">
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <Plus className="w-5 h-5" />
          </motion.div>
          <span>Créer un groupe</span>
        </div>
      </motion.button>

      <motion.button
        onClick={handleJoinGroup}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="group relative overflow-hidden px-6 py-3 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-shadow duration-300"
      >
        <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center gap-2 font-semibold text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors duration-300">
          <motion.div
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Users className="w-5 h-5" />
          </motion.div>
          <span>Rejoindre un groupe</span>
        </div>
      </motion.button>
    </div>
  );
}
