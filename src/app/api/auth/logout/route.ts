import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {

  const cookie = request.headers.get("cookie");
  const refreshToken = cookie?.split("refreshToken=")[1]?.split(";")[0];
  if (refreshToken) {
    await supabase.auth.signOut();
  }

  const res = NextResponse.json({ message: "Déconnexion réussie" });
  
  res.cookies.set("accessToken", "", {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.cookies.set("refreshToken", "", {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res;
}
