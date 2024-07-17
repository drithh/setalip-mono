'use server';
import { LoyaltyService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { editLoyaltyShopSchema, FormEditLoyaltyShop } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { api } from '@/trpc/server';

export async function editLoyaltyShop(
  state: FormEditLoyaltyShop,
  data: FormData,
): Promise<FormEditLoyaltyShop> {
  const formData = convertFormData(data);
  const parsed = editLoyaltyShopSchema.safeParse(formData);

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
      : [{ url: parsed.data.image_url ?? '', name: 'logo' }];

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

  console.log('fileUpload', fileUpload);

  const loyaltyService = container.get<LoyaltyService>(TYPES.LoyaltyService);

  const result = await loyaltyService.updateShop({
    id: parsed.data.id,
    name: parsed.data.name,
    description: parsed.data.description,
    price: parsed.data.price,
    image_url: fileUpload[0]?.url ?? null,
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
