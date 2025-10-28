import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { groupsService } from "@/services/groupsService";

// POST /groups/[id]/join - Rejoindre un groupe public
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    const requestCookies = await cookies();
    const accessToken = requestCookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const payload = await verifyToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const { id } = await context.params;
    const groupId = parseInt(id, 10);

    if (isNaN(groupId)) {
      return NextResponse.json(
        { error: "ID de groupe invalide" },
        { status: 400 }
      );
    }

    // Rejoindre le groupe
    const member = await groupsService.joinPublicGroup(groupId, payload.userId);

    return NextResponse.json(
      {
        message: "Vous avez rejoint le groupe avec succès",
        member: {
          userId: member.userId,
          groupId: member.groupId,
          role: member.role,
          joinedAt: member.joinedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error joining group:", error);

    // Gestion des erreurs spécifiques
    if (error.message === "Groupe introuvable") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (
      error.message === "Vous êtes déjà membre de ce groupe" ||
      error.message ===
        "Ce groupe est privé. Vous avez besoin d'un code d'invitation."
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la tentative de rejoindre le groupe" },
      { status: 500 }
    );
  }
}
