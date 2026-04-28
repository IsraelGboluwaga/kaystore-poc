import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { computeInvoice } from '../utils/compute';
import { Avatar } from '../components/Avatar';
import { AmountDisplay } from '../components/AmountDisplay';
import { Topbar } from '../components/layout/Topbar';

export function ClientList() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = state.clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.companyName?.toLowerCase().includes(q) ?? false)
    );
  });

  const clientStats = (clientId: string) => {
    const clientInvoices = state.invoices.filter((inv) => inv.clientId === clientId);
    const outstanding = clientInvoices.reduce((s, inv) => {
      const { balanceKobo } = computeInvoice(inv);
      return balanceKobo > 0 ? s + balanceKobo : s;
    }, 0);
    return { outstanding, count: clientInvoices.length };
  };

  const handleClientTap = (clientId: string) => {
    const first = state.invoices.find((inv) => inv.clientId === clientId);
    if (first) navigate(`/invoices/${first.id}`);
  };

  return (
    <>
      <Topbar title="Clients" />
      <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients…"
          className="w-full h-12 px-4 rounded-input bg-surface text-tx text-[15px] font-sans border border-border focus:border-amber-border focus:bg-amber-bg outline-none transition-colors shadow-card"
        />

        <div className="bg-surface rounded-card shadow-card overflow-hidden">
          {filtered.map((client, idx) => {
            const { outstanding, count } = clientStats(client.id);
            return (
              <button
                key={client.id}
                onClick={() => handleClientTap(client.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 min-h-[56px] text-left hover:bg-surface-2 active:bg-surface-2 transition-colors duration-120
                  ${idx < filtered.length - 1 ? 'border-b border-border' : ''}`}
              >
                <Avatar name={client.name} color={client.avatarColor} size={42} />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-tx font-sans truncate">{client.name}</p>
                  <p className="text-[12px] text-tx-2 font-sans truncate">
                    {client.companyName ?? 'Individual'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <AmountDisplay
                    kobo={outstanding}
                    className="font-bold text-[15px] text-amber"
                  />
                  <span className="text-[12px] text-tx-3 font-sans">
                    {count} invoice{count !== 1 ? 's' : ''}
                  </span>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-[14px] text-tx-2 font-sans text-center">
              No clients match "{search}"
            </p>
          )}
        </div>
      </main>
    </>
  );
}
