// Sample Saree Products Data
export const categories = [
  { id: 'silk', name: 'Silk Sarees', icon: '✨', description: 'Luxurious pure silk sarees' },
  { id: 'cotton', name: 'Cotton Sarees', icon: '🌿', description: 'Comfortable everyday wear' },
  { id: 'banarasi', name: 'Banarasi Sarees', icon: '👑', description: 'Traditional handwoven elegance' },
  { id: 'chiffon', name: 'Chiffon Sarees', icon: '🌸', description: 'Light and flowy designs' },
  { id: 'georgette', name: 'Georgette Sarees', icon: '💫', description: 'Modern party wear' },
  { id: 'kanjivaram', name: 'Kanjivaram Sarees', icon: '🏆', description: 'South Indian heritage' },
];

export const colors = [
  { id: 'red', name: 'Red', hex: '#DC2626' },
  { id: 'maroon', name: 'Maroon', hex: '#7F1D1D' },
  { id: 'pink', name: 'Pink', hex: '#EC4899' },
  { id: 'orange', name: 'Orange', hex: '#F97316' },
  { id: 'yellow', name: 'Yellow', hex: '#EAB308' },
  { id: 'green', name: 'Green', hex: '#16A34A' },
  { id: 'blue', name: 'Blue', hex: '#2563EB' },
  { id: 'purple', name: 'Purple', hex: '#9333EA' },
  { id: 'gold', name: 'Gold', hex: '#D4AF37' },
  { id: 'white', name: 'White', hex: '#FFFFFF' },
  { id: 'black', name: 'Black', hex: '#1F2937' },
  { id: 'beige', name: 'Beige', hex: '#D2B48C' },
];

export const products = [
  {
    id: 1,
    name: 'Royal Magenta Kanjivaram Silk Saree',
    slug: 'royal-magenta-kanjivaram-silk',
    price: 15999,
    discountPrice: 12999,
    discount: 19,
    category: 'kanjivaram',
    fabric: 'Pure Silk',
    color: 'pink',
    weight: '750g',
    length: '6.3 meters',
    blouse: 'Unstitched blouse piece included',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
    ],
    description: 'Exquisite pure Kanjivaram silk saree in royal magenta with intricate gold zari work. Traditional temple border with peacock motifs. Perfect for weddings and special occasions.',
    features: [
      'Handwoven by master artisans',
      'Pure mulberry silk',
      'Real gold zari work',
      'Temple border design',
      'Comes with blouse piece'
    ],
    care: 'Dry clean only. Store in muslin cloth.',
    inStock: true,
    rating: 4.8,
    reviews: 124,
    tags: ['wedding', 'bridal', 'festive', 'premium'],
    featured: true,
    bestseller: true,
  },
  {
    id: 2,
    name: 'Elegant Navy Blue Banarasi Saree',
    slug: 'elegant-navy-blue-banarasi',
    price: 8999,
    discountPrice: 7499,
    discount: 17,
    category: 'banarasi',
    fabric: 'Banarasi Silk',
    color: 'blue',
    weight: '650g',
    length: '6.3 meters',
    blouse: 'Unstitched blouse piece included',
    images: [
      'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    ],
    description: 'Stunning navy blue Banarasi silk saree with silver zari work. Features classic Mughal-inspired patterns and rich pallu design.',
    features: [
      'Traditional Banarasi weave',
      'Silver zari detailing',
      'Mughal pattern motifs',
      'Rich pallu design',
      'Perfect for festivities'
    ],
    care: 'Dry clean recommended.',
    inStock: true,
    rating: 4.6,
    reviews: 89,
    tags: ['festive', 'party', 'premium'],
    featured: true,
    bestseller: false,
  },
  {
    id: 3,
    name: 'Traditional Red Wedding Silk Saree',
    slug: 'traditional-red-wedding-silk',
    price: 18999,
    discountPrice: 15999,
    discount: 16,
    category: 'silk',
    fabric: 'Pure Silk',
    color: 'red',
    weight: '800g',
    length: '6.3 meters',
    blouse: 'Unstitched blouse piece included',
    images: [
      'https://images.unsplash.com/photo-1583391733981-8498408b9932?w=800',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
    ],
    description: 'Classic red bridal silk saree with heavy gold zari work. Traditional elephant and paisley motifs. The perfect choice for the big day.',
    features: [
      'Bridal collection',
      'Heavy gold zari borders',
      'Traditional motifs',
      'Premium silk quality',
      'Auspicious red color'
    ],
    care: 'Professional dry clean only.',
    inStock: true,
    rating: 4.9,
    reviews: 256,
    tags: ['wedding', 'bridal', 'premium', 'festive'],
    featured: true,
    bestseller: true,
  },
  {
    id: 4,
    name: 'Soft Cotton Handloom Saree',
    slug: 'soft-cotton-handloom',
    price: 2499,
    discountPrice: 1999,
    discount: 20,
    category: 'cotton',
    fabric: 'Pure Cotton',
    color: 'white',
    weight: '400g',
    length: '6.3 meters',
    blouse: 'Unstitched blouse piece included',
    images: [
      'https://images.unsplash.com/photo-1617627143233-46913c9b9b66?w=800',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    ],
    description: 'Comfortable off-white cotton handloom saree with subtle golden border. Perfect for daily wear and office occasions.',
    features: [
      'Breathable cotton fabric',
      'Handloom woven',
      'Subtle golden border',
      'Easy to drape',
      'All-day comfort'
    ],
    care: 'Machine washable in cold water.',
    inStock: true,
    rating: 4.5,
    reviews: 312,
    tags: ['casual', 'office', 'daily'],
    featured: false,
    bestseller: true,
  },
  {
    id: 5,
    name: 'Emerald Green Chiffon Saree',
    slug: 'emerald-green-chiffon',
    price: 3999,
    discountPrice: 3299,
    discount: 18,
    category: 'chiffon',
    fabric: 'Pure Chiffon',
    color: 'green',
    weight: '350g',
    length: '6.3 meters',
    blouse: 'Unstitched blouse piece included',
    images: [
      'https://images.unsplash.com/photo-1583391733981-8498408b9932?w=800',
      'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800',
    ],
    description: 'Elegant emerald green chiffon saree with delicate sequin work. Light and flowy, perfect for parties and evening events.',
    features: [
      'Lightweight chiffon fabric',
      'Delicate sequin embroidery',
      'Flowy drape',
      'Party wear',
      'Easy maintenance'
    ],
    care: 'Hand wash or dry clean.',
    inStock: true,
    rating: 4.4,
    reviews: 78,
    tags: ['party', 'evening', 'lightweight'],
    featured: false,
    bestseller: false,
  },
  {
    id: 6,
    name: 'Golden Beige Georgette Saree',
    slug: 'golden-beige-georgette',
    price: 4599,
    discountPrice: 3799,
    discount: 17,
    category: 'georgette',
    fabric: 'Georgette',
    color: 'beige',
    weight: '380g',
    length: '6.3 meters',
    blouse: 'Unstitched blouse piece included',
    images: [
      'https://images.unsplash.com/photo-1617627143233-46913c9b9b66?w=800',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    ],
    description: 'Sophisticated golden beige georgette saree with intricate thread work. Modern design suitable for cocktail parties and receptions.',
    features: [
      'Premium georgette fabric',
      'Intricate thread embroidery',
      'Modern contemporary design',
      'Cocktail party ready',
      'Elegant golden shade'
    ],
    care: 'Dry clean recommended.',
    inStock: true,
    rating: 4.7,
    reviews: 145,
    tags: ['party', 'reception', 'modern'],
    featured: true,
    bestseller: false,
  },
  {
    id: 7,
    name: 'Purple Mysore Silk Saree',
    slug: 'purple-mysore-silk',
    price: 6999,
    discountPrice: 5999,
    discount: 14,
    category: 'silk',
    fabric: 'Mysore Silk',
    color: 'purple',
    weight: '550g',
    length: '6.3 meters',
    blouse: 'Unstitched blouse piece included',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
    ],
    description: 'Rich purple Mysore silk saree with traditional gold kasuti work. Perfect blend of elegance and tradition.',
    features: [
      'Authentic Mysore silk',
      'Gold kasuti embroidery',
      'Traditional south Indian design',
      'Royal purple color',
      'Festive occasions'
    ],
    care: 'Dry clean only.',
    inStock: true,
    rating: 4.6,
    reviews: 92,
    tags: ['festive', 'traditional', 'south-indian'],
    featured: false,
    bestseller: false,
  },
  {
    id: 8,
    name: 'Peach Pink Designer Saree',
    slug: 'peach-pink-designer',
    price: 5499,
    discountPrice: 4499,
    discount: 18,
    category: 'georgette',
    fabric: 'Net Georgette',
    color: 'pink',
    weight: '420g',
    length: '6.3 meters',
    blouse: 'Unstitched blouse piece included',
    images: [
      'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800',
      'https://images.unsplash.com/photo-1617627143233-46913c9b9b66?w=800',
    ],
    description: 'Trendy peach pink designer saree with heavy stone and pearl work. Perfect for sangeet and engagement ceremonies.',
    features: [
      'Heavy stone work',
      'Pearl embellishments',
      'Designer collection',
      'Sangeet ready',
      'Trending color'
    ],
    care: 'Handle with care. Dry clean only.',
    inStock: true,
    rating: 4.8,
    reviews: 167,
    tags: ['designer', 'party', 'engagement', 'sangeet'],
    featured: true,
    bestseller: true,
  },
  {
    id: 9,
    name: 'Black Gold Kanjivaram Saree',
    slug: 'black-gold-kanjivaram',
    price: 14999,
    discountPrice: 12499,
    discount: 17,
    category: 'kanjivaram',
    fabric: 'Pure Silk',
    color: 'black',
    weight: '720g',
    length: '6.3 meters',
    blouse: 'Unstitched blouse piece included',
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
    ],
    description: 'Striking black Kanjivaram silk saree with heavy gold zari border. Bold and elegant choice for evening functions.',
    features: [
      'Rich black pure silk',
      'Heavy gold zari border',
      'Bold and elegant',
      'Evening wear',
      'Premium finish'
    ],
    care: 'Professional dry clean only.',
    inStock: true,
    rating: 4.7,
    reviews: 108,
    tags: ['evening', 'party', 'premium', 'bold'],
    featured: false,
    bestseller: false,
  },
  {
    id: 10,
    name: 'Sunshine Yellow Cotton Saree',
    slug: 'sunshine-yellow-cotton',
    price: 2999,
    discountPrice: 2499,
    discount: 17,
    category: 'cotton',
    fabric: 'Handloom Cotton',
    color: 'yellow',
    weight: '420g',
    length: '6.3 meters',
    blouse: 'Unstitched blouse piece included',
    images: [
      'https://images.unsplash.com/photo-1583391733981-8498408b9932?w=800',
      'https://images.unsplash.com/photo-1617627143233-46913c9b9b66?w=800',
    ],
    description: 'Bright and cheerful yellow cotton saree with red border. Perfect for pujas and festive occasions.',
    features: [
      'Cheerful yellow color',
      'Contrasting red border',
      'Breathable cotton',
      'Puja special',
      'Comfortable wear'
    ],
    care: 'Machine washable.',
    inStock: true,
    rating: 4.5,
    reviews: 198,
    tags: ['festive', 'puja', 'casual', 'cotton'],
    featured: false,
    bestseller: true,
  },
  {
    id: 11,
    name: 'Maroon Tussar Silk Saree',
    slug: 'maroon-tussar-silk',
    price: 7999,
    discountPrice: 6499,
    discount: 19,
    category: 'silk',
    fabric: 'Tussar Silk',
    color: 'maroon',
    weight: '480g',
    length: '6.3 meters',
    blouse: 'Unstitched blouse piece included',
    images: [
      'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
    ],
    description: 'Beautiful maroon Tussar silk saree with hand-painted madhubani art. A unique piece showcasing traditional folk art.',
    features: [
      'Premium Tussar silk',
      'Hand-painted Madhubani art',
      'Unique artistic piece',
      'Traditional folk design',
      'Collector item'
    ],
    care: 'Dry clean only. Handle with care.',
    inStock: true,
    rating: 4.9,
    reviews: 76,
    tags: ['artistic', 'traditional', 'handpainted', 'unique'],
    featured: true,
    bestseller: false,
  },
  {
    id: 12,
    name: 'Orange Bandhani Saree',
    slug: 'orange-bandhani',
    price: 3499,
    discountPrice: 2999,
    discount: 14,
    category: 'cotton',
    fabric: 'Cotton Silk',
    color: 'orange',
    weight: '450g',
    length: '6.3 meters',
    blouse: 'Unstitched blouse piece included',
    images: [
      'https://images.unsplash.com/photo-1617627143233-46913c9b9b66?w=800',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    ],
    description: 'Vibrant orange Bandhani saree from Gujarat. Traditional tie-dye technique creating beautiful patterns.',
    features: [
      'Authentic Bandhani work',
      'Traditional tie-dye',
      'Gujarati craftsmanship',
      'Vibrant orange hue',
      'Festive wear'
    ],
    care: 'Hand wash separately in cold water.',
    inStock: true,
    rating: 4.4,
    reviews: 134,
    tags: ['bandhani', 'traditional', 'gujarati', 'festive'],
    featured: false,
    bestseller: false,
  },
];

// Helper functions
export const getProductById = (id) => products.find(p => p.id === parseInt(id));

export const getProductBySlug = (slug) => products.find(p => p.slug === slug);

export const getProductsByCategory = (category) => 
  products.filter(p => p.category === category);

export const getFeaturedProducts = () => products.filter(p => p.featured);

export const getBestsellers = () => products.filter(p => p.bestseller);

export const searchProducts = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowercaseQuery) ||
    p.description.toLowerCase().includes(lowercaseQuery) ||
    p.category.toLowerCase().includes(lowercaseQuery) ||
    p.fabric.toLowerCase().includes(lowercaseQuery)
  );
};

export const filterProducts = ({ category, color, minPrice, maxPrice, fabric }) => {
  return products.filter(product => {
    if (category && product.category !== category) return false;
    if (color && product.color !== color) return false;
    if (minPrice && product.discountPrice < minPrice) return false;
    if (maxPrice && product.discountPrice > maxPrice) return false;
    if (fabric && !product.fabric.toLowerCase().includes(fabric.toLowerCase())) return false;
    return true;
  });
};

export const sortProducts = (productList, sortBy) => {
  const sorted = [...productList];
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.discountPrice - b.discountPrice);
    case 'price-high':
      return sorted.sort((a, b) => b.discountPrice - a.discountPrice);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id);
    case 'discount':
      return sorted.sort((a, b) => b.discount - a.discount);
    default:
      return sorted;
  }
};

export default products;
