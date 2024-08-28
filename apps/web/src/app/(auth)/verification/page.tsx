import { redirect } from 'next/navigation';

import { validateUser } from '@/lib/auth';

import ResendOtpForm from './resend-otp.form';
import VerifyUserForm from './verify-user.form';
import Link from 'next/link';
import { Button } from '@repo/ui/components/ui/button';

export default async function UserVerification() {
  const auth = await validateUser();
  if (auth.user.verifiedAt) {
    redirect('/');
  }
  return (
    <div className="mx-auto grid w-[360px] gap-6 py-8">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Verifikasi Akun</h1>
        <p className="text-balance text-muted-foreground">
          Kode verifikasi telah dikirim ke whatsapp {auth?.user.phoneNumber}
        </p>
      </div>
      <VerifyUserForm userId={auth?.user.id ?? 0} />
      <ResendOtpForm userId={auth?.user.id ?? 0} />
      <div className="text-center text-sm">
        Ganti Nomor Whatsapp?
        <Link href={'/me'}>
          <Button className="p-1" variant={'link'}>
            Buka Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
