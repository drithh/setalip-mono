'use client';

// import { SelectAgendaBookingWithExpense } from '@repo/shared/repository';
import { zodResolver } from '@hookform/resolvers/zod';
import { moneyFormatter } from '@repo/shared/util';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@repo/ui/components/ui/table';
import { useFormState } from 'react-dom';
import { useForm, UseFormReturn } from 'react-hook-form';
import { expense } from '../_actions/create-report';
import { ExpenseSchema, expenseSchema, FormExpense } from './form-schema';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Trash } from 'lucide-react';
import { MoneyInput } from '@repo/ui/components/money-input';
import { Input } from '@repo/ui/components/ui/input';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
} from '@repo/ui/components/ui/form';
import { toast } from 'sonner';
import {
  SelectClassType,
  SelectCoachAgendaBooking,
} from '@repo/shared/repository';
import { AddonInput } from '@repo/ui/components/addon-input';

interface ExpenseProps {
  coachAgenda: SelectCoachAgendaBooking[];
  classTypes: SelectClassType[];
  form: UseFormReturn<ExpenseSchema>;
}

export default function Coach(data: ExpenseProps) {
  const addEmptyExpense = () => {
    const expenses = data.form.getValues('expense');
    console.log(expenses);
    data.form.setValue(`expense`, [...expenses, { text: '', expense: 0 }]);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          {data.classTypes.map((classType) => (
            <TableHead className="text-center" key={classType.id}>
              {classType.type}
            </TableHead>
          ))}
          <TableHead className="text-center">Transport</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.coachAgenda.map((coach, index) => (
          <TableRow key={index}>
            <TableCell>
              {coach.coach_name}
              <FormField
                control={data.form.control}
                name={`coach.${index}.id`}
                render={({ field }) => (
                  <FormItem className=" hidden w-full gap-2">
                    <FormControl>
                      <Input {...field} value={coach.coach_id} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TableCell>
            {data.classTypes.map((classType, indexClass) => {
              const agenda = coach.agenda.find(
                (agenda) => agenda.class_type_id === classType.id,
              );
              if (!agenda) {
                return <TableCell key={classType.id}></TableCell>;
              }
              return (
                <TableCell key={classType.id}>
                  <div className="flex items-center gap-4">
                    <span className="min-w-6 font-medium">
                      {agenda.total} x
                    </span>
                    <FormField
                      control={data.form.control}
                      name={`coach.${index}.classType.${indexClass}.id`}
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input {...field} value={agenda.class_type_id} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={data.form.control}
                      name={`coach.${index}.classType.${indexClass}.total`}
                      render={({ field }) => (
                        <FormItem className="grid w-full gap-2">
                          <FormControl>
                            <MoneyInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TableCell>
              );
            })}
            <TableCell className="">
              <div className="flex items-center gap-4">
                <span className="min-w-6 font-medium">
                  {coach.agenda_count} x
                </span>
                <FormField
                  control={data.form.control}
                  name={`coach.${index}.transport`}
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormControl>
                        <MoneyInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
