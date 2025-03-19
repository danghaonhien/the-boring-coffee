# The Boring Coffee

A modern e-commerce website for a fictional coffee brand designed for developers and tech enthusiasts. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Product Display & Management
- **Dynamic Product Slider**: Interactive product comparisons with draggable divider
- **Product Image Gallery**: Multi-image slider for product detail pages
- **Roast Level Meter**: Visual indicator for coffee roast intensity
- **Product Cards**: Clean, responsive cards with hover effects and quick-add functionality
- **Product Categories**: Organized product sections for coffee and equipment
- **Product Stories**: Detailed origin stories for each coffee product
- **Vietnamese Phin Guide**: Step-by-step brewing instructions with images

### Shopping Experience
- **Interactive Cart**: Fully-functional shopping cart with add/remove capabilities
- **Cart Modal**: Slide-in modal showing cart contents and subtotal
- **Progress Bar**: Visual indicator of progress toward free shipping
- **Recommended Products**: Personalized product recommendations in cart
- **Quantity Controls**: Intuitive interface for adjusting product quantities
- **Sticky Cart Footer**: Cart summary that appears when scrolling product pages
- **Contextual Buttons**: "Add to Cart" changes to "Continue" when product is in cart

### UI/UX Features
- **Responsive Design**: Mobile-first layout that works across all devices
- **Sticky Navigation**: Header with scroll detection and dynamic styling
- **AboutUs Cards**: Compelling brand story with interactive cards
- **Review System**: Product reviews with star ratings
- **Hover Effects**: Subtle animations for better user engagement
- **Category Filtering**: Allows users to browse products by category
- **Smart Sliders**: Responsive product sliders with navigation controls

### Technical Implementation
- **Next.js App Router**: Modern routing with server and client components
- **TypeScript**: Type-safe code throughout the application
- **Tailwind CSS**: Custom design system with consistent brand colors
- **State Management**: React Context API for cart functionality
- **Local Storage**: Persistent cart data between sessions
- **Responsive Images**: Optimized loading with Next.js Image component
- **Dynamic Imports**: Efficient code splitting for better performance
- **Client-Side Interactivity**: Smooth transitions and animations
- **Custom Hooks**: Reusable logic for cart and UI interactions

## Recent Updates & Enhancements

- Added detailed product stories and brewing guides
- Implemented "Continue to Cart" functionality for better user flow
- Created a sticky product footer that appears when scrolling
- Enhanced cart modal with product recommendations slider
- Developed a roast meter to visualize coffee intensity
- Improved mobile responsiveness for all components
- Added multi-image galleries for product detail pages
- Implemented hover-to-add functionality on product cards
- Created an "About Us" section with compelling brand story
- Added product reviews with star rating system

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Context API for cart functionality
- **UI Components**: Custom-built components with animations
- **Image Optimization**: Next.js Image component for optimized loading
- **Icons**: React Icons library

## Project Structure

```
the-boring-coffee/
├── app/                  # Next.js App Router
│   ├── products/         # Product pages
│   └── page.tsx          # Homepage
├── components/           # React components
│   ├── about/            # About section components
│   ├── cart/             # Cart-related components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── products/         # Product-related components
│   └── reviews/          # Review components
├── context/              # React Context providers
├── data/                 # Static data (products, reviews)
├── lib/                  # Utility functions
├── public/               # Static assets
│   └── images/           # Product and site images
└── types/                # TypeScript type definitions
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
