'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface OrderDetails {
  customerName: string;
  email: string;
  phone: string;
  products: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  paystackRef: string;
}

function ShopSuccessContent() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  useEffect(() => {
    if (reference) {
      verifyPayment();
    }
  }, [reference]);

  const verifyPayment = async () => {
    try {
      // Verify payment with Paystack
      const verifyResponse = await fetch(`/api/paystack/verify?reference=${reference}`);
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        
        if (verifyData.data.status === 'success') {
          // Get order details from session storage
          const pendingOrder = sessionStorage.getItem('pendingOrder');
          
          if (pendingOrder) {
            const orderData: OrderDetails = JSON.parse(pendingOrder);
            
            // Save order to database
            const orderResponse = await fetch('/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...orderData,
                status: 'paid',
              }),
            });

            if (orderResponse.ok) {
              setOrderDetails(orderData);
              setVerificationStatus('verified');
              sessionStorage.removeItem('pendingOrder');
            } else {
              setError('Failed to save order');
              setVerificationStatus('failed');
            }
          }
        } else {
          setError('Payment verification failed');
          setVerificationStatus('failed');
        }
      } else {
        setError('Payment verification failed');
        setVerificationStatus('failed');
      }
    } catch (error) {
      setError('Payment verification failed');
      setVerificationStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-light flex items-center justify-center">
        <div className="text-center">
          <div className="text-primary text-xl mb-4">Verifying your payment...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'failed' || error) {
    return (
      <div className="min-h-screen bg-cream-light flex items-center justify-center px-4">
        <div className="max-w-md w-full card text-center">
          <div className="text-red-500 text-6xl mb-4">✗</div>
          <h1 className="text-3xl font-serif text-primary mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-6">{error || 'There was an issue processing your payment.'}</p>
          <div className="space-y-2">
            <Link href="/shop" className="block btn-primary">
              Back to Shop
            </Link>
            <Link href="/" className="block btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'verified' && orderDetails) {
    return (
      <div className="min-h-screen bg-cream-light py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-serif text-primary mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been successfully processed.</p>
            
            <div className="bg-cream p-6 rounded-lg text-left mb-8">
              <h2 className="text-xl font-serif text-primary mb-4">Order Details</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Order ID:</span> {orderDetails.paystackRef}</p>
                <p><span className="font-semibold">Customer:</span> {orderDetails.customerName}</p>
                <p><span className="font-semibold">Email:</span> {orderDetails.email}</p>
                <p><span className="font-semibold">Phone:</span> {orderDetails.phone}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <h3 className="font-semibold mb-2">Products:</h3>
                  {orderDetails.products.map((product, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{product.title} x {product.quantity}</span>
                      <span>${product.price * product.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-300">
                    <span>Total Paid:</span>
                    <span className="text-gold">${orderDetails.total}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link href="/shop" className="block btn-primary">
                Continue Shopping
              </Link>
              <Link href="/" className="block btn-secondary">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-light flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500">Invalid payment reference</p>
        <Link href="/shop" className="btn-primary mt-4 inline-block">
          Back to Shop
        </Link>
      </div>
    </div>
  );
}

export default function ShopSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream-light flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    }>
      <ShopSuccessContent />
    </Suspense>
  );
}
