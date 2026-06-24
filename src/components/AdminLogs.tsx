import React, { useRef, useEffect } from 'react';
import { AgentLog } from '../types';
import { Terminal, Trash2, Eye, ShieldAlert, Sparkles, Settings } from 'lucide-react';

interface AdminLogsProps {
  logs: AgentLog[];
  onClearLogs: () => void;
  provider: string;
  model: string;
}

export const AdminLogs: React.FC<AdminLogsProps> = ({
  logs,
  onClearLogs,
  provider,
  model
}) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColors = (type: AgentLog['type']) => {
    switch (type) {
      case 'monologue':
        return {
          bg: 'rgba(99, 102, 241, 0.05)',
          border: 'rgba(99, 102, 241, 0.3)',
          text: '#a5b4fc',
          label: '💭 Internal Monologue (Reasoning)'
        };
      case 'tool_call':
        return {
          bg: 'rgba(245, 158, 11, 0.05)',
          border: 'rgba(245, 158, 11, 0.3)',
          text: '#fcd34d',
          label: '🛠️ Tool Executing Call'
        };
      case 'tool_output':
        return {
          bg: 'rgba(255, 255, 255, 0.02)',
          border: 'rgba(255, 255, 255, 0.05)',
          text: '#e5e7eb',
          label: '📦 Database Tool Output'
        };
      case 'decision':
        return {
          bg: 'rgba(16, 185, 129, 0.06)',
          border: 'rgba(16, 185, 129, 0.4)',
          text: '#34d399',
          label: '🛡️ Audit Decision Commited'
        };
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.06)',
          border: 'rgba(239, 68, 68, 0.4)',
          text: '#fca5a5',
          label: '🚨 Agent Error Trigger'
        };
      case 'system':
      default:
        return {
          bg: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.08)',
          text: '#9ca3af',
          label: '⚙️ System Pipeline Log'
        };
    }
  };

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      border: '1px solid rgba(99, 102, 241, 0.15)',
      boxShadow: '0 0 25px rgba(99, 102, 241, 0.05)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(10, 13, 20, 0.8)'
      }}>
        <div className="panel-title" style={{ margin: 0 }}>
          <Terminal size={18} color="var(--color-primary)" />
          Real-time Audit Logs Trace
        </div>
        <button
          onClick={onClearLogs}
          disabled={logs.length === 0}
          className="btn-secondary"
          style={{
            padding: '6px 10px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            borderRadius: '6px',
            opacity: logs.length === 0 ? 0.5 : 1,
            cursor: logs.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <Trash2 size={12} />
          Clear
        </button>
      </div>

      {/* Connection Metadata */}
      <div style={{
        padding: '8px 16px',
        borderBottom: '1px solid var(--border-color)',
        fontSize: '0.7rem',
        color: 'var(--text-secondary)',
        background: 'rgba(0, 0, 0, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Settings size={12} color="var(--color-primary)" />
          Pipeline: <strong style={{ color: '#fff' }}>{provider.toUpperCase()}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Model: <code style={{
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '1px 5px',
            borderRadius: '4px',
            color: 'var(--color-primary)',
            fontSize: '0.65rem'
          }}>{model}</code>
        </div>
      </div>

      {/* Scrollable logs list */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: '#05070c'
      }}>
        {logs.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-muted)',
            textAlign: 'center',
            gap: '8px'
          }}>
            <Eye size={24} color="rgba(255, 255, 255, 0.1)" />
            <div>
              Waiting for customer messages...
              <div style={{ fontSize: '0.65rem', marginTop: '4px', color: 'var(--text-muted)' }}>
                Step-by-step agent thoughts and tool calls will populate here.
              </div>
            </div>
          </div>
        ) : (
          logs.map((log) => {
            const config = getLogColors(log.type);
            const isDecision = log.type === 'decision';
            const isError = log.type === 'error';

            return (
              <div
                key={log.id}
                style={{
                  backgroundColor: config.bg,
                  border: `1px solid ${config.border}`,
                  borderRadius: '8px',
                  padding: '10px 12px',
                  boxShadow: isDecision
                    ? '0 0 15px rgba(16, 185, 129, 0.08)'
                    : isError
                    ? '0 0 15px rgba(239, 68, 68, 0.08)'
                    : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Header info */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                  paddingBottom: '4px'
                }}>
                  <span style={{ fontWeight: 600, color: config.text }}>{config.label}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                </div>

                {/* Content text */}
                <div style={{
                  color: log.type === 'tool_output' ? 'var(--text-secondary)' : '#fff',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {log.type === 'tool_output' && log.message.startsWith('Tool Output')
                    ? (
                      <code style={{ color: 'var(--text-secondary)' }}>{log.message}</code>
                    ) : log.message
                  }
                </div>
              </div>
            );
          })
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};
