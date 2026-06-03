'use client';
import { useState, useRef, useEffect } from 'react';

export default function ChatAI() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Halo! 👋 Saya Nexus AI. Tanya apa saja, saya siap membantu!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const clearChat = () => {
    setMessages([{ role: 'ai', text: 'Chat dibersihkan. Ada yang bisa saya bantu? 🚀' }]);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages(m => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'ai', text: data.reply || data.error || 'Maaf, tidak ada respons.' }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: '❌ Koneksi gagal. Coba lagi.' }]);
    }
    setLoading(false);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <section id="chat" className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '580px' }}>
      {/* Corner decorations */}
      <div className="corner-tl" /><div className="corner-tr" />
      <div className="corner-bl" /><div className="corner-br" />

      {/* Header */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="section-icon" style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(139,43,226,0.2))', border: '1px solid rgba(0,245,255,0.25)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h2>AI CHAT</h2>
        </div>
        <button
          onClick={clearChat}
          title="Clear chat"
          style={{
            background: 'rgba(255,45,120,0.08)',
            border: '1px solid rgba(255,45,120,0.2)',
            borderRadius: '7px',
            color: 'rgba(255,45,120,0.8)',
            padding: '5px 10px',
            cursor: 'pointer',
            fontSize: '0.7rem',
            fontFamily: 'Space Mono, monospace',
            display: 'flex', alignItems: 'center', gap: '5px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,45,120,0.15)'; e.currentTarget.style.color = '#ff2d78'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,45,120,0.08)'; e.currentTarget.style.color = 'rgba(255,45,120,0.8)'; }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
          CLEAR
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'ai' && (
              <div style={{
                width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(139,43,226,0.25))',
                border: '1px solid rgba(0,245,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginRight: '8px', marginTop: '2px',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00f5ff" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                </svg>
              </div>
            )}
            <div
              className={m.role === 'user' ? 'bubble-user' : 'bubble-ai'}
              style={{
                maxWidth: '78%',
                padding: '10px 14px',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 500,
              }}
            >
              {m.text}
            </div>
            {m.role === 'user' && (
              <div style={{
                width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(139,43,226,0.3), rgba(255,45,120,0.25))',
                border: '1px solid rgba(139,43,226,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginLeft: '8px', marginTop: '2px',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b2be2" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(139,43,226,0.25))',
              border: '1px solid rgba(0,245,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00f5ff" strokeWidth="2" style={{ animation: 'spin 2s linear infinite' }}>
                <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
            </div>
            <div className="bubble-ai" style={{ padding: '10px 16px' }}>
              <div className="loading-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ marginTop: '14px', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            className="input-cyber"
            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px' }}
            placeholder="Ketik pesan... (Enter untuk kirim)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            disabled={loading}
          />
        </div>
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="btn-neon"
          style={{
            padding: '11px 18px',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          KIRIM
        </button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
