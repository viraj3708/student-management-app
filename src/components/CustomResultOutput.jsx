import React from 'react';
import { getAllStudents, getAttendanceData, getMarksData } from '../utils/dataManager';

const CustomResultOutput = ({ language, selectedStudent }) => {
  // Language translations
  const translations = {
    english: {
      schoolName: "School Name",
      studentProfile: "Student Profile",
      name: "Name",
      class: "Class",
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
      healthInfo: "Health Information",
      bmi: "BMI",
      attendanceRecord: "Attendance Record",
      present: "Present",
      absent: "Absent",
      total: "Total",
      percentage: "Percentage",
      month: "Month",
      days: "Days",
      gradingSystem: "Grading System",
      gradingInfo: "Grading is based on percentage: A1 (91-100%), A2 (81-90%), B1 (71-80%), B2 (60-70%), C1 (51-60%), C2 (41-50%), D1 (31-40%), D2 (0-30%)",
      marksRecord: "Marks Record",
      subject: "Subject",
      marks: "Marks",
      grade: "Grade",
      term1: "Term 1",
      term2: "Term 2",
      signatureSection: "Signature Section",
      teacherSignature: "Teacher's Signature",
      principalSignature: "Principal's Signature",
      parentSignature: "Parent's Signature",
      teacherName: "Teacher Name",
      noData: "No data available"
    },
    marathi: {
      schoolName: "शाळेचे नाव",
      studentProfile: "विद्यार्थी प्रोफाइल",
      name: "नाव",
      class: "वर्ग",
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
      healthInfo: "आरोग्य माहिती",
      bmi: "बीएमआय",
      attendanceRecord: "उपस्थिती नोंद",
      present: "उपस्थित",
      absent: "अनुपस्थित",
      total: "एकूण",
      percentage: "टक्केवारी",
      month: "महिना",
      days: "दिवस",
      gradingSystem: "ग्रेडिंग प्रणाली",
      gradingInfo: "ग्रेडिंग टक्केवारीवर आधारित आहे: अ १ (९१-१००%), अ २ (८१-९०%), ब १ (७१-८०%), ब २ (६०-७०%), क १ (५१-६०%), क २ (४१-५०%), ड १ (३१-४०%), ड २ (०-३०%)",
      marksRecord: "गुण नोंद",
      subject: "विषय",
      marks: "गुण",
      grade: "ग्रेड",
      term1: "सत्र 1",
      term2: "सत्र 2",
      signatureSection: "स्वाक्षरी विभाग",
      teacherSignature: "शिक्षकाची स्वाक्षरी",
      principalSignature: "मुख्याध्यापकाची स्वाक्षरी",
      parentSignature: "पालकाची स्वाक्षरी",
      teacherName: "शिक्षकाचे नाव",
      noData: "माहिती उपलब्ध नाही"
    }
  };

  const t = translations[language];

  // Get all data
  const students = getAllStudents();
  const attendanceData = getAttendanceData();
  const marksData = getMarksData();

  // Calculate BMI
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return 'N/A';
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // Grade calculation function
  const calculateGrade = (marks) => {
    if (marks === '' || marks === null || marks === undefined || isNaN(marks)) return 'N/A';
    const mark = parseInt(marks);
    
    // Define grade mappings for both English and Marathi
    const gradeMappings = {
      english: {
        'A1': 'A1',
        'A2': 'A2',
        'B1': 'B1',
        'B2': 'B2',
        'C1': 'C1',
        'C2': 'C2',
        'D1': 'D1',
        'D2': 'D2'
      },
      marathi: {
        'A1': 'अ १',
        'A2': 'अ २',
        'B1': 'ब १',
        'B2': 'ब २',
        'C1': 'क १',
        'C2': 'क २',
        'D1': 'ड १',
        'D2': 'ड २'
      }
    };
    
    let gradeCode = 'N/A';
    
    if (mark >= 91 && mark <= 100) gradeCode = 'A1';
    if (mark >= 81 && mark <= 90) gradeCode = 'A2';
    if (mark >= 71 && mark <= 80) gradeCode = 'B1';
    if (mark >= 60 && mark <= 70) gradeCode = 'B2';
    if (mark >= 51 && mark <= 60) gradeCode = 'C1';
    if (mark >= 41 && mark <= 50) gradeCode = 'C2';
    if (mark >= 31 && mark <= 40) gradeCode = 'D1';
    if (mark <= 30 && mark >= 0) gradeCode = 'D2';
    
    // Return grade in the selected language
    if (gradeCode === 'N/A') return 'N/A';
    return gradeMappings[language][gradeCode] || gradeMappings.english[gradeCode] || 'N/A';
  };

  // Get attendance records for selected student
  const getStudentAttendance = () => {
    if (!selectedStudent) return [];
    
    const records = [];
    // Parse attendance data keys to extract month and status
    Object.keys(attendanceData).forEach(key => {
      // Check if key contains student ID
      if (key.includes(`-${selectedStudent.id}`)) {
        // Parse the key format: month-year-present/absent-studentId
        const parts = key.split('-');
        if (parts.length >= 4) {
          const month = parts[0];
          const year = parts[1];
          const statusType = parts[2]; // 'present' or 'absent'
          const days = attendanceData[key];
          
          // Create a unique identifier for this month-year combination
          const monthYearKey = `${month}-${year}`;
          
          // Check if we already have a record for this month-year
          const existingRecordIndex = records.findIndex(r => r.monthYear === monthYearKey);
          
          if (existingRecordIndex !== -1) {
            // Update existing record
            if (statusType === 'present') {
              records[existingRecordIndex].present = days;
            } else if (statusType === 'absent') {
              records[existingRecordIndex].absent = days;
            }
          } else {
            // Create new record
            const newRecord = {
              monthYear: monthYearKey,
              month: `${month} ${year}`,
              present: statusType === 'present' ? days : 0,
              absent: statusType === 'absent' ? days : 0
            };
            records.push(newRecord);
          }
        }
      }
    });
    
    return records;
  };

  // Get marks for a student and term
  const getStudentMarks = (studentId, term) => {
    const termKey = `${term}-${studentId}`;
    return marksData[termKey] || [];
  };

  // Get grade code for CSS class (always returns English grade code)
  const getGradeCode = (marks) => {
    if (marks === '' || marks === null || marks === undefined || isNaN(marks)) return 'na';
    const mark = parseInt(marks);
    
    if (mark >= 91 && mark <= 100) return 'a1';
    if (mark >= 81 && mark <= 90) return 'a2';
    if (mark >= 71 && mark <= 80) return 'b1';
    if (mark >= 60 && mark <= 70) return 'b2';
    if (mark >= 51 && mark <= 60) return 'c1';
    if (mark >= 41 && mark <= 50) return 'c2';
    if (mark >= 31 && mark <= 40) return 'd1';
    if (mark <= 30 && mark >= 0) return 'd2';
    
    return 'na';
  };

  if (!selectedStudent) {
    return <div>{t.noData}</div>;
  }

  // Get marks data
  const term1Marks = getStudentMarks(selectedStudent.id, 'term1');
  const term2Marks = getStudentMarks(selectedStudent.id, 'term2');

  return (
    <div className="custom-result-output">
      {/* PAGE 1 - LANDSCAPE MODE */}
      <div className="result-page page-1 landscape">
        {/* LEFT COLUMN - ATTENDANCE RECORD AND HEALTH INFO (MOVED TO 1ST PLACE) */}
        <div className="page-column left-column">
          {/* SCHOOL NAME */}
          <div className="school-header-section">
            <h1 className="school-name">{selectedStudent.schoolName || t.schoolName}</h1>
          </div>

          {/* ATTENDANCE RECORD (MOVED TO 1ST POSITION) */}
          <div className="attendance-section">
            <h2 className="section-title">{t.attendanceRecord}</h2>
            <div className="attendance-summary">
              <div className="summary-item">
                <span className="label">{t.total} {t.present}:</span>
                <span className="value">
                  {getStudentAttendance().reduce((sum, record) => sum + (record.present || 0), 0)}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">{t.total} {t.absent}:</span>
                <span className="value">
                  {getStudentAttendance().reduce((sum, record) => sum + (record.absent || 0), 0)}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">{t.total} {t.days}:</span>
                <span className="value">
                  {getStudentAttendance().reduce((sum, record) => sum + (record.present || 0) + (record.absent || 0), 0)}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">{t.percentage}:</span>
                <span className="value">
                  {(() => {
                    const total = getStudentAttendance().reduce((sum, record) => sum + (record.present || 0) + (record.absent || 0), 0);
                    const present = getStudentAttendance().reduce((sum, record) => sum + (record.present || 0), 0);
                    return total > 0 ? ((present / total) * 100).toFixed(1) + '%' : 'N/A';
                  })()}
                </span>
              </div>
            </div>

            {/* ATTENDANCE TABLE */}
            <div className="attendance-table-container">
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
                  {getStudentAttendance().length > 0 ? (
                    getStudentAttendance().map((record, index) => (
                      <tr key={index}>
                        <td>{record.month}</td>
                        <td>{record.present || 0}</td>
                        <td>{record.absent || 0}</td>
                        <td>{(record.present || 0) + (record.absent || 0)}</td>
                        <td>
                          {(record.present || 0) + (record.absent || 0) > 0 
                            ? (((record.present || 0) / ((record.present || 0) + (record.absent || 0))) * 100).toFixed(1) + '%'
                            : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">{t.noData}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* HEALTH INFO (MOVED BELOW ATTENDANCE RECORD) */}
          <div className="health-info-section">
            <h2 className="section-title">{t.healthInfo}</h2>
            <div className="health-info-grid">
              <div className="health-item">
                <span className="label">{t.height}:</span>
                <span className="value">{selectedStudent.height || 'N/A'} cm</span>
              </div>
              <div className="health-item">
                <span className="label">{t.weight}:</span>
                <span className="value">{selectedStudent.weight || 'N/A'} kg</span>
              </div>
              <div className="health-item">
                <span className="label">{t.bmi}:</span>
                <span className="value">{calculateBMI(selectedStudent.height, selectedStudent.weight)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - STUDENT PROFILE (MOVED TO RIGHT) */}
        <div className="page-column right-column">
          {/* STUDENT PROFILE (MOVED TO RIGHT COLUMN) */}
          <div className="student-profile-section">
            <h2 className="section-title">{t.studentProfile}</h2>
            <div className="profile-info-grid">
              <div className="profile-item">
                <span className="label">{t.name}:</span>
                <span className="value">{selectedStudent.studentName}</span>
              </div>
              <div className="profile-item">
                <span className="label">{t.class}:</span>
                <span className="value">{selectedStudent.class}</span>
              </div>
              <div className="profile-item">
                <span className="label">{t.gender}:</span>
                <span className="value">{selectedStudent.gender}</span>
              </div>
              <div className="profile-item">
                <span className="label">{t.caste}:</span>
                <span className="value">{selectedStudent.caste}</span>
              </div>
              <div className="profile-item">
                <span className="label">{t.dob}:</span>
                <span className="value">{selectedStudent.dob}</span>
              </div>
              <div className="profile-item">
                <span className="label">{t.registrationNo}:</span>
                <span className="value">{selectedStudent.registrationNumber}</span>
              </div>
              <div className="profile-item">
                <span className="label">{t.fathersName}:</span>
                <span className="value">{selectedStudent.fatherName}</span>
              </div>
              <div className="profile-item">
                <span className="label">{t.mothersName}:</span>
                <span className="value">{selectedStudent.motherName}</span>
              </div>
              <div className="profile-item">
                <span className="label">{t.motherTongue}:</span>
                <span className="value">{selectedStudent.motherTongue}</span>
              </div>
              <div className="profile-item">
                <span className="label">{t.medium}:</span>
                <span className="value">{selectedStudent.medium}</span>
              </div>
              <div className="profile-item full-width">
                <span className="label">{t.address}:</span>
                <span className="value">{selectedStudent.address}</span>
              </div>
              <div className="profile-item">
                <span className="label">{t.phoneNumber}:</span>
                <span className="value">{selectedStudent.phoneNumber}</span>
              </div>
              <div className="profile-item">
                <span className="label">{t.height}:</span>
                <span className="value">{selectedStudent.height} cm</span>
              </div>
              <div className="profile-item">
                <span className="label">{t.weight}:</span>
                <span className="value">{selectedStudent.weight} kg</span>
              </div>
              <div className="profile-item">
                <span className="label">{t.bmi}:</span>
                <span className="value">{calculateBMI(selectedStudent.height, selectedStudent.weight)}</span>
              </div>
            </div>
          </div>

          {/* GRADING SYSTEM INFO */}
          <div className="grading-system-section">
            <h2 className="section-title">{t.gradingSystem}</h2>
            <div className="grading-info">
              <p>{t.gradingInfo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2 - LANDSCAPE MODE */}
      <div className="result-page page-2 landscape">
        {/* LEFT COLUMN - TERM 1 MARKS */}
        <div className="page-column left-column">
          <div className="marks-section">
            <h2 className="section-title">{t.term1} {t.marksRecord}</h2>
            <div className="marks-table-container">
              <table className="marks-table">
                <thead>
                  <tr>
                    <th>{t.subject}</th>
                    <th>{t.marks}</th>
                    <th>{t.grade}</th>
                  </tr>
                </thead>
                <tbody>
                  {term1Marks.length > 0 ? (
                    term1Marks.map((subject, index) => (
                      <tr key={index}>
                        <td>{subject.name}</td>
                        <td>{subject.marks || 'N/A'}</td>
                        <td className={`grade-${getGradeCode(subject.marks)}`}>
                          {calculateGrade(subject.marks)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">{t.noData}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - TERM 2 MARKS */}
        <div className="page-column right-column">
          <div className="marks-section">
            <h2 className="section-title">{t.term2} {t.marksRecord}</h2>
            <div className="marks-table-container">
              <table className="marks-table">
                <thead>
                  <tr>
                    <th>{t.subject}</th>
                    <th>{t.marks}</th>
                    <th>{t.grade}</th>
                  </tr>
                </thead>
                <tbody>
                  {term2Marks.length > 0 ? (
                    term2Marks.map((subject, index) => (
                      <tr key={index}>
                        <td>{subject.name}</td>
                        <td>{subject.marks || 'N/A'}</td>
                        <td className={`grade-${getGradeCode(subject.marks)}`}>
                          {calculateGrade(subject.marks)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">{t.noData}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SIGNATURE SECTION - SPANS BOTH COLUMNS */}
        <div className="signature-section">
          <h2 className="section-title">{t.signatureSection}</h2>
          <div className="signature-grid">
            <div className="signature-item">
              <div className="signature-line"></div>
              <div className="signature-label">{t.teacherSignature}</div>
              <div className="signature-name">({t.teacherName}: {selectedStudent.class} {t.class})</div>
            </div>
            <div className="signature-item">
              <div className="signature-line"></div>
              <div className="signature-label">{t.principalSignature}</div>
            </div>
            <div className="signature-item">
              <div className="signature-line"></div>
              <div className="signature-label">{t.parentSignature}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomResultOutput;