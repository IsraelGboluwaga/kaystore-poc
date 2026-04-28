import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { computeInvoice } from '../utils/compute';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { AmountDisplay } from '../components/AmountDisplay';
import { Topbar } from '../components/layout/Topbar';

export function InvoiceList() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const reversed = [...state.invoices].reverse();

  const filtered = reversed.filter((inv) => {
    const q = search.toLowerCase();
    const client = state.clients.find((c) => c.id === inv.clientId);
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      (client?.name.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <>
      <Topbar title="Invoices" />
      <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by client or invoice number…"
          className="w-full h-12 px-4 rounded-input bg-surface text-tx text-[15px] font-sans border border-border focus:border-amber-border focus:bg-amber-bg outline-none transition-colors shadow-card"
        />

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
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-[14px] text-tx-2 font-sans text-center">
              No invoices match "{search}"
            </p>
          )}
        </div>
      </main>
    </>
  );
}
