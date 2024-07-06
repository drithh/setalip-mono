"use client";

import { Button } from "@repo/ui/components/ui/button";
import { useForm } from "react-hook-form";
import { resendOtp } from "./_actions/resend-otp";
import { ResendOtpSchema, resendOtpSchema } from "./form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import router from "next/router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useFormState } from "react-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";

interface ResendOtpFormProps {
  userId: number;
}

const TOAST_MESSAGES = {
  error: {
    title: "Gagal mengirim ulang kode OTP",
    description: "Silahkan coba lagi",
  },
  loading: {
    title: "Mengirim ulang kode OTP...",
    description: "Mohon tunggu",
  },
  success: {
    title: "Kode OTP berhasil dikirim ulang",
    description: "Silahkan cek whatsapp Anda",
  },
};

export default function ResendOtpForm({ userId }: ResendOtpFormProps) {
  const [formState, formAction] = useFormState(resendOtp, {
    status: "default",
    form: {
      userId: userId,
    },
  });

  type FormSchema = ResendOtpSchema;

  const form = useForm<FormSchema>({
    resolver: zodResolver(resendOtpSchema),
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
        description: TOAST_MESSAGES.error.description,
      });
    } else if (formState.status === "success") {
      toast.success(TOAST_MESSAGES.success.title, {
        description: TOAST_MESSAGES.success.description,
      });
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
      <form ref={formRef} action={formAction} onSubmit={onSubmitForm}>
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
        <div className="mt-4 text-center text-sm">
          Belum dapat kode OTP?{" "}
          <Button className="p-1" variant={"link"}>
            Kirim ulang
          </Button>
        </div>
      </form>
    </Form>
  );
}
