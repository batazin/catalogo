'use client';

import { useState } from 'react';
import { Gift } from '@prisma/client';
import { motion } from 'framer-motion';
import { Check, Loader2, QrCode, CreditCard as CardIcon } from 'lucide-react';
import { showAlert, showToast } from '@/lib/swal';
import CreditCardForm from './CreditCardForm';

interface GiftCardProps {
  gift: Gift;
  onSuccess: () => void;
}

export default function GiftCard({ gift, onSuccess }: GiftCardProps) {
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qr_code: string; qr_code_base64: string } | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/checkout/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftId: gift.id,
          email: 'anonimo@nossacasanova.com.br' // Default email for MP requirement
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Erro ao gerar pagamento PIX');
      }

      const data = await response.json();
      setPixData(data);
    } catch (error: any) {
      showAlert('Erro', error.message || 'Erro ao gerar pagamento PIX', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isBought = gift.status === 'BOUGHT';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass overflow-hidden flex flex-col h-full ${isBought ? 'opacity-75 grayscale' : ''}`}
      style={{ padding: '0', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {gift.image ? (
          <img 
            src={gift.image} 
            alt={gift.name} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain',
              padding: '1rem'
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
            Sem imagem
          </div>
        )}
        {isBought && (
          <div style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '4px 12px', 
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Check size={14} /> Reservado
          </div>
        )}
      </div>

      <div style={{ padding: '1.5rem', flex: '1', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{gift.name}</h3>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem', flex: '1' }}>
          {gift.description}
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--accent)' }}>
            R$ {gift.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          
          {!isBought && !pixData && (
             <button 
                onClick={() => setShowCheckout(true)}
                className="btn btn-primary"
                style={{ fontSize: '0.9rem', padding: '0.6rem 1rem' }}
             >
               Presentear
             </button>
          )}
        </div>

        {showCheckout && !pixData && !isBought && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}
          >
            {!paymentMethod ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.2rem', textAlign: 'center', color: '#666' }}>
                  Escolha como quer presentear:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <button 
                    onClick={() => setPaymentMethod('pix')}
                    className="btn btn-outline"
                    style={{ padding: '1rem', display: 'flex', flexDirection: 'column', height: 'auto', gap: '5px' }}
                  >
                    <QrCode size={24} />
                    <span style={{ fontSize: '0.8rem' }}>PIX</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('card')}
                    className="btn btn-outline"
                    style={{ padding: '1rem', display: 'flex', flexDirection: 'column', height: 'auto', gap: '5px' }}
                  >
                    <CardIcon size={24} />
                    <span style={{ fontSize: '0.8rem' }}>Cartão</span>
                  </button>
                </div>
              </div>
            ) : paymentMethod === 'pix' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.9rem', textAlign: 'center', color: '#666' }}>
                  Gerar código PIX para pagamento.
                </p>
                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Gerar PIX Agora'}
                </button>
                <button 
                  onClick={() => setPaymentMethod(null)}
                  style={{ background: 'none', border: 'none', fontSize: '0.7rem', color: '#999', cursor: 'pointer' }}
                >
                  Voltar
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <CreditCardForm 
                  giftId={gift.id} 
                  amount={gift.price} 
                  onSuccess={() => {
                    setShowCheckout(false);
                    onSuccess();
                  }} 
                />
                <button 
                  onClick={() => setPaymentMethod(null)}
                  style={{ background: 'none', border: 'none', fontSize: '0.7rem', color: '#999', cursor: 'pointer', marginTop: '0.5rem' }}
                >
                  Voltar
                </button>
              </div>
            )}
          </motion.div>
        )}

        {pixData && !isBought && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: '1rem', textAlign: 'center', background: '#fff', padding: '1rem', borderRadius: '12px' }}
          >
            <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: '#666' }}>Escaneie o QR Code</p>
            <img 
              src={`data:image/jpeg;base64,${pixData.qr_code_base64}`} 
              alt="QR Code PIX" 
              style={{ width: '150px', margin: '0 auto' }}
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(pixData.qr_code);
                showToast('Código PIX copiado!');
              }}
              className="btn btn-outline"
              style={{ width: '100%', fontSize: '0.8rem', marginTop: '0.5rem' }}
            >
              Copiar Código PIX
            </button>
            <p style={{ fontSize: '0.7rem', marginTop: '0.5rem', color: '#999' }}>
              Confirmaremos automaticamente assim que o pagamento for concluído.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
