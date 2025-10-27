"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { useRouter } from "next/navigation";

type Props = {
    href?: string;
    className?: string;
};

export default function CreateGroupButton({ href = "/groups/create", className }: Props) {
    const router = useRouter();

    return (
        <motion.button
            onClick={() => router.push(href)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative overflow-hidden px-6 py-3 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-shadow duration-300 ${className ?? ""}`}
        >
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300">
                <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}>
                    <Plus className="w-5 h-5" />
                </motion.div>
                <span>Créer un groupe</span>
            </div>
        </motion.button>
    );
}
