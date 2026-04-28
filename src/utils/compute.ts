import type { Invoice, InvoiceStatus } from '../types';

export interface ComputedInvoice {
  totalKobo: number;
  paidKobo: number;
  balanceKobo: number;
  status: InvoiceStatus;
}

export function computeInvoice(invoice: Invoice): ComputedInvoice {
  const total = invoice.lineItems.reduce(
    (s, li) => s + (li.quantityX100 / 100) * li.unitPriceKobo,
    0
  );
  const paid = invoice.payments.reduce(
    (s, p) =>
      p.paymentType === 'credit' ? s + p.amountKobo : s - p.amountKobo,
    0
  );
  const balance = total - paid;
  return {
    totalKobo: total,
    paidKobo: paid,
    balanceKobo: balance,
    status: balance <= 0 ? 'paid' : paid > 0 ? 'partial' : 'open',
  };
}
