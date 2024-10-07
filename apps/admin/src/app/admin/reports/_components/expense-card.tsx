'use client';

import {
  FindAllAgendaBookingByMonthAndLocation,
  SelectClassType,
  SelectLocation,
} from '@repo/shared/repository';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '@repo/ui/components/ui/card';
import { openReportPDF } from '@repo/shared/pdf';
import Income from './income';
import { MonthPicker } from '@repo/ui/components/month-picker';
import { Button } from '@repo/ui/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@repo/ui/components/ui/select';
import { api } from '@/trpc/react';
import { Separator } from '@repo/ui/components/ui/separator';
import { useFormState } from 'react-dom';
import { Form } from '@repo/ui/components/ui/form';

import { useForm } from 'react-hook-form';
import Coach from './coach';
import { expense } from '../_actions/create-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ExpenseSchema, expenseSchema } from './form-schema';
import Expense from './expense';

export interface ExpenseCardProps {
  locations: SelectLocation[];
  classTypes: SelectClassType[];
  searchParams: FindAllAgendaBookingByMonthAndLocation;
}

export default function ExpenseCard({
  locations,
  classTypes,
  searchParams,
}: ExpenseCardProps) {
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.location_id ?? 1,
  );
  const [selectedDate, setSelectedDate] = useState(
    searchParams.date ?? new Date(),
  );

  const monthlyIncome =
    api.agenda.findAllAgendaBookingByMonthAndLocation.useQuery({
      location_id: selectedLocation,
      date: selectedDate,
    });

  const coachAgenda = api.agenda.findAllCoachAgendaByMonthAndLocation.useQuery({
    location_id: selectedLocation,
    date: selectedDate,
  });

  const reportForms = api.reportForm.findAll.useQuery();
  const defaultExpense = reportForms.data?.result?.map((reportForm) => ({
    text: reportForm.input ?? '',
    expense: 0,
  }));

  const [coachExpense, setCoachExpense] = useState(0);

  const [formState, formAction] = useFormState(expense, {
    status: 'default',
    form: {
      expense: [],
      coach: [],
    },
  });

  const form = useForm<ExpenseSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: formState.form,
  });

  useEffect(() => {
    form.setValue(
      'coach',
      coachAgenda.data?.result?.map((coach) => ({
        id: coach.coach_id,
        transport: 0,
        classType: classTypes.map((classType) => ({
          id: classType.id,
          total: 0,
        })),
      })) ?? [],
    );
  }, [coachAgenda.data?.result]);

  useEffect(() => {
    form.setValue(
      'expense',
      reportForms.data?.result?.map((reportForm) => ({
        text: reportForm.input ?? '',
        expense: 0,
      })) ?? [],
    );
  }, [reportForms.data?.result]);

  const coachForm = form.watch(
    coachAgenda.data?.result?.map(
      (coach, index) => `coach.${index}` as `coach.${number}`,
    ) ?? [],
  );

  useEffect(() => {
    const coachRate = form.getValues('coach');
    const coachTotal = coachRate.reduce((acc, coach) => {
      const currentCoach = coachAgenda?.data?.result?.find(
        (agenda) => agenda.coach_id === coach.id,
      );
      if (!currentCoach) return acc;
      // sum per classType * coachAgenda
      const classTypeTotal =
        currentCoach?.agenda.reduce((acc, agenda) => {
          const currentClassType = coach.classType.find(
            (classType) => classType.id === agenda.class_type_id,
          );

          return acc + agenda.total * (currentClassType?.total ?? 0);
        }, 0) ?? 0;
      const transportTotal =
        coach.transport * (currentCoach?.agenda_count ?? 0);

      return acc + transportTotal + classTypeTotal;
    }, 0);
    setCoachExpense(coachTotal);
  }, [coachForm]);

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.handleSubmit(() => {
      formAction(new FormData(formRef.current!));
    })(event);
  };

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="mb-4 flex w-full justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-medium">Location</h2>
            <Select
              onValueChange={(value) => setSelectedLocation(parseInt(value))}
              defaultValue={selectedLocation.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((singleClass) => (
                  <SelectItem
                    key={singleClass.id}
                    value={singleClass.id.toString()}
                  >
                    {singleClass.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-medium ">Date</h2>
            <MonthPicker onDateChange={(value) => setSelectedDate(value)} />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                const agendaIncome = monthlyIncome.data?.result?.map((item) => {
                  return {
                    name: item.class_type_name,
                    total: item.participant,
                    amount: item.income,
                  };
                });
                const coaches = form.getValues('coach');
                const outcomeCoach = coachAgenda.data?.result?.map((item) => {
                  const coach = coaches.find(
                    (coach) => coach.id === item.coach_id,
                  );
                  return {
                    name: item.coach_name,
                    transport: {
                      amount: item.agenda_count,
                      rate: coach?.transport ?? 0,
                    },
                    classType: item.agenda.map((agenda) => {
                      const coachRate = coach?.classType.find(
                        (classType) => classType.id === agenda.class_type_id,
                      );
                      return {
                        name: agenda.class_type_name,
                        rate: coachRate?.total ?? 0,
                        amount: agenda.total,
                      };
                    }),
                  };
                });
                const customOutcome = form.getValues('expense').map((item) => {
                  return {
                    name: item.text,
                    total: item.expense,
                  };
                });
                await openReportPDF({
                  report: {
                    locationName:
                      locations.find(
                        (location) => location.id === selectedLocation,
                      )?.name ?? '',
                    date: selectedDate,
                  },
                  income: {
                    agenda: agendaIncome ?? [],
                  },
                  outcome: {
                    coach: outcomeCoach ?? [],
                    custom: customOutcome,
                  },
                });
              }}
            >
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <p className="font-medium">Income From Classes:</p>
          <div className="ml-4">
            <Income income={monthlyIncome.data?.result ?? []} />
          </div>
        </div>

        <Form {...form}>
          <form
            className="grid gap-4"
            ref={formRef}
            action={formAction}
            onSubmit={onFormSubmit}
          >
            <Separator className="my-4" />
            <p className="font-medium">Expense:</p>
            <div className="ml-4">
              <Expense
                coachExpense={coachExpense}
                expense={defaultExpense ?? []}
                form={form}
              />
            </div>
            <Separator className="my-4" />
            <p className="font-medium">Coach:</p>
            <div className="ml-4">
              <Coach
                coachAgenda={coachAgenda?.data?.result ?? []}
                classTypes={classTypes}
                form={form}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
