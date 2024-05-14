import { TYPES, container } from '@repo/shared/inversify';
import { UserRepository } from '@repo/shared/repository';
import { getAuth } from './get-auth';
import 'reflect-metadata';

export default async function Home() {
  const auth = await getAuth();
  if (!auth) {
    return <div>Not authenticated</div>;
  }

  const userRepo = container.get<UserRepository>(TYPES.UserRepository);
  const users = await userRepo.getUsers();
  return (
    <main className="min-h-screen">
      {auth && (
        <p>
          {auth.id} {auth.email}
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
