'use client';
import { useState, useRef, useEffect } from 'react';

function formatDuration(secs) {
  if (!secs) return '0:00';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function MusicPlayer() {
  const [query, setQuery] = useState('');
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Attach audio event listeners whenever current track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime  = () => setProgress(audio.currentTime);
    const onDur   = () => setDuration(audio.duration || 0);
    const onPlay  = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => { setPlaying(false); setProgress(0); };
    const onError = () => setError('Gagal memutar audio. Coba cari ulang.');

    audio.addEventListener('timeupdate',     onTime);
    audio.addEventListener('loadedmetadata', onDur);
    audio.addEventListener('durationchange', onDur);
    audio.addEventListener('play',           onPlay);
    audio.addEventListener('pause',          onPause);
    audio.addEventListener('ended',          onEnded);
    audio.addEventListener('error',          onError);
    return () => {
      audio.removeEventListener('timeupdate',     onTime);
      audio.removeEventListener('loadedmetadata', onDur);
      audio.removeEventListener('durationchange', onDur);
      audio.removeEventListener('play',           onPlay);
      audio.removeEventListener('pause',          onPause);
      audio.removeEventListener('ended',          onEnded);
      audio.removeEventListener('error',          onError);
    };
  }, [current]);

  const search = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError('');
    setCurrent(null);
    setPlaying(false);
    setProgress(0);
    setDuration(0);

    try {
      const res  = await fetch(`/api/music?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      if (!data.results?.length) throw new Error('Lagu tidak ditemukan. Coba kata kunci lain.');

      const track = data.results[0];
      setCurrent(track);

      // Autoplay setelah data di-set
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().catch(() => {
            // Autoplay blocked — user bisa tap play manual
          });
        }
      }, 80);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const onKey = (e) => { if (e.key === 'Enter') search(); };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play().catch(() => setError('Gagal memutar. Coba lagi.'));
  };

  const seek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setProgress(ratio * duration);
  };

  const reset = () => {
    audioRef.current?.pause();
    setCurrent(null);
    setPlaying(false);
    setProgress(0);
    setDuration(0);
    setError('');
    setQuery('');
  };

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <section id="music" className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '580px' }}>
      <div className="corner-tl" /><div className="corner-tr" />
      <div className="corner-bl" /><div className="corner-br" />

      {/* Header */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="section-icon" style={{ background: 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(139,43,226,0.2))', border: '1px solid rgba(255,45,120,0.25)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff2d78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <h2 style={{ color: '#ff2d78', textShadow: '0 0 10px rgba(255,45,120,0.4)' }}>MUSIC</h2>
        </div>
        {current && (
          <button
            onClick={reset}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '7px', color: 'rgba(160,196,216,0.6)', padding: '5px 10px',
              cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'Space Mono, monospace', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(160,196,216,0.6)'; }}
          >
            ↺ RESET
          </button>
        )}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,45,120,0.5)', pointerEvents: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </span>
          <input
            className="input-cyber"
            style={{ width: '100%', padding: '11px 14px 11px 36px', borderRadius: '10px' }}
            placeholder="Cari lagu / artis..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKey}
            disabled={loading}
          />
        </div>
        <button
          onClick={search}
          disabled={loading || !query.trim()}
          style={{
            background: 'linear-gradient(135deg, rgba(255,45,120,0.2), rgba(139,43,226,0.2))',
            border: '1px solid rgba(255,45,120,0.35)', borderRadius: '10px', color: '#ff2d78',
            padding: '0 16px', cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'Orbitron, monospace', fontSize: '0.65rem', letterSpacing: '0.08em',
            opacity: !query.trim() ? 0.4 : 1, transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          {loading ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          )}
          {loading ? 'CARI...' : 'CARI'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(255,45,120,0.07)', border: '1px solid rgba(255,45,120,0.25)',
          borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px',
          color: 'rgba(255,45,120,0.9)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, marginBottom: '8px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!current && !loading && !error && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'rgba(160,196,216,0.25)' }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7">
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', textAlign: 'center' }}>Cari lagu favoritmu</span>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.75rem', color: 'rgba(0,245,255,0.3)' }}>Full audio · Powered by Spotify</span>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div className="skeleton" style={{ width: '160px', height: '160px', borderRadius: '16px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', width: '100%', maxWidth: '240px' }}>
            <div className="skeleton" style={{ height: '18px', width: '80%', borderRadius: '6px' }} />
            <div className="skeleton" style={{ height: '14px', width: '55%', borderRadius: '6px' }} />
          </div>
        </div>
      )}

      {/* Now Playing Card */}
      {current && !loading && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', animation: 'fadeIn 0.4s ease' }}>
          {/* Album Art */}
          <div style={{ position: 'relative' }}>
            {current.image ? (
              <img
                src={current.image}
                alt={current.name}
                style={{
                  width: '160px', height: '160px', borderRadius: '16px', objectFit: 'cover', display: 'block',
                  border: `2px solid rgba(255,45,120,${playing ? '0.5' : '0.2'})`,
                  boxShadow: playing
                    ? '0 0 40px rgba(255,45,120,0.3), 0 8px 32px rgba(0,0,0,0.5)'
                    : '0 8px 32px rgba(0,0,0,0.4)',
                  transition: 'all 0.4s ease',
                  animation: playing ? 'albumPulse 3s ease-in-out infinite' : 'none',
                }}
              />
            ) : (
              <div style={{
                width: '160px', height: '160px', borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(139,43,226,0.2))',
                border: '1px solid rgba(255,45,120,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,45,120,0.5)" strokeWidth="1">
                  <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
            )}
          </div>

          {/* Track Info */}
          <div style={{ textAlign: 'center', width: '100%', padding: '0 8px' }}>
            <p style={{
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.1rem',
              color: '#ff2d78', textShadow: '0 0 12px rgba(255,45,120,0.4)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{current.name}</p>
            <p style={{
              fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem',
              color: 'rgba(160,196,216,0.6)', marginTop: '4px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{current.artist}{current.album ? ` — ${current.album}` : ''}</p>
          </div>

          {/* Controls */}
          <div style={{ width: '100%', padding: '0 4px' }}>
            {/* Progress bar */}
            <div
              onClick={seek}
              style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', cursor: 'pointer', marginBottom: '6px' }}
            >
              <div style={{
                width: `${progressPct}%`, height: '100%',
                background: 'linear-gradient(90deg, #ff2d78, #8b2be2)',
                borderRadius: '2px', transition: 'width 0.1s linear',
              }} />
            </div>

            {/* Time + Play */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'rgba(160,196,216,0.45)' }}>
                {formatDuration(Math.floor(progress))}
              </span>

              {/* Play/Pause button */}
              <button
                onClick={togglePlay}
                style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: playing
                    ? 'linear-gradient(135deg, rgba(255,45,120,0.35), rgba(139,43,226,0.35))'
                    : 'linear-gradient(135deg, rgba(255,45,120,0.2), rgba(139,43,226,0.2))',
                  border: '1px solid rgba(255,45,120,0.5)',
                  color: '#ff2d78', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: playing ? '0 0 20px rgba(255,45,120,0.35)' : 'none',
                }}
              >
                {playing ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                )}
              </button>

              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'rgba(160,196,216,0.45)' }}>
                {/* Prefer actual audio duration, fallback ke metadata */}
                {duration > 0 ? formatDuration(Math.floor(duration)) : formatDuration(current.duration)}
              </span>
            </div>
          </div>

          {/* Spotify link */}
          {current.spotify_url && (
            <a
              href={current.spotify_url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontFamily: 'Space Mono, monospace', fontSize: '0.6rem',
                color: 'rgba(160,196,216,0.3)', textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#1db954'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(160,196,216,0.3)'; }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Buka di Spotify
            </a>
          )}
        </div>
      )}

      <audio ref={audioRef} src={current?.url || ''} style={{ display: 'none' }} />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes albumPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
      `}</style>
    </section>
  );
}
