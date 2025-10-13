import { useState, useEffect } from 'react';
import { saveStudentProfile } from '../utils/dataManager';
import { validateStringLength, validateNumericRange } from '../utils/validation';

const StudentProfileForm = ({ language, initialData, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    gender: '',
    caste: '',
    dob: '',
    registrationNumber: '',
    fatherName: '',
    motherName: '',
    motherTongue: '',
    medium: '',
    address: '',
    phoneNumber: '',
    height: '',
    weight: '',
    schoolName: '',
    class: '' // Added class field
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Initialize form with initialData if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        studentName: initialData.studentName || '',
        gender: initialData.gender || '',
        caste: initialData.caste || '',
        dob: initialData.dob || '',
        registrationNumber: initialData.registrationNumber || '',
        fatherName: initialData.fatherName || '',
        motherName: initialData.motherName || '',
        motherTongue: initialData.motherTongue || '',
        medium: initialData.medium || '',
        address: initialData.address || '',
        phoneNumber: initialData.phoneNumber || '',
        height: initialData.height || '',
        weight: initialData.weight || '',
        schoolName: initialData.schoolName || '',
        class: initialData.class || ''
      });
    }
  }, [initialData]);

  // Language translations
  const translations = {
    english: {
      studentName: "Student Name",
      gender: "Gender",
      male: "Male",
      female: "Female",
      caste: "Caste",
      dob: "Date of Birth",
      registrationNumber: "Registration Number",
      fatherName: "Father's Name",
      motherName: "Mother's Name",
      motherTongue: "Mother Tongue",
      medium: "Medium",
      marathi: "Marathi",
      english: "English",
      address: "Address",
      phoneNumber: "Phone Number",
      height: "Height (cm)",
      weight: "Weight (kg)",
      schoolName: "School Name",
      class: "Class", // Added class translation
      submit: isEditing ? "Update Profile" : "Submit",
      reset: "Reset",
      cancel: "Cancel",
      successMessage: isEditing ? "Student profile updated successfully!" : "Student profile saved successfully!",
      errorMessage: isEditing ? "Error updating student profile. Please try again." : "Error saving student profile. Please try again.",
      validation: {
        studentNameRequired: "Student name is required",
        studentNameLength: "Student name must be between 2 and 50 characters",
        classRequired: "Class is required",
        classInvalid: "Class must be a number between 1 and 12",
        genderRequired: "Gender is required",
        casteRequired: "Caste is required",
        casteLength: "Caste must be between 2 and 30 characters",
        dobRequired: "Date of birth is required",
        registrationRequired: "Registration number is required",
        registrationLength: "Registration number must be between 1 and 20 characters",
        fatherNameRequired: "Father's name is required",
        fatherNameLength: "Father's name must be between 2 and 50 characters",
        motherNameRequired: "Mother's name is required",
        motherNameLength: "Mother's name must be between 2 and 50 characters",
        motherTongueRequired: "Mother tongue is required",
        motherTongueLength: "Mother tongue must be between 2 and 30 characters",
        mediumRequired: "Medium is required",
        addressRequired: "Address is required",
        addressLength: "Address must be between 5 and 200 characters",
        phoneRequired: "Phone number is required",
        phoneInvalid: "Phone number must be 10 digits",
        heightRequired: "Height is required",
        heightInvalid: "Height must be between 50 and 250 cm",
        weightRequired: "Weight is required",
        weightInvalid: "Weight must be between 10 and 200 kg"
      }
    },
    marathi: {
      studentName: "विद्यार्थी नाव",
      gender: "लिंग",
      male: "पुरुष",
      female: "स्त्री",
      caste: "जात",
      dob: "जन्मदिनांक",
      registrationNumber: "रजिस्टर नंबर",
      fatherName: "वडिलांचे नाव",
      motherName: "आईचे नाव",
      motherTongue: "मातृभाषा",
      medium: "माध्यम",
      marathi: "मराठी",
      english: "इंग्रजी",
      address: "पत्ता",
      phoneNumber: "दूरध्वनी क्रमांक",
      height: "उंची (सेमी)",
      weight: "वजन (किलो)",
      schoolName: "शाळेचे नाव",
      class: "वर्ग", // Added class translation
      submit: isEditing ? "प्रोफाइल अपडेट करा" : "सबमिट करा",
      reset: "रीसेट करा",
      cancel: "रद्द करा",
      successMessage: isEditing ? "विद्यार्थी प्रोफाइल यशस्वीरित्या अपडेट केला!" : "विद्यार्थी प्रोफाइल यशस्वीरित्या सेव्ह केला!",
      errorMessage: isEditing ? "विद्यार्थी प्रोफाइल अपडेट करताना त्रुटी. कृपया पुन्हा प्रयत्न करा." : "विद्यार्थी प्रोफाइल सेव्ह करताना त्रुटी. कृपया पुन्हा प्रयत्न करा.",
      validation: {
        studentNameRequired: "विद्यार्थी नाव आवश्यक आहे",
        studentNameLength: "विद्यार्थी नाव 2 ते 50 अक्षरे असणे आवश्यक आहे",
        classRequired: "वर्ग आवश्यक आहे",
        classInvalid: "वर्ग 1 ते 12 दरम्यानचा असणे आवश्यक आहे",
        genderRequired: "लिंग आवश्यक आहे",
        casteRequired: "जात आवश्यक आहे",
        casteLength: "जात 2 ते 30 अक्षरे असणे आवश्यक आहे",
        dobRequired: "जन्मतारीख आवश्यक आहे",
        registrationRequired: "नोंदणी क्रमांक आवश्यक आहे",
        registrationLength: "नोंदणी क्रमांक 1 ते 20 अक्षरे असणे आवश्यक आहे",
        fatherNameRequired: "वडिलांचे नाव आवश्यक आहे",
        fatherNameLength: "वडिलांचे नाव 2 ते 50 अक्षरे असणे आवश्यक आहे",
        motherNameRequired: "आईचे नाव आवश्यक आहे",
        motherNameLength: "आईचे नाव 2 ते 50 अक्षरे असणे आवश्यक आहे",
        motherTongueRequired: "मातृभाषा आवश्यक आहे",
        motherTongueLength: "मातृभाषा 2 ते 30 अक्षरे असणे आवश्यक आहे",
        mediumRequired: "माध्यम आवश्यक आहे",
        addressRequired: "पत्ता आवश्यक आहे",
        addressLength: "पत्ता 5 ते 200 अक्षरे असणे आवश्यक आहे",
        phoneRequired: "दूरध्वनी क्रमांक आवश्यक आहे",
        phoneInvalid: "दूरध्वनी क्रमांक 10 अंकी असणे आवश्यक आहे",
        heightRequired: "उंची आवश्यक आहे",
        heightInvalid: "उंची 50 ते 250 सेमी दरम्यानची असणे आवश्यक आहे",
        weightRequired: "वजन आवश्यक आहे",
        weightInvalid: "वजन 10 ते 200 किलो दरम्यानची असणे आवश्यक आहे"
      }
    }
  };

  const t = translations[language];

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Student name validation
    if (!formData.studentName.trim()) {
      newErrors.studentName = t.validation.studentNameRequired;
    } else if (!validateStringLength(formData.studentName.trim(), 2, 50)) {
      newErrors.studentName = t.validation.studentNameLength;
    }
    
    // Class validation
    if (!formData.class.trim()) {
      newErrors.class = t.validation.classRequired;
    } else {
      const classNum = parseInt(formData.class);
      if (isNaN(classNum) || classNum < 1 || classNum > 12) {
        newErrors.class = t.validation.classInvalid;
      }
    }
    
    // Gender validation
    if (!formData.gender) {
      newErrors.gender = t.validation.genderRequired;
    }
    
    // Caste validation
    if (!formData.caste.trim()) {
      newErrors.caste = t.validation.casteRequired;
    } else if (!validateStringLength(formData.caste.trim(), 2, 30)) {
      newErrors.caste = t.validation.casteLength;
    }
    
    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = t.validation.dobRequired;
    }
    
    // Registration number validation
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = t.validation.registrationRequired;
    } else if (!validateStringLength(formData.registrationNumber.trim(), 1, 20)) {
      newErrors.registrationNumber = t.validation.registrationLength;
    }
    
    // Father's name validation
    if (!formData.fatherName.trim()) {
      newErrors.fatherName = t.validation.fatherNameRequired;
    } else if (!validateStringLength(formData.fatherName.trim(), 2, 50)) {
      newErrors.fatherName = t.validation.fatherNameLength;
    }
    
    // Mother's name validation
    if (!formData.motherName.trim()) {
      newErrors.motherName = t.validation.motherNameRequired;
    } else if (!validateStringLength(formData.motherName.trim(), 2, 50)) {
      newErrors.motherName = t.validation.motherNameLength;
    }
    
    // Mother tongue validation
    if (!formData.motherTongue.trim()) {
      newErrors.motherTongue = t.validation.motherTongueRequired;
    } else if (!validateStringLength(formData.motherTongue.trim(), 2, 30)) {
      newErrors.motherTongue = t.validation.motherTongueLength;
    }
    
    // Medium validation
    if (!formData.medium) {
      newErrors.medium = t.validation.mediumRequired;
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = t.validation.addressRequired;
    } else if (!validateStringLength(formData.address.trim(), 5, 200)) {
      newErrors.address = t.validation.addressLength;
    }
    
    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t.validation.phoneRequired;
    } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = t.validation.phoneInvalid;
    }
    
    // Height validation
    if (!formData.height) {
      newErrors.height = t.validation.heightRequired;
    } else if (!validateNumericRange(formData.height, 50, 250)) {
      newErrors.height = t.validation.heightInvalid;
    }
    
    // Weight validation
    if (!formData.weight) {
      newErrors.weight = t.validation.weightRequired;
    } else if (!validateNumericRange(formData.weight, 10, 200)) {
      newErrors.weight = t.validation.weightInvalid;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      setMessage(t.errorMessage);
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
      }, 5000);
      return;
    }
    
    // If onSave callback is provided (editing mode), call it with the form data
    if (onSave) {
      onSave(formData);
    } else {
      // Save to localStorage (for creating new students)
      const result = saveStudentProfile(formData);
      
      if (result.success) {
        setMessage(t.successMessage);
        setMessageType('success');
        // Reset form after successful submission
        setFormData({
          studentName: '',
          gender: '',
          caste: '',
          dob: '',
          registrationNumber: '',
          fatherName: '',
          motherName: '',
          motherTongue: '',
          medium: '',
          address: '',
          phoneNumber: '',
          height: '',
          weight: '',
          schoolName: '',
          class: ''
        });
        setErrors({}); // Clear errors
      } else {
        setMessage(result.error || t.errorMessage);
        setMessageType('error');
      }
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  };

  const handleReset = () => {
    // If we have initial data, reset to that, otherwise clear the form
    if (initialData) {
      setFormData({
        studentName: initialData.studentName || '',
        gender: initialData.gender || '',
        caste: initialData.caste || '',
        dob: initialData.dob || '',
        registrationNumber: initialData.registrationNumber || '',
        fatherName: initialData.fatherName || '',
        motherName: initialData.motherName || '',
        motherTongue: initialData.motherTongue || '',
        medium: initialData.medium || '',
        address: initialData.address || '',
        phoneNumber: initialData.phoneNumber || '',
        height: initialData.height || '',
        weight: initialData.weight || '',
        schoolName: initialData.schoolName || '',
        class: initialData.class || ''
      });
    } else {
      setFormData({
        studentName: '',
        gender: '',
        caste: '',
        dob: '',
        registrationNumber: '',
        fatherName: '',
        motherName: '',
        motherTongue: '',
        medium: '',
        address: '',
        phoneNumber: '',
        height: '',
        weight: '',
        schoolName: '',
        class: '' // Reset class field
      });
    }
    setErrors({}); // Clear errors
    setMessage(''); // Clear any messages
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Display success/error messages */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="studentName">{t.studentName} *</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
            className={errors.studentName ? 'error' : ''}
          />
          {errors.studentName && <div className="error-message">{errors.studentName}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="class">{t.class} *</label>
          <input
            type="number"
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            min="1"
            max="12"
            required
            className={errors.class ? 'error' : ''}
          />
          {errors.class && <div className="error-message">{errors.class}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="gender">{t.gender} *</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className={errors.gender ? 'error' : ''}
          >
            <option value="">{language === 'english' ? 'Select Gender' : 'लिंग निवडा'}</option>
            <option value="male">{t.male}</option>
            <option value="female">{t.female}</option>
          </select>
          {errors.gender && <div className="error-message">{errors.gender}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="caste">{t.caste} *</label>
          <input
            type="text"
            id="caste"
            name="caste"
            value={formData.caste}
            onChange={handleChange}
            required
            className={errors.caste ? 'error' : ''}
          />
          {errors.caste && <div className="error-message">{errors.caste}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dob">{t.dob} *</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className={errors.dob ? 'error' : ''}
          />
          {errors.dob && <div className="error-message">{errors.dob}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="registrationNumber">{t.registrationNumber} *</label>
          <input
            type="text"
            id="registrationNumber"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            required
            className={errors.registrationNumber ? 'error' : ''}
          />
          {errors.registrationNumber && <div className="error-message">{errors.registrationNumber}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fatherName">{t.fatherName} *</label>
          <input
            type="text"
            id="fatherName"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            required
            className={errors.fatherName ? 'error' : ''}
          />
          {errors.fatherName && <div className="error-message">{errors.fatherName}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="motherName">{t.motherName} *</label>
          <input
            type="text"
            id="motherName"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            required
            className={errors.motherName ? 'error' : ''}
          />
          {errors.motherName && <div className="error-message">{errors.motherName}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="motherTongue">{t.motherTongue} *</label>
          <input
            type="text"
            id="motherTongue"
            name="motherTongue"
            value={formData.motherTongue}
            onChange={handleChange}
            required
            className={errors.motherTongue ? 'error' : ''}
          />
          {errors.motherTongue && <div className="error-message">{errors.motherTongue}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="medium">{t.medium} *</label>
          <select
            id="medium"
            name="medium"
            value={formData.medium}
            onChange={handleChange}
            required
            className={errors.medium ? 'error' : ''}
          >
            <option value="">{language === 'english' ? 'Select Medium' : 'माध्यम निवडा'}</option>
            <option value="marathi">{t.marathi}</option>
            <option value="english">{t.english}</option>
          </select>
          {errors.medium && <div className="error-message">{errors.medium}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="schoolName">{t.schoolName}</label>
          <input
            type="text"
            id="schoolName"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phoneNumber">{t.phoneNumber} *</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className={errors.phoneNumber ? 'error' : ''}
          />
          {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="address">{t.address} *</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          required
          className={errors.address ? 'error' : ''}
        ></textarea>
        {errors.address && <div className="error-message">{errors.address}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="height">{t.height} *</label>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            min="0"
            required
            className={errors.height ? 'error' : ''}
          />
          {errors.height && <div className="error-message">{errors.height}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="weight">{t.weight} *</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="0"
            required
            className={errors.weight ? 'error' : ''}
          />
          {errors.weight && <div className="error-message">{errors.weight}</div>}
        </div>
      </div>

      <div className="form-group">
        <button type="submit" className="primary">{t.submit}</button>
        <button type="button" onClick={handleReset} style={{ marginLeft: '10px' }}>{t.reset}</button>
        {isEditing && (
          <button type="button" onClick={handleCancel} style={{ marginLeft: '10px' }} className="secondary">
            {t.cancel}
          </button>
        )}
      </div>
    </form>
  );
};

export default StudentProfileForm;