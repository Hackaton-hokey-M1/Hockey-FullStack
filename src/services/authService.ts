import { z } from 'zod';

import privateApi from "@/lib/api";


export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type LoginPayload = z.infer<typeof loginSchema>;

export async function loginService(payload: LoginPayload) {
  const validated = loginSchema.parse(payload);
  const response = await privateApi.post('/auth/login', validated);
  return response.data;
}

export async function logout() {
  await privateApi.post('/auth/logout');
}

export async function getCurrentUser() {
  const response = await privateApi.get('/auth/me');
  return response.data;
}
