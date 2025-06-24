// Quick verification script to check app functionality
console.log('🔍 Quick App Verification...');

// Check if app is loaded
if (typeof React !== 'undefined') {
  console.log('✅ React is loaded');
} else {
  console.log('❌ React not found');
}

// Check localStorage availability
if (typeof localStorage !== 'undefined') {
  console.log('✅ localStorage is available');
  
  // Check for default user
  const mockUsers = localStorage.getItem('mock_users');
  if (mockUsers) {
    console.log('✅ Default test user exists');
    console.log('📱 Login with: admin@gmail.com / admin123');
  } else {
    console.log('⚠️ No default user found - run reset script');
  }
  
  // Check for any existing cart data
  const cartData = localStorage.getItem('localCart');
  if (cartData) {
    console.log('📦 Cart data found in localStorage');
  } else {
    console.log('🛒 Cart is empty (normal for fresh start)');
  }
} else {
  console.log('❌ localStorage not available');
}

// Check for common errors
console.log('\n🔧 Common Issues Check:');
console.log('1. If you see 404 errors - backend is unavailable (normal, app uses fallback)');
console.log('2. If cart doesn\'t work - check console for errors');
console.log('3. If login fails - run the reset script to create default user');

console.log('\n🎯 Next Steps:');
console.log('1. Test registration: Go to /register');
console.log('2. Test login: Use admin@gmail.com / admin123');
console.log('3. Test cart: Add items from menu');
console.log('4. Test checkout: Complete order flow');

console.log('\n📋 Full test guide available in: RESET_AND_TEST_GUIDE.md'); 