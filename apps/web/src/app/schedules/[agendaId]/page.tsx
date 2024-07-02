import { container, TYPES } from '@repo/shared/inversify';
import { AgendaService, ClassService } from '@repo/shared/service';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Carousel,
  CarouselMainContainer,
  SliderMainItem,
  CarouselThumbsContainer,
  CarouselIndicator,
} from '@repo/ui/components/ui/carousel';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import Link from 'next/link';
import { ImageWithFallback } from '@/lib/image-with-fallback';
import { Card, CardHeader, CardContent } from '@repo/ui/components/ui/card';
import { Separator } from '@repo/ui/components/ui/separator';
import { MapPin, Mail, Phone, User2, CalendarClock, Clock } from 'lucide-react';
import { addMinutes, format } from 'date-fns';
export default async function AgendaDetail({
  params,
}: {
  params: { agendaId: string };
}) {
  const agendaIdNumber = parseInt(params.agendaId);
  if (isNaN(agendaIdNumber)) {
    redirect('/schedules');
  }
  const agendaService = container.get<AgendaService>(TYPES.AgendaService);
  const singleAgenda = await agendaService.findScheduleById(agendaIdNumber);

  if (!singleAgenda.result) {
    redirect('/schedules');
  }

  const classService = container.get<ClassService>(TYPES.ClassService);
  const singleClass = await classService.findDetailClassAssetAndLocation(
    singleAgenda.result.class_id,
  );
  if (!singleClass.result) {
    redirect('/schedules');
  }

  return (
    <div>
      <div className="w-full">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid  gap-6 px-4 md:px-6  lg:grid-cols-[5fr_3fr] lg:gap-12">
            <div className="flex flex-col gap-4">
              <Carousel className="m-0 w-full">
                <div className="relative w-full overflow-hidden rounded-xl">
                  <CarouselMainContainer className="">
                    {singleClass.result.asset?.map((src, index) => (
                      <SliderMainItem
                        key={index}
                        className="relative h-full w-full bg-transparent p-0"
                      >
                        <AspectRatio ratio={16 / 12}>
                          <Image
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
            </div>
            <div className="row-span-2 flex  flex-col gap-2 space-y-4">
              <div className="flex flex-col gap-4 space-y-2">
                <div className="">
                  <Badge
                    className="mb-2 text-center capitalize"
                    color="secondary"
                    variant="default"
                  >
                    {singleClass.result.class_type}
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    {singleClass.result.name}
                  </h1>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-muted-foreground" />
                    <p className="max-w-[600px] text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                      {singleAgenda.result.location_address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarClock className="h-6 w-6 text-muted-foreground" />
                    <p className="max-w-[600px] text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                      {format(singleAgenda.result.time, 'dd MMM yyyy')} at{' '}
                      {format(singleAgenda.result.time, 'HH:mm')} -
                      {format(
                        addMinutes(
                          singleAgenda.result.time,
                          singleClass.result.duration,
                        ),
                        'HH:mm',
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <User2 className="h-6 w-6 text-muted-foreground" />
                    <p className="max-w-[600px] text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                      {singleAgenda.result.coach_name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Location on Map:</h3>
                <iframe
                  src={singleAgenda.result.location_link_maps}
                  className="h-[20rem] w-full rounded-xl border p-1"
                  loading="lazy"
                ></iframe>
              </div>
              <Link href={`/schedules/${singleAgenda.result.id}/book`} passHref>
                <Button className="w-full">Book Now</Button>
              </Link>
            </div>

            <div className=" flex flex-col gap-2">
              <Separator className="my-2" />
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Facilities
              </h1>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* {singleLocation.result.facilities?.map((facility, index) => (
                  <Card
                    key={index}
                    className="flex flex-col place-content-between"
                  >
                    <CardHeader className="p-3">
                      <AspectRatio ratio={4 / 3}>
                        <ImageWithFallback
                          src={facility.image_url || 'placeholder.svg'}
                          alt={facility.name}
                          fill
                          className="w-32 rounded-lg object-cover"
                        />
                      </AspectRatio>
                      <h3 className="text-lg font-medium">{facility.name}</h3>
                    </CardHeader>
                    <CardContent className="flex flex-col p-3">
                      <div className="flex place-items-center gap-2 text-muted-foreground">
                        <User2 className="h-5 w-5" />
                        <p className="md:text-lg">
                          Capacity: {facility.capacity} people
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))} */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
