import { useState, useEffect, useRef } from 'react';
import { SheetPortal } from './SheetPortal';
import { useApp } from '../../context/useApp';
import { newId, newPayRef } from '../../utils/ids';
import type { PaymentType, PaymentMethod } from '../../types';

interface Props {
  invoiceId: string;
  onClose: () => void;
}

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'bank_transfer', label: 'Bank transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'pos', label: 'POS' },
];

export function RecordPaymentSheet({ invoiceId, onClose }: Props) {
  const { dispatch } = useApp();

  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState<PaymentType>('credit');
  const [method, setMethod] = useState<PaymentMethod>('bank_transfer');
  const [providerRef, setProviderRef] = useState('');
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    amountRef.current?.focus();
  }, []);

  const canSave = amount.trim() !== '' && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;

  const handleSave = () => {
    if (!canSave) return;
    const amountKobo = Math.round(parseFloat(amount) * 100);
    dispatch({
      type: 'ADD_PAYMENT',
      invoiceId,
      payment: {
        id: newId(),
        invoiceId,
        paymentType,
        amountKobo,
        method,
        providerReference: providerRef.trim() || null,
        internalReference: newPayRef(),
        recordedAt: 'Apr 28',
      },
    });
    onClose();
  };

  return (
    <SheetPortal title="Record payment" onClose={onClose}>
      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Amount */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.6px] text-tx-2 font-dm">
            Amount (₦)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-syne font-bold text-[24px] text-tx-2 select-none">
              ₦
            </span>
            <input
              ref={amountRef}
              type="number"
              value={amount}
              min={0}
              step={0.01}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-16 pl-10 pr-4 rounded-input bg-surface-2 text-tx font-syne font-bold text-[24px] border border-border focus:border-amber-border focus:bg-amber-bg outline-none transition-colors tabular-nums"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            />
          </div>
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.6px] text-tx-2 font-dm">
            Type
          </label>
          <div className="flex gap-2">
            {(['credit', 'debit'] as PaymentType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setPaymentType(t)}
                className={`flex-1 h-11 rounded-input text-[13px] font-semibold font-dm transition-colors duration-120
                  ${paymentType === t
                    ? 'bg-navy text-white'
                    : 'bg-surface-2 text-tx-2 hover:bg-border'
                  }`}
              >
                {t === 'credit' ? 'Credit received' : 'Debit / reversal'}
              </button>
            ))}
          </div>
        </div>

        {/* Method */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.6px] text-tx-2 font-dm">
            Method
          </label>
          <div className="flex gap-2">
            {METHODS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setMethod(value)}
                className={`flex-1 h-11 rounded-input text-[13px] font-semibold font-dm transition-colors duration-120
                  ${method === value
                    ? 'bg-navy text-white'
                    : 'bg-surface-2 text-tx-2 hover:bg-border'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Provider reference */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.6px] text-tx-2 font-dm">
            Bank / Provider Reference (optional)
          </label>
          <input
            type="text"
            value={providerRef}
            onChange={(e) => setProviderRef(e.target.value)}
            placeholder="e.g. TRF202604281234"
            className="w-full h-12 px-4 rounded-input bg-surface-2 text-tx text-[15px] font-dm border border-border focus:border-amber-border focus:bg-amber-bg outline-none transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1 pb-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 rounded-input border border-border text-tx-2 text-[14px] font-semibold font-dm hover:bg-surface-2 active:scale-[0.98] transition-all duration-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 h-12 rounded-input bg-amber text-white text-[14px] font-semibold font-dm disabled:opacity-40 active:scale-[0.98] transition-all duration-100"
          >
            Save payment
          </button>
        </div>
      </div>
    </SheetPortal>
  );
}
