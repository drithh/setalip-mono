'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { editParticipant } from './_actions/edit-participant';
import { useFormState } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { EditParticipantSchema, editParticipantSchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  SelectAgendaBooking,
  SelectParticipant,
} from '@repo/shared/repository';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { api } from '@/trpc/react';
import DeleteParticipantDialog from './delete-participant.dialog';

interface EditParticipantProps {
  agendaId: SelectAgendaBooking['agenda_id'];
  participants: SelectParticipant[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export default function EditParticipantForm({
  agendaId,
  participants,
  open,
  onOpenChange,
}: EditParticipantProps) {
  const trpcUtils = api.useUtils();
  const router = useRouter();
  type FormSchema = EditParticipantSchema;

  const [selectedParticipants, setSelectedParticipants] =
    useState<SelectParticipant[]>(participants);

  const [selectedParticipant, setSelectedParticipant] =
    useState<SelectParticipant>();

  const [formState, formAction] = useFormState(editParticipant, {
    status: 'default',
    form: {
      agenda_id: agendaId,
      participants: selectedParticipants.map((participant) => ({
        agenda_booking_id: participant.agenda_booking_id,
        user_id: participant.user_id,
      })),
    } as FormSchema,
  });

  const members = api.user.findAllMember.useQuery();

  const form = useForm<FormSchema>({
    resolver: zodResolver(editParticipantSchema),
    defaultValues: formState.form,
  });

  useEffect(() => {
    toast.dismiss();
    if (formState.status === 'field-errors') {
      for (const fieldName in formState.errors) {
        if (Object.prototype.hasOwnProperty.call(formState.errors, fieldName)) {
          const typedFieldName = fieldName as keyof FormSchema;
          const error = formState.errors[typedFieldName];
          if (error) {
            form.setError(typedFieldName, error);
          }
        }
      }
    } else if (formState.status === 'error') {
      toast.error(TOAST_MESSAGES.error.title, {
        description: formState.errors,
      });
      form.setError('root', { message: formState.errors });
    } else {
      form.clearErrors();
    }

    if (formState.status === 'success') {
      toast.success(TOAST_MESSAGES.success.title);
      router.refresh();
      trpcUtils.invalidate();
      onOpenChange(false);
    }
  }, [formState]);

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

  return (
    <Sheet
      open={open}
      onOpenChange={(ev) => {
        form.reset();
        onOpenChange(ev);
      }}
    >
      <SheetContent className="p-0">
        <ScrollArea className="h-screen px-6 pt-6">
          <SheetHeader>
            <SheetTitle className="text-left">Edit Participant</SheetTitle>
            <SheetDescription className="text-left">
              Edit participant. Pastikan klik simpan ketika selesai.
            </SheetDescription>
          </SheetHeader>
          <div className="l mb-6 grid gap-4 px-1 py-4">
            {agendaId ? (
              <Form {...form}>
                <form
                  className="grid gap-4"
                  ref={formRef}
                  action={formAction}
                  onSubmit={onFormSubmit}
                >
                  <FormField
                    control={form.control}
                    name="agenda_id"
                    render={({ field }) => (
                      <Input type="hidden" {...field} value={agendaId} />
                    )}
                  />
                  <FormLabel>Peserta</FormLabel>
                  <div className="flex w-full flex-col">
                    {selectedParticipants.map((participant, index) => (
                      <div key={participant.user_id}>
                        <FormField
                          control={form.control}
                          name={`participants.${index}.user_id`}
                          render={({ field }) => (
                            <FormItem className="grid w-full gap-2">
                              <FormControl>
                                <>
                                  <Input
                                    type="hidden"
                                    {...field}
                                    value={participant.user_id}
                                  />
                                  <div className="flex gap-2">
                                    <Input readOnly value={participant.name} />
                                    <DeleteParticipantDialog
                                      participant={participant}
                                      onDelete={() => {
                                        setSelectedParticipants((prev) =>
                                          prev.filter((_, i) => i !== index),
                                        );
                                      }}
                                    />
                                  </div>
                                </>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {participant.agenda_booking_id && (
                          <FormField
                            control={form.control}
                            name={`participants.${index}.agenda_booking_id`}
                            render={({ field }) => (
                              <Input type="hidden" {...field} />
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <Button type="submit" className="w-full">
                    Simpan
                  </Button>
                </form>
              </Form>
            ) : (
              <p>Agenda tidak ditemukan</p>
            )}

            <p>Tambah Peserta</p>
            <Select
              onValueChange={(value) => {
                const member = members.data?.result?.find(
                  (member) => member.id === parseInt(value),
                );
                if (member) {
                  setSelectedParticipant({
                    user_id: member.id,
                    name: member.name,
                  });
                  form.setValue('participants', [
                    ...selectedParticipants,
                    {
                      user_id: member.id,
                      name: member.name,
                    },
                  ]);
                }
              }}
              defaultValue={selectedParticipant?.user_id.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih peserta" />
              </SelectTrigger>
              <SelectContent>
                {members.data?.result?.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* button to add participant */}
            <Button
              onClick={() => {
                if (selectedParticipant) {
                  setSelectedParticipants((prev) => [
                    ...prev,
                    selectedParticipant,
                  ]);
                }
              }}
            >
              Tambah Peserta
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
