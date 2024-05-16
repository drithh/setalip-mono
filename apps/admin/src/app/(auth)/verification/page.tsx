import Link from 'next/link';
import VerifyUserForm from './verify-user.form';
import { TYPES, container } from '@repo/shared/inversify';
import { UserRepository } from '@repo/shared/repository';
import { getAuth } from '@/lib/get-auth';
import { redirect } from 'next/navigation';
import { OtpService } from '@repo/shared/service';
import { Button } from '@repo/ui/components/ui/button';
import ResendOtpForm from './resend-otp.form';

export default async function UserVerification() {
  const auth = await getAuth();
  if (!auth) {
    redirect('/login');
  }

  return (
    <div className="w-full lg:grid lg:grid-cols-2 ">
      <div className="flex items-center justify-center h-screen">
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
      </div>
      <div className="hidden bg-muted lg:block"></div>
    </div>
  );
}
