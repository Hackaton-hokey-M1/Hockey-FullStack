"use client";

import { useMemo, useState } from "react";

import { motion, useScroll, useTransform } from "framer-motion";
import { Home, LogIn, Menu, Trophy, Users, X } from "lucide-react";
import { useTranslations } from "next-intl";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const pathname = usePathname();
    const t = useTranslations("Navbar");
    const { push } = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { scrollY } = useScroll();
    const { user, logout } = useAuth();
    const navbarY = useTransform(scrollY, [0, 100], [20, 10]);

    const navItems = useMemo(
        () => [
            { label: t("home"), href: "/", icon: Home },
            { label: t("matches"), href: "/matches", icon: Trophy },
            ...(user ? [{ label: t("myGroups"), href: "/my-groups", icon: Users }] : []),
        ],
        [t, user]
    );

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            {/* Navbar flottante avec glassmorphism */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 px-4 pointer-events-none"
                style={{ y: navbarY }}
            >
                <motion.nav
                    className="max-w-6xl mx-auto mt-6 pointer-events-auto"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div
                        className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-blue-500/10 dark:shadow-blue-400/10"
                        style={{
                            boxShadow: "0 8px 32px 0 rgba(59, 130, 246, 0.15)",
                        }}
                    >
                        <div className="flex items-center justify-between px-6 py-4">
                            {/* Logo avec animation */}
                            <Link href="/" className="flex items-center gap-2 group">
                                <motion.div
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50"
                                >
                                    <Trophy className="w-5 h-5 text-white" />
                                </motion.div>
                                <motion.span
                                    className="text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    HockeyBet
                                </motion.span>
                            </Link>

                            {/* Navigation Desktop */}
                            <div className="hidden md:flex items-center gap-2">
                                {navItems.map(({ label, href, icon: Icon }) => {
                                    const isActive = pathname === href;
                                    return (
                                        <Link key={href} href={href}>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="relative"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    className={cn(
                                                        "relative px-6 py-2 rounded-full font-medium transition-all duration-300",
                                                        isActive
                                                            ? "text-white"
                                                            : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                                    )}
                                                >
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="navbar-pill"
                                                            className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-600 rounded-full"
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 380,
                                                                damping: 30,
                                                            }}
                                                        />
                                                    )}
                                                    <span className="relative z-10 flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                                                        {label}
                          </span>
                                                </Button>
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Actions Desktop */}
                            <div className="hidden md:flex items-center gap-3">
                                <ThemeToggleButton />

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {user ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    className="rounded-full px-4 py-2 font-medium bg-white/20 dark:bg-gray-900/30 backdrop-blur-md border border-blue-400 text-blue-600 dark:text-blue-400 shadow-md shadow-blue-500/20 flex items-center hover:shadow-blue-500/60 hover:scale-105 transition-all"
                                                >
                          <span
                              className="w-5 h-5 mr-2 flex items-center justify-center rounded-full bg-blue-600 text-white"
                              aria-hidden
                          >
                            {(user.name?.[0] || "P").toUpperCase()}
                          </span>

                                                    <span className="truncate max-w-[160px]">
                            {user.name?.trim() || "Profil"}
                          </span>
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent
                                                align="end"
                                                sideOffset={8}
                                                className="w-48 bg-white/20 dark:bg-gray-900/30 backdrop-blur-md border border-blue-400 shadow-lg shadow-blue-500/30"
                                            >
                                                        <DropdownMenuItem asChild>
                                                            <Link href={("/profil")}>Modifier mon profil</Link>
                                                        </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => push(("/profil"))}
                                                    className="hover:bg-blue-600/30 dark:hover:bg-blue-500/30 transition-all"
                                                >
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    className="text-red-600 dark:text-red-400 hover:bg-red-600/30 dark:hover:bg-red-500/30 hover:backdrop-blur-md hover:shadow-red-500/50 transition-all"
                                                    onClick={logout}
                                                >
                                                    Déconnexion
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <Button
                                            size="sm"
                                            onClick={() => push("/login")}
                                            className="rounded-full px-6 font-semibold bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30"
                                        >
                                            <LogIn className="w-4 h-4 mr-2" />
                                            {t("login")}
                                        </Button>
                                    )}
                                </motion.div>
                            </div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                ) : (
                                    <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.nav>
            </motion.header>

            {/* Mobile Menu */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                    opacity: mobileMenuOpen ? 1 : 0,
                    y: mobileMenuOpen ? 0 : -20,
                    pointerEvents: mobileMenuOpen ? "auto" : "none",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed top-24 left-4 right-4 z-40 md:hidden"
            >
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: mobileMenuOpen ? 1 : 0.95 }}
                    className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-blue-500/10 overflow-hidden"
                >
                    <div className="p-6 space-y-4">
                        {/* Navigation Links */}
                        {navItems.map(({ label, href, icon: Icon }, index) => {
                            const isActive = pathname === href;
                            return (
                                <motion.div
                                    key={href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{
                                        opacity: mobileMenuOpen ? 1 : 0,
                                        x: mobileMenuOpen ? 0 : -20,
                                    }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={href} onClick={() => setMobileMenuOpen(false)}>
                                        <motion.div
                                            whileTap={{ scale: 0.95 }}
                                            className={cn(
                                                "flex items-center gap-3 p-4 rounded-2xl transition-all duration-300",
                                                isActive
                                                    ? "bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                                                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                            )}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{label}</span>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            );
                        })}

                        <div className="h-px bg-gray-200 dark:bg-gray-700" />

                        {/* Actions */}
                        <div className="space-y-3">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: mobileMenuOpen ? 1 : 0,
                                    x: mobileMenuOpen ? 0 : -20,
                                }}
                                transition={{ delay: 0.2 }}
                            >
                                {user ? (
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/profile"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <Button className="w-full justify-start rounded-2xl p-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm flex items-center">
                        <span className="w-5 h-5 mr-3 flex items-center justify-center rounded-full bg-blue-600 text-white">
                          {(user.name?.[0] || "P").toUpperCase()}
                        </span>
                                                <span className="truncate max-w-[200px]">
                          {user.name?.trim() || "Profil"}
                        </span>
                                            </Button>
                                        </Link>

                                        <Button
                                            onClick={() => {
                                                logout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="w-full justify-start rounded-2xl p-4 bg-red-600 text-white shadow-sm flex items-center"
                                        >
                                            Déconnexion
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            push("/login");
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full justify-start rounded-2xl p-4 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                                    >
                                        <LogIn className="w-5 h-5 mr-3" />
                                        {t("login")}
                                    </Button>
                                )}
                            </motion.div>

                            {/* Theme Switcher */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: mobileMenuOpen ? 1 : 0,
                                    x: mobileMenuOpen ? 0 : -20,
                                }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Thème
                </span>
                                <ThemeToggleButton />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Overlay pour mobile menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                />
            )}
        </>
    );
}
