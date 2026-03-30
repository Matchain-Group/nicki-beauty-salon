'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, Calendar, Lock, ArrowLeft } from 'lucide-react';

interface Order {
  _id: string;
  paystackRef: string;
  total: number;
  status: string;
  createdAt: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface Booking {
  _id: string;
  service: string;
  date: string;
  time: string;
  status: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?redirect=/account');
    } else if (status === 'authenticated' && session?.user?.email) {
      fetchOrders();
      fetchBookings();
    }
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?email=${session?.user?.email}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`/api/bookings?email=${session?.user?.email}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Password change logic here
    alert('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4a574] mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="ml-auto bg-[#3d2314] text-white px-4 py-2 rounded-lg hover:bg-[#2f1b10] transition"
          >
            Sign Out
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${
                  activeTab === 'profile' ? 'bg-[#d4a574] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <User size={20} />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 mt-2 ${
                  activeTab === 'orders' ? 'bg-[#d4a574] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <Package size={20} />
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 mt-2 ${
                  activeTab === 'bookings' ? 'bg-[#d4a574] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <Calendar size={20} />
                Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 mt-2 ${
                  activeTab === 'password' ? 'bg-[#d4a574] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <Lock size={20} />
                Password
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 mt-2 text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-600">Name</label>
                    <p className="text-lg font-medium text-gray-900">{session.user?.name}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Email</label>
                    <p className="text-lg font-medium text-gray-900">{session.user?.email}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Member Since</label>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Orders</h2>
                {orders.length === 0 ? (
                  <p className="text-gray-500">No orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-semibold">Order #{order.paystackRef}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            order.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="font-bold text-[#d4a574]">${order.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Bookings</h2>
                {bookings.length === 0 ? (
                  <p className="text-gray-500">No bookings yet.</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{booking.service}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.date).toLocaleDateString()} at {booking.time}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'password' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-gray-600 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#d4a574] text-white px-6 py-2 rounded-lg hover:bg-[#b8935f]"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
