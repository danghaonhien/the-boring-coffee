'use client';

import ReviewCard from './ReviewCard';

export default function ReviewsSection() {
  const reviews = [
    {
      productName: 'Ha\' Matcha Cup Set - One Size',
      productDescription: 'High texture ceramic feel',
      reviewerName: 'Hannah G.',
      date: '03/18/25',
      verified: true,
      rating: 5,
      productImage: '/images/products/matcha-cups.jpg'
    },
    {
      productName: 'Lightmode Coffee - 12oz Bag',
      productDescription: 'Bright, fruity notes with mild acidity',
      reviewerName: 'Michael T.',
      date: '03/15/25',
      verified: true,
      rating: 4,
      productImage: '/images/products/lightmode.jpg'
    },
    {
      productName: 'Darkmode Coffee - 12oz Bag',
      productDescription: 'Rich, chocolatey flavor with low acidity',
      reviewerName: 'Sarah K.',
      date: '03/12/25',
      verified: true,
      rating: 5,
      productImage: '/images/products/darkmode.jpg'
    },
    {
      productName: 'Manual Coffee Grinder',
      productDescription: 'Precise grinding with adjustable settings',
      reviewerName: 'David L.',
      date: '03/10/25',
      verified: true,
      rating: 4,
      productImage: '/images/products/grinder.jpg'
    },

  ];

  return (
    <section className="py-16 bg-[#e8eddf]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#242423] mb-3">Customer Reviews</h2>
          <p className="text-[#333533] max-w-2xl mx-auto text-sm">
            See what our customers are saying about our products. We&apos;re proud to offer high-quality coffee and equipment that our community loves.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              productName={review.productName}
              productDescription={review.productDescription}
              reviewerName={review.reviewerName}
              date={review.date}
              verified={review.verified}
              rating={review.rating}
              productImage={review.productImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 