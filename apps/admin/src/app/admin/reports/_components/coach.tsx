'use client';

// import { SelectAgendaBookingWithExpense } from '@repo/shared/repository';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@repo/ui/components/ui/table';
import { UseFormReturn } from 'react-hook-form';
import { ExpenseSchema } from './form-schema';
import { MoneyInput } from '@repo/ui/components/money-input';
import { Input } from '@repo/ui/components/ui/input';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { SelectClassType } from '@repo/shared/repository';
import { SelectCoachAgendaBooking } from '@repo/shared/service';

interface ExpenseProps {
  coachAgenda: SelectCoachAgendaBooking[];
  classTypes: SelectClassType[];
  form: UseFormReturn<ExpenseSchema>;
}

export default function Coach(data: ExpenseProps) {
  return (
    <Table className="table-fixed">
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
        {data.form.watch('coach').map((coach, index) => {
          const currentCoach = data.coachAgenda.find(
            (agenda) => agenda.coach_id === coach.id,
          );
          if (!currentCoach) {
            return null;
          }
          return (
            <TableRow key={index}>
              <TableCell>
                {currentCoach.coach_name}
                <FormField
                  control={data.form.control}
                  name={`coach.${index}.id`}
                  render={({ field }) => (
                    <FormItem className=" hidden w-full gap-2">
                      <FormControl>
                        <Input {...field} value={coach.id} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              {coach.classType.map((classType, indexClass) => {
                const agenda = data.coachAgenda.find(
                  (agenda) => agenda.coach_id === coach.id,
                );
                if (!agenda) {
                  return <TableCell key={classType.id}></TableCell>;
                }
                return (
                  <TableCell key={classType.id}>
                    <div className="flex items-center gap-4">
                      <span className="min-w-6 font-medium">
                        {agenda.agenda_count} x
                      </span>
                      <FormField
                        control={data.form.control}
                        name={`coach.${index}.classType.${indexClass}.id`}
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormControl>
                              <Input {...field} value={classType.id} />
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
                    {currentCoach.agenda_count} x
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
          );
        })}
      </TableBody>
    </Table>
  );
}
