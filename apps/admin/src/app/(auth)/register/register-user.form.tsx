'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SelectLocation } from '@repo/shared/repository';
import { FormDatePicker } from '@repo/ui/components/form-date-picker';
import { PasswordInput } from '@repo/ui/components/password-input';
import { PhoneInput } from '@repo/ui/components/phone-input';
import { Button } from '@repo/ui/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { Value as PhoneNumberValue } from 'react-phone-number-input';
import { toast } from 'sonner';

import { api } from '@/trpc/react';

import { registerUser } from './_actions/register-user';
import { RegisterUserSchema, registerUserSchema } from './form-schema';

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal registrasi',
    description: 'Silahkan coba lagi',
  },
  loading: {
    title: 'Mendaftarkan User...',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Registrasi berhasil',
    description: 'Kode verifikasi telah dikirim ke whatsapp',
  },
};

interface RegisterUserFormProps {
  locations: SelectLocation[];
}

export default function RegisterUserForm({ locations }: RegisterUserFormProps) {
  const router = useRouter();

  const auth = api.auth.getSession.useQuery(void {}, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (auth.data) {
      router.push('/');
    }
  }, [auth]);

  const [formState, formAction] = useFormState(registerUser, {
    status: 'default',
    form: {
      address: '',
      email: '',
      name: '',
      password: '',
      passwordConfirmation: '',
      phoneNumber: '',
      location_id: undefined,
      dateOfBirth: new Date(),
    },
  });

  type FormSchema = RegisterUserSchema;

  const form = useForm<FormSchema>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: formState.form,
  });

  console.log(form.formState.errors);

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
        description: TOAST_MESSAGES.error.description,
      });
      form.setError('root', { message: formState.errors });
    } else {
      form.clearErrors();
    }
    if (formState.status === 'success') {
      toast.success(TOAST_MESSAGES.success.title, {
        description: TOAST_MESSAGES.success.description,
      });
      router.push('/verification');
    }
  }, [formState]);

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
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
    <Form {...form}>
      <form
        className="grid gap-4"
        ref={formRef}
        action={formAction}
        onSubmit={onSubmitForm}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input type="text" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormLabel>Nomor Whatsapp</FormLabel>
              <FormControl>
                <PhoneInput
                  {...field}
                  value={field.value as PhoneNumberValue}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormLabel>Tanggal Lahir</FormLabel>
              <FormControl>
                <>
                  <Input
                    type="hidden"
                    {...field}
                    value={field.value.toString()}
                  />
                  <FormDatePicker
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                  />
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Input type="text" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location_id"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormLabel>Lokasi Cabang</FormLabel>
              <FormControl>
                <>
                  <Input type="hidden" {...field} />

                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem
                          key={location.id}
                          value={location.id.toString()}
                        >
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="my-4">
          <p className="text-justify text-sm">
            Dengan membuat akun, Anda setuju dengan{' '}
            <Link href="/legal" className="text-balance underline">
              Terms of Service
            </Link>{' '}
            dan telah membaca serta menyetujui{' '}
            <Link href="/legal" className="text-balance underline">
              Privacy Policy.
            </Link>
          </p>
        </div>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </Form>
  );
}
