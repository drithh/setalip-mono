import { container, TYPES } from '@repo/shared/inversify';
import { LocationService, UserService } from '@repo/shared/service';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';

import { validateUser } from '@/lib/auth';

import EditUserForm from './edit-user.form';

export default async function Page() {
  const auth = await validateUser();

  const userService = container.get<UserService>(TYPES.UserService);
  const user = await userService.findById(auth.user.id);

  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locations = await locationService.findAll();

  if (user.error) {
    redirect('/login');
  }

  return (
    <div className="w-full p-2 md:p-6">
      <div className="flex place-content-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <EditUserForm user={user.result} locations={locations.result ?? []} />
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Nama</Label>
          <Input readOnly value={user.result?.name ?? ''} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Lokasi</Label>
          <Input
            readOnly
            value={
              locations.result?.find(
                (location) => location.id === user.result?.location_id,
              )?.name
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input readOnly value={user.result?.email ?? ''} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Nomor Whatsapp</Label>
          <Input readOnly value={user.result?.phone_number ?? ''} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Alamat</Label>
          <Textarea readOnly value={user.result?.address ?? ''} />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="flex flex-col gap-2">Verified At</Label>
          <Input
            readOnly
            value={
              user.result?.verified_at
                ? format(user.result?.verified_at, 'dd MMM yyyy')
                : 'Not Verified'
            }
          />
        </div>
      </div>
    </div>
  );
}
