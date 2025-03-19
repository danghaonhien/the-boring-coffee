#!/bin/bash

# Install Supabase CLI
npm install -g supabase

# Install Supabase client library
cd the-boring-coffee
npm install @supabase/supabase-js

# Create the seed directory and copy example env file
mkdir -p supabase/seed
cp .env.local.example .env.local

echo "==============================================="
echo "Supabase dependencies have been installed!"
echo "==============================================="
echo ""
echo "Next steps:"
echo "1. Create your Supabase project at https://supabase.com"
echo "2. Update your .env.local file with your Supabase credentials"
echo "3. Run the SQL queries from README.md to create the database tables"
echo "4. Run 'node supabase/seed/products.js' to seed your database"
echo ""
echo "For more information, see the 'Integrating Supabase' section in README.md" 