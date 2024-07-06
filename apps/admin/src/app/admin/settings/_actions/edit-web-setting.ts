'use server';
import { cookies } from 'next/headers';
import { WebSettingService } from '@repo/shared/service';
import { redirect } from 'next/navigation';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { editWebSettingSchema, FormEditWebSetting } from '../form-schema';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { api } from '@/trpc/server';
import { SelectWebSetting } from '@repo/shared/repository';

export async function editWebSetting(
  state: FormEditWebSetting,
  data: FormData,
): Promise<FormEditWebSetting> {
  const formData = convertFormData(data);
  const parsed = editWebSettingSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const webSettingService = container.get<WebSettingService>(
    TYPES.WebSettingService,
  );

  const fileUpload =
    parsed.data.logo?.size && parsed.data.logo?.size > 0
      ? await api.file.upload({ files: parsed.data.logo })
      : [{ url: parsed.data.url ?? '', name: 'logo' }];

  if (fileUpload.length === 0) {
    return {
      form: parsed.data,
      status: 'field-errors',
      errors: {
        logo: {
          type: 'required',
          message: 'File is required',
        },
      },
    };
  }

  const parsedData = {
    ...parsed.data,
    logo: fileUpload[0]?.url ?? '',
  };

  parsedData;

  const parsedDataWithKeys = Object.keys(parsedData).map((key) => {
    const keyAs = key as keyof typeof parsedData; // Ensure 'key' is a valid key of parsedData
    const value = parsedData[keyAs];
    return { key: keyAs, value } as { key: string; value: string };
  });

  const result = await webSettingService.update(parsedDataWithKeys);

  if (result.error) {
    return {
      form: parsed.data,
      status: 'error',
      errors: result.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
