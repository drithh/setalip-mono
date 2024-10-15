'use client';

import { AgendaBookings } from '@repo/shared/db';
import { Button } from '@repo/ui/components/ui/button';
import { useState } from 'react';

import { useUpdateMutation } from './_functions/update-status';
import { AgendaWithParticipant } from '@repo/shared/service';

interface StatusProps {
  data: AgendaWithParticipant;
  statuses: AgendaBookings['status'][];
}

const formatText = (text: string) => {
  return text.replace('_', ' ');
};

export default function Status({ data, statuses }: StatusProps) {
  const [status, setStatus] = useState(data.agenda_booking_status);
  const index = statuses.indexOf(status);

  const updateStatus = useUpdateMutation();

  const onClick = async () => {
    const nextStatus = statuses[(index + 1) % statuses.length];
    if (nextStatus) {
      setStatus(nextStatus);
      await updateStatus.mutateAsync({
        id: data.agenda_booking_id,
        status: nextStatus,
      });
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={onClick}
        variant={
          status === 'booked'
            ? 'default'
            : status === 'checked_in'
              ? 'outline'
              : 'destructive'
        }
        className="w-full capitalize"
      >
        {formatText(status)}
      </Button>
    </div>
  );
}
