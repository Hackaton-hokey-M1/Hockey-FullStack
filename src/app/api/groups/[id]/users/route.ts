import { NextRequest, NextResponse } from "next/server";

import { groupsService } from "@/services/groupsService";

// GET /groups/[id]/users - Récupérer les utilisateurs d'un groupe
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const groupId = parseInt(id, 10);

    if (isNaN(groupId)) {
      return NextResponse.json(
        { error: "ID de groupe invalide" },
        { status: 400 }
      );
    }

    const users = await groupsService.allUserInGroup(groupId);

    console.log("Users from DB:", users);
    console.log("Admin count:", users.filter((u) => u.role === "ADMIN").length);

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching group users:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs du groupe" },
      { status: 500 }
    );
  }
}
