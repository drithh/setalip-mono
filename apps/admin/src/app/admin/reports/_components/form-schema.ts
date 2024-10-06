import { FormState } from '@repo/shared/form';
import { InsertAgendaRecurrence } from '@repo/shared/repository';
import { ZodType, z } from 'zod';
import { expense } from '../_actions/create-report';

export const expenseSchema = z.object({
  expense: z.array(
    z.object({
      text: z.string(),
      expense: z.coerce.number(),
    }),
  ),
  coach: z.array(
    z.object({
      id: z.coerce.number(),
      transport: z.coerce.number(),
      classType: z.array(
        z.object({
          id: z.coerce.number(),
          total: z.coerce.number(),
        }),
      ),
    }),
  ),
});

export type ExpenseSchema = z.infer<typeof expenseSchema>;
export type FormExpense = FormState<ExpenseSchema>;
