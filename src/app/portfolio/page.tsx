'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PortfolioItem {
  _id: string;
  title: string;
  image: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
}

const categories = ['All', 'Hair Styling', 'Lash Extensions', 'Facial Treatment', 'Nail Art', 'Makeup'];

// Working beauty salon images for portfolio
const portfolioImages = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=85&fit=crop',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85&fit=crop',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85&fit=crop&crop=top',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=85&fit=crop',
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=85&fit=crop',
  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=85&fit=crop',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=85&fit=crop',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=85&fit=crop',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=85&fit=crop',
];

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [portfolioItems, selectedCategory]);

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        // Update portfolio items with working images
        const updatedItems = data.map((item: PortfolioItem, index: number) => ({
          ...item,
          image: portfolioImages[index % portfolioImages.length]
        }));
        setPortfolioItems(updatedItems);
      } else {
        setError('Failed to fetch portfolio items');
      }
    } catch (error) {
      setError('Failed to fetch portfolio items');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (selectedCategory === 'All') {
      setFilteredItems(portfolioItems);
    } else {
      setFilteredItems(portfolioItems.filter(item => item.category === selectedCategory));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Our Portfolio</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Pinterest-style Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filteredItems.map((item, index) => (
            <div 
              key={item._id} 
              className="break-inside-avoid mb-4 relative group cursor-pointer"
              onMouseEnter={() => setHoveredItem(item._id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={300 + (index % 3) * 100} // Varying heights for masonry effect
                  className="w-full object-cover"
                  style={{ 
                    height: `${300 + (index % 3) * 100}px`,
                  }}
                />
                
                {/* Hover Overlay */}
                {hoveredItem === item._id && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300">
                    <div className="text-center">
                      <div className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium mb-2">
                        {item.category}
                      </div>
                      <div className="flex justify-center">
                        <svg className="w-6 h-6 text-white hover:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Item Info */}
              <div className="mt-2">
                <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No portfolio items found in this category.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 bg-black text-white py-16 px-8 rounded-2xl">
          <h2 className="text-4xl font-serif mb-4">Ready to Transform Your Look?</h2>
          <p className="mb-8 text-gray-300 text-lg">Book an appointment with our expert stylists today!</p>
          <Link 
            href="/booking" 
            className="inline-block bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
