"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';

function PaymentVerifyContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const { clearCart } = useCart();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      return;
    }

    fetch(`/api/paystack/verify?reference=${reference}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          clearCart();
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [reference]);

  if (status === 'verifying')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#d4a574] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[#3d2314] text-lg">Verifying your payment...</p>
        </div>
      </div>
    );

  if (status === 'success')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">OK</span>
          </div>
          <h1 className="text-2xl font-serif text-[#3d2314] mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. A confirmation email has been sent to you.
          </p>
          <p className="text-sm text-gray-500 mb-6">Reference: {reference}</p>
          <a
            href="/orders"
            className="block w-full bg-[#d4a574] text-white py-3 rounded-xl text-center hover:bg-[#b8935f] transition"
          >
            View My Orders
          </a>
          <a
            href="/shop"
            className="block w-full mt-3 border border-[#d4a574] text-[#d4a574] py-3 rounded-xl text-center hover:bg-gray-50 transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">X</span>
        </div>
        <h1 className="text-2xl font-serif text-[#3d2314] mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          Something went wrong with your payment. Please try again.
        </p>
        <a href="/cart" className="block w-full bg-[#d4a574] text-white py-3 rounded-xl text-center">
          Try Again
        </a>
      </div>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-[#3d2314] text-lg">Loading payment status...</div>
        </div>
      }
    >
      <PaymentVerifyContent />
    </Suspense>
  );
}
