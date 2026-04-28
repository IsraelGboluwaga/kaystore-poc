import { useNavigate } from 'react-router-dom';

interface Props {
  title: string;
  showBack?: boolean;
}

export function Topbar({ title, showBack = false }: Props) {
  const navigate = useNavigate();

  return (
    <header className="md:hidden sticky top-0 z-30 bg-surface border-b border-border h-[58px] flex items-center px-4">
      <div className="w-10">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 -ml-2 text-amber active:scale-95 transition-transform duration-100"
            aria-label="Go back"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </div>
      <h1 className="flex-1 text-center text-[16px] font-semibold text-tx font-sans">
        {title}
      </h1>
      <div className="w-10" />
    </header>
  );
}
