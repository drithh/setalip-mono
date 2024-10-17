import { format } from 'date-fns';

import { validateAdmin, validateRequest } from '@/lib/auth';

import NavigationLink from './_components/navigation-link';
import { redirect } from 'next/navigation';
import Avatar from '../../_components/avatar';
import { getMenus } from './menu';
import { container, TYPES } from '@repo/shared/inversify';
import { UserService } from '@repo/shared/service';
import { userSchema } from './form-schema';

interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

export default async function Layout({
  children,
  params,
}: LayoutProps): Promise<React.ReactNode> {
  const auth = await validateAdmin();
  if (!auth) {
    redirect('/login');
  }

  if (!auth.user || !auth.session) {
    redirect('/login');
  }

  const parsedParams = userSchema.parse(params);

  const userService = container.get<UserService>(TYPES.UserService);
  const user = await userService.findById(parsedParams.userId);

  if (user.error || user.result === undefined) {
    redirect('/users');
  }

  return (
    <div className="mx-auto flex w-full max-w-[95vw] flex-row pb-12 pt-4 md:max-w-screen-xl md:pb-32 md:pt-16">
      <div className="relative hidden md:inline-block">
        <div className="sticky top-[89px] flex  w-64 flex-col gap-4 rounded-xl border-2 border-primary px-4 py-8 ">
          <div className="flex flex-col place-items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full">
              <Avatar
                user={{
                  id: user.result.id,
                  name: user.result.name,
                  email: user.result.email,
                  createdAt: user.result.created_at,
                  phoneNumber: user.result.phone_number,
                  locationId: user.result.location_id,
                  verifiedAt: user.result.verified_at,
                  role: user.result.role,
                }}
              />
            </div>
            <div className="flex flex-col place-items-center gap-2">
              <p className="text-center text-xl font-semibold">
                {user.result.name}
              </p>
              <p className="">
                Joined Since{' '}
                {format(new Date(user.result.created_at), 'MMM dd yyyy')}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 ">
            {getMenus(user.result.id).map((menu) => (
              <NavigationLink key={menu.path} path={menu.path}>
                <div className="flex place-items-center gap-2 px-2">
                  {menu.icon}
                  <span>{menu.label}</span>
                </div>
              </NavigationLink>
            ))}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
