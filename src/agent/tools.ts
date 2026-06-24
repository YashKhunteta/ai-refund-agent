import { CRM_DATA } from '../data/crm';
import { REFUND_POLICY_TEXT } from '../data/policy';
import { CustomerProfile, Order, OrderItem } from '../types';

// In-memory active CRM data that can be updated during runtime
export let mutableCrmData: CustomerProfile[] = JSON.parse(JSON.stringify(CRM_DATA));

export function resetCrmData() {
  mutableCrmData = JSON.parse(JSON.stringify(CRM_DATA));
}

// Current date assumed by the app
export const CURRENT_DATE = new Date("2026-06-19T12:00:00Z");

/**
 * Calculates the difference in days between two ISO date strings
 */
export function getDaysDiff(date1Str: string, date2Str: string): number {
  const d1 = new Date(date1Str);
  const d2 = new Date(date2Str);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Tool: Fetch Customer Profile & History
 */
export function getCustomerProfile(customerId: string): { profile: CustomerProfile | null; error?: string } {
  const profile = mutableCrmData.find(c => c.id.toUpperCase() === customerId.toUpperCase());
  if (!profile) {
    return { profile: null, error: `Customer with ID ${customerId} not found.` };
  }
  return { profile };
}

/**
 * Tool: Fetch Order Details
 */
export function getOrderDetails(orderId: string): { order: Order | null; customerId: string | null; error?: string } {
  for (const customer of mutableCrmData) {
    const order = customer.orders.find(o => o.id.toUpperCase() === orderId.toUpperCase());
    if (order) {
      return { order, customerId: customer.id };
    }
  }
  return { order: null, customerId: null, error: `Order with ID ${orderId} not found.` };
}

/**
 * Tool: Fetch Policy Guidelines (Text representation)
 */
export function getPolicyGuidelines(): string {
  return REFUND_POLICY_TEXT;
}

/**
 * Tool: Validate Policy Rules
 * This implements the strict refund logic based on policy guidelines and customer details.
 */
export function validateRefundPolicy(
  customerId: string,
  orderId: string,
  itemId: string
): {
  eligible: boolean;
  action: 'Approve' | 'Deny' | 'Escalate';
  refundAmount: number;
  refundShipping: boolean;
  reason: string;
  policyReference: string;
} {
  const customerResult = getCustomerProfile(customerId);
  const orderResult = getOrderDetails(orderId);

  if (!customerResult.profile) {
    return {
      eligible: false,
      action: 'Deny',
      refundAmount: 0,
      refundShipping: false,
      reason: `Customer ID ${customerId} invalid`,
      policyReference: 'Section 5. Security & Refund Abuse Safeguards'
    };
  }

  if (!orderResult.order) {
    return {
      eligible: false,
      action: 'Deny',
      refundAmount: 0,
      refundShipping: false,
      reason: `Order ID ${orderId} not found`,
      policyReference: 'Section 1. General Return Window'
    };
  }

  const customer = customerResult.profile;
  const order = orderResult.order;
  const item = order.items.find(i => i.id.toUpperCase() === itemId.toUpperCase());

  if (!item) {
    return {
      eligible: false,
      action: 'Deny',
      refundAmount: 0,
      refundShipping: false,
      reason: `Item ID ${itemId} is not part of Order ${orderId}`,
      policyReference: 'Section 1. General Return Window'
    };
  }

  // --- 1. Security & Abuse Safeguards Check ---
  if (customer.fraudRiskScore > 75) {
    return {
      eligible: false,
      action: 'Escalate',
      refundAmount: 0,
      refundShipping: false,
      reason: `Fraud risk score of ${customer.fraudRiskScore} exceeds security limit (75).`,
      policyReference: 'Section 5. Security & Refund Abuse Safeguards'
    };
  }

  if (customer.refundHistoryCount >= 3) {
    return {
      eligible: false,
      action: 'Escalate',
      refundAmount: 0,
      refundShipping: false,
      reason: `Customer reached the maximum limit of 3 refunds this year. Currently at ${customer.refundHistoryCount}.`,
      policyReference: 'Section 5. Security & Refund Abuse Safeguards (Refund Frequency Limit)'
    };
  }

  // --- 2. Category Exclusions Check ---
  if (item.category === 'Clearance') {
    return {
      eligible: false,
      action: 'Deny',
      refundAmount: 0,
      refundShipping: false,
      reason: `Clearance item '${item.name}' is Final Sale and cannot be refunded.`,
      policyReference: 'Section 3. Product Category Exclusions (Clearance)'
    };
  }

  if (item.category === 'Underwear') {
    return {
      eligible: false,
      action: 'Deny',
      refundAmount: 0,
      refundShipping: false,
      reason: `Underwear/Swimwear item '${item.name}' is excluded from refunds due to hygiene regulations.`,
      policyReference: 'Section 3. Product Category Exclusions (Underwear & Swimwear)'
    };
  }

  if (item.category === 'Digital') {
    return {
      eligible: false,
      action: 'Deny',
      refundAmount: 0,
      refundShipping: false,
      reason: `Digital item '${item.name}' is non-refundable once delivered.`,
      policyReference: 'Section 3. Product Category Exclusions (Digital Products)'
    };
  }

  // --- 3. Condition check ---
  const isDefectiveOrDamaged = item.condition === 'Defective' || item.condition === 'Damaged';
  
  if (item.condition === 'Worn') {
    return {
      eligible: false,
      action: 'Deny',
      refundAmount: 0,
      refundShipping: false,
      reason: `Item '${item.name}' condition is Worn. Refund requires Unused condition with tags.`,
      policyReference: 'Section 2. Product Condition Requirements (Worn or Opened Items)'
    };
  }

  // --- 4. Return Window Check ---
  const deliveryDate = new Date(order.deliveryDate);
  const diffTime = CURRENT_DATE.getTime() - deliveryDate.getTime();
  const daysSinceDelivery = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const standardLimit = isDefectiveOrDamaged ? 90 : 30;

  if (daysSinceDelivery <= standardLimit) {
    // Valid standard return window
    const amount = item.price;
    // Shipping is only refunded if defective/damaged
    const refundShipping = isDefectiveOrDamaged && order.shippingPaid > 0;
    const finalAmount = amount + (refundShipping ? order.shippingPaid : 0);

    return {
      eligible: true,
      action: 'Approve',
      refundAmount: finalAmount,
      refundShipping,
      reason: isDefectiveOrDamaged
        ? `Approved: Item is ${item.condition} and reported within the 90-day defective return window (${daysSinceDelivery} days ago).`
        : `Approved: Item is Unused and request is within the standard 30-day return window (${daysSinceDelivery} days ago).`,
      policyReference: isDefectiveOrDamaged 
        ? 'Section 2. Product Condition Requirements (Defective/Damaged)'
        : 'Section 1. General Return Window'
    };
  }

  // --- 5. VIP Courtesy Exceptions ---
  if (customer.tier === 'VIP' && !isDefectiveOrDamaged) {
    const vipLimit = 45;
    const maxAmountForCourtesy = 150;

    if (daysSinceDelivery <= vipLimit) {
      if (item.price <= maxAmountForCourtesy) {
        return {
          eligible: true,
          action: 'Approve',
          refundAmount: item.price,
          refundShipping: false,
          reason: `Approved: VIP Courtesy Extension applied. Request was made ${daysSinceDelivery} days ago (limit 45 days) for an item under $150 ($${item.price}).`,
          policyReference: 'Section 4. Customer Tier Adjustments (VIP Courtesy Window)'
        };
      } else {
        return {
          eligible: false,
          action: 'Deny',
          refundAmount: 0,
          refundShipping: false,
          reason: `Denied: Item price ($${item.price}) exceeds the maximum threshold ($150) for VIP courtesy extensions. Request was made ${daysSinceDelivery} days ago.`,
          policyReference: 'Section 4. Customer Tier Adjustments (VIP Courtesy Window)'
        };
      }
    }
  }

  // If we reach here, it is outside the return window
  return {
    eligible: false,
    action: 'Deny',
    refundAmount: 0,
    refundShipping: false,
    reason: `Denied: Return window has expired. Request made ${daysSinceDelivery} days after delivery (limit ${standardLimit} days).`,
    policyReference: isDefectiveOrDamaged 
      ? 'Section 2. Product Condition Requirements (Defective/Damaged)'
      : 'Section 1. General Return Window'
  };
}

/**
 * Tool: Process Refund Transaction
 * Writes the refund approval to the CRM database in memory.
 */
export function processRefundTransaction(
  customerId: string,
  orderId: string,
  itemId: string,
  amount: number
): { success: boolean; txnId: string; profile: CustomerProfile } {
  const profileIndex = mutableCrmData.findIndex(c => c.id === customerId);
  if (profileIndex === -1) {
    throw new Error(`Customer ID ${customerId} not found`);
  }

  const profile = mutableCrmData[profileIndex];
  
  // Mark the order item as refunded (modify status or notes)
  const order = profile.orders.find(o => o.id === orderId);
  if (order) {
    order.status = 'Processing';
  }

  // Increment refund history count
  profile.refundHistoryCount += 1;
  profile.totalRefundAmountThisYear += amount;
  profile.lifetimeValue = Math.max(0, profile.lifetimeValue - amount);

  const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
  profile.notes += `\n[${CURRENT_DATE.toISOString().split('T')[0]}] Approved refund of $${amount.toFixed(2)} for item ${itemId} (Txn: ${txnId})`;

  return {
    success: true,
    txnId,
    profile
  };
}

/**
 * Tool: Log Denial
 */
export function logDenialTransaction(
  customerId: string,
  orderId: string,
  itemId: string,
  reason: string
): { success: boolean; profile: CustomerProfile } {
  const profileIndex = mutableCrmData.findIndex(c => c.id === customerId);
  if (profileIndex === -1) {
    throw new Error(`Customer ID ${customerId} not found`);
  }

  const profile = mutableCrmData[profileIndex];
  profile.notes += `\n[${CURRENT_DATE.toISOString().split('T')[0]}] Refund request denied for item ${itemId} in order ${orderId}. Reason: ${reason}`;

  return {
    success: true,
    profile
  };
}

/**
 * Tool: Escalate to Human
 */
export function escalateTransaction(
  customerId: string,
  orderId: string,
  reason: string
): { success: boolean; profile: CustomerProfile } {
  const profileIndex = mutableCrmData.findIndex(c => c.id === customerId);
  if (profileIndex === -1) {
    throw new Error(`Customer ID ${customerId} not found`);
  }

  const profile = mutableCrmData[profileIndex];
  profile.notes += `\n[${CURRENT_DATE.toISOString().split('T')[0]}] Refund request escalated to human supervisor for order ${orderId}. Reason: ${reason}`;

  return {
    success: true,
    profile
  };
}
