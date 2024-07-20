'use server';
import { ClassService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import { editDetailClassSchema, FormEditDetailClass } from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';
import { parsePhoneNumber } from 'libphonenumber-js';

export async function editDetailClass(
  state: FormEditDetailClass,
  data: FormData,
): Promise<FormEditDetailClass> {
  const formData = convertFormData(data);
  const parsed = editDetailClassSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      form: convertFormData(data),
      status: 'field-errors',
      errors: convertZodErrorsToFieldErrors(
        parsed.error.formErrors.fieldErrors,
      ),
    };
  }

  const classService = container.get<ClassService>(TYPES.ClassService);

  const class_locations =
    parsed.data.class_locations?.split(',').map((loc) => {
      return parseInt(loc);
    }) || [];

  const updateClass = await classService.update({
    id: parsed.data.class_id,
    name: parsed.data.name,
    class_type_id: parsed.data.class_type_id,
    description: parsed.data.description,
    duration: parsed.data.duration,
    slot: parsed.data.slot,
    class_locations: class_locations,
  });

  if (updateClass.error) {
    return {
      form: parsed.data,
      status: 'error',
      errors: updateClass.error.message,
    };
  }

  return {
    form: undefined,
    status: 'success',
  };
}
