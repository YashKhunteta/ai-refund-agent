<h1>GuardRefund AI: Intelligent Refund Support Agent Dashboard</h1>

GuardRefund AI is a premium, feature-rich customer support web application designed to automatically audit, approve, deny, or escalate e-commerce refund requests. It provides an interactive support agent sandbox where you can test strict policy rules against customer profiles using either an offline rules-based simulator loop or live large language models (LLMs) with native function calling.

<h2>Tech Stack & Architecture</h2>

The application is built entirely on a modern, client-side stack:

   Frontend Library: [React 18](https://react.dev/) (written in strict TypeScript)
   Build Tool: [Vite 5](https://vitejs.dev/) (optimized for instant hot module reloading and fast bundle sizes)
   Design System: Premium custom Vanilla CSS
       Curated dark mode palette tailored with HSL CSS variables
       Advanced visual styles: Glassmorphism (backdrop-filter), smooth micro-animations, glowing neon states, and customized scrollbars
       Responsive three-column dashboard layout
   Voice Pipeline: Client-side [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
       SpeechRecognition (voice-to-text input dictation)
       SpeechSynthesis (text-to-speech output narration with adjustable speaking rates and selectable voice profiles)
   Orchestration & LLM Engine:
       Simulator State Machine: A robust offline rules engine that simulates step-by-step agent traces out of the box.
       Google Gemini & OpenAI Integrations: Client-side API orchestration using native function declarations for tool calling (getCustomerProfile, getOrderDetails, validateRefundPolicy, etc.).
   Iconography: [Lucide React](https://lucide.dev/)

<h2>Core Features</h2>

<h3>1. Interactive CRM Explorer & Policy Viewer (Left Panel)</h3>
   15 Mock Customer Profiles: Toggle between 15 preconfigured customer accounts. Inspect details like Lifetime Value (LTV), fraud risk percentage, approved refund counts, order details (items, prices, purchase/delivery dates), and product conditions.
   Refund Policy Manual: View the "GuardRefund E-Commerce Global Refund Policy" detailing general return windows (30 days), defective coverage (90 days), exceptions, and exclusions.
   Live Audit Log: See database mutations appended to the selected customer's internal notes in real time.
   CRM Reset: Instantly restore the in-memory database to system defaults with one click.

<h3>2. Conversational Chat & Voice Sandbox (Middle Panel)</h3>
   Interactive Support Chat: Send messages representing the active customer's refund request.
   One-Click Suggestion Chips: Quickly fire preconfigured compliant or non-compliant test scenarios tailored to each customer.
   Interactive Microphone Waveform: Speak directly to the AI support agent and watch the CSS voice waveform react.
   Voice Narration: The agent speaks its final decision back to you. Click the microphone icon while the agent is speaking to skip the voice output.

<h3>3. Admin Debugger & Reasoning Terminal (Right Panel)</h3>
   Real-time Trace Log: Inspect the agent's internal monologue thoughts, raw tool calls, arguments, database write commits, and system status messages.
   Pipeline Settings (Modal): Change the engine between the offline Simulator Loop, Gemini API (gemini-1.5-flash or gemini-1.5-pro), and OpenAI API (gpt-4o or gpt-4o-mini). Customize TTS settings (voices, speaking speed).

<h2>Key Policy Rules & Test Scenarios</h2>

The system strictly enforces the following rule boundaries:

1.  Standard Return Window: 30 days for unused items (no shipping fee refunded).
2.  Defective/Damaged Window: 90 days for items marked "Defective" or "Damaged" (shipping fee is refunded).
3.  VIP Courtesy Exceptions: VIP customers get up to 45 days for courtesy refunds, provided the item price is under $150.
4.  Product Category Exclusions:
       Clearance: Final Sale (Non-refundable).
       Underwear/Swimwear: Excluded due to hygiene regulations.
       Digital Products: Non-refundable once delivered.
5.  Condition Violations: Items in "Worn" condition are rejected.
6.  Abuse & Security Safeguards:
       Fraud Risk Score > 75%: Request is immediately escalated to a human supervisor.
       Refund History >= 3 (current year): Request is immediately escalated.

<h3>Test Scenarios to Try</h3>
   Sarah Jenkins (CUST-001): Compliant return of a dress within 30 days. Action: Approve.
   John Doe (CUST-002): Requesting a phone case return at 57 days. Action: Deny (Expired standard window).
   Bob Miller (CUST-004): VIP courtesy return on day 33 for a $75 item. Action: Approve (VIP courtesy).
   Marcus Vance (CUST-005): Damaged headphones return, but client has 85% Fraud Risk and 4 previous refunds. Action: Escalate.
   Elena Rostova (CUST-006): Trying to return clearance suede boots. Action: Deny (Clearance exclusion).
   David Kim (CUST-007): Trying to return athletic swim trunks. Action: Deny (Hygiene swimwear exclusion).
   Arthur Pendragon (CUST-009): Returning a defective mechanical keyboard at 16 days. Action: Approve + refund shipping.
   Zoe Saldana (CUST-010): Attempting to refund a worn denim jacket. Action: Deny (Condition requirement violation).
   Emma Watson (CUST-013): VIP returning sneakers at 77 days. Action: Deny (Exceeds the 45-day VIP courtesy limit).

<h2>Getting Started</h2>

<h3>1. Prerequisites</h3>
   Node.js: v18.0.0 or higher
   NPM: v9.x or higher

<h3>2. Installation</h3>
Clone the repository, navigate into the directory, and install dependencies:
```bash
npm install
```

<h3>3. Run the Development Server</h3>
Launch the local Vite server:
```bash
npm run dev
```
The application will start in the background. By default, it runs at http://localhost:3000. If port 3000 is occupied, it will fallback to another port (e.g. http://localhost:3001).

<h2>Directory Structure</h2>

```text
ai-refund-agent/
├── src/
│   ├── agent/            # Agent reasoning loops, tools & LLM API adapters
│   │   ├── agentLoop.ts  # Rules-based simulator loop & LLM control logic
│   │   ├── llm.ts        # Gemini & OpenAI fetch integrations and tool declarations
│   │   └── tools.ts      # Policy validation functions & in-memory CRM db operations
│   ├── components/       # Custom React UI components
│   │   ├── AdminLogs.tsx     # Terminal log screen
│   │   ├── CRMExplorer.tsx   # Left sidebar database explorer
│   │   ├── ChatWindow.tsx    # Middle chat area & suggestion chips
│   │   ├── PolicyViewer.tsx  # Interactive policy rules reader
│   │   ├── SettingsModal.tsx # LLM settings & audio controls
│   │   └── VoiceWaveform.tsx # Custom micro-animated microphone status bar
│   ├── data/             # CRM dataset and refund policy static guidelines
│   ├── types.ts          # TypeScript interfaces
│   ├── index.css         # Central styling sheet (HSL theme & animations)
│   ├── main.tsx          # React application entrypoint
│   └── App.tsx           # Dashboard view coordinator
├── vite.config.ts        # Vite build configurations
├── tsconfig.json         # TypeScript compiler configurations
└── package.json          # Dependency registrations
```
