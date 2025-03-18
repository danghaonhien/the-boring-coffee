'use client';

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

// Mock review data - in a real app, this would come from a database
const mockReviews = {
  '1': [ // Lightmode Coffee
    {
      id: 'r1',
      reviewer: 'Michael T.',
      date: '03/15/25',
      rating: 4,
      comment: 'Bright, fruity notes with mild acidity. Perfect for my morning brew.',
      verified: true
    },
    {
      id: 'r2',
      reviewer: 'Jessica L.',
      date: '03/10/25',
      rating: 5,
      comment: 'This coffee has become my daily go-to. Love the subtle citrus notes.',
      verified: true
    },
    {
      id: 'r3',
      reviewer: 'Ryan B.',
      date: '03/05/25',
      rating: 3,
      comment: 'Good coffee, but a bit too light for my taste.',
      verified: true
    }
  ],
  '2': [ // Darkmode Coffee
    {
      id: 'r4',
      reviewer: 'Sarah K.',
      date: '03/12/25',
      rating: 5,
      comment: 'Rich, chocolatey flavor with low acidity. Exactly what I was looking for in a dark roast.',
      verified: true
    },
    {
      id: 'r5',
      reviewer: 'Chris M.',
      date: '03/08/25',
      rating: 4,
      comment: 'Robust flavor that stands up well to milk. Great for espresso too.',
      verified: true
    }
  ],
  '3': [ // Function Coffee
    {
      id: 'r6',
      reviewer: 'Emma R.',
      date: '03/05/25',
      rating: 5,
      comment: 'Well-balanced with nutty undertones. Performs perfectly every morning!',
      verified: true
    }
  ],
  '4': [ // Boolean Coffee
    {
      id: 'r7',
      reviewer: 'Alex T.',
      date: '03/02/25',
      rating: 4,
      comment: 'True to its name - it\'s either really wake you up or it doesn\'t. No in-between!',
      verified: true
    }
  ]
};

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  
  // Get reviews for this product or return empty array if none exist
  const productReviews = mockReviews[productId as keyof typeof mockReviews] || [];
  
  // Calculate average rating
  const avgRating = productReviews.length 
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length 
    : 0;
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the review to the backend
    alert(`Thank you for your ${rating}-star review of ${productName}!`);
    setShowWriteReview(false);
    setRating(0);
    setReviewText('');
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#242423]">Customer Reviews</h2>
        <button 
          className="bg-[#F5CB5C] px-4 py-2 rounded-md text-[#242423] hover:bg-[#F5CB5C]/90 transition-colors"
          onClick={() => setShowWriteReview(!showWriteReview)}
        >
          {showWriteReview ? 'Cancel' : 'Write a Review'}
        </button>
      </div>
      
      {/* Review summary */}
      {productReviews.length > 0 && (
        <div className="mb-8 flex items-center">
          <div className="flex mr-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar 
                key={star}
                className={`h-5 w-5 ${star <= Math.round(avgRating) ? 'text-[#F5CB5C]' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <div>
            <span className="font-medium text-[#242423]">{avgRating.toFixed(1)} out of 5</span>
            <p className="text-sm text-[#5A5A46]">{productReviews.length} {productReviews.length === 1 ? 'review' : 'reviews'}</p>
          </div>
        </div>
      )}
      
      {/* Write review form */}
      {showWriteReview && (
        <div className="bg-[#E8EDDF] p-6 rounded-lg mb-8 border border-[#CFDBD5]">
          <h3 className="text-xl font-bold text-[#242423] mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-[#333533] mb-2">Rating</label>
              <div className="flex">
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <FaStar
                      key={index}
                      className={`h-6 w-6 cursor-pointer ${starValue <= (hover || rating) ? 'text-[#F5CB5C]' : 'text-gray-300'}`}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHover(starValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  );
                })}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="review" className="block text-[#333533] mb-2">Your Review</label>
              <textarea
                id="review"
                rows={4}
                className="w-full rounded-md border-[#CFDBD5] p-2 focus:ring-[#F5CB5C] focus:border-[#F5CB5C]"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#F5CB5C] px-4 py-2 rounded-md text-[#242423] hover:bg-[#F5CB5C]/90 transition-colors"
              disabled={rating === 0 || !reviewText.trim()}
            >
              Submit Review
            </button>
          </form>
        </div>
      )}
      
      {/* Reviews list */}
      {productReviews.length === 0 ? (
        <div className="text-center py-10 text-[#5A5A46]">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {productReviews.map((review) => (
            <div key={review.id} className="border-b border-[#CFDBD5] pb-6 last:border-0">
              <div className="flex justify-between mb-2">
                <div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar 
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? 'text-[#F5CB5C]' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <h4 className="font-medium text-[#242423]">
                    {review.reviewer}
                    {review.verified && (
                      <span className="ml-2 text-xs text-[#5A5A46]">Verified Buyer</span>
                    )}
                  </h4>
                </div>
                <div className="text-sm text-[#5A5A46]">{review.date}</div>
              </div>
              <p className="text-[#333533]">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 