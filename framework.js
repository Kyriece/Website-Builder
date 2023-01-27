//====================================================//
// CODING HABITS DEVSTUDIO
// Framework Branch
// (C) Copyright Kyriece Dam and Nicholas Smith 2023
//====================================================//

//Get the jshashes module - this is used for our encryption methods:
var jshashes = require("jshashes");

//Get the encryption methods from jshashes:
var sha512 = new jshashes.SHA512;

//Keep the original console.log script:
var originalLog = console.log;

//Server start times
var server_start_time = new Date();
var server_id = sha512.hex(server_start_time).toString().toUpperCase().slice(0, 5);
var server_log_file = server_start_time.getTime().toString().slice(0, 5) + server_id + ".log";

//Initiate a new mongodb client:
var MongoClient = require("mongodb").MongoClient;

//Database configuration
var creds = {
    "db_username": "coding_habits",
    "db_pass": "FoOX6evyGJjnTFc2"
}

//MongoDB connection URI
var uri = "mongodb+srv://"+creds.db_username+":"+creds.db_pass+"@cluster0.betjm6w.mongodb.net/?retryWrites=true&w=majority"

//Get the caller-callsite module for logging purposes:
var caller = require('caller');

module.exports = {

    db: "",

    initiateLogging: function(writeFile){

        /*
         * module.exports.initiateLogging()
         * :params: writeFile => boolean
         * :description: This function will replace the default console.log so that
         * we are able to track the location and time of when a log is printed to the 
         * console. The paramater writeFile is used to indicate whether each log should
         * be written to a log file on the system. 
        */

        if (writeFile){

            //This function will allow all console.log messages to be logged to the console
            process.stdout.write("\n");

            //Make the new file:
            fs.writeFileSync("log_files/"+ server_log_file, "");

            //Create a new write stream:
            module.exports.writer = fs.createWriteStream("log_files/"+ server_log_file);

        } else {
            console.log("Writing to log files is DISABLED")
        }

        console.log = function(data){

            //Use a stacktrace to get the originating line number of the caller of this function
            let e = new Error();
            let frame = e.stack.split("\n")[2];
            let lineNumber = frame.split(":")[1];

            //The line number should be four digits
            //Increase the zeros on the linenumber if they are below the ranges below:
            if (lineNumber < 10){
                lineNumber = "000" + lineNumber;
            } else if (lineNumber < 100){
                lineNumber = "00" + lineNumber;
            } else if (lineNumber < 1000){
                lineNumber = "0" + lineNumber;
            }

            //Get the name of the section who called this function:
            var full_filename = caller().split("/");
            var filename_extracted = full_filename[full_filename.length-1];

            //Replace the name of the section with a five letter word so it looks better when printed:
            var filename_replacements = {
                "server.js": "\x1b[32mmain\x1b[0m",
                "framework.js": "\x1b[36mfrwk\x1b[0m",
                "tests.js": "\x1b[36mTEST\x1b[0m"
            }
            
            //The final filename:
            var filename = filename_extracted.replace(filename_extracted, filename_replacements[filename_extracted])

            //Get the data item:
            var date = new Date();
            var date_formatted = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
            var time_formatted = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

            var date_time = date_formatted + ";" + time_formatted;
            var date_string = date_time+ " " + filename + ":" + lineNumber + " " + data;

            if (writeFile){
                module.exports.writer.write(date_string + "\n");
            }

            originalLog(date_string);

        }

        console.err = (data)=>{ console.log(data) };

        console.log("Logging service activated: logs can be found in " + server_log_file)
        process.stdout.write("\n")

    },

    initialiseMongo: function(){

        /*
         * module.exports.initialiseMongo()
         * :description: This function will initialise a MongoDB connection. All requests will 
         * pass through here to make the app run faster. This is an update from when individual 
         * connections were used in the app to one pooled connection, which happens here.
        */ 

        //A promise is returned at first because it takes time to connect to the server.
        return new Promise((resolve)=>{

            console.log("Initialising MongoDB connection & environment");

            MongoClient.connect(uri, { 
                useUnifiedTopology: true,
                loggerLevel: "info"
            }, function(err, client){

                if (err){
                    
                    console.error("Critical error! Failed to connect to MongoDB: " + err);
                    resolve(false);
                    return false;

                } else {
                    
                    console.log("MongoDB connection successful, accessible via framework.db.collection(String).[ACTION]");

                    module.exports.db = client.db("broker");
                    db = client.db("broker");

                    resolve(true);

                }

            });

        });

    },

}