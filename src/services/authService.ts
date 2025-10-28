import { z } from 'zod';

import privateApi from "@/lib/api";
import { loginSchema, registerSchema } from '@/lib/validation';

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;

export async function loginService(payload: LoginPayload) {
  const validated = loginSchema.parse(payload);
  const { data } = await privateApi.post('/auth/login', validated);
  return data;
}

export async function registerService(payload: RegisterPayload) {
  const validated = registerSchema.parse(payload);
  const response = await privateApi.post('/auth/register', validated);
  return response.data;
}

export async function logoutService() {
  await privateApi.post('/auth/logout');
}

export async function getUserService() {
  try {
    const { data } = await privateApi.get('/auth/me');
    return data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 401) {
      const refreshResponse = await privateApi.post('/auth/refresh');
      if (refreshResponse.status === 200) {
        const { data } = await privateApi.get('/auth/me');
        return data;
      }
      return null;
    }
    console.error('Error fetching user:', error);
    return null;
  }
}
