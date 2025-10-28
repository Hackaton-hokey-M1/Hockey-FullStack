import { NextRequest, NextResponse } from 'next/server';

import { createAccessToken, verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Pas de refresh token" }, { status: 401 });
  }

  try {
    // Vérifier le refresh token
    const payload = await verifyToken(refreshToken);

    if (!payload) {
      return NextResponse.json({ error: "Refresh token invalide ou expiré" }, { status: 403 });
    }

    // Créer un nouveau access token
    const newAccessToken = await createAccessToken(payload.userId);

    const res = NextResponse.json({ message: "Token régénéré" });
    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors du rafraîchissement du token " + err }, { status: 500 });
  }
}