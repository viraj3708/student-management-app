import { useState } from 'react';
import '../App.css';
import { storeUserCredentials, verifyUserCredentials } from '../utils/encryption';
import { isRateLimited, resetRateLimit } from '../utils/validation';

const LoginScreen = ({ onLogin, language }) => {
  console.log('LoginScreen component rendering with language:', language);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  // Language translations
  const translations = {
    english: {
      welcome: "Welcome to Student Management System",
      username: "Username",
      password: "Password",
      login: "Login",
      register: "Register",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      createAccount: "Create Account",
      signIn: "Sign In",
      errorMissingFields: "Please enter both username and password",
      errorInvalidCredentials: "Invalid username or password",
      registrationSuccess: "Account created successfully! Please login.",
      userExists: "Username already exists!",
      registrationTitle: "Create New Account",
      passwordRequirements: "Password must be at least 6 characters",
      accountBlocked: "Too many failed attempts. Please try again later.",
      tryAgainLater: "Please try again in {minutes} minutes."
    },
    marathi: {
      welcome: "विद्यार्थी व्यवस्थापन प्रणालीमध्ये आपले स्वागत आहे",
      username: "वापरकर्तानाव",
      password: "पासवर्ड",
      login: "लॉग इन करा",
      register: "नोंदणी करा",
      noAccount: "खाते नाही?",
      haveAccount: "आधीपासूनच खाते आहे?",
      createAccount: "खाते तयार करा",
      signIn: "साइन इन करा",
      errorMissingFields: "कृपया वापरकर्तानाव आणि पासवर्ड भरा",
      errorInvalidCredentials: "अवैध वापरकर्तानाव किंवा पासवर्ड",
      registrationSuccess: "खाते यशस्वीरित्या तयार झाले! कृपया लॉगिन करा.",
      userExists: "वापरकर्तानाव आधीपासूनच अस्तित्वात आहे!",
      registrationTitle: "नवीन खाते तयार करा",
      passwordRequirements: "पासवर्ड किमान 6 अक्षरे असणे आवश्यक आहे",
      accountBlocked: "अनेक अयशस्वी प्रयत्न. कृपया नंतर पुन्हा प्रयत्न करा.",
      tryAgainLater: "कृपया {minutes} मिनिटांनी पुन्हा प्रयत्न करा."
    }
  };

  const t = translations[language];

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login form submitted with username:', username);
    
    // Check if user is rate limited
    if (isRateLimited(username)) {
      setIsBlocked(true);
      const minutes = Math.ceil((60 * 60 * 1000) / (1000 * 60)); // 60 minutes
      setError(t.accountBlocked + ' ' + t.tryAgainLater.replace('{minutes}', minutes));
      return;
    }
    
    // Validate inputs
    if (!username || !password || username.trim() === '' || password.trim() === '') {
      console.log('Username or password is empty');
      setError(t.errorMissingFields);
      return;
    }
    
    // Verify user credentials
    if (verifyUserCredentials(username, password)) {
      // Reset rate limit on successful login
      resetRateLimit(username);
      
      // Call onLogin with username only
      console.log('Calling onLogin with username:', username);
      try {
        onLogin(username.trim());
        console.log('onLogin function called successfully');
      } catch (error) {
        console.error('Error calling onLogin function:', error);
        setError('Login failed. Please try again.');
      }
    } else {
      // Increment rate limit counter on failed login
      setError(t.errorInvalidCredentials);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registration form submitted with username:', username);
    
    // Validate inputs
    if (!username || !password || username.trim() === '' || password.trim() === '') {
      console.log('Username or password is empty during registration');
      setError(t.errorMissingFields);
      return;
    }
    
    // Check password requirements
    if (password.length < 6) {
      setError(t.passwordRequirements);
      return;
    }
    
    // Check if user already exists
    try {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (users[username]) {
        setError(t.userExists);
        return;
      }
    } catch (error) {
      console.error('Error checking existing users:', error);
    }
    
    // Store user credentials
    if (storeUserCredentials(username, password)) {
      // Show success message
      setError(t.registrationSuccess);
      setIsRegistering(false);
      setUsername('');
      setPassword('');
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  console.log('Rendering LoginScreen form with isRegistering:', isRegistering);
  
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">{isRegistering ? t.registrationTitle : t.welcome}</h1>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">{t.username}:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                console.log('Username changed to:', e.target.value);
                setUsername(e.target.value);
                // Reset blocked state when user starts typing
                if (isBlocked) {
                  setIsBlocked(false);
                  setError('');
                }
              }}
              placeholder={t.username}
              className="login-input"
              disabled={isBlocked}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t.password}:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                console.log('Password changed');
                setPassword(e.target.value);
                // Reset blocked state when user starts typing
                if (isBlocked) {
                  setIsBlocked(false);
                  setError('');
                }
              }}
              placeholder={t.password}
              className="login-input"
              disabled={isBlocked}
            />
          </div>
          
          <button type="submit" className="login-button primary" disabled={isBlocked}>
            {isRegistering ? t.register : t.login}
          </button>
        </form>
        
        <div className="register-section">
          {isRegistering ? (
            <p>{t.haveAccount} <button className="register-link" onClick={() => {setIsRegistering(false); setError(''); setIsBlocked(false);}}>{t.signIn}</button></p>
          ) : (
            <p>{t.noAccount} <button className="register-link" onClick={() => {setIsRegistering(true); setError(''); setIsBlocked(false);}}>{t.createAccount}</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;