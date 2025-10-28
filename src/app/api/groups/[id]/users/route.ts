import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { groupsService } from "@/services/groupsService";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const groupId = parseInt(id, 10);

    if (isNaN(groupId)) {
      return NextResponse.json(
        { error: "ID de groupe invalide" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur si authentifié
    const requestCookies = await cookies();
    const accessToken = requestCookies.get("accessToken")?.value;
    let userId: string | undefined;

    if (accessToken) {
      const payload = await verifyToken(accessToken);
      userId = payload?.userId;
    }

    const group = await groupsService.allUserInGroup(groupId);

    if (!group) {
      return NextResponse.json(
        { error: "Groupe introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ group }, { status: 200 });
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du groupe" },
      { status: 500 }
    );
  }
}
