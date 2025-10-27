'use client'

import { useCallback } from 'react'

import { useTheme } from 'next-themes'

import { Button } from "@/components/ui/button";

export const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = useCallback(() => {
    const current = theme ?? 'light'
    setTheme(current === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  return (
    <Button variant={"default"} onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  )
}