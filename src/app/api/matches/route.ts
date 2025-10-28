import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET() {
  try {
    // Vérifier que l'URL de l'API est configurée
    if (!API_BASE_URL) {
      console.error(
        "API_BASE_URL n'est pas définie dans les variables d'environnement"
      );
      return NextResponse.json(
        {
          error: "Configuration manquante",
          details:
            "API_BASE_URL n'est pas définie. Veuillez créer un fichier .env.local basé sur .env.example",
        },
        { status: 500 }
      );
    }

    const url = `${API_BASE_URL}/matches`;
    console.log(`Tentative de connexion à: ${url}`);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Désactiver le cache pour avoir les données en temps réel
    });

    if (!response.ok) {
      console.error(
        `Erreur API: ${response.status} ${response.statusText} pour ${url}`
      );
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des matchs:", error);
    return NextResponse.json(
      {
        error: "Impossible de récupérer les matchs",
        details: error instanceof Error ? error.message : "Erreur inconnue",
        apiUrl: API_BASE_URL,
      },
      { status: 500 }
    );
  }
}
