import { useState, useEffect } from 'react';
import { getAllStudents, getAttendanceData, getMarksData } from '../utils/dataManager';
import html2pdf from 'html2pdf.js';
import { sanitizeInput } from '../utils/validation';

const ResultsDisplay = ({ language }) => {
  const [activeTab, setActiveTab] = useState('individual'); // 'individual' or 'class'
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(''); // Added class selection
  const [classStudents, setClassStudents] = useState([]); // Students in selected class
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [marksData, setMarksData] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // Added search term state
  const [filteredStudents, setFilteredStudents] = useState([]); // Added filtered students state
  const [showResults, setShowResults] = useState(false); // Added show results state
  const [activeTermTab, setActiveTermTab] = useState('both'); // 'term1', 'term2', or 'both'
  const [classResultTerm, setClassResultTerm] = useState('both'); // Term selection for class results
  const [landscapeView, setLandscapeView] = useState(false); // Landscape view toggle
  const [resultDate, setResultDate] = useState(new Date().toISOString().split('T')[0]); // Manual date entry
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Added missing state for year

  // Language translations
  const translations = {
    english: {
      individualResult: "Individual Result",
      classResult: "Class Result",
      selectClass: "Select Class",
      selectStudent: "Select Student",
      selectYear: "Select Year",
      searchStudent: "Search Student",
      showResult: "Show Result",
      studentProfile: "Student Profile",
      academicDetails: "Academic Details",
      attendanceRecord: "Attendance Record",
      marksRecord: "Marks Record",
      personalInfo: "Personal Information",
      name: "Name",
      gender: "Gender",
      caste: "Caste",
      dob: "Date of Birth",
      registrationNo: "Registration No",
      fathersName: "Father's Name",
      mothersName: "Mother's Name",
      motherTongue: "Mother Tongue",
      medium: "Medium",
      address: "Address",
      phoneNumber: "Phone Number",
      physicalInfo: "Physical Information",
      height: "Height",
      weight: "Weight",
      schoolName: "School Name",
      class: "Class",
      noData: "No data available",
      subject: "Subject",
      marks: "Marks",
      grade: "Grade",
      present: "Present",
      absent: "Absent",
      total: "Total",
      percentage: "Percentage",
      month: "Month",
      status: "Status",
      days: "Days",
      searchPlaceholder: "Enter student name or registration number",
      noStudentsInClass: "No students found in this class",
      selectStudentFirst: "Please select a student first",
      studentName: "Student Name",
      overallPerformance: "Overall Performance",
      classAverage: "Class Average",
      healthInfo: "Health Information",
      bmi: "BMI",
      performanceSummary: "Performance Summary",
      term1: "Term 1",
      term2: "Term 2",
      bothTerms: "Both Terms",
      average: "Average",
      landscapeView: "Landscape View",
      toggleLandscape: "Toggle Landscape",
      downloadPDF: "Download PDF",
      generatingPDF: "Generating PDF...",
      pdfGenerated: "PDF Generated Successfully!",
      pdfError: "Error generating PDF",
      teacherName: "Teacher Name",
      headmasterName: "Principal/Headmaster Name",
      parentSignature: "Parent's Signature",
      date: "Date"
    },
    marathi: {
      individualResult: "वैयक्तिक निकाल",
      classResult: "वर्ग निकाल",
      selectClass: "वर्ग निवडा",
      selectStudent: "विद्यार्थी निवडा",
      selectYear: "वर्ष निवडा",
      searchStudent: "विद्यार्थी शोधा",
      showResult: "निकाल दाखवा",
      studentProfile: "विद्यार्थी प्रोफाइल",
      academicDetails: "शैक्षणिक तपशील",
      attendanceRecord: "उपस्थिती नोंद",
      marksRecord: "गुण नोंद",
      personalInfo: "वैयक्तिक माहिती",
      name: "नाव",
      gender: "लिंग",
      caste: "जात",
      dob: "जन्मतारीख",
      registrationNo: "नोंदणी क्रमांक",
      fathersName: "वडिलांचे नाव",
      mothersName: "आईचे नाव",
      motherTongue: "मातृभाषा",
      medium: "माध्यम",
      address: "पत्ऍता",
      phoneNumber: "फोन नंबर",
      physicalInfo: "शारीरिक माहिती",
      height: "उंची",
      weight: "वजन",
      schoolName: "शाळेचे नाव",
      class: "वर्ग",
      noData: "माहिती उपलब्ध नाही",
      subject: "विषय",
      marks: "गुण",
      grade: "ग्रेड",
      present: "उपस्थित",
      absent: "अनुपस्थित",
      total: "एकूण",
      percentage: "टक्केवारी",
      month: "महिना",
      status: "स्थिती",
      days: "दिवस",
      searchPlaceholder: "विद्यार्थ्याचे नाव किंवा नोंदणी क्रमांक प्रविष्ट करा",
      noStudentsInClass: "या वर्गात विद्यार्थी आढळले नाहीत",
      selectStudentFirst: "कृपया प्रथम विद्यार्थी निवडा",
      studentName: "विद्यार्थ्याचे नाव",
      overallPerformance: "एकूण कामगिरी",
      classAverage: "वर्गाची सरासरी",
      healthInfo: "आरोग्य माहिती",
      bmi: "बीएमआय",
      performanceSummary: "कामगिरी सारांश",
      term1: "सत्र 1",
      term2: "सत्र 2",
      bothTerms: "दोन्ही सत्र",
      average: "सरासरी",
      landscapeView: "लँडस्केप दृश्य",
      toggleLandscape: "लँडस्केप टॉगल करा",
      downloadPDF: "पीडीएफ डाउनलोड करा",
      generatingPDF: "पीडीएफ तयार करत आहे...",
      pdfGenerated: "पीडीएफ यशस्वीरित्या तयार झाले!",
      pdfError: "पीडीएफ तयार करताना त्रुटी",
      teacherName: "शिक्षकांचे नाव",
      headmasterName: "मुख्याध्यापक/प्राचार्यांचे नाव",
      parentSignature: "पालकांचे स्वाक्षरी",
      date: "तारीख"
    }
  };

  const t = translations[language];

  // Load data on component mount
  useEffect(() => {
    const fetchData = () => {
      const studentsData = getAllStudents();
      const attendance = getAttendanceData();
      const marks = getMarksData();
      
      setStudents(studentsData);
      setAttendanceData(attendance);
      setMarksData(marks);
    };

    fetchData();
    
    // Set up interval to refresh data every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update class students when selected class changes or when students data changes
  useEffect(() => {
    console.log('Class selection changed. Selected class:', selectedClass);
    console.log('All students:', students);
    
    if (selectedClass) {
      const filteredStudents = students.filter(student => student.class === selectedClass);
      setClassStudents(filteredStudents);
      setFilteredStudents(filteredStudents);
    } else {
      setClassStudents([]);
      setFilteredStudents([]);
    }
  }, [selectedClass, students]);

  // Update filtered students when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(classStudents);
    } else {
      const filtered = classStudents.filter(student => 
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, classStudents]);

  // Generate class options from 1 to 10
  const getClassOptions = () => {
    return Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  };

  // Handle class change
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedStudent(null);
    setShowResults(false);
  };

  // Handle student change
  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    const student = classStudents.find(s => s.id.toString() === studentId);
    setSelectedStudent(student);
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle show results
  const handleShowResults = () => {
    if (selectedStudent) {
      setShowResults(true);
    }
  };

  // Calculate BMI
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return 'N/A';
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    if (heightInMeters <= 0) return 'N/A';
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // Render attendance table
  const renderAttendanceTable = (studentId) => {
    if (!studentId) return <p>{t.noData}</p>;
    
    // Get attendance records for the selected student and year
    const studentAttendance = [];
    
    // Look for attendance records with the selected year
    Object.entries(attendanceData).forEach(([key, value]) => {
      // Check if key matches the pattern: month-year-present/absent-studentId
      const presentPattern = new RegExp(`^([a-z]+)-(${selectedYear})-present-${studentId}$`);
      const absentPattern = new RegExp(`^([a-z]+)-(${selectedYear})-absent-${studentId}$`);
      
      const presentMatch = key.match(presentPattern);
      const absentMatch = key.match(absentPattern);
      
      if (presentMatch) {
        const month = presentMatch[1];
        // Find if we already have this month in our records
        let record = studentAttendance.find(r => r.month === month);
        if (!record) {
          record = { month, present: 0, absent: 0 };
          studentAttendance.push(record);
        }
        record.present = value === '' ? 0 : (typeof value === 'string' ? parseInt(value) || 0 : value);
      } else if (absentMatch) {
        const month = absentMatch[1];
        // Find if we already have this month in our records
        let record = studentAttendance.find(r => r.month === month);
        if (!record) {
          record = { month, present: 0, absent: 0 };
          studentAttendance.push(record);
        }
        record.absent = value === '' ? 0 : (typeof value === 'string' ? parseInt(value) || 0 : value);
      }
    });
    
    if (studentAttendance.length === 0) {
      return <p>{t.noData}</p>;
    }
    
    // Sort by month
    const monthOrder = ['june', 'july', 'august', 'september', 'october', 'november', 'december', 'january', 'february', 'march', 'april', 'may'];
    studentAttendance.sort((a, b) => {
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });
    
    return (
      <table className="attendance-table">
        <thead>
          <tr>
            <th>{t.month}</th>
            <th>{t.present}</th>
            <th>{t.absent}</th>
            <th>{t.total}</th>
            <th>{t.percentage}</th>
          </tr>
        </thead>
        <tbody>
          {studentAttendance.map((record, index) => {
            const present = record.present === '' || record.present === undefined ? 0 : 
                           (typeof record.present === 'string' ? parseInt(record.present) || 0 : record.present);
            const absent = record.absent === '' || record.absent === undefined ? 0 : 
                          (typeof record.absent === 'string' ? parseInt(record.absent) || 0 : record.absent);
            const total = present + absent;
            const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0.0';
            
            // Convert month key to display name
            const monthNames = {
              'june': t.june || 'June',
              'july': t.july || 'July',
              'august': t.august || 'August',
              'september': t.september || 'September',
              'october': t.october || 'October',
              'november': t.november || 'November',
              'december': t.december || 'December',
              'january': t.january || 'January',
              'february': t.february || 'February',
              'march': t.march || 'March',
              'april': t.april || 'April',
              'may': t.may || 'May'
            };
            
            return (
              <tr key={index}>
                <td>{monthNames[record.month] || record.month}</td>
                <td>{present}</td>
                <td>{absent}</td>
                <td>{total}</td>
                <td>{percentage}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // Render marks table for a specific term
  const renderMarksTable = (term) => {
    if (!selectedStudent) return <p>{t.noData}</p>;
    
    const studentMarks = marksData[selectedStudent.id]?.[term];
    
    if (!studentMarks || Object.keys(studentMarks).length === 0) {
      return <p>{t.noData}</p>;
    }
    
    // Get subjects from student profile or marks data
    let subjects = [];
    if (selectedStudent.subjects && selectedStudent.subjects.length > 0) {
      subjects = selectedStudent.subjects.map(subject => 
        typeof subject === 'string' ? subject : subject.name
      );
    } else {
      subjects = Object.keys(studentMarks);
    }
    
    return (
      <table className="marks-table">
        <thead>
          <tr>
            <th>{t.subject}</th>
            <th>{t.marks}</th>
            <th>{t.grade}</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => {
            // Sanitize subject name to prevent XSS
            const sanitizedSubject = sanitizeInput(subject);
            const marks = studentMarks[sanitizedSubject] !== undefined ? studentMarks[sanitizedSubject] : '';
            
            // Calculate grade based on marks
            let grade = 'N/A';
            if (marks !== '' && !isNaN(marks)) {
              const marksNum = parseInt(marks);
              if (marksNum >= 90) grade = 'A+';
              else if (marksNum >= 80) grade = 'A';
              else if (marksNum >= 70) grade = 'B';
              else if (marksNum >= 60) grade = 'C';
              else if (marksNum >= 50) grade = 'D';
              else if (marksNum >= 40) grade = 'E';
              else grade = 'F';
            }
            
            return (
              <tr key={index}>
                <td>{sanitizedSubject}</td>
                <td>{marks === '' ? 'N/A' : marks}</td>
                <td>{grade}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // Generate PDF for class results
  const generateClassResultsPDF = () => {
    const element = document.getElementById('class-results-output');
    
    if (!element) {
      alert('Could not find class results content to generate PDF');
      return;
    }
    
    const opt = {
      margin: 10,
      filename: `class-results-${selectedClass}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: landscapeView ? 'landscape' : 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  // Generate PDF for individual result
  const generatePDF = () => {
    const element = document.getElementById('result-output');
    
    if (!element) {
      alert('Could not find result content to generate PDF');
      return;
    }
    
    const opt = {
      margin: 10,
      filename: `student-result-${selectedStudent?.studentName || 'unknown'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: landscapeView ? 'landscape' : 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  // Calculate class average for a term
  const calculateClassAverage = (term) => {
    if (classStudents.length === 0) return 'N/A';
    
    let totalMarks = 0;
    let subjectCount = 0;
    
    classStudents.forEach(student => {
      const studentMarks = marksData[student.id]?.[term];
      if (studentMarks) {
        Object.values(studentMarks).forEach(marks => {
          if (marks !== '' && !isNaN(marks)) {
            totalMarks += parseInt(marks);
            subjectCount++;
          }
        });
      }
    });
    
    if (subjectCount === 0) return 'N/A';
    
    const average = totalMarks / subjectCount;
    return average.toFixed(1);
  };

  // Render class results table
  const renderClassResults = () => {
    if (classStudents.length === 0) return <p>{t.noData}</p>;
    
    // Get all subjects from all students in the class
    const allSubjects = new Set();
    classStudents.forEach(student => {
      if (student.subjects && student.subjects.length > 0) {
        student.subjects.forEach(subject => {
          const subjectName = typeof subject === 'string' ? subject : subject.name;
          allSubjects.add(sanitizeInput(subjectName));
        });
      }
    });
    
    const subjects = Array.from(allSubjects);
    
    return (
      <table className="class-results-table">
        <thead>
          <tr>
            <th>{t.studentName}</th>
            {subjects.map((subject, index) => (
              <th key={index}>{subject}</th>
            ))}
            <th>{t.average}</th>
          </tr>
        </thead>
        <tbody>
          {classStudents.map(student => {
            const studentMarks = marksData[student.id]?.[classResultTerm];
            let totalMarks = 0;
            let subjectCount = 0;
            
            return (
              <tr key={student.id}>
                <td>{student.studentName}</td>
                {subjects.map((subject, index) => {
                  const marks = studentMarks?.[subject] !== undefined ? studentMarks[subject] : '';
                  if (marks !== '' && !isNaN(marks)) {
                    totalMarks += parseInt(marks);
                    subjectCount++;
                  }
                  return (
                    <td key={index}>
                      {marks === '' ? 'N/A' : marks}
                    </td>
                  );
                })}
                <td>
                  {subjectCount > 0 ? (totalMarks / subjectCount).toFixed(1) : 'N/A'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="results-display">
      {/* Tab Navigation */}
      <div className="result-tabs">
        <button 
          className={activeTab === 'individual' ? 'active' : ''}
          onClick={() => setActiveTab('individual')}
        >
          {t.individualResult}
        </button>
        <button 
          className={activeTab === 'class' ? 'active' : ''}
          onClick={() => setActiveTab('class')}
        >
          {t.classResult}
        </button>
        <button 
          className="landscape-toggle"
          onClick={() => setLandscapeView(!landscapeView)}
        >
          {landscapeView ? '📱' : '🖥️'} {t.landscapeView}
        </button>
      </div>
      
      {/* Individual Result Tab */}
      {activeTab === 'individual' && (
        <div className={`individual-result-tab ${landscapeView ? 'landscape-view' : ''}`}>
          <h3>{t.individualResult}</h3>
          
          {/* Student Selection */}
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
                    {t.class} {cls}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="studentSelect">{t.selectStudent}:</label>
              <select
                id="studentSelect"
                value={selectedStudent ? selectedStudent.id.toString() : ''}
                onChange={handleStudentChange}
                className="student-select"
                disabled={!selectedClass}
              >
                <option value="">{t.selectStudent}</option>
                {classStudents.map(student => (
                  <option key={student.id} value={student.id.toString()}>
                    {student.studentName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="yearSelect">{t.selectYear || 'Select Year'}:</label>
              <select
                id="yearSelect"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="year-select"
              >
                {Array.from({length: 5}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              className="primary show-result-btn"
              onClick={handleShowResults}
              disabled={!selectedStudent}
            >
              {t.showResult}
            </button>
          </div>
          
          {/* Search Section */}
          <div className="search-section">
            <div className="form-group">
              <label htmlFor="searchInput">{t.searchStudent}:</label>
              <input
                type="text"
                id="searchInput"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={t.searchPlaceholder}
                className="search-input"
              />
            </div>
            
            {filteredStudents.length > 0 && (
              <div className="filtered-students">
                {filteredStudents.map(student => (
                  <div 
                    key={student.id} 
                    className={`student-card ${selectedStudent?.id === student.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowResults(true);
                    }}
                  >
                    <h4>{student.studentName}</h4>
                    <p>{t.class}: {student.class}</p>
                    <p>{t.registrationNo}: {student.registrationNumber}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Result Output */}
          {showResults && selectedStudent && (
            <div className="result-output-container">
              <div className="result-controls">
                <button 
                  id="download-pdf-btn"
                  className="primary"
                  onClick={generatePDF}
                >
                  {t.downloadPDF}
                </button>
              </div>
              
              <div id="result-output" className="result-output">
                {/* Page 1: Combined Student Profile, Attendance Records, and Health Info */}
                <div className="result-page page-1">
                  <div className="page-header">
                    <h1 className="school-name">{selectedStudent?.schoolName || 'School Student Management System'}</h1>
                    <p className="result-date-display"><strong>{t.date}: </strong>{resultDate}</p>
                  </div>
                  
                  {/* Combined Section: Student Profile, Attendance, and Health Info */}
                  <div className="result-section creative-card combined-section">
                    <div className="section-header">
                      <h2 className="section-title">Student Information</h2>
                      <div className="section-icon">📋</div>
                    </div>
                    
                    <div className="combined-info-grid">
                      {/* Student Profile Section - Now first as per user request */}
                      <div className="info-section profile-section">
                        <h3 className="subsection-title">{t.studentProfile}</h3>
                        <div className="profile-grid">
                          <div className="profile-item">
                            <strong>{t.name}:</strong> {selectedStudent.studentName}
                          </div>
                          <div className="profile-item">
                            <strong>{t.schoolName}:</strong> {selectedStudent.schoolName}
                          </div>
                          <div className="profile-item">
                            <strong>{t.class}:</strong> {selectedStudent.class}
                          </div>
                          <div className="profile-item">
                            <strong>{t.registrationNo}:</strong> {selectedStudent.registrationNumber}
                          </div>
                          <div className="profile-item">
                            <strong>{t.gender}:</strong> {selectedStudent.gender}
                          </div>
                          <div className="profile-item">
                            <strong>{t.caste}:</strong> {selectedStudent.caste}
                          </div>
                          <div className="profile-item">
                            <strong>{t.dob}:</strong> {selectedStudent.dob}
                          </div>
                          <div className="profile-item">
                            <strong>{t.fathersName}:</strong> {selectedStudent.fatherName}
                          </div>
                          <div className="profile-item">
                            <strong>{t.mothersName}:</strong> {selectedStudent.motherName}
                          </div>
                          <div className="profile-item">
                            <strong>{t.motherTongue}:</strong> {selectedStudent.motherTongue}
                          </div>
                          <div className="profile-item">
                            <strong>{t.medium}:</strong> {selectedStudent.medium}
                          </div>
                          <div className="profile-item full-width">
                            <strong>{t.address}:</strong> {selectedStudent.address}
                          </div>
                          <div className="profile-item">
                            <strong>{t.phoneNumber}:</strong> {selectedStudent.phoneNumber}
                          </div>
                        </div>
                      </div>
                      
                      {/* Attendance Records Section - Now second as per user request */}
                      <div className="info-section attendance-section">
                        <h3 className="subsection-title">{t.attendanceRecord}</h3>
                        <div className="attendance-container">
                          {renderAttendanceTable(selectedStudent.id)}
                        </div>
                      </div>
                      
                      {/* Health Information Section - Improved design with better appearance */}
                      <div className="info-section health-section improved-health">
                        <h3 className="subsection-title">{t.healthInfo}</h3>
                        <div className="health-grid improved-health-grid">
                          <div className="health-item improved">
                            <div className="health-label">{t.height}</div>
                            <div className="health-value">{selectedStudent.height || 'N/A'} <span className="health-unit">cm</span></div>
                          </div>
                          <div className="health-item improved">
                            <div className="health-label">{t.weight}</div>
                            <div className="health-value">{selectedStudent.weight || 'N/A'} <span className="health-unit">kg</span></div>
                          </div>
                          <div className="health-item improved">
                            <div className="health-label">{t.bmi}</div>
                            <div className="health-value">{calculateBMI(selectedStudent.height, selectedStudent.weight)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Page 2: Academic Details (Marks) with Signature Section */}
                <div className="result-page page-2">
                  {/* Academic Details */}
                  <div className="result-section creative-card">
                    <div className="section-header">
                      <h2 className="section-title">{t.academicDetails}</h2>
                      <div className="section-icon">📚</div>
                    </div>
                    
                    {/* Term Tabs */}
                    <div className="term-tabs">
                      <button 
                        className={activeTermTab === 'term1' ? 'active' : ''}
                        onClick={() => setActiveTermTab('term1')}
                      >
                        {t.term1}
                      </button>
                      <button 
                        className={activeTermTab === 'term2' ? 'active' : ''}
                        onClick={() => setActiveTermTab('term2')}
                      >
                        {t.term2}
                      </button>
                      <button 
                        className={activeTermTab === 'both' ? 'active' : ''}
                        onClick={() => setActiveTermTab('both')}
                      >
                        {t.bothTerms}
                      </button>
                    </div>
                    
                    <div className="marks-container">
                      {/* Both Terms Content - SIDE BY SIDE LAYOUT */}
                      {activeTermTab === 'both' && (
                        <div className="terms-side-by-side">
                          <div className="term-container left">
                            <h3 className="term-title large-font">{t.term1}</h3>
                            {renderMarksTable('term1')}
                          </div>
                          
                          <div className="term-container right">
                            <h3 className="term-title large-font">{t.term2}</h3>
                            {renderMarksTable('term2')}
                          </div>
                        </div>
                      )}

                      {/* Term 1 Content (when only Term 1 is selected) */}
                      {activeTermTab === 'term1' && (
                        <div className="term-content">
                          <h3 className="term-title large-font">{t.term1}</h3>
                          {renderMarksTable('term1')}
                        </div>
                      )}

                      {/* Term 2 Content (when only Term 2 is selected) */}
                      {activeTermTab === 'term2' && (
                        <div className="term-content">
                          <h3 className="term-title large-font">{t.term2}</h3>
                          {renderMarksTable('term2')}
                        </div>
                      )}
                    </div>

                    {/* Signature Section - Moved to Page 2 as per user preference */}
                    <div className="signature-section">
                      <div className="signature-content">
                        <div className="signature-grid">
                          <div className="signature-item">
                            <div className="signature-line"></div>
                            <p><strong>{t.teacherName}:</strong> _____________________</p>
                            <p><strong>Date:</strong> {resultDate}</p>
                          </div>
                          <div className="signature-item">
                            <div className="signature-line"></div>
                            <p><strong>{t.headmasterName}:</strong> _____________________</p>
                          </div>
                          <div className="signature-item">
                            <div className="signature-line"></div>
                            <p><strong>{t.parentSignature}:</strong> _____________________</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Class Result Tab */}
      {activeTab === 'class' && (
        <div className={`class-result-tab ${landscapeView ? 'landscape-view' : ''}`}>
          <h3>{t.classResult}</h3>
          
          {/* Class Selection */}
          <div className="form-group">
            <label htmlFor="classResultSelect">{t.selectClass}:</label>
            <select
              id="classResultSelect"
              value={selectedClass}
              onChange={handleClassChange}
              className="class-select"
              style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
            >
              <option value="">{t.selectClass}</option>
              {getClassOptions().map(cls => (
                <option key={cls} value={cls}>
                  {t.class} {cls}
                </option>
              ))}
            </select>
          </div>
          
          {/* Term Tabs for Class Results */}
          {selectedClass && (
            <div className="term-tabs-container" style={{ marginTop: '20px' }}>
              <div className="term-tabs">
                <button 
                  className={classResultTerm === 'term1' ? 'active' : ''}
                  onClick={() => setClassResultTerm('term1')}
                >
                  {t.term1}
                </button>
                <button 
                  className={classResultTerm === 'term2' ? 'active' : ''}
                  onClick={() => setClassResultTerm('term2')}
                >
                  {t.term2}
                </button>
                <button 
                  className={classResultTerm === 'both' ? 'active' : ''}
                  onClick={() => setClassResultTerm('both')}
                >
                  {t.bothTerms}
                </button>
                {classStudents.length > 0 && (
                  <button 
                    id="download-pdf-btn-class"
                    className="landscape-toggle"
                    onClick={generateClassResultsPDF}
                    style={{ marginLeft: '10px' }}
                  >
                    {t.downloadPDF}
                  </button>
                )}
              </div>
            </div>
          )}
          
          {selectedClass && classStudents.length > 0 ? (
            <div className="class-results-container" id="class-results-output">
              {/* Class Summary */}
              <div className="class-summary">
                <h4>{t.overallPerformance}</h4>
                <div className="summary-stats">
                  <div className="stat-card">
                    <h5>{t.classAverage} ({t.term1})</h5>
                    <p className="stat-number">{calculateClassAverage('term1')}</p>
                  </div>
                  <div className="stat-card">
                    <h5>{t.classAverage} ({t.term2})</h5>
                    <p className="stat-number">{calculateClassAverage('term2')}</p>
                  </div>
                </div>
              </div>
              
              {/* Class Results Table */}
              <div className="result-section creative-card">
                <div className="section-header">
                  <h2 className="section-title">{t.classResult}</h2>
                  <div className="section-icon">👥</div>
                </div>
                <div className="class-results-table-container">
                  {renderClassResults()}
                </div>
              </div>
            </div>
          ) : selectedClass ? (
            <p>{t.noStudentsInClass}</p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;