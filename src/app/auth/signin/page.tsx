'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2 } from "lucide-react";
import { showToast } from "@/lib/swal";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      showToast("Credenciais inválidas", "error");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <h2 className="serif" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>Acesso Restrito</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
            <input 
              type="email" 
              placeholder="E-mail"
              required
              className="glass"
              style={{ width: '100%', padding: '1rem 1rem 1rem 2.8rem', borderRadius: '12px', border: '1px solid #ddd' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
            <input 
              type="password" 
              placeholder="Senha"
              required
              className="glass"
              style={{ width: '100%', padding: '1rem 1rem 1rem 2.8rem', borderRadius: '12px', border: '1px solid #ddd' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '1rem', width: '100%' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
