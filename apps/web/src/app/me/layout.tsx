import { cn } from '@repo/ui/lib/utils';
import Link from 'next/link';
import Avatar from '../_components/avatar';
import { validateUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import NavigationLink from './_components/navigation-link';
import { Button } from '@repo/ui/components/ui/button';
import {
  CalendarCheck,
  CreditCard,
  FileClock,
  HandHeart,
  LogOut,
  Sparkles,
  User2,
} from 'lucide-react';
import { dateFormatter } from '@repo/shared/util';
import { Users } from '@repo/shared/db';
import { menus } from '../menu';
import { format } from 'date-fns';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await validateUser();

  return (
    <div className="mx-auto flex w-full max-w-[90vw] flex-row pb-32 pt-16 md:max-w-screen-xl">
      <div className="relative hidden md:inline-block">
        <div className="sticky top-[89px] flex  w-64 flex-col gap-4 rounded-xl border-2 border-primary px-4 py-8 ">
          <div className="flex flex-col place-items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full">
              <Avatar user={auth.user} />
            </div>
            <div className="flex flex-col place-items-center gap-2">
              <p className="text-xl font-semibold">{auth.user.name}</p>
              <p className="">
                Joined Since{' '}
                {format(new Date(auth.user.createdAt), 'MMM dd yyyy')}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 ">
            {menus.map((menu) =>
              menu?.role === auth.user.role || menu.role === undefined ? (
                <NavigationLink key={menu.path} path={menu.path}>
                  <div className="flex place-items-center gap-2 px-2">
                    {menu.icon}
                    <span>{menu.label}</span>
                  </div>
                </NavigationLink>
              ) : null,
            )}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
