// Simple script to test Supabase connection
// Run it with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js');

// Hardcoded Supabase credentials from .env.local
const supabaseUrl = 'https://tvmghxxoodjbjwhbvyir.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bWdoeHhvb2RqYmp3aGJ2eWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MTU3NDcsImV4cCI6MjA1Nzk5MTc0N30.4L2RE6FUjY9f9IWhG51ehvqeaNV3Zcnsu3sBlzj7134';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');

  try {
    // Test 1: Direct table access (might fail due to RLS)
    console.log('\n📋 TEST 1: Direct Table Access');
    const { data: directData, error: directError } = await supabase
      .from('products')
      .select('count');

    if (directError) {
      console.error('❌ FAILED: Cannot access products table directly');
      console.error(`   Error: ${directError.message} (${directError.code})`);
      
      if (directError.code === '42501') {
        console.log('   This is an RLS (Row Level Security) policy error.');
      }
    } else {
      console.log('✅ SUCCESS: Direct table access works!');
      console.log(`   Count: ${JSON.stringify(directData)}`);
    }

    // Test 2: Try using the RPC function (should work if SQL setup was run)
    console.log('\n📋 TEST 2: RPC Function Access');
    try {
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_all_products');

      if (rpcError) {
        console.error('❌ FAILED: RPC function not available or error');
        console.error(`   Error: ${rpcError.message}`);
        console.log('\n⚠️ ACTION REQUIRED:');
        console.log('   Please run the SQL setup script in Supabase dashboard.');
        console.log('   1. Go to https://app.supabase.io/');
        console.log('   2. Select your project');
        console.log('   3. Go to "SQL Editor"');
        console.log('   4. Copy all code from supabase-setup.sql');
        console.log('   5. Run it in the SQL Editor');
      } else if (!rpcData || rpcData.length === 0) {
        console.log('✅ RPC function works, but no products found');
        console.log('   You may want to add some products to your database');
      } else {
        console.log('✅ SUCCESS: RPC function works!');
        console.log(`   Found ${rpcData.length} products`);
        console.log('   First product:', rpcData[0].name);
      }
    } catch (rpcError) {
      console.error('❌ FAILED: Error testing RPC function');
      console.error(`   Error: ${rpcError.message || rpcError}`);
    }

    // Test 3: Try to insert a product (might fail for anonymous users)
    console.log('\n📋 TEST 3: Insert Access (likely to fail for anonymous)');
    const testProduct = {
      id: `test-${Date.now()}`,
      name: 'Test Product',
      description: 'This is a test product',
      price: 999,
      image_url: '/test.jpg',
      stock: 1,
      category: 'test'
    };

    const { error: insertError } = await supabase
      .from('products')
      .upsert([testProduct]);

    if (insertError) {
      console.log('❌ Expected: Insert failed (normal for anonymous users)');
      console.log(`   Error: ${insertError.message} (${insertError.code})`);
    } else {
      console.log('✅ SUCCESS: Insert successful!');
      console.log('   This is unusual for anonymous users unless RLS is disabled.');
    }

    console.log('\n📊 SUMMARY:');
    if (directError && !rpcData) {
      console.log('❌ You need to run the supabase-setup.sql script in Supabase dashboard.');
    } else if (!directError) {
      console.log('✅ Your Supabase connection is working correctly with direct access!');
    } else if (rpcData && rpcData.length > 0) {
      console.log('✅ Your Supabase connection is working through the RPC function.');
      console.log('   The app should function correctly.');
    } else {
      console.log('❓ Partial success: Some features may work but you should run the setup SQL.');
    }
  } catch (error) {
    console.error('❌ CRITICAL ERROR:');
    console.error(error);
  }
}

// Run the test
testConnection(); 