import React, { useState, useEffect } from 'react';
import { LLMConfig } from '../agent/llm';
import { X, Settings, ShieldAlert } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LLMConfig;
  onSaveConfig: (newConfig: LLMConfig) => void;
  speechRate: number;
  onSaveSpeechRate: (rate: number) => void;
  selectedVoice: string;
  onSaveSelectedVoice: (voiceName: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  speechRate,
  onSaveSpeechRate,
  selectedVoice,
  onSaveSelectedVoice
}) => {
  const [provider, setProvider] = useState<LLMConfig['provider']>(config.provider);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [model, setModel] = useState(config.model);
  const [rate, setRate] = useState(speechRate);
  const [voiceName, setVoiceName] = useState(selectedVoice);
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        setBrowserVoices(window.speechSynthesis.getVoices());
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      provider,
      apiKey,
      model
    });
    onSaveSpeechRate(rate);
    onSaveSelectedVoice(voiceName);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999
    }}>
      <div className="glass-panel" style={{
        width: '450px',
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: 'var(--bg-secondary)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            <Settings size={20} color="var(--color-primary)" />
            Agent Configurations
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} className="hover-scale">
            <X size={20} />
          </button>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Provider Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>LLM Pipeline Provider</label>
            <select
              value={provider}
              onChange={(e) => {
                const prov = e.target.value as LLMConfig['provider'];
                setProvider(prov);
                if (prov === 'simulator') {
                  setModel('Simulator State Machine');
                } else if (prov === 'gemini') {
                  setModel('gemini-1.5-flash');
                } else {
                  setModel('gpt-4o-mini');
                }
              }}
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '10px',
                borderRadius: '8px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="simulator">🛡️ High-Fidelity Simulator (Offline / Out of Box)</option>
              <option value="gemini">✨ Google Gemini API</option>
              <option value="openai">🤖 OpenAI API</option>
            </select>
          </div>

          {/* Warning for simulator */}
          {provider === 'simulator' && (
            <div style={{
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.4'
            }}>
              💡 **No keys needed!** The simulator executes the exact tool calls, verifies the policy database, updates CRM records, and streams visual internal thoughts in real time. Ideal for evaluation.
            </div>
          )}

          {provider !== 'simulator' && (
            <>
              {/* API Key */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>API Secret Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter your ${provider === 'gemini' ? 'Gemini' : 'OpenAI'} API Key`}
                  className="custom-input"
                />
              </div>

              {/* Model Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Model Name</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. gemini-1.5-flash, gpt-4o-mini"
                  className="custom-input"
                />
              </div>

              {/* Security Warning */}
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start'
              }}>
                <ShieldAlert size={16} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  **API Keys stay local.** Requests are executed directly from your browser. Note: Ensure you have configured CORS or allow direct browser requests if needed.
                </span>
              </div>
            </>
          )}

          <div style={{ borderTop: '1px solid var(--border-color)', margin: '8px 0', padding: '12px 0 0 0' }}>
            <h5 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '12px' }}>Speech settings</h5>
            
            {/* Voice Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>TTS System Voice</label>
              <select
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '8px',
                  borderRadius: '6px',
                  outline: 'none',
                  fontSize: '0.75rem'
                }}
              >
                <option value="">Default System Voice</option>
                {browserVoices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Speed Range */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Voice Speed (Rate)</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{rate.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary">
            Save changes
          </button>
        </div>

      </div>
    </div>
  );
};
