"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, Mail, Sparkles, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { registerSchema } from "@/lib/validation";

export type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { push } = useRouter();
  const { register: authRegister } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });
  const t = useTranslations("Register");

  const onSubmit = (data: RegisterForm) => {
    authRegister(data);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 -mt-40 pt-40">
      {/* Background decorative elements */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl translate-x-1/2" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 my-8"
      >
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 text-cyan-600 dark:text-cyan-400" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            Rejoignez-nous !
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Créez votre compte et commencez à parier
          </p>
        </motion.div>

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-cyan-200/50 dark:border-cyan-700/50 shadow-2xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />

            <CardHeader className="relative">
              <CardTitle className="text-2xl">{t("title")}</CardTitle>
              <CardDescription className="text-base">
                {t("description")}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Pseudo Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    {t("pseudo")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      {...register("pseudo")}
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 h-12 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  {errors.pseudo && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      {errors.pseudo.message}
                    </motion.p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t("email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      className="pl-10 h-12 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t("password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      {...register("password")}
                      id="password"
                      type="password"
                      className="pl-10 h-12 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg"
                  >
                    {t("submit")}
                  </Button>
                </motion.div>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vous avez déjà un compte ?{" "}
                    <button
                      type="button"
                      onClick={() => push("login")}
                      className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
                    >
                      {t("login")}
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
