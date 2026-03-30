export interface ProductSeedItem {
  title: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  isActive: boolean
}

export const staticProducts: ProductSeedItem[] = [
  {
    title: 'Hydration Mask',
    description: 'Deep hydration facial mask for glowing skin',
    price: 45.99,
    image: '/images/hydration-mask.jpg',
    category: 'Skin',
    stock: 50,
    isActive: true,
  },
  {
    title: 'Glass Serum',
    description: 'Advanced glass skin serum with vitamin C',
    price: 38.99,
    image: '/images/glass-serum.jpg',
    category: 'Skin',
    stock: 30,
    isActive: true,
  },
  {
    title: 'Curl Cream',
    description: 'Premium curl defining cream for natural hair',
    price: 25.99,
    image: '/images/curl-cream.jpg',
    category: 'Hair',
    stock: 40,
    isActive: true,
  },
  {
    title: 'Nail Oil',
    description: 'Nourishing cuticle and nail growth oil',
    price: 18.99,
    image: '/images/nail-oil.jpg',
    category: 'Nails',
    stock: 60,
    isActive: true,
  },
  {
    title: 'Lash Extensions',
    description: 'Professional lash extensions for dramatic look',
    price: 85.99,
    image: '/images/lash+extensions.jpg',
    category: 'Lashes',
    stock: 25,
    isActive: true,
  },
  {
    title: 'Facial Treatment',
    description: 'Rejuvenating facial treatment with natural products',
    price: 65.99,
    image: '/images/What-is-a-Facial.jpeg',
    category: 'Skin',
    stock: 35,
    isActive: true,
  },
  {
    title: 'Pedicure',
    description: 'Luxury pedicure with foot massage',
    price: 35.99,
    image: '/images/Pedicure_Images.jpg',
    category: 'Nails',
    stock: 45,
    isActive: true,
  },
]

export function getStaticProducts() {
  return staticProducts.map((product) => ({ ...product }))
}
