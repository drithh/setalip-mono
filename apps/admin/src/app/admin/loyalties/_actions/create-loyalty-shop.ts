'use server';
import { LoyaltyService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { createLoyaltyShopSchema, FormCreateLoyaltyShop } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { api } from '@/trpc/server';

export async function createLoyaltyShop(
  state: FormCreateLoyaltyShop,
  data: FormData,
): Promise<FormCreateLoyaltyShop> {
  const formData = convertFormData(data);
  const parsed = createLoyaltyShopSchema.safeParse(formData);

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

  const loyaltyService = container.get<LoyaltyService>(TYPES.LoyaltyService);

  const result = await loyaltyService.createShop({
    name: parsed.data.name,
    description: parsed.data.description,
    price: parsed.data.price,
    image_url: fileUpload[0]?.url ?? null,
    type: parsed.data.type,
    package_id: parsed.data.package_id !== 0 ? parsed.data.package_id : null,
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
