import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';

import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const requestCookies = await cookies();
  const accessToken = requestCookies.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    // Vérifier le token JWT
    const payload = await verifyToken(accessToken);

    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Récupérer l'utilisateur depuis Prisma
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}