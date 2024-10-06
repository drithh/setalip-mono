'use client';

// import { SelectAgendaBookingWithExpense } from '@repo/shared/repository';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { expense } from '../_actions/create-report';
import { ExpenseSchema, expenseSchema, FormExpense } from './form-schema';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
} from '@repo/ui/components/ui/form';
import { toast } from 'sonner';
import Expense from './expense';
import {
  SelectClassType,
  SelectCoachAgendaBooking,
} from '@repo/shared/repository';
import Coach from './coach';
import { Separator } from '@repo/ui/components/ui/separator';

interface ExpenseProps {
  expense: ExpenseSchema['expense'];
  coachAgenda: SelectCoachAgendaBooking[];
  classTypes: SelectClassType[];
}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal memperbarui peserta',
  },
  loading: {
    title: 'Memperbarui peserta...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Peserta berhasil diperbarui',
  },
};

export default function FormWrapper(data: ExpenseProps) {
  const [coachExpense, setCoachExpense] = useState(0);

  const [formState, formAction] = useFormState(expense, {
    status: 'default',
    form: {
      expense: data.expense,
      coach: data.coachAgenda.map((coach) => ({
        id: coach.coach_id,
        transport: 0,
        classType: data.classTypes.map((classType) => ({
          id: classType.id,
          total: 0,
        })),
      })),
    },
  });

  const form = useForm<ExpenseSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: formState.form,
  });

  const coachForm = form.watch(
    data.coachAgenda.map(
      (coach, index) => `coach.${index}` as `coach.${number}`,
    ),
  );

  useEffect(() => {
    const coachRate = form.getValues('coach');
    const coachTotal = coachRate.reduce((acc, coach) => {
      const currentCoach = data.coachAgenda.find(
        (agenda) => agenda.coach_id === coach.id,
      );
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
      toast.loading(TOAST_MESSAGES.loading.title, {
        description: TOAST_MESSAGES.loading.description,
      });
      formAction(new FormData(formRef.current!));
    })(event);
  };

  const formRef = useRef<HTMLFormElement>(null);

  const addEmptyExpense = () => {
    const expenses = form.getValues('expense');
    console.log(expenses);
    form.setValue(`expense`, [...expenses, { text: '', expense: 0 }]);
  };
  return (
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
            expense={data.expense}
            form={form}
          />
        </div>
        <Separator className="my-4" />
        <p className="font-medium">Coach:</p>
        <div className="ml-4">
          <Coach
            coachAgenda={data.coachAgenda}
            classTypes={data.classTypes}
            form={form}
          />
        </div>
      </form>
    </Form>
  );
}
