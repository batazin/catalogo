import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mpPayment } from '@/lib/mercadopago';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Webhook body:', body);

    const { type, data } = body;

    if (type === 'payment' && data?.id) {
      const paymentId = data.id;
      
      // Fetch status from MP
      const mpPaymentData = await mpPayment.get({ id: paymentId });
      
      const status = mpPaymentData.status;
      const external_reference = mpPaymentData.external_reference;

      if (external_reference) {
         const localPayment = await prisma.payment.findUnique({
           where: { external_reference },
           include: { gift: true }
         });

         if (localPayment) {
            await prisma.payment.update({
              where: { id: localPayment.id },
              data: { status: status || 'unknown' }
            });

            if (status === 'approved') {
              await prisma.gift.update({
                where: { id: localPayment.giftId },
                data: { status: 'BOUGHT' }
              });
            }
         }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
