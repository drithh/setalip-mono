import { Adapter, Lucia, TimeSpan } from 'lucia';

export const NewLucia = (adapter: Adapter, isSecure: boolean) =>
  new Lucia(adapter, {
    sessionCookie: {
      // this sets cookies with super long expiration
      // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
      expires: false,
      attributes: {
        // set to `true` when using HTTPS
        secure: isSecure,
      },
    },
    getSessionAttributes: (attributes) => {
      return {};
    },
    getUserAttributes: (attributes) => {
      return {
        email: attributes.email,
      };
    },
    sessionExpiresIn: new TimeSpan(2, 'w'), // 2 weeks
  });

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof NewLucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
    UserId: number;
  }
  interface DatabaseSessionAttributes {}
  interface DatabaseUserAttributes {
    email: string;
  }
}
