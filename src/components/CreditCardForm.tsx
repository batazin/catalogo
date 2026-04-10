'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { showAlert } from '@/lib/swal';

interface CreditCardFormProps {
  giftId: string;
  amount: number;
  onSuccess: () => void;
}

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export default function CreditCardForm({ giftId, amount, onSuccess }: CreditCardFormProps) {
  const [loading, setLoading] = useState(true);
  const brickController = useRef<any>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
    if (!window.MercadoPago || !publicKey || initialized.current) return;

    initialized.current = true;
    
    // Clear container to avoid visual bugs
    const container = document.getElementById('cardPaymentBrick_container');
    if (container) container.innerHTML = '';

    const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' });
    const bricksBuilder = mp.bricks();

    const renderCardBrick = async () => {
      try {
        brickController.current = await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', {
          initialization: {
            amount: amount,
            payer: {
              email: "",
            },
          },
          customization: {
            visual: {
              theme: 'default',
              style: {
                customVariables: {
                  borderRadius: '12px',
                }
              }
            },
            paymentMethods: {
              maxInstallments: 1,
            }
          },
          callbacks: {
            onReady: () => {
              setLoading(false);
            },
            onSubmit: async (formData: any) => {
              try {
                const response = await fetch('/api/checkout/card', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    giftId,
                    token: formData.token,
                    issuer_id: formData.issuer_id,
                    payment_method_id: formData.payment_method_id,
                    installments: formData.installments,
                    payerEmail: formData.payer.email,
                    payerCpf: formData.payer.identification.number
                  })
                });

                const result = await response.json();

                if (response.ok && (result.status === 'approved' || result.status === 'in_process')) {
                  showAlert('Sucesso!', 'Seu presente foi enviado com sucesso. Obrigado!', 'success');
                  onSuccess();
                } else {
                  throw new Error(result.error || result.status_detail || 'Falha no pagamento');
                }
              } catch (error: any) {
                showAlert('Erro no Pagamento', error.message || 'Erro ao processar o cartão', 'error');
                throw error;
              }
            },
            onError: (error: any) => {
              console.error('Brick Error:', error);
            },
          },
        });
      } catch (e) {
        console.error("Brick Creation Failed:", e);
      }
    };

    renderCardBrick();

    return () => {
      // Cleanup is usually handled by brickController.current.unmount()
    };
  }, [amount, giftId]);

  return (
    <div style={{ 
      minHeight: '400px', 
      width: '100%', 
      position: 'relative', 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '20px',
      marginTop: '1rem',
      boxShadow: 'inset 0 0 0 1px #eee'
    }}>
      {loading && (
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'white',
          zIndex: 10,
          borderRadius: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={32} color="var(--primary)" />
            <p style={{ fontSize: '0.8rem', marginTop: '10px', color: '#999' }}>Carregando checkout seguro...</p>
          </div>
        </div>
      )}
      <div id="cardPaymentBrick_container"></div>
    </div>
  );
}
