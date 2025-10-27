"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { ArrowLeft, Globe, Lock, Sparkles, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateGroupPage() {
  const t = useTranslations("CreateGroup");
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    visibility: "public" as "public" | "private",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la création du groupe
    console.log("Création du groupe:", formData);
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pb-8 max-w-3xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 mx-auto bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{t("subtitle")}</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-2xl"
        >
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />

          <form onSubmit={handleSubmit} className="relative space-y-6">
            {/* Group Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="name" className="text-lg font-semibold">
                {t("groupName")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={t("groupNamePlaceholder")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="h-12 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
              />
            </motion.div>

            {/* Visibility */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <Label className="text-lg font-semibold">{t("visibility")}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Public Option */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setFormData({ ...formData, visibility: "public" })
                  }
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                    formData.visibility === "public"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  {formData.visibility === "public" && (
                    <motion.div
                      layoutId="visibility-indicator"
                      className="absolute inset-0 bg-blue-500/10 rounded-2xl"
                    />
                  )}
                  <div className="relative flex flex-col items-center text-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        formData.visibility === "public"
                          ? "bg-linear-to-br from-blue-500 to-cyan-500"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      <Globe
                        className={`w-6 h-6 ${
                          formData.visibility === "public"
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{t("public")}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("publicDescription")}
                      </p>
                    </div>
                  </div>
                </motion.button>

                {/* Private Option */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setFormData({ ...formData, visibility: "private" })
                  }
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                    formData.visibility === "private"
                      ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/30"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  {formData.visibility === "private" && (
                    <motion.div
                      layoutId="visibility-indicator"
                      className="absolute inset-0 bg-purple-500/10 rounded-2xl"
                    />
                  )}
                  <div className="relative flex flex-col items-center text-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        formData.visibility === "private"
                          ? "bg-linear-to-br from-purple-500 to-pink-500"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      <Lock
                        className={`w-6 h-6 ${
                          formData.visibility === "private"
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{t("private")}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("privateDescription")}
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="description" className="text-lg font-semibold">
                {t("description")}
              </Label>
              <textarea
                id="description"
                placeholder={t("descriptionPlaceholder")}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              />
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 h-12 rounded-full border-2 font-semibold"
              >
                {t("cancel")}
              </Button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  type="submit"
                  className="w-full h-12 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-500/30"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t("createButton")}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50"
        >
          <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
            💡 <span className="font-semibold">Astuce :</span> Vous pourrez
            inviter des amis une fois le groupe créé !
          </p>
        </motion.div>
      </main>
    </div>
  );
}
