'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, count, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const shipping = total > 30 ? 0 : 5;
  const payableTotal = total + shipping;

  const handleCheckout = async () => {
    if (!session) {
      router.push('/auth/signin?redirect=/cart');
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email || 'guest@nickibeauty.com',
          amount: payableTotal,
          metadata: {
            customerName: session?.user?.name || 'Customer',
            phone: 'N/A',
            subtotal: total,
            shipping,
            total: payableTotal,
            items: items.map(i => ({
              id: i.id,
              title: i.title,
              quantity: i.quantity,
              price: i.price
            }))
          }
        })
      });

      const data = await response.json();
      
      if (data.success && data.data.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        const details = data?.details?.message || data?.details?.data?.message;
        throw new Error(data.error || details || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven&apos;t added any items to your cart yet.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#d4a574] text-white px-8 py-3 rounded-lg hover:bg-[#b8935f] transition"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/shop" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart ({count} items)</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded-lg"
                    sizes="96px"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-[#d4a574] font-bold">${item.price.toFixed(2)}</p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={18} />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({count} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : '$5.00'}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${payableTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-[#d4a574] text-white py-3 rounded-lg hover:bg-[#b8935f] transition disabled:opacity-50 font-semibold"
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              {!session && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Please <Link href="/auth/signin" className="text-[#d4a574] hover:underline">sign in</Link> to checkout
                </p>
              )}

              <div className="mt-6 text-sm text-gray-500">
                <p className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">✓</span> Free shipping on orders over $30
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 30-day return policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
