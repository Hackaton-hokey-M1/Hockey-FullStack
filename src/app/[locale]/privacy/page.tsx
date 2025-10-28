"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const t = useTranslations("Privacy");
  const router = useRouter();

  const sections = [
    { title: t("section1Title"), content: t("section1Content") },
    { title: t("section2Title"), content: t("section2Content") },
    { title: t("section3Title"), content: t("section3Content") },
    { title: t("section4Title"), content: t("section4Content") },
    { title: t("section5Title"), content: t("section5Content") },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pb-16 max-w-4xl">
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
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 mx-auto bg-linear-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold mb-3 bg-linear-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("lastUpdate")}: {new Date().toLocaleDateString("fr-FR")}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Introduction */}
          <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-xl">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-linear-to-tr from-green-600/20 to-emerald-600/20 rounded-full blur-3xl" />
            <p className="relative text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {t("intro")}
            </p>
          </div>

          {/* Sections */}
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-xl"
            >
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-linear-to-tr from-green-600/10 to-emerald-600/10 rounded-full blur-3xl" />
              <h2 className="relative text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {section.title}
              </h2>
              <p className="relative text-gray-700 dark:text-gray-300 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative overflow-hidden rounded-3xl bg-linear-to-r from-green-600 to-emerald-600 p-8 shadow-2xl text-white text-center"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <p className="relative text-lg font-semibold mb-2">
              Des questions sur notre politique de confidentialité ?
            </p>
            <p className="relative text-white/90">
              N'hésitez pas à nous contacter pour toute question concernant vos
              données personnelles.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
