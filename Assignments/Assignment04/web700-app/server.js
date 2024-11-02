/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: W.M.N.A.Fernando   Student ID: !70739239 Date: 2/11/2024
*
*  Online (Vercel) Link: ________________________________________________________
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
var collegeData = require("./modules/collegeData");
var app = express();

app.use(express.static("public/"));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));


/*
// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});
*/

// Route to return all students or students by course
app.get("/students", (req, res) => {
    if (req.query.course) {
        // Handle optional course parameter
        collegeData.getStudentsByCourse(req.query.course)
            .then(students => res.json(students))
            .catch(err => res.json({ message: "no results" }));
    } else {
        // Return all students
        collegeData.getAllStudents()
            .then(students => res.json(students))
            .catch(err => res.json({ message: "no results" }));
    }
});

// Route to return all TAs
app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then(tas => res.json(tas))
        .catch(err => res.json({ message: "no results" }));
});

// Route to return all courses
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then(courses => res.json(courses))
        .catch(err => res.json({ message: "no results" }));
});

// Route to return a specific student by student number
app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then(student => res.json(student))
        .catch(err => res.json({ message: "no results" }));
});

// Route to serve the home.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

// Route to serve the about.html file
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

// Route to serve the htmlDemo.html file
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});

app.get('/students/add', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addStudent.html"))
});

app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body)
    .then(() => res.redirect('/students'))
    .catch(err => res.status(500).send("Error adding student: " + err));
});

// Route for handling undefined routes (404 page not found)
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log("server listening on port: " + HTTP_PORT);
        });
    })
    .catch(err => {
        console.log("Failed to initialize data: " + err);
    });
    

