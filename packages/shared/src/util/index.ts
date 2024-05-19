export * from '#dep/util/zod';

export function convertFormData<T>(data: FormData) {
  const formData = Object.fromEntries(data);
  return formData as T;
}
