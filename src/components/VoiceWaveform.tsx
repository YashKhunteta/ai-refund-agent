import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceWaveformProps {
  status: 'idle' | 'listening' | 'speaking' | 'processing';
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  status,
  onStartListening,
  onStopListening,
  onStopSpeaking
}) => {
  const isListening = status === 'listening';
  const isSpeaking = status === 'speaking';
  const isProcessing = status === 'processing';

  const handleClick = () => {
    if (isListening) {
      onStopListening();
    } else if (isSpeaking) {
      onStopSpeaking();
    } else if (!isProcessing) {
      onStartListening();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '12px',
      border: '1px solid var(--border-color)',
      gap: '12px'
    }}>
      
      {/* Waveform Graphic */}
      <div style={{
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        width: '120px',
        justifyContent: 'center'
      }}>
        {isListening ? (
          <>
            <div className="wave-bar" style={{ backgroundColor: 'var(--color-success)', height: '24px' }}></div>
            <div className="wave-bar" style={{ backgroundColor: 'var(--color-success)', height: '36px', animationDelay: '0.1s' }}></div>
            <div className="wave-bar" style={{ backgroundColor: 'var(--color-success)', height: '40px', animationDelay: '0.2s' }}></div>
            <div className="wave-bar" style={{ backgroundColor: 'var(--color-success)', height: '32px', animationDelay: '0.3s' }}></div>
            <div className="wave-bar" style={{ backgroundColor: 'var(--color-success)', height: '20px', animationDelay: '0.4s' }}></div>
          </>
        ) : isSpeaking ? (
          <>
            <div className="wave-bar" style={{ backgroundColor: 'var(--color-primary)', height: '20px' }}></div>
            <div className="wave-bar" style={{ backgroundColor: 'var(--color-primary)', height: '32px', animationDelay: '0.15s' }}></div>
            <div className="wave-bar" style={{ backgroundColor: 'var(--color-primary)', height: '40px', animationDelay: '0.3s' }}></div>
            <div className="wave-bar" style={{ backgroundColor: 'var(--color-primary)', height: '28px', animationDelay: '0.45s' }}></div>
            <div className="wave-bar" style={{ backgroundColor: 'var(--color-primary)', height: '18px', animationDelay: '0.6s' }}></div>
          </>
        ) : isProcessing ? (
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-warning)',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span className="status-indicator status-warning" style={{ animation: 'pulse 1s infinite alternate' }} />
            Processing Audio...
          </div>
        ) : (
          // Idle state - flat indicators
          <>
            <div style={{ width: '4px', height: '8px', background: 'var(--text-muted)', borderRadius: '2px' }}></div>
            <div style={{ width: '4px', height: '12px', background: 'var(--text-muted)', borderRadius: '2px' }}></div>
            <div style={{ width: '4px', height: '10px', background: 'var(--text-muted)', borderRadius: '2px' }}></div>
            <div style={{ width: '4px', height: '14px', background: 'var(--text-muted)', borderRadius: '2px' }}></div>
            <div style={{ width: '4px', height: '6px', background: 'var(--text-muted)', borderRadius: '2px' }}></div>
          </>
        )}
      </div>

      {/* Mic Button Control */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={handleClick}
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: isListening
              ? 'linear-gradient(135deg, var(--color-danger), #b91c1c)'
              : isSpeaking
              ? 'linear-gradient(135deg, var(--color-warning), #d97706)'
              : 'linear-gradient(135deg, var(--color-primary), #4f46e5)',
            boxShadow: isListening
              ? '0 0 16px var(--color-danger-glow)'
              : isSpeaking
              ? '0 0 16px var(--color-warning-glow)'
              : '0 0 16px var(--color-primary-glow)',
            color: '#fff',
            transition: 'all 0.3s ease'
          }}
          className="hover-scale"
          title={
            isListening
              ? 'Stop Recording Speech'
              : isSpeaking
              ? 'Stop Agent Speech Audio'
              : 'Start Speaking (Speech-to-Text)'
          }
        >
          {isListening ? (
            <MicOff size={22} style={{ animation: 'pulse 1.5s infinite' }} />
          ) : isSpeaking ? (
            <VolumeX size={22} />
          ) : (
            <Mic size={22} />
          )}
        </button>

        {isSpeaking && (
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }} title="Agent is speaking">
            <Volume2 size={16} style={{ animation: 'bounce 1s infinite' }} />
          </div>
        )}
      </div>

      {/* Helper text instructions */}
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 500,
        color: isListening
          ? 'var(--color-danger)'
          : isSpeaking
          ? 'var(--color-warning)'
          : 'var(--text-secondary)'
      }}>
        {isListening
          ? 'Listening... Speak now'
          : isSpeaking
          ? 'Agent speaking... Click to skip'
          : isProcessing
          ? 'Orchestrating agent thoughts...'
          : 'Click Mic to speak to Agent'}
      </div>
    </div>
  );
};
