'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { useRef, useState } from 'react';

import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';

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
import { ChevronsUpDown } from 'lucide-react';
import { useCreateMutation } from './_functions/create-agenda-booking';
import { useDeleteMutation } from './_functions/delete-agenda-booking';
import { Label } from '@repo/ui/components/ui/label';
import {
  AgendaWithParticipant,
  CancelAgendaBookingByAdminOption,
  SelectAgenda__Coach__Class__Location__Participant,
} from '@repo/shared/service';

interface EditParticipantProps {
  agenda: SelectAgenda__Coach__Class__Location__Participant;
  participants: AgendaWithParticipant[];
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

interface Participant {
  user_id?: number;
  name?: string;
  used_credit_user_id?: number;
  used_credit_user_name?: string;
}

export default function EditParticipantForm({
  agenda,
  participants,
  open,
  onOpenChange,
}: EditParticipantProps) {
  const trpcUtils = api.useUtils();
  const createAgendaBooking = useCreateMutation();
  const deleteAgendaBooking = useDeleteMutation();

  const onCreate = (user_id: number, used_credit_user_id: number) => {
    createAgendaBooking.mutate(
      {
        agenda_id: agenda.id,
        user_id: user_id,
        used_credit_user_id: used_credit_user_id,
        time: agenda.time,
        agenda_recurrence_id: agenda.agenda_recurrence_id ?? 0,
      },
      {
        onSuccess: () => {
          trpcUtils.invalidate();
        },
      },
    );
  };

  const onDelete = (data: CancelAgendaBookingByAdminOption) => {
    deleteAgendaBooking.mutate(
      {
        id: data.id,
        type: data.type,
      },
      {
        onSuccess: () => {
          trpcUtils.invalidate();
        },
      },
    );
  };

  const [openSelectParticipant, setOpenSelectParticipant] = useState(false);
  const [openSelectUser, setOpenSelectUser] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant>();

  const members = api.user.findAllMember.useQuery();

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Sheet
      open={open}
      onOpenChange={(ev) => {
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
            <Label>Peserta</Label>
            <div className="flex w-full flex-col">
              {participants.map((participant) => (
                <div key={participant.agenda_booking_id} className="flex gap-2">
                  <Input readOnly value={participant.user_name} />
                  <DeleteParticipantDialog
                    participant={participant}
                    onDelete={(is_refund) => {
                      if (!participant.agenda_booking_id) {
                        return;
                      }
                      onDelete({
                        id: participant.agenda_booking_id,
                        type: is_refund ? 'refund' : 'no_refund',
                      });
                    }}
                  />
                </div>
              ))}
            </div>

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
                          return !participants.some(
                            (participant) => participant.user_id === member.id,
                          );
                        })
                        .map((member) => (
                          <CommandItem
                            value={member.name.toLowerCase()}
                            key={member.id}
                            onSelect={() => {
                              setSelectedParticipant({
                                ...selectedParticipant,
                                user_id: member.id,
                                name: member.name,
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

            <p>Gunakan Kredit User</p>
            <Popover open={openSelectUser} onOpenChange={setOpenSelectUser}>
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
                    ? selectedParticipant.used_credit_user_name
                    : 'Pilih user'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[327px] p-0">
                <Command>
                  <CommandInput placeholder="Cari user" />
                  <CommandList>
                    <CommandEmpty>Tidak ada user yang ditemukan</CommandEmpty>
                    <CommandGroup>
                      {members.data?.result
                        ?.filter((member) => {
                          return !participants.some(
                            (participant) => participant.user_id === member.id,
                          );
                        })
                        .map((member) => (
                          <CommandItem
                            value={member.name.toLowerCase()}
                            key={member.id}
                            onSelect={() => {
                              setSelectedParticipant({
                                ...selectedParticipant,
                                used_credit_user_id: member.id,
                                used_credit_user_name: member.name,
                              });
                              setOpenSelectUser(false);
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
                  if (
                    selectedParticipant.used_credit_user_id &&
                    selectedParticipant.user_id &&
                    selectedParticipant.name
                  ) {
                    onCreate(
                      selectedParticipant.user_id,
                      selectedParticipant.used_credit_user_id,
                    );
                  } else {
                    toast.error('Gagal menambahkan peserta', {
                      description: 'Mohon pilih peserta yang valid',
                    });
                  }
                  setSelectedParticipant(undefined);
                } else {
                  toast.error('Gagal menambahkan peserta', {
                    description: 'Mohon pilih peserta yang valid',
                  });
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
