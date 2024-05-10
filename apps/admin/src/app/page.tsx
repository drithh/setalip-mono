import { TYPES, container } from '@repo/shared/inversify';
import { UserRepository } from '@repo/shared/repository';
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
