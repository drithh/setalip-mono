import { container, TYPES } from '@repo/shared/inversify';
import {
  AgendaService,
  ClassService,
  PackageService,
} from '@repo/shared/service';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import { cn } from '@repo/ui/lib/utils';
import { addMinutes, format } from 'date-fns';
import { Building, CalendarClock, MapPin, User2 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { validateUser } from '@/lib/auth';

import CreateAgendaBooking from './create-agenda-booking.form';
import { BackButton } from '@repo/ui/components/back-button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@repo/ui/components/ui/breadcrumb';
export default async function AgendaDetail({
  params,
  searchParams,
}: {
  params: { agendaId: string };
  searchParams: { agenda_recurrence_id: string; time: string };
}) {
  const auth = await validateUser();

  const agendaIdNumber = parseInt(params.agendaId);
  const agendaRecurrenceId = parseInt(searchParams.agenda_recurrence_id);
  const time = new Date(searchParams.time);

  if (
    isNaN(agendaIdNumber) ||
    (agendaIdNumber === 0 && isNaN(agendaRecurrenceId) && isNaN(time.getTime()))
  ) {
    redirect('/schedules');
  }

  const agendaService = container.get<AgendaService>(TYPES.AgendaService);
  const singleAgenda = await agendaService.findScheduleById({
    id: agendaIdNumber,
    agendaRecurrenceId: agendaRecurrenceId,
    time: time,
  });

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

  const packageService = container.get<PackageService>(TYPES.PackageService);
  const singlePackage = await packageService.findUserPackageExpiringByUserId(
    auth.user.id,
    singleClass.result.class_type_id,
  );

  const textTime = `${format(singleAgenda.result.time, 'dd MMM yyyy')} at ${format(singleAgenda.result.time, 'HH:mm')} - ${format(
    addMinutes(singleAgenda.result.time, singleClass.result.duration),
    'HH:mm',
  )}`;

  return (
    <div>
      <div className="w-full">
        <section className="container w-full py-12 md:py-24 lg:py-32">
          <div className=" my-2 flex place-items-center gap-2">
            <BackButton />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/schedules" className="text-[1.05rem]">
                    Schedules
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
          <div className=" grid  gap-6  lg:grid-cols-[5fr_3fr] lg:gap-12">
            <div className="flex flex-col gap-4 ">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  {singleClass.result.name}
                </h1>
                <Badge
                  className="w-fit text-center capitalize"
                  color="secondary"
                  variant="default"
                >
                  {singleClass.result.class_type} Class
                </Badge>
                <p className="text-lg text-muted-foreground">
                  {singleClass.result.description}
                </p>
              </div>
              <h1
                className={cn(
                  `text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl`,
                  singlePackage.result ? '' : 'text-destructive',
                )}
              >
                {singlePackage.result ? 'Package Used' : 'No Package Used'}
              </h1>
              {singlePackage.result ? (
                <p className="text-lg text-muted-foreground">
                  You are using <span className="font-semibold">1 credit</span>{' '}
                  on{' '}
                  {singlePackage.result?.package_name !== null
                    ? `${singlePackage.result?.package_name} package`
                    : singlePackage.result.note}
                </p>
              ) : (
                <>
                  <p className="text-lg text-muted-foreground">
                    You don't have any package to use, please buy a package
                    first
                  </p>
                  <Link href="/packages" className="w-fit" passHref>
                    <Button className="w-full">Buy Package</Button>
                  </Link>
                </>
              )}

              {singlePackage.result && (
                <Card
                  key={singlePackage.result?.id}
                  className="w-fit sm:col-span-1"
                >
                  <CardHeader>
                    <CardTitle className="capitalize">
                      {singlePackage.result?.package_name ??
                        singlePackage.result?.note}
                    </CardTitle>
                    <CardDescription className="capitalize">
                      {singlePackage.result?.class_type}
                      <p className="text-xs opacity-70">
                        {singlePackage.result?.note}
                      </p>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="">
                    <p>
                      Sessions Remaining:{' '}
                      {(singlePackage.result?.credit ?? 0) -
                        (singlePackage.result?.credit_used ?? 0)}
                    </p>
                    <p>
                      Expired At:{' '}
                      {format(
                        singlePackage.result?.expired_at ?? new Date(),
                        'dd MMM yyyy',
                      )}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="row-span-2 flex  flex-col gap-2 space-y-4">
              <h1 className="mt-6 text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                Detail Agenda
              </h1>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Building className="h-6 w-6 flex-shrink-0 text-muted-foreground" />
                    <p className="max-w-[600px] text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                      {singleAgenda.result.location_name},{' '}
                      {singleAgenda.result.location_facility_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 flex-shrink-0 text-muted-foreground" />
                    <p className="max-w-[600px] text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                      {singleAgenda.result.location_address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarClock className="h-6 w-6 flex-shrink-0 text-muted-foreground" />
                    <p className="max-w-[600px] text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                      {textTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <User2 className="h-6 w-6 flex-shrink-0 text-muted-foreground" />
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
              <CreateAgendaBooking
                time={textTime}
                agenda={singleAgenda.result}
                class_name={singleClass.result.name}
                id={singleAgenda.result.id}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
