import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { groupsService } from "@/services/groupsService";

// POST /groups/join-by-code - Rejoindre un groupe avec un code d'invitation
export async function POST(request: NextRequest) {
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

    // Récupérer le code d'invitation
    const body = await request.json();
    const { inviteCode } = body;

    if (!inviteCode || !inviteCode.trim()) {
      return NextResponse.json(
        { error: "Le code d'invitation est requis" },
        { status: 400 }
      );
    }

    // Rejoindre le groupe
    const { member, group } = await groupsService.joinByInviteCode(
      inviteCode.trim().toUpperCase(),
      payload.userId
    );

    return NextResponse.json(
      {
        message: "Vous avez rejoint le groupe avec succès",
        member: {
          userId: member.userId,
          groupId: member.groupId,
          role: member.role,
          joinedAt: member.joinedAt,
        },
        group: {
          id: group.id,
          name: group.name,
          description: group.description,
          visibility: group.visibility,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error joining group by code:", error);

    // Gestion des erreurs spécifiques
    if (error.message === "Code d'invitation invalide") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error.message === "Vous êtes déjà membre de ce groupe") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la tentative de rejoindre le groupe" },
      { status: 500 }
    );
  }
}
