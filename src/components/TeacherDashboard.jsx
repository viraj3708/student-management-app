import React, { useState } from 'react';
import { getAllStudents, deleteStudentById, saveStudentProfile } from '../utils/dataManager';
import StudentProfileForm from './StudentProfileForm';

const TeacherDashboard = ({ language }) => {
  const [activeDashboardTab, setActiveDashboardTab] = useState('school'); // 'school', 'classes', 'subjects', 'students', 'delete'
  const [schoolName, setSchoolName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ type: '', id: null, name: '' });
  const [editingStudent, setEditingStudent] = useState(null);
  const [showStudentForm, setShowStudentForm] = useState(false);
  
  // State for subject management
  const [selectedClass, setSelectedClass] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [selectedClassForRemoval, setSelectedClassForRemoval] = useState('');
  const [selectedSubjectForRemoval, setSelectedSubjectForRemoval] = useState('');

  // Language translations
  const translations = {
    english: {
      schoolInfo: "School Information",
      classManagement: "Class Management",
      subjectManagement: "Subject Management",
      studentManagement: "Student Management",
      deleteEntries: "Delete Entries",
      enterSchoolName: "Enter School Name",
      save: "Save",
      totalStudents: "Total Students",
      classDistribution: "Class Distribution",
      recentActivity: "Recent Activity",
      confirmDelete: "Are you sure you want to delete this",
      confirmDeleteStudent: "Are you sure you want to delete student",
      yes: "Yes",
      no: "No",
      studentDeleted: "Student deleted successfully!",
      errorDeleting: "Error deleting. Please try again.",
      errorSaving: "Error saving. Please try again.",
      schoolNameSaved: "School name saved successfully!",
      noRecentActivity: "No recent activity",
      deleteStudent: "Delete Student",
      students: "Students",
      noStudents: "No students found",
      addSubject: "Add Subject",
      removeSubject: "Remove Subject",
      selectClass: "Select Class",
      selectSubject: "Select Subject",
      enterSubject: "Enter Subject Name",
      subjectAdded: "Subject added successfully!",
      subjectRemoved: "Subject removed successfully!",
      errorAddingSubject: "Error adding subject. Please try again.",
      errorRemovingSubject: "Error removing subject. Please try again.",
      class: "Class",
      subject: "Subject",
      add: "Add",
      remove: "Remove",
      noSubjects: "No subjects found",
      viewProfile: "View Profile",
      editProfile: "Edit Profile",
      updateProfile: "Update Profile",
      cancel: "Cancel",
      studentUpdated: "Student profile updated successfully!",
      errorUpdating: "Error updating student profile. Please try again."
    },
    marathi: {
      schoolInfo: "शाळेची माहिती",
      classManagement: "वर्ग व्यवस्थापन",
      subjectManagement: "विषय व्यवस्थापन",
      studentManagement: "विद्यार्थी व्यवस्थापन",
      deleteEntries: "नोंदी हटवा",
      enterSchoolName: "शाळेचे नाव प्रविष्ट करा",
      save: "जतन करा",
      totalStudents: "एकूण विद्यार्थी",
      classDistribution: "वर्ग वितरण",
      recentActivity: "अलीकडील क्रियाकलाप",
      confirmDelete: "तुम्हाला खात्री आहे की तुम्ही हे हटवू इच्छिता",
      confirmDeleteStudent: "तुम्हाला खात्री आहे की तुम्ही विद्यार्थी हटवू इच्छिता",
      yes: "होय",
      no: "नाही",
      studentDeleted: "विद्यार्थी यशस्वीरित्या हटवला गेला!",
      errorDeleting: "हटवताना त्रुटी. कृपया पुन्हा प्रयत्न करा.",
      errorSaving: "जतन करताना त्रुटी. कृपया पुन्हा प्रयत्न करा.",
      schoolNameSaved: "शाळेचे नाव यशस्वीरित्या जतन केले!",
      noRecentActivity: "अलीकडील क्रियाकलाप नाही",
      deleteStudent: "विद्यार्थी हटवा",
      students: "विद्यार्थी",
      noStudents: "विद्यार्थी आढळले नाहीत",
      addSubject: "विषय जोडा",
      removeSubject: "विषय काढा",
      selectClass: "वर्ग निवडा",
      selectSubject: "विषय निवडा",
      enterSubject: "विषयाचे नाव प्रविष्ट करा",
      subjectAdded: "विषय यशस्वीरित्या जोडला गेला!",
      subjectRemoved: "विषय यशस्वीरित्या काढला गेला!",
      errorAddingSubject: "विषय जोडताना त्रुटी. कृपया पुन्हा प्रयत्न करा.",
      errorRemovingSubject: "विषय काढताना त्रुटी. कृपया पुन्हा प्रयत्न करा.",
      class: "वर्ग",
      subject: "विषय",
      add: "जोडा",
      remove: "काढा",
      noSubjects: "विषय आढळले नाहीत",
      viewProfile: "प्रोफाइल पहा",
      editProfile: "प्रोफाइल संपादित करा",
      updateProfile: "प्रोफाइल अपडेट करा",
      cancel: "रद्द करा",
      studentUpdated: "विद्यार्थी प्रोफाइल यशस्वीरित्या अपडेट केला!",
      errorUpdating: "विद्यार्थी प्रोफाइल अपडेट करताना त्रुटी. कृपया पुन्हा प्रयत्न करा."
    }
  };

  const t = translations[language];

  // Get all students with error handling
  let students = [];
  try {
    students = getAllStudents();
  } catch (error) {
    console.error('Error getting students:', error);
    students = [];
  }
  
  // Count students by class
  const getClassDistribution = () => {
    try {
      const distribution = {};
      students.forEach(student => {
        if (distribution[student.class]) {
          distribution[student.class]++;
        } else {
          distribution[student.class] = 1;
        }
      });
      return distribution;
    } catch (error) {
      console.error('Error getting class distribution:', error);
      return {};
    }
  };

  const classDistribution = getClassDistribution();

  // Get unique classes
  const getUniqueClasses = () => {
    try {
      const classes = [...new Set(students.map(student => student.class))];
      return classes.sort((a, b) => a - b);
    } catch (error) {
      console.error('Error getting unique classes:', error);
      return [];
    }
  };

  const uniqueClasses = getUniqueClasses();
  
  // Generate class options from 1 to 10
  const getAllClassOptions = () => {
    return Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  };

  const allClassOptions = getAllClassOptions();

  // Get school name from first student (if available)
  const getStoredSchoolName = () => {
    try {
      if (students.length > 0) {
        return students[0].schoolName || '';
      }
      return '';
    } catch (error) {
      console.error('Error getting stored school name:', error);
      return '';
    }
  };

  // Initialize school name using useEffect
  React.useEffect(() => {
    if (!schoolName) {
      try {
        setSchoolName(getStoredSchoolName());
      } catch (error) {
        console.error('Error initializing school name:', error);
      }
    }
  }, [schoolName]);

  // Get subjects for a specific class
  const getSubjectsForClass = (className) => {
    try {
      const studentsInClass = students.filter(student => student.class === className);
      const allSubjects = [];
      
      studentsInClass.forEach(student => {
        if (student.subjects) {
          student.subjects.forEach(subject => {
            // Check if subject is an object with name property or a string
            const subjectName = typeof subject === 'string' ? subject : (subject && subject.name ? subject.name : '');
            if (subjectName && !allSubjects.includes(subjectName)) {
              allSubjects.push(subjectName);
            }
          });
        }
      });
      
      return allSubjects;
    } catch (error) {
      console.error('Error getting subjects for class:', error);
      return [];
    }
  };

  // Get unique classes that have subjects
  const getClassesWithSubjects = () => {
    try {
      const classesWithSubjects = new Set();
      
      // Iterate through all students to find classes with subjects
      students.forEach(student => {
        if (student.subjects && student.subjects.length > 0) {
          classesWithSubjects.add(student.class);
        }
      });
      
      // Convert to array and sort
      return Array.from(classesWithSubjects).sort((a, b) => a - b);
    } catch (error) {
      console.error('Error getting classes with subjects:', error);
      return [];
    }
  };

  const classesWithSubjects = getClassesWithSubjects();

  const handleSaveSchoolName = () => {
    if (!schoolName.trim()) {
      setMessage(language === 'english' ? 'Please enter a school name' : 'कृपया शाळेचे नाव प्रविष्ट करा');
      setMessageType('error');
      return;
    }

    try {
      // Save school name to all students or create a dummy student if none exist
      let success = true;
      let errorMessage = '';
      
      if (students.length > 0) {
        students.forEach(student => {
          const updatedStudent = {
            ...student,
            schoolName: schoolName
          };
          const result = saveStudentProfile(updatedStudent);
          if (!result.success) {
            success = false;
            errorMessage = result.error;
          }
        });
      } else {
        // Create a dummy student to store school name
        const dummyStudent = {
          id: Date.now(),
          studentName: 'School Information',
          class: '1',
          schoolName: schoolName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const result = saveStudentProfile(dummyStudent);
        if (!result.success) {
          success = false;
          errorMessage = result.error;
        }
      }
      
      if (success) {
        setMessage(t.schoolNameSaved);
        setMessageType('success');
      } else {
        setMessage(errorMessage || t.errorSaving);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(t.errorSaving);
      setMessageType('error');
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleAddSubject = () => {
    if (!selectedClass || !newSubject.trim()) {
      setMessage(language === 'english' ? 'Please select a class and enter a subject name' : 'कृपया वर्ग निवडा आणि विषयाचे नाव प्रविष्ट करा');
      setMessageType('error');
      return;
    }

    try {
      let success = true;
      let errorMessage = '';
      
      // Add subject to a student in that class
      const studentsInClass = students.filter(student => student.class === selectedClass);
      
      if (studentsInClass.length > 0) {
        // Add subject to the first student in the class
        const student = studentsInClass[0];
        // Create subject object with name and empty marks
        const newSubjectObj = { name: newSubject, marks: '' };
        const updatedSubjects = student.subjects ? [...student.subjects, newSubjectObj] : [newSubjectObj];
        const updatedStudent = {
          ...student,
          subjects: updatedSubjects
        };
        
        const result = saveStudentProfile(updatedStudent);
        if (!result.success) {
          success = false;
          errorMessage = result.error;
        }
      } else {
        // If no students exist in this class, create a dummy student
        const dummyStudent = {
          id: Date.now(),
          studentName: `Class ${selectedClass} Sample Student`,
          class: selectedClass,
          schoolName: schoolName,
          subjects: [{ name: newSubject, marks: '' }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const result = saveStudentProfile(dummyStudent);
        if (!result.success) {
          success = false;
          errorMessage = result.error;
        }
      }
      
      if (success) {
        setMessage(t.subjectAdded);
        setMessageType('success');
        setNewSubject(''); // Clear the subject input
      } else {
        setMessage(errorMessage || t.errorAddingSubject);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(t.errorAddingSubject);
      setMessageType('error');
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleRemoveSubject = () => {
    if (!selectedClassForRemoval || !selectedSubjectForRemoval) {
      setMessage(language === 'english' ? 'Please select a class and subject to remove' : 'कृपया काढण्यासाठी वर्ग आणि विषय निवडा');
      setMessageType('error');
      return;
    }

    try {
      let success = true;
      let errorMessage = '';
      
      // Remove subject from all students in that class
      const studentsInClass = students.filter(student => student.class === selectedClassForRemoval);
      
      studentsInClass.forEach(student => {
        if (student.subjects) {
          // Filter out the subject by name
          const updatedSubjects = student.subjects.filter(subject => {
            // Handle both string and object formats
            const subjectName = typeof subject === 'string' ? subject : (subject && subject.name ? subject.name : '');
            return subjectName !== selectedSubjectForRemoval;
          });
          const updatedStudent = {
            ...student,
            subjects: updatedSubjects
          };
          
          const result = saveStudentProfile(updatedStudent);
          if (!result.success) {
            success = false;
            errorMessage = result.error;
          }
        }
      });
      
      if (success) {
        setMessage(t.subjectRemoved);
        setMessageType('success');
        setSelectedSubjectForRemoval(''); // Clear the subject selection
      } else {
        setMessage(errorMessage || t.errorRemovingSubject);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(t.errorRemovingSubject);
      setMessageType('error');
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleDeleteStudent = (studentId, studentName) => {
    setShowDeleteConfirm({
      type: 'student',
      id: studentId,
      name: studentName
    });
  };

  const confirmDelete = () => {
    try {
      if (showDeleteConfirm.type === 'student') {
        const result = deleteStudentById(showDeleteConfirm.id);
        if (result.success) {
          setMessage(t.studentDeleted);
          setMessageType('success');
        } else {
          setMessage(result.error || t.errorDeleting);
          setMessageType('error');
        }
      }
    } catch (error) {
      setMessage(t.errorDeleting);
      setMessageType('error');
    }

    // Clear confirmation and message after 3 seconds
    setTimeout(() => {
      setShowDeleteConfirm({ type: '', id: null, name: '' });
      setMessage('');
    }, 3000);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm({ type: '', id: null, name: '' });
  };

  // Handle editing a student profile
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowStudentForm(true);
  };

  // Handle viewing a student profile (read-only)
  const handleViewStudent = (student) => {
    setEditingStudent(student);
    setShowStudentForm(true);
  };

  // Handle saving updated student profile
  const handleSaveUpdatedStudent = (updatedData) => {
    try {
      // Merge the existing student data with updated data
      const updatedStudent = {
        ...editingStudent,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      
      const result = saveStudentProfile(updatedStudent);
      
      if (result.success) {
        setMessage(t.studentUpdated);
        setMessageType('success');
        setShowStudentForm(false);
        setEditingStudent(null);
      } else {
        setMessage(result.error || t.errorUpdating);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(t.errorUpdating);
      setMessageType('error');
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  // Handle canceling student edit
  const handleCancelEdit = () => {
    setShowStudentForm(false);
    setEditingStudent(null);
  };

  return (
    <div className="teacher-dashboard">
      {/* Display messages */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm.type && (
        <div className="confirm-clear">
          <p>
            {showDeleteConfirm.type === 'student' 
              ? `${t.confirmDeleteStudent} ${showDeleteConfirm.name}?` 
              : `${t.confirmDelete} ${showDeleteConfirm.name}?`}
          </p>
          <button className="danger" onClick={confirmDelete}>{t.yes}</button>
          <button className="secondary" onClick={cancelDelete}>{t.no}</button>
        </div>
      )}
      
      {/* Student Profile Form Modal */}
      {showStudentForm && editingStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingStudent.id ? t.editProfile : t.viewProfile}</h3>
            <StudentProfileForm 
              language={language} 
              initialData={editingStudent} 
              onSave={handleSaveUpdatedStudent} 
              onCancel={handleCancelEdit}
              isEditing={true}
            />
            <button className="secondary" onClick={handleCancelEdit} style={{ marginTop: '10px' }}>
              {t.cancel}
            </button>
          </div>
        </div>
      )}
      
      {/* Dashboard Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={activeDashboardTab === 'school' ? 'active' : ''} 
          onClick={() => setActiveDashboardTab('school')}
        >
          {t.schoolInfo}
        </button>
        <button 
          className={activeDashboardTab === 'classes' ? 'active' : ''} 
          onClick={() => setActiveDashboardTab('classes')}
        >
          {t.classManagement}
        </button>
        <button 
          className={activeDashboardTab === 'subjects' ? 'active' : ''} 
          onClick={() => setActiveDashboardTab('subjects')}
        >
          {t.subjectManagement}
        </button>
        <button 
          className={activeDashboardTab === 'students' ? 'active' : ''} 
          onClick={() => setActiveDashboardTab('students')}
        >
          {t.studentManagement}
        </button>
        <button 
          className={activeDashboardTab === 'delete' ? 'active' : ''} 
          onClick={() => setActiveDashboardTab('delete')}
        >
          {t.deleteEntries}
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="dashboard-tab-content">
        {/* School Information Tab */}
        {activeDashboardTab === 'school' && (
          <div className="school-info-tab">
            <h3>{t.schoolInfo}</h3>
            
            {/* Enter School Name */}
            <div className="school-name-section">
              <h4>{t.enterSchoolName}</h4>
              <div className="form-group">
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder={t.enterSchoolName}
                  className="login-input"
                />
                <button className="primary" onClick={handleSaveSchoolName} style={{ marginTop: '10px' }}>
                  {t.save}
                </button>
              </div>
            </div>
            
            {/* Total Students */}
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>{t.totalStudents}</h3>
                <p className="stat-number">{students.length}</p>
              </div>
            </div>
            
            {/* Class Distribution */}
            <div className="class-distribution-section">
              <h4>{t.classDistribution}</h4>
              <div className="class-list-container">
                <div className="class-list">
                  {allClassOptions.map((className, index) => (
                    <div key={index} className="class-item">
                      <span className="class-name">
                        {language === 'english' ? 'Class' : 'वर्ग'} {className}
                      </span>
                      <span className="student-count">
                        ({classDistribution[className] || 0} {language === 'english' ? 'students' : 'विद्यार्थी'})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Class Management Tab */}
        {activeDashboardTab === 'classes' && (
          <div className="class-management-tab">
            <h3>{t.classManagement}</h3>
            <div className="class-list-container">
              <div className="class-list">
                {allClassOptions.map((className, index) => (
                  <div key={index} className="class-item">
                    <span className="class-name">
                      {language === 'english' ? 'Class' : 'वर्ग'} {className}
                    </span>
                    <span className="student-count">
                      ({classDistribution[className] || 0} {language === 'english' ? 'students' : 'विद्यार्थी'})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Subject Management Tab */}
        {activeDashboardTab === 'subjects' && (
          <div className="subject-management-tab">
            <h3>{t.subjectManagement}</h3>
            
            {/* Add Subject Section */}
            <div className="add-subject-section">
              <h4>{t.addSubject}</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="classSelect">{t.selectClass} *</label>
                  <select
                    id="classSelect"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="login-input"
                  >
                    <option value="">{t.selectClass}</option>
                    {allClassOptions.map((className, index) => (
                      <option key={index} value={className}>
                        {language === 'english' ? 'Class' : 'वर्ग'} {className}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subjectInput">{t.enterSubject} *</label>
                  <input
                    type="text"
                    id="subjectInput"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder={t.enterSubject}
                    className="login-input"
                  />
                </div>
              </div>
              <button className="primary" onClick={handleAddSubject}>
                {t.add}
              </button>
            </div>
            
            {/* Remove Subject Section */}
            <div className="remove-subject-section">
              <h4>{t.removeSubject}</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="classRemoveSelect">{t.selectClass} *</label>
                  <select
                    id="classRemoveSelect"
                    value={selectedClassForRemoval}
                    onChange={(e) => {
                      setSelectedClassForRemoval(e.target.value);
                      setSelectedSubjectForRemoval(''); // Reset subject selection when class changes
                    }}
                    className="login-input"
                  >
                    <option value="">{t.selectClass}</option>
                    {allClassOptions.map((className, index) => (
                      <option key={index} value={className}>
                        {language === 'english' ? 'Class' : 'वर्ग'} {className}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subjectRemoveSelect">{t.subject} *</label>
                  <select
                    id="subjectRemoveSelect"
                    value={selectedSubjectForRemoval}
                    onChange={(e) => setSelectedSubjectForRemoval(e.target.value)}
                    className="login-input"
                    disabled={!selectedClassForRemoval}
                  >
                    <option value="">{t.selectSubject}</option>
                    {selectedClassForRemoval && getSubjectsForClass(selectedClassForRemoval).map((subject, index) => (
                      <option key={index} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button 
                className="danger" 
                onClick={handleRemoveSubject}
                disabled={!selectedClassForRemoval || !selectedSubjectForRemoval}
              >
                {t.remove}
              </button>
            </div>
            
            {/* Subject List by Class - Only show classes that have subjects */}
            <div className="subject-list-container">
              <h4>{language === 'english' ? 'Subjects by Class' : 'वर्गानुसार विषय'}</h4>
              <div className="subject-list">
                {classesWithSubjects.length > 0 ? (
                  classesWithSubjects.map((className, index) => {
                    const classSubjects = getSubjectsForClass(className);
                    
                    return (
                      <div key={index} className="class-subjects">
                        <h5>{language === 'english' ? 'Class' : 'वर्ग'} {className}</h5>
                        {classSubjects.length > 0 ? (
                          <ul>
                            {classSubjects.map((subject, subIndex) => (
                              <li key={subIndex}>{subject}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{t.noSubjects}</p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p>{t.noSubjects}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Student Management Tab */}
        {activeDashboardTab === 'students' && (
          <div className="student-management-tab">
            <h3>{t.studentManagement}</h3>
            
            {/* Student List */}
            <div className="student-list-container">
              <h4>{t.students}</h4>
              {students.length > 0 ? (
                <div className="student-list">
                  {students.map((student, index) => (
                    <div key={index} className="student-item">
                      <div className="student-info">
                        <span className="student-name">
                          {student.studentName} ({language === 'english' ? 'Class' : 'वर्ग'} {student.class})
                        </span>
                        <span className="student-reg">
                          {language === 'english' ? 'Reg No' : 'नोंदणी क्रमांक'}: {student.registrationNumber}
                        </span>
                      </div>
                      <div className="student-actions">
                        <button 
                          className="secondary small" 
                          onClick={() => handleViewStudent(student)}
                        >
                          {t.viewProfile}
                        </button>
                        <button 
                          className="primary small" 
                          onClick={() => handleEditStudent(student)}
                          style={{ marginLeft: '5px' }}
                        >
                          {t.editProfile}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{t.noStudents}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Delete Entries Tab */}
        {activeDashboardTab === 'delete' && (
          <div className="delete-management-tab">
            <h3>{t.deleteEntries}</h3>
            
            {/* Delete Students Section */}
            <div className="delete-section">
              <h4>{t.deleteStudent} ({t.students})</h4>
              <div className="student-list-container">
                {students.length > 0 ? (
                  <div className="student-list">
                    {students.map((student, index) => (
                      <div key={index} className="student-item">
                        <span className="student-name">
                          {student.studentName} ({language === 'english' ? 'Class' : 'वर्ग'} {student.class})
                        </span>
                        <button 
                          className="danger small" 
                          onClick={() => handleDeleteStudent(student.id, student.studentName)}
                        >
                          {language === 'english' ? 'Delete' : 'हटवा'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{t.noStudents}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;


