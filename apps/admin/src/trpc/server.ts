import 'server-only';

import { headers } from 'next/headers';
import { cache } from 'react';

import { createTRPCContext, createCaller } from '@repo/shared/api';
import { uncachedValidateRequest } from '@/lib/validate-request';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set('x-trpc-source', 'rsc');

  const session = await uncachedValidateRequest();

  const authSession =
    session.session !== null
      ? {
          ...session.session,
          user: session.user,
        }
      : null;

  return createTRPCContext({
    headers: heads,
    session: authSession,
  });
});

export const api = createCaller(createContext);
