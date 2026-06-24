import React from 'react';
import { CustomerProfile } from '../types';
import { Shield, ShieldAlert, Award, User, RefreshCw, Layers } from 'lucide-react';

interface CRMExplorerProps {
  customers: CustomerProfile[];
  selectedCustomerId: string;
  onSelectCustomer: (id: string) => void;
  onResetCrm: () => void;
}

export const CRMExplorer: React.FC<CRMExplorerProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  onResetCrm
}) => {
  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Panel Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="panel-title" style={{ margin: 0 }}>
          <Layers size={18} color="var(--color-primary)" />
          CRM Profiles
        </div>
        <button
          onClick={onResetCrm}
          className="btn-secondary"
          style={{
            padding: '6px 10px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            borderRadius: '6px'
          }}
          title="Reset CRM Database to defaults"
        >
          <RefreshCw size={12} />
          Reset
        </button>
      </div>

      {/* Split CRM Directory & Detail view */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Sidebar list of customers */}
        <div style={{
          width: '40%',
          borderRight: '1px solid var(--border-color)',
          overflowY: 'auto',
          background: 'rgba(10, 13, 20, 0.3)'
        }}>
          {customers.map(c => {
            const isSelected = c.id === selectedCustomerId;
            const hasHighRisk = c.fraudRiskScore > 75;
            const isVip = c.tier === 'VIP';

            return (
              <div
                key={c.id}
                onClick={() => onSelectCustomer(c.id)}
                style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  borderLeft: isSelected ? '3px solid var(--color-primary)' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                className="hover-scale"
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: isVip ? '2px solid #f59e0b' : '1px solid var(--border-color)'
                  }}
                  onError={(e) => {
                    // Fallback avatar
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`;
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: isSelected ? '#fff' : 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {c.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{
                      fontSize: '0.65rem',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: isVip ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                      color: isVip ? '#f59e0b' : 'var(--text-secondary)',
                      fontWeight: 600
                    }}>
                      {c.tier}
                    </span>
                    {hasHighRisk && (
                      <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-danger)' }}>
                        <ShieldAlert size={10} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Customer details panel */}
        {activeCustomer && (
          <div style={{ width: '60%', padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={activeCustomer.avatar}
                alt={activeCustomer.name}
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: activeCustomer.tier === 'VIP' ? '3px solid #f59e0b' : '2px solid var(--border-color)'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${activeCustomer.name}`;
                }}
              />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{activeCustomer.name}</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{activeCustomer.email}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>ID: {activeCustomer.id}</div>
              </div>
            </div>

            {/* Badges/Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.04)'
            }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TValue (LTV)</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>${activeCustomer.lifetimeValue.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customer Tier</div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
                  {activeCustomer.tier === 'VIP' ? (
                    <span className="badge badge-vip" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                      <Award size={10} style={{ marginRight: '2px' }} /> VIP
                    </span>
                  ) : (
                    <span className="badge badge-regular" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                      {activeCustomer.tier}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fraud Risk</div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: activeCustomer.fraudRiskScore > 75
                    ? 'var(--color-danger)'
                    : activeCustomer.fraudRiskScore > 40
                    ? 'var(--color-warning)'
                    : 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Shield size={12} />
                  {activeCustomer.fraudRiskScore}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Refunds (Year)</div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: activeCustomer.refundHistoryCount >= 3 ? 'var(--color-danger)' : '#fff'
                }}>
                  {activeCustomer.refundHistoryCount}/3 Limit
                </div>
              </div>
            </div>

            {/* Orders summary */}
            <div>
              <h5 style={{ fontSize: '0.8rem', color: '#fff', marginBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '4px' }}>
                Order History
              </h5>
              {activeCustomer.orders.map(order => (
                <div key={order.id} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--color-primary)' }}>{order.id}</span>
                    <span style={{
                      color: order.status === 'Delivered'
                        ? 'var(--color-success)'
                        : order.status === 'Processing'
                        ? 'var(--color-warning)'
                        : 'var(--text-muted)'
                    }}>{order.status}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', margin: '4px 0 6px 0' }}>
                    <span>Delivered: {order.deliveryDate}</span>
                    <span>Total Paid: ${order.total.toFixed(2)}</span>
                  </div>

                  {order.items.map(item => (
                    <div key={item.id} style={{
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      padding: '8px',
                      borderRadius: '6px',
                      marginTop: '6px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 500, color: '#fff' }}>{item.name}</div>
                        <div style={{ display: 'flex', gap: '6px', fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          <span>Cat: {item.category}</span>
                          <span>•</span>
                          <span style={{
                            color: item.condition === 'Unused'
                              ? 'var(--color-success)'
                              : item.condition === 'Defective' || item.condition === 'Damaged'
                              ? 'var(--color-warning)'
                              : 'var(--color-danger)'
                          }}>
                            Cond: {item.condition}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>${item.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Admin database notes log */}
            <div style={{ flex: 1, minHeight: '120px', display: 'flex', flexDirection: 'column' }}>
              <h5 style={{ fontSize: '0.8rem', color: '#fff', marginBottom: '6px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '4px' }}>
                Internal Audit Logs / Notes
              </h5>
              <div style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-wrap',
                overflowY: 'auto',
                lineHeight: '1.4'
              }}>
                {activeCustomer.notes || 'No security incidents or refund events recorded.'}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
