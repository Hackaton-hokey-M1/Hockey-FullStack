"use client";

import { motion } from "framer-motion";

import type { Match } from "@/types/match";

import CreateGroupButton from "./CreateGroupButton";

export function MatchGroupToolbar({match}: { match: Match }) {
    const href = match ? `/groups/create?matchId=${match.id}` : "/groups/create";

    return (
        <motion.div
            initial={{opacity: 0, y: 14}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4}}
            className="flex items-center justify-between p-4 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50"
        >
            <h2 className="text-xl font-semibold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Groupes publics liés
            </h2>
            <CreateGroupButton href={href} />
        </motion.div>
    );
}
