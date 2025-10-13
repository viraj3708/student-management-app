// Utility functions for managing student data in localStorage with user isolation
import { validateStudentProfile, validateAttendanceData, validateMarksData } from './validation';
import { encryptStudentData, decryptStudentData } from './encryption';

// Get current user from localStorage
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user - authentication required');
    return null;
  }
};

// Get user-specific key for data storage
const getUserDataKey = (baseKey) => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.username) {
    throw new Error('User authentication required');
  }
  return `${baseKey}_${currentUser.username}`;
};

// Validate that we have a legitimate user
const validateUserContext = () => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.username) {
    throw new Error('User authentication required');
  }
  return currentUser;
};

// Clear all existing data for current user only
export const clearAllData = () => {
  try {
    validateUserContext();
    
    const userPrefix = `${getCurrentUser().username}_`;
    const keysToRemove = [];
    
    // Collect all keys that belong to this user
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(userPrefix)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all user-specific keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error clearing user data:', error.message);
    return { success: false, error: 'Failed to clear data' };
  }
};

// Initialize the app with empty data for current user
export const initializeApp = () => {
  // No need to clear data on initialization
};

// Save student profile data for current user
export const saveStudentProfile = (studentData) => {
  try {
    const currentUser = validateUserContext();
    
    // Validate and sanitize student data
    const validation = validateStudentProfile(studentData);
    if (!validation.isValid) {
      console.error('Student profile validation failed:', validation.errors);
      return { success: false, error: 'Invalid student data: ' + validation.errors.join(', ') };
    }
    
    // Encrypt sensitive student data
    const encryptedData = encryptStudentData(validation.sanitizedData, currentUser.username);
    
    const studentsKey = getUserDataKey('students');
    
    // Get existing students for current user or initialize empty array
    const existingStudents = JSON.parse(localStorage.getItem(studentsKey) || '[]');
    
    // Check if student with same registration number already exists
    const existingIndex = existingStudents.findIndex(
      student => student.registrationNumber === encryptedData.registrationNumber
    );
    
    if (existingIndex !== -1) {
      // Update existing student
      existingStudents[existingIndex] = { 
        ...existingStudents[existingIndex], 
        ...encryptedData,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new student with unique ID
      const newStudent = {
        ...encryptedData,
        id: Date.now().toString(), // Simple ID generation as string
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      existingStudents.push(newStudent);
    }
    
    // Save back to localStorage with user-specific key
    localStorage.setItem(studentsKey, JSON.stringify(existingStudents));
    return { success: true };
  } catch (error) {
    console.error('Error saving student profile:', error.message);
    return { success: false, error: 'Failed to save student data' };
  }
};

// Get all students for current user
export const getAllStudents = () => {
  try {
    const currentUser = validateUserContext();
    
    const studentsKey = getUserDataKey('students');
    const students = JSON.parse(localStorage.getItem(studentsKey) || '[]');
    
    // Decrypt all student data before returning
    return students.map(student => {
      try {
        // Don't validate encrypted data, just decrypt it
        const decryptedData = decryptStudentData(student, currentUser.username);
        return decryptedData;
      } catch (decryptError) {
        console.error('Error decrypting student data:', decryptError);
        return student; // Return original data if decryption fails
      }
    });
  } catch (error) {
    console.error('Error retrieving students:', error.message);
    return [];
  }
};

// Get student by ID for current user
export const getStudentById = (id) => {
  try {
    validateUserContext();
    
    const students = getAllStudents();
    // Ensure we're comparing the same types (both strings)
    const student = students.find(student => student.id.toString() === id.toString()) || null;
    return student;
  } catch (error) {
    console.error('Error retrieving student:', error.message);
    return null;
  }
};

// Delete student by ID for current user
export const deleteStudentById = (id) => {
  try {
    validateUserContext();
    
    const studentsKey = getUserDataKey('students');
    const existingStudents = JSON.parse(localStorage.getItem(studentsKey) || '[]');
    const updatedStudents = existingStudents.filter(student => student.id !== id);
    localStorage.setItem(studentsKey, JSON.stringify(updatedStudents));
    return { success: true };
  } catch (error) {
    console.error('Error deleting student:', error.message);
    return { success: false, error: 'Failed to delete student' };
  }
};

// Save attendance data for current user
export const saveAttendanceData = (attendanceData) => {
  try {
    validateUserContext();
    
    // Validate and sanitize attendance data
    const validation = validateAttendanceData(attendanceData);
    if (!validation.isValid) {
      console.error('Attendance data validation failed:', validation.errors);
      return { success: false, error: 'Invalid attendance data: ' + validation.errors.join(', ') };
    }
    
    const attendanceKey = getUserDataKey('attendance');
    const existingAttendance = JSON.parse(localStorage.getItem(attendanceKey) || '{}');
    const updatedAttendance = { ...existingAttendance, ...validation.sanitizedData };
    localStorage.setItem(attendanceKey, JSON.stringify(updatedAttendance));
    return { success: true };
  } catch (error) {
    console.error('Error saving attendance data:', error.message);
    return { success: false, error: 'Failed to save attendance data' };
  }
};

// Get attendance data for current user
export const getAttendanceData = () => {
  try {
    validateUserContext();
    
    const attendanceKey = getUserDataKey('attendance');
    const attendance = JSON.parse(localStorage.getItem(attendanceKey) || '{}');
    
    // Validate and sanitize attendance data before returning
    const validation = validateAttendanceData(attendance);
    return validation.sanitizedData;
  } catch (error) {
    console.error('Error retrieving attendance data:', error.message);
    return {};
  }
};

// Save marks data for current user
export const saveMarksData = (marksData) => {
  try {
    validateUserContext();
    
    // Validate and sanitize marks data
    const validation = validateMarksData(marksData);
    if (!validation.isValid) {
      console.error('Marks data validation failed:', validation.errors);
      return { success: false, error: 'Invalid marks data: ' + validation.errors.join(', ') };
    }
    
    const marksKey = getUserDataKey('marks');
    const existingMarks = JSON.parse(localStorage.getItem(marksKey) || '{}');
    const updatedMarks = { ...existingMarks, ...validation.sanitizedData };
    localStorage.setItem(marksKey, JSON.stringify(updatedMarks));
    return { success: true };
  } catch (error) {
    console.error('Error saving marks data:', error.message);
    return { success: false, error: 'Failed to save marks data' };
  }
};

// Get marks data for current user
export const getMarksData = () => {
  try {
    validateUserContext();
    
    const marksKey = getUserDataKey('marks');
    const marks = JSON.parse(localStorage.getItem(marksKey) || '{}');
    
    // Validate and sanitize marks data before returning
    const validation = validateMarksData(marks);
    return validation.sanitizedData;
  } catch (error) {
    console.error('Error retrieving marks data:', error.message);
    return {};
  }
};