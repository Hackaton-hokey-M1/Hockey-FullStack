import privateApi from "@/lib/api";

export async function getUserProfile(userId: string) {
  const response = await privateApi.get(`/users/${userId}`);
  return response.data;
}

export async function updateUserProfile(userId: string, data: Partial<{ name: string; email: string; }>) {
  const response = await privateApi.put(`/users/${userId}`, data);
  return response.data;
}
