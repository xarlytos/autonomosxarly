export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginFormData {
  email: string;
  pass: string;
}

export interface Swarm {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'stopped';
  agents: { active: number; total: number };
  progress: number;
  performance: 'excellent' | 'good' | 'average' | 'poor' | 'pending_review';
  tasks: Task[];
  metrics: Record<string, any>;
}

export interface Task {
  id: number;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  completion: number;
}

export interface KPIs {
  revenue: {
    current: number;
    target: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    history: { date: string; value: number }[];
  };
  profitability: {
    current: number;
    target: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  efficiency: {
    current: number;
    target: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  uptime: {
    current: number;
    target: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  activeClients: {
    current: number;
    total: number;
    percentage: number;
  };
  systemLoad: {
    current: number;
    trend: 'up' | 'down' | 'stable';
  };
  latency: {
    current: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface Event {
  id: number;
  time: string;
  source: string;
  message: string;
  timestamp: string;
}

export interface Opportunity {
  id: string;
  type: string;
  sector: string;
  probability: number;
  value: number;
  risk: string;
  description: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  action?: string;
  createdAt: string;
  read: boolean;
}

export type NegotiationStatus = 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'FAILED' | 'AUCTION';
export type AIStrategy = 'ANCHORING' | 'RECIPROCITY' | 'SCARCITY' | 'SOCIAL_PROOF' | 'AUTHORITY' | 'COMPROMISE';

export interface Offer {
  id: string;
  timestamp: string;
  from: 'US' | 'THEM';
  message: string;
  amount?: number;
  terms?: string;
  sentiment: number;
}

export interface Negotiation {
  id: string;
  counterparty: string;
  type: 'BUY' | 'SELL';
  product: string;
  amount: number;
  progress: number;
  status: NegotiationStatus;
  sentiment: number;
  zopaDetected: boolean;
  zopaRange?: { min: number; max: number };
  batna?: number;
  reservationPrice?: number;
  targetPrice?: number;
  offers?: Offer[];
  activeStrategies?: AIStrategy[];
}

// --- Financial Types ---
export type TransactionType = 'IN' | 'OUT';
export type TransactionStatus = 'VERIFIED' | 'PROCESSING' | 'FLAGGED' | 'PENDING';

export interface Transaction {
  id: string;
  concept: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  date: Date | string; // Allow string for serialization
  category: string;
  taxRule: string;
  account: string;
  confidence?: number;
  receipt?: string;
  aiAnalysis?: {
    category: string;
    confidence: number;
    taxDeductible: boolean;
    flags: string[];
  };
}

export interface FinancialMetrics {
  totalBalance: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netProfit: number;
  cashFlow: number;
  accountsReceivable: number;
  accountsPayable: number;
  taxLiability: number;
}

export type ViewMode = 'dashboard' | 'transactions' | 'invoices' | 'tax' | 'connect' | 'ledger' | 'payments' | 'reports' | 'escrow' | 'contacts';
export type PaymentNetwork = 'SWIFT' | 'SEPA' | 'LIGHTNING' | 'USDC' | 'ACH' | 'POLYGON' | 'ETH';
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'VIEWED';
export type EscrowStatus = 'HELD' | 'RELEASED' | 'DISPUTED' | 'REFUNDED' | 'ACTIVE';

// --- Email Hub Types ---
export interface EmailContact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string; // e.g. "Cliente VIP", "Proveedor"
}

export interface Email {
  id: string;
  from: EmailContact;
  to: EmailContact[];
  subject: string;
  preview: string;
  body: string; // HTML or Markdown
  timestamp: string; // ISO date
  read: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'archived' | 'trash' | 'drafts' | 'spam';
  tags: string[]; // e.g. ["Factura", "Urgente", "Proyecto X"]
  attachments?: { name: string; size: string; type: string }[];

  // Advanced Features
  tracking?: {
    openedAt?: string;
    clicks?: number;
  };
  threadId?: string;
  snoozedUntil?: string;
}

// --- CRM Contact Types ---
export type ContactType = 'CLIENT' | 'LEAD' | 'PARTNER' | 'COMPETITOR';
export type ContactStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | 'BLOCKED' | 'WARM' | 'COLD';

export interface Interaction {
  id: string;
  type: 'EMAIL' | 'CALL' | 'MEETING' | 'NOTE' | 'FUNNEL';
  direction?: 'INBOUND' | 'OUTBOUND';
  date: string;
  subject: string;
  details?: string;
  status?: 'COMPLETED' | 'SCHEDULED' | 'MISSED';
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  type: ContactType;
  status: ContactStatus;
  lastContact: string;
  tags: string[];
  avatar?: string;
  location?: string;
  social?: { linkedin?: string; twitter?: string; website?: string };
  ltv?: number; // Lifetime Value
  notes: string;
  history?: Interaction[]; // New field
  dealSize?: number; // For leads
  probability?: number; // For leads
  nextAction?: string;
  nextActionDate?: string;
}

// --- Calendar Types ---
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string; // Allow ISO string
  end: Date | string;
  type: 'MEETING' | 'CALL' | 'TASK' | 'DEADLINE';
  description?: string;
  contactId?: string; // Link to CRM
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  platform?: 'GOOGLE' | 'OUTLOOK' | 'INTERNAL'; // Sync status
}