import React from 'react';
import { FileText, Calendar, ShieldAlert, Award, FileWarning } from 'lucide-react';
import { REFUND_POLICY_TEXT } from '../data/policy';

export const PolicyViewer: React.FC = () => {
  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Panel Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <FileText size={18} color="var(--color-primary)" />
        <div className="panel-title" style={{ margin: 0 }}>Refund Policy Manual</div>
      </div>

      {/* Policy View Area */}
      <div style={{ padding: '16px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Quick Reference Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px'
        }}>
          {/* Rule 1 */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            borderRadius: '10px',
            padding: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <Calendar size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Return Windows</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Standard: 30 days<br/>
                Defective/Damaged: 90 days
              </div>
            </div>
          </div>

          {/* Rule 2 */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.05)',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            borderRadius: '10px',
            padding: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <Award size={18} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>VIP Exceptions</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Up to 45 days courtesy for individual items under $150.
              </div>
            </div>
          </div>

          {/* Rule 3 */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            borderRadius: '10px',
            padding: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <FileWarning size={18} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Restricted Items</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Clearance, Intimates/Swim, and Digital are Final Sale.
              </div>
            </div>
          </div>

          {/* Rule 4 */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            borderRadius: '10px',
            padding: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <ShieldAlert size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Abuse Safeguards</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Fraud Risk &gt; 75% or &gt;3 refunds/yr triggers Escalation.
              </div>
            </div>
          </div>
        </div>

        {/* Rendered Policy Text */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '14px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap'
        }}>
          {REFUND_POLICY_TEXT}
        </div>
      </div>
    </div>
  );
};
