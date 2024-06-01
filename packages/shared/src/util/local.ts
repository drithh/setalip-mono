export const moneyFormatter = Intl.NumberFormat('id-ID', {
  currency: 'IDR',
  currencyDisplay: 'symbol',
  currencySign: 'standard',
  style: 'currency',
});

export const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
