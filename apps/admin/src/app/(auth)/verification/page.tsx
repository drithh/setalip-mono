import VerifyUserForm from './verify-user.form';
import { getAuth } from '@/lib/get-auth';
import { redirect } from 'next/navigation';
import ResendOtpForm from './resend-otp.form';

export default async function UserVerification() {
  const auth = await getAuth();
  if (!auth) {
    redirect('/login');
  } else if (auth.verifiedAt) {
    redirect('/');
  }

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Verifikasi Akun</h1>
        <p className="text-balance text-muted-foreground">
          Kode verifikasi telah dikirim ke whatsapp {auth?.phoneNumber}
        </p>
      </div>
      <VerifyUserForm userId={auth?.id ?? 0} />
      <ResendOtpForm userId={auth?.id ?? 0} />
    </div>
  );
}
