import 'server-only';

import { headers } from 'next/headers';
import { cache } from 'react';

import { createTRPCContext, createCaller } from '@repo/shared/api';
import { validateRequest } from '@/lib/auth';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set('x-trpc-source', 'rsc');

  const auth = await validateRequest();

  const authSession =
    auth !== null && auth.session !== null
      ? {
          ...auth.session,
          user: auth.user,
        }
      : null;

  return createTRPCContext({
    headers: heads,
    session: authSession,
  });
});

export const api = createCaller(createContext);
