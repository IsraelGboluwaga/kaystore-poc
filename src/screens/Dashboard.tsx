import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { computeInvoice } from '../utils/compute';
import { formatKobo } from '../utils/format';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { AmountDisplay } from '../components/AmountDisplay';
import { SectionHeader } from '../components/SectionHeader';
import { Topbar } from '../components/layout/Topbar';

export function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();

  const computed = state.invoices.map((inv) => ({
    invoice: inv,
    ...computeInvoice(inv),
  }));

  const totalOutstanding = computed.reduce(
    (s, c) => (c.balanceKobo > 0 ? s + c.balanceKobo : s),
    0
  );

  const countOpen = computed.filter((c) => c.status === 'open').length;
  const countPartial = computed.filter((c) => c.status === 'partial').length;
  const countPaid = computed.filter((c) => c.status === 'paid').length;

  const recentInvoices = [...computed].reverse();

  return (
    <>
      <Topbar title="Dashboard" />
      <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-4">
        {/* Hero card */}
        <div className="bg-navy rounded-card p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-amber font-dm mb-2">
            Total outstanding
          </p>
          <p
            className="font-syne font-extrabold text-white tabular-nums leading-none mb-3"
            style={{
              fontSize: 'clamp(32px, 8vw, 44px)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatKobo(totalOutstanding)}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[12px] text-white/45 font-dm">
              <span className="w-2 h-2 rounded-full bg-amber" />
              {countOpen} unpaid
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-white/45 font-dm">
              <span className="w-2 h-2 rounded-full bg-blue" />
              {countPartial} partial
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-white/45 font-dm">
              <span className="w-2 h-2 rounded-full bg-green" />
              {countPaid} paid
            </span>
          </div>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Clients', value: state.clients.length, amber: false },
            { label: 'Invoices', value: state.invoices.length, amber: false },
            { label: 'Unpaid', value: countOpen + countPartial, amber: true },
          ].map(({ label, value, amber }) => (
            <div key={label} className="bg-surface rounded-[10px] shadow-card p-4 flex flex-col gap-1">
              <span
                className={`font-syne font-extrabold text-[26px] leading-none ${amber ? 'text-amber' : 'text-tx'}`}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {value}
              </span>
              <span className="text-[11px] text-tx-2 font-dm">{label}</span>
            </div>
          ))}
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
                  <p className="text-[15px] font-semibold text-tx font-dm truncate">{client.name}</p>
                  <p className="text-[12px] text-tx-2 font-dm">{invoice.invoiceNumber} · {invoice.date}</p>
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
