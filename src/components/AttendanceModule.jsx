import { useState, useEffect } from 'react';
import { getAllStudents, getAttendanceData, saveAttendanceData } from '../utils/dataManager';

const AttendanceModule = ({ language }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [allStudents, setAllStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [presentCount, setPresentCount] = useState({}); // Track present days per student
  const [absentCount, setAbsentCount] = useState({}); // Track absent days per student

  // Load students and attendance data on component mount
  useEffect(() => {
    const studentsData = getAllStudents();
    const savedAttendanceData = getAttendanceData();
    
    setAllStudents(studentsData);
    
    // Filter students by selected class if a class is selected
    const filteredStudents = selectedClass 
      ? studentsData.filter(student => student.class === selectedClass)
      : studentsData;
    
    setStudents(filteredStudents);
    setAttendanceData(savedAttendanceData);
    
    // Initialize present/absent counts from saved data
    const initialPresent = {};
    const initialAbsent = {};
    filteredStudents.forEach(student => {
      // Get saved values if they exist
      const presentKey = `${selectedMonth}-${selectedYear}-present-${student.id}`;
      const absentKey = `${selectedMonth}-${selectedYear}-absent-${student.id}`;
      
      // Handle both number and string values properly
      const presentValue = savedAttendanceData[presentKey];
      const absentValue = savedAttendanceData[absentKey];
      
      // Ensure we're handling empty values correctly
      initialPresent[student.id] = presentValue !== undefined && presentValue !== '' ? presentValue : '';
      initialAbsent[student.id] = absentValue !== undefined && absentValue !== '' ? absentValue : '';
    });
    setPresentCount(initialPresent);
    setAbsentCount(initialAbsent);
  }, [selectedClass, selectedMonth, selectedYear]);

  // Language translations
  const translations = {
    english: {
      selectClass: "Select Class",
      selectMonth: "Select Month",
      selectYear: "Select Year",
      class: "Class",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December",
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      studentName: "Student Name",
      present: "Present",
      absent: "Absent",
      presentDays: "Present Days",
      absentDays: "Absent Days",
      totalDays: "Total Days",
      save: "Save Attendance",
      reset: "Reset",
      successMessage: "Attendance saved successfully!",
      errorMessage: "Error saving attendance. Please try again.",
      selectMonthFirst: "Please select a month first!",
      noStudents: "No students found. Please add students in the Student Profile section.",
      enterPresent: "Enter Present Days",
      enterAbsent: "Enter Absent Days"
    },
    marathi: {
      selectClass: "वर्ग निवडा",
      selectMonth: "महिना निवडा",
      selectYear: "वर्ष निवडा",
      class: "वर्ग",
      june: "जून",
      july: "जुलै",
      august: "ऑगस्ट",
      september: "सप्टेंबर",
      october: "ऑक्टोबर",
      november: "नोव्हेंबर",
      december: "डिसेंबर",
      january: "जानेवारी",
      february: "फेब्रुवारी",
      march: "मार्च",
      april: "एप्रिल",
      may: "मे",
      studentName: "विद्यार्थी नाव",
      present: "उपस्थित",
      absent: "अनुपस्थित",
      presentDays: "उपस्थित दिवस",
      absentDays: "अनुपस्थित दिवस",
      totalDays: "एकूण दिवस",
      save: "उपस्थिती सेव्ह करा",
      reset: "रीसेट करा",
      successMessage: "उपस्थिती यशस्वीरित्या सेव्ह केली!",
      errorMessage: "उपस्थिती सेव्ह करताना त्रुटी. कृपया पुन्हा प्रयत्न करा.",
      selectMonthFirst: "कृपया प्रथम महिना निवडा!",
      noStudents: "विद्यार्थी आढळले नाहीत. कृपया विद्यार्थी प्रोफाइल विभागात विद्यार्थी जोडा.",
      enterPresent: "उपस्थित दिवस प्रविष्ट करा",
      enterAbsent: "अनुपस्थित दिवस प्रविष्ट करा"
    }
  };

  const t = translations[language];

  // Month options from June to May
  const monthOptions = [
    { value: 'june', label: t.june, number: 6 },
    { value: 'july', label: t.july, number: 7 },
    { value: 'august', label: t.august, number: 8 },
    { value: 'september', label: t.september, number: 9 },
    { value: 'october', label: t.october, number: 10 },
    { value: 'november', label: t.november, number: 11 },
    { value: 'december', label: t.december, number: 12 },
    { value: 'january', label: t.january, number: 1 },
    { value: 'february', label: t.february, number: 2 },
    { value: 'march', label: t.march, number: 3 },
    { value: 'april', label: t.april, number: 4 },
    { value: 'may', label: t.may, number: 5 }
  ];

  // Generate class options from 1 to 10
  const getClassOptions = () => {
    return Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  };

  // Generate year options (current year and next year)
  const yearOptions = [
    selectedYear - 1,
    selectedYear,
    selectedYear + 1
  ];

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setMessage(''); // Clear any messages
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setMessage(''); // Clear any messages
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
    setMessage(''); // Clear any messages
  };

  // Handle present days input change
  const handlePresentChange = (studentId, value) => {
    // Allow empty values and valid numbers only (0-31)
    if (value === '' || (value !== '' && /^\d+$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 31)) {
      setPresentCount(prev => ({
        ...prev,
        [studentId]: value === '' ? '' : parseInt(value)
      }));
    }
  };

  // Handle absent days input change
  const handleAbsentChange = (studentId, value) => {
    // Allow empty values and valid numbers only (0-31)
    if (value === '' || (value !== '' && /^\d+$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 31)) {
      setAbsentCount(prev => ({
        ...prev,
        [studentId]: value === '' ? '' : parseInt(value)
      }));
    }
  };

  const handleSave = () => {
    if (!selectedMonth) {
      setMessage(t.selectMonthFirst);
      setMessageType('error');
      return;
    }
    
    // Prepare attendance data for saving
    const attendanceToSave = {};
    
    students.forEach(student => {
      // Handle empty values properly
      const present = presentCount[student.id] === '' || presentCount[student.id] === undefined ? '' : presentCount[student.id];
      const absent = absentCount[student.id] === '' || absentCount[student.id] === undefined ? '' : absentCount[student.id];
      
      // Save present days count
      const presentKey = `${selectedMonth}-${selectedYear}-present-${student.id}`;
      attendanceToSave[presentKey] = present;
      
      // Save absent days count
      const absentKey = `${selectedMonth}-${selectedYear}-absent-${student.id}`;
      attendanceToSave[absentKey] = absent;
    });
    
    // Save to localStorage
    const result = saveAttendanceData(attendanceToSave);
    
    if (result.success) {
      setMessage(t.successMessage);
      setMessageType('success');
      // Update local state with saved data
      setAttendanceData(prev => ({ ...prev, ...attendanceToSave }));
    } else {
      setMessage(result.error || t.errorMessage);
      setMessageType('error');
    }
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleReset = () => {
    // Reset present/absent counts for all students
    const resetPresent = {};
    const resetAbsent = {};
    
    students.forEach(student => {
      resetPresent[student.id] = '';
      resetAbsent[student.id] = '';
    });
    
    setPresentCount(resetPresent);
    setAbsentCount(resetAbsent);
    setMessage('');
  };

  // Calculate total days for a student
  const getTotalDays = (studentId) => {
    const present = presentCount[studentId] === '' || presentCount[studentId] === undefined ? 0 : parseInt(presentCount[studentId]) || 0;
    const absent = absentCount[studentId] === '' || absentCount[studentId] === undefined ? 0 : parseInt(absentCount[studentId]) || 0;
    return present + absent;
  };

  return (
    <div className="attendance-module">
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
                {t.class} {cls}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="monthSelect">{t.selectMonth}:</label>
          <select
            id="monthSelect"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="month-select"
          >
            <option value="">{t.selectMonth}</option>
            {monthOptions.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="yearSelect">{t.selectYear}:</label>
          <select
            id="yearSelect"
            value={selectedYear}
            onChange={handleYearChange}
            className="year-select"
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedMonth && (
        <div>
          <h3>{monthOptions.find(m => m.value === selectedMonth)?.label} {selectedYear}</h3>
          
          {students.length > 0 ? (
            <div className="attendance-table-container">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>{t.studentName}</th>
                    <th>{t.presentDays}</th>
                    <th>{t.absentDays}</th>
                    <th>{t.totalDays}</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.studentName}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="31"
                          value={presentCount[student.id] === '' ? '' : presentCount[student.id]}
                          onChange={(e) => handlePresentChange(student.id, e.target.value)}
                          style={{ width: '80px' }}
                          placeholder="0-31"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="31"
                          value={absentCount[student.id] === '' ? '' : absentCount[student.id]}
                          onChange={(e) => handleAbsentChange(student.id, e.target.value)}
                          style={{ width: '80px' }}
                          placeholder="0-31"
                          className="absent-input"
                        />
                      </td>
                      <td>
                        <strong>{getTotalDays(student.id)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-students-message">{t.noStudents}</p>
          )}
          
          <div className="attendance-actions">
            <button className="primary save-attendance-btn" onClick={handleSave}>{t.save}</button>
            <button className="reset-attendance-btn" onClick={handleReset} style={{ marginLeft: '10px' }}>{t.reset}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceModule;