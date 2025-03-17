# Lessons

- For website image paths, always use the correct relative path (e.g., 'images/filename.png') and ensure the images directory exists
- For search results, ensure proper handling of different character encodings (UTF-8) for international queries
- Add debug information to stderr while keeping the main output clean in stdout for better pipeline integration
- When using seaborn styles in matplotlib, use 'seaborn-v0_8' instead of 'seaborn' as the style name due to recent seaborn version changes
- When using Jest, a test suite can fail even if all individual tests pass, typically due to issues in suite-level setup code or lifecycle hooks

# Scratchpad

## The Boring Coffee Website Project

### Project Overview
- Building an e-commerce website for "The Boring Coffee" targeting the tech community in San Francisco
- Tech stack: Next.js (frontend) + Supabase (backend)
- Tech-themed coffee products (e.g., "lightmode" and "darkmode")

### Tasks
[X] Set up Next.js project
[X] Install required dependencies:
  [X] @supabase/supabase-js
  [X] stripe
  [X] react-icons
  [X] @headlessui/react
[X] Configure Supabase integration
[X] Design and implement key pages:
  [X] Homepage
  [X] Product listing
  [X] Product detail
  [X] Shopping cart
  [X] Checkout
  [X] User account
[X] Implement e-commerce functionality:
  [X] Product catalog
  [X] Shopping cart
  [X] User authentication
  [X] Order management
  [X] Payment processing (Stripe)
[X] Design system with tech-inspired aesthetics