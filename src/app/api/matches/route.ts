import { NextResponse } from "next/server";

const API_BASE_URL = "https://api-jsem.onrender.com";

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/matches`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Désactiver le cache pour avoir les données en temps réel
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des matchs:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les matchs" },
      { status: 500 }
    );
  }
}
