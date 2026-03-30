"use client";

import { useState } from 'react';
import { Package, Search, Truck, CheckCircle, Clock } from 'lucide-react';

interface TrackingEvent {
  date: string;
  time?: string;
  location: string;
  status: string;
  description: string;
}

interface TrackingData {
  trackingNumber: string;
  carrier: string;
  status: string;
  estimatedDelivery: string;
  origin: string;
  destination: string;
  events: TrackingEvent[];
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await fetch(`/api/tracking?number=${trackingNumber}`);
      const data = await response.json();

      if (data.success) {
        setTrackingData(data.data);
      } else {
        setError(data.error || 'Tracking not found');
      }
    } catch (err) {
      setError('Failed to track package. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in_transit':
        return <Truck className="w-6 h-6 text-blue-500" />;
      default:
        return <Clock className="w-6 h-6 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Package className="w-16 h-16 mx-auto text-[#d4a574] mb-4" />
          <h1 className="text-4xl font-serif text-[#3d2314] mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600">
            Enter your tracking number to see your delivery status
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number (e.g., TRK-123456)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#d4a574]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#d4a574] text-white px-6 py-3 rounded-lg hover:bg-[#b8935f] transition flex items-center gap-2 disabled:opacity-50"
            >
              <Search size={20} />
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Status Header */}
            <div className="bg-[#3d2314] text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Tracking Number</p>
                  <p className="text-xl font-bold">{trackingData.trackingNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-80">Status</p>
                  <p className="text-xl font-bold capitalize">
                    {trackingData.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {getStatusIcon(trackingData.status)}
                <span>Estimated Delivery: {trackingData.estimatedDelivery}</span>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#3d2314] mb-4">
                Shipment Progress
              </h3>
              <div className="space-y-6">
                {trackingData.events.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-[#d4a574] rounded-full" />
                      {index !== trackingData.events.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 my-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-semibold text-[#3d2314]">{event.status}</p>
                      <p className="text-gray-600 text-sm">{event.description}</p>
                      <div className="flex gap-4 mt-1 text-sm text-gray-500">
                        <span>{event.date} {event.time && `at ${event.time}`}</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Route Info */}
            <div className="bg-gray-50 p-6 border-t">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-500">From</p>
                  <p className="font-semibold text-[#3d2314]">{trackingData.origin}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">To</p>
                  <p className="font-semibold text-[#3d2314]">{trackingData.destination}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
