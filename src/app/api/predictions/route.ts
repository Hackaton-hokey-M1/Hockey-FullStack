import { verify } from "jsonwebtoken";

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface JWTPayload {
  userId: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const token = request.cookies.get("accessToken")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = verify(token, JWT_SECRET) as JWTPayload;
      userId = decoded.userId;
    } catch {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 401 }
      );
    }

    // Récupérer les données de la prédiction
    const body = await request.json();
    const { matchId, groupId, homeScore, awayScore } = body;

    // Validation
    if (!matchId || !groupId || homeScore === undefined || awayScore === undefined) {
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

    // Vérifier que le match existe
    const match = await prisma.match.findUnique({
      where: { id: parseInt(matchId) },
    });

    if (!match) {
      return NextResponse.json(
        { error: "Match introuvable" },
        { status: 404 }
      );
    }

    // Vérifier que le match n'a pas déjà commencé
    if (match.status !== "SCHEDULED") {
      return NextResponse.json(
        { error: "Impossible de faire une prédiction pour ce match" },
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

    // Créer ou mettre à jour la prédiction
    const prediction = await prisma.prediction.upsert({
      where: {
        userId_groupId_matchId: {
          userId,
          groupId: parseInt(groupId),
          matchId: parseInt(matchId),
        },
      },
      update: {
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore),
      },
      create: {
        userId,
        groupId: parseInt(groupId),
        matchId: parseInt(matchId),
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
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
