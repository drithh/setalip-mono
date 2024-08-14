'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';

import { Textarea } from '@repo/ui/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';


import { createReview } from './_actions/create-review';
import { CreateReviewSchema, createReviewSchema } from './form-schema';
import { BackButton } from '@repo/ui/components/back-button';

interface CreateReviewProps {}

const TOAST_MESSAGES = {
  error: {
    title: 'Gagal membuat review',
  },
  loading: {
    title: 'Membuat review',
    description: 'Mohon tunggu',
  },
  success: {
    title: 'Review berhasil dibuat',
  },
};

export default function CreateReviewForm({}: CreateReviewProps) {
  const router = useRouter();
  type FormSchema = CreateReviewSchema;

  const [formState, formAction] = useFormState(createReview, {
    status: 'default',
    form: {
      review: '',
      rating: 0,
    } as FormSchema,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(createReviewSchema),
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
      form.reset();
      router.push('/', {
        scroll: true,
      });
      router.refresh();
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
    <Card className="mx-auto w-full max-w-md space-y-8">
      <CardHeader>
        <CardTitle className="flex place-items-center gap-2">
          <BackButton />
          Write a Review
        </CardTitle>
        <CardDescription>
          Share your thoughts and experience with this product or service.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Form {...form}>
            <form
              className="grid gap-4"
              ref={formRef}
              action={formAction}
              onSubmit={onFormSubmit}
            >
              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Review</FormLabel>
                    <FormControl>
                      <Textarea id="review" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Rating (1-10)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        id="rating"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Buat Review
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
