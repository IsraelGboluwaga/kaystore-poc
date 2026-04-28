import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './screens/Dashboard';
import { ClientList } from './screens/ClientList';
import { InvoiceList } from './screens/InvoiceList';
import { InvoiceDetail } from './screens/InvoiceDetail';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
