'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { getStaticProducts } from '@/lib/productData';

interface Product {
  _id?: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isActive: boolean;
}

const categories = ['All', 'Hair', 'Skin', 'Lashes', 'Body', 'Nails'];
const sortOptions = [
  'Most Recent',
  'Best Selling', 
  'Price: Low to High',
  'Price: High to Low',
  'Top Rated'
];

// Product image mapping for local product images
const productImageMap: { [key: string]: string } = {
  'Hydration Mask': '/images/hydration-mask.jpg',
  'Glass Serum': '/images/glass-serum.jpg',
  'Curl Cream': '/images/curl-cream.jpg',
  'Nail Oil': '/images/nail-oil.jpg',
};

const fallbackProducts = getStaticProducts();

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Most Recent');
  const [gridColumns, setGridColumns] = useState(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const router = useRouter();
  const { addItem } = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, selectedSort]);

  const fetchProducts = async () => {
    try {
      setError('');
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : fallbackProducts);
      } else {
        setProducts(fallbackProducts);
      }
    } catch (error) {
      console.warn('Falling back to local product catalog:', error);
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (selectedSort) {
        case 'Price: Low to High':
          return a.price - b.price;
        case 'Price: High to Low':
          return b.price - a.price;
        case 'Best Selling':
          return Math.random() - 0.5;
        case 'Top Rated':
          return Math.random() - 0.5;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const handleAddToCart = (product: Product, qty: number = 1) => {
    const productId = product._id ?? `${product.title}-${product.image}`;

    addItem({
      id: productId,
      title: product.title,
      price: product.price,
      quantity: qty,
      image: getProductImage(product),
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = async (product: Product) => {
    if (!session) {
      router.push('/auth/signin?redirect=/shop');
      return;
    }
    
    // Add to cart first
    handleAddToCart(product, quantity);
    
    // Redirect to cart for checkout
    router.push('/cart');
  };

  const getProductImage = (product: Product) => {
    return productImageMap[product.title] || product.image;
  };

  const isBestseller = (product: Product) => {
    return ['Hydration Mask', 'Glass Serum'].includes(product.title);
  };

  const hasFreeDelivery = (product: Product) => {
    return product.price > 30;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Beauty Shop</h1>
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

        <div className="flex items-center justify-between mb-8">
          <div className="text-gray-600">
            {filteredProducts.length} results
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
            >
              {sortOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setGridColumns(2)}
                className={`px-3 py-2 ${gridColumns === 2 ? 'bg-gray-200' : ''}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3h2v2H5V3zm0 4h2v2H5V7zm0 4h2v2H5v-2zm0 4h2v2H5v-2zM9 3h6v2H9V3zm0 4h6v2H9V7zm0 4h6v2H9v-2zm0 4h6v2H9v-2z"/>
                </svg>
              </button>
              <button
                onClick={() => setGridColumns(4)}
                className={`px-3 py-2 ${gridColumns === 4 ? 'bg-gray-200' : ''}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3h2v2H5V3zm3 0h2v2H8V3zm3 0h2v2h-2V3zm3 0h2v2h-2V3zM5 6h2v2H5V6zm3 0h2v2H8V6zm3 0h2v2h-2V6zm3 0h2v2h-2V6zM5 9h2v2H5V9zm3 0h2v2H8V9zm3 0h2v2h-2V9zm3 0h2v2h-2V9zM5 12h2v2H5v-2zm3 0h2v2H8v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
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

        <div className={`grid gap-6 ${
          gridColumns === 2 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'
        }`}>
          {filteredProducts.map((product) => {
            const productKey = product._id ?? `${product.title}-${product.image}`;

            return (
            <div key={productKey} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <Image
                  src={getProductImage(product)}
                  alt={product.title}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                
                {isBestseller(product) && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    Bestseller
                  </div>
                )}
                
                {hasFreeDelivery(product) && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Free delivery
                  </div>
                )}
                
                <button
                  onClick={() => toggleWishlist(productKey)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg"
                >
                  <svg
                    className={`w-4 h-4 ${wishlist.has(productKey) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-1">{product.description}</p>
                
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 text-sm">
                    {'★'.repeat(4)}{'☆'.repeat(1)}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">(128)</span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                </div>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {addedToCart ? 'Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-8 p-6">
              <div>
                <Image
                  src={getProductImage(selectedProduct)}
                  alt={selectedProduct.title}
                  width={400}
                  height={400}
                  className="w-full rounded-lg"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.title}</h2>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(4)}{'☆'.repeat(1)}
                  </div>
                  <span className="text-gray-500 ml-2">(128 reviews)</span>
                </div>
                
                <p className="text-3xl font-bold text-gray-900 mb-4">${selectedProduct.price.toFixed(2)}</p>
                
                <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                
                <div className="flex items-center mb-6">
                  <span className="mr-4">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-2">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => handleAddToCart(selectedProduct, quantity)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => handleBuyNow(selectedProduct)}
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Buy it Now
                  </button>
                  <Link href="/cart" className="w-full block text-center bg-[#d4a574] text-white py-3 rounded-lg hover:bg-[#b8935f] transition-colors">
                    View Cart →
                  </Link>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                    </svg>
                    <span className="text-sm text-gray-600">Free delivery on orders over $30</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm text-gray-600">30-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t p-6">
              <h3 className="text-lg font-semibold mb-4">You may also like</h3>
              <div className="grid grid-cols-4 gap-4">
                {filteredProducts.slice(0, 4).map((product) => {
                  const productKey = product._id ?? `${product.title}-${product.image}`;

                  return (
                  <div key={productKey} className="cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <Image
                      src={getProductImage(product)}
                      alt={product.title}
                      width={150}
                      height={150}
                      className="w-full rounded-lg mb-2"
                    />
                    <h4 className="text-sm font-medium text-gray-900">{product.title}</h4>
                    <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
