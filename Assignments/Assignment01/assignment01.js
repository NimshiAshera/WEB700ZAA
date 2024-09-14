/*********************************************************************************
*  WEB700 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: __W.M.Nimshi A. Fernando____ Student ID: _170739239__ Date: _14/09/2024__
*
********************************************************************************/ 

// to generate a random interger value
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }


let serverVerbs = ["GET", "GET", "GET", "POST", "GET", "POST"]
let serverPaths = ["/", "/about", "/contact", "/login", "/panel","/logout"]
let serverResponses = ["Welcome to WEB700 Assignment 1", "This assignment was prepared by Nimshi Fernando", "Nimshi Fernando:wmnafernando@myseneca.ca", "User Logged In", "Main Panel", "Logout Complete"]

// define simple web server function
function httpRequest(httpVerb, path){
    for(let i = 0; i < serverPaths.length; i++){
        if(serverVerbs[i] === httpVerb && serverPaths[i] === path){
            return `200: ${serverResponses[i]}`
        }
    }
    return `404: Unable to process ${httpVerb} request for ${path}}`

}
 
/*
// Test cases
console.log(httpRequest("GET", "/"));        
console.log(httpRequest("GET", "/about"));   
console.log(httpRequest("PUT", "/"));   
*/

// to automate the test run
function automateTests(){

    let testVerbs = ["GET", "POST"];
    let testPaths = ["/", "/about", "contact", "/login", "panel", "logout", "/randomPath1", "randomPath2"];

    function randomRequest(){
        let randVerb = testVerbs[getRandomInt(testVerbs.length)];
        let randPath = testPaths[getRandomInt(testPaths.length)];

        console.log(httpRequest(randVerb, randPath))

    }

    // to execute the randomRequest with 1 second interval
    setInterval(randomRequest, 1000);
}

automateTests();