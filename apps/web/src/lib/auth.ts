'use server';
import { lucia } from '@repo/shared/auth';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export const logout = async () => {
  const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return;
  await lucia.invalidateSession(sessionId);
};

export const validateRequest = cache(async () => {
  const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return null;
  const { user, session } = await lucia.validateSession(sessionId);

  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {
    return null;
    // Next.js throws error when attempting to set cookies when rendering page
  }
  return { user, session };
});

export const validateUser = cache(async () => {
  const data = await validateRequest();
  if (!data) {
    redirect('/login');
  }

  const { user, session } = data;
  if (!user || !session) {
    redirect('/login');
  }

  const headersList = await headers();
  const pathname = headersList.get('x-path');
  if (
    user &&
    user.verifiedAt === null &&
    !pathname?.includes('/verification')
  ) {
    redirect('/verification');
  }
  return { user, session };
});

export const validateAdmin = cache(async () => {
  const data = await validateUser();
  const { user } = data;
  if (!user || user.role !== 'admin') {
    redirect('/');
  }
  return data;
});

export const validateCoach = cache(async () => {
  const data = await validateUser();

  const { user } = data;
  if (!user || user.role !== 'coach') {
    redirect('/');
  }
  return data;
});
