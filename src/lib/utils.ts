/**
 * Format a price from cents to dollars with proper formatting
 * @param price - Price in cents
 * @returns Formatted price string (e.g., "$14.99")
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price / 100);
}

/**
 * Format a sale price with original price, discounted price, and percentage
 * @param price - Current price in cents
 * @param originalPrice - Original price in cents
 * @param discountPercentage - Discount percentage
 * @returns JSX element with formatted prices and discount
 */
export function formatSalePrice(
  price: number,
  originalPrice?: number,
  discountPercentage?: number
) {
  if (!originalPrice || !discountPercentage) {
    return formatPrice(price);
  }
  
  return {
    originalPrice: formatPrice(originalPrice),
    currentPrice: formatPrice(price),
    discountPercentage
  };
}

/**
 * Generate a random ID
 * @returns Random ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
} 