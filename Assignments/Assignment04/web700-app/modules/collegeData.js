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

function getTAs() {
    return new Promise((resolve, reject) => {
        let TAs = dataCollection.students.filter(student => student.TA === true);
        if (TAs.length > 0) {
            resolve(TAs);
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

function getStudnetsByCourse(course){
    return new Promise((resolve, reject) => {
        let studentsOfCourse = dataCollection.students.filter(student => student.course === course);
        
        if (studentsOfCourse.length > 0){
            resolve(studentsOfCourse);
        } else {
            reject("no results returned");
        }
    });
}

function getStudnetByNum(num){
    return new Promise((resolve, reject) => {
        let student = dataCollection.students.find(student => student.studentNum === num);
        if (student){
            resolve(student);            
        } else{
            reject("no results returned");
        }
    });
}

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

// Export the functions
module.exports = {
    initialize,
    getAllStudents,
    getTAs,
    getCourses,
    getStudnetsByCourse,
    getStudnetByNum,
    addStudent
};
