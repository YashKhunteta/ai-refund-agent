import { AgentLog } from '../types';

export interface LLMConfig {
  provider: 'simulator' | 'gemini' | 'openai';
  apiKey: string;
  model: string;
}

// Tool declarations for LLM function calling
export const AGENT_TOOLS_DECLARATIONS = [
  {
    name: 'getCustomerProfile',
    description: 'Retrieves the customer profile including name, email, tier, fraud risk score, and current refund counts.',
    parameters: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'The unique ID of the customer (e.g., CUST-001)' }
      },
      required: ['customerId']
    }
  },
  {
    name: 'getOrderDetails',
    description: 'Retrieves details about an order, including purchase date, delivery date, item conditions, category, and total paid.',
    parameters: {
      type: 'object',
      properties: {
        orderId: { type: 'string', description: 'The unique ID of the order (e.g., ORD-9821)' }
      },
      required: ['orderId']
    }
  },
  {
    name: 'getPolicyGuidelines',
    description: 'Fetches the full text of the strict e-commerce refund policy guidelines.',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'validateRefundPolicy',
    description: 'Performs rule-based checks on whether a specific item in an order is eligible for refund, and returns decision status.',
    parameters: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'The customer ID' },
        orderId: { type: 'string', description: 'The order ID' },
        itemId: { type: 'string', description: 'The item ID' }
      },
      required: ['customerId', 'orderId', 'itemId']
    }
  },
  {
    name: 'processRefundTransaction',
    description: 'Processes and commits an approved refund to the CRM database.',
    parameters: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'The customer ID' },
        orderId: { type: 'string', description: 'The order ID' },
        itemId: { type: 'string', description: 'The item ID' },
        amount: { type: 'number', description: 'The refund amount to process' }
      },
      required: ['customerId', 'orderId', 'itemId', 'amount']
    }
  },
  {
    name: 'logDenialTransaction',
    description: 'Logs a denied refund request with explanation in the customer notes.',
    parameters: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'The customer ID' },
        orderId: { type: 'string', description: 'The order ID' },
        itemId: { type: 'string', description: 'The item ID' },
        reason: { type: 'string', description: 'Detailed reason for denial based on policy' }
      },
      required: ['customerId', 'orderId', 'itemId', 'reason']
    }
  },
  {
    name: 'escalateTransaction',
    description: 'Escalates a refund request to a human supervisor due to risk, fraud limits, or complexity.',
    parameters: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'The customer ID' },
        orderId: { type: 'string', description: 'The order ID' },
        reason: { type: 'string', description: 'Reason for escalation' }
      },
      required: ['customerId', 'orderId', 'reason']
    }
  }
];

export const SYSTEM_INSTRUCTION = `You are GuardRefund AI, an expert e-commerce customer support refund agent.
You process or deny refund requests by strictly adhering to the "GuardRefund E-Commerce Global Refund Policy".
You have access to tools that fetch CRM data, order details, and validate refund policy eligibility.

YOUR BEHAVIOR:
1. Always start by fetching the customer's profile and order details if you don't have them yet.
2. Check the fraud risk score and refund count limit FIRST. If Fraud Risk Score > 75 or approved refund count >= 3, you MUST call escalateTransaction and explain this to the user. Do not approve or deny yourself.
3. Validate item category (Clearance is Final Sale, Underwear/Swimwear is non-refundable, Digital is non-refundable). Deny if violated.
4. Calculate days since delivery relative to the CURRENT DATE: June 19, 2026.
5. If the item is defective or damaged, check if delivery was within 90 days. Approve refund (including shipping fees if applicable).
6. If the item is in Unused condition and delivered within 30 days, approve the refund (do NOT refund shipping).
7. If the customer is a VIP and return is between 31 and 45 days, check if the item is under $150. If yes, apply VIP Courtesy and approve. If no, deny.
8. If the customer is Regular/New and return is over 30 days, deny the refund.
9. When a refund is approved, call processRefundTransaction.
10. When a refund is denied, call logDenialTransaction.
11. If the request is complex or has conflicts, call escalateTransaction.
12. Be extremely polite but firm. Hold the line on policy violations! Cite specific sections of the policy in your final answer.

Always reason step-by-step in your internal thoughts.`;

/**
 * Executes a call to OpenAI API (client-side)
 */
export async function callOpenAI(
  config: LLMConfig,
  messages: any[],
  tools: any[],
  onLog: (log: AgentLog) => void
): Promise<any> {
  const url = 'https://api.openai.com/v1/chat/completions';
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey}`
  };

  const formattedMessages = [
    { role: 'system', content: SYSTEM_INSTRUCTION },
    ...messages.map(m => ({
      role: m.sender === 'customer' ? 'user' : 'assistant',
      content: m.text
    }))
  ];

  onLog({
    id: `sys-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'system',
    message: `Sending request to OpenAI using model ${config.model}...`
  });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: config.model,
      messages: formattedMessages,
      tools: tools.length > 0 ? tools.map(t => ({ type: 'function', function: t })) : undefined,
      tool_choice: 'auto'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message;
}

/**
 * Executes a call to Gemini API (client-side)
 */
export async function callGemini(
  config: LLMConfig,
  messages: any[],
  tools: any[],
  onLog: (log: AgentLog) => void
): Promise<any> {
  const modelName = config.model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.apiKey}`;

  // Formats chat logs to Gemini format
  const contents = messages.map(m => ({
    role: m.sender === 'customer' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  // Append system instructions
  const body: any = {
    contents,
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    }
  };

  // Append tools
  if (tools.length > 0) {
    body.tools = [{
      functionDeclarations: tools
    }];
  }

  onLog({
    id: `sys-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'system',
    message: `Sending request to Gemini using model ${modelName}...`
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const messageContent = candidate?.content;
  const part = messageContent?.parts?.[0];

  if (!part) {
    throw new Error('Gemini API returned an empty response.');
  }

  // Map Gemini response back to unified format
  if (part.functionCall) {
    return {
      role: 'assistant',
      content: null,
      tool_calls: [{
        id: `call-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'function',
        function: {
          name: part.functionCall.name,
          arguments: JSON.stringify(part.functionCall.args)
        }
      }]
    };
  }

  return {
    role: 'assistant',
    content: part.text,
    tool_calls: null
  };
}
