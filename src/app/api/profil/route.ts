import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 403 });

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });
    if (!user) return NextResponse.json({ error: "User non trouvé" }, { status: 404 });

    return NextResponse.json({ user });
}

export async function PUT(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload?.userId) return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 403 });

    const { name } = await req.json();
    if (!name || typeof name !== "string" || name.trim().length < 2) {
        return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
    }

    const updated = await prisma.user.update({
        where: { id: payload.userId },
        data: { name: name.trim() },
        select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({ user: updated });
}