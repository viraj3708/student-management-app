// Test script for DataManager functions
console.log('DataManager test script loaded');

// Test getCurrentUser function
function testGetCurrentUser() {
    try {
        console.log('Testing getCurrentUser...');
        const user = localStorage.getItem('currentUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            console.log('Current user found:', parsedUser);
            return parsedUser;
        } else {
            console.log('No current user found');
            return null;
        }
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        return null;
    }
}

// Test getUserDataKey function
function testGetUserDataKey(baseKey) {
    try {
        console.log('Testing getUserDataKey with baseKey:', baseKey);
        const currentUser = testGetCurrentUser();
        if (!currentUser) {
            console.log('No current user, returning base key:', baseKey);
            return baseKey;
        }
        const userKey = `${baseKey}_${currentUser.username}`;
        console.log('Generated user key:', userKey);
        return userKey;
    } catch (error) {
        console.error('Error in getUserDataKey:', error);
        return baseKey;
    }
}

// Test saveStudentProfile function
function testSaveStudentProfile(studentData) {
    try {
        console.log('Testing saveStudentProfile with data:', studentData);
        const currentUser = testGetCurrentUser();
        if (!currentUser) {
            console.log('No current user, cannot save data');
            return false;
        }
        
        const studentsKey = testGetUserDataKey('students');
        
        // Get existing students or initialize empty array
        const existingStudents = JSON.parse(localStorage.getItem(studentsKey) || '[]');
        console.log('Existing students:', existingStudents);
        
        // Add new student
        const newStudent = {
            ...studentData,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        existingStudents.push(newStudent);
        localStorage.setItem(studentsKey, JSON.stringify(existingStudents));
        console.log('Student saved successfully');
        return true;
    } catch (error) {
        console.error('Error in saveStudentProfile:', error);
        return false;
    }
}

// Test getAllStudents function
function testGetAllStudents() {
    try {
        console.log('Testing getAllStudents...');
        const currentUser = testGetCurrentUser();
        if (!currentUser) {
            console.log('No current user, returning empty array');
            return [];
        }
        
        const studentsKey = testGetUserDataKey('students');
        const students = JSON.parse(localStorage.getItem(studentsKey) || '[]');
        console.log('Retrieved students:', students);
        return students;
    } catch (error) {
        console.error('Error in getAllStudents:', error);
        return [];
    }
}

// Test functions
console.log('=== DataManager Test Started ===');

// Test 1: Check current user
console.log('\n--- Test 1: Check Current User ---');
testGetCurrentUser();

// Test 2: Test key generation
console.log('\n--- Test 2: Test Key Generation ---');
testGetUserDataKey('testKey');

// Test 3: Try to save a student (will fail if not logged in)
console.log('\n--- Test 3: Try to Save Student ---');
const testStudent = {
    studentName: 'Test Student',
    class: '10',
    schoolName: 'Test School'
};
testSaveStudentProfile(testStudent);

// Test 4: Try to get all students
console.log('\n--- Test 4: Try to Get All Students ---');
testGetAllStudents();

console.log('\n=== DataManager Test Completed ===');