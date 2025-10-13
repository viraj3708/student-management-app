import { useState, useEffect } from 'react';
import { getAllStudents, getMarksData, saveMarksData } from '../utils/dataManager';

const MarksEntryModule = ({ language }) => {
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(''); // Added class selection
  const [allStudents, setAllStudents] = useState([]); // All students from storage
  const [classStudents, setClassStudents] = useState([]); // Students in selected class
  const [students, setStudents] = useState([]); // Students for marks entry
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [outOfMarks, setOutOfMarks] = useState({}); // Track "out of" marks per subject

  // Load students on component mount
  useEffect(() => {
    const studentsData = getAllStudents();
    setAllStudents(studentsData);
  }, []);

  // Update class students when selected class changes
  useEffect(() => {
    if (selectedClass) {
      const filteredStudents = allStudents.filter(student => student.class === selectedClass);
      setClassStudents(filteredStudents);
    } else {
      setClassStudents([]);
    }
  }, [selectedClass, allStudents]);

  // Language translations
  const translations = {
    english: {
      selectClass: "Select Class",
      selectTerm: "Select Term",
      term1: "Term 1",
      term2: "Term 2",
      studentName: "Student Name",
      subject: "Subject",
      marks: "Marks",
      outOf: "Out Of",
      grade: "Grade",
      saveMarks: "Save Marks",
      reset: "Reset",
      successMessage: "Marks saved successfully!",
      errorMessage: "Error saving marks. Please try again.",
      selectTermFirst: "Please select a term first!",
      selectClassFirst: "Please select a class first!",
      noStudentsInClass: "No students found in this class",
      noSubjectsInClass: "No subjects found for this class. Please add subjects in Subject Management section."
    },
    marathi: {
      selectClass: "वर्ग निवडा",
      selectTerm: "सत्र निवडा",
      term1: "सत्र 1",
      term2: "सत्र 2",
      studentName: "विद्यार्थी नाव",
      subject: "विषय",
      marks: "गुण",
      outOf: "एकूण",
      grade: "ग्रेड",
      saveMarks: "गुण सेव्ह करा",
      reset: "रीसेट करा",
      successMessage: "गुण यशस्वीरित्या सेव्ह केले!",
      errorMessage: "गुण सेव्ह करताना त्रुटी. कृपया पुन्हा प्रयत्न करा.",
      selectTermFirst: "कृपया प्रथम सत्र निवडा!",
      selectClassFirst: "कृपया प्रथम वर्ग निवडा!",
      noStudentsInClass: "या वर्गात विद्यार्थी आढळले नाहीत",
      noSubjectsInClass: "या वर्गासाठी विषय आढळले नाहीत. कृपया विषय व्यवस्थापन विभागात विषय जोडा."
    }
  };

  const t = translations[language];

  // Term options
  const termOptions = [
    { value: 'term1', label: t.term1 },
    { value: 'term2', label: t.term2 }
  ];

  // Generate class options from 1 to 10
  const getClassOptions = () => {
    return Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  };

  // Grade calculation function
  const calculateGrade = (marks, outOf = 100) => {
    if (marks === '' || isNaN(marks)) return '';
    const mark = parseInt(marks);
    const percentage = (mark / outOf) * 100;
    
    if (percentage >= 91) return 'A1';
    if (percentage >= 81) return 'A2';
    if (percentage >= 71) return 'B1';
    if (percentage >= 60) return 'B2';
    if (percentage >= 51) return 'C1';
    if (percentage >= 41) return 'C2';
    if (percentage >= 31) return 'D1';
    if (percentage <= 30) return 'D2';
    
    return '';
  };

  // Get subjects for a specific class from existing students
  const getSubjectsForClass = (className) => {
    try {
      // Find students in this class
      const studentsInClass = allStudents.filter(student => student.class === className);
      
      // Get all unique subjects from students in this class
      const allSubjects = new Set();
      
      studentsInClass.forEach(student => {
        if (student.subjects && Array.isArray(student.subjects)) {
          student.subjects.forEach(subject => {
            // Handle both string and object formats for backward compatibility
            const subjectName = typeof subject === 'string' ? subject : (subject && subject.name ? subject.name : null);
            if (subjectName) {
              allSubjects.add(subjectName);
            }
          });
        }
      });
      
      return Array.from(allSubjects);
    } catch (error) {
      console.error('Error getting subjects for class:', error);
      return [];
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    
    // Reset students and term when class changes
    setStudents([]);
    setSelectedTerm('');
    setMessage(''); // Clear any messages
  };

  const handleTermChange = (e) => {
    setSelectedTerm(e.target.value);
    setMessage(''); // Clear any messages
  };

  const handleMarksChange = (studentId, subjectIndex, value) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedSubjects = [...student.subjects];
        updatedSubjects[subjectIndex] = { ...updatedSubjects[subjectIndex], marks: value };
        return { ...student, subjects: updatedSubjects };
      }
      return student;
    }));
  };

  // Handle "Out of" marks change
  const handleOutOfChange = (subjectName, value) => {
    const numValue = value === '' ? '' : parseInt(value) || 100;
    setOutOfMarks(prev => ({
      ...prev,
      [subjectName]: numValue
    }));
  };

  const handleSave = () => {
    if (!selectedClass) {
      setMessage(t.selectClassFirst);
      setMessageType('error');
      return;
    }
    
    if (!selectedTerm) {
      setMessage(t.selectTermFirst);
      setMessageType('error');
      return;
    }
    
    // Get existing marks data
    const existingMarksData = getMarksData();
    
    // Prepare marks data for saving, preserving existing data for other terms
    const marksToSave = {};
    students.forEach(student => {
      // Initialize student entry if it doesn't exist
      marksToSave[student.id] = marksToSave[student.id] || {};
      
      // Preserve existing data for other terms
      Object.keys(existingMarksData[student.id] || {}).forEach(term => {
        if (term !== selectedTerm) {
          marksToSave[student.id][term] = existingMarksData[student.id][term];
        }
      });
      
      // Add or update marks for the selected term
      const studentMarks = {};
      student.subjects.forEach(subject => {
        const subjectName = typeof subject === 'string' ? subject : (subject && subject.name ? subject.name : '');
        if (subjectName) {
          studentMarks[subjectName] = subject.marks || '';
        }
      });
      marksToSave[student.id][selectedTerm] = studentMarks;
    });
    
    // Save to localStorage
    const result = saveMarksData(marksToSave);
    
    if (result.success) {
      setMessage(t.successMessage);
      setMessageType('success');
    } else {
      setMessage(result.error || t.errorMessage);
      setMessageType('error');
    }
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const handleReset = () => {
    setStudents([]);
    setSelectedTerm('');
    setSelectedClass('');
    setOutOfMarks({});
    setMessage('');
  };

  // Update students when class or term changes
  useEffect(() => {
    if (selectedClass && selectedTerm) {
      // Get students in selected class
      const studentsInClass = allStudents.filter(student => student.class === selectedClass);
      
      if (studentsInClass.length > 0) {
        // Get subjects for this class
        const classSubjects = getSubjectsForClass(selectedClass);
        
        if (classSubjects.length > 0) {
          // Initialize students with subjects for marks entry
          const initializedStudents = studentsInClass.map(student => {
            // Create subjects array with marks from saved data if available
            const subjectsWithMarks = classSubjects.map(subjectName => {
              // Get saved marks for this student, term, and subject
              const savedMarks = getMarksData();
              const studentMarks = savedMarks[student.id]?.[selectedTerm]?.[subjectName] || '';
              
              return {
                name: subjectName,
                marks: studentMarks
              };
            });
            
            return {
              ...student,
              subjects: subjectsWithMarks
            };
          });
          
          setStudents(initializedStudents);
        } else {
          // No subjects found for this class
          setStudents([]);
          setMessage(t.noSubjectsInClass);
          setMessageType('error');
        }
      } else {
        // No students found in this class
        setStudents([]);
      }
    } else {
      setStudents([]);
    }
  }, [selectedClass, selectedTerm, allStudents]);

  return (
    <div className="marks-entry-module">
      {/* Display messages */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="classSelect">{t.selectClass}:</label>
          <select
            id="classSelect"
            value={selectedClass}
            onChange={handleClassChange}
            className="class-select"
          >
            <option value="">{t.selectClass}</option>
            {getClassOptions().map(cls => (
              <option key={cls} value={cls}>
                {language === 'english' ? 'Class' : 'वर्ग'} {cls}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="termSelect">{t.selectTerm}:</label>
          <select
            id="termSelect"
            value={selectedTerm}
            onChange={handleTermChange}
            className="term-select"
            disabled={!selectedClass}
          >
            <option value="">{t.selectTerm}</option>
            {termOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedClass && selectedTerm && (
        <div>
          <h3>{t.selectTerm}: {termOptions.find(t => t.value === selectedTerm)?.label} | {t.selectClass}: {selectedClass}</h3>
          
          {classStudents.length > 0 ? (
            <table className="glossy-marks-table">
              <thead>
                <tr>
                  <th className="glossy-header">{t.studentName}</th>
                  {students[0]?.subjects.map((subject, index) => {
                    // Handle both string and object formats for subject names
                    const subjectName = typeof subject === 'string' ? subject : (subject && subject.name ? subject.name : `Subject ${index + 1}`);
                    return (
                      <th key={index} className="glossy-header subject-header">
                        <div className="subject-container">
                          <span className="subject-name">{subjectName}</span>
                          <div className="out-of-container">
                            <span className="out-of-label">{t.outOf}:</span>
                            <input
                              type="number"
                              min="1"
                              max="1000"
                              value={outOfMarks[subjectName] || 100}
                              onChange={(e) => handleOutOfChange(subjectName, e.target.value)}
                              className="out-of-input"
                            />
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id} className="glossy-row">
                    <td className="student-name-cell">{student.studentName}</td>
                    {student.subjects.map((subject, subjectIndex) => {
                      // Handle both string and object formats for subject names
                      const subjectName = typeof subject === 'string' ? subject : (subject && subject.name ? subject.name : `Subject ${subjectIndex + 1}`);
                      const outOfValue = outOfMarks[subjectName] || 100;
                      return (
                        <td key={subjectIndex} className="marks-cell">
                          <div className="marks-input-container">
                            <input
                              type="number"
                              min="0"
                              max={outOfValue}
                              value={subject.marks || ''}
                              onChange={(e) => handleMarksChange(student.id, subjectIndex, e.target.value)}
                              className="marks-input"
                            />
                            <strong className="grade-display">{calculateGrade(subject.marks, outOfValue)}</strong>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>{t.noStudentsInClass}</p>
          )}
          
          <div style={{ marginTop: '20px' }}>
            <button className="primary glossy-button" onClick={handleSave} disabled={classStudents.length === 0}>
              {t.saveMarks}
            </button>
            <button className="secondary glossy-button" onClick={handleReset} style={{ marginLeft: '10px' }}>
              {t.reset}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksEntryModule;