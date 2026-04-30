'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type LeadFormData = z.infer<typeof leadSchema>;

const services = [
  {
    title: 'Hair Relaxer',
    description: 'Professional hair straightening and relaxing treatments',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=85&fit=crop',
  },
  {
    title: 'Lash Extensions',
    description: 'Beautiful, natural-looking lash extensions',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=85&fit=crop',
  },
  {
    title: 'Full Body Massage',
    description: 'Relaxing full body massage therapy',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=85&fit=crop',
  },
  {
    title: 'Facial Treatment',
    description: 'Rejuvenating facial treatments for glowing skin',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=85&fit=crop',
  },
  {
    title: 'Nail Manicure and Pedicure',
    description: 'Professional nail care and art services',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=85&fit=crop',
  },
  {
    title: 'Hair Braiding',
    description: 'Traditional and modern hair braiding styles',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=85&fit=crop',
  },
];

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=85&fit=crop&crop=top',
    title: 'Nicki Beauty Salon',
    subtitle: 'Where Beauty Meets Excellence',
    cta1: 'Book Appointment',
    cta2: 'Shop Products',
  },
  {
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=85&fit=crop',
    title: 'Premium Beauty Services',
    subtitle: 'Transform Your Look Today',
    cta1: 'View Services',
    cta2: 'Book Now',
  },
  {
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85&fit=crop&crop=top',
    title: 'Professional Beauty Products',
    subtitle: 'Shop Our Premium Collection',
    cta1: 'Shop Now',
    cta2: 'Learn More',
  },
];

const promoItems = [
  {
    title: 'New Hair Treatment',
    description: 'Keratin smoothing treatment - 20% off this month',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=85&fit=crop',
  },
  {
    title: 'Lash Extension Special',
    description: 'Get volume lashes with complimentary touch-up',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=85&fit=crop',
  },
  {
    title: 'Facial Package Deal',
    description: '3 facial sessions for price of 2',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=85&fit=crop',
  },
  {
    title: 'Nail Art Workshop',
    description: 'Learn nail art techniques from our experts',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=85&fit=crop',
  },
];

const shopProducts = [
  {
    title: 'Hydration Mask',
    price: 45,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=85&fit=crop',
  },
  {
    title: 'Glass Serum',
    price: 38,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=85&fit=crop',
  },
  {
    title: 'Curl Cream',
    price: 28,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=85&fit=crop',
  },
  {
    title: 'Nail Oil',
    price: 18,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=85&fit=crop',
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitMessage('Thank you for contacting us! We will get back to you soon.');
        reset();
      } else {
        setSubmitMessage('Failed to submit. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Slideshow */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
              <div>
                <h1 className="text-5xl md:text-7xl font-serif mb-4">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
                <div className="space-x-4">
                  <Link href="/booking" className="btn-primary bg-gold text-primary hover:bg-gold-deep">
                    {slide.cta1}
                  </Link>
                  <Link href="/shop" className="btn-secondary border-white text-white hover:bg-white hover:text-primary">
                    {slide.cta2}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-gold' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Promo Carousel */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-primary text-center mb-12">Special Offers</h2>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
            {promoItems.map((promo, index) => (
              <SwiperSlide key={index}>
                <div className="card">
                  <div className="relative h-48 mb-4">
                    <Image
                      src={promo.image}
                      alt={promo.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-serif text-primary mb-2">{promo.title}</h3>
                  <p className="text-gray-600">{promo.description}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-cream-light">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-primary text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card">
                <div className="relative h-48 mb-4">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-serif text-primary mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
                <Link href="/booking" className="btn-primary mt-4 inline-block">
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop the Ritual Section */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-primary text-center mb-4">Shop the Ritual</h2>
          <p className="text-center text-gray-600 mb-12">Premium beauty products for your daily routine</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shopProducts.map((product, index) => (
              <div key={index} className="card">
                <div className="relative h-64 mb-4">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-serif text-primary mb-2">{product.title}</h3>
                <p className="text-2xl font-bold text-gold mb-4">${product.price}</p>
                <Link href="/shop" className="btn-primary text-sm w-full">
                  Buy Now
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/shop" className="btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-16 bg-cream-light">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-primary text-center mb-12">Our Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="relative h-64">
                <Image
                  src={`https://images.unsplash.com/photo-${item === 1 ? '1522337360788-8b13dee7a37e' : item === 2 ? '1570172619644-dfd03ed5d881' : item === 3 ? '1519741497674-611481863552' : item === 4 ? '1487412947147-5cebf100ffc2' : item === 5 ? '1604654894610-df63bc536371' : '1595476108010-b4d1f102b1b1'}?w=400&q=85&fit=crop`}
                  alt={`Portfolio item ${item}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/portfolio" className="btn-primary">
              View Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif mb-4">Get in Touch</h2>
          <p className="mb-8">Ready to transform your look? Contact us today!</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                {...register('name')}
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg text-primary"
              />
              <input
                {...register('email')}
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-lg text-primary"
              />
            </div>
            <input
              {...register('phone')}
              type="tel"
              placeholder="Your Phone"
              className="w-full px-4 py-3 rounded-lg text-primary"
            />
            <textarea
              {...register('message')}
              rows={4}
              placeholder="Tell us about your beauty goals..."
              className="w-full px-4 py-3 rounded-lg text-primary"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary bg-gold text-primary hover:bg-gold-deep w-full"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {submitMessage && (
              <p className={`mt-4 ${submitMessage.includes('Thank you') ? 'text-green-300' : 'text-red-300'}`}>
                {submitMessage}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-serif mb-4">Nicki Beauty Salon</h3>
              <p className="text-gray-300">Where beauty meets excellence</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/booking" className="text-gray-300 hover:text-white">Book Appointment</Link></li>
                <li><Link href="/shop" className="text-gray-300 hover:text-white">Shop Products</Link></li>
                <li><Link href="/portfolio" className="text-gray-300 hover:text-white">Our Work</Link></li>
                <li><Link href="/admin/login" className="text-gray-300 hover:text-white">Admin</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <p className="text-gray-300">123 Beauty Street</p>
              <p className="text-gray-300">Lagos, Nigeria</p>
              <p className="text-gray-300">Phone: +234 123 456 789</p>
              <p className="text-gray-300">Email: info@nickibeauty.com</p>
            </div>
          </div>
          <div className="border-t border-primary-light mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Nicki Beauty Salon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
