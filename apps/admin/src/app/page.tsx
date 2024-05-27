import { TYPES, container } from '@repo/shared/inversify';
import { UserRepository } from '@repo/shared/repository';
import { getAuth } from '@/lib/get-auth';
import { redirect } from 'next/navigation';
import { api } from '@/trpc/server';
import { useQuery } from '@tanstack/react-query';

export default async function Home() {
  const auth = await getAuth();
  if (!auth) {
    redirect('/login');
  }

  const userRepo = container.get<UserRepository>(TYPES.UserRepository);
  const users = await userRepo.findAll();
  return (
    <main className="min-h-screen">
      {auth && (
        <p>
          {auth.id} {auth.email} {auth.role} {auth.phoneNumber}
        </p>
      )}
      {users.map((user) => (
        <div key={user.id}>
          <p>{user.email}</p>
        </div>
      ))}
    </main>
  );
}
