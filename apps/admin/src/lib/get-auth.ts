'use server';
import { lucia } from '@repo/shared/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { headers } from 'next/headers';

export const getAuth = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return null;
  const { user, session } = await lucia.validateSession(sessionId);

  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }
  const headersList = headers();
  const pathname = headersList.get('x-path');
  if (
    user &&
    user.verifiedAt === null &&
    !pathname?.includes('/verification')
  ) {
    redirect('/verification');
  }
  return user;
});
