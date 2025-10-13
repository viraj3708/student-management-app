// Simple debug script to test login functionality
console.log('Debug script loaded');

// Test localStorage functionality
try {
  console.log('Testing localStorage...');
  localStorage.setItem('test', 'value');
  const testValue = localStorage.getItem('test');
  console.log('localStorage test result:', testValue);
  localStorage.removeItem('test');
} catch (error) {
  console.error('localStorage error:', error);
}

// Test user login simulation
function testLogin(username) {
  console.log('Testing login with username:', username);
  
  if (!username || !username.trim()) {
    console.log('ERROR: Username is required');
    return false;
  }
  
  try {
    const user = {
      username: username.trim(),
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('SUCCESS: User logged in');
    return true;
  } catch (error) {
    console.error('ERROR: Failed to save user', error);
    return false;
  }
}

// Test getting current user
function testGetCurrentUser() {
  try {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      console.log('Current user:', parsedUser);
      return parsedUser;
    } else {
      console.log('No current user');
      return null;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Test logout
function testLogout() {
  try {
    localStorage.removeItem('currentUser');
    console.log('User logged out');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
}

console.log('Debug functions ready');