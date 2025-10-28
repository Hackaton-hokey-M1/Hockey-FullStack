'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form'
import { z } from "zod";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/contexts/AuthContext'
import { registerSchema } from '@/lib/validation'

export type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { push } = useRouter();
  const { register: authRegister } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  })
  const t = useTranslations('Register');

  const onSubmit = (data: RegisterForm) => {
    authRegister(data)
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-slate-200 dark:bg-gray-900 transition-colors duration-300 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center p-6"
      >
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <div className={"flex items-center justify-between"}>
                <CardTitle>{t('title')}</CardTitle>
                <Button variant="link" onClick={() => push('login')}>{t('login')}</Button>
              </div>
              <CardDescription>
                {t('description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">{t('pseudo')}</Label>
                    <Input
                      {...register('pseudo')}
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                    {errors.pseudo && <p className="text-red-500 text-sm mt-2">{errors.pseudo.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      {...register('email')}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">{t('password')}</Label>
                    <Input
                      {...register('password')}
                      id="password"
                      type="password"
                      required/>
                    {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>}
                  </div>
                </div>
                <CardFooter className="mt-4 p-0">
                  <Button asChild className="w-full">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full"
                      type="submit"
                    >
                      {t('submit')}
                    </motion.button>
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
