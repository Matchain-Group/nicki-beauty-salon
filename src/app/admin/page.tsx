'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Booking {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

interface Order {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  products: Array<{
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  paystackRef: string;
  status: 'pending' | 'paid';
  createdAt: string;
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

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

interface PortfolioItem {
  _id: string;
  title: string;
  image: string;
  category: string;
  isPublished: boolean;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlacklisted: boolean;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      const [bookingsRes, ordersRes, leadsRes, productsRes, portfolioRes, usersRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/orders'),
        fetch('/api/leads'),
        fetch('/api/products'),
        fetch('/api/portfolio'),
        fetch('/api/users'),
      ]);

      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (portfolioRes.ok) setPortfolioItems(await portfolioRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setBookings(bookings.map(b => 
          b._id === bookingId ? { ...b, status: status as 'pending' | 'confirmed' | 'cancelled' } : b
        ));
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setOrders(orders.map(o => 
          o._id === orderId ? { ...o, status: status as 'pending' | 'paid' } : o
        ));
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const toggleUserBlacklist = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/blacklist`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setUsers(users.map(u => 
          u._id === userId ? { ...u, isBlacklisted: !u.isBlacklisted } : u
        ));
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p._id !== productId));
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const deletePortfolioItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;
    
    try {
      const response = await fetch(`/api/portfolio/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPortfolioItems(portfolioItems.filter(i => i._id !== itemId));
      }
    } catch (error) {
      console.error('Failed to delete portfolio item:', error);
    }
  };

  const exportLeads = async () => {
    try {
      const response = await fetch('/api/leads/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'leads.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export leads:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-cream-light flex items-center justify-center">
        <div className="text-primary text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-cream-light flex items-center justify-center">
        <div className="text-primary text-xl">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-light">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-primary text-white min-h-screen p-6">
          <h2 className="text-2xl font-serif mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'bookings', label: 'Bookings' },
              { id: 'orders', label: 'Orders' },
              { id: 'leads', label: 'Leads' },
              { id: 'products', label: 'Products' },
              { id: 'portfolio', label: 'Portfolio' },
              { id: 'users', label: 'Users' },
              { id: 'posts', label: 'Posts' },
              { id: 'engagement', label: 'Engagement' },
              { id: 'seo', label: 'SEO Preview' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === tab.id ? 'bg-gold text-primary' : 'hover:bg-primary-light'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="mt-8 pt-8 border-t border-primary-light">
            <Link href="/" className="block px-4 py-2 hover:bg-primary-light rounded">
              View Site
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 hover:bg-primary-light rounded mt-2"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-serif text-primary mb-8">Admin Dashboard</h1>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-primary">{bookings.length}</h3>
                <p className="text-gray-600">Total Bookings</p>
              </div>
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-primary">{orders.length}</h3>
                <p className="text-gray-600">Total Orders</p>
              </div>
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-primary">{leads.length}</h3>
                <p className="text-gray-600">Total Leads</p>
              </div>
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-primary">{users.length}</h3>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="card overflow-x-auto">
              <h2 className="text-xl font-serif text-primary mb-4">Bookings</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Service</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b">
                      <td className="p-2">{booking.customerName}</td>
                      <td className="p-2">{booking.service}</td>
                      <td className="p-2">{new Date(booking.date).toLocaleDateString()}</td>
                      <td className="p-2">{booking.time}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="card overflow-x-auto">
              <h2 className="text-xl font-serif text-primary mb-4">Orders</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Products</th>
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2">Reference</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="p-2">{order.customerName}</td>
                      <td className="p-2">
                        {order.products.map(p => `${p.title} x${p.quantity}`).join(', ')}
                      </td>
                      <td className="p-2">${order.total}</td>
                      <td className="p-2">{order.paystackRef}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'paid' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Leads Tab */}
          {activeTab === 'leads' && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-serif text-primary">Leads</h2>
                <button
                  onClick={exportLeads}
                  className="btn-primary text-sm"
                >
                  Export CSV
                </button>
              </div>
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead._id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-primary">{lead.name}</h3>
                        <p className="text-gray-600">{lead.email}</p>
                        <p className="text-gray-600">{lead.phone}</p>
                        <p className="mt-2">{lead.message}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="card">
              <h2 className="text-xl font-serif text-primary mb-4">Products</h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product._id} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h3 className="font-semibold text-primary">{product.title}</h3>
                      <p className="text-gray-600">{product.category}</p>
                      <p className="text-gold font-semibold">${product.price}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    </div>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="btn-secondary text-sm bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="card">
              <h2 className="text-xl font-serif text-primary mb-4">Portfolio Items</h2>
              <div className="space-y-4">
                {portfolioItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h3 className="font-semibold text-primary">{item.title}</h3>
                      <p className="text-gray-600">{item.category}</p>
                    </div>
                    <button
                      onClick={() => deletePortfolioItem(item._id)}
                      className="btn-secondary text-sm bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="card">
              <h2 className="text-xl font-serif text-primary mb-4">Blog Posts</h2>
              <div className="space-y-4">
                {[
                  { title: 'Summer Beauty Tips', date: '2024-03-15', status: 'published' },
                  { title: 'How to Choose the Right Hair Treatment', date: '2024-03-10', status: 'draft' },
                  { title: 'Lash Care 101', date: '2024-03-05', status: 'published' },
                ].map((post, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h3 className="font-semibold text-primary">{post.title}</h3>
                      <p className="text-gray-600 text-sm">{post.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                      <button className="btn-secondary text-sm">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary mt-4">Create New Post</button>
            </div>
          )}

          {/* Engagement Metrics Tab */}
          {activeTab === 'engagement' && (
            <div className="card">
              <h2 className="text-xl font-serif text-primary mb-4">Engagement Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-primary">1,234</h3>
                  <p className="text-gray-600">Total Visitors</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-primary">89</h3>
                  <p className="text-gray-600">New Leads</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-primary">45</h3>
                  <p className="text-gray-600">Bookings</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-primary">23</h3>
                  <p className="text-gray-600">Orders</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-primary">67%</h3>
                  <p className="text-gray-600">Conversion Rate</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-primary">4.8</h3>
                  <p className="text-gray-600">Avg. Rating</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-primary">Recent Activity</h3>
                {[
                  { action: 'New booking', time: '2 hours ago', user: 'Sarah Johnson' },
                  { action: 'Product purchase', time: '3 hours ago', user: 'Mike Davis' },
                  { action: 'Lead submission', time: '5 hours ago', user: 'Emma Wilson' },
                  { action: 'Portfolio view', time: '6 hours ago', user: 'Alex Brown' },
                ].map((activity, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.user}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Preview Tab */}
          {activeTab === 'seo' && (
            <div className="card">
              <h2 className="text-xl font-serif text-primary mb-4">SEO Preview</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-primary mb-2">Google Search Preview</h3>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="text-blue-600 text-lg mb-1">nickibeautysalon.com</div>
                    <div className="text-xl text-blue-800 font-semibold mb-2">Nicki Beauty Salon - Where Beauty Meets Excellence</div>
                    <div className="text-gray-600">Professional beauty services including hair treatments, lash extensions, facials, and more. Book your appointment today!</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Social Media Preview</h3>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex space-x-4">
                      <div className="w-24 h-24 bg-gray-300 rounded"></div>
                      <div>
                        <div className="font-semibold">Nicki Beauty Salon</div>
                        <div className="text-gray-600 text-sm">Professional beauty services in Lagos</div>
                        <div className="text-blue-600 text-sm">nickibeautysalon.com</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">SEO Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Title Length:</span>
                      <span className="text-green-600">Good (55 chars)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meta Description:</span>
                      <span className="text-green-600">Good (145 chars)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Page Speed:</span>
                      <span className="text-green-600">Excellent (95/100)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mobile Friendly:</span>
                      <span className="text-green-600">Yes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SSL Certificate:</span>
                      <span className="text-green-600">Valid</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="card overflow-x-auto">
              <h2 className="text-xl font-serif text-primary mb-4">Users</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.role}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.isBlacklisted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.isBlacklisted ? 'Blacklisted' : 'Active'}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => toggleUserBlacklist(user._id)}
                          className={`px-2 py-1 rounded text-xs ${
                            user.isBlacklisted ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}
                        >
                          {user.isBlacklisted ? 'Unblacklist' : 'Blacklist'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
