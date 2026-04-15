'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Home, LogOut, Settings, User, Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: scrolled ? '0.8rem 0' : '1.5rem 0',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: scrolled ? 'rgba(254, 250, 224, 0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(92, 110, 88, 0.1)' : '1px solid transparent',
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.03)' : 'none'
    }}>
      <nav className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link href="/" style={{ 
          textDecoration: 'none', 
          color: 'var(--foreground)', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="serif" style={{ 
              fontSize: '1.4rem', 
              fontWeight: '700', 
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'var(--primary)',
              lineHeight: '1.1'
            }}>Nossa Casa</span>
          </div>
        </Link>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          {session ? (
            <>
              <Link href="/admin" className="btn btn-outline" style={{ 
                padding: '0.4rem 1rem',
                fontSize: '0.85rem',
                borderRadius: '100px',
                borderWidth: '1px',
                backgroundColor: 'rgba(255,255,255,0.4)',
                height: '38px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Settings size={14} /> Painel
              </Link>
              <button 
                onClick={() => signOut()} 
                className="btn" 
                style={{ 
                  width: '38px',
                  height: '38px',
                  padding: '0',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  boxShadow: '0 4px 10px rgba(92, 110, 88, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link href="/auth/signin" className="btn btn-outline" style={{ 
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              borderRadius: '100px',
              borderWidth: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '38px'
            }}>
              <User size={14} /> Admin
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
