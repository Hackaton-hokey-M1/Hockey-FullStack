import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { calculatePoints } from "@/lib/scoring";

/**
 * API pour mettre à jour les scores des prédictions et des membres d'un groupe
 * après la fin d'un match
 */
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

    // Récupérer les données du match
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

    // Récupérer le groupe pour obtenir les règles de scoring
    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Groupe introuvable" },
        { status: 404 }
      );
    }

    // Récupérer toutes les prédictions pour ce match dans ce groupe
    const predictions = await prisma.prediction.findMany({
      where: {
        groupId: parseInt(groupId),
        externalMatchId: matchId,
        points: null, // Seulement les prédictions pas encore scorées
      },
      include: {
        user: true,
      },
    });

    // Calculer les points pour chaque prédiction
    const updatedPredictions = [];
    const memberScoreUpdates: { [userId: string]: number } = {};

    for (const prediction of predictions) {
      const points = calculatePoints(
        prediction.homeScore,
        prediction.awayScore,
        parseInt(homeScore),
        parseInt(awayScore),
        group.pointsExactScore,
        group.pointsCorrectResult
      );

      // Mettre à jour la prédiction avec les points
      const updated = await prisma.prediction.update({
        where: { id: prediction.id },
        data: { points },
      });

      updatedPredictions.push(updated);

      // Accumuler les points pour chaque utilisateur
      if (!memberScoreUpdates[prediction.userId]) {
        memberScoreUpdates[prediction.userId] = 0;
      }
      memberScoreUpdates[prediction.userId] += points;
    }

    // Mettre à jour les scores des membres
    const memberUpdates = [];
    for (const [userId, pointsToAdd] of Object.entries(memberScoreUpdates)) {
      const updated = await prisma.groupMember.update({
        where: {
          userId_groupId: {
            userId,
            groupId: parseInt(groupId),
          },
        },
        data: {
          score: {
            increment: pointsToAdd,
          },
        },
      });
      memberUpdates.push(updated);
    }

    return NextResponse.json({
      message: "Scores mis à jour avec succès",
      predictionsUpdated: updatedPredictions.length,
      membersUpdated: memberUpdates.length,
      details: {
        predictions: updatedPredictions,
        members: memberUpdates,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des scores:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

