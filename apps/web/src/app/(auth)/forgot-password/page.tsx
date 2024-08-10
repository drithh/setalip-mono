import Link from 'next/link';

import ForgotPasswordForm from './forgot-password.form';

export default function ForgotPassword() {
  return (
    <div className="mx-auto grid w-[350px] gap-6 py-8">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Lupa Password</h1>
        <p className="text-balance text-muted-foreground">
          Masukkan nomor whatsapp anda untuk reset password
        </p>
      </div>
      <ForgotPasswordForm />
      <div className="mt-4 text-center text-sm">
        Belum punya akun?{' '}
        <Link href="/register" className="underline">
          Register
        </Link>
      </div>
    </div>
  );
}
