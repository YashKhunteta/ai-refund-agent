import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, CustomerProfile } from '../types';
import { Send, User, Sparkles, AlertCircle } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  activeCustomer: CustomerProfile;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isProcessing,
  activeCustomer
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage(inputText);
    setInputText('');
  };

  // Generate customized quick suggestion chips based on who is selected
  const getSuggestions = (c: CustomerProfile) => {
    switch (c.id) {
      case 'CUST-001': // Sarah Jenkins
        return [
          { text: "I want a refund for the Floral Summer Dress on ORD-9821.", label: "Standard Refund (Compliant)" },
          { text: "Can I return both items from ORD-9821?", label: "Full Order Return" }
        ];
      case 'CUST-002': // John Doe
        return [
          { text: "I want to return the phone case on ORD-7634. It's unused.", label: "Violation: 57 Days Ago" }
        ];
      case 'CUST-003': // Alice Vance
        return [
          { text: "I'd like to return these Heels from order ORD-9901.", label: "VIP: Within Window" }
        ];
      case 'CUST-004': // Bob Miller
        return [
          { text: "I need to return my Performance Joggers from ORD-8941.", label: "VIP Courtesy Exception (33 days, under $150)" }
        ];
      case 'CUST-005': // Marcus Vance
        return [
          { text: "I received these headphones damaged in ORD-5541. I want a refund.", label: "Abuse check: Fraud Risk 85%" }
        ];
      case 'CUST-006': // Elena Rostova
        return [
          { text: "My clearance boots (ORD-4122) don't fit. Refund please.", label: "Violation: Clearance Item" }
        ];
      case 'CUST-007': // David Kim
        return [
          { text: "The athletic swim trunks from ORD-1234 are too tight. Refund?", label: "Violation: Hygiene Category" }
        ];
      case 'CUST-008': // Chloe Bennett
        return [
          { text: "Refund my e-gift card from ORD-6003.", label: "Violation: Digital Product" }
        ];
      case 'CUST-009': // Arthur Pendragon
        return [
          { text: "My mechanical keyboard from ORD-2022 stopped working. I want a refund.", label: "Compliant: 16 days Defective" }
        ];
      case 'CUST-010': // Zoe Saldana
        return [
          { text: "I wore this jacket once but don't like it. Refund ORD-7301.", label: "Violation: Worn Condition" }
        ];
      case 'CUST-011': // Liam Neeson
        return [
          { text: "My biker jacket ORD-4591 was damaged on arrival. Refund please.", label: "Compliant: Damaged on Delivery" }
        ];
      case 'CUST-012': // Sophia Loren
        return [
          { text: "Refund my cosmetics set from ORD-3091. It's opened.", label: "Violation: Opened Beauty Set" }
        ];
      case 'CUST-013': // Emma Watson
        return [
          { text: "Return the eco sneakers from ORD-8711. They are unused.", label: "Violation: VIP Window Expired (77 days)" }
        ];
      case 'CUST-014': // Bruce Wayne
        return [
          { text: "The LED tactical flashlight in ORD-0007 is defective. Refund.", label: "VIP Defective (Compliant)" }
        ];
      case 'CUST-015': // Peter Parker
        return [
          { text: "I want to return the lens filter from ORD-5431.", label: "Standard Refund (16 days)" }
        ];
      default:
        return [
          { text: "I want a refund for my order.", label: "General Request" }
        ];
    }
  };

  const suggestions = getSuggestions(activeCustomer);

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.01)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: isProcessing ? 'var(--color-warning)' : 'var(--color-success)',
            boxShadow: isProcessing ? '0 0 8px var(--color-warning)' : '0 0 8px var(--color-success)',
            animation: isProcessing ? 'pulse 1s infinite alternate' : 'none'
          }} />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              GuardRefund AI Agent
              <Sparkles size={12} color="var(--color-primary)" />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Assisting: <strong style={{ color: 'var(--text-primary)' }}>{activeCustomer.name}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Window */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'rgba(0, 0, 0, 0.15)'
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-muted)',
            textAlign: 'center',
            padding: '20px',
            gap: '10px'
          }}>
            <AlertCircle size={32} color="var(--border-color)" />
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>No chat messages yet.</p>
              <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                Select a scenario below or type a message to begin refund audit analysis.
              </p>
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isAgent = m.sender === 'agent';
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isAgent ? 'flex-start' : 'flex-end',
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isAgent ? 'flex-start' : 'flex-end'
                }}
              >
                {/* Chat bubble styling */}
                <div style={{
                  padding: '12px 14px',
                  borderRadius: isAgent ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                  background: isAgent ? 'var(--bg-tertiary)' : 'linear-gradient(135deg, var(--color-primary), #4f46e5)',
                  border: isAgent ? '1px solid var(--border-color)' : 'none',
                  color: '#fff',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  boxShadow: isAgent ? 'none' : '0 4px 12px var(--color-primary-glow)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {m.text}
                </div>
                {/* Timestamp */}
                <span style={{
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                  padding: '0 4px'
                }}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  {m.isVoice && ' • 🎙️ Voice'}
                </span>
              </div>
            );
          })
        )}

        {/* Dynamic AI thinking indicator */}
        {isProcessing && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '6px', alignItems: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '16px 16px 16px 4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Agent is auditing policy</span>
            <div style={{ display: 'flex', gap: '3px' }}>
              <span style={{ width: '4px', height: '4px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1s infinite alternate' }}></span>
              <span style={{ width: '4px', height: '4px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1s infinite alternate', animationDelay: '0.2s' }}></span>
              <span style={{ width: '4px', height: '4px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1s infinite alternate', animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Suggestion Chips */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid var(--border-color)',
        background: 'rgba(10, 13, 20, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Test Scenarios for {activeCustomer.name}:</div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {suggestions.map((s, index) => (
            <button
              key={index}
              disabled={isProcessing}
              onClick={() => onSendMessage(s.text)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                background: 'rgba(99, 102, 241, 0.05)',
                color: '#a5b4fc',
                fontSize: '0.75rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
              className="hover-scale"
            >
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={10} />
                {s.label}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px', textAlign: 'left', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '280px' }}>
                {s.text}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{
        padding: '16px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '10px',
        background: 'var(--bg-secondary)'
      }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type message to audit refund for ${activeCustomer.name}...`}
          disabled={isProcessing}
          className="custom-input"
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          disabled={isProcessing || !inputText.trim()}
          className="btn-primary"
          style={{
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px'
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
