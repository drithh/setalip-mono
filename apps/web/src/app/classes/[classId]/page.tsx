import { container, TYPES } from '@repo/shared/inversify';
import { ClassService } from '@repo/shared/service';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Carousel,
  CarouselIndicator,
  CarouselMainContainer,
  CarouselThumbsContainer,
  SliderMainItem,
} from '@repo/ui/components/ui/carousel';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ImageWithFallback } from '@/lib/image-with-fallback';
import { BackButton } from '@repo/ui/components/back-button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@repo/ui/components/ui/breadcrumb';
export default async function ClassDetail({
  params,
}: {
  params: { classId: string };
}) {
  const classService = container.get<ClassService>(TYPES.ClassService);
  const classIdNumber = parseInt(params.classId);
  if (isNaN(classIdNumber)) {
    redirect('/classes');
  }
  const singleClass =
    await classService.findDetailClassAssetAndLocation(classIdNumber);

  if (!singleClass.result) {
    redirect('/classes');
  }

  return (
    <div>
      <div className="w-full">
        <section className="container w-full py-12 md:py-24 lg:py-32">
          <div className=" my-2 flex place-items-center gap-2">
            <BackButton />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/classes" className="text-[1.05rem]">
                    Classes
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[1.05rem]">
                    {singleClass.result.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className=" grid gap-6 lg:grid-cols-2 lg:gap-12">
            <Carousel className="m-0 w-full">
              <div className="relative w-full overflow-hidden rounded-xl">
                <CarouselMainContainer className="">
                  {singleClass.result.asset?.map((src, index) => (
                    <SliderMainItem
                      key={index}
                      className="relative h-full  w-full bg-transparent p-0"
                    >
                      <AspectRatio ratio={16 / 12}>
                        <ImageWithFallback
                          fill
                          className="absolute object-cover"
                          alt={src.name}
                          src={src.url}
                        />
                      </AspectRatio>
                    </SliderMainItem>
                  ))}
                </CarouselMainContainer>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                  <CarouselThumbsContainer className="gap-x-1 ">
                    {singleClass.result.asset?.map((_, index) => (
                      <CarouselIndicator key={index} index={index} />
                    ))}
                  </CarouselThumbsContainer>
                </div>
              </div>
            </Carousel>
            <div className="flex flex-col  space-y-4">
              <div className="space-y-2">
                <Badge
                  className="text-center capitalize"
                  color="secondary"
                  variant="default"
                >
                  {singleClass.result.class_type}
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  {singleClass.result.name}
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Duration: {singleClass.result.duration} minutes
                </p>
              </div>
              <div className="flex flex-col">
                <p className="max-w-[600px] text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                  {singleClass.result.description}
                </p>
                <p className="max-w-[600px] text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                  Participants: {singleClass.result.slot}
                </p>
              </div>
              <Link href={`/schedules?class_name=${singleClass.result.id}`}>
                <Button className="w-full max-w-[200px]">Book Now</Button>
              </Link>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Available Locations:</h3>
                <ul className="list-disc space-y-1 pl-6">
                  {singleClass.result.locations?.map((location) => (
                    <li key={location.name}>{location.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
