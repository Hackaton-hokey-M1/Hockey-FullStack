import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

// Vérifier les permissions de l'utilisateur dans le groupe
async function checkPermissions(groupId: number, userId: string) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { ownerId: true },
  });

  const membership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId,
        groupId,
      },
    },
    select: { role: true },
  });

  return {
    isOwner: group?.ownerId === userId,
    isAdmin: membership?.role === "ADMIN",
    isMember: !!membership,
  };
}

// PATCH /api/groups/[id]/members - Gérer les actions sur les membres
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const payload = await verifyToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const currentUserId = payload.userId;

    const { id } = await params;
    const groupId = Number.parseInt(id);

    if (Number.isNaN(groupId)) {
      return NextResponse.json(
        { error: "ID de groupe invalide" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { action, targetUserId } = body;

    if (!action || !targetUserId) {
      return NextResponse.json(
        { error: "Action et targetUserId requis" },
        { status: 400 }
      );
    }

    // Vérifier les permissions de l'utilisateur actuel
    const permissions = await checkPermissions(groupId, currentUserId);

    if (!permissions.isMember) {
      return NextResponse.json(
        { error: "Vous n'êtes pas membre de ce groupe" },
        { status: 403 }
      );
    }

    // Récupérer les infos du membre ciblé
    const targetMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: targetUserId,
          groupId,
        },
      },
      include: {
        user: {
          select: { id: true },
        },
        group: {
          select: { ownerId: true },
        },
      },
    });

    if (!targetMember) {
      return NextResponse.json(
        { error: "Membre introuvable" },
        { status: 404 }
      );
    }

    const targetIsOwner = targetMember.group.ownerId === targetUserId;
    const targetIsAdmin = targetMember.role === "ADMIN";

    // Gestion des actions selon les permissions
    switch (action) {
      case "promote": {
        // Seul le créateur peut promouvoir
        if (!permissions.isOwner) {
          return NextResponse.json(
            { error: "Seul le créateur peut promouvoir des membres" },
            { status: 403 }
          );
        }

        if (targetIsOwner) {
          return NextResponse.json(
            { error: "Le créateur est déjà au rang le plus élevé" },
            { status: 400 }
          );
        }

        if (targetIsAdmin) {
          return NextResponse.json(
            { error: "Ce membre est déjà admin" },
            { status: 400 }
          );
        }

        await prisma.groupMember.update({
          where: {
            userId_groupId: {
              userId: targetUserId,
              groupId,
            },
          },
          data: { role: "ADMIN" },
        });

        return NextResponse.json({
          message: "Membre promu admin avec succès",
          success: true,
        });
      }

      case "demote": {
        // Seul le créateur peut rétrograder
        if (!permissions.isOwner) {
          return NextResponse.json(
            { error: "Seul le créateur peut rétrograder des admins" },
            { status: 403 }
          );
        }

        if (targetIsOwner) {
          return NextResponse.json(
            { error: "Impossible de rétrograder le créateur" },
            { status: 400 }
          );
        }

        if (!targetIsAdmin) {
          return NextResponse.json(
            { error: "Ce membre n'est pas admin" },
            { status: 400 }
          );
        }

        await prisma.groupMember.update({
          where: {
            userId_groupId: {
              userId: targetUserId,
              groupId,
            },
          },
          data: { role: "MEMBER" },
        });

        return NextResponse.json({
          message: "Admin rétrogradé en membre avec succès",
          success: true,
        });
      }

      case "ban": {
        // Admin ou créateur peuvent bannir
        if (!permissions.isOwner && !permissions.isAdmin) {
          return NextResponse.json(
            { error: "Vous n'avez pas les permissions nécessaires" },
            { status: 403 }
          );
        }

        // Un admin ne peut pas bannir un autre admin ou le créateur
        if (permissions.isAdmin && !permissions.isOwner) {
          if (targetIsAdmin || targetIsOwner) {
            return NextResponse.json(
              { error: "Vous ne pouvez pas bannir un admin ou le créateur" },
              { status: 403 }
            );
          }
        }

        if (targetIsOwner) {
          return NextResponse.json(
            { error: "Impossible de bannir le créateur" },
            { status: 400 }
          );
        }

        if (targetMember.isBanned) {
          return NextResponse.json(
            { error: "Ce membre est déjà banni" },
            { status: 400 }
          );
        }

        await prisma.groupMember.update({
          where: {
            userId_groupId: {
              userId: targetUserId,
              groupId,
            },
          },
          data: { isBanned: true },
        });

        return NextResponse.json({
          message: "Membre banni avec succès",
          success: true,
        });
      }

      case "unban": {
        // Admin ou créateur peuvent débannir
        if (!permissions.isOwner && !permissions.isAdmin) {
          return NextResponse.json(
            { error: "Vous n'avez pas les permissions nécessaires" },
            { status: 403 }
          );
        }

        if (!targetMember.isBanned) {
          return NextResponse.json(
            { error: "Ce membre n'est pas banni" },
            { status: 400 }
          );
        }

        await prisma.groupMember.update({
          where: {
            userId_groupId: {
              userId: targetUserId,
              groupId,
            },
          },
          data: { isBanned: false },
        });

        return NextResponse.json({
          message: "Membre débanni avec succès",
          success: true,
        });
      }

      case "kick": {
        // Seul le créateur peut expulser
        if (!permissions.isOwner) {
          return NextResponse.json(
            { error: "Seul le créateur peut expulser des membres" },
            { status: 403 }
          );
        }

        if (targetIsOwner) {
          return NextResponse.json(
            { error: "Le créateur ne peut pas être expulsé" },
            { status: 400 }
          );
        }

        // Supprimer le membre du groupe
        await prisma.groupMember.delete({
          where: {
            userId_groupId: {
              userId: targetUserId,
              groupId,
            },
          },
        });

        return NextResponse.json({
          message: "Membre expulsé avec succès",
          success: true,
        });
      }

      default:
        return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }
  } catch (error) {
    console.error("Erreur lors de la gestion du membre:", error);
    return NextResponse.json(
      { error: "Erreur lors de la gestion du membre" },
      { status: 500 }
    );
  }
}
