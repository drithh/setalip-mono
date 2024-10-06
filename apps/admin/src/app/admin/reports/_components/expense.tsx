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

interface ExpenseProps {
  coachExpense: number;
  expense: ExpenseSchema['expense'];
  form: UseFormReturn<ExpenseSchema>;
}

export default function Expense(data: ExpenseProps) {
  console.log(data.form.getValues('expense'));
  const addEmptyExpense = () => {
    const expenses = data.form.getValues('expense');
    data.form.setValue(`expense`, [...expenses, { text: '', expense: 0 }]);
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="w-72"></TableHead>
          <TableHead className="w-72">Expense</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Coach Expense</TableCell>
          <TableCell></TableCell>
          <TableCell>
            <p className="pl-3">{moneyFormatter.format(data.coachExpense)}</p>
          </TableCell>
        </TableRow>

        {data.form.watch('expense').map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <FormField
                control={data.form.control}
                name={`expense.${index}.text`}
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              <div className="flex gap-2">
                <FormField
                  control={data.form.control}
                  name={`expense.${index}.expense`}
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormControl>
                        <MoneyInput className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button size={'icon'}>
                  <Trash />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell>
            <Button onClick={addEmptyExpense}>Add Expense</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
