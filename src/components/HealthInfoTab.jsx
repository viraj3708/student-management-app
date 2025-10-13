import { useState, useEffect } from 'react';
import { getAllStudents, saveStudentProfile } from '../utils/dataManager';

const HealthInfoTab = ({ language }) => {
  const [allStudents, setAllStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [classStudents, setClassStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ height: '', weight: '', healthNotes: '' });

  // Load all students from localStorage
  useEffect(() => {
    const studentsData = getAllStudents();
    setAllStudents(studentsData);
  }, []);

  // Update class students when selected class changes
  useEffect(() => {
    if (selectedClass) {
      const filteredStudents = allStudents.filter(student => student.class === selectedClass);
      // Map students to include health info (height, weight, healthNotes)
      const studentsWithHealthInfo = filteredStudents.map(student => ({
        id: student.id,
        name: student.studentName,
        class: student.class,
        height: student.height || '',
        weight: student.weight || '',
        healthNotes: student.healthNotes || ''
      }));
      setClassStudents(studentsWithHealthInfo);
    } else {
      setClassStudents([]);
    }
  }, [selectedClass, allStudents]);

  // Language translations
  const translations = {
    english: {
      selectClass: "Select Class",
      studentName: "Student Name",
      className: "Class",
      height: "Height (cm)",
      weight: "Weight (kg)",
      bmi: "BMI",
      healthNotes: "Health Notes",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
      updateHealthInfo: "Update Health Information",
      noData: "No student data available. Add students in the Student Profile section.",
      noStudentsInClass: "No students found in this class.",
      healthInfoSaved: "Health information saved successfully!",
      errorSaving: "Error saving health information. Please try again."
    },
    marathi: {
      selectClass: "वर्ग निवडा",
      studentName: "विद्यार्थी नाव",
      className: "वर्ग",
      height: "उंची (सेमी)",
      weight: "वजन (किलो)",
      bmi: "BMI",
      healthNotes: "आरोग्य टिपा",
      edit: "संपादित करा",
      save: "सेव्ह करा",
      cancel: "रद्द करा",
      updateHealthInfo: "आरोग्य माहिती अपडेट करा",
      noData: "विद्यार्थी डेटा उपलब्ध नाही. विद्यार्थी प्रोफाइल विभागात विद्यार्थी जोडा.",
      noStudentsInClass: "या वर्गात विद्यार्थी आढळले नाहीत.",
      healthInfoSaved: "आरोग्य माहिती यशस्वीरित्या सेव्ह केली!",
      errorSaving: "आरोग्य माहिती सेव्ह करताना त्रुटी. कृपया पुन्हा प्रयत्न करा."
    }
  };

  const t = translations[language];
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Generate class options from 1 to 10
  const getClassOptions = () => {
    return Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  };

  // Handle class selection change
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setEditingStudent(null); // Reset editing when class changes
    setMessage(''); // Clear any messages
  };

  // Calculate BMI
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return 'N/A';
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // Handle edit button click
  const handleEdit = (student) => {
    setEditingStudent(student.id);
    setEditForm({
      height: student.height,
      weight: student.weight,
      healthNotes: student.healthNotes
    });
    setMessage(''); // Clear any messages
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save button click
  const handleSave = () => {
    // Update classStudents array with edited data
    const updatedClassStudents = classStudents.map(student => 
      student.id === editingStudent 
        ? { ...student, ...editForm } 
        : student
    );
    setClassStudents(updatedClassStudents);

    // Find the original student data from allStudents
    const originalStudent = allStudents.find(s => s.id === editingStudent);
    
    if (originalStudent) {
      // Update the student's health information
      const updatedStudentData = {
        ...originalStudent,
        height: editForm.height,
        weight: editForm.weight,
        healthNotes: editForm.healthNotes
      };

      // Save to localStorage
      const success = saveStudentProfile(updatedStudentData);
      
      if (success) {
        setMessage(t.healthInfoSaved);
        setMessageType('success');
        
        // Update allStudents state to reflect the changes
        const updatedAllStudents = allStudents.map(student => 
          student.id === editingStudent ? updatedStudentData : student
        );
        setAllStudents(updatedAllStudents);
      } else {
        setMessage(t.errorSaving);
        setMessageType('error');
      }
    } else {
      setMessage(t.errorSaving);
      setMessageType('error');
    }

    // Close the edit mode
    setEditingStudent(null);
  };

  // Handle cancel button click
  const handleCancel = () => {
    setEditingStudent(null);
    setMessage(''); // Clear any messages
  };

  return (
    <div>
      {/* Display success/error messages */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {/* Class Selection */}
      <div className="form-group">
        <label htmlFor="classSelect">{t.selectClass}:</label>
        <select
          id="classSelect"
          value={selectedClass}
          onChange={handleClassChange}
          className="class-select"
          style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
        >
          <option value="">{t.selectClass}</option>
          {getClassOptions().map(cls => (
            <option key={cls} value={cls}>
              {t.className} {cls}
            </option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      {selectedClass && (
        <div>
          {classStudents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic', color: '#666' }}>
              {t.noStudentsInClass}
            </div>
          ) : (
            <table className="health-info-table">
              <thead>
                <tr>
                  <th>{t.studentName}</th>
                  <th>{t.className}</th>
                  <th>{t.height}</th>
                  <th>{t.weight}</th>
                  <th>{t.bmi}</th>
                  <th>{t.healthNotes}</th>
                  <th>{t.edit}</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.class}</td>
                    <td>
                      {editingStudent === student.id ? (
                        <input
                          type="number"
                          name="height"
                          value={editForm.height}
                          onChange={handleInputChange}
                          min="0"
                        />
                      ) : (
                        student.height || 'N/A'
                      )}
                    </td>
                    <td>
                      {editingStudent === student.id ? (
                        <input
                          type="number"
                          name="weight"
                          value={editForm.weight}
                          onChange={handleInputChange}
                          min="0"
                        />
                      ) : (
                        student.weight || 'N/A'
                      )}
                    </td>
                    <td>
                      {editingStudent === student.id 
                        ? calculateBMI(editForm.height, editForm.weight)
                        : calculateBMI(student.height, student.weight)}
                    </td>
                    <td>
                      {editingStudent === student.id ? (
                        <textarea
                          name="healthNotes"
                          value={editForm.healthNotes}
                          onChange={handleInputChange}
                          rows="2"
                          placeholder={t.healthNotes}
                        />
                      ) : (
                        student.healthNotes || 'N/A'
                      )}
                    </td>
                    <td>
                      {editingStudent === student.id ? (
                        <>
                          <button className="primary" onClick={handleSave} style={{ marginRight: '5px' }}>
                            {t.save}
                          </button>
                          <button onClick={handleCancel}>{t.cancel}</button>
                        </>
                      ) : (
                        <button onClick={() => handleEdit(student)}>{t.edit}</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {editingStudent && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h3>{t.updateHealthInfo}</h3>
          <p>
            {language === 'english' 
              ? 'Editing health information for selected student. Click Save to update or Cancel to discard changes.' 
              : 'निवडलेल्या विद्यार्थ्यासाठी आरोग्य माहिती संपादित करत आहे. अपडेट करण्यासाठी सेव्ह करा किंवा बदल रद्द करण्यासाठी रद्द करा क्लिक करा.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default HealthInfoTab;