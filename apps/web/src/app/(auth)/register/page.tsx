import Link from 'next/link';
import RegisterUserForm from './register-user.form';
import { container, TYPES } from '@repo/shared/inversify';
import { LocationService } from '@repo/shared/service';

export default async function Register() {
  const locationService = container.get<LocationService>(TYPES.LocationService);

  const locations = await locationService.findAll();

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Register</h1>
        <p className="text-balance text-muted-foreground">
          Masukkan informasi anda untuk mendaftar
        </p>
      </div>
      <RegisterUserForm locations={locations.result ?? []} />
      <div className="mt-4 text-center text-sm">
        Sudah punya akun?{' '}
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </div>
  );
}
