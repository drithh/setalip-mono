import { logout } from '@/lib/auth';

export default async function Page() {
  await logout();

  return (
    <div>
      <h1>Logout</h1>
    </div>
  );
}
