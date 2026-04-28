import type { InvoiceStatus } from '../types';

interface Props {
  status: InvoiceStatus;
}

const CONFIG = {
  open: {
    label: 'Unpaid',
    className:
      'bg-amber-bg text-amber border border-amber-border',
  },
  partial: {
    label: 'Partial',
    className: 'bg-blue-bg text-blue',
  },
  paid: {
    label: 'Paid',
    className: 'bg-green-bg text-green',
  },
};

export function Badge({ status }: Props) {
  const { label, className } = CONFIG[status];
  return (
    <span
      className={`inline-block px-[9px] py-[3px] text-[11px] font-semibold rounded-badge leading-none ${className}`}
    >
      {label}
    </span>
  );
}
