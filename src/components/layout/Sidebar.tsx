import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/useApp';
import { computeInvoice } from '../../utils/compute';

function AnchorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="8" x2="12" y2="21" />
      <path d="M5 15H2a10 10 0 0 0 20 0h-3" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export function Sidebar() {
  const { state } = useApp();
  const hasUnpaid = state.invoices.some(
    (inv) => computeInvoice(inv).status !== 'paid'
  );

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-navy shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="w-[34px] h-[34px] rounded-input bg-amber flex items-center justify-center text-white shrink-0">
          <AnchorIcon />
        </div>
        <span className="font-display font-bold text-white text-[17px] leading-tight">
          Marine Depot
        </span>
      </div>

      {/* Nav section label */}
      <p className="px-5 mb-2 text-[11px] font-semibold uppercase tracking-[0.6px] text-white/40 font-sans">
        Navigation
      </p>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-[11px] rounded-input text-[14px] font-medium font-sans transition-colors duration-120 relative
              ${isActive
                ? 'bg-white/10 text-white border-l-[3px] border-amber pl-[9px]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon />
            <span>{label}</span>
            {label === 'Invoices' && hasUnpaid && (
              <span className="ml-auto w-2 h-2 rounded-full bg-amber" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom meta */}
      <div className="px-5 py-5 border-t border-white/10">
        <p className="text-[13px] font-semibold text-white font-sans">Marine Supply Depot</p>
        <p className="text-[12px] text-white/40 font-sans mt-0.5">Lagos, Nigeria</p>
      </div>
    </aside>
  );
}
