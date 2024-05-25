import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter, createTRPCContext } from '@repo/shared/api';
import { lucia } from '@repo/shared/auth';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (res: Response) => {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Request-Method', '*');
  res.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.headers.set('Access-Control-Allow-Headers', '*');
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

const handler = async (req: NextRequest) => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return null;
  const { user, session } = await lucia.validateSession(sessionId);
  const authSession = user ? { ...session, user } : null;
  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () =>
      createTRPCContext({
        session: authSession,
        headers: req.headers,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });
  setCorsHeaders(response);
  return response;
};

export { handler as GET, handler as POST };
