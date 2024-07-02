'use server';
import { lucia } from '@repo/shared/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { headers } from 'next/headers';

export const logout = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return;
  await lucia.invalidateSession(sessionId);
  redirect('/login');
};

export const validateRequest = cache(async () => {
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

  const headersList = headers();
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
  console.log('data', data);
  const { user } = data;
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    redirect('/login');
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
