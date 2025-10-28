import * as z from 'zod'

export const loginSchema = z.object({
  email: z.email({ message: 'Email invalide' }),
  password: z.string().min(6, 'Minimum 6 caractères'),
})

export const registerSchema = z.object({
  pseudo: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.email({ message: 'Email invalide' }),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})