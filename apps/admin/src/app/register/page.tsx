import Link from 'next/link';
import RegisterUserForm from './register-user-form';

export default function Login() {
  return (
    <div className="w-full lg:grid lg:grid-cols-2 ">
      <div className="flex items-center justify-center h-screen">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-balance text-muted-foreground">
              Masukkan informasi anda untuk mendaftar
            </p>
          </div>
          <RegisterUserForm />
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
