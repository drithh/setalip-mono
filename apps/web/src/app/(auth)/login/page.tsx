import Link from 'next/link';

import LoginUserForm from './login-user.form';

export default function Login() {
  return (
    <div className="mx-auto grid w-[360px] gap-6 py-8">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Masukkan informasi anda untuk login
        </p>
      </div>
      <LoginUserForm />
      <div className="text-center text-sm">
        Belum punya akun?{' '}
        <Link href="/register" className="underline">
          Register
        </Link>
      </div>
    </div>
  );
}
