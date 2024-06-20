'use client';
import { ImageWithFallback } from '@/lib/image-with-fallback';
import { SelectClassWithAsset } from '@repo/shared/repository';
import { moneyFormatter } from '@repo/shared/util';
import { Button } from '@repo/ui/components/ui/button';
import { Separator } from '@repo/ui/components/ui/separator';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import { Clock } from 'lucide-react';
import { Badge } from '@repo/ui/components/ui/badge';
import Link from 'next/link';
interface Class {
  singleClass: SelectClassWithAsset;
}

export default function Class({ singleClass }: Class) {
  return (
    <div className="flex flex-col rounded-xl border ">
      <div>
        <AspectRatio ratio={16 / 12}>
          <ImageWithFallback
            src={singleClass.asset}
            alt={singleClass.asset_name}
            fill
            className="rounded-lg object-cover"
          />
        </AspectRatio>
      </div>
      <div className="mb-12 flex h-32 flex-col place-content-between px-4 py-4">
        <div className="flex flex-col gap-2">
          <div className="flex w-full place-content-between">
            <h1 className="text-xl font-semibold uppercase text-secondary-foreground">
              {singleClass.name}
            </h1>
            <Badge variant="default" color="secondary" className="h-6 w-28">
              <p className="w-full text-center">
                {singleClass.duration} minutes
              </p>
            </Badge>
          </div>
          <p className="text-lg font-semibold capitalize">
            {singleClass.class_type} class
          </p>
        </div>
      </div>
      <div className="px-4 py-2">
        <Link href={`/classes/${singleClass.id}`}>
          <Button variant={'outline'} className="w-full">
            See Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
