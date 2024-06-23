import { TYPES, container } from '@repo/shared/inversify';
import { UserRepository } from '@repo/shared/repository';
import { validateAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { api } from '@/trpc/server';
import { useQuery } from '@tanstack/react-query';

export default async function Home() {
  const auth = await validateAdmin();
  if (!auth) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen">
      {auth && (
        <p>
          {auth.session.id} {auth.user.email} {auth.user.role}{' '}
          {auth.user.phoneNumber}
        </p>
      )}
    </main>
  );
}
