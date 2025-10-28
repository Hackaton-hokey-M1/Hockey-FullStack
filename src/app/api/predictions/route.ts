import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

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

    const userId = payload.userId;

    // Récupérer les données de la prédiction
    const body = await request.json();
    const { matchId, groupId, homeScore, awayScore } = body;

    // Validation
    if (
      !matchId ||
      !groupId ||
      homeScore === undefined ||
      awayScore === undefined
    ) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    if (homeScore < 0 || awayScore < 0) {
      return NextResponse.json(
        { error: "Les scores doivent être positifs" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur est membre du groupe
    const membership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId: parseInt(groupId),
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Vous n'êtes pas membre de ce groupe" },
        { status: 403 }
      );
    }

    // Créer ou mettre à jour la prédiction (utilise externalMatchId)
    const prediction = await prisma.prediction.upsert({
      where: {
        userId_groupId_externalMatchId: {
          userId,
          groupId: parseInt(groupId),
          externalMatchId: matchId, // matchId est déjà un string de l'API externe
        },
      },
      update: {
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore),
      },
      create: {
        userId,
        groupId: parseInt(groupId),
        externalMatchId: matchId,
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore),
      },
    });

    return NextResponse.json({
      message: "Prédiction enregistrée avec succès",
      prediction,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la prédiction:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
