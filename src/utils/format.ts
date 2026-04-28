export const formatKobo = (kobo: number): string =>
  '₦' +
  (kobo / 100).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatQty = (quantityX100: number): string => {
  const val = quantityX100 / 100;
  return val % 1 === 0 ? val.toString() : val.toFixed(2);
};

export const initials = (name: string): string =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const toKobo = (input: string): number =>
  Math.round(parseFloat(input) * 100);

export const toQtyX100 = (input: string): number =>
  Math.round(parseFloat(input) * 100);
