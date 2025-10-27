import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des équipes:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les équipes" },
      { status: 500 }
    );
  }
}
