/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: W.M.N.A.Fernando   Student ID: !70739239 Date: 26/11/2024
*
*  Online (Vercel) Link: https://vercel.com/nimshiasheras-projects/web700-app/9EhtXP1r1Dj3o9W9nUCvmrDFXPyk
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
var collegeData = require("./modules/collegeData");
var ejs = require("ejs");
var ejs1 = require("express-ejs-layouts");

var app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(ejs1);

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.engine("ejs",ejs.__express);
app.set("view engine","ejs");
app.set("layout","layouts/main");

app.use((req, res, next) => {
    
    let route = req.path.substring(1);
    res.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    //next();

    
    res.locals.navLink = function (url, options) {
        return '<li' + 
            ((url === res.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
    };

    res.locals.equal = function (lvalue, rvalue, options) {
        if (lvalue !== rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    };

    next();
});


// Route to home.ejs file
app.get("/", (req, res) => {
    res.render("home");
});

// Route to serve the about.ejs file
app.get("/about", (req, res) => {
    res.render("about");
});

// Route to serve the htmlDemo.html file
app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
});

// Route to serve the addStudent.html file
app.get("/students/add", (req, res) => {
    res.render("addStudent");
});


// Route to return all students or students by course
app.get("/students", (req, res) => {
    const courseCode = req.query.course;
    if (courseCode) {
        collegeData.getStudentsByCourse(courseCode)
        .then(students => {
            if (students.length > 0) {
                res.render("students", { students});
            } else {
                res.render("students", { message: "No students available." });
            }
        })
        .catch(err => {
            console.error(err);
            res.render("students", { message: "No results" });
        });
} else {
    // Return all students
    collegeData.getAllStudents()
        .then(students => {
            if (students.length > 0) {
                res.render("students", { students });
            } else {
                res.render("students", { message: "No students available." });
            }
        })
        .catch(err => {
            console.error(err);
            res.render("students", { message: "No results" });
        });
}
});


// Route to return all courses
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then(courses => {
            if (courses.length > 0) {
                res.render("courses", { courses: courses });
            } else {
                res.render("courses", { message: "No courses available." });
            }
        })
        .catch(err => {
            console.error(err);
            res.render("courses", { message: "No results" });
        });
});


// Route to return a specific student by student number
app.get("/student/:studentNum", (req, res) => {
    collegeData.getStudentByNum(parseInt(req.params.studentNum))
        .then(student => {
            res.render("student", { student});
        })
        .catch(err => {
            res.render("student", { student: { studentNum: "N/A", firstName: "Not Found", lastName: "" } });
        });
});


app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
        .then(() => {
            res.redirect("/students"); 
        })
        .catch(err => {
            res.status(500).send("Unable to update student: " + err);
        });
});


app.get("/course/:id", (req, res) => {
    collegeData.getCourseById(req.params.id)
        .then(course => {
            res.render("course", { course: course });
        })
        .catch(err => {
            console.error(err);
            res.render("course", { course: { courseCode: "N/A", courseDescription: "No course found" } });
        });
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
    

