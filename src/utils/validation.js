// Utility functions for input validation and sanitization
// Rate limiting storage
const rateLimitStorage = {};

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5, // Maximum attempts allowed
  windowMs: 15 * 60 * 1000, // 15 minutes window
  blockDuration: 60 * 60 * 1000 // 1 hour block
};

// Check if an IP/user is rate limited
export const isRateLimited = (identifier) => {
  const now = Date.now();
  const record = rateLimitStorage[identifier];
  
  if (!record) {
    // First attempt
    rateLimitStorage[identifier] = {
      attempts: 1,
      firstAttempt: now,
      blockedUntil: null
    };
    return false;
  }
  
  // Check if user is currently blocked
  if (record.blockedUntil && now < record.blockedUntil) {
    return true;
  }
  
  // Check if window has expired
  if (now - record.firstAttempt > RATE_LIMIT_CONFIG.windowMs) {
    // Reset attempts
    rateLimitStorage[identifier] = {
      attempts: 1,
      firstAttempt: now,
      blockedUntil: null
    };
    return false;
  }
  
  // Increment attempts
  record.attempts += 1;
  
  // Check if limit exceeded
  if (record.attempts > RATE_LIMIT_CONFIG.maxAttempts) {
    record.blockedUntil = now + RATE_LIMIT_CONFIG.blockDuration;
    return true;
  }
  
  return false;
};

// Reset rate limit for an identifier
export const resetRateLimit = (identifier) => {
  delete rateLimitStorage[identifier];
};

// Sanitize input to prevent XSS attacks
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>?/gm, '');
  
  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  return sanitized;
};

// Validate and sanitize student profile data
export const validateStudentProfile = (studentData) => {
  const errors = [];
  const sanitizedData = {};
  
  // Required fields validation
  if (!studentData.studentName || studentData.studentName.trim() === '') {
    errors.push('Student name is required');
  } else {
    // Check length constraints
    if (studentData.studentName.length > 50) {
      errors.push('Student name must be less than 50 characters');
    } else {
      sanitizedData.studentName = sanitizeInput(studentData.studentName.trim());
    }
  }
  
  if (!studentData.class || studentData.class.trim() === '') {
    errors.push('Class is required');
  } else {
    // Validate class is a number between 1-12
    const classNum = parseInt(studentData.class);
    if (isNaN(classNum) || classNum < 1 || classNum > 12) {
      errors.push('Class must be a number between 1 and 12');
    } else {
      sanitizedData.class = classNum.toString();
    }
  }
  
  if (!studentData.registrationNumber || studentData.registrationNumber.trim() === '') {
    errors.push('Registration number is required');
  } else {
    // Check length constraints
    if (studentData.registrationNumber.length > 20) {
      errors.push('Registration number must be less than 20 characters');
    } else {
      sanitizedData.registrationNumber = sanitizeInput(studentData.registrationNumber.trim());
    }
  }
  
  // Optional fields sanitization with constraints
  if (studentData.fatherName) {
    if (studentData.fatherName.length > 50) {
      errors.push('Father name must be less than 50 characters');
    } else {
      sanitizedData.fatherName = sanitizeInput(studentData.fatherName.trim());
    }
  } else {
    sanitizedData.fatherName = '';
  }
  
  if (studentData.motherName) {
    if (studentData.motherName.length > 50) {
      errors.push('Mother name must be less than 50 characters');
    } else {
      sanitizedData.motherName = sanitizeInput(studentData.motherName.trim());
    }
  } else {
    sanitizedData.motherName = '';
  }
  
  if (studentData.gender) {
    const validGenders = ['male', 'female'];
    if (validGenders.includes(studentData.gender.toLowerCase())) {
      sanitizedData.gender = sanitizeInput(studentData.gender.trim());
    } else {
      errors.push('Invalid gender value');
    }
  } else {
    sanitizedData.gender = '';
  }
  
  if (studentData.caste) {
    if (studentData.caste.length > 30) {
      errors.push('Caste must be less than 30 characters');
    } else {
      sanitizedData.caste = sanitizeInput(studentData.caste.trim());
    }
  } else {
    sanitizedData.caste = '';
  }
  
  if (studentData.dob) {
    sanitizedData.dob = sanitizeInput(studentData.dob.trim());
  } else {
    sanitizedData.dob = '';
  }
  
  if (studentData.motherTongue) {
    if (studentData.motherTongue.length > 30) {
      errors.push('Mother tongue must be less than 30 characters');
    } else {
      sanitizedData.motherTongue = sanitizeInput(studentData.motherTongue.trim());
    }
  } else {
    sanitizedData.motherTongue = '';
  }
  
  if (studentData.medium) {
    const validMediums = ['marathi', 'english'];
    if (validMediums.includes(studentData.medium.toLowerCase())) {
      sanitizedData.medium = sanitizeInput(studentData.medium.trim());
    } else {
      errors.push('Invalid medium value');
    }
  } else {
    sanitizedData.medium = '';
  }
  
  if (studentData.address) {
    if (studentData.address.length > 200) {
      errors.push('Address must be less than 200 characters');
    } else {
      sanitizedData.address = sanitizeInput(studentData.address.trim());
    }
  } else {
    sanitizedData.address = '';
  }
  
  if (studentData.phoneNumber) {
    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(studentData.phoneNumber)) {
      errors.push('Phone number must be 10 digits');
    } else {
      sanitizedData.phoneNumber = sanitizeInput(studentData.phoneNumber.trim());
    }
  } else {
    sanitizedData.phoneNumber = '';
  }
  
  if (studentData.height) {
    const height = parseInt(studentData.height);
    if (isNaN(height) || height < 50 || height > 250) {
      errors.push('Height must be between 50 and 250 cm');
    } else {
      sanitizedData.height = height.toString();
    }
  } else {
    sanitizedData.height = '';
  }
  
  if (studentData.weight) {
    const weight = parseInt(studentData.weight);
    if (isNaN(weight) || weight < 10 || weight > 200) {
      errors.push('Weight must be between 10 and 200 kg');
    } else {
      sanitizedData.weight = weight.toString();
    }
  } else {
    sanitizedData.weight = '';
  }
  
  // School name
  if (studentData.schoolName) {
    if (studentData.schoolName.length > 100) {
      errors.push('School name must be less than 100 characters');
    } else {
      sanitizedData.schoolName = sanitizeInput(studentData.schoolName.trim());
    }
  } else {
    sanitizedData.schoolName = '';
  }
  
  // Subjects validation
  if (studentData.subjects && Array.isArray(studentData.subjects)) {
    sanitizedData.subjects = studentData.subjects.map(subject => {
      if (typeof subject === 'string') {
        // Limit subject name length
        if (subject.length > 50) {
          errors.push('Subject name must be less than 50 characters');
          return '';
        }
        return sanitizeInput(subject.trim());
      } else if (subject && subject.name) {
        // Limit subject name length
        if (subject.name.length > 50) {
          errors.push('Subject name must be less than 50 characters');
          return { name: '', marks: '' };
        }
        return {
          name: sanitizeInput(subject.name.trim()),
          marks: subject.marks || ''
        };
      }
      return subject;
    }).filter(subject => subject && (typeof subject === 'string' ? subject !== '' : subject.name !== ''));
  } else {
    sanitizedData.subjects = [];
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
};

// Validate attendance data
export const validateAttendanceData = (attendanceData) => {
  const errors = [];
  const sanitizedData = {};
  
  // Validate keys and values
  for (const [key, value] of Object.entries(attendanceData)) {
    // Validate key format (should be month-year-type-id)
    if (typeof key === 'string') {
      // Limit key length
      if (key.length > 100) {
        errors.push('Data key too long');
        continue;
      }
      
      const sanitizedKey = sanitizeInput(key);
      let sanitizedValue = value;
      
      // For numeric values, ensure they are valid numbers within reasonable range
      if (typeof value === 'string' && /^\d+$/.test(value)) {
        const numValue = parseInt(value);
        if (numValue >= 0 && numValue <= 31) { // Reasonable range for days
          sanitizedValue = numValue;
        } else {
          errors.push('Invalid numeric value');
          sanitizedValue = 0;
        }
      } else if (typeof value === 'number') {
        if (value >= 0 && value <= 31) { // Reasonable range for days
          sanitizedValue = value;
        } else {
          errors.push('Invalid numeric value');
          sanitizedValue = 0;
        }
      } else if (typeof value === 'string') {
        sanitizedValue = sanitizeInput(value);
      }
      
      sanitizedData[sanitizedKey] = sanitizedValue;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
};

// Validate marks data
export const validateMarksData = (marksData) => {
  const errors = [];
  const sanitizedData = {};
  
  // Validate structure
  for (const [studentId, terms] of Object.entries(marksData)) {
    // Limit student ID length
    if (studentId.length > 50) {
      errors.push('Student ID too long');
      continue;
    }
    
    const sanitizedStudentId = sanitizeInput(studentId);
    sanitizedData[sanitizedStudentId] = {};
    
    if (typeof terms === 'object' && terms !== null) {
      for (const [term, subjects] of Object.entries(terms)) {
        // Limit term name length
        if (term.length > 20) {
          errors.push('Term name too long');
          continue;
        }
        
        const sanitizedTerm = sanitizeInput(term);
        sanitizedData[sanitizedStudentId][sanitizedTerm] = {};
        
        if (typeof subjects === 'object' && subjects !== null) {
          for (const [subject, marks] of Object.entries(subjects)) {
            // Limit subject name length
            if (subject.length > 50) {
              errors.push('Subject name too long');
              continue;
            }
            
            const sanitizedSubject = sanitizeInput(subject);
            // Ensure marks is a valid number or empty string within reasonable range
            let sanitizedMarks = '';
            if (marks !== '' && !isNaN(marks)) {
              const numMarks = parseInt(marks);
              if (numMarks >= 0 && numMarks <= 1000) { // Reasonable range for marks
                sanitizedMarks = numMarks;
              } else {
                errors.push('Invalid marks value');
                sanitizedMarks = '';
              }
            }
            sanitizedData[sanitizedStudentId][sanitizedTerm][sanitizedSubject] = sanitizedMarks;
          }
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
};

// Validate string input length
export const validateStringLength = (input, minLength = 1, maxLength = 100) => {
  if (typeof input !== 'string') return false;
  return input.length >= minLength && input.length <= maxLength;
};

// Validate numeric input range
export const validateNumericRange = (input, min = 0, max = 1000) => {
  const num = parseInt(input);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};