import { container, TYPES } from '@repo/shared/inversify';
import { LocationService, UserService } from '@repo/shared/service';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';

import { validateAdmin } from '@/lib/auth';

import EditUserForm from './edit-user.form';
import Link from 'next/link';
import { Button } from '@repo/ui/components/ui/button';
import { getUser } from './_lib/get-user';

export default async function Page(props: { params: Promise<any> }) {
  const params = await props.params;
  const auth = await validateAdmin();
  if (!auth) {
    redirect('/login');
  }

  const user = await getUser(params);

  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locations = await locationService.findAll();

  return (
    <div className="w-full p-2 md:p-6">
      <div className="flex place-content-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <EditUserForm user={user} locations={locations.result ?? []} />
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Nama</Label>
          <Input readOnly value={user?.name ?? ''} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Lokasi</Label>
          <Input
            readOnly
            value={
              locations.result?.find(
                (location) => location.id === user?.location_id,
              )?.name
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input readOnly value={user?.email ?? ''} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Nomor Whatsapp</Label>
          <Input readOnly value={user?.phone_number ?? ''} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Alamat</Label>
          <Textarea readOnly value={user?.address ?? ''} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex place-content-between place-items-center">
            <Label className="flex flex-col gap-2">Verified At</Label>
            {user?.verified_at === null && (
              <Link href={'/verification'}>
                <Button variant={'link'}>Verifikasi User</Button>
              </Link>
            )}
          </div>
          <Input
            readOnly
            value={
              user?.verified_at
                ? format(user?.verified_at, 'dd MMM yyyy')
                : 'Not Verified'
            }
          />
        </div>
      </div>
    </div>
  );
}
