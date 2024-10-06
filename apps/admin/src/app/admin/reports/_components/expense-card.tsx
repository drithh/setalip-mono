'use client';

import {
  FindAllAgendaBookingByMonthAndLocation,
  SelectClassType,
  SelectLocation,
} from '@repo/shared/repository';


import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@repo/ui/components/ui/card';

import Income from './income';
import FormWrapper from './form-wrapper';
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
            <h2 className="text-xl font-medium">Date</h2>
            <MonthPicker onDateChange={(value) => setSelectedDate(value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => {}}>Export</Button>
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

        <FormWrapper
          reportForms={reportForms.data?.result ?? []}
          coachAgenda={coachAgenda.data?.result ?? []}
          classTypes={classTypes}
        />
      </CardContent>
    </Card>
  );
}
