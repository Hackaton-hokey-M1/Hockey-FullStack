'use client'

import { motion } from "framer-motion";

import ExpulsionButton from "@/components/ExpulsionButton";

export default function GroupPage() {
  const users = [
    { id: 1, name: "Utilisateur 1", role: "chef" },
    { id: 2, name: "Utilisateur 2", role: "membre" },
    { id: 3, name: "Utilisateur 3", role: "membre" },
    // Ajoute plus d'utilisateurs ici
  ];

  // Fonction pour gérer l'expulsion d'un utilisateur
  const handleExpelUser = (userId: number) => {
    // Logique pour expulser un membre, par exemple via une API ou une requête à la base de données
    console.log(`L'utilisateur ${userId} a été expulsé`);
  };

  // Fonction pour gérer l'ajout d'un membre
  const handleAddMember = () => {
    // Logique pour ajouter un membre, par exemple via une API ou une requête à la base de données
    console.log("Un nouveau membre a été ajouté");
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pb-8 max-w-7xl">
        {/* Match Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          {/* Équipes en haut */}
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

          {/* Score avec taille plus grande */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <div className="text-6xl font-bold text-blue-600 dark:text-cyan-400">
              <span>2 - 3</span> {/* Dynamique : Score réel ici */}
            </div>
          </motion.div>

          {/* Bouton "Faire un pari" */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-6"
          >
            <div className="py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-xl cursor-pointer">
              Faire un pari
            </div>
          </motion.div>

          {/* Liste des utilisateurs */}
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
                  <div className="flex gap-2" onClick={() => handleExpelUser(user.id)}>
                    <ExpulsionButton />
                  </div>
                </li>
              ))}
            </ul>

            {/* Ajouter un nouveau membre (visible uniquement pour le chef) */}
            {users.some(user => user.role === "chef") && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="mt-6 text-center"
              >
                <div
                  onClick={handleAddMember}
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