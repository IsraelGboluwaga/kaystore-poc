import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { computeInvoice } from '../utils/compute';
import { formatKobo } from '../utils/format';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { AmountDisplay } from '../components/AmountDisplay';
import { SectionHeader } from '../components/SectionHeader';
import { Topbar } from '../components/layout/Topbar';

const PERIOD_OPTIONS = [
  { label: 'This month', months: 1 },
  { label: '3 months',   months: 3 },
  { label: '6 months',   months: 6 },
  { label: '9 months',   months: 9 },
  { label: '12 months',  months: 12 },
  { label: '24 months',  months: 24 },
] as const;

// Hardcoded for POC: current date is April 2026
const CURRENT_MONTH_IDX = 3; // 0-based
const CURRENT_YEAR = 2026;

const MONTH_ABBR: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4,  Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function isWithinPeriod(recordedAt: string, months: number): boolean {
  const abbr = recordedAt.split(' ')[0];
  const monthIdx = MONTH_ABBR[abbr];
  if (monthIdx === undefined) return true;
  // Assume same year for all POC seed data
  const currentTotal = CURRENT_YEAR * 12 + CURRENT_MONTH_IDX;
  const paymentTotal = CURRENT_YEAR * 12 + monthIdx;
  return months === 1
    ? paymentTotal === currentTotal
    : currentTotal - paymentTotal < months;
}

export function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [selectedPeriodIdx, setSelectedPeriodIdx] = useState(0);

  const selectedPeriod = PERIOD_OPTIONS[selectedPeriodIdx];

  const computed = state.invoices.map((inv) => ({
    invoice: inv,
    ...computeInvoice(inv),
  }));

  const totalOutstanding = computed.reduce(
    (s, c) => (c.balanceKobo > 0 ? s + c.balanceKobo : s),
    0
  );

  const collectedKobo = state.invoices.reduce((sum, inv) => {
    return inv.payments.reduce((s, p) => {
      if (!isWithinPeriod(p.recordedAt, selectedPeriod.months)) return s;
      return p.paymentType === 'credit' ? s + p.amountKobo : s - p.amountKobo;
    }, sum);
  }, 0);

  const countUnpaid = computed.filter(
    (c) => c.status === 'open' || c.status === 'partial'
  ).length;

  const recentInvoices = [...computed].reverse();

  const periodSubLabel = selectedPeriod.months === 1
    ? 'this month'
    : selectedPeriod.label.toLowerCase();

  return (
    <>
      <Topbar title="Dashboard" />
      <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-4">
        {/* Hero card */}
        <div className="bg-navy rounded-card p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-amber font-sans mb-2">
            Total outstanding
          </p>
          <p
            className="font-display font-extrabold text-white leading-none text-[32px] md:text-[40px]"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {formatKobo(totalOutstanding)}
          </p>
        </div>

        {/* Period filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          {PERIOD_OPTIONS.map((opt, idx) => (
            <button
              key={opt.label}
              onClick={() => setSelectedPeriodIdx(idx)}
              className={`shrink-0 h-9 px-4 rounded-input text-[13px] font-semibold font-sans transition-colors duration-120
                ${idx === selectedPeriodIdx
                  ? 'bg-amber-bg text-amber border border-amber-border'
                  : 'bg-surface-2 text-tx-2 border border-transparent hover:border-border'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Stat grid — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Collected */}
          <div className="bg-surface rounded-[10px] shadow-card p-4 flex flex-col gap-1">
            <span
              className="font-display font-extrabold text-[22px] leading-none text-green truncate"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatKobo(Math.max(0, collectedKobo))}
            </span>
            <span className="text-[11px] text-tx-2 font-sans">Collected · {periodSubLabel}</span>
          </div>

          {/* Outstanding */}
          <div className="bg-surface rounded-[10px] shadow-card p-4 flex flex-col gap-1">
            <span
              className="font-display font-extrabold text-[22px] leading-none text-amber truncate"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatKobo(totalOutstanding)}
            </span>
            <span className="text-[11px] text-tx-2 font-sans">Outstanding</span>
          </div>

          {/* Invoices */}
          <div className="bg-surface rounded-[10px] shadow-card p-4 flex flex-col gap-1">
            <span
              className="font-display font-extrabold text-[26px] leading-none text-tx"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {state.invoices.length}
            </span>
            <span className="text-[11px] text-tx-2 font-sans">Invoices</span>
          </div>

          {/* Unpaid */}
          <div className="bg-surface rounded-[10px] shadow-card p-4 flex flex-col gap-1">
            <span
              className="font-display font-extrabold text-[26px] leading-none text-amber"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {countUnpaid}
            </span>
            <span className="text-[11px] text-tx-2 font-sans">Unpaid</span>
          </div>
        </div>

        {/* Recent invoices */}
        <SectionHeader label="Recent invoices" />
        <div className="bg-surface rounded-card shadow-card overflow-hidden">
          {recentInvoices.map(({ invoice, balanceKobo, status }, idx) => {
            const client = state.clients.find((c) => c.id === invoice.clientId);
            if (!client) return null;
            return (
              <button
                key={invoice.id}
                onClick={() => navigate(`/invoices/${invoice.id}`)}
                className={`w-full flex items-center gap-3 px-4 py-3 min-h-[54px] text-left hover:bg-surface-2 active:bg-surface-2 transition-colors duration-120
                  ${idx < recentInvoices.length - 1 ? 'border-b border-border' : ''}`}
                style={{
                  animation: `fadeSlideUp 200ms ease both`,
                  animationDelay: `${Math.min(idx, 4) * 40}ms`,
                }}
              >
                <Avatar name={client.name} color={client.avatarColor} size={38} />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-tx font-sans truncate">{client.name}</p>
                  <p className="text-[12px] text-tx-2 font-sans">{invoice.invoiceNumber} · {invoice.date}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge status={status} />
                  <AmountDisplay
                    kobo={balanceKobo}
                    className={`font-bold text-[16px] ${
                      status === 'paid' ? 'text-green' : status === 'partial' ? 'text-blue' : 'text-amber'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </>
  );
}
