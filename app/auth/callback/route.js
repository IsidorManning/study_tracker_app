/**
 * auth/callback/route.js
 * This is a Next.js API route that handles the email verification callback from Supabase.
 * When a user clicks the verification link in their email, they are redirected here.
 * 
 * The flow:
 * 1. User clicks verification link in email
 * 2. Link contains a 'code' parameter
 * 3. This route receives the code
 * 4. Exchanges the code for a session using Supabase
 * 5. Sets up necessary cookies for authentication
 * 6. Redirects user to the dashboard
 * 
 * This route is essential for completing the email verification process
 * and establishing a proper authentication session.
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', request.url));
}