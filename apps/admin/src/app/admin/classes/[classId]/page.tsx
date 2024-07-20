'use server';

import { container, TYPES } from '@repo/shared/inversify';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { ClassService, ClassTypeService } from '@repo/shared/service';
import { ChevronLeft } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Label } from '@repo/ui/components/ui/label';
import { Input } from '@repo/ui/components/ui/input';
import 'react-photo-view/dist/react-photo-view.css';

import UploadClassAsset from './upload-class-asset.form';
import { validateAdmin } from '@/lib/auth';
import EditDetailClassForm from './edit-detail-class.form';
import { BackButton } from '@repo/ui/components/back-button';
import { AddonInput } from '@repo/ui/components/addon-input';
import DeleteClass from './delete-location.dialog';
import ClassAssets from './_components/class-assets';

export default async function ClassDetail({
  params,
}: {
  params: { classId: string };
}) {
  const auth = await validateAdmin();

  const classService = container.get<ClassService>(TYPES.ClassService);
  const classIdNumber = parseInt(params.classId);
  if (isNaN(classIdNumber)) {
    redirect('/classs');
  }
  const singleClass =
    await classService.findDetailClassAssetAndLocation(classIdNumber);

  if (!singleClass.result) {
    redirect('/classs');
  }

  const classTypeService = await container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );
  const classTypes = await classTypeService.findAll();

  return (
    <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
      <div className="flex place-items-center gap-4">
        <BackButton />
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {singleClass.result?.name}
        </h1>
        <div className="ml-auto flex gap-4">
          <DeleteClass singleClass={singleClass.result} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_390px] lg:gap-8 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8 xl:col-span-2">
          <Card>
            <CardHeader className="flex flex-row place-content-between place-items-center">
              <CardTitle>Detail Lokasi</CardTitle>
              <EditDetailClassForm
                singleClass={singleClass.result}
                classTypes={classTypes.result || []}
              />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    readOnly
                    type="text"
                    className="w-full"
                    value={singleClass.result?.name}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    readOnly
                    className="w-full"
                    value={singleClass.result?.description}
                  />
                </div>
                <div className="grid gap-3">
                  <Label>Telepon</Label>
                  <Input
                    readOnly
                    type="text"
                    className="w-full"
                    value={
                      classTypes.result?.find(
                        (classType) =>
                          classType.id === singleClass.result?.class_type_id,
                      )?.type || ''
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label>Slot</Label>
                  <AddonInput
                    type="number"
                    readOnly
                    min={0}
                    max={100}
                    value={singleClass.result?.slot}
                    endAdornment="Orang"
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Durasi</Label>
                  <AddonInput
                    type="number"
                    readOnly
                    min={0}
                    max={100}
                    value={singleClass.result?.duration}
                    endAdornment="Menit"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Foto Lokasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <ClassAssets assets={singleClass.result?.asset} />
                <UploadClassAsset classId={classIdNumber} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
