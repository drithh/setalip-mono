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
  UpdateParticipant,
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
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@repo/ui/components/ui/command';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@repo/ui/components/ui/popover';
import { cn } from '@repo/ui/lib/utils';
import { ChevronsUpDown, Check } from 'lucide-react';

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

  const [selectedParticipants, setSelectedParticipants] = useState<
    UpdateParticipant[]
  >(
    participants.map((participant) => ({
      agenda_booking_id: participant.agenda_booking_id,
      user_id: participant.user_id,
      name: participant.name,
      delete: undefined,
    })),
  );
  const [openSelectParticipant, setOpenSelectParticipant] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<UpdateParticipant>();

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
                                  {participant.delete === undefined && (
                                    <div className="flex gap-2">
                                      <Input
                                        readOnly
                                        value={participant.name}
                                      />
                                      <DeleteParticipantDialog
                                        participant={participant}
                                        onDelete={(is_refund) => {
                                          const deleteParticipant: UpdateParticipant =
                                            {
                                              ...participant,
                                              delete: is_refund
                                                ? 'refund'
                                                : 'no_refund',
                                            };

                                          form.setValue(
                                            `participants.${index}.delete`,
                                            deleteParticipant.delete,
                                          );
                                          setSelectedParticipants((prev) =>
                                            prev.map((prevParticipant) =>
                                              prevParticipant.user_id ===
                                              participant.user_id
                                                ? deleteParticipant
                                                : prevParticipant,
                                            ),
                                          );
                                        }}
                                      />
                                    </div>
                                  )}
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
                        {participant.delete && (
                          <FormField
                            control={form.control}
                            name={`participants.${index}.delete`}
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
            <Popover
              open={openSelectParticipant}
              onOpenChange={setOpenSelectParticipant}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'w-full justify-between',
                    !selectedParticipant && 'text-muted-foreground',
                  )}
                >
                  {selectedParticipant
                    ? selectedParticipant.name
                    : 'Pilih peserta'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[327px] p-0">
                <Command>
                  <CommandInput placeholder="Cari peserta" />
                  <CommandList>
                    <CommandEmpty>
                      Tidak ada peserta yang ditemukan
                    </CommandEmpty>
                    <CommandGroup>
                      {members.data?.result
                        ?.filter((member) => {
                          return !selectedParticipants.some(
                            (participant) => participant.user_id === member.id,
                          );
                        })
                        .map((member) => (
                          <CommandItem
                            value={member.id.toString()}
                            key={member.id}
                            onSelect={() => {
                              setSelectedParticipant({
                                user_id: member.id,
                                name: member.name,
                                delete: undefined,
                              });
                              setOpenSelectParticipant(false);
                            }}
                          >
                            {member.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              onClick={() => {
                if (selectedParticipant) {
                  form.setValue('participants', [
                    ...selectedParticipants,
                    {
                      user_id: selectedParticipant.user_id,
                      name: selectedParticipant.name,
                      delete: selectedParticipant.delete,
                    },
                  ]);
                  setSelectedParticipants((prev) => [
                    ...prev,
                    selectedParticipant,
                  ]);
                  setSelectedParticipant(undefined);
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
