import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { computeInvoice } from '../utils/compute';
import type { InvoiceStatus } from '../types';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { AmountDisplay } from '../components/AmountDisplay';
import { Topbar } from '../components/layout/Topbar';

type StatusFilter = 'all' | InvoiceStatus;

const STATUS_PILLS: { value: StatusFilter; label: string }[] = [
  { value: 'all',     label: 'All'     },
  { value: 'open',    label: 'Unpaid'  },
  { value: 'partial', label: 'Partial' },
  { value: 'paid',    label: 'Paid'    },
];

export function InvoiceList() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const reversed = [...state.invoices].reverse();

  const filtered = reversed.filter((inv) => {
    const q = search.toLowerCase();
    const client = state.clients.find((c) => c.id === inv.clientId);
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(q) ||
      (client?.name.toLowerCase().includes(q) ?? false);

    const status = computeInvoice(inv).status;
    const matchesStatus = statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Topbar title="Invoices" />
      <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by client or invoice number…"
          className="w-full h-12 px-4 rounded-input bg-surface text-tx text-[15px] font-sans border border-border focus:border-amber-border focus:bg-amber-bg outline-none transition-colors shadow-card"
        />

        {/* Status filter pills */}
        <div className="flex gap-2">
          {STATUS_PILLS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-[14px] py-[6px] rounded-badge text-[13px] font-semibold font-sans transition-colors duration-120
                ${statusFilter === value
                  ? 'bg-amber-bg text-amber border border-amber-border'
                  : 'bg-surface-2 text-tx-2 border border-transparent'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[40px] gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-tx-3">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-[14px] text-tx-2 font-sans">No invoices match your filters</p>
          </div>
        ) : (
          <div className="bg-surface rounded-card shadow-card overflow-hidden">
            {filtered.map((invoice, idx) => {
              const client = state.clients.find((c) => c.id === invoice.clientId);
              if (!client) return null;
              const { balanceKobo, status } = computeInvoice(invoice);
              return (
                <button
                  key={invoice.id}
                  onClick={() => navigate(`/invoices/${invoice.id}`)}
                  className={`w-full flex items-center gap-3 px-4 py-3 min-h-[54px] text-left hover:bg-surface-2 active:bg-surface-2 transition-colors duration-120
                    ${idx < filtered.length - 1 ? 'border-b border-border' : ''}`}
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
        )}
      </main>
    </>
  );
}
