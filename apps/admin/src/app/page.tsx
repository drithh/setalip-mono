import { getUser } from './get-user';

export default async function Home() {
  const user = await getUser();
  console.log(user?.email);
  return <main className="min-h-screen">{user?.id}</main>;
}
