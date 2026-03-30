'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  getStaticPortfolioItems,
  mergePortfolioItems,
  portfolioSections,
  type PortfolioGalleryItem,
  type PortfolioSection,
} from '@/lib/portfolioData';

type PortfolioItem = PortfolioGalleryItem & {
  _id?: string;
  createdAt?: string;
};

const initialPortfolioItems = getStaticPortfolioItems();

function resolvePortfolioImage(item: PortfolioItem) {
  return item.image?.startsWith('/images/')
    ? item.image
    : '/images/portfolio/glam-makeup.jpg';
}

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(initialPortfolioItems);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>(initialPortfolioItems);
  const [selectedSection, setSelectedSection] = useState<'All' | PortfolioSection>('All');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio items');
        }

        const data: PortfolioItem[] = await response.json();
        const normalized = mergePortfolioItems(data).map((item) => ({
          ...item,
          image: resolvePortfolioImage(item),
        })) as PortfolioItem[];

        setPortfolioItems(normalized);
      } catch (_error) {
        setPortfolioItems(initialPortfolioItems);
      }
    };

    fetchPortfolioItems();
  }, []);

  useEffect(() => {
    if (selectedSection === 'All') {
      setFilteredItems(portfolioItems);
      return;
    }

    setFilteredItems(portfolioItems.filter((item) => item.section === selectedSection));
  }, [portfolioItems, selectedSection]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Our Portfolio</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {['All', ...portfolioSections].map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section as 'All' | PortfolioSection)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedSection === section
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filteredItems.map((item, index) => {
            const itemKey = item._id ?? `${item.title}-${item.image}`;

            return (
              <div
                key={itemKey}
                className="break-inside-avoid mb-4 relative group cursor-pointer"
                onMouseEnter={() => setHoveredItem(itemKey)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={300 + (index % 3) * 100}
                    className="w-full object-cover"
                    style={{ height: `${300 + (index % 3) * 100}px` }}
                  />

                  {hoveredItem === itemKey && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300">
                      <div className="text-center">
                        <div className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium mb-2">
                          {item.category}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No portfolio items found in this category.</p>
          </div>
        )}

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
