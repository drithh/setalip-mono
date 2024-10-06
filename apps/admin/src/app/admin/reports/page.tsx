import { FindAllAgendaBookingByMonthAndLocation } from '@repo/shared/repository';
import { TYPES, container } from '@repo/shared/inversify';
import { AgendaService, ClassTypeService } from '@repo/shared/service';
import { findAllAgendaBookingByMonthAndLocationSchema } from '@repo/shared/api/schema';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import Income from './_components/income';
import { Separator } from '@repo/ui/components/ui/separator';
import Expense from './_components/expense';
import FormWrapper from './_components/form-wrapper';

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

  const agendaService = container.get<AgendaService>(TYPES.AgendaService);

  const monthlyIncome =
    await agendaService.findAllAgendaBookingByMonthAndLocation(search);

  const coachAgenda =
    await agendaService.findAllCoachAgendaByMonthAndLocation(search);

  const reportForms = [
    {
      text: 'Income From Classes',
      expense: 0,
    },
    {
      text: 'Expense',
      expense: 0,
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="font-medium">Income From Classes:</p>
            <div className="ml-4">
              <Income income={monthlyIncome.result ?? []} />
            </div>
          </div>

          <FormWrapper
            expense={reportForms}
            coachAgenda={coachAgenda.result ?? []}
            classTypes={classTypes.result ?? []}
          />
        </CardContent>
      </Card>
    </main>
  );
}
