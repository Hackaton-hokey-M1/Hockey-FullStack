"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import GroupActions from "@/components/GroupActions";
import MatchList from "@/components/MatchList";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <main className="container mx-auto px-4 pt-32 pb-8 max-w-7xl">
        {/* Dashboard Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Dashboard Hockey
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Suivez tous les matchs de hockey en temps réel
              </p>
            </motion.div>

            {/* Group Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GroupActions />
            </motion.div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50 p-6 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
            <div className="relative flex items-start gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <span className="font-semibold">
                    Créez ou rejoignez un groupe
                  </span>{" "}
                  pour parier avec vos amis sur les matchs !
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Match List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <MatchList />
        </motion.div>
      </main>
    </div>
  );
}
