import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

const accessToken = process.env.MP_ACCESS_TOKEN || '';

export const mpClient = new MercadoPagoConfig({ 
  accessToken: accessToken.trim(),
  options: { timeout: 5000 }
});

export const mpPayment = new Payment(mpClient);
export const mpPreference = new Preference(mpClient);
