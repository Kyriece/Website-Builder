//====================================================//
// CODING HABITS DEVSTUDIO
// Server Branch
// (C) Copyright Kyriece Dam and Nicholas Smith 2023
//====================================================//

//WEBSERVER SETTINGS --
var port = process.env.PORT || 27015;

//The Express is the webserver framework used here. It runs as the backbone of our webserver.
//View https://www.npmjs.com/package/express for more information.
var express = require("express");

//Start Express under the variable name "app".
var app = express();

//Get our custom-made framework:
var framework = require("./framework.js");

//Create a new HTTP server and use express
var http = require("http").Server(app);

//Create a socket.io server and bind it to the http server
var io = require("socket.io")(http);

//Initiate the logging service:
framework.initiateLogging();

//Now initialise the MongoDB server then the HTTP server:
framework.initialiseMongo().then((result)=>{

  if (result){
    console.log("Starting HTTP webserver");
  } else {
    console.log("Failed to startup MongoDB server");
    process.exit();
  }

  //Start the HTTP server:
  http.listen(port, ()=>{
    console.log("HTTP Webserver running on port " +  port);
  });

});

//Serve /public/ to whoever connects
app.use(express.static(__dirname + "/public/"));

//When the user connects to the root of the served folder, redirect them immediately to the projects folder.
app.get("/", function(request, response){
	response.status(301).redirect("/projects");
});