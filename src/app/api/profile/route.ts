import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie");
  const token = cookie?.split("accessToken=")[1]?.split(";")[0];

  
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { data: user, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 403 });
    }

    return NextResponse.json({ message: "Profil accessible", user });
  } catch (err) {
    return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 403 });
  }
}