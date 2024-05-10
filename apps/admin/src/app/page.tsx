import { container } from '@repo/shared/inversify/container.ts';
import { TYPES } from '@repo/shared/inversify/types.ts';
import { UserRepository } from '@repo/shared/repository/user.ts';
import { getUser } from './get-user';

export default async function Home() {
  const userRepo = container.get<UserRepository>(TYPES.UserRepository);

  // const user = await getUser();
  const users = await userRepo.GetUsers();
  console.log(users);
  return (
    <main className="min-h-screen">
      {users.map((user) => (
        <div key={user.id}>
          <p>{user.email}</p>
        </div>
      ))}
    </main>
  );
}
