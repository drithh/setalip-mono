import { format as FormateDate } from 'date-fns-tz';

export const format = (date: string) => {
  return FormateDate(new Date(date), 'dd MMM yyyy', {
    timeZone: 'Asia/Jakarta',
  });
};

export const moneyFormatter = Intl.NumberFormat('id-ID', {
  currency: 'IDR',
  currencyDisplay: 'symbol',
  currencySign: 'standard',
  style: 'currency',
});

export const decimalFormatter = Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  style: 'decimal',
});
