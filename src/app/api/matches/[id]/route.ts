import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://api-jsem.onrender.com";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
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
    console.error("Erreur lors de la récupération du match:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer le match" },
      { status: 500 }
    );
  }
}
