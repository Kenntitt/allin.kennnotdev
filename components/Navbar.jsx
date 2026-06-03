'use client';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '#chat', label: 'AI Chat', icon: '◈' },
  { href: '#music', label: 'Music', icon: '♫' },
  { href: '#tiktok', label: 'TikTok', icon: '▶' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'sticky',
        top: '12px',
        zIndex: 50,
        margin: '12px 16px 0',
        padding: '0 20px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled
          ? 'rgba(2,4,8,0.85)'
          : 'rgba(0,245,255,0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,245,255,0.15)',
        borderRadius: '14px',
        transition: 'background 0.3s ease',
        boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(139,43,226,0.3))',
          border: '1px solid rgba(0,245,255,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Orbitron, monospace',
          fontWeight: 900,
          fontSize: '0.85rem',
          color: '#00f5ff',
          textShadow: '0 0 10px rgba(0,245,255,0.7)',
          boxShadow: '0 0 14px rgba(0,245,255,0.15)',
        }}>N</div>
        <div>
          <span style={{
            fontFamily: 'Orbitron, monospace',
            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            color: '#00f5ff',
            textShadow: '0 0 8px rgba(0,245,255,0.4)',
          }}>NEXUS</span>
          <span style={{
            fontFamily: 'Orbitron, monospace',
            fontWeight: 400,
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            color: 'rgba(160,196,216,0.7)',
            marginLeft: '6px',
          }}>AI</span>
        </div>
      </div>

      {/* Desktop nav */}
      <div style={{ display: 'flex', gap: '4px' }} className="hidden md:flex">
        {NAV_LINKS.map(({ href, label, icon }) => (
          <a key={href} href={href} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px',
            borderRadius: '8px',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 600,
            fontSize: '0.85rem',
            letterSpacing: '0.05em',
            color: 'rgba(160,196,216,0.8)',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            border: '1px solid transparent',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#00f5ff';
            e.currentTarget.style.background = 'rgba(0,245,255,0.07)';
            e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(160,196,216,0.8)';
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'transparent';
          }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{icon}</span>
            {label}
          </a>
        ))}
      </div>

      {/* Badge */}
      <div className="hidden md:flex" style={{ alignItems: 'center', gap: '8px' }}>
        <span className="badge badge-online">ONLINE</span>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden"
        onClick={() => setOpen(v => !v)}
        style={{
          background: 'rgba(0,245,255,0.08)',
          border: '1px solid rgba(0,245,255,0.2)',
          borderRadius: '8px',
          color: '#00f5ff',
          width: '36px', height: '36px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '4px', cursor: 'pointer', padding: '0',
        }}
      >
        {[0,1,2].map(i => (
          <span key={i} style={{
            display: 'block',
            width: open ? (i === 1 ? '0px' : '18px') : '18px',
            height: '2px',
            background: '#00f5ff',
            borderRadius: '2px',
            transition: 'all 0.3s ease',
            transform: open
              ? i === 0 ? 'rotate(45deg) translate(4px, 4px)'
              : i === 2 ? 'rotate(-45deg) translate(4px, -4px)'
              : 'none'
              : 'none',
            opacity: open && i === 1 ? 0 : 1,
          }} />
        ))}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: '60px', left: 0, right: 0,
          background: 'rgba(2,4,8,0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(0,245,255,0.15)',
          borderRadius: '14px',
          padding: '8px',
          display: 'flex', flexDirection: 'column', gap: '4px',
          zIndex: 100,
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
        }}>
          {NAV_LINKS.map(({ href, label, icon }) => (
            <a key={href} href={href} onClick={() => setOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px',
              borderRadius: '10px',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'rgba(160,196,216,0.8)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              border: '1px solid transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#00f5ff';
              e.currentTarget.style.background = 'rgba(0,245,255,0.07)';
              e.currentTarget.style.borderColor = 'rgba(0,245,255,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(160,196,216,0.8)';
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}>
              <span style={{ width: '24px', textAlign: 'center', color: '#00f5ff' }}>{icon}</span>
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
