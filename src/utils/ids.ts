let idCounter = 0;
let payCounter = 0;

export const newId = (): string =>
  'gen-' + (idCounter++).toString().padStart(4, '0');

export const newPayRef = (): string =>
  'PAY-' + (payCounter++).toString().padStart(3, '0');
