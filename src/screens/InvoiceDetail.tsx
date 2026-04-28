import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { computeInvoice } from '../utils/compute';
import { formatKobo, formatQty } from '../utils/format';
import { Badge } from '../components/Badge';
import { SectionHeader } from '../components/SectionHeader';
import { TypeDot } from '../components/TypeDot';
import { AddItemSheet } from '../components/sheets/AddItemSheet';
import { RecordPaymentSheet } from '../components/sheets/RecordPaymentSheet';

export function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const navigate = useNavigate();
  const [showAddItem, setShowAddItem] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const invoice = state.invoices.find((inv) => inv.id === id);
  if (!invoice) {
    return (
      <div className="flex items-center justify-center flex-1 p-8">
        <p className="text-tx-2 font-dm">Invoice not found.</p>
      </div>
    );
  }

  const client = state.clients.find((c) => c.id === invoice.clientId);
  const { totalKobo, paidKobo, balanceKobo, status } = computeInvoice(invoice);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Mobile back button — desktop doesn't need it (sidebar navigation) */}
      <div className="md:hidden sticky top-0 z-30">
        <div className="flex items-center px-4 h-[58px] bg-navy">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 -ml-2 text-amber"
            aria-label="Go back"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Zone A — Navy header */}
      <div className="bg-navy w-full px-5 pb-6 pt-4 md:pt-8">
        <p className="font-syne font-extrabold text-white text-[22px] leading-tight truncate">
          {client?.name ?? 'Unknown'}
        </p>
        {client?.companyName && (
          <p className="text-[12px] text-white/45 font-dm mt-0.5">{client.companyName}</p>
        )}

        <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-white/40 font-dm mt-4 mb-1">
          Outstanding balance
        </p>

        {balanceKobo <= 0 ? (
          <p className="font-syne font-bold text-green text-[28px] leading-none tabular-nums">
            Settled
          </p>
        ) : (
          <p
            className="font-syne font-extrabold text-white leading-none tabular-nums"
            style={{
              fontSize: 'clamp(32px, 9vw, 44px)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatKobo(balanceKobo)}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <p className="text-[12px] text-white/40 font-dm">
            {invoice.invoiceNumber} · {invoice.date}
          </p>
          <Badge status={status} />
        </div>
      </div>

      {/* Zone B — Scrollable content */}
      <div className="flex-1 bg-parchment px-4 pt-4 pb-24 flex flex-col gap-4">
        {/* Notes */}
        {invoice.notes && (
          <div className="bg-surface rounded-card shadow-card px-3 py-3">
            <p className="text-[13px] text-tx-2 font-dm">{invoice.notes}</p>
          </div>
        )}

        <SectionHeader label="Line items" />

        {/* Line items card */}
        <div className="bg-surface rounded-card shadow-card overflow-hidden">
          {invoice.lineItems.map((li, idx) => (
            <div
              key={li.id}
              className={`flex items-start gap-3 px-4 py-3 min-h-[52px]
                ${idx < invoice.lineItems.length - 1 ? 'border-b border-border' : ''}`}
            >
              <TypeDot type={li.itemType} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-tx font-dm truncate">{li.description}</p>
                <p className="text-[12px] text-tx-2 font-dm capitalize">
                  {li.itemType} · qty {formatQty(li.quantityX100)}
                </p>
                <span
                  className={`inline-block mt-1 px-2 py-[2px] text-[11px] font-semibold rounded-[4px]
                    ${li.inventoryItemId
                      ? 'bg-green-bg text-green'
                      : 'bg-amber-bg text-amber'
                    }`}
                >
                  {li.inventoryItemId ? '✓ In inventory' : '⚠ Ad-hoc item'}
                </span>
              </div>
              <span
                className="font-syne font-bold text-[14px] text-tx tabular-nums shrink-0 mt-1"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {formatKobo((li.quantityX100 / 100) * li.unitPriceKobo)}
              </span>
            </div>
          ))}

          {/* Add item row */}
          <button
            onClick={() => setShowAddItem(true)}
            className="w-full flex items-center gap-2 px-4 py-3 min-h-[48px] bg-surface-2 text-[12px] font-semibold text-tx-2 font-dm hover:bg-border transition-colors duration-120 active:bg-border border-t border-border"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add item
          </button>
        </div>

        {/* Totals block */}
        <div className="bg-surface-2 rounded-input p-[14px] flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-[14px] text-tx-2 font-dm">Subtotal</span>
            <span className="text-[14px] text-tx font-dm tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatKobo(totalKobo)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[14px] text-tx-2 font-dm">Paid</span>
            <span className="text-[14px] text-green font-dm tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatKobo(paidKobo)}
            </span>
          </div>
          <div className="h-px bg-border my-1" />
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-semibold text-tx font-dm">Balance due</span>
            <span
              className={`font-syne font-bold text-[17px] tabular-nums ${balanceKobo <= 0 ? 'text-green' : 'text-amber'}`}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatKobo(balanceKobo)}
            </span>
          </div>
        </div>

        {/* Payment history */}
        {invoice.payments.length > 0 && (
          <>
            <SectionHeader label="Payment history" />
            <div className="bg-surface rounded-card shadow-card overflow-hidden">
              {invoice.payments.map((payment, idx) => {
                const isCredit = payment.paymentType === 'credit';
                const shortRef = payment.providerReference
                  ? payment.providerReference.slice(-8)
                  : null;
                const methodLabel = payment.method.replace(/_/g, ' ');
                return (
                  <div
                    key={payment.id}
                    className={`flex items-center gap-3 px-4 py-3 min-h-[52px]
                      ${idx < invoice.payments.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    {/* Icon */}
                    <div
                      className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: isCredit ? '#E8F6F1' : '#FEE8E8' }}
                    >
                      {isCredit ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#157A58" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                          <polyline points="17 6 23 6 23 12" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                          <polyline points="17 18 23 18 23 12" />
                        </svg>
                      )}
                    </div>

                    {/* Middle */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-tx font-dm">
                        {isCredit ? 'Payment received' : 'Reversal'}
                      </p>
                      <p className="text-[12px] text-tx-2 font-dm truncate">
                        {methodLabel} · {payment.internalReference}
                        {shortRef ? ` · …${shortRef}` : ''} · {payment.recordedAt}
                      </p>
                    </div>

                    {/* Amount */}
                    <span
                      className={`font-syne font-bold text-[15px] tabular-nums shrink-0 ${isCredit ? 'text-green' : 'text-red-600'}`}
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {isCredit ? '' : '−'}{formatKobo(payment.amountKobo)}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div style={{ height: 80 }} />
      </div>

      {/* Sticky CTA */}
      {status !== 'paid' && (
        <div className="fixed bottom-0 left-0 right-0 md:left-60 bg-surface border-t border-border px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] z-20">
          <button
            onClick={() => setShowPayment(true)}
            className="w-full h-14 bg-navy text-white font-syne font-semibold text-[15px] rounded-input active:scale-[0.98] transition-transform duration-100"
          >
            Record payment
          </button>
        </div>
      )}

      {showAddItem && (
        <AddItemSheet invoiceId={invoice.id} onClose={() => setShowAddItem(false)} />
      )}
      {showPayment && (
        <RecordPaymentSheet invoiceId={invoice.id} onClose={() => setShowPayment(false)} />
      )}
    </div>
  );
}
