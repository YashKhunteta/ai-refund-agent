import { AgentLog, ChatMessage, RefundDecision } from '../types';
import { LLMConfig, callGemini, callOpenAI, AGENT_TOOLS_DECLARATIONS } from './llm';
import {
  getCustomerProfile,
  getOrderDetails,
  getPolicyGuidelines,
  validateRefundPolicy,
  processRefundTransaction,
  logDenialTransaction,
  escalateTransaction,
  mutableCrmData
} from './tools';

/**
 * Helper to delay execution (mimics LLM thinking latency in simulator mode)
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * The main agent loop executor
 */
export async function runAgentLoop(
  customerMessage: string,
  customerId: string,
  history: ChatMessage[],
  config: LLMConfig,
  onLog: (log: AgentLog) => void,
  onUpdateCrm: () => void
): Promise<{ text: string; action: 'Approve' | 'Deny' | 'Escalate' | 'None'; refundAmount: number }> {
  
  const timestamp = () => new Date().toISOString();
  const logId = () => `log-${Math.floor(Math.random() * 1000000)}`;

  // ==========================================
  // 1. HIGH-FIDELITY SIMULATOR MODE
  // ==========================================
  if (config.provider === 'simulator') {
    onLog({
      id: logId(),
      timestamp: timestamp(),
      type: 'monologue',
      message: `Analyzing incoming message from customer ${customerId}: "${customerMessage}"`
    });
    await delay(700);

    // STEP 1: Fetch Customer Profile
    onLog({
      id: logId(),
      timestamp: timestamp(),
      type: 'tool_call',
      message: `Calling tool: getCustomerProfile({ customerId: "${customerId}" })`
    });
    await delay(600);

    const customerResult = getCustomerProfile(customerId);
    if (!customerResult.profile) {
      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'error',
        message: `Tool output error: Customer profile not found.`
      });
      return {
        text: "I'm sorry, I couldn't find your profile in our records. Could you please verify your customer ID?",
        action: 'None',
        refundAmount: 0
      };
    }

    const customer = customerResult.profile;
    onLog({
      id: logId(),
      timestamp: timestamp(),
      type: 'tool_output',
      message: `Tool output: Found profile for ${customer.name} (Tier: ${customer.tier}, Risk: ${customer.fraudRiskScore}%, Refunds this year: ${customer.refundHistoryCount})`
    });
    await delay(700);

    // STEP 2: Fetch Order Details
    // We try to search if customer message contains an Order ID (like ORD-XXXX)
    const orderMatch = customerMessage.match(/ORD-\d+/i);
    let orderId = '';
    
    if (orderMatch) {
      orderId = orderMatch[0].toUpperCase();
    } else if (customer.orders.length > 0) {
      orderId = customer.orders[0].id; // Fallback to their most recent order
    } else {
      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'monologue',
        message: `Unable to identify order ID from customer request, and customer has no orders. Escalating.`
      });
      return {
        text: "I see your account, but I don't see any orders listed in your profile. Could you provide your Order ID (e.g., ORD-XXXX)?",
        action: 'None',
        refundAmount: 0
      };
    }

    onLog({
      id: logId(),
      timestamp: timestamp(),
      type: 'monologue',
      message: `Identified target order as ${orderId}. Querying database for order status and details.`
    });
    await delay(700);

    onLog({
      id: logId(),
      timestamp: timestamp(),
      type: 'tool_call',
      message: `Calling tool: getOrderDetails({ orderId: "${orderId}" })`
    });
    await delay(600);

    const orderResult = getOrderDetails(orderId);
    if (!orderResult.order) {
      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'error',
        message: `Tool output error: Order ID ${orderId} does not exist.`
      });
      return {
        text: `I apologize, but I couldn't find any record for Order ID ${orderId}. Please double-check your order number.`,
        action: 'None',
        refundAmount: 0
      };
    }

    const order = orderResult.order;
    onLog({
      id: logId(),
      timestamp: timestamp(),
      type: 'tool_output',
      message: `Tool output: Order ${order.id} found (Delivered on ${order.deliveryDate}, Total: $${order.total.toFixed(2)}, Items count: ${order.items.length})`
    });
    await delay(700);

    // Get the item. In our CRM, each order has items. Let's process the first item.
    const item = order.items[0];
    if (!item) {
      return {
        text: "It looks like this order has no items. I cannot process a refund.",
        action: 'None',
        refundAmount: 0
      };
    }

    onLog({
      id: logId(),
      timestamp: timestamp(),
      type: 'monologue',
      message: `Evaluating item details: "${item.name}" (Category: ${item.category}, Condition: ${item.condition}, Price: $${item.price.toFixed(2)}). Checking against GuardRefund global policy.`
    });
    await delay(800);

    // STEP 3: Check Policy Guidelines
    onLog({
      id: logId(),
      timestamp: timestamp(),
      type: 'tool_call',
      message: `Calling tool: getPolicyGuidelines()`
    });
    await delay(500);
    onLog({
      id: logId(),
      timestamp: timestamp(),
      type: 'tool_output',
      message: `Tool output: Policy retrieved (active status, rules on return windows, category restrictions, VIP tier offsets, and fraud thresholds).`
    });
    await delay(700);

    // STEP 4: Validate Policy Rules
    onLog({
      id: logId(),
      timestamp: timestamp(),
      type: 'tool_call',
      message: `Calling tool: validateRefundPolicy({ customerId: "${customer.id}", orderId: "${order.id}", itemId: "${item.id}" })`
    });
    await delay(800);

    const validation = validateRefundPolicy(customer.id, order.id, item.id);
    onLog({
      id: logId(),
      timestamp: timestamp(),
      type: 'tool_output',
      message: `Tool output: Validation result - Eligible: ${validation.eligible}, Action: ${validation.action}, Amount: $${validation.refundAmount.toFixed(2)}, Reason: "${validation.reason}"`
    });
    await delay(800);

    // STEP 5: Finalize Transactions and Database Write
    if (validation.action === 'Approve') {
      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'monologue',
        message: `Policy validation passed. Initiating processRefundTransaction to credit customer account and update CRM database.`
      });
      await delay(700);

      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'tool_call',
        message: `Calling tool: processRefundTransaction({ customerId: "${customer.id}", orderId: "${order.id}", itemId: "${item.id}", amount: ${validation.refundAmount} })`
      });
      await delay(600);

      const txn = processRefundTransaction(customer.id, order.id, item.id, validation.refundAmount);
      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'tool_output',
        message: `Tool output: Transaction committed successfully. Transaction ID: ${txn.txnId}`
      });
      await delay(600);

      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'decision',
        message: `Decision finalized: APPROVED refund of $${validation.refundAmount.toFixed(2)} under Txn ${txn.txnId}`
      });
      onUpdateCrm();

      const returnText = `Hello ${customer.name}, I have checked your order details and confirmed that your return request complies with our refund policy. I have processed a refund of **$${validation.refundAmount.toFixed(2)}** ${validation.refundShipping ? "(including original shipping charges) " : ""}for the **${item.name}** under Transaction ID **${txn.txnId}**. The funds will appear in your account in 3–5 business days. Let me know if you need anything else!`;

      return {
        text: returnText,
        action: 'Approve',
        refundAmount: validation.refundAmount
      };
    } else if (validation.action === 'Escalate') {
      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'monologue',
        message: `Policy validation triggers Escalation. Reason: "${validation.reason}". Logging to CRM notes and notifying supervisor.`
      });
      await delay(700);

      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'tool_call',
        message: `Calling tool: escalateTransaction({ customerId: "${customer.id}", orderId: "${order.id}", reason: "${validation.reason}" })`
      });
      await delay(600);

      escalateTransaction(customer.id, order.id, validation.reason);
      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'tool_output',
        message: `Tool output: Case escalated. Ticket created for human manager review.`
      });
      await delay(600);

      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'decision',
        message: `Decision finalized: ESCALATED case to Human Supervisor. Policy: ${validation.policyReference}`
      });
      onUpdateCrm();

      const returnText = `Hello ${customer.name}, I see your request for a refund on order **${order.id}** (${item.name}). Due to security checkpoints in our system (specifically ${validation.policyReference}), I cannot process this refund automatically. I have escalated your ticket to our customer support supervisor for manual review. They will contact you shortly via email (${customer.email}) within 24 hours.`;

      return {
        text: returnText,
        action: 'Escalate',
        refundAmount: 0
      };
    } else {
      // DENIED
      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'monologue',
        message: `Policy validation failed. Denying refund request. Reason: "${validation.reason}". Writing log entry to CRM notes.`
      });
      await delay(700);

      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'tool_call',
        message: `Calling tool: logDenialTransaction({ customerId: "${customer.id}", orderId: "${order.id}", itemId: "${item.id}", reason: "${validation.reason}" })`
      });
      await delay(600);

      logDenialTransaction(customer.id, order.id, item.id, validation.reason);
      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'tool_output',
        message: `Tool output: Denial logged successfully.`
      });
      await delay(600);

      onLog({
        id: logId(),
        timestamp: timestamp(),
        type: 'decision',
        message: `Decision finalized: DENIED refund. Policy reference: ${validation.policyReference}`
      });
      onUpdateCrm();

      const returnText = `Hello ${customer.name}, I have reviewed your refund request for **${item.name}** in order **${order.id}**. Regrettably, I cannot process this refund because it does not meet our refund guidelines: **${validation.reason}** (Reference: *${validation.policyReference}*). Let me know if you would like me to assist you with another request or exchange options.`;

      return {
        text: returnText,
        action: 'Deny',
        refundAmount: 0
      };
    }
  }

  // ==========================================
  // 2. LIVE LLM API LOOP (Gemini or OpenAI)
  // ==========================================
  try {
    let loopCount = 0;
    const maxLoops = 5;
    
    // Create copy of chat history to pass to LLM
    const activeHistory = [...history, { id: 'usr-new', sender: 'customer', text: customerMessage, timestamp: timestamp() }];

    while (loopCount < maxLoops) {
      loopCount++;

      let response;
      if (config.provider === 'gemini') {
        response = await callGemini(config, activeHistory, AGENT_TOOLS_DECLARATIONS, onLog);
      } else {
        response = await callOpenAI(config, activeHistory, AGENT_TOOLS_DECLARATIONS, onLog);
      }

      // Check if it is a tool call
      if (response.tool_calls && response.tool_calls.length > 0) {
        const toolCall = response.tool_calls[0];
        const { name, arguments: argsString } = toolCall.function;
        const args = JSON.parse(argsString);

        onLog({
          id: logId(),
          timestamp: timestamp(),
          type: 'tool_call',
          message: `Tool Call from LLM: ${name}(${JSON.stringify(args)})`
        });

        let output: any;

        // Execute corresponding JS tool
        switch (name) {
          case 'getCustomerProfile':
            output = getCustomerProfile(args.customerId);
            break;
          case 'getOrderDetails':
            output = getOrderDetails(args.orderId);
            break;
          case 'getPolicyGuidelines':
            output = getPolicyGuidelines();
            break;
          case 'validateRefundPolicy':
            output = validateRefundPolicy(args.customerId, args.orderId, args.itemId);
            break;
          case 'processRefundTransaction':
            output = processRefundTransaction(args.customerId, args.orderId, args.itemId, args.amount);
            onUpdateCrm();
            break;
          case 'logDenialTransaction':
            output = logDenialTransaction(args.customerId, args.orderId, args.itemId, args.reason);
            onUpdateCrm();
            break;
          case 'escalateTransaction':
            output = escalateTransaction(args.customerId, args.orderId, args.reason);
            onUpdateCrm();
            break;
          default:
            output = { error: `Tool ${name} not found` };
        }

        onLog({
          id: logId(),
          timestamp: timestamp(),
          type: 'tool_output',
          message: `Tool Output [${name}]: ${JSON.stringify(output).substring(0, 200)}...`
        });

        // Feed back to LLM by pushing tool calls and response into history
        activeHistory.push({
          id: `ast-${Date.now()}`,
          sender: 'agent',
          text: `[Tool Call executed: ${name}] Output: ${JSON.stringify(output)}`,
          timestamp: timestamp()
        });

        // Pause to avoid spamming calls
        await delay(500);
      } else {
        // Final response from LLM
        const finalText = response.content || 'Error: Empty response from model.';
        onLog({
          id: logId(),
          timestamp: timestamp(),
          type: 'decision',
          message: `Model finished processing. Response: "${finalText.substring(0, 100)}..."`
        });

        // Determine actions from final message
        let action: 'Approve' | 'Deny' | 'Escalate' | 'None' = 'None';
        let refundAmount = 0;

        if (finalText.toLowerCase().includes('refund of') || finalText.toLowerCase().includes('processed a refund')) {
          action = 'Approve';
          const match = finalText.match(/\$\d+(\.\d{2})?/);
          if (match) refundAmount = parseFloat(match[0].replace('$', ''));
        } else if (finalText.toLowerCase().includes('escalated') || finalText.toLowerCase().includes('supervisor')) {
          action = 'Escalate';
        } else if (finalText.toLowerCase().includes('deny') || finalText.toLowerCase().includes('cannot process') || finalText.toLowerCase().includes('ineligible')) {
          action = 'Deny';
        }

        return {
          text: finalText,
          action,
          refundAmount
        };
      }
    }

    throw new Error('Reached tool call limit.');
  } catch (error: any) {
    onLog({
      id: logId(),
      timestamp: timestamp(),
      type: 'error',
      message: `Error in Agent Loop: ${error.message}`
    });
    return {
      text: `An error occurred while processing your request: ${error.message}. Please try again.`,
      action: 'None',
      refundAmount: 0
    };
  }
}
