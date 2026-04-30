import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nicki Beauty Salon | Premium Beauty Services',
  description: 'Transform your look with professional hair, lash, nail, and spa services',
};

const services = [
  {
    id: 1,
    title: "Hair Relaxer",
    description: "Professional hair straightening and relaxing treatments",
    image: "/images/middle-aged-african-american-woman-600nw-2041985189.jpg",
    link: "/booking"
  },
  {
    id: 2,
    title: "Lash Extensions",
    description: "Beautiful, natural-looking lash extensions",
    image: "/images/lash+extensions.jpg",
    link: "/booking"
  },
  {
    id: 3,
    title: "Full Body Massage",
    description: "Relaxing full body massage therapy",
    image: "/images/c600x362.jpg",
    link: "/booking"
  },
  {
    id: 4,
    title: "Facial Treatment",
    description: "Rejuvenating facial treatments for glowing skin",
    image: "/images/What-is-a-Facial.jpeg",
    link: "/booking"
  },
  {
    id: 5,
    title: "Nail Manicure and Pedicure",
    description: "Professional nail care and art services",
    image: "/images/Pedicure_Images.jpg",
    link: "/booking"
  },
  {
    id: 6,
    title: "Hair Braiding",
    description: "Traditional and modern hair braiding styles",
    image: "/images/rocket_gen_img_175202a5a-1767684336586.png",
    link: "/booking"
  }
];

// PORTFOLIO ARRAY - Using your uploaded images
const portfolioItems = [
  {
    id: 1,
    title: 'Bridal Makeup',
    image: '/images/portfolio/bridal-makeup-1.jpg',
    category: 'Makeup',
  },
  {
    id: 2,
    title: 'Lash Extensions Result',
    image: '/images/portfolio/lash-result-1.jpg',
    category: 'Lashes',
  },
  {
    id: 3,
    title: 'Nail Art Collection',
    image: '/images/portfolio/nail-art-collection.jpg',
    category: 'Nails',
  },
  {
    id: 4,
    title: 'Professional Hair Coloring',
    image: '/images/portfolio/hair-coloring.jpg',
    category: 'Hair',
  },
  {
    id: 5,
    title: 'Glam Makeup Look',
    image: '/images/portfolio/glam-makeup.jpg',
    category: 'Makeup',
  },
  {
    id: 6,
    title: 'Creative Eye Makeup',
    image: '/images/portfolio/creative-eye-makeup.jpg',
    category: 'Makeup',
  },
];

// HERO SLIDES - Using reliable images
const heroSlides = [
  {
    id: 1,
    image: '/images/hero/salon-interior.jpg',
    title: 'Premium Beauty Services',
    subtitle: 'Transform Your Look Today',
  },
  {
    id: 2,
    image: '/images/hero/hair-styling.jpg',
    title: 'Expert Hair Care',
    subtitle: 'Professional Stylists Ready',
  },
  {
    id: 3,
    image: '/images/hero/spa-treatment.jpg',
    title: 'Relax & Rejuvenate',
    subtitle: 'Luxury Spa Experience',
  },
];

// SPECIAL OFFERS
const specialOffers = [
  {
    id: 1,
    title: 'New Hair Treatment',
    description: 'Keratin smoothing treatment - 20% off this month',
    image: '/images/middle-aged-african-american-woman-600nw-2041985189.jpg',
  },
  {
    id: 2,
    title: 'Lash Extension Special',
    description: 'Get volume lashes with complimentary touch-up',
    image: '/images/lash+extensions.jpg',
  },
  {
    id: 3,
    title: 'Facial Package Deal',
    description: '3 facial sessions for price of 2',
    image: '/images/What-is-a-Facial.jpeg',
  },
];

// TESTIMONIALS
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    text: 'Amazing service! My hair has never looked better.',
    image: '/images/testimonials/client-1.jpg',
    rating: 5,
  },
  {
    id: 2,
    name: 'Maria Garcia',
    text: 'The lash extensions are perfect. Highly recommend!',
    image: '/images/testimonials/client-2.jpg',
    rating: 5,
  },
  {
    id: 3,
    name: 'Jennifer Lee',
    text: 'Best facial treatment I have ever had. Will be back!',
    image: '/images/testimonials/client-3.jpg',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#faf7f2]">
      {/* HERO SECTION */}
      <section className="relative h-[600px] w-full overflow-hidden">
        <Image
          src={heroSlides[0].image}
          alt={heroSlides[0].title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-serif mb-4">{heroSlides[0].title}</h1>
            <p className="text-xl md:text-2xl mb-8">{heroSlides[0].subtitle}</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/booking"
                className="bg-[#d4a574] text-white px-8 py-3 rounded hover:bg-[#b8935f] transition"
              >
                View Services
              </Link>
              <Link
                href="/shop"
                className="border-2 border-white text-white px-8 py-3 rounded hover:bg-white hover:text-black transition"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIAL OFFERS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-center mb-12 text-[#3d2314]">
          Special Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specialOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-[#3d2314]">{offer.title}</h3>
                <p className="text-gray-600 text-sm">{offer.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-16 px-4 max-w-7xl mx-auto bg-white">
        <h2 className="text-3xl font-serif text-center mb-12 text-[#3d2314]">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-[#faf7f2] rounded-lg shadow-md overflow-hidden group">
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-[#3d2314]">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <Link
                  href={service.link}
                  className="inline-block bg-[#3d2314] text-white px-6 py-2 rounded text-sm hover:bg-[#5a3a23] transition"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO SECTION */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-center mb-12 text-[#3d2314]">
          Our Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <div key={item.id} className="relative group overflow-hidden rounded-lg">
              <div className="relative h-80 w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center text-white">
                    <p className="text-sm uppercase tracking-wider mb-1">{item.category}</p>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/portfolio"
            className="inline-block bg-[#3d2314] text-white px-8 py-3 rounded hover:bg-[#5a3a23] transition"
          >
            View Full Portfolio
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 px-4 max-w-7xl mx-auto bg-white">
        <h2 className="text-3xl font-serif text-center mb-12 text-[#3d2314]">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-[#faf7f2] p-6 rounded-lg text-center">
              <div className="relative w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-[#d4a574]">★</span>
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">&ldquo;{testimonial.text}&rdquo;</p>
              <p className="font-semibold text-[#3d2314]">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-4 bg-[#3d2314] text-white text-center">
        <h2 className="text-3xl font-serif mb-4">Ready to Transform Your Look?</h2>
        <p className="mb-8 text-gray-300">Book your appointment today and experience luxury beauty services</p>
        <Link
          href="/booking"
          className="inline-block bg-[#d4a574] text-white px-8 py-3 rounded hover:bg-[#b8935f] transition"
        >
          Book Appointment
        </Link>
      </section>
    </main>
  );
}
