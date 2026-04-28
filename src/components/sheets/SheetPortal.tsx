import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export function SheetPortal({ onClose, children, title }: Props) {
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger entrance animation on next frame
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center"
      style={{
        background: 'rgba(13,43,78,0.5)',
        backdropFilter: 'blur(4px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 200ms',
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={sheetRef}
        className="w-full md:max-w-[480px] bg-surface md:rounded-[16px] rounded-t-[24px] overflow-hidden"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 280ms cubic-bezier(0.32, 1.15, 0.58, 1)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile only) */}
        <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-[17px] font-semibold text-tx font-sans">{title}</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-tx-2 hover:bg-surface-2 transition-colors duration-120"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
