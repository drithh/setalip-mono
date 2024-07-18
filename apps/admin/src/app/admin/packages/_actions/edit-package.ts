'use server';
import { ClassTypeService, PackageService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { editPackageSchema, FormEditPackage } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

export async function editPackage(
  state: FormEditPackage,
  data: FormData,
): Promise<FormEditPackage> {
  const formData = convertFormData(data);
  const parsed = editPackageSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );

  const classType = await classTypeService.findById(parsed.data.class_type_id);

  if (classType.error) {
    return {
      form: parsed.data,
      status: 'error',
      errors: classType.error.message,
    };
  }

  if (classType.result === undefined) {
    return {
      form: parsed.data,
      status: 'error',
      errors: 'Class type not found',
    };
  }

  const packageService = container.get<PackageService>(TYPES.PackageService);

  const result = await packageService.update({
    id: parsed.data.id,
    name: parsed.data.name,
    price: parsed.data.price,
    credit: parsed.data.credit,
    loyalty_points: parsed.data.loyalty_points,
    one_time_only: parsed.data.one_time_only,
    valid_for: parsed.data.valid_for,
    class_type_id: parsed.data.class_type_id,
    is_active: parsed.data.is_active,
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
