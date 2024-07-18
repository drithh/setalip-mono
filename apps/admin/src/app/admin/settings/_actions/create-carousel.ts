'use server';
import { WebSettingService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { createCarouselSchema, FormCreateCarousel } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { api } from '@/trpc/server';

export async function createCarousel(
  state: FormCreateCarousel,
  data: FormData,
): Promise<FormCreateCarousel> {
  const formData = convertFormData(data);
  const parsed = createCarouselSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const fileUpload =
    parsed.data.file?.size && parsed.data.file?.size > 0
      ? await api.file.upload({ files: parsed.data.file })
      : [{ url: '', name: '' }];

  if (fileUpload.length === 0) {
    return {
      form: parsed.data,
      status: 'field-errors',
      errors: {
        file: {
          type: 'required',
          message: 'File is required',
        },
      },
    };
  }

  const webSettingService = container.get<WebSettingService>(
    TYPES.WebSettingService,
  );

  const result = await webSettingService.createCarousel({
    title: parsed.data.title,
    image_url: fileUpload[0]?.url ?? '',
  });

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
