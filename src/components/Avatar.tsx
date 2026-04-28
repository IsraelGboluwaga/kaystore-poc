import { initials } from '../utils/format';

interface Props {
  name: string;
  color: string;
  size: number;
}

export function Avatar({ name, color, size }: Props) {
  const fontSize = Math.round(size * 0.37);
  const radius = Math.round(size * 0.28);
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        backgroundColor: color,
        borderRadius: radius,
        fontSize,
      }}
      className="flex items-center justify-center font-syne font-bold text-white select-none"
    >
      {initials(name)}
    </div>
  );
}
