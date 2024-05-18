import Link from 'next/link';
import LoginUserForm from './login-user.form';
import { getAuth } from '@/lib/get-auth';
import { redirect } from 'next/navigation';

export default async function Login() {
  const auth = await getAuth();
  if (auth) {
    redirect('/');
  }

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Masukkan informasi anda untuk login
        </p>
      </div>
      <LoginUserForm />
      <div className="mt-4 text-center text-sm">
        Belum punya akun?{' '}
        <Link href="/register" className="underline">
          Register
        </Link>
      </div>
    </div>
  );
}
