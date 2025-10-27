"use client";

import { motion } from "framer-motion";

import type { Match } from "@/types/match";

const labelByStatus: Record<Match["status"], string> = {
    scheduled: "À venir",
    live: "En direct",
    finished: "Terminé",
    postponed: "Reporté",
};

const clsByStatus: Record<Match["status"], string> = {
    live: "bg-red-600 text-white",
    scheduled: "bg-blue-600 text-white",
    finished: "bg-gray-800 text-white dark:bg-gray-700",
    postponed: "bg-gray-800 text-white dark:bg-gray-700",
};

function StatusChip({ status }: { status: Match["status"] }) {
    return (
        <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${clsByStatus[status]}`}
        >
            {labelByStatus[status]}
        </motion.span>
    );
}

export default function MatchHeader({ match }: { match: Match }) {
    const { homeTeam, awayTeam, homeScore, awayScore, status, tournament, round, venue, date } = match;
    const dateStr = new Date(date).toLocaleString();
    const showScore = status === "live" || status === "finished";
    const score = showScore ? `${homeScore} - ${awayScore}` : "—";

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-xl"
        >
            <div className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 rounded-full bg-linear-to-br from-blue-500/10 to-cyan-500/10 blur-3xl" />

            <div className="relative flex items-start justify-between gap-4">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-gray-600 dark:text-gray-400"
                    >
                        {dateStr}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mt-2 flex items-center justify-between gap-6 text-2xl font-bold"
                    >
                        <span>{homeTeam.name}</span>
                        <motion.span
                            key={score}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 260 }}
                            className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                        >
                            {score}
                        </motion.span>
                        <span>{awayTeam.name}</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-x-2"
                    >
                        {tournament?.name && <span>🏆 {tournament.name}</span>}
                        {round && <span>• {round}</span>}
                        {venue && <span>• {venue}</span>}
                    </motion.div>
                </div>

                <StatusChip status={status} />
            </div>
        </motion.div>
    );
}
