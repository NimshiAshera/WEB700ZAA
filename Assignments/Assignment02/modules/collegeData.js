// collegeData.js
const fs = require('fs');

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

// Export the functions
module.exports = {
    initialize,
    getAllStudents,
    getTAs,
    getCourses
};
