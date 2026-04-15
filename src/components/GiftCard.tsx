'use client';

import { useState, useEffect } from 'react';
import { Gift } from '@prisma/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, QrCode, CreditCard as CardIcon, X, Copy, ArrowLeft } from 'lucide-react';
import { showAlert, showToast } from '@/lib/swal';
import CreditCardForm from './CreditCardForm';
import { createPortal } from 'react-dom';

interface GiftCardProps {
  gift: Gift;
  onSuccess: () => void;
}

export default function GiftCard({ gift, onSuccess }: GiftCardProps) {
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qr_code: string; qr_code_base64: string } | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const bodyPayload = {
        giftId: gift.id,
        email: 'anonimo@nossacasanova.com.br'
      };

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

  const modalContent = (
    <AnimatePresence>
      {showCheckout && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          {/* Backdrop fixo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => { setShowCheckout(false); setPaymentMethod(null); setPixData(null); }}
          />

          {/* Modal Centralizado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '450px',
              backgroundColor: '#fff',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <button 
              onClick={() => { setShowCheckout(false); setPaymentMethod(null); setPixData(null); }}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#f5f5f5', border: 'none', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', zIndex: 10 }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.25rem' }}>Presentear</h4>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>{gift.name}</p>
              </div>

              {!pixData ? (
                !paymentMethod ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>Como você deseja pagar?</p>
                    
                    <button 
                      onClick={() => setPaymentMethod('pix')}
                      style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', width: '100%', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <div style={{ background: 'var(--primary)', color: '#fff', padding: '8px', borderRadius: '10px' }}>
                        <QrCode size={20} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: '700', fontSize: '1rem' }}>Pagar com PIX</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Aprovação instantânea</div>
                      </div>
                    </button>

                    <button 
                      onClick={() => setPaymentMethod('card')}
                      style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', width: '100%', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <div style={{ background: 'var(--accent)', color: '#fff', padding: '8px', borderRadius: '10px' }}>
                        <CardIcon size={20} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: '700', fontSize: '1rem' }}>Cartão de Crédito</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Parcele em até 12x</div>
                      </div>
                    </button>
                    
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f1f8e9', borderRadius: '12px', textAlign: 'center' }}>
                       <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#2e7d32' }}>Total: R$ {gift.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                ) : paymentMethod === 'pix' ? (
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button onClick={() => setPaymentMethod(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                        <ArrowLeft size={20} />
                      </button>
                      <span style={{ fontWeight: '700' }}>Pagamento via PIX</span>
                    </div>
                    
                    <button 
                      onClick={() => handleCheckout()} 
                      disabled={loading}
                      style={{ width: '100%', padding: '1rem', borderRadius: '14px', fontSize: '1rem', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                      {loading ? <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto' }} /> : 'Gerar QR Code PIX'}
                    </button>
                    
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Ao clicar, um código único será gerado para você pagar no app do seu banco.</p>
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => setPaymentMethod(null)} style={{ position: 'absolute', top: '-40px', left: '0', background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <ArrowLeft size={18} /> <span style={{ fontSize: '0.8rem' }}>Trocar método</span>
                    </button>
                    <CreditCardForm giftId={gift.id} amount={gift.price} onSuccess={onSuccess} />
                  </div>
                )
              ) : (
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ background: '#f0fdf4', color: '#166534', padding: '1rem', borderRadius: '12px', width: '100%', fontSize: '0.9rem', fontWeight: '600' }}>
                    QR Code gerado com sucesso!
                  </div>
                  
                  <div style={{ padding: '1rem', background: '#fff', border: '2px solid #f1f5f9', borderRadius: '20px' }}>
                    <img src={`data:image/png;base64,${pixData.qr_code_base64}`} alt="QR Code" style={{ width: '180px', height: '180px' }} />
                  </div>
                  
                  <div style={{ width: '100%' }}>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Escaneie o código acima ou copie o código abaixo:</p>
                    <button 
                      onClick={copyToClipboard}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', borderRadius: '14px', padding: '1rem', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                    >
                      <Copy size={18} /> Copiar Código PIX
                    </button>
                    <div style={{ marginTop: '0.8rem', padding: '0.8rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.7rem', color: '#94a3b8', wordBreak: 'break-all', maxHeight: '60px', overflowY: 'auto', border: '1px dashed #cbd5e1' }}>
                      {pixData.qr_code}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
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

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
