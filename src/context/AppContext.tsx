import React, { createContext, useReducer } from 'react';
import type { Invoice, LineItem, Payment, Client, InventoryItem } from '../types';
import { SEED_CLIENTS, SEED_INVENTORY, SEED_INVOICES } from '../data/seed';

interface AppState {
  invoices: Invoice[];
  clients: Client[];
  inventory: InventoryItem[];
}

type AppAction =
  | { type: 'ADD_LINE_ITEM'; invoiceId: string; item: LineItem }
  | { type: 'ADD_PAYMENT'; invoiceId: string; payment: Payment };

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_LINE_ITEM':
      return {
        ...state,
        invoices: state.invoices.map((inv) =>
          inv.id === action.invoiceId
            ? { ...inv, lineItems: [...inv.lineItems, action.item] }
            : inv
        ),
      };
    case 'ADD_PAYMENT':
      return {
        ...state,
        invoices: state.invoices.map((inv) =>
          inv.id === action.invoiceId
            ? { ...inv, payments: [...inv.payments, action.payment] }
            : inv
        ),
      };
    default:
      return state;
  }
}

const initialState: AppState = {
  invoices: SEED_INVOICES,
  clients: SEED_CLIENTS,
  inventory: SEED_INVENTORY,
};

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
