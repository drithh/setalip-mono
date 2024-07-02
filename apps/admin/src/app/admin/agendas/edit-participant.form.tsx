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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { EditParticipantSchema, editParticipantSchema } from './form-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Switch } from '@repo/ui/components/ui/switch';
import { MoneyInput } from '@repo/ui/components/money-input';
import { AddonInput } from '@repo/ui/components/addon-input';
import {
  SelectAgendaBooking,
  SelectClassType,
  SelectDetailLocation,
  SelectParticipant,
} from '@repo/shared/repository';
import {
  Sheet,
  SheetTrigger,
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
import { Trash } from 'lucide-react';
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
    description: 'Silahkan coba lagi',
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
        onOpenChange(ev);
        form.reset();
      }}
    >
      <SheetContent className="p-0">
        <ScrollArea className="h-screen px-6 pt-6">
          <SheetHeader>
            <SheetTitle className="text-left">Edit Paket</SheetTitle>
            <SheetDescription className="text-left">
              Edit paket. Pastikan klik simpan ketika selesai.
            </SheetDescription>
          </SheetHeader>
          <div className="l mb-6 grid gap-4 px-1 py-4">
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
                    <Input hidden {...field} value={agendaId} />
                  )}
                />
                {selectedParticipants.map((participant, index) => (
                  <>
                    <FormField
                      control={form.control}
                      name={`participants.${index}.user_id`}
                      key={index}
                      render={({ field }) => (
                        <FormItem className="grid w-full gap-2">
                          <FormLabel>Peserta</FormLabel>
                          <FormControl>
                            <>
                              <Input hidden {...field} />
                              <div className="flex">
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
                    <FormField
                      control={form.control}
                      name={`participants.${index}.agenda_booking_id`}
                      key={index}
                      render={({ field }) => <Input hidden {...field} />}
                    />
                  </>
                ))}

                <Button type="submit" className="w-full">
                  Simpan
                </Button>
              </form>
            </Form>

            <FormLabel>Tambah Peserta</FormLabel>
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
