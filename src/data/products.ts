import { Product } from '../types/database.types';

export const products: Product[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    name: 'Lightmode',
    description: 'A bright, light roast with citrus notes. Perfect for morning coding sessions.',
    price: 1499, // $14.99
    image_url: '/images/coffee-1.jpg',
    stock: 100,
    category: 'light-roast',
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    name: 'Darkmode',
    description: 'A bold, dark roast with chocolate undertones. Ideal for late-night debugging.',
    price: 1599, // $15.99
    image_url: '/coffee-1.jpg',
    stock: 100,
    category: 'dark-roast',
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    name: 'Function',
    description: 'A medium roast with nutty flavors that returns consistent energy every time.',
    price: 1549, // $15.49
    image_url: '/coffee-1.jpg',
    stock: 100,
    category: 'medium-roast',
  },
  {
    id: '4',
    created_at: new Date().toISOString(),
    name: 'Recursive',
    description: 'A complex blend that reveals new flavors with each sip. Calls itself.',
    price: 1699, // $16.99
    image_url: '/coffee-1.jpg',
    stock: 100,
    category: 'blend',
  },
  {
    id: '5',
    created_at: new Date().toISOString(),
    name: 'Boolean',
    description: 'Either you love it or you don\'t. A true/false dichotomy of flavors.',
    price: 1549, // $15.49
    image_url: '/coffee-1.jpg',
    stock: 100,
    category: 'medium-roast',
  },
  {
    id: '6',
    created_at: new Date().toISOString(),
    name: 'Async',
    description: 'Patience required. This coffee promises to deliver its full flavor profile eventually.',
    price: 1649, // $16.49
    image_url: '/coffee-1.jpg',
    stock: 100,
    category: 'specialty',
  },
]; 