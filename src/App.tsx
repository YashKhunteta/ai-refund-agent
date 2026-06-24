import React, { useState, useEffect } from 'react';
import { CustomerProfile, ChatMessage, AgentLog } from './types';
import { CRMExplorer } from './components/CRMExplorer';
import { PolicyViewer } from './components/PolicyViewer';
import { ChatWindow } from './components/ChatWindow';
import { AdminLogs } from './components/AdminLogs';
import { VoiceWaveform } from './components/VoiceWaveform';
import { SettingsModal } from './components/SettingsModal';
import { LLMConfig } from './agent/llm';
import { runAgentLoop } from './agent/agentLoop';
import { mutableCrmData, resetCrmData } from './agent/tools';
import { Settings, Shield, Award, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';

// Initialize speech recognition if supported
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: any = null;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
}

export const App: React.FC = () => {
  // Database state
  const [customers, setCustomers] = useState<CustomerProfile[]>(mutableCrmData);
  const [selectedCustomerId, setSelectedCustomerId] = useState('CUST-001');

  // Conversation & Agent states
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'speaking' | 'processing'>('idle');

  // App Configurations
  const [llmConfig, setLlmConfig] = useState<LLMConfig>({
    provider: 'simulator',
    apiKey: '',
    model: 'Simulator State Machine'
  });
  const [speechRate, setSpeechRate] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'crm' | 'policy'>('crm');

  // Load database on mount
  useEffect(() => {
    setCustomers([...mutableCrmData]);
  }, []);

  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];
  const activeMessages = chatHistories[selectedCustomerId] || [];

  // Speech recognition events handlers
  useEffect(() => {
    if (recognition) {
      recognition.onstart = () => {
        setVoiceStatus('listening');
        addLog('system', `Voice recording started. Listening to microphone...`);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        addLog('system', `Voice transcript captured: "${transcript}"`);
        handleSendMessage(transcript, true);
      };

      recognition.onerror = (event: any) => {
        addLog('error', `Speech recognition error: ${event.error}`);
        setVoiceStatus('idle');
      };

      recognition.onend = () => {
        // Only return to idle if we didn't transition to processing
        setVoiceStatus(prev => prev === 'listening' ? 'idle' : prev);
      };
    }
  }, [selectedCustomerId, chatHistories, llmConfig]);

  const startVoiceInput = () => {
    if (recognition) {
      // Cancel speech synthesis if active
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      try {
        recognition.start();
      } catch (err: any) {
        addLog('error', `Could not start voice recognition: ${err.message}`);
      }
    } else {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
    }
  };

  const stopVoiceInput = () => {
    if (recognition) {
      recognition.stop();
      setVoiceStatus('idle');
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setVoiceStatus('idle');
      addLog('system', 'Voice playback cancelled by user.');
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Clear queue

      // Strip markdown asterisks and backticks before speaking
      const plainText = text.replace(/[*`#_]/g, '');

      const utterance = new SpeechSynthesisUtterance(plainText);
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = speechRate;
      utterance.onstart = () => setVoiceStatus('speaking');
      utterance.onend = () => setVoiceStatus('idle');
      utterance.onerror = () => setVoiceStatus('idle');

      window.speechSynthesis.speak(utterance);
    }
  };

  // Helper to append agent reasoning logs
  const addLog = (type: AgentLog['type'], message: string, meta?: any) => {
    const newLog: AgentLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      meta
    };
    setLogs(prev => [...prev, newLog]);
  };

  // Triggers when database gets updated by tools
  const handleUpdateCrm = () => {
    setCustomers([...mutableCrmData]);
  };

  // Main submission handler
  const handleSendMessage = async (text: string, isVoice = false) => {
    if (!text.trim() || isProcessing) return;

    // Create user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      text,
      timestamp: new Date().toISOString(),
      isVoice
    };

    // Update conversation history
    const currentCustId = selectedCustomerId;
    const updatedHistory = [...activeMessages, userMsg];
    setChatHistories(prev => ({
      ...prev,
      [currentCustId]: updatedHistory
    }));

    setIsProcessing(true);
    if (isVoice) {
      setVoiceStatus('processing');
    }

    try {
      // Run agent orchestrator
      const result = await runAgentLoop(
        text,
        currentCustId,
        activeMessages,
        llmConfig,
        (log) => addLog(log.type, log.message, log.meta),
        handleUpdateCrm
      );

      // Add agent response message
      const agentMsg: ChatMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        text: result.text,
        timestamp: new Date().toISOString()
      };

      setChatHistories(prev => ({
        ...prev,
        [currentCustId]: [...updatedHistory, agentMsg]
      }));

      // Speak response out loud
      speakText(result.text);

    } catch (err: any) {
      addLog('error', `Agent execution failed: ${err.message}`);
      setVoiceStatus('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetCrm = () => {
    if (confirm("Reset CRM database back to original 15 default customer profiles?")) {
      resetCrmData();
      setCustomers([...mutableCrmData]);
      setChatHistories({});
      setLogs([]);
      addLog('system', "CRM Database has been reset to system defaults.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Sleek Header Dashboard Navigation */}
      <header className="dashboard-header">
        <div className="header-logo">
          <Shield size={26} color="var(--color-primary)" style={{ filter: 'drop-shadow(0 0 8px var(--color-primary-glow))' }} />
          GuardRefund AI <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', fontWeight: 500 }}>Customer Support Sandbox</span>
        </div>
        
        {/* System Settings & Status info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)'
          }}>
            <span className="status-indicator status-active" />
            Mode: <strong>{llmConfig.provider === 'simulator' ? 'Simulator Loop' : `${llmConfig.provider.toUpperCase()} Agent`}</strong>
          </div>

          <button
            onClick={() => setSettingsOpen(true)}
            className="btn-secondary"
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Settings size={14} />
            Pipeline Settings
          </button>
        </div>
      </header>

      {/* Main Grid Panels */}
      <main className="dashboard-grid" style={{ marginTop: '20px' }}>
        
        {/* Panel 1: CRM & Policy Viewer Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflow: 'hidden' }}>
          
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-secondary)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setActiveTab('crm')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'crm' ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === 'crm' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Customer Database (15)
            </button>
            <button
              onClick={() => setActiveTab('policy')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'policy' ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === 'policy' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Refund Policy rules
            </button>
          </div>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            {activeTab === 'crm' ? (
              <CRMExplorer
                customers={customers}
                selectedCustomerId={selectedCustomerId}
                onSelectCustomer={(id) => {
                  setSelectedCustomerId(id);
                  // Trigger voice synthesized stop if switching
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setVoiceStatus('idle');
                }}
                onResetCrm={handleResetCrm}
              />
            ) : (
              <PolicyViewer />
            )}
          </div>
        </div>

        {/* Panel 2: Conversational Chat UI & Microphone Wave */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflow: 'hidden' }}>
          
          {/* Active Customer profile summary strip */}
          {activeCustomer && (
            <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={activeCustomer.avatar}
                  alt={activeCustomer.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${activeCustomer.name}`;
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{activeCustomer.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Tier: {activeCustomer.tier} | LTV: ${activeCustomer.lifetimeValue.toFixed(2)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Risk Score:</span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: activeCustomer.fraudRiskScore > 75 ? 'var(--color-danger)' : 'var(--color-success)',
                  backgroundColor: activeCustomer.fraudRiskScore > 75 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: `1px solid ${activeCustomer.fraudRiskScore > 75 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                }}>
                  {activeCustomer.fraudRiskScore}%
                </span>
              </div>
            </div>
          )}

          {/* Chat Window Panel */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <ChatWindow
              messages={activeMessages}
              onSendMessage={(txt) => handleSendMessage(txt, false)}
              isProcessing={isProcessing}
              activeCustomer={activeCustomer}
            />
          </div>

          {/* Voice pipeline controller */}
          <VoiceWaveform
            status={voiceStatus}
            onStartListening={startVoiceInput}
            onStopListening={stopVoiceInput}
            onStopSpeaking={stopSpeaking}
          />
        </div>

        {/* Panel 3: Admin Debugging / Reasoning Logs */}
        <div style={{ height: '100%', overflow: 'hidden' }}>
          <AdminLogs
            logs={logs}
            onClearLogs={() => setLogs([])}
            provider={llmConfig.provider}
            model={llmConfig.model}
          />
        </div>

      </main>

      {/* Settings Modal Layer */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={llmConfig}
        onSaveConfig={setLlmConfig}
        speechRate={speechRate}
        onSaveSpeechRate={setSpeechRate}
        selectedVoice={selectedVoice}
        onSaveSelectedVoice={setSelectedVoice}
      />
    </div>
  );
};
