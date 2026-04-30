'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PortfolioItem {
  _id: string;
  title: string;
  image: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
}

const categories = ['All', 'Hair Styling', 'Lash Extensions', 'Facial Treatment', 'Nail Art', 'Makeup'];

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setPortfolioItems(data);
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
      <div className="min-h-screen bg-cream-light flex items-center justify-center">
        <div className="text-primary text-xl">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-light py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-primary hover:text-primary-light mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-serif text-primary mb-4">Our Portfolio</h1>
          <p className="text-gray-600">Explore our beautiful work and transformations</p>
        </div>

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
                  ? 'bg-primary text-white'
                  : 'bg-white text-primary border border-primary hover:bg-primary hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid - Masonry Style */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item, index) => (
            <div key={item._id} className="break-inside-avoid mb-6">
              <div className="card overflow-hidden">
                <div 
                  className={`bg-gray-200 rounded-lg flex items-center justify-center ${
                    index % 3 === 0 ? 'h-64' : index % 3 === 1 ? 'h-80' : 'h-56'
                  }`}
                >
                  <span className="text-gray-500 text-center px-4">{item.title}</span>
                </div>
                <div className="p-4">
                  <span className="inline-block bg-gold text-primary text-xs px-2 py-1 rounded-full mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-serif text-primary">{item.title}</h3>
                </div>
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
        <div className="text-center mt-12 bg-primary text-white py-12 px-6 rounded-lg">
          <h2 className="text-3xl font-serif mb-4">Ready to Transform Your Look?</h2>
          <p className="mb-6 text-cream-light">Book an appointment with our expert stylists today!</p>
          <Link href="/booking" className="btn-primary bg-gold text-primary hover:bg-gold-deep">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
