import Navbar from '@/components/Navbar';
import ChatAI from '@/components/ChatAI';
import MusicPlayer from '@/components/MusicPlayer';
import TikTokDownloader from '@/components/TikTokDownloader';
import ParticleCanvas from '@/components/ParticleCanvas';

export default function Home() {
  return (
    <>
      <ParticleCanvas />
      <div className="grid-overlay" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="scanline" />

      <div className="main-content" style={{ minHeight: '100vh', paddingBottom: '40px' }}>
        <Navbar />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 12px 0' }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 14px',
              background: 'rgba(0,245,255,0.06)',
              border: '1px solid rgba(0,245,255,0.15)',
              borderRadius: '999px',
              marginBottom: '16px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00f5ff', boxShadow: '0 0 6px #00f5ff', animation: 'pulse-dot 2s ease infinite', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'rgba(0,245,255,0.8)', letterSpacing: '0.1em' }}>SYSTEM ONLINE — v2.0</span>
            </div>

            <h1 className="hero-title" style={{
              fontFamily: 'Orbitron, monospace',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 8vw, 4rem)',
              letterSpacing: '0.08em',
              lineHeight: 1.1,
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #00f5ff 0%, #8b2be2 50%, #ff2d78 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              NEXUS AI
            </h1>

            <p style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 500,
              fontSize: 'clamp(0.8rem, 3vw, 1rem)',
              color: 'rgba(160,196,216,0.65)',
              letterSpacing: '0.03em',
            }}>
              AI Chat&nbsp;&nbsp;◈&nbsp;&nbsp;Music Full&nbsp;&nbsp;◈&nbsp;&nbsp;TikTok Downloader
            </p>
          </div>

          {/* Grid: stacks to 1 column on mobile */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '14px',
            marginBottom: '14px',
          }}>
            <ChatAI />
            <MusicPlayer />
          </div>

          <TikTokDownloader />
        </div>
      </div>
    </>
  );
}
