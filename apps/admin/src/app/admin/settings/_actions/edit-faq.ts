'use server';
import { WebSettingService } from '@repo/shared/service';
import { container, TYPES } from '@repo/shared/inversify';
import {
  editFrequentlyAskedQuestionSchema,
  FormEditFrequentlyAskedQuestion,
} from '../form-schema';
import {
  convertFormData,
  convertZodErrorsToFieldErrors,
} from '@repo/shared/util';

export async function editFrequentlyAskedQuestion(
  state: FormEditFrequentlyAskedQuestion,
  data: FormData,
): Promise<FormEditFrequentlyAskedQuestion> {
  const formData = convertFormData(data);
  const parsed = editFrequentlyAskedQuestionSchema.safeParse(formData);

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

  const result = await webSettingService.updateFrequentlyAskedQuestion({
    ...parsed.data,
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
