"use client";

import { useMemo } from "react";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

type PublicGroup = {
    id: string;
    name: string;
    membersCount: number;
    matchId: string;
};

export default function PublicGroupList({ matchId }: { matchId: string }) {
    const groups = useMemo<PublicGroup[]>(
        () => [
            { id: "g_lyon", name: "Fans Lyon", membersCount: 8, matchId: "2" },
            { id: "g_grenoble", name: "Team Grenoble", membersCount: 5, matchId: "2" },
        ].filter((g) => g.matchId === matchId),
        [matchId]
    );

    if (!groups.length) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Aucun groupe public pour ce match.
                </p>
            </motion.div>
        );
    }

    return (
        <ul className="grid gap-4 md:grid-cols-2">
            {groups.map((g, i) => (
                <motion.li
                    key={g.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-lg"
                >
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-linear-to-tr from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <div className="font-semibold">{g.name}</div>
                            <div className="text-xs text-gray-500">Membres : {g.membersCount}</div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => alert(`(mock) rejoindre ${g.name}`)}
                            className="group relative overflow-hidden px-6 py-3 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex items-center gap-2 font-semibold text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors duration-300">
                                <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                                    <Users className="w-5 h-5" />
                                </motion.div>
                                <span>Rejoindre</span>
                            </div>
                        </motion.button>
                    </div>
                </motion.li>
            ))}
        </ul>
    );
}
