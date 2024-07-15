import { logout } from '@/lib/auth';

import Router from './router';

export default async function Page() {
  await logout();

  return (
    <div>
      <Router />
    </div>
  );
}
