import * as z from 'zod'

export const loginSchema = z.object({
  email: z.email({message: 'Email invalide'}),
  password: z.string().min(6, 'Minimum 6 caractères'),
})