import { FindAllAgendaBookingByMonthAndLocation } from '@repo/shared/repository';
import { TYPES, container } from '@repo/shared/inversify';
import {
  AgendaService,
  ClassTypeService,
  LocationService,
} from '@repo/shared/service';
import { findAllAgendaBookingByMonthAndLocationSchema } from '@repo/shared/api/schema';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import ExpenseCard from './_components/expense-card';

export interface IndexPageProps {
  searchParams: FindAllAgendaBookingByMonthAndLocation;
}

export default async function Reports({ searchParams }: IndexPageProps) {
  const search =
    findAllAgendaBookingByMonthAndLocationSchema.parse(searchParams);

  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );

  const classTypes = await classTypeService.findAll();

  const locationService = container.get<LocationService>(TYPES.LocationService);

  const locations = await locationService.findAll();

  return (
    <main className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
      <ExpenseCard
        locations={locations.result ?? []}
        classTypes={classTypes.result ?? []}
        searchParams={searchParams}
      />
    </main>
  );
}
