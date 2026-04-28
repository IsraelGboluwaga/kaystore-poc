import { useState, useEffect, useRef } from 'react';
import { SheetPortal } from './SheetPortal';
import { useApp } from '../../context/useApp';
import { newId } from '../../utils/ids';
import { formatKobo } from '../../utils/format';
import type { ItemType } from '../../types';

interface Props {
  invoiceId: string;
  onClose: () => void;
}

const ITEM_TYPES: { value: ItemType; label: string }[] = [
  { value: 'part', label: 'Part' },
  { value: 'labour', label: 'Labour' },
  { value: 'service', label: 'Service' },
  { value: 'other', label: 'Other' },
];

export function AddItemSheet({ invoiceId, onClose }: Props) {
  const { state, dispatch } = useApp();

  const [description, setDescription] = useState('');
  const [inventoryItemId, setInventoryItemId] = useState<string | null>(null);
  const [itemType, setItemType] = useState<ItemType>('part');
  const [qty, setQty] = useState('1');
  const [price, setPrice] = useState('');
  const [suggestions, setSuggestions] = useState(state.inventory);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const descRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    descRef.current?.focus();
  }, []);

  const handleDescChange = (value: string) => {
    setDescription(value);
    setInventoryItemId(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim() === '') {
        setSuggestions(state.inventory);
        setShowSuggestions(false);
        return;
      }
      const lower = value.toLowerCase();
      const matches = state.inventory
        .filter((item) => item.name.toLowerCase().includes(lower))
        .slice(0, 4);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    }, 150);
  };

  const handleSelectSuggestion = (itemId: string) => {
    const item = state.inventory.find((i) => i.id === itemId);
    if (!item) return;
    setDescription(item.name);
    setPrice((item.unitPriceKobo / 100).toFixed(2));
    setInventoryItemId(item.id);
    setShowSuggestions(false);
  };

  const lineTotal = (() => {
    const q = parseFloat(qty);
    const p = parseFloat(price);
    if (!isNaN(q) && !isNaN(p) && q > 0 && p >= 0) {
      return Math.round(p * 100) * q;
    }
    return null;
  })();

  const canSave = description.trim() !== '' && price.trim() !== '' && !isNaN(parseFloat(price));

  const handleAdd = () => {
    if (!canSave) return;
    const qtyX100 = Math.round(parseFloat(qty) * 100);
    const unitPriceKobo = Math.round(parseFloat(price) * 100);
    dispatch({
      type: 'ADD_LINE_ITEM',
      invoiceId,
      item: {
        id: newId(),
        invoiceId,
        inventoryItemId,
        itemType,
        description: description.trim(),
        quantityX100: qtyX100,
        unitPriceKobo,
      },
    });
    onClose();
  };

  return (
    <SheetPortal title="Add line item" onClose={onClose}>
      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Description / inventory search */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.6px] text-tx-2 font-sans">
            Description
          </label>
          <input
            ref={descRef}
            type="text"
            value={description}
            onChange={(e) => handleDescChange(e.target.value)}
            onFocus={() => {
              if (description.trim() && suggestions.length > 0) setShowSuggestions(true);
            }}
            placeholder="Type to search inventory…"
            className="w-full h-12 px-4 rounded-input bg-surface-2 text-tx text-[15px] font-sans border border-border focus:border-amber-border focus:bg-amber-bg outline-none transition-colors"
          />

          {/* Suggestions */}
          {showSuggestions && (
            <div className="flex flex-col gap-1.5 mt-1">
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSuggestion(item.id)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-input border-[1.5px] border-amber-border bg-amber-bg text-left active:scale-[0.99] transition-transform"
                >
                  <div>
                    <p className="text-[13px] font-medium text-tx font-sans">{item.name}</p>
                    <p className="text-[12px] text-tx-2 font-sans">Stock: {item.stockQuantity}</p>
                  </div>
                  <span className="font-display font-bold text-[14px] text-amber tabular-nums">
                    {formatKobo(item.unitPriceKobo)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Linkage indicator */}
          {description.trim() !== '' && (
            inventoryItemId ? (
              <p className="text-[11px] font-semibold text-green font-sans">
                ✓ Inventory linked · stock will not decrement in POC
              </p>
            ) : (
              <p className="text-[11px] font-semibold text-amber font-sans">
                ⚠ Ad-hoc item · not linked to inventory
              </p>
            )
          )}
        </div>

        {/* Item type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.6px] text-tx-2 font-sans">
            Type
          </label>
          <div className="flex gap-2 flex-wrap">
            {ITEM_TYPES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setItemType(value)}
                className={`px-4 h-9 rounded-input text-[13px] font-semibold font-sans transition-colors duration-120
                  ${itemType === value
                    ? 'bg-navy text-white'
                    : 'bg-surface-2 text-tx-2 hover:bg-border'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Qty + Price */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.6px] text-tx-2 font-sans">
              Qty
            </label>
            <input
              type="number"
              value={qty}
              min={0.01}
              step={0.01}
              onChange={(e) => setQty(e.target.value)}
              className="h-12 px-4 rounded-input bg-surface-2 text-tx text-[15px] font-sans border border-border focus:border-amber-border focus:bg-amber-bg outline-none transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.6px] text-tx-2 font-sans">
              Unit Price (₦)
            </label>
            <input
              type="number"
              value={price}
              min={0}
              step={0.01}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="h-12 px-4 rounded-input bg-surface-2 text-tx text-[15px] font-sans border border-border focus:border-amber-border focus:bg-amber-bg outline-none transition-colors"
            />
          </div>
        </div>

        {/* Line total preview */}
        {lineTotal !== null && (
          <div className="flex items-center justify-between px-4 py-3 rounded-input bg-amber-bg">
            <span className="text-[13px] font-semibold text-amber font-sans">Line total</span>
            <span
              className="font-display font-extrabold text-[19px] text-amber tabular-nums"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatKobo(lineTotal)}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1 pb-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 rounded-input border border-border text-tx-2 text-[14px] font-semibold font-sans hover:bg-surface-2 active:scale-[0.98] transition-all duration-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canSave}
            className="flex-1 h-12 rounded-input bg-amber text-white text-[14px] font-semibold font-sans disabled:opacity-40 active:scale-[0.98] transition-all duration-100"
          >
            Add item
          </button>
        </div>
      </div>
    </SheetPortal>
  );
}
