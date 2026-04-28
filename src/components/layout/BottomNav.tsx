import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/useApp';
import { computeInvoice } from '../../utils/compute';

function GridIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: GridIcon },
  { to: '/clients', label: 'Clients', Icon: UsersIcon },
  { to: '/invoices', label: 'Invoices', Icon: FileTextIcon },
];

export function BottomNav() {
  const { state } = useApp();
  const hasUnpaid = state.invoices.some(
    (inv) => computeInvoice(inv).status !== 'paid'
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] relative transition-colors duration-120
              ${isActive ? 'text-navy' : 'text-tx-3'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon />
                <span className="text-[11px] font-medium font-sans">{label}</span>
                {label === 'Invoices' && hasUnpaid && (
                  <span
                    className="absolute top-2 right-[calc(50%-14px)] w-2 h-2 rounded-full bg-amber"
                  />
                )}
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-amber" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
