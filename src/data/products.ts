import { Product } from '../types/database.types';

export const products: Product[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    name: 'Lightmode',
    description: 'A bright, light roast with citrus notes. Perfect for morning coding sessions.',
    price: 1499, // $14.99
    image_url: '/images/lightmode.jpg',
    image_gallery: [
      '/images/lightmode.jpg',
      '/images/lightmode-detail-1.jpg',
      '/images/lightmode-detail-2.jpg',
      '/images/lightmode-package.jpg'
    ],
    stock: 100,
    category: 'coffee',
    rating: 4.8,
    roastLevel: 20, // Light roast
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    name: 'Darkmode',
    description: 'A bold, dark roast with chocolate undertones. Ideal for late-night debugging.',
    price: 1599, // $15.99
    image_url: '/images/darkmode.jpg',
    image_gallery: [
      '/images/darkmode.jpg',
      '/images/darkmode-detail-1.jpg',
      '/images/darkmode-detail-2.jpg',
      '/images/darkmode-package.jpg'
    ],
    stock: 100,
    category: 'coffee',
    rating: 4.9,
    roastLevel: 85, // Dark roast
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    name: 'Function',
    description: 'A medium roast with nutty flavors that returns consistent energy every time.',
    price: 1549, // $15.49
    image_url: '/images/darkmode.jpg',
    image_gallery: [
      '/images/darkmode.jpg',
      '/images/darkmode-detail-1.jpg',
      '/images/darkmode-detail-2.jpg',
      '/images/darkmode-package.jpg'
    ],
    stock: 100,
    category: 'coffee',
    rating: 4.5,
    roastLevel: 50, // Medium roast
  },
  {
    id: '4',
    created_at: new Date().toISOString(),
    name: 'Recursive',
    description: 'A complex blend that reveals new flavors with each sip. Calls itself.',
    price: 1699, // $16.99
      image_url: '/images/darkmode.jpg',
    image_gallery: [
      '/images/darkmode.jpg',
      '/images/darkmode-detail-1.jpg',
      '/images/darkmode-detail-2.jpg',
      '/images/darkmode-package.jpg'
    ],
    stock: 100,
    category: 'coffee',
    rating: 4.7,
    roastLevel: 65, // Medium-dark roast
  },
  {
    id: '5',
    created_at: new Date().toISOString(),
    name: 'Boolean',
    description: 'Either you love it or you don\'t. A true/false dichotomy of flavors.',
    price: 1549, // $15.49
    image_url: '/images/darkmode.jpg',
    image_gallery: [
      '/images/darkmode.jpg',
      '/images/darkmode-detail-1.jpg',
      '/images/darkmode-detail-2.jpg',
      '/images/darkmode-package.jpg'
    ],
    stock: 100,
    category: 'coffee',
    rating: 3.9,
    roastLevel: 75, // Dark roast
  },
  {
    id: '6',
    created_at: new Date().toISOString(),
    name: 'Async',
    description: 'Patience required. This coffee promises to deliver its full flavor profile eventually.',
    price: 1649, // $16.49
        image_url: '/images/darkmode.jpg',
    image_gallery: [
      '/images/darkmode.jpg',
      '/images/darkmode-detail-1.jpg',
      '/images/darkmode-detail-2.jpg',
      '/images/darkmode-package.jpg'
    ],
    stock: 100,
    category: 'coffee',
    rating: 4.3,
    roastLevel: 40, // Medium-light roast
  },
  {
    id: '7',
    created_at: new Date().toISOString(),
    name: 'Debugger Mug',
    description: 'A large 16oz mug for those long debugging sessions. Keeps your coffee warm while you solve bugs.',
    price: 1899, // $18.99
    image_url: '/images/debugger-mug.jpg',
    image_gallery: [
      '/images/debugger-mug.jpg',
      '/images/debugger-mug-side.jpg',
      '/images/debugger-mug-handle.jpg',
      '/images/debugger-mug-box.jpg'
    ],
    stock: 50,
    category: 'coffee-kit',
    rating: 4.6,
  },
  {
    id: '8',
    created_at: new Date().toISOString(),
    name: 'Pour Over Kit',
    description: 'Complete pour-over setup with a glass dripper, stand, and filter papers. For precision brewing.',
    price: 3499, // $34.99
    image_url: '/images/pour-over-kit.jpg',
    image_gallery: [
      '/images/pour-over-kit.jpg',
      '/images/pour-over-kit-detail-1.jpg',
      '/images/pour-over-kit-detail-2.jpg',
      '/images/pour-over-kit-package.jpg'
    ],
    stock: 25,
    category: 'coffee-kit',
    rating: 4.8,
  },
  {
    id: '9',
    created_at: new Date().toISOString(),
    name: 'Coffee Scale',
    description: 'Digital scale with timer function for the perfect coffee-to-water ratio every time.',
    price: 2499, // $24.99
    image_url: '/images/coffee-scale.jpg',
    image_gallery: [
      '/images/coffee-scale.jpg',
      '/images/coffee-scale-detail-1.jpg',
      '/images/coffee-scale-detail-2.jpg',
      '/images/coffee-scale-package.jpg'
    ],
    stock: 30,
    category: 'coffee-kit',
    rating: 4.4,
  },
  {
    id: '10',
    created_at: new Date().toISOString(),
    name: 'Burr Grinder',
    description: 'Electric burr grinder with multiple grind settings for all brewing methods.',
    price: 6999, // $69.99
    image_url: '/images/burr-grinder.jpg',
    image_gallery: [
      '/images/burr-grinder.jpg',
      '/images/burr-grinder-top.jpg',
      '/images/burr-grinder-side.jpg',
      '/images/burr-grinder-settings.jpg'
    ],
    stock: 15,
    category: 'coffee-kit',
    rating: 4.9,
  },
  {
    id: '11',
    created_at: new Date().toISOString(),
    name: 'Travel French Press',
    description: 'Insulated French press that\'s perfect for the developer on the go.',
    price: 2999, // $29.99
    image_url: '/images/travel-french-press.jpg',
    image_gallery: [
      '/images/travel-french-press.jpg',
      '/images/travel-french-press-detail-1.jpg',
      '/images/travel-french-press-detail-2.jpg',
      '/images/travel-french-press-package.jpg'
    ],
    stock: 20,
    category: 'coffee-kit',
    rating: 4.2,
  },
  {
    id: '12',
    created_at: new Date().toISOString(),
    name: 'Cache',
    description: 'Our limited edition seasonal blend. Quick to access, full of memorably complex flavors.',
    price: 1899, // $18.99
    image_url: '/images/darkmode.jpg',
    image_gallery: [
      '/images/darkmode.jpg',
      '/images/darkmode-detail-1.jpg',
      '/images/darkmode-detail-2.jpg',
      '/images/darkmode-package.jpg'
    ],
    stock: 50,
    category: 'coffee',
    rating: 4.5,
    roastLevel: 60, // Medium-dark roast
  },
  {
    id: '13',
    created_at: new Date().toISOString(),
    name: 'Query',
    description: 'A structured, methodical medium-dark roast with a smooth, database-friendly finish.',
    price: 1599, // $15.99
    image_url: '/images/query.jpg',
    image_gallery: [
      '/images/query.jpg',
      '/images/query-detail-1.jpg',
      '/images/query-detail-2.jpg',
      '/images/query-package.jpg'
    ],
    stock: 80,
    category: 'coffee',
    rating: 4.7,
    roastLevel: 70, // Medium-dark roast
  },
  {
    id: '14',
    created_at: new Date().toISOString(),
    name: 'Cold Brew Maker',
    description: 'Glass carafe with removable filter for making smooth, low-acid cold brew at home.',
    price: 3899, // $38.99
    image_url: '/images/cold-brew-maker.jpg',
    image_gallery: [
      '/images/cold-brew-maker.jpg',
      '/images/cold-brew-maker-detail-1.jpg',
      '/images/cold-brew-maker-detail-2.jpg',
      '/images/cold-brew-maker-package.jpg'
    ],
    stock: 25,
    category: 'coffee-kit',
    rating: 4.6,
  },
]; 