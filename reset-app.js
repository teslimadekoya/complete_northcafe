// Reset script to clear all localStorage data
console.log('🧹 Clearing all localStorage data...');

// Clear all localStorage keys
localStorage.clear();

// Create fresh default test user
const defaultUser = {
  username: 'admin',
  email: 'admin@gmail.com',
  password: 'admin123',
  id: Date.now(),
  isMockUser: true
};

// Store the default user
localStorage.setItem('mock_users', JSON.stringify([defaultUser]));

console.log('✅ App reset complete!');
console.log('📱 Default test user created:');
console.log('   Email: admin@gmail.com');
console.log('   Password: admin123');
console.log('🔄 Please refresh the page to see the changes.'); 