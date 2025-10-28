import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { groupsService } from "@/services/groupsService";

// GET /groups - Lister tous les groupes publics
export async function GET() {
  try {
    const groups = await groupsService.listPublic();
    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des groupes" },
      { status: 500 }
    );
  }
}

// POST /groups - Créer un nouveau groupe
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

    // Récupérer les données du corps de la requête
    const body = await request.json();
    const { name, description, visibility, competitionId, externalMatchId } =
      body;

    // Validation des champs
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Le nom du groupe est requis" },
        { status: 400 }
      );
    }

    if (!visibility || !["PUBLIC", "PRIVATE"].includes(visibility)) {
      return NextResponse.json(
        { error: "La visibilité doit être PUBLIC ou PRIVATE" },
        { status: 400 }
      );
    }

    // Pour l'instant, on utilise un competitionId par défaut
    // TODO: À adapter selon votre logique métier
    const defaultCompetitionId = competitionId || "default-competition";

    // Créer le groupe
    const group = await groupsService.create({
      name: name.trim(),
      description: description?.trim(),
      visibility,
      competitionId: defaultCompetitionId,
      externalMatchId: externalMatchId || undefined,
      ownerId: payload.userId,
    });

    return NextResponse.json(
      {
        message: "Groupe créé avec succès",
        group: {
          id: group.id,
          name: group.name,
          description: group.description,
          visibility: group.visibility,
          inviteCode: group.inviteCode,
          competitionId: group.competitionId,
          externalMatchId: group.externalMatchId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du groupe" },
      { status: 500 }
    );
  }
}
