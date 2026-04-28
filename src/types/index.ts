export type ItemType = 'part' | 'labour' | 'service' | 'other';
export type PaymentType = 'credit' | 'debit';
export type PaymentMethod = 'bank_transfer' | 'cash' | 'pos';
export type InvoiceStatus = 'open' | 'partial' | 'paid';

export interface Client {
  id: string;
  name: string;
  phone: string;
  companyName: string | null;
  companyEmail: string | null;
  avatarColor: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  unitPriceKobo: number;
  stockQuantity: number;
}

export interface LineItem {
  id: string;
  invoiceId: string;
  inventoryItemId: string | null;
  itemType: ItemType;
  description: string;
  quantityX100: number;
  unitPriceKobo: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  paymentType: PaymentType;
  amountKobo: number;
  method: PaymentMethod;
  providerReference: string | null;
  internalReference: string;
  recordedAt: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  invoiceNumber: string;
  notes: string;
  date: string;
  lineItems: LineItem[];
  payments: Payment[];
}
