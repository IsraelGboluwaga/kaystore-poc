interface Props {
  label: string;
  className?: string;
}

export function SectionHeader({ label, className = '' }: Props) {
  return (
    <p
      className={`text-[11px] font-semibold uppercase tracking-[0.6px] text-tx-2 font-sans ${className}`}
    >
      {label}
    </p>
  );
}
