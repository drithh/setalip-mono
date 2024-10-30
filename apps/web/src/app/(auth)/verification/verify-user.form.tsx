"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@repo/ui/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { verifyUser } from "./_actions/verify-user";
import { VerifyOtpSchema, verifyOtpSchema } from "./form-schema";

interface VerifyUserFormProps {
  userId: number;
}

const TOAST_MESSAGES = {
  error: {
    title: "Gagal verifikasi user",
    description: "Silahkan coba lagi",
  },
  loading: {
    title: "Verifikasi user...",
    description: "Mohon tunggu",
  },
  success: {
    title: "Verifikasi user berhasil",
    description: "Selamat datang",
  },
};

export default function VerifyUserForm({ userId }: VerifyUserFormProps) {
  const router = useRouter();

  const [formState, formAction] = useFormState(verifyUser, {
    status: "default",
    form: {
      otp: "",
      userId: userId,
    },
  });

  type FormSchema = VerifyOtpSchema;

  const form = useForm<FormSchema>({
    resolver: zodResolver(verifyOtpSchema),
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
    }
    if (formState.status === "success") {
      toast.success(TOAST_MESSAGES.success.title, {
        description: TOAST_MESSAGES.success.description,
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
          name="userId"
          render={({ field }) => (
            <FormItem className="grid w-full gap-2">
              <FormControl>
                <Input type="hidden" readOnly placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex place-content-center">
                Kode OTP
              </FormLabel>
              <FormControl>
                <div className="flex place-content-center">
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Verifikasi
        </Button>
      </form>
    </Form>
  );
}
