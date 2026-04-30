'use client';

import { useState } from 'react';
import { X, Phone, Truck, MessageCircle } from 'lucide-react';

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);
  
  const phoneNumber = '+2341234567890';
  const message = 'Hi! I\'m interested in your beauty services.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded Menu */}
      {isOpen && (
        <>
          {/* Track Order Button */}
          <a
            href="/tracking"
            className="flex items-center gap-2 bg-[#d4a574] text-[#3d2314] px-4 py-3 rounded-full shadow-lg hover:bg-[#b8935f] transition-all duration-300 animate-in fade-in slide-in-from-right-4"
          >
            <Truck size={20} />
            <span className="font-medium whitespace-nowrap">Track Order</span>
          </a>
          
          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 animate-in fade-in slide-in-from-right-4"
          >
            <MessageCircle size={20} />
            <span className="font-medium whitespace-nowrap">Chat on WhatsApp</span>
          </a>
          
          {/* Call Button */}
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center gap-2 bg-[#3d2314] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#5a3a23] transition-all duration-300 animate-in fade-in slide-in-from-right-4"
          >
            <Phone size={20} />
            <span className="font-medium whitespace-nowrap">Call Us</span>
          </a>
        </>
      )}
      
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-gray-600 rotate-45' : 'bg-[#d4a574] hover:bg-[#b8935f]'
        }`}
        aria-label={isOpen ? 'Close menu' : 'Open actions menu'}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Truck size={28} className="text-[#3d2314]" />
        )}
      </button>
    </div>
  );
}
