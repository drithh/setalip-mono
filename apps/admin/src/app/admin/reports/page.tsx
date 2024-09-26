import { FindAllAgendaBookingByMonthAndLocation } from '@repo/shared/repository';
import { DataTableSkeleton } from '@repo/ui/components/data-table/skeleton';
import { TYPES, container } from '@repo/shared/inversify';
import {
  PackageService,
  UserService,
  AgendaService,
} from '@repo/shared/service';
import { findAllAgendaBookingByMonthAndLocationSchema } from '@repo/shared/api/schema';
import QueryResetBoundary from '@/lib/query-reset-boundary';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@repo/ui/components/ui/table';
import Income from './_components/income';

export interface IndexPageProps {
  searchParams: FindAllAgendaBookingByMonthAndLocation;
}

export default async function Reports({ searchParams }: IndexPageProps) {
  const search =
    findAllAgendaBookingByMonthAndLocationSchema.parse(searchParams);
  const agendaService = container.get<AgendaService>(TYPES.AgendaService);

  const monthlyIncome =
    await agendaService.findAllAgendaBookingByMonthAndLocation(search);

  // const coachAgenda =
  //   await agendaService.findAllCoachAgendaByMonthAndLocation(search);

  return (
    <main className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Income income={monthlyIncome.result ?? []} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
