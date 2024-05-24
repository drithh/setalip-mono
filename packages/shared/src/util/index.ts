export * from '#dep/util/zod';

export function convertFormData<T>(data: FormData) {
  const formData: Record<string, FormDataEntryValue | FormDataEntryValue[]> =
    {};
  for (const [key, value] of data.entries()) {
    if (formData[key] !== undefined) {
      if (Array.isArray(formData[key])) {
        (formData[key] as FormDataEntryValue[]).push(value);
      } else {
        formData[key] = [formData[key] as FormDataEntryValue, value];
      }
    } else {
      formData[key] = value;
    }
  }
  return formData as T;
}
