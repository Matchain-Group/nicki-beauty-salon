export type PortfolioSection = 'Hero' | 'Services' | 'Portfolio' | 'Products' | 'Testimonials'

export interface PortfolioGalleryItem {
  title: string
  image: string
  category: string
  section: PortfolioSection
  isPublished: boolean
}

export const portfolioSections: PortfolioSection[] = [
  'Hero',
  'Services',
  'Portfolio',
  'Products',
  'Testimonials',
]

export const staticPortfolioItems: PortfolioGalleryItem[] = [
  {
    title: 'Salon Interior',
    image: '/images/hero/salon-interior.jpg',
    category: 'Branding',
    section: 'Hero',
    isPublished: true,
  },
  {
    title: 'Hair Styling',
    image: '/images/hero/hair-styling.jpg',
    category: 'Branding',
    section: 'Hero',
    isPublished: true,
  },
  {
    title: 'Spa Treatment',
    image: '/images/hero/spa-treatment.jpg',
    category: 'Branding',
    section: 'Hero',
    isPublished: true,
  },
  {
    title: 'Hair Relaxer',
    image: '/images/middle-aged-african-american-woman-600nw-2041985189.jpg',
    category: 'Hair',
    section: 'Services',
    isPublished: true,
  },
  {
    title: 'Lash Extensions',
    image: '/images/lash+extensions.jpg',
    category: 'Lashes',
    section: 'Services',
    isPublished: true,
  },
  {
    title: 'Full Body Massage',
    image: '/images/c600x362.jpg',
    category: 'Spa',
    section: 'Services',
    isPublished: true,
  },
  {
    title: 'Facial Treatment',
    image: '/images/What-is-a-Facial.jpeg',
    category: 'Skin',
    section: 'Services',
    isPublished: true,
  },
  {
    title: 'Pedicure',
    image: '/images/Pedicure_Images.jpg',
    category: 'Nails',
    section: 'Services',
    isPublished: true,
  },
  {
    title: 'Hair Braiding',
    image: '/images/rocket_gen_img_175202a5a-1767684336586.png',
    category: 'Hair',
    section: 'Services',
    isPublished: true,
  },
  {
    title: 'Bridal Makeup',
    image: '/images/portfolio/bridal-makeup-1.jpg',
    category: 'Makeup',
    section: 'Portfolio',
    isPublished: true,
  },
  {
    title: 'Lash Extensions Result',
    image: '/images/portfolio/lash-result-1.jpg',
    category: 'Lashes',
    section: 'Portfolio',
    isPublished: true,
  },
  {
    title: 'Nail Art Collection',
    image: '/images/portfolio/nail-art-collection.jpg',
    category: 'Nails',
    section: 'Portfolio',
    isPublished: true,
  },
  {
    title: 'Professional Hair Coloring',
    image: '/images/portfolio/hair-coloring.jpg',
    category: 'Hair Styling',
    section: 'Portfolio',
    isPublished: true,
  },
  {
    title: 'Glam Makeup Look',
    image: '/images/portfolio/glam-makeup.jpg',
    category: 'Makeup',
    section: 'Portfolio',
    isPublished: true,
  },
  {
    title: 'Creative Eye Makeup',
    image: '/images/portfolio/creative-eye-makeup.jpg',
    category: 'Makeup',
    section: 'Portfolio',
    isPublished: true,
  },
  {
    title: 'Hydration Mask',
    image: '/images/hydration-mask.jpg',
    category: 'Skin',
    section: 'Products',
    isPublished: true,
  },
  {
    title: 'Glass Serum',
    image: '/images/glass-serum.jpg',
    category: 'Skin',
    section: 'Products',
    isPublished: true,
  },
  {
    title: 'Curl Cream',
    image: '/images/curl-cream.jpg',
    category: 'Hair',
    section: 'Products',
    isPublished: true,
  },
  {
    title: 'Nail Oil',
    image: '/images/nail-oil.jpg',
    category: 'Nails',
    section: 'Products',
    isPublished: true,
  },
  {
    title: 'Client Story 1',
    image: '/images/testimonials/client-1.jpg',
    category: 'Testimonials',
    section: 'Testimonials',
    isPublished: true,
  },
  {
    title: 'Client Story 2',
    image: '/images/testimonials/client-2.jpg',
    category: 'Testimonials',
    section: 'Testimonials',
    isPublished: true,
  },
  {
    title: 'Client Story 3',
    image: '/images/testimonials/client-3.jpg',
    category: 'Testimonials',
    section: 'Testimonials',
    isPublished: true,
  },
]

export function getStaticPortfolioItems() {
  return staticPortfolioItems.map((item) => ({ ...item }))
}

export function mergePortfolioItems<T extends { title: string; image: string; section?: string }>(
  dbItems: T[] = []
) {
  const seen = new Set<string>()
  const merged: Array<T | PortfolioGalleryItem> = []

  for (const item of dbItems) {
    const key = `${item.title}::${item.image}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push({
      ...item,
      section: item.section || 'Portfolio',
    })
  }

  for (const item of staticPortfolioItems) {
    const key = `${item.title}::${item.image}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(item)
  }

  return merged
}
