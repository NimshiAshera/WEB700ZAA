// collegeData.js
const fs = require('fs');
const { resolve } = require('path');

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
            if (err) {
                reject("unable to read students.json");
                return;
            }
            let studentData = JSON.parse(studentDataFromFile);

            fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
                if (err) {
                    reject("unable to read courses.json");
                    return;
                }
                let courseData = JSON.parse(courseDataFromFile);
                
                dataCollection = new Data(studentData, courseData);
                resolve();
            });
        });
    });
}

function getAllStudents() {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length > 0) {
            resolve(dataCollection.students);
        } else {
            reject("no results returned");
        }
    });
}


function getCourses() {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        } else {
            reject("no results returned");
        }
    });
}


function getStudentsByCourse(course){
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
}


function getStudentByNum(studentNum){
    return new Promise((resolve, reject) => {
        let student = dataCollection.students.find(student => student.studentNum === studentNum);
        if (student){
            resolve(student);            
        } else{
            reject("no results returned");
        }
    });
}


function getCourseById(id) {
    return new Promise((resolve, reject) => {
        let course = dataCollection.courses.find(course => course.courseId === parseInt(id));
        if (course) {
            resolve(course);
        } else {
            reject("Query returned 0 results");
        }
    });
}

/*
function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        // Set TA to false if undefined
        studentData.TA = studentData.TA ? true : false;
        
        // Set studentNum to the current length + 1
        studentData.studentNum = dataCollection.students.length + 1;
        
        // Add the new student to the students array
        dataCollection.students.push(studentData);
        
        resolve();
    });
}
*/

function updateStudent(studentData) {
    return new Promise((resolve, reject) => {
        const index = dataCollection.students.findIndex(student => student.studentNum == parseInt(studentData.studentNum));
        if (index >= 0) {
            dataCollection.students[index] = { 
                ...dataCollection.students[index], 
                ...studentData, 
                TA: studentData.TA === "true",
                course: parseInt(studentData.course) 
            };
            resolve();
        } else {
            reject("Student not found");
        }
    });
}



// Export the functions
module.exports = {
    initialize,
    getAllStudents,
    getCourses,
    getStudentsByCourse,
    getStudentByNum,
    getCourseById,
    //addStudent
    updateStudent
};
