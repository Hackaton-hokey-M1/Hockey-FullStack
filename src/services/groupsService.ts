import crypto from "crypto";

import { GroupVisibility } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type PublicGroup = {
  id: number;
  name: string;
  description: string | null;
  visibility: GroupVisibility;
  membersCount: number;
  competitionId: string;
  externalMatchId?: string | null;
};

export type GroupWithDetails = {
  id: number;
  name: string;
  description: string | null;
  visibility: GroupVisibility;
  competitionId: string;
  externalMatchId?: string | null;
  ownerId: string;
  inviteCode: string | null;
  createdAt: Date;
  membersCount: number;
  isOwner: boolean;
  isMember: boolean;
};

// Générer un code d'invitation unique
function generateInviteCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

export const groupsService = {
  // Créer un nouveau groupe
  async create(input: {
    name: string;
    description?: string;
    visibility: "PUBLIC" | "PRIVATE";
    competitionId: string;
    externalMatchId?: string;
    ownerId: string;
  }) {
    // Générer un code d'invitation pour les groupes privés
    const inviteCode =
      input.visibility === "PRIVATE" ? generateInviteCode() : null;

    const group = await prisma.group.create({
      data: {
        name: input.name,
        description: input.description || null,
        visibility: input.visibility as GroupVisibility,
        competitionId: input.competitionId,
        externalMatchId: input.externalMatchId || null,
        ownerId: input.ownerId,
        inviteCode,
      },
    });

    // Ajouter automatiquement le créateur comme membre admin
    await prisma.groupMember.create({
      data: {
        userId: input.ownerId,
        groupId: group.id,
        role: "ADMIN",
      },
    });

    return group;
  },

  // Lister tous les groupes publics
  async listPublic(): Promise<PublicGroup[]> {
    const groups = await prisma.group.findMany({
      where: {
        visibility: "PUBLIC",
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      visibility: group.visibility,
      competitionId: group.competitionId,
      externalMatchId: group.externalMatchId,
      membersCount: group._count.members,
    }));
  },

  // Récupérer les détails d'un groupe
  async getById(
    groupId: number,
    userId?: string
  ): Promise<GroupWithDetails | null> {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        _count: {
          select: { members: true },
        },
        members: userId
          ? {
              where: { userId },
              select: { userId: true },
            }
          : false,
      },
    });

    if (!group) return null;

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      visibility: group.visibility,
      competitionId: group.competitionId,
      externalMatchId: group.externalMatchId,
      ownerId: group.ownerId,
      inviteCode: group.inviteCode,
      createdAt: group.createdAt,
      membersCount: group._count.members,
      isOwner: userId ? group.ownerId === userId : false,
      isMember:
        userId && Array.isArray(group.members)
          ? group.members.length > 0
          : false,
    };
  },

  // Rejoindre un groupe public
  async joinPublicGroup(groupId: number, userId: string) {
    // Vérifier que le groupe existe et est public
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new Error("Groupe introuvable");
    }

    if (group.visibility !== "PUBLIC") {
      throw new Error(
        "Ce groupe est privé. Vous avez besoin d'un code d'invitation."
      );
    }

    // Vérifier si l'utilisateur est déjà membre
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (existingMember) {
      throw new Error("Vous êtes déjà membre de ce groupe");
    }

    // Ajouter l'utilisateur comme membre
    const member = await prisma.groupMember.create({
      data: {
        userId,
        groupId,
        role: "MEMBER",
      },
    });

    return member;
  },

  // Rejoindre un groupe avec un code d'invitation
  async joinByInviteCode(inviteCode: string, userId: string) {
    // Trouver le groupe avec ce code
    const group = await prisma.group.findUnique({
      where: { inviteCode },
    });

    if (!group) {
      throw new Error("Code d'invitation invalide");
    }

    // Vérifier si l'utilisateur est déjà membre
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId: group.id,
        },
      },
    });

    if (existingMember) {
      throw new Error("Vous êtes déjà membre de ce groupe");
    }

    // Ajouter l'utilisateur comme membre
    const member = await prisma.groupMember.create({
      data: {
        userId,
        groupId: group.id,
        role: "MEMBER",
      },
    });

    return { member, group };
  },

  // Récupérer les groupes d'un utilisateur
  async getUserGroups(userId: string) {
    const memberships = await prisma.groupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            _count: {
              select: { members: true },
            },
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    return memberships.map((membership) => ({
      id: membership.group.id,
      name: membership.group.name,
      description: membership.group.description,
      visibility: membership.group.visibility,
      competitionId: membership.group.competitionId,
      externalMatchId: membership.group.externalMatchId,
      inviteCode: membership.group.inviteCode,
      role: membership.role,
      score: membership.score,
      membersCount: membership.group._count.members,
      joinedAt: membership.joinedAt,
      isOwner: membership.group.ownerId === userId,
    }));
  },
};
