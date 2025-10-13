import { useState, useEffect } from 'react';
import './App.css';
import StudentProfileForm from './components/StudentProfileForm';
import AttendanceModule from './components/AttendanceModule';
import HealthInfoTab from './components/HealthInfoTab';
import MarksEntryModule from './components/MarksEntryModule';
import TeacherDashboard from './components/TeacherDashboard';
import ResultsDisplay from './components/ResultsDisplay';
import LoginScreen from './components/LoginScreen';

function App() {
  console.log('App component rendering');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState('english');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [idleTimeout, setIdleTimeout] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    console.log('Checking if user is already logged in');
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Check if session is still valid (within 24 hours)
        const now = new Date().getTime();
        const loginTime = new Date(parsedUser.loginTime).getTime();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin < 24) {
          console.log('User is already logged in:', parsedUser);
          setIsLoggedIn(true);
          // Set session timeout
          const timeout = setTimeout(() => {
            handleLogout();
          }, (24 * 60 * 60 * 1000) - (now - loginTime)); // Remaining time in session
          setSessionTimeout(timeout);
          
          // Set up idle timeout (30 minutes)
          setupIdleTimeout();
        } else {
          // Session expired, clear user data
          localStorage.removeItem('currentUser');
        }
      } catch (e) {
        console.error('Error parsing saved user data:', e);
        localStorage.removeItem('currentUser');
      }
    } else {
      console.log('No saved user found');
    }
  }, []);

  // Set up idle timeout detection
  const setupIdleTimeout = () => {
    // Reset idle timeout on user activity
    const resetIdleTimeout = () => {
      setLastActivity(Date.now());
      
      // Clear existing idle timeout
      if (idleTimeout) {
        clearTimeout(idleTimeout);
      }
      
      // Set new idle timeout (30 minutes)
      const newTimeout = setTimeout(() => {
        handleLogout();
      }, 30 * 60 * 1000); // 30 minutes
      
      setIdleTimeout(newTimeout);
    };
    
    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimeout, true);
    });
    
    // Set initial idle timeout
    resetIdleTimeout();
    
    // Cleanup event listeners
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimeout, true);
      });
      if (idleTimeout) {
        clearTimeout(idleTimeout);
      }
    };
  };

  // Handle user login
  const handleLogin = (username) => {
    console.log('handleLogin called with username:', username);
    if (username && username.trim()) {
      const user = {
        username: username.trim(),
        loginTime: new Date().toISOString()
      };
      
      // Save user to localStorage
      try {
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('User saved to localStorage');
        
        setIsLoggedIn(true);
        console.log('isLoggedIn state set to true');
        
        // Set session timeout for 24 hours
        const timeout = setTimeout(() => {
          handleLogout();
        }, 24 * 60 * 60 * 1000); // 24 hours
        setSessionTimeout(timeout);
        
        // Set up idle timeout
        setupIdleTimeout();
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
    } else {
      console.log('Invalid username provided');
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
    if (idleTimeout) {
      clearTimeout(idleTimeout);
    }
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  // Language translations
  const translations = {
    english: {
      appTitle: "School Student Management System",
      dashboard: "Teacher Dashboard",
      profile: "Student Profile",
      attendance: "Attendance",
      health: "Health Info",
      marks: "Marks Entry",
      results: "Student Results",
      english: "English",
      marathi: "Marathi",
      logout: "Logout"
    },
    marathi: {
      appTitle: "शाळा विद्यार्थी व्यवस्थापन प्रणाली",
      dashboard: "शिक्षक डॅशबोर्ड",
      profile: "विद्यार्थी प्रोफाइल",
      attendance: "उपस्थिती",
      health: "आरोग्य माहिती",
      marks: "गुण नोंदणी",
      results: "विद्यार्थी निकाल",
      english: "इंग्रजी",
      marathi: "मराठी",
      logout: "लॉगआउट"
    }
  };

  const t = translations[language];

  // Function to toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'marathi' : 'english');
  };

  console.log('Rendering login screen:', !isLoggedIn);
  
  // If not logged in, show login screen
  if (!isLoggedIn) {
    console.log('Showing LoginScreen component');
    return <LoginScreen onLogin={handleLogin} language={language} />;
  }

  console.log('Showing main app content');
  
  return (
    <div className="app">
      <header>
        <div className="header-controls">
          <button className="home-button" onClick={() => setActiveTab('dashboard')}>
            Home
          </button>
          <button className="back-button" onClick={() => setActiveTab('dashboard')}>
            Back
          </button>
          <button className="language-toggle-button" onClick={toggleLanguage}>
            {language === 'english' ? 'मराठी' : 'English'}
          </button>
          <button className="logout-button" onClick={handleLogout}>
            {t.logout}
          </button>
        </div>
        <h1 className="main-title">{t.appTitle}</h1>
      </header>

      <nav>
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          {t.dashboard}
        </button>
        <button 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          {t.profile}
        </button>
        <button 
          className={activeTab === 'attendance' ? 'active' : ''} 
          onClick={() => setActiveTab('attendance')}
        >
          {t.attendance}
        </button>
        <button 
          className={activeTab === 'health' ? 'active' : ''} 
          onClick={() => setActiveTab('health')}
        >
          {t.health}
        </button>
        <button 
          className={activeTab === 'marks' ? 'active' : ''} 
          onClick={() => setActiveTab('marks')}
        >
          {t.marks}
        </button>
        <button 
          className={activeTab === 'results' ? 'active' : ''} 
          onClick={() => setActiveTab('results')}
        >
          {t.results}
        </button>
      </nav>

      <main>
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <TeacherDashboard language={language} />
          </div>
        )}
        
        {activeTab === 'profile' && (
          <div className="tab-content">
            <h2>{t.profile}</h2>
            <StudentProfileForm language={language} />
          </div>
        )}
        
        {activeTab === 'attendance' && (
          <div className="tab-content">
            <h2>{t.attendance}</h2>
            <AttendanceModule language={language} />
          </div>
        )}
        
        {activeTab === 'health' && (
          <div className="tab-content">
            <h2>{t.health}</h2>
            <HealthInfoTab language={language} />
          </div>
        )}
        
        {activeTab === 'marks' && (
          <div className="tab-content">
            <h2>{t.marks}</h2>
            <MarksEntryModule language={language} />
          </div>
        )}
        
        {activeTab === 'results' && (
          <div className="tab-content">
            <h2>{t.results}</h2>
            <ResultsDisplay language={language} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;