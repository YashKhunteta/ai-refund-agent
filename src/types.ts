export type CustomerTier = 'VIP' | 'Regular' | 'New';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  category: 'Apparel' | 'Electronics' | 'Digital' | 'Clearance' | 'Underwear' | 'Footwear' | 'Home';
  refundable: boolean;
  condition: 'Unused' | 'Worn' | 'Defective' | 'Damaged';
}

export interface Order {
  id: string;
  purchaseDate: string; // ISO format (e.g. 2026-06-01)
  deliveryDate: string;  // ISO format
  items: OrderItem[];
  total: number;
  shippingPaid: number;
  status: 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled';
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  tier: CustomerTier;
  joinDate: string;
  lifetimeValue: number;
  fraudRiskScore: number; // 0 (low) to 100 (high)
  refundHistoryCount: number; // refunds approved this year
  totalRefundAmountThisYear: number;
  notes: string;
  avatar: string;
  orders: Order[];
}

export interface AgentLog {
  id: string;
  timestamp: string;
  type: 'monologue' | 'tool_call' | 'tool_output' | 'decision' | 'error' | 'system';
  message: string;
  meta?: any;
}

export interface RefundDecision {
  status: 'Approved' | 'Denied' | 'Escalated';
  refundAmount: number;
  reason: string;
  policyReference: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent';
  text: string;
  timestamp: string;
  isVoice?: boolean;
}
