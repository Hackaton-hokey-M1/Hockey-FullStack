"use client";

import { motion } from "framer-motion";

import MatchList from "@/components/MatchList";

export default function MatchesPage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pb-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Tous les matchs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Découvrez tous les matchs de hockey et placez vos paris
          </p>
        </motion.div>

        {/* Match List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <MatchList />
        </motion.div>
      </main>
    </div>
  );
}
