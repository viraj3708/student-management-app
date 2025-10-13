// Utility functions for encrypting and decrypting sensitive data
// Note: This is a basic implementation for client-side storage security
// In a production environment, sensitive data should be stored on a secure server

// Simple encryption function (for demonstration purposes only)
// In a real application, use a proper encryption library like crypto-js
const encrypt = (text, key) => {
  if (!text) return '';
  
  try {
    // Simple XOR encryption with key
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    // Base64 encode the result
    return btoa(result);
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Return original text if encryption fails
  }
};

// Simple decryption function (for demonstration purposes only)
const decrypt = (text, key) => {
  if (!text) return '';
  
  try {
    // Base64 decode
    const decoded = atob(text);
    // XOR decryption with key
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch (error) {
    console.error('Decryption error:', error);
    return text; // Return original text if decryption fails
  }
};

// Generate a key based on username and a secret
const generateKey = (username) => {
  // In a real application, this should be a more secure method
  const secret = 'student_management_app_secret_key_2025';
  return btoa(username + secret).substring(0, 16); // Simple key generation
};

// Encrypt sensitive student data
export const encryptStudentData = (studentData, username) => {
  if (!studentData || !username) return studentData;
  
  try {
    const key = generateKey(username);
    const encryptedData = { ...studentData };
    
    // Encrypt sensitive fields
    if (encryptedData.studentName) {
      encryptedData.studentName = encrypt(encryptedData.studentName, key);
    }
    
    if (encryptedData.fatherName) {
      encryptedData.fatherName = encrypt(encryptedData.fatherName, key);
    }
    
    if (encryptedData.motherName) {
      encryptedData.motherName = encrypt(encryptedData.motherName, key);
    }
    
    if (encryptedData.address) {
      encryptedData.address = encrypt(encryptedData.address, key);
    }
    
    if (encryptedData.phoneNumber) {
      encryptedData.phoneNumber = encrypt(encryptedData.phoneNumber, key);
    }
    
    return encryptedData;
  } catch (error) {
    console.error('Error encrypting student data:', error);
    return studentData; // Return original data if encryption fails
  }
};

// Decrypt sensitive student data
export const decryptStudentData = (studentData, username) => {
  if (!studentData || !username) return studentData;
  
  try {
    const key = generateKey(username);
    const decryptedData = { ...studentData };
    
    // Decrypt sensitive fields
    if (decryptedData.studentName) {
      decryptedData.studentName = decrypt(decryptedData.studentName, key);
    }
    
    if (decryptedData.fatherName) {
      decryptedData.fatherName = decrypt(decryptedData.fatherName, key);
    }
    
    if (decryptedData.motherName) {
      decryptedData.motherName = decrypt(decryptedData.motherName, key);
    }
    
    if (decryptedData.address) {
      decryptedData.address = decrypt(decryptedData.address, key);
    }
    
    if (decryptedData.phoneNumber) {
      decryptedData.phoneNumber = decrypt(decryptedData.phoneNumber, key);
    }
    
    return decryptedData;
  } catch (error) {
    console.error('Error decrypting student data:', error);
    return studentData; // Return original data if decryption fails
  }
};

// Hash password (for user authentication)
export const hashPassword = (password) => {
  if (!password) return '';
  
  try {
    // Simple hash function (for demonstration purposes only)
    // In a real application, use a proper hashing library like bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  } catch (error) {
    console.error('Password hashing error:', error);
    return password;
  }
};

// Securely store user credentials
export const storeUserCredentials = (username, password) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[username] = hashPassword(password);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error storing user credentials:', error);
    return false;
  }
};

// Verify user credentials
export const verifyUserCredentials = (username, password) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return users[username] && users[username] === hashPassword(password);
  } catch (error) {
    console.error('Error verifying user credentials:', error);
    return false;
  }
};