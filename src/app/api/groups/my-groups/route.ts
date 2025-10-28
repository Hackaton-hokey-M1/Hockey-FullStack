import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { groupsService } from "@/services/groupsService";

// GET /groups/my-groups - Récupérer les groupes de l'utilisateur connecté
export async function GET() {
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

    const groups = await groupsService.getUserGroups(payload.userId);

    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de vos groupes" },
      { status: 500 }
    );
  }
}
