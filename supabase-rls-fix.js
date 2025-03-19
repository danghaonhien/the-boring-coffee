// Script to enable public read access to the products table in Supabase
import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://tvmghxxoodjbjwhbvyir.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bWdoeHhvb2RqYmp3aGJ2eWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MTU3NDcsImV4cCI6MjA1Nzk5MTc0N30.4L2RE6FUjY9f9IWhG51ehvqeaNV3Zcnsu3sBlzj7134';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function enablePublicAccess() {
  try {
    console.log('Checking products table access...');
    
    // First, try a simple query to see if we can access products
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count');
    
    if (testError) {
      console.log('Cannot access products table. Error:', testError.message);
      console.log('Need to log in to Supabase dashboard to fix this issue:');
      console.log('1. Go to https://app.supabase.io/');
      console.log('2. Select your project');
      console.log('3. Go to Authentication -> Policies');
      console.log('4. Find the products table');
      console.log('5. Click "New Policy"');
      console.log('6. Select "Create a policy from scratch"');
      console.log('7. Set Policy Name: "Enable read access for all users"');
      console.log('8. Set Target roles: public');
      console.log('9. Set Definition: for SELECT using (true)');
      console.log('10. Click Save');
      
      console.log('\nAlternatively, you can run SQL to enable access:');
      console.log(`
-- Run this SQL in the Supabase SQL Editor:
CREATE POLICY "Enable read access for all users" 
ON "public"."products"
FOR SELECT 
TO public
USING (true);
      `);
    } else {
      console.log('Products table is already accessible!');
      console.log('Count:', testData.count);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the fix
enablePublicAccess(); 