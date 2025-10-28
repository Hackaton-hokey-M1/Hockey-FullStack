import bcrypt from "bcryptjs";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, pseudo, name } = body;

  // Accepte soit 'pseudo' soit 'name'
  const userName = pseudo || name;

  // Validation des données
  if (!email || !password || !userName) {
    return NextResponse.json(
      { error: "Email, password, and name (or pseudo) are required" },
      { status: 400 }
    );
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur dans la base de données
    const user = await prisma.user.create({
      data: {
        email: email,
        name: userName,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error.message
      },
      { status: 500 }
    );
  }
}
