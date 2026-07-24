export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatMoney = (value) => currency.format(Number(value || 0));
