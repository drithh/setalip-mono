import Link from 'next/link';
import VerifyUserForm from './verify-user-form';
import { TYPES, container } from '@repo/shared/inversify';
import { UserRepository } from '@repo/shared/repository';
import { getAuth } from '../get-auth';
import { redirect } from 'next/navigation';

export default async function UserVerification() {
  const auth = await getAuth();

  const userRepository = container.get<UserRepository>(TYPES.UserRepository);
  const user = await userRepository.findUserById(auth?.id ?? 0);

  return (
    <div className="w-full lg:grid lg:grid-cols-2 ">
      <div className="flex items-center justify-center h-screen">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Verifikasi Akun</h1>
            <p className="text-balance text-muted-foreground">
              Kode verifikasi telah dikirim ke
            </p>
          </div>
          <VerifyUserForm />
          <div className="mt-4 text-center text-sm">
            Sudah punya akun?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block"></div>
    </div>
  );
}
