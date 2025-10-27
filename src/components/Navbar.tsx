'use client'

import { useTranslations } from "next-intl"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"


import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggleButton } from "@/components/ThemeToggleButton"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"


export default function Navbar() {
  const pathname = usePathname()
  const t = useTranslations("Navbar")
  const { push } = useRouter()

  const navItems = [
    { label: t("home"), href: "/" },
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
  ]

  return (
    <header
      className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/public" className="text-xl font-semibold text-blue-600 dark:text-blue-400">
          MyApp
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-6">
            {navItems.map(({ label, href }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400",
                    pathname === href
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  <Link href={href}>{label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-3">

          <LanguageSwitcher/>
          <Button variant="outline" size="sm" onClick={() => push("/login")}>
            {t("login")}
          </Button>
          <ThemeToggleButton/>
        </div>
      </div>
    </header>
  )
}
