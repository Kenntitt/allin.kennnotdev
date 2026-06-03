'use client';
import { useState } from 'react';

export default function TikTokDownloader() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVideo = async () => {
    if (!url.trim() || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/tiktok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memproses');
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const onKey = (e) => { if (e.key === 'Enter') fetchVideo(); };

  const reset = () => { setUrl(''); setResult(null); setError(''); };

  return (
    <section id="tiktok" className="glass" style={{ padding: '20px' }}>
      <div className="corner-tl" /><div className="corner-tr" />
      <div className="corner-bl" /><div className="corner-br" />

      {/* Header */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="section-icon" style={{ background: 'linear-gradient(135deg, rgba(57,255,20,0.1), rgba(0,245,255,0.15))', border: '1px solid rgba(57,255,20,0.2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.95C1 8.12 1 12 1 12s0 3.88.46 5.58a2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95C23 15.88 23 12 23 12s0-3.88-.46-5.58z"/>
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#39ff14" stroke="none"/>
            </svg>
          </div>
          <h2 style={{ color: '#39ff14', textShadow: '0 0 10px rgba(57,255,20,0.4)' }}>TIKTOK DOWNLOADER</h2>
        </div>
        {result && (
          <button onClick={reset} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '7px',
            color: 'rgba(160,196,216,0.6)',
            padding: '5px 10px',
            cursor: 'pointer',
            fontSize: '0.7rem',
            fontFamily: 'Space Mono, monospace',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(160,196,216,0.6)'; }}>
            ↺ RESET
          </button>
        )}
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(57,255,20,0.5)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </span>
          <input
            className="input-cyber"
            style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: '10px' }}
            placeholder="Paste link TikTok (contoh: https://vt.tiktok.com/...)"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={onKey}
            disabled={loading}
          />
        </div>
        <button
          onClick={fetchVideo}
          disabled={loading || !url.trim()}
          style={{
            background: loading
              ? 'rgba(57,255,20,0.05)'
              : 'linear-gradient(135deg, rgba(57,255,20,0.15), rgba(0,245,255,0.15))',
            border: '1px solid rgba(57,255,20,0.3)',
            borderRadius: '10px',
            color: '#39ff14',
            padding: '0 20px',
            cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'Orbitron, monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            opacity: !url.trim() ? 0.4 : 1,
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: '6px',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { if (!loading && url.trim()) e.currentTarget.style.boxShadow = '0 0 18px rgba(57,255,20,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
        >
          {loading ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              PROSES...
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              UNDUH
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(255,45,120,0.07)',
          border: '1px solid rgba(255,45,120,0.25)',
          borderRadius: '12px',
          padding: '14px 16px',
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          color: 'rgba(255,45,120,0.9)',
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 600,
          marginBottom: '4px',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: '20px',
          animation: 'fadeIn 0.4s ease',
        }}>
          {/* Cover */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            {result.cover && (
              <div style={{ position: 'relative', width: '100%', maxWidth: '220px' }}>
                <img
                  src={result.cover}
                  alt="cover"
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    display: 'block',
                    border: '1px solid rgba(57,255,20,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(57,255,20,0.1)',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '10px', left: '10px', right: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #39ff14, #00f5ff)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.6rem', fontWeight: 700, color: '#000', flexShrink: 0,
                    }}>
                      {(result.author?.nickname || 'U')[0].toUpperCase()}
                    </div>
                    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      @{result.author?.nickname || 'unknown'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info + Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 500,
              fontSize: '0.88rem',
              color: 'rgba(224,244,255,0.8)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '6px',
            }}>{result.title}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {result.hdplay && (
                <a href={result.hdplay} target="_blank" rel="noreferrer" className="download-btn download-btn-primary">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
                  </svg>
                  Video HD (No Watermark)
                  <span style={{ marginLeft: 'auto', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', opacity: 0.7 }}>HD</span>
                </a>
              )}
              {result.play && (
                <a href={result.play} target="_blank" rel="noreferrer" className="download-btn download-btn-secondary">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Video SD
                  <span style={{ marginLeft: 'auto', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', opacity: 0.6 }}>SD</span>
                </a>
              )}
              {result.music && (
                <a href={result.music} target="_blank" rel="noreferrer" className="download-btn download-btn-secondary">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  </svg>
                  Audio (MP3)
                  <span style={{ marginLeft: 'auto', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', opacity: 0.6 }}>MP3</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  );
}
