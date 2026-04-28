import type { ItemType } from '../types';

interface Props {
  type: ItemType;
}

const COLOR: Record<ItemType, string> = {
  part: '#C87D15',
  labour: '#1658A8',
  service: '#157A58',
  other: '#A0B5C6',
};

export function TypeDot({ type }: Props) {
  return (
    <span
      className="inline-block rounded-full mt-[6px] shrink-0"
      style={{ width: 8, height: 8, backgroundColor: COLOR[type] }}
    />
  );
}
