const PAYSTACK_PUBLIC_KEY = 'pk_test_c7c83c02837f509c8b481e8e0dc25224882cb6be';
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

export const paystackConfig = {
  publicKey: PAYSTACK_PUBLIC_KEY,
  secretKey: PAYSTACK_SECRET_KEY,
};

export const initializePayment = async (email: string, amount: number, metadata?: any) => {
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: amount * 100, // Paystack expects amount in kobo
      metadata,
      callback_url: `${process.env.NEXT_PUBLIC_URL}/payment/verify`,
    }),
  });

  return response.json();
};

export const verifyPayment = async (reference: string) => {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  });

  return response.json();
};
