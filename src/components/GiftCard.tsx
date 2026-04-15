'use client';

import { useState } from 'react';
import { Gift } from '@prisma/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, QrCode, CreditCard as CardIcon, X, Copy } from 'lucide-react';
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

  const handleCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      // Garantir que o valor seja enviado corretamente
      const bodyPayload = {
        giftId: gift.id,
        email: 'anonimo@nossacasanova.com.br'
      };

      console.log('Sending checkout request with payload:', bodyPayload);

      const response = await fetch('/api/checkout/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Erro ao gerar pagamento PIX');
      }

      setPixData(data);
    } catch (error: any) {
      console.error('Checkout error:', error);
      showAlert('Erro', error.message || 'Erro ao gerar pagamento PIX', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.qr_code);
      showToast('Código PIX copiado!', 'success');
    }
  };

  const isBought = gift.status === 'BOUGHT';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <motion.div 
        layout
        className={`glass overflow-hidden flex flex-col ${isBought ? 'opacity-75 grayscale' : ''}`}
        style={{ 
          padding: '0', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}
      >
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {gift.image ? (
            <img src={gift.image} alt={gift.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: '1.5rem' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Sem imagem</div>
          )}
          {isBought && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={14} /> Reservado
            </div>
          )}
        </div>

        <div style={{ padding: '1.2rem', flex: '1', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem', fontWeight: '700', minHeight: '2.4em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: '#333' }}>{gift.name}</h3>
          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem', flex: '1', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {gift.description}
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--accent)' }}>
              R$ {gift.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            
            {!isBought && (
              <button 
                onClick={() => setShowCheckout(true)}
                className="btn btn-primary"
                style={{ fontSize: '0.75rem', padding: '0.5rem 0.8rem', borderRadius: '10px', fontWeight: '700' }}
              >
                Presentear
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Checkout Overlay - ABSOLUTE PARA NÃO AFETAR O GRID */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              padding: '1.2rem',
              backgroundColor: 'rgba(255,255,255,0.98)',
              borderRadius: '20px',
              border: '2px solid var(--primary)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
          >
            <button 
              onClick={() => { setShowCheckout(false); setPaymentMethod(null); setPixData(null); }}
              style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', background: '#f5f5f5', border: 'none', cursor: 'pointer', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={16} />
            </button>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              {!pixData ? (
                !paymentMethod ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingTop: '1rem' }}>
                    <p style={{ fontSize: '0.85rem', textAlign: 'center', fontWeight: '700', color: '#333' }}>Escolha o método:</p>
                    <button 
                      onClick={() => setPaymentMethod('pix')}
                      className="btn btn-outline"
                      style={{ padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '12px', justifyContent: 'flex-start' }}
                    >
                      <QrCode size={20} className="text-primary" />
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Pagar com PIX</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className="btn btn-outline"
                      style={{ padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '12px', justifyContent: 'flex-start' }}
                    >
                      <CardIcon size={20} className="text-primary" />
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Cartão de Crédito</span>
                    </button>
                    <p style={{ fontSize: '0.7rem', color: '#999', textAlign: 'center', marginTop: '0.5rem' }}>Total: R$ {gift.price.toLocaleString('pt-BR')}</p>
                  </div>
                ) : paymentMethod === 'pix' ? (
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>Pagar via PIX</p>
                    <button 
                      onClick={() => handleCheckout()} 
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ width: '100%', borderRadius: '12px' }}
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : 'Confirmar e Gerar PIX'}
                    </button>
                    <button onClick={() => setPaymentMethod(null)} style={{ fontSize: '0.75rem', color: '#666', background: 'none', border: 'none', textDecoration: 'underline' }}>Voltar</button>
                  </div>
                ) : (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CreditCardForm gift={gift} onSuccess={onSuccess} onCancel={() => setPaymentMethod(null)} />
                  </div>
                )
              ) : (
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <img src={`data:image/png;base64,${pixData.qr_code_base64}`} alt="QR Code" style={{ width: '140px', padding: '5px', background: '#fff', border: '1px solid #eee', borderRadius: '8px' }} />
                  <p style={{ fontSize: '0.7rem', color: '#666' }}>Escaneie no app do seu banco</p>
                  
                  <button 
                    onClick={copyToClipboard}
                    className="btn btn-outline"
                    style={{ width: '100%', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', borderRadius: '10px' }}
                  >
                    <Copy size={14} /> Copiar Código
                  </button>
                  <p style={{ fontSize: '0.6rem', color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{pixData.qr_code}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
