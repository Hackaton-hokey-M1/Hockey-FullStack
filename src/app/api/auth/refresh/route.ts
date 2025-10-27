import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const cookies: Record<string, string> = cookieHeader
    ? cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, ...rest] = cookie.split('=');
      acc[name.trim()] = rest.join('=').trim();
      return acc;
    }, {} as Record<string, string>)
    : {};

  const refreshToken = cookies.refreshToken;

  if (!refreshToken) {
    return NextResponse.json({ error: "Pas de refresh token" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      return NextResponse.json({ error: "Refresh token invalide ou expiré" }, { status: 403 });
    }

    const newAccessToken = data.session?.access_token;

    if (!newAccessToken) {
      return NextResponse.json({ error: "Impossible de régénérer le token" }, { status: 500 });
    }

    const res = NextResponse.json({ message: "Token régénéré" });
    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors du rafraîchissement du token" }, { status: 500 });
  }
}