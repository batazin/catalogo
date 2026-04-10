import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mpPayment } from '@/lib/mercadopago';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { giftId, token, issuer_id, payment_method_id, installments, payerEmail, payerCpf } = await req.json();

    const gift = await prisma.gift.findUnique({
      where: { id: giftId },
    });

    if (!gift) {
      return NextResponse.json({ error: 'Presente não encontrado' }, { status: 404 });
    }

    if (gift.status === 'BOUGHT') {
      return NextResponse.json({ error: 'Este presente já foi reservado' }, { status: 400 });
    }

    const external_reference = uuidv4();

    try {
      const paymentResponse = await mpPayment.create({
        body: {
          transaction_amount: gift.price,
          token: token,
          description: `Presente: ${gift.name}`,
          installments: Number(installments),
          payment_method_id: payment_method_id,
          issuer_id: issuer_id,
          payer: {
            email: payerEmail,
            identification: {
              type: 'CPF',
              number: payerCpf
            }
          },
          external_reference: external_reference,
        }
      });

      const paymentData = paymentResponse;

      if (paymentData.status === 'approved' || paymentData.status === 'in_process') {
        // Save payment to DB
        await prisma.payment.create({
          data: {
            mp_id: paymentData.id?.toString(),
            giftId: gift.id,
            status: paymentData.status || 'pending',
            amount: gift.price,
            payer_email: payerEmail,
            external_reference: external_reference,
          }
        });

        // If approved, update gift status (or wait for webhook, but for UX we can mark as bought)
        if (paymentData.status === 'approved') {
          await prisma.gift.update({
            where: { id: gift.id },
            data: { status: 'BOUGHT' }
          });
        }
      } else {
         return NextResponse.json({ 
           status: paymentData.status,
           detail: paymentData.status_detail,
           error: 'Pagamento recusado' 
         }, { status: 400 });
      }

      return NextResponse.json({
        id: paymentData.id,
        status: paymentData.status,
        status_detail: paymentData.status_detail
      });

    } catch (mpError: any) {
      console.error('MP Card Error:', mpError);
      return NextResponse.json({ 
        error: 'Erro no processamento do cartão',
        details: mpError.message 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('General Card Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
