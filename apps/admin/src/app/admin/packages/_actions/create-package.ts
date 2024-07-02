'use server';
import { cookies } from 'next/headers';
import {
  AuthService,
  ClassTypeService,
  PackageService,
  UserValidationError,
} from '@repo/shared/service';
import { redirect } from 'next/navigation';
import { container, TYPES } from '@repo/shared/inversify';
import { FormState } from '@repo/shared/form';
import { z } from 'zod';
import { createPackageSchema, FormCreatePackage } from '../form-schema';
import {
  convertErrorsToZod,
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { api } from '@/trpc/server';

export async function createPackage(
  state: FormCreatePackage,
  data: FormData,
): Promise<FormCreatePackage> {
  const formData = convertFormData(data);
  const parsed = createPackageSchema.safeParse(formData);

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

  const result = await packageService.create({
    name: parsed.data.name,
    price: parsed.data.price,
    credit: parsed.data.credit,
    loyalty_points: parsed.data.loyalty_points,
    one_time_only: parsed.data.one_time_only,
    valid_for: parsed.data.valid_for,
    class_type_id: parsed.data.class_type_id,
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
