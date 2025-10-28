"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";

import { useRouter } from "next/navigation";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserDTO = { id: number; email: string; name: string; createdAt?: string; updatedAt?: string };

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserDTO | null>(null);
    const [name, setName] = useState("");
    const locale = useLocale();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                setError(null);
                const res = await fetch("/api/profile", { cache: "no-store" });
                if (!res.ok) throw new Error("Unauthorized");
                const data = await res.json();
                setUser(data.user);
                setName(data.user?.name ?? "");
            } catch {
                setError("Vous devez être connecté.");
                router.push(`/${locale}/login`);
            } finally {
                setLoading(false);
            }
        })();
    }, [locale, router]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j.error || "Échec de la mise à jour");
            }
            const j = await res.json();
            setUser(j.user);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Erreur";
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto max-w-3xl px-4 py-16">
                <p>Chargement du profil…</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 pb-8 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                        Modifier mon profil
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Mettez à jour vos informations personnelles
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-xl"
                >
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-linear-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
                    <div className="relative">
                        {error && <div className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</div>}

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <Input value={user?.email ?? ""} disabled className="mt-1" />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Nom / Pseudo</label>
                                <Input
                                    className="mt-1"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Votre nom"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => router.back()}>
                                    Annuler
                                </Button>
                                <Button disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</Button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
