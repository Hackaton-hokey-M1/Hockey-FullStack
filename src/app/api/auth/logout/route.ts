import { NextResponse } from "next/server";

export async function POST(request: Request) {

  const cookie = request.headers.get("cookie");
  const refreshToken = cookie?.split("refreshToken=")[1]?.split(";")[0];
  if (!refreshToken) {
    return NextResponse.json({ error: "Pas de refresh token" }, { status: 400 });
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
