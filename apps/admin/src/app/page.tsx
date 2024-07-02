import { validateAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const auth = await validateAdmin();
  if (auth) {
    redirect('/admin');
  }
}
