export * from '#dep/util/zod';
export * from '#dep/util/local';

function isNumber(value: FormDataEntryValue): value is string {
  return !isNaN(Number(value));
}

function isString(value: FormDataEntryValue): value is string {
  return typeof value === 'string';
}

function isDate(value: FormDataEntryValue): value is string {
  return isString(value) && !isNaN(Date.parse(value));
}

function isBoolean(value: FormDataEntryValue): value is string {
  return (isString(value) && value === 'true') || value === 'false';
}

type FormDataValue = string | number | Date | boolean | File;
type RecordFormData = Record<string, FormDataValue | FormDataValue[]>;
export function convertFormData<T = RecordFormData>(data: FormData) {
  const formData: RecordFormData = {};
  for (const [key, value] of data.entries()) {
    let newValue: FormDataValue = value;
    if (isBoolean(value)) {
      newValue = value === 'true';
    } else if (isNumber(value)) {
      newValue = Number(value);
    } else if (isDate(value)) {
      newValue = new Date(value);
    }
    if (formData[key] !== undefined) {
      if (Array.isArray(formData[key])) {
        (formData[key] as FormDataValue[]).push(newValue);
      } else {
        formData[key] = [formData[key] as FormDataValue, newValue];
      }
    } else {
      formData[key] = newValue;
    }
  }
  return formData as T;
}

export function transformData<T = number | string | Date | boolean>(
  data: Record<string, T>,
  regex: RegExp
) {
  const parsedData: Record<string, T>[] = [];

  for (const key in data) {
    const match = key.match(regex);
    if (match) {
      const [, index, field] = match as any;
      if (!parsedData[index]) {
        parsedData[index] = {};
      }
      (parsedData[index] as any)[field] = data[key];
    }
  }

  return parsedData;
}
