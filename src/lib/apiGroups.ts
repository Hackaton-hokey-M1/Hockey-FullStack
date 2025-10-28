import privateApi from "./api";

export interface CreateGroupInput {
  name: string;
  description?: string;
  visibility: "PUBLIC" | "PRIVATE";
  competitionId?: string;
  externalMatchId?: string;
}

export interface JoinGroupByCodeInput {
  inviteCode: string;
}

export interface Group {
  id: number;
  name: string;
  description: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  competitionId: string;
  externalMatchId?: string | null;
  ownerId: string;
  inviteCode?: string | null;
  membersCount: number;
  isOwner?: boolean;
  isMember?: boolean;
  createdAt?: string;
  pointsExactScore?: number;
  pointsCorrectResult?: number;
  pointsBonus?: number;
}

export interface UserGroup extends Group {
  role: "ADMIN" | "MEMBER";
  score: number;
  joinedAt: string;
}

// Créer un groupe
export const createGroup = async (data: CreateGroupInput) => {
  const response = await privateApi.post("/groups", data);
  return response.data;
};

// Récupérer tous les groupes publics
export const getPublicGroups = async (): Promise<{ groups: Group[] }> => {
  const response = await privateApi.get("/groups");
  return response.data;
};

// Récupérer les détails d'un groupe
export const getGroupById = async (
  groupId: number
): Promise<{ group: Group }> => {
  const response = await privateApi.get(`/groups/${groupId}`);
  return response.data;
};

// Rejoindre un groupe public
export const joinPublicGroup = async (groupId: number) => {
  const response = await privateApi.post(`/groups/${groupId}/join`);
  return response.data;
};

// Rejoindre un groupe avec un code d'invitation
export const joinGroupByCode = async (data: JoinGroupByCodeInput) => {
  const response = await privateApi.post("/groups/join-by-code", data);
  return response.data;
};

// Récupérer les groupes de l'utilisateur connecté
export const getMyGroups = async (): Promise<{ groups: UserGroup[] }> => {
  const response = await privateApi.get("/groups/my-groups");
  return response.data;
};

export interface GroupMember {
  id: string;
  name: string | null;
  role: "ADMIN" | "MEMBER";
  score: number;
  isBanned: boolean;
  joinedAt: string; // Sérialisé en string par l'API
}

export const getUsersInGroup = async (
  groupId: number
): Promise<{ users: GroupMember[] }> => {
  const response = await privateApi.get(`/groups/${groupId}/users`);
  return response.data;
};

// Actions de gestion des membres
export type MemberAction = "promote" | "demote" | "ban" | "unban" | "kick";

export const manageMember = async (
  groupId: number,
  targetUserId: string,
  action: MemberAction
): Promise<{ success: boolean; message: string }> => {
  const response = await privateApi.patch(`/groups/${groupId}/members`, {
    action,
    targetUserId,
  });
  return response.data;
};
