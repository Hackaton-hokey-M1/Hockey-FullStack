import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const accessToken = data.session.access_token;
  const refreshToken = data.session.refresh_token;

  const res = NextResponse.json({ message: "Connexion réussie" }, { status: 200 });

  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60,
    path: "/",
  });

  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return res;
}