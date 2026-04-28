import { formatKobo } from '../utils/format';

interface Props {
  kobo: number;
  className?: string;
}

export function AmountDisplay({ kobo, className = '' }: Props) {
  return (
    <span
      className={`font-display tabular-nums ${className}`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {formatKobo(kobo)}
    </span>
  );
}
