"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "@repo/ui/components/password-input";
import { PhoneInput } from "@repo/ui/components/phone-input";
import { Button } from "@repo/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { Value as PhoneNumberValue } from "react-phone-number-input";
import { toast } from "sonner";

import { api } from "@/trpc/react";

import { loginUser } from "./_actions/login-user";
import { LoginUserSchema, loginUserSchema } from "./form-schema";

const TOAST_MESSAGES = {
  error: {
    title: "Gagal login",
    description: "Silahkan coba lagi",
  },
  loading: {
    title: "Mengautentikasi...",
    description: "Mohon tunggu",
  },
  success: {
    title: "Login berhasil",
    description: "Selamat datang",
  },
};

export default function LoginUserForm() {
  const router = useRouter();
  const auth = api.auth.getSession.useQuery(void {}, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (auth.data) {
      router.push("/");
    }
  }, [auth]);

  const [formState, formAction] = useFormState(loginUser, {
    status: "default",
    form: {
      password: "",
      phoneNumber: "",
    },
  });

  type FormSchema = LoginUserSchema;

  const form = useForm<FormSchema>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: formState.form,
  });

  useEffect(() => {
    toast.dismiss();
    if (formState.status === "field-errors") {
      for (const fieldName in formState.errors) {
        if (Object.prototype.hasOwnProperty.call(formState.errors, fieldName)) {
          const typedFieldName = fieldName as keyof FormSchema;
          const error = formState.errors[typedFieldName];
          if (error) {
            form.setError(typedFieldName, error);
          }
        }
      }
    } else if (formState.status === "error") {
      toast.error(TOAST_MESSAGES.error.title, {
        description: formState.errors,
      });
      form.setError("root", { message: formState.errors });
    } else {
      form.clearErrors();
    }

    if (formState.status === "success") {
      toast.dismiss();
      toast.success(TOAST_MESSAGES.success.title, {
        description: TOAST_MESSAGES.success.description,
        duration: 2000,
      });
      router.push("/");
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
          name="password"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Lupa password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Form>
  );
}
