import Link from 'next/link';

import ResetPasswordForm from './reset-password.form';

export default function ResetPassword({
  params,
}: {
  params: { token: string };
}) {
  return (
    <div className="mx-auto grid w-[350px] gap-6 py-8">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-balance text-muted-foreground">
          Masukkan password baru yang ingin anda gunakan
        </p>
      </div>
      <ResetPasswordForm token={params.token} />
      <div className="mt-4 text-center text-sm">
        Belum punya akun?{' '}
        <Link href="/register" className="underline">
          Register
        </Link>
      </div>
    </div>
  );
}
