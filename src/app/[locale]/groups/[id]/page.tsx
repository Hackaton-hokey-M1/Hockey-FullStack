'use client'

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { useParams } from "next/navigation";

import ExpulsionButton from "@/components/ExpulsionButton";
import { getUsersInGroup } from "@/lib/apiGroups";

type User = {
  id: number;
  name: string;
  role: "chef" | "membre";
  score?: number;
  bet?: { team: "team1" | "team2"; amount: number };
};

export default function GroupPage() {
  const params = useParams();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const idParam = params?.id;
      if (!idParam) return;
      const id = Array.isArray(idParam) ? Number(idParam[0]) : Number(idParam);
      if (Number.isNaN(id)) return;
      const response = await getUsersInGroup(id);
      setUsers(response.group as unknown as User[] ?? []);
    };

    fetchUsers();
  }, [params?.id]);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pb-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <div className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
              <span>Équipe 1</span> vs <span>Équipe 2</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <div className="text-6xl font-bold text-blue-600 dark:text-cyan-400">
              <span>2 - 3</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-6"
          >
            <div
              className="py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-xl cursor-pointer"
            >
              Faire un pari
            </div>
          </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-lg"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200">
                  Utilisateurs dans le groupe
                </h3>
              </div>
              <ul className="space-y-4">
                {users.map((user) => (
                  <li key={user.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-800 dark:text-gray-200">{user.name}</span>
                      {user.role === "chef" && (
                        <span className="text-sm text-green-500">(Chef)</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {user.bet && (
                        <div className="flex items-center gap-2 mr-2">
                          <span
                            className={
                              "px-2 py-1 rounded-md text-xs font-semibold " +
                              (user.bet.team === "team1"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-cyan-100 text-cyan-800")
                            }
                            aria-hidden
                          >
                            {user.bet.team === "team1" ? "Team 1" : "Team 2"}
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                            {user.bet.amount}€
                          </span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <ExpulsionButton />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {users.some(user => user.role === "chef") && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 text-center"
                >
                  <div
                    className="py-3 px-6 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl text-xl cursor-pointer"
                  >
                    Ajouter un membre
                  </div>
                </motion.div>
              )}
            </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
