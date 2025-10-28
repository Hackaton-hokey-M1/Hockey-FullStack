import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function GET() {
  const requestCookies = await cookies();
  const accessToken = requestCookies.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user }, { status: 200 });
}