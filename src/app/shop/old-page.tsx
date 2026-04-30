'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isActive: boolean;
}

const categories = ['All', 'Hair', 'Skin', 'Lashes', 'Body', 'Nails'];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  };

  const handleBuyNow = async (product: Product) => {
    try {
      // Initialize Paystack payment
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'customer@example.com', // This should come from user form
          amount: product.price,
          callback_url: `${window.location.origin}/shop/success`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Save order details to session storage for later
        sessionStorage.setItem('pendingOrder', JSON.stringify({
          customerName: 'Customer Name', // This should come from user form
          email: 'customer@example.com',
          phone: '1234567890', // This should come from user form
          products: [{
            productId: product._id,
            title: product.title,
            price: product.price,
            quantity: 1,
          }],
          total: product.price,
          paystackRef: data.data.reference,
        }));

        // Redirect to Paystack
        window.location.href = data.data.authorization_url;
      } else {
        setError('Failed to initialize payment');
      }
    } catch (error) {
      setError('Failed to initialize payment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-light flex items-center justify-center">
        <div className="text-primary text-xl">Loading products...</div>
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
          <h1 className="text-4xl font-serif text-primary mb-4">Beauty Shop</h1>
          <p className="text-gray-600">Premium beauty products for your needs</p>
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

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="card">
              <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>
              <span className="inline-block bg-gold text-primary text-xs px-2 py-1 rounded-full mb-2">
                {product.category}
              </span>
              <h3 className="text-xl font-serif text-primary mb-2">{product.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gold">${product.price}</span>
                <button
                  onClick={() => handleBuyNow(product)}
                  className="btn-primary text-sm"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
