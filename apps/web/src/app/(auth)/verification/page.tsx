import { redirect } from 'next/navigation';

import { validateUser } from '@/lib/auth';

import ResendOtpForm from './resend-otp.form';
import VerifyUserForm from './verify-user.form';

export default async function UserVerification() {
  const auth = await validateUser();
  if (auth.user.verifiedAt) {
    redirect('/');
  }
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Verifikasi Akun</h1>
        <p className="text-balance text-muted-foreground">
          Kode verifikasi telah dikirim ke whatsapp {auth?.user.phoneNumber}
        </p>
      </div>
      <VerifyUserForm userId={auth?.user.id ?? 0} />
      <ResendOtpForm userId={auth?.user.id ?? 0} />
    </div>
  );
}
