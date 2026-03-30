"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import Logo from "@/components/Logo";
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Package, 
  LayoutDashboard,
  Home,
  Calendar,
  Image as ImageIcon,
  Store,
  Phone,
  Truck
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { count: cartCount } = useCart();

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Services", href: "/booking", icon: Calendar },
    { name: "Portfolio", href: "/portfolio", icon: ImageIcon },
    { name: "Shop", href: "/shop", icon: Store },
    { name: "Contact", href: "/#contact", icon: Phone },
  ];

  const userLinks = [
    { name: "Cart", href: "/cart", icon: ShoppingCart, badge: cartCount },
    { name: "Orders", href: "/orders", icon: Package },
    { name: "Track Order", href: "/tracking", icon: Truck },
  ];

  const isAdmin = session?.user?.role === 'admin';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-[#3d2314] text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p className="hidden sm:block">📞 Call us: +1 (310) 555-0192</p>
          <p className="hidden md:block">✨ Premium Beauty Services</p>
          <div className="flex gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/account" className="hover:text-[#d4a574] transition">
                  Welcome, {session.user?.name || "User"}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                  className="text-white/90 hover:text-[#d4a574] transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/auth/signin" className="hover:text-[#d4a574] transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Logo size={48} />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-[#3d2314] font-serif">
                Nicki Beauty
              </h1>
              <p className="text-xs text-gray-500">Salon & Spa</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 text-gray-700 hover:text-[#d4a574] transition font-medium"
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {userLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative flex items-center gap-2 text-gray-700 hover:text-[#d4a574] transition"
              >
                <link.icon size={20} />
                <span className="font-medium">{link.name}</span>
                {link.badge && link.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            
            {/* Admin Dashboard Link - Only for admins */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-gray-700 hover:text-[#d4a574] transition"
              >
                <LayoutDashboard size={20} />
                <span className="font-medium">Admin</span>
              </Link>
            )}
            
            {/* User Profile */}
            <Link
              href={session ? "/account" : "/auth/signin"}
              className="flex items-center gap-2 bg-[#d4a574] text-white px-4 py-2 rounded-full hover:bg-[#b8935f] transition"
            >
              <User size={18} />
              <span className="hidden xl:inline">{session ? "Account" : "Sign In"}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#d4a574] transition"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            {/* Main Nav */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Menu
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-[#d4a574] transition"
                >
                  <link.icon size={20} />
                  {link.name}
                </Link>
              ))}
            </div>

            <hr />

            {/* User Links */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                My Account
              </p>
              {userLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-[#d4a574] transition"
                >
                  <link.icon size={20} />
                  {link.name}
                  {link.badge && link.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-[#d4a574] transition"
                >
                  <LayoutDashboard size={20} />
                  Admin Dashboard
                </Link>
              )}
            </div>

            <hr />

            {/* Auth */}
            <Link
              href={session ? "/account" : "/auth/signin"}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#d4a574] text-white py-3 rounded-lg hover:bg-[#b8935f] transition"
            >
              <User size={20} />
              {session ? "My Account" : "Sign In"}
            </Link>
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
