import { container, TYPES } from '@repo/shared/inversify';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { ClassService, ClassTypeService } from '@repo/shared/service';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import { ImageWithFallback } from '@/lib/image-with-fallback';
import { Clock, Crosshair, User2 } from 'lucide-react';
import Link from 'next/link';
import CreateClassForm from './create-class.form';
import { Badge } from '@repo/ui/components/ui/badge';

export default async function Classes() {
  const classService = container.get<ClassService>(TYPES.ClassService);

  const classes = await classService.findAllClassWithAsset({
    perPage: 100,
  });

  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );

  const classTypes = await classTypeService.findAll();

  return (
    <main className="flex flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6 ">
      {
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {classes.result?.data.map((singleClass) => (
            <Card key={singleClass?.id} className="sm:col-span-1">
              <CardHeader>
                <AspectRatio ratio={16 / 9}>
                  <ImageWithFallback
                    src={singleClass.asset || '/placeholder.svg'}
                    alt={singleClass.asset_name || 'placeholder'}
                    fill
                    className="rounded-lg object-cover"
                  />
                </AspectRatio>
              </CardHeader>
              <CardContent>
                <CardTitle>{singleClass.name}</CardTitle>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Crosshair className="h-5 w-5" />
                    <Badge>{singleClass.class_type}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <p>{singleClass.duration} minutes</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <User2 className="h-5 w-5" />
                    <p>{singleClass.slot} participants</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full place-content-between">
                  <Link href={`/admin/classes/${singleClass.id}`}>
                    <Button variant={'outline'}>Edit Kelas</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
          <Card className="flex min-h-[30rem] flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                Tambah Kelas
              </h3>
              <p className="text-sm text-muted-foreground">
                Tambahkan kelas baru atau cabang baru
              </p>
              <CreateClassForm classTypes={classTypes.result ?? []} />
            </div>
          </Card>
        </div>
      }
    </main>
  );
}
