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
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(null);
  const [searched, setSearched] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.currentTime);
    const onDur = () => setDuration(audio.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => { setPlaying(false); setProgress(0); };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDur);
    audio.addEventListener('durationchange', onDur);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDur);
      audio.removeEventListener('durationchange', onDur);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [current]);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/music?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const onKey = (e) => { if (e.key === 'Enter') search(); };

  const playTrack = (track) => {
    if (current?.id === track.id) {
      if (playing) audioRef.current?.pause();
      else audioRef.current?.play();
      return;
    }
    setCurrent(track);
    setProgress(0);
    setDuration(0);
    setPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(() => {});
      }
    }, 80);
  };

  const seek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setProgress(ratio * duration);
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
        {results.length > 0 && (
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'rgba(160,196,216,0.45)' }}>
            {results.length} TRACKS
          </span>
        )}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
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
          />
        </div>
        <button
          onClick={search}
          disabled={loading || !query.trim()}
          style={{
            background: 'linear-gradient(135deg, rgba(255,45,120,0.2), rgba(139,43,226,0.2))',
            border: '1px solid rgba(255,45,120,0.35)',
            borderRadius: '10px',
            color: '#ff2d78',
            padding: '0 16px',
            cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'Orbitron, monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            opacity: !query.trim() ? 0.4 : 1,
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: '6px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
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
          CARI
        </button>
      </div>

      {/* Track List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px', paddingRight: '2px' }}>
        {loading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px', borderRadius: '10px', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: '42px', height: '42px', borderRadius: '8px', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="skeleton" style={{ height: '13px', width: '55%' }} />
              <div className="skeleton" style={{ height: '11px', width: '35%' }} />
            </div>
            <div className="skeleton" style={{ width: '32px', height: '13px', borderRadius: '4px' }} />
          </div>
        ))}

        {!loading && searched && results.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(160,196,216,0.35)' }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem' }}>Tidak ditemukan</span>
          </div>
        )}

        {!loading && !searched && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'rgba(160,196,216,0.25)' }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', textAlign: 'center' }}>Cari lagu favoritmu</span>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.75rem', color: 'rgba(0,245,255,0.3)' }}>Full audio · No watermark</span>
          </div>
        )}

        {!loading && results.map((t) => {
          const isActive = current?.id === t.id;
          return (
            <div
              key={t.id}
              onClick={() => playTrack(t)}
              className={`track-item ${isActive ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', cursor: 'pointer' }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {t.image ? (
                  <img src={t.image} alt={t.name} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,45,120,0.5)" strokeWidth="1.5">
                      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                    </svg>
                  </div>
                )}
                {isActive && (
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '8px', background: 'rgba(255,45,120,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {playing ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                        <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    )}
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: isActive ? '#ff2d78' : '#e0f4ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.name}
                </p>
                <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.77rem', color: 'rgba(160,196,216,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.artist}
                </p>
              </div>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: isActive ? 'rgba(255,45,120,0.8)' : 'rgba(160,196,216,0.35)', flexShrink: 0 }}>
                {formatDuration(t.duration)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Player bar */}
      {current && (
        <div style={{
          marginTop: '10px',
          padding: '10px 12px',
          background: 'rgba(255,45,120,0.05)',
          border: '1px solid rgba(255,45,120,0.15)',
          borderRadius: '12px',
        }}>
          {/* Info row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            {current.image ? (
              <img src={current.image} alt="" style={{ width: '32px', height: '32px', borderRadius: '6px', flexShrink: 0 }} />
            ) : (
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(255,45,120,0.15)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,45,120,0.6)" strokeWidth="2">
                  <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#ff2d78' }}>
                {current.name}
              </p>
              <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.72rem', color: 'rgba(160,196,216,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {current.artist}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <button
                onClick={() => { if (playing) audioRef.current?.pause(); else audioRef.current?.play(); }}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255,45,120,0.3), rgba(139,43,226,0.3))',
                  border: '1px solid rgba(255,45,120,0.4)',
                  color: '#ff2d78',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {playing ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div
            onClick={seek}
            style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', cursor: 'pointer', position: 'relative' }}
          >
            <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #ff2d78, #8b2be2)', borderRadius: '2px', transition: 'width 0.1s linear' }} />
          </div>

          {/* Time */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'rgba(160,196,216,0.45)' }}>{formatDuration(Math.floor(progress))}</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'rgba(160,196,216,0.45)' }}>{formatDuration(Math.floor(duration))}</span>
          </div>

          <audio ref={audioRef} src={current.url} style={{ display: 'none' }} />
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
