import Link from "next/link";
import Image from "next/image";
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Share2,
  MessageCircle,
  Video
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "Hair Relaxer", href: "/booking" },
      { name: "Lash Extensions", href: "/booking" },
      { name: "Full Body Massage", href: "/booking" },
      { name: "Facial Treatment", href: "/booking" },
      { name: "Nail Care", href: "/booking" },
      { name: "Hair Braiding", href: "/booking" },
    ],
    company: [
      { name: "About Us", href: "/#about" },
      { name: "Our Portfolio", href: "/portfolio" },
      { name: "Shop Products", href: "/shop" },
      { name: "Book Appointment", href: "/booking" },
      { name: "Contact Us", href: "/#contact" },
    ],
    support: [
      { name: "My Account", href: "/admin" },
      { name: "My Orders", href: "/orders" },
      { name: "Track Order", href: "/tracking" },
      { name: "Shopping Cart", href: "/cart" },
      { name: "Admin Dashboard", href: "/admin" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Refund Policy", href: "/refund" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: Globe, href: "https://facebook.com" },
    { name: "Instagram", icon: Share2, href: "https://instagram.com" },
    { name: "Twitter", icon: MessageCircle, href: "https://twitter.com" },
    { name: "YouTube", icon: Video, href: "https://youtube.com" },
  ];

  return (
    <footer className="bg-[#3d2314] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#d4a574]">
                <Image
                  src="/images/logo.jpg"
                  alt="Nicki Beauty Salon"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-serif">Nicki Beauty</h2>
                <p className="text-sm text-gray-400">Salon & Spa</p>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 max-w-sm">
              Transform your look with our premium beauty services. 
              Professional hair, lash, nail, and spa treatments.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin size={18} className="text-[#d4a574]" />
                <span>123 Beauty Street, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone size={18} className="text-[#d4a574]" />
                <span>+234 123 456 7890</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail size={18} className="text-[#d4a574]" />
                <span>info@nickibeauty.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Clock size={18} className="text-[#d4a574]" />
                <span>Mon-Sat: 9AM - 8PM</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#d4a574]">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#d4a574]">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#d4a574]">My Account</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Social & Newsletter Bar */}
      <div className="bg-[#2a1810] py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Follow us:</span>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#3d2314] flex items-center justify-center text-gray-300 hover:bg-[#d4a574] hover:text-white transition"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Subscribe to newsletter"
              className="px-4 py-2 rounded-lg bg-[#3d2314] text-white placeholder-gray-400 border border-gray-600 focus:border-[#d4a574] focus:outline-none w-64"
            />
            <button className="px-4 py-2 bg-[#d4a574] text-white rounded-lg hover:bg-[#b8935f] transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1a0f0a] py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>&copy; {currentYear} Nicki Beauty Salon. All rights reserved.</p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className="hover:text-white transition"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
