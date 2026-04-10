import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mpPayment } from '@/lib/mercadopago';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { giftId, email } = await req.json();

    const gift = await prisma.gift.findUnique({
      where: { id: giftId },
    });

    if (!gift) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    if (gift.status === 'BOUGHT') {
      return NextResponse.json({ error: 'Gift already bought' }, { status: 400 });
    }

    console.log(`Creating PIX payment for gift: ${gift.name} (${gift.id}) - Price: ${gift.price}`);
    
    const external_reference = uuidv4();

    // Create Mercado Pago PIX Payment
    try {
      const paymentResponse = await mpPayment.create({
        body: {
          transaction_amount: gift.price,
          description: `Presente de Casa Nova: ${gift.name}`,
          payment_method_id: 'pix',
          payer: {
            email: email,
            first_name: 'Convidado',
            last_name: 'Amigo',
          },
          external_reference: external_reference,
          // Removed notification_url if it's localhost to prevent validation errors
          // notification_url: `${process.env.NEXTAUTH_URL}/api/webhook`,
        }
      });

      console.log('Mercado Pago Response received');
      const paymentData = paymentResponse;

      if (!paymentData.id) {
        console.error('Mercado Pago response missing ID:', paymentData);
        throw new Error('Mercado Pago failed to return a payment ID');
      }

      // Save payment attempt to DB
      await prisma.payment.create({
        data: {
          mp_id: paymentData.id.toString(),
          giftId: gift.id,
          status: 'pending',
          amount: gift.price,
          payer_email: email,
          qr_code: paymentData.point_of_interaction?.transaction_data?.qr_code,
          qr_code_base64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64,
          external_reference: external_reference,
        }
      });

      console.log('Payment saved to database:', paymentData.id);

      return NextResponse.json({
        id: paymentData.id,
        qr_code: paymentData.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64,
      });
    } catch (mpError: any) {
      console.error('--- MERCADO PAGO SDK ERROR ---');
      console.error('Error Status:', mpError.status);
      console.error('Error Details:', JSON.stringify(mpError.message || mpError, null, 2));
      throw mpError;
    }
  } catch (error: any) {
    console.error('--- GENERAL CHECKOUT ERROR ---');
    console.error(error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create payment',
      details: error.response?.data?.message || error.message || null
    }, { status: 500 });
  }
}
