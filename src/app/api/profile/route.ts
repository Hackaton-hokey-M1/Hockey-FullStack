import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie");
  const token = cookie?.split("accessToken=")[1]?.split(";")[0];


  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    // Vérifier le token JWT
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 403 });
    }

    // Récupérer l'utilisateur depuis PostgreSQL
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profil accessible", user });
  } catch (err) {
    return NextResponse.json({ error: "Token invalide ou expiré " + err }, { status: 403 });
  }
}