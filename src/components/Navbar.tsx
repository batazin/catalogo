'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Home, LogOut, Settings, User } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="nav container">
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Home className="serif" size={24} style={{ color: 'var(--primary)' }} />
        <span className="serif" style={{ fontSize: '1.5rem', fontWeight: '700' }}>Nossa Casa</span>
      </Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {session ? (
          <>
            <Link href="/admin" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
              <Settings size={18} /> Painel
            </Link>
            <button onClick={() => signOut()} className="btn btn-primary" style={{ padding: '0.5rem' }}>
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <Link href="/auth/signin" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
            <User size={18} /> Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
