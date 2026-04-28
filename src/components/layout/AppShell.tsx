import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-parchment font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
